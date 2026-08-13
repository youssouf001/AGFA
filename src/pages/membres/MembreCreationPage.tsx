import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateMembre } from "@/hooks/useMembres";
import { parseDRFError } from "@/utils/errorParser";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Calendar,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Phone,
  Shield,
  User,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const membreSchema = z.object({
  username: z.string().min(2, "Le nom d'utilisateur est requis"),
  password: z
    .string()
    .min(8, "Le mot de passe doit faire au moins 8 caractères"),
  first_name: z.string().min(1, "Le prénom est requis"),
  last_name: z.string().min(1, "Le nom est requis"),
  email: z.string().email("Email invalide"),
  matricule: z.string().min(1, "Le matricule est requis"),
  role: z.enum(["PR", "TR", "AD", "ME"]),
  date_adhesion: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date invalide"),
  telephone: z.string().min(8, "Numéro invalide"),
});

type MembreForm = z.infer<typeof membreSchema>;

interface MembreCreationContentProps {
  onSuccess: () => void;
  onError: (e: unknown) => void;
}

export default function MembreCreationContent({
  onSuccess,
  onError,
}: MembreCreationContentProps) {
  const createMembre = useCreateMembre();
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<MembreForm>({
    resolver: zodResolver(membreSchema),
    defaultValues: {
      role: "ME",
      date_adhesion: new Date().toISOString().slice(0, 10),
    },
  });

  const onSubmit = (data: MembreForm) => {
    createMembre.mutate(data, {
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-white">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Prénom et Nom */}
        <div className="space-y-1">
          <Label htmlFor="first_name" className="flex items-center gap-2">
            <User className="h-3 w-3" /> Prénom
          </Label>
          <Input
            id="first_name"
            placeholder="Jean"
            {...register("first_name")}
          />
          {errors.first_name && (
            <p className="text-xs text-destructive">
              {errors.first_name.message}
            </p>
          )}
        </div>
        <div className="space-y-1">
          <Label htmlFor="last_name" className="flex items-center gap-2">
            <User className="h-3 w-3" /> Nom
          </Label>
          <Input
            id="last_name"
            placeholder="Dupont"
            {...register("last_name")}
          />
          {errors.last_name && (
            <p className="text-xs text-destructive">
              {errors.last_name.message}
            </p>
          )}
        </div>

        {/* Nom d'utilisateur et Matricule */}
        <div className="space-y-1">
          <Label htmlFor="username" className="flex items-center gap-2">
            <User className="h-3 w-3" /> Nom d'utilisateur
          </Label>
          <Input
            id="username"
            placeholder="jdupont"
            {...register("username")}
          />
          {errors.username && (
            <p className="text-xs text-destructive">
              {errors.username.message}
            </p>
          )}
        </div>
        <div className="space-y-1">
          <Label htmlFor="matricule" className="flex items-center gap-2">
            <User className="h-3 w-3" /> Matricule
          </Label>
          <Input
            id="matricule"
            placeholder="MAT001"
            {...register("matricule")}
          />
          {errors.matricule && (
            <p className="text-xs text-destructive">
              {errors.matricule.message}
            </p>
          )}
        </div>

        {/* Email et Téléphone */}
        <div className="space-y-1">
          <Label htmlFor="email" className="flex items-center gap-2">
            <Mail className="h-3 w-3" /> Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="jean.dupont@example.com"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          )}
        </div>
        <div className="space-y-1">
          <Label htmlFor="telephone" className="flex items-center gap-2">
            <Phone className="h-3 w-3" /> Téléphone
          </Label>
          <Input
            id="telephone"
            placeholder="7X XXX XX XX"
            {...register("telephone")}
          />
          {errors.telephone && (
            <p className="text-xs text-destructive">
              {errors.telephone.message}
            </p>
          )}
        </div>

        {/* Mot de passe */}
        <div className="space-y-1 sm:col-span-2">
          <Label htmlFor="password" className="flex items-center gap-2">
            <Lock className="h-3 w-3" /> Mot de passe (min. 8 caractères)
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              {...register("password")}
              autoComplete="new-password"
              className="h-11 pr-10"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-destructive">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Rôle et Date d'adhésion */}
        <div className="space-y-1">
          <Label htmlFor="role" className="flex items-center gap-2">
            <Shield className="h-3 w-3" /> Rôle
          </Label>
          <Select
            value={watch("role")}
            onValueChange={(v) => setValue("role", v as MembreForm["role"])}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un rôle" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PR">Président (PR)</SelectItem>
              <SelectItem value="TR">Trésorier (TR)</SelectItem>
              <SelectItem value="AD">Adjoint (AD)</SelectItem>
              <SelectItem value="ME">Membre (ME)</SelectItem>
            </SelectContent>
          </Select>
          {errors.role && (
            <p className="text-xs text-destructive">{errors.role.message}</p>
          )}
        </div>
        <div className="space-y-1">
          <Label htmlFor="date_adhesion" className="flex items-center gap-2">
            <Calendar className="h-3 w-3" /> Date d'adhésion
          </Label>
          <Input
            id="date_adhesion"
            type="date"
            {...register("date_adhesion")}
          />
          {errors.date_adhesion && (
            <p className="text-xs text-destructive">
              {errors.date_adhesion.message}
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
          }}
        >
          Annuler
        </Button>
        <Button
          type="submit"
          disabled={createMembre.isPending}
          className="bg-[#10B981] hover:bg-emerald-600"
        >
          {createMembre.isPending ? "Création..." : "Créer le membre"}
        </Button>
      </div>
    </form>
  );
}
