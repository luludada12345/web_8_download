import axios from 'axios';
import * as cheerio from 'cheerio';
import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { APPLE_URLS, DOWNLOAD_CONFIG, HTTP_CONFIG, KNOWN_APPLE_REPOS, DOWNLOAD_SELECTORS } from './constants.js';
export class AppleDownloader {
    constructor() {
        this.downloadDir = path.join(DOWNLOAD_CONFIG.BASE_DIR, DOWNLOAD_CONFIG.APPLE_DIR);
        this.ensureDownloadDir();
    }
    /**
     * 确保下载目录存在
     */
    ensureDownloadDir() {
        if (!fs.existsSync(this.downloadDir)) {
            fs.mkdirSync(this.downloadDir, { recursive: true });
        }
    }
    /**
     * 从Apple开发者网站获取示例项目
     */
    async getAppleProjects() {
        try {
            console.log('正在获取Apple示例项目...');
            const projects = [];
            // 尝试从多个Apple示例代码页面获取项目
            for (const url of APPLE_URLS) {
                try {
                    const response = await axios.get(url, {
                        headers: {
                            'User-Agent': HTTP_CONFIG.USER_AGENT
                        },
                        timeout: HTTP_CONFIG.TIMEOUT
                    });
                    const $ = cheerio.load(response.data);
                    // 查找GitHub链接
                    $('a[href*="github.com"]').each((index, element) => {
                        const $element = $(element);
                        const githubUrl = $element.attr('href');
                        const name = $element.text().trim() || `Apple-Sample-${projects.length + 1}`;
                        if (githubUrl && (githubUrl.includes('github.com/apple') || githubUrl.includes('github.com/Apple'))) {
                            projects.push({
                                name: this.sanitizeFilename(name),
                                detailUrl: githubUrl,
                                downloadUrl: githubUrl
                            });
                        }
                    });
                    // 查找下载链接
                    $('a[href*="download"], a[href*=".zip"]').each((index, element) => {
                        const $element = $(element);
                        const downloadUrl = $element.attr('href');
                        const name = $element.text().trim() || $element.closest('div').find('h3, h2, h1').first().text().trim() || `Apple-Sample-${projects.length + 1}`;
                        if (downloadUrl && downloadUrl.includes('.zip')) {
                            const fullUrl = downloadUrl.startsWith('http') ? downloadUrl : `https://developer.apple.com${downloadUrl}`;
                            projects.push({
                                name: this.sanitizeFilename(name),
                                detailUrl: url,
                                downloadUrl: fullUrl
                            });
                        }
                    });
                }
                catch (error) {
                    console.log(`无法访问 ${url}:`, error);
                }
            }
            // 添加已知的Apple示例项目GitHub仓库
            projects.push(...KNOWN_APPLE_REPOS);
            console.log(`找到 ${projects.length} 个Apple项目`);
            return projects;
        }
        catch (error) {
            console.error('获取Apple项目失败:', error);
            return [];
        }
    }
    /**
     * 获取Apple项目的下载链接
     */
    async getAppleProjectDownloadUrl(project) {
        try {
            const response = await axios.get(project.detailUrl, {
                headers: {
                    'User-Agent': HTTP_CONFIG.USER_AGENT
                },
                timeout: HTTP_CONFIG.TIMEOUT
            });
            const $ = cheerio.load(response.data);
            // 查找下载按钮或链接
            for (const selector of DOWNLOAD_SELECTORS) {
                const downloadElement = $(selector).first();
                if (downloadElement.length > 0) {
                    const downloadUrl = downloadElement.attr('href') || downloadElement.attr('onclick');
                    if (downloadUrl) {
                        if (downloadUrl.startsWith('http')) {
                            return downloadUrl;
                        }
                        else if (downloadUrl.startsWith('/')) {
                            return `https://developer.apple.com${downloadUrl}`;
                        }
                    }
                }
            }
            return null;
        }
        catch (error) {
            console.error(`获取Apple项目 ${project.name} 下载链接失败:`, error);
            return null;
        }
    }
    /**
     * 下载Apple项目
     */
    async downloadAppleProject(project) {
        try {
            console.log(`正在下载Apple项目: ${project.name}`);
            const projectDir = path.join(this.downloadDir, project.name);
            // 如果目录已存在，跳过下载
            if (fs.existsSync(projectDir)) {
                console.log(`⚠️  Apple项目 ${project.name} 已存在，跳过下载`);
                return true;
            }
            // 如果是GitHub仓库，使用git clone
            if (project.detailUrl.includes('github.com')) {
                try {
                    const gitCommand = `git clone ${project.detailUrl} "${projectDir}"`;
                    execSync(gitCommand, { stdio: 'inherit' });
                    // 创建项目信息文件
                    const infoFile = path.join(projectDir, 'PROJECT_INFO.md');
                    const infoContent = `# ${project.name}\n\n**GitHub URL:** ${project.detailUrl}\n\n**下载时间:** ${new Date().toISOString()}\n`;
                    fs.writeFileSync(infoFile, infoContent);
                    console.log(`✅ Apple项目 ${project.name} 下载完成`);
                    return true;
                }
                catch (error) {
                    console.error(`❌ Git clone失败，尝试下载ZIP文件:`, error);
                    // 如果git clone失败，尝试下载ZIP文件
                    const zipUrl = project.downloadUrl || `${project.detailUrl}/archive/refs/heads/main.zip`;
                    return await this.downloadAppleProjectZip(project, zipUrl);
                }
            }
            // 如果有直接的下载链接
            if (project.downloadUrl) {
                return await this.downloadAppleProjectZip(project, project.downloadUrl);
            }
            // 获取下载链接
            const downloadUrl = await this.getAppleProjectDownloadUrl(project);
            if (!downloadUrl) {
                console.log(`⚠️  无法找到Apple项目 ${project.name} 的下载链接`);
                return false;
            }
            return await this.downloadAppleProjectZip(project, downloadUrl);
        }
        catch (error) {
            console.error(`❌ Apple项目 ${project.name} 下载失败:`, error);
            return false;
        }
    }
    /**
     * 下载Apple项目ZIP文件（不解压）
     */
    async downloadAppleProjectZip(project, downloadUrl) {
        try {
            const projectDir = path.join(this.downloadDir, project.name);
            if (!fs.existsSync(projectDir)) {
                fs.mkdirSync(projectDir, { recursive: true });
            }
            console.log(`📥 正在下载ZIP文件: ${downloadUrl}`);
            // 下载文件
            const response = await axios.get(downloadUrl, {
                responseType: 'stream',
                headers: {
                    'User-Agent': HTTP_CONFIG.USER_AGENT
                },
                timeout: HTTP_CONFIG.TIMEOUT
            });
            const filename = this.getFilenameFromUrl(downloadUrl) || `${project.name}.zip`;
            const filePath = path.join(projectDir, filename);
            const writer = fs.createWriteStream(filePath);
            response.data.pipe(writer);
            return new Promise((resolve) => {
                writer.on('finish', () => {
                    // 创建项目信息文件
                    const infoFile = path.join(projectDir, 'PROJECT_INFO.md');
                    const infoContent = `# ${project.name}\n\n**详情页面:** ${project.detailUrl}\n\n**下载链接:** ${downloadUrl}\n\n**文件:** ${filename}\n\n**下载时间:** ${new Date().toISOString()}\n\n**说明:** 此文件已下载为ZIP格式，未解压。`;
                    fs.writeFileSync(infoFile, infoContent);
                    console.log(`✅ Apple项目 ${project.name} ZIP文件下载完成`);
                    resolve(true);
                });
                writer.on('error', (error) => {
                    console.error(`❌ Apple项目 ${project.name} ZIP下载失败:`, error);
                    resolve(false);
                });
            });
        }
        catch (error) {
            console.error(`❌ 下载ZIP文件失败:`, error);
            return false;
        }
    }
    /**
     * 下载所有Apple项目
     */
    async downloadAllAppleProjects() {
        console.log('🍎 开始下载Apple项目...');
        const appleProjects = await this.getAppleProjects();
        const projectsToDownload = appleProjects.slice(0, DOWNLOAD_CONFIG.MAX_PROJECTS_PER_TYPE);
        let appleSuccess = 0;
        for (const project of projectsToDownload) {
            const success = await this.downloadAppleProject(project);
            if (success)
                appleSuccess++;
            // 添加延迟避免请求过快
            await new Promise(resolve => setTimeout(resolve, DOWNLOAD_CONFIG.REQUEST_DELAY.APPLE));
        }
        console.log(`🍎 Apple项目下载完成: ${appleSuccess}/${projectsToDownload.length}`);
        return { success: appleSuccess, total: projectsToDownload.length };
    }
    /**
     * 从URL获取文件名
     */
    getFilenameFromUrl(url) {
        try {
            const urlObj = new URL(url);
            const pathname = urlObj.pathname;
            const filename = pathname.split('/').pop();
            return filename || null;
        }
        catch {
            return null;
        }
    }
    /**
     * 清理文件名，移除非法字符
     */
    sanitizeFilename(filename) {
        return filename.replace(/[<>:"/\\|?*]/g, '-').replace(/\s+/g, '-');
    }
    /**
     * 获取下载目录
     */
    getDownloadDir() {
        return this.downloadDir;
    }
}
//# sourceMappingURL=appleDownloader.js.map