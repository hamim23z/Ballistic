import type { Metadata, Viewport } from 'next';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/space-grotesk/500.css';
import '@fontsource/space-grotesk/700.css';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://playballistic.com'),
  title: {
    default: 'Ballistic',
    template: '%s · Ballistic',
  },
  description:
    'Draft an all-time lineup, simulate an 82-game season with a model you can actually defend, and see your real odds of going 82-0.',
  keywords: [
    'basketball simulator',
    'draft game',
    'season simulator',
    'fantasy basketball',
    '82-0',
  ],
  applicationName: 'Ballistic',
  authors: [{ name: 'Ballistic' }],
  robots: { index: true, follow: true },
  icons: {
    icon: '/favicon.svg',
  },
  openGraph: {
    title: 'Ballistic',
    description:
      'Draft. Simulate. Defend your odds. A season simulator built on a model that actually holds up.',
    url: 'https://playballistic.com',
    siteName: 'Ballistic',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ballistic',
    description:
      'Draft. Simulate. Defend your odds. A season simulator built on a model that actually holds up.',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#0a0e14',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className="font-body antialiased text-slate-200"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}