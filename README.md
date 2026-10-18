# Surya Teja — UX/UI & Product Designer Portfolio

A modern, high-performance portfolio crafted in **React + Vite + Tailwind CSS**, preserving the exact editorial typography, layouts, CSS-drawn project covers, case study workflows, and built-in Admin CMS Studio from index (1).html.

---

## ⚡ Quick Start

Dependencies are already configured and linked. You can start the local development server right away:

`ash
# 1. Navigate to the project folder
cd  C:\Users\RS-\Downloads\Surya-Design-Portfolio

# 2. Start the Vite dev server
npm run dev
`

Open your browser at: **http://localhost:3000/** (or the port displayed in your terminal).

To build the production bundle:
`ash
npm run build
`

---

## 🎨 Design System & Visuals

- **Typography**:
  - Headings / Display: Anton
  - Brand Accents / Italics: Instrument Serif
  - Body: Geist
  - Code / Metadata / Tags: Geist Mono
- **Color Engine**:
  - Light mode: --paper: #F3F4F7, --sheet: #FFFFFF, --ink: #121318, --signal: #3B36E8, --pill: #121318
  - Dark mode: --paper: #0E0F13, --sheet: #17181E, --ink: #EEEFF3, --signal: #8C88FF
  - To-Do highlight pill: --todo: #FFF1B8, --todo-ink: #6B5300 (auto-highlights bracketed [...] text)
- **Zero External Graphic Dependencies**:
  - portfolio: CSS typography overlay on dark canvas with top pill.
  - movies: Midnight canvas with rotated multi-gradient filmstrip and <HTML5/> badge.
  - store: Gentleman Boutique serif F monogram on luxury canvas.
  - admin: Miniature interactive dashboard mockup with sidebar and grid cards.

---

## 🔐 Admin Studio CMS (Private Area)

The portfolio includes a private Studio CMS to publish and manage content without editing code:

- **How to Access**: Navigate directly to `/#admin` in your browser URL bar. (All public links and entry points are hidden from regular visitors).
- **Security & Authentication**:
  - Protected by cloud authentication service (Supabase Auth).
  - No passwords or private keys are stored in the repository.
  - Only the registered owner email can sign in.
  - Password recovery works exclusively via secure, single-use reset links delivered directly to your verified email inbox.
- **Environment Setup**:
  - Copy `.env.example` to `.env`:
    ```bash
    cp .env.example .env
    ```
  - Add your Supabase project URL and public Anon Key to `.env`.
- **Capabilities**:
  - **Projects**: Add new projects, edit live case studies, reorder (↑ / ↓), or delete entries.
  - **Hero & Identity**: Update greeting, roles, pitch statement, snap details, availability status, and social links.
  - **Process & About**: Modify the 5-step process, 5 design principles, experience timeline, and tools tags.
  - **Inquiries**: Review, read, and manage direct messages sent by visitors.
  - **Backup & Restore**: Export full JSON backups or restore data anytime.

---

## 📁 Project Architecture

`
Surya-Design-Portfolio/
├── index.html                  # HTML entry point with Google Fonts
├── package.json                # Dependencies & scripts
├── vite.config.js              # Vite configuration
├── tailwind.config.js          # Tailwind CSS design system tokens
├── postcss.config.js           # PostCSS configuration
├── dist/                       # Production-ready build artifacts
├── src/
│   ├── main.jsx                # React root with PortfolioProvider
│   ├── App.jsx                 # Dynamic route switcher & global modals
│   ├── index.css               # Exact CSS design system & Tailwind layers
│   ├── context/
│   │   └── PortfolioContext.jsx # LocalStorage persistence, auth & routing
│   ├── data/
│   │   └── initialData.js      # Verbatim project data from original index.html
│   └── components/
│       ├── common/             # Cover, Tags, TodoText, StepsGrid
│       ├── layout/             # Navbar (pill nav), Footer
│       ├── home/               # Hero, Selected Work, How I Work, Contact
│       ├── work/               # All Work grid & category filters
│       ├── thinking/           # Design Thinking & Principles
│       ├── about/              # About header, 4:5 portrait, Accordions
│       ├── casestudy/          # Case study reader with sticky TOC & facts
│       └── admin/              # Studio CMS, tabs & password authentication
`
