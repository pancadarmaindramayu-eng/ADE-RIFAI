
import React, { useState } from 'react';
import { StoryMetadata } from '../types.ts';

interface MetadataDisplayProps {
  metadata: StoryMetadata;
}

export const MetadataDisplay: React.FC<MetadataDisplayProps> = ({ metadata }) => {
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-[3.5rem] overflow-hidden mb-12 shadow-[0_40px_100px_rgba(0,0,0,0.6)] animate-fade-in">
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-10 flex flex-col md:flex-row justify-between items-center border-b border-white/10">
        <div className="flex-1">
          <h3 className="text-white font-black text-3xl tracking-tighter">Documentary Intelligence Command v9</h3>
          <p className="text-indigo-100/70 text-xs font-black mt-1 uppercase tracking-[0.4em]">Editor • Strategist • Producer Engine</p>
        </div>
        {metadata.resolved_niche && (
          <div className="mt-6 md:mt-0 flex flex-col items-center md:items-end">
            <span className="text-[10px] font-black text-white/50 uppercase tracking-widest mb-1">Target Niche</span>
            <span className="px-4 py-2 bg-black/40 rounded-xl text-xs font-black text-white border border-white/10 uppercase tracking-tighter">{metadata.resolved_niche.youtube_niche}</span>
          </div>
        )}
      </div>

      <div className="p-10 space-y-16">
        {/* Thinking Engine Block */}
        {metadata.thinking_framework && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-8 h-px bg-slate-800 flex-1"></div>
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Thinking Framework v9</span>
              <div className="w-8 h-px bg-slate-800 flex-1"></div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-black/30 p-8 rounded-[2.5rem] border border-white/5 space-y-4">
                 <h4 className="text-indigo-400 font-black text-xs uppercase tracking-widest">Macro Context</h4>
                 <p className="text-slate-300 text-sm leading-relaxed">{metadata.thinking_framework.macro_context}</p>
                 <div className="pt-4 border-t border-white/5">
                    <h4 className="text-pink-400 font-black text-xs uppercase tracking-widest mb-3">Causal Chain</h4>
                    <ul className="space-y-2">
                      {metadata.thinking_framework.causal_chain.map((step, i) => (
                        <li key={i} className="flex gap-3 text-xs text-slate-400">
                          <span className="text-pink-500 font-black">{i + 1}.</span> {step}
                        </li>
                      ))}
                    </ul>
                 </div>
              </div>
              
              <div className="space-y-8">
                 <div className="bg-indigo-950/20 p-8 rounded-[2.5rem] border border-indigo-500/10">
                    <h4 className="text-indigo-400 font-black text-xs uppercase tracking-widest mb-2">Hidden Mechanism</h4>
                    <p className="text-white text-lg font-bold leading-tight">{metadata.thinking_framework.hidden_mechanism}</p>
                 </div>
                 <div className="grid grid-cols-2 gap-6">
                    <div className="bg-amber-950/20 p-6 rounded-[2rem] border border-amber-500/10">
                      <h4 className="text-amber-500 font-black text-[9px] uppercase tracking-widest mb-2">Contrarian Angle</h4>
                      <p className="text-slate-300 text-[11px] leading-snug">{metadata.thinking_framework.contrarian_angle}</p>
                    </div>
                    <div className="bg-emerald-950/20 p-6 rounded-[2rem] border border-emerald-500/10">
                      <h4 className="text-emerald-500 font-black text-[9px] uppercase tracking-widest mb-2">Future Projection</h4>
                      <p className="text-slate-300 text-[11px] leading-snug">{metadata.thinking_framework.future_projection}</p>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        )}

        {/* SEO Scoring Engine Block */}
        {metadata.seo_analysis && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-8 h-px bg-slate-800 flex-1"></div>
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">SEO Scoring Engine Analysis</span>
              <div className="w-8 h-px bg-slate-800 flex-1"></div>
            </div>

            <div className="bg-black/40 p-10 rounded-[3rem] border border-white/5 space-y-10">
               <div>
                  <div className="flex justify-between items-center mb-6">
                     <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Winning Selection (Highest CTR Score)</label>
                     <div className="flex items-center gap-2">
                        <span className="text-emerald-400 text-xs font-black">Score: {metadata.seo_analysis.title_candidates.find(c => c.title === metadata.seo_analysis?.selected_title)?.score || 99}%</span>
                        <button onClick={() => copyToClipboard(metadata.seo_analysis?.selected_title || '', 'Title')} className="text-[10px] font-black text-indigo-400 uppercase tracking-widest hover:text-white transition-colors ml-4">{copied === 'Title' ? 'Copied' : 'Copy'}</button>
                     </div>
                  </div>
                  <p className="text-4xl font-black text-white leading-none tracking-tighter">{metadata.seo_analysis.selected_title}</p>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-10 border-t border-white/5">
                  <div className="space-y-4">
                    <h4 className="text-slate-500 font-black text-[10px] uppercase tracking-widest">Candidate Backlog</h4>
                    <div className="space-y-3">
                      {metadata.seo_analysis.title_candidates.map((c, i) => (
                        <div key={i} className="flex justify-between items-center bg-slate-950 p-4 rounded-xl border border-white/5">
                          <span className="text-xs text-slate-400 truncate max-w-[80%]">{c.title}</span>
                          <span className="text-[10px] font-black text-indigo-500">{c.score}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-indigo-600/5 p-8 rounded-[2rem] border border-indigo-500/10">
                    <h4 className="text-indigo-400 font-black text-[10px] uppercase tracking-widest mb-4">CTR Formula Logic</h4>
                    <p className="text-slate-400 text-xs leading-relaxed italic">"{metadata.seo_analysis.ctr_formula}"</p>
                  </div>
               </div>
            </div>
          </div>
        )}

        {/* Global Metadata Footer */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-10 border-t border-slate-800/50">
            <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Master Keywords</label>
                <div className="flex flex-wrap gap-2">
                    {metadata.keywords.split(',').map((kw, i) => (
                        <span key={i} className="text-[10px] px-3 py-1.5 bg-slate-950 text-slate-400 rounded-lg border border-white/5 font-bold uppercase tracking-widest">{kw.trim()}</span>
                    ))}
                </div>
            </div>
            <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Viral Cluster Tags</label>
                <div className="flex flex-wrap gap-2">
                    {metadata.hashtags.map((tag, i) => (
                        <span key={i} className="text-[10px] px-3 py-1.5 bg-pink-900/10 text-pink-400 rounded-lg border border-pink-500/10 font-bold uppercase tracking-widest">#{tag.replace('#', '')}</span>
                    ))}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
