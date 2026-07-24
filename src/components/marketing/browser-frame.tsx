export function BrowserFrame({
  url,
  children,
}: {
  url: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-border bg-surface overflow-hidden rounded-2xl border shadow-2xl shadow-black/40">
      <div className="border-border bg-surface-raised flex items-center gap-3 border-b px-4 py-2.5">
        <div className="flex shrink-0 items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
        </div>
        <div className="border-border text-muted-2 mx-auto flex max-w-xs flex-1 items-center justify-center rounded-md border bg-black/30 px-3 py-1 font-mono text-[11px]">
          {url}
        </div>
        <div className="w-[52px] shrink-0" aria-hidden />
      </div>
      <div className="p-4 sm:p-6">{children}</div>
    </div>
  );
}
