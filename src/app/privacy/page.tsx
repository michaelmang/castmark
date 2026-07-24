import Link from "next/link";

export const metadata = {
  title: "Privacy Policy — Castmark",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto w-full max-w-2xl px-6 py-16">
      <Link
        href="/"
        className="text-muted hover:text-foreground text-xs transition-colors"
      >
        ← Castmark
      </Link>

      <h1 className="text-foreground mt-6 text-2xl font-semibold tracking-tight">
        Privacy Policy
      </h1>
      <p className="text-muted mt-2 text-sm">Last updated July 24, 2026</p>

      <div className="text-muted mt-8 space-y-6 text-sm leading-relaxed">
        <section>
          <p>
            This policy explains what Castmark collects, why, and how it&apos;s
            used. Castmark is built for podcasters managing sponsor links, and
            we collect the minimum needed to make that work.
          </p>
        </section>

        <section>
          <h2 className="text-foreground text-base font-medium">
            1. Account data
          </h2>
          <p className="mt-2">
            When you sign up, we store your show name, email address, and a
            hashed (not plaintext) password. If you subscribe, Stripe
            processes your payment details directly — we never see or store
            your card number.
          </p>
        </section>

        <section>
          <h2 className="text-foreground text-base font-medium">
            2. Click analytics
          </h2>
          <p className="mt-2">
            When someone visits one of your sponsor links, we log the time,
            the referring site (if any), a coarse device type (desktop,
            mobile, or tablet), and a country derived from the request — we
            don&apos;t store the visitor&apos;s IP address or any other
            personally identifying information about them.
          </p>
        </section>

        <section>
          <h2 className="text-foreground text-base font-medium">
            3. How we use data
          </h2>
          <p className="mt-2">
            Account data is used to operate your account and process billing.
            Click data is used to power the analytics and reports shown in
            your dashboard. We don&apos;t sell your data or your listeners&apos;
            click data to third parties.
          </p>
        </section>

        <section>
          <h2 className="text-foreground text-base font-medium">
            4. Who we share data with
          </h2>
          <p className="mt-2">
            We use a small number of service providers to run Castmark:
            Stripe (billing), Vercel (hosting and infrastructure analytics),
            and our database provider (Neon, for storage). Each only
            receives what it needs to do its job.
          </p>
        </section>

        <section>
          <h2 className="text-foreground text-base font-medium">
            5. Data retention
          </h2>
          <p className="mt-2">
            We keep your account and click data for as long as your account
            is active. If you cancel and ask us to delete your account, we&apos;ll
            remove your account data and associated click history, except
            where we&apos;re required to retain billing records by law.
          </p>
        </section>

        <section>
          <h2 className="text-foreground text-base font-medium">
            6. Your rights
          </h2>
          <p className="mt-2">
            You can access, correct, or delete your account data at any time
            by contacting us. If you&apos;re in a region with additional
            statutory privacy rights (such as the EU or California), we&apos;ll
            honor requests consistent with those laws.
          </p>
        </section>

        <section>
          <h2 className="text-foreground text-base font-medium">
            7. Changes
          </h2>
          <p className="mt-2">
            We may update this policy as Castmark evolves. Material changes
            will be reflected by updating the date at the top of this page.
          </p>
        </section>

        <section>
          <h2 className="text-foreground text-base font-medium">
            8. Contact
          </h2>
          <p className="mt-2">
            Questions about this policy or a data request? Email{" "}
            <a
              href="mailto:support@castmark.app"
              className="text-foreground underline underline-offset-2"
            >
              support@castmark.app
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
