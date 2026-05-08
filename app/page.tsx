import { redirect } from 'next/navigation';
import { ImageWorkbench } from '@/components/ImageWorkbench';
import { isAuthenticated } from '@/lib/auth';

export default async function Home() {
  if (!(await isAuthenticated())) {
    redirect('/login');
  }

  return <ImageWorkbench />;
}
