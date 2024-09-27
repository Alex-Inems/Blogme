// components/Footer.tsx
import { COPYRIGHT_TEXT, SOCIAL_LINKS } from '../Commons/constants';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white p-4 mt-10">
      <div className="container  text-center">
        <p>{COPYRIGHT_TEXT}</p>
        <div className="flex justify-center space-x-4 mt-4">
          <a href={SOCIAL_LINKS.twitter} target="_blank" rel="noopener noreferrer">Twitter</a>
          <a href={SOCIAL_LINKS.github} target="_blank" rel="noopener noreferrer">GitHub</a>
          <a href={SOCIAL_LINKS.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
