import React, { useState } from 'react';
import { Scene } from '../types.ts';
import { generateSceneImage } from '../services/api.ts';

interface SceneCardProps {
  scene: Scene;
  onUpdateScene: (updatedScene: Scene) => void;
  ratio: string;
  storyType?: 'hybrid' | 'human';
  previousScene?: Scene;
}

export const SceneCard: React.FC<SceneCardProps> = ({ scene, onUpdateScene, ratio, storyType = 'human', previousScene }) => {
  const [rendering, setRendering] = useState(false);

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

  return (
    <div className="glass-panel rounded-[2rem] overflow-hidden flex flex-col md:flex-row border-slate-800/50 group">
      <div className={`relative bg-slate-950/50 ${ratio === '9:16' ? 'md:w-[280px]' : 'md:w-1/3 lg:w-2/5'}`}>
        <div className={`w-full relative ${ratio === '9:16' ? 'aspect-[9/16]' : 'aspect-video'}`}>
          {scene.visual_image ? (
            <img src={scene.visual_image} alt="Visual" className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-700" />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-slate-700 p-8 text-center bg-slate-950">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-4 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">Awaiting Render</span>
            </div>
          )}
          
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
            <button 
              onClick={handleRender} 
              disabled={rendering}
              className="bg-white text-black px-6 py-3 rounded-xl font-bold text-xs shadow-xl transition-all hover:scale-105 active:scale-95"
            >
              {rendering ? "Rendering..." : "Generate Scene Visual"}
            </button>
          </div>
        </div>
        <div className="absolute top-6 left-6 flex flex-col gap-2">
          <span className="bg-indigo-600 text-white text-[10px] font-black px-4 py-1.5 rounded-lg shadow-lg">SCENE {scene.scene_number}</span>
          <span className="bg-slate-900/80 backdrop-blur text-slate-400 text-[9px] font-bold px-3 py-1 rounded-lg border border-white/5">{scene.narrative_section}</span>
        </div>
      </div>

      <div className="p-10 flex-1 flex flex-col">
        <div className="flex flex-col gap-6 flex-grow">
          <div className="space-y-2">
            <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Atmosphere</span>
            <p className="text-white text-xl font-bold leading-tight">{scene.setting}</p>
          </div>
          
          <div className="space-y-4">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Narration Script</span>
            <div className="bg-slate-950/50 p-6 rounded-2xl border border-slate-800 italic font-serif text-slate-300 leading-relaxed text-lg">
              "{scene.dialog}"
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 pt-4">
            <div className="space-y-1">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Emotion</span>
              <p className="text-white font-bold text-sm">{scene.emotion}</p>
            </div>
            <div className="space-y-1 text-right">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Hook</span>
              <p className="text-indigo-400 font-bold text-sm italic">"{scene.ctr_message}"</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};