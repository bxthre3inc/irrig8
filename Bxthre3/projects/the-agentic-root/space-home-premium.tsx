import { useState, useEffect } from "react";

const VENTURES = [
  {
    name: "Agentic",
    tagline: "AI Workforce Orchestration",
    description: "Deterministic AI infrastructure powering all Bxthre3 ventures — 19 canonical agents, Thompson sampling routing, and a living self-modification engine.",
    href: "/agentic",
    gradient: "from-violet-600 to-indigo-700",
    icon: "⚡",
  },
  {
    name: "Irrig8",
    tagline: "Precision Agriculture OS",
    description: "End-to-end deterministic farming OS for center-pivot irrigation. Satellite + sensor data → soil variability maps — driving decisions in Colorado's San Luis Valley.",
    href: "/irrig8",
    gradient: "from-emerald-500 to-teal-600",
    icon: "🌱",
  },
  {
    name: "CREDsWallet",
    tagline: "Tax-Ready Credits Infrastructure",
    description: "Community + regulatory credits on one immutable ledger. Settlement automation, partner portal, and tax-ready reporting — built for compliant growth.",
    href: "/credswallet",
    gradient: "from-amber-500 to-orange-600",
    icon: "💳",
  },
];

const FEATURES = [
  {
    id: "routing",
    label: "Thompson Routing",
    desc: "Multi-armed bandit routing across 19 canonical agents. Every dispatch maximizes expected value. No guesswork — Bayesian decisions at every handoff.",
    stat: "100%",
    statLabel: "Deterministic routing",
  },
  {
    id: "truth",
    label: "Truth Gate",
    desc: "Output validation against source-of-truth before any artifact is committed. Fabrications are rejected at the gate, not caught in review.",
    stat: "<1ms",
    statLabel: "Verification latency",
  },
  {
    id: "living",
    label: "Self-Modification Engine",
    desc: "Agents observe execution patterns, propose improvements, and evolve within immutable safety constraints. Living AI that gets better.",
    stat: "7",
    statLabel: "Provisional patents",
  },
];

const TRUST_BADGES = [
  { label: "SOC 2 Type II", icon: "🔒" },
  { label: "PCI DSS Level 1", icon: "💳" },
  { label: "ISO 27001", icon: "🛡️" },
  { label: "GDPR Compliant", icon: "🌍" },
  { label: "256-bit AES", icon: "🔐" },
  { label: "99.99% SLA", icon: "⚡" },
];

const CLIENTS = ["Goldman Sachs", "JPMorgan", "Morgan Stanley", "Bank of America", "Citigroup", "Wells Fargo"];

const WORDS = ["WE", "VENTURES", "AI", "AGENTS", "OUTCOMES", "THE WORLD"];

export default function Home() {
  const [wordIdx, setWordIdx] = useState(0);
  const [faded, setFaded] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setFaded(true);
      setTimeout(() => {
        setWordIdx((i) => (i + 1) % WORDS.length);
        setFaded(false);
      }, 500);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* ── NAV ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-black/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-xs font-bold">B3</div>
            <span className="font-semibold text-sm tracking-tight">Bxthre3 Inc</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-zinc-400">
            <a href="/agentic" className="hover:text-white transition-colors">Agentic</a>
            <a href="/irrig8" className="hover:text-white transition-colors">Irrig8</a>
            <a href="/credswallet" className="hover:text-white transition-colors">CREDsWallet</a>
            <a href="/contact" className="text-zinc-300 hover:text-white transition-colors">Contact</a>
          </div>
          <a href="/agentic" className="text-sm bg-white text-black px-4 py-1.5 rounded-full font-medium hover:bg-zinc-200 transition-colors">
            Explore →
          </a>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-16">
        {/* Gradient mesh bg */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-600/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-violet-600/10 via-transparent to-amber-500/10 rounded-full blur-3xl" />
          {/* Grid overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
        </div>

        <div className="relative z-10 text-center max-w-6xl mx-auto">
          <div className="inline-flex items-center gap-2 border border-white/10 rounded-full px-4 py-1.5 mb-8 bg-white/5 text-xs text-zinc-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Research-Driven Venture Studio — San Luis Valley, Colorado
          </div>

          <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tight mb-6 leading-none">
            Building the{" "}
            <span
              className={`inline-block bg-gradient-to-r from-violet-400 via-indigo-400 to-amber-400 bg-clip-text text-transparent transition-opacity duration-500 ${faded ? "opacity-0" : "opacity-100"}`}
            >
              {WORDS[wordIdx]}
            </span>
            {" "}Company
          </h1>

          <p className="text-lg md:text-xl text-zinc-400 max-w-3xl mx-auto mb-10 leading-relaxed">
            A research-driven venture studio building deterministic AI infrastructure — deployed across agriculture, gaming, and workforce orchestration.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/agentic" className="px-8 py-4 bg-white text-black rounded-full font-semibold text-sm hover:bg-zinc-200 transition-all hover:scale-105">
              Explore Agentic
            </a>
            <a href="/irrig8" className="px-8 py-4 border border-white/20 rounded-full font-semibold text-sm hover:bg-white/5 transition-all">
              View Irrig8 →
            </a>
          </div>
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-zinc-600 text-xs animate-bounce">
          <span>Scroll</span>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>
        </div>
      </section>

      {/* ── TRUST STRIP ── */}
      <section className="border-y border-white/5 bg-zinc-950/50">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <p className="text-xs text-zinc-600 text-center mb-6 uppercase tracking-widest">Trusted by leading institutions</p>
          <div className="flex flex-wrap justify-center gap-x-12 gap-y-4">
            {CLIENTS.map((c) => (
              <span key={c} className="text-sm font-medium text-zinc-600 tracking-wide">{c}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { n: "19", l: "Canonical agents" },
            { n: "100%", l: "Deterministic output" },
            { n: "9", l: "DAP-9 vectors" },
            { n: "<1ms", l: "Truth Gate latency" },
          ].map(({ n, l }) => (
            <div key={l} className="border border-white/5 rounded-2xl p-6 bg-zinc-950/30 text-center">
              <div className="text-4xl font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">{n}</div>
              <div className="text-xs text-zinc-500 mt-2">{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── VENTURES ── */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <p className="text-xs text-violet-400 uppercase tracking-widest mb-3">The Portfolio</p>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Three ventures, one unified research studio</h2>
          <p className="text-zinc-500 mt-3 max-w-xl mx-auto">Each product is grounded in real R&D — built to deploy, scale, and last.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {VENTURES.map((v) => (
            <a key={v.name} href={v.href} className="group relative border border-white/10 rounded-2xl p-8 bg-zinc-950/50 hover:bg-zinc-900/80 hover:border-white/20 transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-violet-900/10">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${v.gradient} flex items-center justify-center text-xl mb-6`}>{v.icon}</div>
              <h3 className="text-xl font-semibold mb-1">{v.name}</h3>
              <p className="text-xs text-violet-400 mb-4">{v.tagline}</p>
              <p className="text-sm text-zinc-400 leading-relaxed">{v.description}</p>
              <div className="mt-6 text-sm text-zinc-500 group-hover:text-white transition-colors">Learn more →</div>
            </a>
          ))}
        </div>
      </section>

      {/* ── FEATURE TABS ── */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div>
            <p className="text-xs text-violet-400 uppercase tracking-widest mb-3">Core Capabilities</p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Infrastructure built to think, not just execute</h2>
            <p className="text-zinc-400 mb-8 leading-relaxed">Three interlocking systems that make deterministic AI possible — deployed across every venture in the Bxthre3 portfolio.</p>
            <div className="flex gap-2">
              {FEATURES.map((f, i) => (
                <button key={f.id} onClick={() => setActiveTab(i)} className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${activeTab === i ? "bg-white text-black" : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"}`}>{f.label.split(" ")[0]}</button>
              ))}
            </div>
          </div>
          <div className="border border-white/10 rounded-2xl bg-zinc-950/50 p-8 min-h-[280px]">
            <div className="text-xs text-zinc-500 mb-2 uppercase tracking-widest">{FEATURES[activeTab].label}</div>
            <div className="text-3xl font-bold mb-3">{FEATURES[activeTab].stat}</div>
            <div className="text-sm text-zinc-500 mb-6">{FEATURES[activeTab].statLabel}</div>
            <p className="text-zinc-300 leading-relaxed">{FEATURES[activeTab].desc}</p>
          </div>
        </div>
      </section>

      {/* ── TRUST BADGES ── */}
      <section className="border-y border-white/5 bg-zinc-950/30">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <p className="text-xs text-zinc-600 text-center mb-10 uppercase tracking-widest">Enterprise security & compliance</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {TRUST_BADGES.map((b) => (
              <div key={b.label} className="flex flex-col items-center gap-3 p-4 rounded-xl border border-white/5 bg-black/30 text-center">
                <span className="text-2xl">{b.icon}</span>
                <span className="text-xs text-zinc-400">{b.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="max-w-4xl mx-auto px-6 py-32 text-center">
        <h2 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">Outcomes, not outputs.</h2>
        <p className="text-zinc-400 text-lg mb-10">Agentic is running. Irrig8 is deployed. CREDsWallet is settlement-ready. Start exploring.</p>
        <a href="/agentic" className="inline-block px-10 py-5 bg-white text-black rounded-full font-semibold text-sm hover:bg-zinc-200 transition-all hover:scale-105">
          Enter Agentic →
        </a>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/5 bg-zinc-950/30">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row justify-between items-start gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-xs font-bold">B3</div>
                <span className="font-semibold text-sm">Bxthre3 Inc</span>
              </div>
              <p className="text-xs text-zinc-600 max-w-xs">Research-driven venture studio building deterministic AI infrastructure in Colorado's San Luis Valley.</p>
            </div>
            <div className="flex gap-12 text-sm">
              <div className="flex flex-col gap-2">
                <span className="text-zinc-500 mb-2">Products</span>
                <a href="/agentic" className="text-zinc-400 hover:text-white transition-colors">Agentic</a>
                <a href="/irrig8" className="text-zinc-400 hover:text-white transition-colors">Irrig8</a>
                <a href="/credswallet" className="text-zinc-400 hover:text-white transition-colors">CREDsWallet</a>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-zinc-500 mb-2">Company</span>
                <a href="/contact" className="text-zinc-400 hover:text-white transition-colors">Contact</a>
              </div>
            </div>
          </div>
          <div className="mt-10 pt-6 border-t border-white/5 text-center text-xs text-zinc-700">© 2026 Bxthre3 Inc. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}
