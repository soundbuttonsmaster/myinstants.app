"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import SoundButton from "@/components/sound/sound-button"
import { Button } from "@/components/ui/button"
import { Dice5, Sparkles, ArrowLeft } from "lucide-react"
import type { Sound } from "@/lib/types/sound"

const getRandomItem = (arr: Sound[]): Sound => arr[Math.floor(Math.random() * arr.length)]

interface PlayRandomClientProps {
  initialSounds: Sound[]
}

export default function PlayRandomClient({ initialSounds }: PlayRandomClientProps) {
  const [sounds] = useState<Sound[]>(initialSounds)
  const [randomSound, setRandomSound] = useState<Sound | null>(null)
  const [animating, setAnimating] = useState(false)
  const [mascotDance, setMascotDance] = useState(false)

  const playRandom = () => {
    if (sounds.length === 0) return
    window.dispatchEvent(new CustomEvent("pause-all-sounds", { detail: { exceptId: null } }))
    setAnimating(true)
    setMascotDance(true)
    setTimeout(() => {
      setRandomSound(getRandomItem(sounds))
      setAnimating(false)
      setTimeout(() => setMascotDance(false), 1200)
    }, 600)
  }

  useEffect(() => {
    if (!randomSound && sounds.length > 0) {
      playRandom()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sounds.length])

  return (
    <div className="flex flex-col items-center justify-center flex-1 py-8">
      <div className="flex flex-col items-center mb-4">
        <span
          className={`text-7xl transition-transform duration-500 ${mascotDance ? "animate-bounce" : ""}`}
          role="img"
          aria-label="Dancing Cat"
        >
          🐱‍👓
        </span>
        <span className="text-base font-bold text-pink-500 mt-1">
          {mascotDance ? "Yay! That was fun!" : "Let's play a random sound!"}
        </span>
      </div>

      <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-2 flex items-center gap-2 text-pink-600 dark:text-pink-500 drop-shadow-lg">
        <Dice5 className="w-10 h-10 text-yellow-500 dark:text-yellow-400 animate-bounce" />
        Play Random Sound Buttons
      </h1>
      <p className="mb-6 text-lg text-center text-slate-700 dark:text-slate-300 font-semibold">
        One click unlocks a surprise sound from our meme soundboard. Try your luck and keep the fun rolling!{" "}
        <Sparkles className="inline w-5 h-5 text-pink-400 animate-pulse" />
      </p>

      <div className="relative w-full max-w-2xl min-h-[400px] flex items-center justify-center mb-8">
        {sounds.length === 0 ? (
          <div className="w-80 h-80 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-lg text-slate-400">
            No sounds found.
          </div>
        ) : randomSound ? (
          <div
            className={`transition-all duration-500 ${animating ? "scale-75 opacity-0" : "scale-100 opacity-100"}`}
            key={randomSound.id}
          >
            <SoundButton
              sound={randomSound}
              customSize={200}
              hideLabel
              hideActions
            />
          </div>
        ) : (
          <div className="w-80 h-80 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-lg text-slate-400">
            Loading...
          </div>
        )}
        {animating && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
            <span className="text-6xl animate-bounce">🎉</span>
            <span className="text-5xl animate-bounce delay-200">🎈</span>
            <span className="text-6xl animate-bounce delay-300">✨</span>
          </div>
        )}
      </div>

      <Button
        size="lg"
        className="bg-gradient-to-r from-pink-400 via-yellow-300 to-blue-400 dark:from-pink-500 dark:via-yellow-500 dark:to-blue-500 text-white text-xl font-bold rounded-full px-10 py-6 shadow-lg hover:scale-105 transition-all duration-300 mb-4 flex items-center gap-3"
        onClick={playRandom}
        disabled={sounds.length === 0 || animating}
        aria-label="Play Random Sound"
      >
        <Dice5 className="w-8 h-8 animate-pulse" />
        Play Random
      </Button>

      <Link href="/">
        <Button
          variant="outline"
          size="lg"
          className="mt-6 px-8 py-4 rounded-full border-2 border-blue-400 dark:border-blue-500 text-blue-700 dark:text-blue-300 bg-white dark:bg-slate-900 hover:bg-blue-50 dark:hover:bg-slate-800 text-lg font-bold flex items-center gap-2 shadow-lg"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </Button>
      </Link>

      <p className="mt-8 text-center text-base text-slate-500 dark:text-slate-400">
        <b>Tip:</b> Try again and again for more fun sounds!
      </p>

      <div className="w-full max-w-4xl mx-auto px-4 mt-12 mb-12">
        <div className="rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-800/80 p-6 md:p-8">
          <h2 className="text-2xl font-bold mb-4 text-center text-slate-700 dark:text-slate-200">
            🎲 What is Play Random Sound?
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            <strong>Play Random Sound</strong> lets you click once and hear a random sound button that might be funny,
            nostalgic, or totally unexpected. Each tap pulls from thousands of new and trending meme sounds, so the
            surprise never stops.
          </p>
          <h3 className="text-lg font-bold mt-6 mb-2 text-slate-700 dark:text-slate-200">
            ✨ How to Use
          </h3>
          <ul className="space-y-2 text-slate-600 dark:text-slate-400 list-disc list-inside">
            <li>Click the Play Random button to instantly generate a new sound.</li>
            <li>Listen and enjoy—the audio plays automatically.</li>
            <li>Keep clicking for endless random sound adventures.</li>
            <li>Share your favorites with friends!</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
