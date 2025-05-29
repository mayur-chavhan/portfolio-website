import { navItems } from '@/shared/data/navItems';
import { socialLinks } from '@/shared/data/social';
import { ArrowUp, Code2, Github, Linkedin, Twitter } from 'lucide-react';
import React from 'react';
import { Link } from 'react-scroll';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const getSocialIcon = (iconName: string) => {
    switch (iconName) {
      case 'github':
        return <Github size={18} />;
      case 'linkedin':
        return <Linkedin size={18} />;
      case 'twitter':
        return <Twitter size={18} />;
      default:
        return <Github size={18} />;
    }
  };

  return (
    <footer className="bg-gray-900 py-12 text-white">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex flex-col items-center justify-between md:flex-row">
          <div className="mb-6 flex items-center md:mb-0">
            <Code2 className="text-primary-400 h-8 w-8" />
            <span className="ml-2 text-xl font-bold">
              Mayur<span className="text-primary-400">Chavhan</span>
            </span>
          </div>

          <div className="flex flex-wrap justify-center gap-6">
            {navItems.map(item => (
              <Link
                key={item.href}
                to={item.href}
                spy={true}
                smooth={true}
                offset={-70}
                duration={500}
                className="hover:text-primary-400 cursor-pointer text-gray-300 transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="mt-6 flex space-x-4 md:mt-0">
            {socialLinks.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary-400 p-2 text-gray-300 transition-colors"
                aria-label={link.name}
              >
                {getSocialIcon(link.icon)}
              </a>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center justify-between border-t border-gray-800 pt-8 md:flex-row">
          <p className="mb-4 text-sm text-gray-400 md:mb-0">
            © {currentYear} Mayur Chavhan. All rights reserved.
          </p>
          <button
            onClick={scrollToTop}
            className="hover:text-primary-400 flex items-center text-gray-400 transition-colors"
          >
            <span className="mr-2">Back to Top</span>
            <ArrowUp size={16} />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
