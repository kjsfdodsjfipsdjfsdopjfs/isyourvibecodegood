# Design System — isyourvibecodegood.com

## Product Context
- **What this is:** Viral "roast my vibe code" tool — paste a URL, get a savage quality roast
- **Who it's for:** Indie devs, vibe coders using Lovable/Bolt/v0/Cursor
- **Space/industry:** Dev tools meets meme culture
- **Project type:** Viral web tool (single-purpose, shareable results)

## Aesthetic Direction
- **Direction:** Retro-Terminal Inferno — CRT scanlines, ASCII fire, dark terminal aesthetic
- **Decoration level:** Expressive — full creative direction with fire particles, smoke wisps, CRT flicker, border-burn animations
- **Mood:** Walking into a hacker's basement that's literally on fire. Dark, edgy, screenshot-worthy. The kind of site you screenshot and share because it looks insane.
- **Anti-patterns avoided:** No purple gradients, no 3-column feature grids, no centered-everything SaaS look, no bubbly border-radius, no stock photo heroes

## Typography
- **Display/Hero:** Space Grotesk (700) — geometric, technical, bold. Feels like a terminal header with personality
- **Body:** System UI stack — fast loading, clean readability
- **UI/Labels:** Geist Mono — monospace for the terminal aesthetic, used for scores, prompts, metadata
- **Code/Data:** Geist Mono — consistent terminal feel
- **Loading:** Google Fonts CDN with preconnect
- **Scale:** Display 48-72px, Body 14-16px, Mono labels 12-14px, Score numbers 96px

## Color
- **Approach:** Expressive — fire palette as primary design language
- **Primary:** `#F97316` (ember-orange) — the main fire accent, CTAs, highlights
- **Secondary:** `#DC2626` (ember-red) — danger, low scores, alerts
- **Accent:** `#FBBF24` (ember-amber) — warm highlights, medium scores
- **Deep accent:** `#7F1D1D` (ember-deep) — borders, subtle fire glow
- **Roast text:** `#FB923C` — the roast copy color
- **Background:** `#050505` (near-black) — void darkness
- **Surfaces:** `#0F0F0F` (surface), `#161616` (surface-raised)
- **Borders:** `#1A1A1A` (default), `#2A2A2A` (hover)
- **Semantic scores:** bad `#EF4444`, meh `#FBBF24`, good `#22C55E`
- **Dark mode:** N/A — this IS the dark mode. There is no light mode. Ever.

## Spacing
- **Base unit:** 4px
- **Density:** Comfortable — generous whitespace contrasts with the dense fire effects
- **Scale:** xs(4) sm(8) md(16) lg(24) xl(32) 2xl(48) 3xl(64)

## Layout
- **Approach:** Full-screen centered terminal — single column, dramatic vertical flow
- **Grid:** No traditional grid. Full viewport height landing, centered content
- **Max content width:** 600px for input area, 800px for results
- **Border radius:** Sharp (2-4px) — terminals don't have rounded corners

## Motion
- **Approach:** Expressive — fire is alive, the UI breathes
- **Animations:**
  - `ember-rise` — particles float upward with drift and fade (3-8s, infinite)
  - `fire-pulse` — breathing glow on fire elements (2s, alternate)
  - `border-burn` — input border cycles through fire colors (3s, infinite)
  - `crt-flicker` — subtle CRT screen flicker on title (4s, infinite)
  - `glow-pulse` — background score glow breathes (2s, alternate)
  - `fire-floor-pulse` — bottom fire gradient breathes (3s, infinite)
  - `smoke-drift` — smoke wisps rise and expand (8-12s, infinite)
  - `count-up` — score number scales in from 0 (0.6s, ease-out)
  - `typewriter-cursor` — blinking cursor on roast text (0.8s, steps)
  - `slide-up` — staggered entrance for category cards (0.5s, ease-out)
  - `bar-fill` — score bars fill from 0% (1s, ease-out)
- **Easing:** ease-out for entrances, ease-in-out for loops
- **CRT effects:** Scanline overlay (repeating-gradient), grain texture (SVG noise filter)

## Decisions Log
| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-03-19 | Retro-Terminal Inferno aesthetic | User wanted bold, creative, fire-themed — not generic SaaS |
| 2026-03-19 | No light mode | The product IS darkness. Light mode would kill the vibe |
| 2026-03-19 | CSS-only animations | No JS animation libraries — keeps bundle tiny, loads instant |
| 2026-03-19 | Full-screen terminal landing | User rejected traditional hero+subtitle — just the question and input |
| 2026-03-19 | 18 ember particles | User asked for "mais fogo" twice — maximum fire without perf issues |
