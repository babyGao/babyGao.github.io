import type { ReactNode } from "react";

/**
 * 列表页顶部：左边一个大标题，右边一段衬线导语。
 * 版式对应参考站研究页的页头。
 */
export function PageIntro({
  title,
  lead,
  children,
}: {
  title: string;
  lead: string;
  /** 导语下面可以再挂一行链接，比如研究方向 */
  children?: ReactNode;
}) {
  return (
    <div className="page-intro">
      <h1>{title}</h1>
      <div className="page-intro-side">
        <p className="lead">{lead}</p>
        {children}
      </div>
    </div>
  );
}
