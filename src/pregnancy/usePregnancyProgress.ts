import { useCallback, useEffect, useState } from "react";
import { AppState } from "react-native";
import { useFocusEffect } from "expo-router/react-navigation";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import { getPregnancyProgress } from "./progress";

export function usePregnancyProgress() {
  const edd = useSelector((state: RootState) => state.dataReducer.edd);
  const [today, setToday] = useState(() => new Date());
  useFocusEffect(useCallback(() => { setToday(new Date()); }, []));
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const refresh = () => {
      clearTimeout(timer);
      const now = new Date();
      setToday(now);
      const midnight = new Date(now);
      midnight.setHours(24, 0, 0, 0);
      timer = setTimeout(refresh, midnight.getTime() - now.getTime() + 100);
    };
    refresh();
    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") refresh();
    });
    return () => { clearTimeout(timer); subscription.remove(); };
  }, []);
  return getPregnancyProgress(edd, today);
}
