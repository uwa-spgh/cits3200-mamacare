import { createSelector } from '@reduxjs/toolkit';
import {
  MS_PER_DAY,
  DAYS_FROM_LMP_TO_EDD,
  MAX_GESTATIONAL_DAYS,
  BIRTH_PROMPT_REDISMISS_DAYS,
} from '../constants/constants';
import type {
  GestationalAge,
  BabyAge,
  BirthClassification,
  ResolvedGestationSource,
} from '../types/types';

// Minimal shape of the relevant store slice
interface RootState {
  dataReducer: {
    edd: string;
    lmp: string;
    gestationSource: 'auto' | 'edd' | 'lmp';
    birthDate: string;
    dismissedBirthPromptAt: string;
  };
}

const startOfDay = (d: Date): Date => {
  const c = new Date(d);
  c.setHours(0, 0, 0, 0);
  return c;
};

const daysBetween = (a: Date, b: Date): number =>
  Math.round((a.getTime() - b.getTime()) / MS_PER_DAY);

// --- Source resolution -----------------------------------------------------

export const selectGestationSource = createSelector(
  [
    (state: RootState) => state.dataReducer.edd,
    (state: RootState) => state.dataReducer.lmp,
    (state: RootState) => state.dataReducer.gestationSource,
  ],
  (
    edd: string,
    lmp: string,
    override: 'auto' | 'edd' | 'lmp'
  ): ResolvedGestationSource | null => {
    if (override !== 'auto') return override;
    if (edd) return 'edd';
    if (lmp) return 'lmp';
    return null;
  }
);

// --- Gestational age -------------------------------------------------------

export const selectGestationalAge = createSelector(
  [
    (state: RootState) => state.dataReducer.edd,
    (state: RootState) => state.dataReducer.lmp,
    (state: RootState) => state.dataReducer.birthDate,
    selectGestationSource,
  ],
  (
    edd: string,
    lmp: string,
    birthDate: string,
    source: ResolvedGestationSource | null
  ): GestationalAge | null => {
    if (!source) return null;

    const reference = birthDate ? startOfDay(new Date(birthDate)) : startOfDay(new Date());

    let gestationalDays: number;

    if (source === 'edd') {
      if (!edd) return null;
      const eddDate = startOfDay(new Date(edd));
      gestationalDays = DAYS_FROM_LMP_TO_EDD - daysBetween(eddDate, reference);
    } else {
      if (!lmp) return null;
      const lmpDate = startOfDay(new Date(lmp));
      gestationalDays = daysBetween(reference, lmpDate);
    }

    if (!Number.isFinite(gestationalDays)) return null;
    if (gestationalDays < 0) return null;

    // Cap at 42w only when no actual birth date is known.
    const isCapped = !birthDate && gestationalDays > MAX_GESTATIONAL_DAYS;
    if (isCapped) gestationalDays = MAX_GESTATIONAL_DAYS;

    return {
      weeks: Math.floor(gestationalDays / 7),
      days: gestationalDays % 7,
      totalDays: gestationalDays,
      source,
      isPostpartum: Boolean(birthDate),
      isCapped,
    };
  }
);

// --- Postpartum helpers ----------------------------------------------------

export const selectIsPostpartum = (state: RootState): boolean =>
  Boolean(state.dataReducer.birthDate);

export const selectBabyAge = createSelector(
  [(state: RootState) => state.dataReducer.birthDate],
  (birthDate: string): BabyAge | null => {
    if (!birthDate) return null;
    const today = startOfDay(new Date());
    const bd = startOfDay(new Date(birthDate));
    const days = daysBetween(today, bd);
    if (days < 0) return null;
    return { days, weeks: Math.floor(days / 7) };
  }
);

export const selectBirthClassification = createSelector(
  [selectGestationalAge],
  (ga: GestationalAge | null): BirthClassification | null => {
    if (!ga || !ga.isPostpartum) return null;
    if (ga.totalDays < 259) return 'preterm';   // < 37w 0d
    if (ga.totalDays < 294) return 'term';      // 37w 0d – 41w 6d
    return 'post-term';
  }
);

// --- Conflict detection ----------------------------------------------------

export const selectGestationConflict = createSelector(
  [
    (state: RootState) => state.dataReducer.edd,
    (state: RootState) => state.dataReducer.lmp,
  ],
  (edd: string, lmp: string): boolean => {
    if (!edd || !lmp) return false;
    const diff = Math.abs(daysBetween(new Date(edd), new Date(lmp)));
    return Math.abs(diff - DAYS_FROM_LMP_TO_EDD) > 7;
  }
);

// --- Birth-date prompt -----------------------------------------------------

export const selectShouldPromptBirth = createSelector(
  [
    (state: RootState) => state.dataReducer.edd,
    (state: RootState) => state.dataReducer.lmp,
    (state: RootState) => state.dataReducer.birthDate,
    (state: RootState) => state.dataReducer.dismissedBirthPromptAt,
  ],
  (
    edd: string,
    lmp: string,
    birthDate: string,
    dismissedAt: string
  ): boolean => {
    if (birthDate) return false;
    if (!edd && !lmp) return false;

    const today = startOfDay(new Date());

    let days: number;
    if (edd) {
      days = DAYS_FROM_LMP_TO_EDD - daysBetween(startOfDay(new Date(edd)), today);
    } else {
      days = daysBetween(today, startOfDay(new Date(lmp)));
    }

    if (days < MAX_GESTATIONAL_DAYS) return false;

    if (dismissedAt) {
      const dismissedDaysAgo = daysBetween(today, startOfDay(new Date(dismissedAt)));
      if (dismissedDaysAgo < BIRTH_PROMPT_REDISMISS_DAYS) return false;
    }

    return true;
  }
);

// --- Convenience -----------------------------------------------------------

export const selectGestationalAgeLabel = createSelector(
  [selectGestationalAge],
  (ga: GestationalAge | null): string | null =>
    ga ? `${ga.weeks}w ${ga.days}d` : null
);