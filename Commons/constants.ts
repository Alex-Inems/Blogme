// utils/constants.ts

export const SITE_NAME = "My Blog";
export const SITE_DESCRIPTION = "A blog about coding, JavaScript, React, and more.";
export const COPYRIGHT_TEXT = `© ${new Date().getFullYear()} My Blog. All rights reserved.`;
export const BASE_URL = "https://myblog.com";

// Social Media Links
export const SOCIAL_LINKS = {
  twitter: "https://twitter.com/myblog",
  github: "https://github.com/myblog",
  linkedin: "https://linkedin.com/in/myblog"
};

// Navigation Links
export const NAV_LINKS = [
  { label: "Home", path: "/" },
  { label: "About", path: "/about" },
  { label: "Blog", path: "/blog" },
  { label: "Contact", path: "/contact" }
];

// Categories
export const CATEGORIES = [
  { name: "JavaScript", path: "/category/javascript" },
  { name: "React", path: "/category/react" },
  { name: "Next.js", path: "/category/nextjs" },
  { name: "CSS", path: "/category/css" },
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
  {
    imgURL: '/icons/Video.svg',
    route: '/recordings',
    label: 'Recordings',
  },
  {
    imgURL: '/icons/add-personal.svg',
    route: '/personal-room',
    label: 'Personal Room',
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

export const avatarImages = [
  '/images/avatar-1.jpeg',
  '/images/avatar-2.jpeg',
  '/images/avatar-3.png',
  '/images/avatar-4.png',
  '/images/avatar-5.png',
];

