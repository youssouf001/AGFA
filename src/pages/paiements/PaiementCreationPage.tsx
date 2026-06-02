import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
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
import { Textarea } from '@/components/ui/textarea';
import { ROUTES } from '@/constants/routes';
import { MOIS_LABELS } from '@/utils/formatters';
import { useCreatePaiementEspeces } from '@/hooks/usePaiements';
import { useMembres } from '@/hooks/useMembres';
import { useParametres } from '@/hooks/useParametres';
import { parseDRFError } from '@/utils/errorParser';

const schema = z.object({
  user_id: z.number().positive(),
  montant: z.number().positive(),
  type: z.enum(['Mensualité', 'Caution']),
  mois_concerne: z.number().min(1).max(12),
  annee_concernee: z.number().min(2020).max(2100),
  commentaire: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function PaiementCreationPage() {
  const navigate = useNavigate();
  const createPaiement = useCreatePaiementEspeces();
  const { data: membres } = useMembres(1, 100);
  const { data: parametres } = useParametres();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      mois_concerne: new Date().getMonth() + 1,
      annee_concernee: new Date().getFullYear(),
      type: 'Mensualité',
    },
  });

  const type = watch('type');

  useEffect(() => {
    if (!parametres) return;
    const montant =
      type === 'Caution'
        ? parseFloat(parametres.montant_caution)
        : parseFloat(parametres.montant_mensualite);
    if (!Number.isNaN(montant)) setValue('montant', montant);
  }, [type, parametres, setValue]);

  const onSubmit = (data: FormData) => {
    createPaiement.mutate(data, {
      onSuccess: () => {
        toast.success('Paiement enregistré');
        void navigate(ROUTES.PAIEMENTS);
      },
      onError: (e) => parseDRFError(e).forEach((m) => toast.error(m)),
    });
  };

  return (
    <div className="mx-auto max-w-lg space-y-4">
      <h2 className="text-2xl font-bold">Nouveau paiement (espèces)</h2>
      <Card>
        <CardHeader>
          <CardTitle>Formulaire</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1">
              <Label>Membre</Label>
              <Select
                onValueChange={(v) => setValue('user_id', Number(v))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choisir un membre" />
                </SelectTrigger>
                <SelectContent>
                  {membres?.results.map((m) => (
                    <SelectItem key={m.id} value={String(m.id)}>
                      {m.affichage}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.user_id && (
                <p className="text-sm text-destructive">{errors.user_id.message}</p>
              )}
            </div>
            <div className="space-y-1">
              <Label>Type</Label>
              <Select
                value={type}
                onValueChange={(v) => setValue('type', v as FormData['type'])}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Mensualité">Mensualité</SelectItem>
                  <SelectItem value="Caution">Caution</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Montant (FCFA)</Label>
              <Input type="number" {...register('montant', { valueAsNumber: true })} />
              {errors.montant && (
                <p className="text-sm text-destructive">{errors.montant.message}</p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label>Mois</Label>
                <Select
                  value={String(watch('mois_concerne'))}
                  onValueChange={(v) => setValue('mois_concerne', Number(v))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {MOIS_LABELS.map((label, i) => (
                      <SelectItem key={i} value={String(i + 1)}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label>Année</Label>
                <Input type="number" {...register('annee_concernee', { valueAsNumber: true })} />
              </div>
            </div>
            <div className="space-y-1">
              <Label>Commentaire</Label>
              <Textarea {...register('commentaire')} />
            </div>
            <Button type="submit" disabled={createPaiement.isPending}>
              Enregistrer
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
