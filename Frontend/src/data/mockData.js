export const currentUser = {
  id: 'usr_enterprise_01',
  name: 'Alex Vance',
  email: 'alex.vance@innovatecorp.com',
  role: 'Product VP & Workspace Admin',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  workspace: 'InnovateCorp Enterprise',
  timezone: 'America/New_York (GMT-4)',
  plan: 'Enterprise AI Suite',
  stats: {
    totalMeetings: 124,
    hoursRecorded: 86.5,
    actionItemsCompleted: 42,
    aiSummariesGenerated: 98,
  }
};

export const mockMeetings = [
  {
    id: 'meet-101',
    code: 'INNOV-842-990',
    title: 'Q3 Product Strategy & AI Roadmap Alignment',
    description: 'Quarterly review of generative AI workspace features, enterprise compliance audit, and team scaling roadmap.',
    status: 'upcoming',
    date: 'Today',
    time: '02:30 PM - 03:30 PM',
    duration: '60 min',
    host: {
      name: 'Alex Vance',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    },
    participants: [
      { name: 'Sarah Chen', email: 'sarah.c@innovatecorp.com', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80', role: 'Engineering Lead' },
      { name: 'David Miller', email: 'david.m@innovatecorp.com', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', role: 'Chief Architect' },
      { name: 'Elena Rostova', email: 'elena.r@innovatecorp.com', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80', role: 'Design Director' },
      { name: 'Marcus Brody', email: 'marcus.b@innovatecorp.com', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', role: 'SecOps Officer' },
    ],
    hasAiSummary: true,
    tags: ['Strategy', 'AI Core', 'Executive'],
    passcode: '904812',
  },
  {
    id: 'meet-102',
    code: 'AI-CORE-771-02',
    title: 'Sprint 24 Architecture & WebRTC Latency Sync',
    status: 'ongoing',
    description: 'Investigating low-latency WebRTC mesh and SFU fallback across APAC edge clusters.',
    date: 'Today',
    time: 'Happening Now',
    duration: '45 min',
    host: {
      name: 'David Miller',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    },
    participants: [
      { name: 'Alex Vance', email: 'alex.vance@innovatecorp.com', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', role: 'Product VP' },
      { name: 'David Miller', email: 'david.m@innovatecorp.com', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', role: 'Chief Architect' },
      { name: 'Sarah Chen', email: 'sarah.c@innovatecorp.com', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80', role: 'Engineering Lead' },
    ],
    hasAiSummary: false,
    tags: ['Architecture', 'WebRTC', 'DevOps'],
    passcode: '331890',
  },
  {
    id: 'meet-103',
    code: 'UX-SYNC-554-19',
    title: 'IntellMeet 2.0 Design System & Glassmorphism Critique',
    status: 'completed',
    description: 'Final sign-off on responsive breakpoints, accessibility color contrasts, and interactive meeting room drawer ergonomics.',
    date: 'Yesterday',
    time: '11:00 AM - 12:00 PM',
    duration: '52 min',
    recordingUrl: 'https://cdn.intellmeet.enterprise/recordings/rec_9931.mp4',
    host: {
      name: 'Elena Rostova',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    },
    participants: [
      { name: 'Elena Rostova', email: 'elena.r@innovatecorp.com', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80', role: 'Design Director' },
      { name: 'Alex Vance', email: 'alex.vance@innovatecorp.com', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', role: 'Product VP' },
      { name: 'James Wilson', email: 'james.w@innovatecorp.com', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80', role: 'Frontend Engineer' },
    ],
    hasAiSummary: true,
    tags: ['UI/UX', 'Design System', 'Accessibility'],
    passcode: '672044',
  },
  {
    id: 'meet-104',
    code: 'SEC-GOV-908-11',
    title: 'Enterprise Security & SOC2 Compliance Audit Review',
    status: 'completed',
    description: 'Annual penetration testing debrief and automated end-to-end encryption key rotation protocols.',
    date: '3 days ago',
    time: '03:00 PM - 04:15 PM',
    duration: '75 min',
    recordingUrl: 'https://cdn.intellmeet.enterprise/recordings/rec_8812.mp4',
    host: {
      name: 'Marcus Brody',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    },
    participants: [
      { name: 'Marcus Brody', email: 'marcus.b@innovatecorp.com', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', role: 'SecOps Officer' },
      { name: 'Alex Vance', email: 'alex.vance@innovatecorp.com', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', role: 'Product VP' },
      { name: 'David Miller', email: 'david.m@innovatecorp.com', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', role: 'Chief Architect' },
    ],
    hasAiSummary: true,
    tags: ['Security', 'SOC2', 'Compliance'],
    passcode: '882190',
  },
  {
    id: 'meet-105',
    code: 'CLIENT-ALL-119',
    title: 'Client Onboarding: Global Financial Partners',
    status: 'upcoming',
    date: 'Tomorrow',
    time: '10:00 AM - 11:00 AM',
    duration: '60 min',
    host: {
      name: 'Alex Vance',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    },
    participants: [
      { name: 'Sarah Chen', email: 'sarah.c@innovatecorp.com', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80', role: 'Engineering Lead' },
      { name: 'Robert Gable', email: 'r.gable@globalfin.com', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80', role: 'Client Managing Director' },
    ],
    hasAiSummary: false,
    tags: ['Client', 'Enterprise', 'Financial'],
    passcode: '190455',
  }
];

export const mockAiSummary = {
  meetingId: 'meet-103',
  title: 'IntellMeet 2.0 Design System & Glassmorphism Critique',
  generatedAt: 'Yesterday at 12:05 PM',
  confidenceScore: '98.4%',
  sentiment: 'Highly Positive (92%)',
  executiveSummary:
    'The team reviewed the final design tokens and responsive behavior of IntellMeet 2.0. Elena presented the refreshed glassmorphism aesthetics, color contrast accessibility tokens, and live video meeting control bars. David confirmed frontend bundle budget constraints (<180kb gzip). The team approved rollout to beta customers in Sprint 25.',
  keyDiscussionPoints: [
    {
      topic: 'Glassmorphism Blur & GPU Performance',
      detail: 'Benchmarked backdrop-filter performance on lower-tier mobile hardware. Agreed to apply graceful opacity fallback on devices with reduced transparency preferences.',
      timeOffset: '08:14',
    },
    {
      topic: 'Meeting Control Bar Ergonomics',
      detail: 'Controls are now floating with auto-hide behavior after 4 seconds of mouse inactivity, improving immersion during screen sharing sessions.',
      timeOffset: '19:42',
    },
    {
      topic: 'Live Transcript & AI Assistant Split Layout',
      detail: 'Integrated right-hand collapsible drawer that seamlessly toggles between realtime chat, participants, and intelligent Q&A bot.',
      timeOffset: '34:20',
    },
    {
      topic: 'Accessibility (WCAG 2.1 AA Compliance)',
      detail: 'Confirmed color contrast ratios of 4.8:1 on primary buttons and 7:1 on body text against dark surface containers.',
      timeOffset: '46:15',
    }
  ],
  decisions: [
    'Approved immediate rollout of dark mode token palette across all authenticated routes.',
    'Consolidated WebRTC control bar icon set using Lucide React for consistent 20px stroke rendering.',
    'Scheduled automated Lighthouse CI checks on pull requests with a threshold of 95+ performance.',
    'Agreed to proceed with simulated mock data for AI Q&A assistant until MERN backend endpoints are connected.'
  ],
  topics: ['Design System', 'Accessibility', 'WebRTC Ergonomics', 'Glassmorphism', 'Performance']
};

export const mockTranscripts = [
  {
    id: 'tr-01',
    timestamp: '00:01:15',
    speaker: 'Elena Rostova',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    text: 'Good morning everyone! Today we are reviewing the final UI specifications for IntellMeet 2.0. I want to start with the new floating meeting control bar.',
    sentiment: 'positive',
  },
  {
    id: 'tr-02',
    timestamp: '00:03:40',
    speaker: 'Alex Vance',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    text: 'Thanks Elena. From the product standpoint, our primary goal is zero friction. When a user enters a room, their audio status, camera preview, and noise cancellation should be crystal clear.',
    sentiment: 'neutral',
  },
  {
    id: 'tr-03',
    timestamp: '00:08:14',
    speaker: 'David Miller',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    text: 'I ran the GPU profiling on our glassmorphism blur effects. If someone is on an older tablet or low-power laptop, heavy blur can cause slight frame drops. We should definitely use standard solid background fallbacks if hardware acceleration is restricted.',
    sentiment: 'caution',
  },
  {
    id: 'tr-04',
    timestamp: '00:15:22',
    speaker: 'Elena Rostova',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    text: 'Great catch David. Tailwind makes that straightforward with CSS backdrop-filter fallback utility classes. I will verify that in the theme tokens today.',
    sentiment: 'positive',
  },
  {
    id: 'tr-05',
    timestamp: '00:27:50',
    speaker: 'Alex Vance',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    text: 'What about the AI meeting intelligence drawer? How does the live transcript interact with the AI question answering bot?',
    sentiment: 'neutral',
  },
  {
    id: 'tr-06',
    timestamp: '00:32:10',
    speaker: 'David Miller',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    text: 'Users can click any transcript block to jump audio, or open the AI assistant tab to query: "What did Alex suggest regarding deployment schedules?" and receive structured bullet points instantly.',
    sentiment: 'positive',
  },
  {
    id: 'tr-07',
    timestamp: '00:48:02',
    speaker: 'Elena Rostova',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    text: 'Everyone seems aligned! Let us wrap this up and push the preview branch for engineering review.',
    sentiment: 'positive',
  }
];

export const mockActionItems = [
  {
    id: 'act-01',
    meetingId: 'meet-103',
    meetingTitle: 'IntellMeet 2.0 Design System & Glassmorphism Critique',
    title: 'Configure fallback CSS opacity rules for low-GPU mobile devices',
    assignee: {
      name: 'David Miller',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    },
    dueDate: '2026-10-14',
    priority: 'High',
    status: 'in-progress',
    completed: false,
  },
  {
    id: 'act-02',
    meetingId: 'meet-103',
    meetingTitle: 'IntellMeet 2.0 Design System & Glassmorphism Critique',
    title: 'Finalize WCAG 2.1 AA color contrast audit on dark mode inputs',
    assignee: {
      name: 'Elena Rostova',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    },
    dueDate: '2026-10-12',
    priority: 'Urgent',
    status: 'pending',
    completed: false,
  },
  {
    id: 'act-03',
    meetingId: 'meet-104',
    meetingTitle: 'Enterprise Security & SOC2 Compliance Audit Review',
    title: 'Generate SOC2 compliance audit report export for auditors',
    assignee: {
      name: 'Marcus Brody',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    },
    dueDate: '2026-10-18',
    priority: 'Medium',
    status: 'completed',
    completed: true,
  },
  {
    id: 'act-04',
    meetingId: 'meet-101',
    meetingTitle: 'Q3 Product Strategy & AI Roadmap Alignment',
    title: 'Draft Q3 enterprise customer communication and release notes',
    assignee: {
      name: 'Alex Vance',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    },
    dueDate: '2026-10-15',
    priority: 'High',
    status: 'pending',
    completed: false,
  },
  {
    id: 'act-05',
    meetingId: 'meet-101',
    meetingTitle: 'Q3 Product Strategy & AI Roadmap Alignment',
    title: 'Review WebRTC SFU edge server latency in Tokyo region',
    assignee: {
      name: 'Sarah Chen',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    },
    dueDate: '2026-10-16',
    priority: 'Medium',
    status: 'in-progress',
    completed: false,
  }
];

export const mockTeamMembers = [
  {
    id: 'm-1',
    name: 'Alex Vance',
    email: 'alex.vance@innovatecorp.com',
    role: 'Owner',
    department: 'Product Management',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    lastActive: 'Now',
  },
  {
    id: 'm-2',
    name: 'Sarah Chen',
    email: 'sarah.c@innovatecorp.com',
    role: 'Admin',
    department: 'Core Engineering',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    lastActive: '5 min ago',
  },
  {
    id: 'm-3',
    name: 'David Miller',
    email: 'david.m@innovatecorp.com',
    role: 'Admin',
    department: 'Systems & Architecture',
    status: 'In Meeting',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    lastActive: 'Just now',
  },
  {
    id: 'm-4',
    name: 'Elena Rostova',
    email: 'elena.r@innovatecorp.com',
    role: 'Member',
    department: 'UX / Product Design',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    lastActive: '32 min ago',
  },
  {
    id: 'm-5',
    name: 'Marcus Brody',
    email: 'marcus.b@innovatecorp.com',
    role: 'Member',
    department: 'Cybersecurity & SOC2',
    status: 'Offline',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    lastActive: '2 hours ago',
  },
  {
    id: 'm-6',
    name: 'Amara Okafor',
    email: 'amara.o@innovatecorp.com',
    role: 'Guest',
    department: 'Marketing & Comms',
    status: 'Pending Invite',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    lastActive: 'Invited yesterday',
  }
];

export const mockSharedFiles = [
  {
    id: 'f-1',
    name: 'IntellMeet_2.0_Design_System_Spec.pdf',
    type: 'pdf',
    size: '14.8 MB',
    uploadedBy: 'Elena Rostova',
    meeting: 'Design System Critique',
    updatedAt: 'Yesterday, 12:45 PM',
    downloads: 38,
  },
  {
    id: 'f-2',
    name: 'SOC2_Type_II_Compliance_Audit_2026.docx',
    type: 'doc',
    size: '4.2 MB',
    uploadedBy: 'Marcus Brody',
    meeting: 'Security & SOC2 Review',
    updatedAt: '3 days ago',
    downloads: 19,
  },
  {
    id: 'f-3',
    name: 'Q3_Product_Roadmap_Deck.pptx',
    type: 'presentation',
    size: '22.1 MB',
    uploadedBy: 'Alex Vance',
    meeting: 'Q3 Product Strategy',
    updatedAt: '5 days ago',
    downloads: 52,
  },
  {
    id: 'f-4',
    name: 'Sprint_24_WebRTC_SFU_Recording.mp4',
    type: 'video',
    size: '240.5 MB',
    uploadedBy: 'David Miller',
    meeting: 'Architecture Sync',
    updatedAt: 'Oct 04, 2026',
    downloads: 14,
  },
  {
    id: 'f-5',
    name: 'Meeting_AI_Transcript_103.json',
    type: 'json',
    size: '340 KB',
    uploadedBy: 'IntellBot AI',
    meeting: 'Design System Critique',
    updatedAt: 'Yesterday, 12:05 PM',
    downloads: 64,
  }
];

export const mockActivityFeed = [
  {
    id: 'act-feed-1',
    user: 'IntellBot AI',
    action: 'generated executive meeting summary',
    target: 'IntellMeet 2.0 Design System Critique',
    time: '2 hours ago',
    type: 'ai',
  },
  {
    id: 'act-feed-2',
    user: 'David Miller',
    action: 'started an instant sync room',
    target: 'WebRTC Mesh Latency Debugging',
    time: '3 hours ago',
    type: 'meeting',
  },
  {
    id: 'act-feed-3',
    user: 'Alex Vance',
    action: 'completed action item',
    target: 'Review security encryption protocols',
    time: '5 hours ago',
    type: 'task',
  },
  {
    id: 'act-feed-4',
    user: 'Sarah Chen',
    action: 'scheduled a new meeting',
    target: 'Client Onboarding: Global Financial Partners',
    time: 'Yesterday',
    type: 'calendar',
  },
  {
    id: 'act-feed-5',
    user: 'Elena Rostova',
    action: 'uploaded presentation file',
    target: 'IntellMeet_2.0_Design_System_Spec.pdf',
    time: 'Yesterday',
    type: 'file',
  }
];

export const mockAiBotResponses = {
  defaultAnswers: [
    "Based on the meeting transcript, the primary consensus was to approve the dark theme token architecture and enforce WCAG 2.1 AA accessibility guidelines before Sprint 25 launch.",
    "David Miller flagged potential WebRTC blur overhead on low-end hardware. The team decided to use CSS fallback properties to ensure smooth 60fps streaming.",
    "The 3 top action items recorded are: 1) Configure low-GPU mobile fallbacks, 2) Complete contrast audits on inputs, and 3) Finalize release notes for enterprise tenants.",
    "Elena mentioned that all design tokens are synchronized directly from Figma tokens into the Tailwind configuration."
  ],
  suggestedQuestions: [
    "What were the key decisions made in the last meeting?",
    "Summarize all pending action items and assignees.",
    "What did David Miller mention regarding WebRTC performance?",
    "Draft a follow-up summary email for executive stakeholders."
  ]
};
