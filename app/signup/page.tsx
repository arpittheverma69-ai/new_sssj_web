import { redirect } from 'next/navigation';

export default function SignupPage() {
  // Redirect to login page since signup is disabled
  redirect('/');
}
