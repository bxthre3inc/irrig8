import { createContext, useContext, useState, ReactNode } from 'react';

interface ScriptOutput {
  name: string;
  description: string;
  triggers: string[];
  actions: {
    type: string;
    params: Record<string, unknown>;
  }[];
  conditions?: {
    field: string;
    operator: string;
    value: unknown;
  }[];
  metadata?: {
    author: string;
    version: string;
    tags: string[];
  };
}

interface ScriptEditorContextType {
  naturalLanguage: string;
  setNaturalLanguage: (value: string) => void;
  parsedOutput: ScriptOutput | null;
  setParsedOutput: (value: ScriptOutput | null) => void;
  isParsing: boolean;
  setIsParsing: (value: boolean) => void;
  error: string | null;
  setError: (value: string | null) => void;
}

const ScriptEditorContext = createContext<ScriptEditorContextType | undefined>(undefined);

export function ScriptEditorProvider({ children }: { children: ReactNode }) {
  const [naturalLanguage, setNaturalLanguage] = useState('');
  const [parsedOutput, setParsedOutput] = useState<ScriptOutput | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <ScriptEditorContext.Provider
      value={{
        naturalLanguage,
        setNaturalLanguage,
        parsedOutput,
        setParsedOutput,
        isParsing,
        setIsParsing,
        error,
        setError,
      }}
    >
      {children}
    </ScriptEditorContext.Provider>
  );
}

export function useScriptEditor() {
  const context = useContext(ScriptEditorContext);
  if (!context) {
    throw new Error('useScriptEditor must be used within a ScriptEditorProvider');
  }
  return context;
}
