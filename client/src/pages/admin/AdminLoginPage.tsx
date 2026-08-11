import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Lock, Mail } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/admin/form/FormField';
import { FieldWrapper } from '@/components/admin/form/FormField';
import { useAuth } from '@/contexts/AuthContext';
import { getApiErrorMessage } from '@/api/axiosClient';

const loginSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginForm = z.infer<typeof loginSchema>;

export function AdminLoginPage() {
  const { login, isAuthenticated, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });

  if (!authLoading && isAuthenticated) {
    const from = (location.state as { from?: Location })?.from?.pathname ?? '/admin';
    return <Navigate to={from} replace />;
  }

  const onSubmit = async (values: LoginForm) => {
    try {
      await login(values.email, values.password);
      toast.success('Welcome back');
      navigate('/admin', { replace: true });
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Invalid email or password'));
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <div className="text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-accent text-lg font-bold text-accent-foreground">
            S
          </span>
          <h1 className="mt-5 font-display text-2xl font-semibold text-foreground">SpyDev Admin</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">Sign in to manage your site</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4 rounded-3xl border border-border bg-surface p-6">
          <FieldWrapper label="Email" error={errors.email?.message} required>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input type="email" placeholder="you@spydev.agency" className="pl-10" {...register('email')} />
            </div>
          </FieldWrapper>

          <FieldWrapper label="Password" error={errors.password?.message} required>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input type="password" placeholder="••••••••" className="pl-10" {...register('password')} />
            </div>
          </FieldWrapper>

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? 'Signing in…' : 'Sign in'}
          </Button>
        </form>
      </div>
    </div>
  );
}
