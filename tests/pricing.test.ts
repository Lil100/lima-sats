import assert from "node:assert/strict";
import test from "node:test";
import { estimatePremium, packageCoversHazard, payoutAmount, SATS_PER_KES } from "../app/pricing.ts";

const policy = { cover: 10_000, threshold: 200 };

test("drought requires rainfall strictly below the agreed threshold", () => {
  assert.equal(payoutAmount(policy, 250, "drought", 0.28), 0);
  assert.equal(payoutAmount(policy, 200, "drought", 0.28), 0);
  assert.equal(payoutAmount(policy, 150, "drought", 0.28), 2_500);
  assert.equal(payoutAmount(policy, 0, "drought", 0.28), 10_000);
});

test("flood and vegetation stress respect their published boundaries", () => {
  assert.equal(payoutAmount(policy, 450, "flood", 0.28), 0);
  assert.equal(payoutAmount(policy, 575, "flood", 0.28), 5_000);
  assert.equal(payoutAmount(policy, 700, "flood", 0.28), 10_000);
  assert.equal(payoutAmount(policy, 150, "vegetation stress", 0.35), 0);
  assert.equal(payoutAmount(policy, 150, "vegetation stress", 0.175), 5_000);
});

test("packages only cover their declared environmental risks", () => {
  assert.equal(packageCoversHazard("Basic", "drought"), true);
  assert.equal(packageCoversHazard("Basic", "flood"), false);
  assert.equal(packageCoversHazard("Standard", "flood"), true);
  assert.equal(packageCoversHazard("Standard", "vegetation stress"), false);
  assert.equal(packageCoversHazard("Premium", "vegetation stress"), true);
});

test("premium estimate is deterministic, capped, and converts to sats", () => {
  const input = { county: "Kitui" as const, category: "Crop" as const, size: 1.5, packageName: "Standard" as const, coverage: 20_000, season: "long rains" as const };
  const result = estimatePremium(input);
  assert.deepEqual(result, estimatePremium(input));
  assert.equal(result.kes, 1_448);
  assert.equal(result.sats, result.kes * SATS_PER_KES);
  assert.equal(estimatePremium({ ...input, coverage: 100_000 }).coverage, 30_000);
  assert.ok(estimatePremium({ ...input, county: "Turkana" }).kes > estimatePremium({ ...input, county: "Kisumu" }).kes);
});
