import test from 'node:test';
import assert from 'node:assert/strict';
import { createTutorialGate } from '../src/tutorial/gate.ts';
import { cardWidthFor, layoutCard, isWithinBounds, relativeTo, rectsMatch, spotlightHole, spotlightPath } from '../src/tutorial/geometry.ts';
import { measureSettled } from '../src/tutorial/measure.ts';

test('tutorial cannot start early, starts once, and completion clears pending', () => {
  const gate = createTutorialGate();
  assert.equal(gate.tryStart(), false);
  gate.markOnboardingComplete();
  assert.equal(gate.tryStart(), true);
  assert.equal(gate.tryStart(), false);
  gate.complete();
  assert.equal(gate.isRunning(), false);
  assert.equal(gate.isPending(), false);
});
test('tutorial abort allows retry; replay and subscription cleanup work', () => {
  const gate = createTutorialGate();
  let count = 0;
  const unsubscribe = gate.subscribe(() => count++);
  gate.markPending(); gate.tryStart(); gate.abort();
  assert.equal(gate.tryStart(), true);
  gate.complete();
  assert.equal(count, 5);
  unsubscribe(); gate.markPending();
  assert.equal(count, 5);
  assert.equal(gate.tryStart(), true);
});
test('tutorial card remains inside phone/tablet safe areas at both screen edges', () => {
  for (const screen of [{ width: 320, height: 568 }, { width: 390, height: 844 }, { width: 768, height: 1024 }]) {
    const card = { width: cardWidthFor(screen.width), height: 180 };
    for (const x of [0, screen.width - 48]) for (const y of [40, screen.height - 50]) for (const placement of ['above', 'below']) {
      const layout = layoutCard({ screen, hole: { x, y, width: 48, height: 48, radius: 16 }, card, placement, safeTop: 30, safeBottom: 20 });
      assert.ok(isWithinBounds({ x: layout.left, y: layout.top, ...card }, screen));
      assert.ok(layout.top >= 46);
      assert.ok(layout.top + card.height <= screen.height - 36);
      assert.ok(layout.arrowLeft >= 14 && layout.arrowLeft + 20 <= card.width - 14);
    }
  }
});
test('spotlights support pill and rounded targets without negative dimensions', () => {
  const target = { x: 20, y: 30, width: 80, height: 40 };
  assert.equal(spotlightHole(target, 'pill').radius, 28);
  const tiny = spotlightHole({ ...target, width: 2 }, 'rounded');
  assert.equal(tiny.width, 0);
  assert.ok(!spotlightPath({ width: 390, height: 844 }, tiny).includes('NaN'));
  assert.equal(cardWidthFor(20), 0);
});
test('target conversion and bounds checks reject clipped targets', () => {
  assert.deepEqual(relativeTo({ x: 25, y: 45, width: 20, height: 10 }, { x: 5, y: 10 }), { x: 20, y: 35, width: 20, height: 10 });
  assert.equal(isWithinBounds({ x: 380, y: 0, width: 50, height: 20 }, { width: 390, height: 844 }), false);
  assert.equal(rectsMatch({ x: 0, y: 0, width: 20, height: 10 }, { x: 0.4, y: 0, width: 20, height: 10 }), true);
});
test('measurement waits for stable layout and respects cancellation/missing targets', async () => {
  const node = (x, y, width, height) => ({ measureInWindow: callback => callback(x, y, width, height) });
  const options = { getTarget: () => node(40, 60, 30, 40), getOverlay: () => node(10, 20, 390, 844), isCancelled: () => false, attempts: 3, intervalMs: 0 };
  assert.deepEqual(await measureSettled(options), { x: 30, y: 40, width: 30, height: 40 });
  assert.equal(await measureSettled({ ...options, isCancelled: () => true }), null);
  assert.equal(await measureSettled({ ...options, getTarget: () => null }), null);
});
