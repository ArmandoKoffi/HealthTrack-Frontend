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

// Styles professionnels type document Word
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    padding: 40,
    paddingBottom: 60,
    fontFamily: 'Times',
    fontSize: 11,
    lineHeight: 1.4,
    color: '#000000',
  },
  header: {
    marginBottom: 30,
    borderBottom: '1pt solid #2C5F9E',
    paddingBottom: 15,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Helvetica',
    fontWeight: 'bold',
    color: '#2C5F9E',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 12,
    fontFamily: 'Helvetica',
    color: '#666666',
    textAlign: 'center',
    marginBottom: 5,
  },
  metadata: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 9,
    color: '#888888',
    marginTop: 10,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: 'Helvetica',
    fontWeight: 'bold',
    color: '#2C5F9E',
    marginBottom: 12,
    paddingBottom: 4,
    borderBottom: '1pt solid #E0E0E0',
  },
  subsection: {
    marginBottom: 16,
  },
  subsectionTitle: {
    fontSize: 12,
    fontFamily: 'Helvetica',
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
  },
  table: {
    width: '100%',
    border: '1pt solid #E0E0E0',
    marginBottom: 12,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#F8F9FA',
    borderBottom: '1pt solid #E0E0E0',
  },
  tableHeaderCell: {
    flex: 1,
    padding: 8,
    fontSize: 10,
    fontFamily: 'Helvetica',
    fontWeight: 'bold',
    color: '#2C5F9E',
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
    flex: 1,
    padding: 8,
    fontSize: 9,
    borderRight: '1pt solid #E0E0E0',
  },
  tableCellLast: {
    borderRight: 'none',
  },
  profileGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  profileColumn: {
    width: '48%',
  },
  dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
    paddingVertical: 4,
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
  },
  listItem: {
    flexDirection: 'row',
    marginBottom: 4,
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
    marginBottom: 12,
  },
  statCard: {
    width: '23%',
    padding: 10,
    backgroundColor: '#F8F9FA',
    border: '1pt solid #E0E0E0',
    borderRadius: 2,
  },
  statValue: {
    fontSize: 16,
    fontFamily: 'Helvetica',
    fontWeight: 'bold',
    color: '#2C5F9E',
    textAlign: 'center',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 9,
    color: '#666666',
    textAlign: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 40,
    right: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTop: '1pt solid #E0E0E0',
    paddingTop: 10,
  },
  footerText: {
    fontSize: 8,
    color: '#666666',
  },
  pageNumber: {
    fontSize: 8,
    color: '#666666',
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 2,
  },
  emptyState: {
    padding: 20,
    textAlign: 'center',
    backgroundColor: '#F8F9FA',
    border: '1pt dashed #E0E0E0',
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
    marginTop: 10,
    padding: 8,
    backgroundColor: '#F8F9FA',
    border: '1pt solid #E0E0E0',
  },
  highlight: {
    backgroundColor: '#FFF2CC',
    padding: 2,
  },
  statusBadge: {
    fontSize: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
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
          <Text style={[styles.tableHeaderCell, { flex: 2 }]}>Date</Text>
          <Text style={styles.tableHeaderCell}>Durée (h)</Text>
          <Text style={styles.tableHeaderCell}>Qualité</Text>
          <Text style={[styles.tableHeaderCell, styles.tableCellLast]}>Heures de coucher/léver</Text>
        </View>
        
        {sommeil.slice(0, 15).map((s, index) => (
          <View key={index} style={[styles.tableRow, index % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd]}>
            <Text style={[styles.tableCell, { flex: 2 }]}>
              {new Date(s.date).toLocaleDateString('fr-FR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
              })}
            </Text>
            <Text style={styles.tableCell}>{s.dureeSommeil.toFixed(1)}</Text>
            <Text style={styles.tableCell}>{s.qualiteSommeil}/5</Text>
            <Text style={[styles.tableCell, styles.tableCellLast]}>
              {s.heureCoucher || 'N/A'} - {s.heureReveil || 'N/A'}
            </Text>
          </View>
        ))}
      </View>
      
      {sommeil.length > 15 && (
        <Text style={styles.continuationNotice}>
          + {sommeil.length - 15} entrées supplémentaires non affichées
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
          <Text style={[styles.tableHeaderCell, { flex: 1.5 }]}>Date et heure</Text>
          <Text style={styles.tableHeaderCell}>Type de repas</Text>
          <Text style={styles.tableHeaderCell}>Calories</Text>
          <Text style={[styles.tableHeaderCell, styles.tableCellLast]}>Description</Text>
        </View>
        
        {repas.slice(0, 12).map((r, index) => (
          <View key={index} style={[styles.tableRow, index % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd]}>
            <Text style={[styles.tableCell, { flex: 1.5 }]}>
              {new Date(r.date).toLocaleDateString('fr-FR', {
                day: '2-digit',
                month: '2-digit'
              })} {r.heure || ''}
            </Text>
            <Text style={styles.tableCell}>{r.typeRepas}</Text>
            <Text style={styles.tableCell}>{r.calories || 0}</Text>
            <Text style={[styles.tableCell, styles.tableCellLast]}>
              {r.description || r.aliments || 'Non spécifié'}
            </Text>
          </View>
        ))}
      </View>
      
      {repas.length > 12 && (
        <Text style={styles.continuationNotice}>
          + {repas.length - 12} repas supplémentaires non affichés
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
          <Text style={styles.tableHeaderCell}>Type d'activité</Text>
          <Text style={styles.tableHeaderCell}>Durée (min)</Text>
          <Text style={styles.tableHeaderCell}>Intensité</Text>
          <Text style={[styles.tableHeaderCell, styles.tableCellLast]}>Calories brûlées</Text>
        </View>
        
        {activites.slice(0, 12).map((a, index) => (
          <View key={index} style={[styles.tableRow, index % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd]}>
            <Text style={[styles.tableCell, { flex: 1.5 }]}>
              {new Date(a.date).toLocaleDateString('fr-FR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
              })}
            </Text>
            <Text style={styles.tableCell}>{a.typeActivite}</Text>
            <Text style={styles.tableCell}>{parseInt(a.duree, 10)}</Text>
            <Text style={styles.tableCell}>{a.intensite}</Text>
            <Text style={[styles.tableCell, styles.tableCellLast]}>
              {a.caloriesBrulees || 'N/A'}
            </Text>
          </View>
        ))}
      </View>
      
      {activites.length > 12 && (
        <Text style={styles.continuationNotice}>
          + {activites.length - 12} activités supplémentaires non affichées
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
          <Text style={styles.tableHeaderCell}>Type d'objectif</Text>
          <Text style={styles.tableHeaderCell}>Valeur actuelle</Text>
          <Text style={styles.tableHeaderCell}>Valeur cible</Text>
          <Text style={styles.tableHeaderCell}>Période</Text>
          <Text style={[styles.tableHeaderCell, styles.tableCellLast]}>Statut</Text>
        </View>
        
        {objectifs.slice(0, 10).map((o, index) => {
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
              <Text style={styles.tableCell}>{o.type}</Text>
              <Text style={styles.tableCell}>{actuel}</Text>
              <Text style={styles.tableCell}>{cible}</Text>
              <Text style={styles.tableCell}>{debut} - {fin}</Text>
              <Text style={[styles.tableCell, styles.tableCellLast]}>
                <Text style={[styles.statusBadge, isCompleted ? styles.statusCompleted : styles.statusPending]}>
                  {isCompleted ? 'ATTEINT' : 'EN COURS'}
                </Text>
              </Text>
            </View>
          );
        })}
      </View>
      
      {objectifs.length > 10 && (
        <Text style={styles.continuationNotice}>
          + {objectifs.length - 10} objectifs supplémentaires non affichés
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
        <ProfileSection user={user} />
        <SummaryStats data={data} />
        <SleepSection sommeil={sommeil} />
        <MealsSection repas={repas} />
        <ActivitiesSection activites={activites} />
        <GoalsSection objectifs={objectifs} />
      </Page>
    </Document>
  );
};
