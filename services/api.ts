
import { GoogleGenAI, Type } from "@google/genai";
import { StoryInput, Storyboard, Scene } from "../types.ts";
import { CHARACTERS } from "../constants.ts";

export const generateStoryboard = async (input: StoryInput): Promise<Storyboard> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const ratio = input.video_format === 'long' ? '16:9' : '9:16';
  
  const charRef = CHARACTERS.map(c => `${c.name}: ${c.appearance}`).join(" | ");

  const systemInstruction = `You are the 'Karakter Paten V9' Documentary Intelligence Engine.
  
  EDITORIAL SPINE (CHANNEL MANIFESTO):
  - Voice: Neutral, Skeptical of instant fixes, Pro-Stability, Pro-Literacy.
  - Character: Authoritative, calm, intellectually dense (140 WPM).
  - Mission: Analyze systemic mechanisms and costs, not individual blame.
  - Monetization: High-value educational depth only. No generic clickbait.

  LONG VIDEO ARCHETYPES (STRICT 5-ACT FLOW):
  1. THE DECISION ROOM: Elegant hook (0-5s). Contrast facts, silent but heavy questions.
  2. THE MONEY FLOW MAP: Systemic framing. Why it matters globally/personally.
  3. WHO PAYS THE BILL: Core insight. Human impact of the systemic decision.
  4. THE INVISIBLE COST: Twist. Unexpected facts/hidden consequences.
  5. THE BIGGER QUESTION: Resolution/Reflective CTA.

  SHORT VIDEO (CLAY ANIMATION FLOW):
  1. VISUAL HOOK: Unique clay movement/transformation (0-3s).
  2. CONFLICT SETUP: Problems symbolized (3-8s).
  3. CORE IDEA: One sharp insight with metaphor (8-18s).
  4. VISUAL TWIST: Transformation (18-28s).
  5. ELEGANT CLOSING: Slow movement, reflective narrative (28-35s).

  VIRAL SHORTS STRATEGY (GENERATE EXACTLY 6 SHORTS):
  Short 1 (THE COST): Focus on who pays the price.
  Short 2 (THE IRONY): Focus on counter-intuitive outcomes.
  Short 3 (THE HIDDEN CLAUSE): Focus on parts rarely discussed.
  Short 4 (THE SYSTEMIC SHIFT): Focus on how the world changes.
  Short 5 (THE HUMAN ECHO): Focus on the family impact (using characters).
  Short 6 (THE FUTURE TRAP): Focus on long-term consequences.

  GROK-OPTIMIZED CONTINUITY ENGINE:
  - Every visual prompt MUST share the same SEED setup: "Professional 3D Stylized Realism, PolyMatter visual flow, soft cinematic studio lighting, volumetric clay textures, 8k".
  - CHARACTER LOCK: Use identical descriptions for characters: ${charRef}.
  - NO TEXT: Do not generate text inside images.`;

  const prompt = `INITIATE V9 PRODUCTION
  Format: ${input.video_format} (${ratio})
  Type: ${input.story_type}
  Concept: ${input.input_type === 'link' ? input.news_link : input.story_concept}
  Language: ${input.language}
  Segments: ${input.scene_count}

  REQUEST: Generate the full storyboard AND exactly 6 Viral Shorts.

  RETURN JSON PACKAGE:
  {
    "storyboard_title": "...",
    "metadata": {
      "thesis_statement": "...",
      "manifesto_spine": "Pro-literasi ekonomi, skeptis instan, pro-stabilitas.",
      "resolved_niche": { "ui_category": "${input.category_niche}", "youtube_niche": "Analytical Documentary" },
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
        "scene_role": "${input.video_format === 'long' ? 'DECISION_ROOM' : 'VISUAL_HOOK'}",
        "narrative_section": "...",
        "setting": "...",
        "dialog": "Permanent VO Script...",
        "actions": "...",
        "emotion": "...",
        "visual_notes": "...",
        "grok_prompt": "3D Stylized Realism, PolyMatter style. [Character Name + Description]. [Action based on role]. Soft studio lighting, 8k.",
        "ctr_message": "..."
      }
    ],
    "shorts": [
      {
        "id": 1,
        "short_intent": "THE_COST",
        "narration": "...",
        "emotion": "...",
        "purpose": "...",
        "visual_logic": "...",
        "video_production_prompt": "3D Stylized Realism, PolyMatter style. [Character]. [Transformation Action].",
        "source_scene": 1
      },
      {"id": 2, "short_intent": "THE_IRONY", "narration": "...", "video_production_prompt": "..."},
      {"id": 3, "short_intent": "HIDDEN_CLAUSE", "narration": "...", "video_production_prompt": "..."},
      {"id": 4, "short_intent": "THE_COST", "narration": "...", "video_production_prompt": "..."},
      {"id": 5, "short_intent": "THE_IRONY", "narration": "...", "video_production_prompt": "..."},
      {"id": 6, "short_intent": "HIDDEN_CLAUSE", "narration": "...", "video_production_prompt": "..."}
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

  const data = JSON.parse(response.text || "{}");
  
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
  
  const prompt = `V9 ADAPTIVE ENGINE: Continue production "${storyboard.storyboard_title}". 
  Maintain PERMANENT VO CHARACTER (Authoritative, Calm).
  Maintain STRICT VISUAL CONTINUITY with Segment ${lastScene.scene_number}. Use identical Grok prompts logic.
  Return JSON for Scene ${lastScene.scene_number + 1}. Language: ${language}.`;

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
  const typeContext = storyType === 'hybrid' ? 'Data-rich documentary infographics' : 'High-depth family education analytics';
  const finalPrompt = `V9 ASSET: ${scene.grok_prompt}. ${typeContext}. 3D Stylized Realism, PolyMatter style, Octane 8k render, no text, volumetric soft lighting.`;
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
  const prompt = `V9 THUMBNAIL: Style ${styleId}. Subject: ${title}. ${storyType === 'hybrid' ? 'Data systemic visual' : 'Analytical family education'}. Professional 3D Stylized Realism, 8k, no text, high-contrast cinematic lighting. ${sampleHook ? `Context: ${sampleHook}` : ''}`;
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: { parts: [{ text: prompt }] },
    config: { imageConfig: { aspectRatio: aspectRatio as any } }
  });
  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
  }
  throw new Error("V9 Engine: Thumbnail Rendering Failed.");
};
