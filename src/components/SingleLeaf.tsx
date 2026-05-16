'use client'

import { useEffect, useRef, useCallback } from 'react'
import { gsap } from 'gsap'
import { prefersReducedMotion } from '@/lib/animations'

/*
  ═══════════════════════════════════════════════════════════
  SINGLE LEAF — Daun Maple Kering, Simbol Perjalanan

  Satu daun maple kering. Agak ngelipet. Pucat kecoklatan.
  Bukan partikel. Bukan dekorasi.

  Daun ini "hidup" sepanjang scroll.
  Dia melayang alami — kadang kebawa angin, kadang diam,
  kadang muter pelan, kadang oleng ke sisi.
  Tapi ga pernah nyampe bawah.

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
  rotationX: number    // 3D lipatan — rotateX untuk efek ngelipet
  rotationY: number    // 3D lipatan — rotateY untuk efek ngelipet
  tiltAmount: number   // seberapa banyak lipatan
  velocityX: number    // kecepatan horizontal saat ini
  velocityY: number    // kecepatan vertikal saat ini
  angularVelocity: number  // kecepatan rotasi saat ini
  swayPhase: number    // fase sway — biar ga terlalu sinusoidal
  driftPhase: number   // fase drift — pergerakan horizontal
  wobblePhase: number  // fase oleng — daun kering sering oleng
  opacity: number
  scale: number
  element: HTMLDivElement
  // Wind gust system — angin yang datang dan pergi
  windGustX: number
  windGustY: number
  nextGustTime: number
  gustDuration: number
  gustStartTime: number
  gustActive: boolean
}

export default function SingleLeaf() {
  const containerRef = useRef<HTMLDivElement>(null)
  const leafRef = useRef<LeafState | null>(null)
  const animFrameRef = useRef<number>(0)
  const isFallingRef = useRef(false)
  const hasReachedBottomRef = useRef(false)
  const fallTargetYRef = useRef(0)
  const visibleRef = useRef(false)
  const startTimeRef = useRef(0)

  const createLeaf = useCallback((container: HTMLDivElement): LeafState => {
    const el = document.createElement('div')
    el.style.position = 'absolute'
    el.style.pointerEvents = 'none'
    el.style.willChange = 'transform, opacity'
    el.style.filter = 'drop-shadow(1px 2px 4px rgba(0,0,0,0.15))'
    el.style.opacity = '0'
    el.style.perspective = '800px'

    // ═══ Daun Maple Kering — ngelipet, pucat, natural ═══
    // Bukan maple leaf barat yang rapih — ini daun maple yang udah kering,
    // agak ngelipet di tepi, warna udah memudar ke coklat-kuning
    const size = 28
    el.innerHTML = `
      <svg width="${size}" height="${size * 1.15}" viewBox="0 0 28 32" fill="none" xmlns="http://www.w3.org/2000/svg" style="transform-style:preserve-3d;">
        <!-- Tangkai — tipis, agak melengkung kaya daun kering -->
        <path d="M14 30 Q13.5 28 13.8 26 Q14.2 24 14 22" stroke="#7A5C2E" stroke-width="0.7" fill="none" opacity="0.5"/>

        <!-- Daun maple utama — 5 lobus, agak asimetris (daun kering ga rapih) -->
        <!-- Lobi tengah (paling besar) -->
        <path d="M14 1 Q15.5 4 17 3 Q18.5 2 18 5 Q19 4 19.5 6 Q20 8 18 9 Q19 10 20 11 Q21 13 18.5 13 Q20 14 19.5 16 Q19 18 17 16 Q17.5 18 17 20 Q16 22 14 22 Q12 22 11 20 Q10.5 18 11 16 Q9 18 8.5 16 Q8 14 9.5 13 Q7 13 8 11 Q9 10 10 9 Q8 8 8.5 6 Q9 4 10 5 Q9.5 2 11 3 Q12.5 4 14 1Z"
              fill="#8B6B3A" opacity="0.75"/>

        <!-- Layer kedua — warna lebih gelap di bagian yang ngelipet ke dalam -->
        <!-- Efek ngelipet: sisi kiri agak melipat, jadi lebih gelap -->
        <path d="M14 1 Q12.5 4 11 3 Q9.5 2 10 5 Q9 4 8.5 6 Q8 8 10 9 Q9 10 8 11 Q7 13 9.5 13 Q8 14 8.5 16 Q9 18 11 16 Q10.5 18 11 20 Q12 22 14 22"
              fill="#6B4F2A" opacity="0.3"/>

        <!-- Highlight — cahaya dari kanan atas, daun kering agak transparan -->
        <path d="M14 3 Q16 5 17 8 Q18 11 17 14 Q16 17 14 19"
              fill="rgba(201,169,110,0.08)" />

        <!-- Urat utama — dari tangkai ke ujung tiap lobus -->
        <path d="M14 22 L14 3" stroke="#5A4220" stroke-width="0.5" fill="none" opacity="0.35"/>
        <!-- Urat ke lobi kanan atas -->
        <path d="M14 12 Q16 10 18 8" stroke="#5A4220" stroke-width="0.3" fill="none" opacity="0.25"/>
        <!-- Urat ke lobi kiri atas -->
        <path d="M14 12 Q12 10 10 8" stroke="#5A4220" stroke-width="0.3" fill="none" opacity="0.25"/>
        <!-- Urat ke lobi kanan bawah -->
        <path d="M14 14 Q16 14 18 13" stroke="#5A4220" stroke-width="0.3" fill="none" opacity="0.2"/>
        <!-- Urat ke lobi kiri bawah -->
        <path d="M14 14 Q12 14 10 13" stroke="#5A4220" stroke-width="0.3" fill="none" opacity="0.2"/>

        <!-- Urat halus tambahan — daun maple punya urat banyak -->
        <path d="M14 7 Q15 8 16 8.5" stroke="#5A4220" stroke-width="0.15" fill="none" opacity="0.15"/>
        <path d="M14 7 Q13 8 12 8.5" stroke="#5A4220" stroke-width="0.15" fill="none" opacity="0.15"/>
        <path d="M14 16 Q15 16 16 15.5" stroke="#5A4220" stroke-width="0.15" fill="none" opacity="0.12"/>
        <path d="M14 16 Q13 16 12 15.5" stroke="#5A4220" stroke-width="0.15" fill="none" opacity="0.12"/>

        <!-- Tepi yang agak ngelipet/keriting — daun kering selalu keriting di tepi -->
        <!-- Tepi kanan melipat ke bawah sedikit -->
        <path d="M18 5 Q19.5 4.5 19.5 6" stroke="#6B4F2A" stroke-width="0.6" fill="none" opacity="0.3"/>
        <path d="M19.5 9 Q20.5 10 20 11" stroke="#6B4F2A" stroke-width="0.5" fill="none" opacity="0.25"/>
        <!-- Tepi kiri melipat ke atas sedikit -->
        <path d="M10 5 Q8.5 4.5 8.5 6" stroke="#6B4F2A" stroke-width="0.6" fill="none" opacity="0.3"/>
        <path d="M8.5 9 Q7.5 10 8 11" stroke="#6B4F2A" stroke-width="0.5" fill="none" opacity="0.25"/>
        <!-- Ujung lobus yang agak menggulung -->
        <path d="M17 3 Q18 1.5 18.5 3" stroke="#6B4F2A" stroke-width="0.4" fill="none" opacity="0.25"/>
        <path d="M11 3 Q10 1.5 9.5 3" stroke="#6B4F2A" stroke-width="0.4" fill="none" opacity="0.25"/>

        <!-- Noda kecoklatan — daun kering selalu punya noda -->
        <ellipse cx="16" cy="10" rx="1.2" ry="0.8" fill="#5A3E1A" opacity="0.12"/>
        <ellipse cx="11" cy="15" rx="0.9" ry="0.6" fill="#5A3E1A" opacity="0.1"/>
        <circle cx="15" cy="17" r="0.4" fill="#5A3E1A" opacity="0.08"/>

        <!-- Bagian yang agak robek di lobi kiri bawah — daun kering sering robek -->
        <path d="M9.5 13 Q8.5 13.5 9 14.5" stroke="#5A3E1A" stroke-width="0.4" fill="none" opacity="0.2"/>
      </svg>
    `

    container.appendChild(el)

    // Position: not too far left, not too far right
    const startX = window.innerWidth * 0.3 + Math.random() * window.innerWidth * 0.4

    const leaf: LeafState = {
      x: startX,
      y: -50,
      baseX: startX,
      rotation: Math.random() * 30 - 15,
      rotationX: -8 - Math.random() * 12,   // agak ngelipet ke depan — kaya daun kering beneran
      rotationY: 5 + Math.random() * 10,     // agak miring ke satu sisi — ngelipet
      tiltAmount: 0.7 + Math.random() * 0.3, // seberapa ekstrem lipatan
      velocityX: 0,
      velocityY: 0,
      angularVelocity: (Math.random() - 0.5) * 0.3,
      swayPhase: Math.random() * Math.PI * 2,
      driftPhase: Math.random() * Math.PI * 2,
      wobblePhase: Math.random() * Math.PI * 2,
      opacity: 0,
      scale: 0.8 + Math.random() * 0.2,
      element: el,
      // Wind gust system
      windGustX: 0,
      windGustY: 0,
      nextGustTime: 5 + Math.random() * 8,
      gustDuration: 0,
      gustStartTime: 0,
      gustActive: false,
    }

    return leaf
  }, [])

  useEffect(() => {
    if (prefersReducedMotion()) return

    const container = containerRef.current
    if (!container) return

    const leaf = createLeaf(container)
    leafRef.current = leaf
    startTimeRef.current = performance.now() * 0.001

    const animate = (time: number) => {
      const t = time * 0.001
      const elapsed = t - startTimeRef.current
      const vh = window.innerHeight
      const vw = window.innerWidth

      if (isFallingRef.current && !hasReachedBottomRef.current) {
        // ═══ FALLING — akhir cerita, daun jatuh sampai bawah ═══
        // Daun kering jatuh pelan — berat, tapi bentuknya bikin dia oleng
        // Kadang kebawa angin, kadang muter pelan
        const targetY = fallTargetYRef.current

        // Gravitasi pelan — daun kering jatuh ga secepat batu
        leaf.velocityY += 0.008
        // Tapi bentuk daun bikin dia oleng — ada drag
        leaf.velocityY *= 0.995
        // Horizontal: masih ada sway, tapi makin lemah
        leaf.velocityX += Math.sin(t * 0.3 + leaf.swayPhase) * 0.015
        leaf.velocityX *= 0.98

        leaf.y += leaf.velocityY
        leaf.x += leaf.velocityX

        // Rotasi makin pelan — daun lagi nyaman jatuh
        leaf.angularVelocity *= 0.998
        leaf.rotation += leaf.angularVelocity

        // 3D lipatan makin berkurang — daun mulai rata saat nyampe bawah
        leaf.rotationX += (0 - leaf.rotationX) * 0.002
        leaf.rotationY += (0 - leaf.rotationY) * 0.002

        // Clamp X biar ga keluar layar
        leaf.x = Math.max(20, Math.min(vw - 20, leaf.x))

        // Opacity stabilizes as it approaches final position
        if (leaf.y > targetY * 0.6) {
          leaf.opacity = Math.min(0.8, leaf.opacity + 0.001)
        }

        if (leaf.y >= targetY) {
          leaf.y = targetY
          leaf.velocityY = 0
          leaf.velocityX = 0
          hasReachedBottomRef.current = true

          // Final settle — daun mendarat pelan
          // Sedikit goyang terakhir, lalu diam
          gsap.to(leaf.element, {
            rotation: leaf.rotation + (Math.random() > 0.5 ? 2 : -2),
            duration: 2.5,
            ease: 'power2.out',
          })
          // Lipatan merata sepenuhnya
          gsap.to(leaf, {
            rotationX: 0,
            rotationY: 0,
            duration: 3,
            ease: 'power3.out',
          })
        }
      } else if (!isFallingRef.current) {
        // ═══ LIVING — daun melayang alami, ga nyampe bawah ═══

        // ─── Wind Gust System ───
        // Angin yang datang dan pergi — bikin gerakan ga monoton
        if (!leaf.gustActive && elapsed > leaf.nextGustTime) {
          // Angin baru datang!
          leaf.gustActive = true
          leaf.gustStartTime = elapsed
          leaf.gustDuration = 2 + Math.random() * 4 // 2-6 detik
          // Arah angin: bisa kiri atau kanan, kadang atas kadang bawah
          leaf.windGustX = (Math.random() - 0.4) * 0.6  // sedikit lebih sering ke kanan
          leaf.windGustY = (Math.random() - 0.5) * 0.15  // vertikal lemah
        }

        if (leaf.gustActive) {
          const gustElapsed = elapsed - leaf.gustStartTime
          const gustProgress = gustElapsed / leaf.gustDuration

          if (gustProgress >= 1) {
            // Angin berhenti
            leaf.gustActive = false
            leaf.windGustX = 0
            leaf.windGustY = 0
            // Next gust: 5-12 detik dari sekarang
            leaf.nextGustTime = elapsed + 5 + Math.random() * 7
          } else {
            // Wind curve: naik pelan, puncak di tengah, turun pelan
            const gustStrength = Math.sin(gustProgress * Math.PI) // bell curve
            leaf.velocityX += leaf.windGustX * gustStrength * 0.08
            leaf.velocityY += leaf.windGustY * gustStrength * 0.03

            // Angin juga mutar daun
            leaf.angularVelocity += gustStrength * leaf.windGustX * 0.02

            // Lipatan 3D berubah pas kena angin — daun kering oleng
            leaf.rotationY += gustStrength * leaf.windGustX * 0.3
          }
        }

        // ─── Vertical: breathing naik-turun ───
        // Range: 10% - 50% viewport — ga pernah nyampe bawah
        const breathPhase = Math.sin(elapsed * 0.05 + leaf.swayPhase)
        const breathNorm = breathPhase * 0.5 + 0.5
        const targetY = vh * 0.10 + breathNorm * vh * 0.40

        // Lerp — daun mengambang, bukan teleport
        const yDiff = targetY - leaf.y
        leaf.velocityY += yDiff * 0.00015
        leaf.velocityY *= 0.97  // damping — biar ga bouncing
        leaf.y += leaf.velocityY

        // ─── Horizontal: sway + drift ───
        // Multiple frequency — biar ga terlalu sinusoidal/robotik
        const sway1 = Math.sin(elapsed * 0.08 + leaf.swayPhase) * 20
        const sway2 = Math.sin(elapsed * 0.03 + leaf.swayPhase * 1.7) * 12
        const drift = Math.sin(elapsed * 0.015 + leaf.driftPhase) * 25
        const targetX = leaf.baseX + sway1 + sway2 + drift

        const xDiff = targetX - leaf.x
        leaf.velocityX += xDiff * 0.0003
        leaf.velocityX *= 0.96  // damping

        // Tambah velocity dari wind gust
        leaf.x += leaf.velocityX

        // Clamp biar ga keluar layar
        leaf.x = Math.max(30, Math.min(vw - 30, leaf.x))

        // ─── Rotation: natural, oleng kadang ───
        // Daun kering sering oleng — rotateZ
        const wobble = Math.sin(elapsed * 0.12 + leaf.wobblePhase) * 0.1
        leaf.angularVelocity += wobble
        leaf.angularVelocity *= 0.97  // damping
        // Clamp angular velocity biar ga muter gila
        leaf.angularVelocity = Math.max(-0.5, Math.min(0.5, leaf.angularVelocity))
        leaf.rotation += leaf.angularVelocity

        // ─── 3D Lipatan: rotateX + rotateY ───
        // Daun kering ngelipet — ini yang bikin dia keliatan alami
        // Lipatan berubah pelan — kadang makin ngelipet, kadang agak terbuka
        const lipatX = -10 + Math.sin(elapsed * 0.04 + leaf.swayPhase) * 5  // -15 to -5
        const lipatY = 8 + Math.sin(elapsed * 0.06 + leaf.driftPhase) * 6   // 2 to 14
        leaf.rotationX += (lipatX * leaf.tiltAmount - leaf.rotationX) * 0.01
        leaf.rotationY += (lipatY * leaf.tiltAmount - leaf.rotationY) * 0.01

        // ─── Opacity: breathe ───
        if (visibleRef.current) {
          const opacityBreath = 0.55 + Math.sin(elapsed * 0.08 + leaf.swayPhase) * 0.15
          leaf.opacity += (opacityBreath - leaf.opacity) * 0.02
        }
      }

      // ═══ Apply transforms — 3D biar keliatan ngelipet ═══
      const transform = `translate3d(${leaf.x}px, ${leaf.y}px, 0) rotateZ(${leaf.rotation}deg) rotateX(${leaf.rotationX}deg) rotateY(${leaf.rotationY}deg) scale(${leaf.scale})`
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
      fallTargetYRef.current = window.innerHeight - 80
      // Beri sedikit velocity awal ke bawah — daun mulai jatuh
      leaf.velocityY = 0.1
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
      style={{ perspective: '1200px' }}
      aria-hidden="true"
    />
  )
}
