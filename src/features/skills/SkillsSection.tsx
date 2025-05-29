import { skillCategories } from '@/shared/data/skills';
import { motion } from 'framer-motion';
import { Cloud, Code, Database, Layers } from 'lucide-react';
import React from 'react';
import { useInView } from 'react-intersection-observer';

const SkillsSection: React.FC = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
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

  const getCategoryIcon = (name: string) => {
    switch (name) {
      case 'DevOps Tools':
        return <Layers className="text-primary-500 h-8 w-8" />;
      case 'Cloud Platforms':
        return <Cloud className="text-primary-500 h-8 w-8" />;
      case 'Programming':
        return <Code className="text-primary-500 h-8 w-8" />;
      case 'Infrastructure & Automation':
        return <Database className="text-primary-500 h-8 w-8" />;
      default:
        return <Code className="text-primary-500 h-8 w-8" />;
    }
  };

  return (
    <section id="skills" className="py-20">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <h2 className="section-title inline-block">Skills & Expertise</h2>
          <p className="mx-auto mt-8 max-w-2xl text-lg text-gray-600 dark:text-gray-400">
            I've worked with a wide range of technologies and tools throughout
            my career. Here's a breakdown of my technical expertise and
            proficiency levels.
          </p>
        </div>

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 gap-8 md:grid-cols-2"
        >
          {skillCategories.map((category, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="card p-8 transition-transform hover:translate-y-[-5px]"
            >
              <div className="mb-6 flex items-center">
                {getCategoryIcon(category.name)}
                <h3 className="ml-3 text-xl font-semibold text-gray-900 dark:text-white">
                  {category.name}
                </h3>
              </div>

              <div className="space-y-6">
                {category.skills.map((skill, skillIndex) => (
                  <div key={skillIndex}>
                    <div className="mb-2 flex justify-between">
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        {skill.name}
                      </span>
                      <span className="text-gray-600 dark:text-gray-400">
                        {skill.level}%
                      </span>
                    </div>
                    <div className="dark:bg-dark-300 h-2.5 w-full rounded-full bg-gray-200">
                      <motion.div
                        className="bg-primary-600 h-2.5 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: inView ? `${skill.level}%` : 0 }}
                        transition={{
                          duration: 1,
                          delay: 0.2 + skillIndex * 0.1,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default SkillsSection;
