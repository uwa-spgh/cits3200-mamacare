import { useContext, useEffect } from "react";
import { useNavigation } from "expo-router/react-navigation";
import { TutorialContext } from "./TutorialContext";

export const useTutorialAutoStart = () => {
  const tutorial = useContext(TutorialContext);
  const navigation = useNavigation();

  useEffect(() => {
    if (!tutorial) return;

    if (navigation.isFocused()) tutorial.onHomeFocus();

    const unsubscribeFocus = navigation.addListener("focus", tutorial.onHomeFocus);
    const unsubscribeBlur = navigation.addListener("blur", tutorial.onHomeBlur);
    return () => {
      unsubscribeFocus();
      unsubscribeBlur();
      tutorial.onHomeBlur();
    };
  }, [tutorial, navigation]);
};
