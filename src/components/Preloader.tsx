'use client'

import { useEffect, useState, useRef } from 'react'
import { gsap } from 'gsap'

interface PreloaderProps {
  onComplete: () => void
  groomName: string
  brideName: string
}

export default function Preloader({ onComplete, groomName, brideName }: PreloaderProps) {
  const [progress, setProgress] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const groomCharsRef = useRef<HTMLSpanElement[]>([])
  const brideCharsRef = useRef<HTMLSpanElement[]>([])
  const ampersandRef = useRef<HTMLSpanElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const ornamentRef = useRef<HTMLDivElement>(null)

  const groomFirst = groomName.split(' ')[0]
  const brideFirst = brideName.split(' ')[0]

  const onCompleteRef = useRef(onComplete)
  
  useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (prefersReduced) {
      // Use requestAnimationFrame to avoid synchronous setState in effect
      requestAnimationFrame(() => {
        setProgress(100)
        setTimeout(() => onCompleteRef.current(), 500)
      })
      return
    }

    const tl = gsap.timeline({
      onComplete: () => {
        // Fade out preloader
        gsap.to(containerRef.current, {
          opacity: 0,
          duration: 0.8,
          ease: 'power2.inOut',
          onComplete: () => onCompleteRef.current(),
        })
      },
    })

    // Progress bar animation
    tl.to(progressRef.current, {
      width: '100%',
      duration: 3,
      ease: 'power1.inOut',
      onUpdate: () => {
        if (progressRef.current) {
          const width = progressRef.current.style.width
          setProgress(Math.min(100, parseInt(width) || 0))
        }
      },
    }, 0)

    // Animate groom name letters
    tl.fromTo(
      groomCharsRef.current,
      { opacity: 0, y: 30, rotateX: -90 },
      {
        opacity: 1,
        y: 0,
        rotateX: 0,
        duration: 0.4,
        stagger: 0.08,
        ease: 'back.out(1.7)',
      },
      0.3
    )

    // Animate ampersand
    tl.fromTo(
      ampersandRef.current,
      { opacity: 0, scale: 0, rotation: -180 },
      {
        opacity: 1,
        scale: 1,
        rotation: 0,
        duration: 0.6,
        ease: 'back.out(2)',
      },
      1.0
    )

    // Animate bride name letters
    tl.fromTo(
      brideCharsRef.current,
      { opacity: 0, y: 30, rotateX: -90 },
      {
        opacity: 1,
        y: 0,
        rotateX: 0,
        duration: 0.4,
        stagger: 0.08,
        ease: 'back.out(1.7)',
      },
      1.2
    )

    // Ornament scale in
    tl.fromTo(
      ornamentRef.current,
      { opacity: 0, scale: 0.5 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.6,
        ease: 'elastic.out(1, 0.5)',
      },
      1.8
    )

    // Hold for a moment
    tl.to({}, { duration: 0.5 })

    return () => {
      tl.kill()
    }
  }, []) // onComplete is accessed via ref, no need in deps

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
      style={{ background: 'var(--cream)' }}
    >
      {/* Decorative corner borders */}
      <div className="absolute top-8 left-8 w-20 h-20 border-t-2 border-l-2 opacity-40" style={{ borderColor: 'var(--gold)' }} />
      <div className="absolute top-8 right-8 w-20 h-20 border-t-2 border-r-2 opacity-40" style={{ borderColor: 'var(--gold)' }} />
      <div className="absolute bottom-8 left-8 w-20 h-20 border-b-2 border-l-2 opacity-40" style={{ borderColor: 'var(--gold)' }} />
      <div className="absolute bottom-8 right-8 w-20 h-20 border-b-2 border-r-2 opacity-40" style={{ borderColor: 'var(--gold)' }} />

      {/* Bismillah */}
      <p
        className="text-lg sm:text-xl mb-8 opacity-60"
        style={{ fontFamily: 'var(--font-arabic)', color: 'var(--brown)' }}
      >
        بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
      </p>

      {/* Groom Name */}
      <div className="flex mb-2" style={{ perspective: '600px' }}>
        {groomFirst.split('').map((char, i) => (
          <span
            key={`g-${i}`}
            ref={(el) => { if (el) groomCharsRef.current[i] = el }}
            className="text-4xl sm:text-6xl inline-block"
            style={{
              fontFamily: 'var(--font-script)',
              color: 'var(--gold-dark)',
              willChange: 'transform, opacity',
              display: 'inline-block',
              opacity: 0,
            }}
          >
            {char}
          </span>
        ))}
      </div>

      {/* Ampersand */}
      <div className="my-3 flex items-center justify-center">
        <span ref={ampersandRef} className="text-3xl sm:text-4xl" style={{ fontFamily: 'var(--font-script)', color: 'var(--gold)', opacity: 0, willChange: 'transform, opacity' }}>
          &amp;
        </span>
      </div>

      {/* Bride Name */}
      <div className="flex mb-6" style={{ perspective: '600px' }}>
        {brideFirst.split('').map((char, i) => (
          <span
            key={`b-${i}`}
            ref={(el) => { if (el) brideCharsRef.current[i] = el }}
            className="text-4xl sm:text-6xl inline-block"
            style={{
              fontFamily: 'var(--font-script)',
              color: 'var(--gold-dark)',
              willChange: 'transform, opacity',
              display: 'inline-block',
              opacity: 0,
            }}
          >
            {char}
          </span>
        ))}
      </div>

      {/* Ornament */}
      <div ref={ornamentRef} className="ornament-divider max-w-[200px] mb-8" style={{ opacity: 0, willChange: 'transform, opacity' }}>
        <span className="text-[var(--gold)] text-lg">&#10047;</span>
      </div>

      {/* Progress bar */}
      <div className="w-48 sm:w-64 relative">
        <div className="h-[2px] w-full rounded-full" style={{ background: 'var(--gold)]' }} />
        <div
          ref={progressRef}
          className="h-[2px] absolute top-0 left-0 rounded-full"
          style={{ background: 'var(--gold)', width: '0%', willChange: 'width' }}
        />
        <p
          className="text-center mt-3 text-xs tracking-[0.3em] uppercase"
          style={{ fontFamily: 'var(--font-body)', color: 'var(--brown-light)' }}
        >
          {progress < 100 ? 'Memuat...' : 'Siap'}
        </p>
      </div>
    </div>
  )
}
