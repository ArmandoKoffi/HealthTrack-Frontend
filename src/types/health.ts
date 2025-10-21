// Types pour l'application HealthTrack

export interface User {
  id: string;
  email: string;
  nom: string;
  prenom: string;
  dateNaissance: string;
  poids?: number;
  taille?: number;
  objectifPoids?: number;
  avatar?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

export interface EntreeSommeil {
  id: string;
  userId: string;
  date: string;
  heureCoucher: string;
  heureReveil: string;
  dureeSommeil: number; // en heures
  qualiteSommeil: 1 | 2 | 3 | 4 | 5; // 1=très mauvais, 5=excellent
  notes?: string;
}

export interface EntreeRepas {
  id: string;
  userId: string;
  date: string;
  typeRepas: 'petit-dejeuner' | 'dejeuner' | 'diner' | 'collation';
  aliments: string[];
  calories?: number;
  proteines?: number;
  glucides?: number;
  lipides?: number;
  notes?: string;
}

export interface EntreeActivite {
  id: string;
  userId: string;
  date: string;
  typeActivite: string;
  duree: number; // en minutes
  intensite: 'faible' | 'modere' | 'intense';
  caloriesBrulees?: number;
  notes?: string;
}

export interface Notification {
  id: string;
  userId: string;
  titre: string;
  message: string;
  type: 'rappel' | 'felicitations' | 'objectif' | 'conseil';
  date: string;
  lu: boolean;
}

export interface StatistiquesJournalieres {
  date: string;
  sommeil?: number;
  calories?: number;
  activiteMinutes?: number;
  qualiteSommeilMoyenne?: number;
}

export interface ObjectifUtilisateur {
  id: string;
  userId: string;
  type: 'poids' | 'sommeil' | 'activite' | 'calories' | 'eau';
  valeurCible: number;
  valeurActuelle: number;
  dateDebut: string;
  dateFinSouhaitee: string;
  actif: boolean;
}