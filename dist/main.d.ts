declare class ProjectDownloader {
    private androidDownloader;
    private appleDownloader;
    constructor();
    /**
     * 主下载函数
     */
    downloadAllProjects(): Promise<void>;
    /**
     * 仅下载Android项目
     */
    downloadAndroidProjectsOnly(): Promise<void>;
    /**
     * 仅下载Apple项目
     */
    downloadAppleProjectsOnly(): Promise<void>;
    /**
     * 显示帮助信息
     */
    showHelp(): void;
}
export { ProjectDownloader };
//# sourceMappingURL=main.d.ts.map