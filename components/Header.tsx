import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">KP</span>
          </div>
          <div>
            <h1 className="text-white font-semibold text-lg leading-tight">AI Storyboarder</h1>
            <p className="text-slate-400 text-xs">Karakter Paten Generator</p>
          </div>
        </div>
        <div className="flex gap-2">
          <span className="px-2 py-1 bg-slate-800 rounded text-xs text-slate-400 border border-slate-700">Gemini 2.5 Flash</span>
        </div>
      </div>
    </header>
  );
};