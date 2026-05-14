'use client'

import { useState, useEffect, useCallback } from 'react'

interface CoverSectionProps {
  onOpen: () => void
}

// Confetti particle component
function ConfettiParticle({ delay, color, x, size }: { delay: number; color: string; x: number; size: number }) {
  return (
    <div
      className="absolute top-1/2 left-1/2 pointer-events-none"
      style={{
        transform: `translate(calc(-50% + ${x}px), -50%)`,
      }}
    >
      <div
        className="rounded-sm"
        style={{
          width: size,
          height: size,
          background: color,
          animation: `confettiBurst 1.5s ease-out ${delay}s forwards`,
          opacity: 0,
        }}
      />
    </div>
  )
}

// Petal particle
function PetalParticle({ delay, x, rotation }: { delay: number; x: number; rotation: number }) {
  return (
    <div
      className="absolute top-1/2 left-1/2 pointer-events-none"
      style={{
        transform: `translate(calc(-50% + ${x}px), -50%)`,
      }}
    >
      <div
        style={{
          width: 12,
          height: 16,
          background: 'linear-gradient(135deg, #f9a8d4, #f472b6, #ec4899)',
          borderRadius: '50% 50% 50% 0',
          animation: `petalBurst 2s ease-out ${delay}s forwards`,
          opacity: 0,
          transform: `rotate(${rotation}deg)`,
        }}
      />
    </div>
  )
}

export default function CoverSection({ onOpen }: CoverSectionProps) {
  const [isOpening, setIsOpening] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [showContent, setShowContent] = useState(false)
  const [revealed, setRevealed] = useState({ title: false, groom: false, ampersand: false, bride: false, date: false, button: false })

  const handleOpen = useCallback(() => {
    setIsOpening(true)
    // Trigger confetti after envelope starts opening
    setTimeout(() => setShowConfetti(true), 400)
    // Show content after envelope animation
    setTimeout(() => setShowContent(true), 800)
    // Sequential reveal
    setTimeout(() => setRevealed(r => ({ ...r, title: true })), 1000)
    setTimeout(() => setRevealed(r => ({ ...r, groom: true })), 1200)
    setTimeout(() => setRevealed(r => ({ ...r, ampersand: true })), 1400)
    setTimeout(() => setRevealed(r => ({ ...r, bride: true })), 1600)
    setTimeout(() => setRevealed(r => ({ ...r, date: true })), 1800)
    setTimeout(() => setRevealed(r => ({ ...r, button: true })), 2200)
  }, [])

  const handleEnter = useCallback(() => {
    onOpen()
    // Smooth scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [onOpen])

  // Confetti colors
  const confettiColors = ['#C9A96E', '#D4B87A', '#f472b6', '#f9a8d4', '#a78bfa', '#fbbf24', '#34d399']

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/hero-poster.jpg')" }}
      />
      <div className="hero-overlay absolute inset-0" />

      {/* Batik pattern border overlay */}
      <div className="absolute inset-0 pointer-events-none z-20">
        {/* Top batik border */}
        <div className="absolute top-0 left-0 right-0 h-12 sm:h-16" style={{
          background: `repeating-linear-gradient(
            90deg,
            transparent,
            transparent 8px,
            var(--gold) 8px,
            var(--gold) 10px,
            transparent 10px,
            transparent 20px
          ),
          repeating-linear-gradient(
            90deg,
            transparent,
            transparent 18px,
            rgba(201,169,110,0.3) 18px,
            rgba(201,169,110,0.3) 20px,
            transparent 20px,
            transparent 40px
          )`,
          maskImage: 'linear-gradient(to bottom, black 40%, transparent)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 40%, transparent)',
        }} />
        {/* Bottom batik border */}
        <div className="absolute bottom-0 left-0 right-0 h-12 sm:h-16" style={{
          background: `repeating-linear-gradient(
            90deg,
            transparent,
            transparent 8px,
            var(--gold) 8px,
            var(--gold) 10px,
            transparent 10px,
            transparent 20px
          ),
          repeating-linear-gradient(
            90deg,
            transparent,
            transparent 18px,
            rgba(201,169,110,0.3) 18px,
            rgba(201,169,110,0.3) 20px,
            transparent 20px,
            transparent 40px
          )`,
          maskImage: 'linear-gradient(to top, black 40%, transparent)',
          WebkitMaskImage: 'linear-gradient(to top, black 40%, transparent)',
        }} />
        {/* Corner ornaments */}
        <div className="absolute top-4 left-4 w-20 h-20 border-t-2 border-l-2 border-[var(--gold)] opacity-60" />
        <div className="absolute top-4 right-4 w-20 h-20 border-t-2 border-r-2 border-[var(--gold)] opacity-60" />
        <div className="absolute bottom-4 left-4 w-20 h-20 border-b-2 border-l-2 border-[var(--gold)] opacity-60" />
        <div className="absolute bottom-4 right-4 w-20 h-20 border-b-2 border-r-2 border-[var(--gold)] opacity-60" />
      </div>

      {/* Confetti */}
      {showConfetti && (
        <div className="absolute inset-0 z-30 pointer-events-none">
          {Array.from({ length: 30 }).map((_, i) => (
            <ConfettiParticle
              key={`confetti-${i}`}
              delay={Math.random() * 0.5}
              color={confettiColors[i % confettiColors.length]}
              x={(Math.random() - 0.5) * 400}
              size={Math.random() * 8 + 4}
            />
          ))}
          {Array.from({ length: 10 }).map((_, i) => (
            <PetalParticle
              key={`petal-${i}`}
              delay={Math.random() * 0.6 + 0.2}
              x={(Math.random() - 0.5) * 300}
              rotation={Math.random() * 360}
            />
          ))}
        </div>
      )}

      {/* Envelope container */}
      <div className="relative z-10 w-full max-w-md mx-auto px-6" style={{ perspective: '1200px' }}>
        {!isOpening ? (
          /* Closed envelope */
          <div className="text-center">
            {/* Envelope body */}
            <div
              className="relative rounded-xl overflow-hidden shadow-2xl border-2 border-[var(--gold)]/40"
              style={{ background: 'var(--cream)' }}
            >
              {/* Batik-inspired decorative header */}
              <div className="h-3" style={{
                background: `repeating-linear-gradient(
                  90deg,
                  var(--gold-dark),
                  var(--gold-dark) 12px,
                  var(--gold) 12px,
                  var(--gold) 16px,
                  var(--gold-dark) 16px,
                  var(--gold-dark) 28px,
                  var(--gold-light) 28px,
                  var(--gold-light) 32px
                )`,
              }} />

              <div className="py-12 px-6 text-center">
                {/* Seal */}
                <div className="w-20 h-20 mx-auto mb-8 rounded-full flex items-center justify-center"
                  style={{
                    background: 'radial-gradient(circle, var(--gold-light), var(--gold-dark))',
                    boxShadow: '0 4px 15px rgba(201,169,110,0.4)',
                  }}
                >
                  <span className="text-2xl" style={{ fontFamily: 'var(--font-script)', color: 'var(--cream)' }}>
                    I&A
                  </span>
                </div>

                <p className="tracking-[0.3em] uppercase text-xs sm:text-sm mb-3"
                  style={{ fontFamily: 'var(--font-body)', color: 'var(--brown-light)' }}>
                  The Wedding Invitation of
                </p>
                <h2 className="text-4xl sm:text-5xl mb-2" style={{ fontFamily: 'var(--font-script)', color: 'var(--gold-dark)' }}>
                  Irwan & Anira
                </h2>
                <p className="text-sm tracking-widest mt-3" style={{ fontFamily: 'var(--font-serif)', color: 'var(--brown-light)' }}>
                  05 . 07 . 2026
                </p>
              </div>

              {/* Batik-inspired decorative footer */}
              <div className="h-3" style={{
                background: `repeating-linear-gradient(
                  90deg,
                  var(--gold-dark),
                  var(--gold-dark) 12px,
                  var(--gold) 12px,
                  var(--gold) 16px,
                  var(--gold-dark) 16px,
                  var(--gold-dark) 28px,
                  var(--gold-light) 28px,
                  var(--gold-light) 32px
                )`,
              }} />
            </div>

            {/* Open button */}
            <button
              onClick={handleOpen}
              className="mt-8 px-10 py-3.5 border-2 border-[var(--gold)] text-[var(--gold-dark)] tracking-[0.25em] uppercase text-xs sm:text-sm
                hover:bg-[var(--gold)] hover:text-[var(--cream)] transition-all duration-500 cursor-pointer
                shadow-lg hover:shadow-xl"
              style={{ fontFamily: 'var(--font-body)', background: 'var(--cream)' }}
            >
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Buka Undangan
              </span>
            </button>
          </div>
        ) : (
          /* Opening animation - revealed content */
          <div
            className="text-center py-12"
            style={{
              animation: 'envelopeOpen 0.8s ease-out forwards',
            }}
          >
            {showContent && (
              <>
                <p
                  className={`tracking-[0.3em] uppercase text-xs sm:text-sm mb-4 transition-all duration-700 ${revealed.title ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                  style={{ fontFamily: 'var(--font-body)', color: 'var(--gold-light)' }}
                >
                  The Wedding of
                </p>
                <h1
                  className={`text-5xl sm:text-7xl md:text-8xl mb-2 transition-all duration-700 ${revealed.groom ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                  style={{ fontFamily: 'var(--font-script)', color: 'var(--gold-light)' }}
                >
                  Irwan
                </h1>
                <p
                  className={`text-2xl sm:text-3xl my-2 transition-all duration-700 ${revealed.ampersand ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}
                  style={{ fontFamily: 'var(--font-script)', color: 'var(--gold)' }}
                >
                  &
                </p>
                <h1
                  className={`text-5xl sm:text-7xl md:text-8xl mb-6 transition-all duration-700 ${revealed.bride ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                  style={{ fontFamily: 'var(--font-script)', color: 'var(--gold-light)' }}
                >
                  Anira
                </h1>
                <div
                  className={`ornament-divider max-w-xs mx-auto mb-6 transition-all duration-700 ${revealed.date ? 'opacity-100' : 'opacity-0'}`}
                >
                  <span className="text-[var(--gold)] text-lg">&#10047;</span>
                </div>
                <p
                  className={`tracking-widest text-sm sm:text-base mb-10 transition-all duration-700 ${revealed.date ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                  style={{ fontFamily: 'var(--font-serif)', color: 'var(--cream)' }}
                >
                  05 . 07 . 2026
                </p>

                <button
                  onClick={handleEnter}
                  className={`px-10 py-3.5 border-2 border-[var(--gold)] text-[var(--gold-light)] tracking-[0.25em] uppercase text-xs sm:text-sm
                    hover:bg-[var(--gold)] hover:text-[var(--brown)] transition-all duration-500 cursor-pointer
                    ${revealed.button ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  Masuk ke Undangan
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
