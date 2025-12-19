
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
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-12 flex flex-col md:flex-row justify-between items-center border-b border-white/10">
        <div className="flex-1 text-center md:text-left">
          <h3 className="text-white font-black text-4xl tracking-tighter">Editorial Intelligence Command</h3>
          <p className="text-indigo-100/70 text-sm font-black mt-2 uppercase tracking-[0.4em]">Engine v9 • Channel Manifesto Ready</p>
        </div>
        {metadata.resolved_niche && (
          <div className="mt-8 md:mt-0 flex flex-col items-center md:items-end gap-2">
            <span className="text-[10px] font-black text-white/50 uppercase tracking-widest">Authority Cluster</span>
            <span className="px-6 py-2.5 bg-black/40 rounded-2xl text-xs font-black text-white border border-white/10 uppercase tracking-widest shadow-2xl">{metadata.resolved_niche.youtube_niche}</span>
          </div>
        )}
      </div>

      <div className="p-12 space-y-16">
        {/* Thesis & Spine Block */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
           <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Thesis Anchor</label>
              <div className="bg-slate-950 p-8 rounded-[2.5rem] border border-indigo-500/20 shadow-inner">
                 <p className="text-white text-2xl font-black leading-tight tracking-tight">"{metadata.thesis_statement}"</p>
              </div>
           </div>
           <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Editorial Spine (Manifesto)</label>
              <div className="bg-black/30 p-8 rounded-[2.5rem] border border-white/5">
                 <p className="text-slate-400 text-sm leading-relaxed italic">"{metadata.manifesto_spine || 'Neutral, systemic analysis, pro-literacy, long-term stability focus.'}"</p>
              </div>
           </div>
        </div>

        {/* Thinking Engine Block */}
        {metadata.thinking_framework && (
          <div className="space-y-8">
            <div className="flex items-center gap-6">
              <div className="w-12 h-px bg-slate-800 flex-1"></div>
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Thinking Protocol v9</span>
              <div className="w-12 h-px bg-slate-800 flex-1"></div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div className="bg-black/30 p-10 rounded-[3rem] border border-white/5 space-y-6">
                 <h4 className="text-indigo-400 font-black text-xs uppercase tracking-widest">Macro Context</h4>
                 <p className="text-slate-300 text-base leading-relaxed">{metadata.thinking_framework.macro_context}</p>
                 <div className="pt-8 border-t border-white/5">
                    <h4 className="text-pink-400 font-black text-xs uppercase tracking-widest mb-4">Causal Logic Chain</h4>
                    <ul className="space-y-3">
                      {metadata.thinking_framework.causal_chain.map((step, i) => (
                        <li key={i} className="flex gap-4 text-sm text-slate-400">
                          <span className="text-pink-500 font-black">{i + 1}.</span> {step}
                        </li>
                      ))}
                    </ul>
                 </div>
              </div>
              
              <div className="space-y-10">
                 <div className="bg-indigo-950/20 p-10 rounded-[3rem] border border-indigo-500/10 shadow-2xl">
                    <h4 className="text-indigo-400 font-black text-xs uppercase tracking-widest mb-3">Hidden Mechanism</h4>
                    <p className="text-white text-2xl font-black leading-tight tracking-tighter">{metadata.thinking_framework.hidden_mechanism}</p>
                 </div>
                 <div className="grid grid-cols-2 gap-8">
                    <div className="bg-amber-950/20 p-8 rounded-[2.5rem] border border-amber-500/10">
                      <h4 className="text-amber-500 font-black text-[10px] uppercase tracking-widest mb-3">Contrarian Angle</h4>
                      <p className="text-slate-300 text-xs leading-relaxed">{metadata.thinking_framework.contrarian_angle}</p>
                    </div>
                    <div className="bg-emerald-950/20 p-8 rounded-[2.5rem] border border-emerald-500/10">
                      <h4 className="text-emerald-500 font-black text-[10px] uppercase tracking-widest mb-3">Future Projection</h4>
                      <p className="text-slate-300 text-xs leading-relaxed">{metadata.thinking_framework.future_projection}</p>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        )}

        {/* SEO Engine Block */}
        {metadata.seo_analysis && (
          <div className="space-y-8">
            <div className="flex items-center gap-6">
              <div className="w-12 h-px bg-slate-800 flex-1"></div>
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">SEO Strategy Analysis</span>
              <div className="w-12 h-px bg-slate-800 flex-1"></div>
            </div>

            <div className="bg-black/40 p-12 rounded-[3.5rem] border border-white/5 space-y-12">
               <div>
                  <div className="flex justify-between items-center mb-6">
                     <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Winning Selection (Max CTR)</label>
                     <div className="flex items-center gap-4">
                        <span className="text-emerald-400 text-sm font-black">Score: {metadata.seo_analysis.title_candidates.find(c => c.title === metadata.seo_analysis?.selected_title)?.score || 98}%</span>
                        <button onClick={() => copyToClipboard(metadata.seo_analysis?.selected_title || '', 'Title')} className="text-[11px] font-black text-indigo-400 uppercase tracking-widest hover:text-white transition-colors border-b border-indigo-500/30 ml-4 pb-0.5">{copied === 'Title' ? 'Copied' : 'Copy'}</button>
                     </div>
                  </div>
                  <p className="text-5xl font-black text-white leading-none tracking-tighter">{metadata.seo_analysis.selected_title}</p>
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
