import { AndroidProject } from './types.js';
export declare class AndroidDownloader {
    private downloadDir;
    constructor();
    /**
     * 确保下载目录存在
     */
    private ensureDownloadDir;
    /**
     * 从Android开发者网站获取Kotlin示例项目
     */
    getAndroidProjects(): Promise<AndroidProject[]>;
    /**
     * 下载Android GitHub项目
     */
    downloadAndroidProject(project: AndroidProject): Promise<boolean>;
    /**
     * 下载所有Android项目
     */
    downloadAllAndroidProjects(): Promise<{
        success: number;
        total: number;
    }>;
    /**
     * 清理文件名，移除非法字符
     */
    private sanitizeFilename;
    /**
     * 获取下载目录
     */
    getDownloadDir(): string;
}
//# sourceMappingURL=androidDownloader.d.ts.map