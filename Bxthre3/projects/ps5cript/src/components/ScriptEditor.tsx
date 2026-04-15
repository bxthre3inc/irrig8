import { parseScript } from './parseScript';
import { useScriptEditor } from './ScriptEditorContext';
import { Send, Loader2, Sparkles, Trash2, Copy, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

export default function ScriptEditor() {
  const {
    naturalLanguage,
    setNaturalLanguage,
    parsedOutput,
    setParsedOutput,
    isParsing,
    setIsParsing,
    error,
    setError,
  } = useScriptEditor();

  const [copied, setCopied] = useState(false);
  const [showRaw, setShowRaw] = useState(false);

  const handleParse = async () => {
    if (!naturalLanguage.trim()) return;
    
    setIsParsing(true);
    setError(null);
    
    try {
      const result = await parseScript(naturalLanguage);
      setParsedOutput(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse script');
      setParsedOutput(null);
    } finally {
      setIsParsing(false);
    }
  };

  const handleCopy = async () => {
    if (!parsedOutput) return;
    await navigator.clipboard.writeText(JSON.stringify(parsedOutput, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setNaturalLanguage('');
    setParsedOutput(null);
    setError(null);
  };

  return (
    <section id="script-editor" className="max-w-5xl mx-auto px-6 py-12">
      <div className="mb-8 animate-slide-up">
        <h2 className="text-3xl font-bold mb-2">Script Editor</h2>
        <p className="text-text-secondary">
          Describe your script in plain English and watch it transform into structured JSON
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="space-y-4 animate-slide-up stagger-1">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-text-secondary">
              Natural Language Input
            </label>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-accent-magenta" />
              <span className="text-xs text-text-muted">AI Parsing</span>
            </div>
          </div>

          <textarea
            value={naturalLanguage}
            onChange={(e) => setNaturalLanguage(e.target.value)}
            placeholder="e.g., Create a sales agent script that greets customers warmly, answers questions about pricing, and captures leads with their email when they seem interested in purchasing..."
            className="w-full h-80 p-4 bg-bg-card border border-border rounded-xl text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue resize-none transition-colors"
          />

          <div className="flex items-center gap-3">
            <button
              onClick={handleParse}
              disabled={!naturalLanguage.trim() || isParsing}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-accent-blue to-accent-magenta rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isParsing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Parsing...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Parse Script
                </>
              )}
            </button>

            <button
              onClick={handleClear}
              className="p-3 bg-bg-card border border-border rounded-xl hover:border-accent-magenta transition-colors"
              title="Clear"
            >
              <Trash2 className="w-5 h-5 text-text-secondary" />
            </button>
          </div>

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
              {error}
            </div>
          )}
        </div>

        <div className="space-y-4 animate-slide-up stagger-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-text-secondary">
              Structured Output
            </label>
            {parsedOutput && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 px-3 py-1.5 bg-bg-card border border-border rounded-lg text-xs hover:border-accent-blue transition-colors"
                >
                  {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  {copied ? 'Copied!' : 'Copy JSON'}
                </button>
                <button
                  onClick={() => setShowRaw(!showRaw)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-bg-card border border-border rounded-lg text-xs hover:border-accent-blue transition-colors"
                >
                  {showRaw ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  {showRaw ? 'Formatted' : 'Raw'}
                </button>
              </div>
            )}
          </div>

          <div className="h-80 bg-bg-card border border-border rounded-xl p-4 overflow-auto">
            {parsedOutput ? (
              showRaw ? (
                <pre className="text-sm text-text-primary font-mono whitespace-pre-wrap">
                  {JSON.stringify(parsedOutput, null, 2)}
                </pre>
              ) : (
                <StructuredOutput data={parsedOutput} />
              )
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-text-muted">
                <Sparkles className="w-12 h-12 mb-4 opacity-50" />
                <p className="text-sm">Your parsed script will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function StructuredOutput({ data }: { data: Record<string, unknown> }) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold gradient-text mb-1">{data.name as string}</h3>
        <p className="text-sm text-text-secondary">{data.description as string}</p>
      </div>

      <div>
        <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
          Triggers
        </h4>
        <div className="flex flex-wrap gap-2">
          {((data.triggers as string[]) || []).map((trigger, i) => (
            <span
              key={i}
              className="px-3 py-1 bg-accent-blue/10 text-accent-blue rounded-full text-xs font-medium"
            >
              {trigger}
            </span>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
          Actions
        </h4>
        <div className="space-y-2">
          {((data.actions as { type: string; params: Record<string, unknown> }[]) || []).map((action, i) => (
            <div
              key={i}
              className="p-3 bg-bg-secondary rounded-lg border border-border"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-accent-magenta" />
                <span className="text-sm font-medium text-text-primary">{action.type}</span>
              </div>
              {Object.keys(action.params).length > 0 && (
                <pre className="text-xs text-text-muted font-mono mt-2">
                  {JSON.stringify(action.params, null, 2)}
                </pre>
              )}
            </div>
          ))}
        </div>
      </div>

      {(data.conditions as { field: string; operator: string; value: unknown }[] | undefined)?.length ? (
        <div>
          <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
            Conditions
          </h4>
          <div className="space-y-2">
            {data.conditions?.map((condition: { field: string; operator: string; value: unknown }, i: number) => (
              <div
                key={i}
                className="p-3 bg-bg-secondary rounded-lg border border-border"
              >
                <code className="text-xs text-accent-purple">
                  {condition.field} {condition.operator} {JSON.stringify(condition.value)}
                </code>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {(data.metadata as { author: string; version: string; tags: string[] } | undefined)?.tags?.length ? (
        <div>
          <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
            Tags
          </h4>
          <div className="flex flex-wrap gap-2">
            {data.metadata?.tags?.map((tag, i) => (
              <span
                key={i}
                className="px-2 py-0.5 bg-bg-secondary text-text-muted rounded text-xs"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
