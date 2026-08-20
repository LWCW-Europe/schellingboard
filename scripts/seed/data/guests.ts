import type {
  ProfileContact,
  ProfilePrompt,
} from "@/db/repositories/interfaces";

// Shared demo password for seeded guests with account protection enabled
// (issue #370). Not a security boundary — dev/e2e seed data only.
export const SEED_PROTECTED_PASSWORD = "seed-password";

export interface GuestConfig {
  name: string;
  email: string;
  aboutMe?: string;
  pronouns?: string;
  avatar?: number; // index into scripts/seed-assets/avatars/avatar-NN.webp
  basedIn?: string;
  languages?: string[];
  prompts?: ProfilePrompt[];
  contacts?: ProfileContact[];
  // Account protection (issue #370): when set, this guest is seeded with
  // authProtected=true and this password. Left off Alice/Bob/Charlie (index-
  // based fixtures, freely switched by most specs), Yuki/Amara (switched by
  // name in specific specs), and Priya/Ahmad (mutate their own protection
  // state at runtime in tests/e2e/user-auth.spec.ts) so those stay switchable.
  password?: string;
  // How long ago the guest last saved their profile. Curated guests derive
  // this from their list position (see seed-database.ts); bulk guests set it
  // explicitly so 400 of them don't stretch a year into the past.
  profileAgeHours?: number;
}

// Whether the guest has filled in any profile field. Decides both if
// profileUpdatedAt gets stamped (seed-database.ts) and if bulk generation
// assigns a profileAgeHours (bulk.ts) — the two must agree, or bulk guests
// fall back to the curated index-based age formula, which stretches ~10
// months into the past at index 400.
export function hasProfileFields(config: GuestConfig): boolean {
  return [
    config.aboutMe,
    config.pronouns,
    config.avatar,
    config.basedIn,
    config.languages,
    config.prompts,
    config.contacts,
  ].some((field) => field !== undefined);
}

// 40 guests: the 3 e2e fixture guests must stay first (proposal host
// assignment is index-based); 35 have a filled-in profile, 20 of those an
// avatar. Most of those 35 also carry the newer profile fields (based-in,
// languages, contact details, conversation-starter prompts), in varying
// degrees of completeness, so the attendee directory and search have real
// data to show off. 5 stay fully default (no aboutMe/avatar/extended
// fields) as examples of new guests who haven't filled in a profile yet.
export const guestConfigs: GuestConfig[] = [
  {
    name: "Alice Test",
    email: "alice@test.com",
    aboutMe:
      "Frontend developer from Osaka. I love talking about **accessibility** and design systems — find me at the coffee machine.",
    pronouns: "She/Her",
    avatar: 1,
    basedIn: "Osaka, Japan",
    languages: ["Japanese", "English"],
    prompts: [
      {
        prompt: "Ask me about",
        answer: "Accessible design patterns and Japanese web typography",
      },
      {
        prompt: "Offering",
        answer: "Code review swaps and coffee-machine debugging sessions",
      },
    ],
    contacts: [
      { type: "website", value: "https://alice-test.example.com" },
      { type: "telegram", value: "@alice_frontend" },
    ],
  },
  {
    name: "Bob Test",
    email: "bob@test.com",
    aboutMe:
      "Product manager and community organizer from Lagos. I run a local meetup on inclusive product design and I'm always looking for speakers.",
    pronouns: "He/Him",
    avatar: 2,
    basedIn: "Lagos, Nigeria",
    languages: ["English", "Yoruba"],
    prompts: [
      {
        prompt: "Looking for",
        answer: "Speakers for an inclusive product design meetup back home",
      },
      {
        prompt: "Offering",
        answer: "Feedback on your product roadmap over coffee",
      },
    ],
    contacts: [
      { type: "email", value: "bob.organizes@example.com" },
      { type: "whatsapp", value: "+234 801 234 5678" },
    ],
  },
  {
    name: "Charlie Test",
    email: "charlie@test.com",
    aboutMe:
      "Data engineer from Guadalajara. Ask me about stream processing, or better yet, about my sourdough starter.",
    pronouns: "They/Them",
    avatar: 16,
    basedIn: "Guadalajara, Mexico",
    languages: ["Spanish", "English"],
    prompts: [
      {
        prompt: "Ask me about",
        answer: "Stream processing pipelines, or my sourdough starter",
      },
      {
        prompt: "My weirdest skill",
        answer: "Naming Kafka topics that still make sense a year later",
      },
    ],
    contacts: [
      { type: "discord", value: "charlie.streams" },
      { type: "website", value: "https://charlie.dev" },
    ],
  },
  {
    // No bio, but an answered prompt: the one profile shape where the
    // directory card falls back to the prompt for its excerpt.
    name: "Yuki Tanaka",
    email: "yuki.tanaka@example.com",
    pronouns: "He/Him",
    prompts: [{ prompt: "Ask me about", answer: "Retro handheld consoles" }],
  },
  { name: "Amara Okafor", email: "amara.okafor@example.com" },
  {
    name: "Sofía Martínez",
    email: "sofia.martinez@example.com",
    pronouns: "She/Her",
    password: SEED_PROTECTED_PASSWORD,
  },
  {
    name: "Wei Chen",
    email: "wei.chen@example.com",
    aboutMe:
      "Platform engineer focused on developer experience.\n\nPreviously built CI tooling at a fintech startup in Shanghai. Ask me about `pipeline caching`.",
    avatar: 4,
    basedIn: "Shanghai, China",
    languages: ["Mandarin Chinese", "English"],
    prompts: [
      {
        prompt: "Ask me about",
        answer: "Build caching strategies that hold up under real CI load",
      },
    ],
    contacts: [{ type: "telegram", value: "@weichen_dev" }],
    password: SEED_PROTECTED_PASSWORD,
  },
  {
    name: "Priya Sharma",
    email: "priya.sharma@example.com",
    aboutMe:
      "ML researcher from Bengaluru working on **fairness in recommendation systems**.\n\n*First time at this conference* — say hi if you see me wandering around looking lost!",
    pronouns: "She/Her",
    avatar: 17,
    basedIn: "Bengaluru, India",
    languages: ["Hindi", "Kannada", "English"],
    prompts: [
      {
        prompt: "Ask me about",
        answer: "Fairness metrics for recommender systems",
      },
      {
        prompt: "Looking for",
        answer: "A conference buddy — this is my first time here!",
      },
    ],
    contacts: [{ type: "website", value: "https://priyasharma.example.com" }],
  },
  {
    name: "Lars Eriksson",
    email: "lars.eriksson@example.com",
    aboutMe:
      "Backend developer from Gothenburg. In rough order of enthusiasm:\n\n- Rust\n- saunas\n- Kubernetes (reluctantly)",
    pronouns: "He/Him",
    avatar: 6,
    basedIn: "Gothenburg, Sweden",
    languages: ["Swedish", "English"],
    prompts: [
      {
        prompt: "Offering",
        answer: "Strong opinions about Rust, mild opinions about saunas",
      },
    ],
    contacts: [{ type: "signal", value: "lars.eriksson.99" }],
    password: SEED_PROTECTED_PASSWORD,
  },
  {
    name: "Fatima Al-Farsi",
    email: "fatima.alfarsi@example.com",
    aboutMe:
      "Security engineer from Muscat. I break things *professionally* and fix them as a hobby. Happy to chat about threat modeling for small teams.",
    avatar: 7,
    basedIn: "Muscat, Oman",
    languages: ["Arabic", "English"],
    prompts: [
      {
        prompt: "Ask me about",
        answer: "Threat modeling for teams too small to have a security hire",
      },
    ],
    contacts: [{ type: "email", value: "fatima.breaks.things@example.com" }],
    password: SEED_PROTECTED_PASSWORD,
  },
  {
    name: "Kwame Mensah",
    email: "kwame.mensah@example.com",
    aboutMe:
      "Founder of a small agritech company in Accra. Interested in offline-first apps and building for low-bandwidth environments.",
    pronouns: "He/Him",
    avatar: 8,
    basedIn: "Accra, Ghana",
    languages: ["Twi", "English"],
    prompts: [
      {
        prompt: "Offering",
        answer: "War stories about building for 2G networks",
      },
    ],
    contacts: [{ type: "whatsapp", value: "+233 24 555 0187" }],
    password: SEED_PROTECTED_PASSWORD,
  },
  {
    name: "Hiroshi Yamamoto",
    email: "hiroshi.yamamoto@example.com",
    aboutMe:
      "Embedded systems engineer. I make LEDs blink for a living and I'm not ashamed of it.",
    avatar: 9,
    basedIn: "Yokohama, Japan",
    languages: ["Japanese"],
    prompts: [
      {
        prompt: "My weirdest skill",
        answer: "Debugging a blinking LED by ear",
      },
    ],
    password: SEED_PROTECTED_PASSWORD,
  },
  {
    name: "Aisha Diallo",
    email: "aisha.diallo@example.com",
    aboutMe:
      "UX researcher from Dakar, currently based in Berlin. I care deeply about research ethics and multilingual interfaces.",
    pronouns: "She/Her",
    avatar: 10,
    basedIn: "Berlin, Germany",
    languages: ["French", "Wolof", "English", "German"],
    prompts: [
      {
        prompt: "Ask me about",
        answer: "Research ethics for multilingual user studies",
      },
    ],
    contacts: [
      { type: "website", value: "https://aishadiallo.example.com" },
      { type: "other", label: "Mastodon", value: "@aisha@ux.social" },
    ],
    password: SEED_PROTECTED_PASSWORD,
  },
  {
    name: "Diego Fernández",
    email: "diego.fernandez@example.com",
    aboutMe:
      "Site reliability engineer from Buenos Aires. On-call survivor, incident retrospective enthusiast, tango dancer on weekends.",
    avatar: 11,
    basedIn: "Buenos Aires, Argentina",
    languages: ["Spanish", "English"],
    prompts: [
      {
        prompt: "Offering",
        answer:
          "A rundown of the worst incident I ever caused, for entertainment purposes",
      },
    ],
    contacts: [{ type: "telegram", value: "@diego_sre" }],
    password: SEED_PROTECTED_PASSWORD,
  },
  {
    name: "Mei-Ling Wu",
    email: "meiling.wu@example.com",
    aboutMe:
      "Technical writer from Taipei. I turn engineering mumbling into documentation people actually read.",
    pronouns: "She/Her",
    avatar: 12,
    basedIn: "Taipei, Taiwan",
    languages: ["Mandarin Chinese", "English"],
    prompts: [
      {
        prompt: "Ask me about",
        answer: "Turning a wall of Slack threads into docs people read",
      },
    ],
    password: SEED_PROTECTED_PASSWORD,
  },
  {
    name: "Olga Petrova",
    email: "olga.petrova@example.com",
    aboutMe:
      "Database internals nerd. If your query is slow I want to hear about it in excruciating detail.",
    avatar: 13,
    basedIn: "Novosibirsk, Russia",
    languages: ["Russian", "English"],
    prompts: [
      {
        prompt: "Offering",
        answer:
          "A very detailed opinion about your slow query, whether you want it or not",
      },
    ],
    contacts: [{ type: "email", value: "olga.petrova.db@example.com" }],
    password: SEED_PROTECTED_PASSWORD,
  },
  {
    name: "Jean-Pierre Dubois",
    email: "jeanpierre.dubois@example.com",
    aboutMe:
      "Engineering manager from Lyon. Interested in sustainable pace, team topologies, and where to find decent cheese near the venue.",
    pronouns: "He/Him",
    avatar: 14,
    basedIn: "Lyon, France",
    languages: ["French", "English"],
    prompts: [
      {
        prompt: "Looking for",
        answer: "Cheese recommendations near the venue",
      },
    ],
    contacts: [{ type: "whatsapp", value: "+33 6 12 34 56 78" }],
  },
  {
    name: "Thabo Ndlovu",
    email: "thabo.ndlovu@example.com",
    aboutMe:
      "Full-stack developer from Johannesburg working in civic tech. Building tools that help people navigate public services.",
    avatar: 15,
    basedIn: "Johannesburg, South Africa",
    languages: ["Zulu", "English"],
    prompts: [
      {
        prompt: "Ask me about",
        answer:
          "Building civic tech that survives contact with real government data",
      },
    ],
  },
  {
    name: "Anna Kowalska",
    email: "anna.kowalska@example.com",
    aboutMe:
      "QA engineer from Kraków. I find the bugs you swore were impossible.\n\nAlso: board game collector, **200+ and counting**.",
    pronouns: "She/Her",
    avatar: 3,
    basedIn: "Kraków, Poland",
    languages: ["Polish", "English"],
    prompts: [
      {
        prompt: "Offering",
        answer:
          "Trades: I'll find your worst bug for a board game recommendation",
      },
    ],
    contacts: [{ type: "discord", value: "anna.qa" }],
  },
  {
    name: "Mohammed El-Sayed",
    email: "mohammed.elsayed@example.com",
    aboutMe:
      "Cloud architect from Cairo. Recovering microservices maximalist — ask me about the monolith we happily went back to.",
    avatar: 5,
    basedIn: "Cairo, Egypt",
    languages: ["Arabic", "English"],
    prompts: [
      {
        prompt: "A hill I will die on",
        answer: "Boring architecture beats clever architecture, every time",
      },
    ],
  },
  {
    name: "Isabella Rossi",
    email: "isabella.rossi@example.com",
    aboutMe:
      "Design lead from Milan. I bridge the gap between Figma and production, one design token at a time.",
    pronouns: "She/Her",
    avatar: 18,
    basedIn: "Milan, Italy",
    languages: ["English", "French"],
    prompts: [
      {
        prompt: "Ask me about",
        answer: "Getting design tokens to survive contact with production",
      },
    ],
    contacts: [{ type: "website", value: "https://isabellarossi.example.com" }],
  },
  {
    name: "Min-jun Kim",
    email: "minjun.kim@example.com",
    aboutMe:
      "Game developer from Seoul, moonlighting in web tech. Fascinated by real-time collaboration and CRDTs.",
    pronouns: "They/Them",
    avatar: 19,
    basedIn: "Seoul, South Korea",
    languages: ["Korean", "English"],
    prompts: [
      {
        prompt: "Currently obsessed with",
        answer:
          "CRDTs, and why conflict-free replication is harder than it sounds",
      },
    ],
    contacts: [{ type: "discord", value: "minjunkim" }],
  },
  {
    name: "Carlos Silva",
    email: "carlos.silva@example.com",
    aboutMe:
      "DevOps engineer from Porto. I automate myself out of a job roughly once a year and somehow still have one.",
    avatar: 20,
    basedIn: "Porto, Portugal",
    languages: ["Portuguese", "English"],
    prompts: [
      {
        prompt: "Offering",
        answer: "A talk about automating yourself out of a job, repeatedly",
      },
    ],
  },
  {
    name: "Nadia Haddad",
    email: "nadia.haddad@example.com",
    aboutMe:
      "Mobile developer from Beirut. Flutter by day, native by necessity. Organizer of a local women-in-tech mentoring circle.",
    pronouns: "She/Her",
    basedIn: "Beirut, Lebanon",
    languages: ["Arabic", "French", "English"],
    prompts: [
      {
        prompt: "Looking for",
        answer: "Mentors and mentees for a women-in-tech circle back home",
      },
    ],
    contacts: [{ type: "other", label: "Instagram", value: "@nadia.builds" }],
  },
  {
    name: "Freya Nielsen",
    email: "freya.nielsen@example.com",
    aboutMe:
      "Accessibility consultant from Copenhagen. Screen reader power user. I will happily audit your conference talk slides.",
    basedIn: "Copenhagen, Denmark",
    languages: ["Danish", "English"],
    prompts: [
      {
        prompt: "Offering",
        answer: "A free accessibility pass on your slides — bring your laptop",
      },
    ],
    contacts: [{ type: "email", value: "freya.a11y@example.com" }],
  },
  {
    name: "Arjun Nair",
    email: "arjun.nair@example.com",
    aboutMe:
      "Distributed systems engineer from Kochi. Currently obsessed with consensus protocols and filter coffee, in that order.",
    pronouns: "He/Him",
    basedIn: "Kochi, India",
    languages: ["Malayalam", "English"],
    prompts: [
      {
        prompt: "Currently obsessed with",
        answer: "Consensus protocols, and where filter coffee ranks among them",
      },
    ],
  },
  {
    name: "Elif Yılmaz",
    email: "elif.yilmaz@example.com",
    aboutMe:
      "Computer science student from Istanbul, here on a scholarship ticket. Excited about everything, please recommend me sessions!",
    basedIn: "Istanbul, Turkey",
    languages: ["Turkish", "English"],
    prompts: [
      {
        prompt: "Looking for",
        answer:
          "Session recommendations — I'm new here and excited about everything",
      },
    ],
  },
  {
    name: "Samuel Adeyemi",
    email: "samuel.adeyemi@example.com",
    aboutMe:
      "Backend engineer from Ibadan working on payment infrastructure across West Africa.",
    basedIn: "Ibadan, Nigeria",
    languages: ["Yoruba", "English"],
  },
  {
    name: "Linh Nguyen",
    email: "linh.nguyen@example.com",
    aboutMe:
      "Freelance web developer from Ho Chi Minh City. Jamstack fan, static site generator connoisseur, occasional conference speaker.",
    pronouns: "They/Them",
    basedIn: "Ho Chi Minh City, Vietnam",
    languages: ["Vietnamese", "English"],
    prompts: [
      {
        prompt: "Offering",
        answer:
          "Static site generator recommendations, unsolicited and opinionated",
      },
    ],
    contacts: [{ type: "telegram", value: "@linh_jamstack" }],
  },
  {
    name: "Marta Horvat",
    email: "marta.horvat@example.com",
    aboutMe:
      "Agile coach from Zagreb. Yes, we can talk about whether estimates are worth it. No, we won't agree.",
    basedIn: "Zagreb, Croatia",
    languages: ["Croatian", "English"],
    prompts: [
      {
        prompt: "A hill I will die on",
        answer: "Estimates are a communication tool, not a promise",
      },
    ],
  },
  {
    name: "Dmitri Volkov",
    email: "dmitri.volkov@example.com",
    aboutMe:
      "Compiler engineer. I read language specs for fun and I'm told this is concerning.",
    prompts: [
      {
        prompt: "My weirdest skill",
        answer: "Reading language specs for fun, apparently",
      },
    ],
  },
  {
    name: "Chiara Bianchi",
    email: "chiara.bianchi@example.com",
    aboutMe:
      "Data scientist from Bologna working in public health. Interested in reproducible research and open data.",
    pronouns: "She/Her",
    basedIn: "Bologna, Italy",
    prompts: [
      {
        prompt: "Ask me about",
        answer:
          "Making public health research reproducible without a data team",
      },
    ],
    contacts: [{ type: "website", value: "https://chiarabianchi.example.com" }],
  },
  {
    name: "Zanele Khumalo",
    email: "zanele.khumalo@example.com",
    aboutMe:
      "Frontend developer from Durban. CSS is my love language. Currently deep-diving into container queries.",
    basedIn: "Durban, South Africa",
    languages: ["Zulu", "English"],
    prompts: [
      { prompt: "Offering", answer: "Container query wizardry, upon request" },
    ],
  },
  {
    name: "Rafael Souza",
    email: "rafael.souza@example.com",
    aboutMe:
      "Engineering lead from São Paulo. I care about:\n\n1. Mentoring junior devs\n2. Building teams where questions are welcome\n3. Coffee, not necessarily in that order",
    basedIn: "São Paulo, Brazil",
    languages: ["Portuguese", "English"],
    prompts: [
      {
        prompt: "Offering",
        answer: "Mentoring conversations for junior devs finding their footing",
      },
    ],
    contacts: [{ type: "website", value: "https://rafaelsouza.example.com" }],
  },
  {
    name: "Hana Kobayashi",
    email: "hana.kobayashi@example.com",
    aboutMe:
      "# Hi, I'm Hana!\n\nDeveloper advocate based in Kyoto. I write tutorials, give talks, and collect conference stickers *competitively*.",
    pronouns: "She/Her",
    avatar: 21,
    basedIn: "Kyoto, Japan",
    languages: ["Japanese", "English"],
    prompts: [
      { prompt: "I collect", answer: "Conference stickers, competitively" },
    ],
    contacts: [
      { type: "website", value: "https://hanakobayashi.example.com" },
      { type: "other", label: "Bluesky", value: "@hanak.dev" },
    ],
  },
  {
    name: "Tereza Nováková",
    email: "tereza.novakova@example.com",
    aboutMe:
      "Open source maintainer from Prague — see [my projects](https://github.example.com/tereza). Ask me about sustainable maintainership, or just send `git help`, either works.",
    basedIn: "Prague, Czechia",
    languages: ["Czech", "English"],
    prompts: [
      {
        prompt: "Ask me about",
        answer:
          "Sustainable maintainership for projects that outlive their funding",
      },
    ],
    contacts: [{ type: "website", value: "https://github.example.com/tereza" }],
  },
  {
    name: "Ahmad Karimi",
    email: "ahmad.karimi@example.com",
    aboutMe:
      "Software engineer from Tehran, now in Amsterdam. Working on developer tooling and learning Dutch, slowly.",
    pronouns: "He/Him",
    basedIn: "Amsterdam, Netherlands",
    languages: ["Persian", "Dutch", "English"],
    prompts: [
      {
        prompt: "Currently obsessed with",
        answer: "Developer tooling, and slowly learning Dutch",
      },
    ],
  },
  {
    name: "Maria Papadopoulou",
    email: "maria.papadopoulou@example.com",
    aboutMe:
      "Tech lead from Thessaloniki. Legacy code whisperer. Strong opinions on testing, loosely held on everything else.",
    basedIn: "Thessaloniki, Greece",
    languages: ["Greek", "English"],
    prompts: [
      {
        prompt: "Offering",
        answer: "Loosely held opinions on everything except testing",
      },
    ],
  },
  { name: "Mateo Quispe", email: "mateo.quispe@example.com" },
  {
    name: "Leilani Kahale",
    email: "leilani.kahale@example.com",
    pronouns: "She/They",
  },
];
