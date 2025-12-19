import { GoogleGenAI, Type } from "@google/genai";
import { StoryInput, Storyboard, Scene } from "../types.ts";
import { CHARACTERS } from "../constants.ts";

/**
 * World-Class Documentary Engine API Layer
 * This service handles all generative AI interactions using the correct SDK pattern.
 * It creates a new instance for each call to ensure the most up-to-date API key is used.
 */

export const generateStoryboard = async (input: StoryInput): Promise<Storyboard> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const ratio = input.video_format === 'long' ? '16:9' : '9:16';
  
  const systemInstruction = `
    You are a professional economic documentary engine. 
    You specialize in high-impact economic and sociological storytelling similar to PolyMatter or Wendover.
    Your tone is: Calm, authoritative, analytical, and cinematic.

    [DNA CONSISTENCY FOR HUMAN MODE]
    You must feature the following characters if mode is 'human':
    ${CHARACTERS.map(c => `- ${c.name}: ${c.appearance}`).join('\n')}

    [STRUCTURE]
    Generate a full production storyboard with ${input.scene_count} segments in STRICT JSON ONLY.
    Each segment must follow a logical narrative flow (Intro, Context, Problem, Data, Analysis, Impact, Future, CTA).

    [SHORTS LOGIC]
    Generate corresponding short-form hooks (6s) that act as viral entries for the long video.
  `;

  const prompt = `
    GENERATE PRODUCTION PACKAGE V8
    Topic: ${input.input_type === 'link' ? `Based on source: ${input.news_link}` : input.story_concept}
    Language: ${input.language}
    Format: ${input.video_format === 'long' ? 'Long-form Cinematic (16:9)' : 'Short-form Vertical (9:16)'}
    Mode: ${input.story_type}
    Category: ${input.category_niche}
    
    OUTPUT FORMAT (JSON ONLY):
    {
      "storyboard_title": "string",
      "metadata": {
        "thesis_statement": "string",
        "viral_title": "string",
        "long_description": "string",
        "hashtags": ["string"],
        "keywords": "string",
        "analytical_summary": "string"
      },
      "scenes": [
        {
          "scene_number": number,
          "narrative_section": "string",
          "setting": "string",
          "dialog": "string",
          "actions": "string",
          "emotion": "string",
          "visual_notes": "string",
          "ctr_message": "string",
          "characters": ["string"]
        }
      ],
      "shorts": [
        {
          "id": number,
          "source_scene": number,
          "narration": "string",
          "emotion": "string",
          "purpose": "string",
          "visual_logic": "string",
          "video_production_prompt": "string"
        }
      ]
    }
  `;

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
    ...data,
    image_ratio: ratio,
    story_type: input.story_type
  } as Storyboard;
};

export const generateSceneImage = async (scene: Scene, aspectRatio: string, storyType: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  let imagePrompt = "";
  if (storyType === 'hybrid') {
    imagePrompt = `
      CINEMATIC ANALYTICAL RENDER: 3D CLAY/POLYSTYLE.
      SCENE: ${scene.setting}.
      VISUAL: ${scene.visual_notes}.
      STYLE: Elegant documentary, clean maps, minimal icons, Octane render, 8k.
      NO TEXT. FACeless perspective.
    `;
  } else {
    const chars = CHARACTERS.filter(c => scene.characters?.includes(c.name));
    imagePrompt = `
      3D CLAY CHARACTER CONSISTENCY DNA.
      SCENE: ${scene.setting}.
      ACTORS: ${chars.map(c => `${c.name} (${c.appearance})`).join(', ')}.
      ACTION: ${scene.actions}.
      STYLE: Professional claymation, detailed textures, cinematic volumetric lighting.
      NO FLOATING TEXT.
    `;
  }

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: { parts: [{ text: imagePrompt }] },
    config: {
      imageConfig: { aspectRatio: aspectRatio as any }
    }
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  throw new Error("Failed to render image.");
};

export const generateAdditionalScene = async (storyboard: Storyboard, language: string): Promise<Scene> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const lastScene = storyboard.scenes[storyboard.scenes.length - 1];
  
  const prompt = `
    Continue the documentary storyboard. Generate ONE new sequential scene after Scene ${lastScene.scene_number}.
    Context: ${storyboard.metadata.analytical_summary}
    Current Narrative State: ${lastScene.narrative_section}
    Language: ${language}
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          scene_number: { type: Type.INTEGER },
          narrative_section: { type: Type.STRING },
          setting: { type: Type.STRING },
          dialog: { type: Type.STRING },
          actions: { type: Type.STRING },
          emotion: { type: Type.STRING },
          visual_notes: { type: Type.STRING },
          ctr_message: { type: Type.STRING },
          characters: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["scene_number", "narrative_section", "setting", "dialog", "actions", "emotion", "visual_notes", "ctr_message", "characters"],
      }
    },
  });

  return JSON.parse(response.text || "{}") as Scene;
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
  const characterContext = CHARACTERS.filter(c => chars.includes(c.name)).map(c => c.appearance).join(', ');

  const prompt = `
    MASTER THUMBNAIL RENDER. 
    STYLE: ${styleId}. 
    RATIO: ${aspectRatio}. 
    CONCEPT: ${title} - ${summary}. 
    HOOK: ${sampleHook || 'Cinematic Curiosity'}.
    CHARACTERS: ${storyType === 'human' ? characterContext : 'Abstract Visuals'}.
    REQUIREMENT: 3D Clay, highly expressive, dramatic lighting, Octane render, vivid colors.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: { parts: [{ text: prompt }] },
    config: {
      imageConfig: { aspectRatio: aspectRatio as any }
    }
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  throw new Error("Failed to render thumbnail.");
};