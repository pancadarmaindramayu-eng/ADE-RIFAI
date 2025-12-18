
export interface Character {
  name: string;
  appearance: string;
  personality: string;
  avatarColor: string;
}

export interface ShortScript {
  id: number;
  source_scene: number;
  narration: string;
  emotion: string;
  purpose: string;
  visual_logic: string;
  video_production_prompt: string;
}

export interface Scene {
  scene_number: number;
  narrative_section: string;
  setting: string;
  dialog: string;
  actions: string;
  emotion: string;
  visual_notes: string;
  ctr_message?: string; 
  characters?: string[]; 
  visual_image?: string; 
  image_loading?: boolean;
}

export interface StoryMetadata {
  viral_title: string;
  long_description: string;
  hashtags: string[];
  keywords: string;
  analytical_summary: string;
  thesis_statement: string;
}

export interface Storyboard {
  image_ratio: string;
  storyboard_title: string;
  story_type: 'hybrid' | 'human';
  metadata: StoryMetadata;
  scenes: Scene[];
  shorts: ShortScript[];
}

export interface StoryInput {
  input_type: 'concept' | 'link';
  story_type: 'hybrid' | 'human';
  story_concept: string;
  news_link?: string;
  thumbnail_sample?: string;
  category_niche: string;
  scene_count: string;
  target_audience: string;
  language: string;
  video_format: 'long' | 'short';
  selected_characters: string[];
}

export const THUMBNAIL_STYLES = [
  { id: 'conflict', label: 'Konflik & Kontras Ekstrem', desc: 'Dua kekuatan berlawanan dalam satu frame.' },
  { id: 'shock', label: 'Shock Value', desc: 'Momen mengejutkan atau fakta yang tak terduga.' },
  { id: 'expression', label: 'Ekspresi Wajah', desc: 'Close-up emosi karakter yang mendalam.' },
  { id: 'before_after', label: 'Before vs After', desc: 'Perbandingan perubahan drastis.' },
  { id: 'global', label: 'Global Scale', desc: 'Dampak masif pada skala dunia.' },
  { id: 'minimalist', label: 'Minimalist Premium', desc: 'Elegan, bersih, dan penuh misteri.' },
  { id: 'provocative', label: 'Pertanyaan Provokatif', desc: 'Visual yang memicu pertanyaan besar.' }
];

export const CATEGORIES = [
  "Sejarah & Tragedi",
  "Sains & Inovasi",
  "Teknologi & Masa Future",
  "Ekonomi & Kebijakan",
  "Biografi Tokoh Dunia",
  "Lingkungan & Krisis",
  "Kesehatan & Riset",
  "Budaya & Analisis Sosial"
];

export const AUDIENCES = [
  "Umum (Analytical)",
  "Remaja (Edu-tainment)",
  "Dewasa (Deep Dive)"
];

export const LANGUAGES = [
  "Indonesian",
  "English",
  "Japanese",
  "Spanish",
  "Arabic",
  "Mandarin",
  "Russian",
  "German",
  "French",
  "Italian"
];

export const VIDEO_FORMATS = [
  { id: 'long', label: 'Long Video (16:9)', ratio: '16:9' },
  { id: 'short', label: 'Short Video (9:16)', ratio: '9:16' }
];
