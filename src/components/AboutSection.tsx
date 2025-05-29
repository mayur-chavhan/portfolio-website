import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Download, Award, Clock, Briefcase } from 'lucide-react';

const AboutSection: React.FC = () => {
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

  const stats = [
    {
      icon: <Clock className="w-8 h-8 text-primary-500" />,
      value: '6+',
      label: 'Years Experience',
    },
    {
      icon: <Briefcase className="w-8 h-8 text-primary-500" />,
      value: '50+',
      label: 'Projects Completed',
    },
    {
      icon: <Award className="w-8 h-8 text-primary-500" />,
      value: '15+',
      label: 'AWS Certifications',
    },
  ];

  return (
    <section id="about" className="py-20 bg-gray-50 dark:bg-dark-100">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="flex flex-col md:flex-row items-center gap-12"
        >
          <motion.div variants={itemVariants} className="w-full md:w-2/5">
            <div className="relative">
              <div className="w-full h-96 rounded-lg overflow-hidden shadow-xl">
                <img
                  src="https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                  alt="Mayur Chavhan at work"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary-600 rounded-lg flex items-center justify-center">
                <div className="text-center text-white">
                  <p className="text-3xl font-bold">6+</p>
                  <p className="text-sm">Years of Experience</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="w-full md:w-3/5">
            <h2 className="section-title mb-8">About Me</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6 text-lg">
              I'm a passionate DevOps Engineer and Cloud Architect with over 6 years of experience 
              in designing, implementing, and managing cloud infrastructure and CI/CD pipelines. 
              My expertise spans across AWS services, Kubernetes, Docker, and various automation tools.
            </p>
            <p className="text-gray-700 dark:text-gray-300 mb-8 text-lg">
              With a strong background in Linux administration and a keen interest in security best practices, 
              I help organizations build robust, scalable, and secure cloud-native applications. 
              I'm dedicated to implementing DevOps culture and practices that enable teams to deliver 
              high-quality software faster and more reliably.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white dark:bg-dark-200 p-6 rounded-lg shadow-md">
                  <div className="flex flex-col items-center text-center">
                    {stat.icon}
                    <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-4">{stat.value}</h3>
                    <p className="text-gray-600 dark:text-gray-400">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>

            <a
              href="/resume.pdf"
              className="btn btn-primary inline-flex items-center space-x-2"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Download size={18} />
              <span>Download Resume</span>
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;