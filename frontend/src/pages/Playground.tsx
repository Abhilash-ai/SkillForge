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
      const res = await fetch('http://127.0.0.1:8000/api/execute', {
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
    <div className="h-screen flex flex-col bg-zinc-900 text-zinc-50">
      <header className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-950">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
            <Code2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Browser Coding Playground</h1>
            <p className="text-xs text-zinc-400">Powered by Local Sandbox</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <select 
            className="bg-zinc-800 border border-zinc-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
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
            className="px-6 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white font-bold flex items-center gap-2 transition-colors"
          >
            {isRunning ? <Loader2 className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5 fill-current" />}
            Run Code
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <div className="w-2/3 border-r border-zinc-800">
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
        <div className="w-1/3 bg-zinc-950 flex flex-col">
          <div className="px-4 py-3 border-b border-zinc-800 flex items-center gap-2 text-zinc-400 text-sm font-bold uppercase tracking-wider">
            <Terminal className="w-4 h-4" /> Terminal Output
          </div>
          <div className="p-4 flex-1 overflow-auto font-mono text-sm whitespace-pre-wrap">
            {isRunning ? (
              <span className="text-amber-500 animate-pulse">Executing...</span>
            ) : output ? (
              <span className="text-zinc-300">{output}</span>
            ) : (
              <span className="text-zinc-600">Click "Run Code" to see output here.</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Playground;
