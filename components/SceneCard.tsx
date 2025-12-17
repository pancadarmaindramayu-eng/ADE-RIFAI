import React, { useState } from 'react';
import { Scene } from '../types';
import { generateSceneImage } from '../services/geminiService';
import { CHARACTERS } from '../constants';

interface SceneCardProps {
  scene: Scene;
  onUpdateScene: (updatedScene: Scene) => void;
  ratio: string;
}

export const SceneCard: React.FC<SceneCardProps> = ({ scene, onUpdateScene, ratio }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateImage = async () => {
    setLoading(true);
    setError(null);
    try {
      const imageUrl = await generateSceneImage(scene, ratio);
      onUpdateScene({ ...scene, visual_image: imageUrl });
    } catch (err) {
      setError("Failed to generate image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
      if (!scene.visual_image) return;
      
      const link = document.createElement('a');
      link.href = scene.visual_image;
      link.download = `scene_${scene.scene_number}_${ratio.replace(':','-')}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  };

  return (
    <div className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700 shadow-lg flex flex-col md:flex-row">
      {/* Visual Section (Left/Top) */}
      <div className={`relative bg-slate-900 group ${ratio === '9:16' ? 'md:w-1/3 max-w-[300px]' : 'md:w-1/3 lg:w-2/5'}`}>
        <div className={`w-full relative overflow-hidden ${ratio === '9:16' ? 'aspect-[9/16]' : 'aspect-video'}`}>
          {scene.visual_image ? (
            <img 
              src={scene.visual_image} 
              alt={`Scene ${scene.scene_number}`} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 bg-slate-900/50">
               <div className="mb-2">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                 </svg>
               </div>
               <span className="text-xs font-medium uppercase tracking-wider opacity-40">No Image</span>
            </div>
          )}
          
          {/* Overlay Actions */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3 backdrop-blur-sm p-4">
            <button
              onClick={handleGenerateImage}
              disabled={loading}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full font-medium text-sm transition-colors shadow-lg flex items-center gap-2 w-full justify-center max-w-[160px]"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4zm1 14a1 1 0 100-2 1 1 0 000 2zm5-1.757l4.9-4.9a2 2 0 000-2.828L13.485 5.1a2 2 0 00-2.828 0L10 5.757v8.486zM16 18H9.071l6-6H16a2 2 0 012 2v2a2 2 0 01-2 2z" clipRule="evenodd" />
                  </svg>
                  <span>{scene.visual_image ? 'Regenerate' : 'Generate Visual'}</span>
                </>
              )}
            </button>

            {scene.visual_image && (
                <button
                onClick={handleDownload}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white border border-slate-500 rounded-full font-medium text-sm transition-colors shadow-lg flex items-center gap-2 w-full justify-center max-w-[160px]"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    <span>Download</span>
                </button>
            )}
          </div>
        </div>
        
        {/* Scene Number Badge */}
        <div className="absolute top-2 left-2 bg-black/60 text-white text-xs font-bold px-2 py-1 rounded backdrop-blur-md border border-white/10">
          SCENE {scene.scene_number}
        </div>
        
        {error && (
            <div className="absolute bottom-2 left-2 right-2 bg-red-500/90 text-white text-xs p-2 rounded text-center">
                {error}
            </div>
        )}
      </div>

      {/* Content Section (Right/Bottom) */}
      <div className="p-5 flex-1 flex flex-col gap-4">
        <div className="flex justify-between items-start">
            <div>
                <h3 className="text-slate-400 text-xs uppercase tracking-wider font-semibold mb-1">Setting</h3>
                <p className="text-indigo-200 font-medium">{scene.setting}</p>
            </div>
            {/* Character Tags */}
            {scene.characters && scene.characters.length > 0 && (
                <div className="flex flex-wrap gap-1 justify-end max-w-[50%]">
                    {scene.characters.map((charName) => {
                        const charDef = CHARACTERS.find(c => c.name === charName);
                        return (
                             <span key={charName} className={`text-[10px] px-2 py-0.5 rounded-full text-white ${charDef?.avatarColor || 'bg-slate-600'}`}>
                                {charName}
                            </span>
                        );
                    })}
                </div>
            )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700/50">
                <h3 className="text-slate-500 text-xs uppercase tracking-wider font-semibold mb-2">Action</h3>
                <p className="text-slate-300 text-sm leading-relaxed">{scene.actions}</p>
            </div>
            <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700/50">
                <h3 className="text-slate-500 text-xs uppercase tracking-wider font-semibold mb-2 flex justify-between items-center">
                    <span>Emotion</span>
                    <span className="text-[10px] px-1.5 py-0.5 bg-slate-700 rounded text-slate-300">{scene.emotion}</span>
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed">{scene.visual_notes}</p>
            </div>
        </div>

        <div className="mt-auto pt-2">
            <h3 className="text-slate-400 text-xs uppercase tracking-wider font-semibold mb-2">Dialog</h3>
            <div className="bg-indigo-900/20 border-l-4 border-indigo-500 p-3 rounded-r-lg">
                <p className="text-white italic font-serif">"{scene.dialog}"</p>
            </div>
        </div>
      </div>
    </div>
  );
};