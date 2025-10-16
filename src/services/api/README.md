# 📡 Services API Frontend HealthTrack

## 🚀 Vue d'ensemble

Ce dossier contient tous les services API frontend pour communiquer avec le backend HealthTrack. Les services sont organisés de manière modulaire et fournissent une interface TypeScript sécurisée pour toutes les opérations d'authentification et de gestion de profil.

## 📁 Structure des Services

### **Configuration**
- **`config.ts`** - Configuration globale de l'API et utilitaires
- **`index.ts`** - Export centralisé de tous les services

### **Services d'Authentification**
- **`authService.ts`** - Inscription, connexion, réinitialisation de mot de passe

### **Services de Profil**
- **`profileService.ts`** - Gestion du profil, statistiques, changement de mot de passe

## 🔧 Utilisation des Services

### **Importation des Services**

```typescript
// Import de tous les services
import { 
  authService, 
  profileService, 
  initializeAuth,
  handleAuthError 
} from '@/services/api';

// Import spécifique
import { authService } from '@/services/api/authService';
import { profileService } from '@/services/api/profileService';
```

---

## 🔐 Service d'Authentification (`authService`)

### **Inscription d'un utilisateur**

```typescript
import { authService, type RegisterData } from '@/services/api';

const registerData: RegisterData = {
  email: 'utilisateur@example.com',
  password: 'MotDePasse123',
  confirmPassword: 'MotDePasse123',
  nom: 'Dupont',
  prenom: 'Jean',
  dateNaissance: '1990-01-01',
  poids: 75.5,
  taille: 180
};

try {
  const result = await authService.register(registerData);
  
  if (result.success) {
    // Sauvegarder le token
    authService.saveToken(result.token!);
    // Sauvegarder les données utilisateur
    profileService.saveUserData(result.user!);
    
    console.log('Inscription réussie:', result.message);
  }
} catch (error) {
  console.error('Erreur d\'inscription:', error.message);
}
```

### **Connexion d'un utilisateur**

```typescript
import { authService, type LoginData } from '@/services/api';

const loginData: LoginData = {
  email: 'utilisateur@example.com',
  password: 'MotDePasse123'
};

try {
  const result = await authService.login(loginData);
  
  if (result.success) {
    authService.saveToken(result.token!);
    profileService.saveUserData(result.user!);
    
    console.log('Connexion réussie:', result.message);
  }
} catch (error) {
  console.error('Erreur de connexion:', error.message);
}
```

### **Mot de passe oublié**

```typescript
import { authService } from '@/services/api';

try {
  const result = await authService.forgotPassword({
    email: 'utilisateur@example.com'
  });
  
  if (result.success) {
    console.log('Email de réinitialisation envoyé');
  }
} catch (error) {
  console.error('Erreur:', error.message);
}
```

### **Réinitialisation du mot de passe**

```typescript
import { authService } from '@/services/api';

try {
  const result = await authService.resetPassword({
    token: 'token_from_email',
    newPassword: 'NouveauMotDePasse123',
    confirmPassword: 'NouveauMotDePasse123'
  });
  
  if (result.success) {
    authService.saveToken(result.token!);
    profileService.saveUserData(result.user!);
    
    console.log('Mot de passe réinitialisé avec succès');
  }
} catch (error) {
  console.error('Erreur de réinitialisation:', error.message);
}
```

### **Vérification du token**

```typescript
import { authService } from '@/services/api';

const token = authService.getToken();

if (token) {
  try {
    const result = await authService.verifyToken(token);
    
    if (result.success) {
      console.log('Token valide, utilisateur:', result.user);
    }
  } catch (error) {
    console.error('Token invalide:', error.message);
    authService.logout();
  }
}
```

---

## 👤 Service de Profil (`profileService`)

### **Récupération du profil**

```typescript
import { profileService } from '@/services/api';

const token = authService.getToken();

if (token) {
  try {
    const result = await profileService.getProfile(token);
    
    if (result.success && result.user) {
      console.log('Profil utilisateur:', result.user);
    }
  } catch (error) {
    console.error('Erreur de récupération du profil:', error.message);
  }
}
```

### **Mise à jour du profil**

```typescript
import { profileService } from '@/services/api';

const token = authService.getToken();

if (token) {
  try {
    // Validation côté client
    const errors = profileService.validateProfileUpdate({
      nom: 'NouveauNom',
      prenom: 'NouveauPrenom',
      email: 'nouvel@email.com',
      poids: 72.5
    });
    
    if (errors.length > 0) {
      console.error('Erreurs de validation:', errors);
      return;
    }
    
    const result = await profileService.updateProfile({
      nom: 'NouveauNom',
      prenom: 'NouveauPrenom',
      email: 'nouvel@email.com',
      poids: 72.5
    }, token);
    
    if (result.success) {
      profileService.saveUserData(result.user!);
      console.log('Profil mis à jour avec succès');
    }
  } catch (error) {
    console.error('Erreur de mise à jour:', error.message);
  }
}
```

### **Changement de mot de passe**

```typescript
import { profileService } from '@/services/api';

const token = authService.getToken();

if (token) {
  try {
    // Validation côté client
    const errors = profileService.validatePasswordChange({
      currentPassword: 'AncienMotDePasse123',
      newPassword: 'NouveauMotDePasse123',
      confirmPassword: 'NouveauMotDePasse123'
    });
    
    if (errors.length > 0) {
      console.error('Erreurs de validation:', errors);
      return;
    }
    
    const result = await profileService.changePassword({
      currentPassword: 'AncienMotDePasse123',
      newPassword: 'NouveauMotDePasse123',
      confirmPassword: 'NouveauMotDePasse123'
    }, token);
    
    if (result.success) {
      console.log('Mot de passe changé avec succès');
    }
  } catch (error) {
    console.error('Erreur de changement de mot de passe:', error.message);
  }
}
```

### **Récupération des statistiques**

```typescript
import { profileService } from '@/services/api';

const token = authService.getToken();

if (token) {
  try {
    const result = await profileService.getProfileStats(token);
    
    if (result.success && result.stats) {
      console.log('Statistiques du profil:', result.stats);
      // {
      //   age: 34,
      //   imc: 22.2,
      //   imcCategorie: { label: 'Poids normal', color: 'text-success' },
      //   poidsActuel: 72.5,
      //   objectifPoids: 70,
      //   poidsRestant: 2.5,
      //   taille: 181
      // }
    }
  } catch (error) {
    console.error('Erreur de récupération des statistiques:', error.message);
  }
}
```

---

## 🛠️ Utilitaires Globaux

### **Initialisation de l'authentification**

```typescript
import { initializeAuth } from '@/services/api';

// Au démarrage de l'application
const { isAuthenticated, user } = await initializeAuth();

if (isAuthenticated) {
  console.log('Utilisateur connecté:', user);
  // Rediriger vers le dashboard
} else {
  console.log('Utilisateur non connecté');
  // Rediriger vers la page de connexion
}
```

### **Gestion des erreurs d'authentification**

```typescript
import { handleAuthError } from '@/services/api';

try {
  // Opération API
  await someApiCall();
} catch (error) {
  // Gestion automatique des erreurs d'authentification
  handleAuthError(error);
  
  // Autres traitements d'erreur
  console.error('Erreur:', error.message);
}
```

### **Requête API générique**

```typescript
import { apiRequest } from '@/services/api';

// GET request
const data = await apiRequest('/some-endpoint');

// POST request
const result = await apiRequest('/some-endpoint', {
  method: 'POST',
  body: JSON.stringify({ key: 'value' })
});
```

---

## 🔒 Gestion de l'État d'Authentification

### **Vérification de l'état de connexion**

```typescript
import { authService } from '@/services/api';

// Vérifier si l'utilisateur est connecté
const isAuthenticated = authService.isAuthenticated();

// Récupérer le token
const token = authService.getToken();

// Récupérer les données utilisateur
const userData = profileService.getUserData();
```

### **Déconnexion**

```typescript
import { authService, profileService } from '@/services/api';

// Déconnexion complète
authService.logout();
profileService.clearUserData();

// Redirection vers la page de connexion
window.location.href = '/login';
```

---

## 🎯 Bonnes Pratiques

### **1. Gestion des Tokens**
- ✅ Toujours sauvegarder le token après une opération réussie
- ✅ Vérifier la validité du token au démarrage de l'application
- ✅ Supprimer le token en cas d'erreur d'authentification

### **2. Validation des Données**
- ✅ Utiliser la validation côté client avant d'envoyer les données
- ✅ Gérer les erreurs de validation de manière utilisateur-friendly
- ✅ Afficher des messages d'erreur clairs

### **3. Gestion des Erreurs**
- ✅ Intercepter toutes les erreurs d'API
- ✅ Utiliser `handleAuthError` pour les erreurs d'authentification
- ✅ Afficher des messages d'erreur appropriés

### **4. Performance**
- ✅ Éviter les appels API inutiles
- ✅ Utiliser le localStorage pour les données persistantes
- ✅ Mettre en cache les données fréquemment utilisées

---

## 🔄 Compatibilité Backend

Tous les services sont conçus pour être parfaitement compatibles avec le backend HealthTrack :

- ✅ **Endpoints alignés** avec les routes backend
- ✅ **Structure de données** cohérente
- ✅ **Gestion d'erreurs** standardisée
- ✅ **Tokens JWT** compatibles

---

**📅 Dernière mise à jour :** 16/10/2025  
**🔄 Version :** 1.0.0  
**🔒 Statut :** Production Ready
