import { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ScriptEditor from './components/ScriptEditor';
import TemplateGallery from './components/TemplateGallery';
import Sandbox from './components/Sandbox';
import { ScriptEditorProvider } from './lib/ScriptEditorContext';

type Tab = 'editor' | 'templates' | 'sandbox' | 'deploy';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('editor');

  return (
    <ScriptEditorProvider>
      <div className="min-h-screen bg-bg-primary">
        <Navbar activeTab={activeTab} onTabChange={setActiveTab} />
        <main>
          {activeTab === 'editor' && <Hero />}
          {activeTab === 'editor' && <ScriptEditor />}
          {activeTab === 'templates' && <TemplateGallery onSelectTemplate={() => setActiveTab('editor')} />}
          {activeTab === 'sandbox' && <Sandbox />}
          {activeTab === 'deploy' && <DeployView />}
        </main>
      </div>
    </ScriptEditorProvider>
  );
}

function DeployView() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <div className="text-center mb-12 animate-slide-up">
        <h1 className="text-4xl font-bold mb-4">
          <span className="gradient-text">Deploy Your Script</span>
        </h1>
        <p className="text-text-secondary text-lg">
          Connect to AgentOS and launch your script into production
        </p>
      </div>

      <div className="grid gap-6">
        <div className="bg-bg-card border border-border rounded-xl p-8 gradient-border animate-slide-up stagger-1">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-lg bg-accent-blue/20 flex items-center justify-center">
              <span className="text-2xl">🚀</span>
            </div>
            <div>
              <h3 className="text-xl font-semibold">AgentOS Integration</h3>
              <p className="text-text-secondary text-sm">Connect to your agent runtime</p>
            </div>
          </div>
          <p className="text-text-secondary mb-6">
            Connect to AgentOS to deploy scripts as fully operational agents. 
            This feature is available once AgentOS is connected.
          </p>
          <button className="px-6 py-3 bg-gradient-to-r from-accent-blue to-accent-magenta rounded-lg font-medium hover:opacity-90 transition-opacity">
            Connect AgentOS
          </button>
        </div>

        <div className="bg-bg-card border border-border rounded-xl p-8 animate-slide-up stagger-2">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-lg bg-accent-purple/20 flex items-center justify-center">
              <span className="text-2xl">📦</span>
            </div>
            <div>
              <h3 className="text-xl font-semibold">Export Script</h3>
              <p className="text-text-secondary text-sm">Download as JSON or share</p>
            </div>
          </div>
          <p className="text-text-secondary mb-6">
            Export your script as a portable JSON file that can be imported into any 
            AgentOS instance or shared with teammates.
          </p>
          <div className="flex gap-4">
            <button className="px-6 py-3 bg-bg-secondary border border-border rounded-lg font-medium hover:border-accent-blue transition-colors">
              Export JSON
            </button>
            <button className="px-6 py-3 bg-bg-secondary border border-border rounded-lg font-medium hover:border-accent-blue transition-colors">
              Copy Share Link
            </button>
          </div>
        </div>

        <div className="bg-bg-card border border-border rounded-xl p-8 animate-slide-up stagger-3">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-lg bg-accent-green/20 flex items-center justify-center">
              <span className="text-2xl">⚡</span>
            </div>
            <div>
              <h3 className="text-xl font-semibold">API Access</h3>
              <p className="text-text-secondary text-sm">Use via REST API</p>
            </div>
          </div>
          <p className="text-text-secondary mb-6">
            Get an API key to run scripts programmatically from any application. 
            Manage keys and monitor usage from your dashboard.
          </p>
          <button className="px-6 py-3 bg-bg-secondary border border-border rounded-lg font-medium hover:border-accent-green transition-colors">
            Generate API Key
          </button>
        </div>
      </div>
    </div>
  );
}
