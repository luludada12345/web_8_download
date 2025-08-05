import axios from 'axios';
import * as cheerio from 'cheerio';
import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { AndroidProject } from './types.js';
import { ANDROID_URLS, DOWNLOAD_CONFIG, HTTP_CONFIG, KNOWN_ANDROID_REPOS } from './constants.js';

export class AndroidDownloader {
  private downloadDir: string;

  constructor() {
    this.downloadDir = path.join(DOWNLOAD_CONFIG.BASE_DIR, DOWNLOAD_CONFIG.ANDROID_DIR);
    this.ensureDownloadDir();
  }

  /**
   * 确保下载目录存在
   */
  private ensureDownloadDir(): void {
    if (!fs.existsSync(this.downloadDir)) {
      fs.mkdirSync(this.downloadDir, { recursive: true });
    }
  }

  /**
   * 从Android开发者网站获取Kotlin示例项目
   */
  async getAndroidProjects(): Promise<AndroidProject[]> {
    try {
      console.log('正在获取Android Kotlin示例项目...');
      const projects: AndroidProject[] = [];
      
      // 由于Android开发者网站需要OAuth认证，直接使用已知的官方仓库
      console.log('使用已知的Android官方GitHub仓库...');
      projects.push(...KNOWN_ANDROID_REPOS);

      // 尝试从Android开发者网站获取（如果可访问）
      try {
        const response = await axios.get(ANDROID_URLS.KOTLIN_SAMPLES, {
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
          const name = $element.text().trim() || `Android-Sample-${index + 1}`;
          
          if (githubUrl && githubUrl.includes('github.com/android')) {
            // 获取项目描述
            const description = $element.closest('div').find('p').first().text().trim() || '无描述';
            
            // 避免重复添加
            const exists = projects.some(p => p.githubUrl === githubUrl);
            if (!exists) {
              projects.push({
                name: this.sanitizeFilename(name),
                githubUrl,
                description
              });
            }
          }
        });
      } catch (error) {
        console.log('无法访问Android开发者网站，使用预设的官方仓库列表:', error instanceof Error ? error.message : String(error));
      }

      console.log(`找到 ${projects.length} 个Android项目`);
      return projects;
    } catch (error) {
      console.error('获取Android项目失败:', error);
      return [];
    }
  }

  /**
   * 下载Android GitHub项目
   */
  async downloadAndroidProject(project: AndroidProject): Promise<boolean> {
    try {
      console.log(`正在下载Android项目: ${project.name}`);
      
      const projectDir = path.join(this.downloadDir, project.name);
      
      // 如果目录已存在，跳过下载
      if (fs.existsSync(projectDir)) {
        console.log(`⚠️  Android项目 ${project.name} 已存在，跳过下载`);
        return true;
      }
      
      // 使用git clone下载项目
      const gitCommand = `git clone ${project.githubUrl} "${projectDir}"`;
      execSync(gitCommand, { stdio: 'inherit' });
      
      // 创建项目信息文件
      const infoFile = path.join(projectDir, 'PROJECT_INFO.md');
      const infoContent = `# ${project.name}\n\n**GitHub URL:** ${project.githubUrl}\n\n**描述:** ${project.description}\n\n**下载时间:** ${new Date().toISOString()}\n`;
      fs.writeFileSync(infoFile, infoContent);
      
      console.log(`✅ Android项目 ${project.name} 下载完成`);
      return true;
    } catch (error) {
      console.error(`❌ Android项目 ${project.name} 下载失败:`, error);
      return false;
    }
  }

  /**
   * 下载所有Android项目
   */
  async downloadAllAndroidProjects(): Promise<{ success: number; total: number }> {
    console.log('📱 开始下载Android项目...');
    
    const androidProjects = await this.getAndroidProjects();
    const projectsToDownload = androidProjects.slice(0, DOWNLOAD_CONFIG.MAX_PROJECTS_PER_TYPE);
    let androidSuccess = 0;
    
    for (const project of projectsToDownload) {
      const success = await this.downloadAndroidProject(project);
      if (success) androidSuccess++;
      
      // 添加延迟避免请求过快
      await new Promise(resolve => setTimeout(resolve, DOWNLOAD_CONFIG.REQUEST_DELAY.ANDROID));
    }

    console.log(`📱 Android项目下载完成: ${androidSuccess}/${projectsToDownload.length}`);
    return { success: androidSuccess, total: projectsToDownload.length };
  }

  /**
   * 清理文件名，移除非法字符
   */
  private sanitizeFilename(filename: string): string {
    return filename.replace(/[<>:"/\\|?*]/g, '-').replace(/\s+/g, '-');
  }

  /**
   * 获取下载目录
   */
  getDownloadDir(): string {
    return this.downloadDir;
  }
}
