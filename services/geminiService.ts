import { GoogleGenAI, Type, Schema } from "@google/genai";
import { StoryInput, Storyboard, Scene, Character } from "../types";
import { CHARACTERS } from "../constants";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateStoryboard = async (input: StoryInput): Promise<Storyboard> => {
  // Filter only the selected characters
  const activeCharacters = CHARACTERS.filter(c => input.selected_characters.includes(c.name));
  const characterContext = activeCharacters.map(c => `- ${c.name}: ${c.appearance}. Personality: ${c.personality}`).join('\n');
  
  // Determine the core prompt source
  let sourceMaterial = "";
  if (input.input_type === 'link' && input.news_link) {
      sourceMaterial = `Source Material (News/Video Link): "${input.news_link}". 
      INSTRUCTION: Based on the content, topic, or recent events associated with this link, create a story. If the link is not directly accessible, infer the story from the URL keywords or generic knowledge about the topic implying by the URL.`;
  } else {
      sourceMaterial = `Story Concept: "${input.story_concept}".`;
  }

  const prompt = `
    Create a storyboard for a story.
    ${sourceMaterial}
    Category/Niche: ${input.category_niche}.
    Target Audience: ${input.target_audience}.
    Total Scenes: ${input.scene_count} (Maximum 50).
    Selected Language: ${input.language}.
    Target Image Aspect Ratio: ${input.aspect_ratio}.
    
    CRITICAL INSTRUCTIONS:
    1. You MUST use ONLY the following active characters for this story:
    ${characterContext}
    
    2. The story must be based on facts or real data where applicable for the category "${input.category_niche}".
    3. Output must be valid JSON matching the schema provided.
    
    4. LANGUAGE RULES:
       - The 'storyboard_title', 'setting', 'dialog', 'actions', and 'emotion' fields MUST be written in **${input.language}**.
       - CRITICAL: The 'visual_notes' field MUST be written in **ENGLISH**.
    
    5. SCENE & CHARACTER RULES:
       - For each scene, explicitly list which characters from the active list appear in that scene in the 'characters' array.
       - 'visual_notes' must be a detailed description for a **3D Clay Cartoon** image.
       - Ensure visual descriptions fit the ${input.aspect_ratio} frame.
  `;

  const responseSchema: Schema = {
    type: Type.OBJECT,
    properties: {
      image_ratio: { type: Type.STRING, enum: ["16:9", "9:16"] },
      storyboard_title: { type: Type.STRING },
      scenes: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            scene_number: { type: Type.INTEGER },
            setting: { type: Type.STRING },
            dialog: { type: Type.STRING },
            actions: { type: Type.STRING },
            emotion: { type: Type.STRING },
            visual_notes: { type: Type.STRING },
            characters: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "List of character names present in this scene"
            }
          },
          required: ["scene_number", "setting", "dialog", "actions", "emotion", "visual_notes", "characters"],
        },
      },
    },
    required: ["image_ratio", "storyboard_title", "scenes"],
  };

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        systemInstruction: "You are an expert storyboard artist. You use only the provided fixed characters. You are fluent in English and Indonesian.",
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as Storyboard;
    }
    throw new Error("No text response from model");
  } catch (error) {
    console.error("Error generating storyboard:", error);
    throw error;
  }
};

export const generateSceneImage = async (scene: Scene, aspectRatio: string = "16:9"): Promise<string> => {
  // Only include characters that are actually in this scene
  const sceneCharacterNames = scene.characters || [];
  const activeSceneCharacters = CHARACTERS.filter(c => sceneCharacterNames.includes(c.name));
  
  const characterContext = activeSceneCharacters.length > 0 
    ? activeSceneCharacters.map(c => `- ${c.name}: ${c.appearance}`).join('\n')
    : "No main characters in this scene.";

  // Construct a prompt optimized for image generation with STABLE CLAY STYLE and LOCKED CHARACTERS
  const imagePrompt = `
    Create a ${aspectRatio} image in **3D Clay Cartoon Style** (Claymation/Stop-motion look).
    
    ART STYLE (LOCKED):
    - Clay cartoon style
    - Soft clay texture, Rounded shapes, Smooth surface
    - Pixar-style clay animation
    - Bright but natural colors
    - 3D clay render, studio quality
    
    SCENE CONTENT:
    - Visual Description: ${scene.visual_notes}
    - Setting: ${scene.setting}
    - Action: ${scene.actions}
    - Mood: ${scene.emotion}
    
    CHARACTERS PRESENT IN THIS SCENE (LOCKED APPEARANCE):
    ${characterContext}
    
    LIGHTING & CAMERA (LOCKED):
    - Soft studio lighting
    - No harsh shadows
    - Medium camera angle
    - 35mm lens look
    - Balanced depth of field
    
    RESTRICTIONS (NEGATIVE PROMPT):
    - no character redesign
    - no hairstyle change
    - no outfit change
    - no age change
    - no personality change
    - NO CHARACTERS OTHER THAN: ${sceneCharacterNames.join(', ')} (unless generic background crowd)
    - no realism, no anime, no flat illustration
    - no distortion, no face mutation, no body mutation
    - no different clay style
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: imagePrompt,
      config: {
        imageConfig: {
          aspectRatio: aspectRatio
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    
    throw new Error("No image generated");
  } catch (error) {
    console.error("Error generating image:", error);
    throw error;
  }
};