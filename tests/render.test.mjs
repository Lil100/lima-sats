import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { createServer } from "vite";

test("the app and new simulation screens render without runtime exceptions", async () => {
  const server = await createServer({ server: { middlewareMode: true }, appType: "custom" });
  try {
    const [app, packages, estimator, ussd, explorer, signing, settlement, audit] = await Promise.all([
      server.ssrLoadModule("/app/page.tsx"),
      server.ssrLoadModule("/app/Packages.tsx"),
      server.ssrLoadModule("/app/PremiumEstimator.tsx"),
      server.ssrLoadModule("/app/UssdExperience.tsx"),
      server.ssrLoadModule("/app/DlcExplorer.tsx"),
      server.ssrLoadModule("/app/TreasurySigning.tsx"),
      server.ssrLoadModule("/app/Settlement.tsx"),
      server.ssrLoadModule("/app/PublicAudit.tsx"),
    ]);
    const home = renderToString(createElement(app.default));
    assert.match(home, /Simulation — No real funds/);
    assert.match(home, /LimaSats/);
    assert.match(renderToString(createElement(packages.default, { onEstimate() {}, onEnroll() {} })), /Premium/);
    assert.match(renderToString(createElement(estimator.default, { onEnroll() {} })), /simulated risk estimates/);
    assert.match(renderToString(createElement(ussd.default)), /USSD DEMO/);
    assert.match(renderToString(createElement(explorer.default, { farmers: [{ id: 5, name: "Mary Mutheu", county: "Kitui", asset: "Maize", threshold: 200, cover: 10000, wallet: "mock:mary", category: "independent", funded: true }], onTrigger() {} })), /DLC policy explorer/);
    assert.match(renderToString(createElement(signing.default, { rows: [], signers: [], signed: [], broadcast: false, valid: false, tampered: false, onSign() {}, onTamper() {}, onRestore() {}, onVault() {} })), /Signing room/);
    assert.match(renderToString(createElement(settlement.default, { report: null, farmers: [], rain: 145, hazard: "drought", ndvi: 0.28, oraclePublished: false, settled: false, alreadySettled: false, valid: false, onPublish() {}, onSettle() {}, onTrigger() {}, onAudit() {} })), /No trigger report/);
    assert.match(renderToString(createElement(audit.default, { ledger: [], balance: 0 })), /Public audit/);
  } finally {
    await server.close();
  }
});
