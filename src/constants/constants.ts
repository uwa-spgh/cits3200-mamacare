import { Platform } from "react-native";


export const IS_IOS = Platform.OS === "ios";
export const IS_ANDROID = Platform.OS === "android";

export const MS_PER_DAY = 1000 * 60 * 60 * 24;
export const DAYS_FROM_LMP_TO_EDD = 280; /** 280 corresponds to 4o weeks */
export const MAX_GESTATIONAL_DAYS = 42 * 7; /** Maximum number of gestational weeks */
export const BIRTH_PROMPT_REDISMISS_DAYS = 3; /** Days after dismissal before we re-prompt for a birth date. */