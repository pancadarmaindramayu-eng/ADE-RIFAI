
import React, { useState } from 'react';
import { THUMBNAIL_STYLES, Storyboard } from '../types.ts';
import { generateThumbnailImage } from '../services/geminiService.ts';

interface ThumbnailGeneratorProps {
  storyboard: Storyboard;
  sampleHook?: string;
}

export const ThumbnailGenerator: React.FC<ThumbnailGeneratorProps> = ({ storyboard, sampleHook }) => {
  const [thumbnails, setThumbnails] = useState<Record<string, string>>({});
  const [shortThumbnails, setShortThumbnails] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  const longRatio = "16:9";
  const shortRatio = "9:16";

  const handleGenerate = async (styleId: string, ratio: string, setFn: React.Dispatch<React.SetStateAction<Record<string, string>>>) => {
    const key = `${styleId}_${ratio}`;
    setLoading(prev => ({ ...prev, [key]: true }));
    try {
      const url = await generateThumbnailImage(
        styleId, 
        storyboard.storyboard_title, 
        storyboard.metadata.analytical_summary,
        storyboard.scenes[0].characters || [],
        ratio,
        storyboard.story_type,
        sampleHook
      );
      setFn(prev => ({ ...prev, [styleId]: url }));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(prev => ({ ...prev, [key]: false }));
    }
  };

  const generateAllLong = async () => {
    for (const style of THUMBNAIL_STYLES) {
      if (!thumbnails[style.id]) {
        await handleGenerate(style.id, longRatio, setThumbnails);
      }
    }
  };

  const download = (url: string, id: string, ratio: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `thumb_${ratio.replace(':', 'x')}_${id}.png`;
    link.click();
  };

  return (
    <div className="space-y-12 mb-10">
      {/* Long Format Thumbnails */}
      <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl">
        <div className="bg-gradient-to-r from-indigo-600/20 to-purple-600/20 p-8 border-b border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h3 className="text-white font-black text-2xl flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              Master Documentary Thumbnails (16:9)
            </h3>
            <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mt-1">Curiosity-driven landscape framing</p>
          </div>
          <button onClick={generateAllLong} className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black transition-all shadow-lg text-sm uppercase tracking-tighter">
            Generate All 16:9
          </button>
        </div>
        <div className="p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {THUMBNAIL_STYLES.map((style) => {
             const key = `${style.id}_${longRatio}`;
             return (
                <div key={style.id} className="bg-slate-800/50 rounded-3xl border border-slate-700 overflow-hidden flex flex-col group">
                  <div className={`relative bg-slate-950 w-full aspect-video`}>
                    {thumbnails[style.id] ? (
                      <>
                        <img src={thumbnails[style.id]} alt={style.label} className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-700" />
                        <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 backdrop-blur-sm">
                          <button onClick={() => handleGenerate(style.id, longRatio, setThumbnails)} className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl backdrop-blur-md">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                          </button>
                          <button onClick={() => download(thumbnails[style.id]!, style.id, longRatio)} className="p-3 bg-indigo-600 hover:bg-indigo-500 rounded-2xl shadow-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
                        {loading[key] ? (
                          <div className="flex flex-col items-center gap-3">
                             <div className="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
                             <span className="text-[10px] text-indigo-400 font-black uppercase tracking-widest">Rendering 16:9...</span>
                          </div>
                        ) : (
                          <button onClick={() => handleGenerate(style.id, longRatio, setThumbnails)} className="text-slate-600 hover:text-indigo-400 transition-all flex flex-col items-center gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            <span className="text-[11px] font-black uppercase tracking-tighter">Render {style.label}</span>
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
             )
          })}
        </div>
      </div>

      {/* Shorts Format Thumbnails (9:16) */}
      <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl">
        <div className="bg-gradient-to-r from-pink-600/20 to-orange-600/20 p-8 border-b border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h3 className="text-white font-black text-2xl flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
              Growth Funnel Thumbnails (9:16)
            </h3>
            <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mt-1">Scroll-stopping vertical logic</p>
          </div>
          <button onClick={() => { THUMBNAIL_STYLES.slice(0, 4).forEach(s => handleGenerate(s.id, shortRatio, setShortThumbnails)) }} className="px-8 py-3 bg-pink-600 hover:bg-pink-500 text-white rounded-2xl font-black transition-all shadow-lg text-sm uppercase tracking-tighter">
            Generate 9:16 Pack
          </button>
        </div>
        <div className="p-8 grid grid-cols-2 md:grid-cols-4 gap-8">
          {THUMBNAIL_STYLES.slice(0, 4).map((style) => {
             const key = `${style.id}_${shortRatio}`;
             return (
                <div key={style.id} className="bg-slate-800/50 rounded-3xl border border-slate-700 overflow-hidden flex flex-col group">
                  <div className={`relative bg-slate-950 w-full aspect-[9/16]`}>
                    {shortThumbnails[style.id] ? (
                      <>
                        <img src={shortThumbnails[style.id]} alt={style.label} className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-700" />
                        <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-4 backdrop-blur-sm">
                          <button onClick={() => handleGenerate(style.id, shortRatio, setShortThumbnails)} className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl backdrop-blur-md">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                          </button>
                          <button onClick={() => download(shortThumbnails[style.id]!, style.id, shortRatio)} className="p-3 bg-pink-600 hover:bg-pink-500 rounded-2xl shadow-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
                        {loading[key] ? (
                          <div className="flex flex-col items-center gap-3">
                             <div className="w-10 h-10 border-4 border-pink-500/30 border-t-pink-500 rounded-full animate-spin"></div>
                             <span className="text-[10px] text-pink-400 font-black uppercase tracking-widest">Rendering 9:16...</span>
                          </div>
                        ) : (
                          <button onClick={() => handleGenerate(style.id, shortRatio, setShortThumbnails)} className="text-slate-600 hover:text-pink-400 transition-all flex flex-col items-center gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            <span className="text-[11px] font-black uppercase tracking-tighter">Render Vertical</span>
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
             )
          })}
        </div>
      </div>
    </div>
  );
};
