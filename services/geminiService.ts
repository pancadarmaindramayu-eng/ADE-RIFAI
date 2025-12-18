
import { GoogleGenAI, Type } from "@google/genai";
import { StoryInput, Storyboard, Scene, ShortScript } from "../types";
import { CHARACTERS } from "../constants";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateStoryboard = async (input: StoryInput): Promise<Storyboard> => {
  const ratio = input.video_format === 'long' ? '16:9' : '9:16';
  
  const systemInstruction = `
    You are a world-class economic documentary scriptwriter, strategist, and professional voice-over narrator.
    Your mission: Produce an integrated production package for a premium global documentary channel.

    [VOICE-OVER LOCK]
    - Gender: Male, 35–45
    - Tone: Calm, authoritative, analytical documentary narrator.
    - Consistency: Identical tone/pace across Long and Short formats.
    - No background music (VO ONLY).

    [LONG-FORM MASTER SOURCE]
    SCENE 1: HOOK (Mystery) | SCENE 2: BIG QUESTION | SCENE 3: BACKGROUND | SCENE 4: KEY ACTORS | SCENE 5: POINT OF NO RETURN | SCENE 6: CAUSE → EFFECT | SCENE 7: GLOBAL IMPACT | SCENE 8: RELEVANCE TODAY.

    [SHORTS ENGINE - SUMMARY & HOOK STRATEGY]
    Generate 8-10 Shorts. Each Short MUST be a definitive summary or a high-tension hook derived from a specific Long Video scene.
    Length: 6 seconds. Max 12 words per narration.
    
    [VIDEO PRODUCTION PROMPT (30-60s)]
    For each Short, create a "video_production_prompt". This is a high-fidelity cinematic prompt for tools like Grok-3/Runway/Pika. 
    It must describe a 30-60 second visual sequence that captures the essence of the source scene for both long-form background and short-form impact.
    Focus on: Cinematic lighting, 3D clay style (if human) or PolyMatter elegant analytical visuals (if hybrid), volumetric fog, and logical visual progression.
  `;

  const prompt = `
    Generate a full V8 Documentary Production Package.
    LANGUAGE: ${input.language}.
    TOPIC: "${input.input_type === 'link' ? input.news_link : input.story_concept}".
    ENGINE MODE: ${input.story_type === 'hybrid' ? 'Hybrid Elegant (Faceless)' : 'Human Analytical (DNA)'}.

    ${systemInstruction}
  `;

  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      storyboard_title: { type: Type.STRING },
      metadata: {
        type: Type.OBJECT,
        properties: {
          thesis_statement: { type: Type.STRING },
          viral_title: { type: Type.STRING },
          long_description: { type: Type.STRING },
          hashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
          keywords: { type: Type.STRING },
          analytical_summary: { type: Type.STRING }
        },
        required: ["thesis_statement", "viral_title", "long_description", "hashtags", "keywords", "analytical_summary"]
      },
      scenes: {
        type: Type.ARRAY,
        items: {
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
        },
      },
      shorts: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.INTEGER },
            source_scene: { type: Type.INTEGER },
            narration: { type: Type.STRING },
            emotion: { type: Type.STRING },
            purpose: { type: Type.STRING },
            visual_logic: { type: Type.STRING },
            video_production_prompt: { type: Type.STRING }
          },
          required: ["id", "source_scene", "narration", "emotion", "purpose", "visual_logic", "video_production_prompt"]
        }
      }
    },
    required: ["storyboard_title", "metadata", "scenes", "shorts"],
  };

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    if (response.text) {
      const data = JSON.parse(response.text);
      data.image_ratio = ratio; 
      data.story_type = input.story_type;
      return data as Storyboard;
    }
    throw new Error("V8 Generation Failed.");
  } catch (error) {
    console.error("V8 Engine Error:", error);
    throw error;
  }
};

export const generateSceneImage = async (scene: Scene, aspectRatio: string = "16:9", storyType: 'hybrid' | 'human' = 'human', previousSceneDesc?: string): Promise<string> => {
  let imagePrompt = "";
  
  if (storyType === 'hybrid') {
    imagePrompt = `
      CINEMATIC DOCUMENTARY RENDER: 3D CLAY ANALYTICAL EXPLAINER (POLY MATTER STYLE).
      SEQUENTIAL PROGRESSION: ${previousSceneDesc ? `Follow visual flow from: "${previousSceneDesc}". No reset.` : "Intro thesis visual."}
      SECTION: ${scene.narrative_section}.
      SCENE: ${scene.setting}. ${scene.actions}.
      VISUAL ELEMENTS: World maps, abstract 3D charts, industrial atmosphere, based on "${scene.visual_notes}".
      STRICT: NO FLOATING TEXT. Minimalist typography.
      STYLE: Clean, 8k Octane render. Faceless environment.
    `;
  } else {
    const sceneCharacterNames = scene.characters || [];
    const activeSceneCharacters = CHARACTERS.filter(c => sceneCharacterNames.includes(c.name));
    const characterContext = activeSceneCharacters.map(c => `- ${c.name}: ${c.appearance}`).join('\n');
    
    imagePrompt = `
      3D CLAY CHARACTER DNA PRODUCTION.
      CONTINUITY: ${previousSceneDesc ? `Follow visual flow from: "${previousSceneDesc}".` : "Master anchor opening."}
      DNA REFERENCE:
      ${characterContext}
      SCENE: ${scene.setting}. ${scene.actions}.
      STYLE: Cinematic claymation, Octane render.
      STRICT: Match facial details (especially Pap's asymmetrical mustache) exactly 100%.
    `;
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: { parts: [{ text: imagePrompt }] },
      config: { imageConfig: { aspectRatio: aspectRatio as any } }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
    }
    throw new Error("Render Failed.");
  } catch (error) {
    throw error;
  }
};

export const generateAdditionalScene = async (storyboard: Storyboard, language: string): Promise<Scene> => {
  const lastScene = storyboard.scenes[storyboard.scenes.length - 1];
  const prompt = `
    Generate ONE additional sequential sequence for [${storyboard.story_type.toUpperCase()}].
    CONTINUITY: Progress exactly from "${lastScene.actions}".
    THESIS: Follow "${storyboard.metadata.thesis_statement}".
    LANGUAGE: ${language}.
  `;

  const sceneSchema = {
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
  };

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: { responseMimeType: "application/json", responseSchema: sceneSchema },
    });

    if (response.text) {
      const data = JSON.parse(response.text);
      data.scene_number = storyboard.scenes.length + 1;
      return data as Scene;
    }
    throw new Error("Sequential generation failed.");
  } catch (error) {
    throw error;
  }
};

export const generateThumbnailImage = async (
  styleId: string,
  title: string,
  summary: string,
  characterNames: string[],
  aspectRatio: string = "16:9",
  storyType: 'hybrid' | 'human' = 'human',
  sampleHook?: string
): Promise<string> => {
  const activeCharacters = CHARACTERS.filter(c => characterNames.includes(c.name));
  const characterContext = storyType === 'human' 
    ? activeCharacters.map(c => `- ${c.name}: ${c.appearance}`).join('\n')
    : "Professional documentary landscape.";

  const prompt = `
    VIRAL THUMBNAIL [${storyType.toUpperCase()}]. 3D CLAY CINEMATIC.
    TITLE HEADLINE: ${title}.
    HOOK_REF: ${sampleHook || "High tension"}.
    STYLE: ${styleId}. Minimal text, dramatic lighting, volumetric atmosphere.
    Ratio: ${aspectRatio}.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: { parts: [{ text: prompt }] },
      config: { imageConfig: { aspectRatio: aspectRatio as any } }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
    }
    throw new Error("Thumbnail generation failed.");
  } catch (error) {
    throw error;
  }
};
