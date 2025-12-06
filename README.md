# Voither HealthOS — Cast Marketing & Visual Showcase
A production-grade, visually extraordinary marketing and product vision site for Voither HealthOS. This single-page application presents the platform to investors, partners, and clinicians, emphasizing its architecture, data sovereignty, AI-native automation, and technical moat through an immersive, macOS-inspired interface and multi-POV (Point of View) demonstrations.
Voither HealthOS is a cognitive operating system for healthcare that automates documentation and bureaucracy while keeping patients sovereign over their data. Built as a Cloudflare Workers project, it leverages edge computing for seamless performance and integrates AI capabilities via Cloudflare Agents SDK.
## Interface Overview
The application features a unique, macOS-like user interface designed for intuitive interaction:
- **Top Menu Bar**: Provides global actions and context-aware menus (e.g., `Arquivo > Novo Actor...`). It also houses the crucial **Role Selector** for switching between Patient, Professional, and Service POVs.
- **Dock**: A quick-launch bar at the bottom of the screen for instant access to core Stages (MedScribe, Regulação) and Actor management dashboards. Icons feature hover magnification and badges for active states.
- **Windowed Content**: All dashboards and stages open in a central, "windowed" container with a title bar, providing a focused, multi-tasking-friendly environment.
- **Multi-POV Architecture**: The entire UI adapts based on the selected role, showing only relevant tools and data, thus enforcing the platform's core rules of access and sovereignty.
## Core Rules in Action
- **Sovereignty**: All data access requests from a Professional or Service POV must be approved by the Patient via an on-screen modal, simulating the PatientActor's role as a data gatekeeper.
- **Automation Levels**: Stages visually tag actions with their automation level (e.g., `Validação Requerida` in MedScribe), making the system's behavior transparent.
- **Cast Orchestrator**: A dedicated dashboard allows users to simulate the execution of declarative YAML scripts, demonstrating how the "operating system" coordinates Actors and Tools to perform complex workflows.
## Tech Stack
- **Frontend**: React 18, Vite, Tailwind CSS, shadcn/ui, Framer Motion, React Router.
- **State Management**: Zustand for global state (especially for role management).
- **Backend/Edge**: Cloudflare Workers, Durable Objects (via Agents SDK), Hono.
- **AI Integration**: Cloudflare AI Gateway with models like Google Gemini.
## Local Development
### Prerequisites
- Bun (package manager): https://bun.sh/
- Cloudflare CLI (Wrangler): `bun install -g wrangler`
### Installation
1. Clone the repository and install dependencies:
   ```bash
   git clone <repository-url>
   cd voither-healthos-cast
   bun install
   ```
2. Set up environment variables for Cloudflare AI Gateway:
   ```bash
   wrangler secret put CF_AI_BASE_URL
   wrangler secret put CF_AI_API_KEY
   ```
### Running the Development Server
```bash
bun run dev
```
The app will be available at `http://localhost:3000`.
## Usage
Upon loading, the homepage prompts you to select a Point of View (Patient, Professional, or Service). This choice is persisted in local storage and determines what you see and can do within the dashboard.
- **Patient POV**: Focuses on the "Patient Vault," where you can manage your profile and approve/revoke data access requests.
- **Professional POV**: Provides access to clinical tools like MedScribe for recording consultations and Telemedicina.
- **Service POV**: Offers an administrative view for managing professional profiles (EntityActors) and service units (ServiceActors).
## Deployment
Deploy to Cloudflare Workers for global edge delivery:
```bash
bun run deploy
```
## License
Proprietary - Voither. All rights reserved.