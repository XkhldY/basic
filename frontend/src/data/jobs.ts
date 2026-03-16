/**
 * Static job listings with full detail content (hirewithpom-style).
 * Used for the landing jobs list and job detail pages.
 */

export interface JobDetail {
  id: string;
  title: string;
  slug: string;
  employmentType: string;
  location: string;
  date: string;
  role: string;
  keyResponsibilities: string[];
  requirements: string[];
  preferredQualifications: string[];
}

export const JOBS: JobDetail[] = [
  {
    id: '1',
    title: 'Chief Technology Officer (CTO)',
    slug: 'chief-technology-officer',
    employmentType: 'Full-Time',
    location: 'On-site',
    date: 'May 1, 2025',
    role:
      'Our client in Saudi Arabia is seeking a dynamic Chief Technology Officer (CTO) to drive the technology strategy and innovation across the organization. This leadership role will focus on aligning technology initiatives with business goals and overseeing the architecture and implementation of scalable, secure cloud platforms.',
    keyResponsibilities: [
      'Set and execute the technology strategy to support business growth',
      'Lead the development of innovative products and drive new revenue opportunities',
      'Present technology solutions to high-profile customers, building strong relationships',
      'Define strategies that align tech initiatives with business goals',
      'Inspire and lead cross-functional teams to deliver results',
      'Ensure alignment across business, marketing, and operations',
    ],
    requirements: [
      '10+ years in senior technology leadership roles, focused on product innovation',
      'Proven success in opening new product areas and driving revenue growth',
      'Strong leadership with the ability to manage teams and set clear strategies',
      'Skilled in presenting complex tech solutions to executive-level clients',
      'Entrepreneurial mindset with a results-driven approach',
      'Fluent in English and Arabic',
    ],
    preferredQualifications: [
      'Background in AI, SaaS, or B2B products',
      'Experience scaling organizations and leading growth initiatives',
      'Customer-focused with a strong innovation mindset',
    ],
  },
  {
    id: '2',
    title: 'Fullstack JavaScript Developer',
    slug: 'fullstack-javascript-developer',
    employmentType: 'Full-Time',
    location: 'Egypt - Remote',
    date: 'Apr 30, 2025',
    role:
      'We are looking for a Fullstack JavaScript Developer to build and maintain modern web applications. You will work across the stack with Node.js, React/Next.js, and databases to deliver high-quality features and improve our platform.',
    keyResponsibilities: [
      'Design and implement new features and APIs',
      'Write clean, maintainable, and tested code',
      'Collaborate with product and design teams',
      'Participate in code reviews and technical decisions',
      'Optimize performance and user experience',
    ],
    requirements: [
      '3+ years of experience with JavaScript/TypeScript',
      'Strong experience with React and Node.js',
      'Experience with REST and/or GraphQL APIs',
      'Familiarity with SQL and NoSQL databases',
      'Good communication and teamwork skills',
    ],
    preferredQualifications: [
      'Experience with Next.js or similar frameworks',
      'Knowledge of testing (Jest, React Testing Library)',
      'Experience with CI/CD and cloud platforms',
    ],
  },
  {
    id: '3',
    title: 'Data Analyst (Technical)',
    slug: 'data-analyst-technical',
    employmentType: 'Full-Time',
    location: 'US - Remote',
    date: 'Apr 4, 2025',
    role:
      'We need a Technical Data Analyst to turn data into insights and support decision-making. You will work with large datasets, build reports and dashboards, and collaborate with engineering and product teams.',
    keyResponsibilities: [
      'Collect, clean, and analyze data from multiple sources',
      'Build and maintain dashboards and reports',
      'Identify trends and present findings to stakeholders',
      'Support A/B tests and experimentation',
      'Document data definitions and processes',
    ],
    requirements: [
      '2+ years of experience in data analysis or analytics',
      'Proficiency in SQL and a scripting language (Python or R)',
      'Experience with visualization tools (e.g. Tableau, Looker, or similar)',
      'Strong attention to detail and problem-solving skills',
      'Ability to communicate insights clearly',
    ],
    preferredQualifications: [
      'Experience with dbt, Airflow, or similar data tools',
      'Knowledge of statistics and experimentation',
      'Experience in a product or SaaS environment',
    ],
  },
  {
    id: '4',
    title: 'Social Media Specialist',
    slug: 'social-media-specialist',
    employmentType: 'Full-Time',
    location: 'UK/Germany/Spain/France',
    date: 'Mar 25, 2025',
    role:
      'We are hiring a Social Media Specialist to own our presence across platforms, create engaging content, and grow our community. You will work with marketing and brand to align social strategy with business goals.',
    keyResponsibilities: [
      'Create and schedule content across social channels',
      'Monitor engagement and respond to comments and messages',
      'Track performance and report on KPIs',
      'Suggest and run campaigns and partnerships',
      'Stay up to date with platform best practices and trends',
    ],
    requirements: [
      '2+ years of experience in social media or digital marketing',
      'Strong copywriting and visual storytelling skills',
      'Experience with scheduling and analytics tools',
      'Organized and able to manage multiple projects',
      'Fluent in English; additional European languages a plus',
    ],
    preferredQualifications: [
      'Experience with paid social (Meta, LinkedIn, etc.)',
      'Basic design skills (Canva, Adobe)',
      'Experience in B2B or tech marketing',
    ],
  },
  {
    id: '5',
    title: 'Senior Angular Developer',
    slug: 'senior-angular-developer',
    employmentType: 'Full-Time',
    location: 'Egypt',
    date: 'Mar 25, 2025',
    role:
      'We are looking for a Senior Angular Developer to lead front-end development of our enterprise applications. You will architect reusable components, improve performance, and mentor other developers.',
    keyResponsibilities: [
      'Build and maintain Angular applications and libraries',
      'Define coding standards and best practices',
      'Collaborate with backend and UX teams',
      'Conduct code reviews and mentor junior developers',
      'Troubleshoot and resolve technical issues',
    ],
    requirements: [
      '4+ years of experience with Angular',
      'Strong TypeScript and RxJS skills',
      'Experience with state management and REST APIs',
      'Understanding of accessibility and performance',
      'Good communication and leadership skills',
    ],
    preferredQualifications: [
      'Experience with NgRx or similar state management',
      'Knowledge of testing (Jasmine, Karma)',
      'Experience in enterprise or fintech products',
    ],
  },
  {
    id: '6',
    title: 'Senior PHP Developer',
    slug: 'senior-php-developer',
    employmentType: 'Full-time',
    location: 'Egypt',
    date: 'Mar 25, 2025',
    role:
      'We need a Senior PHP Developer to work on our server-side applications and APIs. You will design and implement features, refactor legacy code, and ensure high quality and security.',
    keyResponsibilities: [
      'Develop and maintain PHP applications and APIs',
      'Write clean, secure, and well-tested code',
      'Integrate with databases and third-party services',
      'Participate in architecture and technical decisions',
      'Support and improve existing systems',
    ],
    requirements: [
      '4+ years of experience with PHP',
      'Experience with Laravel, Symfony, or similar frameworks',
      'Strong SQL and database design skills',
      'Understanding of REST APIs and authentication',
      'Ability to work in a team and meet deadlines',
    ],
    preferredQualifications: [
      'Experience with queue systems and background jobs',
      'Knowledge of Docker and deployment pipelines',
      'Experience with legacy PHP refactoring',
    ],
  },
  {
    id: '7',
    title: 'Senior Sharepoint Developer',
    slug: 'senior-sharepoint-developer',
    employmentType: 'Full-time',
    location: 'Egypt',
    date: 'Mar 25, 2025',
    role:
      'We are hiring a Senior SharePoint Developer to design and implement solutions on the Microsoft 365 platform. You will build custom apps, workflows, and integrations to support business processes.',
    keyResponsibilities: [
      'Design and develop SharePoint Online solutions',
      'Build Power Automate flows and Power Apps',
      'Implement custom web parts and integrations',
      'Migrate and modernize existing SharePoint sites',
      'Document solutions and train users',
    ],
    requirements: [
      '4+ years of experience with SharePoint development',
      'Experience with SharePoint Framework (SPFx) and/or Power Platform',
      'Knowledge of Microsoft 365 and Azure AD',
      'Strong JavaScript/TypeScript skills',
      'Good problem-solving and communication skills',
    ],
    preferredQualifications: [
      'Microsoft certifications (e.g. PL-100, PL-200)',
      'Experience with Microsoft Graph API',
      'Experience in enterprise migrations',
    ],
  },
];

const slugToJob = new Map(JOBS.map((j) => [j.slug, j]));

export function getJobBySlug(slug: string): JobDetail | undefined {
  return slugToJob.get(slug);
}

export function getAllJobSlugs(): string[] {
  return JOBS.map((j) => j.slug);
}
