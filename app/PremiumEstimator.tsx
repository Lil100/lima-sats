import { useMemo, useState } from "react";
import { ArrowRight, Calculator, Info } from "lucide-react";
import { packages, type PackageName } from "./Packages";
import { countyRisk, estimatePremium, type County } from "./pricing";

const seasons = ["March–May long rains", "October–December short rains"];

export default function PremiumEstimator({ onEnroll }: { onEnroll: () => void }) {
  const [county, setCounty] = useState<County>("Kitui");
  const [location, setLocation] = useState("Kitui Central");
  const [category, setCategory] = useState<"Crop" | "Livestock">("Crop");
  const [asset, setAsset] = useState("Maize");
  const [size, setSize] = useState(1.5);
  const [selected, setSelected] = useState<PackageName>("Standard");
  const [coverage, setCoverage] = useState(20000);
  const [season, setSeason] = useState(seasons[0]);
  const chosen = packages.find(p => p.name === selected)!;
  const permittedCoverage = Math.min(coverage, chosen.limit);
  const estimate = useMemo(() => estimatePremium({county,category,size,packageName:selected,coverage:permittedCoverage,season:season===seasons[0]?"long rains":"short rains"}), [county,category,size,selected,permittedCoverage,season]);
  return <section className="wrap"><div className="page-head"><span className="eyebrow">ILLUSTRATIVE PRICING</span><h1>AI premium estimator<em>.</em></h1><p>Explore how location, cover, season and farm details could influence a premium.</p></div>
    <div className="concept-banner"><Info size={18}/><div><b>AI-assisted pricing concept — simulated risk estimates.</b><span>This interactive demo uses a transparent formula and seeded risk values. No trained AI model or actuarial quote is running.</span></div></div>
    <div className="two-col"><div className="panel estimator-form"><div className="panel-title"><span className="round-icon"><Calculator size={20}/></span><div><h3>Farm and coverage</h3><p>Adjust inputs to recalculate instantly.</p></div></div>
      <div className="fields">
        <label>County<select value={county} onChange={e => { setCounty(e.target.value as County); setLocation(e.target.value === "Kitui" ? "Kitui Central" : e.target.value === "Kisumu" ? "Nyando" : "Lodwar"); }}>{Object.keys(countyRisk).map(c => <option key={c}>{c}</option>)}</select></label>
        <label>Farm location<input value={location} onChange={e => setLocation(e.target.value)} placeholder="Village or ward"/></label>
        <label>Category<select value={category} onChange={e => { setCategory(e.target.value as "Crop" | "Livestock"); setAsset(e.target.value === "Crop" ? "Maize" : "Goats"); }}><option>Crop</option><option>Livestock</option></select></label>
        <label>Crop or livestock type<select value={asset} onChange={e => setAsset(e.target.value)}>{(category === "Crop" ? ["Maize", "Sorghum", "Beans"] : ["Goats", "Dairy cattle", "Sheep"]).map(a => <option key={a}>{a}</option>)}</select></label>
        <label>Farm size (hectares)<input type="number" min="0.1" step="0.1" value={size} onChange={e => setSize(Math.max(0.1, Number(e.target.value) || 0.1))}/></label>
        <label>Insurance package<select value={selected} onChange={e => { const p = packages.find(p => p.name === e.target.value)!; setSelected(p.name); setCoverage(v => Math.min(v, p.limit)); }}>{packages.map(p => <option key={p.name}>{p.name}</option>)}</select></label>
        <label>Coverage amount (KES)<input type="number" min="1000" max={chosen.limit} step="1000" value={permittedCoverage} onChange={e => setCoverage(Math.max(1000, Math.min(chosen.limit, Number(e.target.value) || 1000)))}/></label>
        <label>Farming season<select value={season} onChange={e => setSeason(e.target.value)}>{seasons.map(s => <option key={s}>{s}</option>)}</select></label>
      </div></div>
      <div className="estimator-results"><span className="eyebrow">PREMIUM ESTIMATE</span><h2>KES {estimate.kes.toLocaleString("en-KE")}</h2><p className="sats-line">≈ {estimate.sats.toLocaleString("en-KE")} sats · 1 KES = 18 sats (fixed demo rate)</p>
        <div className="result-row"><span>Maximum selected coverage</span><b>KES {permittedCoverage.toLocaleString("en-KE")}</b></div>
        <div className="result-row"><span>Package limit</span><b>KES {chosen.limit.toLocaleString("en-KE")}</b></div>
        <div className="result-row"><span>Risk category</span><b>{estimate.riskCategory}</b></div>
        <div className="result-row"><span>Environmental triggers</span><b>{chosen.risks.join(", ")}</b></div>
        <div className="result-explain"><b>How this estimate is calculated</b><p>Coverage × (3.5% base + county risk × 12%) × package factor × asset factor × size factor × season factor, rounded to KES. The seeded county risk is {Math.round(countyRisk[county] * 100)}%. The result is a concept demonstration, not a payable premium.</p></div>
        <button className="btn orange" onClick={onEnroll}>Continue to enrollment <ArrowRight size={16}/></button>
      </div>
    </div>
    <div className="note-bar"><Info size={20}/><p><b>Future AI capability:</b> A production model would need historical weather and loss records, geographic data, actuarial validation, and licensed underwriting before prices could be offered.</p></div>
  </section>;
}
