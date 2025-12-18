
import React, { useState, useEffect } from 'react';
import { StoryMetadata } from '../types.ts';

interface MetadataDisplayProps {
  metadata: StoryMetadata;
}

export const MetadataDisplay: React.FC<MetadataDisplayProps> = ({ metadata }) => {
  const [copied, setCopied] = useState<string | null>(null);
  const [scores, setScores] = useState({
    seo: 0,
    performance: 0,
    actionable: 0,
    total: 0
  });

  useEffect(() => {
    // Advanced SEO Scoring for Professional Production V8
    const titleLower = metadata.viral_title.toLowerCase();
    const descLower = metadata.long_description.toLowerCase();
    const keywordList = metadata.keywords.split(',').map(k => k.trim().toLowerCase());
    const topKeyword = keywordList[0] || "";
    
    const inTitle = titleLower.includes(topKeyword);
    const inDesc = descLower.includes(topKeyword);
    const inTags = metadata.hashtags.some(t => t.toLowerCase().includes(topKeyword.replace(' ', '')));
    
    const longDesc = metadata.long_description.length > 300;
    const highTagCount = metadata.hashtags.length >= 15;
    const keywordDensity = keywordList.length >= 10;

    let seoVal = 0;
    if (inTitle) seoVal += 2;
    if (inDesc) seoVal += 2;
    if (inTags) seoVal += 2;
    if (longDesc) seoVal += 1;
    if (keywordDensity) seoVal += 1;

    const actionable = (seoVal / 8) * 50; 
    const performance = (inTitle && inDesc && inTags ? 50 : 30);
    const total = Math.min(100, Math.floor(actionable + performance));
    
    setScores({
      seo: seoVal,
      performance,
      actionable,
      total
    });
  }, [metadata]);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] overflow-hidden mb-12 shadow-[0_30px_60px_rgba(0,0,0,0.6)] animate-fade-in">
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-10 flex flex-col md:flex-row justify-between items-center gap-8 border-b border-white/10">
        <div className="flex-1">
          <h3 className="text-white font-black text-3xl flex items-center gap-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            Production Command Center v8
          </h3>
          <p className="text-indigo-100/70 text-sm font-bold mt-2 uppercase tracking-[0.3em]">Thesis-Driven SEO Mastery</p>
        </div>

        <div className="flex gap-6">
          <div className="bg-white/10 backdrop-blur-md px-8 py-4 rounded-[2rem] border border-white/20 text-center min-w-[140px]">
            <p className="text-[10px] text-white/60 font-black uppercase tracking-widest mb-1">Production Score</p>
            <p className="text-4xl font-black text-white">{scores.total}</p>
          </div>
          <div className={`${scores.seo >= 7 ? 'bg-emerald-500' : 'bg-orange-500'} px-8 py-4 rounded-[2rem] shadow-lg text-center min-w-[140px]`}>
            <p className="text-[10px] text-white/80 font-black uppercase tracking-widest mb-1">SEO Health</p>
            <p className="text-4xl font-black text-white">{scores.seo}/8</p>
          </div>
        </div>
      </div>

      <div className="p-12 space-y-12">
        <div className="bg-slate-950 p-8 rounded-[2.5rem] border border-slate-800 shadow-inner relative overflow-hidden">
             <div className="absolute top-0 right-0 px-6 py-2 bg-indigo-600/10 text-indigo-400 text-[9px] font-black uppercase tracking-widest rounded-bl-2xl">Editorial Thesis</div>
             <p className="text-white text-xl italic font-serif leading-relaxed text-center">"{metadata.thesis_statement}"</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
                <div className="flex justify-between items-end">
                    <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Metadata Quality</label>
                    <span className="text-indigo-400 font-black">{Math.floor(scores.actionable)}/50</span>
                </div>
                <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden">
                    <div className="bg-indigo-500 h-full transition-all duration-1000" style={{ width: `${(scores.actionable/50)*100}%` }}></div>
                </div>
            </div>
            <div className="space-y-4">
                <div className="flex justify-between items-end">
                    <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Visibility Potential</label>
                    <span className="text-pink-400 font-black">{scores.performance}/50</span>
                </div>
                <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden">
                    <div className="bg-pink-500 h-full transition-all duration-1000" style={{ width: `${(scores.performance/50)*100}%` }}></div>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 gap-12">
            <div>
                <div className="flex justify-between items-center mb-4">
                    <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em]">Viral Title (SEO Locked)</label>
                    <button onClick={() => copyToClipboard(metadata.viral_title, 'Title')} className="text-xs font-black text-indigo-400 bg-indigo-500/10 px-4 py-2 rounded-xl border border-indigo-500/20">{copied === 'Title' ? 'Copied!' : 'Copy'}</button>
                </div>
                <p className="text-3xl font-black text-white bg-slate-950 p-8 rounded-[2.5rem] border border-slate-800 shadow-inner leading-tight tracking-tighter">{metadata.viral_title}</p>
            </div>

            <div>
                <div className="flex justify-between items-center mb-4">
                    <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em]">Master Narration Description</label>
                    <button onClick={() => copyToClipboard(metadata.long_description, 'Description')} className="text-xs font-black text-indigo-400 bg-indigo-500/10 px-4 py-2 rounded-xl border border-indigo-500/20">{copied === 'Description' ? 'Copied!' : 'Copy'}</button>
                </div>
                <div className="bg-slate-950 p-8 rounded-[2.5rem] border border-slate-800 shadow-inner max-h-64 overflow-y-auto text-slate-300 text-base leading-relaxed whitespace-pre-wrap font-medium">{metadata.long_description}</div>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
                <div className="flex justify-between items-center mb-4">
                    <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em]">Master Keywords</label>
                    <button onClick={() => copyToClipboard(metadata.keywords, 'Keywords')} className="text-xs font-black text-indigo-400">Copy All</button>
                </div>
                <div className="flex flex-wrap gap-3 p-6 bg-slate-950 rounded-[2rem] border border-slate-800 shadow-inner">
                    {metadata.keywords.split(',').map((kw, i) => (
                        <span key={i} className="text-[11px] px-4 py-2 bg-indigo-950/40 text-indigo-300 rounded-xl border border-indigo-500/20 font-black uppercase tracking-widest">{kw.trim()}</span>
                    ))}
                </div>
            </div>
            <div>
                <div className="flex justify-between items-center mb-4">
                    <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em]">Viral Growth Tags</label>
                    <button onClick={() => copyToClipboard(metadata.hashtags.join(' '), 'Tags')} className="text-xs font-black text-indigo-400">Copy All</button>
                </div>
                <div className="flex flex-wrap gap-3 p-6 bg-slate-950 rounded-[2rem] border border-slate-800 shadow-inner">
                    {metadata.hashtags.map((tag, i) => (
                        <span key={i} className="text-[11px] px-4 py-2 bg-pink-950/40 text-pink-300 rounded-xl border border-pink-500/20 font-black uppercase tracking-widest">#{tag.replace('#', '')}</span>
                    ))}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
