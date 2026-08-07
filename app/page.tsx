import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { localePath, pickLocale } from "../lib/i18n";

/**
 * 根路径不直接渲染页面，而是按浏览器语言跳到 /zh 或 /en。
 * 这样两种语言的地址是对称的，分享出去也不会有歧义。
 */
export default async function RootPage() {
  const requestHeaders = await headers();
  const locale = pickLocale(requestHeaders.get("accept-language"));
  redirect(localePath(locale));
}
