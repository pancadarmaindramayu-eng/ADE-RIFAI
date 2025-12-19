
import { GoogleGenAI, Type } from "@google/genai";
import { StoryInput, Storyboard, Scene } from "../types.ts";

export const generateStoryboard = async (input: StoryInput): Promise<Storyboard> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const ratio = input.video_format === 'long' ? '16:9' : '9:16';
  
  const systemInstruction = `You are the 'Karakter Paten V9' Documentary Intelligence Engine.
  
  PERMANENT CHANNEL HALLMARK (VO CHARACTER):
  The Voice Over (VO) MUST be: Authoritative, calm, intellectually dense (140 WPM), and highly analytical. 
  Consistency is key for channel branding. Start with a "Thesis Anchor".
  
  GROK-OPTIMIZED VISUAL PROMPT ENGINE:
  Visual prompts must be strictly compatible with Grok's image generation logic.
  - RULE 1: VISUAL CONTINUITY. Scene 1 and Scene 2+ MUST maintain the same 3D Claymation style, lighting, and character appearance.
  - RULE 2: CHARACTER PERSISTENCE. Always describe the fixed characters (Emma, Pap, Athaya, Nda) with identical keywords in every segment prompt to ensure they look the same across the storyboard.
  - RULE 3: STYLE SEEDING. Use keywords: "Professional 3D Stylized Realism, PolyMatter visual style, Octane 8k render, soft cinematic studio lighting, consistent clay-texture materials".

  PRODUCTION LOGIC:
  1. HYBRID: High-density data overlays, systemic charts, and topological maps integrated into the 3D scene.
  2. HUMAN: Deep family-analytical storytelling focusing on social ethics and character interactions.

  MONETIZATION SAFETY: Ensure high-value educational depth to avoid 'low-effort' or 'repetitive content' flags.`;

  const prompt = `INITIATE V9 PRODUCTION
  Type: ${input.story_type}
  Logic: ${input.story_type === 'hybrid' ? 'Data-rich Information Mapping' : 'Family Education Deep Dive'}
  Concept: ${input.input_type === 'link' ? input.news_link : input.story_concept}
  Format: ${input.video_format} (${ratio})
  Language: ${input.language}
  Segments: ${input.scene_count}

  RETURN JSON PACKAGE:
  {
    "storyboard_title": "...",
    "metadata": {
      "thesis_statement": "...",
      "resolved_niche": { "ui_category": "${input.category_niche}", "youtube_niche": "...", "authority_cluster": "..." },
      "thinking_framework": { "macro_context": "...", "causal_chain": [], "hidden_mechanism": "...", "contrarian_angle": "...", "future_projection": "..." },
      "seo_analysis": { "title_candidates": [], "selected_title": "...", "keyword_cluster": {}, "ctr_formula": "..." },
      "analytical_summary": "...",
      "long_description": "...",
      "hashtags": [],
      "keywords": "..."
    },
    "scenes": [
      {
        "scene_number": 1,
        "scene_role": "HOOK",
        "narrative_section": "...",
        "setting": "...",
        "dialog": "Permanent VO Script (Authouritative & Calm)...",
        "actions": "...",
        "emotion": "...",
        "visual_notes": "...",
        "grok_prompt": "3D Stylized Realism, PolyMatter style. [Character Name] with [Description from constants.ts]. ${input.story_type === 'hybrid' ? 'Complex 3D data map floating in air' : 'Educational cinematic setup'}. Soft studio lighting, clay-like textures, 8k render.",
        "ctr_message": "..."
      }
    ],
    "shorts": [
      {
        "id": 1,
        "short_intent": "CURIOSITY",
        "narration": "Permanent VO Short Script...",
        "emotion": "...",
        "purpose": "...",
        "visual_logic": "...",
        "video_production_prompt": "3D Stylized Realism, PolyMatter style. [Character] in [Setting]. Cinematic lighting.",
        "source_scene": 1
      }
    ]
  }`;

  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: prompt,
    config: {
      systemInstruction,
      responseMimeType: "application/json",
    },
  });

  const text = response.text || "{}";
  const data = JSON.parse(text);
  
  return {
    storyboard_title: data.storyboard_title || "Untitled V9 Production",
    image_ratio: ratio,
    story_type: input.story_type,
    metadata: data.metadata,
    scenes: (data.scenes || []).map((s: any, i: number) => ({
      ...s,
      scene_number: s.scene_number || i + 1,
      duration: 6
    })),
    shorts: data.shorts || []
  } as Storyboard;
};

export const generateAdditionalScene = async (storyboard: Storyboard, language: string): Promise<Scene> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const lastScene = storyboard.scenes[storyboard.scenes.length - 1];
  const nextRole = lastScene.scene_role === 'HOOK' ? 'CONTEXT' : 'REVEAL';
  
  const prompt = `V9 ADAPTIVE ENGINE: Continue production "${storyboard.storyboard_title}". 
  Story Type: ${storyboard.story_type}. Maintain PERMANENT VO CHARACTER.
  Maintain STRICT VISUAL CONTINUITY with Segment ${lastScene.scene_number}. Use identical character descriptions and lighting setups for Grok compatibility.
  Return JSON for Scene ${lastScene.scene_number + 1} with role ${nextRole}.
  Language: ${language}.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: prompt,
    config: { responseMimeType: "application/json" },
  });

  const data = JSON.parse(response.text || "{}");
  return { ...data, duration: 6 };
};

export const generateSceneImage = async (scene: Scene, aspectRatio: string, storyType: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const finalPrompt = `V9 MASTER ASSET: ${scene.grok_prompt}. Professional 3D Stylized Realism, PolyMatter style, Octane 8k render, soft studio lighting, high-quality clay textures, no text.`;
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: { parts: [{ text: finalPrompt }] },
    config: { imageConfig: { aspectRatio: aspectRatio as any } }
  });
  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
  }
  throw new Error("V9 Engine: Rendering Failed.");
};

export const generateThumbnailImage = async (
  styleId: string, 
  title: string, 
  summary: string, 
  chars: string[], 
  aspectRatio: string,
  storyType: string,
  sampleHook?: string
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `V9 THUMBNAIL ENGINE: Style ${styleId}. Subject: ${title}. Professional YouTube Reality aesthetic, stylized 3D Realism, 8k, no text, cinematic lighting. ${sampleHook ? `Context: ${sampleHook}` : ''}`;
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: { parts: [{ text: prompt }] },
    config: { imageConfig: { aspectRatio: aspectRatio as any } }
  });
  for (const part of response.candidates?.[0]?.content?.[0]?.parts || []) {
    if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
  }
  // Fallback check for different API response structures
  const parts = response.candidates?.[0]?.content?.parts || [];
  for (const part of parts) {
    if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
  }
  throw new Error("V9 Engine: Thumbnail Rendering Failed.");
};
