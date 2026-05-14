'use client'

import { useState, useRef, useCallback } from 'react'

interface CoverSectionProps {
  onOpen: () => void
}

export default function CoverSection({ onOpen }: CoverSectionProps) {
  const [isOpening, setIsOpening] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleOpen = useCallback(() => {
    setIsOpening(true)
    // Cinematic open — brief hold, then enter
    setTimeout(() => {
      onOpen()
    }, 800)
  }, [onOpen])

  return (
    <section
      ref={containerRef}
      className={`relative min-h-screen flex items-center justify-center overflow-hidden transition-opacity duration-800 ${isOpening ? 'opacity-0 scale-[1.02]' : 'opacity-100'}`}
      style={{ transition: 'opacity 0.8s ease, transform 0.8s ease' }}
    >
      {/* Background Image — warm, cinematic */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/hero-poster.jpg')" }}
      />
      <div className="hero-overlay absolute inset-0" />

      {/* Vignette — dark edges */}
      <div className="absolute inset-0 pointer-events-none z-[1]" style={{
        background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.5) 100%)'
      }} />

      {/* Corner ornaments */}
      <div className="absolute inset-0 pointer-events-none z-20">
        <div className="absolute top-6 left-6 w-16 h-16 border-t border-l opacity-30" style={{ borderColor: 'var(--gold)' }} />
        <div className="absolute top-6 right-6 w-16 h-16 border-t border-r opacity-30" style={{ borderColor: 'var(--gold)' }} />
        <div className="absolute bottom-6 left-6 w-16 h-16 border-b border-l opacity-30" style={{ borderColor: 'var(--gold)' }} />
        <div className="absolute bottom-6 right-6 w-16 h-16 border-b border-r opacity-30" style={{ borderColor: 'var(--gold)' }} />
      </div>

      {/* Floating jasmine petals */}
      <div className="absolute inset-0 z-30 pointer-events-none">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={`petal-${i}`}
            className="absolute"
            style={{
              left: `${15 + (i * 15) % 70}%`,
              top: '-5%',
              width: 8 + (i * 2) % 6,
              height: (8 + (i * 2) % 6) * 1.2,
              animation: `petalDrift ${8 + i * 1.5}s ease-out ${i * 0.8}s forwards`,
              opacity: 0,
            }}
          >
            <svg width="100%" height="100%" viewBox="0 0 20 24" fill="none">
              <path d="M10 0C10 0 14 4 14 10C14 16 10 24 10 24C10 24 6 16 6 10C6 4 10 0 10 0Z"
                fill="rgba(255,250,240,0.3)" />
            </svg>
          </div>
        ))}
      </div>

      {/* Content — single step, no intermediate reveal */}
      <div className="relative z-10 w-full max-w-md mx-auto px-6 text-center">
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

        <h2 className="text-4xl sm:text-5xl mb-3" style={{ fontFamily: 'var(--font-script)', color: 'var(--gold-light)' }}>
          Irwan & Anira
        </h2>

        <div className="max-w-[200px] mx-auto mb-6" style={{ opacity: 0.4 }}>
          <div className="h-px w-full" style={{ background: 'linear-gradient(90deg, transparent, var(--gold), transparent)' }} />
        </div>

        <p className="text-sm tracking-[0.2em] mb-10" style={{ fontFamily: 'var(--font-serif)', color: 'var(--cream)', opacity: 0.7 }}>
          05 . 07 . 2026
        </p>

        {/* Single button — directly enters the invitation */}
        <button
          onClick={handleOpen}
          disabled={isOpening}
          className="px-8 py-3 border border-[var(--gold)]/60 text-[var(--gold-light)] tracking-[0.3em] uppercase text-[10px] sm:text-xs
            hover:bg-[var(--gold)]/10 transition-all duration-700 cursor-pointer"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          {isOpening ? 'Membuka...' : 'Buka Undangan'}
        </button>
      </div>
    </section>
  )
}
