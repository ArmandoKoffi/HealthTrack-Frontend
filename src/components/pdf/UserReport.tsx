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
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: 'Helvetica',
    fontWeight: 'bold',
    color: '#256D3A',
    marginBottom: 10,
    paddingBottom: 4,
    borderBottom: '1pt solid #E0E0E0',
  },
  table: {
    width: '100%',
    border: '1pt solid #E0E0E0',
    marginBottom: 8,
    marginTop: 8,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#F8F9FA',
    borderBottom: '1pt solid #E0E0E0',
  },
  tableHeaderCell: {
    padding: 6,
    fontSize: 8,
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
    padding: 6,
    fontSize: 7,
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
    marginBottom: 6,
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
  dataLabel: {
    fontSize: 9,
    fontFamily: 'Helvetica',
    fontWeight: 'bold',
    color: '#555555',
    width: '40%',
  },
  dataValue: {
    fontSize: 9,
    color: '#000000',
    width: '58%',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    marginTop: 10,
  },
  statCard: {
    width: '23%',
    padding: 10,
    backgroundColor: '#F8F9FA',
    border: '1pt solid #E0E0E0',
    borderRadius: 2,
  },
  statValue: {
    fontSize: 14,
    fontFamily: 'Helvetica',
    fontWeight: 'bold',
    color: '#256D3A',
    textAlign: 'center',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 8,
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
    paddingTop: 10,
  },
  footerText: {
    fontSize: 7,
    color: '#666666',
  },
  pageNumber: {
    fontSize: 7,
    color: '#666666',
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 2,
  },
  emptyState: {
    padding: 15,
    textAlign: 'center',
    backgroundColor: '#F8F9FA',
    border: '1pt dashed #E0E0E0',
    marginTop: 8,
  },
  emptyStateText: {
    fontSize: 9,
    color: '#666666',
    fontStyle: 'italic',
  },
  continuationNotice: {
    fontSize: 8,
    color: '#666666',
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 6,
    padding: 6,
    backgroundColor: '#F8F9FA',
    border: '1pt solid #E0E0E0',
  },
  statusBadge: {
    fontSize: 6,
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 1,
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
  notesText: {
    fontSize: 6,
    color: '#666666',
    fontStyle: 'italic',
  },
  sectionSpacing: {
    marginBottom: 15,
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

// Composant Footer professionnel avec pagination dynamique
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
      <Text>Référence : HT-{new Date().getFullYear()}-{Math.random().toString(36).substr(2, 6).toUpperCase()}</Text>
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
        <Text style={styles.statLabel}>Jours de sommeil</Text>
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

// Composants de sections modulaires avec données limitées
const SleepSection = ({ sommeil, isContinuation = false, maxRows = 10 }: { sommeil: any[]; isContinuation?: boolean; maxRows?: number }) => {
  if (sommeil.length === 0) return null;

  const displayData = maxRows ? sommeil.slice(0, maxRows) : sommeil;
  const hasMore = maxRows && sommeil.length > maxRows;

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>
        3. DONNÉES DE SOMMEIL {isContinuation ? '(suite)' : ''}
      </Text>
      
      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderCell, { flex: 1.2 }]}>Date</Text>
          <Text style={[styles.tableHeaderCell, { flex: 0.8 }]}>Durée calculée</Text>
          <Text style={[styles.tableHeaderCell, { flex: 0.8 }]}>Heure de coucher</Text>
          <Text style={[styles.tableHeaderCell, { flex: 0.8 }]}>Heure de réveil</Text>
          <Text style={[styles.tableHeaderCell, { flex: 0.8 }]}>Qualité</Text>
          <Text style={[styles.tableHeaderCell, { flex: 1.2 }, styles.tableCellLast]}>Notes</Text>
        </View>
        
        {displayData.map((s, index) => (
          <View key={index} style={[styles.tableRow, index % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd]}>
            <Text style={[styles.tableCell, { flex: 1.2 }]}>
              {new Date(s.date).toLocaleDateString('fr-FR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
              })}
            </Text>
            <Text style={[styles.tableCell, { flex: 0.8 }]}>{s.dureeSommeil?.toFixed(1) || '0'}h</Text>
            <Text style={[styles.tableCell, { flex: 0.8 }]}>{s.heureCoucher || '--:--'}</Text>
            <Text style={[styles.tableCell, { flex: 0.8 }]}>{s.heureReveil || '--:--'}</Text>
            <Text style={[styles.tableCell, { flex: 0.8 }]}>{s.qualiteSommeil || 0}/5</Text>
            <Text style={[styles.tableCell, { flex: 1.2 }, styles.tableCellLast]}>
              <Text style={styles.notesText}>
                {s.notes || s.commentaires || 'Aucune note'}
              </Text>
            </Text>
          </View>
        ))}
      </View>
      
      {hasMore && (
        <Text style={styles.continuationNotice}>
          + {sommeil.length - maxRows} entrées supplémentaires sur la page suivante
        </Text>
      )}
    </View>
  );
};

const MealsSection = ({ repas, isContinuation = false, maxRows = 8 }: { repas: any[]; isContinuation?: boolean; maxRows?: number }) => {
  if (repas.length === 0) return null;

  const displayData = maxRows ? repas.slice(0, maxRows) : repas;
  const hasMore = maxRows && repas.length > maxRows;

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>
        4. DONNÉES NUTRITIONNELLES {isContinuation ? '(suite)' : ''}
      </Text>
      
      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Date</Text>
          <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Type de repas</Text>
          <Text style={[styles.tableHeaderCell, { flex: 1.5 }]}>Aliments consommés</Text>
          <Text style={[styles.tableHeaderCell, { flex: 0.8 }]}>Calories</Text>
          <Text style={[styles.tableHeaderCell, { flex: 1.2 }, styles.tableCellLast]}>Notes</Text>
        </View>
        
        {displayData.map((r, index) => {
          let alimentsText = 'Non spécifié';
          if (Array.isArray(r.aliments)) {
            alimentsText = r.aliments.join(', ');
          } else if (r.aliments) {
            alimentsText = r.aliments;
          } else if (r.description) {
            alimentsText = r.description;
          }

          return (
            <View key={index} style={[styles.tableRow, index % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd]}>
              <Text style={[styles.tableCell, { flex: 1 }]}>
                {new Date(r.date).toLocaleDateString('fr-FR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric'
                })}
              </Text>
              <Text style={[styles.tableCell, { flex: 1 }]}>{r.typeRepas || 'Non spécifié'}</Text>
              <Text style={[styles.tableCell, { flex: 1.5 }]}>
                <Text style={styles.notesText}>
                  {alimentsText}
                </Text>
              </Text>
              <Text style={[styles.tableCell, { flex: 0.8 }]}>{r.calories || 0}</Text>
              <Text style={[styles.tableCell, { flex: 1.2 }, styles.tableCellLast]}>
                <Text style={styles.notesText}>
                  {r.notes || r.commentaires || 'Aucune note'}
                </Text>
              </Text>
            </View>
          );
        })}
      </View>
      
      {hasMore && (
        <Text style={styles.continuationNotice}>
          + {repas.length - maxRows} repas supplémentaires sur la page suivante
        </Text>
      )}
    </View>
  );
};

const ActivitiesSection = ({ activites, isContinuation = false, maxRows = 8 }: { activites: any[]; isContinuation?: boolean; maxRows?: number }) => {
  if (activites.length === 0) return null;

  const displayData = maxRows ? activites.slice(0, maxRows) : activites;
  const hasMore = maxRows && activites.length > maxRows;

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>
        5. ACTIVITÉS PHYSIQUES {isContinuation ? '(suite)' : ''}
      </Text>
      
      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Date</Text>
          <Text style={[styles.tableHeaderCell, { flex: 0.8 }]}>Durée (min)</Text>
          <Text style={[styles.tableHeaderCell, { flex: 1.2 }]}>Type d'activité</Text>
          <Text style={[styles.tableHeaderCell, { flex: 0.8 }]}>Intensité</Text>
          <Text style={[styles.tableHeaderCell, { flex: 1.2 }, styles.tableCellLast]}>Notes</Text>
        </View>
        
        {displayData.map((a, index) => (
          <View key={index} style={[styles.tableRow, index % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd]}>
            <Text style={[styles.tableCell, { flex: 1 }]}>
              {new Date(a.date).toLocaleDateString('fr-FR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
              })}
            </Text>
            <Text style={[styles.tableCell, { flex: 0.8 }]}>{parseInt(a.duree, 10) || 0}</Text>
            <Text style={[styles.tableCell, { flex: 1.2 }]}>{a.typeActivite || 'Non spécifié'}</Text>
            <Text style={[styles.tableCell, { flex: 0.8 }]}>{a.intensite || 'Non spécifié'}</Text>
            <Text style={[styles.tableCell, { flex: 1.2 }, styles.tableCellLast]}>
              <Text style={styles.notesText}>
                {a.notes || a.commentaires || 'Aucune note'}
              </Text>
            </Text>
          </View>
        ))}
      </View>
      
      {hasMore && (
        <Text style={styles.continuationNotice}>
          + {activites.length - maxRows} activités supplémentaires sur la page suivante
        </Text>
      )}
    </View>
  );
};

const GoalsSection = ({ objectifs, isContinuation = false, maxRows = 8 }: { objectifs: any[]; isContinuation?: boolean; maxRows?: number }) => {
  if (objectifs.length === 0) return null;

  const displayData = maxRows ? objectifs.slice(0, maxRows) : objectifs;
  const hasMore = maxRows && objectifs.length > maxRows;

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>
        6. OBJECTIFS DE SANTÉ {isContinuation ? '(suite)' : ''}
      </Text>
      
      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderCell, { flex: 1.5 }]}>Type d'objectif</Text>
          <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Valeur actuelle</Text>
          <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Valeur cible</Text>
          <Text style={[styles.tableHeaderCell, { flex: 1.8 }]}>Période</Text>
          <Text style={[styles.tableHeaderCell, { flex: 1 }, styles.tableCellLast]}>Statut</Text>
        </View>
        
        {displayData.map((o, index) => {
          const actuel = typeof o.valeurActuelle === 'number' ? o.valeurActuelle.toFixed(1) : o.valeurActuelle || 'N/A';
          const cible = typeof o.valeurCible === 'number' ? o.valeurCible.toFixed(1) : o.valeurCible || 'N/A';
          const debut = o.dateDebut ? new Date(o.dateDebut).toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          }) : 'Non définie';
          const fin = o.dateFinSouhaitee ? new Date(o.dateFinSouhaitee).toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          }) : 'Non définie';
          
          const isCompleted = typeof o.valeurActuelle === 'number' && 
                            typeof o.valeurCible === 'number' && 
                            o.valeurActuelle >= o.valeurCible;
          
          return (
            <View key={index} style={[styles.tableRow, index % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd]}>
              <Text style={[styles.tableCell, { flex: 1.5 }]}>{o.type || 'Non spécifié'}</Text>
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
      
      {hasMore && (
        <Text style={styles.continuationNotice}>
          + {objectifs.length - maxRows} objectifs supplémentaires sur la page suivante
        </Text>
      )}
    </View>
  );
};

// Fonction pour paginer intelligemment le contenu
const paginateContent = (data: ExportPayload, periodLabel?: string) => {
  const pages: JSX.Element[] = [];
  const { user, sommeil, repas, activites, objectifs, meta } = data;

  // Contenu de base de la première page
  const baseContent = [
    <Header key="header" user={user} periodLabel={periodLabel} meta={meta} />,
    <View key="spacing1" style={styles.sectionSpacing} />,
    <ProfileSection key="profile" user={user} />,
    <View key="spacing2" style={styles.sectionSpacing} />,
    <SummaryStats key="stats" data={data} />,
    <View key="spacing3" style={styles.sectionSpacing} />
  ];

  // Vérifier s'il y a des données
  const hasData = sommeil.length > 0 || repas.length > 0 || activites.length > 0 || objectifs.length > 0;

  if (!hasData) {
    // Page unique sans données
    pages.push(
      <Page key="page-1" size="A4" style={styles.page}>
        <Footer pageNumber={1} totalPages={1} />
        {baseContent}
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>
            Aucune donnée de suivi disponible pour cette période
          </Text>
        </View>
      </Page>
    );
    return pages;
  }

  // Essayer de tout mettre sur une seule page d'abord
  const firstPageContent = [...baseContent];

  // Ajouter toutes les sections complètes sur la première page
  if (sommeil.length > 0) {
    firstPageContent.push(<SleepSection key="sleep" sommeil={sommeil} />);
    firstPageContent.push(<View key="spacing-sleep" style={styles.sectionSpacing} />);
  }

  if (repas.length > 0) {
    firstPageContent.push(<MealsSection key="meals" repas={repas} />);
    firstPageContent.push(<View key="spacing-meals" style={styles.sectionSpacing} />);
  }

  if (activites.length > 0) {
    firstPageContent.push(<ActivitiesSection key="activities" activites={activites} />);
    firstPageContent.push(<View key="spacing-activities" style={styles.sectionSpacing} />);
  }

  if (objectifs.length > 0) {
    firstPageContent.push(<GoalsSection key="goals" objectifs={objectifs} />);
  }

  // Estimation simple : si on a beaucoup de données, on divise
  const totalRows = sommeil.length + repas.length + activites.length + objectifs.length;
  
  if (totalRows <= 20) {
    // Tout tient sur une page
    pages.push(
      <Page key="page-1" size="A4" style={styles.page}>
        <Footer pageNumber={1} totalPages={1} />
        {firstPageContent}
      </Page>
    );
  } else {
    // Diviser en deux pages
    const firstPageSections = [...baseContent];
    const secondPageSections: JSX.Element[] = [];

    // Sur la première page : toutes les sections mais avec moins de lignes
    if (sommeil.length > 0) {
      firstPageSections.push(<SleepSection key="sleep" sommeil={sommeil} maxRows={6} />);
      firstPageSections.push(<View key="spacing-sleep" style={styles.sectionSpacing} />);
    }

    if (repas.length > 0) {
      firstPageSections.push(<MealsSection key="meals" repas={repas} maxRows={5} />);
      firstPageSections.push(<View key="spacing-meals" style={styles.sectionSpacing} />);
    }

    if (activites.length > 0) {
      firstPageSections.push(<ActivitiesSection key="activities" activites={activites} maxRows={5} />);
    }

    // Sur la deuxième page : les données restantes
    if (sommeil.length > 6) {
      secondPageSections.push(<SleepSection key="sleep-cont" sommeil={sommeil.slice(6)} isContinuation={true} />);
      secondPageSections.push(<View key="spacing-sleep-cont" style={styles.sectionSpacing} />);
    }

    if (repas.length > 5) {
      secondPageSections.push(<MealsSection key="meals-cont" repas={repas.slice(5)} isContinuation={true} />);
      secondPageSections.push(<View key="spacing-meals-cont" style={styles.sectionSpacing} />);
    }

    if (activites.length > 5) {
      secondPageSections.push(<ActivitiesSection key="activities-cont" activites={activites.slice(5)} isContinuation={true} />);
      secondPageSections.push(<View key="spacing-activities-cont" style={styles.sectionSpacing} />);
    }

    if (objectifs.length > 0) {
      secondPageSections.push(<GoalsSection key="goals" objectifs={objectifs} />);
    }

    // Créer les pages
    pages.push(
      <Page key="page-1" size="A4" style={styles.page}>
        <Footer pageNumber={1} totalPages={2} />
        {firstPageSections}
      </Page>
    );

    if (secondPageSections.length > 0) {
      pages.push(
        <Page key="page-2" size="A4" style={styles.page}>
          <Footer pageNumber={2} totalPages={2} />
          {secondPageSections}
        </Page>
      );
    } else {
      // Si la deuxième page est vide, corriger la pagination
      pages[0] = React.cloneElement(pages[0], {
        children: React.Children.map(pages[0].props.children, child => 
          child && child.type === Footer 
            ? React.cloneElement(child, { pageNumber: 1, totalPages: 1 })
            : child
        )
      });
    }
  }

  return pages;
};

// Composant principal avec pagination automatique
export const UserReport: React.FC<Props> = ({ data, periodLabel }) => {
  const pages = paginateContent(data, periodLabel);

  return (
    <Document>
      {pages}
    </Document>
  );
};
