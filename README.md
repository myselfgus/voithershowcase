# Voither HealthOS — Cast Marketing & Visual Showcase

A production-grade, visually extraordinary marketing and product vision site for HealthOS (Cast). This single-page application presents the HealthOS platform to investors, partners, and clinicians, emphasizing its architecture, data sovereignty, AI-native automation, and technical moat through immersive, interactive visuals like liquid glass transitions, particle flows, and responsive animations.

HealthOS is a cognitive operating system for healthcare that automates documentation and bureaucracy while keeping patients sovereign over their data. Built as a Cloudflare Workers project, it leverages edge computing for seamless performance and integrates AI capabilities via Cloudflare Agents SDK.

[cloudflarebutton]

## Features

- **Hero Section**: Interactive liquid glass headline transformation with a breathing iridescent sphere, capturing the vision of transforming bureaucratic chaos into invisible technology.
- **MedScribe Section**: Canvas-based particle flow visualization showing unstructured speech morphing into structured clinical documents.
- **ASL Deep Tech Section**: Interactive SVG waveform with prismatic hover points revealing clinical insights via frosted glass tooltips.
- **Architecture Section**: Infinite grid of patient data capsules demonstrating sovereignty and secure access control.
- **Ecosystem Section**: Modular bento grid showcasing HealthOS Stages (MedScribe, Regulação, Agenda, Telemedicina) with dynamic connections and hover expansions.
- **Responsive Design**: Mobile-first layout with flawless performance across devices, respecting reduced motion preferences.
- **Visual Excellence**: Ethereal, serene UI with porcelain and ice-grey palette, Inter typography, and smooth micro-interactions using Framer Motion.
- **AI Integration**: Leverages Cloudflare AI Gateway for potential live demos (Phase 1 uses mock data; future phases connect to Durable Objects and Stages).
- **Accessibility**: WCAG-compliant contrast ratios, semantic HTML, and keyboard navigation.

The site is fully static and deployable, serving as a stunning foundation for HealthOS product demos.

## Tech Stack

- **Frontend**: React 18, Vite (build tool), Tailwind CSS (styling), shadcn/ui (components), Framer Motion (animations), React Router (routing).
- **Visuals & Interactions**: Three.js (@react-three/fiber, @react-three/drei) for 3D elements, D3.js for waveforms, React Intersection Observer for scroll triggers.
- **State Management**: Zustand for lightweight UI state.
- **Icons & Utilities**: Lucide React, @phosphor-icons/react, React Use (hooks), Sonner (toasts).
- **Backend/Edge**: Cloudflare Workers, Durable Objects (via Agents SDK), Hono (routing), OpenAI SDK (AI integration), Model Context Protocol (MCP) for tools.
- **Type Safety**: TypeScript, Zod (validation).
- **Other**: Date-fns (dates), Recharts (charts, if extended), Immer (immutable updates).

## Quick Start

To deploy instantly to Cloudflare Workers:

[cloudflarebutton]

## Local Development

### Prerequisites

- Bun (package manager) installed: https://bun.sh/
- Cloudflare CLI (Wrangler): `bun install -g wrangler`
- Node.js 18+ (for Vite dev server)

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd healthos-cast
   ```

2. Install dependencies with Bun:
   ```
   bun install
   ```

3. Set up environment variables (Cloudflare AI Gateway credentials):
   ```
   wrangler secret put CF_AI_BASE_URL
   wrangler secret put CF_AI_API_KEY
   ```
   - `CF_AI_BASE_URL`: Your Cloudflare AI Gateway URL (e.g., `https://gateway.ai.cloudflare.com/v1/{account_id}/{gateway_id}/openai`).
   - `CF_AI_API_KEY`: Your Cloudflare API token with AI Gateway access.

4. (Optional) Generate TypeScript types for Workers bindings:
   ```
   bun run cf-typegen
   ```

### Running the Development Server

Start the local development server:
```
bun run dev
```

The app will be available at `http://localhost:3000` (or the port specified in your environment). Hot module replacement is enabled for fast iteration.

### Building for Production

Build the optimized assets:
```
bun run build
```

Preview the production build:
```
bun run preview
```

## Usage

The site is a single-page application (SPA) with scroll-based sections. No user authentication is required in Phase 1.

- **Navigation**: Smooth scrolling between sections (Hero → MedScribe → ASL → Architecture → Ecosystem → Footer).
- **Interactions**:
  - Hero: Scroll to trigger liquid glass text morph.
  - MedScribe: Viewport entry animates particle chaos to order.
  - ASL: Hover waveform prisms for clinical tooltip insights.
  - Architecture: Mouse proximity illuminates individual capsules.
  - Ecosystem: Hover modules for expansion; threads connect related Stages.
- **AI Demo (Future Phases)**: The template includes chat APIs (`/api/sessions`, `/api/chat/:sessionId`) powered by Gemini models via Cloudflare AI. Extend for live MedScribe transcriptions.
- **Customization**: Modify `src/pages/HomePage.tsx` for the main layout. Visual components (e.g., BreathingSphere) are in `src/components/visuals/` (add as needed).

**Note**: AI features have request limits across Cloudflare Gateway users. Monitor usage via Wrangler logs.

## Deployment

Deploy to Cloudflare Workers for global edge delivery:

1. Ensure Wrangler is authenticated:
   ```
   wrangler login
   ```

2. (Optional) Configure custom domain or variables in `wrangler.jsonc`.

3. Deploy:
   ```
   bun run deploy
   ```

The site will be live at `https://healthos-cast.<your-subdomain>.workers.dev`. Assets are served as a SPA with fallback routing.

For one-click deployment:

[cloudflarebutton]

**Production Tips**:
- Enable custom domains via Wrangler.
- Monitor with Cloudflare Observability (enabled in config).
- Scale with Durable Objects for future Actor integrations (PatientActor, etc.).

## Contributing

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/amazing-feature`.
3. Commit changes: `git commit -m 'Add some amazing feature'`.
4. Push to the branch: `git push origin feature/amazing-feature`.
5. Open a Pull Request.

Follow the code style (ESLint, Prettier via `bun run lint`). Focus on visual polish and performance.

## License

Proprietary - Voither. All rights reserved. For licensing inquiries, contact Voither HealthOS team.