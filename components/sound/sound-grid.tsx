"use client"

import { useState, useEffect } from "react"
import type { Sound } from "@/lib/types/sound"
import SoundButton from "./sound-button"

interface SoundGridProps {
  sounds: Sound[]
  maxMobile?: number
  centerLastRow?: boolean
  useCompactView?: boolean
  isMobileDevice?: boolean // SSR-friendly mobile detection
  /** Cap desktop columns (e.g. 8 for "You Might Like" so all sounds fit per line) */
  maxCols?: number
}

export default function SoundGrid({ 
  sounds, 
  maxMobile, 
  centerLastRow = false, 
  useCompactView = true,
  isMobileDevice: isMobileDeviceProp,
  maxCols
}: SoundGridProps) {
  // Use SSR prop as initial state; only update on actual resize, never on mount
  const [isMobileDevice, setIsMobileDevice] = useState(
    isMobileDeviceProp !== undefined ? isMobileDeviceProp : false
  )

  useEffect(() => {
    if (typeof window === 'undefined') return
    const handleResize = () => setIsMobileDevice(window.innerWidth <= 768)
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const isMobileView = isMobileDevice

  const displaySounds = isMobileView && maxMobile ? sounds.slice(0, maxMobile) : sounds

  // Desktop: maxCols (e.g. 8) or default 11; Mobile: 4
  const soundsPerRow = useCompactView 
    ? (isMobileView ? 4 : (maxCols ?? 11))
    : (isMobileView ? 3 : (maxCols ?? 9))

  const rows: Sound[][] = []

  // Build rows - ensure consistent structure between server and client
  for (let i = 0; i < displaySounds.length; i += soundsPerRow) {
    rows.push(displaySounds.slice(i, i + soundsPerRow))
  }

  // Tailwind requires full class names (no dynamic parts) for purge
  const gridColsClass = useCompactView
    ? maxCols === 8
      ? "grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-8 gap-0 sm:gap-2 lg:gap-3"
      : "grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-11 gap-0 sm:gap-2 lg:gap-3"
    : maxCols === 8
      ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 xl:grid-cols-8 gap-2 sm:gap-3"
      : "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-9 gap-2 sm:gap-3"

  return (
    <div className="w-full">
      {rows.map((rowSounds, rowIndex) => (
        /* Border-bottom between rows handled by CSS .sound-row-container:not(:last-child) */
        <div key={rowIndex} className="sound-row-container">
          <div className={`sound-grid sound-grid-container ${gridColsClass}`}>
            {rowSounds.map((sound, colIndex) => {
              const index = rowIndex * soundsPerRow + colIndex
              return (
                <SoundButton 
                  key={`${sound.id}-${rowIndex}-${colIndex}`} 
                  sound={sound}
                  isAboveTheFold={index < (isMobileView ? 12 : 44)}
                />
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
