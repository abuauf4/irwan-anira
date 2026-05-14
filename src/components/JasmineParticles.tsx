'use client'

import { useEffect, useRef, useCallback } from 'react'
import { prefersReducedMotion } from '@/lib/animations'

interface Petal {
  x: number
  y: number
  size: number
  rotation: number
  rotationSpeed: number
  swayAmplitude: number
  swaySpeed: number
  swayOffset: number
  fallSpeed: number
  opacity: number
  element: HTMLDivElement
}

export default function JasmineParticles() {
  const containerRef = useRef<HTMLDivElement>(null)
  const petalsRef = useRef<Petal[]>([])
  const animFrameRef = useRef<number>(0)
  const scrollYRef = useRef(0)

  const createPetal = useCallback((container: HTMLDivElement): Petal => {
    const el = document.createElement('div')
    el.style.position = 'absolute'
    el.style.pointerEvents = 'none'
    el.style.willChange = 'transform, opacity'

    // Create jasmine petal SVG shape
    const size = 8 + Math.random() * 12
    el.innerHTML = `
      <svg width="${size}" height="${size * 1.2}" viewBox="0 0 20 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 0C10 0 14 4 14 10C14 16 10 24 10 24C10 24 6 16 6 10C6 4 10 0 10 0Z"
          fill="rgba(255, 250, 240, ${0.3 + Math.random() * 0.4})" />
        <path d="M10 2C10 2 13 5 13 10C13 15 10 22 10 22C10 22 7 15 7 10C7 5 10 2 10 2Z"
          fill="rgba(255, 245, 225, ${0.2 + Math.random() * 0.3})" />
      </svg>
    `

    container.appendChild(el)

    const petal: Petal = {
      x: Math.random() * window.innerWidth,
      y: -30 - Math.random() * 100,
      size,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 2,
      swayAmplitude: 30 + Math.random() * 50,
      swaySpeed: 0.5 + Math.random() * 1.5,
      swayOffset: Math.random() * Math.PI * 2,
      fallSpeed: 0.3 + Math.random() * 0.7,
      opacity: 0.4 + Math.random() * 0.5,
      element: el,
    }

    return petal
  }, [])

  useEffect(() => {
    if (prefersReducedMotion()) return

    const container = containerRef.current
    if (!container) return

    const maxPetals = 25
    let lastTime = 0
    const spawnInterval = 800 // ms between new petals

    // Initialize petals
    for (let i = 0; i < 12; i++) {
      const petal = createPetal(container)
      petal.y = Math.random() * window.innerHeight * 2
      petalsRef.current.push(petal)
    }

    const animate = (time: number) => {
      const delta = time - lastTime

      // Spawn new petal periodically
      if (delta > spawnInterval && petalsRef.current.length < maxPetals) {
        const newPetal = createPetal(container)
        petalsRef.current.push(newPetal)
        lastTime = time
      }

      const scrollDensity = Math.min(1, scrollYRef.current / 2000)

      petalsRef.current.forEach((petal, index) => {
        // Update position
        petal.y += petal.fallSpeed * (0.5 + scrollDensity * 0.5)
        const sway = Math.sin(time * 0.001 * petal.swaySpeed + petal.swayOffset) * petal.swayAmplitude
        petal.rotation += petal.rotationSpeed

        // Apply transforms
        const transform = `translate3d(${petal.x + sway}px, ${petal.y}px, 0) rotate(${petal.rotation}deg)`
        petal.element.style.transform = transform
        petal.element.style.opacity = String(petal.opacity)

        // Reset petal if it goes below viewport
        if (petal.y > window.innerHeight + 50) {
          petal.y = -30
          petal.x = Math.random() * window.innerWidth
          petal.opacity = 0.4 + Math.random() * 0.5
        }
      })

      // Remove excess petals
      if (petalsRef.current.length > maxPetals) {
        const toRemove = petalsRef.current.splice(maxPetals)
        toRemove.forEach((p) => p.element.remove())
      }

      animFrameRef.current = requestAnimationFrame(animate)
    }

    animFrameRef.current = requestAnimationFrame(animate)

    const handleScroll = () => {
      scrollYRef.current = window.scrollY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      cancelAnimationFrame(animFrameRef.current)
      window.removeEventListener('scroll', handleScroll)
      petalsRef.current.forEach((p) => p.element.remove())
      petalsRef.current = []
    }
  }, [createPetal])

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-30 overflow-hidden"
      aria-hidden="true"
    />
  )
}
