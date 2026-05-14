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

// Bismillah Section with typewriter animation on the quote text
function BismillahSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const arabicRef = useRef<HTMLDivElement>(null)
  const quoteRef = useRef<HTMLDivElement>(null)
  const sourceRef = useRef<HTMLDivElement>(null)
  const hasAnimated = useRef(false)

  // Typewriter effect: characters appear one by one with blinking cursor
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
      stagger: 0.035,
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
      onComplete: () => {
        cursor.remove()
      },
    }, '+=0.2')

    if (sourceEl) {
      tl.to(sourceEl, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out',
      }, '-=0.1')
    }
  }

  useEffect(() => {
    const ctx = gsap.context(() => {
      fadeIn(sectionRef.current!, { y: 30 })

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
    <section ref={sectionRef} className="py-20 px-6 text-center" style={{ background: 'var(--cream)', opacity: 0 }}>
      <div className="max-w-2xl mx-auto">
        <p ref={arabicRef} className="text-3xl sm:text-4xl md:text-5xl mb-6 leading-relaxed" style={{ fontFamily: 'var(--font-arabic)', color: 'var(--brown)', opacity: 0 }}>
          بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
        </p>
        <p ref={quoteRef} className="text-base sm:text-lg italic leading-relaxed min-h-[5em]" style={{ fontFamily: 'var(--font-serif)', color: 'var(--brown-light)' }}>
          &ldquo;Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu pasangan hidup dari jenismu sendiri, supaya kamu merasa tenteram kepadanya, dan dijadikan-Nya di antaramu rasa kasih dan sayang.&rdquo;
        </p>
        <p ref={sourceRef} className="mt-4 text-sm" style={{ fontFamily: 'var(--font-serif)', color: 'var(--brown-light)', opacity: 0 }}>
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

      if (groomRef.current) {
        slideIn(groomRef.current, 'left', { distance: 100, delay: 0.3 })
      }

      scaleIn(heartRef.current!, { delay: 0.6, fromScale: 0 })

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

// Diary Intro Section — Paper texture background, handwriting reveal, scroll storytelling
function DiaryIntroSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const strokeRef = useRef<HTMLDivElement>(null)
  const hasAnimated = useRef(false)

  function handwritingReveal(el: HTMLDivElement) {
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
      duration: 0.08,
      stagger: 0.03,
      ease: 'power1.out',
    })
  }

  useEffect(() => {
    const ctx = gsap.context(() => {
      fadeIn(sectionRef.current!, { y: 30 })

      // Ink stroke decoration draw-in
      if (strokeRef.current) {
        const svgPath = strokeRef.current.querySelector('path') as SVGPathElement | null
        if (svgPath) {
          try {
            const len = svgPath.getTotalLength()
            svgPath.style.strokeDasharray = String(len)
            svgPath.style.strokeDashoffset = String(len)
            gsap.to(svgPath, {
              strokeDashoffset: 0,
              duration: 2,
              ease: 'power2.inOut',
              scrollTrigger: {
                trigger: sectionRef.current!,
                start: 'top 75%',
                toggleActions: 'play none none none',
              },
            })
          } catch (e) {
            // Fallback
          }
        }
      }

      // Handwriting reveal on scroll for the diary text
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && !hasAnimated.current) {
              hasAnimated.current = true
              handwritingReveal(textRef.current!)
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
    <section ref={sectionRef} className="diary-paper-bg py-24 px-6 text-center relative overflow-hidden" style={{ opacity: 0 }}>
      {/* Ink stroke decoration */}
      <div ref={strokeRef} className="ink-stroke-line mb-8 max-w-xs mx-auto">
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

      <div className="max-w-xl mx-auto">
        <p ref={textRef} className="text-lg sm:text-xl italic leading-relaxed min-h-[4em]" style={{ fontFamily: 'var(--font-serif)', color: 'var(--brown)' }}>
          Kehendak-Nya menuntun kami pada pertemuan yang tak pernah disangka...
        </p>
      </div>

      {/* Bottom ink stroke decoration */}
      <div className="ink-stroke-line mt-8 max-w-xs mx-auto">
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
    </section>
  )
}

// Timeline Section — SVG Stroke Animation + Handwriting Reveal + Scroll Storytelling
// Renamed to "Love Journey", 3 items, diary-note-card effect
function TimelineSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement[]>([])
  const svgBordersRef = useRef<SVGPathElement[]>([])
  const timelineLineRef = useRef<HTMLDivElement>(null)
  const dotsRef = useRef<HTMLDivElement[]>([])
  const mobileDotsRef = useRef<HTMLDivElement[]>([])
  const titlesRef = useRef<HTMLHeadingElement[]>([])
  const descriptionsRef = useRef<HTMLDivElement[]>([])
  const progressRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!sectionRef.current || !wrapperRef.current) return

    const ctx = gsap.context(() => {
      const cards = cardsRef.current
      const svgBorders = svgBordersRef.current
      const dots = dotsRef.current
      const mobileDots = mobileDotsRef.current
      const titles = titlesRef.current
      const descriptions = descriptionsRef.current
      const timelineLine = timelineLineRef.current
      const progressBar = progressRef.current
      const section = sectionRef.current!

      // === STEP 1: Prepare all character spans ===
      const allTitleChars: HTMLSpanElement[][] = []
      const allDescChars: HTMLSpanElement[][] = []

      WEDDING.timeline.forEach((item, i) => {
        const title = titles[i]
        if (title) {
          const text = title.textContent || ''
          title.innerHTML = ''
          const chars: HTMLSpanElement[] = []
          for (const char of text) {
            const span = document.createElement('span')
            span.style.cssText = 'display:inline-block;will-change:opacity,transform;opacity:0;transform:translateY(6px) rotate(-3deg);'
            span.textContent = char === ' ' ? '\u00A0' : char
            title.appendChild(span)
            chars.push(span)
          }
          allTitleChars.push(chars)
        }

        const desc = descriptions[i]
        if (desc) {
          desc.innerHTML = ''
          const allC: HTMLSpanElement[] = []
          const words = item.description.split(' ')
          words.forEach((word, wi) => {
            const ws = document.createElement('span')
            ws.style.cssText = 'white-space:nowrap;display:inline;'
            for (let j = 0; j < word.length; j++) {
              const cs = document.createElement('span')
              cs.className = 'hw-char'
              cs.style.cssText = 'display:inline-block;will-change:opacity,transform;opacity:0;transform:translateY(3px) rotate(-2deg);min-width:0.08em;'
              cs.textContent = word[j]
              ws.appendChild(cs)
              allC.push(cs)
            }
            desc.appendChild(ws)
            if (wi < words.length - 1) {
              const sp = document.createElement('span')
              sp.innerHTML = '\u00A0'
              sp.style.display = 'inline'
              desc.appendChild(sp)
            }
          })
          allDescChars.push(allC)
        }
      })

      // === STEP 2: Initialize SVG stroke-dashoffset for borders ===
      svgBorders.forEach((path) => {
        if (path) {
          try {
            const len = path.getTotalLength()
            path.style.strokeDasharray = String(len)
            path.style.strokeDashoffset = String(len)
          } catch (e) {
            path.style.strokeDasharray = '2000'
            path.style.strokeDashoffset = '2000'
          }
        }
      })

      // === STEP 3: Set initial states ===
      cards.forEach((card) => {
        if (card) gsap.set(card, { opacity: 0, y: 30 })
      })
      dots.forEach((dot) => {
        if (dot) gsap.set(dot, { scale: 0, opacity: 0 })
      })
      mobileDots.forEach((dot) => {
        if (dot) gsap.set(dot, { scale: 0, opacity: 0 })
      })
      if (timelineLine) {
        gsap.set(timelineLine, { scaleY: 0, transformOrigin: 'top center' })
      }
      if (progressBar) {
        gsap.set(progressBar, { scaleX: 0, transformOrigin: 'left center' })
      }

      // === STEP 4: Build master timeline with scroll scrub ===
      const masterTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 10%',
          end: `+=${WEDDING.timeline.length * 120}%`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          onUpdate: (self) => {
            if (progressBar) {
              gsap.set(progressBar, { scaleX: self.progress })
            }
          },
        },
      })

      masterTl.to(section, { opacity: 1, duration: 0.3 })

      if (timelineLine) {
        masterTl.to(timelineLine, {
          scaleY: 1,
          duration: 0.4,
          ease: 'power2.inOut',
        })
      }

      WEDDING.timeline.forEach((_, index) => {
        const card = cards[index]
        const svgPath = svgBorders[index]
        const dot = dots[index]
        const mobileDot = mobileDots[index]
        const titleChars = allTitleChars[index]
        const descChars = allDescChars[index]

        if (!card) return

        masterTl.to(card, {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: 'power2.out',
        })

        if (svgPath) {
          masterTl.to(svgPath, {
            strokeDashoffset: 0,
            duration: 1,
            ease: 'power2.inOut',
          }, '-=0.3')
        }

        const cardEl = card.querySelector('.relative') as HTMLDivElement | null
        if (cardEl) {
          const cornerPaths = cardEl.querySelectorAll('.svg-corner-flourish')
          cornerPaths.forEach((cp) => {
            const pathEl = cp as SVGPathElement
            try {
              const cLen = pathEl.getTotalLength()
              pathEl.style.strokeDasharray = String(cLen)
              pathEl.style.strokeDashoffset = String(cLen)
            } catch (e) {
              pathEl.style.strokeDasharray = '100'
              pathEl.style.strokeDashoffset = '100'
            }
          })
          if (cornerPaths.length > 0) {
            masterTl.to(cornerPaths, {
              strokeDashoffset: 0,
              duration: 0.5,
              stagger: 0.1,
              ease: 'power2.inOut',
            }, '-=0.5')
          }
        }

        if (dot) {
          const dotRing = dot.querySelector('.timeline-dot-ring') as SVGPathElement | null
          masterTl.to(dot, {
            scale: 1,
            opacity: 1,
            duration: 0.4,
            ease: 'back.out(2.5)',
          }, '-=0.7')
          if (dotRing) {
            const ringLen = dotRing.getTotalLength ? dotRing.getTotalLength() : 163.36
            dotRing.style.strokeDasharray = String(ringLen)
            dotRing.style.strokeDashoffset = String(ringLen)
            masterTl.to(dotRing, {
              strokeDashoffset: 0,
              duration: 0.6,
              ease: 'power2.inOut',
            }, '-=0.3')
          }
        }
        if (mobileDot) {
          masterTl.to(mobileDot, {
            scale: 1,
            opacity: 1,
            duration: 0.4,
            ease: 'back.out(2.5)',
          }, '<')
        }

        if (titleChars && titleChars.length > 0) {
          masterTl.to(titleChars, {
            opacity: 1,
            y: 0,
            rotation: 0,
            duration: 0.2,
            stagger: 0.06,
            ease: 'power2.out',
          }, '-=0.5')
        }

        if (descChars && descChars.length > 0) {
          masterTl.to(descChars, {
            opacity: 1,
            y: 0,
            rotation: 0,
            duration: 0.08,
            stagger: 0.025,
            ease: 'power1.out',
          }, '-=0.2')
        }

        if (index < WEDDING.timeline.length - 1) {
          masterTl.to({}, { duration: 0.5 })
        }
      })

      masterTl.to({}, { duration: 0.3 })
    })

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="py-20 px-6 relative" style={{ background: 'var(--cream)', opacity: 0 }}>
      {/* Progress bar */}
      <div
        ref={progressRef}
        className="absolute top-0 left-0 right-0 h-[2px] z-20"
        style={{ background: 'linear-gradient(90deg, var(--gold-dark), var(--gold), var(--gold-dark))', transform: 'scaleX(0)', transformOrigin: 'left center' }}
      />

      <div ref={wrapperRef} className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl mb-2" style={{ fontFamily: 'var(--font-script)', color: 'var(--gold-dark)' }}>
          Love Journey
        </h2>
        <div className="ornament-divider max-w-xs mx-auto mb-16">
          <span className="text-[var(--gold)] text-lg">&#10047;</span>
        </div>

        <div className="relative">
          {/* Center line (desktop) */}
          <div ref={timelineLineRef} className="hidden sm:block absolute left-1/2 top-0 bottom-0 w-[2px] -translate-x-1/2" style={{ background: 'linear-gradient(to bottom, transparent, var(--gold), transparent)', transformOrigin: 'top center', transform: 'scaleY(0)' }} />

          {WEDDING.timeline.map((item, index) => (
            <div
              key={item.year}
              ref={(el) => { if (el) cardsRef.current[index] = el }}
              className={`relative flex flex-col sm:flex-row items-center mb-16 last:mb-0 ${
                index % 2 === 0 ? 'sm:flex-row' : 'sm:flex-row-reverse'
              }`}
            >
              {/* Timeline dot (desktop) */}
              <div
                ref={(el) => { if (el) dotsRef.current[index] = el }}
                className="hidden sm:flex absolute left-1/2 -translate-x-1/2 w-14 h-14 rounded-full items-center justify-center z-10"
                style={{ opacity: 0 }}
              >
                <svg width="56" height="56" viewBox="0 0 56 56" className="absolute inset-0">
                  <circle
                    cx="28" cy="28" r="26"
                    fill="none"
                    stroke="var(--gold)"
                    strokeWidth="2"
                    className="timeline-dot-ring"
                    style={{ strokeDasharray: 163.36, strokeDashoffset: 163.36 }}
                  />
                </svg>
                <span className="text-xs font-bold relative z-10" style={{ fontFamily: 'var(--font-body)', color: 'var(--gold-dark)' }}>
                  {item.year}
                </span>
              </div>

              {/* Content */}
              <div className={`w-full sm:w-[calc(50%-40px)] ${index % 2 === 0 ? 'sm:pr-12 sm:text-right' : 'sm:pl-12 sm:text-left'}`}>
                <div className="diary-note-card relative p-6 rounded-lg bg-white/80 backdrop-blur-sm shadow-md overflow-hidden" style={{ minHeight: '180px' }}>
                  {/* SVG Border */}
                  <svg
                    className="absolute inset-0 w-full h-full pointer-events-none"
                    viewBox="0 0 400 180"
                    preserveAspectRatio="none"
                  >
                    <path
                      ref={(el) => { if (el) svgBordersRef.current[index] = el }}
                      d="M 9 1 L 391 1 Q 399 1 399 9 L 399 171 Q 399 179 391 179 L 9 179 Q 1 179 1 171 L 1 9 Q 1 1 9 1 Z"
                      fill="none"
                      stroke="var(--gold)"
                      strokeWidth="1.5"
                      opacity="0.6"
                      vectorEffect="non-scaling-stroke"
                    />
                  </svg>

                  {/* Decorative SVG corner flourishes */}
                  <svg className="absolute top-0 left-0 w-10 h-10 pointer-events-none" viewBox="0 0 40 40">
                    <path
                      d="M 2 38 L 2 8 Q 2 2 8 2 L 38 2"
                      fill="none"
                      stroke="var(--gold)"
                      strokeWidth="1.5"
                      opacity="0.35"
                      className="svg-corner-flourish"
                    />
                  </svg>
                  <svg className="absolute bottom-0 right-0 w-10 h-10 pointer-events-none" viewBox="0 0 40 40">
                    <path
                      d="M 38 2 L 38 32 Q 38 38 32 38 L 2 38"
                      fill="none"
                      stroke="var(--gold)"
                      strokeWidth="1.5"
                      opacity="0.35"
                      className="svg-corner-flourish"
                    />
                  </svg>

                  {/* Mobile year dot */}
                  <div className="sm:hidden flex items-center justify-center mb-3">
                    <div
                      ref={(el) => { if (el) mobileDotsRef.current[index] = el }}
                      className="w-12 h-12 rounded-full border-2 border-[var(--gold)] flex items-center justify-center"
                      style={{ background: 'var(--cream)', opacity: 0 }}
                    >
                      <span className="text-xs font-bold" style={{ fontFamily: 'var(--font-body)', color: 'var(--gold-dark)' }}>
                        {item.year}
                      </span>
                    </div>
                  </div>

                  <h3
                    ref={(el) => { if (el) titlesRef.current[index] = el }}
                    className="text-xl sm:text-2xl mb-3 relative z-10"
                    style={{ fontFamily: 'var(--font-script)', color: 'var(--gold-dark)' }}
                  >
                    {item.title}
                  </h3>

                  <div
                    ref={(el) => { if (el) descriptionsRef.current[index] = el }}
                    className="text-sm leading-relaxed min-h-[3em] relative z-10"
                    style={{ fontFamily: 'var(--font-serif)', color: 'var(--brown-light)' }}
                  />
                </div>
              </div>

              {/* Empty space for layout */}
              <div className="hidden sm:block w-[calc(50%-40px)]" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Lamaran Section — Handwriting reveal, soft zoom photo, petal floating
function LamaranSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const photoRef = useRef<HTMLDivElement>(null)
  const hasAnimated = useRef(false)

  function handwritingReveal(el: HTMLDivElement) {
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
      duration: 0.08,
      stagger: 0.025,
      ease: 'power1.out',
      delay: 0.3,
    })
  }

  useEffect(() => {
    const ctx = gsap.context(() => {
      fadeIn(sectionRef.current!, { y: 30 })

      // Soft zoom on photo
      if (photoRef.current) {
        gsap.fromTo(photoRef.current,
          { scale: 1.15, opacity: 0 },
          {
            scale: 1.05,
            opacity: 1,
            duration: 2,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: sectionRef.current!,
              start: 'top 70%',
              toggleActions: 'play none none none',
            },
          }
        )
      }

      // Title fade in
      if (titleRef.current) {
        gsap.fromTo(titleRef.current,
          { opacity: 0, y: 20, letterSpacing: '0.5em' },
          {
            opacity: 1,
            y: 0,
            letterSpacing: '0.3em',
            duration: 1.2,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: sectionRef.current!,
              start: 'top 75%',
              toggleActions: 'play none none none',
            },
          }
        )
      }

      // Handwriting reveal for text
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && !hasAnimated.current) {
              hasAnimated.current = true
              handwritingReveal(textRef.current!)
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
    <section ref={sectionRef} className="relative py-24 px-6 text-center overflow-hidden" style={{ opacity: 0 }}>
      {/* Background with soft zoom */}
      <div
        ref={photoRef}
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/quote-bg.jpg')", opacity: 0 }}
      />
      <div className="absolute inset-0 bg-[var(--cream-dark)]/85" />

      {/* Subtle petal overlay */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[10%] left-[15%] w-3 h-3 rounded-full opacity-20 animate-float" style={{ background: 'var(--gold-light)', animationDelay: '0s' }} />
        <div className="absolute top-[30%] right-[20%] w-2 h-2 rounded-full opacity-15 animate-float" style={{ background: 'var(--gold)', animationDelay: '1.5s' }} />
        <div className="absolute bottom-[25%] left-[25%] w-2 h-2 rounded-full opacity-15 animate-float" style={{ background: 'var(--gold-light)', animationDelay: '3s' }} />
      </div>

      <div ref={contentRef} className="relative z-10 max-w-2xl mx-auto">
        <h3
          ref={titleRef}
          className="text-2xl sm:text-3xl tracking-[0.3em] uppercase mb-8"
          style={{ fontFamily: 'var(--font-body)', color: 'var(--gold-dark)', opacity: 0 }}
        >
          LAMARAN
        </h3>

        <div className="ornament-divider max-w-xs mx-auto mb-8">
          <span className="text-[var(--gold)] text-lg">&#10047;</span>
        </div>

        <p ref={textRef} className="text-base sm:text-lg italic leading-relaxed min-h-[6em]" style={{ fontFamily: 'var(--font-serif)', color: 'var(--brown)' }}>
          Kehendak-Nya menuntun kami pada pertemuan yang tak pernah disangka hingga akhirnya membawa kami pada sebuah ikatan suci yang dicintai-Nya, kami melangsungkan acara lamaran pada 31 Agustus 2025.
        </p>
      </div>
    </section>
  )
}

// Menikah Section — Cinematic fade with slow zoom background, gold light leak
function MenikahSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const bgRef = useRef<HTMLDivElement>(null)
  const hasAnimated = useRef(false)

  function handwritingReveal(el: HTMLDivElement) {
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
      duration: 0.08,
      stagger: 0.02,
      ease: 'power1.out',
      delay: 0.5,
    })
  }

  useEffect(() => {
    const ctx = gsap.context(() => {
      fadeIn(sectionRef.current!, { y: 30 })

      // Cinematic slow zoom on background
      if (bgRef.current) {
        gsap.fromTo(bgRef.current,
          { scale: 1 },
          {
            scale: 1.15,
            duration: 20,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current!,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          }
        )
      }

      // Title cinematic fade
      if (titleRef.current) {
        gsap.fromTo(titleRef.current,
          { opacity: 0, y: 30, scale: 0.9, filter: 'blur(8px)' },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            filter: 'blur(0px)',
            duration: 1.5,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current!,
              start: 'top 70%',
              toggleActions: 'play none none none',
            },
          }
        )
      }

      // Handwriting reveal for text
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && !hasAnimated.current) {
              hasAnimated.current = true
              handwritingReveal(textRef.current!)
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
    <section ref={sectionRef} className="relative py-28 px-6 text-center overflow-hidden" style={{ opacity: 0 }}>
      {/* Background with slow zoom */}
      <div
        ref={bgRef}
        className="absolute inset-[-5%] bg-cover bg-center"
        style={{ backgroundImage: "url('/images/countdown-bg.jpg')" }}
      />
      <div className="absolute inset-0 bg-[var(--brown)]/80" />

      {/* Gold light leak overlay */}
      <div className="gold-light-leak absolute inset-0 pointer-events-none" />

      <div ref={contentRef} className="relative z-10 max-w-2xl mx-auto">
        <h3
          ref={titleRef}
          className="text-3xl sm:text-4xl tracking-[0.3em] uppercase mb-8"
          style={{ fontFamily: 'var(--font-body)', color: 'var(--gold-light)', opacity: 0 }}
        >
          MENIKAH
        </h3>

        <div className="ornament-divider max-w-xs mx-auto mb-8">
          <span className="text-[var(--gold)] text-lg">&#10047;</span>
        </div>

        <p ref={textRef} className="text-base sm:text-lg italic leading-relaxed min-h-[8em]" style={{ fontFamily: 'var(--font-serif)', color: 'var(--gold-light)' }}>
          Percayalah, bukan karena bertemu lalu berjodoh, tapi karena berjodohlah kami dipertemukan. Atas izin Allah kami memutuskan untuk mengikrarkan janji suci pernikahan pada 05 Juli 2026. Sebagaimana yang pernah dikatakan oleh Sayyidina Ali bin Abi Thalib: &ldquo;Apa yang menjadi takdirmu akan menemukan jalannya untuk menemukanmu.&rdquo;
        </p>
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

      if (bgRef.current) {
        parallaxScroll(bgRef.current, { speed: 0.15 })
      }

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
              <span className="text-xs sm:text-sm tracking-wider uppercase" style={{ fontFamily: 'var(--font-body)', color: 'var(--gold-light)' }}>
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

// Gallery Section — Polaroid Memory Gallery with rotation, paper frame, hover zoom
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

  // Alternating rotation for polaroid effect
  const rotations = WEDDING.galleryImages.map((_, i) =>
    i % 2 === 0 ? -2 : 1.5
  )

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
              className="polaroid-frame relative aspect-square overflow-hidden cursor-pointer group"
              onClick={() => openLightbox(index)}
              style={{ opacity: 0, transform: `rotate(${rotations[index]}deg)` }}
            >
              <img
                src={src}
                alt={`Gallery ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
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

// Closing Section — Diary page closing animation, jasmine petals, gold shimmer names
function ClosingSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const text1Ref = useRef<HTMLDivElement>(null)
  const text2Ref = useRef<HTMLDivElement>(null)
  const doaRef = useRef<HTMLDivElement>(null)
  const namesRef = useRef<HTMLDivElement>(null)
  const hasAnimated = useRef(false)

  function createHandwritingChars(el: HTMLDivElement): HTMLSpanElement[] {
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
    return allChars
  }

  function runClosingAnimation() {
    const tl = gsap.timeline()

    // Text 1 handwriting reveal
    if (text1Ref.current) {
      const chars = createHandwritingChars(text1Ref.current)
      tl.to(chars, {
        opacity: 1,
        y: 0,
        rotation: 0,
        duration: 0.06,
        stagger: 0.02,
        ease: 'power1.out',
      })
    }

    // Text 2 handwriting reveal
    if (text2Ref.current) {
      const chars = createHandwritingChars(text2Ref.current)
      tl.to(chars, {
        opacity: 1,
        y: 0,
        rotation: 0,
        duration: 0.06,
        stagger: 0.02,
        ease: 'power1.out',
      }, '-=0.3')
    }

    // Doa fades in
    if (doaRef.current) {
      tl.to(doaRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
      }, '-=0.2')
    }

    // Names with gold shimmer
    if (namesRef.current) {
      tl.fromTo(namesRef.current,
        { opacity: 0, scale: 0.8, filter: 'blur(6px)' },
        {
          opacity: 1,
          scale: 1,
          filter: 'blur(0px)',
          duration: 1,
          ease: 'power3.out',
        },
        '-=0.4'
      )
    }
  }

  useEffect(() => {
    const ctx = gsap.context(() => {
      fadeIn(sectionRef.current!, { y: 30 })

      // Diary page closing animation triggered on scroll
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && !hasAnimated.current) {
              hasAnimated.current = true
              runClosingAnimation()
            }
          })
        },
        { threshold: 0.2 }
      )

      if (sectionRef.current) {
        observer.observe(sectionRef.current)
      }

      return () => observer.disconnect()
    })

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="diary-page-close relative py-28 px-6 text-center overflow-hidden" style={{ background: 'var(--cream-dark)', opacity: 0 }}>
      {/* Jasmine petals floating */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[5%] left-[10%] w-3 h-3 rounded-full opacity-25 animate-float" style={{ background: 'var(--gold-light)', animationDelay: '0s' }} />
        <div className="absolute top-[15%] right-[12%] w-2 h-2 rounded-full opacity-20 animate-float" style={{ background: 'var(--gold)', animationDelay: '2s' }} />
        <div className="absolute top-[40%] left-[8%] w-2 h-2 rounded-full opacity-20 animate-float" style={{ background: 'var(--gold-light)', animationDelay: '4s' }} />
        <div className="absolute top-[55%] right-[15%] w-3 h-3 rounded-full opacity-15 animate-float" style={{ background: 'var(--gold)', animationDelay: '1s' }} />
        <div className="absolute bottom-[20%] left-[20%] w-2 h-2 rounded-full opacity-20 animate-float" style={{ background: 'var(--gold-light)', animationDelay: '3s' }} />
        <div className="absolute bottom-[35%] right-[10%] w-3 h-3 rounded-full opacity-15 animate-float" style={{ background: 'var(--gold)', animationDelay: '5s' }} />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto">
        {/* Ink stroke top */}
        <div className="ink-stroke-line mb-10 max-w-xs mx-auto">
          <svg viewBox="0 0 300 20" className="w-full h-5" fill="none">
            <path
              d="M 5 15 Q 50 2 100 12 Q 150 22 200 8 Q 250 -2 295 15"
              stroke="var(--gold)"
              strokeWidth="1.5"
              fill="none"
              opacity="0.4"
            />
          </svg>
        </div>

        <p ref={text1Ref} className="text-lg sm:text-xl italic leading-relaxed mb-6 min-h-[2em]" style={{ fontFamily: 'var(--font-serif)', color: 'var(--brown)' }}>
          Dan seperti semua cerita indah yang dituliskan semesta, kisah kami baru saja dimulai.
        </p>

        <p ref={text2Ref} className="text-base sm:text-lg italic leading-relaxed mb-8 min-h-[3em]" style={{ fontFamily: 'var(--font-serif)', color: 'var(--brown-light)' }}>
          Terima kasih telah menjadi bagian dari perjalanan kecil kami menuju selamanya.
        </p>

        <div ref={doaRef} className="bg-white/60 backdrop-blur-sm rounded-lg p-6 border border-[var(--gold)]/20 max-w-lg mx-auto mb-10" style={{ opacity: 0 }}>
          <p className="text-sm sm:text-base leading-relaxed italic" style={{ fontFamily: 'var(--font-serif)', color: 'var(--brown)' }}>
            Semoga Allah senantiasa memberkahi rumah tangga kami dengan sakinah, mawaddah, dan rahmah.
          </p>
        </div>

        {/* Nama mempelai with gold shimmer */}
        <div ref={namesRef} style={{ opacity: 0 }}>
          <h3 className="gold-shimmer text-4xl sm:text-5xl mb-2" style={{ fontFamily: 'var(--font-script)' }}>
            Irwan & Anira
          </h3>
          <div className="ornament-divider max-w-[120px] mx-auto mt-4">
            <span className="text-[var(--gold)] text-xs">&#10047;</span>
          </div>
        </div>
      </div>
    </section>
  )
}

// Footer Section — With "Forever starts with Bismillah.", gold shimmer, batik pattern
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
      className="relative py-20 px-6 text-center overflow-hidden batik-kawung-dark"
    >
      <div
        ref={bgRef}
        className="absolute inset-[-20%] bg-cover bg-center"
        style={{ backgroundImage: "url('/images/footer-bg.jpg')" }}
      />
      <div className="absolute inset-0 bg-[var(--brown)]/80" />
      {/* Batik pattern overlay */}
      <div className="absolute inset-0 batik-kawung-dark pointer-events-none opacity-30" />

      <div ref={contentRef} className="relative z-10 max-w-2xl mx-auto" style={{ opacity: 0 }}>
        <p className="text-sm tracking-[0.3em] uppercase mb-4" style={{ fontFamily: 'var(--font-body)', color: 'var(--gold-light)' }}>
          Terima Kasih
        </p>
        <h2 className="gold-shimmer text-4xl sm:text-5xl md:text-6xl mb-4" style={{ fontFamily: 'var(--font-script)' }}>
          Irwan & Anira
        </h2>
        <div className="ornament-divider max-w-xs mx-auto mb-6">
          <span className="text-[var(--gold)] text-lg">&#10047;</span>
        </div>
        <p className="text-sm leading-relaxed mb-4" style={{ fontFamily: 'var(--font-serif)', color: 'var(--gold-light)' }}>
          Atas kehadiran dan doa restu yang kalian berikan,<br />
          kami mengucapkan terima kasih.<br />
          Semoga Allah membalas kebaikan kalian.
        </p>
        <p className="text-base italic tracking-wider mb-6" style={{ fontFamily: 'var(--font-script)', color: 'var(--gold-light)' }}>
          Forever starts with Bismillah.
        </p>
        <p className="text-xs tracking-wider" style={{ fontFamily: 'var(--font-body)', color: 'rgba(201, 169, 110, 0.6)' }}>
          05 . 07 . 2026
        </p>
      </div>
    </section>
  )
}

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

  const heroRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen || !heroRef.current) return

    const ctx = gsap.context(() => {
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

      {/* Cover - always visible first */}
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
            <DiaryIntroSection />
            <TimelineSection />
            <LamaranSection />
            <MenikahSection />
            <CountdownSection />
            <EventSection />
            <GallerySection />
            <GuestWishes />
            <ClosingSection />
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
