# Cloudflare Worker 随机压缩图片 API 脚本

一个轻量级的 Cloudflare Worker 脚本，实现从 R2 对象存储中随机加载图片，并压缩图片和格式转换（WebP 格式，60% 质量），用在各种宅宅web背景，app背景，等等等等。。。（总之-嘎嘎好用喵--）

## 🚀 快速体验

**在本页面体验效果**: 迅速刷新本页面即可返回随机图片
- **注意**：（如果没有随机加载，请清除你的浏览器缓存---GitHub可能会将首次MarkDown加载的图片缓存）。

### API 调用横版 (PC)
- 调用地址: `https://ani-api.reia.fans/pc`
![](https://ani-api.reia.fans/pc) 

### API 调用竖版 (Mobile)
- 调用地址: `https://ani-api.reia.fans/mobile`
![](https://ani-api.reia.fans/mobile) 

---

## ✨ 项目特性

*   **随机加载**: 每次请求随机返回 R2 存储桶中的一张图片。
*   **双存储桶路由**: 通过 `/pc` 和 `/mobile` 区分横版和竖版存储桶。
*   **实时压缩**: 利用 `cf.image` 将图片实时转换为 WebP 格式，并压缩到 **60% 质量**，显著减小文件大小。
*   **高性能**: 完全在 Cloudflare 边缘网络运行。

## 🛠️ 小白速食方法 - CloudFlare Worker + R2 对象存储

### 步骤 1: 准备 R2 存储桶

您需要在CLoudFlare创建两个 R2 存储桶，并分别上传您的图片：
1.  **横版图片存储桶** (用于 `/pc` 路由)。
2.  **竖版图片存储桶** (用于 `/mobile` 路由)。

### 步骤 2: 部署 Worker 脚本

1.  在 Cloudflare Dashboard 中的侧边栏找到`计算和AI`页面创建一个新的 Worker 应用。
2.  将本仓库中的 `index.js` 代码粘贴（或者下载下来并上传）到 Worker 的代码编辑区并部署。

### 步骤 3: 绑定 R2 存储桶 

1.  进入您的 Worker **设置** (Settings) 页面。
2.  选择顶栏的 **连结** (Variables) -> 并点击右侧的 **新建连结** -> 然后选择 **R2 存储桶绑定** (R2 Bucket Bindings)。
3.  **添加第一个绑定 (横版):**
    *   **设置变量名为 (Variable name)**：`PC_IMAGES_BUCKET`
    *   **R2 存储桶 (R2 Bucket)**：选择您的**横版图片存储桶**。
4.  **添加第二个绑定 (竖版):**
    *   **设置变量名为 (Variable name)**：`MOBILE_IMAGES_BUCKET`
    *   **R2 存储桶 (R2 Bucket)**：选择您的**竖版图片存储桶**。
5.  保存并应用更改。

### 步骤 4: 调用 API
**强烈建议！**：**最好使用自己的域名绑定到worker上使用，不要用默认提供的域名喵**
Worker 部署完成后，通过您绑定的 Worker 域名即可访问。

*   **横版调用**: `https://<your_worker_domain>/pc`
*   **竖版调用**: `https://<your_worker_domain>/mobile`
