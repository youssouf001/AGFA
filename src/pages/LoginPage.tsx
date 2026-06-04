import AgfaLogo from '@/components/shared/AgfaLogo';
import LoginSplash from '@/components/shared/LoginSplash';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/hooks/useAuth';
import { parseDRFError } from '@/utils/errorParser';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';
import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { z } from 'zod';

const loginSchema = z.object({
  username: z.string().min(2, 'Minimum 2 caractères'),
  password: z.string().min(8, 'Minimum 8 caractères'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [splashDone, setSplashDone] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setIsSubmitting(true);
    try {
      await login(data);
      toast.success('Connexion réussie');
      void navigate(ROUTES.DASHBOARD);
    } catch (error) {
      parseDRFError(error).forEach((msg) => toast.error(msg));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSplashComplete = useCallback(() => {
    setSplashDone(true);
  }, [])

  return (
    <>
      {!splashDone && <LoginSplash onComplete={handleSplashComplete} />}
      
      <Card className={`w-full max-w-md shadow-xl transition-all duration-500 ${splashDone ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
        
        {/* Header avec Titre principal */}
        <CardHeader className="text-center ">
        <header className="flex flex-col items-center px-6 pt-14 sm:pt-16">
            <AgfaLogo size={104} />
          </header>
          <CardTitle className="text-2xl font-bold text-[#0A192F]">AGFA</CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Application de Gestion financière de l'Amicale
          </CardDescription>
        </CardHeader>

        {/* Titre "Connexion" stylisé et placé parfaitement */}
        <div className="px-6">
          
          <CardContent className="px-0">
          <h1 className="font-['Playfair_Display',Georgia,serif] text-3xl font-semibold text-[#0A192F] mb-2">
            Connexion
          </h1>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium text-[#0A192F]">Identifiant</Label>
                <Input id="username" {...register('username')} autoComplete="username" className="h-11" />
                {errors.username && (
                  <p className="text-xs text-destructive mt-1">{errors.username.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-[#0A192F]">Mot de passe</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    {...register('password')}
                    autoComplete="current-password"
                    className="h-11 pr-10"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-destructive mt-1">{errors.password.message}</p>
                )}
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  className="text-sm font-medium transition-colors hover:text-success-600 text-muted-foreground"
                >
                  Mot de passe oublié ?
                </button>
              </div>

              <Button type="submit" className="w-full h-11 text-base font-medium bg-[#10B981] hover:bg-emerald-600" disabled={isSubmitting}>
                {isSubmitting ? 'Connexion...' : 'Se connecter'}
              </Button>
            </form>
          </CardContent>
        </div>
        <p className="mt-auto pt-10 mb-8 text-center text-sm text-gray-600">
                Pas de compte ?{" "}
                <button
                  type="button"
                  className="font-semibold transition-opacity hover:opacity-80"
                  style={{ color: '#10B981' }}
                >
                  Contacter le Trésorier
                </button>
              </p>
      </Card>
    </>
  );
}