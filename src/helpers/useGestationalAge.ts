import { useSelector } from 'react-redux';
import type { RootState } from '../store/store';
import {
  selectGestationalAge,
  selectGestationalAgeLabel,
  selectGestationConflict,
  selectIsPostpartum,
  selectBabyAge,
  selectShouldPromptBirth,
} from '../store/selectors';

export const useGestationalAge = () => {
  const ga = useSelector(selectGestationalAge);
  const label = useSelector(selectGestationalAgeLabel);
  const conflict = useSelector(selectGestationConflict);
  const isPostpartum = useSelector(selectIsPostpartum);
  const babyAge = useSelector(selectBabyAge);
  const shouldPromptBirth = useSelector(selectShouldPromptBirth);

  return { ga, label, conflict, isPostpartum, babyAge, shouldPromptBirth };
};