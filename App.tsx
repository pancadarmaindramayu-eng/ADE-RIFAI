import React, { useState } from 'react';
import { Header } from './components/Header.tsx';
import { SceneCard } from './components/SceneCard.tsx';
import { MetadataDisplay } from './components/MetadataDisplay.tsx';
import { ThumbnailGenerator } from './components/ThumbnailGenerator.tsx';
import { generateStoryboard, generateSceneImage, generateAdditionalScene } from './services/geminiService.ts';
import { StoryInput, Storyboard, Scene, ShortScript, CATEGORIES, AUDIENCES, LANGUAGES, VIDEO_FORMATS } from './types.ts';
import { CHARACTERS } from './constants.ts';

const App: React.FC = () => {
  const [formData, setFormData] = useState<StoryInput>({
    input_type: 'concept',
    story_type: 'hybrid',
    story_concept: '',
    news_link: '',
    thumbnail_sample: '',
    category_niche: CATEGORIES[3], 
    scene_count: '8', 
    target_audience: AUDIENCES[0],
    language: LANGUAGES[0],
    video_format: 'long',
    selected_characters: CHARACTERS.map(c => c.name)
  });
  
  const [storyboard, setStoryboard] = useState<Storyboard | null>(null);
  const [loading, setLoading] = useState(false);
  const [addingScene, setAddingScene] = useState(false);
  const [isManualAdding, setIsManualAdding] = useState(false);
  const [copiedPromptId, setCopiedPromptId] = useState<number | null>(null);
  const [manualScene, setManualScene] = useState<Partial<Scene>>({
    narrative_section: '',
    setting: '',
    actions: '',
    dialog: '',
    visual_notes: '',
    emotion: 'Neutral',
    characters: []
  });

  const [error, setError] = useState<string | null>(null);
  const [generatingMaster, setGeneratingMaster] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'video_format') {
      const newCount = value === 'short' ? '5' : '8';
      setFormData(prev => ({ ...prev, [name]: value as any, scene_count: newCount }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleInputTypeChange = (type: 'concept' | 'link') => {
    setFormData(prev => ({ ...prev, input_type: type }));
  };

  const handleStoryTypeChange = (type: 'hybrid' | 'human') => {
    setFormData(prev => ({ ...prev, story_type: type }));
  };

  const handleCharacterToggle = (charName: string) => {
    setFormData(prev => {
      const current = prev.selected_characters;
      const isSelected = current.includes(charName);
      if (isSelected) {
        if (current.length === 1) return prev;
        return { ...prev, selected_characters: current.filter(n => n !== charName) };
      } else {
        return { ...prev, selected_characters: [...current, charName] };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setStoryboard(null);
    try {
      const result = await generateStoryboard(formData);
      setStoryboard(result);
    } catch (err: any) {
      setError(err.message || "V8 Engine failed. Check API quota.");
    } finally {
      setLoading(false);
    }
  };

  const copyVideoPrompt = (prompt: string, id: number) => {
    navigator.clipboard.writeText(prompt);
    setCopiedPromptId(id);
    setTimeout(() => setCopiedPromptId(null), 2000);
  };

  const handleAddSceneAI = async () => {
    if (!storyboard) return;
    setAddingScene(true);
    try {
      const newScene = await generateAdditionalScene(storyboard, formData.language);
      setStoryboard({
        ...storyboard,
        scenes: [...storyboard.scenes, newScene]
      });
    } catch (err) {
      console.error(err);
      alert("AI Sequential Addition Failed.");
    } finally {
      setAddingScene(false);
    }
  };

  const handleAddSceneManual = () => {
    if (!storyboard) return;
    const nextNum = storyboard.scenes.length + 1;
    const scene: Scene = {
        scene_number: nextNum,
        narrative_section: manualScene.narrative_section || "Sequential Analysis",
        setting: manualScene.setting || "Internal Environment",
        actions: manualScene.actions || "Data progression in progress",
        dialog: manualScene.dialog || "Voice over content here",
        visual_notes: manualScene.visual_notes || "Fact-rich visual logic",
        emotion: manualScene.emotion || "Analytical",
        characters: formData.story_type === 'human' ? (manualScene.characters && manualScene.characters.length > 0 ? manualScene.characters : formData.selected_characters) : [],
        ctr_message: "Stay tuned for further geopolitical insight."
    };
    
    setStoryboard({
        ...storyboard,
        scenes: [...storyboard.scenes, scene]
    });
    setIsManualAdding(false);
    setManualScene({ narrative_section: '', setting: '', actions: '', dialog: '', visual_notes: '', emotion: 'Neutral', characters: [] });
  };

  const handleUpdateScene = (updatedScene: Scene) => {
    if (!storyboard) return;
    const newScenes = storyboard.scenes.map(s => s.scene_number === updatedScene.scene_number ? updatedScene : s);
    setStoryboard({ ...storyboard, scenes: newScenes });
  };

  const handleGenerateMasterOnly = async () => {
    if (!storyboard) return;
    setGeneratingMaster(true);
    const scene1 = storyboard.scenes[0];
    try {
        const ratio = formData.video_format === 'long' ? '16:9' : '9:16';
        const url = await generateSceneImage(scene1, ratio, storyboard.story_type);
        handleUpdateScene({ ...scene1, visual_image: url });
    } catch (e) {
        console.error("Master image generation failed", e);
    } finally {
        setGeneratingMaster(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] pb-24 selection:bg-indigo-500/30">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <section className="mb-20">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-br from-indigo-400 via-purple-500 to-pink-500 mb-6 tracking-tighter filter drop-shadow-sm">Karakter Paten v8</h2>
                    <p className="text-slate-400 text-2xl font-medium tracking-tight max-w-2xl mx-auto leading-snug italic">V8 Documentary Engine • PolyMatter Visual Flow</p>
                </div>

                <form onSubmit={handleSubmit} className="bg-slate-900/60 backdrop-blur-2xl p-12 rounded-[3.5rem] border border-slate-800 shadow-[0_20px_50px_rgba(0,0,0,0.5)] space-y-12">
                    <div className="space-y-6">
                        <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em] block text-center">Engine Logic Selection</label>
                        <div className="flex bg-slate-950 p-2 rounded-2xl w-full max-md mx-auto border border-slate-800 shadow-inner">
                            <button type="button" onClick={() => handleStoryTypeChange('human')} className={`flex-1 flex flex-col items-center gap-1 py-4 rounded-xl transition-all ${formData.story_type === 'human' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}>
                                <span className="text-sm font-black uppercase tracking-tighter">Human Analytical</span>
                                <span className="text-[9px] opacity-70 font-bold uppercase tracking-widest">DNA Consistency</span>
                            </button>
                            <button type="button" onClick={() => handleStoryTypeChange('hybrid')} className={`flex-1 flex flex-col items-center gap-1 py-4 rounded-xl transition-all ${formData.story_type === 'hybrid' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}>
                                <span className="text-sm font-black uppercase tracking-tighter">Hybrid Documentary</span>
                                <span className="text-[9px] opacity-70 font-bold uppercase tracking-widest">Sequential Maps</span>
                            </button>
                        </div>
                    </div>

                    <div className="flex bg-slate-950 p-2 rounded-2xl w-fit mx-auto border border-slate-800 shadow-inner">
                        <button type="button" onClick={() => handleInputTypeChange('concept')} className={`px-12 py-3.5 rounded-xl text-sm font-black transition-all ${formData.input_type === 'concept' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-white'}`}>Documentary Concept</button>
                        <button type="button" onClick={() => handleInputTypeChange('link')} className={`px-12 py-3.5 rounded-xl text-sm font-black transition-all ${formData.input_type === 'link' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-white'}`}>Media Context Link</button>
                    </div>

                    <div className="space-y-6">
                        {formData.input_type === 'concept' ? (
                            <textarea id="story_concept" name="story_concept" required rows={3} placeholder="Apa tesis ekonomi atau kebijakan yang ingin kita bedah secara sinematik?" value={formData.story_concept} onChange={handleInputChange} className="w-full bg-slate-950/50 border border-slate-800 rounded-3xl px-8 py-6 text-white placeholder-slate-700 focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all text-2xl font-medium shadow-inner" />
                        ) : (
                            <input type="url" id="news_link" name="news_link" required placeholder="Paste analytical source link here..." value={formData.news_link} onChange={handleInputChange} className="w-full bg-slate-950/50 border border-slate-800 rounded-3xl px-8 py-6 text-white placeholder-slate-700 focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all text-2xl font-medium shadow-inner" />
                        )}
                    </div>

                    <div className="space-y-4">
                        <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em] block">Thumbnail Visual Reference / Hook Sample</label>
                        <textarea id="thumbnail_sample" name="thumbnail_sample" rows={2} placeholder="Masukan contoh judul atau hook thumbnail (e.g. Gaya Dokumenter Global, Hook Kontroversial)" value={formData.thumbnail_sample} onChange={handleInputChange} className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-6 py-4 text-white placeholder-slate-700 focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all text-sm font-medium shadow-inner" />
                    </div>

                    {formData.story_type === 'human' && (
                        <div className="space-y-6 animate-fade-in">
                            <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em] block text-center">DNA Master Selection</label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                {CHARACTERS.map((char) => (
                                    <div key={char.name} onClick={() => handleCharacterToggle(char.name)} className={`cursor-pointer border-2 rounded-[2rem] p-8 flex flex-col items-center gap-5 transition-all duration-300 ${formData.selected_characters.includes(char.name) ? 'bg-indigo-900/10 border-indigo-500 shadow-[0_0_30px_rgba(79,70,229,0.15)] scale-105' : 'bg-slate-950 border-slate-800 opacity-30 hover:opacity-100'}`}>
                                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white font-black text-3xl shadow-2xl transform rotate-3 ${char.avatarColor}`}>{char.name[0]}</div>
                                        <span className="text-base font-black text-white tracking-tighter">{char.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Doc Niche</label>
                            <select name="category_niche" value={formData.category_niche} onChange={handleInputChange} className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-white text-sm font-bold outline-none">
                                {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Target Language</label>
                            <select name="language" value={formData.language} onChange={handleInputChange} className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-white text-sm font-bold outline-none">
                                {LANGUAGES.map(lang => <option key={lang} value={lang}>{lang}</option>)}
                            </select>
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Master Format</label>
                            <select name="video_format" value={formData.video_format} onChange={handleInputChange} className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-white text-sm font-black outline-none border-indigo-500/20">
                                {VIDEO_FORMATS.map(f => <option key={f.id} value={f.id}>{f.label}</option>)}
                            </select>
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Doc Sections</label>
                            <input type="text" name="scene_count" value={formData.scene_count} onChange={handleInputChange} className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-white text-sm font-black text-center outline-none" />
                        </div>
                    </div>

                    <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:shadow-[0_0_50px_rgba(79,70,229,0.3)] active:scale-[0.98] text-white font-black py-7 rounded-[2.5rem] transition-all flex items-center justify-center gap-6 text-2xl uppercase tracking-tighter">
                        {loading ? "V8 DOCUMENTARY ENGINE PROCESSING..." : "GENERATE PRODUCTION PACKAGE V8"}
                    </button>
                    {error && <div className="text-red-400 text-sm text-center font-bold bg-red-500/10 p-6 rounded-2xl border border-red-500/20">{error}</div>}
                </form>
            </div>
        </section>

        {storyboard && (
            <div className="space-y-20 animate-fade-in">
                <MetadataDisplay metadata={storyboard.metadata} />
                
                {storyboard.shorts && (
                    <div className="bg-slate-900 border border-slate-800 p-12 rounded-[3.5rem] shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8">
                             <span className="px-4 py-1 bg-pink-600 text-white text-[9px] font-black uppercase tracking-widest rounded-lg">Growth Funnel Active</span>
                        </div>
                        <h3 className="text-white font-black text-2xl mb-2 flex items-center gap-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                            Viral Shorts Scripts (6s Master Flow)
                        </h3>
                        <p className="text-slate-500 text-sm font-bold uppercase tracking-[0.2em] mb-10">Setiap Short merupakan rangkuman strategis untuk long video</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {storyboard.shorts.map((short, i) => (
                                <div key={i} className="bg-slate-950 p-8 rounded-[2.5rem] border border-slate-800 group hover:border-pink-500/40 transition-all flex flex-col h-full shadow-lg">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="flex flex-col">
                                           <span className="text-pink-500 font-black text-xs uppercase tracking-widest">Short #{short.id}</span>
                                           <span className="text-slate-600 font-black text-[9px] uppercase tracking-widest">Ref: Scene ${short.source_scene}</span>
                                        </div>
                                        <div className="px-3 py-1 bg-slate-900 rounded-lg text-[8px] font-black text-slate-500 uppercase">{short.emotion}</div>
                                    </div>
                                    
                                    <p className="text-white text-xl italic font-serif leading-relaxed flex-grow mb-8">"{short.narration}"</p>
                                    
                                    <div className="space-y-4 pt-6 border-t border-slate-800/50">
                                        <div className="bg-slate-900/50 p-4 rounded-2xl">
                                            <span className="text-[9px] text-indigo-400 font-black uppercase tracking-widest block mb-2">Video Prod. Prompt (Grok 30-60s)</span>
                                            <p className="text-[10px] text-slate-400 leading-relaxed line-clamp-3 mb-3">{short.video_production_prompt}</p>
                                            <button 
                                                onClick={() => copyVideoPrompt(short.video_production_prompt, short.id)}
                                                className={`w-full py-2 rounded-xl text-[10px] font-black uppercase transition-all flex items-center justify-center gap-2 ${copiedPromptId === short.id ? 'bg-emerald-600 text-white' : 'bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600 hover:text-white'}`}
                                            >
                                                {copiedPromptId === short.id ? 'Copied!' : 'Copy Video Prompt'}
                                            </button>
                                        </div>
                                        
                                        <div className="flex items-center gap-2 px-2">
                                            <span className="text-[9px] text-slate-600 font-black uppercase tracking-widest">Logic:</span>
                                            <span className="text-[9px] text-slate-500 font-bold uppercase">{short.purpose}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <ThumbnailGenerator storyboard={storyboard} sampleHook={formData.thumbnail_sample} />

                <div className="flex flex-col md:flex-row justify-between items-center gap-10 border-b border-slate-800 pb-16">
                    <div className="text-center md:text-left flex-1">
                        <div className="flex items-center gap-4 justify-center md:justify-start mb-4">
                            <span className={`px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${storyboard.story_type === 'hybrid' ? 'bg-indigo-600 text-white shadow-[0_0_15px_rgba(79,70,229,0.4)]' : 'bg-pink-600 text-white shadow-[0_0_15px_rgba(236,72,153,0.4)]'}`}>
                                ENGINE v8 • DOCUMENTARY PRODUCTION
                            </span>
                        </div>
                        <h2 className="text-6xl font-black text-white leading-none mb-6 tracking-tighter">{storyboard.storyboard_title}</h2>
                        <div className="flex flex-wrap justify-center md:justify-start gap-4">
                            <span className="px-6 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-[11px] font-black text-indigo-400 uppercase tracking-[0.2em]">Master Ratio: {storyboard.image_ratio}</span>
                            <span className="px-6 py-2 bg-slate-900 border border-slate-800 rounded-full text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">{storyboard.scenes.length} Production Segments</span>
                        </div>
                    </div>
                    <button onClick={handleGenerateMasterOnly} disabled={generatingMaster} className="px-12 py-6 bg-white text-black hover:bg-slate-200 rounded-3xl font-black shadow-2xl transition-all">
                        {generatingMaster ? "RENDERING..." : `RENDER THESIS ANCHOR`}
                    </button>
                </div>

                <div className="grid grid-cols-1 gap-20">
                    {storyboard.scenes.map((scene, index) => (
                        <SceneCard 
                            key={scene.scene_number} 
                            scene={scene} 
                            onUpdateScene={handleUpdateScene} 
                            ratio={storyboard.image_ratio}
                            storyType={storyboard.story_type}
                            previousScene={index > 0 ? storyboard.scenes[index - 1] : undefined}
                        />
                    ))}
                    
                    <div className="flex flex-col items-center gap-12 pt-10">
                        {!isManualAdding ? (
                            <div className="flex flex-col md:flex-row gap-6 w-full max-w-4xl">
                                <button onClick={handleAddSceneAI} disabled={addingScene} className="flex-1 group flex flex-col items-center gap-4 p-10 bg-slate-900/50 border-2 border-dashed border-slate-700 rounded-[3rem] hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all">
                                  <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center">
                                    {addingScene ? <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>}
                                  </div>
                                  <span className="text-lg font-black text-white uppercase tracking-tighter">AI Sequential Extend</span>
                                </button>
                                <button onClick={() => setIsManualAdding(true)} className="flex-1 group flex flex-col items-center gap-4 p-10 bg-slate-900/50 border-2 border-dashed border-slate-700 rounded-[3rem] hover:border-pink-500/50 hover:bg-pink-500/5 transition-all">
                                  <div className="w-16 h-16 rounded-2xl bg-pink-600 flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                  </div>
                                  <span className="text-lg font-black text-white uppercase tracking-tighter">Manual Sequence</span>
                                </button>
                            </div>
                        ) : (
                            <div className="w-full max-w-4xl bg-slate-900 border border-slate-800 p-12 rounded-[3.5rem] shadow-2xl space-y-8 animate-fade-in">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Add Documentary Segment</h3>
                                    <button onClick={() => setIsManualAdding(false)} className="text-slate-500 hover:text-white font-black text-sm uppercase">Cancel</button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Narrative Section</label>
                                        <input type="text" placeholder="e.g. Cause-Effect Chain / Future Echo" className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-white font-bold outline-none" value={manualScene.narrative_section} onChange={e => setManualScene({...manualScene, narrative_section: e.target.value})} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Emotion/Vibe</label>
                                        <input type="text" placeholder="e.g. Controlled Tension" className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-white font-bold outline-none" value={manualScene.emotion} onChange={e => setManualScene({...manualScene, emotion: e.target.value})} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Setting / Thesis Point</label>
                                    <input type="text" placeholder="e.g. Geopolitical Map / Industrial Zone" className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-white font-bold outline-none" value={manualScene.setting} onChange={e => setManualScene({...manualScene, setting: e.target.value})} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Sequential Action (Doc Flow)</label>
                                    <textarea placeholder="Melanjutkan visual sebelumnya secara berkesinambungan..." className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-white font-bold outline-none h-24" value={manualScene.actions} onChange={e => setManualScene({...manualScene, actions: e.target.value})} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Doc Script (Pace: 140 WPM)</label>
                                    <textarea placeholder="Tulis narasi dokumenter profesional..." className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-white font-bold outline-none h-24" value={manualScene.dialog} onChange={e => setManualScene({...manualScene, dialog: e.target.value})} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Visual Data Logic (PolyMatter style)</label>
                                    <textarea placeholder="Poin data untuk diintegrasikan secara organik (Chart/Map)..." className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-white font-bold outline-none h-24" value={manualScene.visual_notes} onChange={e => setManualScene({...manualScene, visual_notes: e.target.value})} />
                                </div>
                                <button onClick={handleAddSceneManual} className="w-full py-6 bg-indigo-600 hover:bg-indigo-500 text-white rounded-[1.5rem] font-black text-lg uppercase shadow-2xl transition-all">Add Documentary Segment</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        )}
      </main>
    </div>
  );
};

export default App;