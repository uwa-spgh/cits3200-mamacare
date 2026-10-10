import { s } from "react-native-size-matters";

export const TUTORIAL_DIM = "rgba(38, 22, 30, 0.76)";
export const TUTORIAL_FADE_MS = 200;
export const MIN_TOUCH_SIZE = 48;
export const MIN_BODY_FONT_SIZE = 16;

export const atLeast = (minimum: number, size: number) => Math.max(minimum, s(size));
