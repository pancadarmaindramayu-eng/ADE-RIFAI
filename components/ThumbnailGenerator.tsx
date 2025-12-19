
import React, { useState } from 'react';
import { THUMBNAIL_STYLES, Storyboard } from '../types.ts';
import { generateThumbnailImage } from '../services/api.ts';

interface ThumbnailGeneratorProps {
  storyboard: Storyboard;
  sampleHook?: string;
}

export const ThumbnailGenerator: React.FC<ThumbnailGeneratorProps> = ({ storyboard, sampleHook }) => {
  const [thumbs, setThumbs] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  const handleGenerate = async (styleId: string) => {
    setLoading(prev => ({ ...prev, [styleId]: true }));
    try {
      const url = await generateThumbnailImage(
        styleId,
        storyboard.storyboard_title,
        storyboard.metadata.analytical_summary,
        storyboard.scenes[0].characters || [],
        storyboard.image_ratio,
        storyboard.story_type,
        sampleHook
      );
      setThumbs(prev => ({ ...prev, [styleId]: url }));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(prev => ({ ...prev, [styleId]: false }));
    }
  };

  const handleDownload = (styleId: string) => {
    const url = thumbs[styleId];
    if (!url) return;
    const link = document.createElement('a');
    link.href = url;
    link.download = `thumbnail_v9_${styleId}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-8 md:p-12 space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/10 pb-10">
        <div>
          <h3 className="text-3xl font-black text-white tracking-tighter mb-2">Strategic Thumbnail Suite v9</h3>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Testing visual authority for ${storyboard.image_ratio === '9:16' ? 'Vertical Shorts' : 'Horizontal Cinema'}</p>
        </div>
        <div className="flex gap-4">
            <span className="px-4 py-2 bg-indigo-500/10 text-indigo-400 text-[9px] font-black uppercase rounded-full border border-indigo-500/20">A/B Testing Optimized</span>
        </div>
      </div>

      <div className={`grid grid-cols-1 ${storyboard.image_ratio === '9:16' ? 'sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5' : 'sm:grid-cols-2 lg:grid-cols-3'} gap-8`}>
        {THUMBNAIL_STYLES.map(style => (
          <div key={style.id} className="glass-panel rounded-[2.5rem] overflow-hidden flex flex-col group border-white/5 transition-all hover:border-indigo-500/30 bg-black/20">
            <div className={`relative bg-slate-950 ${storyboard.image_ratio === '9:16' ? 'aspect-[9/16]' : 'aspect-video'}`}>
              {thumbs[style.id] ? (
                <div className="w-full h-full relative group">
                   <img src={thumbs[style.id]} alt={style.label} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                   <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 backdrop-blur-sm">
                      <button onClick={() => handleGenerate(style.id)} className="bg-white text-black p-4 rounded-full hover:scale-110 transition-transform shadow-2xl">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                      </button>
                      <button onClick={() => handleDownload(style.id)} className="bg-indigo-600 text-white p-4 rounded-full hover:scale-110 transition-transform shadow-2xl">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                      </button>
                   </div>
                </div>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center">
                  <div className={`p-6 rounded-[2rem] bg-slate-900/50 mb-6 border border-white/5 ${loading[style.id] ? 'animate-pulse' : ''}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  </div>
                  <button 
                    onClick={() => handleGenerate(style.id)}
                    disabled={loading[style.id]}
                    className="px-5 py-2.5 bg-white/5 border border-white/10 text-white font-black text-[10px] rounded-xl uppercase tracking-widest hover:bg-white hover:text-black transition-all"
                  >
                    {loading[style.id] ? "Rendering..." : `Gen ${style.label}`}
                  </button>
                </div>
              )}
            </div>
            <div className="p-8">
              <div className="flex justify-between items-start mb-2">
                <h4 className="text-white font-black text-lg leading-tight">{style.label}</h4>
                <span className="text-[9px] font-black px-2 py-1 bg-white/5 rounded text-slate-500 border border-white/5 uppercase">V9</span>
              </div>
              <p className="text-slate-500 text-[11px] leading-relaxed line-clamp-2">{style.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
