'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import JasmineParticles from '@/components/JasmineParticles'
import Preloader from '@/components/Preloader'
import SmoothScroll from '@/components/SmoothScroll'
import CoverSectionComponent from '@/components/CoverSection'
import MusicPlayerComponent from '@/components/MusicPlayer'
import GuestWishes from '@/components/GuestWishes'
import ScrollToTop from '@/components/ScrollToTop'
import {
  fadeIn,
  slideIn,
  scaleIn,
  staggerReveal,
  parallaxScroll,
  textReveal,
  imageReveal,
  counterAnimation,
  flipIn,
  magneticHover,
  sectionOpacityFade,
  initCursorFollower,
  prefersReducedMotion,
} from '@/lib/animations'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

/* ===================== WEDDING DATA ===================== */
const WEDDING = {
  groom: 'Irwan Pratomo',
  bride: 'Anira Tri Agustini',
  groomParents: 'Bpk. Sugeng Hartanto & Ibu Dahlianingsih',
  brideParents: 'Bpk Andi Yosalfi & Ibu Budi Hastuti',
  akadDate: '2026-07-05T10:00:00+07:00',
  resepsiDate: '2026-07-05T11:00:00+07:00',
  resepsiEnd: '2026-07-05T17:00:00+07:00',
  venue: 'Rumah Mempelai Wanita',
  address: 'Villa Mutiara Bogor 2 Blok C2 No.36, Kel. Waringin Jaya, Kec. Bojonggede, Kab. Bogor',
  lamaranDate: '31 Agustus 2025',
  timeline: [
    {
      year: '2020',
      title: 'Pertama Bertemu',
      description:
        'Tidak ada yang kebetulan di dunia ini, semua sudah tersusun rapih oleh sang maha kuasa, kita tidak bisa memilih kepada siapa kita akan jatuh cinta, awal kami bertemu pada tahun 2020. Tidak ada yang pernah meyangka bahwa pertemuan itu membawa kami pada suatu ikatan yang suci.',
    },
    {
      year: '2022',
      title: 'Mulai Dekat',
      description:
        'Seiring berjalan waktu kami semakin dekat. Latar belakang yang berbeda membuat kami saling melengkapi dan banyak menemukan hal baru. Satu dua langkah menuntun kami hingga ke perjalanan selajutnya.',
    },
    {
      year: '2025',
      title: 'Lamaran',
      description:
        'Kehendak-Nya menuntun kami pada pertemuan yang tak pernah disangka hingga akhirnya membawa kami pada sebuah ikatan suci yang dicintai-Nya, kami melangsungkan acara lamaran pada 31 Agustus 2025.',
    },
    {
      year: '2026',
      title: 'Menikah',
      description:
        'Percayalah, bukan karena bertemu lalu berjodoh, tapi karna berjodoh lah kami dipertemukan. Atas izin Allah kami memutuskan untuk mengikrarkan janji suci pernikahan pada 05 Juli 2026.',
    },
  ],
  galleryImages: [
    '/images/gallery-1.jpg',
    '/images/gallery-2.jpg',
    '/images/gallery-3.jpg',
    '/images/gallery-4.jpg',
    '/images/gallery-5.jpg',
    '/images/gallery-6.jpg',
    '/images/gallery-7.jpg',
    '/images/gallery-8.jpg',
    '/images/gallery-9.jpg',
    '/images/gallery-10.jpg',
    '/images/gallery-11.jpg',
  ],
}

/* ===================== COUNTDOWN ===================== */
function useCountdown(targetDate: string) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const target = new Date(targetDate).getTime()
    const interval = setInterval(() => {
      const now = new Date().getTime()
      const diff = target - now
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
        clearInterval(interval)
        return
      }
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [targetDate])

  return timeLeft
}

/* ===================== CURSOR FOLLOWER ===================== */
function CursorFollower() {
  const cursorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!cursorRef.current) return
    const cleanup = initCursorFollower(cursorRef.current)
    return () => { cleanup?.() }
  }, [])

  // Don't render on touch devices - use memo to avoid re-render
  const isTouchDevice = useRef(true)
  useEffect(() => {
    isTouchDevice.current = 'ontouchstart' in window || navigator.maxTouchPoints > 0
  }, [])

  // Will be true on first render (SSR-safe), then update
  // Since we use hidden sm:block, touch devices won't see it anyway
  if (typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0)) return null

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 w-3 h-3 rounded-full pointer-events-none z-[9998] hidden sm:block"
      style={{
        background: 'var(--gold)',
        opacity: 0.6,
        mixBlendMode: 'difference',
        willChange: 'transform',
      }}
      aria-hidden="true"
    />
  )
}

/* ===================== COMPONENTS ===================== */

// Cover / Hero Section - using enhanced CoverSection component
// The CoverSectionComponent is imported and used directly in the Home component

// Bismillah Section with elegant reveal (Arabic kept intact to preserve cursive connections)
function BismillahSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const arabicRef = useRef<HTMLDivElement>(null)
  const quoteRef = useRef<HTMLDivElement>(null)
  const sourceRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Fade in the section
      fadeIn(sectionRef.current!, { y: 30 })

      // Arabic text: animate as whole block to preserve cursive letter connections
      // Splitting Arabic chars with inline-block breaks the connected script
      if (arabicRef.current) {
        gsap.fromTo(arabicRef.current,
          { opacity: 0, scale: 0.85, filter: 'blur(8px)' },
          {
            opacity: 1,
            scale: 1,
            filter: 'blur(0px)',
            duration: 1.5,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current!,
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
          }
        )
      }

      fadeIn(quoteRef.current!, { delay: 0.5, y: 20 })
      fadeIn(sourceRef.current!, { delay: 0.8, y: 15 })
    })

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="py-20 px-6 text-center" style={{ background: 'var(--cream)', opacity: 0 }}>
      <div className="max-w-2xl mx-auto">
        <p ref={arabicRef} className="text-3xl sm:text-4xl md:text-5xl mb-6 leading-relaxed" style={{ fontFamily: 'var(--font-arabic)', color: 'var(--brown)', opacity: 0 }}>
          بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
        </p>
        <p ref={quoteRef} className="text-base sm:text-lg italic leading-relaxed" style={{ fontFamily: 'var(--font-serif)', color: 'var(--brown-light)' }}>
          &ldquo;Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu pasangan hidup dari jenismu sendiri, supaya kamu merasa tenteram kepadanya, dan dijadikan-Nya di antaramu rasa kasih dan sayang.&rdquo;
        </p>
        <p ref={sourceRef} className="mt-4 text-sm" style={{ fontFamily: 'var(--font-serif)', color: 'var(--brown-light)' }}>
          — QS. Ar-Rum: 21
        </p>
      </div>
    </section>
  )
}

// Bride & Groom Section with slide-in animations
function CoupleSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const groomRef = useRef<HTMLDivElement>(null)
  const brideRef = useRef<HTMLDivElement>(null)
  const heartRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      fadeIn(sectionRef.current!, { y: 30 })

      // Groom slides in from left with scale
      if (groomRef.current) {
        slideIn(groomRef.current, 'left', { distance: 100, delay: 0.3 })
      }

      // Heart beats in
      scaleIn(heartRef.current!, { delay: 0.6, fromScale: 0 })

      // Bride slides in from right with scale
      if (brideRef.current) {
        slideIn(brideRef.current, 'right', { distance: 100, delay: 0.3 })
      }
    })

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="py-20 px-6" style={{ background: 'var(--cream-dark)', opacity: 0 }}>
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl mb-2" style={{ fontFamily: 'var(--font-script)', color: 'var(--gold-dark)' }}>
          Mempelai
        </h2>
        <div className="ornament-divider max-w-xs mx-auto mb-12">
          <span className="text-[var(--gold)] text-lg">&#10047;</span>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-20">
          {/* Groom */}
          <div ref={groomRef} className="text-center" style={{ opacity: 0 }}>
            <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-full overflow-hidden mx-auto mb-6 border-4 border-[var(--gold)] shadow-lg">
              <img src="/images/groom.jpg" alt={WEDDING.groom} className="w-full h-full object-cover" />
            </div>
            <h3 className="text-3xl sm:text-4xl mb-2" style={{ fontFamily: 'var(--font-script)', color: 'var(--gold-dark)' }}>
              {WEDDING.groom}
            </h3>
            <div className="ornament-divider max-w-[120px] mx-auto mb-3">
              <span className="text-[var(--gold)] text-xs">&#10047;</span>
            </div>
            <p className="text-sm" style={{ fontFamily: 'var(--font-serif)', color: 'var(--brown-light)' }}>
              Putra dari<br />
              <span className="font-medium" style={{ color: 'var(--brown)' }}>{WEDDING.groomParents}</span>
            </p>
          </div>

          {/* Heart Divider */}
          <div ref={heartRef} className="text-4xl animate-heartbeat" style={{ color: 'var(--gold)', opacity: 0 }}>
            &#10084;
          </div>

          {/* Bride */}
          <div ref={brideRef} className="text-center" style={{ opacity: 0 }}>
            <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-full overflow-hidden mx-auto mb-6 border-4 border-[var(--gold)] shadow-lg">
              <img src="/images/bride.jpg" alt={WEDDING.bride} className="w-full h-full object-cover" />
            </div>
            <h3 className="text-3xl sm:text-4xl mb-2" style={{ fontFamily: 'var(--font-script)', color: 'var(--gold-dark)' }}>
              {WEDDING.bride}
            </h3>
            <div className="ornament-divider max-w-[120px] mx-auto mb-3">
              <span className="text-[var(--gold)] text-xs">&#10047;</span>
            </div>
            <p className="text-sm" style={{ fontFamily: 'var(--font-serif)', color: 'var(--brown-light)' }}>
              Putri dari<br />
              <span className="font-medium" style={{ color: 'var(--brown)' }}>{WEDDING.brideParents}</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

// Quote Section with parallax
function QuoteSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const bgRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Parallax on background
      if (bgRef.current) {
        parallaxScroll(bgRef.current, { speed: 0.2 })
      }

      // Fade in content
      fadeIn(contentRef.current!, { y: 40 })
    })

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative py-24 px-6 text-center bg-cover bg-center overflow-hidden"
    >
      <div
        ref={bgRef}
        className="absolute inset-[-20%] bg-cover bg-center"
        style={{ backgroundImage: "url('/images/quote-bg.jpg')" }}
      />
      <div className="absolute inset-0 bg-[var(--brown)]/70" />
      <div ref={contentRef} className="relative z-10 max-w-2xl mx-auto" style={{ opacity: 0 }}>
        <p className="text-2xl sm:text-3xl md:text-4xl italic leading-relaxed mb-6" style={{ fontFamily: 'var(--font-serif)', color: 'var(--gold-light)' }}>
          &ldquo;Apa yang menjadi takdirmu akan menemukan jalannya untuk menemukanmu.&rdquo;
        </p>
        <p className="text-sm tracking-widest uppercase" style={{ fontFamily: 'var(--font-body)', color: 'var(--gold-light)]' }}>
          — Sayidina Ali bin Abi Thalib
        </p>
      </div>
    </section>
  )
}

// Individual Timeline Story Card with handwriting animation
function TimelineStoryCard({ item, index, shouldAnimate, onStart, onComplete }: {
  item: { year: string; title: string; description: string }
  index: number
  shouldAnimate: boolean
  onStart: () => void
  onComplete: () => void
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const dotRef = useRef<HTMLDivElement>(null)
  const textContainerRef = useRef<HTMLDivElement>(null)
  const mobileDotRef = useRef<HTMLDivElement>(null)
  const borderRef = useRef<HTMLDivElement>(null)
  const hasAnimated = useRef(false)
  const onCompleteRef = useRef(onComplete)
  const onStartRef = useRef(onStart)
  const charsPreparedRef = useRef(false)

  useEffect(() => {
    onCompleteRef.current = onComplete
    onStartRef.current = onStart
  }, [onComplete, onStart])

  // Prepare characters for handwriting animation — only when shouldAnimate is true
  useEffect(() => {
    if (!shouldAnimate || !textContainerRef.current || charsPreparedRef.current) return
    charsPreparedRef.current = true

    // Split text into words, then characters — preserve spaces
    const text = item.description
    const container = textContainerRef.current
    container.innerHTML = ''

    const words = text.split(' ')
    words.forEach((word, wordIdx) => {
      const wordSpan = document.createElement('span')
      wordSpan.style.whiteSpace = 'nowrap'
      wordSpan.style.display = 'inline'

      for (let i = 0; i < word.length; i++) {
        const charSpan = document.createElement('span')
        charSpan.className = 'handwriting-char'
        charSpan.style.display = 'inline-block'
        charSpan.style.willChange = 'opacity, transform'
        charSpan.style.opacity = '0'
        charSpan.style.transform = 'translateY(4px) rotate(-3deg)'
        charSpan.style.minWidth = '0.1em'
        charSpan.textContent = word[i]
        wordSpan.appendChild(charSpan)
      }

      container.appendChild(wordSpan)

      // Add space between words
      if (wordIdx < words.length - 1) {
        const space = document.createElement('span')
        space.innerHTML = '\u00A0'
        space.style.opacity = '0'
        space.className = 'handwriting-char'
        space.style.willChange = 'opacity'
        container.appendChild(space)
      }
    })
  }, [shouldAnimate, item.description])

  // Trigger handwriting when shouldAnimate becomes true
  useEffect(() => {
    if (!shouldAnimate || hasAnimated.current) return

    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      if (hasAnimated.current) return
      hasAnimated.current = true
      onStartRef.current()

      const tl = gsap.timeline({
        onComplete: () => {
          onCompleteRef.current()
        },
      })

      // Step 1: Card border draws in
      if (borderRef.current) {
        tl.fromTo(borderRef.current,
          { clipPath: 'inset(0 100% 100% 0)' },
          { clipPath: 'inset(0 0% 0% 0%)', duration: 0.8, ease: 'power2.inOut' },
          0
        )
      }

      // Step 2: Timeline dot pops in
      if (dotRef.current) {
        tl.fromTo(dotRef.current,
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(2)' },
          0.3
        )
      }

      // Mobile dot
      if (mobileDotRef.current) {
        tl.fromTo(mobileDotRef.current,
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(2)' },
          0.3
        )
      }

      // Step 3: Title writes in (character by character with slight rotation)
      if (titleRef.current) {
        const titleText = titleRef.current.textContent || ''
        titleRef.current.innerHTML = ''
        const titleChars: HTMLSpanElement[] = []

        for (const char of titleText) {
          const span = document.createElement('span')
          span.style.display = 'inline-block'
          span.style.willChange = 'opacity, transform'
          span.style.opacity = '0'
          span.style.transform = 'translateY(8px) rotate(-5deg)'
          span.textContent = char === ' ' ? '\u00A0' : char
          titleRef.current.appendChild(span)
          titleChars.push(span)
        }

        tl.to(titleChars, {
          opacity: 1,
          y: 0,
          rotation: 0,
          duration: 0.15,
          stagger: 0.04,
          ease: 'power2.out',
        }, 0.5)
      }

      // Step 4: Description handwriting animation
      if (textContainerRef.current) {
        const chars = textContainerRef.current.querySelectorAll('.handwriting-char')

        // Animate each character appearing as if being written
        tl.to(chars, {
          opacity: 1,
          y: 0,
          rotation: 0,
          duration: 0.08,
          stagger: 0.022, // Smooth handwriting pace
          ease: 'power1.out',
        }, 0.9)
      }
    }, 100)

    return () => clearTimeout(timer)
  }, [shouldAnimate])

  return (
    <div
      ref={cardRef}
      className={`relative flex flex-col sm:flex-row items-center mb-16 last:mb-0 ${
        index % 2 === 0 ? 'sm:flex-row' : 'sm:flex-row-reverse'
      }`}
    >
      {/* Timeline dot */}
      <div
        ref={dotRef}
        className="hidden sm:flex absolute left-1/2 -translate-x-1/2 w-12 h-12 rounded-full border-2 border-[var(--gold)] items-center justify-center z-10"
        style={{ background: 'var(--cream)', opacity: 0 }}
      >
        <span className="text-xs font-bold" style={{ fontFamily: 'var(--font-body)', color: 'var(--gold-dark)' }}>
          {item.year}
        </span>
      </div>

      {/* Content */}
      <div className={`w-full sm:w-[calc(50%-40px)] ${index % 2 === 0 ? 'sm:pr-12 sm:text-right' : 'sm:pl-12 sm:text-left'}`}>
        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-md border border-[var(--gold)]/20 relative overflow-hidden">
          {/* Animated border draw */}
          <div
            ref={borderRef}
            className="absolute inset-0 rounded-lg pointer-events-none"
            style={{
              clipPath: 'inset(0 100% 100% 0%)',
              border: '2px solid var(--gold)',
              opacity: 0.4,
            }}
          />

          {/* Decorative corner accent */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 opacity-30" style={{ borderColor: 'var(--gold)' }} />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 opacity-30" style={{ borderColor: 'var(--gold)' }} />

          {/* Mobile year */}
          <div className="sm:hidden flex items-center justify-center mb-3">
            <div
              ref={mobileDotRef}
              className="w-12 h-12 rounded-full border-2 border-[var(--gold)] flex items-center justify-center"
              style={{ background: 'var(--cream)', opacity: 0 }}
            >
              <span className="text-xs font-bold" style={{ fontFamily: 'var(--font-body)', color: 'var(--gold-dark)' }}>
                {item.year}
              </span>
            </div>
          </div>

          <h3
            ref={titleRef}
            className="text-xl sm:text-2xl mb-3"
            style={{ fontFamily: 'var(--font-script)', color: 'var(--gold-dark)', opacity: 1 }}
          >
            {item.title}
          </h3>

          {/* Handwriting text area */}
          <div
            ref={textContainerRef}
            className="text-sm leading-relaxed min-h-[3em]"
            style={{ fontFamily: 'var(--font-serif)', color: 'var(--brown-light)' }}
          />
        </div>
      </div>

      {/* Empty space for layout */}
      <div className="hidden sm:block w-[calc(50%-40px)]" />
    </div>
  )
}

// Timeline Section with sequential handwriting storytelling + auto-scroll
function TimelineSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const completedRef = useRef<Set<number>>(new Set())
  const [, forceUpdate] = useState(0)
  const autoScrollRef = useRef<number | null>(null)
  const isScrollPausedRef = useRef(false)
  const userScrollTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Detect user manual scroll to pause auto-scroll temporarily
  useEffect(() => {
    const handleUserScroll = () => {
      // If auto-scroll is active, detect manual scroll by checking if scroll position
      // differs significantly from where auto-scroll would put it
      isScrollPausedRef.current = true

      if (userScrollTimeoutRef.current) {
        clearTimeout(userScrollTimeoutRef.current)
      }

      // Resume auto-scroll after 3 seconds of no manual scrolling
      userScrollTimeoutRef.current = setTimeout(() => {
        isScrollPausedRef.current = false
      }, 3000)
    }

    // Use wheel/touch events to detect intentional user scroll
    const handleWheel = () => {
      isScrollPausedRef.current = true
      if (userScrollTimeoutRef.current) clearTimeout(userScrollTimeoutRef.current)
      userScrollTimeoutRef.current = setTimeout(() => {
        isScrollPausedRef.current = false
      }, 3000)
    }

    const handleTouchStart = () => {
      isScrollPausedRef.current = true
      if (userScrollTimeoutRef.current) clearTimeout(userScrollTimeoutRef.current)
      userScrollTimeoutRef.current = setTimeout(() => {
        isScrollPausedRef.current = false
      }, 5000)
    }

    window.addEventListener('wheel', handleWheel, { passive: true })
    window.addEventListener('touchstart', handleTouchStart, { passive: true })

    return () => {
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('touchstart', handleTouchStart)
      if (userScrollTimeoutRef.current) clearTimeout(userScrollTimeoutRef.current)
    }
  }, [])

  // Slow auto-scroll function
  const startAutoScroll = useCallback(() => {
    if (autoScrollRef.current) return // Already scrolling

    const scrollSpeed = 0.4 // pixels per frame — very slow and gentle

    const scrollStep = () => {
      if (isScrollPausedRef.current) {
        autoScrollRef.current = requestAnimationFrame(scrollStep)
        return
      }

      // Check if all cards are complete — stop scrolling
      const allDone = completedRef.current.size >= WEDDING.timeline.length
      if (allDone) {
        if (autoScrollRef.current) {
          cancelAnimationFrame(autoScrollRef.current)
          autoScrollRef.current = null
        }
        return
      }

      // Check if the timeline section is still in view
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect()
        const sectionBottom = rect.bottom

        // Stop scrolling if we've passed the section
        if (sectionBottom < 100) {
          if (autoScrollRef.current) {
            cancelAnimationFrame(autoScrollRef.current)
            autoScrollRef.current = null
          }
          return
        }
      }

      window.scrollBy(0, scrollSpeed)
      autoScrollRef.current = requestAnimationFrame(scrollStep)
    }

    autoScrollRef.current = requestAnimationFrame(scrollStep)
  }, [])

  // Stop auto-scroll
  const stopAutoScroll = useCallback(() => {
    if (autoScrollRef.current) {
      cancelAnimationFrame(autoScrollRef.current)
      autoScrollRef.current = null
    }
  }, [])

  // Handle card completion — triggers next card
  const handleCardComplete = useCallback((index: number) => {
    completedRef.current.add(index)
    forceUpdate(n => n + 1)

    // If all cards are done, stop auto-scroll
    if (completedRef.current.size >= WEDDING.timeline.length) {
      stopAutoScroll()
    }
  }, [stopAutoScroll])

  // Handle card start — begin auto-scroll on first card
  const handleCardStart = useCallback((index: number) => {
    if (index === 0) {
      startAutoScroll()
    }
  }, [startAutoScroll])

  // Determine which card should be active
  // Card N is active if all cards before it are complete
  const getActiveCardIndex = useCallback((): number => {
    for (let i = 0; i < WEDDING.timeline.length; i++) {
      if (!completedRef.current.has(i)) return i
    }
    return WEDDING.timeline.length // All complete
  }, [])

  // Kick off the first card when section enters viewport
  useEffect(() => {
    const ctx = gsap.context(() => {
      fadeIn(sectionRef.current!, { y: 30 })
    })

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && completedRef.current.size === 0) {
            // Trigger first card
            forceUpdate(n => n + 1)
          }
        })
      },
      { threshold: 0.2 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      ctx.revert()
      observer.disconnect()
      stopAutoScroll()
    }
  }, [stopAutoScroll])

  const activeCardIndex = getActiveCardIndex()

  return (
    <section ref={sectionRef} className="py-20 px-6" style={{ background: 'var(--cream)', opacity: 0 }}>
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl mb-2" style={{ fontFamily: 'var(--font-script)', color: 'var(--gold-dark)' }}>
          Cerita Kami
        </h2>
        <div className="ornament-divider max-w-xs mx-auto mb-16">
          <span className="text-[var(--gold)] text-lg">&#10047;</span>
        </div>

        <div className="relative">
          {/* Center line */}
          <div className="timeline-line hidden sm:block" />

          {WEDDING.timeline.map((item, index) => {
            // Card is active if it's the next one to animate
            const isActive = index === activeCardIndex
            // Card is already done (animation complete)
            const isDone = completedRef.current.has(index)
            // Card should animate if it's active OR already done (to keep content visible)
            const shouldAnimate = isActive || isDone
            // Card should be visible (active or done)
            const shouldShow = isDone || isActive

            return (
              <div key={item.year} data-timeline-item data-index={index}
                style={{
                  opacity: shouldShow ? 1 : 0,
                  transition: 'opacity 0.8s ease',
                  pointerEvents: shouldShow ? 'auto' : 'none',
                  maxHeight: shouldShow ? '1000px' : '0px',
                  overflow: 'hidden',
                  marginBottom: shouldShow ? undefined : 0,
                }}
              >
                <TimelineStoryCard
                  item={item}
                  index={index}
                  shouldAnimate={shouldAnimate}
                  onStart={() => handleCardStart(index)}
                  onComplete={() => handleCardComplete(index)}
                />
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// Countdown Section with animated numbers
function CountdownSection() {
  const { days, hours, minutes, seconds } = useCountdown(WEDDING.akadDate)
  const sectionRef = useRef<HTMLDivElement>(null)
  const bgRef = useRef<HTMLDivElement>(null)
  const numbersRef = useRef<HTMLDivElement[]>([])
  const hasAnimated = useRef(false)

  useEffect(() => {
    const ctx = gsap.context(() => {
      fadeIn(sectionRef.current!, { y: 30 })

      // Parallax on background
      if (bgRef.current) {
        parallaxScroll(bgRef.current, { speed: 0.15 })
      }

      // Animate each countdown number with a scale + counter effect on first view
      numbersRef.current.forEach((el, i) => {
        if (!el) return
        scaleIn(el, {
          delay: i * 0.15,
          fromScale: 0.5,
          scrollTrigger: {
            trigger: sectionRef.current!,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        })
      })
    })

    return () => ctx.revert()
  }, [])

  // GSAP animation on number changes
  useEffect(() => {
    if (!hasAnimated.current && days > 0) {
      hasAnimated.current = true
    }

    if (hasAnimated.current) {
      numbersRef.current.forEach((el) => {
        if (!el) return
        gsap.fromTo(
          el.querySelector('.countdown-number'),
          { scale: 1.2, opacity: 0.7 },
          { scale: 1, opacity: 1, duration: 0.3, ease: 'power2.out' }
        )
      })
    }
  }, [days, hours, minutes, seconds])

  const countdownItems = [
    { label: 'Hari', value: days },
    { label: 'Jam', value: hours },
    { label: 'Menit', value: minutes },
    { label: 'Detik', value: seconds },
  ]

  return (
    <section
      ref={sectionRef}
      className="relative py-24 px-6 text-center overflow-hidden"
      style={{ opacity: 0 }}
    >
      <div
        ref={bgRef}
        className="absolute inset-[-20%] bg-cover bg-center"
        style={{ backgroundImage: "url('/images/countdown-bg.jpg')" }}
      />
      <div className="absolute inset-0 bg-[var(--brown)]/75" />
      <div className="relative z-10 max-w-3xl mx-auto">
        <h2 className="text-3xl sm:text-4xl mb-2" style={{ fontFamily: 'var(--font-script)', color: 'var(--gold-light)' }}>
          Hitung Mundur
        </h2>
        <div className="ornament-divider max-w-xs mx-auto mb-12">
          <span className="text-[var(--gold)] text-lg">&#10047;</span>
        </div>

        <div className="flex justify-center gap-4 sm:gap-8">
          {countdownItems.map((item, i) => (
            <div
              key={item.label}
              ref={(el) => { if (el) numbersRef.current[i] = el }}
              className="text-center"
              style={{ opacity: 0 }}
            >
              <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-lg border-2 border-[var(--gold)] flex items-center justify-center mb-2 mx-auto"
                style={{ background: 'rgba(201, 169, 110, 0.1)' }}>
                <span className="countdown-number text-2xl sm:text-4xl font-light" style={{ fontFamily: 'var(--font-serif)', color: 'var(--gold-light)' }}>
                  {String(item.value).padStart(2, '0')}
                </span>
              </div>
              <span className="text-xs sm:text-sm tracking-wider uppercase" style={{ fontFamily: 'var(--font-body)', color: 'var(--gold-light)]' }}>
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Event Detail Section with flip-in cards
function EventSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<HTMLDivElement[]>([])
  const addressRef = useRef<HTMLDivElement>(null)
  const mapBtnRef = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      fadeIn(sectionRef.current!, { y: 30 })

      cardRefs.current.forEach((card, i) => {
        if (!card) return
        flipIn(card, {
          delay: i * 0.2,
          scrollTrigger: {
            trigger: sectionRef.current!,
            start: 'top 75%',
            toggleActions: 'play none none none',
          },
        })
      })

      fadeIn(addressRef.current!, { delay: 0.5, y: 20 })

      if (mapBtnRef.current) {
        const cleanup = magneticHover(mapBtnRef.current, 0.15)
        return () => { cleanup?.() }
      }
    })

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="py-20 px-6" style={{ background: 'var(--cream-dark)', opacity: 0 }}>
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl mb-2" style={{ fontFamily: 'var(--font-script)', color: 'var(--gold-dark)' }}>
          Resepsi Pernikahan
        </h2>
        <div className="ornament-divider max-w-xs mx-auto mb-12">
          <span className="text-[var(--gold)] text-lg">&#10047;</span>
        </div>

        <div className="flex flex-col md:flex-row gap-8 justify-center">
          {/* Akad */}
          <div
            ref={(el) => { if (el) cardRefs.current[0] = el }}
            className="flex-1 max-w-sm mx-auto bg-white/80 backdrop-blur-sm rounded-lg p-8 shadow-md border border-[var(--gold)]/20"
            style={{ opacity: 0, perspective: '800px' }}
          >
            <h3 className="text-2xl sm:text-3xl mb-4" style={{ fontFamily: 'var(--font-script)', color: 'var(--gold-dark)' }}>
              Akad Nikah
            </h3>
            <div className="space-y-3" style={{ fontFamily: 'var(--font-serif)', color: 'var(--brown-light)' }}>
              <div className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5" style={{ color: 'var(--gold)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-base">Minggu, 5 Juli 2026</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5" style={{ color: 'var(--gold)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-base">Pukul 10.00 WIB</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5" style={{ color: 'var(--gold)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-base">{WEDDING.venue}</span>
              </div>
            </div>
          </div>

          {/* Resepsi */}
          <div
            ref={(el) => { if (el) cardRefs.current[1] = el }}
            className="flex-1 max-w-sm mx-auto bg-white/80 backdrop-blur-sm rounded-lg p-8 shadow-md border border-[var(--gold)]/20"
            style={{ opacity: 0, perspective: '800px' }}
          >
            <h3 className="text-2xl sm:text-3xl mb-4" style={{ fontFamily: 'var(--font-script)', color: 'var(--gold-dark)' }}>
              Resepsi
            </h3>
            <div className="space-y-3" style={{ fontFamily: 'var(--font-serif)', color: 'var(--brown-light)' }}>
              <div className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5" style={{ color: 'var(--gold)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-base">Minggu, 5 Juli 2026</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5" style={{ color: 'var(--gold)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-base">Pukul 11.00 - 17.00 WIB</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5" style={{ color: 'var(--gold)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-base">{WEDDING.venue}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Address */}
        <div ref={addressRef} className="mt-8 max-w-lg mx-auto bg-white/60 backdrop-blur-sm rounded-lg p-6 border border-[var(--gold)]/20" style={{ opacity: 0 }}>
          <p className="text-sm leading-relaxed" style={{ fontFamily: 'var(--font-serif)', color: 'var(--brown-light)' }}>
            {WEDDING.address}
          </p>
          <a
            ref={mapBtnRef}
            href="https://maps.google.com/?q=Villa+Mutiara+Bogor+2+Blok+C2+No.36+Bojonggede+Bogor"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-4 px-6 py-2 border-2 border-[var(--gold)] text-[var(--brown)] text-sm tracking-wider uppercase
              hover:bg-[var(--gold)] hover:text-white transition-all duration-300"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            </svg>
            Lihat Peta
          </a>
        </div>
      </div>
    </section>
  )
}

// Gallery Section with cascade stagger and enhanced lightbox
function GallerySection() {
  const [lightbox, setLightbox] = useState<number | null>(null)
  const [slideshow, setSlideshow] = useState(false)
  const [imageKey, setImageKey] = useState(0)
  const sectionRef = useRef<HTMLDivElement>(null)
  const imagesRef = useRef<HTMLDivElement[]>([])
  const touchStartRef = useRef<number | null>(null)
  const totalImages = WEDDING.galleryImages.length

  useEffect(() => {
    const ctx = gsap.context(() => {
      fadeIn(sectionRef.current!, { y: 30 })

      // Stagger reveal for gallery images
      const validImages = imagesRef.current.filter(Boolean)
      staggerReveal(validImages, {
        y: 40,
        stagger: 0.08,
        scrollTrigger: {
          trigger: sectionRef.current!,
          start: 'top 75%',
          toggleActions: 'play none none none',
        },
      })
    })

    return () => ctx.revert()
  }, [])

  // Slideshow auto-advance
  useEffect(() => {
    if (!slideshow || lightbox === null) return
    const timer = setInterval(() => {
      setLightbox(prev => prev !== null ? (prev + 1) % totalImages : null)
      setImageKey(k => k + 1)
    }, 3000)
    return () => clearInterval(timer)
  }, [slideshow, lightbox, totalImages])

  // Keyboard navigation
  useEffect(() => {
    if (lightbox === null) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        setLightbox(prev => prev !== null ? Math.max(0, prev - 1) : null)
        setImageKey(k => k + 1)
      } else if (e.key === 'ArrowRight') {
        setLightbox(prev => prev !== null ? Math.min(totalImages - 1, prev + 1) : null)
        setImageKey(k => k + 1)
      } else if (e.key === 'Escape') {
        setLightbox(null)
        setSlideshow(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [lightbox, totalImages])

  // Touch/swipe handling
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartRef.current === null || lightbox === null) return
    const diff = touchStartRef.current - e.changedTouches[0].clientX
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        setLightbox(prev => prev !== null ? Math.min(totalImages - 1, prev + 1) : null)
      } else {
        setLightbox(prev => prev !== null ? Math.max(0, prev - 1) : null)
      }
      setImageKey(k => k + 1)
    }
    touchStartRef.current = null
  }

  const openLightbox = (index: number) => {
    setLightbox(index)
    setSlideshow(false)
    setImageKey(k => k + 1)
  }

  const closeLightbox = () => {
    setLightbox(null)
    setSlideshow(false)
  }

  const goToPrev = () => {
    setLightbox(prev => prev !== null ? Math.max(0, prev - 1) : null)
    setImageKey(k => k + 1)
  }

  const goToNext = () => {
    setLightbox(prev => prev !== null ? Math.min(totalImages - 1, prev + 1) : null)
    setImageKey(k => k + 1)
  }

  return (
    <section ref={sectionRef} className="py-20 px-6" style={{ background: 'var(--cream)', opacity: 0 }}>
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl mb-2" style={{ fontFamily: 'var(--font-script)', color: 'var(--gold-dark)' }}>
          Galeri
        </h2>
        <div className="ornament-divider max-w-xs mx-auto mb-12">
          <span className="text-[var(--gold)] text-lg">&#10047;</span>
        </div>

        <div className="gallery-grid">
          {WEDDING.galleryImages.map((src, index) => (
            <div
              key={index}
              ref={(el) => { if (el) imagesRef.current[index] = el }}
              className="relative aspect-square overflow-hidden rounded-lg cursor-pointer group border border-[var(--gold)]/20"
              onClick={() => openLightbox(index)}
              style={{ opacity: 0 }}
            >
              <img
                src={src}
                alt={`Gallery ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-[var(--brown)]/0 group-hover:bg-[var(--brown)]/30 transition-all duration-300 flex items-center justify-center">
                <svg className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Enhanced Lightbox */}
      <div
        className={`lightbox-overlay ${lightbox !== null ? 'active' : ''}`}
        onClick={closeLightbox}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {lightbox !== null && (
          <div className="relative max-w-4xl max-h-[90vh] px-4 w-full flex flex-col items-center">
            {/* Close button */}
            <button
              onClick={closeLightbox}
              className="absolute -top-1 right-2 sm:right-4 w-10 h-10 rounded-full bg-white/90 text-[var(--brown)] flex items-center justify-center
                hover:bg-white hover:scale-110 transition-all duration-200 cursor-pointer z-20"
            >
              ✕
            </button>

            {/* Image counter */}
            <div className="mb-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm z-10">
              {lightbox + 1} / {totalImages}
            </div>

            {/* Main image with transition */}
            <div className="relative flex-1 flex items-center justify-center w-full">
              <img
                key={imageKey}
                src={WEDDING.galleryImages[lightbox]}
                alt={`Gallery ${lightbox + 1}`}
                className="lightbox-image-enter max-w-full max-h-[70vh] sm:max-h-[75vh] object-contain rounded-lg"
                onClick={(e) => e.stopPropagation()}
              />

              {/* Previous arrow */}
              <button
                onClick={(e) => { e.stopPropagation(); goToPrev() }}
                className={`absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full
                  bg-white/80 backdrop-blur-sm text-[var(--brown)] flex items-center justify-center
                  hover:bg-white hover:scale-110 transition-all duration-200 cursor-pointer
                  ${lightbox === 0 ? 'opacity-30 pointer-events-none' : 'opacity-90'}`}
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {/* Next arrow */}
              <button
                onClick={(e) => { e.stopPropagation(); goToNext() }}
                className={`absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full
                  bg-white/80 backdrop-blur-sm text-[var(--brown)] flex items-center justify-center
                  hover:bg-white hover:scale-110 transition-all duration-200 cursor-pointer
                  ${lightbox === totalImages - 1 ? 'opacity-30 pointer-events-none' : 'opacity-90'}`}
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Controls bar */}
            <div className="flex items-center justify-center gap-4 mt-4">
              <button
                onClick={(e) => { e.stopPropagation(); goToPrev() }}
                className="px-4 py-2 bg-white/80 backdrop-blur-sm rounded-lg text-[var(--brown)] text-sm
                  hover:bg-white transition-colors cursor-pointer"
              >
                ← Prev
              </button>

              {/* Slideshow toggle */}
              <button
                onClick={(e) => { e.stopPropagation(); setSlideshow(!slideshow) }}
                className={`px-4 py-2 rounded-lg text-sm cursor-pointer transition-all duration-300 ${
                  slideshow
                    ? 'bg-[var(--gold)] text-white'
                    : 'bg-white/80 backdrop-blur-sm text-[var(--brown)] hover:bg-white'
                }`}
              >
                {slideshow ? '⏸ Stop' : '▶ Slideshow'}
              </button>

              <button
                onClick={(e) => { e.stopPropagation(); goToNext() }}
                className="px-4 py-2 bg-white/80 backdrop-blur-sm rounded-lg text-[var(--brown)] text-sm
                  hover:bg-white transition-colors cursor-pointer"
              >
                Next →
              </button>
            </div>

            {/* Swipe hint for mobile */}
            <p className="text-white/40 text-xs mt-2 sm:hidden">← Swipe untuk navigasi →</p>
          </div>
        )}
      </div>
    </section>
  )
}

// RSVP Section
function RSVPSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const [formData, setFormData] = useState({ name: '', attendance: '', guests: '1', message: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  useEffect(() => {
    const ctx = gsap.context(() => {
      fadeIn(sectionRef.current!, { y: 30 })
      fadeIn(formRef.current!, { delay: 0.3, y: 20 })
    })

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="py-20 px-6" style={{ background: 'var(--cream-dark)', opacity: 0 }}>
      <div className="max-w-lg mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl mb-2" style={{ fontFamily: 'var(--font-script)', color: 'var(--gold-dark)' }}>
          Konfirmasi Kehadiran
        </h2>
        <div className="ornament-divider max-w-xs mx-auto mb-4">
          <span className="text-[var(--gold)] text-lg">&#10047;</span>
        </div>
        <p className="text-sm mb-8" style={{ fontFamily: 'var(--font-serif)', color: 'var(--brown-light)' }}>
          Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu kepada kami.
        </p>

        {submitted ? (
          <div ref={formRef} className="bg-white/80 rounded-lg p-8 border border-[var(--gold)]/20">
            <div className="text-4xl mb-4">&#10084;</div>
            <h3 className="text-2xl mb-2" style={{ fontFamily: 'var(--font-script)', color: 'var(--gold-dark)' }}>
              Terima Kasih!
            </h3>
            <p style={{ fontFamily: 'var(--font-serif)', color: 'var(--brown-light)' }}>
              Konfirmasi kehadiran Anda telah kami terima. Sampai jumpa di hari bahagia kami!
            </p>
          </div>
        ) : (
          <form ref={formRef} onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-sm rounded-lg p-8 shadow-md border border-[var(--gold)]/20 text-left" style={{ opacity: 0 }}>
            <div className="mb-4">
              <label className="block text-sm mb-1 font-medium" style={{ fontFamily: 'var(--font-body)', color: 'var(--brown)' }}>
                Nama
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-[var(--gold)]/30 rounded-lg focus:border-[var(--gold)] focus:outline-none transition-colors"
                style={{ background: 'var(--cream)' }}
                placeholder="Masukkan nama Anda"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm mb-1 font-medium" style={{ fontFamily: 'var(--font-body)', color: 'var(--brown)' }}>
                Konfirmasi Kehadiran
              </label>
              <select
                required
                value={formData.attendance}
                onChange={(e) => setFormData({ ...formData, attendance: e.target.value })}
                className="w-full px-4 py-2 border border-[var(--gold)]/30 rounded-lg focus:border-[var(--gold)] focus:outline-none transition-colors"
                style={{ background: 'var(--cream)' }}
              >
                <option value="">Pilih konfirmasi</option>
                <option value="hadir">Hadir</option>
                <option value="tidak">Tidak Hadir</option>
                <option value="ragu">Masih Ragu</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm mb-1 font-medium" style={{ fontFamily: 'var(--font-body)', color: 'var(--brown)' }}>
                Jumlah Tamu
              </label>
              <select
                value={formData.guests}
                onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                className="w-full px-4 py-2 border border-[var(--gold)]/30 rounded-lg focus:border-[var(--gold)] focus:outline-none transition-colors"
                style={{ background: 'var(--cream)' }}
              >
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>{n} orang</option>
                ))}
              </select>
            </div>
            <div className="mb-6">
              <label className="block text-sm mb-1 font-medium" style={{ fontFamily: 'var(--font-body)', color: 'var(--brown)' }}>
                Ucapan & Doa
              </label>
              <textarea
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-4 py-2 border border-[var(--gold)]/30 rounded-lg focus:border-[var(--gold)] focus:outline-none transition-colors resize-none"
                style={{ background: 'var(--cream)' }}
                placeholder="Tuliskan ucapan dan doa Anda untuk kedua mempelai..."
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 border-2 border-[var(--gold)] text-[var(--brown)] tracking-[0.15em] uppercase text-sm
                hover:bg-[var(--gold)] hover:text-white transition-all duration-300 cursor-pointer"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              Kirim Konfirmasi
            </button>
          </form>
        )}
      </div>
    </section>
  )
}

// Gift Section
function GiftSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [showBank, setShowBank] = useState<string | null>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      fadeIn(sectionRef.current!, { y: 30 })
    })

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="py-20 px-6" style={{ background: 'var(--cream)', opacity: 0 }}>
      <div className="max-w-lg mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl mb-2" style={{ fontFamily: 'var(--font-script)', color: 'var(--gold-dark)' }}>
          Amplop Digital
        </h2>
        <div className="ornament-divider max-w-xs mx-auto mb-4">
          <span className="text-[var(--gold)] text-lg">&#10047;</span>
        </div>
        <p className="text-sm mb-8" style={{ fontFamily: 'var(--font-serif)', color: 'var(--brown-light)' }}>
          Doa restu Anda merupakan karunia yang sangat berarti bagi kami. Namun jika Anda ingin memberikan tanda kasih, kami menyediakan amplop digital.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => setShowBank(showBank === 'groom' ? null : 'groom')}
            className="flex-1 px-6 py-4 border-2 border-[var(--gold)] rounded-lg hover:bg-[var(--gold)] hover:text-white transition-all duration-300 cursor-pointer"
            style={{ fontFamily: 'var(--font-body)', color: showBank === 'groom' ? 'white' : 'var(--brown)', background: showBank === 'groom' ? 'var(--gold)' : 'transparent' }}
          >
            <span className="text-xs tracking-widest uppercase block mb-1">Amplop untuk</span>
            <span className="text-lg" style={{ fontFamily: 'var(--font-script)' }}>{WEDDING.groom.split(' ')[0]}</span>
          </button>
          <button
            onClick={() => setShowBank(showBank === 'bride' ? null : 'bride')}
            className="flex-1 px-6 py-4 border-2 border-[var(--gold)] rounded-lg hover:bg-[var(--gold)] hover:text-white transition-all duration-300 cursor-pointer"
            style={{ fontFamily: 'var(--font-body)', color: showBank === 'bride' ? 'white' : 'var(--brown)', background: showBank === 'bride' ? 'var(--gold)' : 'transparent' }}
          >
            <span className="text-xs tracking-widest uppercase block mb-1">Amplop untuk</span>
            <span className="text-lg" style={{ fontFamily: 'var(--font-script)' }}>{WEDDING.bride.split(' ')[0]}</span>
          </button>
        </div>

        {showBank && (
          <div className="mt-6 bg-white/80 rounded-lg p-6 border border-[var(--gold)]/20 animate-fade-in-up">
            <p className="text-xs tracking-widest uppercase mb-3" style={{ fontFamily: 'var(--font-body)', color: 'var(--brown-light)' }}>
              Rekening {showBank === 'groom' ? WEDDING.groom.split(' ')[0] : WEDDING.bride.split(' ')[0]}
            </p>
            <div className="py-4 px-6 rounded-lg" style={{ background: 'var(--cream)' }}>
              <p className="text-sm mb-1" style={{ fontFamily: 'var(--font-body)', color: 'var(--brown-light)' }}>Bank Central Asia (BCA)</p>
              <p className="text-xl font-medium tracking-wider" style={{ fontFamily: 'var(--font-body)', color: 'var(--brown)' }}>
                {showBank === 'groom' ? '1234567890' : '0987654321'}
              </p>
              <p className="text-sm mt-1" style={{ fontFamily: 'var(--font-body)', color: 'var(--brown-light)' }}>
                a.n. {showBank === 'groom' ? WEDDING.groom : WEDDING.bride}
              </p>
            </div>
            <button
              onClick={() => {
                const number = showBank === 'groom' ? '1234567890' : '0987654321'
                navigator.clipboard.writeText(number)
              }}
              className="mt-3 px-4 py-1.5 text-xs tracking-wider uppercase border border-[var(--gold)] rounded hover:bg-[var(--gold)] hover:text-white transition-all duration-300 cursor-pointer"
              style={{ fontFamily: 'var(--font-body)', color: 'var(--brown)' }}
            >
              Salin Nomor Rekening
            </button>
          </div>
        )}
      </div>
    </section>
  )
}

// Footer Section
function FooterSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const bgRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (bgRef.current) {
        parallaxScroll(bgRef.current, { speed: 0.15 })
      }
      fadeIn(contentRef.current!, { y: 30 })
    })

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative py-20 px-6 text-center overflow-hidden"
    >
      <div
        ref={bgRef}
        className="absolute inset-[-20%] bg-cover bg-center"
        style={{ backgroundImage: "url('/images/footer-bg.jpg')" }}
      />
      <div className="absolute inset-0 bg-[var(--brown)]/80" />
      <div ref={contentRef} className="relative z-10 max-w-2xl mx-auto" style={{ opacity: 0 }}>
        <p className="text-sm tracking-[0.3em] uppercase mb-4" style={{ fontFamily: 'var(--font-body)', color: 'var(--gold-light)]' }}>
          Terima Kasih
        </p>
        <h2 className="text-4xl sm:text-5xl md:text-6xl mb-4" style={{ fontFamily: 'var(--font-script)', color: 'var(--gold-light)' }}>
          Irwan & Anira
        </h2>
        <div className="ornament-divider max-w-xs mx-auto mb-6">
          <span className="text-[var(--gold)] text-lg">&#10047;</span>
        </div>
        <p className="text-sm leading-relaxed" style={{ fontFamily: 'var(--font-serif)', color: 'var(--gold-light)]' }}>
          Atas kehadiran dan doa restu yang kalian berikan,<br />
          kami mengucapkan terima kasih.<br />
          Semoga Allah membalas kebaikan kalian.
        </p>
        <p className="mt-8 text-xs tracking-wider" style={{ fontFamily: 'var(--font-body)', color: 'rgba(201, 169, 110, 0.6)' }}>
          05 . 07 . 2026
        </p>
      </div>
    </section>
  )
}

// Music Player - using enhanced MusicPlayerComponent
// The MusicPlayerComponent is imported and used directly in the Home component

/* ===================== MAIN PAGE ===================== */
export default function Home() {
  const [isOpen, setIsOpen] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const mainContentRef = useRef<HTMLDivElement>(null)

  const handlePreloaderComplete = useCallback(() => {
    setIsLoading(false)
  }, [])

  const handleOpen = useCallback(() => {
    setIsOpen(true)
    // Auto play music
    if (audioRef.current) {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {})
    }
  }, [])

  const toggleMusic = useCallback(() => {
    if (!audioRef.current) return
    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {})
    }
  }, [isPlaying])

  // Hero section animation after opening
  const heroRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen || !heroRef.current) return

    const ctx = gsap.context(() => {
      // Animate hero content in
      const hero = heroRef.current!
      const children = hero.querySelectorAll('.hero-animate')

      gsap.fromTo(
        children,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
          delay: 0.3,
        }
      )

      // Parallax on hero background
      const heroBg = hero.querySelector('.hero-bg-parallax')
      if (heroBg) {
        parallaxScroll(heroBg, { speed: 0.2 })
      }
    })

    return () => ctx.revert()
  }, [isOpen])

  return (
    <main className="overflow-x-hidden" style={{ background: 'var(--cream)' }}>
      {/* Audio element */}
      <audio ref={audioRef} src="/music/gamelan-bg.mp3" loop preload="none" />

      {/* Preloader */}
      {isLoading && (
        <Preloader
          onComplete={handlePreloaderComplete}
          groomName={WEDDING.groom}
          brideName={WEDDING.bride}
        />
      )}

      {/* Cursor follower (desktop only) */}
      {!isLoading && <CursorFollower />}

      {/* Cover - always visible first - using enhanced envelope CoverSection */}
      {!isOpen && !isLoading && (
        <CoverSectionComponent onOpen={handleOpen} />
      )}

      {/* Main content after opening */}
      {isOpen && (
        <SmoothScroll>
          <JasmineParticles />

          {/* Hero with names */}
          <section ref={heroRef} className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
            <div
              className="hero-bg-parallax absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: "url('/images/hero-poster.jpg')" }}
            />
            <div className="hero-overlay absolute inset-0" />
            <div className="relative z-10 text-center px-6 py-20">
              <p className="hero-animate tracking-[0.3em] uppercase text-xs sm:text-sm mb-4" style={{ fontFamily: 'var(--font-body)', color: 'var(--gold-light)', opacity: 0 }}>
                The Wedding of
              </p>
              <h1 className="hero-animate text-5xl sm:text-7xl md:text-8xl mb-2" style={{ fontFamily: 'var(--font-script)', color: 'var(--gold-light)', opacity: 0 }}>
                Irwan & Anira
              </h1>
              <div className="ornament-divider hero-animate max-w-xs mx-auto my-4" style={{ opacity: 0 }}>
                <span className="text-[var(--gold)] text-lg">&#10047;</span>
              </div>
              <p className="hero-animate tracking-widest text-sm sm:text-base" style={{ fontFamily: 'var(--font-serif)', color: 'var(--cream)', opacity: 0 }}>
                05 . 07 . 2026
              </p>
            </div>
          </section>

          <div ref={mainContentRef}>
            <BismillahSection />
            <CoupleSection />
            <QuoteSection />
            <TimelineSection />
            <CountdownSection />
            <EventSection />
            <GallerySection />
            <RSVPSection />
            <GuestWishes />
            <GiftSection />
            <FooterSection />
          </div>

          {/* Enhanced Music player with vinyl and visualizer */}
          <MusicPlayerComponent isPlaying={isPlaying} onToggle={toggleMusic} audioRef={audioRef} />

          {/* Scroll to top button */}
          <ScrollToTop />
        </SmoothScroll>
      )}
    </main>
  )
}
