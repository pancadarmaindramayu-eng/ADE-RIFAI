
import React, { useState } from 'react';
import { Scene } from '../types.ts';
import { generateSceneImage } from '../services/api.ts';

interface SceneCardProps {
  scene: Scene;
  onUpdateScene: (updatedScene: Scene) => void;
  ratio: string;
  storyType?: 'hybrid' | 'human';
}

export const SceneCard: React.FC<SceneCardProps> = ({ scene, onUpdateScene, ratio, storyType = 'human' }) => {
  const [rendering, setRendering] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [copiedNarrative, setCopiedNarrative] = useState(false);

  const handleRender = async () => {
    setRendering(true);
    try {
      const url = await generateSceneImage(scene, ratio, storyType);
      onUpdateScene({ ...scene, visual_image: url });
    } catch (err) {
      console.error(err);
    } finally {
      setRendering(false);
    }
  };

  const copyGrok = () => {
    navigator.clipboard.writeText(scene.grok_prompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  const copyNarrative = () => {
    navigator.clipboard.writeText(scene.dialog);
    setCopiedNarrative(true);
    setTimeout(() => setCopiedNarrative(false), 2000);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'HOOK': return 'bg-pink-600';
      case 'SHIFT': return 'bg-amber-600';
      case 'REVEAL': return 'bg-indigo-600';
      case 'FUTURE': return 'bg-emerald-600';
      case 'CTA': return 'bg-rose-600';
      default: return 'bg-slate-700';
    }
  };

  return (
    <div className="glass-panel rounded-[3rem] overflow-hidden flex flex-col md:flex-row border-slate-800/50 group transition-all duration-500 hover:border-indigo-500/30 shadow-[0_30px_60px_rgba(0,0,0,0.4)]">
      {/* Visual Side */}
      <div className={`relative bg-slate-950/50 ${ratio === '9:16' ? 'md:w-[320px]' : 'md:w-1/3 lg:w-2/5'}`}>
        <div className={`w-full relative ${ratio === '9:16' ? 'aspect-[9/16]' : 'aspect-video'}`}>
          {scene.visual_image ? (
            <img src={scene.visual_image} alt="Visual" className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-1000" />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-slate-700 p-8 text-center bg-slate-950">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">V9 Intelligence Preview</span>
            </div>
          )}
          
          <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-md">
            <button 
              onClick={handleRender} 
              disabled={rendering}
              className="px-8 py-4 rounded-2xl font-black text-xs shadow-2xl transition-all hover:scale-105 active:scale-95 bg-white text-black uppercase tracking-tighter"
            >
              {rendering ? "Rendering V9 Asset..." : "Generate Strategic Asset"}
            </button>
          </div>
        </div>
        <div className="absolute top-6 left-6 flex flex-col gap-2">
          <span className="bg-black/60 backdrop-blur-md text-white text-[10px] font-black px-4 py-1.5 rounded-lg border border-white/10 shadow-xl uppercase tracking-widest">SEGMENT {scene.scene_number}</span>
          {scene.scene_role && (
            <span className={`${getRoleColor(scene.scene_role)} text-white text-[9px] font-black px-4 py-1 rounded-lg shadow-xl uppercase tracking-widest`}>
              {scene.scene_role}
            </span>
          )}
        </div>
      </div>

      {/* Info Side */}
      <div className="p-10 flex-1 flex flex-col gap-10">
        <div className="space-y-2">
          <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500">Master Setting & Direction</span>
          <p className="text-white text-2xl font-black leading-tight tracking-tighter">{scene.setting}</p>
        </div>
        
        {/* Narrative Box */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
               <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">VO Script (Permanent Hallmark)</span>
               <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></span>
            </div>
            <button 
              onClick={copyNarrative} 
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${copiedNarrative ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-white hover:text-black shadow-lg'}`}
            >
              {copiedNarrative ? 'Copied to Clipboard' : 'Copy VO Script'}
            </button>
          </div>
          <div className="bg-slate-950/80 p-8 rounded-[2rem] border border-white/5 shadow-inner italic font-serif text-slate-200 leading-relaxed text-xl relative group-hover:border-indigo-500/20 transition-colors">
            "{scene.dialog}"
            {scene.ctr_message && <div className="mt-6 pt-4 border-t border-white/5 text-[10px] font-black text-pink-500 not-italic uppercase tracking-[0.2em] flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-pink-500 rounded-full animate-pulse"></span>
              Retention Anchor: {scene.ctr_message}
            </div>}
          </div>
        </div>

        {/* Prompt Box */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
               <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Grok Visual Production Prompt</span>
               <span className="px-2 py-0.5 bg-indigo-600/20 text-indigo-400 text-[8px] rounded font-black border border-indigo-500/20">CONTINUITY LOCK</span>
            </div>
            <button 
              onClick={copyGrok} 
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${copiedPrompt ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-white hover:text-black shadow-lg'}`}
            >
              {copiedPrompt ? 'Prompt Copied' : 'Copy Grok Prompt'}
            </button>
          </div>
          <div className="bg-black/60 p-6 rounded-[1.5rem] border border-white/5 group-hover:border-indigo-500/10 transition-colors relative">
             <p className="text-xs text-slate-500 font-mono leading-relaxed line-clamp-3 hover:line-clamp-none transition-all cursor-help">{scene.grok_prompt}</p>
             <div className="absolute bottom-4 right-4 text-[8px] font-black text-slate-700 uppercase tracking-widest opacity-40">Direct-to-Grok Ready</div>
          </div>
        </div>
      </div>
    </div>
  );
};
