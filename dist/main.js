import * as fs from 'fs';
import { AndroidDownloader } from './androidDownloader.js';
import { AppleDownloader } from './appleDownloader.js';
import { DOWNLOAD_CONFIG } from './constants.js';
class ProjectDownloader {
    constructor() {
        // 确保基础下载目录存在
        if (!fs.existsSync(DOWNLOAD_CONFIG.BASE_DIR)) {
            fs.mkdirSync(DOWNLOAD_CONFIG.BASE_DIR, { recursive: true });
        }
        this.androidDownloader = new AndroidDownloader();
        this.appleDownloader = new AppleDownloader();
    }
    /**
     * 主下载函数
     */
    async downloadAllProjects() {
        console.log('🚀 开始下载项目...\n');
        try {
            // 并行下载Android和Apple项目
            const [androidResult, appleResult] = await Promise.all([
                this.androidDownloader.downloadAllAndroidProjects(),
                this.appleDownloader.downloadAllAppleProjects()
            ]);
            // 输出最终结果
            console.log('\n' + '='.repeat(50));
            console.log('✨ 所有下载任务完成！');
            console.log('='.repeat(50));
            console.log(`📱 Android项目: ${androidResult.success}/${androidResult.total} 成功`);
            console.log(`🍎 Apple项目: ${appleResult.success}/${appleResult.total} 成功`);
            console.log(`📁 Android文件保存在: ${this.androidDownloader.getDownloadDir()}`);
            console.log(`📁 Apple文件保存在: ${this.appleDownloader.getDownloadDir()}`);
            console.log('='.repeat(50));
        }
        catch (error) {
            console.error('❌ 下载过程中发生错误:', error);
        }
    }
    /**
     * 仅下载Android项目
     */
    async downloadAndroidProjectsOnly() {
        console.log('🚀 开始下载Android项目...\n');
        try {
            const result = await this.androidDownloader.downloadAllAndroidProjects();
            console.log(`\n✨ Android项目下载完成: ${result.success}/${result.total}`);
            console.log(`📁 文件保存在: ${this.androidDownloader.getDownloadDir()}`);
        }
        catch (error) {
            console.error('❌ Android项目下载过程中发生错误:', error);
        }
    }
    /**
     * 仅下载Apple项目
     */
    async downloadAppleProjectsOnly() {
        console.log('🚀 开始下载Apple项目...\n');
        try {
            const result = await this.appleDownloader.downloadAllAppleProjects();
            console.log(`\n✨ Apple项目下载完成: ${result.success}/${result.total}`);
            console.log(`📁 文件保存在: ${this.appleDownloader.getDownloadDir()}`);
        }
        catch (error) {
            console.error('❌ Apple项目下载过程中发生错误:', error);
        }
    }
    /**
     * 显示帮助信息
     */
    showHelp() {
        console.log(`
🚀 项目下载器使用说明
${'='.repeat(40)}

用法:
  node dist/main.js [选项]

选项:
  --android-only    仅下载Android项目
  --apple-only      仅下载Apple项目
  --help           显示此帮助信息
  (无参数)          下载所有项目

示例:
  node dist/main.js                # 下载所有项目
  node dist/main.js --android-only # 仅下载Android项目
  node dist/main.js --apple-only   # 仅下载Apple项目

配置:
  最大项目数: ${DOWNLOAD_CONFIG.MAX_PROJECTS_PER_TYPE} 个/类型
  下载目录: ${DOWNLOAD_CONFIG.BASE_DIR}
  Android目录: ${DOWNLOAD_CONFIG.BASE_DIR}/${DOWNLOAD_CONFIG.ANDROID_DIR}
  Apple目录: ${DOWNLOAD_CONFIG.BASE_DIR}/${DOWNLOAD_CONFIG.APPLE_DIR}
`);
    }
}
// 主函数
async function main() {
    const downloader = new ProjectDownloader();
    // 解析命令行参数
    const args = process.argv.slice(2);
    if (args.includes('--help')) {
        downloader.showHelp();
        return;
    }
    if (args.includes('--android-only')) {
        await downloader.downloadAndroidProjectsOnly();
        return;
    }
    if (args.includes('--apple-only')) {
        await downloader.downloadAppleProjectsOnly();
        return;
    }
    // 默认下载所有项目
    await downloader.downloadAllProjects();
}
// 运行程序
main().catch(console.error);
export { ProjectDownloader };
//# sourceMappingURL=main.js.map