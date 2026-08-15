---
name: Celestial Enlightenment
colors:
  surface: '#0d112a'
  surface-dim: '#0d112a'
  surface-bright: '#343752'
  surface-container-lowest: '#080c25'
  surface-container-low: '#161a33'
  surface-container: '#1a1e37'
  surface-container-high: '#242842'
  surface-container-highest: '#2f334e'
  on-surface: '#dee0ff'
  on-surface-variant: '#c8c5d0'
  inverse-surface: '#dee0ff'
  inverse-on-surface: '#2b2f49'
  outline: '#918f9a'
  outline-variant: '#46464f'
  surface-tint: '#c1c1fc'
  primary: '#c1c1fc'
  on-primary: '#2a2b5b'
  primary-container: '#1a1b4b'
  on-primary-container: '#8384ba'
  inverse-primary: '#585a8d'
  secondary: '#fff9ef'
  on-secondary: '#3a3000'
  secondary-container: '#ffdb3c'
  on-secondary-container: '#725f00'
  tertiary: '#a4c9ff'
  on-tertiary: '#00315d'
  tertiary-container: '#002142'
  on-tertiary-container: '#438adc'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e1e0ff'
  primary-fixed-dim: '#c1c1fc'
  on-primary-fixed: '#141545'
  on-primary-fixed-variant: '#404273'
  secondary-fixed: '#ffe16d'
  secondary-fixed-dim: '#e9c400'
  on-secondary-fixed: '#221b00'
  on-secondary-fixed-variant: '#544600'
  tertiary-fixed: '#d4e3ff'
  tertiary-fixed-dim: '#a4c9ff'
  on-tertiary-fixed: '#001c39'
  on-tertiary-fixed-variant: '#004883'
  background: '#0d112a'
  on-background: '#dee0ff'
  surface-variant: '#2f334e'
  deep-void: '#050714'
  starlight-white: '#F8F9FF'
  nebula-gray: '#94A3B8'
  solar-flare: '#FFA500'
  lunar-glow: '#E2E8F0'
typography:
  headline-xl:
    fontFamily: Space Grotesk
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Space Grotesk
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-md:
    fontFamily: Space Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Be Vietnam Pro
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Be Vietnam Pro
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.05em
  headline-lg-mobile:
    fontFamily: Space Grotesk
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 40px
  panel-width-side: 280px
  panel-width-ai: 320px
---

## Brand & Style

The design system is crafted to evoke a sense of cosmic wonder and scientific precision, tailored specifically for astronomical education in rural settings. The brand personality is **Visionary, Educational, and Serene**, bridging the gap between ancient cultural narratives and modern astrophysics.

The chosen design style is **Modern Corporate with Glassmorphic accents**. This approach balances the professional requirements of an educational dashboard with the ethereal beauty of deep space. High-contrast typography ensures readability in various classroom lighting conditions, while translucent layers provide depth without overwhelming the user. The aesthetic is "High-Tech Heritage"—where clean, data-driven interfaces meet the warmth of celestial storytelling.

## Colors

The palette is anchored in **Deep Void (#050714)** and **Midnight Blue (#0A0E27)** to simulate the vastness of the night sky. The primary color, **Cosmic Indigo (#1A1B4B)**, is used for structural elements and containers, providing a softer transition from the background.

**Celestial Gold (#FFD700)** serves as the primary accent, used sparingly for critical interactive elements, milestones on timelines, and highlighting ancient constellations, symbolizing "enlightenment." **Astro Blue (#4A90E2)** is used for scientific data, light paths, and secondary interactions. Text follows a strict hierarchy: **Starlight White** for headings and **Nebula Gray** for secondary information to reduce eye strain during prolonged teaching sessions.

## Typography

This design system utilizes a tri-font strategy to differentiate between data, content, and structure.

- **Headlines:** **Space Grotesk** provides a technical, futuristic edge. Its geometric construction mirrors architectural precision, ideal for major module titles and astronomical terminology.
- **Body:** **Be Vietnam Pro** is used for its exceptional legibility and warm, contemporary feel. It ensures that long-form educational content and classical poetry are approachable for both teachers and students.
- **Data & Labels:** **JetBrains Mono** is reserved for technical readouts, coordinates, and AI status indicators, reinforcing the "instrument panel" feel of the dashboard.

For cross-disciplinary content (e.g., Starry Night Postcards), use increased tracking on headlines to evoke a sense of historical elegance.

## Layout & Spacing

The layout follows a **Fixed Dashboard Grid** model to maintain a "mission control" environment where tools are always in the same place. 

1.  **Sidebar (Left):** 280px fixed width. High-contrast navigation for quick module switching.
2.  **Main Stage (Center):** Fluid width with a max-container of 1440px. This area hosts the Canvas engine and interactive star maps.
3.  **AI Panel (Right):** 320px floating or docked panel. 

The spacing system is built on an **8px base unit**. Component internal padding should be consistent (e.g., 16px or 24px) to maintain a clean, rhythmic structure. Gutters are set to 24px to provide enough "breathing room" between complex data visualizations.

## Elevation & Depth

Visual hierarchy is established through **Tonal Layering** and **Backdrop Blurs**. 

- **Level 0 (Background):** Deepest blue with a subtle, fixed SVG noise texture to simulate star fields.
- **Level 1 (Panels):** Cosmic Indigo with 80% opacity and a 12px backdrop blur. This allows the star field to subtly peek through, creating a sense of immersion.
- **Level 2 (Interactive Cards/Dialogs):** Slightly lighter navy with a 1px "Starlight" border (white at 10% opacity) to define edges without heavy shadows.
- **Level 3 (Pop-overs/Tooltips):** Intense blur (20px) with a soft outer glow in Astro Blue to indicate high-priority focus.

Avoid traditional drop shadows; instead, use inner glows or subtle border highlights to suggest light originating from the screen's interactive elements.

## Shapes

The shape language is **Rounded (0.5rem base)**. This softens the technical nature of the dashboard, making it feel more like an educational tool than a cold scientific instrument.

- **Standard Buttons/Inputs:** 8px (0.5rem) corner radius.
- **Module Cards/AI Chat Bubbles:** 16px (1rem) corner radius for a friendlier, modern feel.
- **Timeline Handles:** Circular (pill-shaped) to invite dragging and tactile interaction.

Interactive elements should maintain consistent corner radii when nested; for example, a card with 16px radius should contain buttons with 8px radius to maintain visual harmony.

## Components

### Dashboard Cards
Cards feature a semi-transparent Indigo background with a 1px stroke. The header of the card should use **Space Grotesk** at the `headline-md` level.

### Timeline Slider (Animated)
The slider is a core interactive element for the "Sun & Moon" module. The track is a thin Astro Blue line. The "thumb" is a Celestial Gold glowing orb. As the user drags, the track "fills" with a gold gradient, and key phases (e.g., Total Eclipse) are marked with diamond-shaped pips.

### Navigation Bar
A vertical sidebar on the left. Active states use a "Glow" effect—a vertical gold bar on the left edge and a subtle radial gradient behind the icon. Icons should be thin-stroke (2px) to match the technical aesthetic.

### AI Assistant Panel
A floating "Glassmorphic" window. Messages from the AI appear with a subtle typing animation. Use **JetBrains Mono** for AI status (e.g., "Analyzing Celestial Coordinates...") and **Be Vietnam Pro** for the actual conversation.

### Inputs & Controls
Inputs use a dark, inset background to look like physical grooves in the dashboard. Focused states are signaled by a 1px Celestial Gold border and a soft outer glow.

### Starry Night Postcards
A specialized export component. It uses a different aesthetic: a "Retro-Print" style with textured backgrounds, traditional Chinese serif typography (if available, otherwise high-weight Be Vietnam Pro), and gold-stamped borders.