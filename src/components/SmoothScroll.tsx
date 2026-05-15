'use client'

import { useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

interface SmoothScrollProps {
  children: React.ReactNode
}

export default function SmoothScroll({ children }: SmoothScrollProps) {
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (prefersReduced) return

    // Simple scroll → ScrollTrigger integration
    // NO Lenis — auto-scroll handles its own smooth scrolling via lerp
    // Lenis was fighting with auto-scroll (window.scrollBy vs Lenis interpolation)
    // causing the "macet" stuttering effect
    // Browser native scroll is smooth enough for user-initiated scrolls

    // Keep lagSmoothing(0) for GSAP animation stability
    gsap.ticker.lagSmoothing(0)

    return () => {
      // Cleanup handled by GSAP automatically
    }
  }, [])

  return <>{children}</>
}
