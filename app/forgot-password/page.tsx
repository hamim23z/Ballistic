import type { Metadata } from 'next';
import ForgotPasswordForm from '@/components/password/ForgotPasswordForm';

export const metadata: Metadata = {
  title: 'Reset Password',
  description: 'Send yourself a link to reset your Ballistic password.',
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
