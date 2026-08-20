// Procedural content for the "large" seed profile: hundreds of extra guests
// and proposals layered on top of the curated data in ./data/. Everything is
// derived from word lists + a seeded RNG so the output is deterministic and
// there is no bulk fixture file to maintain. E2E tests run the "small"
// profile and never see this data, so it can change freely.

import { hasProfileFields, type GuestConfig } from "./data/guests";

const firstNames = [
  "Aiko",
  "Bruno",
  "Camille",
  "Dana",
  "Emeka",
  "Farida",
  "Gustavo",
  "Helga",
  "Ilya",
  "Jasmin",
  "Kenji",
  "Lucia",
  "Marek",
  "Noor",
  "Otto",
  "Paulina",
  "Quang",
  "Rosa",
  "Stefan",
  "Tariq",
  "Uma",
  "Valeria",
  "Wanjiru",
  "Ximena",
  "Yusuf",
  "Zofia",
  "Anders",
  "Bilal",
  "Catalina",
  "Dagmar",
];

const lastNames = [
  "Abebe",
  "Berger",
  "Castillo",
  "Dimitrov",
  "Egede",
  "Ferrari",
  "Grigoryan",
  "Huang",
  "Ivanova",
  "Jansen",
  "Kaur",
  "Lindqvist",
  "Moreau",
  "Nakamura",
  "Osei",
  "Pereira",
  "Rahman",
  "Santos",
  "Takahashi",
  "Ueda",
  "Vargas",
  "Weber",
  "Yoon",
  "Zimmermann",
];

// city → [country, languages spoken there besides English]
const cities: [string, string, string[]][] = [
  ["Nairobi", "Kenya", ["Swahili"]],
  ["Manila", "Philippines", ["Tagalog"]],
  ["Vienna", "Austria", ["German"]],
  ["Montréal", "Canada", ["French"]],
  ["Jakarta", "Indonesia", ["Indonesian"]],
  ["Helsinki", "Finland", ["Finnish"]],
  ["Lisbon", "Portugal", ["Portuguese"]],
  ["Warsaw", "Poland", ["Polish"]],
  ["Santiago", "Chile", ["Spanish"]],
  ["Tallinn", "Estonia", ["Estonian"]],
  ["Bratislava", "Slovakia", ["Slovak"]],
  ["Tbilisi", "Georgia", ["Georgian"]],
  ["Hanoi", "Vietnam", ["Vietnamese"]],
  ["Medellín", "Colombia", ["Spanish"]],
  ["Kampala", "Uganda", ["Luganda", "Swahili"]],
  ["Karachi", "Pakistan", ["Urdu"]],
  ["Brno", "Czechia", ["Czech"]],
  ["Valencia", "Spain", ["Spanish", "Catalan"]],
  ["Sapporo", "Japan", ["Japanese"]],
  ["Tunis", "Tunisia", ["Arabic", "French"]],
  ["Riga", "Latvia", ["Latvian"]],
  ["Busan", "South Korea", ["Korean"]],
  ["Curitiba", "Brazil", ["Portuguese"]],
  ["Antwerp", "Belgium", ["Dutch", "French"]],
];

const roles = [
  "Frontend developer",
  "Backend engineer",
  "Data analyst",
  "Product designer",
  "SRE",
  "Engineering manager",
  "Technical writer",
  "Security analyst",
  "Mobile developer",
  "Platform engineer",
  "QA engineer",
  "Solutions architect",
  "Researcher",
  "Product manager",
  "DevRel engineer",
];

const interests = [
  "typed APIs",
  "observability",
  "design systems",
  "developer tooling",
  "distributed tracing",
  "accessibility",
  "edge computing",
  "data visualization",
  "event-driven systems",
  "documentation",
  "open source",
  "performance budgets",
  "local-first software",
  "test automation",
  "API governance",
];

const hobbies = [
  "bouldering",
  "urban sketching",
  "sourdough baking",
  "trail running",
  "birdwatching",
  "chess",
  "analog photography",
  "gardening",
  "learning languages",
  "playing bass",
];

const promptPool: [string, string][] = [
  ["Ask me about", "The weirdest production incident I've ever debugged"],
  ["Looking for", "People to compare notes with on team onboarding"],
  ["Offering", "An honest review of your conference talk draft"],
  ["Currently obsessed with", "Keyboard layouts I will never actually learn"],
  ["A hill I will die on", "Meetings without agendas should be declined"],
  ["Looking for", "A running buddy for the mornings"],
  ["Offering", "Pairing sessions on tricky refactorings"],
  ["Ask me about", "Working remotely from three time zones in one year"],
  ["My weirdest skill", "Estimating JSON payload sizes by eye"],
  ["I collect", "Vintage programming books nobody wants"],
];

const proposalTopics = [
  "WebAssembly",
  "Event Sourcing",
  "Feature Flags",
  "SQLite",
  "CRDTs",
  "WebRTC",
  "OAuth Flows",
  "Terraform",
  "Container Queries",
  "Web Components",
  "Data Pipelines",
  "API Versioning",
  "Monorepos",
  "CI Caching",
  "Load Testing",
  "Chaos Engineering",
  "TypeScript Generics",
  "Developer Onboarding",
  "Incident Response",
  "GraphQL Federation",
  "Serverless Functions",
  "Edge Rendering",
  "Static Analysis",
  "Property-Based Testing",
  "Message Queues",
  "Browser Extensions",
  "Progressive Web Apps",
  "Structured Logging",
  "Secrets Management",
  "Database Migrations",
];

const proposalTitleTemplates = [
  (t: string) => `Introduction to ${t}`,
  (t: string) => `${t} in Production: Lessons Learned`,
  (t: string) => `Debugging ${t} at Scale`,
  (t: string) => `Workshop: Getting Started with ${t}`,
  (t: string) => `Why We Moved Away from ${t}`,
  (t: string) => `Live Demo: ${t} from Scratch`,
  (t: string) => `${t} for Small Teams`,
  (t: string) => `A Skeptic's Guide to ${t}`,
  (t: string) => `Testing Strategies for ${t}`,
  (t: string) => `Migrating to ${t} One Step at a Time`,
  (t: string) => `Open Discussion: ${t} War Stories`,
  (t: string) => `Benchmarking ${t}: Numbers You Can Trust`,
  (t: string) => `${t} Beyond the Hello World`,
  (t: string) => `The Hidden Costs of ${t}`,
  (t: string) => `Pairing Lab: Bring Your ${t} Problems`,
];

const proposalIntros = [
  (t: string) =>
    `A practical look at ${t}: what it solves, what it costs, and where it bites back.`,
  (t: string) =>
    `We adopted ${t} a year ago. This session covers what we'd do again and what we'd skip.`,
  (t: string) =>
    `No slides, no theory — we'll work through real ${t} examples together.`,
  (t: string) =>
    `An opinionated tour of the ${t} landscape as of this year, aimed at practitioners.`,
  (t: string) =>
    `You keep hearing about ${t}. Let's separate the substance from the hype.`,
];

const proposalBodies = [
  "We'll start from a minimal working example and build up to the messy parts: error handling, upgrades, and the operational surprises nobody blogs about.",
  "Expect a mix of short demos and discussion. Bring questions from your own setup — the second half is driven by the audience.",
  "This is aimed at people who have read the docs but not yet shipped anything with it. Basic familiarity with the terminal is enough.\n\n**Bring a laptop** if you want to follow along.",
  "We'll compare three real-world setups side by side and talk honestly about the trade-offs:\n\n- what each one optimizes for\n- what it quietly gives up\n- which teams should pick which",
  "Half talk, half open discussion. I'll present our journey for twenty minutes, then we open the floor for war stories and questions.",
];

function pick<T>(rng: () => number, list: readonly T[]): T {
  return list[Math.floor(rng() * list.length)];
}

function normalizeForEmail(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

// Bulk guests use @example.net so generated emails can never collide with the
// curated @example.com / @test.com guests.
export function generateBulkGuests(
  count: number,
  rng: () => number
): GuestConfig[] {
  const combos: [string, string][] = [];
  for (const first of firstNames) {
    for (const last of lastNames) {
      combos.push([first, last]);
    }
  }
  // Fisher-Yates so name parts don't correlate (all "Aiko *" first).
  for (let i = combos.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [combos[i], combos[j]] = [combos[j], combos[i]];
  }
  if (count > combos.length) {
    throw new Error(`Cannot generate ${count} unique bulk guest names`);
  }

  return combos.slice(0, count).map(([first, last]) => {
    const config: GuestConfig = {
      name: `${first} ${last}`,
      email: `${normalizeForEmail(first)}.${normalizeForEmail(last)}@example.net`,
    };

    const pronounRoll = rng();
    if (pronounRoll < 0.3) config.pronouns = "She/Her";
    else if (pronounRoll < 0.55) config.pronouns = "He/Him";
    else if (pronounRoll < 0.65) config.pronouns = "They/Them";

    const [city, country, languages] = pick(rng, cities);
    if (rng() < 0.75) config.basedIn = `${city}, ${country}`;
    if (rng() < 0.7) config.languages = [...languages, "English"];

    if (rng() < 0.7) {
      const role = pick(rng, roles);
      const interest = pick(rng, interests);
      const hobby = pick(rng, hobbies);
      config.aboutMe = pick(rng, [
        `${role} from ${city}. Mostly thinking about ${interest} these days; happy to chat about ${hobby} too.`,
        `${role} based in ${city}. Interested in ${interest} — come say hi if that's your thing.`,
        `${role}. I spend my work hours on ${interest} and my free hours on ${hobby}.`,
        `${role} from ${city}, first time at this event. Curious about ${interest}.`,
      ]);
    }

    if (rng() < 0.45) config.avatar = 1 + Math.floor(rng() * 21);

    if (rng() < 0.4) {
      const [prompt, answer] = pick(rng, promptPool);
      config.prompts = [{ prompt, answer }];
    }

    if (rng() < 0.3) {
      const handle = `${normalizeForEmail(first)}_${normalizeForEmail(last)}`;
      config.contacts = [
        pick(rng, [
          { type: "telegram" as const, value: `@${handle}` },
          { type: "discord" as const, value: handle },
          {
            type: "website" as const,
            value: `https://${handle.replace("_", "")}.example.net`,
          },
        ]),
      ];
    }

    if (hasProfileFields(config)) {
      // Spread edits over the past ~60 days.
      config.profileAgeHours = 2 + Math.floor(rng() * 1440);
    }
    return config;
  });
}

// Titles are unique within one call (one event); different events may repeat
// a title, just like the curated templates do. Durations are assigned by the
// seed script's shared proposal loop, same as for curated templates.
export function generateBulkProposals(
  count: number,
  rng: () => number
): { title: string; description: string }[] {
  const seen = new Set<string>();
  const result: { title: string; description: string }[] = [];
  const maxUnique = proposalTitleTemplates.length * proposalTopics.length;
  if (count > maxUnique) {
    throw new Error(`Cannot generate ${count} unique bulk proposal titles`);
  }
  while (result.length < count) {
    const topic = pick(rng, proposalTopics);
    const title = pick(rng, proposalTitleTemplates)(topic);
    if (seen.has(title)) continue;
    seen.add(title);
    const description =
      rng() < 0.3
        ? pick(rng, proposalIntros)(topic)
        : `${pick(rng, proposalIntros)(topic)}\n\n${pick(rng, proposalBodies)}`;
    result.push({ title, description });
  }
  return result;
}
