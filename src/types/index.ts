export interface MembreResume {
  id: number;
  matricule: string;
  affichage: string;
  role: Role;
}

export type Role = 'PR' | 'TR' | 'AD' | 'ME';

export interface User {
  id: number;
  matricule: string;
  username: string;
  first_name: string;
  last_name: string;
  affichage: string;
  email: string;
  telephone: string;
  role: Role;
  role_display: string;
  date_adhesion: string;
  is_active: boolean;
  date_joined: string;
}

export interface UserCreationPayload {
  username: string;
  password: string;
  first_name: string;
  last_name: string;
  email: string;
  matricule: string;
  role: Role;
  date_adhesion: string;
  telephone: string;
}

export interface UserUpdatePayload {
  first_name?: string;
  last_name?: string;
  email?: string;
  telephone?: string;
  role?: Role;
  is_active?: boolean;
  date_adhesion?: string;
}

export type PaiementType = 'Mensualité' | 'Caution';
export type PaiementStatut = 'En attente' | 'Valide' | 'Rejete';
export type ModePaiement = 'Especes' | 'Wave';

export interface Paiement {
  id: number;
  membre: MembreResume;
  type: PaiementType;
  montant: string;
  montant_fcfa: string;
  mode_paiement: ModePaiement;
  mode_display: string;
  statut: PaiementStatut;
  statut_display: string;
  mois_concerne: number;
  annee_concernee: number;
  date_enregistrement: string;
  date_validation: string | null;
  enregistre_par: MembreResume | null;
  valide_par: MembreResume | null;
  commentaire: string;
  wave_checkout_url: string | null;
}

export interface PaiementEspecesPayload {
  user_id: number;
  montant: number;
  type: PaiementType;
  mois_concerne: number;
  annee_concernee: number;
  commentaire?: string;
}

export interface PaiementWaveInitPayload {
  type: PaiementType;
  mois_concerne: string;
  annee_concernee: number;
}

export interface PaiementWaveInitResponse {
  id: number;
  paytech_ref: string;
  wave_checkout_url: string;
  detail: string;
}

export interface PaiementUpdatePayload {
  type?: PaiementType;
  montant?: number;
  mode_paiement?: ModePaiement;
  statut?: PaiementStatut;
  mois_concerne?: number;
  annee_concernee?: number;
  commentaire?: string;
}

export interface Depense {
  id: number;
  montant: string;
  montant_fcfa: string;
  motif: string;
  date_depense: string;
  auteur: MembreResume | null;
  piece_justificative: string;
  alerte_seuil: boolean;
}

export interface DepenseCreationPayload {
  montant: number;
  motif: string;
  piece_justificative?: string;
}

export interface DepenseUpdatePayload {
  montant?: number;
  motif?: string;
  piece_justificative?: string;
}

export interface RapportMensuelListe {
  id: number;
  mois: number;
  annee: number;
  titre: string;
  fichier_pdf_url: string | null;
  cree_le: string;
}

export interface RapportMensuel extends RapportMensuelListe {
  contenu_html: string;
  genere_automatiquement: boolean;
}

export interface Parametre {
  montant_mensualite: string;
  montant_caution: string;
  seuil_alerte_depense: string;
  nom_amicale: string;
}

export interface ParametreUpdatePayload {
  montant_mensualite?: number;
  montant_caution?: number;
  seuil_alerte_depense?: number;
  nom_amicale?: string;
}

export interface Log {
  id: number;
  utilisateur: MembreResume;
  action: string;
  type_action: string;
  ip_address: string;
  timestamp: string;
}

export interface Arriere {
  membre: string;
  matricule: string;
  email: string;
  telephone: string;
  date_adhesion: string;
  mois_dus: number;
  nb_paiements: number;
  nb_mois_retard: number;
  montant_arriere: string;
  status_rouge: boolean;
}

export interface DashboardData {
  total_entrees: string;
  total_sorties: string;
  solde: string;
}

export interface PaginationResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface TokenResponse {
  access: string;
  refresh: string;
}

export interface LoginPayload {
  username: string;
  password: string;
}
