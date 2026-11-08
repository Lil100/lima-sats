import { ArrowRight, Check, ShieldCheck } from "lucide-react";

export const packages = [
  { name: "Basic", limit: 15000, risks: ["Drought"], description: "Affordable protection for one predefined environmental risk.", factor: 0.9 },
  { name: "Standard", limit: 30000, risks: ["Drought", "Flood"], description: "Broader cover with a higher maximum settlement.", factor: 1.2 },
  { name: "Premium", limit: 60000, risks: ["Drought", "Flood", "Vegetation stress"], description: "The widest illustrative cover and additional eligible risks.", factor: 1.55 },
] as const;
export type PackageName = typeof packages[number]["name"];

export default function Packages({ onEstimate, onEnroll }: { onEstimate: () => void; onEnroll: () => void }) {
  return <section className="wrap">
    <div className="page-head"><span className="eyebrow">COVER OPTIONS</span><h1>Insurance packages<em>.</em></h1><p>Choose the scope of predefined environmental protection. All prices and limits are illustrative.</p></div>
    <div className="package-grid">{packages.map(item => <article className="panel package-card" key={item.name}>
      <span className="eyebrow">{item.name.toUpperCase()} PACKAGE</span>
      <h2>{item.name}</h2><p>{item.description}</p>
      <div className="package-limit"><span>Maximum coverage</span><strong>KES {item.limit.toLocaleString("en-KE")}</strong><small>≈ {(item.limit * 18).toLocaleString("en-KE")} sats at the fixed demo rate</small></div>
      <div className="package-risks">{item.risks.map(risk => <span key={risk}><Check size={16}/>{risk}</span>)}</div>
      <button className="btn dark" onClick={onEstimate}>Estimate premium <ArrowRight size={16}/></button>
    </article>)}</div>
    <div className="note-bar"><ShieldCheck size={20}/><p><b>Coverage is conditional.</b> A predefined index must cross the policy threshold, and a funded DLC needs a valid oracle attestation before its pre-agreed settlement path can execute.</p></div>
    <button className="btn plain" onClick={onEnroll}>Ready to register a farmer? <ArrowRight size={16}/></button>
  </section>;
}
