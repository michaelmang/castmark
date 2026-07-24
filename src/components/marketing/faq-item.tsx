export function FaqItem({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) {
  return (
    <details className="border-border bg-surface group rounded-2xl border px-5 py-4 open:pb-4">
      <summary className="text-foreground flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-medium marker:content-none">
        {question}
        <span className="border-border text-muted flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-xs transition-transform group-open:rotate-45">
          +
        </span>
      </summary>
      <p className="text-muted mt-3 text-sm text-balance">{answer}</p>
    </details>
  );
}
