/**
 * Safely resolves an asset URL so it works seamlessly on GitHub Pages subpaths,
 * custom domains, and local preview.
 */
export const resolveAssetUrl = (url) => {
  if (!url || typeof url !== 'string') return url || '';
  const trimmed = url.trim();

  // Keep data URLs, blob URLs, and full HTTP/HTTPS URLs untouched
  if (
    trimmed.startsWith('data:') ||
    trimmed.startsWith('blob:') ||
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://')
  ) {
    return trimmed;
  }

  // Detect GitHub Pages repo subpath from window.location (e.g. "Surya_UIUX")
  let repoSubpath = '';
  if (typeof window !== 'undefined' && window.location.hostname.endsWith('github.io')) {
    const pathParts = window.location.pathname.split('/').filter(Boolean);
    if (pathParts.length > 0 && !pathParts[0].includes('.')) {
      repoSubpath = pathParts[0];
    }
  }

  // Strip leading slashes, dots, or backslashes
  let cleanPath = trimmed.replace(/^(\.\/|\/|\\)+/, '');

  // If already prefixed with repoSubpath, strip it to prevent duplicate /Surya_UIUX/Surya_UIUX/...
  if (repoSubpath && cleanPath.startsWith(`${repoSubpath}/`)) {
    cleanPath = cleanPath.slice(repoSubpath.length + 1);
  }

  if (repoSubpath) {
    return `/${repoSubpath}/${cleanPath}`;
  }

  // In localhost or root domain preview
  const base = import.meta.env?.BASE_URL || './';
  const cleanBase = base.endsWith('/') ? base : `${base}/`;
  return `${cleanBase}${cleanPath}`;
};

/**
 * Normalizes any project (legacy or new) to the clean, streamlined case study structure:
 * - images: array of uncompressed full-fidelity case study images [{ id, url, alt }]
 * - prototypeUrl: link to Figma/Framer/Live prototype
 * - caseStudyUrl: link to Behance/full case study
 * - role, timeline, tools: optional metadata facts
 */
export const normalizeProject = (p) => {
  if (!p) return null;

  // Extract images and clean any leftover SVG placeholders or broken block graphics
  let images = Array.isArray(p.images) ? [...p.images] : [];
  images = images.filter((img) => {
    if (!img || !img.url) return false;
    if (typeof img.url === 'string' && img.url.startsWith('data:image/svg+xml')) return false;
    return true;
  });

  // Extract prototypeUrl and remove Rick Astley placeholder
  let prototypeUrl = p.prototypeUrl || '';
  if (prototypeUrl.includes('dQw4w9WgXcQ') || prototypeUrl.includes('youtube.com/watch?v=dQw4w9WgXcQ')) {
    prototypeUrl = '';
  }

  // Cover image: robustly extract and remove SVG placeholder or legacy keys
  let rawCover = p.coverImg || p.coverImage || p.cover_img || '';
  let coverImg = typeof rawCover === 'object' && rawCover !== null ? (rawCover.url || '') : String(rawCover || '');
  if (typeof coverImg === 'string' && coverImg.startsWith('data:image/svg+xml')) {
    coverImg = '';
  }
  // If fuel-n-fix still points to the 32k-pixel full case study graphic or is empty, use the dedicated cover artwork
  if (p.slug === 'fuel-n-fix' && (!coverImg || coverImg.includes('fuel-n-fix.png'))) {
    coverImg = 'assets/fuel-n-fix-cover.png';
  }
  coverImg = resolveAssetUrl(coverImg);

  // Ensure slices exist on each image and asset URLs are properly resolved
  const normalizedImages = images.map((img, idx) => {
    const rawSlices = Array.isArray(img.slices) && img.slices.length > 0
      ? img.slices
      : [{ url: img.url, width: img.width || 0, height: img.height || 0, index: 0 }];

    return {
      id: img.id || `img-${idx}`,
      url: resolveAssetUrl(img.url),
      originalUrl: resolveAssetUrl(img.originalUrl || img.url),
      alt: img.alt || `${p.title || 'Project'} Case Study Deliverable`,
      width: img.width || 0,
      height: img.height || 0,
      fileSize: img.fileSize || 0,
      slices: rawSlices.map((slice, sIdx) => ({
        ...slice,
        url: resolveAssetUrl(slice.url),
      })),
    };
  });

  // Standardize tag labels across all projects
  let rawTypes = Array.isArray(p.type) ? p.type : (p.type ? [p.type] : ['UX Case Study']);
  const normalizedTypes = rawTypes.map((t) => {
    const s = String(t || '').trim();
    const lower = s.toLowerCase();
    if (lower === 'ux case study' || lower === 'design case study') return 'UX Case Study';
    if (lower === 'ui' || lower === 'ui design') return 'UI Design';
    if (lower === 'web dev' || lower === 'web development') return 'Web Dev';
    if (lower === 'mobile app') return 'Mobile App';
    if (lower === 'e-commerce' || lower === 'ecommerce') return 'Ecommerce';
    return s;
  });

  // Standardize realistic outcome for Fuel N Fix
  let outcome = p.outcome || '';
  if (p.slug === 'fuel-n-fix' && (outcome.includes('under 5 seconds with zero cognitive friction') || !outcome)) {
    outcome = '11 driver research interviews → 3 key UX iterations → validated prototype with 8 motorists.';
  }

  return {
    ...p,
    type: normalizedTypes,
    outcome,
    role: p.role || p.caseStudy?.role || '',
    timeline: p.timeline || p.caseStudy?.timeline || '',
    tools: p.tools || p.caseStudy?.tools || '',
    prototypeUrl,
    caseStudyUrl: p.caseStudyUrl || '',
    coverImg,
    images: normalizedImages,
  };
};

export const DEFAULT_PROJECTS = [
  {
    slug: "fuel-n-fix",
    title: "Fuel N Fix",
    year: "2026",
    type: ["UX Case Study", "Mobile App"],
    role: "Solo — Product Design & UX Research",
    timeline: "4 Weeks · Jan–Feb 2026",
    tools: "Figma, Design Systems, Mobile UX",
    prototypeUrl: "",
    caseStudyUrl: "",
    coverImg: "assets/fuel-n-fix-cover.png",
    summary: "Bringing fuel and local repair help to your location. An on-demand roadside assistance experience designed for stranded motorists.",
    outcome: "11 driver research interviews → 3 key UX iterations → validated prototype with 8 motorists.",
    images: [
      {
        id: "fuel-n-fix-case-study",
        url: "assets/fuel-n-fix.png",
        originalUrl: "Fuel N Fix.png",
        alt: "Fuel N Fix UI/UX Case Study Visuals",
        width: 1850,
        height: 32768,
        fileSize: 8852063,
        isSliced: true,
        slices: [
          { index: 0, url: "assets/fuel-n-fix/slice_0.png", width: 1850, height: 2048 },
          { index: 1, url: "assets/fuel-n-fix/slice_1.png", width: 1850, height: 2048 },
          { index: 2, url: "assets/fuel-n-fix/slice_2.png", width: 1850, height: 2048 },
          { index: 3, url: "assets/fuel-n-fix/slice_3.png", width: 1850, height: 2048 },
          { index: 4, url: "assets/fuel-n-fix/slice_4.png", width: 1850, height: 2048 },
          { index: 5, url: "assets/fuel-n-fix/slice_5.png", width: 1850, height: 2048 },
          { index: 6, url: "assets/fuel-n-fix/slice_6.png", width: 1850, height: 2048 },
          { index: 7, url: "assets/fuel-n-fix/slice_7.png", width: 1850, height: 2048 },
          { index: 8, url: "assets/fuel-n-fix/slice_8.png", width: 1850, height: 2048 },
          { index: 9, url: "assets/fuel-n-fix/slice_9.png", width: 1850, height: 2048 },
          { index: 10, url: "assets/fuel-n-fix/slice_10.png", width: 1850, height: 2048 },
          { index: 11, url: "assets/fuel-n-fix/slice_11.png", width: 1850, height: 2048 },
          { index: 12, url: "assets/fuel-n-fix/slice_12.png", width: 1850, height: 2048 },
          { index: 13, url: "assets/fuel-n-fix/slice_13.png", width: 1850, height: 2048 },
          { index: 14, url: "assets/fuel-n-fix/slice_14.png", width: 1850, height: 2048 },
          { index: 15, url: "assets/fuel-n-fix/slice_15.png", width: 1850, height: 2048 },
        ]
      }
    ],
    sections: [
      {
        id: "problem",
        h: "The problem",
        p: [
          "Vehicle breakdowns on highways cause panic. Existing assistance apps require complex registration, location verification, and extensive forms before help is dispatched.",
          "Fuel N Fix simplifies emergency help into a 3-tap request with live mechanic tracking and transparent pricing."
        ]
      },
      {
        id: "outcome",
        h: "Outcome",
        metrics: [
          ["11", "driver research interviews"],
          ["3", "key UX iterations"],
          ["8", "drivers tested on prototype"]
        ]
      }
    ]
  },
  {
    slug: "portfolio",
    title: "Designing this portfolio",
    year: "2026",
    type: ["UX Case Study", "Web Dev"],
    role: "Solo — UX Research, Product Design & Front-End",
    timeline: "4 Weeks · Jan–Feb 2026",
    tools: "Figma, React, Tailwind CSS, Vite",
    prototypeUrl: "",
    caseStudyUrl: "https://github.com/Sankusurya/Surya_UIUX",
    coverImg: "",
    summary: "A portfolio is a product with one tired user: a recruiter with three minutes. I redesigned mine around how they actually scan.",
    outcome: "Role readable in under 5 seconds; every case study one click from the homepage, no external redirects.",
    images: [],
    caseStudy: {
      role: "Solo — UX Research, Product Design & Front-End",
      timeline: "4 Weeks · Jan–Feb 2026",
      team: "Solo Designer (Review sessions with 3 Senior Mentors)",
      tools: "Figma, React, Tailwind CSS, Vite",
      blocks: []
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
            res: "Custom admin interface with full-resolution visual publishing."
          }
        ]
      },
      {
        id: "outcome",
        h: "Outcome",
        metrics: [
          ["< 3s", "to understand role"],
          ["100%", "in-place reading"],
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
    type: ["UX Case Study", "Web Dev"],
    role: "Solo — UX, UI, full-stack",
    timeline: "3 Weeks · Jan 2026",
    tools: "Figma, React, Tailwind CSS",
    coverImg: "",
    images: [],
    prototypeUrl: "",
    caseStudyUrl: "",
    summary: "A password-protected dashboard that lets me add, edit and reorder projects without touching code.",
    outcome: "Publishing a new case study went from editing code to minutes in a clean form.",
    sections: [
      {
        id: "problem",
        h: "The problem",
        p: [
          "Every new project meant editing HTML by hand, which made me post less often. I needed a fast, safe way to publish from any device."
        ]
      },
      {
        id: "outcome",
        h: "Outcome",
        metrics: [
          ["100%", "in-place visual publishing"],
          ["< 5 min", "to publish one project"]
        ]
      }
    ]
  },
  {
    slug: "movies",
    title: "2025 Movies Showcase",
    year: "2025",
    type: ["UI Design", "Web Dev"],
    role: "UI design and front-end",
    timeline: "2 Weeks · Dec 2025",
    tools: "Figma, semantic HTML5, CSS, JS",
    coverImg: "",
    images: [],
    prototypeUrl: "",
    caseStudyUrl: "",
    summary: "A film showcase built on semantic HTML5, designed so it browses well with a mouse, a keyboard and a screen reader.",
    outcome: "100/100 Lighthouse accessibility score and fluid responsive grid layouts.",
    sections: [
      {
        id: "problem",
        h: "The problem",
        p: [
          "Existing movie listing pages were cluttered and difficult for keyboard/screen-reader users to navigate efficiently."
        ]
      },
      {
        id: "outcome",
        h: "Outcome",
        metrics: [
          ["100", "Lighthouse accessibility"],
          ["0.8s", "largest contentful paint"]
        ]
      }
    ]
  },
  {
    slug: "store",
    title: "Gentleman Boutique store",
    year: "2025",
    type: ["UX Case Study", "Ecommerce"],
    role: "UX, UI and WordPress build",
    timeline: "4 Weeks · Nov 2025",
    tools: "Figma, WordPress, WooCommerce",
    coverImg: "",
    images: [],
    prototypeUrl: "",
    caseStudyUrl: "",
    summary: "An e-commerce store for a menswear boutique, from brand look to checkout.",
    outcome: "Seamless mobile checkout flow with minimal friction and unified aesthetic.",
    sections: [
      {
        id: "problem",
        h: "The problem",
        p: [
          "The boutique was struggling with cart abandonment due to complex multi-step forms on mobile devices."
        ]
      },
      {
        id: "outcome",
        h: "Outcome",
        metrics: [
          ["+34%", "checkout completion rate"],
          ["40+", "products launched"]
        ]
      }
    ]
  }
];

export const DEFAULT_PROFILE = {
  name: "Surya Teja",
  surname: "",
  roleLine1: "USER EXPERIENCE",
  roleLine2: "DESIGNER",
  badge: "Available for Junior User Experience & UI Roles",
  lead: "I turn messy product problems into intuitive, battle-tested interfaces that users understand on first tap — and I know how to build them in code.",
  highlightedPhrase: "intuitive, battle-tested interfaces",
  specialization: "Mobile & web product UX · AI-powered products · Design systems",
  coreToolkit: "Figma, Design Systems, Prototyping, AI-assisted design-to-code",
  location: "Visakhapatnam, India · Open to remote & relocation",
  status: "Available for Junior User Experience & UI Roles",
  email: "suryasanku800@gmail.com",
  resumeUrl: "#resume",
  socials: [
    { label: "LinkedIn", note: "view profile", href: "https://linkedin.com" },
    { label: "GitHub", note: "view code", href: "https://github.com/Sankusurya" },
    { label: "Resume", note: "view resume", href: "#resume" }
  ]
};

export const DEFAULT_STEPS = [
  {
    n: "01",
    title: "Understand",
    desc: "Explore user needs, business goals, and existing pain points to understand the problem worth solving."
  },
  {
    n: "02",
    title: "Define",
    desc: "Synthesize insights, identify the core problem, and establish clear design priorities."
  },
  {
    n: "03",
    title: "Explore",
    desc: "Explore multiple solutions through user flows, wireframes, and visual directions before committing to one."
  },
  {
    n: "04",
    title: "Prototype & test",
    desc: "Build interactive prototypes, observe user behavior, and identify usability issues early."
  },
  {
    n: "05",
    title: "Refine & deliver",
    desc: "Improve the experience using feedback, document design decisions, and prepare clear developer handoff."
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
  bio: "A UI/UX designer who designs end to end — research, flows, high-fidelity UI and developer-ready handoff — and backs every decision with what users actually said or did.",
  photo: "assets/surya-teja.jpg",
  background: [
    "I'm a UI/UX Designer at Dilshaj Infotech, designing EduProva — an AI-powered learning and career super-app — across six product areas, with one shared component library so every module looks and works the same.",
    "I didn't start in UX. After a B.Sc. in Mathematics, Electronics and Computer Science at Andhra University, I spent 1.5 years at Cyient turning scanned telecom records into precise network drawings. Every layer, symbol and label followed a standard, and every drawing was checked before anyone used it. That's where I learned the rule I still design by: if someone can't use it without asking me, it isn't finished.",
    "I wanted that same care to reach people instead of cables. In 2025 I trained in UI/UX at Tech Mahindra SMART Academy, cleared the NSDC User Experience Designer assessment with Grade A, and moved into product design."
  ],
  philosophy: [
    "Listen before I draw. I frame problems from real conversations, not assumptions. On Fuel N Fix, 11 interviews with riders and mechanics showed the real fear wasn't finding help — it was the price changing at the roadside. That one insight became the core feature: the price is locked before booking, and any change needs the rider's approval.",
    "Every decision gets a reason I can show. In my case studies each decision comes with the moment that triggered it, the options I weighed, the trade-off I accepted, and an honest note on how far it has been validated. When riders couldn't tell my two home-screen boxes apart without reading, I switched to picture cards they understood at a glance. At EduProva, I reworked the AI auto-apply flow after usability feedback. When something isn't tested yet, I say so and write down how I'll test it.",
    "Design for every user — and for the build. A mechanic told me, 'When we're busy, we don't take these jobs,' so I added an 'I'm busy' button: a two-sided product only works if both sides keep using it. And because I work closely with developers, I design with reusable components, clear Dev Mode specs and working prototypes built with AI-assisted coding, so what ships matches what was designed."
  ],
  experience: [
    {
      role: "UI/UX Designer · Dilshaj Infotech",
      period: "Nov 2025 – Present",
      desc: "Designing EduProva end to end — 6 product areas (learning, AI tools, jobs, freelancing, community and supporting flows) in one visual language, backed by a reusable Figma component library and Dev Mode handoff. Improved the AI job board and auto-apply flows from usability feedback."
    },
    {
      role: "UI/UX Development Certification · Tech Mahindra SMART Academy",
      period: "Apr – Aug 2025",
      desc: "Trained in research, information architecture, wireframing, prototyping and usability testing. Cleared the NSDC User Experience Designer assessment with Grade A."
    },
    {
      role: "Design Specialist, Telecom Network Engineering · Cyient",
      period: "Oct 2023 – Apr 2025",
      desc: "Led 12+ digitization projects turning scanned fiber and coax records into accurate network designs. Recognized by my project manager for consistently high-quality delivery."
    }
  ],
  tools: [
    "Figma",
    "Auto Layout & Variants",
    "Design Systems",
    "Interactive Prototyping",
    "Dev Mode Handoff",
    "Figma MCP Server",
    "AI-assisted prototyping (vibe coding)",
    "Usability Testing",
    "Photoshop",
    "Illustrator",
    "LottieFiles",
    "HTML & CSS"
  ],
  interests: "Outside client work I'm usually exploring motion with LottieFiles or turning Figma screens into working prototypes with AI coding tools — building things is how I learn them. PERSONAL_HOBBY_HERE"
};

export const THINKING_STORY = {
  header: {
    title: "Design thinking",
    label: "How I actually think",
    intro: "Every designer has the same five steps on their website. The steps aren't what make the work good — the habits inside them are. So here's my process the way it really feels: six small moments, what I do in each, and the question I keep asking myself."
  },
  chapters: [
    {
      id: "story-ch-1",
      number: "01",
      tag: "01 · Listen",
      fullTag: "CHAPTER 01 — LISTEN",
      title: "People tell you symptoms, not causes",
      scene: "Someone says, 'This app is slow.' Most of the time it isn't slow. They just can't tell whether it's working.",
      whatIDo: [
        "Ask about the last time it happened, not what they think in general.",
        "Ask 'what happened just before that?' until I reach the real moment.",
        "Talk to every side — the people who use it and the people who serve them."
      ],
      question: "What were they actually trying to do when it went wrong?",
      lesson: "The real problem is usually one question deeper than the first answer."
    },
    {
      id: "story-ch-2",
      number: "02",
      tag: "02 · Frame",
      fullTag: "CHAPTER 02 — FRAME",
      title: "One sentence before any screen",
      scene: "Before I open Figma, I write the problem as one sentence: who, at what moment, and what goes wrong. If it doesn't fit in one sentence, I don't understand it yet.",
      whatIDo: [
        "Name the exact moment the problem happens, not just the feature.",
        "Use that sentence to test every later decision: does this make that moment better?"
      ],
      question: "If I solved only this, would it matter to them?",
      lesson: "A clear problem saves more time than a fast design."
    },
    {
      id: "story-ch-3",
      number: "03",
      tag: "03 · Explore",
      fullTag: "CHAPTER 03 — EXPLORE",
      title: "The first idea is just the obvious one",
      scene: "My first idea always feels right. That's exactly why I don't trust it yet.",
      whatIDo: [
        "Put two or three real options side by side.",
        "Write the trade-off of each in plain words — what it gains, what it costs.",
        "Choose, and write down what I gave up, so the decision can be explained later."
      ],
      question: "What am I giving up by choosing this?",
      lesson: "A decision without a trade-off is usually a decision I haven't thought through."
    },
    {
      id: "story-ch-4",
      number: "04",
      tag: "04 · Check",
      fullTag: "CHAPTER 04 — CHECK",
      title: "The most useful thing in a test is a pause",
      scene: "A finger hovers between two buttons for a second too long. Nobody says anything — but that pause tells me more than any compliment.",
      whatIDo: [
        "Show work early, while it's still cheap to change.",
        "Stay quiet and watch, instead of explaining my design.",
        "Label honestly how sure I am: tested, informal feedback, or not tested yet — and how I'd test it next."
      ],
      question: "Where did they hesitate, and why?",
      lesson: "If I have to explain it, the design isn't finished."
    },
    {
      id: "story-ch-5",
      number: "05",
      tag: "05 · Rethink",
      fullTag: "CHAPTER 05 — RETHINK",
      title: "There's always someone I forgot",
      scene: "It's easy to design only for the person tapping the screen. But behind most products is someone else — the person delivering, approving, supporting or managing it.",
      whatIDo: [
        "Map everyone the product touches, not just the main user.",
        "Ask what each of them needs to keep using it.",
        "Throw away what doesn't work, and keep a record of why."
      ],
      question: "Who else has to say yes for this to work?",
      lesson: "A product only works if every side keeps using it."
    },
    {
      id: "story-ch-6",
      number: "06",
      tag: "06 · Hand off",
      fullTag: "CHAPTER 06 — HAND OFF",
      title: "Done is when it ships right, not when it looks right",
      scene: "A design that looks perfect in Figma can still break on a small phone, an empty list, or a slow connection.",
      whatIDo: [
        "Design the hard states too: empty, error, loading, no network.",
        "Build with reusable components so every screen behaves the same.",
        "Give developers clear specs, and turn screens into working prototypes so we test real flows early."
      ],
      question: "What will a developer have to guess?",
      lesson: "Design what can be built — and leave nothing to guess."
    }
  ],
  ai: {
    title: "How I use AI",
    label: "Faster making, not deciding",
    text: "I use AI tools to move faster — turning designs into working prototypes and trying more options in less time. But AI doesn't decide what to build. The insights that change a product still come from watching and talking to real people."
  },
  rules: {
    title: "The rules I keep",
    label: "One per chapter",
    items: [
      { chapterId: "story-ch-1", chapterNumber: "01", text: "The real problem is one question deeper." },
      { chapterId: "story-ch-2", chapterNumber: "02", text: "One clear sentence before any screen." },
      { chapterId: "story-ch-3", chapterNumber: "03", text: "Every decision has a trade-off — write it down." },
      { chapterId: "story-ch-4", chapterNumber: "04", text: "If I have to explain it, it isn't finished." },
      { chapterId: "story-ch-5", chapterNumber: "05", text: "Design for everyone the product touches." },
      { chapterId: "story-ch-6", chapterNumber: "06", text: "Leave nothing for developers to guess." }
    ]
  }
};
