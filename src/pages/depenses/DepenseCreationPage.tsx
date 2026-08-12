// DepenseCreationForm.tsx
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useCreateDepense } from '@/hooks/useDepenses';
import { parseDRFError } from '@/utils/errorParser';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const schema = z.object({
  montant: z.number().positive(),
  motif: z.string().min(3),
  piece_justificative: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface DepenseCreationFormProps {
  onSuccess: () => void;
  onError: (error: unknown) => void;
}

export default function DepenseCreationPage({ onSuccess, onError }: DepenseCreationFormProps) {
  const createDepense = useCreateDepense();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = (data: FormData) => {
    createDepense.mutate(data, {
      onSuccess: () => {
        onSuccess();
      },
      onError: (e) => {
        parseDRFError(e).forEach((m) => toast.error(m));
        onError(e);
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1">
        <Label>Montant (FCFA)</Label>
        <Input 
          type="number" 
          step="0.01"
          placeholder="Ex: 2000"
          {...register('montant', { valueAsNumber: true })} 
        />
        {errors.montant && (
          <p className="text-sm text-destructive">{errors.montant.message}</p>
        )}
      </div>
      <div className="space-y-1">
        <Label>Motif</Label>
        <Textarea 
          placeholder="Ex: Achat de fournitures de bureau" 
          {...register('motif')} 
        />
        {errors.motif && (
          <p className="text-sm text-destructive">{errors.motif.message}</p>
        )}
      </div>
      <div className="space-y-1">
        <Label>Pièce justificative (URL)</Label>
        <Input {...register('piece_justificative')} />
      </div>
      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={createDepense.isPending}>
          {createDepense.isPending ? 'Enregistrement...' : 'Enregistrer'}
        </Button>
      </div>
    </form>
  );
}