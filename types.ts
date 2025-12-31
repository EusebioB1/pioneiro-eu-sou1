
export enum PioneerType {
  REGULAR = 'Regular',
  AUXILIAR = 'Auxiliar'
}

export interface UserProfile {
  name: string;
  photo?: string; // Base64 encoded image
  congregation: string;
  groupNumber: string;
  type: PioneerType;
  goals: {
    annual: number;
    monthly: number;
    weekly: number;
  };
  onboarded: boolean;
  reminderTime: string;
  remindersEnabled: boolean;
  lastReminderSent?: string; // YYYY-MM-DD
}

export interface ServiceEntry {
  id: string;
  date: string;
  minutes: number;
  note?: string;
}

export interface BibleStudy {
  id: string;
  name: string;
  month: string; // YYYY-MM
  sessions: number;
  notes?: string;
}

export interface DayPlan {
  day: number; // 0-6 (Sun-Sat)
  active: boolean;
  minutes: number;
}

export interface AppState {
  profile: UserProfile;
  serviceEntries: ServiceEntry[];
  bibleStudies: BibleStudy[];
  weeklyPlans: DayPlan[];
}
