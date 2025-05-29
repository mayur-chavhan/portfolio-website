import { timelineItems } from '@/shared/data/experience';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import React from 'react';
import { useInView } from 'react-intersection-observer';

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
        <div className="mb-16 text-center">
          <h2 className="section-title inline-block">
            Professional Experience
          </h2>
          <p className="mx-auto mt-8 max-w-2xl text-lg text-gray-600 dark:text-gray-400">
            My career journey in DevOps, Cloud Architecture, and System
            Administration.
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
          <div className="absolute bottom-0 left-6 top-0 w-px transform bg-gray-300 md:left-1/2 md:translate-x-[-0.5px] dark:bg-gray-700"></div>

          {timelineItems.map((item, index) => {
            const isEven = index % 2 === 0;

            return (
              <motion.div
                key={item.id}
                variants={itemVariants}
                className={`relative mb-12 flex flex-col md:flex-row ${
                  isEven ? 'md:flex-row-reverse' : ''
                }`}
              >
                {/* Timeline dot */}
                <div className="bg-primary-600 absolute left-6 mt-2 h-3 w-3 translate-x-[-6px] transform rounded-full md:left-1/2 md:translate-x-[-6px]"></div>

                {/* Content */}
                <div className="w-full md:w-1/2 md:px-8">
                  <div
                    className={`dark:bg-dark-100 border-primary-600 rounded-lg border-l-4 bg-white p-6 shadow-md ${
                      isEven ? 'md:ml-auto' : ''
                    }`}
                  >
                    <div className="mb-4 flex items-center">
                      <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-full bg-gray-200">
                        <img
                          src={item.logo}
                          alt={item.company}
                          className="h-full w-full object-cover"
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
                      <span className="dark:bg-dark-200 rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                        {item.duration}
                      </span>
                    </div>

                    <p className="mb-4 text-gray-600 dark:text-gray-400">
                      {item.description}
                    </p>

                    <div className="mb-4">
                      <h4 className="mb-2 text-sm font-semibold uppercase text-gray-500 dark:text-gray-400">
                        Key Achievements
                      </h4>
                      <ul className="space-y-2">
                        {item.achievements.map((achievement, i) => (
                          <li key={i} className="flex items-start">
                            <ChevronRight className="text-primary-600 mt-0.5 h-5 w-5 flex-shrink-0" />
                            <span className="ml-2 text-gray-600 dark:text-gray-400">
                              {achievement}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="mb-2 text-sm font-semibold uppercase text-gray-500 dark:text-gray-400">
                        Technologies Used
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {item.technologies.map((tech, i) => (
                          <span
                            key={i}
                            className="bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300 inline-block rounded-full px-3 py-1 text-xs"
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
