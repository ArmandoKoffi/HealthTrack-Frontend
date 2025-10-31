import { exportService } from '@/services/api/exportService';

export type BackupSettings = {
  autoBackup: boolean;
  frequence: 'daily' | 'weekly' | 'monthly';
};

type BackupStatus = {
  enabled: boolean;
  nextRun?: number; // timestamp ms
};

let timerId: number | null = null;
let currentSettings: BackupSettings = { autoBackup: false, frequence: 'weekly' };

const STORAGE_KEY = 'healthtrack_backup_settings';

function intervalForFrequency(freq: BackupSettings['frequence']): number {
  switch (freq) {
    case 'daily':
      return 24 * 60 * 60 * 1000;
    case 'weekly':
      return 7 * 24 * 60 * 60 * 1000;
    case 'monthly':
      return 30 * 24 * 60 * 60 * 1000;
    default:
      return 7 * 24 * 60 * 60 * 1000;
  }
}

function scheduleNextRun(msFromNow: number) {
  const next = Date.now() + msFromNow;
  try {
    localStorage.setItem(`${STORAGE_KEY}:nextRun`, String(next));
  } catch {}
  window.dispatchEvent(new CustomEvent('backupScheduleUpdated', { detail: { nextRun } }));
}

async function runBackupNow() {
  try {
    const resp = await exportService.getUserData();
    if (resp.success && resp.data) {
      const json = JSON.stringify(resp.data, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `healthtrack-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      window.dispatchEvent(new CustomEvent('backupCompleted', { detail: { success: true, message: 'Sauvegarde automatique effectuée' } }));
    } else {
      window.dispatchEvent(new CustomEvent('backupCompleted', { detail: { success: false, message: resp.message || 'Échec de la sauvegarde' } }));
    }
  } catch (e) {
    console.error('Erreur backup auto:', e);
    window.dispatchEvent(new CustomEvent('backupCompleted', { detail: { success: false, message: 'Erreur lors de la sauvegarde' } }));
  }
}

function startSchedule() {
  stopSchedule();
  if (!currentSettings.autoBackup) return;
  const interval = intervalForFrequency(currentSettings.frequence);
  // Première exécution planifiée à interval (pas immédiatement)
  scheduleNextRun(interval);
  timerId = window.setInterval(async () => {
    await runBackupNow();
    scheduleNextRun(interval);
  }, interval);
}

function stopSchedule() {
  if (timerId !== null) {
    clearInterval(timerId);
    timerId = null;
  }
}

export const backupService = {
  loadFromStorage(): BackupSettings | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (typeof parsed?.autoBackup === 'boolean' && ['daily','weekly','monthly'].includes(parsed?.frequence)) {
        return parsed as BackupSettings;
      }
    } catch {}
    return null;
  },

  getStatus(): BackupStatus {
    let nextRun: number | undefined;
    try {
      const raw = localStorage.getItem(`${STORAGE_KEY}:nextRun`);
      if (raw) nextRun = Number(raw);
    } catch {}
    return { enabled: currentSettings.autoBackup, nextRun };
  },

  setSchedule(settings: BackupSettings) {
    currentSettings = settings;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {}
    if (settings.autoBackup) startSchedule(); else stopSchedule();
  },

  runNow: runBackupNow,

  stop: stopSchedule,
};