import { LoginForm } from '@/components/auth/login-form';
import { BackgroundPattern } from '@/components/ui/background-pattern';

export default function LoginPage() {
  return (
    <div className="min-h-screen relative">
      <BackgroundPattern />
      <LoginForm />
    </div>
  );
}
