import { Character } from './types';

export const PLACEHOLDER_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25' viewBox='0 0 800 450'%3E%3Crect fill='%231e293b' width='800' height='450'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='24' fill='%23475569'%3ENo Image%3C/text%3E%3C/svg%3E";

export const CHARACTERS: Character[] = [
  {
    name: "Emma",
    appearance: "Female, 15 years old. Tall, slim body. Light to medium skin tone. Short, neat hair. Wears round glasses and a wristwatch on the left hand. Outfit: casual teenage outfit (simple, modest, consistent).",
    personality: "Thoughtful, slightly serious, critical, and analytical.",
    avatarColor: "bg-yellow-500"
  },
  {
    name: "Athaya",
    appearance: "Female, 10 years old. Child proportions. Brown skin tone. Long hair. Wears glasses. Expression: angry, frowning eyebrows (visual cue for temperamental). Outfit: simple child clothing, consistent colors.",
    personality: "Ceria namun jahil, often looks grumpy or angry (temperamental).",
    avatarColor: "bg-pink-500"
  },
  {
    name: "Nda",
    appearance: "Female, 32 years old (Mother). Tall, proportional body. Medium skin tone. Wears a neat hijab (consistent color and style). Expression: smart, attentive, warm. Outfit: modest mother outfit, clean and professional.",
    personality: "Penyabar, bijaksana, intelligent, and responsive.",
    avatarColor: "bg-indigo-500"
  },
  {
    name: "Pap",
    appearance: "Male, 33 years old (Father). Average build. Brown skin tone. Short hair, beard. MUSTACHE IS ASYMMETRICAL: one side trimmed, one side untrimmed (Very Important). Expression: calm and mature. Outfit: casual father outfit.",
    personality: "Calm, mature, responsif.",
    avatarColor: "bg-blue-600"
  }
];