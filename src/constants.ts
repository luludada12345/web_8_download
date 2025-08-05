import * as path from 'path';

// 下载目录配置
export const DOWNLOAD_CONFIG = {
  BASE_DIR: '/Users/luludada/Desktop/my_code',
  ANDROID_DIR: 'app_android_0_official',
  APPLE_DIR: 'app_ios_0_official',
  MAX_PROJECTS_PER_TYPE: 50, // 增加到50个项目
  REQUEST_DELAY: {
    ANDROID: 800, // 减少到0.8秒
    APPLE: 1500   // 减少到1.5秒
  }
};

// Apple网站URL配置
export const APPLE_URLS = [
  'https://developer.apple.com/documentation/foundation',
  'https://developer.apple.com/documentation/uikit',
  'https://developer.apple.com/documentation/swiftui',
  'https://developer.apple.com/documentation/coreml',
  'https://developer.apple.com/documentation/vision',
  'https://developer.apple.com/documentation/arkit',
  'https://developer.apple.com/documentation/metal',
  'https://developer.apple.com/documentation/avfoundation',
  'https://developer.apple.com/documentation/mapkit',
  'https://developer.apple.com/documentation/coredata'
];

// Android网站URL配置
export const ANDROID_URLS = {
  KOTLIN_SAMPLES: 'https://developer.android.com/samples?language=kotlin'
};

// 已知的Android官方示例项目GitHub仓库 - 只包含目标文件夹中没有的2025年新项目
export const KNOWN_ANDROID_REPOS = [
  // 2025年活跃更新的新项目（目标文件夹中没有的）
  {
    name: 'platform-samples',
    githubUrl: 'https://github.com/android/platform-samples',
    description: 'A collection of Android platform samples for Android development'
  },
  {
    name: 'ai-samples',
    githubUrl: 'https://github.com/android/ai-samples',
    description: 'AI and machine learning samples for Android'
  },
  {
    name: 'location-samples',
    githubUrl: 'https://github.com/android/location-samples',
    description: 'Location and maps samples for Android'
  },
  {
    name: 'input-samples',
    githubUrl: 'https://github.com/android/input-samples',
    description: 'Input method and text handling samples for Android'
  },
  {
    name: 'security-samples',
    githubUrl: 'https://github.com/android/security-samples',
    description: 'Security best practices samples for Android'
  },
  {
    name: 'identity-samples',
    githubUrl: 'https://github.com/android/identity-samples',
    description: 'Identity and authentication samples for Android'
  },
  {
    name: 'large-screen-samples',
    githubUrl: 'https://github.com/android/large-screen-samples',
    description: 'Large screen and foldable device samples for Android'
  },
  {
    name: 'tv-samples',
    githubUrl: 'https://github.com/android/tv-samples',
    description: 'Android TV and Google TV samples'
  },
  {
    name: 'car-samples',
    githubUrl: 'https://github.com/android/car-samples',
    description: 'Android Auto and automotive samples'
  },
  {
    name: 'play-billing-samples',
    githubUrl: 'https://github.com/android/play-billing-samples',
    description: 'Samples for Google Play Billing'
  }
];

// 已知的Apple示例项目GitHub仓库 - 只包含目标文件夹中没有的2025年新项目
export const KNOWN_APPLE_REPOS = [
  // 2025年活跃更新的新项目（目标文件夹中没有的）
  {
    name: 'Swift-OpenAPI-Generator',
    detailUrl: 'https://github.com/apple/swift-openapi-generator',
    downloadUrl: 'https://github.com/apple/swift-openapi-generator/archive/refs/heads/main.zip'
  },
  {
    name: 'Swift-Testing',
    detailUrl: 'https://github.com/apple/swift-testing',
    downloadUrl: 'https://github.com/apple/swift-testing/archive/refs/heads/main.zip'
  },
  {
    name: 'Swift-Foundation',
    detailUrl: 'https://github.com/apple/swift-foundation',
    downloadUrl: 'https://github.com/apple/swift-foundation/archive/refs/heads/main.zip'
  },
  {
    name: 'Swift-Crypto',
    detailUrl: 'https://github.com/apple/swift-crypto',
    downloadUrl: 'https://github.com/apple/swift-crypto/archive/refs/heads/main.zip'
  },
  {
    name: 'Swift-Numerics',
    detailUrl: 'https://github.com/apple/swift-numerics',
    downloadUrl: 'https://github.com/apple/swift-numerics/archive/refs/heads/main.zip'
  },
  {
    name: 'Swift-System',
    detailUrl: 'https://github.com/apple/swift-system',
    downloadUrl: 'https://github.com/apple/swift-system/archive/refs/heads/main.zip'
  },
  {
    name: 'Swift-Docker',
    detailUrl: 'https://github.com/apple/swift-docker',
    downloadUrl: 'https://github.com/apple/swift-docker/archive/refs/heads/main.zip'
  },
  {
    name: 'Swift-Certificates',
    detailUrl: 'https://github.com/apple/swift-certificates',
    downloadUrl: 'https://github.com/apple/swift-certificates/archive/refs/heads/main.zip'
  },
  {
    name: 'Swift-HTTP-Types',
    detailUrl: 'https://github.com/apple/swift-http-types',
    downloadUrl: 'https://github.com/apple/swift-http-types/archive/refs/heads/main.zip'
  },
  {
    name: 'Swift-Service-Lifecycle',
    detailUrl: 'https://github.com/apple/swift-service-lifecycle',
    downloadUrl: 'https://github.com/apple/swift-service-lifecycle/archive/refs/heads/main.zip'
  },
  {
    name: 'Swift-Metrics',
    detailUrl: 'https://github.com/apple/swift-metrics',
    downloadUrl: 'https://github.com/apple/swift-metrics/archive/refs/heads/main.zip'
  }
];

// HTTP请求配置
export const HTTP_CONFIG = {
  USER_AGENT: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
  TIMEOUT: 30000
};

// 下载选择器配置
export const DOWNLOAD_SELECTORS = [
  'a[href*="download"]',
  'a[href*=".zip"]',
  'a[href*="sample"]',
  'a[href*="code"]',
  'button[onclick*="download"]',
  '.download-button',
  '.download-link'
];
