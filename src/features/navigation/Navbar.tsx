import { ThemeToggle } from '@/shared/components';
import { navItems } from '@/shared/data/navItems';
import { Code2, Menu, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-scroll';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <header
      className={`fixed left-0 top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? 'dark:bg-dark-200/90 bg-white/90 py-3 shadow-md backdrop-blur-md'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto flex items-center justify-between px-4">
        <Link
          to="home"
          spy={true}
          smooth={true}
          offset={-70}
          duration={500}
          className="flex cursor-pointer items-center space-x-2"
        >
          <Code2 className="text-primary-600 dark:text-primary-400 h-8 w-8" />
          <span className="text-xl font-bold text-gray-900 dark:text-white">
            Mayur
            <span className="text-primary-600 dark:text-primary-400">
              Chavhan
            </span>
          </span>
        </Link>

        <div className="hidden items-center space-x-8 md:flex">
          <nav className="flex items-center space-x-6">
            {navItems.map(item => (
              <Link
                key={item.href}
                to={item.href}
                spy={true}
                smooth={true}
                offset={-70}
                duration={500}
                activeClass="active-nav-link"
                className="nav-link cursor-pointer"
              >
                {item.name}
              </Link>
            ))}
          </nav>
          <ThemeToggle />
          <a
            href="#"
            className="btn btn-primary"
            onClick={e => {
              e.preventDefault();
              const contactSection = document.getElementById('contact');
              if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          >
            Hire Me
          </a>
        </div>

        <div className="flex items-center space-x-4 md:hidden">
          <ThemeToggle />
          <button
            onClick={toggleMenu}
            className="hover:text-primary-600 dark:hover:text-primary-400 text-gray-700 focus:outline-none dark:text-gray-300"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`dark:bg-dark-200 absolute left-0 top-full w-full bg-white shadow-lg transition-all duration-300 ease-in-out md:hidden ${
          isOpen ? 'max-h-screen opacity-100' : 'invisible max-h-0 opacity-0'
        } overflow-hidden`}
      >
        <nav className="flex flex-col space-y-4 p-6">
          {navItems.map(item => (
            <Link
              key={item.href}
              to={item.href}
              spy={true}
              smooth={true}
              offset={-70}
              duration={500}
              activeClass="active-nav-link"
              className="nav-link cursor-pointer py-2 text-lg"
              onClick={closeMenu}
            >
              {item.name}
            </Link>
          ))}
          <a
            href="#"
            className="btn btn-primary mt-4 w-full text-center"
            onClick={e => {
              e.preventDefault();
              closeMenu();
              const contactSection = document.getElementById('contact');
              if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          >
            Hire Me
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
