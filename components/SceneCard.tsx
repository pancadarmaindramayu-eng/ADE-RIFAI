
import React, { useState } from 'react';
import { Scene } from '../types.ts';
import { generateSceneImage } from '../services/geminiService.ts';
import { CHARACTERS } from '../constants.ts';

interface SceneCardProps {
  scene: Scene;
  onUpdateScene: (updatedScene: Scene) => void;
  ratio: string;
  storyType?: 'hybrid' | 'human';
  previousScene?: Scene;
}

export const SceneCard: React.FC<SceneCardProps> = ({ scene, onUpdateScene, ratio, storyType = 'human', previousScene }) => {
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const isMasterScene = scene.scene_number === 1;

  // Non-negotiable VO Profile
  const voProfile = "STRICT: Male, 35–45, Neutral International English. Calm, authoritative, analytical, documentary narrator style. Pace: 140 WPM. Tone: controlled, serious, subtle tension. NO BACKGROUND MUSIC.";

  const handleGenerateImage = async () => {
    setLoading(true);
    try {
      const imageUrl = await generateSceneImage(scene, ratio, storyType as 'hybrid' | 'human', previousScene?.actions);
      onUpdateScene({ ...scene, visual_image: imageUrl });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const copyGrokPrompt = () => {
    const modeLabel = storyType === 'hybrid' ? 'HYBRID DOCUMENTARY V8' : 'CHARACTER DNA DOC';
    
    const sequentialLogic = previousScene 
      ? `\n[SEQUENTIAL PROGRESSION]: Scene ${scene.scene_number} - Melanjutkan alur visual dari: "${previousScene.actions}". JANGAN reset ke master image.` 
      : `\n[MASTER THESIS OPENING]: Scene 1 - Hook Tesis Utama.`;

    const hybridRules = `\n[ELEGANT DOC RULES]:
- World/Regional maps for geopolitical context.
- 3D abstract charts for data (No numbers).
- Sequential progression logic.
- Cinematic industrial/urban environments.
- Minimal professional typography.`;

    const fullPrompt = `STRICT PRODUCTION PACK [${modeLabel}]: 3D CLAY CINEMATIC. RATIO ${ratio}.${sequentialLogic}${storyType === 'hybrid' ? hybridRules : '\n[DNA]: Konsistensi wajah, hijab, dan kumis asimetris Pap identik 100%.'}

[LOKASI & AKSI]:
SECTION: ${scene.narrative_section}
LOKASI: ${scene.setting}
AKSI (6s): ${scene.actions}

[VISUAL DATA]: 
- KONTEKS: "${scene.visual_notes}"
- INTEGRATION: No floating text. Minimal typography integrated organically.

[AUDIO NARASI]:
${voProfile}
NASKAH: "${scene.dialog}"
STRICT: TANPA BACKSOUND MUSIC (VO ONLY).

[ANTI-CHANGE VOICE LOCK]:
- Maintain one consistent voice
- Calm, authoritative documentary narrator
- Neutral international English accent
- Do NOT alter tone, pace, or emotion`;
    
    navigator.clipboard.writeText(fullPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
      if (!scene.visual_image) return;
      const link = document.createElement('a');
      link.href = scene.visual_image;
      link.download = `scene_${scene.scene_number}.png`;
      link.click();
  };

  return (
    <div className={`bg-slate-900 rounded-[3rem] overflow-hidden border ${isMasterScene ? 'border-indigo-500 ring-4 ring-indigo-500/20 shadow-2xl' : 'border-slate-800'} flex flex-col md:flex-row relative transition-all group`}>
      
      <div className={`relative bg-slate-950 ${ratio === '9:16' ? 'md:w-1/3 max-w-[340px]' : 'md:w-1/3 lg:w-2/5'}`}>
        <div className={`w-full relative overflow-hidden ${ratio === '9:16' ? 'aspect-[9/16]' : 'aspect-video'}`}>
          {scene.visual_image ? (
            <img src={scene.visual_image} alt="Context" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 bg-slate-950 p-12 text-center">
               <div className={`w-24 h-24 rounded-[2.5rem] border-2 border-dashed ${isMasterScene ? 'border-indigo-500/40' : 'border-slate-800'} flex items-center justify-center mb-8 bg-slate-900`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className={`h-12 w-12 ${isMasterScene ? 'text-indigo-500' : 'text-slate-700'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
               </div>
               <span className="text-xs font-black uppercase tracking-[0.4em] text-slate-600">
                 {storyType === 'hybrid' ? 'Elegant V8 Sequence' : 'DNA Sequence Frame'}
               </span>
            </div>
          )}
          
          <div className="absolute inset-0 bg-black/90 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-6 backdrop-blur-3xl p-10">
            <button onClick={handleGenerateImage} disabled={loading} className="w-full py-6 bg-indigo-600 hover:bg-indigo-500 text-white rounded-[1.5rem] font-black text-sm shadow-2xl transition-all">
              {loading ? <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto"></div> : `RENDER ${storyType.toUpperCase()} IMAGE`}
            </button>
            <button onClick={copyGrokPrompt} className="w-full py-6 bg-white text-black hover:bg-slate-100 rounded-[1.5rem] font-black text-sm transition-all">
              {copied ? 'PROMPT COPIED!' : 'COPY PRODUCTION PROMPT'}
            </button>
            {scene.visual_image && (
                <button onClick={handleDownload} className="w-full py-6 bg-slate-800 hover:bg-slate-700 text-white rounded-[1.5rem] font-black text-sm border border-slate-700">
                    DOWNLOAD IMAGE
                </button>
            )}
          </div>
        </div>
        <div className="absolute top-8 left-8 flex flex-col gap-2">
            <div className={`px-6 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] border shadow-2xl ${isMasterScene ? 'bg-indigo-600 border-indigo-400 text-white' : 'bg-slate-950 border-slate-800 text-slate-500'}`}>
              {isMasterScene ? 'MASTER' : `SEGMEN ${scene.scene_number}`}
            </div>
            <div className="px-4 py-1 bg-slate-900/80 backdrop-blur-md border border-slate-700 text-[8px] font-black uppercase tracking-widest text-indigo-400 rounded-lg">
                {scene.narrative_section}
            </div>
        </div>
      </div>

      <div className="p-12 flex-1 flex flex-col gap-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-4">
                <h3 className="text-indigo-400 text-[10px] uppercase tracking-[0.5em] font-black flex items-center gap-3">
                    <span className="w-3 h-3 rounded-full bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.6)]"></span>
                    Doc Context
                </h3>
                <div className="bg-slate-950 p-6 rounded-[2rem] border border-slate-800 shadow-inner">
                    <p className="text-white text-lg font-black mb-2 tracking-tight leading-tight">{scene.setting}</p>
                    <p className="text-slate-500 text-[11px] font-bold leading-relaxed italic">{scene.actions}</p>
                </div>
            </div>
            <div className="space-y-4">
                <h3 className="text-pink-400 text-[10px] uppercase tracking-[0.5em] font-black flex items-center gap-3">
                    <span className="w-3 h-3 rounded-full bg-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.6)]"></span>
                    Visual Data Thesis
                </h3>
                <div className="bg-pink-950/10 p-6 rounded-[2rem] border border-pink-500/20">
                    <p className="text-pink-100/90 text-[11px] leading-relaxed font-black">"${scene.visual_notes}"</p>
                    <div className="mt-3 text-[9px] text-pink-500/60 font-black uppercase tracking-widest">Analyson v8.0 • PolyMatter Mode</div>
                </div>
            </div>
        </div>

        <div className="space-y-4">
            <h3 className="text-indigo-400 text-[10px] uppercase tracking-[0.5em] font-black flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-indigo-500"></span>
                Strict Consistent VO
            </h3>
            <div className="bg-slate-950 border-l-[8px] border-indigo-600 p-8 rounded-r-[2.5rem] shadow-2xl relative overflow-hidden">
                <p className="text-white italic font-serif leading-relaxed text-2xl relative z-10 font-medium">"{scene.dialog}"</p>
                <div className="mt-4 flex flex-wrap items-center gap-3">
                    <span className="px-3 py-1 bg-indigo-500 text-white text-[9px] font-black uppercase tracking-widest rounded-lg">VO LOCK: Male Documentary Narrator</span>
                    <span className="px-3 py-1 bg-slate-800 text-slate-400 text-[9px] font-black uppercase tracking-widest rounded-lg">STRICT: NO MUSIC</span>
                    {isMasterScene && <span className="px-3 py-1 bg-pink-600 text-white text-[9px] font-black uppercase tracking-widest rounded-lg">MYSTERY HOOK</span>}
                </div>
            </div>
        </div>

        <div className="mt-auto pt-8 border-t border-slate-800 flex items-start gap-8">
             <div className="flex-shrink-0 w-16 h-16 rounded-[1.25rem] bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg transform -rotate-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.106-1.79V10.333z" />
                </svg>
             </div>
             <div className="flex-1">
                <span className="text-[11px] font-black text-indigo-400 uppercase tracking-[0.5em] block mb-2">Sequential Hook</span>
                <p className="text-white text-lg font-black italic tracking-tight">"{scene.ctr_message}"</p>
             </div>
        </div>
      </div>
    </div>
  );
};
