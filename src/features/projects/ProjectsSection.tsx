import { projects } from '@/shared/data/projects';
import { motion } from 'framer-motion';
import { ExternalLink, Github } from 'lucide-react';
import React, { useState } from 'react';
import { useInView } from 'react-intersection-observer';

const ProjectsSection: React.FC = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [activeFilter, setActiveFilter] = useState<string>('all');

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

  // Get unique tags for filtering
  const allTags = ['all'];
  projects.forEach(project => {
    project.tags.forEach(tag => {
      if (!allTags.includes(tag)) {
        allTags.push(tag);
      }
    });
  });

  // Filter projects based on active tag
  const filteredProjects =
    activeFilter === 'all'
      ? projects
      : projects.filter(project => project.tags.includes(activeFilter));

  return (
    <section id="projects" className="dark:bg-dark-100 bg-gray-50 py-20">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <h2 className="section-title inline-block">Featured Projects</h2>
          <p className="mx-auto mt-8 max-w-2xl text-lg text-gray-600 dark:text-gray-400">
            Here are some of my notable projects that showcase my skills and
            expertise in DevOps, Cloud Architecture, and Automation.
          </p>
        </div>

        <div className="mb-12 flex flex-wrap justify-center gap-2">
          {allTags.map((tag, index) => (
            <button
              key={index}
              onClick={() => setActiveFilter(tag)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors duration-300 ${
                activeFilter === tag
                  ? 'bg-primary-600 text-white'
                  : 'dark:bg-dark-200 dark:hover:bg-dark-300 bg-gray-200 text-gray-700 hover:bg-gray-300 dark:text-gray-300'
              }`}
            >
              {tag.charAt(0).toUpperCase() + tag.slice(1)}
            </button>
          ))}
        </div>

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
        >
          {filteredProjects.map(project => (
            <motion.div
              key={project.id}
              variants={itemVariants}
              className="card group overflow-hidden"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="from-dark-300/80 absolute inset-0 bg-gradient-to-t to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4 flex gap-2">
                  {project.tags.slice(0, 3).map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="bg-primary-600/80 rounded px-2 py-1 text-xs text-white"
                    >
                      {tag}
                    </span>
                  ))}
                  {project.tags.length > 3 && (
                    <span className="rounded bg-gray-700/80 px-2 py-1 text-xs text-white">
                      +{project.tags.length - 3}
                    </span>
                  )}
                </div>
              </div>
              <div className="p-6">
                <h3 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">
                  {project.title}
                </h3>
                <p className="mb-4 text-gray-600 dark:text-gray-400">
                  {project.description}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex space-x-3">
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-primary-600 dark:hover:text-primary-400 p-2 text-gray-700 transition-colors dark:text-gray-300"
                      aria-label="GitHub Repository"
                    >
                      <Github size={20} />
                    </a>
                    {project.demoUrl && (
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-primary-600 dark:hover:text-primary-400 p-2 text-gray-700 transition-colors dark:text-gray-300"
                        aria-label="Live Demo"
                      >
                        <ExternalLink size={20} />
                      </a>
                    )}
                  </div>
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 dark:text-primary-400 font-medium hover:underline"
                  >
                    View Details
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ProjectsSection;
