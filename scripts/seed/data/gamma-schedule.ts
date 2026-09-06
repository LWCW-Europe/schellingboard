// Conference Gamma (scheduling phase) gets a realistic, mostly filled grid:
// most sessions are scheduled from its seeded proposals (matched by title),
// plus organizer/attendee extras. Times are Berlin clock times on event day
// 0-2, day 2 running past midnight (09:00 → 03:00). Keep the slots that
// tests/e2e/scheduling.spec.ts relies on free:
//   day 0: Main Hall 16:00 and Garden Terrace 09:00 (asserted free),
//   day 2: Workshop Room from 15:00, Garden Terrace from 16:00 and Main Hall
//          01:00 the following morning (used by tests to create sessions).
// Two more specs book out of that day 2 Workshop Room window and must not
// collide: rsvp.spec.ts takes 20:00, schedule-layout.spec.ts 18:00. The latter
// clicks whichever slot the schedule happens to be scrolled to and then moves
// the booking, so it can never take a slot another spec needs.
// rsvp.spec.ts RSVPs Bob Test to the Opening Keynote, so nothing may run in
// parallel to it and Bob gets no seeded RSVP there (see RSVP seeding).
export interface GammaSessionConfig {
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

export const gammaSessionConfigs: GammaSessionConfig[] = [
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
      "Impromptu session: I'll demo a small real-time collaborative editor built on [CRDTs](https://crdt.tech) and we can poke at the edge cases together. Bring your laptop if you want to pair on it.\n\nAdded straight to the schedule because the hallway conversation got out of hand — *that's what open scheduling is for!*",
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
      "Wrap-up of Conference Gamma:\n\n- Community announcements\n- A look back at the highlights of the last three days\n- Thank-yous to volunteers and speakers\n- A preview of next year's edition\n\nWe close with a group photo in front of the **Main Hall**.",
    day: 2,
    start: [16, 0],
    end: [17, 0],
    location: 0,
    hostNames: ["Charlie Test"],
    capacity: 100,
    adminManaged: true, // organizer-planned, like the keynote
  },
];
