/// <reference path="../.astro/types.d.ts" />

declare global {
  interface Window {
    currentPlayingAudio?: HTMLAudioElement | null;
  }
}