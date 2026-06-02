import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ROUTES } from '@/constants/routes';
import { useCreateMembre } from '@/hooks/useMembres';
import { parseDRFError } from '@/utils/errorParser';

const membreSchema = z.object({
  username: z.string().min(2),
  password: z.string().min(8),
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  email: z.email(),
  matricule: z.string().min(1),
  role: z.enum(['PR', 'TR', 'AD', 'ME']),
  date_adhesion: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  telephone: z.string().min(8),
});

type MembreForm = z.infer<typeof membreSchema>;

export default function MembreCreationPage() {
  const navigate = useNavigate();
  const createMembre = useCreateMembre();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<MembreForm>({
    resolver: zodResolver(membreSchema),
    defaultValues: { role: 'ME', date_adhesion: new Date().toISOString().slice(0, 10) },
  });

  const onSubmit = (data: MembreForm) => {
    createMembre.mutate(data, {
      onSuccess: () => {
        toast.success('Membre créé');
        void navigate(ROUTES.MEMBRES);
      },
      onError: (e) => parseDRFError(e).forEach((m) => toast.error(m)),
    });
  };

  return (
    <div className="mx-auto max-w-lg space-y-4">
      <h2 className="text-2xl font-bold">Nouveau membre</h2>
      <Card>
        <CardHeader>
          <CardTitle>Informations</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {(['username', 'password', 'first_name', 'last_name', 'email', 'matricule', 'telephone', 'date_adhesion'] as const).map(
              (field) => (
                <div key={field} className="space-y-1">
                  <Label>{field}</Label>
                  <Input
                    type={field === 'password' ? 'password' : field === 'date_adhesion' ? 'date' : 'text'}
                    {...register(field)}
                  />
                  {errors[field] && (
                    <p className="text-sm text-destructive">{errors[field]?.message}</p>
                  )}
                </div>
              ),
            )}
            <div className="space-y-1">
              <Label>Rôle</Label>
              <Select value={watch('role')} onValueChange={(v) => setValue('role', v as MembreForm['role'])}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(['PR', 'TR', 'AD', 'ME'] as const).map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" disabled={createMembre.isPending}>
              Créer
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
