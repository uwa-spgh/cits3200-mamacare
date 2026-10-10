import { createContext, type RefObject } from "react";
import type { View } from "react-native";
import type { TutorialTargetId } from "./steps";

export interface TutorialContextValue {
  registerTarget: (id: TutorialTargetId, ref: RefObject<View | null>) => () => void;
  onTargetLayout: (id: TutorialTargetId) => void;
  onHomeFocus: () => void;
  onHomeBlur: () => void;
}

export const TutorialContext = createContext<TutorialContextValue | null>(null);
