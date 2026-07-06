import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { Play, Code2, Terminal, Loader2 } from 'lucide-react';

const languageOptions = [
  { id: 'python', name: 'Python 3', defaultCode: 'print("Hello, SkillForge!")' },
  { id: 'javascript', name: 'Node.js', defaultCode: 'console.log("Hello, SkillForge!");' },
  { id: 'java', name: 'Java', defaultCode: 'public class Main {\n  public static void main(String[] args) {\n    System.out.println("Hello, SkillForge!");\n  }\n}' },
  { id: 'cpp', name: 'C++', defaultCode: '#include <iostream>\n\nint main() {\n    std::cout << "Hello, SkillForge!" << std::endl;\n    return 0;\n}' }
];

const Playground = () => {
  const [language, setLanguage] = useState(languageOptions[0]);
  const [code, setCode] = useState(language.defaultCode);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);

  const handleLanguageChange = (id: string) => {
    const selected = languageOptions.find(lang => lang.id === id);
    if (selected) {
      setLanguage(selected);
      setCode(selected.defaultCode);
    }
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput('');
    try {
      const res = await fetch('/api/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language: language.id, code })
      });
      const data = await res.json();
      if (res.ok) {
        setOutput(data.output || 'Execution completed with no output.');
      } else {
        setOutput(`Error: ${data.detail}`);
      }
    } catch (err) {
      setOutput('Failed to connect to the execution server.');
    }
    setIsRunning(false);
  };

  return (
    <div className="h-screen flex flex-col bg-white dark:bg-zinc-900 text-zinc-50">
      <header className="px-4 md:px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 flex flex-col md:flex-row md:items-center justify-between bg-zinc-50 dark:bg-zinc-950 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shrink-0">
            <Code2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg md:text-xl font-bold tracking-tight">Browser Coding Playground</h1>
            <p className="text-xs text-zinc-600 dark:text-zinc-400">Powered by Local Sandbox</p>
          </div>
        </div>
        <div className="flex items-center gap-2 md:gap-4 w-full md:w-auto">
          <select 
            className="flex-1 md:flex-none bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-white rounded-lg px-2 md:px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm md:text-base"
            value={language.id}
            onChange={(e) => handleLanguageChange(e.target.value)}
          >
            {languageOptions.map(lang => (
              <option key={lang.id} value={lang.id}>{lang.name}</option>
            ))}
          </select>
          <button 
            onClick={handleRunCode}
            disabled={isRunning}
            className="flex-1 md:flex-none px-4 md:px-6 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white font-bold flex items-center justify-center gap-2 transition-colors text-sm md:text-base"
          >
            {isRunning ? <Loader2 className="w-4 h-4 md:w-5 md:h-5 animate-spin" /> : <Play className="w-4 h-4 md:w-5 md:h-5 fill-current" />}
            Run
          </button>
        </div>
      </header>

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        <div className="w-full md:w-2/3 h-1/2 md:h-full border-b md:border-b-0 md:border-r border-zinc-200 dark:border-zinc-800">
          <Editor
            height="100%"
            language={language.id === 'cpp' ? 'cpp' : language.id}
            theme="vs-dark"
            value={code}
            onChange={(val) => setCode(val || '')}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              fontFamily: "'Fira Code', monospace",
              padding: { top: 16 }
            }}
          />
        </div>
        <div className="w-full md:w-1/3 h-1/2 md:h-full bg-zinc-50 dark:bg-zinc-950 flex flex-col">
          <div className="px-4 py-3 border-b border-zinc-200 dark:border-zinc-800 flex items-center gap-2 text-zinc-600 dark:text-zinc-400 text-xs md:text-sm font-bold uppercase tracking-wider shrink-0">
            <Terminal className="w-4 h-4" /> Terminal Output
          </div>
          <div className="p-4 flex-1 overflow-auto font-mono text-xs md:text-sm whitespace-pre-wrap">
            {isRunning ? (
              <span className="text-amber-500 animate-pulse">Executing...</span>
            ) : output ? (
              <span className="text-zinc-700 dark:text-zinc-300">{output}</span>
            ) : (
              <span className="text-zinc-600">Click "Run" to see output here.</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Playground;
