// utils/constants.ts

export const SITE_NAME = "Blogme";
export const SITE_DESCRIPTION = "Showcasing you to the world";
export const COPYRIGHT_TEXT = `© ${new Date().getFullYear()} Blogme. All rights reserved.`;
export const BASE_URL = "https://blogme.africa";

// Company Information
export const COMPANY_INFO = {
  name: "Blogme",
  description: "A platform for sharing your stories with the world",
  email: "hello@blogme.africa",
  phone: "+1 (555) 123-4567",
  address: "123 Story Street, Digital City, DC 12345"
};

// Social Media Links
export const SOCIAL_LINKS = [
  { name: "Twitter", url: "https://twitter.com/blogme", icon: "twitter" },
  { name: "Facebook", url: "https://facebook.com/blogme", icon: "facebook" },
  { name: "Instagram", url: "https://instagram.com/blogme", icon: "instagram" },
  { name: "LinkedIn", url: "https://linkedin.com/company/blogme", icon: "linkedin" }
];

// Footer Navigation Links
export const FOOTER_LINKS = {
  company: [
    { label: "About Us", path: "/about" },
    { label: "Our Story", path: "/about#story" },
    { label: "Team", path: "/about#team" },
    { label: "Careers", path: "/careers" }
  ],
  support: [
    { label: "Help Center", path: "/help" },
    { label: "Contact Us", path: "/contact" },
    { label: "FAQ", path: "/faq" },
    { label: "Community", path: "/community" }
  ],
  legal: [
    { label: "Privacy Policy", path: "/privacy" },
    { label: "Terms of Service", path: "/terms" },
    { label: "Cookie Policy", path: "/cookies" },
    { label: "GDPR", path: "/gdpr" }
  ],
  resources: [
    { label: "Blog", path: "/stories" },
    { label: "Create Post", path: "/create" },
    { label: "Guidelines", path: "/guidelines" },
    { label: "API", path: "/api" }
  ]
};

// Navigation Links
export const NAV_LINKS = [
  { label: "Home", path: "/" },
  { label: "About", path: "/about" },
  { label: "Blog", path: "/stories" },
  { label: "Contact", path: "/contact" }
];

export const sidebarLinks = [
  {
    imgURL: '/icons/Home.svg',
    route: '/',
    label: 'Home',
  },

  {
    imgURL: '/icons/upcoming.svg',
    route: '/create',
    label: 'Blog',
  },
  {
    imgURL: '/icons/previous.svg',
    route: '/stories',
    label: 'Stories',
  },
];
export const navibarLinks = [
  {
    imgURL: '/icons/Home.svg',
    route: '/',
    label: 'Home',
  },

  {
    imgURL: '/icons/upcoming.svg',
    route: '/create',
    label: 'Blog',
  },
  {
    imgURL: '/icons/previous.svg',
    route: '/stories',
    label: 'Stories',
  },
];


