
import { Character } from './types.ts';

export const PLACEHOLDER_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25' viewBox='0 0 800 450'%3E%3Crect fill='%231e293b' width='800' height='450'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='24' fill='%23475569'%3ENo Image%3C/text%3E%3C/svg%3E";

export const CHARACTERS: Character[] = [
  {
    name: "Emma",
    appearance: "3D Clay style, young woman, analytical expression, professional casual attire, detailed hair textures.",
    personality: "Strategic, curious, and data-driven.",
    avatarColor: "bg-indigo-500"
  },
  {
    name: "Pap",
    appearance: "3D Clay style, middle-aged man, thick glasses, asymmetrical mustache, intellectual look.",
    personality: "Experienced, skeptical, and thorough.",
    avatarColor: "bg-amber-500"
  },
  {
    name: "Athaya",
    appearance: "3D Clay style, teenager, creative look, expressive eyes, modern accessories.",
    personality: "Innovative, tech-savvy, and visionary.",
    avatarColor: "bg-emerald-500"
  },
  {
    name: "Nda",
    appearance: "3D Clay style, woman with elegant hijab, kind but firm expression, professional poise.",
    personality: "Wise, balanced, and empathetic.",
    avatarColor: "bg-rose-500"
  }
];
