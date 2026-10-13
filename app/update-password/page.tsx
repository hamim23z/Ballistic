import type { Metadata } from 'next';
import UpdatePasswordForm from '@/components/password/UpdatePasswordForm';

export const metadata: Metadata = {
  title: 'Change Password',
  description: 'Choose a new password for your Ballistic account.',
  robots: { index: false, follow: false },
};

// TODO: this page should only be reachable by signed-in users. Add the
// signed-in check here (or in the proxy) once Supabase auth is wired up,
// and redirect signed-out visitors to /play.
export default function UpdatePasswordPage() {
  return <UpdatePasswordForm />;
}
