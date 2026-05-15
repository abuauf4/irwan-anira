# Task 2 - Hero/Preloader/Particles Specialist

## Work Completed
Enhanced three core cinematic components for the "Love Diary" wedding invitation website with signature emotional moments, atmospheric depth, and warm ambient effects.

## Files Modified

### 1. `/home/z/my-project/src/components/CoverSection.tsx`
**Summary: Transformed the hero from static to cinematic with layered depth, lighting, and storytelling moments.**

Changes:
- **Subtle Golden Light Drift**: Added a `div` with `radial-gradient(ellipse, rgba(201,169,110,0.08))` that slowly animates position using `goldenLightDrift` keyframe over 14s, creating moonlight/candlelight shifting effect
- **Layered Depth/Parallax (Desktop only)**: Added `onMouseMove` handler that:
  - Shifts background image opposite to mouse position (2.5px max)
  - Shifts text content toward mouse position (1.5px max)
  - Shifts petal container in mouse direction (8px/5px max)
  - Disabled on touch devices and when `prefers-reduced-motion`
  - Smooth reset on mouse leave via `handleMouseLeave`
- **Handwriting Reveal on Names**: Applied `clip-path: inset(0 100% 0 0)` with `handwritingReveal` animation (2.5s, cubic-bezier easing, 0.3s delay) — names reveal left-to-right like being written
- **Petals React to Mouse Motion**: Petal container shifts with mouse movement (8px horizontal, 5px vertical), creating gentle drift effect
- **Increased Petals (5→8)**: 8 petals with more varied timing:
  - Durations: 9–12s (slower, more varied)
  - Opacities: 0.15–0.4 (wider range for depth)
  - Sizes: 6–16px (more varied)
  - Delays: 0–2.5s (staggered entrance)
- **Smooth Opening Animation**:
  - Reduced timeout from 800ms to 400ms
  - Added gentle scale-up animation (1 → 1.02) on open
  - Added golden flash overlay (brief, dim warm burst) that appears 150ms after clicking — like "a door opening" not "a button click"
  - Transition: opacity 0.5s ease with 0.15s delay, transform 0.5s ease
- **New Refs**: `bgRef`, `contentRef`, `petalContainerRef`, `mouseRef`, `goldenFlash` state

### 2. `/home/z/my-project/src/components/Preloader.tsx`
**Summary: Warmer, more cinematic preloader with softer transitions and "projector turning on" exit.**

Changes:
- **Warmer Background**: Changed from flat `#F5EDDF` to `linear-gradient(135deg, #F5EDDF 0%, #EDE4D4 50%, #F5EDDF 100%)` — subtle warmth
- **Softer Letter Transitions**: 
  - Groom name stagger: 0.1 → 0.08 (less mechanical)
  - Bride name stagger: 0.1 → 0.08
  - Ampersand duration: 0.8 → 0.6 (snappier)
- **More Cinematic Exit**:
  - Added `scale: 1.03` during fade out (projector zoom effect)
  - Added `transformOrigin: 'center center'` for proper scaling
  - Added `goldenTintRef` overlay that fades in during last 0.5s of exit (radial gradient of golden warmth)
  - Duration stays 1.2s but feels like "the projector turning on"
- **Progress Text Refinement**:
  - `'membuka kenangan...'` → `'membuka diary...'` (thematic consistency)
  - `'siap'` → `'selamat datang'` (warmer greeting)

### 3. `/home/z/my-project/src/components/JasmineParticles.tsx`
**Summary: Transformed from decorative particles to warm ambient atmosphere with depth and golden dust.**

Changes:
- **More Varied Sizes**: Range increased from 8–20px to 6–22px (`6 + Math.random() * 16`)
- **Varied Opacity with Atmospheric Perspective**: Smaller petals are more transparent:
  - Size factor calculated as `(size - 6) / 16` (0..1)
  - Base opacity: 0.15 (tiny/distant) to 0.8 (large/close)
  - SVG fill opacity scales with size
- **Gentler Fall**: `fallSpeed` reduced from 0.3–1.0 to 0.15–0.65 — petals drift in warm air, not fall
- **Wider Sway**: 
  - `swayAmplitude`: 30–80 → 40–100 (wider lateral movement)
  - `swaySpeed`: 0.5–2.0 → 0.3–1.3 (slower, more graceful)
- **Golden Dust Particles**:
  - Added `isGolden` flag to `Petal` interface
  - Every 4th spawn is a tiny golden dot (3–6px, circular)
  - Color: `rgba(201, 169, 110, 0.3–0.5)` — catches light like dust in golden hour
  - Uses DOM element with border-radius instead of SVG
- **Fewer Initial Petals**: Reduced from 12 to 7 visible at start — avoids "petal explosion" on page load
- **Spawn Counter**: `spawnCountRef` tracks spawns to determine golden dust cycling
- **Rotation Speed**: Slightly reduced from 2 to 1.5 for gentler rotation

### 4. `/home/z/my-project/src/app/globals.css`
**Summary: Added keyframe animations and reduced motion overrides for new CoverSection effects.**

Changes:
- Added `@keyframes goldenLightDrift` (slow position drift over 14s)
- Added `@keyframes goldenFlash` (brief golden burst, 0→1→0 opacity)
- Added `@keyframes handwritingReveal` (clip-path reveal left-to-right)
- Added reduced motion overrides for new animations in the `@media (prefers-reduced-motion: reduce)` block

## Design Principles Followed
- **Do NOT overdesign** — all effects are VERY subtle (golden light at 0.08 opacity, parallax at 2-3px, etc.)
- **Emotional timing** — handwriting reveal at 2.5s, golden flash as brief punctuation
- **Breathing space** — slower petals, wider sway, fewer initial particles
- **Warmth** — golden dust, warmer preloader gradient, projector-exit effect
- **Atmospheric depth** — atmospheric perspective on petal opacity, parallax layers
- **Accessibility** — all animations respect `prefers-reduced-motion`, parallax disabled on touch devices

## Status: ✅ Complete
All files compile successfully. No lint errors in modified files. Dev server compiles cleanly.
