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

// Composant pour la section sommeil avec pagination
const SleepSection = ({ sommeil, startIndex = 0 }: { sommeil: any[]; startIndex?: number }) => {
  const itemsPerPage = 20;
  const currentPageData = sommeil.slice(startIndex, startIndex + itemsPerPage);
  const hasMore = sommeil.length > startIndex + itemsPerPage;

  if (currentPageData.length === 0) {
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sommeil (0)</Text>
        <View style={styles.sectionDivider} />
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>Aucune donnée de sommeil disponible</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>
        Sommeil ({sommeil.length}) {startIndex > 0 ? `(suite ${Math.floor(startIndex/itemsPerPage) + 1})` : ''}
      </Text>
      <View style={styles.sectionDivider} />
      
      <View style={styles.dataGrid}>
        {currentPageData.map((s: any, idx: number) => (
          <View key={`sleep-${startIndex + idx}`} style={styles.dataGridItem}>
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
      {hasMore && <Text style={styles.chip}>+ {sommeil.length - (startIndex + itemsPerPage)} entrées supplémentaires</Text>}
    </View>
  );
};

// Composant pour la section repas avec pagination
const MealsSection = ({ repas, startIndex = 0 }: { repas: any[]; startIndex?: number }) => {
  const itemsPerPage = 15;
  const currentPageData = repas.slice(startIndex, startIndex + itemsPerPage);
  const hasMore = repas.length > startIndex + itemsPerPage;

  if (currentPageData.length === 0 && startIndex === 0) {
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Repas (0)</Text>
        <View style={styles.sectionDivider} />
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>Aucun repas enregistré</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>
        Repas ({repas.length}) {startIndex > 0 ? `(suite ${Math.floor(startIndex/itemsPerPage) + 1})` : ''}
      </Text>
      <View style={styles.sectionDivider} />
      
      <View style={styles.dataTable}>
        <View style={styles.tableHeader}>
          <Text style={styles.tableHeaderCell}>Date</Text>
          <Text style={styles.tableHeaderCell}>Type</Text>
          <Text style={styles.tableHeaderCell}>Calories</Text>
        </View>
        
        {currentPageData.map((r: any, idx: number) => (
          <View key={`meal-${startIndex + idx}`} style={[styles.tableRow, (startIndex + idx) % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd]}>
            <Text style={styles.tableCell}>{new Date(r.date).toLocaleDateString('fr-FR', {day: '2-digit', month: '2-digit', year: 'numeric'})}</Text>
            <Text style={styles.tableCell}>{r.typeRepas}</Text>
            <Text style={styles.tableCell}>{(r.calories || 0).toFixed(0)} cal</Text>
          </View>
        ))}
      </View>
      {hasMore && <Text style={styles.chip}>+ {repas.length - (startIndex + itemsPerPage)} entrées supplémentaires</Text>}
    </View>
  );
};

// Composant pour la section activités avec pagination
const ActivitiesSection = ({ activites, startIndex = 0 }: { activites: any[]; startIndex?: number }) => {
  const itemsPerPage = 15;
  const currentPageData = activites.slice(startIndex, startIndex + itemsPerPage);
  const hasMore = activites.length > startIndex + itemsPerPage;

  if (currentPageData.length === 0 && startIndex === 0) {
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Activités (0)</Text>
        <View style={styles.sectionDivider} />
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>Aucune activité enregistrée</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>
        Activités ({activites.length}) {startIndex > 0 ? `(suite ${Math.floor(startIndex/itemsPerPage) + 1})` : ''}
      </Text>
      <View style={styles.sectionDivider} />
      
      <View style={styles.dataTable}>
        <View style={styles.tableHeader}>
          <Text style={styles.tableHeaderCell}>Date</Text>
          <Text style={styles.tableHeaderCell}>Type</Text>
          <Text style={styles.tableHeaderCell}>Durée</Text>
          <Text style={styles.tableHeaderCell}>Intensité</Text>
        </View>
        
        {currentPageData.map((a: any, idx: number) => (
          <View key={`act-${startIndex + idx}`} style={[styles.tableRow, (startIndex + idx) % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd]}>
            <Text style={styles.tableCell}>{new Date(a.date).toLocaleDateString('fr-FR', {day: '2-digit', month: '2-digit', year: 'numeric'})}</Text>
            <Text style={styles.tableCell}>{a.typeActivite}</Text>
            <Text style={styles.tableCell}>{parseInt(a.duree, 10)} min</Text>
            <Text style={styles.tableCell}>{a.intensite}</Text>
          </View>
        ))}
      </View>
      {hasMore && <Text style={styles.chip}>+ {activites.length - (startIndex + itemsPerPage)} entrées supplémentaires</Text>}
    </View>
  );
};

// Composant pour la section objectifs avec pagination
const GoalsSection = ({ objectifs, startIndex = 0 }: { objectifs: any[]; startIndex?: number }) => {
  const itemsPerPage = 15;
  const currentPageData = objectifs.slice(startIndex, startIndex + itemsPerPage);
  const hasMore = objectifs.length > startIndex + itemsPerPage;

  if (currentPageData.length === 0 && startIndex === 0) {
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Objectifs (0)</Text>
        <View style={styles.sectionDivider} />
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>Aucun objectif défini</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>
        Objectifs ({objectifs.length}) {startIndex > 0 ? `(suite ${Math.floor(startIndex/itemsPerPage) + 1})` : ''}
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
        
        {currentPageData.map((o: any, idx: number) => {
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
            <View key={`obj-${startIndex + idx}`} style={[styles.tableRow, (startIndex + idx) % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd]}>
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
      {hasMore && <Text style={styles.chip}>+ {objectifs.length - (startIndex + itemsPerPage)} objectifs supplémentaires</Text>}
    </View>
  );
};

// Fonction pour calculer le nombre total de pages nécessaires
const calculateTotalPages = (data: ExportPayload) => {
  let totalPages = 1; // Première page avec en-tête et profil
  
  // Pages pour sommeil (20 items par page)
  const sleepPages = Math.ceil(data.sommeil.length / 20);
  totalPages += sleepPages;
  
  // Pages pour repas (15 items par page)
  const mealsPages = Math.ceil(data.repas.length / 15);
  totalPages += mealsPages;
  
  // Pages pour activités (15 items par page)
  const activitiesPages = Math.ceil(data.activites.length / 15);
  totalPages += activitiesPages;
  
  // Pages pour objectifs (15 items par page)
  const goalsPages = Math.ceil(data.objectifs.length / 15);
  totalPages += goalsPages;
  
  return Math.max(1, totalPages); // Au moins 1 page
};

// Composant principal avec pagination automatique
export const UserReport: React.FC<Props> = ({ data, periodLabel }) => {
  const { user, sommeil, repas, activites, objectifs, meta } = data;
  
  // Calcul du nombre total de pages
  const totalPages = calculateTotalPages(data);
  
  // Génération des pages
  const pages: JSX.Element[] = [];
  let currentPage = 1;
  
  // Première page avec en-tête et profil
  pages.push(
    <Page key="page-1" size="A4" style={styles.page}>
      <Footer pageNumber={currentPage} totalPages={totalPages} />
      <Header user={user} periodLabel={periodLabel} meta={meta} />
      <ProfileSection user={user} />
      {sommeil.length > 0 && <SleepSection sommeil={sommeil} />}
    </Page>
  );
  currentPage++;
  
  // Pages supplémentaires pour sommeil
  for (let i = 20; i < sommeil.length; i += 20) {
    pages.push(
      <Page key={`sleep-page-${currentPage}`} size="A4" style={styles.page}>
        <Footer pageNumber={currentPage} totalPages={totalPages} />
        <SleepSection sommeil={sommeil} startIndex={i} />
      </Page>
    );
    currentPage++;
  }
  
  // Pages pour repas
  for (let i = 0; i < repas.length; i += 15) {
    pages.push(
      <Page key={`meals-page-${currentPage}`} size="A4" style={styles.page}>
        <Footer pageNumber={currentPage} totalPages={totalPages} />
        <MealsSection repas={repas} startIndex={i} />
      </Page>
    );
    currentPage++;
  }
  
  // Pages pour activités
  for (let i = 0; i < activites.length; i += 15) {
    pages.push(
      <Page key={`activities-page-${currentPage}`} size="A4" style={styles.page}>
        <Footer pageNumber={currentPage} totalPages={totalPages} />
        <ActivitiesSection activites={activites} startIndex={i} />
      </Page>
    );
    currentPage++;
  }
  
  // Pages pour objectifs
  for (let i = 0; i < objectifs.length; i += 15) {
    pages.push(
      <Page key={`goals-page-${currentPage}`} size="A4" style={styles.page}>
        <Footer pageNumber={currentPage} totalPages={totalPages} />
        <GoalsSection objectifs={objectifs} startIndex={i} />
      </Page>
    );
    currentPage++;
  }
  
  // Si aucune donnée n'est présente après la première page, on supprime les pages vides
  const filteredPages = pages.filter((page, index) => {
    if (index === 0) return true; // Toujours garder la première page
    return true; // Pour l'instant on garde toutes les pages, vous pouvez ajuster si nécessaire
  });

  return (
    <Document>
      {filteredPages.length > 0 ? filteredPages : (
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
      )}
    </Document>
  );
};
