# Daughter Care System — instructions for agents

Personal app to help take care of my daughter.  
Focus on simplicity, clarity, beauty, and daily use on the phone.

## Start every session here
1. Read this `AGENTS.md` completely.
2. Confirm active skills and MCPs (`grok inspect` and `grok mcp list`).
3. For non-trivial features, always start in Plan Mode (`/plan`) and wait for approval before editing files.

## Required stack
- Next.js (App Router) + TypeScript + Tailwind CSS
- Database: Neon (Postgres serverless) with `@neondatabase/serverless`
- Target deploy: Vercel
- Weather forecast: Open-Meteo (no API key)

## Default location
- City: Pindamonhangaba, SP, Brazil
- Coordinates: latitude -22.9239, longitude -45.4617
- Allow changing the city later

## Design (non-negotiable — Brand Identity)
Follow the visual identity defined at https://brand-identity.abraaomoreira.dev/

- **Minimalism**: prioritize black and white. Use color only when necessary to highlight.
- **Primary palette** (fixed):
  - Pure Black `#000000`
  - Pure White `#ffffff`
  - Soft Black `#0a0a0a`
  - Soft White `#fafafa`
- **Accent color** (agent’s choice):
  - When creating the interface, choose **one** primary accent color (and light/dark variations if needed).
  - Follow the logic of the identity examples (purple and yellow): vibrant color, high contrast, moderate use.
  - Reference examples (not mandatory): `#8b5cf6`, `#fbbf24`.
  - **Justify the choice**: briefly explain why the color makes sense for the app. The justification must appear in the plan or in the first UI commit.
  - Once chosen and justified, keep consistency across buttons, links, highlights, and interactive states.
- **Neutrals**:
  - Text Gray `#6b7280`
  - Light Gray `#9ca3af`
  - Border Gray `#e5e7eb`
- **Typography**:
  - Anton for titles and highlights
  - Inter for body text
- **Themes**: support light and dark mode with good readability in both.
- **Mobile-first**: design and implement for mobile first. The main experience must be excellent on mobile.
- **Responsiveness**: work very well on larger screens (tablet and desktop), using the space intelligently without losing clarity.
- Use Tailwind. Examples: `bg-white dark:bg-black`, `text-black dark:text-white`, `border-gray-200 dark:border-gray-800`, `transition-colors duration-300`.
- Prioritize polish: generous spacing, precise alignment, clear typographic hierarchy, and subtle microinteractions.
- Components must be intentional and consistent with the identity.
- Test on mobile and on at least one desktop breakpoint.

## Never break the core experience
The person will use this daily. A broken screen or wrong recommendation creates distrust.
- Prefer Server Components when possible.
- Handle weather and database errors clearly (never leave a blank screen or raw error).
- Test the clothing recommendation logic (TDD when it makes sense).
- Never invent connection strings — obtain them via Neon MCP or ask the user.
- Never commit `.env*` or secrets.

## Architecture
Keep separation of responsibilities. Business logic must not be mixed with the UI.