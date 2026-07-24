import Link from "next/link";

export const metadata = {
  title: "Terms of Service — Castmark",
};

export default function TermsPage() {
  return (
    <div className="mx-auto w-full max-w-2xl px-6 py-16">
      <Link
        href="/"
        className="text-muted hover:text-foreground text-xs transition-colors"
      >
        ← Castmark
      </Link>

      <h1 className="text-foreground mt-6 text-2xl font-semibold tracking-tight">
        Terms of Service
      </h1>
      <p className="text-muted mt-2 text-sm">Last updated July 24, 2026</p>

      <div className="text-muted mt-8 space-y-6 text-sm leading-relaxed">
        <section>
          <h2 className="text-foreground text-base font-medium">
            1. Agreement
          </h2>
          <p className="mt-2">
            These Terms govern your use of Castmark (&quot;the
            Service&quot;), operated by Castmark. By creating an account, you
            agree to these Terms. If you don&apos;t agree, don&apos;t use the
            Service.
          </p>
        </section>

        <section>
          <h2 className="text-foreground text-base font-medium">
            2. What Castmark does
          </h2>
          <p className="mt-2">
            Castmark lets podcasters create durable redirect links for
            sponsors, edit the destination at any time, and view click
            analytics for those links.
          </p>
        </section>

        <section>
          <h2 className="text-foreground text-base font-medium">
            3. Accounts
          </h2>
          <p className="mt-2">
            You&apos;re responsible for your account credentials and for all
            activity under your account. You must provide accurate
            information at signup and keep it current.
          </p>
        </section>

        <section>
          <h2 className="text-foreground text-base font-medium">
            4. Subscriptions and billing
          </h2>
          <p className="mt-2">
            Castmark is a paid subscription service billed monthly through
            Stripe, our payment processor. New accounts get a 14-day free
            trial; unless you cancel before the trial ends, your card will be
            charged at the then-current price. You can cancel anytime from
            the billing page, effective at the end of the current billing
            period. Fees are non-refundable except where required by law.
          </p>
        </section>

        <section>
          <h2 className="text-foreground text-base font-medium">
            5. Acceptable use
          </h2>
          <p className="mt-2">
            You won&apos;t use Castmark to redirect to unlawful, deceptive, or
            malicious content, to impersonate others, or to interfere with
            the Service&apos;s operation. We may suspend or terminate
            accounts that violate this.
          </p>
        </section>

        <section>
          <h2 className="text-foreground text-base font-medium">
            6. Your content
          </h2>
          <p className="mt-2">
            You retain ownership of the links, sponsor names, and episode data
            you add to Castmark. You&apos;re responsible for having the
            rights to redirect to the destinations you configure.
          </p>
        </section>

        <section>
          <h2 className="text-foreground text-base font-medium">
            7. Service availability
          </h2>
          <p className="mt-2">
            We aim for high availability but don&apos;t guarantee
            uninterrupted service. The Service is provided &quot;as is&quot;
            without warranties of any kind.
          </p>
        </section>

        <section>
          <h2 className="text-foreground text-base font-medium">
            8. Limitation of liability
          </h2>
          <p className="mt-2">
            To the fullest extent permitted by law, Castmark won&apos;t be
            liable for indirect, incidental, or consequential damages arising
            from your use of the Service.
          </p>
        </section>

        <section>
          <h2 className="text-foreground text-base font-medium">
            9. Termination
          </h2>
          <p className="mt-2">
            You can stop using the Service and cancel your subscription at
            any time. We may suspend or terminate accounts for violations of
            these Terms.
          </p>
        </section>

        <section>
          <h2 className="text-foreground text-base font-medium">
            10. Changes
          </h2>
          <p className="mt-2">
            We may update these Terms from time to time. Continued use of the
            Service after changes take effect means you accept the updated
            Terms.
          </p>
        </section>

        <section>
          <h2 className="text-foreground text-base font-medium">
            11. Contact
          </h2>
          <p className="mt-2">
            Questions about these Terms? Email{" "}
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
