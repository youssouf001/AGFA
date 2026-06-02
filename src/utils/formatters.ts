import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

export const MOIS_LABELS = [
  'Janvier',
  'Février',
  'Mars',
  'Avril',
  'Mai',
  'Juin',
  'Juillet',
  'Août',
  'Septembre',
  'Octobre',
  'Novembre',
  'Décembre',
];

export const formatMontantFCFA = (montant: string | number): string => {
  const num = typeof montant === 'string' ? parseFloat(montant) : montant;
  if (Number.isNaN(num)) return '0 FCFA';
  return new Intl.NumberFormat('fr-SN').format(num) + ' FCFA';
};

export const formatDateTime = (iso: string): string =>
  format(parseISO(iso), "dd/MM/yyyy 'à' HH:mm", { locale: fr });

export const formatDate = (dateStr: string): string =>
  format(parseISO(dateStr), 'dd/MM/yyyy', { locale: fr });

export const formatMois = (mois: number): string => MOIS_LABELS[mois - 1] ?? '';

export const formatMoisAnnee = (mois: number, annee: number): string =>
  `${formatMois(mois)} ${annee}`;
