'use client'

import { useState, useRef, useCallback } from 'react'

interface CoverSectionProps {
  onOpen: () => void
}

export default function CoverSection({ onOpen }: CoverSectionProps) {
  const [isOpening, setIsOpening] = useState(false)
  const [revealed, setRevealed] = useState({ title: false, groom: false, ampersand: false, bride: false, date: false, button: false })
  const containerRef = useRef<HTMLDivElement>(null)

  const handleOpen = useCallback(() => {
    setIsOpening(true)
    // Sequential reveal — slow, cinematic
    setTimeout(() => setRevealed(r => ({ ...r, title: true })), 800)
    setTimeout(() => setRevealed(r => ({ ...r, groom: true })), 1200)
    setTimeout(() => setRevealed(r => ({ ...r, ampersand: true })), 1600)
    setTimeout(() => setRevealed(r => ({ ...r, bride: true })), 2000)
    setTimeout(() => setRevealed(r => ({ ...r, date: true })), 2600)
    setTimeout(() => setRevealed(r => ({ ...r, button: true })), 3200)
  }, [])

  const handleEnter = useCallback(() => {
    onOpen()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [onOpen])

  return (
    <section ref={containerRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image — warm, cinematic */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/hero-poster.jpg')" }}
      />
      <div className="hero-overlay absolute inset-0" />

      {/* Very subtle corner ornaments — thin, elegant */}
      <div className="absolute inset-0 pointer-events-none z-20">
        <div className="absolute top-6 left-6 w-16 h-16 border-t border-l opacity-30" style={{ borderColor: 'var(--gold)' }} />
        <div className="absolute top-6 right-6 w-16 h-16 border-t border-r opacity-30" style={{ borderColor: 'var(--gold)' }} />
        <div className="absolute bottom-6 left-6 w-16 h-16 border-b border-l opacity-30" style={{ borderColor: 'var(--gold)' }} />
        <div className="absolute bottom-6 right-6 w-16 h-16 border-b border-r opacity-30" style={{ borderColor: 'var(--gold)' }} />
      </div>

      {/* Floating jasmine petals — very few, very slow */}
      {isOpening && (
        <div className="absolute inset-0 z-30 pointer-events-none">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={`petal-${i}`}
              className="absolute"
              style={{
                left: `${15 + Math.random() * 70}%`,
                top: '-5%',
                width: 8 + Math.random() * 6,
                height: (8 + Math.random() * 6) * 1.2,
                animation: `petalDrift ${8 + Math.random() * 6}s ease-out ${Math.random() * 2}s forwards`,
                opacity: 0,
              }}
            >
              <svg width="100%" height="100%" viewBox="0 0 20 24" fill="none">
                <path d="M10 0C10 0 14 4 14 10C14 16 10 24 10 24C10 24 6 16 6 10C6 4 10 0 10 0Z"
                  fill="rgba(255,250,240,0.4)" />
              </svg>
            </div>
          ))}
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 w-full max-w-md mx-auto px-6">
        {!isOpening ? (
          /* Closed — like a sealed diary */
          <div className="text-center">
            {/* Seal — minimal */}
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

            <h2 className="text-4xl sm:text-5xl mb-3" style={{ fontFamily: 'var(--font-script)', color: 'var(--gold-light)' }}>
              Irwan & Anira
            </h2>

            <p className="text-sm tracking-[0.2em]" style={{ fontFamily: 'var(--font-serif)', color: 'var(--cream)', opacity: 0.7 }}>
              05 . 07 . 2026
            </p>

            {/* Open button — elegant, minimal */}
            <button
              onClick={handleOpen}
              className="mt-10 px-8 py-3 border border-[var(--gold)]/60 text-[var(--gold-light)] tracking-[0.3em] uppercase text-[10px] sm:text-xs
                hover:bg-[var(--gold)]/10 transition-all duration-700 cursor-pointer"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              Buka Undangan
            </button>
          </div>
        ) : (
          /* Opening — cinematic reveal */
          <div className="text-center py-8">
            <p
              className={`tracking-[0.4em] uppercase text-[10px] sm:text-xs mb-6 transition-all duration-1000 ${revealed.title ? 'opacity-70 translate-y-0' : 'opacity-0 translate-y-3'}`}
              style={{ fontFamily: 'var(--font-body)', color: 'var(--gold-light)' }}
            >
              The Wedding of
            </p>

            <h1
              className={`text-5xl sm:text-7xl md:text-8xl mb-2 transition-all duration-1000 ${revealed.groom ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              style={{ fontFamily: 'var(--font-script)', color: 'var(--gold-light)' }}
            >
              Irwan
            </h1>

            <p
              className={`text-xl sm:text-2xl my-3 transition-all duration-1000 ${revealed.ampersand ? 'opacity-80 scale-100' : 'opacity-0 scale-75'}`}
              style={{ fontFamily: 'var(--font-script)', color: 'var(--gold)' }}
            >
              &amp;
            </p>

            <h1
              className={`text-5xl sm:text-7xl md:text-8xl mb-8 transition-all duration-1000 ${revealed.bride ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              style={{ fontFamily: 'var(--font-script)', color: 'var(--gold-light)' }}
            >
              Anira
            </h1>

            <div
              className={`max-w-[200px] mx-auto mb-6 transition-all duration-1000 ${revealed.date ? 'opacity-40' : 'opacity-0'}`}
            >
              <div className="h-px w-full" style={{ background: 'linear-gradient(90deg, transparent, var(--gold), transparent)' }} />
            </div>

            <p
              className={`tracking-[0.15em] text-sm sm:text-base mb-12 transition-all duration-1000 ${revealed.date ? 'opacity-80 translate-y-0' : 'opacity-0 translate-y-3'}`}
              style={{ fontFamily: 'var(--font-serif)', color: 'var(--cream)' }}
            >
              05 . 07 . 2026
            </p>

            <button
              onClick={handleEnter}
              className={`px-8 py-3 border border-[var(--gold)]/60 text-[var(--gold-light)] tracking-[0.3em] uppercase text-[10px] sm:text-xs
                hover:bg-[var(--gold)]/10 transition-all duration-700 cursor-pointer
                ${revealed.button ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              style={{ fontFamily: 'var(--font-body)' }}
            >
              Masuk ke Undangan
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
