import { AppleProject } from './types.js';
export declare class AppleDownloader {
    private downloadDir;
    constructor();
    /**
     * 确保下载目录存在
     */
    private ensureDownloadDir;
    /**
     * 从Apple开发者网站获取示例项目
     */
    getAppleProjects(): Promise<AppleProject[]>;
    /**
     * 获取Apple项目的下载链接
     */
    getAppleProjectDownloadUrl(project: AppleProject): Promise<string | null>;
    /**
     * 下载Apple项目
     */
    downloadAppleProject(project: AppleProject): Promise<boolean>;
    /**
     * 下载Apple项目ZIP文件（不解压）
     */
    private downloadAppleProjectZip;
    /**
     * 下载所有Apple项目
     */
    downloadAllAppleProjects(): Promise<{
        success: number;
        total: number;
    }>;
    /**
     * 从URL获取文件名
     */
    private getFilenameFromUrl;
    /**
     * 清理文件名，移除非法字符
     */
    private sanitizeFilename;
    /**
     * 获取下载目录
     */
    getDownloadDir(): string;
}
//# sourceMappingURL=appleDownloader.d.ts.map