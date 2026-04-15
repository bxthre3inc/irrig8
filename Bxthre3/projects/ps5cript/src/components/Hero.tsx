import { Sparkles, ArrowRight } from 'lucide-react';
import { useScriptEditor } from '../lib/ScriptEditorContext';

export default function Hero() {
  const { setNaturalLanguage } = useScriptEditor();

  const handleCTAClick = () => {
    setNaturalLanguage('');
    document.getElementById('script-editor')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-accent-blue/5 via-transparent to-transparent" />
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-accent-purple/10 rounded-full blur-[120px] animate-pulse-glow" />
      <div className="absolute top-40 left-1/4 w-[400px] h-[400px] bg-accent-blue/10 rounded-full blur-[100px] animate-pulse-glow" style={{ animationDelay: '1s' }} />
      <div className="absolute top-40 right-1/4 w-[400px] h-[400px] bg-accent-magenta/10 rounded-full blur-[100px] animate-pulse-glow" style={{ animationDelay: '2s' }} />

      <div className="relative max-w-5xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-bg-card/80 backdrop-blur rounded-full border border-border mb-8 animate-slide-up">
          <Sparkles className="w-4 h-4 text-accent-magenta" />
          <span className="text-sm text-text-secondary">AI-Powered Script Builder</span>
        </div>

        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 animate-slide-up stagger-1">
          Build Scripts with
          <br />
          <span className="gradient-text">Natural Language</span>
        </h1>

        <p className="text-xl text-text-secondary max-w-2xl mx-auto mb-10 animate-slide-up stagger-2">
          Transform your ideas into operational scripts. Describe what you need, 
          and PS5cript converts it into structured, deployable code.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up stagger-3">
          <button
            onClick={handleCTAClick}
            className="group flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-accent-blue to-accent-magenta rounded-xl font-semibold text-lg hover:opacity-90 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            Build Your First Script
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <button
            onClick={() => document.getElementById('template-gallery')?.scrollIntoView({ behavior: 'smooth' })}
            className="flex items-center gap-2 px-8 py-4 bg-bg-card border border-border rounded-xl font-semibold text-lg hover:border-accent-blue transition-colors"
          >
            Browse Templates
          </button>
        </div>

        <div className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto animate-slide-up stagger-4">
          <div>
            <div className="text-3xl font-bold gradient-text">10+</div>
            <div className="text-sm text-text-muted">Templates</div>
          </div>
          <div>
            <div className="text-3xl font-bold gradient-text">3</div>
            <div className="text-sm text-text-muted">Endpoint APIs</div>
          </div>
          <div>
            <div className="text-3xl font-bold gradient-text">1</div>
            <div className="text-sm text-text-muted">Click Deploy</div>
          </div>
        </div>
      </div>
    </section>
  );
}
