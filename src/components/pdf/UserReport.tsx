import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

// Styles inspirés de la charte (verts et bleus, ombres légères)
const styles = StyleSheet.create({
  page: {
    padding: 24,
    backgroundColor: '#F6FAF7', // proche de background
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#E8F5E9', // accent clair
    borderRadius: 8,
  },
  title: {
    fontSize: 20,
    color: '#1F5132', // foreground proche
    fontWeight: 700,
  },
  subtitle: {
    fontSize: 12,
    color: '#4B6B57',
    marginTop: 4,
  },
  section: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderColor: '#DDE7DA',
    borderWidth: 1,
  },
  sectionTitle: {
    fontSize: 14,
    color: '#256D3A', // primary
    marginBottom: 8,
    fontWeight: 600,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  label: {
    fontSize: 11,
    color: '#587A66',
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
    marginTop: 6,
    fontSize: 10,
    color: '#1F5132',
  },
  listItem: {
    fontSize: 11,
    color: '#1F5132',
    marginBottom: 4,
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

export const UserReport: React.FC<Props> = ({ data, periodLabel }) => {
  const { user, sommeil, repas, activites, objectifs, meta } = data;
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Rapport HealthTrack</Text>
          <Text style={styles.subtitle}>
            Utilisateur: {user.prenom} {user.nom} · Période: {periodLabel || 'N/A'}
          </Text>
          <Text style={styles.chip}>Généré le: {new Date(meta.generatedAt).toLocaleDateString('fr-FR')}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profil</Text>
          <View style={styles.row}><Text style={styles.label}>Email</Text><Text style={styles.value}>{user.email}</Text></View>
          {user.dateNaissance && (
            <View style={styles.row}>
              <Text style={styles.label}>Date de naissance</Text>
              <Text style={styles.value}>
                {new Date(user.dateNaissance).toLocaleDateString('fr-FR', {day: '2-digit', month: '2-digit', year: 'numeric'})}
              </Text>
            </View>
          )}
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

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sommeil ({sommeil.length})</Text>
          {sommeil.slice(0, 20).map((s: any, idx: number) => (
            <Text key={`sleep-${idx}`} style={styles.listItem}>
              {new Date(s.date).toLocaleDateString('fr-FR', {day: '2-digit', month: '2-digit', year: 'numeric'})} · {s.dureeSommeil.toFixed(1)}h · Qualité {s.qualiteSommeil}/5
            </Text>
          ))}
          {sommeil.length > 20 && <Text style={styles.chip}>+ {sommeil.length - 20} entrées</Text>}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Repas ({repas.length})</Text>
          {repas.slice(0, 20).map((r: any, idx: number) => (
            <Text key={`meal-${idx}`} style={styles.listItem}>
              {new Date(r.date).toLocaleDateString('fr-FR', {day: '2-digit', month: '2-digit', year: 'numeric'})} · {r.typeRepas} · {(r.calories || 0).toFixed(0)} cal
            </Text>
          ))}
          {repas.length > 20 && <Text style={styles.chip}>+ {repas.length - 20} entrées</Text>}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Activités ({activites.length})</Text>
          {activites.slice(0, 20).map((a: any, idx: number) => (
            <Text key={`act-${idx}`} style={styles.listItem}>
              {new Date(a.date).toLocaleDateString('fr-FR', {day: '2-digit', month: '2-digit', year: 'numeric'})} · {a.typeActivite} · {parseInt(a.duree, 10)} min · {a.intensite}
            </Text>
          ))}
          {activites.length > 20 && <Text style={styles.chip}>+ {activites.length - 20} entrées</Text>}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Objectifs ({objectifs.length})</Text>
          {objectifs.slice(0, 20).map((o: any, idx: number) => (
            <Text key={`obj-${idx}`} style={styles.listItem}>
              {o.type} · Actuel {typeof o.valeurActuelle === 'number' ? o.valeurActuelle.toFixed(1) : o.valeurActuelle} / Cible {typeof o.valeurCible === 'number' ? o.valeurCible.toFixed(1) : o.valeurCible} · du {new Date(o.dateDebut).toLocaleDateString('fr-FR', {day: '2-digit', month: '2-digit', year: 'numeric'})} au {new Date(o.dateFinSouhaitee).toLocaleDateString('fr-FR', {day: '2-digit', month: '2-digit', year: 'numeric'})}
            </Text>
          ))}
          {objectifs.length > 20 && <Text style={styles.chip}>+ {objectifs.length - 20} objectifs</Text>}
        </View>
      </Page>
    </Document>
  );
};
