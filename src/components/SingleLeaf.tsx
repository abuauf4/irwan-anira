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

    // ═══ Daun Maple Kering 🍁 — ngelipet, pucat, natural ═══
    // Bentuk kaya emoji 🍁 — 5 lobus tajam yang recognizable
    // Tapi warna coklat-kering, agak ngelipet, bukan merah cerah
    const size = 44
    el.innerHTML = `
      <svg width="${size}" height="${size * 1.2}" viewBox="0 0 50 60" fill="none" xmlns="http://www.w3.org/2000/svg" style="transform-style:preserve-3d;">
        <!-- Tangkai — tipis, agak melengkung -->
        <path d="M25 57 Q24.5 54 24.8 51 Q25.2 48 25 45" stroke="#7A5C2E" stroke-width="1" fill="none" opacity="0.5"/>

        <!-- ═══ Bentuk Maple Leaf 🍁 — 5 lobus tajam, iconic ═══ -->
        <!-- Lobi utama: tengah (atas), 2 samping, 2 bawah -->
        <!-- Asimetris sedikit — daun kering ga sempurna -->
        <path d="
          M25 0
          L27.5 8 L33 4 L31 12 L38 9 L34 17 L42 17 L36 22 L40 27 L33 25 L35 33 L29 28 L27 37 L25 42 L23 37 L21 28 L15 33 L17 25 L10 27 L14 22 L8 17 L16 17 L12 9 L19 12 L17 4 L22.5 8 Z"
          fill="#8B6B3A" opacity="0.8"/>

        <!-- Shadow layer — bagian yang ngelipet lebih gelap -->
        <path d="
          M25 0
          L22.5 8 L17 4 L19 12 L12 9 L16 17 L8 17 L14 22 L10 27 L17 25 L15 33 L21 28 L23 37 L25 42"
          fill="#6B4F2A" opacity="0.25"/>

        <!-- Highlight — cahaya dari kanan atas -->
        <path d="
          M25 3
          L27.5 8 L33 4 L31 12 L38 9 L34 17 L42 17 L36 22 L40 27 L33 25 L35 33 L29 28 L27 37 L25 42"
          fill="rgba(201,169,110,0.07)" />

        <!-- ═══ Urat daun — dari tengah ke ujung tiap lobus ═══ -->
        <!-- Urat tengah (ke atas) -->
        <path d="M25 42 L25 5" stroke="#5A4220" stroke-width="0.7" fill="none" opacity="0.3"/>
        <!-- Urat ke lobus kanan atas -->
        <path d="M25 24 Q29 19 34 16" stroke="#5A4220" stroke-width="0.5" fill="none" opacity="0.25"/>
        <!-- Urat ke lobus kiri atas -->
        <path d="M25 24 Q21 19 16 16" stroke="#5A4220" stroke-width="0.5" fill="none" opacity="0.25"/>
        <!-- Urat ke lobus kanan bawah -->
        <path d="M25 30 Q28 30 33 26" stroke="#5A4220" stroke-width="0.4" fill="none" opacity="0.2"/>
        <!-- Urat ke lobus kiri bawah -->
        <path d="M25 30 Q22 30 17 26" stroke="#5A4220" stroke-width="0.4" fill="none" opacity="0.2"/>

        <!-- Urat halus cabang -->
        <path d="M25 12 Q27 14 29 15" stroke="#5A4220" stroke-width="0.2" fill="none" opacity="0.15"/>
        <path d="M25 12 Q23 14 21 15" stroke="#5A4220" stroke-width="0.2" fill="none" opacity="0.15"/>
        <path d="M25 34 Q27 33 28 31" stroke="#5A4220" stroke-width="0.2" fill="none" opacity="0.12"/>
        <path d="M25 34 Q23 33 22 31" stroke="#5A4220" stroke-width="0.2" fill="none" opacity="0.12"/>

        <!-- ═══ Tepi ngelipet — daun kering selalu keriting ═══ -->
        <!-- Ujung lobus kanan atas agak menggulung -->
        <path d="M34 17 Q35 16 35 18" stroke="#6B4F2A" stroke-width="0.8" fill="none" opacity="0.3"/>
        <!-- Ujung lobus kiri atas agak menggulung -->
        <path d="M16 17 Q15 16 15 18" stroke="#6B4F2A" stroke-width="0.8" fill="none" opacity="0.3"/>
        <!-- Tepi lobus kanan bawah melipat -->
        <path d="M33 25 Q34 24 34 26" stroke="#6B4F2A" stroke-width="0.6" fill="none" opacity="0.25"/>
        <!-- Tepi lobus kiri bawah melipat -->
        <path d="M17 25 Q16 24 16 26" stroke="#6B4F2A" stroke-width="0.6" fill="none" opacity="0.25"/>
        <!-- Ujung lobus tengah agak melipat -->
        <path d="M27.5 8 Q28 6.5 29 8" stroke="#6B4F2A" stroke-width="0.5" fill="none" opacity="0.2"/>
        <path d="M22.5 8 Q22 6.5 21 8" stroke="#6B4F2A" stroke-width="0.5" fill="none" opacity="0.2"/>

        <!-- ═══ Noda & robekan — daun kering ═══ -->
        <ellipse cx="30" cy="18" rx="1.8" ry="1.2" fill="#5A3E1A" opacity="0.1"/>
        <ellipse cx="20" cy="26" rx="1.4" ry="1" fill="#5A3E1A" opacity="0.08"/>
        <circle cx="27" cy="32" r="0.6" fill="#5A3E1A" opacity="0.07"/>
        <!-- Sobekan kecil di lobus kiri bawah -->
        <path d="M17 25 Q15.5 25.5 16 27" stroke="#5A3E1A" stroke-width="0.5" fill="none" opacity="0.18"/>
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
      scale: 0.9 + Math.random() * 0.15,
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
