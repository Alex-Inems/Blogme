// components/Footer.tsx
import { COPYRIGHT_TEXT, SOCIAL_LINKS } from '../Commons/constants';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white p-4 ">
      <div className="container  text-center">
        <p>{COPYRIGHT_TEXT}</p>
        
      </div>
    </footer>
  );
};

export default Footer;
