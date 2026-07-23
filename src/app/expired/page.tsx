export default async function ExpiredPage({
  searchParams,
}: {
  searchParams: Promise<{ sponsor?: string; code?: string }>;
}) {
  const { sponsor, code } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-sm text-center">
        {sponsor && (
          <p className="text-muted text-sm font-medium tracking-wide uppercase">
            {sponsor}
          </p>
        )}
        <h1 className="text-foreground mt-3 text-2xl font-semibold tracking-tight">
          {sponsor ? "This offer has ended" : "This link isn't valid"}
        </h1>
        {code && (
          <div className="border-border bg-surface text-muted mt-6 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm">
            Last known code
            <span className="text-foreground font-mono">{code}</span>
          </div>
        )}
      </div>
    </div>
  );
}
