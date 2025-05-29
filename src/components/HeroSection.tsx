import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-scroll';
import { TypeAnimation } from 'react-type-animation';
import { Download, ArrowRight } from 'lucide-react';
import ParticlesBackground from './ParticlesBackground';

const HeroSection: React.FC = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center">
      <div className="absolute inset-0 z-0">
        <ParticlesBackground />
      </div>
      <div className="container mx-auto px-4 z-10">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <motion.div 
            className="w-full md:w-3/5 md:pr-8 mb-12 md:mb-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.p 
              className="text-lg md:text-xl text-primary-600 dark:text-primary-400 font-medium mb-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              Hello, I'm
            </motion.p>
            <motion.h1 
              className="text-4xl md:text-6xl font-bold mb-6 text-gray-900 dark:text-white"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              Mayur Chavhan
            </motion.h1>
            <motion.div 
              className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-8 h-12"
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
              className="text-gray-600 dark:text-gray-400 text-lg mb-8 max-w-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              I architect and automate cloud infrastructure with a focus on reliability, 
              scalability, and security. Passionate about DevOps culture and 
              building efficient CI/CD pipelines.
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
                className="btn btn-outline flex items-center space-x-2 cursor-pointer"
              >
                <span>View Projects</span>
                <ArrowRight size={18} />
              </Link>
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="w-full md:w-2/5 flex justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-primary-500 shadow-xl">
              <img 
                src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                alt="Mayur Chavhan" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary-900/40 to-transparent"></div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;