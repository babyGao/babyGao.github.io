import type { NextConfig } from "next";

/*
 * 注意：vinext 是静态解析这个文件的，只认字面量。
 * 写成变量或表达式（比如按环境切换 images.unoptimized）会被直接忽略，
 * 不会报错但也不生效。要按环境区分行为，得在 worker/index.ts 里做。
 */
const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
