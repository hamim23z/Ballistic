import type { Metadata } from 'next';
import Link from 'next/link';
import LegalPage, { Bullets, ContactLink, type LegalSection } from '@/components/LegalPage';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'The rules for using Ballistic.',
  alternates: { canonical: '/terms' },
};

const LAST_UPDATED = 'October 13, 2026';

const linkClass = 'text-ember-glow underline-offset-4 hover:underline';

const SECTIONS: LegalSection[] = [
  {
    id: 'accepting',
    title: 'Accepting these terms',
    body: (
      <p>
        By using Ballistic at playballistic.com (the &ldquo;Service&rdquo;), you agree to these
        Terms of Service. If you don&rsquo;t agree, please don&rsquo;t use the Service.
      </p>
    ),
  },
  {
    id: 'the-service',
    title: 'What Ballistic is',
    body: (
      <p>
        Ballistic is a free, fan-made basketball game where you draft a roster from players
        across eras and simulate how it performs. Simulations, ratings and odds are for
        entertainment only. Ballistic is an independent project and is not affiliated with,
        endorsed by, or sponsored by the NBA, any team, any player, or 82-0.
      </p>
    ),
  },
  {
    id: 'eligibility',
    title: 'Who can use it',
    body: (
      <p>
        You must be at least 13 years old to use Ballistic. If you are under the age of
        majority where you live, you should have a parent or guardian&rsquo;s permission.
      </p>
    ),
  },
  {
    id: 'accounts',
    title: 'Your account',
    body: (
      <>
        <p>
          You can play as a guest or create an account with email and password, or by signing in
          with Discord or Google. If you create an account, you agree to:
        </p>
        <Bullets
          items={[
            'Give accurate information and keep it up to date.',
            'Keep your password and sign-in methods secure.',
            'Take responsibility for activity on your account.',
            'Let us know if you think your account has been accessed without permission.',
          ]}
        />
        <p>
          When you sign in with Discord or Google, your use of those services is also governed by
          their own terms.
        </p>
      </>
    ),
  },
  {
    id: 'usernames',
    title: 'Usernames and conduct',
    body: (
      <>
        <p>Ballistic is meant to be fun for everyone. Please don&rsquo;t:</p>
        <Bullets
          items={[
            'Choose a username that is offensive, hateful, harassing, or impersonates someone else.',
            'Break the law or infringe anyone else’s rights while using Ballistic.',
            'Try to hack, overload, scrape, or disrupt the Service, or get around its security or rate limits.',
            'Use bots or automation to cheat, or abuse bugs instead of reporting them.',
            'Resell or commercially exploit the Service without our permission.',
          ]}
        />
        <p>We may rename, suspend or remove accounts that break these rules.</p>
      </>
    ),
  },
  {
    id: 'ip',
    title: 'Ownership',
    body: (
      <p>
        The Ballistic name, design, code and original content belong to Ballistic. We give you a
        personal, non-exclusive, non-transferable right to use the Service for your own
        non-commercial enjoyment. Historical statistics are factual data from public sources.
        Any feedback or ideas you send us may be used to improve Ballistic without any
        obligation to you.
      </p>
    ),
  },
  {
    id: 'privacy',
    title: 'Privacy',
    body: (
      <p>
        Our{' '}
        <Link href="/privacy" className={linkClass}>
          Privacy Policy
        </Link>{' '}
        explains what information we collect and how we use it.
      </p>
    ),
  },
  {
    id: 'changes-to-service',
    title: 'Changes and availability',
    body: (
      <p>
        Ballistic is a work in progress. We may add, change or remove features, reset game data
        during development, or pause or end the Service at any time. We&rsquo;ll try to give
        notice of big changes, but we can&rsquo;t promise the Service will always be available or
        error-free.
      </p>
    ),
  },
  {
    id: 'termination',
    title: 'Ending your use',
    body: (
      <p>
        You can stop using Ballistic at any time and ask us to delete your account by emailing{' '}
        <ContactLink />. We may suspend or end your access if you break these terms or if
        it&rsquo;s needed to protect the Service or other players.
      </p>
    ),
  },
  {
    id: 'disclaimers',
    title: 'Disclaimers',
    body: (
      <p>
        The Service is provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo;, without
        warranties of any kind, express or implied, including fitness for a particular purpose
        and non-infringement. Game results and predictions are simulated and are not advice of
        any kind, including betting advice.
      </p>
    ),
  },
  {
    id: 'liability',
    title: 'Limitation of liability',
    body: (
      <p>
        To the fullest extent allowed by law, Ballistic and its creator won&rsquo;t be liable for
        any indirect, incidental, special, consequential or punitive damages, or any loss of
        data, arising from your use of the Service. Because Ballistic is free, our total
        liability for any claim is limited to US$0, or the lowest amount allowed by law.
      </p>
    ),
  },
  {
    id: 'law',
    title: 'Governing law',
    body: (
      <p>
        These terms are governed by the laws of the State of New York, United States, without
        regard to its conflict-of-law rules, except where the law of your home country requires
        otherwise.
      </p>
    ),
  },
  {
    id: 'changes',
    title: 'Changes to these terms',
    body: (
      <p>
        We may update these terms from time to time. When we do, we&rsquo;ll change the
        &ldquo;last updated&rdquo; date above. If you keep using Ballistic after changes take
        effect, you accept the updated terms.
      </p>
    ),
  },
  {
    id: 'contact',
    title: 'Contact',
    body: (
      <p>
        Questions about these terms? Email <ContactLink />.
      </p>
    ),
  },
];

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Terms of Service"
      lastUpdated={LAST_UPDATED}
      intro={
        <p>
          The short version: Ballistic is a free fan-made game. Play fair, be decent, and
          understand it&rsquo;s a work in progress. The details are below.
        </p>
      }
      sections={SECTIONS}
    />
  );
}
