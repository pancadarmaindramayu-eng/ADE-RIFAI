export interface Character {
  name: string;
  appearance: string;
  personality: string;
  avatarColor: string;
}

export interface Scene {
  scene_number: number;
  setting: string;
  dialog: string;
  actions: string;
  emotion: string;
  visual_notes: string;
  characters?: string[]; // List of character names in this scene
  visual_image?: string; // Base64 or URL
  image_loading?: boolean;
}

export interface Storyboard {
  image_ratio: string;
  storyboard_title: string;
  scenes: Scene[];
}

export interface StoryInput {
  input_type: 'concept' | 'link'; // Toggle between concept text or link
  story_concept: string;
  news_link?: string; // Optional link field
  category_niche: string;
  scene_count: number;
  target_audience: string;
  language: string;
  aspect_ratio: string;
  selected_characters: string[]; // List of names to include in the story
}

export const CATEGORIES = [
  "Sejarah",
  "Sains",
  "Teknologi",
  "Ekonomi",
  "Biografi",
  "Lingkungan",
  "Olahraga",
  "Kesehatan",
  "Budaya"
];

export const AUDIENCES = [
  "Anak-anak",
  "Remaja",
  "Dewasa"
];

export const LANGUAGES = [
  "Bahasa Indonesia",
  "English"
];

export const ASPECT_RATIOS = [
  "16:9",
  "9:16"
];