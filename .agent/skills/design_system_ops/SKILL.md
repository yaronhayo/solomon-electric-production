---
name: design_system_ops
description: Management of Tailwind 4 atomic design tokens, fluid typography scaling, and premium 2026 UI animations.
---

# Expert Design System Ops (v3.0)

This skill enables an agent to maintain the "Solomon Premium" aesthetic across 1,800+ pages while ensuring zero layout shifts (CLS) and high-performance rendering.

## 💎 The 2026 UI Standards

### 1. Atomic Design Tokens (@theme)

The `global.css` is the **Single Source of Truth**. Any UI change must happen here, not in local classes, to ensure 1,800-page consistency.

- **Brand Colors**:
  - Secondary/Action: `--color-accent` (#14D3E3)
  - Primary/Authority: `--color-primary` (#0D4380)
- **Safe Area Insets**: Critical for iOS notch support: `padding-left: max(clamp(1rem, 4vw, 2rem), env(safe-area-inset-left))`.

### 2. Fluid Typography Scale

All headings use the `clamp()` formula for "Perfect Scaling" (Single-line mobile titles vs. Cinematic desktop headers).

- **H1 Pattern**: `clamp(2.25rem, 4vw + 0.5rem, 4rem)`
- **Standard**: Never use static `px` or `rem` for headings; always use fluid vars.

### 3. Glassmorphism & Micro-animations

Premium feel is maintained through specific utility classes:

- **.glass-surface**: Backdrop-blur (12px) + 0.7 opacity white base + 40% border.
- **.shimmer-authority**: A relative-positioned overflow hidden container with an `::after` linear-gradient animation flowing at 3s intervals.
- **.magnetic-cta**: Uses `var(--ease-bounce)` specifically for high-conversion buttons.

## ⚡ Performance Engineering (CWV)

### Prevent FOUC (Flash of Unstyled Content)

The system uses a critical inline script pattern:

```css
html:not(.css-loaded) body { opacity: 0; }
html.css-loaded body { opacity: 1; transition: opacity 0.2s ease-out; }
```

### Rendering Optimization

Use `content-visibility: auto` for sections below the first scroll to optimize browser rendering time on content-heavy programmatic pages.

## 🛠 Component Stewardship

| Component | Responsibility | Pattern |
| :--- | :--- | :--- |
| **Container** | Layout Stability | `max-width: var(--container-max)` + `mx-auto`. |
| **Grid** | Responsive Flow | `grid lg:grid-cols-2 gap-12 items-center`. |
| **Hero** | LCP (Main Image) | `loading="eager"` + `fetchpriority="high"`. |

## 🎯 Mastery Signals

- **Lighthouse Performance**: Baseline 95+ (Check via `npm run test:build`).
- **Layout Shift (CLS)**: Strict 0.0 value.
- **Atomic Compliance**: 0 hardcoded hex colors in components; 100% token usage.
- **Conversion Aesthetics**: CTAs must use `var(--ease-bounce)` and have at least 1 trust badge within the visual container.
