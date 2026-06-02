import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ROUTES } from '@/constants/routes';
import { useCreateDepense } from '@/hooks/useDepenses';
import { parseDRFError } from '@/utils/errorParser';

const schema = z.object({
  montant: z.number().positive(),
  motif: z.string().min(3),
  piece_justificative: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function DepenseCreationPage() {
  const navigate = useNavigate();
  const createDepense = useCreateDepense();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = (data: FormData) => {
    createDepense.mutate(data, {
      onSuccess: () => {
        toast.success('Dépense enregistrée');
        void navigate(ROUTES.DEPENSES);
      },
      onError: (e) => parseDRFError(e).forEach((m) => toast.error(m)),
    });
  };

  return (
    <div className="mx-auto max-w-lg space-y-4">
      <h2 className="text-2xl font-bold">Nouvelle dépense</h2>
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1">
              <Label>Montant (FCFA)</Label>
              <Input type="number" {...register('montant', { valueAsNumber: true })} />
              {errors.montant && (
                <p className="text-sm text-destructive">{errors.montant.message}</p>
              )}
            </div>
            <div className="space-y-1">
              <Label>Motif</Label>
              <Textarea {...register('motif')} />
              {errors.motif && (
                <p className="text-sm text-destructive">{errors.motif.message}</p>
              )}
            </div>
            <div className="space-y-1">
              <Label>Pièce justificative (URL)</Label>
              <Input {...register('piece_justificative')} />
            </div>
            <Button type="submit" disabled={createDepense.isPending}>
              Enregistrer
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
