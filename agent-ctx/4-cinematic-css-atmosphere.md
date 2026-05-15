# Task 4 - Cinematic Wedding Refinement: globals.css Atmosphere & Lighting

## Summary
Enhanced the warm cinematic atmosphere of the wedding invitation website by adding vignette, ambient glow, paper grain, light leak, and emotional lighting effects to globals.css.

## Files Modified
1. **`/home/z/my-project/src/app/globals.css`** — 7 atmospheric enhancements added

## Changes Made

### 1. Updated warmGlow Keyframe + Added 5 New Keyframes (after line 380)
- **warmGlow**: Updated values (30%: 0.07→0.08, 80%: 0.06→0.07) for more visible candlelight breathing
- **inkDissolve**: New — text fading like disappearing ink (opacity 1→0, blur 0→1.5px)
- **memoryFloat**: New — gentle bobbing for gallery photos (translateY 0→-3px)
- **diarySettle**: New — the final settling (scale 1→0.98, opacity 0.8→1)
- **softLightLeak**: New — warm light bleeding in from edge (opacity + translateX oscillation)
- **emotionalBreathe**: New — diary card background breathing box-shadow animation

### 2. Added cinema-ambient-glow Class (after cinema-warm-glow section)
- `.cinema-ambient-glow::before` — Triple radial-gradient (30% 20%, 70% 60%, 50% 80%) with warmGlow 10s animation
- Fills sections with multi-point golden warmth like candlelight in a room

### 3. Added diary-story-card + Related Classes (after diary-note-card-vignette)
- `.diary-story-card` — Cinematic diary page with emotionalBreathe 8s animation, layered box-shadow, golden vignette ::before
- `.diary-story-card::before` — Radial gradient warm inner glow at 50% 30%
- `.ink-dissolve-out` — Ink dissolve transition class using inkDissolve keyframe
- `.memory-float` — Gentle bobbing animation using memoryFloat keyframe

### 4. Enhanced cinema-vignette::before
- Changed from `transparent 40%, rgba(26,21,16,0.5) 100%` to `transparent 35%, rgba(26,21,16,0.6) 80%, rgba(20,16,10,0.75) 100%`
- Changed inner glow position from `center` to `50% 30%` with increased opacity 0.05→0.06
- Result: Warmer, stronger vignette edges with 3-stop gradient for more dramatic dark-to-light falloff

### 5. Added soft-light-leak Class
- `.soft-light-leak` — Diagonal gradient (135deg) with golden tint at edges, animated with softLightLeak 15s
- Like sunlight through curtains at golden hour, slowly shifting position

### 6. Enhanced Global Paper Grain (body::after)
- Updated SVG noise opacity from 0.03→0.035 (slightly more visible grain)
- Updated body::after opacity from 0.35→0.4 (stronger analog feel)
- Added multi-line background-image format for readability

### 7. Added cinema-shadow-depth Class
- `.cinema-shadow-depth` — Triple box-shadow creating page-like depth
- Top edge: subtle gold line (rgba(201,169,110,0.03))
- Bottom edge: warm ink line (rgba(44,34,24,0.04))
- Soft ambient shadow: rgba(26,21,16,0.06)

## Build Status
✅ Dev server compiles successfully (HTTP 200)
✅ No new lint errors introduced (existing warnings are from GSAP/Lenis third-party code)

## Line Count
- globals.css: ~1418 → ~1520 lines
