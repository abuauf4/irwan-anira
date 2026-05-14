'use client'

import { useState, useRef, useCallback, useEffect } from 'react'

interface CoverSectionProps {
  onOpen: () => void
}

export default function CoverSection({ onOpen }: CoverSectionProps) {
  const [isOpening, setIsOpening] = useState(false)
  const [phase, setPhase] = useState<'idle' | 'leaning' | 'blooming' | 'dissolving' | 'darkness'>('idle')
  const containerRef = useRef<HTMLDivElement>(null)
  const bgRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const petalContainerRef = useRef<HTMLDivElement>(null)
  const mouseRef = useRef({ x: 0, y: 0 })

  // Parallax on mouse move (desktop only)
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
    if (isTouchDevice) return

    const handleMouseMove = (e: MouseEvent) => {
      if (isOpening) return
      const rect = containerRef.current?.getBoundingClientRect()
      if (!rect) return

      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      const nx = (e.clientX - centerX) / (rect.width / 2)
      const ny = (e.clientY - centerY) / (rect.height / 2)
      mouseRef.current = { x: nx, y: ny }

      if (bgRef.current) {
        bgRef.current.style.transform = `translate3d(${-nx * 2.5}px, ${-ny * 2.5}px, 0)`
      }
      if (contentRef.current) {
        contentRef.current.style.transform = `translate3d(${nx * 1.5}px, ${ny * 1.5}px, 0)`
      }
      if (petalContainerRef.current) {
        petalContainerRef.current.style.transform = `translate3d(${nx * 8}px, ${ny * 5}px, 0)`
      }
    }

    const handleMouseLeave = () => {
      if (bgRef.current) bgRef.current.style.transform = 'translate3d(0, 0, 0)'
      if (contentRef.current) contentRef.current.style.transform = 'translate3d(0, 0, 0)'
      if (petalContainerRef.current) petalContainerRef.current.style.transform = 'translate3d(0, 0, 0)'
    }

    window.addEventListener('mousemove', handleMouseMove)
    containerRef.current?.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      containerRef.current?.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [isOpening])

  // The signature moment — entering their world
  const handleOpen = useCallback(() => {
    if (isOpening) return
    setIsOpening(true)

    // Phase 1: Lean in — content draws closer, like leaning toward a door (300ms)
    setPhase('leaning')

    // Phase 2: Golden bloom — warm light blooms from center, candle being lit (400ms)
    setTimeout(() => setPhase('blooming'), 300)

    // Phase 3: Dissolve — the cover softly melts away, not a hard cut (600ms)
    setTimeout(() => setPhase('dissolving'), 700)

    // Phase 4: Brief darkness — the breath before the story begins (300ms)
    setTimeout(() => setPhase('darkness'), 1300)

    // Phase 5: Enter the story
    setTimeout(() => onOpen(), 1600)
  }, [isOpening, onOpen])

  // Petal configurations — 8 petals with varied timing
  const petalConfigs = [
    { left: 12, size: 10, duration: 10, delay: 0, opacity: 0.25 },
    { left: 25, size: 14, duration: 12, delay: 1.2, opacity: 0.35 },
    { left: 38, size: 8, duration: 9, delay: 0.5, opacity: 0.2 },
    { left: 50, size: 16, duration: 11, delay: 2, opacity: 0.4 },
    { left: 62, size: 6, duration: 10.5, delay: 0.8, opacity: 0.15 },
    { left: 72, size: 12, duration: 11.5, delay: 1.5, opacity: 0.3 },
    { left: 82, size: 9, duration: 9.5, delay: 2.5, opacity: 0.2 },
    { left: 90, size: 7, duration: 12, delay: 0.3, opacity: 0.15 },
  ]

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        transition: 'opacity 0.8s ease',
        opacity: phase === 'darkness' ? 0 : 1,
      }}
    >
      {/* Background Image — warm, cinematic with parallax */}
      <div
        ref={bgRef}
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/hero-poster.jpg')",
          transition: 'transform 0.6s ease-out',
          willChange: 'transform',
        }}
      />
      <div className="hero-overlay absolute inset-0" />

      {/* Vignette — dark warm edges */}
      <div className="absolute inset-0 pointer-events-none z-[1]" style={{
        background: 'radial-gradient(ellipse at center, transparent 30%, rgba(26,21,16,0.5) 100%)'
      }} />

      {/* Subtle golden light drift — like moonlight shifting */}
      <div
        className="absolute inset-0 pointer-events-none z-[2]"
        style={{
          background: 'radial-gradient(ellipse, rgba(201,169,110,0.08) 0%, transparent 50%)',
          animation: 'goldenLightDrift 14s ease-in-out infinite alternate',
        }}
      />

      {/* ─── THE SIGNATURE MOMENT ─── */}

      {/* Bloom layer — warm golden light expanding from center */}
      <div
        className="absolute inset-0 pointer-events-none z-[3]"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(201,169,110,0.25) 0%, rgba(201,169,110,0.08) 40%, transparent 70%)',
          opacity: phase === 'blooming' || phase === 'dissolving' ? 1 : 0,
          transform: phase === 'blooming' ? 'scale(1)' : phase === 'dissolving' ? 'scale(1.5)' : 'scale(0.5)',
          transition: 'opacity 0.6s ease, transform 0.8s ease',
        }}
      />

      {/* Darkness layer — the breath before the story */}
      <div
        className="absolute inset-0 pointer-events-none z-[4]"
        style={{
          background: 'rgba(26, 21, 16, 0.95)',
          opacity: phase === 'darkness' ? 1 : 0,
          transition: 'opacity 0.4s ease',
        }}
      />

      {/* Corner ornaments */}
      <div className="absolute inset-0 pointer-events-none z-20">
        <div className="absolute top-6 left-6 w-16 h-16 border-t border-l opacity-30" style={{ borderColor: 'var(--gold)' }} />
        <div className="absolute top-6 right-6 w-16 h-16 border-t border-r opacity-30" style={{ borderColor: 'var(--gold)' }} />
        <div className="absolute bottom-6 left-6 w-16 h-16 border-b border-l opacity-30" style={{ borderColor: 'var(--gold)' }} />
        <div className="absolute bottom-6 right-6 w-16 h-16 border-b border-r opacity-30" style={{ borderColor: 'var(--gold)' }} />
      </div>

      {/* Floating jasmine petals */}
      <div
        ref={petalContainerRef}
        className="absolute inset-0 z-30 pointer-events-none"
        style={{ transition: 'transform 0.8s ease-out', willChange: 'transform' }}
      >
        {petalConfigs.map((config, i) => (
          <div
            key={`petal-${i}`}
            className="absolute"
            style={{
              left: `${config.left}%`,
              top: '-5%',
              width: config.size,
              height: config.size * 1.2,
              animation: `petalDrift ${config.duration}s ease-out ${config.delay}s forwards`,
              opacity: 0,
            }}
          >
            <svg width="100%" height="100%" viewBox="0 0 20 24" fill="none">
              <path d="M10 0C10 0 14 4 14 10C14 16 10 24 10 24C10 24 6 16 6 10C6 4 10 0 10 0Z"
                fill={`rgba(255,250,240,${config.opacity})`} />
            </svg>
          </div>
        ))}
      </div>

      {/* Content — with cinematic entrance */}
      <div
        ref={contentRef}
        className="relative z-10 w-full max-w-md mx-auto px-6 text-center"
        style={{
          transition: 'transform 0.6s ease-out, opacity 0.6s ease',
          willChange: 'transform, opacity',
          // Lean in: content draws closer when opening
          transform: phase === 'leaning' ? 'translate3d(0, 0, 0) scale(1.04)' :
                     phase === 'blooming' ? 'translate3d(0, 0, 0) scale(1.06)' :
                     phase === 'dissolving' ? 'translate3d(0, 0, 0) scale(1.08)' :
                     undefined,
          opacity: phase === 'dissolving' ? 0.6 : phase === 'darkness' ? 0 : 1,
        }}
      >
        {/* Seal */}
        <div
          className="w-16 h-16 mx-auto mb-10 rounded-full flex items-center justify-center"
          style={{
            background: 'radial-gradient(circle, var(--gold-light), var(--gold-dark))',
            boxShadow: '0 2px 12px rgba(201,169,110,0.3)',
            opacity: 0.9,
          }}
        >
          <span className="text-lg" style={{ fontFamily: 'var(--font-script)', color: 'var(--cream)' }}>
            I&A
          </span>
        </div>

        <p className="tracking-[0.35em] uppercase text-[10px] sm:text-xs mb-4"
          style={{ fontFamily: 'var(--font-body)', color: 'var(--gold-light)', opacity: 0.7 }}>
          The Wedding Invitation of
        </p>

        {/* Names with handwriting reveal */}
        <h2
          className="text-4xl sm:text-5xl mb-3"
          style={{
            fontFamily: 'var(--font-script)',
            color: 'var(--gold-light)',
            clipPath: 'inset(0 100% 0 0)',
            animation: 'handwritingReveal 2.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.3s forwards',
          }}
        >
          Irwan &amp; Anira
        </h2>

        <div className="max-w-[200px] mx-auto mb-6" style={{ opacity: 0.4 }}>
          <div className="h-px w-full" style={{ background: 'linear-gradient(90deg, transparent, var(--gold), transparent)' }} />
        </div>

        <p className="text-sm tracking-[0.2em] mb-10" style={{ fontFamily: 'var(--font-serif)', color: 'var(--cream)', opacity: 0.7 }}>
          05 . 07 . 2026
        </p>

        {/* The button that opens the door */}
        <button
          onClick={handleOpen}
          disabled={isOpening}
          className="px-8 py-3 border border-[var(--gold)]/60 text-[var(--gold-light)] tracking-[0.3em] uppercase text-[10px] sm:text-xs
            hover:bg-[var(--gold)]/10 hover:border-[var(--gold)]/80 transition-all duration-700 cursor-pointer"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          {isOpening ? '' : 'Buka Undangan'}
        </button>
      </div>
    </section>
  )
}
