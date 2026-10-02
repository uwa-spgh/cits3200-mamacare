import { useCallback, useContext, useEffect, useRef } from "react";
import type { View } from "react-native";
import { TutorialContext } from "./TutorialContext";
import type { TutorialTargetId } from "./steps";

export const useTutorialTarget = (id: TutorialTargetId) => {
  const tutorial = useContext(TutorialContext);
  const ref = useRef<View>(null);

  useEffect(() => tutorial?.registerTarget(id, ref), [tutorial, id]);

  const onLayout = useCallback(() => {
    tutorial?.onTargetLayout(id);
  }, [tutorial, id]);

  return { ref, onLayout, collapsable: false } as const;
};
