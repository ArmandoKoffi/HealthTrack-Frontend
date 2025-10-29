import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font, Svg, Path } from '@react-pdf/renderer';

// Enregistrement des polices pour améliorer la typographie
Font.register({
  family: 'Inter',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.ttf', fontWeight: 400 },
    { src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuFuYAZ9hjp-Ek-_EeA.ttf', fontWeight: 500 },
    { src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYAZ9hjp-Ek-_EeA.ttf', fontWeight: 600 },
    { src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuFuYAZ9hjp-Ek-_EeA.ttf', fontWeight: 700 },
  ],
});

// Police pour les titres
Font.register({
  family: 'Poppins',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/poppins/v20/pxiEyp8kv8JHgFVrJJfedw.ttf', fontWeight: 400 },
    { src: 'https://fonts.gstatic.com/s/poppins/v20/pxiByp8kv8JHgFVrLEj6Z1xlEA.ttf', fontWeight: 600 },
    { src: 'https://fonts.gstatic.com/s/poppins/v20/pxiByp8kv8JHgFVrLCz7Z1xlEA.ttf', fontWeight: 700 },
  ],
});

// Styles professionnels pour le PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    padding: 30,
    paddingBottom: 50, // Espace pour le pied de page
    backgroundColor: '#F9FAFC', // Fond légèrement bleuté pour un aspect corporate
    fontFamily: 'Inter',
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
    fontFamily: 'Poppins',
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

// Ajout de styles pour le pied de page
const Footer = ({ pageNumber, totalPages }: { pageNumber: number; totalPages: number }) => (
  <View style={styles.footer} fixed>
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

export const UserReport: React.FC<Props> = ({ data, periodLabel }) => {
  const { user, sommeil, repas, activites, objectifs, meta } = data;
  return (
    <Document>
      <Page 
        size="A4" 
        style={styles.page}
      >
        <View render={({ pageNumber, totalPages }) => (
          <Footer pageNumber={pageNumber} totalPages={totalPages} />
        )} fixed />
        <View style={styles.header} fixed>
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

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sommeil ({sommeil.length})</Text>
          <View style={styles.sectionDivider} />
          
          <View style={styles.dataGrid}>
            {sommeil.slice(0, 20).map((s: any, idx: number) => (
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
          {sommeil.length > 20 && <Text style={styles.chip}>+ {sommeil.length - 20} entrées</Text>}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Repas ({repas.length})</Text>
          <View style={styles.sectionDivider} />
          
          <View style={styles.dataTable}>
            <View style={styles.tableHeader}>
              <Text style={styles.tableHeaderCell}>Date</Text>
              <Text style={styles.tableHeaderCell}>Type</Text>
              <Text style={styles.tableHeaderCell}>Calories</Text>
            </View>
            
            {repas.slice(0, 15).map((r: any, idx: number) => (
              <View key={`meal-${idx}`} style={[styles.tableRow, idx % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd]}>
                <Text style={styles.tableCell}>{new Date(r.date).toLocaleDateString('fr-FR', {day: '2-digit', month: '2-digit', year: 'numeric'})}</Text>
                <Text style={styles.tableCell}>{r.typeRepas}</Text>
                <Text style={styles.tableCell}>{(r.calories || 0).toFixed(0)} cal</Text>
              </View>
            ))}
          </View>
          {repas.length > 15 && <Text style={styles.chip}>+ {repas.length - 15} entrées</Text>}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Activités ({activites.length})</Text>
          <View style={styles.sectionDivider} />
          
          <View style={styles.dataTable}>
            <View style={styles.tableHeader}>
              <Text style={styles.tableHeaderCell}>Date</Text>
              <Text style={styles.tableHeaderCell}>Type</Text>
              <Text style={styles.tableHeaderCell}>Durée</Text>
              <Text style={styles.tableHeaderCell}>Intensité</Text>
            </View>
            
            {activites.slice(0, 15).map((a: any, idx: number) => (
              <View key={`act-${idx}`} style={[styles.tableRow, idx % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd]}>
                <Text style={styles.tableCell}>{new Date(a.date).toLocaleDateString('fr-FR', {day: '2-digit', month: '2-digit', year: 'numeric'})}</Text>
                <Text style={styles.tableCell}>{a.typeActivite}</Text>
                <Text style={styles.tableCell}>{parseInt(a.duree, 10)} min</Text>
                <Text style={styles.tableCell}>{a.intensite}</Text>
              </View>
            ))}
          </View>
          {activites.length > 15 && <Text style={styles.chip}>+ {activites.length - 15} entrées</Text>}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Objectifs ({objectifs.length})</Text>
          <View style={styles.sectionDivider} />
          
          <View style={styles.dataTable}>
            <View style={styles.tableHeader}>
              <Text style={styles.tableHeaderCell}>Type</Text>
              <Text style={styles.tableHeaderCell}>Actuel</Text>
              <Text style={styles.tableHeaderCell}>Cible</Text>
              <Text style={styles.tableHeaderCell}>Période</Text>
              <Text style={styles.tableHeaderCell}>Statut</Text>
            </View>
            
            {objectifs.slice(0, 15).map((o: any, idx: number) => {
              const actuel = typeof o.valeurActuelle === 'number' ? o.valeurActuelle.toFixed(1) : o.valeurActuelle;
              const cible = typeof o.valeurCible === 'number' ? o.valeurCible.toFixed(1) : o.valeurCible;
              const debut = new Date(o.dateDebut).toLocaleDateString('fr-FR', {day: '2-digit', month: '2-digit', year: 'numeric'});
              const fin = new Date(o.dateFinSouhaitee).toLocaleDateString('fr-FR', {day: '2-digit', month: '2-digit', year: 'numeric'});
              
              // Calcul simple du statut
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
          {objectifs.length > 15 && <Text style={styles.chip}>+ {objectifs.length - 15} objectifs</Text>}
        </View>
      </Page>
    </Document>
  );
};
