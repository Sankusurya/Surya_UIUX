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

  // Cover image: remove SVG placeholder or legacy keys
  let coverImg = p.coverImg || '';
  if (typeof coverImg === 'string' && coverImg.startsWith('data:image/svg+xml')) {
    coverImg = '';
  }

  // Ensure slices exist on each image
  const normalizedImages = images.map((img, idx) => ({
    id: img.id || `img-${idx}`,
    url: img.url,
    originalUrl: img.originalUrl || img.url,
    alt: img.alt || `${p.title || 'Project'} Case Study Deliverable`,
    width: img.width || 0,
    height: img.height || 0,
    fileSize: img.fileSize || 0,
    slices: Array.isArray(img.slices) && img.slices.length > 0
      ? img.slices
      : [{ url: img.url, width: img.width || 0, height: img.height || 0, index: 0 }],
  }));

  return {
    ...p,
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
    slug: "portfolio",
    title: "Designing this portfolio",
    year: "2026",
    type: ["UX case study", "Web dev"],
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
    type: ["UX case study", "UI", "Web dev"],
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
    type: ["UI", "Web dev"],
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
    type: ["UX case study", "Web dev"],
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
  roleLine1: "PRODUCT",
  roleLine2: "DESIGNER",
  badge: "Available for Junior UX/UI & Product Roles",
  lead: "I turn messy product problems into intuitive, battle-tested interfaces that users understand on first tap — and I know how to build them in code.",
  highlightedPhrase: "intuitive, battle-tested interfaces",
  specialization: "UX Research, Mobile Apps, Design Systems, E-Commerce",
  coreToolkit: "Figma, FigJam, HTML5, CSS Grid, JavaScript",
  location: "Andhra Pradesh, India · Open to Remote & Relocation",
  status: "Available for Junior UX/UI & Product Roles",
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
