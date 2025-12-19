
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
      case 'DECISION_ROOM':
      case 'VISUAL_HOOK':
      case 'HOOK': return 'bg-pink-600';
      case 'MONEY_FLOW':
      case 'CONTEXT': return 'bg-indigo-600';
      case 'WHO_PAYS':
      case 'CORE_IDEA': return 'bg-amber-600';
      case 'INVISIBLE_COST':
      case 'VISUAL_TWIST': return 'bg-purple-600';
      case 'BIGGER_QUESTION':
      case 'CLOSING': return 'bg-emerald-600';
      default: return 'bg-slate-700';
    }
  };

  return (
    <div className="glass-panel rounded-[3.5rem] overflow-hidden flex flex-col md:flex-row border-slate-800/50 group transition-all duration-500 hover:border-indigo-500/30 shadow-[0_30px_70px_rgba(0,0,0,0.5)]">
      {/* Visual Side */}
      <div className={`relative bg-slate-950/50 ${ratio === '9:16' ? 'md:w-[320px]' : 'md:w-1/3 lg:w-2/5'}`}>
        <div className={`w-full relative ${ratio === '9:16' ? 'aspect-[9/16]' : 'aspect-video'}`}>
          {scene.visual_image ? (
            <img src={scene.visual_image} alt="Visual" className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-1000" />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-slate-700 p-8 text-center bg-slate-950">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">V9 Engine Rendering Slot</span>
            </div>
          )}
          
          <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-md">
            <button 
              onClick={handleRender} 
              disabled={rendering}
              className="px-10 py-5 rounded-2xl font-black text-xs shadow-2xl transition-all hover:scale-105 active:scale-95 bg-white text-black uppercase tracking-tighter"
            >
              {rendering ? "Rendering Asset..." : "Generate V9 Asset"}
            </button>
          </div>
        </div>
        <div className="absolute top-8 left-8 flex flex-col gap-3">
          <span className="bg-black/80 backdrop-blur-md text-white text-[10px] font-black px-4 py-2 rounded-xl border border-white/10 shadow-xl uppercase tracking-widest">SEGMENT {scene.scene_number}</span>
          {scene.scene_role && (
            <span className={`${getRoleColor(scene.scene_role)} text-white text-[9px] font-black px-4 py-1.5 rounded-lg shadow-xl uppercase tracking-widest border border-white/10`}>
              {scene.scene_role.replace('_', ' ')}
            </span>
          )}
        </div>
      </div>

      {/* Info Side */}
      <div className="p-12 flex-1 flex flex-col gap-12">
        <div className="space-y-3">
          <span className="text-[11px] font-black uppercase tracking-[0.3em] text-indigo-500">Master Direction & Setup</span>
          <p className="text-white text-3xl font-black leading-tight tracking-tighter">{scene.setting}</p>
        </div>
        
        {/* Narrative Box (The "Hallmark") */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
               <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Permanent VO Script</span>
               <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.6)]"></span>
            </div>
            <button 
              onClick={copyNarrative} 
              className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${copiedNarrative ? 'bg-emerald-600 text-white shadow-xl' : 'bg-slate-800 text-slate-400 hover:bg-white hover:text-black'}`}
            >
              {copiedNarrative ? 'Narrative Copied' : 'Copy VO Script'}
            </button>
          </div>
          <div className="bg-slate-950/80 p-10 rounded-[2.5rem] border border-white/5 shadow-inner italic font-serif text-slate-100 leading-relaxed text-2xl relative group-hover:border-indigo-500/20 transition-colors">
            "{scene.dialog}"
            {scene.ctr_message && (
              <div className="mt-8 pt-6 border-t border-white/5 text-[11px] font-black text-pink-500 not-italic uppercase tracking-[0.3em] flex items-center gap-3">
                <span className="w-2 h-2 bg-pink-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(236,72,153,0.5)]"></span>
                Retention Insight: {scene.ctr_message}
              </div>
            )}
          </div>
        </div>

        {/* Grok Prompt Box (The "Continuity") */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
               <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Grok Production Prompt</span>
               <span className="px-3 py-1 bg-indigo-600/20 text-indigo-400 text-[9px] rounded-lg font-black border border-indigo-500/20">CONTINUITY ENGINE v9</span>
            </div>
            <button 
              onClick={copyGrok} 
              className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${copiedPrompt ? 'bg-emerald-600 text-white shadow-xl' : 'bg-slate-800 text-slate-400 hover:bg-white hover:text-black'}`}
            >
              {copiedPrompt ? 'Grok Prompt Copied' : 'Copy Grok Prompt'}
            </button>
          </div>
          <div className="bg-black/60 p-8 rounded-[2rem] border border-white/5 group-hover:border-indigo-500/10 transition-colors relative">
             <p className="text-[13px] text-slate-500 font-mono leading-relaxed line-clamp-3 hover:line-clamp-none transition-all cursor-help">{scene.grok_prompt}</p>
             <div className="mt-4 flex justify-end">
                <span className="text-[9px] font-black text-slate-700 uppercase tracking-[0.4em] opacity-40">V9 Intelligence Protocol Active</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
