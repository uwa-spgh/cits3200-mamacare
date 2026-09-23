
export type GestationSource = 'auto' | 'edd' | 'lmp';
export type ResolvedGestationSource = 'edd' | 'lmp';

export interface DataState {
  language: string;
  userName: string;
  edd: string;
  lmp: string;
  gestationSource: GestationSource;
  birthDate: string;
  dismissedBirthPromptAt: string;
}

export interface GestationalAge {
  weeks: number;
  days: number;
  totalDays: number;
  source: ResolvedGestationSource;
  isPostpartum: boolean;
  isCapped: boolean;
}

export interface BabyAge {
  days: number;
  weeks: number;
}

export type BirthClassification = 'preterm' | 'term' | 'post-term';