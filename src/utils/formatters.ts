import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";

export const MOIS_LABELS = [
  "Janvier",
  "Février",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Août",
  "Septembre",
  "Octobre",
  "Novembre",
  "Décembre",
];

export const formatDateTime = (iso: string | null | undefined): string => {
  if (!iso) return "—";

  try {
    return format(parseISO(iso), "dd/MM/yyyy 'à' HH:mm", { locale: fr });
  } catch (error) {
    console.warn("Date invalide pour FormatDateTime", iso);
    return "—";
  }
};

export const formatDate = (dateStr: string | null | undefined): string => {
  if (!dateStr) return "—";
  try {
    return format(parseISO(dateStr), "dd/MM/yyyy", { locale: fr });
  } catch (error) {
    console.warn("Date invalide pour formatDate:", dateStr);
    return "—";
  }
};

export const formatMois = (mois: number): string => MOIS_LABELS[mois - 1] ?? "";

export const formatMoisAnnee = (mois: number, annee: number): string =>
  `${formatMois(mois)} ${annee}`;
