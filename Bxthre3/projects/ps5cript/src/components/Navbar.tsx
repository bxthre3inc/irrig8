import { Zap, Code2, Layout, Rocket, Menu, X } from 'lucide-react';
import { useState } from 'react';

type Tab = 'editor' | 'templates' | 'sandbox' | 'deploy';

interface NavbarProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'editor', label: 'Editor', icon: <Code2 className="w-4 h-4" /> },
  { id: 'templates', label: 'Templates', icon: <Layout className="w-4 h-4" /> },
  { id: 'sandbox', label: 'Sandbox', icon: <Zap className="w-4 h-4" /> },
  { id: 'deploy', label: 'Deploy', icon: <Rocket className="w-4 h-4" /> },
];

export default function Navbar({ activeTab, onTabChange }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-bg-primary/80 backdrop-blur-xl border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-blue to-accent-magenta flex items-center justify-center font-bold text-sm">
              P5
            </div>
            <span className="font-bold text-lg tracking-tight">
              PS<span className="text-accent-blue">5</span>cript
            </span>
          </div>

          <div className="hidden md:flex items-center gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-bg-card text-accent-blue glow-blue'
                    : 'text-text-secondary hover:text-text-primary hover:bg-bg-card/50'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          <button
            className="md:hidden p-2 text-text-secondary hover:text-text-primary"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden py-4 border-t border-border animate-fade-in">
            <div className="flex flex-col gap-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    onTabChange(tab.id);
                    setMobileOpen(false);
                  }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-bg-card text-accent-blue'
                      : 'text-text-secondary hover:text-text-primary hover:bg-bg-card/50'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
