type PrivacyConsent = {
  partagerDonnees: boolean;
  analytiques: boolean;
  amelioration: boolean;
};

let consent: PrivacyConsent = {
  partagerDonnees: false,
  analytiques: true,
  amelioration: true,
};

function loadConsent(): PrivacyConsent {
  try {
    const raw = localStorage.getItem('privacyConsent');
    if (raw) {
      const parsed = JSON.parse(raw);
      consent = {
        partagerDonnees: !!parsed.partagerDonnees,
        analytiques: !!parsed.analytiques,
        amelioration: !!parsed.amelioration,
      };
    }
  } catch {}
  return consent;
}

function setConsent(partagerDonnees: boolean, analytiques: boolean, amelioration: boolean): void {
  consent = { partagerDonnees, analytiques, amelioration };
  try {
    localStorage.setItem('privacyConsent', JSON.stringify(consent));
  } catch {}
}

function trackEvent(eventName: string, data?: Record<string, unknown>): void {
  if (!consent.analytiques) return;
  // Ici on pourrait envoyer vers un vrai backend analytics ou un provider.
  // Pour l'instant, on journalise localement afin de respecter le consentement.
  console.debug('[analytics]', eventName, data || {});
}

function shareAnonymized(payload: Record<string, unknown>): void {
  if (!consent.partagerDonnees) return;
  // Implémentation placeholder: envoi potentiel vers un endpoint d'agrégation anonyme.
  console.debug('[share-anon]', payload);
}

function shouldShowSuggestions(): boolean {
  return !!consent.amelioration;
}

export const analyticsService = {
  loadConsent,
  setConsent,
  trackEvent,
  shareAnonymized,
  shouldShowSuggestions,
};