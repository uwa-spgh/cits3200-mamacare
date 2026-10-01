import { relativeTo, rectsMatch, type Rect } from "./geometry";

interface Measurable {
  measureInWindow: (
    callback: (x: number, y: number, width: number, height: number) => void,
  ) => void;
}

const MEASURE_TIMEOUT_MS = 500;

const wait = (ms: number) =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });

const measureOnce = (node: Measurable | null): Promise<Rect | null> =>
  new Promise((resolve) => {
    if (!node) {
      resolve(null);
      return;
    }
    // measureInWindow may never call back for a node that is being unmounted.
    const timeout = setTimeout(() => resolve(null), MEASURE_TIMEOUT_MS);
    node.measureInWindow((x, y, width, height) => {
      clearTimeout(timeout);
      resolve(width > 0 && height > 0 ? { x, y, width, height } : null);
    });
  });

interface MeasureSettledOptions {
  getTarget: () => Measurable | null;
  getOverlay: () => Measurable | null;
  isCancelled: () => boolean;
  attempts?: number;
  intervalMs?: number;
}

export const measureSettled = async ({
  getTarget,
  getOverlay,
  isCancelled,
  attempts = 40,
  intervalMs = 50,
}: MeasureSettledOptions): Promise<Rect | null> => {
  let previous: Rect | null = null;

  for (let attempt = 0; attempt < attempts; attempt += 1) {
    const [target, overlay] = await Promise.all([
      measureOnce(getTarget()),
      measureOnce(getOverlay()),
    ]);
    if (isCancelled()) return null;

    if (target && overlay) {
      const rect = relativeTo(target, overlay);
      if (previous && rectsMatch(previous, rect)) return rect;
      previous = rect;
    }

    await wait(intervalMs);
    if (isCancelled()) return null;
  }

  return previous;
};
