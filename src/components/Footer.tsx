import React from 'react';
import { Link } from 'react-scroll';
import { ArrowUp, Github, Linkedin, Twitter, Code2 } from 'lucide-react';
import { navItems } from '../data/navItems';
import { socialLinks } from '../data/social';

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
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div className="flex items-center mb-6 md:mb-0">
            <Code2 className="h-8 w-8 text-primary-400" />
            <span className="text-xl font-bold ml-2">
              Mayur<span className="text-primary-400">Chavhan</span>
            </span>
          </div>

          <div className="flex flex-wrap justify-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                spy={true}
                smooth={true}
                offset={-70}
                duration={500}
                className="text-gray-300 hover:text-primary-400 transition-colors cursor-pointer"
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="flex space-x-4 mt-6 md:mt-0">
            {socialLinks.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-gray-300 hover:text-primary-400 transition-colors"
                aria-label={link.name}
              >
                {getSocialIcon(link.icon)}
              </a>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            © {currentYear} Mayur Chavhan. All rights reserved.
          </p>
          <button
            onClick={scrollToTop}
            className="flex items-center text-gray-400 hover:text-primary-400 transition-colors"
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