import { redirect } from 'next/navigation';
import { LoginPage } from '@/components/LoginPage';
import { isAuthenticated } from '@/lib/auth';

export default async function Login() {
  if (await isAuthenticated()) {
    redirect('/');
  }

  return <LoginPage />;
}
