import type { NextConfig } from "next";

/*
 * 注意：vinext 是静态解析这个文件的，只认字面量，而且认得的键很有限。
 * 实测连 images.unoptimized: true 这种纯字面量都不生效——写了不报错，
 * 但产物里的 <img> 仍然指向 /_vinext/image 优化端点。
 *
 * 所以静态导出时的图片地址改写放在 build/export-static.mjs 里做，
 * 按环境区分行为一律不要指望这个文件。
 */
const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
