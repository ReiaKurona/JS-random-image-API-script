/**
 * Worker API 脚本：随机加载 R2 图片并进行动态优化
 * 
 * 路由:
 * /pc    -> 从 PC_IMAGES_BUCKET 加载
 * /mobile -> 从 MOBILE_IMAGES_BUCKET 加载
 * 
 * 压缩策略：
 * 1. 格式转换为 WebP。
 * 2. 质量设置为 60 (强制压缩)。
 * 3. 不限制图片尺寸。
 */

// 路由映射：将路径映射到 R2 绑定和对应的图片优化参数
const BUCKET_MAP = {
  '/pc': {
    bucketName: 'PC_IMAGES_BUCKET', // 横版图片 R2 绑定名称
    // 优化参数：只设置质量和格式
    optimization: {
      quality: 60,
      format: 'webp',
    }
  },
  '/mobile': {
    bucketName: 'MOBILE_IMAGES_BUCKET', // 竖版图片 R2 绑定名称
    // 优化参数：只设置质量和格式
    optimization: {
      quality: 60,
      format: 'webp',
    }
  }
};

/**
 * 核心处理函数：随机获取文件并应用优化
 * @param {R2Bucket} bucket - R2 存储桶对象
 * @param {object} optimization - Cloudflare Image Transformation 参数
 * @returns {Promise<Response>} 
 */
async function getRandomImage(bucket, optimization) {
  // 1. 获取存储桶中的所有文件列表
  const listed = await bucket.list();
  const keys = listed.objects.map(obj => obj.key);

  if (keys.length === 0) {
    return new Response('Bucket is empty.', { status: 404 });
  }

  // 2. 随机选择一个文件的 Key
  const randomIndex = Math.floor(Math.random() * keys.length);
  const randomKey = keys[randomIndex];

  // 3. 从 R2 获取该对象
  const object = await bucket.get(randomKey);

  if (object === null) {
    return new Response(`File not found: ${randomKey}`, { status: 404 });
  }

  // 4. 应用 Cloudflare 图像优化并返回
  return new Response(object.body, {
    headers: {
      'Content-Type': object.httpMetadata.contentType || 'image/jpeg',
      // 设置缓存 7 天
      'Cache-Control': 'public, max-age=604800, immutable', 
    },
    // 关键优化部分：强制应用质量压缩和格式转换
    cf: {
      image: optimization,
    },
  });
}

// 主事件监听器
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname.toLowerCase();

    const routeConfig = BUCKET_MAP[path];

    if (!routeConfig) {
      return new Response('Not Found. Use /pc or /mobile endpoints.', { status: 404 });
    }

    const bucketBindingName = routeConfig.bucketName;
    const bucket = env[bucketBindingName];

    if (!bucket) {
      return new Response(`R2 Binding missing: ${bucketBindingName}. Check your Worker settings.`, { status: 500 });
    }

    return getRandomImage(bucket, routeConfig.optimization);
  },
};
