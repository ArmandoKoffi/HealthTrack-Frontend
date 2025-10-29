import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font, Link } from '@react-pdf/renderer';

// Utilisation de polices professionnelles
Font.register({
  family: 'Helvetica',
  fonts: [
    { src: 'Helvetica' },
    { src: 'Helvetica-Bold', fontWeight: 'bold' },
    { src: 'Helvetica-Oblique', fontWeight: 'normal', fontStyle: 'italic' },
  ],
});

Font.register({
  family: 'Times',
  fonts: [
    { src: 'Times-Roman' },
    { src: 'Times-Bold', fontWeight: 'bold' },
    { src: 'Times-Italic', fontWeight: 'normal', fontStyle: 'italic' },
  ],
});

// Styles professionnels avec couleur verte et meilleur espacement
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    padding: 40,
    paddingBottom: 80,
    fontFamily: 'Times',
    fontSize: 11,
    lineHeight: 1.4,
    color: '#000000',
    backgroundColor: '#FFFFFF',
  },
  header: {
    marginBottom: 35,
    borderBottom: '1pt solid #256D3A',
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Helvetica',
    fontWeight: 'bold',
    color: '#256D3A',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 12,
    fontFamily: 'Helvetica',
    color: '#666666',
    textAlign: 'center',
    marginBottom: 8,
  },
  metadata: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 9,
    color: '#888888',
    marginTop: 15,
    paddingHorizontal: 10,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: 'Helvetica',
    fontWeight: 'bold',
    color: '#256D3A',
    marginBottom: 16,
    paddingBottom: 6,
    borderBottom: '1pt solid #E0E0E0',
  },
  subsection: {
    marginBottom: 20,
  },
  subsectionTitle: {
    fontSize: 12,
    fontFamily: 'Helvetica',
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 10,
  },
  table: {
    width: '100%',
    border: '1pt solid #E0E0E0',
    marginBottom: 16,
    marginTop: 8,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#F8F9FA',
    borderBottom: '1pt solid #E0E0E0',
  },
  tableHeaderCell: {
    padding: 10,
    fontSize: 10,
    fontFamily: 'Helvetica',
    fontWeight: 'bold',
    color: '#256D3A',
    borderRight: '1pt solid #E0E0E0',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '1pt solid #E0E0E0',
  },
  tableRowEven: {
    backgroundColor: '#FFFFFF',
  },
  tableRowOdd: {
    backgroundColor: '#F8F9FA',
  },
  tableCell: {
    padding: 10,
    fontSize: 9,
    borderRight: '1pt solid #E0E0E0',
  },
  tableCellLast: {
    borderRight: 'none',
  },
  profileGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    marginTop: 8,
  },
  profileColumn: {
    width: '48%',
  },
  dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  dataLabel: {
    fontSize: 10,
    fontFamily: 'Helvetica',
    fontWeight: 'bold',
    color: '#555555',
    width: '40%',
  },
  dataValue: {
    fontSize: 10,
    color: '#000000',
    width: '58%',
  },
  list: {
    marginLeft: 15,
    marginTop: 8,
  },
  listItem: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  bullet: {
    width: 10,
    fontSize: 10,
    marginRight: 5,
  },
  listText: {
    flex: 1,
    fontSize: 10,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    marginTop: 12,
  },
  statCard: {
    width: '23%',
    padding: 12,
    backgroundColor: '#F8F9FA',
    border: '1pt solid #E0E0E0',
    borderRadius: 2,
  },
  statValue: {
    fontSize: 16,
    fontFamily: 'Helvetica',
    fontWeight: 'bold',
    color: '#256D3A',
    textAlign: 'center',
    marginBottom: 6,
  },
  statLabel: {
    fontSize: 9,
    color: '#666666',
    textAlign: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 25,
    left: 40,
    right: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTop: '1pt solid #E0E0E0',
    paddingTop: 12,
  },
  footerText: {
    fontSize: 8,
    color: '#666666',
  },
  pageNumber: {
    fontSize: 8,
    color: '#666666',
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 2,
  },
  emptyState: {
    padding: 25,
    textAlign: 'center',
    backgroundColor: '#F8F9FA',
    border: '1pt dashed #E0E0E0',
    marginTop: 12,
  },
  emptyStateText: {
    fontSize: 10,
    color: '#666666',
    fontStyle: 'italic',
  },
  continuationNotice: {
    fontSize: 9,
    color: '#666666',
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 12,
    padding: 10,
    backgroundColor: '#F8F9FA',
    border: '1pt solid #E0E0E0',
  },
  highlight: {
    backgroundColor: '#E8F5E8',
    padding: 2,
  },
  statusBadge: {
    fontSize: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 2,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  statusCompleted: {
    backgroundColor: '#D4EDDA',
    color: '#155724',
  },
  statusPending: {
    backgroundColor: '#FFF3CD',
    color: '#856404',
  },
  sectionSpacing: {
    marginBottom: 25,
  },
});

export type ExportPayload = {
  user: {
    id: string;
    email: string;
    nom: string;
    prenom: string;
    dateNaissance?: string;
    poids?: number;
    taille?: number;
    objectifPoids?: number;
    avatar?: string;
    role?: string;
    isActive?: boolean;
    emailVerified?: boolean;
    lastLogin?: string;
    createdAt?: string;
    updatedAt?: string;
  };
  sommeil: any[];
  repas: any[];
  activites: any[];
  objectifs: any[];
  meta: { generatedAt: string; source: string; version: string };
};

interface Props {
  data: ExportPayload;
  periodLabel?: string;
}

// Composant Footer professionnel
const Footer = ({ pageNumber, totalPages }: { pageNumber: number; totalPages: number }) => (
  <View style={styles.footer} fixed>
    <Text style={styles.footerText}>
      HealthTrack - Rapport confidentiel - Généré le {new Date().toLocaleDateString('fr-FR')}
    </Text>
    <View style={styles.pageNumber}>
      <Text>{pageNumber} / {totalPages}</Text>
    </View>
    <Text style={styles.footerText}>
      Document généré automatiquement
    </Text>
  </View>
);

// Composant Header professionnel
const Header = ({ user, periodLabel, meta }: { user: any; periodLabel?: string; meta: any }) => (
  <View style={styles.header}>
    <Text style={styles.title}>RAPPORT DE SANTÉ</Text>
    <Text style={styles.subtitle}>
      Suivi personnel de {user.prenom} {user.nom}
    </Text>
    <Text style={styles.subtitle}>
      Période analysée : {periodLabel || 'Non spécifiée'}
    </Text>
    <View style={styles.metadata}>
      <Text>Email : {user.email}</Text>
      <Text>Généré le : {new Date(meta.generatedAt).toLocaleDateString('fr-FR')}</Text>
      <Text>Version : {meta.version}</Text>
    </View>
  </View>
);

// Composant Profil utilisateur format document
const ProfileSection = ({ user }: { user: any }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>1. PROFIL UTILISATEUR</Text>
    
    <View style={styles.profileGrid}>
      <View style={styles.profileColumn}>
        <View style={styles.dataRow}>
          <Text style={styles.dataLabel}>Nom complet :</Text>
          <Text style={styles.dataValue}>{user.prenom} {user.nom}</Text>
        </View>
        <View style={styles.dataRow}>
          <Text style={styles.dataLabel}>Email :</Text>
          <Text style={styles.dataValue}>{user.email}</Text>
        </View>
        {user.dateNaissance && (
          <View style={styles.dataRow}>
            <Text style={styles.dataLabel}>Date de naissance :</Text>
            <Text style={styles.dataValue}>
              {new Date(user.dateNaissance).toLocaleDateString('fr-FR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
              })}
            </Text>
          </View>
        )}
      </View>
      
      <View style={styles.profileColumn}>
        {typeof user.taille === 'number' && (
          <View style={styles.dataRow}>
            <Text style={styles.dataLabel}>Taille :</Text>
            <Text style={styles.dataValue}>{user.taille} cm</Text>
          </View>
        )}
        {typeof user.poids === 'number' && (
          <View style={styles.dataRow}>
            <Text style={styles.dataLabel}>Poids actuel :</Text>
            <Text style={styles.dataValue}>{user.poids} kg</Text>
          </View>
        )}
        {typeof user.objectifPoids === 'number' && (
          <View style={styles.dataRow}>
            <Text style={styles.dataLabel}>Objectif poids :</Text>
            <Text style={styles.dataValue}>{user.objectifPoids} kg</Text>
          </View>
        )}
      </View>
    </View>
  </View>
);

// Composant Statistiques récapitulatives
const SummaryStats = ({ data }: { data: ExportPayload }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>2. SYNTHÈSE DES DONNÉES</Text>
    
    <View style={styles.statsGrid}>
      <View style={styles.statCard}>
        <Text style={styles.statValue}>{data.sommeil.length}</Text>
        <Text style={styles.statLabel}>Jours de sommeil suivis</Text>
      </View>
      <View style={styles.statCard}>
        <Text style={styles.statValue}>{data.repas.length}</Text>
        <Text style={styles.statLabel}>Repas enregistrés</Text>
      </View>
      <View style={styles.statCard}>
        <Text style={styles.statValue}>{data.activites.length}</Text>
        <Text style={styles.statLabel}>Activités physiques</Text>
      </View>
      <View style={styles.statCard}>
        <Text style={styles.statValue}>{data.objectifs.length}</Text>
        <Text style={styles.statLabel}>Objectifs définis</Text>
      </View>
    </View>
  </View>
);

// Composant Données de sommeil format tableau
const SleepSection = ({ sommeil }: { sommeil: any[] }) => {
  if (sommeil.length === 0) {
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>3. DONNÉES DE SOMMEIL</Text>
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>Aucune donnée de sommeil disponible pour cette période</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>3. DONNÉES DE SOMMEIL</Text>
      
      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderCell, { flex: 1.8 }]}>Date</Text>
          <Text style={[styles.tableHeaderCell, { flex: 0.8 }]}>Durée (h)</Text>
          <Text style={[styles.tableHeaderCell, { flex: 0.8 }]}>Qualité</Text>
          <Text style={[styles.tableHeaderCell, { flex: 2 }, styles.tableCellLast]}>Heures de coucher/léver</Text>
        </View>
        
        {sommeil.slice(0, 12).map((s, index) => (
          <View key={index} style={[styles.tableRow, index % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd]}>
            <Text style={[styles.tableCell, { flex: 1.8 }]}>
              {new Date(s.date).toLocaleDateString('fr-FR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
              })}
            </Text>
            <Text style={[styles.tableCell, { flex: 0.8 }]}>{s.dureeSommeil.toFixed(1)}</Text>
            <Text style={[styles.tableCell, { flex: 0.8 }]}>{s.qualiteSommeil}/5</Text>
            <Text style={[styles.tableCell, { flex: 2 }, styles.tableCellLast]}>
              {s.heureCoucher || '--:--'} - {s.heureReveil || '--:--'}
            </Text>
          </View>
        ))}
      </View>
      
      {sommeil.length > 12 && (
        <Text style={styles.continuationNotice}>
          + {sommeil.length - 12} entrées supplémentaires non affichées
        </Text>
      )}
    </View>
  );
};

// Composant Données de repas format tableau
const MealsSection = ({ repas }: { repas: any[] }) => {
  if (repas.length === 0) {
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>4. DONNÉES NUTRITIONNELLES</Text>
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>Aucun repas enregistré pour cette période</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>4. DONNÉES NUTRITIONNELLES</Text>
      
      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderCell, { flex: 1.6 }]}>Date et heure</Text>
          <Text style={[styles.tableHeaderCell, { flex: 1.2 }]}>Type de repas</Text>
          <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Calories</Text>
          <Text style={[styles.tableHeaderCell, { flex: 1.8 }, styles.tableCellLast]}>Description</Text>
        </View>
        
        {repas.slice(0, 10).map((r, index) => (
          <View key={index} style={[styles.tableRow, index % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd]}>
            <Text style={[styles.tableCell, { flex: 1.6 }]}>
              {new Date(r.date).toLocaleDateString('fr-FR', {
                day: '2-digit',
                month: '2-digit'
              })} {r.heure || ''}
            </Text>
            <Text style={[styles.tableCell, { flex: 1.2 }]}>{r.typeRepas}</Text>
            <Text style={[styles.tableCell, { flex: 1 }]}>{r.calories || 0}</Text>
            <Text style={[styles.tableCell, { flex: 1.8 }, styles.tableCellLast]}>
              {r.description || r.aliments || 'Non spécifié'}
            </Text>
          </View>
        ))}
      </View>
      
      {repas.length > 10 && (
        <Text style={styles.continuationNotice}>
          + {repas.length - 10} repas supplémentaires non affichés
        </Text>
      )}
    </View>
  );
};

// Composant Activités physiques format tableau
const ActivitiesSection = ({ activites }: { activites: any[] }) => {
  if (activites.length === 0) {
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>5. ACTIVITÉS PHYSIQUES</Text>
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>Aucune activité physique enregistrée pour cette période</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>5. ACTIVITÉS PHYSIQUES</Text>
      
      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderCell, { flex: 1.5 }]}>Date</Text>
          <Text style={[styles.tableHeaderCell, { flex: 1.5 }]}>Type d'activité</Text>
          <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Durée (min)</Text>
          <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Intensité</Text>
          <Text style={[styles.tableHeaderCell, { flex: 1.2 }, styles.tableCellLast]}>Calories brûlées</Text>
        </View>
        
        {activites.slice(0, 10).map((a, index) => (
          <View key={index} style={[styles.tableRow, index % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd]}>
            <Text style={[styles.tableCell, { flex: 1.5 }]}>
              {new Date(a.date).toLocaleDateString('fr-FR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
              })}
            </Text>
            <Text style={[styles.tableCell, { flex: 1.5 }]}>{a.typeActivite}</Text>
            <Text style={[styles.tableCell, { flex: 1 }]}>{parseInt(a.duree, 10)}</Text>
            <Text style={[styles.tableCell, { flex: 1 }]}>{a.intensite}</Text>
            <Text style={[styles.tableCell, { flex: 1.2 }, styles.tableCellLast]}>
              {a.caloriesBrulees || 0}
            </Text>
          </View>
        ))}
      </View>
      
      {activites.length > 10 && (
        <Text style={styles.continuationNotice}>
          + {activites.length - 10} activités supplémentaires non affichées
        </Text>
      )}
    </View>
  );
};

// Composant Objectifs format tableau
const GoalsSection = ({ objectifs }: { objectifs: any[] }) => {
  if (objectifs.length === 0) {
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>6. OBJECTIFS DE SANTÉ</Text>
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>Aucun objectif défini pour cette période</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>6. OBJECTIFS DE SANTÉ</Text>
      
      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderCell, { flex: 1.5 }]}>Type d'objectif</Text>
          <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Valeur actuelle</Text>
          <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Valeur cible</Text>
          <Text style={[styles.tableHeaderCell, { flex: 1.8 }]}>Période</Text>
          <Text style={[styles.tableHeaderCell, { flex: 1 }, styles.tableCellLast]}>Statut</Text>
        </View>
        
        {objectifs.slice(0, 8).map((o, index) => {
          const actuel = typeof o.valeurActuelle === 'number' ? o.valeurActuelle.toFixed(1) : o.valeurActuelle;
          const cible = typeof o.valeurCible === 'number' ? o.valeurCible.toFixed(1) : o.valeurCible;
          const debut = new Date(o.dateDebut).toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          });
          const fin = new Date(o.dateFinSouhaitee).toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          });
          
          const isCompleted = typeof o.valeurActuelle === 'number' && 
                            typeof o.valeurCible === 'number' && 
                            o.valeurActuelle >= o.valeurCible;
          
          return (
            <View key={index} style={[styles.tableRow, index % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd]}>
              <Text style={[styles.tableCell, { flex: 1.5 }]}>{o.type}</Text>
              <Text style={[styles.tableCell, { flex: 1 }]}>{actuel}</Text>
              <Text style={[styles.tableCell, { flex: 1 }]}>{cible}</Text>
              <Text style={[styles.tableCell, { flex: 1.8 }]}>{debut} - {fin}</Text>
              <Text style={[styles.tableCell, { flex: 1 }, styles.tableCellLast]}>
                <Text style={[styles.statusBadge, isCompleted ? styles.statusCompleted : styles.statusPending]}>
                  {isCompleted ? 'ATTEINT' : 'EN COURS'}
                </Text>
              </Text>
            </View>
          );
        })}
      </View>
      
      {objectifs.length > 8 && (
        <Text style={styles.continuationNotice}>
          + {objectifs.length - 8} objectifs supplémentaires non affichés
        </Text>
      )}
    </View>
  );
};

// Composant principal
export const UserReport: React.FC<Props> = ({ data, periodLabel }) => {
  const { user, sommeil, repas, activites, objectifs, meta } = data;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Footer pageNumber={1} totalPages={1} />
        <Header user={user} periodLabel={periodLabel} meta={meta} />
        <View style={styles.sectionSpacing} />
        <ProfileSection user={user} />
        <View style={styles.sectionSpacing} />
        <SummaryStats data={data} />
        <View style={styles.sectionSpacing} />
        <SleepSection sommeil={sommeil} />
        <View style={styles.sectionSpacing} />
        <MealsSection repas={repas} />
        <View style={styles.sectionSpacing} />
        <ActivitiesSection activites={activites} />
        <View style={styles.sectionSpacing} />
        <GoalsSection objectifs={objectifs} />
      </Page>
    </Document>
  );
};
