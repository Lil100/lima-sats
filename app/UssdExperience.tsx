import { useState } from "react";
import { ArrowLeft, Phone, RotateCcw } from "lucide-react";

const root = "Welcome to LimaSats\n1. Register Farmer\n2. View Insurance Packages\n3. Estimate Premium\n4. Check Policy Status\n5. Check Weather Conditions\n6. View Payout Status\n7. Help";
const responses: Record<string, string> = {
  "2": "Insurance packages (illustrative)\n1. Basic — drought\n2. Standard — drought, flood\n3. Premium — drought, flood, vegetation stress\n\nReply 0 for main menu.",
  "3": "Sample premium estimate\nKitui · maize · 1.5 ha\nStandard cover: KES 20,000\nPremium: about KES 1,400 (25,200 sats at demo rate)\n\nThis is a simulated estimate. Reply 0 for menu.",
  "4": "Sample policy LS-IND-001\nMary Mutheu · Kitui\nStatus: funded DLC, monitoring weather\nCover: KES 10,000\n\nReply 0 for menu.",
  "5": "Sample weather reading\nKitui seasonal rain: 150 mm\nDrought threshold: below 200 mm\nOracle attestation: simulated only\n\nReply 0 for menu.",
  "6": "Sample payout notification\nLS-IND-001 condition met.\nPre-agreed settlement: 180,000 sats (≈ KES 10,000) to registered destination.\nNo real Bitcoin sent. Reply 0 for menu.",
  "7": "Help\nThis is a proposed service. Call your cooperative or insurer for real policy information.\n\nReply 0 for menu."
};

export default function UssdExperience() {
  const [active, setActive] = useState(false);
  const [screen, setScreen] = useState("dial");
  const [input, setInput] = useState("");
  const [message, setMessage] = useState("Dial *XXX# to explore the proposed LimaSats menu.");
  const [registrationStage, setRegistrationStage] = useState(0);
  const press = (value: string) => setInput(v => v + value);
  const reset = () => { setActive(false); setScreen("dial"); setInput(""); setMessage("Dial *XXX# to explore the proposed LimaSats menu."); setRegistrationStage(0); };
  const send = () => {
    const choice = input.trim();
    setInput("");
    if (!active) {
      if (choice === "*XXX#") { setActive(true); setScreen("root"); setMessage(root); }
      else setMessage("Use the proposed shortcode *XXX# to start this simulation.");
      return;
    }
    if (choice === "0") { setScreen("root"); setMessage(root); setRegistrationStage(0); return; }
    if (screen === "root") {
      if (choice === "1") { setScreen("register"); setRegistrationStage(0); setMessage("Register Farmer\n1. Independent farmer\n2. Cooperative / SACCO farmer\n\nReply 0 for main menu."); }
      else if (responses[choice]) { setScreen(choice); setMessage(responses[choice]); }
      else setMessage("Invalid choice.\n\n" + root);
      return;
    }
    if (screen === "register") {
      if (registrationStage === 0 && (choice === "1" || choice === "2")) { setRegistrationStage(Number(choice)); setMessage("Choose county\n1. Kitui\n2. Kisumu\n3. Turkana\n\nReply 0 for main menu."); }
      else if (registrationStage > 0 && ["1","2","3"].includes(choice)) { const county = ["Kitui","Kisumu","Turkana"][Number(choice)-1]; setScreen("registered"); setMessage("Sample registration saved\n" + (registrationStage === 1 ? "Independent farmer" : "Cooperative / SACCO farmer") + " · " + county + "\nNext: select a package and confirm a policy with a provider.\nNo real account was created.\n\nReply 0 for menu."); }
      else setMessage("Invalid choice. Reply 1, 2 or 3; 0 returns to menu.");
      return;
    }
    setMessage("Reply 0 to return to the main menu.");
  };
  return <section className="wrap"><div className="page-head"><span className="eyebrow">ACCESS FOR BASIC PHONES</span><h1>USSD experience<em>.</em></h1><p>Try a basic-phone menu concept for farmers without a smartphone.</p></div>
    <div className="concept-banner"><Phone size={19}/><div><b>*XXX# is a proposed placeholder shortcode, not an active service.</b><span>The keypad, messages and account status are entirely simulated in this browser.</span></div></div>
    <div className="ussd-layout"><div className="phone-shell"><div className="phone-speaker"/><div className="phone-screen"><div className="phone-status">LIMASATS · USSD DEMO</div><pre>{message}</pre><div className="phone-input">{input || <span>{active ? "Enter a menu number" : "Select *XXX# below"}</span>}</div></div><div className="keypad">{["1","2","3","4","5","6","7","8","9","*","0","#"].map(k => <button key={k} onClick={() => press(k)}>{k}</button>)}</div>{!active&&<button className="shortcode-key" onClick={()=>setInput("*XXX#")}>Use proposed shortcode *XXX#</button>}<div className="phone-actions"><button onClick={() => setInput(v => v.slice(0,-1))} aria-label="Delete last character"><ArrowLeft size={17}/></button><button className="send" onClick={send}>SEND</button><button onClick={reset} aria-label="Reset phone"><RotateCcw size={17}/></button></div></div>
    <div className="ussd-explain"><h2>Access that fits the farmer.</h2><p>A basic phone could help a farmer browse packages, start registration, check a policy or receive a status message. A real rollout would require a telecom gateway, identity checks, secure accounts, payment and notification partners.</p><div className="note-bar"><Phone size={20}/><p><b>Custody matters.</b> USSD alone cannot securely sign Bitcoin transactions. Production payouts for basic-phone users would need an appropriate custody and payment arrangement.</p></div><p className="muted-small">Sample menu: Register · Packages · Premium · Policy · Weather · Payout · Help</p></div></div>
  </section>;
}
