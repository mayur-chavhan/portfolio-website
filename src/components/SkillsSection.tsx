import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Database, Cloud, Code, Layers } from 'lucide-react';
import { skillCategories } from '../data/skills';

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
        return <Layers className="w-8 h-8 text-primary-500" />;
      case 'Cloud Platforms':
        return <Cloud className="w-8 h-8 text-primary-500" />;
      case 'Programming':
        return <Code className="w-8 h-8 text-primary-500" />;
      case 'Infrastructure & Automation':
        return <Database className="w-8 h-8 text-primary-500" />;
      default:
        return <Code className="w-8 h-8 text-primary-500" />;
    }
  };

  return (
    <section id="skills" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="section-title inline-block">Skills & Expertise</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-8 max-w-2xl mx-auto text-lg">
            I've worked with a wide range of technologies and tools throughout my career.
            Here's a breakdown of my technical expertise and proficiency levels.
          </p>
        </div>

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {skillCategories.map((category, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="card p-8 transition-transform hover:translate-y-[-5px]"
            >
              <div className="flex items-center mb-6">
                {getCategoryIcon(category.name)}
                <h3 className="text-xl font-semibold ml-3 text-gray-900 dark:text-white">
                  {category.name}
                </h3>
              </div>

              <div className="space-y-6">
                {category.skills.map((skill, skillIndex) => (
                  <div key={skillIndex}>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-700 dark:text-gray-300 font-medium">
                        {skill.name}
                      </span>
                      <span className="text-gray-600 dark:text-gray-400">
                        {skill.level}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-dark-300 rounded-full h-2.5">
                      <motion.div
                        className="bg-primary-600 h-2.5 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: inView ? `${skill.level}%` : 0 }}
                        transition={{ duration: 1, delay: 0.2 + skillIndex * 0.1 }}
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