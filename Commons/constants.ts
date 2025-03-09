// utils/constants.ts

export const SITE_NAME = "Blogme";
export const SITE_DESCRIPTION = "Showcasing you to the world";
export const COPYRIGHT_TEXT = `© ${new Date().getFullYear()} Blogme. All rights reserved.`;
export const BASE_URL = "https://blogme.africa";


// Navigation Links
export const NAV_LINKS = [
  { label: "Home", path: "/" },
  { label: "About", path: "/about" },
  { label: "Blog", path: "/blog" },
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


