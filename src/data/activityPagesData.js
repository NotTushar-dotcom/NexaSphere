// ── NexaSphere Activity Pages Data ──
// Each activity has its own detail page listing conducted events.
// Each event links to a full detail page.

export const activityPages = {
  'Hackathon': {
    id: 'hackathon',
    icon: '⚡',
    title: 'Hackathon',
    tagline: 'Build. Break. Repeat.',
    color: '#00d4ff',
    gradient: 'linear-gradient(135deg, #00d4ff, #0891b2)',
    description: 'Intense coding marathons where teams race against the clock to build innovative solutions. From ideation to deployment in hours — this is where legends are born.',
    conductedEvents: [],
    upcomingEvents: [
      { name: 'Hackathon 1.0', date: 'Coming Soon', description: 'NexaSphere\'s first major hackathon. Stay tuned for details.' }
    ],
  },

  'Codathon': {
    id: 'codathon',
    icon: '💻',
    title: 'Codathon',
    tagline: 'Code. Compete. Conquer.',
    color: '#6366f1',
    gradient: 'linear-gradient(135deg, #6366f1, #4f46e5)',
    description: 'Competitive programming challenges that push your algorithmic thinking to the limit. Every millisecond counts, every line matters.',
    conductedEvents: [],
    upcomingEvents: [
      { name: 'Codathon 1.0', date: 'Coming Soon', description: 'First competitive coding session. Sharpen your algorithms.' }
    ],
  },

  'Ideathon': {
    id: 'ideathon',
    icon: '💡',
    title: 'Ideathon',
    tagline: 'Dream. Design. Disrupt.',
    color: '#f59e0b',
    gradient: 'linear-gradient(135deg, #f59e0b, #d97706)',
    description: 'Where creativity rules over code. Pitch your wildest ideas, challenge the status quo, and turn imagination into roadmaps for the future.',
    conductedEvents: [],
    upcomingEvents: [
      { name: 'Ideathon 1.0', date: 'Coming Soon', description: 'Bring your boldest ideas. No code required — just vision.' }
    ],
  },

  'Workshop': {
    id: 'workshop',
    icon: '🔧',
    title: 'Workshop',
    tagline: 'Learn. Build. Master.',
    color: '#10b981',
    gradient: 'linear-gradient(135deg, #10b981, #059669)',
    description: 'Hands-on deep dives into the tools, frameworks, and technologies shaping the industry. Get your hands dirty and leave with real skills.',
    conductedEvents: [],
    upcomingEvents: [
      { name: 'Workshop: Git & GitHub', date: 'Coming Soon', description: 'Version control mastery for every developer.' }
    ],
  },

  'Insight Session': {
    id: 'insight-session',
    icon: '🔍',
    title: 'Insight Session',
    tagline: 'Share. Inspire. Elevate.',
    color: '#a855f7',
    gradient: 'linear-gradient(135deg, #a855f7, #9333ea)',
    description: 'Peer-to-peer knowledge sharing where every member is both a student and a teacher. Deep-dive talks on tech, careers, and the ideas shaping tomorrow.',
    conductedEvents: [
      {
        id: 'kss-1',
        name: 'KSS — Knowledge Sharing Session #1',
        shortName: 'KSS #1',
        date: 'March 14, 2025',
        status: 'completed',
        tagline: 'NexaSphere\'s inaugural knowledge exchange',
        stats: [
          { label: 'Speakers', value: '4' },
          { label: 'Attendees', value: '40+' },
          { label: 'Duration', value: '1 hr' },
          { label: 'Topics', value: '4' },
        ],
        overview: `NexaSphere's inaugural Knowledge Sharing Session brought together curious minds for an evening of peer-to-peer learning. Members stepped up as speakers, sharing their expertise on emerging technologies — from AI concepts to web development workflows. The session fostered a culture of open knowledge exchange and set the tone for what NexaSphere stands for: learning together, growing together.`,
        topics: [
          { title: 'Introduction to Artificial Intelligence', speaker: 'Ayush Sharma', duration: '15 min', summary: 'Covered the fundamentals of AI — machine learning, neural networks, and how AI is transforming industries.' },
          { title: 'Web Development with React', speaker: 'Tanishk Bansal', duration: '15 min', summary: 'Walked through React component architecture, state management, and building interactive UIs.' },
          { title: 'Open Source Contribution — Getting Started', speaker: 'Swayam Dwivedi', duration: '10 min', summary: 'Explained how to find good first issues, make pull requests, and contribute to real-world projects.' },
          { title: 'Data Structures You Should Know', speaker: 'Tushar Goswami', duration: '10 min', summary: 'Quick overview of stacks, queues, trees, and graphs with practical coding examples.' },
        ],
        photoLink: null,
        videoLink: null,
      },
    ],
    upcomingEvents: [],
  },

  'Open Source Day': {
    id: 'open-source-day',
    icon: '🌐',
    title: 'Open Source Day',
    tagline: 'Contribute. Collaborate. Create.',
    color: '#06b6d4',
    gradient: 'linear-gradient(135deg, #06b6d4, #0891b2)',
    description: 'Dedicated sessions to explore, contribute, and celebrate open-source. Find your first PR, or your hundredth — every contribution counts.',
    conductedEvents: [],
    upcomingEvents: [
      { name: 'Open Source Day 1.0', date: 'Coming Soon', description: 'First open source contribution drive. Pick a project, make an impact.' }
    ],
  },

  'Tech Debate': {
    id: 'tech-debate',
    icon: '🎙️',
    title: 'Tech Debate',
    tagline: 'Argue. Defend. Evolve.',
    color: '#ef4444',
    gradient: 'linear-gradient(135deg, #ef4444, #dc2626)',
    description: 'Structured battles of ideas where technology meets rhetoric. Defend your stance, challenge assumptions, and walk away sharper than when you arrived.',
    conductedEvents: [],
    upcomingEvents: [
      { name: 'Tech Debate 1.0', date: 'Coming Soon', description: 'First tech debate session. AI vs Human Creativity? You decide.' }
    ],
  },
};
