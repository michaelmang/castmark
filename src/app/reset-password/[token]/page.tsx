import { ResetPasswordForm } from "./reset-password-form";

export default async function ResetPasswordPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <span className="text-foreground text-lg font-semibold tracking-tight">
            Castmark
          </span>
          <p className="text-muted mt-2 text-sm">Choose a new password.</p>
        </div>
        <ResetPasswordForm token={token} />
      </div>
    </div>
  );
}
