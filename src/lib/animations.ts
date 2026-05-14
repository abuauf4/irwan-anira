'use client'

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

// Check for reduced motion preference
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

// ========== FADE IN ==========
export function fadeIn(
  element: Element,
  options: {
    delay?: number
    duration?: number
    y?: number
    x?: number
    scrollTrigger?: ScrollTrigger.Vars
  } = {}
) {
  const { delay = 0, duration = 1, y = 40, x = 0, scrollTrigger } = options

  if (prefersReducedMotion()) {
    gsap.set(element, { opacity: 1, y: 0, x: 0 })
    return
  }

  gsap.fromTo(
    element,
    { opacity: 0, y, x, willChange: 'transform, opacity' },
    {
      opacity: 1,
      y: 0,
      x: 0,
      duration,
      delay,
      ease: 'power3.out',
      scrollTrigger: scrollTrigger || {
        trigger: element,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
    }
  )
}

// ========== SLIDE IN ==========
export function slideIn(
  element: Element,
  direction: 'left' | 'right' | 'up' | 'down' = 'left',
  options: {
    delay?: number
    duration?: number
    distance?: number
    scrollTrigger?: ScrollTrigger.Vars
  } = {}
) {
  const { delay = 0, duration = 1, distance = 80, scrollTrigger } = options

  if (prefersReducedMotion()) {
    gsap.set(element, { opacity: 1, x: 0, y: 0 })
    return
  }

  const from: gsap.TweenVars = { opacity: 0, willChange: 'transform, opacity' }
  const to: gsap.TweenVars = {
    opacity: 1,
    duration,
    delay,
    ease: 'power3.out',
    scrollTrigger: scrollTrigger || {
      trigger: element,
      start: 'top 85%',
      toggleActions: 'play none none none',
    },
  }

  switch (direction) {
    case 'left':
      from.x = -distance
      to.x = 0
      break
    case 'right':
      from.x = distance
      to.x = 0
      break
    case 'up':
      from.y = distance
      to.y = 0
      break
    case 'down':
      from.y = -distance
      to.y = 0
      break
  }

  gsap.fromTo(element, from, to)
}

// ========== SCALE IN ==========
export function scaleIn(
  element: Element,
  options: {
    delay?: number
    duration?: number
    fromScale?: number
    scrollTrigger?: ScrollTrigger.Vars
  } = {}
) {
  const { delay = 0, duration = 0.8, fromScale = 0.8, scrollTrigger } = options

  if (prefersReducedMotion()) {
    gsap.set(element, { opacity: 1, scale: 1 })
    return
  }

  gsap.fromTo(
    element,
    { opacity: 0, scale: fromScale, willChange: 'transform, opacity' },
    {
      opacity: 1,
      scale: 1,
      duration,
      delay,
      ease: 'back.out(1.4)',
      scrollTrigger: scrollTrigger || {
        trigger: element,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
    }
  )
}

// ========== STAGGER ANIMATION ==========
export function staggerReveal(
  elements: Element[],
  options: {
    delay?: number
    duration?: number
    stagger?: number
    y?: number
    x?: number
    scrollTrigger?: ScrollTrigger.Vars
  } = {}
) {
  const { delay = 0, duration = 0.8, stagger = 0.15, y = 50, x = 0, scrollTrigger } = options

  if (prefersReducedMotion()) {
    gsap.set(elements, { opacity: 1, y: 0, x: 0 })
    return
  }

  gsap.fromTo(
    elements,
    { opacity: 0, y, x, willChange: 'transform, opacity' },
    {
      opacity: 1,
      y: 0,
      x: 0,
      duration,
      delay,
      stagger,
      ease: 'power3.out',
      scrollTrigger: scrollTrigger || {
        trigger: elements[0],
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
    }
  )
}

// ========== PARALLAX SCROLL ==========
export function parallaxScroll(
  element: Element,
  options: {
    speed?: number
    scrollTrigger?: ScrollTrigger.Vars
  } = {}
) {
  const { speed = 0.3, scrollTrigger } = options

  if (prefersReducedMotion()) return

  gsap.to(element, {
    y: () => speed * 100,
    ease: 'none',
    scrollTrigger: scrollTrigger || {
      trigger: element,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
    },
  })
}

// ========== TEXT REVEAL (character by character) ==========
export function textReveal(
  element: Element,
  options: {
    duration?: number
    stagger?: number
    delay?: number
    scrollTrigger?: ScrollTrigger.Vars
  } = {}
) {
  const { duration = 0.05, stagger = 0.03, delay = 0, scrollTrigger } = options

  if (prefersReducedMotion()) {
    gsap.set(element, { opacity: 1 })
    const chars = element.querySelectorAll('.char')
    gsap.set(chars, { opacity: 1 })
    return
  }

  const text = element.textContent || ''
  element.innerHTML = ''

  // Create wrapper
  const wrapper = document.createElement('span')
  wrapper.style.display = 'inline-block'
  wrapper.style.overflow = 'hidden'

  // Split into characters
  const chars: HTMLSpanElement[] = []
  for (const char of text) {
    const span = document.createElement('span')
    span.className = 'char'
    span.style.display = 'inline-block'
    span.style.willChange = 'transform, opacity'
    span.textContent = char === ' ' ? '\u00A0' : char
    span.style.opacity = '0'
    span.style.transform = 'translateY(100%)'
    wrapper.appendChild(span)
    chars.push(span)
  }

  element.appendChild(wrapper)
  element.style.opacity = '1'

  gsap.to(chars, {
    opacity: 1,
    y: 0,
    duration,
    stagger,
    delay,
    ease: 'power2.out',
    scrollTrigger: scrollTrigger || {
      trigger: element,
      start: 'top 85%',
      toggleActions: 'play none none none',
    },
  })
}

// ========== IMAGE REVEAL WITH MASK ==========
export function imageReveal(
  element: Element,
  options: {
    duration?: number
    delay?: number
    scrollTrigger?: ScrollTrigger.Vars
  } = {}
) {
  const { duration = 1.2, delay = 0, scrollTrigger } = options

  if (prefersReducedMotion()) {
    gsap.set(element, { clipPath: 'inset(0% 0% 0% 0%)', opacity: 1 })
    return
  }

  gsap.fromTo(
    element,
    {
      clipPath: 'inset(100% 0% 0% 0%)',
      opacity: 0,
      willChange: 'clip-path, opacity',
    },
    {
      clipPath: 'inset(0% 0% 0% 0%)',
      opacity: 1,
      duration,
      delay,
      ease: 'power4.inOut',
      scrollTrigger: scrollTrigger || {
        trigger: element,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
    }
  )
}

// ========== SMOOTH COUNTER ANIMATION ==========
export function counterAnimation(
  element: Element,
  options: {
    endValue: number
    duration?: number
    delay?: number
    scrollTrigger?: ScrollTrigger.Vars
  }
) {
  const { endValue, duration = 2, delay = 0, scrollTrigger } = options

  if (prefersReducedMotion()) {
    element.textContent = String(endValue)
    return
  }

  const obj = { value: 0 }
  gsap.to(obj, {
    value: endValue,
    duration,
    delay,
    ease: 'power2.out',
    onUpdate: () => {
      element.textContent = String(Math.floor(obj.value))
    },
    scrollTrigger: scrollTrigger || {
      trigger: element,
      start: 'top 85%',
      toggleActions: 'play none none none',
    },
  })
}

// ========== FLIP IN (for cards) ==========
export function flipIn(
  element: Element,
  options: {
    delay?: number
    duration?: number
    scrollTrigger?: ScrollTrigger.Vars
  } = {}
) {
  const { delay = 0, duration = 0.8, scrollTrigger } = options

  if (prefersReducedMotion()) {
    gsap.set(element, { opacity: 1, rotateY: 0 })
    return
  }

  gsap.fromTo(
    element,
    {
      opacity: 0,
      rotateY: 90,
      transformPerspective: 800,
      willChange: 'transform, opacity',
    },
    {
      opacity: 1,
      rotateY: 0,
      duration,
      delay,
      ease: 'back.out(1.4)',
      scrollTrigger: scrollTrigger || {
        trigger: element,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
    }
  )
}

// ========== MAGNETIC HOVER ==========
export function magneticHover(element: HTMLElement, strength: number = 0.3) {
  if (prefersReducedMotion()) return

  const handleMouseMove = (e: MouseEvent) => {
    const rect = element.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2

    gsap.to(element, {
      x: x * strength,
      y: y * strength,
      duration: 0.4,
      ease: 'power2.out',
    })
  }

  const handleMouseLeave = () => {
    gsap.to(element, {
      x: 0,
      y: 0,
      duration: 0.6,
      ease: 'elastic.out(1, 0.4)',
    })
  }

  element.addEventListener('mousemove', handleMouseMove)
  element.addEventListener('mouseleave', handleMouseLeave)

  return () => {
    element.removeEventListener('mousemove', handleMouseMove)
    element.removeEventListener('mouseleave', handleMouseLeave)
  }
}

// ========== SECTION OPACITY FADE ==========
export function sectionOpacityFade(
  element: Element,
  options: {
    scrollTrigger?: ScrollTrigger.Vars
  } = {}
) {
  if (prefersReducedMotion()) return

  const { scrollTrigger } = options

  gsap.fromTo(
    element,
    { opacity: 0 },
    {
      opacity: 1,
      duration: 0.5,
      scrollTrigger: scrollTrigger || {
        trigger: element,
        start: 'top 90%',
        end: 'top 40%',
        scrub: true,
      },
    }
  )
}

// ========== CURSOR FOLLOWER ==========
export function initCursorFollower(element: HTMLElement) {
  if (prefersReducedMotion()) return

  gsap.set(element, { xPercent: -50, yPercent: -50 })

  const pos = { x: 0, y: 0 }

  const handleMouseMove = (e: MouseEvent) => {
    pos.x = e.clientX
    pos.y = e.clientY
  }

  window.addEventListener('mousemove', handleMouseMove)

  gsap.ticker.add(() => {
    gsap.to(element, {
      x: pos.x,
      y: pos.y + window.scrollY,
      duration: 0.5,
      ease: 'power2.out',
    })
  })

  return () => {
    window.removeEventListener('mousemove', handleMouseMove)
  }
}

// ========== CLEANUP ALL SCROLL TRIGGERS ==========
export function killAllScrollTriggers() {
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
}
