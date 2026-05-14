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
import { fadeIn, slideIn, scaleIn, initCursorFollower, prefersReducedMotion } from '@/lib/animations'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

/* ═══════════════════════════════════════════════════════════
   WEDDING DATA
   ═══════════════════════════════════════════════════════════ */
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
        'Percayalah, bukan karena bertemu lalu berjodoh, tapi karena berjodohlah kami dipertemukan. Atas izin Allah kami memutuskan untuk mengikrarkan janji suci pernikahan pada 05 Juli 2026.',
    },
  ],
  galleryImages: [
    '/images/gallery-1.jpg', '/images/gallery-2.jpg', '/images/gallery-3.jpg',
    '/images/gallery-4.jpg', '/images/gallery-5.jpg', '/images/gallery-6.jpg',
    '/images/gallery-7.jpg', '/images/gallery-8.jpg', '/images/gallery-9.jpg',
    '/images/gallery-10.jpg', '/images/gallery-11.jpg',
  ],
  galleryCaptions: [
    'Pertama kali', 'Bersama', 'Kenangan', 'Tawa', 'Bahagia',
    'Cinta', 'Semesta', 'Harapan', 'Janji', 'Selamanya', 'Kita',
  ],
}

/* ═══════════════════════════════════════════════════════════
   COUNTDOWN HOOK
   ═══════════════════════════════════════════════════════════ */
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

/* ═══════════════════════════════════════════════════════════
   HANDWRITING REVEAL — shared utility
   Ink flowing onto paper, character by character
   FIXED: Faster stagger 0.022, charDuration 0.08
   ═══════════════════════════════════════════════════════════ */
function handwritingReveal(
  el: HTMLDivElement,
  stagger: number = 0.022,
  charDuration: number = 0.08,
  delay: number = 0,
) {
  if (!el) return
  const fullText = el.textContent || ''
  el.innerHTML = ''

  const allChars: HTMLSpanElement[] = []
  const words = fullText.split(' ')
  words.forEach((word, wi) => {
    const ws = document.createElement('span')
    ws.style.cssText = 'white-space:nowrap;display:inline;'
    for (let j = 0; j < word.length; j++) {
      const cs = document.createElement('span')
      cs.className = 'hw-char'
      cs.style.cssText = 'display:inline-block;will-change:opacity,transform;opacity:0;transform:translateY(3px) rotate(-2deg);min-width:0.08em;'
      cs.textContent = word[j]
      ws.appendChild(cs)
      allChars.push(cs)
    }
    el.appendChild(ws)
    if (wi < words.length - 1) {
      const sp = document.createElement('span')
      sp.innerHTML = '\u00A0'
      sp.style.display = 'inline'
      el.appendChild(sp)
    }
  })

  gsap.to(allChars, {
    opacity: 1,
    y: 0,
    rotation: 0,
    duration: charDuration,
    stagger,
    ease: 'power2.out',
    delay,
  })
}

/* ═══════════════════════════════════════════════════════════
   1. CURSOR FOLLOWER — Gold dot, desktop only, barely there
   ═══════════════════════════════════════════════════════════ */
function CursorFollower() {
  const cursorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!cursorRef.current) return
    const cleanup = initCursorFollower(cursorRef.current)
    return () => { cleanup?.() }
  }, [])

  if (typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0)) return null

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 w-2.5 h-2.5 rounded-full pointer-events-none z-[9998] hidden sm:block"
      style={{
        background: 'var(--gold)',
        opacity: 0.3,
        mixBlendMode: 'difference',
        willChange: 'transform',
      }}
      aria-hidden="true"
    />
  )
}

/* ═══════════════════════════════════════════════════════════
   2. BISMILLAH — Sacred, still, reverent
   The opening of every good thing
   Cinema dark atmosphere, more moody
   ═══════════════════════════════════════════════════════════ */
function BismillahSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const arabicRef = useRef<HTMLDivElement>(null)
  const quoteRef = useRef<HTMLParagraphElement>(null)
  const sourceRef = useRef<HTMLParagraphElement>(null)
  const hasAnimated = useRef(false)

  function typewriterReveal(quoteEl: HTMLParagraphElement, sourceEl: HTMLParagraphElement) {
    if (!quoteEl) return

    const fullText = quoteEl.textContent || ''
    quoteEl.innerHTML = ''

    const cursor = document.createElement('span')
    cursor.className = 'typewriter-cursor'
    cursor.textContent = '|'
    cursor.style.cssText = `
      display: inline-block;
      animation: typewriterBlink 0.7s step-end infinite;
      color: var(--gold);
      font-weight: 300;
      margin-left: 1px;
    `

    const charSpans: HTMLSpanElement[] = []
    for (let i = 0; i < fullText.length; i++) {
      const span = document.createElement('span')
      span.textContent = fullText[i]
      span.style.opacity = '0'
      span.style.display = 'inline'
      quoteEl.appendChild(span)
      charSpans.push(span)
    }
    quoteEl.appendChild(cursor)

    const tl = gsap.timeline()

    tl.to(charSpans, {
      opacity: 1,
      duration: 0.01,
      stagger: 0.04,
      ease: 'none',
      onStart: () => {
        if (sourceEl) {
          gsap.set(sourceEl, { opacity: 0, y: 10 })
        }
      },
    })

    tl.to(cursor, {
      opacity: 0,
      duration: 0.3,
      onComplete: () => cursor.remove(),
    }, '+=0.3')

    if (sourceEl) {
      tl.to(sourceEl, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
      }, '-=0.1')
    }
  }

  useEffect(() => {
    const ctx = gsap.context(() => {
      fadeIn(sectionRef.current!, { duration: 1.2, y: 20 })

      if (arabicRef.current) {
        gsap.fromTo(arabicRef.current,
          { opacity: 0, scale: 0.9, filter: 'blur(6px)' },
          {
            opacity: 1,
            scale: 1,
            filter: 'blur(0px)',
            duration: 2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current!,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        )
      }

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && !hasAnimated.current) {
              hasAnimated.current = true
              typewriterReveal(quoteRef.current!, sourceRef.current!)
            }
          })
        },
        { threshold: 0.3 }
      )

      if (sectionRef.current) {
        observer.observe(sectionRef.current)
      }

      return () => observer.disconnect()
    })

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="cinema-dark-section cinema-vignette cinema-bloom cinema-dust py-28 px-6 text-center relative overflow-hidden" style={{ opacity: 0 }}>
      {/* Soft golden light spots */}
      <div className="gold-light-leak absolute inset-0 pointer-events-none" />
      <div className="max-w-2xl mx-auto relative z-10">
        <p
          ref={arabicRef}
          className="text-3xl sm:text-4xl md:text-5xl mb-8 leading-relaxed"
          style={{ fontFamily: 'var(--font-arabic)', color: 'var(--gold-light)', opacity: 0 }}
        >
          بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
        </p>
        <p
          ref={quoteRef}
          className="text-base sm:text-lg italic leading-relaxed min-h-[5em]"
          style={{ fontFamily: 'var(--font-serif)', color: 'var(--cream)' }}
        >
          &ldquo;Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu pasangan hidup dari jenismu sendiri, supaya kamu merasa tenteram kepadanya, dan dijadikan-Nya di antaramu rasa kasih dan sayang.&rdquo;
        </p>
        <p
          ref={sourceRef}
          className="mt-6 text-sm"
          style={{ fontFamily: 'var(--font-serif)', color: 'var(--gold)', opacity: 0 }}
        >
          — QS. Ar-Rum: 21
        </p>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════
   3. COUPLE — Intimate, close
   Two souls becoming one story
   ADDED: Cinematic blur-to-clear photo animations
   ADDED: Dark moody background with vignette
   ═══════════════════════════════════════════════════════════ */
function CoupleSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const groomRef = useRef<HTMLDivElement>(null)
  const brideRef = useRef<HTMLDivElement>(null)
  const heartRef = useRef<HTMLDivElement>(null)
  const groomNameRef = useRef<HTMLHeadingElement>(null)
  const brideNameRef = useRef<HTMLHeadingElement>(null)
  const groomParentsRef = useRef<HTMLParagraphElement>(null)
  const brideParentsRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Section fade
      gsap.fromTo(sectionRef.current!,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 1.5,
          scrollTrigger: {
            trigger: sectionRef.current!,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      )

      // Groom photo — cinematic reveal with blur
      if (groomRef.current) {
        gsap.fromTo(groomRef.current,
          { opacity: 0, y: 30, scale: 0.85, filter: 'blur(8px)' },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            filter: 'blur(0px)',
            duration: 1.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current!,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        )
      }

      // Bride photo — cinematic reveal with blur, slight delay
      if (brideRef.current) {
        gsap.fromTo(brideRef.current,
          { opacity: 0, y: 30, scale: 0.85, filter: 'blur(8px)' },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            filter: 'blur(0px)',
            duration: 1.8,
            delay: 0.3,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current!,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        )
      }

      // Groom name — fade in from below after photo
      if (groomNameRef.current) {
        gsap.fromTo(groomNameRef.current,
          { opacity: 0, y: 15 },
          {
            opacity: 1,
            y: 0,
            duration: 1.2,
            delay: 0.6,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current!,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        )
      }

      // Bride name — fade in from below after photo
      if (brideNameRef.current) {
        gsap.fromTo(brideNameRef.current,
          { opacity: 0, y: 15 },
          {
            opacity: 1,
            y: 0,
            duration: 1.2,
            delay: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current!,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        )
      }

      // Heart — gentle reveal after both names
      if (heartRef.current) {
        gsap.fromTo(heartRef.current,
          { opacity: 0, scale: 0.5 },
          {
            opacity: 1,
            scale: 1,
            duration: 1.2,
            delay: 0.6,
            ease: 'back.out(2)',
            scrollTrigger: {
              trigger: sectionRef.current!,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        )
      }

      // Parents text — gentle fade-in
      if (groomParentsRef.current) {
        gsap.fromTo(groomParentsRef.current,
          { opacity: 0, y: 8 },
          {
            opacity: 0.8,
            y: 0,
            duration: 1,
            delay: 1.2,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: sectionRef.current!,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        )
      }

      if (brideParentsRef.current) {
        gsap.fromTo(brideParentsRef.current,
          { opacity: 0, y: 8 },
          {
            opacity: 0.8,
            y: 0,
            duration: 1,
            delay: 1.2,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: sectionRef.current!,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        )
      }
    })

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="cinema-dark-section cinema-vignette cinema-bloom cinema-dust py-28 px-6 relative overflow-hidden" style={{ opacity: 0 }}>
      {/* Soft golden light spots */}
      <div className="gold-light-leak absolute inset-0 pointer-events-none" />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <h2 className="text-3xl sm:text-4xl mb-2" style={{ fontFamily: 'var(--font-script)', color: 'var(--gold-light)' }}>
          Mempelai
        </h2>
        <p className="text-sm italic mb-10" style={{ fontFamily: 'var(--font-serif)', color: 'var(--cream)', opacity: 0.6 }}>Dua jiwa, satu kisah</p>
        <div className="ornament-divider max-w-xs mx-auto mb-14">
          <span className="text-[var(--gold)] text-lg">&#10047;</span>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-20">
          {/* Groom */}
          <div ref={groomRef} className="text-center" style={{ opacity: 0 }}>
            <div className="couple-photo-frame w-36 h-36 sm:w-44 sm:h-44 rounded-full overflow-hidden mx-auto mb-6 border-2 border-[var(--gold)] shadow-lg">
              <img src="/images/groom.jpg" alt={WEDDING.groom} className="w-full h-full object-cover" />
            </div>
            <h3 ref={groomNameRef} className="text-3xl sm:text-4xl mb-2" style={{ fontFamily: 'var(--font-script)', color: 'var(--gold-light)', opacity: 0 }}>
              {WEDDING.groom}
            </h3>
            <div className="ornament-divider max-w-[120px] mx-auto mb-3">
              <span className="text-[var(--gold)] text-xs">&#10047;</span>
            </div>
            <p ref={groomParentsRef} className="text-sm italic" style={{ fontFamily: 'var(--font-serif)', color: 'var(--cream)', opacity: 0 }}>
              Putra dari<br />
              <span className="not-italic font-medium" style={{ color: 'var(--cream)' }}>{WEDDING.groomParents}</span>
            </p>
          </div>

          {/* Heart Divider — gentle float, no heartbeat */}
          <div
            ref={heartRef}
            className="text-3xl sm:text-4xl animate-float"
            style={{ color: 'var(--gold)', opacity: 0 }}
          >
            &#10084;
          </div>

          {/* Bride */}
          <div ref={brideRef} className="text-center" style={{ opacity: 0 }}>
            <div className="couple-photo-frame w-36 h-36 sm:w-44 sm:h-44 rounded-full overflow-hidden mx-auto mb-6 border-2 border-[var(--gold)] shadow-lg">
              <img src="/images/bride.jpg" alt={WEDDING.bride} className="w-full h-full object-cover" />
            </div>
            <h3 ref={brideNameRef} className="text-3xl sm:text-4xl mb-2" style={{ fontFamily: 'var(--font-script)', color: 'var(--gold-light)', opacity: 0 }}>
              {WEDDING.bride}
            </h3>
            <div className="ornament-divider max-w-[120px] mx-auto mb-3">
              <span className="text-[var(--gold)] text-xs">&#10047;</span>
            </div>
            <p ref={brideParentsRef} className="text-sm italic" style={{ fontFamily: 'var(--font-serif)', color: 'var(--cream)', opacity: 0 }}>
              Putri dari<br />
              <span className="not-italic font-medium" style={{ color: 'var(--cream)' }}>{WEDDING.brideParents}</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════
   4. DIARY INTRO — Opening the diary
   Like reading someone's journal for the first time
   FIXED: Faster handwriting stagger 0.022, charDuration 0.08
   ═══════════════════════════════════════════════════════════ */
function DiaryIntroSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const topStrokeRef = useRef<HTMLDivElement>(null)
  const bottomStrokeRef = useRef<HTMLDivElement>(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    const ctx = gsap.context(() => {
      fadeIn(sectionRef.current!, { duration: 1.2, y: 20 })

      // Ink stroke draw-in — top
      if (topStrokeRef.current) {
        const svgPath = topStrokeRef.current.querySelector('path') as SVGPathElement | null
        if (svgPath) {
          try {
            const len = svgPath.getTotalLength()
            svgPath.style.strokeDasharray = String(len)
            svgPath.style.strokeDashoffset = String(len)
            gsap.to(svgPath, {
              strokeDashoffset: 0,
              duration: 2.5,
              ease: 'power2.inOut',
              scrollTrigger: {
                trigger: sectionRef.current!,
                start: 'top 85%',
                toggleActions: 'play none none none',
              },
            })
          } catch (_e) { /* fallback */ }
        }
      }

      // Ink stroke draw-in — bottom
      if (bottomStrokeRef.current) {
        const svgPath = bottomStrokeRef.current.querySelector('path') as SVGPathElement | null
        if (svgPath) {
          try {
            const len = svgPath.getTotalLength()
            svgPath.style.strokeDasharray = String(len)
            svgPath.style.strokeDashoffset = String(len)
            gsap.to(svgPath, {
              strokeDashoffset: 0,
              duration: 2.5,
              ease: 'power2.inOut',
              delay: 0.5,
              scrollTrigger: {
                trigger: sectionRef.current!,
                start: 'top 85%',
                toggleActions: 'play none none none',
              },
            })
          } catch (_e) { /* fallback */ }
        }
      }

      // Handwriting reveal — FIXED: faster speed
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && !hasAnimated.current) {
              hasAnimated.current = true
              handwritingReveal(textRef.current!, 0.022, 0.08)
            }
          })
        },
        { threshold: 0.3 }
      )

      if (sectionRef.current) {
        observer.observe(sectionRef.current)
      }

      return () => observer.disconnect()
    })

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="diary-paper-bg diary-lines diary-margin cinema-depth py-28 px-6 text-center relative overflow-hidden"
      style={{ opacity: 0 }}
    >
      {/* Diary entry date — top left like a journal */}
      <div className="max-w-xl mx-auto relative">
        <p
          className="text-sm tracking-wider mb-10 text-left pl-16 sm:pl-20"
          style={{ fontFamily: 'var(--font-body)', color: 'var(--gold)', opacity: 0.6 }}
        >
          2022
        </p>

        {/* Top ink stroke */}
        <div ref={topStrokeRef} className="ink-stroke-line mb-8 max-w-xs mx-auto">
          <svg viewBox="0 0 300 20" className="w-full h-5" fill="none">
            <path
              d="M 5 15 Q 50 2 100 12 Q 150 22 200 8 Q 250 -2 295 15"
              stroke="var(--gold)"
              strokeWidth="1.5"
              fill="none"
              opacity="0.5"
            />
          </svg>
        </div>

        {/* The diary quote */}
        <p
          ref={textRef}
          className="text-xl sm:text-2xl italic leading-relaxed min-h-[4em]"
          style={{ fontFamily: 'var(--font-serif)', color: 'var(--brown)', opacity: 0.85 }}
        >
          Kehendak-Nya menuntun kami pada pertemuan yang tak pernah disangka...
        </p>

        {/* Bottom ink stroke */}
        <div ref={bottomStrokeRef} className="ink-stroke-line mt-8 max-w-xs mx-auto">
          <svg viewBox="0 0 300 20" className="w-full h-5" fill="none">
            <path
              d="M 295 5 Q 250 18 200 8 Q 150 -2 100 12 Q 50 22 5 5"
              stroke="var(--gold)"
              strokeWidth="1.5"
              fill="none"
              opacity="0.5"
            />
          </svg>
        </div>

        {/* Subtle diary divider */}
        <p className="mt-10 text-sm tracking-[0.5em]" style={{ color: 'var(--gold)', opacity: 0.4 }}>
          &bull; &bull; &bull;
        </p>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════
   5. DIARY STORY — One page, one story, written in ink
   A single diary card pinned on screen.
   Each paragraph writes in with handwriting reveal,
   then dissolves like disappearing ink before the next.
   The year badge stays fixed at top-left like a diary date.
   ═══════════════════════════════════════════════════════════ */
function DiaryStorySection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const yearBadgeRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  const descriptionRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const currentIndexRef = useRef(-1)
  const hasEnteredRef = useRef(false)
  const isTransitioningRef = useRef(false)

  // Detect mobile for performance-tuned animation
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768

  // Handwriting reveal — SLOW, EMOTIONAL, CINEMATIC
  // Like someone writing memories slowly in a journal
  // Each character breathes into existence with emotional pacing
  // Word boundaries get extra pause — the pen lifts between words
  const doHandwritingReveal = (el: HTMLDivElement, text: string, stagger: number = 0.035, charDuration: number = 0.12, delay: number = 0) => {
    if (!el) return
    el.innerHTML = ''

    const allChars: HTMLSpanElement[] = []
    const wordBoundaries: number[] = [] // indices where new words start
    const words = text.split(' ')
    words.forEach((word, wi) => {
      const ws = document.createElement('span')
      ws.style.cssText = 'white-space:nowrap;display:inline;'
      if (wi > 0) wordBoundaries.push(allChars.length) // mark where this word starts
      for (let j = 0; j < word.length; j++) {
        const cs = document.createElement('span')
        cs.className = 'hw-char'
        // Mobile: no will-change to reduce compositing, simpler initial transform
        cs.style.cssText = isMobile
          ? `display:inline-block;opacity:0;transform:translateY(2px);min-width:0.08em;font-family:var(--font-serif);font-style:italic;`
          : `display:inline-block;will-change:opacity,transform;opacity:0;transform:translateY(3px) rotate(-1deg);min-width:0.08em;font-family:var(--font-serif);font-style:italic;`
        cs.textContent = word[j]
        ws.appendChild(cs)
        allChars.push(cs)
      }
      el.appendChild(ws)
      if (wi < words.length - 1) {
        const sp = document.createElement('span')
        sp.innerHTML = '\u00A0'
        sp.style.display = 'inline'
        el.appendChild(sp)
      }
    })

    // Build stagger array with word-boundary pauses
    // Each word boundary gets a slightly longer pause (pen lifts between words)
    const staggerValues: number[] = allChars.map((_, i) => {
      const isWordStart = wordBoundaries.includes(i)
      // Word start: slightly longer pause — the pen lifts, breathes, then writes again
      return isWordStart ? stagger * 1.8 : stagger
    })

    // Convert to cumulative delay array for gsap
    let cumulativeDelay = delay
    const delays: number[] = []
    for (let i = 0; i < allChars.length; i++) {
      delays.push(cumulativeDelay)
      cumulativeDelay += staggerValues[i] + charDuration * 0.3
    }

    // Animate each character individually with its own timing
    allChars.forEach((ch, i) => {
      gsap.to(ch, {
        opacity: 1,
        y: 0,
        rotation: 0,
        duration: charDuration,
        ease: 'power2.out',
        delay: delays[i],
      })
    })
  }

  useEffect(() => {
    if (!sectionRef.current) return

    const section = sectionRef.current
    const progressBar = progressRef.current
    const yearBadge = yearBadgeRef.current
    const titleEl = titleRef.current
    const descEl = descriptionRef.current
    const card = cardRef.current

    if (!titleEl || !descEl || !yearBadge || !card) return

    // Set initial states
    if (progressBar) gsap.set(progressBar, { scaleX: 0, transformOrigin: 'left center' })

    // Calculate handwriting duration for a given text (for timing sync)
    const calcWriteDuration = (text: string, stagger: number, charDuration: number) => {
      return text.length * stagger + charDuration
    }

    // Show story item with handwriting reveal
    const showStoryItem = (index: number) => {
      const item = WEDDING.timeline[index]
      if (!item) return

      // Update year badge
      if (yearBadge) {
        yearBadge.textContent = item.year
        gsap.fromTo(yearBadge, { opacity: 0, y: isMobile ? -3 : -5 }, { opacity: 0.6, y: 0, duration: 0.4, ease: 'power2.out' })
      }

      // Title — slow, emotional handwriting reveal, serif italic
      // Like the chapter heading being written first
      const titleStagger = isMobile ? 0.04 : 0.05
      const titleCharDur = isMobile ? 0.1 : 0.14
      doHandwritingReveal(titleEl, item.title, titleStagger, titleCharDur)

      // Description — slower still, each word breathes
      // Delayed: let the title finish before the story begins
      const descStagger = isMobile ? 0.025 : 0.035
      const descCharDur = isMobile ? 0.08 : 0.11
      const titleWriteTime = calcWriteDuration(item.title, titleStagger, titleCharDur)
      // Emotional pause after title before description begins — breathing space
      const descDelay = titleWriteTime + (isMobile ? 0.4 : 0.6)
      doHandwritingReveal(descEl, item.description, descStagger, descCharDur, descDelay)
    }

    // Dissolve current text, then show next — mobile-optimized
    const transitionToNext = (nextIndex: number) => {
      if (isTransitioningRef.current) return
      isTransitioningRef.current = true

      // Kill any running GSAP animations on these elements
      gsap.killTweensOf([titleEl, descEl, yearBadge])

      const tl = gsap.timeline({
        onComplete: () => {
          isTransitioningRef.current = false
        }
      })

      // Mobile: dissolve without blur filter (expensive on mobile GPUs)
      tl.to([titleEl, descEl], {
        opacity: 0,
        ...(isMobile ? {} : { filter: 'blur(1.5px)' }),
        duration: isMobile ? 0.4 : 0.5,
        ease: 'power2.inOut',
        stagger: 0.03,
      })

      // Year badge fades
      if (yearBadge) {
        tl.to(yearBadge, {
          opacity: 0,
          duration: 0.25,
          ease: 'power2.in',
        }, '-=0.3')
      }

      // The space between thoughts — a breath before the next memory
      tl.to({}, { duration: isMobile ? 0.3 : 0.5 })

      // Reset and reveal next paragraph
      tl.call(() => {
        titleEl.innerHTML = ''
        descEl.innerHTML = ''
        gsap.set([titleEl, descEl], { opacity: 1, filter: 'blur(0px)' })
        currentIndexRef.current = nextIndex
        showStoryItem(nextIndex)
      })
    }

    // IntersectionObserver for enter detection
    const enterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasEnteredRef.current) {
            hasEnteredRef.current = true
            gsap.to(section, { opacity: 1, duration: 0.5, ease: 'power2.out' })
            gsap.to(card, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', delay: 0.1,
              onComplete: () => {
                currentIndexRef.current = 0
                showStoryItem(0)
              }
            })
            enterObserver.disconnect()
          }
        })
      },
      { threshold: 0.1 }
    )
    enterObserver.observe(section)

    // Pinned scroll-driven progression — mobile-optimized scroll distance
    const totalItems = WEDDING.timeline.length
    // Longer pin distance = more time to read each story, more emotional breathing room
    // Slower handwriting means we need more scroll distance per story
    const scrollDistance = isMobile ? totalItems * 70 : totalItems * 120

    const pinTrigger = ScrollTrigger.create({
      trigger: section,
      start: 'top 10%',
      end: `+=${scrollDistance}%`,
      pin: true,
      anticipatePin: 1,
      scrub: isMobile ? 0.5 : 0.8, // Mobile: more responsive scrub
      onUpdate: (self) => {
        // Update progress bar
        if (progressBar) {
          gsap.set(progressBar, { scaleX: self.progress })
        }

        // Calculate which story index should be shown based on scroll progress
        const progress = self.progress
        const targetIndex = Math.min(
          Math.floor(progress * totalItems),
          totalItems - 1
        )

        // Only transition if index actually changed and we're not already transitioning
        if (targetIndex !== currentIndexRef.current && hasEnteredRef.current && !isTransitioningRef.current) {
          transitionToNext(targetIndex)
        }
      },
    })

    return () => {
      enterObserver.disconnect()
      pinTrigger.kill()
    }
  }, [])

  return (
    <section ref={sectionRef} className="diary-paper-bg diary-lines diary-margin cinema-depth py-28 px-6 relative" style={{ opacity: 0 }}>
      {/* Progress bar — thin gold line at top */}
      <div
        ref={progressRef}
        className="absolute top-0 left-0 right-0 h-[1px] z-20"
        style={{ background: 'linear-gradient(90deg, var(--gold-dark), var(--gold), var(--gold-dark))', transform: 'scaleX(0)', transformOrigin: 'left center' }}
      />

      <div className="max-w-lg mx-auto">
        {/* Section heading */}
        <h2 className="text-3xl sm:text-4xl text-center mb-12" style={{ fontFamily: 'var(--font-script)', color: 'var(--gold-dark)' }}>
          Cerita Kami
        </h2>

        {/* The diary card — one page, one story */}
        <div
          ref={cardRef}
          className="diary-note-card diary-note-card-vignette relative p-8 sm:p-10 rounded-lg bg-white/80 backdrop-blur-sm shadow-lg overflow-hidden"
          style={{ minHeight: '340px', opacity: 0, transform: 'translateY(15px)' }}
        >
          {/* Year badge — fixed at top-left like a diary date */}
          <div
            ref={yearBadgeRef}
            className="text-sm tracking-wider mb-6"
            style={{ fontFamily: 'var(--font-body)', color: 'var(--gold)', opacity: 0 }}
          >
            {WEDDING.timeline[0]?.year}
          </div>

          {/* Title — serif italic, handwriting reveal */}
          <div
            ref={titleRef}
            className="text-2xl sm:text-3xl mb-4 min-h-[1.5em]"
            style={{ fontFamily: 'var(--font-serif)', color: 'var(--gold-dark)', fontStyle: 'italic' }}
          />

          {/* Description — serif italic, handwriting reveal */}
          <div
            ref={descriptionRef}
            className="text-base sm:text-lg leading-relaxed min-h-[6em]"
            style={{ fontFamily: 'var(--font-serif)', color: 'var(--brown-light)', fontStyle: 'italic' }}
          />

          {/* Subtle bottom margin line */}
          <div className="absolute bottom-6 left-8 right-8 h-[1px]" style={{ background: 'var(--gold)', opacity: 0.1 }} />
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════
   6. COUNTDOWN — Waiting Together
   Every second brings us closer
   ═══════════════════════════════════════════════════════════ */
function CountdownSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const { days, hours, minutes, seconds } = useCountdown(WEDDING.akadDate)

  useEffect(() => {
    const ctx = gsap.context(() => {
      fadeIn(sectionRef.current!, { duration: 1.2, y: 20 })
    })
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="batik-kawung cinema-depth py-28 px-6 text-center" style={{ opacity: 0 }}>
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl sm:text-4xl mb-2" style={{ fontFamily: 'var(--font-script)', color: 'var(--gold-dark)' }}>
          Menghitung Hari
        </h2>
        <div className="ornament-divider max-w-xs mx-auto mb-14">
          <span className="text-[var(--gold)] text-lg">&#10047;</span>
        </div>

        {/* Countdown numbers */}
        <div className="flex items-center justify-center gap-6 sm:gap-10 mb-8">
          {[
            { value: days, label: 'Hari' },
            { value: hours, label: 'Jam' },
            { value: minutes, label: 'Menit' },
            { value: seconds, label: 'Detik' },
          ].map((item, i) => (
            <div key={item.label} className="text-center">
              <div
                className="countdown-number text-4xl sm:text-6xl"
                style={{
                  fontFamily: 'var(--font-serif)',
                  color: 'var(--gold)',
                  animation: i === 0 ? 'breathe 4s ease-in-out infinite' : undefined,
                }}
              >
                {String(item.value).padStart(2, '0')}
              </div>
              <p
                className="text-[10px] sm:text-xs tracking-[0.2em] uppercase mt-2"
                style={{ fontFamily: 'var(--font-body)', color: 'var(--brown-light)' }}
              >
                {item.label}
              </p>
            </div>
          ))}
        </div>

        <p className="text-sm italic" style={{ fontFamily: 'var(--font-serif)', color: 'var(--brown-light)' }}>
          menuju hari bahagia kami
        </p>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════
   7. EVENT — The Details
   Simple, clean, no flip animation
   ═══════════════════════════════════════════════════════════ */
function EventSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const akadRef = useRef<HTMLDivElement>(null)
  const resepsiRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      fadeIn(sectionRef.current!, { duration: 1.2, y: 20 })

      if (akadRef.current) {
        gsap.fromTo(akadRef.current,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 1.2,
            delay: 0.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current!,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        )
      }

      if (resepsiRef.current) {
        gsap.fromTo(resepsiRef.current,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 1.2,
            delay: 0.4,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current!,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        )
      }
    })

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="py-28 px-6" style={{ background: 'var(--cream-dark)', opacity: 0 }}>
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl mb-2" style={{ fontFamily: 'var(--font-script)', color: 'var(--gold-dark)' }}>
          Acara
        </h2>
        <div className="ornament-divider max-w-xs mx-auto mb-14">
          <span className="text-[var(--gold)] text-lg">&#10047;</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Akad Nikah */}
          <div
            ref={akadRef}
            className="diary-note-card p-6 sm:p-8 rounded-lg text-center"
            style={{ opacity: 0 }}
          >
            <h3
              className="text-lg sm:text-xl tracking-[0.2em] uppercase mb-4"
              style={{ fontFamily: 'var(--font-serif)', color: 'var(--gold-dark)' }}
            >
              Akad Nikah
            </h3>
            <div className="ornament-divider max-w-[100px] mx-auto mb-4">
              <span className="text-[var(--gold)] text-xs">&#10047;</span>
            </div>
            <p className="text-sm mb-1" style={{ fontFamily: 'var(--font-body)', color: 'var(--brown)' }}>
              05 Juli 2026
            </p>
            <p className="text-sm mb-4" style={{ fontFamily: 'var(--font-body)', color: 'var(--brown-light)' }}>
              10:00 WIB
            </p>
          </div>

          {/* Resepsi */}
          <div
            ref={resepsiRef}
            className="diary-note-card p-6 sm:p-8 rounded-lg text-center"
            style={{ opacity: 0 }}
          >
            <h3
              className="text-lg sm:text-xl tracking-[0.2em] uppercase mb-4"
              style={{ fontFamily: 'var(--font-serif)', color: 'var(--gold-dark)' }}
            >
              Resepsi
            </h3>
            <div className="ornament-divider max-w-[100px] mx-auto mb-4">
              <span className="text-[var(--gold)] text-xs">&#10047;</span>
            </div>
            <p className="text-sm mb-1" style={{ fontFamily: 'var(--font-body)', color: 'var(--brown)' }}>
              05 Juli 2026
            </p>
            <p className="text-sm mb-4" style={{ fontFamily: 'var(--font-body)', color: 'var(--brown-light)' }}>
              11:00 - 17:00 WIB
            </p>
          </div>
        </div>

        {/* Venue & Address */}
        <div className="mt-10">
          <p className="text-base font-medium mb-1" style={{ fontFamily: 'var(--font-serif)', color: 'var(--brown)' }}>
            {WEDDING.venue}
          </p>
          <p className="text-sm leading-relaxed max-w-md mx-auto" style={{ fontFamily: 'var(--font-serif)', color: 'var(--brown-light)' }}>
            {WEDDING.address}
          </p>
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════
   8. GALLERY — Memories Returning
   Like memories surfacing one by one from a dream.
   Each photo drifts in from depth — not displayed, but remembered.
   Organic spacing, cinematic zoom, layered depth, subtle float.
   ═══════════════════════════════════════════════════════════ */
function GallerySection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [touchStart, setTouchStart] = useState<number | null>(null)

  // Organic rotations — slightly different each time, like scattered photos
  const rotations = useRef(
    WEDDING.galleryImages.map(() => Math.round((Math.random() - 0.5) * 10))
  )

  // Organic depth offsets — some photos slightly overlap, creating layered memory feel
  const depthOffsets = useRef(
    WEDDING.galleryImages.map((_, i) => ({
      x: (Math.random() - 0.5) * 12,
      y: (Math.random() - 0.5) * 8,
      scale: 0.88 + Math.random() * 0.12,
      z: i * 2, // z-index layering
    }))
  )

  // Varied sizes — memories are not all the same size
  const photoSizes = useRef(
    WEDDING.galleryImages.map((_, i) => {
      // Featured memories: 1st, 5th, 9th — bigger, closer, more important
      if (i % 4 === 0) return 280
      if (i % 3 === 0) return 240
      if (i % 2 === 0) return 200
      return 170 + Math.round(Math.random() * 30)
    })
  )

  useEffect(() => {
    const ctx = gsap.context(() => {
      fadeIn(sectionRef.current!, { duration: 1.2, y: 20 })

      // Each memory returns one by one — from depth, from blur, from forgetting
      const memories = sectionRef.current!.querySelectorAll('.memory-photo')
      if (memories.length > 0) {
        memories.forEach((memory, i) => {
          const depth = depthOffsets.current[i]
          // Organic rhythm — not linear, each memory surfaces in its own time
          // Use a sine wave to create natural breathing rhythm between arrivals
          const baseDelay = 0.35 * i
          const organicBreath = Math.sin(i * 0.8 + 0.5) * 0.2
          const staggerDelay = baseDelay + organicBreath

          // Each memory arrives from a different direction — organic, not uniform
          const arriveFromX = depth.x * 3
          const arriveFromY = 60 + i * 6
          const arriveScale = (depth.scale || 0.9) * 0.75
          const arriveRotation = depth.x * 0.5

          gsap.fromTo(memory,
            {
              opacity: 0,
              x: arriveFromX,
              y: arriveFromY,
              scale: arriveScale,
              rotation: arriveRotation,
              filter: 'blur(8px)',
            },
            {
              opacity: 1,
              x: depth.x,
              y: depth.y,
              scale: depth.scale,
              rotation: rotations.current[i],
              filter: 'blur(0px)',
              duration: 1.8,
              delay: staggerDelay,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: sectionRef.current!,
                start: 'top 75%',
                toggleActions: 'play none none none',
              },
              onComplete: () => {
                // After arriving — gentle floating, like the memory is alive and breathing
                gsap.to(memory, {
                  y: `+=${2 + Math.random() * 2}`,
                  x: `+=${(Math.random() - 0.5) * 2}`,
                  duration: 3 + Math.random() * 3,
                  ease: 'sine.inOut',
                  yoyo: true,
                  repeat: -1,
                  delay: Math.random() * 2,
                })
              },
            }
          )

          // Cinematic zoom before placement — a brief moment of focus
          // Each photo does a tiny zoom-in after it arrives, like the eye focusing
          gsap.fromTo(memory,
            { scale: arriveScale },
            {
              scale: depth.scale,
              duration: 0.6,
              delay: staggerDelay + 1.4,
              ease: 'back.out(1.2)',
            }
          )
        })
      }
    })
    return () => ctx.revert()
  }, [])

  // Lightbox keyboard navigation
  useEffect(() => {
    if (lightboxIndex === null) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxIndex(null)
      if (e.key === 'ArrowLeft') {
        setLightboxIndex((prev) => prev !== null ? (prev - 1 + WEDDING.galleryImages.length) % WEDDING.galleryImages.length : null)
      }
      if (e.key === 'ArrowRight') {
        setLightboxIndex((prev) => prev !== null ? (prev + 1) % WEDDING.galleryImages.length : null)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [lightboxIndex])

  // Touch swipe for lightbox
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX)
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return
    const diff = e.changedTouches[0].clientX - touchStart
    if (Math.abs(diff) > 50) {
      if (diff > 0 && lightboxIndex !== null) {
        setLightboxIndex((lightboxIndex - 1 + WEDDING.galleryImages.length) % WEDDING.galleryImages.length)
      } else if (diff < 0 && lightboxIndex !== null) {
        setLightboxIndex((lightboxIndex + 1) % WEDDING.galleryImages.length)
      }
    }
    setTouchStart(null)
  }

  const openLightbox = (index: number) => setLightboxIndex(index)
  const closeLightbox = () => setLightboxIndex(null)
  const prevImage = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + WEDDING.galleryImages.length) % WEDDING.galleryImages.length)
    }
  }
  const nextImage = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % WEDDING.galleryImages.length)
    }
  }

  return (
    <section ref={sectionRef} className="diary-paper-bg cinema-depth py-28 px-6" style={{ opacity: 0 }}>
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl mb-2" style={{ fontFamily: 'var(--font-script)', color: 'var(--gold-dark)' }}>
          Momen Kami
        </h2>
        <div className="ornament-divider max-w-xs mx-auto mb-14">
          <span className="text-[var(--gold)] text-lg">&#10047;</span>
        </div>

        {/* Memories returning one by one — like photos surfacing from a dream */}
        <div className="gallery-memories">
          {WEDDING.galleryImages.map((img, index) => {
            const depth = depthOffsets.current[index]
            return (
            <div
              key={index}
              className="memory-photo cursor-pointer"
              style={{
                // Organic placement — each photo drifts to its own position
                transform: `rotate(${rotations.current[index]}deg)`,
                maxWidth: `${photoSizes.current[index]}px`,
                // Layered depth — some photos overlap slightly, like scattered memories
                marginLeft: index % 3 === 0 ? 'auto' : index % 3 === 1 ? '6%' : '3%',
                marginRight: index % 3 === 0 ? '3%' : index % 3 === 1 ? 'auto' : '6%',
                // Organic vertical spacing — not perfectly aligned, like a journal page
                marginBottom: index % 2 === 0 ? '-18px' : '-8px',
                // Layered z-index for overlap depth feel
                zIndex: depth.z,
                position: 'relative',
              }}
              onClick={() => openLightbox(index)}
              role="button"
              tabIndex={0}
              aria-label={`Lihat foto ${WEDDING.galleryCaptions[index]}`}
              onKeyDown={(e) => { if (e.key === 'Enter') openLightbox(index) }}
            >
              <div className="aspect-[4/5] overflow-hidden bg-[var(--cream-dark)]">
                <img
                  src={img}
                  alt={WEDDING.galleryCaptions[index]}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <p
                className="text-center text-xs sm:text-sm italic mt-1"
                style={{ fontFamily: 'var(--font-serif)', color: 'var(--brown-light)' }}
              >
                {WEDDING.galleryCaptions[index]}
              </p>
            </div>
            )
          })}
        </div>
      </div>

      {/* ─── Lightbox ─── */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.95)' }}
          onClick={closeLightbox}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          role="dialog"
          aria-label="Gallery lightbox"
        >
          {/* Close button */}
          <button
            className="absolute top-4 right-4 sm:top-6 sm:right-6 w-10 h-10 flex items-center justify-center text-white/70 hover:text-white transition-colors z-10 cursor-pointer"
            onClick={closeLightbox}
            aria-label="Tutup"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Prev arrow */}
          <button
            className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-white/50 hover:text-white transition-colors z-10 cursor-pointer"
            onClick={(e) => { e.stopPropagation(); prevImage() }}
            aria-label="Sebelumnya"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Next arrow */}
          <button
            className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-white/50 hover:text-white transition-colors z-10 cursor-pointer"
            onClick={(e) => { e.stopPropagation(); nextImage() }}
            aria-label="Selanjutnya"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Image */}
          <div
            className="max-w-4xl max-h-[85vh] px-14 sm:px-16"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={WEDDING.galleryImages[lightboxIndex]}
              alt={WEDDING.galleryCaptions[lightboxIndex]}
              className="max-w-full max-h-[80vh] object-contain mx-auto"
            />
            <p
              className="text-center text-sm italic mt-4"
              style={{ fontFamily: 'var(--font-serif)', color: 'rgba(255,255,255,0.6)' }}
            >
              {WEDDING.galleryCaptions[lightboxIndex]}
            </p>
          </div>
        </div>
      )}
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════
   9. CLOSING — Diary Ending
   The last page of this chapter, the first of forever
   ═══════════════════════════════════════════════════════════ */
function ClosingSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  const subtitleRef = useRef<HTMLDivElement>(null)
  const doaRef = useRef<HTMLDivElement>(null)
  const footerLineRef = useRef<HTMLDivElement>(null)
  const finalLineRef = useRef<HTMLDivElement>(null)
  const dateRef = useRef<HTMLDivElement>(null)
  const shimmerRef = useRef<HTMLDivElement>(null)
  const hasFinalAnimated = useRef(false)

  useEffect(() => {
    const ctx = gsap.context(() => {
      fadeIn(sectionRef.current!, { duration: 1.2, y: 20 })

      // Title — cinematic blur reveal (slower pacing)
      if (titleRef.current) {
        gsap.fromTo(titleRef.current,
          { opacity: 0, filter: 'blur(8px)', y: 20 },
          {
            opacity: 1,
            filter: 'blur(0px)',
            y: 0,
            duration: 2.5,
            delay: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current!,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        )
      }

      if (subtitleRef.current) {
        gsap.fromTo(subtitleRef.current,
          { opacity: 0, y: 15 },
          {
            opacity: 1,
            y: 0,
            duration: 1.5,
            delay: 1.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current!,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        )
      }

      if (doaRef.current) {
        gsap.fromTo(doaRef.current,
          { opacity: 0, y: 15 },
          {
            opacity: 1,
            y: 0,
            duration: 1.5,
            delay: 1.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current!,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        )
      }

      if (footerLineRef.current) {
        gsap.fromTo(footerLineRef.current,
          { opacity: 0 },
          {
            opacity: 1,
            duration: 1,
            delay: 2.5,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: sectionRef.current!,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        )
      }

      // Final handwriting sentence — the emotional peak
      // Then ALL ending text dissolves together like dust carried by warm wind
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && !hasFinalAnimated.current) {
              hasFinalAnimated.current = true
              const isMobile = window.innerWidth < 768

              setTimeout(() => {
                if (finalLineRef.current) {
                  gsap.set(finalLineRef.current, { opacity: 1 })

                  // Custom handwriting reveal for closing final line
                  const fullText = finalLineRef.current.textContent || ''
                  finalLineRef.current.innerHTML = ''

                  const wordSpans: HTMLSpanElement[] = []
                  const words = fullText.split(' ')
                  words.forEach((word, wi) => {
                    const ws = document.createElement('span')
                    ws.style.cssText = 'display:inline-block;white-space:nowrap;position:relative;'
                    const charSpans: HTMLSpanElement[] = []
                    for (let j = 0; j < word.length; j++) {
                      const cs = document.createElement('span')
                      cs.className = 'hw-char'
                      cs.style.cssText = isMobile
                        ? `display:inline-block;opacity:0;transform:translateY(2px);min-width:0.08em;`
                        : `display:inline-block;will-change:opacity,transform;opacity:0;transform:translateY(3px) rotate(-1deg);min-width:0.08em;`
                      cs.textContent = word[j]
                      ws.appendChild(cs)
                      charSpans.push(cs)
                    }
                    finalLineRef.current!.appendChild(ws)
                    wordSpans.push(ws)

                    if (wi < words.length - 1) {
                      const sp = document.createElement('span')
                      sp.innerHTML = '\u00A0'
                      sp.style.display = 'inline'
                      finalLineRef.current!.appendChild(sp)
                    }

                    // Handwriting animation — slow, emotional, each word breathes
                    gsap.to(charSpans, {
                      opacity: 1,
                      y: 0,
                      rotation: 0,
                      duration: 0.25,
                      stagger: isMobile ? 0.06 : 0.08,
                      ease: 'power2.out',
                      delay: wi * 0.4 + 0.5,
                    })
                  })

                  // After handwriting completes — ALL ending text dissolves together
                  // Like the entire page being carried away by warm wind
                  const writingDuration = words.length * 0.4 + words.reduce((a, w) => a + w.length * 0.08, 0) + 2.5
                  setTimeout(() => {
                    // Collect ALL text elements in the closing section that should dissolve
                    const contentEl = sectionRef.current?.querySelector('.relative.z-10') as HTMLDivElement | null
                    if (!contentEl) return

                    // Get all direct children that contain text
                    const allTextElements = contentEl.querySelectorAll('div > div, div > p')
                    // Also include the final line word spans
                    const dissolveElements: HTMLElement[] = []

                    allTextElements.forEach((el) => {
                      if (el instanceof HTMLElement && el.textContent && el.textContent.trim()) {
                        dissolveElements.push(el)
                      }
                    })

                    // Add final line word spans
                    wordSpans.forEach(ws => dissolveElements.push(ws))

                    // Dust dissolve — ALL text dissolves progressively from back to front
                    // Each element turns to dust and drifts away on warm wind
                    const reversedElements = [...dissolveElements].reverse()
                    reversedElements.forEach((el, ri) => {
                      // Spawn tiny golden dust particles
                      const spawnDustParticles = () => {
                        if (isMobile) return // Skip on mobile for performance
                        const rect = el.getBoundingClientRect()
                        const sectionRect = sectionRef.current?.getBoundingClientRect()
                        if (!sectionRect) return
                        const particleCount = 2 + Math.floor(Math.random() * 2)
                        for (let p = 0; p < particleCount; p++) {
                          const particle = document.createElement('span')
                          particle.style.cssText = `
                            position:absolute;
                            width:${1 + Math.random() * 2.5}px;
                            height:${1 + Math.random() * 2.5}px;
                            border-radius:50%;
                            background:rgba(201,169,110,${0.2 + Math.random() * 0.3});
                            pointer-events:none;
                            top:${rect.top - sectionRect.top + Math.random() * rect.height}px;
                            left:${rect.left - sectionRect.left + Math.random() * rect.width}px;
                          `
                          sectionRef.current?.querySelector('.relative.z-10')?.appendChild(particle)

                          gsap.to(particle, {
                            opacity: 0,
                            x: 10 + Math.random() * 25, // drift right-ish, like warm wind
                            y: -(10 + Math.random() * 25),
                            duration: 1.8 + Math.random() * 0.8,
                            ease: 'power1.out',
                            delay: ri * 0.35 + Math.random() * 0.2,
                            onComplete: () => particle.remove(),
                          })
                        }
                      }

                      // Main dissolve — soft opacity fade with gentle drift
                      // Like text turning to dust and being carried by warm wind
                      const windDriftX = 8 + Math.random() * 20  // wind blows right
                      const windDriftY = -(5 + Math.random() * 12) // gentle upward

                      gsap.to(el, {
                        opacity: 0,
                        x: `+=${windDriftX}`,
                        y: `+=${windDriftY}`,
                        scale: 0.96,
                        duration: isMobile ? 1.0 : 1.4,
                        ease: 'power1.inOut',
                        delay: ri * 0.35,
                        onStart: spawnDustParticles,
                      })
                    })

                    // After all elements have dissolved — warm empty moment, then fade to darkness
                    const dissolveDuration = reversedElements.length * 0.35 + 1.5 + 0.8
                    setTimeout(() => {
                      // Golden shimmer sweep — last light of golden hour
                      if (shimmerRef.current) {
                        gsap.fromTo(shimmerRef.current,
                          { opacity: 0, x: -100 },
                          {
                            opacity: 0.08,
                            x: window.innerWidth,
                            duration: 2.5,
                            ease: 'power1.inOut',
                            onComplete: () => {
                              gsap.set(shimmerRef.current!, { opacity: 0 })

                              // Warm empty moment — brief silence before darkness
                              setTimeout(() => {
                                // Soft focus — content gently blurs like eyes closing
                                const contentEl = sectionRef.current?.querySelector('.relative.z-10') as HTMLDivElement | null
                                if (contentEl) {
                                  gsap.to(contentEl, {
                                    ...(isMobile ? {} : { filter: 'blur(2px)' }),
                                    opacity: 0.7,
                                    duration: isMobile ? 3 : 4,
                                    ease: 'power2.inOut',
                                  })
                                  gsap.to(contentEl, {
                                    scale: 0.98,
                                    duration: isMobile ? 3 : 4,
                                    ease: 'power2.inOut',
                                  })
                                }

                                // Fade to warm darkness
                                const fadeOverlay = sectionRef.current?.querySelector('.ending-fade-overlay') as HTMLDivElement | null
                                if (fadeOverlay) {
                                  gsap.to(fadeOverlay, {
                                    opacity: 0.85,
                                    duration: isMobile ? 5 : 6,
                                    ease: 'power2.inOut',
                                  })
                                }

                                // Date appears — the beginning of forever
                                setTimeout(() => {
                                  if (dateRef.current) {
                                    gsap.set(dateRef.current, { opacity: 1 })
                                    gsap.to(dateRef.current.querySelector('p'), {
                                      opacity: 0.7,
                                      duration: 2.5,
                                      ease: 'power2.out',
                                    })
                                  }
                                }, isMobile ? 3000 : 4000)
                              }, 1000) // warm empty moment before darkness
                            },
                          }
                        )
                      }
                    }, dissolveDuration * 1000)
                  }, writingDuration * 1000)
                }
              }, 500)
            }
          })
        },
        { threshold: 0.3 }
      )

      if (sectionRef.current) {
        observer.observe(sectionRef.current)
      }

      return () => observer.disconnect()
    })

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="batik-kawung-dark cinema-vignette cinema-bloom cinema-dust diary-page-close relative py-28 px-6 text-center overflow-hidden" style={{ opacity: 0 }}>
      {/* Gold light leak */}
      <div className="gold-light-leak absolute inset-0 pointer-events-none" />

      {/* Golden shimmer sweep */}
      <div
        ref={shimmerRef}
        className="absolute inset-0 pointer-events-none z-20"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(201,169,110,0.1), transparent)', opacity: 0 }}
      />

      {/* Ending fade overlay — warm darkness slowly closing in, like candlelight dimming */}
      <div
        className="ending-fade-overlay absolute inset-0 pointer-events-none z-30"
        style={{
          background: 'linear-gradient(to bottom, rgba(26,21,16,0.9), rgba(26,21,16,0.7) 50%, rgba(26,21,16,0.95))',
          opacity: 0,
        }}
      />

      {/* Final petals — the last visible movement before silence */}
      <div className="absolute inset-0 pointer-events-none z-25 overflow-hidden">
        {[15, 35, 55, 72, 88].map((left, i) => (
          <div
            key={`final-petal-${i}`}
            style={{
              position: 'absolute',
              left: `${left}%`,
              top: '-20px',
              width: `${8 + i * 2}px`,
              height: `${10 + i * 2}px`,
              opacity: 0,
              animation: `finalPetalDrift ${7 + i * 1.5}s ease-in ${5 + i * 1.5}s forwards`,
            }}
          >
            <svg width="100%" height="100%" viewBox="0 0 20 24" fill="none">
              <path d="M10 0C10 0 14 4 14 10C14 16 10 24 10 24C10 24 6 16 6 10C6 4 10 0 10 0Z"
                fill={`rgba(201,169,110,${0.2 + i * 0.04})`} />
            </svg>
          </div>
        ))}
      </div>

      <div className="relative z-10 max-w-2xl mx-auto">
        <div ref={titleRef} style={{ opacity: 0 }}>
          <p
            className="text-lg sm:text-xl italic leading-relaxed mb-8"
            style={{ fontFamily: 'var(--font-serif)', color: 'var(--cream)' }}
          >
            Dan seperti semua cerita indah yang dituliskan semesta, kisah
            <span className="gold-shimmer"> kami </span>
            baru saja dimulai.
          </p>
        </div>

        <div ref={subtitleRef} style={{ opacity: 0 }}>
          <p
            className="text-sm sm:text-base leading-relaxed mb-10"
            style={{ fontFamily: 'var(--font-serif)', color: 'var(--cream)', opacity: 0.8 }}
          >
            Terima kasih telah menjadi bagian dari perjalanan kecil kami menuju selamanya.
          </p>
        </div>

        {/* Doa */}
        <div ref={doaRef} style={{ opacity: 0 }}>
          <p
            className="text-base sm:text-lg leading-relaxed mb-6"
            style={{ fontFamily: 'var(--font-arabic)', color: 'var(--gold-light)' }}
            dir="rtl"
          >
            بارك الله لكما وبارك عليكما وجمع بينكما في خير
          </p>
          <p
            className="text-xs italic mb-8"
            style={{ fontFamily: 'var(--font-serif)', color: 'var(--gold)', opacity: 0.7 }}
          >
            Barakallahu lakuma wa baraka &lsquo;alaikuma wa jama&lsquo;a bainakuma fi khair.
          </p>
        </div>

        {/* Small divider */}
        <div className="ornament-divider max-w-[120px] mx-auto mb-6">
          <span className="text-[var(--gold)] text-xs">&#10047;</span>
        </div>

        <div ref={footerLineRef} style={{ opacity: 0 }}>
          <p
            className="text-sm italic gold-shimmer-text"
            style={{ fontFamily: 'var(--font-serif)', color: 'var(--cream)', opacity: 0.6 }}
          >
            Forever starts with Bismillah.
          </p>
        </div>

        {/* Final handwriting — emotional peak, then words drift away */}
        <div
          ref={finalLineRef}
          className="mt-16 min-h-[2em]"
          style={{ opacity: 0 }}
        >
          <p
            className="text-2xl sm:text-3xl gold-shimmer-text"
            style={{ fontFamily: 'var(--font-script)' }}
          >
            Cerita mereka belum selesai...
          </p>
        </div>

        {/* The date — the beginning of forever */}
        <div
          ref={dateRef}
          className="mt-8"
          style={{ opacity: 0 }}
        >
          <p
            className="text-sm tracking-[0.4em]"
            style={{ fontFamily: 'var(--font-body)', color: 'var(--gold)', opacity: 0 }}
          >
            05 . 07 . 2026
          </p>
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════
   10. FOOTER — The End
   Very minimal, very elegant
   ═══════════════════════════════════════════════════════════ */
function FooterSection() {
  return (
    <footer className="relative py-10 px-6 text-center" style={{ background: '#2C2218' }}>
      {/* Sidomukti pattern border at top */}
      <div
        className="absolute top-0 left-0 right-0 h-3"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='70' height='70' viewBox='0 0 70 70'%3E%3Cpath d='M35 5 L45 20 L35 15 L25 20 Z' fill='none' stroke='%23C9A96E' stroke-width='0.5' opacity='0.15'/%3E%3Cpath d='M35 65 L45 50 L35 55 L25 50 Z' fill='none' stroke='%23C9A96E' stroke-width='0.5' opacity='0.15'/%3E%3Cpath d='M5 35 L20 25 L15 35 L20 45 Z' fill='none' stroke='%23C9A96E' stroke-width='0.5' opacity='0.15'/%3E%3Cpath d='M65 35 L50 25 L55 35 L50 45 Z' fill='none' stroke='%23C9A96E' stroke-width='0.5' opacity='0.15'/%3E%3Crect x='25' y='25' width='20' height='20' transform='rotate(45 35 35)' fill='none' stroke='%23C9A96E' stroke-width='0.3' opacity='0.08'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '70px 70px',
          opacity: 0.5,
        }}
      />

      <div className="relative z-10">
        <p
          className="text-2xl sm:text-3xl mb-2"
          style={{ fontFamily: 'var(--font-script)', color: 'var(--gold)' }}
        >
          Irwan & Anira
        </p>
        <p
          className="text-sm tracking-[0.3em]"
          style={{ fontFamily: 'var(--font-body)', color: 'var(--gold)', opacity: 0.5 }}
        >
          05 . 07 . 2026
        </p>
      </div>
    </footer>
  )
}

/* ═══════════════════════════════════════════════════════════
   HOME — The Main Experience
   "Jangan buat website. Buat perasaan."
   DELETED: LamaranSection and MenikahSection (covered in Timeline)
   ADDED: Auto-scroll cinematic experience
   ═══════════════════════════════════════════════════════════ */
export default function Home() {
  const [isLoading, setIsLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)
  const autoScrollState = useRef({
    active: false,
    paused: false,
    currentSpeed: 0,
    targetSpeed: 1.0,
  })
  const userScrollingRef = useRef(false)

  const handlePreloaderComplete = useCallback(() => setIsLoading(false), [])

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

  // Auto-scroll — cinematic breathing rhythm, mobile-first
  // Emotional synchronization: scroll speed matches reading speed + animation timing
  useEffect(() => {
    if (!isOpen) return

    let animationId: number
    let resumeTimeout: ReturnType<typeof setTimeout>

    const isMobile = window.innerWidth < 768

    // Speed zones — mobile-optimized, no dead emotional space
    // Mobile base speeds are higher because: smaller viewport = less scroll distance needed
    const getSpeedForPosition = (scrollY: number, docHeight: number) => {
      const progress = scrollY / docHeight
      if (isMobile) {
        // Mobile: faster, tighter, more responsive
        if (progress < 0.05) return 2.0    // Cover
        if (progress < 0.12) return 4.5    // Transition
        if (progress < 0.20) return 2.2    // Bismillah
        if (progress < 0.30) return 4.0    // Transition
        if (progress < 0.40) return 2.8    // Couple
        if (progress < 0.50) return 4.5    // Transitions
        if (progress < 0.60) return 2.0    // Diary/story — slower, synced with slow handwriting
        if (progress < 0.70) return 4.0    // Countdown/events
        if (progress < 0.80) return 4.0    // Gallery
        if (progress < 0.90) return 2.8    // Wishes
        return 1.5                          // Closing — slow, emotional
      } else {
        // Desktop: same 2x speeds from before
        if (progress < 0.05) return 1.4
        if (progress < 0.12) return 3.6
        if (progress < 0.20) return 1.6
        if (progress < 0.30) return 3.0
        if (progress < 0.40) return 2.0
        if (progress < 0.50) return 3.6
        if (progress < 0.60) return 1.8    // Diary/story — slower, synced with slow handwriting
        if (progress < 0.70) return 3.0
        if (progress < 0.80) return 3.0
        if (progress < 0.90) return 2.0
        return 1.0
      }
    }

    const state = autoScrollState.current

    const autoScroll = () => {
      if (userScrollingRef.current) return

      // Pause gracefully at the bottom
      const atBottom = (window.innerHeight + window.scrollY) >= (document.documentElement.scrollHeight - 1)
      if (atBottom) {
        state.active = false
        return
      }

      // Calculate target speed based on current position in the story
      state.targetSpeed = getSpeedForPosition(window.scrollY, document.documentElement.scrollHeight)

      // Mobile: faster lerp for more responsive speed changes
      // Desktop: smooth lerp for cinematic feel
      const lerpFactor = isMobile ? 0.08 : 0.05
      state.currentSpeed += (state.targetSpeed - state.currentSpeed) * lerpFactor

      // Only scroll if we've built up enough speed to avoid jerky starts
      if (state.currentSpeed > 0.05) {
        window.scrollBy(0, state.currentSpeed)
      }

      state.active = true
      animationId = requestAnimationFrame(autoScroll)
    }

    // Start after the story breathes in
    const startTimeout = setTimeout(() => {
      state.currentSpeed = isMobile ? 1.5 : 1.0
      animationId = requestAnimationFrame(autoScroll)
    }, isMobile ? 600 : 800) // Mobile: shorter delay

    // User takes control — story pauses, then resumes
    const pauseAndResume = () => {
      userScrollingRef.current = true
      state.paused = true
      cancelAnimationFrame(animationId)
      clearTimeout(resumeTimeout)

      // Mobile: shorter pause before resume (1.5s vs 2.5s)
      resumeTimeout = setTimeout(() => {
        userScrollingRef.current = false
        state.paused = false
        const atBottom = (window.innerHeight + window.scrollY) >= (document.documentElement.scrollHeight - 1)
        if (!atBottom) {
          state.currentSpeed *= 0.5
          animationId = requestAnimationFrame(autoScroll)
        }
      }, isMobile ? 1500 : 2500)
    }

    const onWheel = () => pauseAndResume()
    const onTouchStart = () => pauseAndResume()

    window.addEventListener('wheel', onWheel, { passive: true })
    window.addEventListener('touchstart', onTouchStart, { passive: true })

    return () => {
      clearTimeout(startTimeout)
      cancelAnimationFrame(animationId)
      clearTimeout(resumeTimeout)
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('touchstart', onTouchStart)
    }
  }, [isOpen])

  // Music fade-out during closing section — emotional synchronization
  // The story slowly disappears into silence, not cut off abruptly
  useEffect(() => {
    if (!isOpen || !audioRef.current) return

    const closingSection = document.querySelector('.batik-kawung-dark.cinema-vignette')
    if (!closingSection) return

    const audio = audioRef.current
    let fadeInterval: ReturnType<typeof setInterval> | null = null
    let hasStartedFade = false

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasStartedFade && isPlaying) {
            hasStartedFade = true
            // Gradual volume reduction — slow, emotional, synchronized with text dissolve
            // Takes about 8-10 seconds to fully fade, like a story fading into silence
            fadeInterval = setInterval(() => {
              if (audio.volume > 0.02) {
                // Non-linear fade: slower at first, then accelerating
                // This creates a more natural, emotional fade curve
                const reduction = audio.volume > 0.5
                  ? 0.008  // Slow at first — barely perceptible
                  : audio.volume > 0.2
                    ? 0.012  // Getting quieter
                    : 0.02   // Final whispers fade faster
                audio.volume = Math.max(0, audio.volume - reduction)
              } else {
                audio.volume = 0
                audio.pause()
                setIsPlaying(false)
                if (fadeInterval) clearInterval(fadeInterval)
              }
            }, 100) // Smooth 100ms intervals
          }
        })
      },
      { threshold: 0.2 } // Start fading when 20% of closing section is visible
    )

    observer.observe(closingSection)

    return () => {
      observer.disconnect()
      if (fadeInterval) clearInterval(fadeInterval)
    }
  }, [isOpen, isPlaying])

  return (
    <>
      <audio ref={audioRef} src="/music/gamelan-bg.mp3" loop preload="auto" />

      {isLoading && (
        <Preloader
          onComplete={handlePreloaderComplete}
          groomName={WEDDING.groom}
          brideName={WEDDING.bride}
        />
      )}

      {!isLoading && !isOpen && (
        <CoverSectionComponent onOpen={handleOpen} />
      )}

      {!isLoading && isOpen && (
        <SmoothScroll>
          <main className="relative">
            <CursorFollower />
            <JasmineParticles />

            {/* The Diary — each section is a page */}
            <BismillahSection />
            <CoupleSection />
            <DiaryIntroSection />
            <DiaryStorySection />
            {/* LamaranSection and MenikahSection REMOVED — covered in Timeline */}
            <CountdownSection />
            <EventSection />
            <GallerySection />
            <GuestWishes />
            <ClosingSection />
            <FooterSection />
          </main>

          <MusicPlayerComponent
            isPlaying={isPlaying}
            onToggle={toggleMusic}
            audioRef={audioRef}
          />
          <ScrollToTop />
        </SmoothScroll>
      )}
    </>
  )
}
