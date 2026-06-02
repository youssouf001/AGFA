import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { useParametres, useUpdateParametre } from '@/hooks/useParametres';
import { parseDRFError } from '@/utils/errorParser';

const schema = z.object({
  montant_mensualite: z.number().positive(),
  montant_caution: z.number().positive(),
  seuil_alerte_depense: z.number().positive(),
  nom_amicale: z.string().min(1),
});

type FormData = z.infer<typeof schema>;

export default function ParametresPage() {
  const { data, isLoading } = useParametres();
  const update = useUpdateParametre();
  const { register, handleSubmit, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (data) {
      reset({
        montant_mensualite: parseFloat(data.montant_mensualite),
        montant_caution: parseFloat(data.montant_caution),
        seuil_alerte_depense: parseFloat(data.seuil_alerte_depense),
        nom_amicale: data.nom_amicale,
      });
    }
  }, [data, reset]);

  if (isLoading) return <LoadingSpinner />;

  const onSubmit = (formData: FormData) => {
    update.mutate(formData, {
      onSuccess: () => toast.success('Paramètres mis à jour'),
      onError: (e) => parseDRFError(e).forEach((m) => toast.error(m)),
    });
  };

  return (
    <div className="mx-auto max-w-lg space-y-4">
      <h2 className="text-2xl font-bold">Paramètres</h2>
      <Card>
        <CardHeader>
          <CardTitle>Configuration financière</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1">
              <Label>Nom de l&apos;amicale</Label>
              <Input {...register('nom_amicale')} />
            </div>
            <div className="space-y-1">
              <Label>Montant mensualité (FCFA)</Label>
              <Input type="number" {...register('montant_mensualite', { valueAsNumber: true })} />
            </div>
            <div className="space-y-1">
              <Label>Montant caution (FCFA)</Label>
              <Input type="number" {...register('montant_caution', { valueAsNumber: true })} />
            </div>
            <div className="space-y-1">
              <Label>Seuil alerte dépense (FCFA)</Label>
              <Input type="number" {...register('seuil_alerte_depense', { valueAsNumber: true })} />
            </div>
            <Button type="submit" disabled={update.isPending}>
              Enregistrer
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
