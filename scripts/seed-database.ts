import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import fs from "fs";
import { nanoid } from "nanoid";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { DateTime } from "luxon";
import * as schema from "@/db/schema";
import { resolveDbPath, runMigrations } from "@/db/migrate";
import { eventNameToSlug } from "@/utils/utils";
import { VoteChoice } from "@/db/repositories/interfaces";

const TZ = "Europe/Berlin";

// Returns a UTC Date representing the given clock time on a specific day in Berlin.
// dayOffset is added to baseDate's Berlin calendar date before setting the time.
function berlinTime(
  baseDate: Date,
  dayOffset: number,
  hour: number,
  minute = 0
): Date {
  return DateTime.fromJSDate(baseDate)
    .setZone(TZ)
    .plus({ days: dayOffset })
    .set({ hour, minute, second: 0, millisecond: 0 })
    .toJSDate();
}

const mode = process.env.NODE_ENV ?? "dev";
const envFileLocal = path.resolve(process.cwd(), `.env.${mode}.local`);
const envFileShared = path.resolve(process.cwd(), `.env.${mode}`);
const envFile = fs.existsSync(envFileLocal)
  ? envFileLocal
  : fs.existsSync(envFileShared)
    ? envFileShared
    : null;
if (envFile) dotenv.config({ path: envFile });

if (process.env.NODE_ENV === "production") {
  throw new Error("🚨 SAFETY: Cannot reset production database!");
}

function openDb() {
  const sqlite = new Database(resolveDbPath());
  // Enforce foreign keys on every connection; runMigrations toggles it off and
  // back on internally.
  sqlite.pragma("foreign_keys = ON");
  const migrationsFolder = path.join(
    path.dirname(fileURLToPath(import.meta.url)),
    "../drizzle"
  );
  runMigrations(sqlite, migrationsFolder);
  return drizzle(sqlite, { schema });
}

let _seedForRandom = 42;
function seededRandom() {
  const x = Math.sin(_seedForRandom++) * 10000;
  return x - Math.floor(x);
}

function generateEventDates() {
  const today = new Date();
  const phaseDuration = 14;
  const middleOffset = 7;
  // Lead time between the start of scheduling work and the event itself.
  // The scheduling phase stays open through the whole live event, so
  // schedulingPhaseEnd always equals the event's end date.
  const schedulingLeadTime = 21;

  // Event 1: Currently in proposal phase
  const e1PropStart = new Date(today);
  e1PropStart.setDate(today.getDate() - middleOffset);
  const e1PropEnd = new Date(e1PropStart);
  e1PropEnd.setDate(e1PropStart.getDate() + phaseDuration);
  const e1VoteStart = new Date(e1PropEnd);
  const e1VoteEnd = new Date(e1VoteStart);
  e1VoteEnd.setDate(e1VoteStart.getDate() + phaseDuration);
  const e1SchedStart = new Date(e1VoteEnd);
  // Align the event with the seeded Day windows (09:00–18:00 Berlin) so the
  // exclusive schedulingPhaseEnd doesn't cut off the last day early.
  const e1Start = berlinTime(e1SchedStart, schedulingLeadTime, 9, 0);
  const e1End = berlinTime(e1Start, 2, 18, 0);
  const e1SchedEnd = new Date(e1End);

  // Event 2: Currently in voting phase
  const e2VoteStart = new Date(today);
  e2VoteStart.setDate(today.getDate() - middleOffset);
  const e2VoteEnd = new Date(e2VoteStart);
  e2VoteEnd.setDate(e2VoteStart.getDate() + phaseDuration);
  const e2PropStart = new Date(e2VoteStart);
  e2PropStart.setDate(e2VoteStart.getDate() - phaseDuration);
  const e2PropEnd = new Date(e2VoteStart);
  const e2SchedStart = new Date(e2VoteEnd);
  const e2Start = berlinTime(e2SchedStart, schedulingLeadTime, 9, 0);
  const e2End = berlinTime(e2Start, 2, 18, 0);
  const e2SchedEnd = new Date(e2End);

  // Event 3: Currently in scheduling phase
  const e3SchedStart = new Date(today);
  e3SchedStart.setDate(today.getDate() - middleOffset);
  const e3VoteStart = new Date(e3SchedStart);
  e3VoteStart.setDate(e3SchedStart.getDate() - phaseDuration);
  const e3VoteEnd = new Date(e3SchedStart);
  const e3PropStart = new Date(e3VoteStart);
  e3PropStart.setDate(e3VoteStart.getDate() - phaseDuration);
  const e3PropEnd = new Date(e3VoteStart);
  const e3Start = berlinTime(e3SchedStart, schedulingLeadTime, 9, 0);
  const e3End = berlinTime(e3Start, 2, 18, 0);
  const e3SchedEnd = new Date(e3End);

  return [
    {
      name: "Conference Alpha",
      description: "Event currently in proposal phase",
      icon: "AcademicCapIcon",
      start: e1Start,
      end: e1End,
      proposalPhaseStart: e1PropStart,
      proposalPhaseEnd: e1PropEnd,
      votingPhaseStart: e1VoteStart,
      votingPhaseEnd: e1VoteEnd,
      schedulingPhaseStart: e1SchedStart,
      schedulingPhaseEnd: e1SchedEnd,
    },
    {
      name: "Conference Beta",
      description: "Event currently in voting phase",
      icon: "BeakerIcon",
      start: e2Start,
      end: e2End,
      proposalPhaseStart: e2PropStart,
      proposalPhaseEnd: e2PropEnd,
      votingPhaseStart: e2VoteStart,
      votingPhaseEnd: e2VoteEnd,
      schedulingPhaseStart: e2SchedStart,
      schedulingPhaseEnd: e2SchedEnd,
    },
    {
      name: "Conference Gamma",
      description: "Event currently in scheduling phase",
      icon: "GlobeAltIcon",
      start: e3Start,
      end: e3End,
      proposalPhaseStart: e3PropStart,
      proposalPhaseEnd: e3PropEnd,
      votingPhaseStart: e3VoteStart,
      votingPhaseEnd: e3VoteEnd,
      schedulingPhaseStart: e3SchedStart,
      schedulingPhaseEnd: e3SchedEnd,
    },
  ];
}

// Committed CC0 avatar images (see scripts/seed-assets/avatars/README.md);
// copied into SB_UPLOADS_DIR at seed time like real uploads.
const seedAvatarsDir = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "seed-assets/avatars"
);

function uploadedAvatarsDir(): string {
  return path.join(process.env.SB_UPLOADS_DIR ?? "./uploads", "avatars");
}

interface GuestConfig {
  name: string;
  email: string;
  aboutMe?: string;
  pronouns?: string;
  avatar?: number; // index into scripts/seed-assets/avatars/avatar-NN.webp
}

// 40 guests: the 3 e2e fixture guests must stay first (proposal host
// assignment is index-based); 35 have a filled-in profile, 20 of those an
// avatar, 5 stay default (no aboutMe/avatar) as examples of new guests.
const guestConfigs: GuestConfig[] = [
  {
    name: "Alice Test",
    email: "alice@test.com",
    aboutMe:
      "Frontend developer from Osaka. I love talking about accessibility and design systems — find me at the coffee machine.",
    pronouns: "She/Her",
    avatar: 1,
  },
  {
    name: "Bob Test",
    email: "bob@test.com",
    aboutMe:
      "Product manager and community organizer from Lagos. I run a local meetup on inclusive product design and I'm always looking for speakers.",
    pronouns: "He/Him",
    avatar: 2,
  },
  {
    name: "Charlie Test",
    email: "charlie@test.com",
    aboutMe:
      "Data engineer from Guadalajara. Ask me about stream processing, or better yet, about my sourdough starter.",
    pronouns: "They/Them",
    avatar: 16,
  },
  {
    name: "Yuki Tanaka",
    email: "yuki.tanaka@example.com",
    pronouns: "He/Him",
  },
  { name: "Amara Okafor", email: "amara.okafor@example.com" },
  {
    name: "Sofía Martínez",
    email: "sofia.martinez@example.com",
    pronouns: "She/Her",
  },
  {
    name: "Wei Chen",
    email: "wei.chen@example.com",
    aboutMe:
      "Platform engineer focused on developer experience. Previously built CI tooling at a fintech startup in Shanghai.",
    avatar: 4,
  },
  {
    name: "Priya Sharma",
    email: "priya.sharma@example.com",
    aboutMe:
      "ML researcher from Bengaluru working on fairness in recommendation systems.\n\nFirst time at this conference — say hi if you see me wandering around looking lost!",
    pronouns: "She/Her",
    avatar: 17,
  },
  {
    name: "Lars Eriksson",
    email: "lars.eriksson@example.com",
    aboutMe:
      "Backend developer from Gothenburg. Rust enthusiast, reluctant Kubernetes operator, enthusiastic sauna advocate.",
    pronouns: "He/Him",
    avatar: 6,
  },
  {
    name: "Fatima Al-Farsi",
    email: "fatima.alfarsi@example.com",
    aboutMe:
      "Security engineer from Muscat. I break things professionally and fix them as a hobby. Happy to chat about threat modeling for small teams.",
    avatar: 7,
  },
  {
    name: "Kwame Mensah",
    email: "kwame.mensah@example.com",
    aboutMe:
      "Founder of a small agritech company in Accra. Interested in offline-first apps and building for low-bandwidth environments.",
    pronouns: "He/Him",
    avatar: 8,
  },
  {
    name: "Hiroshi Yamamoto",
    email: "hiroshi.yamamoto@example.com",
    aboutMe:
      "Embedded systems engineer. I make LEDs blink for a living and I'm not ashamed of it.",
    avatar: 9,
  },
  {
    name: "Aisha Diallo",
    email: "aisha.diallo@example.com",
    aboutMe:
      "UX researcher from Dakar, currently based in Berlin. I care deeply about research ethics and multilingual interfaces.",
    pronouns: "She/Her",
    avatar: 10,
  },
  {
    name: "Diego Fernández",
    email: "diego.fernandez@example.com",
    aboutMe:
      "Site reliability engineer from Buenos Aires. On-call survivor, incident retrospective enthusiast, tango dancer on weekends.",
    avatar: 11,
  },
  {
    name: "Mei-Ling Wu",
    email: "meiling.wu@example.com",
    aboutMe:
      "Technical writer from Taipei. I turn engineering mumbling into documentation people actually read.",
    pronouns: "She/Her",
    avatar: 12,
  },
  {
    name: "Olga Petrova",
    email: "olga.petrova@example.com",
    aboutMe:
      "Database internals nerd. If your query is slow I want to hear about it in excruciating detail.",
    avatar: 13,
  },
  {
    name: "Jean-Pierre Dubois",
    email: "jeanpierre.dubois@example.com",
    aboutMe:
      "Engineering manager from Lyon. Interested in sustainable pace, team topologies, and where to find decent cheese near the venue.",
    pronouns: "He/Him",
    avatar: 14,
  },
  {
    name: "Thabo Ndlovu",
    email: "thabo.ndlovu@example.com",
    aboutMe:
      "Full-stack developer from Johannesburg working in civic tech. Building tools that help people navigate public services.",
    avatar: 15,
  },
  {
    name: "Anna Kowalska",
    email: "anna.kowalska@example.com",
    aboutMe:
      "QA engineer from Kraków. I find the bugs you swore were impossible. Also: board game collector, 200+ and counting.",
    pronouns: "She/Her",
    avatar: 3,
  },
  {
    name: "Mohammed El-Sayed",
    email: "mohammed.elsayed@example.com",
    aboutMe:
      "Cloud architect from Cairo. Recovering microservices maximalist — ask me about the monolith we happily went back to.",
    avatar: 5,
  },
  {
    name: "Isabella Rossi",
    email: "isabella.rossi@example.com",
    aboutMe:
      "Design lead from Milan. I bridge the gap between Figma and production, one design token at a time.",
    pronouns: "She/Her",
    avatar: 18,
  },
  {
    name: "Min-jun Kim",
    email: "minjun.kim@example.com",
    aboutMe:
      "Game developer from Seoul, moonlighting in web tech. Fascinated by real-time collaboration and CRDTs.",
    pronouns: "They/Them",
    avatar: 19,
  },
  {
    name: "Carlos Silva",
    email: "carlos.silva@example.com",
    aboutMe:
      "DevOps engineer from Porto. I automate myself out of a job roughly once a year and somehow still have one.",
    avatar: 20,
  },
  {
    name: "Nadia Haddad",
    email: "nadia.haddad@example.com",
    aboutMe:
      "Mobile developer from Beirut. Flutter by day, native by necessity. Organizer of a local women-in-tech mentoring circle.",
    pronouns: "She/Her",
  },
  {
    name: "Freya Nielsen",
    email: "freya.nielsen@example.com",
    aboutMe:
      "Accessibility consultant from Copenhagen. Screen reader power user. I will happily audit your conference talk slides.",
  },
  {
    name: "Arjun Nair",
    email: "arjun.nair@example.com",
    aboutMe:
      "Distributed systems engineer from Kochi. Currently obsessed with consensus protocols and filter coffee, in that order.",
    pronouns: "He/Him",
  },
  {
    name: "Elif Yılmaz",
    email: "elif.yilmaz@example.com",
    aboutMe:
      "Computer science student from Istanbul, here on a scholarship ticket. Excited about everything, please recommend me sessions!",
  },
  {
    name: "Samuel Adeyemi",
    email: "samuel.adeyemi@example.com",
    aboutMe:
      "Backend engineer from Ibadan working on payment infrastructure across West Africa.",
  },
  {
    name: "Linh Nguyen",
    email: "linh.nguyen@example.com",
    aboutMe:
      "Freelance web developer from Ho Chi Minh City. Jamstack fan, static site generator connoisseur, occasional conference speaker.",
    pronouns: "They/Them",
  },
  {
    name: "Marta Horvat",
    email: "marta.horvat@example.com",
    aboutMe:
      "Agile coach from Zagreb. Yes, we can talk about whether estimates are worth it. No, we won't agree.",
  },
  {
    name: "Dmitri Volkov",
    email: "dmitri.volkov@example.com",
    aboutMe:
      "Compiler engineer. I read language specs for fun and I'm told this is concerning.",
  },
  {
    name: "Chiara Bianchi",
    email: "chiara.bianchi@example.com",
    aboutMe:
      "Data scientist from Bologna working in public health. Interested in reproducible research and open data.",
    pronouns: "She/Her",
  },
  {
    name: "Zanele Khumalo",
    email: "zanele.khumalo@example.com",
    aboutMe:
      "Frontend developer from Durban. CSS is my love language. Currently deep-diving into container queries.",
  },
  {
    name: "Rafael Souza",
    email: "rafael.souza@example.com",
    aboutMe:
      "Engineering lead from São Paulo. I care about mentoring junior devs and building teams where questions are welcome.",
  },
  {
    name: "Hana Kobayashi",
    email: "hana.kobayashi@example.com",
    aboutMe:
      "Developer advocate based in Kyoto. I write tutorials, give talks, and collect conference stickers competitively.",
    pronouns: "She/Her",
  },
  {
    name: "Tereza Nováková",
    email: "tereza.novakova@example.com",
    aboutMe:
      "Open source maintainer from Prague. Ask me about sustainable maintainership — or just send help, either works.",
  },
  {
    name: "Ahmad Karimi",
    email: "ahmad.karimi@example.com",
    aboutMe:
      "Software engineer from Tehran, now in Amsterdam. Working on developer tooling and learning Dutch, slowly.",
    pronouns: "He/Him",
  },
  {
    name: "Maria Papadopoulou",
    email: "maria.papadopoulou@example.com",
    aboutMe:
      "Tech lead from Thessaloniki. Legacy code whisperer. Strong opinions on testing, loosely held on everything else.",
  },
  { name: "Mateo Quispe", email: "mateo.quispe@example.com" },
  {
    name: "Leilani Kahale",
    email: "leilani.kahale@example.com",
    pronouns: "She/They",
  },
];

const sessionTemplates = [
  {
    title: "Building Scalable Web Applications with Modern React",
    description:
      "Dive deep into the latest React patterns and best practices for building scalable applications. We'll cover state management, performance optimization, and modern tooling.",
  },
  {
    title: "The Future of AI: Transforming Industries Through Machine Learning",
    description:
      "Artificial Intelligence is reshaping every industry from healthcare to finance. In this comprehensive session, we'll explore the current state of AI technology, emerging trends, and practical applications that are driving innovation.\n\nWe'll discuss real-world case studies, ethical considerations, and the skills needed to thrive in an AI-driven world. Whether you're a beginner or experienced professional, you'll gain valuable insights into how AI can transform your work and industry.\n\nTopics covered include natural language processing, computer vision, predictive analytics, and the intersection of AI with other emerging technologies like blockchain and IoT.",
  },
  {
    title: "Workshop: Hands-on Docker and Kubernetes",
    description:
      "A practical workshop on containerization and orchestration. Bring your laptop and get ready to deploy!",
  },
  {
    title: "Design Systems: Creating Consistency at Scale",
    description:
      "Learn how to build and maintain design systems that scale across teams and products.",
  },
  {
    title:
      "Cybersecurity in the Age of Remote Work: Protecting Your Digital Assets",
    description:
      "The shift to remote work has fundamentally changed the cybersecurity landscape. Traditional perimeter-based security models are no longer sufficient when employees access company resources from home networks, coffee shops, and co-working spaces.\n\nThis session will provide a comprehensive overview of modern cybersecurity challenges and solutions. We'll explore zero-trust architecture, endpoint protection strategies, and the human element of cybersecurity. Attendees will learn practical techniques for securing remote work environments, implementing multi-factor authentication, and creating security awareness programs.\n\nWe'll also discuss emerging threats like sophisticated phishing attacks, ransomware targeting remote workers, and supply chain vulnerabilities. Real-world examples and case studies will illustrate both successful security implementations and costly breaches, providing actionable insights for organizations of all sizes.",
  },
  {
    title: "Microservices Architecture: Lessons from the Trenches",
    description:
      "Real-world experiences with microservices: what works, what doesn't, and when to avoid them entirely.",
  },
  {
    title: "Sustainable Software Development: Green Coding Practices",
    description:
      "How to reduce the environmental impact of your code through efficient algorithms and sustainable practices.",
  },
  {
    title: "Building Inclusive Tech Teams: Beyond Diversity Hiring",
    description:
      "Creating truly inclusive environments requires more than diverse hiring. This session explores psychological safety, inclusive leadership, and systemic changes needed for equity in tech.\n\nWe'll examine unconscious bias in technical interviews, the importance of sponsorship vs mentorship, and how to build cultures where everyone can thrive. Participants will leave with concrete strategies for fostering inclusion at every level of their organization.",
  },
  {
    title: "API Design: RESTful vs GraphQL vs gRPC",
    description:
      "A comparative analysis of different API paradigms with practical examples and use cases.",
  },
  {
    title:
      "The Psychology of User Experience: Understanding Human-Computer Interaction",
    description:
      "User experience design is fundamentally about understanding human psychology and behavior. This session delves into cognitive psychology principles that drive effective UX design, including mental models, cognitive load theory, and decision-making processes.\n\nWe'll explore how users actually interact with digital interfaces, common usability heuristics, and the science behind user research methods. Through interactive exercises and real-world examples, attendees will learn to apply psychological principles to create more intuitive and engaging user experiences.\n\nTopics include attention and perception, memory limitations, emotional design, accessibility considerations, and cross-cultural UX patterns. Perfect for designers, developers, and product managers looking to create more human-centered digital products.",
  },
  {
    title: "Blockchain Beyond Cryptocurrency: Practical Applications",
    description:
      "Exploring real-world blockchain applications in supply chain, healthcare, and digital identity.",
  },
  {
    title: "Performance Optimization: Making Your Apps Lightning Fast",
    description:
      "Techniques for optimizing web and mobile applications for speed and efficiency.",
  },
  {
    title: "Open Source Sustainability: Funding and Community Building",
    description:
      "The open source ecosystem faces sustainability challenges as projects grow in complexity and importance. This session examines successful funding models, from corporate sponsorship to foundation grants to innovative approaches like GitHub Sponsors.\n\nWe'll discuss community building strategies, maintainer burnout prevention, and the economic realities of supporting critical infrastructure projects. Case studies will include successful projects that have achieved sustainable funding and community growth.",
  },
  {
    title: "DevOps Culture: Breaking Down Silos",
    description:
      "How to foster collaboration between development and operations teams for better software delivery.",
  },
  {
    title: "Machine Learning Ethics: Bias, Fairness, and Accountability",
    description:
      "As machine learning systems become more prevalent in decision-making processes, ethical considerations become paramount. This session explores algorithmic bias, fairness metrics, and accountability frameworks.\n\nWe'll examine real-world cases where ML systems have perpetuated or amplified societal biases, and discuss practical approaches for building more equitable AI systems. Topics include data bias, model interpretability, fairness-aware machine learning, and the legal and regulatory landscape surrounding AI ethics.",
  },
];

// Conference Gamma (scheduling phase) gets a realistic, mostly filled grid:
// most sessions are scheduled from its seeded proposals (matched by title),
// plus organizer/attendee extras. Times are Berlin clock times on event day
// 0-2. Keep the slots that tests/e2e/scheduling.spec.ts relies on free:
//   day 0: Main Hall 16:00 and Garden Terrace 09:00 (asserted free),
//   day 2: Workshop Room from 15:00 and Garden Terrace from 16:00
//          (used by tests to create sessions).
// rsvp.spec.ts RSVPs Bob Test to the Opening Keynote, so nothing may run in
// parallel to it and Bob gets no seeded RSVP there (see RSVP seeding).
interface GammaSessionConfig {
  title: string; // for fromProposal sessions: must equal a seeded Gamma proposal title
  fromProposal: boolean;
  description?: string; // only used when fromProposal is false
  day: number; // event day 0-2
  start: [hour: number, minute: number];
  end: [hour: number, minute: number];
  location: number; // index into locationRows: 0 Main Hall, 1 Workshop Room, 2 Garden Terrace
  hostNames: string[];
  capacity: number;
  closed?: boolean;
  adminManaged?: boolean; // default false (host-scheduled during the phase)
}

const gammaSessionConfigs: GammaSessionConfig[] = [
  // Day 1
  {
    title: "The Future of AI: Transforming Industries Through Machine Learning",
    fromProposal: true,
    day: 0,
    start: [11, 0],
    end: [12, 0],
    location: 0,
    hostNames: ["Yuki Tanaka"],
    capacity: 100,
  },
  {
    title: "Workshop: Hands-on Docker and Kubernetes",
    fromProposal: true,
    day: 0,
    start: [11, 0],
    end: [12, 30],
    location: 1,
    hostNames: ["Sofía Martínez"],
    capacity: 30,
    closed: true, // hands-on workshop, no late arrivals
  },
  {
    title: "Design Systems: Creating Consistency at Scale",
    fromProposal: true,
    day: 0,
    start: [14, 0],
    end: [15, 0],
    location: 0,
    hostNames: ["Isabella Rossi"],
    capacity: 100,
  },
  {
    title: "Open Source Sustainability: Funding and Community Building",
    fromProposal: true,
    day: 0,
    start: [14, 0],
    end: [15, 30],
    location: 2,
    hostNames: ["Tereza Nováková"],
    capacity: 25,
  },
  {
    title: "API Design: RESTful vs GraphQL vs gRPC",
    fromProposal: true,
    day: 0,
    start: [15, 30],
    end: [16, 30],
    location: 1,
    hostNames: ["Arjun Nair"],
    capacity: 30,
  },
  // Day 2
  {
    title: "Building Scalable Web Applications with Modern React",
    fromProposal: true,
    day: 1,
    start: [9, 0],
    end: [10, 0],
    location: 0,
    hostNames: ["Charlie Test"],
    capacity: 100,
  },
  {
    title:
      "The Psychology of User Experience: Understanding Human-Computer Interaction",
    fromProposal: true,
    day: 1,
    start: [10, 0],
    end: [11, 30],
    location: 2,
    hostNames: ["Aisha Diallo"],
    capacity: 25,
  },
  {
    title: "Performance Optimization: Making Your Apps Lightning Fast",
    fromProposal: true,
    day: 1,
    start: [10, 30],
    end: [12, 0],
    location: 1,
    hostNames: ["Olga Petrova"],
    capacity: 30,
  },
  {
    title: "Machine Learning Ethics: Bias, Fairness, and Accountability",
    fromProposal: true,
    day: 1,
    start: [14, 0],
    end: [15, 0],
    location: 0,
    hostNames: ["Priya Sharma"],
    capacity: 100,
  },
  {
    title: "Sustainable Software Development: Green Coding Practices",
    fromProposal: true,
    day: 1,
    start: [14, 0],
    end: [15, 0],
    location: 2,
    hostNames: ["Carlos Silva"],
    capacity: 25,
  },
  {
    title: "Building Inclusive Tech Teams: Beyond Diversity Hiring",
    fromProposal: true,
    day: 1,
    start: [16, 0],
    end: [17, 0],
    location: 0,
    hostNames: ["Bob Test", "Rafael Souza"],
    capacity: 100,
  },
  {
    title: "Hallway Track: CRDT Show & Tell",
    fromProposal: false,
    description:
      "Impromptu session: I'll demo a small real-time collaborative editor built on CRDTs and we can poke at the edge cases together. Bring your laptop if you want to pair on it.\n\nAdded straight to the schedule because the hallway conversation got out of hand — that's what open scheduling is for!",
    day: 1,
    start: [16, 0],
    end: [16, 30],
    location: 2,
    hostNames: ["Min-jun Kim"],
    capacity: 15,
  },
  // Day 3
  {
    title: "Microservices Architecture: Lessons from the Trenches",
    fromProposal: true,
    day: 2,
    start: [9, 0],
    end: [10, 0],
    location: 0,
    hostNames: ["Mohammed El-Sayed"],
    capacity: 100,
  },
  {
    title: "Blockchain Beyond Cryptocurrency: Practical Applications",
    fromProposal: true,
    day: 2,
    start: [10, 0],
    end: [11, 0],
    location: 1,
    hostNames: ["Kwame Mensah"],
    capacity: 30,
  },
  {
    title: "DevOps Culture: Breaking Down Silos",
    fromProposal: true,
    day: 2,
    start: [10, 30],
    end: [11, 30],
    location: 2,
    hostNames: ["Diego Fernández"],
    capacity: 25,
  },
  {
    title:
      "Cybersecurity in the Age of Remote Work: Protecting Your Digital Assets",
    fromProposal: true,
    day: 2,
    start: [14, 0],
    end: [15, 0],
    location: 0,
    hostNames: ["Fatima Al-Farsi"],
    capacity: 100,
  },
  {
    title: "Closing Session & Farewell",
    fromProposal: false,
    description:
      "Wrap-up of Conference Gamma: community announcements, a look back at the highlights of the last three days, thank-yous to volunteers and speakers, and a preview of next year's edition. We close with a group photo in front of the Main Hall.",
    day: 2,
    start: [16, 0],
    end: [17, 0],
    location: 0,
    hostNames: ["Charlie Test"],
    capacity: 100,
    adminManaged: true, // organizer-planned, like the keynote
  },
];

function clearAll() {
  console.log("🧹 Clearing all tables...");
  const db = openDb();
  db.delete(schema.votes).run();
  db.delete(schema.rsvps).run();
  db.delete(schema.sessionLocations).run();
  db.delete(schema.sessionHosts).run();
  db.delete(schema.sessions).run();
  db.delete(schema.proposalHosts).run();
  db.delete(schema.sessionProposals).run();
  db.delete(schema.days).run();
  db.delete(schema.eventGuests).run();
  db.delete(schema.eventLocations).run();
  db.delete(schema.events).run();
  db.delete(schema.locations).run();
  db.delete(schema.guests).run();
  db.delete(schema.siteSettings).run();
  // Avatar files belong to the guest rows just deleted; remove them too so
  // repeated seeding doesn't accumulate orphaned uploads. Likewise the map
  // upload belongs to the site-settings row just cleared.
  fs.rmSync(uploadedAvatarsDir(), { recursive: true, force: true });
  fs.rmSync(path.join(process.env.SB_UPLOADS_DIR ?? "./uploads", "site"), {
    recursive: true,
    force: true,
  });
  console.log("  ✅ All tables cleared");
}

function seedTestData() {
  console.log("🌱 Seeding test data...");
  const db = openDb();

  const eventConfigs = generateEventDates();
  console.log(`📅 Generated dynamic dates for ${eventConfigs.length} events`);
  console.log(`🗓️  Today is: ${new Date().toISOString().split("T")[0]}`);

  // Guests
  console.log("  📝 Creating test guests...");
  fs.mkdirSync(uploadedAvatarsDir(), { recursive: true });
  const guestRows = guestConfigs.map((config) => {
    const id = nanoid();
    let avatarUrl: string | null = null;
    if (config.avatar !== undefined) {
      const filename = `${id}.webp`;
      fs.copyFileSync(
        path.join(
          seedAvatarsDir,
          `avatar-${String(config.avatar).padStart(2, "0")}.webp`
        ),
        path.join(uploadedAvatarsDir(), filename)
      );
      avatarUrl = `/media/avatars/${filename}?v=${Date.now()}`;
    }
    return {
      id,
      name: config.name,
      email: config.email,
      aboutMe: config.aboutMe ?? null,
      pronouns: config.pronouns ?? null,
      avatarUrl,
    };
  });
  db.insert(schema.guests).values(guestRows).run();
  const avatarCount = guestRows.filter((g) => g.avatarUrl).length;
  console.log(
    `  ✅ Created ${guestRows.length} guests (${avatarCount} with avatars)`
  );

  const guestIdByName = (name: string): string => {
    const guest = guestRows.find((g) => g.name === name);
    if (!guest) throw new Error(`Unknown seed guest: ${name}`);
    return guest.id;
  };

  // Locations
  console.log("  📍 Creating test locations...");
  const locationRows = [
    {
      id: "loc-main-hall",
      name: "Main Hall",
      capacity: 100,
      bookable: true,
      sortIndex: 1,
      color: "blue",
      imageUrl: "/locations/loc-main-hall.jpg",
      description:
        "Our largest venue, featuring a professional stage with tiered seating. Equipped with full AV including projector and sound system. Ideal for keynotes, panels, and large-audience sessions.",
      areaDescription: "Ground floor, East Wing",
      hidden: false,
    },
    {
      id: "loc-room-a",
      name: "Workshop Room",
      capacity: 30,
      bookable: true,
      sortIndex: 2,
      color: "green",
      imageUrl: "/locations/loc-room-a.jpg",
      description:
        "A bright breakout room with whiteboards and flexible seating. Natural light and a relaxed atmosphere make it well suited for workshops and interactive sessions.",
      areaDescription: "1st floor, West Wing",
      hidden: false,
    },
    {
      id: "loc-room-b",
      name: "Garden Terrace",
      capacity: 25,
      bookable: true,
      sortIndex: 3,
      color: "red",
      imageUrl: "/locations/loc-room-b.jpg",
      description:
        "An informal outdoor space with picnic tables overlooking the lake. Perfect for open-space sessions, unconference discussions, and casual networking.",
      areaDescription: "Outdoor, South Courtyard",
      hidden: false,
    },
  ];
  db.insert(schema.locations).values(locationRows).run();
  console.log(`  ✅ Created ${locationRows.length} locations`);

  // Events
  console.log("  🎪 Creating test events...");
  const eventRows = eventConfigs.map((config, index) => ({
    id: nanoid(),
    name: config.name,
    slug: eventNameToSlug(config.name),
    description: config.description,
    icon: config.icon,
    website: `test-event-${index + 1}.example.com`,
    start: config.start.toISOString(),
    end: config.end.toISOString(),
    proposalPhaseStart: config.proposalPhaseStart.toISOString(),
    proposalPhaseEnd: config.proposalPhaseEnd.toISOString(),
    votingPhaseStart: config.votingPhaseStart.toISOString(),
    votingPhaseEnd: config.votingPhaseEnd.toISOString(),
    schedulingPhaseStart: config.schedulingPhaseStart.toISOString(),
    schedulingPhaseEnd: config.schedulingPhaseEnd.toISOString(),
    timezone: TZ,
    maxSessionDuration: 120,
    breakMinutes: 10,
  }));
  db.insert(schema.events).values(eventRows).run();
  console.log(`  ✅ Created ${eventRows.length} events`);

  // Link all guests and locations to all events
  const eventGuestRows = eventRows.flatMap((ev) =>
    guestRows.map((g) => ({ eventId: ev.id, guestId: g.id }))
  );
  const eventLocationRows = eventRows.flatMap((ev) =>
    locationRows.map((l) => ({ eventId: ev.id, locationId: l.id }))
  );
  db.insert(schema.eventGuests).values(eventGuestRows).run();
  db.insert(schema.eventLocations).values(eventLocationRows).run();

  // Days (3 per event, 09:00–18:00 Berlin, bookable 09:00–17:30 Berlin)
  console.log("  📅 Creating test days...");
  const dayRows = eventRows.flatMap((ev, eventIndex) => {
    const config = eventConfigs[eventIndex];
    return [0, 1, 2].map((dayIndex) => ({
      id: nanoid(),
      start: berlinTime(config.start, dayIndex, 9, 0).toISOString(),
      end: berlinTime(config.start, dayIndex, 18, 0).toISOString(),
      startBookings: berlinTime(config.start, dayIndex, 9, 0).toISOString(),
      endBookings: berlinTime(config.start, dayIndex, 17, 30).toISOString(),
      eventId: ev.id,
    }));
  });
  db.insert(schema.days).values(dayRows).run();
  console.log(
    `  ✅ Created ${dayRows.length} days across ${eventRows.length} events`
  );

  // Session proposals
  console.log("  💡 Creating test session proposals...");
  const proposalRows: (typeof schema.sessionProposals.$inferInsert)[] = [];
  const proposalHostRows: (typeof schema.proposalHosts.$inferInsert)[] = [];

  eventRows.forEach((ev, eventIndex) => {
    const eventName = eventConfigs[eventIndex].name;
    // Later phases have accumulated more proposals; Gamma (scheduling) gets
    // all templates so gammaSessionConfigs can schedule any of them.
    const numProposals = [8, 10, sessionTemplates.length][eventIndex];

    for (let i = 0; i < numProposals; i++) {
      const template = sessionTemplates[i % sessionTemplates.length];
      const hostIndex = (eventIndex + i) % guestRows.length;
      const hostProbability = seededRandom();
      let hostIds: string[];
      if (hostProbability < 0.2) {
        hostIds = [];
      } else if (hostProbability < 0.4) {
        hostIds = [
          guestRows[hostIndex].id,
          guestRows[(hostIndex + 1) % guestRows.length].id,
        ];
      } else {
        hostIds = [guestRows[hostIndex].id];
      }

      const possibleDurations = [undefined, 30, 60, 90, 120, 150, 180];
      const duration =
        possibleDurations[
          Math.floor(seededRandom() * possibleDurations.length)
        ];

      const title =
        i < sessionTemplates.length
          ? template.title
          : `${template.title} - ${eventName} Special Edition`;
      const description =
        i < sessionTemplates.length
          ? template.description
          : `${template.description}\n\nThis special edition for ${eventName} will include additional content tailored to our community's interests and current industry trends.`;

      const proposalId = nanoid();
      proposalRows.push({
        id: proposalId,
        eventId: ev.id,
        title,
        description,
        durationMinutes: duration ?? null,
        createdTime: new Date().toISOString(),
      });
      for (const guestId of hostIds) {
        proposalHostRows.push({ proposalId, guestId });
      }
    }

    // Event-specific proposals
    const eventSpecific = [
      {
        title: `${eventName} Lightning Talks: Community Showcase`,
        description: `A fast-paced session featuring 5-minute lightning talks from ${eventName} attendees. This is your chance to share a quick tip, tool, or technique with the community.\n\nWe'll have 8-10 speakers covering diverse topics chosen by community vote. Past lightning talks have covered everything from productivity hacks to cutting-edge research findings. Whether you're a first-time speaker or seasoned presenter, lightning talks provide a low-pressure environment to share your expertise.\n\nSubmit your lightning talk proposal during the event - we'll be accepting submissions right up until the session begins!`,
      },
      {
        title: `Networking & Coffee Chat: Connect with ${eventName} Peers`,
        description: `An informal networking session designed to help ${eventName} attendees connect over coffee and conversation. This isn't a structured presentation - instead, we'll facilitate small group discussions around shared interests and challenges.\n\nWhether you're looking for career advice, collaboration opportunities, or just want to meet like-minded professionals, this session provides a welcoming environment for meaningful connections.`,
      },
      {
        title: `${eventName} Panel: Industry Leaders Share Their Insights`,
        description: `Join us for an engaging panel discussion featuring industry leaders and ${eventName} community members. Our panelists will share their perspectives on current trends, future predictions, and career advice.\n\nThis interactive session includes audience Q&A, so come prepared with your questions! Topics will be driven by audience interest but typically cover emerging technologies, leadership challenges, and navigating career transitions in tech.`,
      },
    ];

    eventSpecific.forEach((p, pIndex) => {
      const proposalId = nanoid();
      const guestId = guestRows[(eventIndex + pIndex) % guestRows.length].id;
      proposalRows.push({
        id: proposalId,
        eventId: ev.id,
        title: p.title,
        description: p.description,
        durationMinutes: 30,
        createdTime: new Date().toISOString(),
      });
      proposalHostRows.push({ proposalId, guestId });
    });
  });

  // Conference Gamma is mid-scheduling: most of its proposals get scheduled
  // as sessions below (gammaSessionConfigs). Align each scheduled proposal's
  // hosts and duration with its session so the data stays consistent — and so
  // the vote seeding below skips the real hosts.
  const gammaEvent = eventRows[2];
  for (const cfg of gammaSessionConfigs) {
    if (!cfg.fromProposal) continue;
    const proposal = proposalRows.find(
      (p) => p.eventId === gammaEvent.id && p.title === cfg.title
    );
    if (!proposal) {
      throw new Error(`No seeded Gamma proposal titled "${cfg.title}"`);
    }
    for (let i = proposalHostRows.length - 1; i >= 0; i--) {
      if (proposalHostRows[i].proposalId === proposal.id) {
        proposalHostRows.splice(i, 1);
      }
    }
    proposalHostRows.push(
      ...cfg.hostNames.map((name) => ({
        proposalId: proposal.id,
        guestId: guestIdByName(name),
      }))
    );
    proposal.durationMinutes =
      cfg.end[0] * 60 + cfg.end[1] - (cfg.start[0] * 60 + cfg.start[1]);
  }

  db.insert(schema.sessionProposals).values(proposalRows).run();
  if (proposalHostRows.length > 0) {
    db.insert(schema.proposalHosts).values(proposalHostRows).run();
  }
  console.log(
    `  ✅ Created ${proposalRows.length} session proposals across ${eventRows.length} events`
  );

  // Votes (for Beta and Gamma events)
  console.log("  🗳️  Creating test votes...");
  const voteChoices = [
    { choice: VoteChoice.interested, weight: 40 },
    { choice: VoteChoice.maybe, weight: 35 },
    { choice: VoteChoice.skip, weight: 25 },
  ];

  const voteRows: (typeof schema.votes.$inferInsert)[] = [];

  // Event-specific proposals have deterministic titles and are used as clean
  // test targets — skip them when seeding votes so tests start from a
  // known "no prior vote" state.
  const eventSpecificTitlePatterns = [
    /Lightning Talks: Community Showcase$/,
    /^Networking & Coffee Chat: /,
    /Panel: Industry Leaders Share Their Insights$/,
  ];

  eventRows.forEach((ev, eventIndex) => {
    const eventName = eventConfigs[eventIndex].name;
    if (eventName !== "Conference Beta" && eventName !== "Conference Gamma") {
      return;
    }

    const eventProposals = proposalRows.filter(
      (p) =>
        p.eventId === ev.id &&
        !eventSpecificTitlePatterns.some((re) => re.test(p.title))
    );

    guestRows.forEach((guest) => {
      eventProposals.forEach((proposal) => {
        const isHost = proposalHostRows.some(
          (ph) => ph.proposalId === proposal.id && ph.guestId === guest.id
        );
        if (!isHost && seededRandom() < 0.4) {
          const randomValue = seededRandom() * 100;
          let cumulativeWeight = 0;
          let selectedChoice = VoteChoice.interested;
          for (const { choice, weight } of voteChoices) {
            cumulativeWeight += weight;
            if (randomValue <= cumulativeWeight) {
              selectedChoice = choice;
              break;
            }
          }
          voteRows.push({
            id: nanoid(),
            proposalId: proposal.id,
            guestId: guest.id,
            choice: selectedChoice,
          });
        }
      });
    });
  });

  if (voteRows.length > 0) {
    db.insert(schema.votes).values(voteRows).run();
  }
  console.log(`  ✅ Created ${voteRows.length} votes`);

  // Sessions: one keynote + lunch blockers per event, plus a filled-out
  // schedule for Conference Gamma (scheduling phase).
  console.log("  🎯 Creating test sessions...");
  const sessionRows: (typeof schema.sessions.$inferInsert)[] = [];
  const sessionHostRows: (typeof schema.sessionHosts.$inferInsert)[] = [];
  const sessionLocationRows: (typeof schema.sessionLocations.$inferInsert)[] =
    [];

  eventRows.forEach((ev, eventIndex) => {
    const config = eventConfigs[eventIndex];

    // Opening keynote: 09:00–10:30 Berlin on day 1
    const keynoteId = nanoid();
    sessionRows.push({
      id: keynoteId,
      title: `Opening Keynote - ${config.name}`,
      description: `Welcome to ${config.name}`,
      startTime: berlinTime(config.start, 0, 9, 0).toISOString(),
      endTime: berlinTime(config.start, 0, 10, 30).toISOString(),
      eventId: ev.id,
      capacity: locationRows[0].capacity,
      adminManaged: true,
      blocker: false,
      closed: false,
    });
    sessionHostRows.push({
      sessionId: keynoteId,
      guestId: guestRows[eventIndex % guestRows.length].id,
    });
    sessionLocationRows.push({
      sessionId: keynoteId,
      locationId: locationRows[0].id,
    });

    // Lunch blockers: 12:30–14:00 Berlin, all rooms, all 3 days
    for (let dayIndex = 0; dayIndex < 3; dayIndex++) {
      const lunchId = nanoid();
      sessionRows.push({
        id: lunchId,
        title: "Lunch Break",
        description: "",
        startTime: berlinTime(config.start, dayIndex, 12, 30).toISOString(),
        endTime: berlinTime(config.start, dayIndex, 14, 0).toISOString(),
        eventId: ev.id,
        capacity: 0,
        adminManaged: true,
        blocker: true,
        closed: false,
      });
      for (const loc of locationRows) {
        sessionLocationRows.push({ sessionId: lunchId, locationId: loc.id });
      }
    }
  });

  // Conference Gamma's scheduled sessions (see gammaSessionConfigs)
  const gammaConfig = eventConfigs[2];
  for (const cfg of gammaSessionConfigs) {
    const proposal = cfg.fromProposal
      ? proposalRows.find(
          (p) => p.eventId === gammaEvent.id && p.title === cfg.title
        )
      : undefined;
    const sessionId = nanoid();
    sessionRows.push({
      id: sessionId,
      title: cfg.title,
      description: proposal?.description ?? cfg.description ?? "",
      startTime: berlinTime(
        gammaConfig.start,
        cfg.day,
        ...cfg.start
      ).toISOString(),
      endTime: berlinTime(gammaConfig.start, cfg.day, ...cfg.end).toISOString(),
      eventId: gammaEvent.id,
      capacity: cfg.capacity,
      adminManaged: cfg.adminManaged ?? false,
      blocker: false,
      closed: cfg.closed ?? false,
      proposalId: proposal?.id ?? null,
    });
    for (const name of cfg.hostNames) {
      sessionHostRows.push({ sessionId, guestId: guestIdByName(name) });
    }
    sessionLocationRows.push({
      sessionId,
      locationId: locationRows[cfg.location].id,
    });
  }

  db.insert(schema.sessions).values(sessionRows).run();
  if (sessionHostRows.length > 0) {
    db.insert(schema.sessionHosts).values(sessionHostRows).run();
  }
  if (sessionLocationRows.length > 0) {
    db.insert(schema.sessionLocations).values(sessionLocationRows).run();
  }
  console.log(
    `  ✅ Created ${sessionRows.length} sessions across ${eventRows.length} events`
  );

  // RSVPs (Conference Gamma only — the server rejects RSVP changes outside
  // the scheduling phase). Guests skip sessions they host and sessions
  // overlapping one they already RSVP'd to. Bob Test and Yuki Tanaka never
  // RSVP the Opening Keynote: rsvp.spec.ts (Bob) and the admin RSVP-moderation
  // test (Yuki) use it as their clean "no prior RSVP" target.
  console.log("  🙋 Creating test RSVPs...");
  type SessionRow = (typeof sessionRows)[number];
  const overlaps = (a: SessionRow, b: SessionRow) =>
    a.startTime! < b.endTime! && b.startTime! < a.endTime!;
  const rsvpRows: (typeof schema.rsvps.$inferInsert)[] = [];
  const rsvpTargets = sessionRows
    .filter((s) => s.eventId === gammaEvent.id && !s.blocker)
    .sort((a, b) => a.startTime!.localeCompare(b.startTime!));
  const rsvpCountBySession = new Map<string, number>();
  for (const guest of guestRows) {
    // Hosted sessions make the guest busy for that slot
    const busy = rsvpTargets.filter((s) =>
      sessionHostRows.some(
        (sh) => sh.sessionId === s.id && sh.guestId === guest.id
      )
    );
    for (const session of rsvpTargets) {
      const isKeynote = session.title.startsWith("Opening Keynote");
      if (
        isKeynote &&
        (guest.name === "Bob Test" || guest.name === "Yuki Tanaka")
      ) {
        continue;
      }
      if (busy.some((b) => b.id === session.id || overlaps(b, session))) {
        continue;
      }
      const count = rsvpCountBySession.get(session.id) ?? 0;
      if (count >= session.capacity!) continue;
      if (seededRandom() < (isKeynote ? 0.6 : 0.3)) {
        rsvpRows.push({
          id: nanoid(),
          sessionId: session.id,
          guestId: guest.id,
        });
        rsvpCountBySession.set(session.id, count + 1);
        busy.push(session);
      }
    }
  }
  if (rsvpRows.length > 0) {
    db.insert(schema.rsvps).values(rsvpRows).run();
  }
  console.log(`  ✅ Created ${rsvpRows.length} RSVPs`);

  console.log("✅ Test data seeded successfully");
}

function resetDatabase() {
  try {
    console.log("🔄 Resetting test database to known state...");
    console.log(`📍 Database: ${resolveDbPath()}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || "dev"}`);

    clearAll();
    seedTestData();

    console.log("🎉 Database reset completed successfully!");
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("❌ Database reset failed:", message);
    process.exit(1);
  }
}

if (process.argv[1] === new URL(import.meta.url).pathname) {
  resetDatabase();
}

export { resetDatabase, clearAll, seedTestData };
