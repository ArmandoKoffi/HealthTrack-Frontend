import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font, Svg, Path } from '@react-pdf/renderer';

// Utilisation de polices système sûres pour éviter les problèmes de chargement
Font.register({
  family: 'Helvetica',
  fonts: [
    { src: 'Helvetica' },
    { src: 'Helvetica-Bold', fontWeight: 700 },
  ],
});

// Police pour les titres
Font.register({
  family: 'Times-Roman',
  fonts: [
    { src: 'Times-Roman' },
    { src: 'Times-Bold', fontWeight: 700 },
  ],
});

// Styles professionnels pour le PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    padding: 30,
    paddingBottom: 50, // Espace pour le pied de page
    backgroundColor: '#F9FAFC', // Fond légèrement bleuté pour un aspect corporate
    fontFamily: 'Helvetica',
  },
  headerInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 30,
    right: 30,
    borderTopWidth: 1,
    borderTopColor: '#E1E8ED',
    paddingTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerContent: {
    flexDirection: 'column',
  },
  footerText: {
    fontSize: 8,
    color: '#5A6B7B',
    marginBottom: 2,
  },
  footerPageInfo: {
    backgroundColor: '#EFF6FF',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  footerPageText: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#3B82F6',
  },
  header: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: '#FFFFFF', // Fond blanc pour un aspect épuré
    borderRadius: 8,
    borderBottomWidth: 3,
    borderBottomColor: '#3B82F6', // Bleu moderne
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderTopWidth: 1,
    borderLeftColor: '#E1E8ED',
    borderRightColor: '#E1E8ED',
    borderTopColor: '#E1E8ED',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.05)',
  },
  title: {
    fontSize: 26,
    color: '#1E3A8A', // Bleu foncé
    fontWeight: 700,
    textAlign: 'center',
    marginBottom: 6,
    fontFamily: 'Times-Roman',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 13,
    color: '#475569', // Gris bleuté
    marginTop: 4,
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  section: {
    marginTop: 16,
    padding: 14,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderColor: '#E1E8ED',
    borderWidth: 1,
    borderLeftWidth: 3,
    borderLeftColor: '#3B82F6', // Bleu moderne
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.04)',
  },
  sectionTitle: {
    fontSize: 16,
    color: '#2563EB', // Bleu vif
    marginBottom: 10,
    fontWeight: 600,
    borderBottomWidth: 1,
    borderBottomColor: '#EFF6FF', // Bleu très pâle
    paddingBottom: 4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingVertical: 2,
    borderBottomWidth: 1,
    borderBottomColor: '#F6FAF7',
  },
  label: {
    fontSize: 11,
    color: '#587A66',
    fontWeight: 500,
  },
  value: {
    fontSize: 11,
    color: '#1F5132',
    fontWeight: 600,
  },
  chip: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 999,
    backgroundColor: '#D7F3E0',
    alignSelf: 'flex-start',
    marginTop: 8,
    fontSize: 10,
    color: '#1F5132',
    borderWidth: 1,
    borderColor: '#A5D6B7',
  },
  listItem: {
    fontSize: 11,
    color: '#1F5132',
    marginBottom: 6,
    paddingVertical: 3,
    paddingHorizontal: 2,
    borderBottomWidth: 1,
    borderBottomColor: '#F6FAF7',
  },
  sectionDivider: {
    height: 1,
    backgroundColor: '#E8F5E9',
    marginBottom: 10,
  },
  profileContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  profileColumn: {
    width: '48%',
  },
  dataGrid: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dataGridItem: {
    width: '50%',
    marginBottom: 6,
  },
  // Nouveaux styles pour l'affichage des données
  dataCard: {
    padding: 10,
    borderRadius: 6,
    backgroundColor: '#F8FAFF',
    borderLeftWidth: 2,
    borderLeftColor: '#3B82F6',
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
    marginBottom: 4,
  },
  dataDate: {
    fontSize: 9,
    color: '#64748B',
    marginBottom: 4,
    fontWeight: 500,
  },
  dataDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dataValue: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#1E40AF',
  },
  dataLabel: {
    fontSize: 10,
    color: '#475569',
    fontWeight: 500,
  },
  dataTable: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 6,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#EFF6FF',
    borderBottomWidth: 2,
    borderBottomColor: '#3B82F6',
    padding: 10,
  },
  tableHeaderCell: {
    flex: 1,
    fontWeight: 'bold',
    fontSize: 10,
    color: '#1E40AF',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    padding: 8,
  },
  tableRowEven: {
    backgroundColor: '#FFFFFF',
  },
  tableRowOdd: {
    backgroundColor: '#F8FAFF',
  },
  tableCell: {
    flex: 1,
    fontSize: 9,
    color: '#334155',
    padding: 2,
  },
  statusCell: {
    borderRadius: 4,
    padding: '3 6',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statusSuccess: {
    backgroundColor: '#DCFCE7',
    color: '#166534',
  },
  statusPending: {
    backgroundColor: '#FEF3C7',
    color: '#9A3412',
  },
  emptyState: {
    padding: 20,
    textAlign: 'center',
    backgroundColor: '#F8FAFF',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
  },
  emptyStateText: {
    fontSize: 11,
    color: '#64748B',
    fontStyle: 'italic',
  },
  continuationText: {
    fontSize: 10,
    color: '#64748B',
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 8,
    padding: 8,
    backgroundColor: '#F1F5F9',
    borderRadius: 4,
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

// Composant Footer
const Footer = ({ pageNumber, totalPages }: { pageNumber: number; totalPages: number }) => (
  <View style={styles.footer}>
    <View style={styles.footerContent}>
      <Text style={styles.footerText}>
        HealthTrack © {new Date().getFullYear()} - Rapport confidentiel
      </Text>
      <Text style={styles.footerText}>
        Généré le {new Date().toLocaleDateString('fr-FR', {day: '2-digit', month: '2-digit', year: 'numeric'})}
      </Text>
    </View>
    <View style={styles.footerPageInfo}>
      <Text style={styles.footerPageText}>
        Page {pageNumber} sur {totalPages}
      </Text>
    </View>
  </View>
);

// Composant pour l'en-tête de la première page
const Header = ({ user, periodLabel, meta }: { user: any; periodLabel?: string; meta: any }) => (
  <View style={styles.header}>
    <View style={styles.logoContainer}>
      <Svg width="30" height="30" viewBox="0 0 24 24">
        <Path
          fill="#256D3A"
          d="M12,2L1,21H23L12,2M12,6L19.53,19H4.47L12,6M11,10V14H13V10H11M11,16V18H13V16H11Z"
        />
      </Svg>
      <Text style={styles.title}>Rapport HealthTrack</Text>
    </View>
    <Text style={styles.subtitle}>
      Utilisateur: {user.prenom} {user.nom} · Période: {periodLabel || 'N/A'}
    </Text>
    <View style={styles.headerInfoContainer}>
      <Text style={styles.chip}>Généré le: {new Date(meta.generatedAt).toLocaleDateString('fr-FR', {day: '2-digit', month: '2-digit', year: 'numeric'})}</Text>
      <Text style={styles.chip}>Version: {meta.version}</Text>
    </View>
  </View>
);

// Composant pour la section profil utilisateur
const ProfileSection = ({ user }: { user: any }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>Profil Utilisateur</Text>
    <View style={styles.sectionDivider} />
    
    <View style={styles.profileContainer}>
      <View style={styles.profileColumn}>
        <View style={styles.row}><Text style={styles.label}>Email</Text><Text style={styles.value}>{user.email}</Text></View>
        {user.dateNaissance && (
          <View style={styles.row}>
            <Text style={styles.label}>Date de naissance</Text>
            <Text style={styles.value}>
              {new Date(user.dateNaissance).toLocaleDateString('fr-FR', {day: '2-digit', month: '2-digit', year: 'numeric'})}
            </Text>
          </View>
        )}
      </View>
      
      <View style={styles.profileColumn}>
        {typeof user.taille === 'number' && (
          <View style={styles.row}>
            <Text style={styles.label}>Taille</Text>
            <Text style={styles.value}>{user.taille.toFixed(0)} cm</Text>
          </View>
        )}
        {typeof user.poids === 'number' && (
          <View style={styles.row}>
            <Text style={styles.label}>Poids</Text>
            <Text style={styles.value}>{user.poids.toFixed(1)} kg</Text>
          </View>
        )}
        {typeof user.objectifPoids === 'number' && (
          <View style={styles.row}>
            <Text style={styles.label}>Objectif poids</Text>
            <Text style={styles.value}>{user.objectifPoids.toFixed(1)} kg</Text>
          </View>
        )}
      </View>
    </View>
  </View>
);

// Composant pour la section sommeil
const SleepSection = ({ sommeil, isContinuation = false }: { sommeil: any[]; isContinuation?: boolean }) => {
  if (sommeil.length === 0) {
    return null;
  }

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>
        Sommeil ({sommeil.length}) {isContinuation ? '(suite)' : ''}
      </Text>
      <View style={styles.sectionDivider} />
      
      <View style={styles.dataGrid}>
        {sommeil.map((s: any, idx: number) => (
          <View key={`sleep-${idx}`} style={styles.dataGridItem}>
            <View style={styles.dataCard}>
              <Text style={styles.dataDate}>{new Date(s.date).toLocaleDateString('fr-FR', {day: '2-digit', month: '2-digit', year: 'numeric'})}</Text>
              <View style={styles.dataDetails}>
                <Text style={styles.dataValue}>{s.dureeSommeil.toFixed(1)}h</Text>
                <Text style={styles.dataLabel}>Qualité {s.qualiteSommeil}/5</Text>
              </View>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

// Composant pour la section repas
const MealsSection = ({ repas, isContinuation = false }: { repas: any[]; isContinuation?: boolean }) => {
  if (repas.length === 0) {
    return null;
  }

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>
        Repas ({repas.length}) {isContinuation ? '(suite)' : ''}
      </Text>
      <View style={styles.sectionDivider} />
      
      <View style={styles.dataTable}>
        <View style={styles.tableHeader}>
          <Text style={styles.tableHeaderCell}>Date</Text>
          <Text style={styles.tableHeaderCell}>Type</Text>
          <Text style={styles.tableHeaderCell}>Calories</Text>
        </View>
        
        {repas.map((r: any, idx: number) => (
          <View key={`meal-${idx}`} style={[styles.tableRow, idx % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd]}>
            <Text style={styles.tableCell}>{new Date(r.date).toLocaleDateString('fr-FR', {day: '2-digit', month: '2-digit', year: 'numeric'})}</Text>
            <Text style={styles.tableCell}>{r.typeRepas}</Text>
            <Text style={styles.tableCell}>{(r.calories || 0).toFixed(0)} cal</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

// Composant pour la section activités
const ActivitiesSection = ({ activites, isContinuation = false }: { activites: any[]; isContinuation?: boolean }) => {
  if (activites.length === 0) {
    return null;
  }

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>
        Activités ({activites.length}) {isContinuation ? '(suite)' : ''}
      </Text>
      <View style={styles.sectionDivider} />
      
      <View style={styles.dataTable}>
        <View style={styles.tableHeader}>
          <Text style={styles.tableHeaderCell}>Date</Text>
          <Text style={styles.tableHeaderCell}>Type</Text>
          <Text style={styles.tableHeaderCell}>Durée</Text>
          <Text style={styles.tableHeaderCell}>Intensité</Text>
        </View>
        
        {activites.map((a: any, idx: number) => (
          <View key={`act-${idx}`} style={[styles.tableRow, idx % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd]}>
            <Text style={styles.tableCell}>{new Date(a.date).toLocaleDateString('fr-FR', {day: '2-digit', month: '2-digit', year: 'numeric'})}</Text>
            <Text style={styles.tableCell}>{a.typeActivite}</Text>
            <Text style={styles.tableCell}>{parseInt(a.duree, 10)} min</Text>
            <Text style={styles.tableCell}>{a.intensite}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

// Composant pour la section objectifs
const GoalsSection = ({ objectifs, isContinuation = false }: { objectifs: any[]; isContinuation?: boolean }) => {
  if (objectifs.length === 0) {
    return null;
  }

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>
        Objectifs ({objectifs.length}) {isContinuation ? '(suite)' : ''}
      </Text>
      <View style={styles.sectionDivider} />
      
      <View style={styles.dataTable}>
        <View style={styles.tableHeader}>
          <Text style={styles.tableHeaderCell}>Type</Text>
          <Text style={styles.tableHeaderCell}>Actuel</Text>
          <Text style={styles.tableHeaderCell}>Cible</Text>
          <Text style={styles.tableHeaderCell}>Période</Text>
          <Text style={styles.tableHeaderCell}>Statut</Text>
        </View>
        
        {objectifs.map((o: any, idx: number) => {
          const actuel = typeof o.valeurActuelle === 'number' ? o.valeurActuelle.toFixed(1) : o.valeurActuelle;
          const cible = typeof o.valeurCible === 'number' ? o.valeurCible.toFixed(1) : o.valeurCible;
          const debut = new Date(o.dateDebut).toLocaleDateString('fr-FR', {day: '2-digit', month: '2-digit', year: 'numeric'});
          const fin = new Date(o.dateFinSouhaitee).toLocaleDateString('fr-FR', {day: '2-digit', month: '2-digit', year: 'numeric'});
          
          let statut = "En cours";
          if (typeof o.valeurActuelle === 'number' && typeof o.valeurCible === 'number') {
            if (o.valeurActuelle >= o.valeurCible) {
              statut = "Atteint";
            }
          }
          
          return (
            <View key={`obj-${idx}`} style={[styles.tableRow, idx % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd]}>
              <Text style={styles.tableCell}>{o.type}</Text>
              <Text style={styles.tableCell}>{actuel}</Text>
              <Text style={styles.tableCell}>{cible}</Text>
              <Text style={styles.tableCell}>{debut} - {fin}</Text>
              <Text style={[styles.tableCell, styles.statusCell, statut === "Atteint" ? styles.statusSuccess : styles.statusPending]}>
                {statut}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

// Fonction pour calculer la hauteur estimée d'une section
const estimateSectionHeight = (sectionType: 'sleep' | 'meals' | 'activities' | 'goals', dataLength: number): number => {
  const baseHeights = {
    sleep: 120, // Hauteur de base pour la section sommeil
    meals: 100, // Hauteur de base pour la section repas
    activities: 100, // Hauteur de base pour la section activités
    goals: 100 // Hauteur de base pour la section objectifs
  };

  const itemHeights = {
    sleep: 40, // Hauteur par carte de sommeil
    meals: 25, // Hauteur par ligne de repas
    activities: 25, // Hauteur par ligne d'activité
    goals: 25 // Hauteur par ligne d'objectif
  };

  return baseHeights[sectionType] + (dataLength * itemHeights[sectionType]);
};

// Fonction pour paginer intelligemment les données
const paginateData = (data: ExportPayload) => {
  const pages: Array<{
    pageNumber: number;
    sections: Array<{
      type: 'sleep' | 'meals' | 'activities' | 'goals';
      data: any[];
      isContinuation?: boolean;
    }>;
  }> = [];

  // Hauteur maximale disponible par page (en unités PDF approximatives)
  const MAX_PAGE_HEIGHT = 600;
  // Hauteur déjà utilisée sur la première page (en-tête + profil)
  const FIRST_PAGE_USED_HEIGHT = 300;

  const allSections = [
    { type: 'sleep' as const, data: data.sommeil },
    { type: 'meals' as const, data: data.repas },
    { type: 'activities' as const, data: data.activites },
    { type: 'goals' as const, data: data.objectifs }
  ].filter(section => section.data.length > 0);

  let currentPageNumber = 1;
  let currentPageHeight = currentPageNumber === 1 ? FIRST_PAGE_USED_HEIGHT : 0;
  let currentPageSections: any[] = [];
  
  // Pour suivre quelles données ont déjà été affichées
  const displayedData = {
    sleep: 0,
    meals: 0,
    activities: 0,
    goals: 0
  };

  // Fonction pour ajouter une section à la page actuelle
  const addSectionToPage = (sectionType: 'sleep' | 'meals' | 'activities' | 'goals', data: any[], isContinuation = false) => {
    const sectionHeight = estimateSectionHeight(sectionType, data.length);
    
    // Si c'est la première page et qu'on a encore de la place, ou si c'est une page suivante
    if (currentPageHeight + sectionHeight <= MAX_PAGE_HEIGHT) {
      currentPageSections.push({
        type: sectionType,
        data: data,
        isContinuation: isContinuation
      });
      currentPageHeight += sectionHeight;
      return true;
    }
    return false;
  };

  // Fonction pour finaliser la page actuelle et passer à la suivante
  const finalizeCurrentPage = () => {
    if (currentPageSections.length > 0) {
      pages.push({
        pageNumber: currentPageNumber,
        sections: [...currentPageSections]
      });
      currentPageNumber++;
      currentPageSections = [];
      currentPageHeight = 0; // Les pages suivantes n'ont pas l'en-tête
    }
  };

  // Première page - on essaie d'ajouter autant de sections complètes que possible
  for (const section of allSections) {
    const remainingData = section.data.slice(displayedData[section.type]);
    if (remainingData.length > 0) {
      const added = addSectionToPage(section.type, remainingData, displayedData[section.type] > 0);
      if (added) {
        displayedData[section.type] += remainingData.length;
      }
    }
  }

  // Finaliser la première page
  finalizeCurrentPage();

  // Pages suivantes - on continue avec les données restantes
  let hasRemainingData = true;
  while (hasRemainingData) {
    hasRemainingData = false;
    
    for (const section of allSections) {
      const remainingData = section.data.slice(displayedData[section.type]);
      if (remainingData.length > 0) {
        hasRemainingData = true;
        const added = addSectionToPage(section.type, remainingData, displayedData[section.type] > 0);
        
        if (added) {
          displayedData[section.type] += remainingData.length;
        } else {
          // Si on ne peut pas ajouter cette section, on finalise la page actuelle
          finalizeCurrentPage();
          // Et on réessaie d'ajouter la section sur la nouvelle page
          const retryData = section.data.slice(displayedData[section.type]);
          if (retryData.length > 0) {
            addSectionToPage(section.type, retryData, displayedData[section.type] > 0);
            displayedData[section.type] += retryData.length;
          }
        }
      }
    }
    
    // Finaliser la page après avoir traité toutes les sections
    finalizeCurrentPage();
  }

  return pages;
};

// Composant principal avec pagination intelligente
export const UserReport: React.FC<Props> = ({ data, periodLabel }) => {
  const { user, meta } = data;
  
  // Paginer les données
  const paginatedPages = paginateData(data);
  const totalPages = paginatedPages.length;

  // Si aucune donnée n'est disponible
  if (totalPages === 0) {
    return (
      <Document>
        <Page size="A4" style={styles.page}>
          <Footer pageNumber={1} totalPages={1} />
          <Header user={user} periodLabel={periodLabel} meta={meta} />
          <ProfileSection user={user} />
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Aucune donnée disponible</Text>
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                Aucune donnée de suivi n'est disponible pour la période sélectionnée.
              </Text>
            </View>
          </View>
        </Page>
      </Document>
    );
  }

  return (
    <Document>
      {paginatedPages.map((page, pageIndex) => (
        <Page key={`page-${pageIndex + 1}`} size="A4" style={styles.page}>
          <Footer pageNumber={pageIndex + 1} totalPages={totalPages} />
          
          {/* Afficher l'en-tête et le profil seulement sur la première page */}
          {pageIndex === 0 && (
            <>
              <Header user={user} periodLabel={periodLabel} meta={meta} />
              <ProfileSection user={user} />
            </>
          )}
          
          {/* Afficher les sections de la page */}
          {page.sections.map((section, sectionIndex) => {
            switch (section.type) {
              case 'sleep':
                return <SleepSection key={`sleep-${pageIndex}-${sectionIndex}`} sommeil={section.data} isContinuation={section.isContinuation} />;
              case 'meals':
                return <MealsSection key={`meals-${pageIndex}-${sectionIndex}`} repas={section.data} isContinuation={section.isContinuation} />;
              case 'activities':
                return <ActivitiesSection key={`activities-${pageIndex}-${sectionIndex}`} activites={section.data} isContinuation={section.isContinuation} />;
              case 'goals':
                return <GoalsSection key={`goals-${pageIndex}-${sectionIndex}`} objectifs={section.data} isContinuation={section.isContinuation} />;
              default:
                return null;
            }
          })}

          {/* Indication de continuation si nécessaire */}
          {pageIndex < paginatedPages.length - 1 && (
            <Text style={styles.continuationText}>
              Suite des données à la page suivante...
            </Text>
          )}
        </Page>
      ))}
    </Document>
  );
};
