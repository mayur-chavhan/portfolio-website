import { blogPosts } from '@/shared/data/blog';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, Clock } from 'lucide-react';
import React from 'react';
import { useInView } from 'react-intersection-observer';

const BlogSection: React.FC = () => {
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

  return (
    <section id="blog" className="dark:bg-dark-100 bg-white py-20">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          <motion.div variants={itemVariants} className="mb-16 text-center">
            <h2 className="section-title mb-4">Latest Blog Posts</h2>
            <p className="mx-auto max-w-3xl text-xl text-gray-600 dark:text-gray-400">
              Sharing insights, tutorials, and best practices in DevOps, Cloud
              Architecture, and modern development workflows.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {blogPosts && blogPosts.length > 0 ? (
              blogPosts.slice(0, 6).map(post => (
                <motion.article
                  key={post.id}
                  variants={itemVariants}
                  className="dark:bg-dark-200 overflow-hidden rounded-lg bg-gray-50 shadow-lg transition-shadow duration-300 hover:shadow-xl"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                    <div className="absolute left-4 top-4">
                      <span className="bg-primary-600 rounded-full px-3 py-1 text-sm font-medium text-white">
                        {post.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="mb-3 flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <Calendar size={16} className="mr-2" />
                      <span>{post.date}</span>
                      <Clock size={16} className="ml-4 mr-2" />
                      <span>{post.readTime}</span>
                    </div>

                    <h3 className="mb-3 line-clamp-2 text-xl font-bold text-gray-900 dark:text-white">
                      {post.title}
                    </h3>

                    <p className="mb-4 line-clamp-3 text-gray-600 dark:text-gray-400">
                      {post.excerpt}
                    </p>

                    <div className="mb-4 flex flex-wrap gap-2">
                      {post.tags &&
                        post.tags.length > 0 &&
                        post.tags.slice(0, 3).map(tag => (
                          <span
                            key={tag}
                            className="dark:bg-dark-300 rounded bg-gray-200 px-2 py-1 text-xs text-gray-700 dark:text-gray-300"
                          >
                            {tag}
                          </span>
                        ))}
                    </div>

                    <a
                      href={post.url}
                      className="text-primary-600 hover:text-primary-700 inline-flex items-center font-medium transition-colors duration-200"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Read More
                      <ArrowRight size={16} className="ml-2" />
                    </a>
                  </div>
                </motion.article>
              ))
            ) : (
              <motion.div
                variants={itemVariants}
                className="col-span-full py-12 text-center"
              >
                <p className="text-gray-600 dark:text-gray-400">
                  No blog posts available at the moment.
                </p>
              </motion.div>
            )}
          </div>

          <motion.div variants={itemVariants} className="mt-12 text-center">
            <a
              href="/blog"
              className="btn btn-outline inline-flex items-center space-x-2"
            >
              <span>View All Posts</span>
              <ArrowRight size={18} />
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default BlogSection;
