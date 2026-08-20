export const sessionTemplates = [
  {
    title: "Building Scalable Web Applications with Modern React",
    description:
      "Dive deep into the latest React patterns and best practices for building scalable applications. We'll cover state management, performance optimization, and modern tooling.",
  },
  {
    title: "The Future of AI: Transforming Industries Through Machine Learning",
    description:
      "Artificial Intelligence is reshaping every industry from healthcare to finance. In this comprehensive session, we'll explore the current state of AI technology, emerging trends, and practical applications that are driving innovation.\n\n## What you'll learn\n\nWe'll discuss real-world case studies, ethical considerations, and the skills needed to thrive in an AI-driven world. Whether you're a beginner or experienced professional, you'll gain valuable insights into how AI can transform your work and industry.\n\n## Topics\n\n- Natural language processing\n- Computer vision\n- Predictive analytics\n- The intersection of AI with blockchain and IoT",
  },
  {
    title: "Workshop: Hands-on Docker and Kubernetes",
    description:
      "A practical workshop on containerization and orchestration. **Bring your laptop** and get ready to deploy!\n\nPrerequisites:\n\n- Docker installed and working (`docker run hello-world`)\n- A free container registry account\n- Basic command-line comfort",
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
      "The shift to remote work has fundamentally changed the cybersecurity landscape. Traditional perimeter-based security models are no longer sufficient when employees access company resources from home networks, coffee shops, and co-working spaces.\n\n## Session outline\n\nThis session will provide a comprehensive overview of modern cybersecurity challenges and solutions. We'll explore **zero-trust architecture**, endpoint protection strategies, and the human element of cybersecurity. Attendees will learn practical techniques for:\n\n- Securing remote work environments\n- Implementing multi-factor authentication\n- Creating security awareness programs\n\nWe'll also discuss emerging threats like sophisticated phishing attacks, ransomware targeting remote workers, and supply chain vulnerabilities. Real-world examples and case studies will illustrate both successful security implementations and costly breaches, providing actionable insights for organizations of all sizes.",
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
      "The open source ecosystem faces sustainability challenges as projects grow in complexity and importance. This session examines successful funding models, from corporate sponsorship to foundation grants to innovative approaches like [GitHub Sponsors](https://github.com/sponsors).\n\nWe'll discuss community building strategies, *maintainer burnout prevention*, and the economic realities of supporting critical infrastructure projects. Case studies will include successful projects that have achieved sustainable funding and community growth.",
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

export function eventSpecificProposals(eventName: string) {
  return [
    {
      title: `${eventName} Lightning Talks: Community Showcase`,
      description: `A fast-paced session featuring **5-minute lightning talks** from ${eventName} attendees. This is your chance to share a quick tip, tool, or technique with the community.\n\nWe'll have 8-10 speakers covering diverse topics chosen by community vote. Past lightning talks have covered everything from productivity hacks to cutting-edge research findings. Whether you're a first-time speaker or seasoned presenter, lightning talks provide a low-pressure environment to share your expertise.\n\n> Submit your lightning talk proposal during the event — we'll be accepting submissions right up until the session begins!`,
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
}

// Event-specific proposals have deterministic titles and are used as clean
// test targets — skip them when seeding votes so tests start from a
// known "no prior vote" state.
export const eventSpecificTitlePatterns = [
  /Lightning Talks: Community Showcase$/,
  /^Networking & Coffee Chat: /,
  /Panel: Industry Leaders Share Their Insights$/,
];

// Screenshot fodder: proposals with a known host (Hana Kobayashi, whose
// profile is the most fleshed out) and proposals nobody has offered to host
// yet, both in the event that has locations, days and a real schedule.
export const gammaExtraProposals = [
  {
    title: "Writing Documentation People Actually Read",
    description:
      "Most documentation is written once, in a hurry, by whoever shipped the feature. This session is about the opposite: treating docs as a product with readers, a first minute that has to land, and a maintenance cost you plan for.\n\nWe'll look at real examples — a few good, several painfully bad — and pull out what separates them: task-shaped titles, examples before explanations, and the courage to delete a page.\n\nBring a page you're unhappy with and we'll rework it together.",
    durationMinutes: 60,
    hostNames: ["Hana Kobayashi"],
  },
  {
    title: "Your First Conference Talk: From Idea to Stage",
    description:
      "You have something worth saying and no idea how to turn it into 30 minutes on a stage. Let's fix that.\n\nWe'll cover finding a topic that's genuinely yours, writing an abstract that survives a review committee, building slides that support you instead of competing with you, and what to do when your demo dies in front of 200 people (it will, eventually).\n\nAimed at people who have *never* spoken before. No slides of my own — we work on yours.",
    durationMinutes: 90,
    hostNames: ["Hana Kobayashi"],
  },
  {
    title: "Ask Me Anything: Migrating a Legacy Monolith",
    description:
      "**Looking for someone to host this!**\n\nSeveral of us are staring down the same problem: a monolith that works, pays the bills, and is slowly becoming impossible to change. We'd love to hear from somebody who has actually come out the other side of a migration — what you'd do again, and what you'd never repeat.\n\nIf you've lived through one, please add yourself as host. An honest hour of war stories beats a polished talk.",
    durationMinutes: 60,
    hostNames: [],
  },
  {
    title: "Board Games for People Who Are Tired of Talking",
    description:
      "By day three, everyone's social battery is empty. This is a quiet room with a table, a stack of games, and no agenda.\n\nNobody has volunteered to bring the games yet — if you're travelling with something short and easy to teach, add yourself as host and we'll make it happen.",
    durationMinutes: 120,
    hostNames: [],
  },
];

export const commentOpeners = [
  "Really keen on this one — I've wanted to talk about it for ages.",
  "Would you be open to **co-hosting**? I've run something similar before.",
  "How much background knowledge are you assuming? Asking for a friend who is me.",
  "This overlaps a bit with the other proposal on the same topic — worth merging?",
  "Could this be scheduled later in the day? It clashes with the workshop block.",
];
export const commentReplies = [
  "Good question — no background needed, I'll start from scratch.",
  "Yes please, drop me a message and we'll plan it together.",
  "I'd rather keep them separate, they go in quite different directions.",
  "Later works for me. I'll flag it when scheduling opens.",
];
export const commentFollowUps = [
  "Perfect, count me in.",
  "That makes sense, thanks for explaining!",
];
