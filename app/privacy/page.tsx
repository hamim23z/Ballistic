import type { Metadata } from 'next';
import Link from 'next/link';
import LegalPage, { Bullets, ContactLink, type LegalSection } from '@/components/LegalPage';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'What Ballistic collects, why, and the choices you have.',
  alternates: { canonical: '/privacy' },
};

const LAST_UPDATED = 'October 13, 2026';

const SECTIONS: LegalSection[] = [
  {
    id: 'what-we-collect',
    title: 'What we collect',
    body: (
      <>
        <p>We keep this as small as we can. Depending on how you use Ballistic, we may collect:</p>
        <Bullets
          items={[
            <>
              <strong className="text-slate-200">Account details.</strong> If you sign up with
              email and password, we store your email address, a securely hashed password, and
              the username you choose.
            </>,
            <>
              <strong className="text-slate-200">Sign-in with Discord or Google.</strong> If you
              sign in with a third-party account, we receive basic profile information that
              provider shares with us, such as your account ID, email address, display name and
              avatar. We do not receive your Discord or Google password, and we do not read your
              messages, servers, contacts or files.
            </>,
            <>
              <strong className="text-slate-200">Guest play.</strong> If you play as a guest, the
              name you enter is saved only in your own browser (local storage). It is not sent to
              or stored on our servers.
            </>,
            <>
              <strong className="text-slate-200">Game data.</strong> The rosters, drafts and
              results you create while playing, linked to your account if you have one.
            </>,
            <>
              <strong className="text-slate-200">Email updates.</strong> If you join the
              updates list, your email address so we can tell you about launches and new
              features.
            </>,
            <>
              <strong className="text-slate-200">Basic technical data.</strong> Like most
              websites, our hosting provider automatically processes things like your IP
              address, browser type and request logs to deliver the site, keep it secure and
              prevent abuse (for example, rate limiting).
            </>,
          ]}
        />
        <p>
          We do not collect payment information, and we do not knowingly collect sensitive
          personal information.
        </p>
      </>
    ),
  },
  {
    id: 'how-we-use-it',
    title: 'How we use it',
    body: (
      <>
        <p>We use the information above to:</p>
        <Bullets
          items={[
            'Create and manage your account and keep you signed in.',
            'Show your username and save your rosters and results.',
            'Send account emails, such as confirming your address or resetting your password.',
            'Send product updates, only if you asked for them.',
            'Keep Ballistic secure, prevent abuse, and fix bugs.',
          ]}
        />
        <p>
          We do not sell your personal information, we do not show ads, and we do not use your
          data for advertising or tracking you across other sites.
        </p>
      </>
    ),
  },
  {
    id: 'cookies',
    title: 'Cookies and local storage',
    body: (
      <p>
        We use a small number of essential cookies to keep you signed in, and your browser&rsquo;s
        local storage to remember things like your guest name. We do not use advertising or
        third-party tracking cookies. Clearing your browser data removes anything stored locally.
      </p>
    ),
  },
  {
    id: 'sharing',
    title: 'Who we share it with',
    body: (
      <>
        <p>
          We only share information with service providers that help us run Ballistic, and only
          as needed for them to do that job:
        </p>
        <Bullets
          items={[
            <>
              <strong className="text-slate-200">Supabase</strong>, which provides our
              authentication and database.
            </>,
            <>
              <strong className="text-slate-200">Our hosting provider</strong>, which serves the
              website.
            </>,
            <>
              <strong className="text-slate-200">Discord and Google</strong>, only when you
              choose to sign in with them. Their own privacy policies apply to your accounts
              with them.
            </>,
          ]}
        />
        <p>
          We may also disclose information if required by law, or to protect the rights, safety
          and security of Ballistic and its players.
        </p>
      </>
    ),
  },
  {
    id: 'retention',
    title: 'How long we keep it',
    body: (
      <p>
        We keep your account information for as long as your account exists. If you delete your
        account, we delete or anonymize your personal information within a reasonable time,
        except where we need to keep it for legal or security reasons. You can unsubscribe from
        update emails at any time.
      </p>
    ),
  },
  {
    id: 'your-choices',
    title: 'Your choices and rights',
    body: (
      <>
        <p>You can ask us to:</p>
        <Bullets
          items={[
            'Give you a copy of the personal information we hold about you.',
            'Correct information that is wrong.',
            'Delete your account and the personal information linked to it.',
            'Stop sending you update emails.',
          ]}
        />
        <p>
          Email <ContactLink /> and we&rsquo;ll respond as soon as we can. Depending on where you
          live, you may have additional rights under local law, and we&rsquo;ll honor them.
        </p>
      </>
    ),
  },
  {
    id: 'security',
    title: 'Security',
    body: (
      <p>
        We use reasonable safeguards, including encrypted connections (HTTPS) and hashed
        passwords, to protect your information. No system is perfectly secure, so please use a
        strong, unique password.
      </p>
    ),
  },
  {
    id: 'children',
    title: 'Children',
    body: (
      <p>
        Ballistic is not directed at children under 13, and we do not knowingly collect personal
        information from them. If you believe a child under 13 has given us personal
        information, contact us and we&rsquo;ll delete it.
      </p>
    ),
  },
  {
    id: 'changes',
    title: 'Changes to this policy',
    body: (
      <p>
        We may update this policy as Ballistic grows. When we do, we&rsquo;ll change the
        &ldquo;last updated&rdquo; date above, and for significant changes we&rsquo;ll let
        signed-in players know.
      </p>
    ),
  },
  {
    id: 'contact',
    title: 'Contact',
    body: (
      <p>
        Questions about this policy or your data? Email <ContactLink />. See also our{' '}
        <Link href="/terms" className="text-ember-glow underline-offset-4 hover:underline">
          Terms of Service
        </Link>
        .
      </p>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Privacy Policy"
      lastUpdated={LAST_UPDATED}
      intro={
        <p>
          Ballistic is a basketball roster-drafting game made by an independent fan. This policy
          explains what information we collect when you use playballistic.com, how we use it,
          and the choices you have.
        </p>
      }
      sections={SECTIONS}
    />
  );
}
