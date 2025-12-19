
export interface Character {
  name: string;
  appearance: string;
  personality: string;
  avatarColor: string;
}

export interface ThinkingFramework {
  macro_context: string;
  causal_chain: string[];
  hidden_mechanism: string;
  contrarian_angle: string;
  future_projection: string;
}

export interface SeoAnalysis {
  title_candidates: {
    title: string;
    score: number;
    reason: string;
  }[];
  selected_title: string;
  keyword_cluster: {
    primary: string;
    secondary: string[];
    long_tail: string[];
  };
  ctr_formula: string;
}

export interface ShortScript {
  id: number;
  narration: string;
  emotion: string;
  purpose: string;
  visual_logic: string;
  video_production_prompt: string;
  source_scene?: number;
  short_intent: 'CURIOSITY' | 'CONTROVERSY' | 'FUTURE_SHOCK';
}

export interface Scene {
  scene_number: number;
  scene_role: 'HOOK' | 'CONTEXT' | 'SHIFT' | 'REVEAL' | 'CONSEQUENCE' | 'FUTURE' | 'CTA';
  narrative_section: string;
  setting: string;
  dialog: string;
  actions: string;
  emotion: string;
  visual_notes: string;
  grok_prompt: string;
  duration: number;
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
  thinking_framework?: ThinkingFramework;
  seo_analysis?: SeoAnalysis;
  resolved_niche?: {
    ui_category: string;
    youtube_niche: string;
    authority_cluster: string;
  };
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
  { id: 'analytical', label: 'Analytical Deep Dive', desc: 'Gaya visual bersih dengan infografis 3D yang elegan.' },
  { id: 'dramatic', label: 'Cinematic Drama', desc: 'Pencahayaan dramatis dengan fokus pada ekspresi karakter.' },
  { id: 'conflict', label: 'Konflik Ekstrem', desc: 'Dua kekuatan berlawanan dalam satu frame untuk CTR tinggi.' },
  { id: 'minimalist', label: 'Minimalist Premium', desc: 'Elegan, bersih, dan penuh misteri.' },
  { id: 'neon_tech', label: 'Neon Tech', desc: 'Gaya futuristik dengan aksen cahaya neon.' }
];

export const CATEGORIES = [
  "Ekonomi & Kebijakan",
  "Sejarah & Tragedi",
  "Sains & Inovasi",
  "Budaya & Analisis Sosial",
  "Teknologi & Masa Depan",
  "Geopolitik"
];

export const AUDIENCES = [
  "Umum (Analytical)",
  "Remaja (Edu-tainment)",
  "Dewasa (Deep Dive)",
  "Profesional"
];

export const LANGUAGES = [
  "Indonesian",
  "English",
  "Japanese",
  "Spanish"
];

export const VIDEO_FORMATS = [
  { id: 'long', label: 'Long Video (16:9)', ratio: '16:9' },
  { id: 'short', label: 'Short Video (9:16)', ratio: '9:16' }
];
