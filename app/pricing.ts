export const SATS_PER_KES = 18;
export type Hazard = "drought" | "flood" | "vegetation stress";
export type PackageName = "Basic" | "Standard" | "Premium";
export type County = "Kisumu" | "Kitui" | "Turkana";

export const countyRisk: Record<County, number> = {
  Kisumu: 0.12,
  Kitui: 0.18,
  Turkana: 0.27,
};
export const packageLimits: Record<PackageName, number> = {
  Basic: 15_000,
  Standard: 30_000,
  Premium: 60_000,
};
const packageFactors: Record<PackageName, number> = {
  Basic: 0.9,
  Standard: 1.2,
  Premium: 1.55,
};

export function packageCoversHazard(packageName: PackageName, hazard: Hazard): boolean {
  if (hazard === "drought") return true;
  if (hazard === "flood") return packageName === "Standard" || packageName === "Premium";
  return packageName === "Premium";
}

export function payoutAmount(
  policy: { cover: number; threshold: number },
  rainfallMm: number,
  hazard: Hazard,
  vegetationIndex: number,
): number {
  if (hazard === "drought") {
    return rainfallMm < policy.threshold
      ? Math.round(policy.cover * Math.min(1, (policy.threshold - rainfallMm) / policy.threshold))
      : 0;
  }
  if (hazard === "flood") {
    return rainfallMm > 450
      ? Math.round(policy.cover * Math.min(1, (rainfallMm - 450) / 250))
      : 0;
  }
  return vegetationIndex < 0.35
    ? Math.round(policy.cover * Math.min(1, (0.35 - vegetationIndex) / 0.35))
    : 0;
}

export function estimatePremium(input: {
  county: County;
  category: "Crop" | "Livestock";
  size: number;
  packageName: PackageName;
  coverage: number;
  season: "long rains" | "short rains";
}) {
  const coverage = Math.min(Math.max(input.coverage, 1_000), packageLimits[input.packageName]);
  const assetFactor = input.category === "Livestock" ? 1.12 : 1;
  const sizeFactor = 1 + Math.max(0, input.size - 1) * 0.03;
  const seasonFactor = input.season === "long rains" ? 1.05 : 1;
  const kes = Math.round(
    coverage *
      (0.035 + countyRisk[input.county] * 0.12) *
      packageFactors[input.packageName] *
      assetFactor *
      sizeFactor *
      seasonFactor,
  );
  return {
    kes,
    sats: kes * SATS_PER_KES,
    coverage,
    riskCategory:
      countyRisk[input.county] >= 0.24
        ? "Higher"
        : countyRisk[input.county] >= 0.16
          ? "Moderate"
          : "Lower",
  };
}
