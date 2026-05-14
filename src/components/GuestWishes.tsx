'use client'

import { useState, useEffect, useRef } from 'react'

const WISHES = [
  {
    name: 'Bp. Hadi Santoso',
    message: 'Semoga menjadi keluarga sakinah mawaddah warahmah. Mugo langgeng nganti puncake.',
    avatar: 'HS',
  },
  {
    name: 'Ibu Sri Rahayu',
    message: 'Kangge Mas Irwan mbak Anira, muga-muga pinaraking pangestu lan kabagyan.',
    avatar: 'SR',
  },
  {
    name: 'Rina & Dedi',
    message: 'Happy wedding! Semoga menjadi pasangan yang saling melengkapi.',
    avatar: 'RD',
  },
  {
    name: 'Mbah Darmo',
    message: 'Muga sida kalampahanipun, dados pasangan ingkang berkah.',
    avatar: 'MD',
  },
  {
    name: 'Pak Wiryo',
    message: 'Sampeyan loro gadhah jejodhoan ingkang sae, mugi langgeng.',
    avatar: 'PW',
  },
  {
    name: 'Andi & Family',
    message: 'Doa terbaik untuk kalian berdua, semoga rumah tangga penuh keberkahan.',
    avatar: 'AF',
  },
]

function WishCard({ wish, index }: { wish: typeof WISHES[0]; index: number }) {
  return (
    <div
      className="wish-card flex-shrink-0 w-72 sm:w-80 rounded-xl p-5 border border-[var(--gold)]/30 shadow-md
        hover:shadow-lg hover:border-[var(--gold)]/50 transition-all duration-300 group"
      style={{
        background: 'rgba(255,255,255,0.85)',
        animationDelay: `${index * 0.15}s`,
      }}
    >
      {/* Ornamental top border */}
      <div className="flex items-center justify-center mb-3">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[var(--gold)] to-transparent" />
        <span className="mx-2 text-[var(--gold)] text-xs opacity-60">&#10047;</span>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[var(--gold)] to-transparent" />
      </div>

      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-medium border border-[var(--gold)]/30"
          style={{ background: 'var(--cream-dark)', color: 'var(--gold-dark)', fontFamily: 'var(--font-body)' }}
        >
          {wish.avatar}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium mb-1" style={{ fontFamily: 'var(--font-body)', color: 'var(--brown)' }}>
            {wish.name}
          </p>
          <p className="text-sm leading-relaxed italic" style={{ fontFamily: 'var(--font-serif)', color: 'var(--brown-light)' }}>
            &ldquo;{wish.message}&rdquo;
          </p>
        </div>
      </div>

      {/* Ornamental bottom border */}
      <div className="flex items-center justify-center mt-3">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[var(--gold)]/50 to-transparent" />
      </div>
    </div>
  )
}

export default function GuestWishes() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isPaused, setIsPaused] = useState(false)
  const animFrameRef = useRef<number>(0)
  const scrollPosRef = useRef(0)

  // Auto-scroll implementation
  useEffect(() => {
    const container = scrollRef.current
    if (!container) return

    const speed = 0.5 // pixels per frame
    const animate = () => {
      if (!isPaused && container) {
        scrollPosRef.current += speed
        // Reset when we've scrolled through half (since we duplicate)
        if (scrollPosRef.current >= container.scrollWidth / 2) {
          scrollPosRef.current = 0
        }
        container.scrollLeft = scrollPosRef.current
      }
      animFrameRef.current = requestAnimationFrame(animate)
    }

    animFrameRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animFrameRef.current)
  }, [isPaused])

  // Also show cards in a grid layout below
  return (
    <section className="py-20 px-6" style={{ background: 'var(--cream-dark)' }}>
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl mb-2" style={{ fontFamily: 'var(--font-script)', color: 'var(--gold-dark)' }}>
          Ucapan & Doa
        </h2>
        <div className="ornament-divider max-w-xs mx-auto mb-4">
          <span className="text-[var(--gold)] text-lg">&#10047;</span>
        </div>
        <p className="text-sm mb-10" style={{ fontFamily: 'var(--font-serif)', color: 'var(--brown-light)' }}>
          Doa dan ucapan dari keluarga dan sahabat untuk kedua mempelai
        </p>

        {/* Auto-scrolling carousel */}
        <div
          className="relative overflow-hidden"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          {/* Fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-16 z-10 pointer-events-none" style={{ background: 'linear-gradient(to right, var(--cream-dark), transparent)' }} />
          <div className="absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none" style={{ background: 'linear-gradient(to left, var(--cream-dark), transparent)' }} />

          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide py-2 px-8"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {/* Duplicate items for seamless loop */}
            {[...WISHES, ...WISHES].map((wish, index) => (
              <WishCard key={index} wish={wish} index={index % WISHES.length} />
            ))}
          </div>
        </div>

        {/* Grid layout for all wishes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-10">
          {WISHES.map((wish, index) => (
            <div
              key={index}
              className="wish-card rounded-xl p-5 border border-[var(--gold)]/30 shadow-sm
                hover:shadow-md hover:border-[var(--gold)]/50 transition-all duration-300 text-left"
              style={{
                background: 'rgba(255,255,255,0.85)',
                animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
              }}
            >
              <div className="flex items-center justify-center mb-3">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[var(--gold)] to-transparent" />
                <span className="mx-2 text-[var(--gold)] text-xs opacity-60">&#10047;</span>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[var(--gold)] to-transparent" />
              </div>

              <div className="flex items-start gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-medium border border-[var(--gold)]/30"
                  style={{ background: 'var(--cream)', color: 'var(--gold-dark)', fontFamily: 'var(--font-body)' }}
                >
                  {wish.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium mb-1" style={{ fontFamily: 'var(--font-body)', color: 'var(--brown)' }}>
                    {wish.name}
                  </p>
                  <p className="text-sm leading-relaxed italic" style={{ fontFamily: 'var(--font-serif)', color: 'var(--brown-light)' }}>
                    &ldquo;{wish.message}&rdquo;
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-center mt-3">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[var(--gold)]/50 to-transparent" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
