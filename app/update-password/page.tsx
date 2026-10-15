import type { Metadata } from 'next';
import ForgotPasswordForm from '@/components/password/ForgotPasswordForm';
import UpdatePasswordForm from '@/components/password/UpdatePasswordForm';

export const metadata: Metadata = {
  title: 'Change Password',
  description: 'Choose a new password for your Ballistic account.',
  robots: { index: false, follow: false },
};

// Changing a password always goes through email: visiting this page directly
// asks for an email or username and sends a link. The link in that email comes
// back here with a token_hash, and only then is the new password form shown.
// (A signed-in "change password" will live on the settings page instead.)
export default async function UpdatePasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token_hash?: string | string[]; type?: string | string[] }>;
}) {
  const { token_hash: tokenHash, type } = await searchParams;

  if (typeof tokenHash === 'string' && tokenHash && type === 'recovery') {
    return <UpdatePasswordForm tokenHash={tokenHash} />;
  }

  return <ForgotPasswordForm variant="update" />;
}
