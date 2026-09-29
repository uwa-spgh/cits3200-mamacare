/// <reference types="node" />

import assert from "node:assert/strict";
import test from "node:test";
import { reminderDestination } from "./routing";

test("routes medication reminders to their medication", () => {
  assert.deepEqual(
    reminderDestination({
      mamaCareReminder: true,
      kind: "medication",
      sourceId: "med-1",
    }),
    { screen: "medication", sourceId: "med-1" },
  );
});

test("routes ANC reminders to their visit", () => {
  assert.deepEqual(
    reminderDestination({
      mamaCareReminder: true,
      kind: "anc",
      sourceId: "anc-4",
    }),
    { screen: "anc", sourceId: "anc-4" },
  );
});

test("routes education reminders to the library", () => {
  assert.deepEqual(
    reminderDestination({ mamaCareReminder: true, kind: "education" }),
    { screen: "education" },
  );
});

test("ignores notification data not owned by MamaCare", () => {
  assert.equal(reminderDestination({ kind: "medication" }), null);
  assert.equal(reminderDestination({ mamaCareReminder: true }), null);
});
