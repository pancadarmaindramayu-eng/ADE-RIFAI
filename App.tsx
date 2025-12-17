import React, { useState } from 'react';
import { Header } from './components/Header';
import { SceneCard } from './components/SceneCard';
import { generateStoryboard, generateSceneImage } from './services/geminiService';
import { StoryInput, Storyboard, Scene, CATEGORIES, AUDIENCES, LANGUAGES, ASPECT_RATIOS } from './types';
import { CHARACTERS } from './constants';

const App: React.FC = () => {
  const [formData, setFormData] = useState<StoryInput>({
    input_type: 'concept',
    story_concept: '',
    news_link: '',
    category_niche: CATEGORIES[0],
    scene_count: 5,
    target_audience: AUDIENCES[0],
    language: LANGUAGES[0],
    aspect_ratio: ASPECT_RATIOS[0],
    selected_characters: CHARACTERS.map(c => c.name) // Default to all selected
  });
  
  const [storyboard, setStoryboard] = useState<Storyboard | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatingAll, setGeneratingAll] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'scene_count' ? Math.min(50, Math.max(1, parseInt(value) || 1)) : value
    }));
  };

  const handleInputTypeChange = (type: 'concept' | 'link') => {
    setFormData(prev => ({ ...prev, input_type: type }));
  };

  const handleCharacterToggle = (charName: string) => {
    setFormData(prev => {
      const current = prev.selected_characters;
      const isSelected = current.includes(charName);
      if (isSelected) {
        // Prevent deselecting the last character
        if (current.length === 1) return prev;
        return { ...prev, selected_characters: current.filter(n => n !== charName) };
      } else {
        return { ...prev, selected_characters: [...current, charName] };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.input_type === 'concept' && !formData.story_concept) return;
    if (formData.input_type === 'link' && !formData.news_link) return;

    setLoading(true);
    setError(null);
    setStoryboard(null);

    try {
      const result = await generateStoryboard(formData);
      setStoryboard(result);
    } catch (err: any) {
      setError(err.message || "Failed to generate storyboard. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateScene = (updatedScene: Scene) => {
    if (!storyboard) return;
    const newScenes = storyboard.scenes.map(s => 
      s.scene_number === updatedScene.scene_number ? updatedScene : s
    );
    setStoryboard({ ...storyboard, scenes: newScenes });
  };

  const handleGenerateAllImages = async () => {
    if (!storyboard) return;
    setGeneratingAll(true);
    
    // We process sequentially to be nice to the rate limits, or blocks of 3
    const newScenes = [...storyboard.scenes];
    const currentRatio = storyboard.image_ratio; // Capture current ratio for async calls
    
    // Create a copy for the UI update function
    const updateSceneInState = (sc: Scene, url: string) => {
        setStoryboard(current => {
            if (!current) return null;
            return {
                ...current,
                scenes: current.scenes.map(s => s.scene_number === sc.scene_number ? { ...s, visual_image: url } : s)
            };
        });
    };

    try {
        for (let i = 0; i < newScenes.length; i++) {
            const scene = newScenes[i];
            if (!scene.visual_image) {
                try {
                    const url = await generateSceneImage(scene, currentRatio);
                    updateSceneInState(scene, url);
                } catch (e) {
                    console.error(`Failed to gen image for scene ${scene.scene_number}`, e);
                }
            }
        }
    } finally {
        setGeneratingAll(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 pb-20">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Input Form */}
        <section className="mb-16">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-white mb-2">Create Your Story</h2>
                    <p className="text-slate-400">Enter a concept or news link. The AI will generate a storyboard with our fixed characters.</p>
                </div>

                <form onSubmit={handleSubmit} className="bg-slate-900 p-6 md:p-8 rounded-2xl border border-slate-800 shadow-xl space-y-6">
                    
                    {/* Input Type Toggle */}
                    <div className="flex bg-slate-800 p-1 rounded-lg w-fit mx-auto mb-4">
                        <button
                            type="button"
                            onClick={() => handleInputTypeChange('concept')}
                            className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
                                formData.input_type === 'concept' 
                                ? 'bg-indigo-600 text-white shadow' 
                                : 'text-slate-400 hover:text-white'
                            }`}
                        >
                            Story Concept
                        </button>
                        <button
                            type="button"
                            onClick={() => handleInputTypeChange('link')}
                            className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
                                formData.input_type === 'link' 
                                ? 'bg-indigo-600 text-white shadow' 
                                : 'text-slate-400 hover:text-white'
                            }`}
                        >
                            News / Video Link
                        </button>
                    </div>

                    {/* Conditional Input Field */}
                    <div>
                        {formData.input_type === 'concept' ? (
                            <>
                                <label htmlFor="story_concept" className="block text-sm font-medium text-slate-300 mb-2">Story Concept / Topic</label>
                                <input
                                    type="text"
                                    id="story_concept"
                                    name="story_concept"
                                    required={formData.input_type === 'concept'}
                                    placeholder="e.g., The Discovery of Penicillin, The History of Batik"
                                    value={formData.story_concept}
                                    onChange={handleInputChange}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                />
                            </>
                        ) : (
                            <>
                                <label htmlFor="news_link" className="block text-sm font-medium text-slate-300 mb-2">News Article or Video Link</label>
                                <input
                                    type="url"
                                    id="news_link"
                                    name="news_link"
                                    required={formData.input_type === 'link'}
                                    placeholder="e.g., https://www.bbc.com/news/articles/c88888 or YouTube URL"
                                    value={formData.news_link}
                                    onChange={handleInputChange}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                />
                                <p className="text-xs text-slate-500 mt-2">
                                    The AI will attempt to generate a story based on the context of this link.
                                </p>
                            </>
                        )}
                    </div>

                    {/* Character Selection */}
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-3">Select Cast (Characters)</label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {CHARACTERS.map((char) => {
                                const isSelected = formData.selected_characters.includes(char.name);
                                return (
                                    <div 
                                        key={char.name}
                                        onClick={() => handleCharacterToggle(char.name)}
                                        className={`cursor-pointer border rounded-lg p-3 flex items-center gap-3 transition-all ${
                                            isSelected 
                                            ? 'bg-indigo-900/30 border-indigo-500 ring-1 ring-indigo-500/50' 
                                            : 'bg-slate-800 border-slate-700 opacity-60 hover:opacity-100'
                                        }`}
                                    >
                                        <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold text-sm ${char.avatarColor}`}>
                                            {char.name[0]}
                                        </div>
                                        <div className="flex-1">
                                            <div className="text-sm font-medium text-white">{char.name}</div>
                                        </div>
                                        <div className={`w-5 h-5 rounded border flex items-center justify-center ${isSelected ? 'bg-indigo-500 border-indigo-500' : 'border-slate-500'}`}>
                                            {isSelected && (
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-white" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="category_niche" className="block text-sm font-medium text-slate-300 mb-2">Category</label>
                            <select
                                id="category_niche"
                                name="category_niche"
                                value={formData.category_niche}
                                onChange={handleInputChange}
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none"
                            >
                                {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                        </div>
                         <div>
                            <label htmlFor="language" className="block text-sm font-medium text-slate-300 mb-2">Language</label>
                            <select
                                id="language"
                                name="language"
                                value={formData.language}
                                onChange={handleInputChange}
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none"
                            >
                                {LANGUAGES.map(lang => <option key={lang} value={lang}>{lang}</option>)}
                            </select>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label htmlFor="target_audience" className="block text-sm font-medium text-slate-300 mb-2">Audience</label>
                            <select
                                id="target_audience"
                                name="target_audience"
                                value={formData.target_audience}
                                onChange={handleInputChange}
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none"
                            >
                                {AUDIENCES.map(aud => <option key={aud} value={aud}>{aud}</option>)}
                            </select>
                        </div>
                         <div>
                            <label htmlFor="aspect_ratio" className="block text-sm font-medium text-slate-300 mb-2">Aspect Ratio</label>
                            <select
                                id="aspect_ratio"
                                name="aspect_ratio"
                                value={formData.aspect_ratio}
                                onChange={handleInputChange}
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none"
                            >
                                {ASPECT_RATIOS.map(r => <option key={r} value={r}>{r}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="scene_count" className="block text-sm font-medium text-slate-300 mb-2">Scenes (Max 50)</label>
                            <input
                                type="number"
                                id="scene_count"
                                name="scene_count"
                                min="1"
                                max="50"
                                value={formData.scene_count}
                                onChange={handleInputChange}
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                            />
                        </div>
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-4 rounded-xl shadow-lg transform transition hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-3"
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Generating Storyboard...
                                </>
                            ) : (
                                <>
                                    Generate Storyboard
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </>
                            )}
                        </button>
                    </div>
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg text-sm text-center">
                            {error}
                        </div>
                    )}
                </form>
            </div>
        </section>

        {/* Results Section */}
        {storyboard && (
            <section className="animate-fade-in-up">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-white">{storyboard.storyboard_title}</h2>
                        <div className="flex gap-3 mt-2">
                             <span className="px-2 py-1 bg-slate-800 rounded text-xs text-slate-400">Ratio {storyboard.image_ratio}</span>
                             <span className="px-2 py-1 bg-slate-800 rounded text-xs text-slate-400">{storyboard.scenes.length} Scenes</span>
                             <span className="px-2 py-1 bg-indigo-900 rounded text-xs text-indigo-300 border border-indigo-700">{formData.language}</span>
                        </div>
                    </div>
                    <button
                        onClick={handleGenerateAllImages}
                        disabled={generatingAll}
                        className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-indigo-400 border border-indigo-500/30 rounded-lg font-medium transition-colors flex items-center gap-2"
                    >
                        {generatingAll ? 'Generating Images...' : 'Generate All Images'}
                        {!generatingAll && (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                            </svg>
                        )}
                    </button>
                </div>

                <div className="space-y-8">
                    {storyboard.scenes.map((scene) => (
                        <SceneCard 
                            key={scene.scene_number} 
                            scene={scene} 
                            onUpdateScene={handleUpdateScene}
                            ratio={storyboard.image_ratio}
                        />
                    ))}
                </div>
            </section>
        )}
      </main>
    </div>
  );
};

export default App;