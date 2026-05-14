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
  const currentIndexRef = useRef(0)
  const hasEnteredRef = useRef(false)

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

    // Fade in the section when it enters viewport
    const enterCtx = gsap.context(() => {
      gsap.to(section, { opacity: 1, duration: 0.8, ease: 'power2.out' })
      gsap.to(card, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', delay: 0.2 })
    }, section)

    // Write the first story paragraph immediately on enter
    const showStoryItem = (index: number) => {
      const item = WEDDING.timeline[index]
      if (!item) return

      // Update year badge
      if (yearBadge) {
        yearBadge.textContent = item.year
        gsap.fromTo(yearBadge, { opacity: 0, y: -5 }, { opacity: 0.6, y: 0, duration: 0.5, ease: 'power2.out' })
      }

      // Write title with handwriting reveal
      if (titleEl) {
        titleEl.textContent = item.title
        handwritingReveal(titleEl, 0.02, 0.07)
      }

      // Write description with handwriting reveal (slightly delayed)
      if (descEl) {
        descEl.textContent = item.description
        const descDelay = item.title.length * 0.02 + 0.1 // wait for title to finish
        handwritingReveal(descEl, 0.016, 0.06, descDelay)
      }
    }

    // Show first story after card fades in
    const initTimer = setTimeout(() => {
      showStoryItem(0)
    }, 800)

    // Dissolve current text, then show next
    const transitionToNext = (nextIndex: number) => {
      const tl = gsap.timeline()

      // Dissolve like disappearing ink
      tl.to([titleEl, descEl], {
        opacity: 0,
        filter: 'blur(2px)',
        duration: 0.8,
        ease: 'power2.inOut',
        stagger: 0.1,
      })

      // Year badge fades
      if (yearBadge) {
        tl.to(yearBadge, {
          opacity: 0,
          duration: 0.4,
          ease: 'power2.in',
        }, '-=0.5')
      }

      // Brief pause — the space between thoughts
      tl.to({}, { duration: 0.3 })

      // Reset and reveal next paragraph
      tl.call(() => {
        if (titleEl) {
          titleEl.innerHTML = ''
          gsap.set(titleEl, { opacity: 1, filter: 'blur(0px)' })
        }
        if (descEl) {
          descEl.innerHTML = ''
          gsap.set(descEl, { opacity: 1, filter: 'blur(0px)' })
        }
        currentIndexRef.current = nextIndex
        showStoryItem(nextIndex)
      })
    }

    // Pinned scroll-driven progression using ScrollTrigger scrub
    // Each story item occupies an equal portion of the scroll distance
    const totalItems = WEDDING.timeline.length
    const scrollDistance = totalItems * 80 // 80vh per story item

    const pinTrigger = ScrollTrigger.create({
      trigger: section,
      start: 'top 10%',
      end: `+=${scrollDistance}%`,
      pin: true,
      anticipatePin: 1,
      scrub: 0.8,
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

        // Only transition if index actually changed
        if (targetIndex !== currentIndexRef.current && hasEnteredRef.current) {
          transitionToNext(targetIndex)
        }
      },
      onEnter: () => {
        hasEnteredRef.current = true
      },
    })

    return () => {
      clearTimeout(initTimer)
      enterCtx.revert()
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

          {/* Description — smaller serif, handwriting reveal */}
          <div
            ref={descriptionRef}
            className="text-base sm:text-lg leading-relaxed min-h-[6em]"
            style={{ fontFamily: 'var(--font-serif)', color: 'var(--brown-light)' }}
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
   8. GALLERY — Polaroid Memories
   Captured moments, held in hand
   ADDED: GSAP ScrollTrigger stagger reveal for polaroid frames
   ═══════════════════════════════════════════════════════════ */
function GallerySection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [touchStart, setTouchStart] = useState<number | null>(null)

  // Polaroid rotations — more variety (-4 to +4)
  const rotations = useRef(
    WEDDING.galleryImages.map(() => Math.round((Math.random() - 0.5) * 8))
  )

  // Varied sizes — some bigger (featured memories), some smaller
  const photoSizes = useRef(
    WEDDING.galleryImages.map((_, i) => {
      // Featured memories: 1st, 5th, 9th
      if (i % 4 === 0) return 300
      if (i % 3 === 0) return 260
      if (i % 2 === 0) return 220
      return 180 + Math.round(Math.random() * 40)
    })
  )

  useEffect(() => {
    const ctx = gsap.context(() => {
      fadeIn(sectionRef.current!, { duration: 1.2, y: 20 })

      // Memories returning one by one — each photo arrives like a memory
      const polaroids = sectionRef.current!.querySelectorAll('.memory-photo')
      if (polaroids.length > 0) {
        polaroids.forEach((polaroid, i) => {
          // Organic rhythm, not linear — each memory arrives in its own time
          const staggerDelay = 0.2 * i + Math.sin(i * 0.7) * 0.15

          gsap.fromTo(polaroid,
            { opacity: 0, y: 40 + i * 5, scale: 0.85, rotation: -3 + Math.random() * 6, filter: 'blur(6px)' },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              rotation: 0,
              filter: 'blur(0px)',
              duration: 1.2,
              delay: staggerDelay,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: sectionRef.current!,
                start: 'top 75%',
                toggleActions: 'play none none none',
              },
              onComplete: () => {
                // After placement, add subtle floating — like the photo is alive
                gsap.to(polaroid, {
                  y: '+=3',
                  duration: 2 + Math.random() * 2,
                  ease: 'sine.inOut',
                  yoyo: true,
                  repeat: -1,
                  delay: Math.random() * 2,
                })
              },
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

        {/* Memories returning one by one — like photos pinned to a diary page */}
        <div className="gallery-memories">
          {WEDDING.galleryImages.map((img, index) => (
            <div
              key={index}
              className="memory-photo cursor-pointer"
              style={{
                // Each photo placed at a slightly different position, like photos pinned to a diary page
                transform: `rotate(${rotations.current[index]}deg)`,
                // Vary sizes — some bigger (featured memories), some smaller (casual moments)
                maxWidth: `${photoSizes.current[index]}px`,
                // Offset positions for organic feel — overlap with negative margins
                marginLeft: index % 3 === 0 ? 'auto' : index % 3 === 1 ? '8%' : '2%',
                marginRight: index % 3 === 0 ? '2%' : index % 3 === 1 ? 'auto' : '8%',
                marginBottom: index % 2 === 0 ? '-15px' : '-5px',
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
          ))}
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
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && !hasFinalAnimated.current) {
              hasFinalAnimated.current = true
              // Handwriting reveal for the final line — VERY slow, emotional, like the last sentence ever written
              setTimeout(() => {
                if (finalLineRef.current) {
                  gsap.set(finalLineRef.current, { opacity: 1 })
                  handwritingReveal(finalLineRef.current, 0.08, 0.2, 1.2)
                }
                // Golden shimmer sweep — like the last light of golden hour
                setTimeout(() => {
                  if (shimmerRef.current) {
                    gsap.fromTo(shimmerRef.current,
                      { opacity: 0, x: -100 },
                      {
                        opacity: 0.12,
                        x: window.innerWidth,
                        duration: 2.5,
                        ease: 'power1.inOut',
                        onComplete: () => {
                          gsap.set(shimmerRef.current!, { opacity: 0 })
                          // Soft focus blur — content softly blurs like eyes closing
                          const contentEl = sectionRef.current?.querySelector('.relative.z-10') as HTMLDivElement | null
                          if (contentEl) {
                            gsap.to(contentEl, {
                              filter: 'blur(2px)',
                              duration: 4,
                              ease: 'power2.inOut',
                            })
                          }
                          // Diary page settling — subtle scale-down like closing
                          if (contentEl) {
                            gsap.to(contentEl, {
                              scale: 0.98,
                              duration: 4,
                              ease: 'power2.inOut',
                            })
                          }
                          // After the shimmer, wait 1.5s then begin fade-to-warm-darkness (slower: 8s)
                          setTimeout(() => {
                            const fadeOverlay = sectionRef.current?.querySelector('.ending-fade-overlay') as HTMLDivElement | null
                            if (fadeOverlay) {
                              gsap.to(fadeOverlay, {
                                opacity: 0.85,
                                duration: 8,
                                ease: 'power2.inOut',
                              })
                            }
                            // After the darkness settles (5s after darkness starts), fade in the date
                            // The last thing you see — the beginning of forever
                            setTimeout(() => {
                              if (dateRef.current) {
                                gsap.set(dateRef.current, { opacity: 1 })
                                gsap.to(dateRef.current.querySelector('p'), {
                                  opacity: 0.7,
                                  duration: 3,
                                  ease: 'power2.out',
                                })
                              }
                            }, 5000)
                          }, 1500)
                        },
                      }
                    )
                  }
                }, 3000)
              }, 500)
            }
          })
        },
        { threshold: 0.4 }
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

        {/* Final handwriting — emotional peak */}
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

  // Auto-scroll — cinematic breathing rhythm like music
  // Slow at emotional peaks, flowing through transitions, reading-speed in content
  useEffect(() => {
    if (!isOpen) return

    let animationId: number
    let resumeTimeout: ReturnType<typeof setTimeout>

    // Speed zones based on scroll position — like a conductor's tempo markings
    const getSpeedForPosition = (scrollY: number, docHeight: number) => {
      const progress = scrollY / docHeight
      if (progress < 0.05) return 0.7    // Cover — was 0.4, now faster
      if (progress < 0.12) return 1.8    // Transition — was 1.2
      if (progress < 0.20) return 0.8    // Bismillah — was 0.5
      if (progress < 0.30) return 1.5    // Transition — was 1.0
      if (progress < 0.40) return 1.0    // Couple — was 0.6
      if (progress < 0.50) return 1.8    // Transitions — was 1.2
      if (progress < 0.60) return 1.2    // Diary/story — was 0.8
      if (progress < 0.70) return 1.5    // Countdown/events — was 1.0
      if (progress < 0.80) return 1.5    // Gallery — was 1.0
      if (progress < 0.90) return 1.0    // Wishes — was 0.6
      return 0.5                          // Closing — was 0.3
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

      // Smooth acceleration — ease into new speed, never snap
      // Lerp factor 0.05 means ~20 frames to reach target (more responsive)
      const lerpFactor = 0.05
      state.currentSpeed += (state.targetSpeed - state.currentSpeed) * lerpFactor

      // Only scroll if we've built up enough speed to avoid jerky starts
      if (state.currentSpeed > 0.05) {
        window.scrollBy(0, state.currentSpeed)
      }

      state.active = true
      animationId = requestAnimationFrame(autoScroll)
    }

    // Start after the story breathes in — 1.2s delay
    const startTimeout = setTimeout(() => {
      state.currentSpeed = 0.5 // Faster start, will ramp up smoothly
      animationId = requestAnimationFrame(autoScroll)
    }, 1200)

    // User takes control — story pauses respectfully, then resumes smoothly
    const pauseAndResume = () => {
      userScrollingRef.current = true
      state.paused = true
      cancelAnimationFrame(animationId)
      clearTimeout(resumeTimeout)

      // Resume after 2.5s — story gently continues from where we are
      resumeTimeout = setTimeout(() => {
        userScrollingRef.current = false
        state.paused = false
        const atBottom = (window.innerHeight + window.scrollY) >= (document.documentElement.scrollHeight - 1)
        if (!atBottom) {
          // Don't reset speed — keep current speed for smooth continuation
          // Just slow down slightly to signal "I'm back"
          state.currentSpeed *= 0.5
          animationId = requestAnimationFrame(autoScroll)
        }
      }, 2500)
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
