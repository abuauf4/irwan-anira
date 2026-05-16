'use client'

import { useEffect, useRef, useCallback } from 'react'
import { gsap } from 'gsap'
import { prefersReducedMotion } from '@/lib/animations'

/*
  ═══════════════════════════════════════════════════════════
  SINGLE LEAF — Simbol Perjalanan
  
  Satu daun. Bukan partikel. Bukan dekorasi.
  
  Daun ini "hidup" sepanjang scroll.
  Dia melayang pelan, naik-turun,
  tapi ga pernah nyampe bawah.
  
  Karena perjalanan mereka belum selesai.
  
  Baru di ending...
  pas semua cerita udah selesai...
  daunnya akhirnya jatuh sampai bawah.
  
  Simbol: "Perjalanan mereka akhirnya sampai ke bab baru."
  ═══════════════════════════════════════════════════════════
*/

interface LeafState {
  x: number
  y: number
  baseX: number
  rotation: number
  rotationSpeed: number
  swayAmplitude: number
  swaySpeed: number
  swayOffset: number
  driftSpeed: number
  opacity: number
  scale: number
  element: HTMLDivElement
}

export default function SingleLeaf() {
  const containerRef = useRef<HTMLDivElement>(null)
  const leafRef = useRef<LeafState | null>(null)
  const animFrameRef = useRef<number>(0)
  const isFallingRef = useRef(false)
  const hasReachedBottomRef = useRef(false)
  const fallTargetYRef = useRef(0)
  const visibleRef = useRef(false)

  const createLeaf = useCallback((container: HTMLDivElement): LeafState => {
    const el = document.createElement('div')
    el.style.position = 'absolute'
    el.style.pointerEvents = 'none'
    el.style.willChange = 'transform, opacity'
    el.style.filter = 'drop-shadow(0 2px 6px rgba(0,0,0,0.2))'
    el.style.opacity = '0'

    // Daun Jawa — bentuk daun tropis Nusantara
    // Bukan maple leaf barat, tapi daun yang bisa kamu temui di halaman rumah Jawa
    const size = 30
    el.innerHTML = `
      <svg width="${size}" height="${size * 1.6}" viewBox="0 0 30 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <!-- Tangkai -->
        <path d="M15 45 Q15.5 43 15 41" stroke="#8B6914" stroke-width="0.9" fill="none" opacity="0.5"/>
        <!-- Daun utama — bentuk lonjong tropis, sedikit asimetris -->
        <path d="M15 2 Q24 9 26 17 Q27 26 23 34 Q19 42 15 46 Q11 42 7 34 Q3 26 4 17 Q6 9 15 2Z" 
              fill="#6B5B3A" opacity="0.8"/>
        <!-- Highlight kiri — cahaya dari kiri -->
        <path d="M15 3 Q8 9 6 17 Q5 24 7 32 Q9 38 12 42" 
              fill="rgba(201,169,110,0.06)" />
        <!-- Lipatan tengah — urat daun utama -->
        <path d="M15 4 Q15.3 18 15 32 Q14.7 40 15 46" 
              stroke="#4A3D28" stroke-width="0.7" fill="none" opacity="0.45"/>
        <!-- Urat samping kiri -->
        <path d="M15 9 Q10 11 6 15" stroke="#4A3D28" stroke-width="0.3" fill="none" opacity="0.3"/>
        <path d="M15 15 Q9 17 5 22" stroke="#4A3D28" stroke-width="0.3" fill="none" opacity="0.3"/>
        <path d="M15 21 Q9 23 5 28" stroke="#4A3D28" stroke-width="0.3" fill="none" opacity="0.25"/>
        <path d="M15 27 Q10 29 7 33" stroke="#4A3D28" stroke-width="0.3" fill="none" opacity="0.2"/>
        <path d="M15 33 Q11 35 9 38" stroke="#4A3D28" stroke-width="0.3" fill="none" opacity="0.15"/>
        <!-- Urat samping kanan -->
        <path d="M15 9 Q20 11 24 15" stroke="#4A3D28" stroke-width="0.3" fill="none" opacity="0.3"/>
        <path d="M15 15 Q21 17 25 22" stroke="#4A3D28" stroke-width="0.3" fill="none" opacity="0.3"/>
        <path d="M15 21 Q21 23 25 28" stroke="#4A3D28" stroke-width="0.3" fill="none" opacity="0.25"/>
        <path d="M15 27 Q20 29 23 33" stroke="#4A3D28" stroke-width="0.3" fill="none" opacity="0.2"/>
        <path d="M15 33 Q19 35 21 38" stroke="#4A3D28" stroke-width="0.3" fill="none" opacity="0.15"/>
        <!-- Tepi sobek kecil — daun tua yang sudah lewat musim -->
        <path d="M24 17 Q25.5 16 26 17.5" stroke="#4A3D28" stroke-width="0.5" fill="none" opacity="0.25"/>
        <path d="M6 24 Q4.5 23 4 24.5" stroke="#4A3D28" stroke-width="0.5" fill="none" opacity="0.25"/>
        <!-- Bintik kecil — daun yang udah lama hidup -->
        <circle cx="18" cy="20" r="0.5" fill="#4A3D28" opacity="0.15"/>
        <circle cx="11" cy="30" r="0.4" fill="#4A3D28" opacity="0.12"/>
      </svg>
    `

    container.appendChild(el)

    // Position: not too far left, not too far right
    const startX = window.innerWidth * 0.3 + Math.random() * window.innerWidth * 0.4

    const leaf: LeafState = {
      x: startX,
      y: -50,
      baseX: startX,
      rotation: Math.random() * 20 - 10,
      rotationSpeed: 0.12 + Math.random() * 0.15,
      swayAmplitude: 25 + Math.random() * 35,
      swaySpeed: 0.12 + Math.random() * 0.12,
      swayOffset: Math.random() * Math.PI * 2,
      driftSpeed: 0.04 + Math.random() * 0.08,
      opacity: 0,
      scale: 0.85 + Math.random() * 0.15,
      element: el,
    }

    return leaf
  }, [])

  useEffect(() => {
    if (prefersReducedMotion()) return

    const container = containerRef.current
    if (!container) return

    const leaf = createLeaf(container)
    leafRef.current = leaf

    const animate = (time: number) => {
      const t = time * 0.001
      const vh = window.innerHeight

      if (isFallingRef.current && !hasReachedBottomRef.current) {
        // ═══ FALLING — akhir cerita, daun jatuh sampai bawah ═══
        // Pelan. Berat. Penuh makna.
        // Seperti waktu yang akhirnya berhenti.
        const targetY = fallTargetYRef.current
        
        // Fall speed: sangat pelan, meaningful
        // Daun tua jatuh pelan — dia berat, tapi angin menahannya
        leaf.y += 0.25
        
        // Less sway when falling — the leaf is settling
        const fallSway = Math.sin(t * leaf.swaySpeed * 0.2 + leaf.swayOffset) * leaf.swayAmplitude * 0.1
        leaf.x = leaf.baseX + fallSway
        
        // Rotation slows — daun berhenti berputar
        leaf.rotation += leaf.rotationSpeed * 0.15
        
        // Opacity stabilizes as it reaches final position
        if (leaf.y > targetY * 0.6) {
          leaf.opacity = Math.min(0.75, leaf.opacity + 0.001)
        }

        if (leaf.y >= targetY) {
          leaf.y = targetY
          hasReachedBottomRef.current = true
          // Final settle — daun berhenti sepenuhnya
          // Sedikit goyang terakhir sebelum diam
          gsap.to(leaf.element, {
            rotation: leaf.rotation + (Math.random() > 0.5 ? 3 : -3),
            duration: 2,
            ease: 'power2.out',
          })
        }
      } else if (!isFallingRef.current) {
        // ═══ LIVING — daun melayang, hidup, ga nyampe bawah ═══
        // Dia bernapas. Dia hidup.
        // Tapi dia ga pernah nyampe bawah — karena cerita belum selesai.
        
        // Vertical: sinusoidal breathing — naik turun pelan
        // Range: 12% - 52% viewport — ga pernah lebih jauh
        const breathPhase = Math.sin(t * 0.06 + leaf.swayOffset)
        const breathNorm = breathPhase * 0.5 + 0.5 // 0 to 1
        const targetY = vh * 0.12 + breathNorm * vh * 0.4
        
        // Smooth lerp — daun mengambang, bukan teleport
        leaf.y += (targetY - leaf.y) * 0.002
        
        // Horizontal: gentle sway — angin halus di halaman Jawa
        const sway = Math.sin(t * leaf.swaySpeed + leaf.swayOffset) * leaf.swayAmplitude
        const drift = Math.sin(t * leaf.driftSpeed + leaf.swayOffset * 2) * 15
        leaf.x = leaf.baseX + sway + drift
        
        // Rotation: gentle turning, pelan seperti daun di angin
        leaf.rotation += Math.sin(t * 0.15) * leaf.rotationSpeed * 0.2
        
        // Opacity: breathe — the leaf is alive
        if (visibleRef.current) {
          const opacityBreath = 0.5 + Math.sin(t * 0.12 + leaf.swayOffset) * 0.2
          leaf.opacity = opacityBreath
        }
      }

      // Apply transforms
      const transform = `translate3d(${leaf.x}px, ${leaf.y}px, 0) rotate(${leaf.rotation}deg) scale(${leaf.scale})`
      leaf.element.style.transform = transform
      leaf.element.style.opacity = String(leaf.opacity)

      animFrameRef.current = requestAnimationFrame(animate)
    }

    animFrameRef.current = requestAnimationFrame(animate)

    // Fade in the leaf after 3 seconds — not immediately
    // Bismillah harus dibaca dulu sebelum perjalanan dimulai
    const fadeInTimeout = setTimeout(() => {
      visibleRef.current = true
    }, 3000)

    // ═══ Listen for closing event — daun jatuh ═══
    // Ini momen paling penting dari seluruh website
    // Daun yang selama ini hidup... akhirnya jatuh
    const handleClosingStart = () => {
      isFallingRef.current = true
      fallTargetYRef.current = window.innerHeight - 100
      // Slow down the sway as it begins to fall
      leaf.swayAmplitude *= 0.3
    }

    window.addEventListener('closing-sequence-start', handleClosingStart)

    return () => {
      clearTimeout(fadeInTimeout)
      cancelAnimationFrame(animFrameRef.current)
      window.removeEventListener('closing-sequence-start', handleClosingStart)
      leaf.element.remove()
      leafRef.current = null
    }
  }, [createLeaf])

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-30 overflow-hidden"
      aria-hidden="true"
    />
  )
}
