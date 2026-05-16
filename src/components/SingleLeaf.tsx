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
    el.style.filter = 'drop-shadow(1px 2px 5px rgba(0,0,0,0.18))'
    el.style.opacity = '0'
    el.style.perspective = '800px'

    // ═══ Daun Maple Kering 🍁 — bentuk bintang 5 yang beneran ═══
    // Referensi: Canadian maple leaf — 5 lobus tajam dengan sinus di antaranya
    // Tapi warna coklat-kering, agak ngelipet, bukan merah cerah
    const size = 48
    el.innerHTML = `
      <svg width="${size}" height="${size * 1.15}" viewBox="0 0 80 92" fill="none" xmlns="http://www.w3.org/2000/svg" style="transform-style:preserve-3d;">
        <!-- Tangkai -->
        <path d="M40 88 Q39.5 84 39.8 80 Q40.2 76 40 72" stroke="#7A5C2E" stroke-width="1.2" fill="none" opacity="0.5"/>

        <!-- ═══ MAPLE LEAF — 5-pointed star, Canadian style ═══ -->
        <!-- Bentuk bintang 5 yang iconic — lobus tajam, sinus di antara lobus -->
        <!-- Dimulai dari ujung lobus atas, searah jarum jam -->
        <path d="
          M40 2
          L44 14 L55 6 L50 18 L64 16 L54 26 L70 30 L56 34 L66 46 L52 40 L56 54 L44 44 L40 58
          L36 44 L24 54 L28 40 L14 46 L24 34 L10 30 L26 26 L16 16 L30 18 L25 6 L36 14 Z"
          fill="#8B6B3A" opacity="0.8"/>

        <!-- Shadow layer — sisi kiri lebih gelap (ngelipet) -->
        <path d="
          M40 2
          L36 14 L25 6 L30 18 L16 16 L26 26 L10 30 L24 34 L14 46 L28 40 L24 54 L36 44 L40 58"
          fill="#6B4F2A" opacity="0.22"/>

        <!-- Highlight — cahaya dari kanan atas -->
        <path d="
          M40 2
          L44 14 L55 6 L50 18 L64 16 L54 26 L70 30 L56 34 L66 46 L52 40 L56 54 L44 44 L40 58"
          fill="rgba(201,169,110,0.06)" />

        <!-- ═══ Urat daun — dari pusat ke ujung tiap lobus ═══ -->
        <!-- Urat utama ke lobus atas -->
        <path d="M40 58 L40 8" stroke="#5A4220" stroke-width="0.8" fill="none" opacity="0.3"/>
        <!-- Urat ke lobus kanan atas -->
        <path d="M40 38 Q48 32 58 24" stroke="#5A4220" stroke-width="0.6" fill="none" opacity="0.25"/>
        <!-- Urat ke lobus kanan bawah -->
        <path d="M40 42 Q48 42 60 38" stroke="#5A4220" stroke-width="0.6" fill="none" opacity="0.22"/>
        <!-- Urat ke lobus kiri bawah -->
        <path d="M40 42 Q32 42 20 38" stroke="#5A4220" stroke-width="0.6" fill="none" opacity="0.22"/>
        <!-- Urat ke lobus kiri atas -->
        <path d="M40 38 Q32 32 22 24" stroke="#5A4220" stroke-width="0.6" fill="none" opacity="0.25"/>

        <!-- Urat cabang halus -->
        <path d="M40 20 Q44 24 48 26" stroke="#5A4220" stroke-width="0.25" fill="none" opacity="0.15"/>
        <path d="M40 20 Q36 24 32 26" stroke="#5A4220" stroke-width="0.25" fill="none" opacity="0.15"/>
        <path d="M40 48 Q44 47 48 45" stroke="#5A4220" stroke-width="0.25" fill="none" opacity="0.12"/>
        <path d="M40 48 Q36 47 32 45" stroke="#5A4220" stroke-width="0.25" fill="none" opacity="0.12"/>

        <!-- ═══ Tepi ngelipet — daun kering ═══ -->
        <!-- Ujung lobus kanan atas menggulung -->
        <path d="M55 6 Q56.5 4 56 7" stroke="#6B4F2A" stroke-width="0.8" fill="none" opacity="0.28"/>
        <!-- Ujung lobus kiri atas menggulung -->
        <path d="M25 6 Q23.5 4 24 7" stroke="#6B4F2A" stroke-width="0.8" fill="none" opacity="0.28"/>
        <!-- Tepi lobus kanan bawah melipat -->
        <path d="M66 46 Q68 44 67 47" stroke="#6B4F2A" stroke-width="0.7" fill="none" opacity="0.22"/>
        <!-- Tepi lobus kiri bawah melipat -->
        <path d="M14 46 Q12 44 13 47" stroke="#6B4F2A" stroke-width="0.7" fill="none" opacity="0.22"/>
        <!-- Ujung lobus atas sedikit melipat -->
        <path d="M40 2 Q42 0 41 3" stroke="#6B4F2A" stroke-width="0.6" fill="none" opacity="0.18"/>

        <!-- ═══ Noda & robekan ═══ -->
        <ellipse cx="50" cy="28" rx="2.5" ry="1.5" fill="#5A3E1A" opacity="0.09"/>
        <ellipse cx="28" cy="40" rx="2" ry="1.2" fill="#5A3E1A" opacity="0.07"/>
        <circle cx="44" cy="48" r="0.8" fill="#5A3E1A" opacity="0.06"/>
        <!-- Sobekan kecil di lobus kiri bawah -->
        <path d="M20 38 Q18 39 19 42" stroke="#5A3E1A" stroke-width="0.6" fill="none" opacity="0.15"/>
      </svg>
    `

    container.appendChild(el)

    // Position: bisa di mana aja — gerakan luas
    const startX = window.innerWidth * 0.2 + Math.random() * window.innerWidth * 0.6

    const leaf: LeafState = {
      x: startX,
      y: -50,
      baseX: startX,
      rotation: Math.random() * 30 - 15,
      rotationX: -8 - Math.random() * 12,
      rotationY: 5 + Math.random() * 10,
      tiltAmount: 0.7 + Math.random() * 0.3,
      velocityX: 0,
      velocityY: 0,
      angularVelocity: (Math.random() - 0.5) * 0.3,
      swayPhase: Math.random() * Math.PI * 2,
      driftPhase: Math.random() * Math.PI * 2,
      wobblePhase: Math.random() * Math.PI * 2,
      opacity: 0,
      scale: 0.85 + Math.random() * 0.15,
      element: el,
      windGustX: 0,
      windGustY: 0,
      nextGustTime: 3 + Math.random() * 5,  // lebih sering
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
        const targetY = fallTargetYRef.current

        leaf.velocityY += 0.008
        leaf.velocityY *= 0.995
        leaf.velocityX += Math.sin(t * 0.3 + leaf.swayPhase) * 0.015
        leaf.velocityX *= 0.98

        leaf.y += leaf.velocityY
        leaf.x += leaf.velocityX

        leaf.angularVelocity *= 0.998
        leaf.rotation += leaf.angularVelocity

        leaf.rotationX += (0 - leaf.rotationX) * 0.002
        leaf.rotationY += (0 - leaf.rotationY) * 0.002

        leaf.x = Math.max(20, Math.min(vw - 20, leaf.x))

        if (leaf.y > targetY * 0.6) {
          leaf.opacity = Math.min(0.8, leaf.opacity + 0.001)
        }

        if (leaf.y >= targetY) {
          leaf.y = targetY
          leaf.velocityY = 0
          leaf.velocityX = 0
          hasReachedBottomRef.current = true

          gsap.to(leaf, {
            rotation: leaf.rotation + (Math.random() > 0.5 ? 2 : -2),
            rotationX: 0,
            rotationY: 0,
            duration: 2.5,
            ease: 'power2.out',
          })
        }
      } else if (!isFallingRef.current) {
        // ═══ LIVING — daun melayang LUAS, ga nyampe bawah ═══

        // ─── Wind Gust System — LEBIH SERING, LEBIH KUAT ───
        if (!leaf.gustActive && elapsed > leaf.nextGustTime) {
          leaf.gustActive = true
          leaf.gustStartTime = elapsed
          leaf.gustDuration = 2 + Math.random() * 5
          // Angin lebih kuat — daun bergerak jauh
          leaf.windGustX = (Math.random() - 0.4) * 1.2   // 2x lebih kuat
          leaf.windGustY = (Math.random() - 0.5) * 0.25   // 2x lebih kuat
        }

        if (leaf.gustActive) {
          const gustElapsed = elapsed - leaf.gustStartTime
          const gustProgress = gustElapsed / leaf.gustDuration

          if (gustProgress >= 1) {
            leaf.gustActive = false
            leaf.windGustX = 0
            leaf.windGustY = 0
            leaf.nextGustTime = elapsed + 3 + Math.random() * 5  // lebih sering
          } else {
            const gustStrength = Math.sin(gustProgress * Math.PI)
            leaf.velocityX += leaf.windGustX * gustStrength * 0.12
            leaf.velocityY += leaf.windGustY * gustStrength * 0.05
            leaf.angularVelocity += gustStrength * leaf.windGustX * 0.03
            leaf.rotationY += gustStrength * leaf.windGustX * 0.4
          }
        }

        // ─── Vertical: breathing — range LUAS ───
        // 8% - 55% viewport — gerakan vertikal lebih luas
        const breathPhase = Math.sin(elapsed * 0.04 + leaf.swayPhase)
        const breathNorm = breathPhase * 0.5 + 0.5
        const targetY = vh * 0.08 + breathNorm * vh * 0.47

        const yDiff = targetY - leaf.y
        leaf.velocityY += yDiff * 0.00012
        leaf.velocityY *= 0.97
        leaf.y += leaf.velocityY

        // ─── Horizontal: sway + drift LEBIH LUAS ───
        // Area gerak: 10% - 90% viewport — bukan cuma tengah
        const sway1 = Math.sin(elapsed * 0.06 + leaf.swayPhase) * 35
        const sway2 = Math.sin(elapsed * 0.025 + leaf.swayPhase * 1.7) * 20
        const drift = Math.sin(elapsed * 0.012 + leaf.driftPhase) * 40
        const targetX = leaf.baseX + sway1 + sway2 + drift

        const xDiff = targetX - leaf.x
        leaf.velocityX += xDiff * 0.00025
        leaf.velocityX *= 0.96

        leaf.x += leaf.velocityX

        // Clamp longgar — daun boleh hampir keluar layar
        leaf.x = Math.max(-20, Math.min(vw + 20, leaf.x))

        // Update baseX pelan — daun "migrasi" ke area lain
        // Biar ga bolak-balik di area yang sama terus
        leaf.baseX += Math.sin(elapsed * 0.005 + leaf.driftPhase) * 0.05
        // Clamp baseX biar ga keluar jauh
        leaf.baseX = Math.max(vw * 0.15, Math.min(vw * 0.85, leaf.baseX))

        // ─── Rotation ───
        const wobble = Math.sin(elapsed * 0.1 + leaf.wobblePhase) * 0.12
        leaf.angularVelocity += wobble
        leaf.angularVelocity *= 0.97
        leaf.angularVelocity = Math.max(-0.6, Math.min(0.6, leaf.angularVelocity))
        leaf.rotation += leaf.angularVelocity

        // ─── 3D Lipatan ───
        const lipatX = -10 + Math.sin(elapsed * 0.04 + leaf.swayPhase) * 5
        const lipatY = 8 + Math.sin(elapsed * 0.06 + leaf.driftPhase) * 6
        leaf.rotationX += (lipatX * leaf.tiltAmount - leaf.rotationX) * 0.01
        leaf.rotationY += (lipatY * leaf.tiltAmount - leaf.rotationY) * 0.01

        // ─── Opacity ───
        if (visibleRef.current) {
          const opacityBreath = 0.55 + Math.sin(elapsed * 0.08 + leaf.swayPhase) * 0.15
          leaf.opacity += (opacityBreath - leaf.opacity) * 0.02
        }
      }

      // ═══ Apply transforms ═══
      const transform = `translate3d(${leaf.x}px, ${leaf.y}px, 0) rotateZ(${leaf.rotation}deg) rotateX(${leaf.rotationX}deg) rotateY(${leaf.rotationY}deg) scale(${leaf.scale})`
      leaf.element.style.transform = transform
      leaf.element.style.opacity = String(leaf.opacity)

      animFrameRef.current = requestAnimationFrame(animate)
    }

    animFrameRef.current = requestAnimationFrame(animate)

    // Fade in after 3 seconds
    const fadeInTimeout = setTimeout(() => {
      visibleRef.current = true
    }, 3000)

    // ═══ Listen for closing event ═══
    const handleClosingStart = () => {
      isFallingRef.current = true
      fallTargetYRef.current = window.innerHeight - 80
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
