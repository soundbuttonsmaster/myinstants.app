/// <reference path="../.astro/types.d.ts" />

declare global {
  interface Window {
    soundButtonAudioCache?: Map<string | number, HTMLAudioElement>;
    currentPlayingAudio?: HTMLAudioElement | null;
  }
}