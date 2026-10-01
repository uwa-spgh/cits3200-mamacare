//Layout for the spotlight and card.

import type { TutorialPlacement, TutorialSpotlightShape } from "./steps";

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface Hole extends Rect {
  radius: number;
}

const SPOTLIGHT_PADDING: Record<
  TutorialSpotlightShape,
  { horizontal: number; vertical: number }
> = {
  rounded: { horizontal: -4, vertical: 2 },
  pill: { horizontal: 10, vertical: 8 },
};

const ROUNDED_RADIUS = 16;

export const SCREEN_MARGIN = 16;
export const ARROW_WIDTH = 20;
export const ARROW_HEIGHT = 10;
const ARROW_GAP = 6;
const ARROW_EDGE_INSET = 14;

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), Math.max(min, max));

export const rectsMatch = (a: Rect, b: Rect, tolerance = 0.5) =>
  Math.abs(a.x - b.x) <= tolerance &&
  Math.abs(a.y - b.y) <= tolerance &&
  Math.abs(a.width - b.width) <= tolerance &&
  Math.abs(a.height - b.height) <= tolerance;

export const relativeTo = (rect: Rect, origin: { x: number; y: number }): Rect => ({
  x: rect.x - origin.x,
  y: rect.y - origin.y,
  width: rect.width,
  height: rect.height,
});

export const spotlightHole = (
  target: Rect,
  shape: TutorialSpotlightShape,
): Hole => {
  const padding = SPOTLIGHT_PADDING[shape];
  const width = Math.max(0, target.width + padding.horizontal * 2);
  const height = Math.max(0, target.height + padding.vertical * 2);
  return {
    x: target.x - padding.horizontal,
    y: target.y - padding.vertical,
    width,
    height,
    radius:
      shape === "pill"
        ? height / 2
        : Math.min(ROUNDED_RADIUS, width / 2, height / 2),
  };
};

export const spotlightPath = (screen: Size, hole: Hole): string => {
  const { x, y, width: w, height: h } = hole;
  const r = Math.min(hole.radius, w / 2, h / 2);
  const outer = `M0 0H${screen.width}V${screen.height}H0Z`;
  const inner =
    `M${x + r} ${y}` +
    `H${x + w - r}` +
    `A${r} ${r} 0 0 1 ${x + w} ${y + r}` +
    `V${y + h - r}` +
    `A${r} ${r} 0 0 1 ${x + w - r} ${y + h}` +
    `H${x + r}` +
    `A${r} ${r} 0 0 1 ${x} ${y + h - r}` +
    `V${y + r}` +
    `A${r} ${r} 0 0 1 ${x + r} ${y}Z`;
  return `${outer}${inner}`;
};

export const cardWidthFor = (screenWidth: number, maxWidth = 400) =>
  Math.max(0, Math.min(maxWidth, screenWidth - SCREEN_MARGIN * 2));

export interface CardLayoutInput {
  screen: Size;
  hole: Hole;
  card: Size;
  placement: TutorialPlacement;
  safeTop: number;
  safeBottom: number;
}

export interface CardLayout {
  left: number;
  top: number;
  arrowLeft: number;
}

export const layoutCard = ({
  screen,
  hole,
  card,
  placement,
  safeTop,
  safeBottom,
}: CardLayoutInput): CardLayout => {
  const targetCenterX = hole.x + hole.width / 2;

  const left = clamp(
    targetCenterX - card.width / 2,
    SCREEN_MARGIN,
    screen.width - SCREEN_MARGIN - card.width,
  );

  const minTop = safeTop + SCREEN_MARGIN;
  const maxTop = screen.height - safeBottom - SCREEN_MARGIN - card.height;
  const preferredTop =
    placement === "above"
      ? hole.y - ARROW_GAP - ARROW_HEIGHT - card.height
      : hole.y + hole.height + ARROW_GAP + ARROW_HEIGHT;
  const top = clamp(preferredTop, minTop, maxTop);

  const arrowLeft = clamp(
    targetCenterX - left - ARROW_WIDTH / 2,
    ARROW_EDGE_INSET,
    card.width - ARROW_EDGE_INSET - ARROW_WIDTH,
  );

  return { left, top, arrowLeft };
};
