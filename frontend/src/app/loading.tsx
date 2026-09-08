export default function RootLoading() {
  return (
    <div className="grid min-h-svh place-items-center">
      <div className="flex flex-col items-center gap-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.svg" alt="" width={48} height={48} className="rounded-[22%]" />
        <div className="h-1.5 w-28 overflow-hidden rounded-full bg-[var(--line)]">
          <div className="h-full w-1/2 animate-pulse rounded-full bg-[var(--signal)]" />
        </div>
      </div>
    </div>
  );
}
