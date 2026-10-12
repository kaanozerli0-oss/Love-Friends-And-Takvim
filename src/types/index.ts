export type ThemeKey = 
  | 'velvet-rose' 
  | 'starry-night' 
  | 'vintage-poetry' 
  | 'sakura-blossom' 
  | 'emerald-garden';

export interface ThemeConfig {
  id: ThemeKey;
  name: string;
  tagline: string;
  bgGradient: string;
  cardBg: string;
  cardBorder: string;
  textColor: string;
  accentColor: string;
  accentHover: string;
  badgeBg: string;
  sealColor: string;
  glowColor: string;
}

export interface CoupleInfo {
  partnerName: string;
  yourName: string;
  relationshipStartDate: string; // YYYY-MM-DD
  anniversaryDate?: string;
  mainHeadline: string;
  subtitle: string;
  specialSongTitle?: string;
  spotifyLink?: string;
}

export interface LoveLetter {
  title: string;
  content: string;
  signature: string;
  postScript: string;
  sealType: 'rose' | 'heart' | 'crown';
}

export interface TimelineMoment {
  id: string;
  date: string;
  title: string;
  description: string;
  imageUrl?: string;
  category: string; // e.g. "İlk Buluşma", "Unutulmaz Gece", "Tatil", "Özel Gün"
}

export interface LoveVoucher {
  id: string;
  title: string;
  description: string;
  icon: string; // icon identifier
  isRedeemed: boolean;
  redeemedDate?: string;
}

export interface LoveReason {
  id: string;
  text: string;
}

export interface SecretSurprise {
  isEnabled: boolean;
  question: string;
  answer: string;
  hint: string;
  revealedMessage: string;
}

export interface GiftPageConfig {
  id: string;
  createdAt: string;
  theme: ThemeKey;
  couple: CoupleInfo;
  letter: LoveLetter;
  moments: TimelineMoment[];
  vouchers: LoveVoucher[];
  reasons: LoveReason[];
  surprise: SecretSurprise;
  backgroundMusic: {
    enabled: boolean;
    melody: 'piano-waltz' | 'lofi-twilight' | 'acoustic-warmth';
  };
}

// Planner Types
export interface PlannerTask {
  id: string;
  title: string;
  timeSlot: 'morning' | 'afternoon' | 'evening';
  isCompleted: boolean;
  priority: 'low' | 'medium' | 'high';
  category: 'personal' | 'work' | 'relationship' | 'health';
}

export interface PlannerHabit {
  id: string;
  name: string;
  icon: string;
  streak: number;
  completedDays: string[]; // YYYY-MM-DD
}

export interface SpecialEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  type: 'anniversary' | 'birthday' | 'date_night' | 'reminder';
  notes?: string;
}

export interface DailyJournal {
  date: string; // YYYY-MM-DD
  mainFocus: string;
  mood: 'joyful' | 'romantic' | 'calm' | 'busy' | 'tired';
  gratitudeNote: string;
  partnerThought: string;
}
