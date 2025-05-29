import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { timelineItems } from '../data/experience';
import { ChevronRight } from 'lucide-react';

const ExperienceSection: React.FC = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <section id="experience" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="section-title inline-block">Professional Experience</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-8 max-w-2xl mx-auto text-lg">
            My career journey in DevOps, Cloud Architecture, and System Administration.
          </p>
        </div>

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="relative"
        >
          {/* Timeline line */}
          <div className="absolute top-0 bottom-0 left-6 md:left-1/2 w-px bg-gray-300 dark:bg-gray-700 transform md:translate-x-[-0.5px]"></div>

          {timelineItems.map((item, index) => {
            const isEven = index % 2 === 0;
            
            return (
              <motion.div
                key={item.id}
                variants={itemVariants}
                className={`relative flex flex-col md:flex-row mb-12 ${
                  isEven ? 'md:flex-row-reverse' : ''
                }`}
              >
                {/* Timeline dot */}
                <div className="absolute left-6 md:left-1/2 w-3 h-3 rounded-full bg-primary-600 transform translate-x-[-6px] md:translate-x-[-6px] mt-2"></div>

                {/* Content */}
                <div className="w-full md:w-1/2 md:px-8">
                  <div
                    className={`bg-white dark:bg-dark-100 p-6 rounded-lg shadow-md border-l-4 border-primary-600 ${
                      isEven ? 'md:ml-auto' : ''
                    }`}
                  >
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 bg-gray-200">
                        <img
                          src={item.logo}
                          alt={item.company}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                          {item.position}
                        </h3>
                        <p className="text-primary-600 dark:text-primary-400 font-medium">
                          {item.company}
                        </p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <span className="text-sm font-medium px-3 py-1 rounded-full bg-gray-100 dark:bg-dark-200 text-gray-700 dark:text-gray-300">
                        {item.duration}
                      </span>
                    </div>

                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {item.description}
                    </p>

                    <div className="mb-4">
                      <h4 className="text-sm font-semibold uppercase text-gray-500 dark:text-gray-400 mb-2">
                        Key Achievements
                      </h4>
                      <ul className="space-y-2">
                        {item.achievements.map((achievement, i) => (
                          <li key={i} className="flex items-start">
                            <ChevronRight className="h-5 w-5 text-primary-600 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-600 dark:text-gray-400 ml-2">
                              {achievement}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold uppercase text-gray-500 dark:text-gray-400 mb-2">
                        Technologies Used
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {item.technologies.map((tech, i) => (
                          <span
                            key={i}
                            className="inline-block px-3 py-1 text-xs rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default ExperienceSection;