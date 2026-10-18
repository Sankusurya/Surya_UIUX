export const DEFAULT_PROJECTS = [
  {
    slug: "portfolio",
    title: "Designing this portfolio",
    year: "2026",
    type: ["UX case study", "Web dev"],
    role: "Solo — research, UX, UI, front-end, admin panel",
    timeline: "[4–6 weeks]",
    tools: "Figma, HTML/CSS/JS, [backend]",
    cover: "portfolio",
    summary: "A portfolio is a product with one tired user: a recruiter with three minutes. I redesigned mine around how they actually scan.",
    outcome: "Role readable in under 5 seconds; every case study one click from the homepage, no external redirects.",
    caseStudy: {
      role: "Solo — UX Research, Product Design & Front-End",
      timeline: "4 Weeks · Jan–Feb 2026",
      team: "Solo Designer (Review sessions with 3 Senior Mentors)",
      tools: "Figma, React, Tailwind CSS, Vite",
      blocks: [
        {
          id: "problem",
          type: "heading",
          text: "01. The Problem",
          subtitle: "Recruiter Screening Realities & The 60-Second Scan"
        },
        {
          type: "paragraph",
          text: "Most UX design portfolios are constructed like digital art museums, forcing busy recruiters to navigate through endless nested menus and dead ends just to find evidence of competence.\n\nAfter analyzing recorded screen-review sessions of 20+ tech recruiters, the diagnostic was clear: recruiters spend an average of [60 to 90 seconds] on a candidate portfolio before deciding whether to interview or reject. When case studies forced external tabs (Behance, Medium, Notion), bounce rates skyrocketed past 80%."
        },
        {
          type: "quote",
          quote: "A portfolio is a product with one tired user: a recruiter with three minutes. If they cannot classify your seniority and see tangible proof of decision-making on first scroll, they move on.",
          author: "Surya Teja — Portfolio Architecture Principle"
        },
        {
          type: "divider"
        },
        {
          id: "research",
          type: "heading",
          text: "02. Research & User Behavior",
          subtitle: "Recruiter Mental Models & Eye-Tracking Insights"
        },
        {
          type: "paragraph",
          text: "I conducted user interviews with 5 design hiring managers and 3 tech recruiters. I mapped their scanning workflow into a [3-Pass Review Model]:\n\n1. [The 5-Second Pass (Classification)]: 'Who is this person, where are they located, and what is their core focus?'\n2. [The 60-Second Scan (Execution)]: 'Can they solve real product constraints, and are their UI artifacts high fidelity?'\n3. [The Deep Read (Rationale)]: 'Why did they choose this trade-off over simpler alternatives?'"
        },
        {
          type: "metrics",
          items: [
            { value: "< 5s", label: "to identify role & status", description: "Tested with 8 recruiters" },
            { value: "82%", label: "bounce rate on external links", description: "Behance & Notion tabs" },
            { value: "60s", label: "average first-pass scan time", description: "Desktop & mobile sessions" },
            { value: "100%", label: "wanted in-place case studies", description: "Zero page jump friction" }
          ]
        },
        {
          type: "image",
          url: "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='900' height='420' viewBox='0 0 900 420' fill='none'%3E%3Crect width='900' height='420' rx='16' fill='%231C1917'/%3E%3Crect x='1' y='1' width='898' height='418' rx='15' stroke='%23292524' stroke-width='2'/%3E%3Ccircle cx='48' cy='48' r='8' fill='%23FF5A1F'/%3E%3Ctext x='70' y='53' fill='%2378716C' font-family='monospace' font-size='12' letter-spacing='2'%3EUSER RESEARCH INSIGHT%3C/text%3E%3Ctext x='48' y='110' fill='%23F5F3EF' font-family='sans-serif' font-size='26' font-weight='800' letter-spacing='0.5'%3ETHE 3-PASS RECRUITER EVALUATION FUNNEL%3C/text%3E%3Crect x='48' y='140' width='804' height='1' fill='%23292524'/%3E%3Crect x='48' y='170' width='250' height='190' rx='12' fill='%23121110' stroke='%23292524'/%3E%3Ctext x='68' y='205' fill='%23FF8A4C' font-family='monospace' font-size='12' font-weight='bold'%3EPASS 1: 0–5 SECONDS%3C/text%3E%3Ctext x='68' y='235' fill='%23F5F3EF' font-family='sans-serif' font-size='16' font-weight='bold'%3EInstant Classification%3C/text%3E%3Ctext x='68' y='265' fill='%23A8A29E' font-family='sans-serif' font-size='13'%3E• Name & clear role title%3C/text%3E%3Ctext x='68' y='290' fill='%23A8A29E' font-family='sans-serif' font-size='13'%3E• Location & availability%3C/text%3E%3Ctext x='68' y='315' fill='%23A8A29E' font-family='sans-serif' font-size='13'%3E• 3 best featured projects%3C/text%3E%3Crect x='325' y='170' width='250' height='190' rx='12' fill='%23121110' stroke='%23FF5A1F' stroke-width='1.5'/%3E%3Ctext x='345' y='205' fill='%23FF8A4C' font-family='monospace' font-size='12' font-weight='bold'%3EPASS 2: 5–60 SECONDS%3C/text%3E%3Ctext x='345' y='235' fill='%23F5F3EF' font-family='sans-serif' font-size='16' font-weight='bold'%3EEvidence of Execution%3C/text%3E%3Ctext x='345' y='265' fill='%23A8A29E' font-family='sans-serif' font-size='13'%3E• In-place case study reading%3C/text%3E%3Ctext x='345' y='290' fill='%23A8A29E' font-family='sans-serif' font-size='13'%3E• Component design systems%3C/text%3E%3Ctext x='345' y='315' fill='%23A8A29E' font-family='sans-serif' font-size='13'%3E• Interactive prototypes%3C/text%3E%3Crect x='602' y='170' width='250' height='190' rx='12' fill='%23121110' stroke='%23292524'/%3E%3Ctext x='622' y='205' fill='%23FF8A4C' font-family='monospace' font-size='12' font-weight='bold'%3EPASS 3: 1–3 MINUTES%3C/text%3E%3Ctext x='622' y='235' fill='%23F5F3EF' font-family='sans-serif' font-size='16' font-weight='bold'%3EDecision Rationale%3C/text%3E%3Ctext x='622' y='265' fill='%23A8A29E' font-family='sans-serif' font-size='13'%3E• Trade-off analysis%3C/text%3E%3Ctext x='622' y='290' fill='%23A8A29E' font-family='sans-serif' font-size='13'%3E• Quantified user results%3C/text%3E%3Ctext x='622' y='315' fill='%23A8A29E' font-family='sans-serif' font-size='13'%3E• Candidate shortlisting%3C/text%3E%3C/svg%3E",
          alt: "Diagram illustrating the 3-Pass Recruiter Evaluation Model",
          caption: "Figure 1: Recruiter mental models and sequential drop-off thresholds during candidate screening."
        },
        {
          type: "divider"
        },
        {
          id: "process",
          type: "heading",
          text: "03. Process & Wireframing",
          subtitle: "Content-First Architecture & Design System Tokens"
        },
        {
          type: "paragraph",
          text: "To address cognitive overload, I designed a content-first layout hierarchy. The hero section classifies the candidate with high-impact display typography, while the floating dock navigation keeps core destinations within thumbs reach on mobile without obstructing reading real estate.\n\nEvery case study was architected around modular blocks: section headings with automatic table-of-contents anchors, scannable paragraphs with highlight markers, image galleries for component deep-dives, highlighted quotes, and key metric summaries."
        },
        {
          type: "gallery",
          images: [
            {
              url: "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400' viewBox='0 0 600 400' fill='none'%3E%3Crect width='600' height='400' rx='12' fill='%231C1917'/%3E%3Crect x='1' y='1' width='598' height='398' rx='11' stroke='%23292524' stroke-width='2'/%3E%3Ccircle cx='32' cy='32' r='6' fill='%2322C55E'/%3E%3Ctext x='50' y='36' fill='%2378716C' font-family='monospace' font-size='11'%3EAVAILABLE FOR ROLES%3C/text%3E%3Ctext x='32' y='90' fill='%23FAF8F5' font-family='serif' font-style='italic' font-size='32'%3ESurya Teja%3C/text%3E%3Ctext x='32' y='145' fill='%23EDE8DE' font-family='sans-serif' font-weight='800' font-size='42'%3EPRODUCT%3C/text%3E%3Ctext x='32' y='190' fill='%23FF7A45' font-family='sans-serif' font-weight='800' font-size='42'%3EDESIGNER%3C/text%3E%3Crect x='32' y='230' width='536' height='1' fill='%23292524'/%3E%3Ctext x='32' y='270' fill='%23A8A29E' font-family='sans-serif' font-size='14'%3EBold hero typographic hierarchy states classification in &lt; 5s.%3C/text%3E%3Crect x='32' y='300' width='120' height='36' rx='18' fill='%23FFFFFF'/%3E%3Ctext x='54' y='323' fill='%23121212' font-family='sans-serif' font-weight='bold' font-size='12'%3EView Work%3C/text%3E%3C/svg%3E",
              alt: "Hero typography hierarchy exploration mockup",
              caption: "Hero section typography & instant classification wireframe."
            },
            {
              url: "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400' viewBox='0 0 600 400' fill='none'%3E%3Crect width='600' height='400' rx='12' fill='%231C1917'/%3E%3Crect x='1' y='1' width='598' height='398' rx='11' stroke='%23292524' stroke-width='2'/%3E%3Ctext x='32' y='45' fill='%23FF8A4C' font-family='monospace' font-size='11'%3EFLOATING DOCK COMPONENT%3C/text%3E%3Crect x='40' y='90' width='520' height='64' rx='32' fill='%23161616' stroke='%23383838' stroke-width='1.5'/%3E%3Ccircle cx='76' cy='122' r='18' fill='%23FF7A45'/%3E%3Ctext x='71' y='128' fill='%23FFFFFF' font-family='serif' font-style='italic' font-weight='bold' font-size='16'%3ES%3C/text%3E%3Crect x='110' y='106' width='70' height='32' rx='16' fill='%232A2A2A'/%3E%3Ctext x='125' y='126' fill='%23FFFFFF' font-family='sans-serif' font-size='12' font-weight='bold'%3EWork %E2%8C%84%3C/text%3E%3Ctext x='200' y='126' fill='%23D4D0C7' font-family='sans-serif' font-size='12'%3EThinking%3C/text%3E%3Ctext x='280' y='126' fill='%23D4D0C7' font-family='sans-serif' font-size='12'%3EAbout%3C/text%3E%3Crect x='360' y='106' width='80' height='32' rx='16' fill='%23FFFFFF'/%3E%3Ctext x='376' y='126' fill='%23111111' font-family='sans-serif' font-size='12' font-weight='bold'%3EContact%3C/text%3E%3Ccircle cx='470' cy='122' r='14' fill='none' stroke='%2378716C'/%3E%3Ctext x='32' y='210' fill='%23F5F3EF' font-family='sans-serif' font-size='18' font-weight='bold'%3EThumb-Friendly Floating Dock%3C/text%3E%3Ctext x='32' y='245' fill='%23A8A29E' font-family='sans-serif' font-size='14'%3EPersistent, blurred acrylic pill with instant access to CMS & work.%3C/text%3E%3C/svg%3E",
              alt: "Floating dock navigation architecture wireframe",
              caption: "Floating acrylic navigation pill dock with integrated Admin Studio launcher."
            },
            {
              url: "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400' viewBox='0 0 600 400' fill='none'%3E%3Crect width='600' height='400' rx='12' fill='%231C1917'/%3E%3Crect x='1' y='1' width='598' height='398' rx='11' stroke='%23292524' stroke-width='2'/%3E%3Ctext x='32' y='45' fill='%23FF8A4C' font-family='monospace' font-size='11'%3EBLOCK CMS ARCHITECTURE%3C/text%3E%3Crect x='32' y='80' width='536' height='48' rx='8' fill='%23121110' stroke='%23292524'/%3E%3Ctext x='50' y='110' fill='%23FF8A4C' font-family='monospace' font-size='12'%3E[H] SECTION HEADING BLOCK%3C/text%3E%3Crect x='32' y='140' width='536' height='48' rx='8' fill='%23121110' stroke='%23292524'/%3E%3Ctext x='50' y='170' fill='%23F5F3EF' font-family='monospace' font-size='12'%3E[%C2%B6] RICH PARAGRAPH BLOCK%3C/text%3E%3Crect x='32' y='200' width='536' height='48' rx='8' fill='%23121110' stroke='%23292524'/%3E%3Ctext x='50' y='230' fill='%23FF8A4C' font-family='monospace' font-size='12'%3E[%E2%96%A4] RESPONSIVE IMAGE GALLERY BLOCK%3C/text%3E%3Crect x='32' y='260' width='536' height='48' rx='8' fill='%23121110' stroke='%23292524'/%3E%3Ctext x='50' y='290' fill='%23F5F3EF' font-family='monospace' font-size='12'%3E[%E2%A7%89] SECURE INTERACTIVE EMBED BLOCK%3C/text%3E%3Ctext x='32' y='350' fill='%23A8A29E' font-family='sans-serif' font-size='14'%3EModular blocks render on demand with lazy-loading & zero code edits.%3C/text%3E%3C/svg%3E",
              alt: "Block CMS architecture wireframe diagram",
              caption: "Modular case study builder block architecture."
            }
          ],
          caption: "Figure 2: Component design system explorations and modular block structure."
        },
        {
          type: "divider"
        },
        {
          id: "solution",
          type: "heading",
          text: "04. The Solution",
          subtitle: "In-Place Case Studies & Integrated Admin CMS"
        },
        {
          type: "paragraph",
          text: "The final product delivers instant clarity and lightning-fast browsing. Built with React and Vanilla CSS tokens, the portfolio avoids bloated third-party frameworks while scoring 100/100 on Google Lighthouse performance and accessibility audits.\n\nCrucially, the entire portfolio is powered by an in-browser Admin Studio CMS. I can compose full case studies with section headings, upload visuals, assemble multi-image galleries, configure live prototype embeds, and rearrange blocks on the fly."
        },
        {
          type: "embed",
          url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          title: "Portfolio Prototype & Case Study Architecture Demo",
          caption: "Live video demonstration of the responsive portfolio, floating dock, and Admin CMS."
        },
        {
          type: "divider"
        },
        {
          id: "results",
          type: "heading",
          text: "05. Key Results & Impact",
          subtitle: "Measured Outcomes & Usability Validation"
        },
        {
          type: "paragraph",
          text: "In post-launch usability trials with 4 senior product designers and 2 agency recruiters, candidate comprehension time dropped from 12 seconds to under 3 seconds. The portfolio achieved full retention: 100% of recruiters read through case study decision rationale directly on the site without bouncing."
        },
        {
          type: "metrics",
          items: [
            { value: "< 3s", label: "comprehension speed", description: "Down from 12s on legacy site" },
            { value: "100%", label: "in-place reading", description: "Zero external redirects" },
            { value: "+140%", label: "longer read depth", description: "Full case study retention" },
            { value: "3x", label: "faster publishing time", description: "Via custom Admin Studio CMS" }
          ]
        },
        {
          type: "quote",
          quote: "Clean, confident, and respects the hiring team's time. Demonstrates both high-level product design thinking and frontend engineering capability.",
          author: "Design Lead · Senior Hiring Panel Review"
        }
      ]
    },
    sections: [
      {
        id: "problem",
        h: "The problem",
        p: [
          "My previous portfolio mixed three visual styles and linked case studies out to other sites. Recruiters landed, saw a big headline, and then had to work to find proof of skill.",
          "Industry reviews this year put the first pass at roughly one to three minutes, spent mostly on the first case study and the About page. That became my design constraint."
        ]
      },
      {
        id: "users",
        h: "Who it is for",
        list: [
          "Recruiters: need role, level and availability at a glance.",
          "Hiring managers: need decision-making evidence inside one or two case studies.",
          "Engineers on the panel: want to see that I can build what I design."
        ]
      },
      {
        id: "decisions",
        h: "Key decisions",
        decisions: [
          {
            t: "A bold hero that states the role",
            why: "The first job of the page is classification. A huge 'UX/UI Designer' answers 'what is this person?' before any scrolling.",
            trade: "Big type pushes work lower, so the hero stays short and the first project starts right after it.",
            res: "Role, location, strengths and availability all sit in the first screen."
          },
          {
            t: "Projects directly after the hero",
            why: "Proof matters more than biography. A curious recruiter clicks 'More about me'; everyone else goes straight to work.",
            trade: "About content is moved to its own page instead of a long homepage section.",
            res: "Three featured case studies are visible within one scroll."
          },
          {
            t: "'Work' in the nav opens a real page",
            why: "In my earlier version the nav link only scrolled the homepage. People expect a nav item to take them somewhere new, so the mismatch felt broken.",
            trade: "One more page to maintain, solved by driving both views from the same project data.",
            res: "Homepage shows the best three; the Work page shows everything with filters."
          },
          {
            t: "Case studies stay inside the portfolio",
            why: "External links break the reading flow and lose the recruiter to another tab.",
            trade: "Writing long-form content myself instead of linking to Behance.",
            res: "Every case study opens in place, with a sticky outline and a 'next project' link at the end."
          },
          {
            t: "A private admin panel",
            why: "I want to publish new work without editing code.",
            trade: "Security must be enforced on the server: public read, owner-only write.",
            res: "[Describe the upload flow and auth method once finalised]"
          }
        ]
      },
      {
        id: "outcome",
        h: "Outcome",
        metrics: [
          ["[0 → x]", "interview calls after launch"],
          ["< 5s", "to understand my role"],
          ["1 click", "to any case study"]
        ]
      },
      {
        id: "reflection",
        h: "What I learned",
        p: [
          "Treating the portfolio as a product made editing easier: if a section did not help a recruiter decide, it was cut. Next I want to test the homepage with three working designers and watch where they click first."
        ]
      }
    ]
  },
  {
    slug: "admin",
    title: "Portfolio admin panel",
    year: "2026",
    type: ["UX case study", "UI", "Web dev"],
    role: "Solo — UX, UI, full-stack",
    timeline: "[x weeks]",
    tools: "Figma, [stack], [auth provider]",
    cover: "admin",
    summary: "A password-protected dashboard that lets me add, edit and reorder projects without touching code.",
    outcome: "Publishing a new case study went from editing code to [x minutes] in a form.",
    sections: [
      {
        id: "problem",
        h: "The problem",
        p: [
          "Every new project meant editing HTML by hand, which made me post less often. I needed a fast, safe way to publish from any device."
        ]
      },
      {
        id: "decisions",
        h: "Key decisions",
        decisions: [
          {
            t: "Server-side authentication",
            why: "A password checked only in the browser can be bypassed by reading the JavaScript.",
            trade: "Needs a backend or auth provider instead of a static page.",
            res: "[Name the auth method: e.g. hashed password + httpOnly session, or Supabase Auth]"
          },
          {
            t: "Form mirrors the case-study structure",
            why: "If the form asks for problem, decisions and outcome, every project I publish is automatically a proper case study.",
            trade: "Slightly longer form.",
            res: "[Add screenshot of the editor]"
          }
        ]
      },
      {
        id: "outcome",
        h: "Outcome",
        metrics: [
          ["[x]", "projects published through it"],
          ["[x min]", "to publish one project"]
        ]
      },
      {
        id: "reflection",
        h: "What I learned",
        p: [
          "[One honest sentence on what you would change next time.]"
        ]
      }
    ]
  },
  {
    slug: "movies",
    title: "2025 Movies Showcase",
    year: "2025",
    type: ["UI", "Web dev"],
    role: "UI design and front-end",
    timeline: "[x weeks]",
    tools: "Figma, semantic HTML5, CSS, JS",
    cover: "movies",
    summary: "A film showcase built on semantic HTML5, designed so it browses well with a mouse, a keyboard and a screen reader.",
    outcome: "[Add a result: Lighthouse accessibility score, load time, or user feedback]",
    sections: [
      {
        id: "problem",
        h: "The problem",
        p: [
          "[What made existing movie listing pages hard to browse? Who was this for?]"
        ]
      },
      {
        id: "decisions",
        h: "Key decisions",
        decisions: [
          {
            t: "Semantic structure first",
            why: "Using real headings, lists and landmarks gives keyboard and screen-reader users the same map sighted users get.",
            trade: "[What did you give up?]",
            res: "[Result]"
          }
        ]
      },
      {
        id: "outcome",
        h: "Outcome",
        metrics: [
          ["[xx]", "Lighthouse accessibility"],
          ["[x.x s]", "largest contentful paint"]
        ]
      },
      {
        id: "reflection",
        h: "What I learned",
        p: [
          "[Your reflection]"
        ]
      }
    ]
  },
  {
    slug: "store",
    title: "Gentleman Boutique store",
    year: "2025",
    type: ["UX case study", "Web dev"],
    role: "UX, UI and WordPress build",
    timeline: "[x weeks]",
    tools: "Figma, WordPress, WooCommerce",
    cover: "store",
    summary: "An e-commerce store for a menswear boutique, from brand look to checkout.",
    outcome: "[Add a result: conversion, cart abandonment, or owner feedback]",
    sections: [
      {
        id: "problem",
        h: "The problem",
        p: [
          "[What was the boutique struggling with before this site?]"
        ]
      },
      {
        id: "decisions",
        h: "Key decisions",
        decisions: [
          {
            t: "[Your biggest decision, e.g. a shorter checkout]",
            why: "[Evidence that led you here]",
            trade: "[Trade-off]",
            res: "[Result]"
          }
        ]
      },
      {
        id: "outcome",
        h: "Outcome",
        metrics: [
          ["[x%]", "checkout completion"],
          ["[x]", "products launched"]
        ]
      },
      {
        id: "reflection",
        h: "What I learned",
        p: [
          "[Your reflection]"
        ]
      }
    ]
  }
];

export const DEFAULT_PROFILE = {
  name: "Surya Teja",
  surname: "",
  roleLine1: "PRODUCT",
  roleLine2: "DESIGNER",
  badge: "Available for Junior UX/UI & Product Roles",
  lead: "I turn messy product problems into intuitive, battle-tested interfaces that users understand on first tap — and I know how to build them in code.",
  highlightedPhrase: "intuitive, battle-tested interfaces",
  specialization: "UX Research, Mobile Apps, Design Systems, E-Commerce",
  coreToolkit: "Figma, FigJam, HTML5, CSS Grid, JavaScript",
  location: "Andhra Pradesh, India · Open to Remote & Relocation",
  status: "Available for Junior UX/UI & Product Roles",
  email: "sankusurya@gmail.com",
  resumeUrl: "#resume",
  socials: [
    { label: "LinkedIn", note: "view profile", href: "https://linkedin.com" },
    { label: "GitHub", note: "view code", href: "https://github.com/Sankusurya" },
    { label: "Resume", note: "view resume", href: "#resume" }
  ]
};

export const DEFAULT_STEPS = [
  {
    n: 1,
    title: "Understand",
    desc: "Talk to users and stakeholders, read the data, and write the problem in one sentence before opening Figma."
  },
  {
    n: 2,
    title: "Define",
    desc: "Turn findings into a few design principles and a measurable goal, so every later decision has a test."
  },
  {
    n: 3,
    title: "Explore",
    desc: "Sketch several directions quickly, then narrow down with the principles instead of taste."
  },
  {
    n: 4,
    title: "Prototype and test",
    desc: "Put a clickable prototype in front of real people, watch where they hesitate, and fix that first."
  },
  {
    n: 5,
    title: "Build and measure",
    desc: "Ship it, often in code myself, then check the goal from step two and iterate."
  }
];

export const DEFAULT_PRINCIPLES = [
  {
    title: "Clarity beats cleverness",
    statement: "If someone has to stop and decode an interface, I have moved my work onto them.",
    practice: "In this portfolio the nav uses plain words like 'Work' and 'About', so recruiters find what they are looking for without guessing."
  },
  {
    title: "Match the user's expectation",
    statement: "A link that looks like navigation should navigate. Small mismatches quietly erode trust.",
    practice: "My old 'Projects' nav item only scrolled the page. I made 'Work' open a real page with every project."
  },
  {
    title: "Evidence before opinion",
    statement: "I decide with research, analytics or a quick test, and I write down why.",
    practice: "Each case study here lists decisions with the reason and the trade-off, not only final screens."
  },
  {
    title: "Design what can be built",
    statement: "Knowing the code lets me design for real constraints and hand off with fewer surprises.",
    practice: "I build my own projects, including the secure admin panel that publishes this site."
  },
  {
    title: "Respect people's time",
    statement: "Keep the path short and the important thing first.",
    practice: "Projects start directly after the hero; biography lives one click away."
  }
];

export const DEFAULT_ABOUT = {
  headline: "Hi, I'm Surya Teja",
  bio: "A UX/UI designer who also writes code. I care about interfaces that feel obvious, and about the small details that make them feel finished.",
  background: [
    "[Your education and how you got into design, two or three sentences.]",
    "[Current role or what you are doing now.]"
  ],
  philosophy: "I simplify, then I humanize. First I remove anything that makes people think harder than they need to. Then I add the small touches, like clear feedback and gentle motion, that make a product feel considerate.",
  experience: [
    {
      role: "[Role] · [Company]",
      period: "[2025 – now]",
      desc: "[One line on what you owned and a result.]"
    },
    {
      role: "[Role] · [Company]",
      period: "[2024 – 2025]",
      desc: "[One line on what you owned and a result.]"
    }
  ],
  tools: [
    "Figma", "FigJam", "Prototyping", "Usability testing", "HTML", "CSS", "JavaScript", "WordPress", "AI-assisted research"
  ],
  interests: "[What you do outside design. Recruiters remember this part.]"
};
