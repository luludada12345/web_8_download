/**
 * 类型定义文件
 */

export interface AndroidProject {
  name: string;
  githubUrl: string;
  description: string;
}

export interface AppleProject {
  name: string;
  detailUrl: string;
  downloadUrl?: string;
}
