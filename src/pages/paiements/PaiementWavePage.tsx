import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
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
import { MOIS_LABELS } from '@/utils/formatters';
import { useWaveInit } from '@/hooks/usePaiements';
import { parseDRFError } from '@/utils/errorParser';

const schema = z.object({
  type: z.enum(['Mensualité', 'Caution']),
  mois_concerne: z.string().min(1),
  annee_concernee: z.number().min(2020).max(2100),
});

type FormData = z.infer<typeof schema>;

export default function PaiementWavePage() {
  const waveInit = useWaveInit();
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);

  const { handleSubmit, setValue, watch, register } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      type: 'Mensualité',
      mois_concerne: String(new Date().getMonth() + 1),
      annee_concernee: new Date().getFullYear(),
    },
  });

  const onSubmit = (data: FormData) => {
    waveInit.mutate(data, {
      onSuccess: (res) => {
        setCheckoutUrl(res.wave_checkout_url);
        toast.success(res.detail || 'Session Wave initialisée');
      },
      onError: (e) => parseDRFError(e).forEach((m) => toast.error(m)),
    });
  };

  return (
    <div className="mx-auto max-w-lg space-y-4">
      <h2 className="text-2xl font-bold">Paiement Wave</h2>
      <Card>
        <CardHeader>
          <CardTitle>Initialiser un paiement mobile</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1">
              <Label>Type</Label>
              <Select
                value={watch('type')}
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
              <Label>Mois concerné</Label>
              <Select
                value={watch('mois_concerne')}
                onValueChange={(v) => setValue('mois_concerne', v)}
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
            <Button type="submit" disabled={waveInit.isPending}>
              Initialiser Wave
            </Button>
          </form>
          {checkoutUrl && (
            <div className="mt-6 space-y-2">
              <p className="text-sm text-muted-foreground">
                Cliquez pour ouvrir la page de paiement Wave :
              </p>
              <Button asChild className="w-full">
                <a href={checkoutUrl} target="_blank" rel="noopener noreferrer">
                  Payer avec Wave
                </a>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
