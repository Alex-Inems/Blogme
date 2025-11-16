// components/Footer.tsx
import Link from 'next/link';
import { COPYRIGHT_TEXT, COMPANY_INFO, SOCIAL_LINKS, FOOTER_LINKS } from '../Commons/constants';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-zinc-900 border-t border-gray-200 dark:border-zinc-800">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-medium text-gray-900 dark:text-zinc-50 mb-3">{COMPANY_INFO.name}</h3>
            <p className="text-sm text-gray-600 dark:text-zinc-400 mb-4">
              {COMPANY_INFO.description}
            </p>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 dark:text-zinc-50 mb-3">Company</h4>
            <ul className="space-y-2">
              {FOOTER_LINKS.company.map((link) => (
                <li key={link.path}>
                  <Link
                    href={link.path}
                    className="text-sm text-gray-600 dark:text-zinc-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 dark:text-zinc-50 mb-3">Support</h4>
            <ul className="space-y-2">
              {FOOTER_LINKS.support.map((link) => (
                <li key={link.path}>
                  <Link
                    href={link.path}
                    className="text-sm text-gray-600 dark:text-zinc-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 dark:text-zinc-50 mb-3">Resources</h4>
            <ul className="space-y-2">
              {FOOTER_LINKS.resources.map((link) => (
                <li key={link.path}>
                  <Link
                    href={link.path}
                    className="text-sm text-gray-600 dark:text-zinc-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-6 border-t border-gray-200 dark:border-zinc-800">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div className="text-sm text-gray-500 dark:text-zinc-400">
              {COPYRIGHT_TEXT}
            </div>

            <div className="flex space-x-6">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 dark:text-zinc-500 hover:text-orange-600 dark:hover:text-orange-400 transition-colors duration-200"
                  aria-label={`Follow us on ${social.name}`}
                >
                  <span className="text-sm">{social.name}</span>
                </a>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-zinc-800">
            <div className="flex flex-wrap justify-center space-x-6 text-xs text-gray-500 dark:text-zinc-400">
              {FOOTER_LINKS.legal.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors duration-200"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
