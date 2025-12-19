
import { Character } from './types.ts';

export const PLACEHOLDER_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25' viewBox='0 0 800 450'%3E%3Crect fill='%231e293b' width='800' height='450'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='24' fill='%23475569'%3ENo Image%3C/text%3E%3C/svg%3E";

export const CHARACTERS: Character[] = [
  {
    name: "Emma",
    appearance: "Professional 3D claymation style: Smart attire, expressive eyes, sleek brown hair, high-quality material textures, 8k render.",
    personality: "Strategic, curious, and fast-talking analytical thinker.",
    avatarColor: "bg-indigo-500"
  },
  {
    name: "Pap",
    appearance: "Professional 3D claymation style: Mature features, classic glasses, grey-tinged hair, textured suit, authoritative posture.",
    personality: "Experienced, skeptical, and provides historical context.",
    avatarColor: "bg-amber-500"
  },
  {
    name: "Athaya",
    appearance: "Professional 3D claymation style: Youthful energy, modern tech-wear, vibrant facial expressions, cinematic lighting.",
    personality: "Innovative, tech-savvy, and focused on future implications.",
    avatarColor: "bg-emerald-500"
  },
  {
    name: "Nda",
    appearance: "Professional 3D claymation style: Elegant modern hijab, balanced features, soft but focused lighting, poised demeanor.",
    personality: "Wise, balanced, and provides ethical/social oversight.",
    avatarColor: "bg-rose-500"
  }
];
