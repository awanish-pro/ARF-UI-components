---
version: "2.0"
name: Airawat-design-system
description: A tech-first, quiet, precise, and plainly Indian design system for Airawat (National AI Centre of Excellence for Sustainable Cities, led by IIT Kanpur and run by Airawat Research Foundation). Synthesizes the Airawat Design and Brand Guide (Version 2, 16 October 2026) with the Airawat Interface Design System V2 and its 9-project dynamic theme architecture. Anchors on a warm paper canvas (#F5F3EC) at 70%, dark ink-based linear gradients at 20%, and five disciplined brand colours (paper, ink, slate, rose, sage) at 10%. Geometry is strictly square (0px) by default with zero drop shadows; pills are reserved exclusively for StageTag and circles exclusively for people. Typography assigns four faces to one job each: Space Grotesk for headlines and outlined figures, Inter for body and controls, JetBrains Mono for uppercase labels and coordinates, and Montserrat strictly for product lockups beside the logo.

colors:
  # Core five colours
  paper: "#f5f3ec"
  ink: "#111111"
  white: "#ffffff"
  slate: "#52769a"
  slate-deep: "#2f4e6d"
  slate-light: "#9bb3cc"
  rose: "#9a5b6a"
  rose-deep: "#7e4554"
  rose-light: "#161616ff"
  sage: "#96a394"
  sage-deep: "#6f7e70"
  sage-dark: "#4f5d50"

  # Solid tints and washes (mixed with paper, never alpha; UI extension)
  slate-tint: "#e1e4e2"
  slate-wash: "#d1d8da"
  rose-tint: "#eae1dc"
  rose-wash: "#e1d2cf"
  sage-tint: "#eae9e1"
  sage-wash: "#e0e1d9"

  # Gradient stops and blueprint grid
  grad-paper-start: "#f8f6ef"
  grad-paper-end: "#eae3d7"
  grad-ink-end: "#2a2a2a"
  grad-slate-end: "#7e9bb8"
  grad-rose-end: "#c48a96"
  grad-sage-end: "#b8c3b9"
  layer-slate-mid: "#6f87a6"
  layer-rose-mid: "#a66d7a"
  layer-sage-mid: "#9aa79b"
  partner-mid: "#3a5a7b"
  partner-end: "#5f5f7b"
  blueprint-mid: "#1f3044"
  grid-minor: "#1d2c3d"
  grid-major: "#2c435c"

  # Semantic tokens: Paper theme (default)
  surface: "#f5f3ec"
  surface-raised: "#efeae1"
  surface-sunken: "#eae3d7"
  text: "#111111"
  text-muted: "#615a52"
  text-label: "#2f4e6d"
  text-accent: "#7e4554"
  rule: "#111111"
  border: "#d6cfc3"
  border-strong: "#a99f91"
  focus: "#2f4e6d"
  action: "#111111"
  on-action: "#f5f3ec"
  brand: "#2f4e6d"
  on-brand: "#f5f3ec"
  hover: "#eae3d7"
  selected: "#e1e4e2"
  figure: "#2f4e6d"
  scrim: "rgb(17 17 17 / 0.72)"

  # Semantic tokens: Ink theme (.theme-ink on dark gradient grounds)
  surface-dark: "#111111"
  surface-dark-raised: "#1c2a38"
  surface-dark-sunken: "#0b0f14"
  text-on-dark: "#f5f3ec"
  text-muted-on-dark: "#c9d6e3"
  text-label-on-dark: "#9bb3cc"
  text-accent-on-dark: "#c99aa2"
  rule-on-dark: "#4a5d72"
  border-on-dark: "#4a5d72"
  border-strong-on-dark: "#7e9bb8"
  focus-on-dark: "#c9d6e3"
  hover-on-dark: "#2a3d51"

  # Stage tokens (word always shown with colour)
  stage-live: "#2f4e6d"
  stage-pilot: "#7e4554"
  stage-prototype: "#4f5d50"
  stage-live-on-dark: "#9bb3cc"
  stage-pilot-on-dark: "#c99aa2"
  stage-prototype-on-dark: "#f5f3ec"

  # Status tokens (mapped onto the five colours; UI extension)
  info: "#2f4e6d"
  info-tint: "#e1e4e2"
  success: "#4f5d50"
  success-tint: "#eae9e1"
  caution: "#9a5b6a"
  caution-tint: "#eae1dc"
  critical: "#7e4554"
  on-critical: "#f5f3ec"
  critical-tint: "#e1d2cf"
  critical-on-dark: "#c99aa2"
  on-critical-on-dark: "#111111"

gradients:
  # All approved gradients are linear at 115deg to 165deg (145deg default), darker end at top left
  warm-paper: "linear-gradient(145deg, #f8f6ef, #eae3d7)"
  ink: "linear-gradient(145deg, #111111, #2a2a2a)"
  slate: "linear-gradient(145deg, #2f4e6d, #7e9bb8)"
  oxide-rose: "linear-gradient(145deg, #7e4554, #c48a96)"
  sage: "linear-gradient(145deg, #6f7e70, #b8c3b9)"
  paper-to-slate: "linear-gradient(145deg, #f5f3ec, #52769a)"
  paper-to-deeper-slate: "linear-gradient(145deg, #f5f3ec, #2f4e6d)"
  paper-to-rose: "linear-gradient(145deg, #f5f3ec, #9a5b6a)"
  paper-to-sage: "linear-gradient(145deg, #f5f3ec, #96a394)"
  ink-to-slate: "linear-gradient(145deg, #111111, #52769a)"
  layered-slate: "linear-gradient(145deg, #f8f6ef, #6f87a6, #111111)"
  layered-rose: "linear-gradient(145deg, #f8f6ef, #a66d7a, #111111)"
  layered-sage: "linear-gradient(145deg, #f8f6ef, #9aa79b, #111111)"
  slate-to-rose: "linear-gradient(145deg, #52769a, #9a5b6a)"
  ink-slate-rose: "linear-gradient(145deg, #111111, #2f4e6d, #52769a, #7e4554)"
  partner-card: "linear-gradient(145deg, #2f4e6d, #3a5a7b, #5f5f7b)"
  blueprint-panel: "linear-gradient(145deg, #111111, #1f3044, #2f4e6d)"

projectThemes:
  # Per-project primary colour and ground from ARF Design and Brand Guide (V2).
  # Only project-scoped primary CTAs, project tabs, case tabs, and project ground
  # banners read these values. All shared UI components remain identical across projects.
  videoGrievance:
    label: "Video & Grievance (Kanpur)"
    ground: "{gradients.paper-to-slate}"
    primary: "{colors.slate-deep}"
    primaryHex: "#2F4E6D"
    primaryFg: "{colors.paper}"
    primaryHover: "{colors.ink}"
    onDarkPrimary: "{colors.slate-light}"
  propertyTax:
    label: "Property Tax (Punjab)"
    ground: "{gradients.warm-paper}"
    primary: "{colors.ink}"
    primaryHex: "#111111"
    primaryFg: "{colors.paper}"
    primaryHover: "{colors.slate-deep}"
    onDarkPrimary: "{colors.paper}"
  expenditure:
    label: "Expenditure (Odisha)"
    ground: "{gradients.paper-to-rose}"
    primary: "{colors.rose-deep}"
    primaryHex: "#7E4554"
    primaryFg: "{colors.paper}"
    primaryHover: "{colors.ink}"
    onDarkPrimary: "{colors.rose-light}"
  airQuality:
    label: "Air Quality (AQ-iDSS)"
    ground: "{gradients.slate-to-rose}"
    primary: "{colors.rose}"
    primaryHex: "#9A5B6A"
    primaryFg: "{colors.paper}"
    primaryHover: "{colors.rose-deep}"
    onDarkPrimary: "{colors.rose-light}"
  floods:
    label: "Floods"
    ground: "{gradients.paper-to-deeper-slate}"
    primary: "{colors.slate-deep}"
    primaryHex: "#2F4E6D"
    primaryFg: "{colors.paper}"
    primaryHover: "{colors.ink}"
    onDarkPrimary: "{colors.slate-light}"
  bridges:
    label: "Bridges & Infrastructure"
    ground: "{gradients.paper-to-sage}"
    primary: "{colors.sage-deep}"
    primaryHex: "#6F7E70"
    primaryFg: "{colors.ink}"
    primaryHover: "{colors.sage-dark}"
    onDarkPrimary: "{colors.sage}"
  waste:
    label: "Waste"
    ground: "{gradients.sage}"
    primary: "{colors.ink}"
    primaryHex: "#111111"
    primaryFg: "{colors.paper}"
    primaryHover: "{colors.sage-dark}"
    onDarkPrimary: "{colors.paper}"
  energy:
    label: "Energy"
    ground: "{gradients.oxide-rose}"
    primary: "{colors.rose-deep}"
    primaryHex: "#7E4554"
    primaryFg: "{colors.paper}"
    primaryHover: "{colors.ink}"
    onDarkPrimary: "{colors.rose-light}"
  water:
    label: "Water (Delhi Jal Board)"
    ground: "{gradients.slate}"
    primary: "{colors.slate-deep}"
    primaryHex: "#2F4E6D"
    primaryFg: "{colors.paper}"
    primaryHover: "{colors.ink}"
    onDarkPrimary: "{colors.slate-light}"

typography:
  display-xl:
    fontFamily: "'Space Grotesk', ui-sans-serif, system-ui, sans-serif"
    fontSize: 46px
    fontWeight: 500
    lineHeight: 1.04
    letterSpacing: -0.025em
  display-l:
    fontFamily: "'Space Grotesk', ui-sans-serif, system-ui, sans-serif"
    fontSize: 34px
    fontWeight: 500
    lineHeight: 1.07
    letterSpacing: -0.02em
  display-m:
    fontFamily: "'Space Grotesk', ui-sans-serif, system-ui, sans-serif"
    fontSize: 22px
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: -0.012em
  heading:
    fontFamily: "'Space Grotesk', ui-sans-serif, system-ui, sans-serif"
    fontSize: 16px
    fontWeight: 500
    lineHeight: 1.25
    letterSpacing: -0.005em
  figure-xl:
    fontFamily: "'Space Grotesk', ui-sans-serif, system-ui, sans-serif"
    fontSize: 56px
    fontWeight: 600
    lineHeight: 0.88
    letterSpacing: -0.04em
  figure-m:
    fontFamily: "'Space Grotesk', ui-sans-serif, system-ui, sans-serif"
    fontSize: 30px
    fontWeight: 600
    lineHeight: 1.0
    letterSpacing: -0.04em
  lead:
    fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif"
    fontSize: 17px
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: 0
  body:
    fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif"
    fontSize: 15px
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: 0
  body-s:
    fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif"
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: 0
  label:
    fontFamily: "'JetBrains Mono', ui-monospace, monospace"
    fontSize: 11px
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: 0.08em
    textTransform: uppercase
  caption:
    fontFamily: "'JetBrains Mono', ui-monospace, monospace"
    fontSize: 11px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0.04em
    textTransform: uppercase
  wordmark:
    fontFamily: "'Montserrat', ui-sans-serif, sans-serif"
    fontSize: 30px
    fontWeight: 700
    lineHeight: 1.0
    letterSpacing: 0.02em

rounded:
  none: 0px
  pill: 9999px
  round: 9999px

spacing:
  xxs: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  xxl: 48px
  section: 64px

controlHeights:
  sm: 32px
  md: 40px
  lg: 48px
  headerStrip: 24px
  topBar: 56px
  tableRowMin: 44px

components:
  # Brand & editorial components (Brand Guide V2)
  stage-tag:
    backgroundColor: transparent
    textColor: "{colors.stage-live}"
    borderColor: "{colors.stage-live}"
    borderWidth: 1px
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    height: 24px
    padding: 0 12px
  stat-figure:
    borderTop: "1px solid {colors.rule}"
    textColor: "{colors.figure}"
    figureStyle: "solid fill in {colors.figure} (tabular numerals, no stroke)"
    typography: "{typography.figure-xl}"
    labelColor: "{colors.text-muted}"
    labelTypography: "{typography.body-s}"
  section-opener:
    backgroundImage: "{gradients.ink-to-slate}"
    textColor: "{colors.paper}"
    accentColor: "{colors.rose-light}"
    numberStyle: "120px Space Grotesk outlined in {colors.paper}"
    typography: "{typography.display-xl}"
  partner-card:
    backgroundImage: "{gradients.partner-card}"
    borderColor: "{colors.slate}"
    borderWidth: 1px
    textColor: "{colors.paper}"
    roleTypography: "{typography.label}"
    avatarRounded: "{rounded.round}"
    avatarRing: "2px solid {colors.paper}"
    rounded: "{rounded.none}"
  case-tab:
    backgroundColor: "var(--project-primary)"
    textColor: "var(--project-primary-fg)"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: 4px 12px
  running-head:
    borderBottom: "1px solid {colors.rule}"
    textColor: "{colors.text-label}"
    typography: "{typography.label}"

  # Multi-project theme elements (ONLY surfaces that adapt per project)
  project-theme-bar:
    backgroundColor: "{colors.surface}"
    borderBottom: "1px solid {colors.rule}"
    tabTypography: "{typography.body-s}"
    activeTabBackground: "var(--project-primary)"
    activeTabText: "var(--project-primary-fg)"
    rounded: "{rounded.none}"
    height: 40px
  project-ground-banner:
    backgroundImage: "var(--project-ground)"
    textColor: "var(--project-ground-fg)"
    borderBottom: "1px solid {colors.rule}"
    rounded: "{rounded.none}"

  # Buttons & actions (primary CTA adapts per project; secondary, ghost, critical, group stay shared)
  button-primary:
    backgroundColor: "var(--project-primary)"
    textColor: "var(--project-primary-fg)"
    borderColor: "var(--project-primary)"
    borderWidth: 1px
    typography: "{typography.body-s}"
    rounded: "{rounded.none}"
    height: 40px
    padding: 0 16px
  button-primary-active:
    backgroundColor: "var(--project-primary-active)"
    textColor: "var(--project-primary-active-fg)"
    rounded: "{rounded.none}"
  button-primary-disabled:
    backgroundColor: "{colors.surface-sunken}"
    textColor: "{colors.text-muted}"
    borderColor: "{colors.border}"
    rounded: "{rounded.none}"
  button-secondary:
    backgroundColor: transparent
    textColor: "{colors.text}"
    borderColor: "{colors.rule}"
    borderWidth: 1px
    typography: "{typography.body-s}"
    rounded: "{rounded.none}"
    height: 40px
    padding: 0 16px
  button-ghost:
    backgroundColor: transparent
    textColor: "{colors.text}"
    borderColor: transparent
    typography: "{typography.body-s}"
    rounded: "{rounded.none}"
    height: 40px
    padding: 0 16px
  button-critical:
    backgroundColor: "{colors.critical}"
    textColor: "{colors.paper}"
    borderColor: "{colors.critical}"
    borderWidth: 1px
    typography: "{typography.body-s}"
    rounded: "{rounded.none}"
    height: 40px
    padding: 0 16px
  button-link:
    backgroundColor: transparent
    textColor: "var(--project-accent)"
    typography: "{typography.body-s}"
    textDecoration: underline
  button-group:
    borderColor: "{colors.rule}"
    borderWidth: 1px
    activeBackground: "{colors.action}"
    activeText: "{colors.on-action}"
    rounded: "{rounded.none}"
  icon-button:
    backgroundColor: transparent
    textColor: "{colors.text}"
    borderColor: "{colors.rule}"
    size: 40px
    rounded: "{rounded.none}"

  # Navigation & shell
  top-nav:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    activeIndicator: "2px solid {colors.text}"
    typography: "{typography.body-s}"
    height: 56px
  side-nav:
    backgroundColor: "{colors.surface-raised}"
    borderRight: "1px solid {colors.border}"
    activeBackground: "{colors.text}"
    activeText: "{colors.surface}"
    width: 240px
    rounded: "{rounded.none}"
  breadcrumbs:
    textColor: "{colors.text-muted}"
    currentTextColor: "{colors.text}"
    typography: "{typography.label}"
  product-lockup:
    wordmarkTypography: "{typography.wordmark}"
    dividerColor: "{colors.border-strong}"

  # Base form & selection controls (consistent across all 9 project themes)
  text-input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    borderColor: "{colors.border-strong}"
    borderWidth: 1px
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    height: 40px
    padding: 0 12px
  text-input-error:
    borderColor: "{colors.critical}"
    errorTextColor: "{colors.critical}"
    rounded: "{rounded.none}"
  textarea:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    borderColor: "{colors.border-strong}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    padding: 12px
  select:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    borderColor: "{colors.border-strong}"
    popoverBorderColor: "{colors.rule}"
    typography: "{typography.body-s}"
    rounded: "{rounded.none}"
    height: 40px
  checkbox:
    backgroundColor: "{colors.surface}"
    borderColor: "{colors.rule}"
    checkedBackground: "{colors.brand}"
    checkedText: "{colors.on-brand}"
    size: 16px
    rounded: "{rounded.none}"
  radio:
    backgroundColor: "{colors.surface}"
    borderColor: "{colors.rule}"
    checkedBorderColor: "{colors.brand}"
    innerSquareColor: "{colors.brand}"
    size: 16px
    rounded: "{rounded.none}"
  toggle:
    backgroundColor: "{colors.surface}"
    borderColor: "{colors.rule}"
    checkedBackground: "{colors.brand}"
    thumbColor: "{colors.text}"
    checkedThumbColor: "{colors.on-brand}"
    rounded: "{rounded.none}"
  slider:
    trackColor: "{colors.surface-sunken}"
    fillColor: "{colors.brand}"
    thumbBorderColor: "{colors.text}"
    thumbSize: 16px
    rounded: "{rounded.none}"
  file-upload:
    backgroundColor: "{colors.surface-raised}"
    borderStyle: "1px dashed {colors.border-strong}"
    activeBorderColor: "{colors.brand}"
    rounded: "{rounded.none}"
  text-editor:
    backgroundColor: "{colors.surface}"
    toolbarBackground: "{colors.surface-raised}"
    borderColor: "{colors.border-strong}"
    rounded: "{rounded.none}"

  # Badges, tags, avatars, tabs (shared Design System V2 colours across all projects)
  badge:
    backgroundColor: "{colors.surface}"
    borderColor: "{colors.border}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
  count-badge:
    backgroundColor: "{colors.action}"
    textColor: "{colors.on-action}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
  tag:
    backgroundColor: "{colors.surface}"
    borderColor: "{colors.border}"
    selectedBackground: "{colors.action}"
    selectedText: "{colors.on-action}"
    typography: "{typography.body-s}"
    rounded: "{rounded.none}"
  avatar:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.slate-deep}"
    ring: "2px solid {colors.paper}"
    rounded: "{rounded.round}"
  tabs-line:
    borderBottom: "1px solid {colors.rule}"
    activeIndicator: "2px solid {colors.action}"
    typography: "{typography.body-s}"
  tabs-boxed:
    borderColor: "{colors.rule}"
    activeBackground: "{colors.action}"
    activeText: "{colors.on-action}"
    rounded: "{rounded.none}"

  # Feedback, overlays & disclosure (shared Design System V2 colours across all projects)
  alert:
    backgroundColor: "{colors.surface}"
    headerStripBackground: "{colors.surface-raised}"
    borderColor: "{colors.border}"
    rounded: "{rounded.none}"
  banner:
    backgroundImage: "{gradients.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.none}"
  toast:
    position: "top-center (middle top, 16px from viewport top)"
    backgroundImage: "{gradients.ink}"
    borderColor: "{colors.rule-on-dark}"
    textColor: "{colors.paper}"
    rounded: "{rounded.none}"
    autoNetworkEvents: "offline (persistent critical) and online (success)"
  whitespace-motif:
    backgroundColor: "{colors.surface}"
    borderColor: "{colors.border}"
    motifStroke: "0.75px hairline (vastu | kolam | jaali | baoli | baoli-colour | stambha)"
    rounded: "{rounded.none}"
  surface-theme-switch:
    backgroundColor: "{colors.surface}"
    borderColor: "{colors.rule}"
    activeBackground: "{colors.text}"
    activeText: "{colors.surface}"
    modes: "paper (light) | ink (dark gradient)"
    rounded: "{rounded.none}"
  tooltip:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    typography: "{typography.body-s}"
    rounded: "{rounded.none}"
  modal:
    backgroundColor: "{colors.surface}"
    borderColor: "{colors.rule}"
    backdropColor: "{colors.scrim}"
    headerStripBackground: "{colors.surface-raised}"
    rounded: "{rounded.none}"
  drawer:
    backgroundColor: "{colors.surface}"
    borderLeft: "1px solid {colors.rule}"
    backdropColor: "{colors.scrim}"
    rounded: "{rounded.none}"
  command-menu:
    backgroundColor: "{colors.surface}"
    borderColor: "{colors.rule}"
    activeRowBackground: "{colors.action}"
    activeRowText: "{colors.on-action}"
    rounded: "{rounded.none}"
  dropdown:
    backgroundColor: "{colors.surface}"
    borderColor: "{colors.rule}"
    rounded: "{rounded.none}"
  accordion:
    borderTop: "1px solid {colors.rule}"
    openIndicatorBackground: "{colors.action}"
    openIndicatorText: "{colors.on-action}"
    rounded: "{rounded.none}"

  # Data, metrics & progress (shared Design System V2 colours across all projects)
  data-table:
    backgroundColor: "{colors.surface}"
    headerBackground: "{colors.surface-raised}"
    headerRule: "1px solid {colors.rule}"
    rowBorder: "1px solid {colors.border}"
    minRowHeight: 44px
    rounded: "{rounded.none}"
  pagination:
    activeBackground: "{colors.action}"
    activeText: "{colors.on-action}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
  metric-card:
    backgroundColor: "{colors.surface}"
    borderColor: "{colors.border}"
    headerStripHeight: 32px
    figureTypography: "{typography.figure-m}"
    sourceTypography: "{typography.caption}"
    rounded: "{rounded.none}"
  chart-frame:
    backgroundColor: "{colors.surface}"
    borderColor: "{colors.border}"
    headerStripBackground: "{colors.surface-raised}"
    sourceTypography: "{typography.caption}"
    rounded: "{rounded.none}"
  progress-bar:
    trackColor: "{colors.surface-sunken}"
    fillColor: "{colors.brand}"
    rounded: "{rounded.none}"
  stepper:
    doneBackground: "{colors.brand}"
    currentBorder: "{colors.action}"
    rounded: "{rounded.none}"
  calendar:
    selectedBackground: "{colors.action}"
    selectedText: "{colors.on-action}"
    rangeFill: "{colors.selected}"
    todayUnderline: "{colors.text-accent}"
    rounded: "{rounded.none}"
  activity-feed:
    borderColor: "{colors.border}"
    systemNodeSize: 6px
    rounded: "{rounded.none}"
  live-indicator:
    squareSize: 6px
    typography: "{typography.label}"
  india-state-map:
    backgroundColor: "{colors.surface-dark}"
    backgroundImage: "{gradients.blueprint-panel}"
    outlineColor: "{colors.paper}"
    stateBorderColor: "{colors.grid-major}"
    deploymentSiteOnDark: "{colors.rose-light}"
    deploymentSiteOnPaper: "{colors.rose}"
    labelTypography: "{typography.caption}"
    rounded: "{rounded.none}"
  city-map:
    backgroundColor: "{colors.surface}"
    wardFill: "{colors.surface-raised}"
    wardSelectedFill: "{colors.slate-wash}"
    wardBorderColor: "{colors.border-strong}"
    highwayColor: "{colors.slate}"
    railColor: "{colors.rose}"
    railStyle: "dashed (6 4)"
    northArrowColor: "{colors.ink}"
    scaleBarColor: "{colors.ink}"
    labelTypography: "{typography.caption}"
    rounded: "{rounded.none}"
  gis-map:
    backgroundColor: "{colors.paper}"
    blueprintBackground: "{gradients.blueprint-panel}"
    toolbarBackground: "{colors.surface-raised}"
    controlBorderColor: "{colors.rule}"
    parcelGapFill: "{colors.rose-wash}"
    parcelGapStroke: "{colors.rose-deep}"
    parcelPspclFill: "{colors.rose-tint}"
    parcelPspclStroke: "{colors.rose}"
    parcelTaxNetFill: "{colors.sage-wash}"
    parcelTaxNetStroke: "{colors.sage-dark}"
    parcelModifiedFill: "{colors.slate-wash}"
    parcelModifiedStroke: "{colors.slate-deep}"
    parcelExemptFill: "{colors.surface-sunken}"
    parcelExemptStroke: "{colors.text-muted}"
    detectionBoxStrokeOnDark: "{colors.white}"
    detectionBoxStrokeOnPaper: "{colors.ink}"
    detectionTagBackground: "{colors.paper}"
    detectionTagText: "{colors.ink}"
    detectionTagTypography: "{typography.label}"
    rounded: "{rounded.none}"
---

## Overview

Airawat is the National AI Centre of Excellence for Sustainable Cities, led by IIT Kanpur and run by Airawat Research Foundation (ARF). Everything the institution publishes, from printed institutional profiles and case studies to live municipal software dashboards, must read as one institution: **tech-first, quiet, precise, and plainly Indian**.

The guiding idea in one line: **Research and innovation that start in a lab and end on our streets.** Every document and every interface screen follows the same progression: **evidence first, then the system, then the street**.

This specification unifies two sources:
1. **Airawat Design and Brand Guide (Version 2, 16 October 2026)** authored by Ayushi Mishra (Head of Product and Partnerships, ARF).
2. **Airawat Interface Design System V2** (`src/ds/`), the live React 19 + Vite 8 + Tailwind CSS v4 component library supporting Public Grievance Redressal (PGR), Video Management System (VMS), Property Tax (PT), and all nine Airawat municipal solutions through dynamic multi-project theme switching.

Where the print guide and the live interface system differ, the live Airawat Design System wins for interactive software, while print rules govern documents and stationery. UI-specific adaptations are marked **UI extension**.

**Key Characteristics:**
- **Warm paper canvas (`{colors.paper}` #F5F3EC) at 70%** of every surface, paired with **20% dark ink-based linear gradients** and **10% accent** (`slate`, `rose`, `sage`). Never pure white on editorial/UI pages, never flat charcoal pages.
- **Strictly five core colours:** `paper`, `ink`, `slate`, `rose`, and `sage`. Every tint, deep step, status tone, and gradient stop is mixed from these five as solid values (no alpha in print).
- **Square by default (`{rounded.none}` 0px).** Every card, button, input, checkbox, radio, toggle, and bar is square. `radius-pill` belongs exclusively to `StageTag`; `radius-round` belongs exclusively to people photos and avatars.
- **Depth without drop shadows.** Tailwind shadow utilities are removed by design. Layers separate through 1px borders (`border` vs `rule`), surface steps (`surface` vs `surface-raised`), fine grain texture, the 12px/60px blueprint grid, and approved linear gradients.
- **Four typefaces, one job each:** Space Grotesk (headlines and outlined figures), Inter (running text and controls), JetBrains Mono (uppercase labels, codes, captions; never sentences), and Montserrat (strictly product lockups beside the logo).
- **One shared component library across 9 projects.** A central CSS variable architecture (`ProjectThemeProvider`) swaps project-specific ground gradients and primary CTA colours dynamically without altering inputs, forms, tables, switches, or navigation.
- **Words before colour.** Status, stage, presence, and toggle states always display an explicit word; colour reinforces meaning and never replaces it.

---

## Principles & Voice

### Core Design Principles

| Principle | In practice |
|---|---|
| **Evidence first, then the system, then the street** | Move readers and municipal officers from a measured fact to a decision a city can stand behind. |
| **Tech-first, quiet, precise** | Paper grounds, ink text, one accent. Zero decoration that carries no meaning. |
| **Square by default** | Every corner is 0px. Pills belong only to stage tags and circles only to people. |
| **Words before colour** | Status, stage, and module always carry a word. Colour never acts alone. |
| **Depth without shadows** | Separate layers by border weight, surface step, and approved gradients. |
| **Every number has a source** | Metrics and charts always carry a source line. Estimates are explicitly labelled. |
| **Readable for every reader** | Many readers and municipal officers are over 50 and work in the field. Keep type generous, contrast high (at least 4.5:1), and wording plain. |

### Voice and Writing Rules

Write the way a senior engineer briefs a decision-maker: plain, specific, and argument-forward. Lead with the claim, then the evidence.

- **Precision over sentiment.** Name the measure, the place, and the number. Write `"complaints closed within 48 hours rose from 60% to 82%"`, not `"much faster service"`.
- **No em dashes.** Use a full stop, a comma, or a colon. Keep sentences short and split anything over 30 words.
- **Use the reader's own terms.** Name institutions, programmes, and roles the way the people who run them do. Spell product names exactly as trademarked every time.
- **Spell out every acronym on first use**, with the short form in brackets: `"Service level agreement (SLA)"`. Use the short form thereafter.
- **Not salesy.** Never use `"revolutionary"`, `"seamless"`, `"world-class"`, or similar hype. No competitor comparisons, no exclamation marks, no emoji.
- **Claim only what is measured.** Keep four categories strictly separate: what is **installed**, what is **measured**, what is **associated**, and what is still a **plan**. State explicitly when a figure is an estimate, from a small pilot, or non-causal.
- **Rounding.** Round large figures in public material (`"over ₹100 Cr"`, not `"₹103.7 Cr"`). Keep exact figures for reports, tenders, and audits.
- **Headlines close on an accent.** Sentence case, ending with a full stop. The last two to four words take `text-accent`, one accent per headline.
- **Actionable UI copy.** Buttons are verbs naming the outcome (`"Assign grievance"`, `"Close with proof"`, `"Disable camera"`). Never `"OK"` or `"Submit"`.
- **Dates.** Always format as `DD Mon YYYY` (`14 Jun 2026`). Never ambiguous numeric formats.
- **Errors.** State what failed in the reader's terms, display a reference code (`PT-503-118204`), and state the next step.

**Approved Brand Lines:**
- *Research and innovation that start in a lab and end on our streets.*
- *Technology for India, made in India.*
- *Creating cutting-edge technology for the most rugged use cases in India.*
- *Better data. Better decisions. Better cities.* (visiting cards, letterhead, closing spreads)

---

## Colors

### Core Palette (Five Colours)

Every tint, deep step, and gradient stop is derived from five core colours.

| Token | Hex | Role |
|---|---|---|
| `{colors.paper}` | `#F5F3EC` | Warm paper. About 70% of every surface. |
| `{colors.ink}` | `#111111` | Ink. Text, rules, primary dark anchor. |
| `{colors.slate}` | `#52769A` | Slate blue. Primary brand colour. |
| `{colors.rose}` | `#9A5B6A` | Oxide rose. Second brand colour. |
| `{colors.sage}` | `#96A394` | Sage. Third brand colour. |

### Colour Families & Solid Tints

Washes (~22%) and tints (~12%) are solid mixes with `paper` (never alpha), introduced as a **UI extension** for status and selection backgrounds so print exports remain free of transparency casts.

| Family | Dark / Deep | Base | Light | Wash (22% solid) | Tint (12% solid) |
|---|---|---|---|---|---|
| **Slate** | `slate-deep` `#2F4E6D` | `slate` `#52769A` | `slate-light` `#9BB3CC` | `slate-wash` `#D1D8DA` | `slate-tint` `#E1E4E2` |
| **Rose** | `rose-deep` `#7E4554` | `rose` `#9A5B6A` | `rose-light` `#C99AA2` | `rose-wash` `#E1D2CF` | `rose-tint` `#EAE1DC` |
| **Sage** | `sage-dark` `#4F5D50` / `sage-deep` `#6F7E70` | `sage` `#96A394` | `grad-sage-end` `#B8C3B9` | `sage-wash` `#E0E1D9` | `sage-tint` `#EAE9E1` |

**Small-text rule:** Never set `slate`, `rose`, or `sage` as small text on `paper`. Always use `slate-deep`, `rose-deep`, or `sage-dark`.

### Surface & Semantic Tokens: Paper (Light) vs Ink (Dark) Theme (WCAG AA & AAA)

Developers can switch between **Paper (Light)** and **Ink (Dark)** globally using `SurfaceThemeSwitch` or `useProjectTheme().setSurfaceTheme('paper' | 'ink')` (which toggles `.theme-ink` and `data-theme="ink"` on `document.documentElement` and persists in `localStorage`), or scope any section locally with `.theme-ink`. Per the Brand Guide, Ink (Dark) mode always sits on an approved dark linear gradient (`bg-grad-ink-slate`), never a flat charcoal surface.

Every text and status foreground/background pair is verified for **WCAG 2.1 AA (4.5:1+)** and **AAA (7.0:1+)** contrast in both Paper (Light) and Ink (Dark) modes:

| Token | Paper (Light) | Paper Contrast | Ink (Dark `.theme-ink`) | Ink Contrast | Use |
|---|---|---|---|---|---|
| `surface` | `#F5F3EC` | Base | `#111111` (on `bg-grad-ink-slate`) | Base | Page ground (ink pages always carry a gradient). |
| `surface-raised` | `#EFEAE1` | Base | `#1C2A38` | Base | Panels, inset boxes, header strips, sidebars. |
| `surface-sunken` | `#EAE3D7` | Base | `#0B0F14` | Base | Disabled fields, empty tracks (UI extension). |
| `text` | `#111111` | **17.0:1 (AAA)** | `#F5F3EC` | **17.0:1 (AAA)** on ink · **13.5:1 (AAA)** on raised | Body text and headlines. |
| `text-muted` | `#615A52` | **6.1:1 (AA)** | `#C9D6E3` | **12.8:1 (AAA)** on ink · **10.1:1 (AAA)** on raised | Secondary text and captions. |
| `text-label` | `#2F4E6D` | **7.8:1 (AAA)** | `#9BB3CC` | **8.7:1 (AAA)** on ink · **6.9:1 (AA+)** on raised | Monospace labels and section tags. |
| `text-accent` | `#7E4554` | **6.6:1 (AA)** | `#C99AA2` | **7.8:1 (AAA)** on ink · **6.1:1 (AA)** on raised | Accent words closing a headline. |
| `critical` / `on-critical` | `#7E4554` / `#F5F3EC` | **6.6:1 (AA)** | `#C99AA2` / `#111111` | **7.9:1 (AAA)** | Critical buttons, alert header strips, critical badges. |
| `info` on `info-tint` | `#2F4E6D` on `#E1E4E2` | **6.8:1 (AA+)** | `#9BB3CC` on `#1B242D` | **7.4:1 (AAA)** | Notice status badges and inline alerts. |
| `success` on `success-tint` | `#4F5D50` on `#EAE9E1` | **5.9:1 (AA)** | `#B8C3B9` on `#242A25` | **8.1:1 (AAA)** | Resolved status badges and inline alerts. |
| `caution` on `caution-tint` | `#9A5B6A` on `#EAE1DC` | **4.6:1 (AA)** | `#C99AA2` on `#332427` | **6.2:1 (AA)** | Caution status badges and inline alerts. |
| `rule` | `#111111` | **17.0:1** | `#4A5D72` | **3.1:1 (UI)** | Running-head rules, table heads, overlay borders. |
| `border` / `border-strong` | `#D6CFC3` / `#A99F91` | UI | `#4A5D72` / `#7E9BB8` | **3.1–6.2:1 (UI)** | Card and box borders, form control outlines. |
| `focus` | `#2F4E6D` | **7.8:1 (AAA)** | `#C9D6E3` | **12.8:1 (AAA)** | 2px focus ring with 2px offset. |
| `brand` / `on-brand` | `#2F4E6D` / `#F5F3EC` | **7.8:1 (AAA)** | `#9BB3CC` / `#111111` | **9.6:1 (AAA)** | Shared form controls (checkbox, radio, toggle, slider). |
| `figure` | `#2F4E6D` | **7.8:1 (AAA)** | `#F5F3EC` | **17.0:1 (AAA)** | Solid metric and headline figure fill (no stroke). |
| `scrim` | `rgb(17 17 17 / 0.72)` | Screen only | `rgb(17 17 17 / 0.72)` | Screen only | Modal and drawer backdrop (**screen only**). |

### Stage & Status Tokens

**Product stages** (fixed colours; word always shown):
- **Live:** `stage-live` (`#2F4E6D` on paper, `#9BB3CC` on dark)
- **Pilot:** `stage-pilot` (`#7E4554` on paper, `#C99AA2` on dark)
- **Prototype:** `stage-prototype` (`#4F5D50` on paper, `#F5F3EC` on dark)

**Status tones (UI extension)** map onto the five brand colours without introducing red, amber, or green:
- **Info (`Notice`):** Foreground `slate-deep` `#2F4E6D`, tint `slate-tint` `#E1E4E2`
- **Success (`Resolved`):** Foreground `sage-dark` `#4F5D50`, tint `sage-tint` `#EAE9E1`
- **Caution (`Caution`):** Foreground `rose` `#9A5B6A`, tint `rose-tint` `#EAE1DC`
- **Critical (`Critical`):** Solid `rose-deep` `#7E4554`, wash `rose-wash` `#E1D2CF`

### Case-Study & Multi-Project Theme Architecture

Each of the nine Airawat solutions owns one approved ground gradient and one primary accent / CTA colour. In the interface kit, `ProjectThemeProvider` (`src/ds/projectThemes.tsx`) dynamically updates `--project-primary`, `--project-primary-fg`, `--project-primary-hover`, `--project-primary-active`, `--project-ground`, `--project-accent`, and `--project-focus`. Foreground text on CTAs and grounds is selected automatically via WCAG 2.1 relative luminance (`getAccessibleForeground`).

| Project / Solution | Ground Theme | Stops | Primary Accent / CTA |
|---|---|---|---|
| **Video & Grievance (Kanpur)** | Paper → Slate | `#F5F3EC → #52769A` | `slate-deep` `#2F4E6D` |
| **Property Tax (Punjab)** | Warm Paper | `#F8F6EF → #EAE3D7` | `ink` `#111111` |
| **Expenditure (Odisha)** | Paper → Rose | `#F5F3EC → #9A5B6A` | `rose-deep` `#7E4554` |
| **Air Quality (AQ-iDSS)** | Slate → Rose | `#52769A → #9A5B6A` | `rose` `#9A5B6A` |
| **Floods** | Paper → Deeper Slate | `#F5F3EC → #2F4E6D` | `slate-deep` `#2F4E6D` |
| **Bridges & Infrastructure** | Paper → Sage | `#F5F3EC → #96A394` | `sage-deep` `#6F7E70` |
| **Waste** | Sage Gradient | `#6F7E70 → #B8C3B9` | `ink` `#111111` |
| **Energy** | Oxide Rose Gradient | `#7E4554 → #C48A96` | `rose-deep` `#7E4554` |
| **Water (Delhi Jal Board)** | Slate Gradient | `#2F4E6D → #7E9BB8` | `slate-deep` `#2F4E6D` |

**Consistency Boundary (Different Primary Colour, Identical Shared Components):**
- **Changes per project (ARF New Design Guideline):** Only the project's assigned **Primary Colour** (`--project-primary` / `--project-primary-fg` / `--project-accent`), applied to primary CTA buttons (`button-primary`, `button-link`), the active project tab (`ProjectThemeBar`), `CaseTab`, and the project's **Ground Theme** (`--project-ground`) for hero/banner previews.
- **Identical across all 9 projects (Design System V2 component library):** Every shared UI component retains its exact Design System V2 colours (`ink` `#111111`, `paper` `#F5F3EC`, `slate-deep` `#2F4E6D` `brand`, `border` `#D6CFC3`, `rule` `#111111`). Inputs, textareas, selects, dropdowns, checkboxes, radios, toggles, sliders, button groups, badges, count badges, tags, tabs, tables, pagination, cards, modals, drawers, command menus, accordions, calendars, tooltips, charts, and navigation shells never change colour when switching projects.

**Stationery Exception:** Visiting cards, letterhead, and envelopes are strictly monochrome (`ink`, greys, and pure white; no `slate`, `rose`, or `sage`).

---

## Gradients

These are the only approved gradients in the brand. Every gradient is linear at **115° to 165°** (145° default in CSS), with the darker stop at the top left. Do not invent new stops.

### Single-Hue Gradients

| Gradient | Utility | Stops | Use |
|---|---|---|---|
| Warm paper | `bg-grad-paper` | `grad-paper-start` `#F8F6EF` → `grad-paper-end` `#EAE3D7` | Quiet light pages, panels, contents |
| Ink | `bg-grad-ink` | `ink` `#111111` → `grad-ink-end` `#2A2A2A` | Under photographs (print); toasts and banners (UI extension) |
| Slate | `bg-grad-slate` | `slate-deep` `#2F4E6D` → `grad-slate-end` `#7E9BB8` | Product and platform pages |
| Oxide rose | `bg-grad-rose` | `rose-deep` `#7E4554` → `grad-rose-end` `#C48A96` | People, history |
| Sage | `bg-grad-sage` | `sage-deep` `#6F7E70` → `grad-sage-end` `#B8C3B9` | Case studies, environment |

### Pairing Gradients

| Gradient | Utility | Stops | Use |
|---|---|---|---|
| Paper to slate | `bg-grad-paper-slate` | `paper` `#F5F3EC` → `slate` `#52769A` | Light hero sections |
| Paper to deeper slate | `bg-grad-paper-slate-deep` | `paper` `#F5F3EC` → `slate-deep` `#2F4E6D` | Floods case-study ground |
| Paper to rose | `bg-grad-paper-rose` | `paper` `#F5F3EC` → `rose` `#9A5B6A` | Light hero sections |
| Paper to sage | `bg-grad-paper-sage` | `paper` `#F5F3EC` → `sage` `#96A394` | Light hero sections |
| Ink to slate | `bg-grad-ink-slate` | `ink` `#111111` → `slate` `#52769A` | Covers, section openers |

### Layered & Component Gradients

| Gradient | Utility | Stops | Use |
|---|---|---|---|
| Layered slate | `bg-grad-layered-slate` | `#F8F6EF` → `layer-slate-mid` `#6F87A6` → `ink` `#111111` | Editorial dividers |
| Layered rose | `bg-grad-layered-rose` | `#F8F6EF` → `layer-rose-mid` `#A66D7A` → `ink` `#111111` | Editorial dividers |
| Layered sage | `bg-grad-layered-sage` | `#F8F6EF` → `layer-sage-mid` `#9AA79B` → `ink` `#111111` | Editorial dividers |
| Slate to rose | `bg-grad-slate-rose` | `slate` `#52769A` → `rose` `#9A5B6A` | Vision and closing spreads |
| Ink, slate, rose | `bg-grad-ink-slate-rose` | `ink` → `slate-deep` → `slate` → `rose-deep` | Long spreads such as the vision spread |
| Partner card | `bg-grad-partner` | `slate-deep` `#2F4E6D` → `#3A5A7B` → `#5F5F7B` | Researcher and partner cards on paper |
| Blueprint panel | `bg-grad-blueprint` | `ink` `#111111` → `#1F3044` → `slate-deep` `#2F4E6D` | Panels holding a system diagram |

**Gradient Rules:**
- One gradient per spread, spanning both pages so it never restarts at the fold.
- Text on light gradients is `text` (at least 4.5:1); text on dark gradients is `paper` (with `theme-ink`).
- A photograph behind a gradient becomes texture with fine grain (`grain`); never lay a flat gradient over a photo.
- No transparency or blend modes in print files; mix every stop to solid hex values.

---

## Typography

### Four Faces, One Job Each

| Face | Token | Job |
|---|---|---|
| **Space Grotesk** | `font-display` | Headlines, outlined figures, card titles. Weight 500 for words, 600 for figures. Tight negative tracking. |
| **Inter** | `font-body` | All running text, form controls, table cells. |
| **JetBrains Mono** | `font-mono` | Uppercase labels, running heads, captions, coordinates, diagram labels. **Never for sentences.** |
| **Montserrat** | `font-logo` | Strictly for product lockups beside the logo artwork (`AIRAWAT OS`). **Never for headlines.** |

### Hierarchy

| Token | Utility | Size / LH / Weight | Tracking | Use |
|---|---|---|---|---|
| `{typography.display-xl}` | `type-display-xl` | 46px / 1.04 / 500 | `-0.025em` | Section openers and covers. One per page. |
| `{typography.display-l}` | `type-display-l` | 34px / 1.07 / 500 | `-0.02em` | Page headlines. |
| `{typography.display-m}` | `type-display-m` | 22px / 1.2 / 500 | `-0.012em` | Product promises, modal titles, pull lines. |
| `{typography.heading}` | `type-heading` | 16px / 1.25 / 500 | `-0.005em` | Box, card, and alert headings. |
| `{typography.figure-xl}` | `type-figure-xl` | 56px / 0.88 / 600 | `-0.04em` | Solid filled headline figures (`tabular-nums`, `slate-deep` on paper, `paper` on dark). |
| `{typography.figure-m}` | `type-figure-m` | 30px / 1.0 / 600 | `-0.04em` | Solid filled figure rows, KPI cards, and timelines. |
| `{typography.lead}` | `type-lead` | 17px / 1.6 / 400 | `0` | Lead paragraph directly under a headline. |
| `{typography.body}` | `type-body` | 15px / 1.6 / 400 | `0` | Running text, field values. |
| `{typography.body-s}` | `type-body-s` | 13px / 1.55 / 400 | `0` | Card text, controls, table cells. |
| `{typography.label}` | `type-label` | 11px / 1.4 / 500 (CAPS) | `+0.08em` | Section tags, running heads, box headers. |
| `{typography.caption}` | `type-caption` | 11px / 1.5 / 400 (CAPS) | `+0.04em` | Sources, timestamps, footnotes. |
| `{typography.wordmark}` | `type-wordmark` | 30px / 1.0 / 700 | `+0.02em` | Product lockup beside logo only. |

### Typography Principles

- **Solid metric figures (UI extension for readability):** In screen interfaces and dashboards, metric and headline figures (`StatFigure`, `Figure`, `MetricCard`) use **solid colour fill** (`slate-deep` `#2F4E6D` on paper, `paper` `#F5F3EC` on dark, or the case accent) with `tabular-nums` and **no stroke**. Hollow stroke-only numerals reduce legibility at dashboard sizes and are reserved strictly for decorative 120px section-opener numbers (`SectionOpener`).
- **Readability floors:** Many municipal readers are over 50. In print, body text never drops below **14px (10.5pt)**; in dense UI tables/cards, floor is **13px**. Labels and captions never drop below **11px (8.5pt)** (except visiting cards, where 7pt is the absolute floor).
- **Line length & breaks:** Keep prose near 65 characters (`max-w-prose`). Headlines use sentence case, end with a full stop, and apply `text-wrap: balance`.

---

## Layout

### Spacing System

4px base unit through Tailwind's spacing scale:

- `{spacing.xxs}` 4px: icon-to-text gaps, segmented gaps
- `{spacing.xs}` 8px: tight stacks, tag gaps
- `{spacing.sm}` 12px: control padding, list rows
- `{spacing.md}` 16px: compact card padding, field gaps
- `{spacing.lg}` 24px: standard card padding, grid gutters
- `{spacing.xl}` 32px: panel padding, tablet page margins
- `{spacing.xxl}` 48px: desktop page margins
- `{spacing.section}` 56px to 64px: major section spacing

### Control Heights

- `sm`: 32px (`h-8`) for toolbars and table actions
- `md`: 40px (`h-10`) for default buttons and inputs
- `lg`: 48px (`h-12`) for primary calls to action and field devices
- Header strips: 24px to 32px; Top bar: 56px; Table rows: minimum 44px for touch

### Grids & Formats

- **Application grid:** 12 columns, 24px gutters, 32 to 48px margins, 240 to 264px sidebar, max content width 1200px, prose max 65ch.
- **A4 print format:** 794 × 1123px at 96dpi. Every page carries a running head (`label`, section number and name left, topic right) over a 1px `rule`, and a footer with `airawat.org`, page number, and black or white logo at 30px tall right (no organisation name in footer).
- **Section spreads:** Two-page dark gradient spread; left page holds 120px outlined section number, one-line headline with accent, and two lines of context; right page holds a blueprint diagram and the Indian flag (`42 × 28px`, top right, 76px from edge, one per spread).
- **Pacing:** Never more than three dense text pages in a row. Break rhythm with a diagram, a toned photograph band, or a hairline heritage motif in open space.

---

## Elevation & Depth

**There are no drop shadows, glows, or blur.** Tailwind shadow tokens are stripped from `@theme`.

| Level | Treatment | Use |
|---|---|---|
| **0 · Surface** | `bg-surface` + `border-border` | Page floor, rows, cards |
| **1 · Raised** | `bg-surface-raised` + `border-border` | Panels, header strips, sidebars |
| **2 · Overlay** | `bg-surface` + `border-rule` | Menus, selects, date pickers, popovers |
| **3 · Modal** | `bg-surface` + `border-rule` over `bg-scrim` | Dialogs, drawers, command menu |

**Surface & Texture Utilities:**
- `focus-ring` / `:focus-visible`: 2px solid `focus` token, 2px offset. Never removed.
- `grain`: Subtle fractal noise overlay on large gradient surfaces.
- `bg-blueprint-grid`: Blueprint gradient with 12px `grid-minor` and 60px `grid-major` lines and corner `+` registration marks.
- `skeleton`: Solid-tint 1.6s sweep shimmer.

---

## Shapes

| Token | Value | Strictly Allowed For |
|---|---|---|
| `{rounded.none}` | `0px` | Default for everything: buttons, inputs, cards, modals, badges, tags, checkboxes, radios, switches, bars. |
| `{rounded.pill}` | `9999px` | Exclusively `StageTag` (`LIVE`, `PILOT`, `PROTOTYPE`). |
| `{rounded.round}` | `9999px` | Exclusively people photos and `Avatar` components. |

Cards carry a 1px `border`. Never use coloured left-border accents on cards.

---

## Logo, Iconography, Imagery & Heritage Motifs

### Supplied Logo Artwork

- Use supplied artwork only (`logo-black` on paper/light gradients, `logo-white` on dark gradients; minimum print height 24px). Never redraw, recolour, or re-letter.
- `mark-colour` (elephant mark with "AI" accent) and `mark-white` are for back covers and closing pages.
- Clear space equals the height of the elephant's head on all four sides.
- `"AIRAWAT"` in a headline is set in Space Grotesk (`font-display`), never traced from the logo.
- `<LogoSlot />` marks the logo's place in interface shells until production artwork is dropped in.

### Iconography & Functional Glyphs

- **No generic icon set and no emoji.** Meaning is carried by words, mono labels, 6px filled squares (`<Square />`), and heritage motifs.
- **14 Functional Glyphs (UI extension):** `<Glyph name="..." />` provides 14 affordance-only marks drawn with 1.5px square-capped strokes on a 16px grid: `chevron-down`, `chevron-up`, `chevron-left`, `chevron-right`, `check`, `minus`, `plus`, `close`, `arrow-left`, `arrow-right`, `search`, `more`, `calendar`, `download`. Never decorative; icon-only buttons require `aria-label`.

### Five Heritage Motifs

Drawn as **0.6–0.9px hairlines** (0.75px non-scaling stroke in SVG) in `slate`, `rose`, or `sage` on paper, or a lighter tint on dark. **Maximum one motif per page/screen**, placed in open space, never behind running text.

| Motif | Component | Form | Semantic Placement |
|---|---|---|---|
| **Vastu grid** | `VastuMotif` | 9 × 9 pada grid | Contents, people opener, back cover, empty states, onboarding |
| **Kolam** | `KolamMotif` | Continuous line looped around dots | Thin top/foot bands, network/connection, offline state |
| **Jaali** | `JaaliMotif` | Pierced stone screen pattern | Products, ways of seeing, VMS surfaces |
| **Baoli** | `BaoliMotif` (`coloured`) | Stepwell in section | Digital twins, layered reading, drill-down, error states |
| **Stambha** | `StambhaMotif` | Temple pillar (square → octagon → round) | Platform, roadmap, core team |

### Imagery: Evidence vs. Breathing Room

Keep evidence imagery and breathing-room photography strictly separate.

- **Evidence images** (satellite tiles, CCTV frames, dashboards, drone twins, maps): Show as-is in **full colour** with a `caption` starting with `"Seen: ..."`. Plates carry three lines: *Captured, Read, Decided*. Annotate with thin white detection boxes and small paper `label` tags (Detection, Location, Confidence; mark simulated tags `"Tags illustrative"`). Never crop timestamps.
- **Breathing-room photographs** (Indian streets, gateways, forts, temple stone, painted palace walls): Fillers with no caption. Always toned to a 3-stop brand scale (`ink` shadows, section midtone `slate`/`rose`/`sage`, `paper` highlights), never full colour, never blurred. Avoid unconsented faces, readable signage, maps/plans, motion blur, and night skylines.

---

## Diagrams & Data Visualisation

### The Blueprint Diagram Style

- **Ground:** `bg-blueprint-grid` (12px `grid-minor`, 60px `grid-major`, corner `+` marks).
- **Boxes:** Square, 1px light slate border, 20px header strip with uppercase `label` name left and reference code right (`G-01`, `SYS-00`, `R-01`, `P-01`), plain `body-s` lines in `paper` inside.
- **Connectors & Nodes:** 1px orthogonal lines with arrowheads, labelled in `caption` with flows (`MANDATE`, `MODELS`, `PRODUCTS`, `SCALE OUT`), anchored by 6px filled square nodes.
- **Core Element:** The single central node fills `slate-light` with dark ink text.
- **Codes & Status:** Bottom-left diagram code in `caption` (`SYS-ECO · SCHEMATIC · 2026`). Clearly tag targets as `TARGET ARCHITECTURE`, `PROPOSED`, or `TIMINGS INDICATIVE`.
- **Isometric Stacks:** Stacked isometric planes on a dark gradient joined by dashed verticals, carrying continuous river/arterial road geometry across layers.
- **Maps:** India/state maps use white or `paper` outlines with `rose-light` / `rose` deployment rings; city maps use muted ward polygons, `slate` highways, dashed `rose` rail, north arrow, and scale bar.

### Charts (Data Visualisation V2)

All charts are pure SVG wrapped in `ChartFrame` (mono header strip, reference code, optional legend, mandatory source footer).

- **Series order:** `slate`, then `rose`, then `sage`, then `ink`.
- **Geometry:** Flat, square-ended bars; 6–7px square data nodes (never circles); dashed `text-accent` target lines labelled `TARGET`. No 3D, no shadows, no gradients inside bars, no dual y-axes, max 6 donut segments.
- **Components (`src/ds/Charts.tsx`):** `ChartFrame`, `LineChart`, `BarChart`, `DonutChart`, `Funnel`, `Heatmap`, `Gauge`, `Sparkline`, `ScatterPlot`, `TileMap` (equal-area ward tiles, captioned `"tiles not to scale"`), `Timeline` (preferred over bar charts for dated events; max 7 labelled moments), `CompositionBar`, and `BarList`.

---

## Motion

Motion has three jobs: **Orient** (menus, drawers), **Confirm** (toasts, settled counts), and **Reveal** (charts drawing once when entering view).

- **Easing:** `--ease-quiet` (`cubic-bezier(0.2, 0, 0, 1)`) for entrances; `--ease-exit` (`cubic-bezier(0.4, 0, 1, 1)`) for exits. No bounce, spring overshoot, or parallax.
- **Durations:** Interface feedback `160–320ms` (`animate-pop`, `animate-fade-in`, `animate-rise`, `animate-slide-in-right`, `animate-toast-in`); data reveals `700–1100ms` once on entry (`animate-grow-y`, `animate-grow-x`, `animate-draw`, `animate-sweep`); loops strictly limited to live telemetry (`animate-live`, `animate-scan`, `animate-shimmer`).
- **Helpers (`src/ds/motion.tsx`):** `<Reveal />`, `<AnimatedNumber />` (formats in Indian digit grouping `1,24,000`), `useInView()`, `usePrefersReducedMotion()`, `stagger()`.
- **Reduced Motion:** Global `@media (prefers-reduced-motion: reduce)` collapses all durations to `0.01ms`.

---

## Components

### Brand & Editorial Components
- **`StageTag`**: The only pill (`rounded-pill`), 1px border in stage colour, transparent fill, uppercase `label`. Used on product pages and portfolio grids; never on flyers or covers.
- **`StatFigure`**: 1px `rule` above a solid-filled `figure-xl` / `figure-m` number (`text-figure`, `tabular-nums`, no stroke) and a 1–2 line `body-s` `text-muted` label. Used in rows of 3 to 5; sourced figures only.
- **`SectionOpener`**: Dark-gradient opener with 120px outlined two-digit section number, `display-xl` headline closing on `rose-light`, and `lead` context.
- **`PartnerCard`**: Researcher/partner profile on `bg-grad-partner`, 1px `slate` border, `radius-0`, round greyscale photo with 2px `paper` ring (or initials in `slate-deep` on `paper`, never stock faces), 140–175 char bio.
- **`CaseTab`**: Flush-right header tab filled with the solution's case-study accent and `paper` `label` text.
- **`RunningHead`**: `label` section tag left and topic right over a 1px `rule`.

### Multi-Project Theme Components
- **`ProjectThemeProvider`**: Central context provider injecting `--project-*` CSS custom properties onto `:root` and persisting the active project across routes.
- **`ProjectThemeBar`**: Sticky, horizontally scrollable 9-project tab bar with keyboard arrow navigation and live Ground / Primary CTA readouts.

### Navigation & Shell
- **`ProductLockup` & `LogoSlot`**: Logo slot, vertical rule, and Montserrat product name (`AIRAWAT OS`).
- **`TopNav`**: 56px top bar with module links and a 2px `text` bottom indicator. Consistent across all 9 projects.
- **`SideNav`**: 240px `surface-raised` sidebar with mono section labels, 6px module squares, `CountBadge`, and `bg-text` / `text-surface` active state. Consistent across all 9 projects.
- **`Breadcrumbs`**: Mono slash-separated place hierarchy (`City / Zone / Ward / Record`).

### Buttons & Actions
- **`Button`**: Square (`0px`), heights `32 / 40 / 48px`. `primary` (and `brand` CTA) dynamically uses the active project's assigned primary colour (`--project-primary` / `--project-primary-fg`) with automatic contrast; `link` uses `--project-accent`. `secondary` (1px `rule`), `ghost` (borderless), and `critical` (`rose-deep`) stay identical across all 9 projects. Supports `leading`/`trailing` glyphs and `loading` (`StepLoader`).
- **`IconButton`**: Square icon-only button requiring `label` (`aria-label` + `title`). Shared styling across all projects.
- **`ButtonGroup`**: Segmented `role="radiogroup"` sharing 1px `rule` borders; active selection uses shared Design System V2 `ink` (`{colors.action}`) / `paper` (`{colors.on-action}`) across all projects.

### Inputs, Forms & Controls (Consistent Across All Projects)
- **`Input` & `Textarea`**: Wrapped in `Field` with mono label, required `*` or `(optional)`, format hint, and error state with critical square and fix instructions. Supports `leading` glyph, `prefix` (`+91`, `₹`), and `suffix`.
- **`Select`**: Searchable, grouped listbox at elevation level 2 with keyboard navigation.
- **`Checkbox` & `Radio`**: Square 16px controls filling with `brand` (`slate-deep`). Radios use an inset square so circles remain reserved for people.
- **`Toggle`**: Square switch with explicit `"On"` / `"Off"` state word beside the track.
- **`Slider`**: Flat track with `brand` fill, 16px square thumb, step marks, and Space Grotesk value readout.
- **`FileUpload`**: Dashed square dropzone, per-file flat progress bars, and clear size-limit error guidance.
- **`TextEditor`**: Rich remarks editor using letter/word toolbar buttons (`P, H, B, I, U, S, List, 1. 2., Quote`) instead of generic icons.

### Feedback, Overlays, Data & States (Shared Colours Across All Projects)
- **`Badge`, `CountBadge`, `Tag`**: Square badges with 6px status squares; removable filter tags and selectable toggle tags using shared Design System V2 `ink` (`{colors.action}`) / `paper` (`{colors.on-action}`) styling across all projects.
- **`Avatar` & `AvatarGroup`**: The only circles (`xs` 24px to `xl` 80px), greyscale photos with 2px `paper` ring, square presence indicator.
- **`Tabs` & `TabPanel`**: `line`, `boxed`, and `vertical` variants with roving tabindex arrow navigation using shared Design System V2 `ink` (`{colors.action}`) active indicators across all projects.
- **`Alert`, `Banner`, `ToastProvider`, `NotificationItem`**: Blueprint-framed inline alerts (`Notice`, `Resolved`, `Caution`, `Critical` with WCAG AAA `on-critical` foreground on dark), full-width banners, and **middle-top** (`top-center`) ink-gradient toasts with automatic browser `offline` / `online` network detection, persistent mode for connectivity loss or critical errors, and 5s auto-dismiss for add/delete/save actions.
- **`EmptyState`, `WhitespaceMotif`, `Skeleton`, `ErrorState`, `OfflineState`, `Loading`**: Structured no-data and open-whitespace states paired with the five Airawat Brand Guide hairline heritage motifs (`vastu` for general empty states, `jaali` for VMS/sensing, `baoli` / `baoli-colour` for digital twins and errors, `kolam` for network/offline, `stambha` for platform/onboarding). One motif per open whitespace panel, never behind running text.
- **`Modal` & `Drawer`**: Portal overlays at elevation level 3 with `useFocusTrap`, Escape dismiss, header strip with record code, and scroll lock.
- **`Dropdown` & `CommandMenu`**: Level 2 action menu and `Ctrl/Cmd + K` global command palette.
- **`Accordion`**: 1px rule rows with square plus/minus toggle and smooth height reveal.
- **`DataTable`, `Pagination`, `DescriptionList`**: Sortable, selectable tables (44px min rows, sticky bulk bar, row click opens `Drawer`), square mono pagination, and key/value record sheets.
- **`Calendar`, `DatePicker`, `DateRangePicker`**: Monday-start square grids with 6px module event squares and `DD Mon YYYY` formatting.
- **`MetricCard`, `ActivityFeed`, `LiveIndicator`**: Sourced KPI tiles with flat sparklines, decision-trail feeds, and pulsing-square live status.
- **`IndiaStateMap`, `CityMap` & `GisMap` (`src/ds/Map.tsx`, `src/ds/GisMap.tsx`)**: Schematic and GIS map components following Brand Guide V2 (Pages 11 and 14). `IndiaStateMap` supports `dark` (blueprint grid with `paper` outlines, lighter state borders, and `rose-light` ring-and-dot deployment sites) and `paper` (`ink` outlines and `rose` deployment rings). `CityMap` renders muted ward polygons (`surface-raised`, selected `slate-wash`), `slate` highways, dashed `rose` rail lines, a North arrow, and a scale bar. `GisMap` renders an interactive Kanpur municipal GIS layer (Ganga river, NH-19 GT Road, VIP Road, Kanpur Central rail, 6 dashed municipal ward boundaries, dense urban footprint blocks, and clickable property parcels mapped strictly to the five brand colours: `rose-deep`/`rose-wash` for Suspected Gap, `rose`/`rose-tint` for Occupied KESCO, `sage-dark`/`sage-wash` for In Tax Net, `slate-deep`/`slate-wash` for New / Modified, `surface-sunken` for Exempt) with floating top-left search and category filter chips, drag-to-pan, right-side vertical zoom/recenter/layer controls (`Paper` / `Blueprint`), live AI detection overlays (thin white/ink boxes + `paper` `label` tags with confidence), and a `Captured / Read / Decided` evidence trail. All maps wrap inside `ChartFrame` with a reference code and source line.
- **`ProgressBar`, `SegmentedProgress`, `Stepper`, `ProgressRing`**: Flat square-ended progress bars and numbered workflow steppers.
- **`EmptyState`, `Skeleton`, `ErrorState`, `OfflineState`, `Loading`**: Structured states paired with their semantic heritage motifs (Vastu, Baoli, Kolam).

---

## Documents & Formats

- **Institutional Profile (Booklet):** A4 printed as spreads, page count a multiple of 4. Fixed order: cover (`ink → slate` + Kanpur map), vision spread, about, contents, ecosystem, history, how we work, case studies, platform, products, people, from data to decisions, scale and vision, closing spread, back cover (`mark-colour` / `mark-white`).
- **Case Studies (2-page spread):** Left page: measured-outcome headline, lead, evidence image/collage, 3–4 outlined `StatFigure`s. Right page: *The situation*, *What we did* (4 lines), map/second image, *With* (partner), `PartnerCard`s, *What comes next*, *Sources*. Carries `CaseTab` top-right and 30px outer vertical edge band.
- **Product Pages & One-Pagers:** Stage tag, name, `display-m` promise, key outlined figure, screenshot, *"In the field"*, 3 numbered *"How it works"* steps, remaining features, research partners.
- **Flyers:** A4 portrait, light ground, case-code gradient hero, white state map, lifted screenshot, 6 feature cards, CTA strip with QR code. **No stage tags on flyers.**
- **Visiting Cards (Monochrome Exception):** 89 × 51mm + 3mm bleed (`95.25 × 57.15mm`), 3mm safe area. Pure white front under 14mm ink-gradient bar (`#111111 → #2A2A2A`) with Gangetic plain map hairline, hexagon cluster, and 7.4mm white logo; 15pt Space Grotesk name, 7pt mono role, 0.6pt ink rule, 7pt Inter contacts (`E, T, W`), no flag on front. Ink-gradient back with Kanpur rings, centred 48mm white logo, 9.4pt tagline, and `6 × 4mm` Indian flag top-right. Flatten map/logos to opaque 600dpi; keep text live with static TrueType fonts (never variable fonts).
- **Letterhead:** A4 monochrome white header, faint grey map, 13mm black logo, tagline right, heavy rule and mono line; footer with organisation, Section 8 status, address, email, CIN.
- **Presentations (16:9):** Cover, section dividers, statement, and closing slides on dark gradients with the Indian flag top-right; content slides on `paper` with left-aligned `display` titles.

---

## Do's and Don'ts

### Do
- Anchor ~70% of every surface on `paper` (`#F5F3EC`) and reserve dark grounds for approved ink-based linear gradients with `theme-ink`.
- Close every headline with a full stop and highlight the last 2 to 4 words in `text-accent`.
- Show a word alongside every status, stage, toggle, and presence indicator.
- Cite a source on every metric and chart, and separate installed, measured, associated, and planned figures.
- Route primary CTA buttons and project ground previews through the central `ProjectThemeProvider` CSS variables (`--project-*`) with automatic contrast selection.
- Use `slate-deep`, `rose-deep`, or `sage-dark` for small text on paper.
- Open record details from tables in a `Drawer` so officers keep their place in the queue.

### Don't
- Do not invent new colours, arbitrary hex values, or unapproved gradient stops.
- Do not use drop shadows, glows, blur, or coloured left-border accents on cards.
- Do not use flat charcoal pages or lay a flat gradient directly over a photograph.
- Do not use rounded corners on buttons, inputs, cards, checkboxes, radios, or switches.
- Do not use em dashes, exclamation marks, emojis, generic icon libraries, or salesy language.
- Do not set sentences in JetBrains Mono or headlines in Montserrat.
- Do not use transparency or blend modes in print PDF exports.
- Do not recolour shared Design System V2 components (inputs, selects, checkboxes, radios, toggles, sliders, tabs, tags, tables, pagination, cards, modals, drawers, accordions, calendars, or navigation chrome) when switching project themes. Only the assigned project primary colour (primary CTAs, case tab, active project tab) and project ground banner change per project.

---

## Responsive Behavior

| Breakpoint | Width | Key Changes |
|---|---|---|
| **Mobile** | `< 768px` | Top bar corporation switcher moves into Command Menu; product sidebars collapse into `Tabs`; `ProjectThemeBar` scrolls horizontally; grids collapse to 1 column; sticky scroll offsets account for top header. |
| **Tablet** | `768–1024px` | Showcase sidebar toggles via `Contents` drawer button; KPI rows run 2-up; chart grids stack cleanly. |
| **Desktop** | `1024–1440px` | Persistent 240–264px raised sidebar; 12-column grid with 24px gutters; 4-up KPI cards and 2:1 chart splits. |
| **Wide** | `> 1440px` | Content caps at 1200px; prose remains capped at 65ch for legibility. |

**Touch & Keyboard Standards:**
- Default controls are 40px tall (`lg` 48px for field devices); table rows are at least 44px tall.
- Full keyboard support across `ProjectThemeBar`, `Tabs`, `Dropdown`, `Select`, `Calendar`, `CommandMenu`, `Modal`, and `Drawer` (arrow keys, Home/End, Enter, Escape, focus trap and return).

---

## Iteration Guide

1. **Reuse before building.** Compose from existing `@/ds` primitives before adding a new component.
2. **Tokens only.** Add new design tokens inside `@theme` in `src/index.css` and mirror dark-ground values inside `@utility theme-ink`. Never hardcode hex values in feature code.
3. **Register gradients first.** Any new gradient must be approved and added to the Gradients table and `src/index.css` before use.
4. **Respect the project theme boundary.** New primary CTA or project-banner components should consume `var(--project-primary)` / `var(--project-primary-fg)` / `var(--project-ground)`; shared form controls and data chrome must consume static semantic tokens (`surface`, `border`, `rule`, `brand`).
5. **Strict geometry and glyphs.** Keep corners at `0px`, add new affordance glyphs only as 1.5px square-capped strokes on the 16px grid in `src/ds/Glyph.tsx`, and document every **UI extension** explicitly.
6. **Verify contrast mathematically.** Run `getContrastRatio()` / `getAccessibleForeground()` on any new foreground/background pairing to uphold WCAG 2.2 AA (4.5:1 minimum).

---

## Pre-Release Checklist

- [ ] Every figure has a source and an explicit status (installed, measured, associated, estimate, plan).
- [ ] Every acronym is spelled out on first use with the short form in brackets.
- [ ] Headlines use sentence case, end with a full stop, and close on one accent (last 2–4 words).
- [ ] Zero em dashes, zero exclamation marks, zero emojis, zero sales hyperbole.
- [ ] Body text is at least 13px in interfaces (14px in print); labels and captions are at least 11px.
- [ ] All text and CTA foregrounds meet at least 4.5:1 contrast on their ground.
- [ ] No drop shadows, no flat charcoal pages, no unapproved gradient stops.
- [ ] All corners are square (`0px`) except `StageTag` (`pill`) and people/avatars (`round`).
- [ ] Every status, stage, toggle, and presence indicator displays a word, never colour alone.
- [ ] Logos use supplied artwork only; the Indian flag appears on right-hand pages only (one per spread).
- [ ] Every interactive element is keyboard-accessible with a visible 2px focus ring.
- [ ] Every chart sits inside `ChartFrame` with a reference code and a source line.
- [ ] Motion plays once on reveal and honours `prefers-reduced-motion`.
- [ ] All 9 project themes switch cleanly without altering shared inputs, tables, forms, or navigation.
- [ ] Print exports contain zero transparency or blend modes and use static TrueType fonts.

---

## Known Gaps

- **Supplied logo artwork:** Production SVG/PNG assets (`logo-black`, `logo-white`, `mark-colour`, `mark-white`) are not yet bundled in `public/`; `<LogoSlot />` serves as the placeholder in interface shells.
- **Mark colour alignment:** The Version 2 Brand Guide text describes the `"AI"` letters in `mark-colour` as `slate`, while the rendered mark artwork displays teal (and 2026 flyers are noted as pending migration off an earlier teal hero). Confirm final vector assets with the brand owner.
- **Editorial print components in UI kit:** `SectionOpener`, `PartnerCard`, and `CaseTab` are fully specified in the Brand Guide and above, and are available as patterns; only `StageTag`, `StatFigure`, `RunningHead`, and the 5 heritage motifs are currently exported as standalone React components in `src/ds/`.
- **Simulated telemetry & uploads:** `FileUpload` progress and VMS live camera wall frames in the sample dashboard (`/#/dashboard`) are simulated for demonstration and marked `"Frames simulated. Tags illustrative."`
- **Sage Deep button contrast edge case:** For *Bridges & Infrastructure*, the Brand Guide accent `sage-deep` (`#6F7E70`) has a 4.41:1 contrast against `ink` (`#111111`) vs 3.86:1 against `paper` (`#F5F3EC`). `getAccessibleForeground` automatically selects `ink` (`#111111`) in resting state and transitions to `sage-dark` (`#4F5D50`) with `paper` (`#F5F3EC`, 6.34:1) on hover.

---

*Better data. Better decisions. Better cities.*
