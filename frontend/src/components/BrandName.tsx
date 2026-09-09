/** Keeps the product name from being rewritten by Chrome / Google Translate. */
export function BrandName({
  className = "",
  children = "ArtificAgent",
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <span className={`notranslate ${className}`.trim()} translate="no">
      {children}
    </span>
  );
}
