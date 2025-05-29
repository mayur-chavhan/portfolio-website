import { ParticlesBackground } from '@/shared/components';
import { motion } from 'framer-motion';
import { ArrowRight, Download } from 'lucide-react';
import React from 'react';
import { Link } from 'react-scroll';
import { TypeAnimation } from 'react-type-animation';

const HeroSection: React.FC = () => {
  return (
    <section id="home" className="relative flex min-h-screen items-center">
      <div className="absolute inset-0 z-0">
        <ParticlesBackground />
      </div>
      <div className="container z-10 mx-auto px-4">
        <div className="flex flex-col items-center justify-between md:flex-row">
          <motion.div
            className="mb-12 w-full md:mb-0 md:w-3/5 md:pr-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.p
              className="text-primary-600 dark:text-primary-400 mb-3 text-lg font-medium md:text-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              Hello, I'm
            </motion.p>
            <motion.h1
              className="mb-6 text-4xl font-bold text-gray-900 md:text-6xl dark:text-white"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              Mayur Chavhan
            </motion.h1>
            <motion.div
              className="mb-8 h-12 text-xl text-gray-700 md:text-2xl dark:text-gray-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <TypeAnimation
                sequence={[
                  'DevOps Engineer',
                  2000,
                  'Cloud Architect',
                  2000,
                  'Automation Specialist',
                  2000,
                ]}
                wrapper="span"
                speed={50}
                repeat={Infinity}
                className="font-medium"
              />
            </motion.div>
            <motion.p
              className="mb-8 max-w-xl text-lg text-gray-600 dark:text-gray-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              I architect and automate cloud infrastructure with a focus on
              reliability, scalability, and security. Passionate about DevOps
              culture and building efficient CI/CD pipelines.
            </motion.p>
            <motion.div
              className="flex flex-wrap gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <a
                href="/resume.pdf"
                className="btn btn-primary flex items-center space-x-2"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Download size={18} />
                <span>Download Resume</span>
              </a>
              <Link
                to="projects"
                spy={true}
                smooth={true}
                offset={-70}
                duration={500}
                className="btn btn-outline flex cursor-pointer items-center space-x-2"
              >
                <span>View Projects</span>
                <ArrowRight size={18} />
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            className="flex w-full justify-center md:w-2/5"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            <div className="border-primary-500 relative h-64 w-64 overflow-hidden rounded-full border-4 shadow-xl md:h-80 md:w-80">
              <img
                src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                alt="Mayur Chavhan"
                className="h-full w-full object-cover"
              />
              <div className="from-primary-900/40 absolute inset-0 bg-gradient-to-t to-transparent"></div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
