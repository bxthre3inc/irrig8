import { useState } from "react";
import { CheckCircle, ArrowRight, Users, Bot, DollarSign, Shield } from "lucide-react";

export default function BuildABizPartnerLanding() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const paymentUrl = "https://buy.stripe.com/PLACEHOLDER";

  const benefits = [
    { icon: Users, text: "Your territory, your clients, 70% revenue share" },
    { icon: Bot, text: "4 AI agents handle sales, onboarding, fulfillment" },
    { icon: DollarSign, text: "$997 setup → $97/mo per active client" },
    { icon: Shield, text: "Impossible to fail: Daily steps provided" },
  ];

  const dailySteps = [
    "Day 1: Log in, review your lead queue",
    "Day 2: Send 5 outreach messages (templates provided)",
    "Day 3: Book 1 discovery call",
    "Day 4: Close your first $997 client",
    "Day 5: Agents onboard them automatically",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="max-w-3xl mx-auto px-6 py-16">
        
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Build-A-Biz Partner
          </h1>
          <p className="text-xl text-slate-300">
            The business you can't fail at, even if you try
          </p>
        </div>

        <div className="bg-slate-800/50 rounded-2xl p-8 mb-8 border border-slate-700">
          <h2 className="text-2xl font-semibold mb-6">What You Get</h2>
          <div className="space-y-4">
            {benefits.map((b, i) => (
              <div key={i} className="flex items-center gap-4">
                <b.icon className="w-6 h-6 text-emerald-400" />
                <span className="text-lg">{b.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-emerald-900/20 rounded-2xl p-8 mb-8 border border-emerald-700/50">
          <h2 className="text-2xl font-semibold mb-6 text-emerald-400">The Daily Routine</h2>
          <div className="space-y-3">
            {dailySteps.map((step, i) => (
              <div key={i} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-400 mt-0.5" />
                <span>{step}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center">
          <a 
            href={paymentUrl}
            className="inline-flex items-center gap-3 bg-emerald-500 hover:bg-emerald-600 text-white text-xl font-semibold px-8 py-4 rounded-xl transition-colors"
          >
            Partner Up — $997
            <ArrowRight className="w-6 h-6" />
          </a>
          <p className="mt-4 text-slate-400">
            70% revenue share • Cancel anytime • First client in 7 days
          </p>
        </div>
      </div>
    </div>
  );
}
