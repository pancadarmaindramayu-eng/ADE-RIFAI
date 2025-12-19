import React, { useState } from 'react';
import { THUMBNAIL_STYLES, Storyboard } from '../types.ts';
import { generateThumbnailImage } from '../services/geminiService.ts';

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

  return (
    <div className="space-y-10 border-t border-slate-800 pt-16">
      <div className="text-center">
        <h3 className="text-3xl font-bold text-white mb-2">Thumbnail Production Pack</h3>
        <p className="text-slate-500">Multi-style growth hooks for maximized CTR</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {THUMBNAIL_STYLES.map(style => (
          <div key={style.id} className="glass-panel rounded-3xl overflow-hidden flex flex-col group">
            <div className="aspect-video bg-slate-950 relative">
              {thumbs[style.id] ? (
                <img src={thumbs[style.id]} alt={style.label} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
                  <div className={`p-4 rounded-full bg-slate-900 mb-4 ${loading[style.id] ? 'animate-pulse' : ''}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  </div>
                  {loading[style.id] && <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">Rendering v8...</span>}
                </div>
              )}
              
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                <button 
                  onClick={() => handleGenerate(style.id)}
                  disabled={loading[style.id]}
                  className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold text-xs"
                >
                  {loading[style.id] ? "Processing..." : `Render ${style.id}`}
                </button>
              </div>
            </div>
            <div className="p-6">
              <h4 className="text-white font-bold mb-1">{style.label}</h4>
              <p className="text-slate-500 text-xs leading-relaxed">{style.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};