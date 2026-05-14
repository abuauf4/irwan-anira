'use client'

import { useState, useRef, useCallback, useEffect } from 'react'

interface CoverSectionProps {
  onOpen: () => void
}

export default function CoverSection({ onOpen }: CoverSectionProps) {
  const [isOpening, setIsOpening] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const bgRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const petalContainerRef = useRef<HTMLDivElement>(null)
  const mouseRef = useRef({ x: 0, y: 0 })
  const [goldenFlash, setGoldenFlash] = useState(false)

  // Parallax on mouse move (desktop only)
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    // Only enable on non-touch devices
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
    if (isTouchDevice) return

    const handleMouseMove = (e: MouseEvent) => {
      const rect = containerRef.current?.getBoundingClientRect()
      if (!rect) return

      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      // Normalize to -1..1
      const nx = (e.clientX - centerX) / (rect.width / 2)
      const ny = (e.clientY - centerY) / (rect.height / 2)
      mouseRef.current = { x: nx, y: ny }

      // Background shifts opposite to mouse (2-3px max)
      if (bgRef.current) {
        const bgX = -nx * 2.5
        const bgY = -ny * 2.5
        bgRef.current.style.transform = `translate3d(${bgX}px, ${bgY}px, 0)`
      }

      // Content shifts toward mouse (1-2px max)
      if (contentRef.current) {
        const cX = nx * 1.5
        const cY = ny * 1.5
        contentRef.current.style.transform = `translate3d(${cX}px, ${cY}px, 0)`
      }

      // Petals gently drift in mouse direction
      if (petalContainerRef.current) {
        const px = nx * 8
        const py = ny * 5
        petalContainerRef.current.style.transform = `translate3d(${px}px, ${py}px, 0)`
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
  }, [])

  const handleOpen = useCallback(() => {
    setIsOpening(true)

    // Golden flash — brief, dim, warm
    setTimeout(() => setGoldenFlash(true), 150)

    // Cinematic open — gentle scale up, then enter
    setTimeout(() => {
      onOpen()
    }, 400)
  }, [onOpen])

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
      className={`relative min-h-screen flex items-center justify-center overflow-hidden ${isOpening ? 'opacity-0' : 'opacity-100'}`}
      style={{
        transition: isOpening
          ? 'opacity 0.5s ease 0.15s, transform 0.5s ease 0.15s'
          : 'none',
        transform: isOpening ? 'scale(1.02)' : 'scale(1)',
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

      {/* Vignette — dark edges */}
      <div className="absolute inset-0 pointer-events-none z-[1]" style={{
        background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.5) 100%)'
      }} />

      {/* Subtle golden light drift — like moonlight or candlelight shifting */}
      <div
        className="absolute inset-0 pointer-events-none z-[2]"
        style={{
          background: 'radial-gradient(ellipse, rgba(201,169,110,0.08) 0%, transparent 50%)',
          animation: 'goldenLightDrift 14s ease-in-out infinite alternate',
        }}
      />

      {/* Golden flash overlay on open */}
      {goldenFlash && (
        <div
          className="absolute inset-0 pointer-events-none z-50"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(201,169,110,0.15) 0%, transparent 60%)',
            animation: 'goldenFlash 0.4s ease-out forwards',
          }}
        />
      )}

      {/* Corner ornaments */}
      <div className="absolute inset-0 pointer-events-none z-20">
        <div className="absolute top-6 left-6 w-16 h-16 border-t border-l opacity-30" style={{ borderColor: 'var(--gold)' }} />
        <div className="absolute top-6 right-6 w-16 h-16 border-t border-r opacity-30" style={{ borderColor: 'var(--gold)' }} />
        <div className="absolute bottom-6 left-6 w-16 h-16 border-b border-l opacity-30" style={{ borderColor: 'var(--gold)' }} />
        <div className="absolute bottom-6 right-6 w-16 h-16 border-b border-r opacity-30" style={{ borderColor: 'var(--gold)' }} />
      </div>

      {/* Floating jasmine petals — 8 with varied timing and mouse reactivity */}
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

      {/* Content — with parallax and handwriting reveal */}
      <div
        ref={contentRef}
        className="relative z-10 w-full max-w-md mx-auto px-6 text-center"
        style={{ transition: 'transform 0.6s ease-out', willChange: 'transform' }}
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

        {/* Names with handwriting reveal animation */}
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
