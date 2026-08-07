/** 按钮和链接末尾那个箭头。参考站几乎每个 CTA 后面都跟着它。 */
export function Arrow({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`arrow ${className}`.trim()}
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M2 8h11M9 4l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
