// Service de données mockées pour HealthTrack

import { 
  EntreeSommeil, 
  EntreeRepas, 
  EntreeActivite, 
  Notification, 
  StatistiquesJournalieres,
  ObjectifUtilisateur 
} from '@/types/health';

// Données mockées pour la démo
export class MockDataService {
  private static instance: MockDataService;

  static getInstance(): MockDataService {
    if (!MockDataService.instance) {
      MockDataService.instance = new MockDataService();
    }
    return MockDataService.instance;
  }

  // Générer des dates pour les 30 derniers jours
  private getLastDays(count: number): string[] {
    const dates: string[] = [];
    for (let i = count - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  }

  // Entrées de sommeil mockées
  getEntreesSommeil(userId: string): EntreeSommeil[] {
    const dates = this.getLastDays(30);
    return dates.map((date, index) => ({
      id: `sommeil-${index + 1}`,
      userId,
      date,
      heureCoucher: `${22 + Math.floor(Math.random() * 2)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
      heureReveil: `${6 + Math.floor(Math.random() * 3)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
      dureeSommeil: 6 + Math.random() * 3, // 6-9h
      qualiteSommeil: (Math.floor(Math.random() * 5) + 1) as 1 | 2 | 3 | 4 | 5,
      notes: Math.random() > 0.7 ? 'Bonne nuit de sommeil' : undefined
    }));
  }

  // Entrées de repas mockées
  getEntreesRepas(userId: string): EntreeRepas[] {
    const dates = this.getLastDays(7);
    const repas: EntreeRepas[] = [];
    
    dates.forEach((date, dateIndex) => {
      const typesRepas: Array<'petit-dejeuner' | 'dejeuner' | 'diner' | 'collation'> = 
        ['petit-dejeuner', 'dejeuner', 'diner'];
      
      typesRepas.forEach((type, typeIndex) => {
        repas.push({
          id: `repas-${dateIndex * 3 + typeIndex + 1}`,
          userId,
          date,
          typeRepas: type,
          aliments: this.getAlimentsParType(type),
          calories: this.getCaloriesParType(type),
          proteines: Math.floor(Math.random() * 30) + 10,
          glucides: Math.floor(Math.random() * 50) + 20,
          lipides: Math.floor(Math.random() * 20) + 5
        });
      });
    });
    
    return repas;
  }

  private getAlimentsParType(type: string): string[] {
    const aliments = {
      'petit-dejeuner': ['Pain complet', 'Confiture', 'Café', 'Yaourt', 'Fruits'],
      'dejeuner': ['Salade verte', 'Poulet grillé', 'Riz complet', 'Légumes', 'Fromage'],
      'diner': ['Saumon', 'Brocolis', 'Quinoa', 'Avocat', 'Huile d\'olive'],
      'collation': ['Pomme', 'Amandes', 'Thé vert']
    };
    
    const options = aliments[type as keyof typeof aliments] || [];
    return options.slice(0, Math.floor(Math.random() * 3) + 2);
  }

  private getCaloriesParType(type: string): number {
    const calories = {
      'petit-dejeuner': 300 + Math.floor(Math.random() * 200),
      'dejeuner': 500 + Math.floor(Math.random() * 300),
      'diner': 400 + Math.floor(Math.random() * 250),
      'collation': 100 + Math.floor(Math.random() * 100)
    };
    
    return calories[type as keyof typeof calories] || 200;
  }

  // Entrées d'activités mockées
  getEntreesActivites(userId: string): EntreeActivite[] {
    const dates = this.getLastDays(14);
    const activites = ['Course à pied', 'Vélo', 'Natation', 'Yoga', 'Musculation', 'Marche'];
    
    return dates
      .filter(() => Math.random() > 0.3) // Pas d'activité tous les jours
      .map((date, index) => ({
        id: `activite-${index + 1}`,
        userId,
        date,
        typeActivite: activites[Math.floor(Math.random() * activites.length)],
        duree: 30 + Math.floor(Math.random() * 90), // 30-120 min
        intensite: (['faible', 'modere', 'intense'] as const)[Math.floor(Math.random() * 3)],
        caloriesBrulees: 150 + Math.floor(Math.random() * 400),
        notes: Math.random() > 0.8 ? 'Excellente séance !' : undefined
      }));
  }

  // Notifications mockées
  getNotifications(userId: string): Notification[] {
    return [
      {
        id: 'notif-1',
        userId,
        titre: 'Rappel quotidien',
        message: 'N\'oubliez pas d\'enregistrer votre sommeil de la nuit dernière !',
        type: 'rappel',
        date: new Date().toISOString(),
        lu: false
      },
      {
        id: 'notif-2',
        userId,
        titre: 'Félicitations !',
        message: 'Vous avez atteint votre objectif d\'activité physique cette semaine !',
        type: 'felicitations',
        date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        lu: false
      },
      {
        id: 'notif-3',
        userId,
        titre: 'Conseil santé',
        message: 'Pensez à boire au moins 8 verres d\'eau aujourd\'hui pour rester hydraté.',
        type: 'conseil',
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        lu: true
      }
    ];
  }

  // Statistiques journalières mockées
  getStatistiquesJournalieres(userId: string): StatistiquesJournalieres[] {
    const dates = this.getLastDays(30);
    
    return dates.map(date => ({
      date,
      sommeil: 6 + Math.random() * 3,
      calories: 1800 + Math.floor(Math.random() * 800),
      activiteMinutes: Math.random() > 0.3 ? 30 + Math.floor(Math.random() * 90) : 0,
      qualiteSommeilMoyenne: 3 + Math.random() * 2
    }));
  }

  // Objectifs utilisateur mockés
  getObjectifs(userId: string): ObjectifUtilisateur[] {
    return [
      {
        id: 'obj-1',
        userId,
        type: 'poids',
        valeurCible: 65,
        valeurActuelle: 68,
        dateDebut: '2024-01-01',
        dateFinSouhaitee: '2024-06-01',
        actif: true
      },
      {
        id: 'obj-2',
        userId,
        type: 'sommeil',
        valeurCible: 8,
        valeurActuelle: 7.2,
        dateDebut: '2024-01-01',
        dateFinSouhaitee: '2024-12-31',
        actif: true
      },
      {
        id: 'obj-3',
        userId,
        type: 'activite',
        valeurCible: 150, // minutes par semaine
        valeurActuelle: 120,
        dateDebut: '2024-01-01',
        dateFinSouhaitee: '2024-12-31',
        actif: true
      }
    ];
  }

  // Méthodes pour ajouter des données (simulation)
  async ajouterEntreeSommeil(entree: Omit<EntreeSommeil, 'id'>): Promise<{ success: boolean; id?: string }> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return { success: true, id: `sommeil-${Date.now()}` };
  }

  async ajouterEntreeRepas(entree: Omit<EntreeRepas, 'id'>): Promise<{ success: boolean; id?: string }> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return { success: true, id: `repas-${Date.now()}` };
  }

  async ajouterEntreeActivite(entree: Omit<EntreeActivite, 'id'>): Promise<{ success: boolean; id?: string }> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return { success: true, id: `activite-${Date.now()}` };
  }

  async marquerNotificationLue(notificationId: string): Promise<{ success: boolean }> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return { success: true };
  }
}