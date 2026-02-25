import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Sound button images configuration (matching sbmain project)
export const SOUND_BUTTON_IMAGES = [
  {
    id: 1,
    name: "Red Button",
    path: "/sound-buttons/red.webp",
    color: "red"
  },
  {
    id: 2,
    name: "Green Button", 
    path: "/sound-buttons/green.webp",
    color: "green"
  },
  {
    id: 3,
    name: "Blue Button",
    path: "/sound-buttons/blue.webp", 
    color: "blue"
  },
  {
    id: 4,
    name: "Purple Button",
    path: "/sound-buttons/purple.webp",
    color: "purple"
  },
  {
    id: 5,
    name: "Yellow Button",
    path: "/sound-buttons/yellow.webp",
    color: "yellow"
  },
  {
    id: 6,
    name: "Black Button",
    path: "/sound-buttons/black.webp",
    color: "black"
  }
];

// Get image by sound ID (matching sbmain logic)
export function getSoundButtonImage(soundId: number) {
  return SOUND_BUTTON_IMAGES[soundId % SOUND_BUTTON_IMAGES.length];
}

// Get image path by sound ID
export function getSoundButtonImagePath(soundId: number): string {
  const image = getSoundButtonImage(soundId);
  return image.path;
}
