import React, { useState, useEffect } from 'react';
import { Link } from 'react-scroll';
import { Menu, X, Code2 } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { navItems } from '../data/navItems';

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
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/90 dark:bg-dark-200/90 backdrop-blur-md shadow-md py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link
          to="home"
          spy={true}
          smooth={true}
          offset={-70}
          duration={500}
          className="flex items-center space-x-2 cursor-pointer"
        >
          <Code2 className="h-8 w-8 text-primary-600 dark:text-primary-400" />
          <span className="text-xl font-bold text-gray-900 dark:text-white">
            Mayur<span className="text-primary-600 dark:text-primary-400">Chavhan</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center space-x-8">
          <nav className="flex items-center space-x-6">
            {navItems.map((item) => (
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
            onClick={(e) => {
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
            className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 focus:outline-none"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden absolute top-full left-0 w-full bg-white dark:bg-dark-200 shadow-lg transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 invisible'
        } overflow-hidden`}
      >
        <nav className="flex flex-col space-y-4 p-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              spy={true}
              smooth={true}
              offset={-70}
              duration={500}
              activeClass="active-nav-link"
              className="nav-link text-lg py-2 cursor-pointer"
              onClick={closeMenu}
            >
              {item.name}
            </Link>
          ))}
          <a
            href="#"
            className="btn btn-primary w-full text-center mt-4"
            onClick={(e) => {
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