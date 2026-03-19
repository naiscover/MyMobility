# MyMobility — Wheelchair Accessibility Guide

> A fully accessible, WCAG 2.1 Level AAA compliant website about wheelchairs, mobility, and inclusive design.

---

## 📋 About the Project

MyMobility is a static website built as a creative project exploring what it means to design for everyone. The site covers wheelchair types, key features to look for, and the web accessibility standards that make digital content usable by all people — regardless of ability.

---

## ✨ Features

### Accessibility Toolbar
Every visitor can customise their experience using the persistent toolbar at the top of every page:

| Control | Description |
|---|---|
| **A− / A / A+** | Scales text from 75% to 150% |
| **◑ High Contrast** | Switches to a black/yellow palette (21:1 contrast ratio) |
| **Aa Dyslexia Font** | Switches to a dyslexia-friendly font with increased letter and word spacing |
| **⏸ Reduce Motion** | Disables all animations and transitions (also auto-activates from OS settings) |
| **👁 Colour Blind** | Simulates deuteranopia, protanopia, or tritanopia using SVG colour matrix filters |
| **FR / EN** | Translates the entire page between English and French |

All preferences are saved to `localStorage` and restored on return visits.

### WCAG 2.1 AAA Compliance
| Principle | Implementation |
|---|---|
| **Perceivable** | Colour contrast ≥ 7:1, descriptive alt text on every image, no colour-only information |
| **Operable** | Full keyboard navigation, visible focus indicators, skip links, no flashing content |
| **Understandable** | `lang` attribute set, plain language, consistent navigation |
| **Robust** | Semantic HTML5, ARIA roles/labels/states, valid markup |

### Content
- Six wheelchair type profiles (manual, power, sports, tilt-in-space, transport, standing)
- Key selection criteria explained (seat sizing, frame materials, wheel configuration, etc.)
- Keyboard shortcut reference table
- Links to WHO, W3C WCAG, United Spinal Association, and WebAIM

---

## 🗂 File Structure

```
/
├── index.html      # Main HTML — semantic structure, ARIA, bilingual data
├── styles.css      # All styling — CSS variables, responsive layout, accessibility modes
├── script.js       # Toolbar logic, translation dictionary, colour blind filters
└── README.md       # This file
```

---

## ♿ Accessibility Standards Met

This project targets **WCAG 2.1 Level AAA** — the highest tier of web accessibility compliance.

Key criteria specifically addressed:

- `1.4.6` — Contrast (Enhanced): text contrast ≥ 7:1
- `1.4.3` — Contrast (Minimum): large text contrast ≥ 4.5:1  
- `1.1.1` — Non-text Content: all images have descriptive alt text
- `2.1.1` — Keyboard: all functionality operable via keyboard
- `2.4.1` — Bypass Blocks: skip navigation links provided
- `2.4.7` — Focus Visible: high-contrast focus ring on all elements
- `2.4.8` — Location: active nav link updates as you scroll
- `3.1.1` — Language of Page: `lang="en"` / `lang="fr"` set correctly
- `3.3.1` — Error Identification: errors described in text (not just colour)
- `4.1.2` — Name, Role, Value: all interactive elements have ARIA labels
- `4.1.3` — Status Messages: live region announces toolbar changes

---

## 🎨 Design Decisions

- **Colour palette**: Deep forest green (`#1A4D2E`) with warm off-white (`#F9F7F3`) — chosen for high contrast and a calm, trustworthy tone
- **Typography**: DM Serif Display (headings) + DM Sans (body) — distinctive but highly legible pairing
- **Images**: All photography sourced from [Unsplash](https://unsplash.com) under the free Unsplash Licence
- **No JavaScript frameworks**: keeps the site fast, lightweight, and dependency-free
- **CSS custom properties**: all tokens (colours, spacing, type scale) defined as variables so high contrast and colour blind modes can override them cleanly

---

## 🌍 Translation

The site includes a built-in English ↔ French translation system powered entirely by a JavaScript dictionary — no external API or internet connection required. Over 100 strings are translated including all body text, headings, ARIA labels, keyboard shortcuts, and footer content.

The `lang` attribute on the `<html>` element updates on toggle so screen readers automatically switch pronunciation.

---

## 📸 Photo Credits

All images are free to use under the [Unsplash Licence](https://unsplash.com/license).

| Section | Photographer |
|---|---|
| Hero | Romain Virtuel / Unsplash |
| About | Annie Spratt / Unsplash |
| Manual wheelchair | CDC / Unsplash |
| Power wheelchair | Ben Wicks / Unsplash |
| Sports wheelchair | Zachary Kyra-Derksen / Unsplash |
| Tilt-in-space | National Cancer Institute / Unsplash |
| Transport chair | Hans Moerman / Unsplash |
| Standing wheelchair | ThisisEngineering / Unsplash |
| Features banner | Gabe Pierce / Unsplash |
| Resources | Marianne Bos, various / Unsplash |

---

## 🔧 Accessibility Testing Tools

The following tools were used during development:

- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/) — colour contrast verification
- [W3C Markup Validator](https://validator.w3.org/) — HTML validation
- [WAVE Web Accessibility Evaluator](https://wave.webaim.org/) — automated accessibility audit
- Browser keyboard navigation — manual tab/focus testing
- macOS VoiceOver — screen reader testing

---

## 📚 References

- [WCAG 2.1 Guidelines — W3C](https://www.w3.org/TR/WCAG21/)
- [WHO Wheelchair Guidelines](https://www.who.int/teams/assistive-and-medical-technology/assistive-technology/wheelchairs)
- [United Spinal Association](https://unitedspinal.org)
- [WebAIM — Web Accessibility In Mind](https://webaim.org)

---

*Built as a computer science creative project exploring inclusive web design.*
