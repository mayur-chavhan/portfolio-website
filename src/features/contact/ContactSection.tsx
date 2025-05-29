import { socialLinks } from '@/shared/data/social';
import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, MapPin, Phone, Twitter } from 'lucide-react';
import React, { useState } from 'react';
import { useInView } from 'react-intersection-observer';

const ContactSection: React.FC = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    success?: boolean;
    message?: string;
  }>({});

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus({
        success: true,
        message: 'Your message has been sent successfully!',
      });
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });

      // Clear success message after 5 seconds
      setTimeout(() => {
        setSubmitStatus({});
      }, 5000);
    }, 1500);
  };

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

  const getSocialIcon = (iconName: string) => {
    switch (iconName) {
      case 'github':
        return <Github size={20} />;
      case 'linkedin':
        return <Linkedin size={20} />;
      case 'twitter':
        return <Twitter size={20} />;
      default:
        return <Github size={20} />;
    }
  };

  return (
    <section id="contact" className="py-20">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <h2 className="section-title inline-block">Get In Touch</h2>
          <p className="mx-auto mt-8 max-w-2xl text-lg text-gray-600 dark:text-gray-400">
            Have a project in mind or want to discuss potential opportunities?
            Feel free to reach out!
          </p>
        </div>

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="flex flex-col gap-12 lg:flex-row"
        >
          <motion.div variants={itemVariants} className="w-full lg:w-1/3">
            <div className="dark:bg-dark-100 rounded-lg bg-white p-8 shadow-md">
              <h3 className="mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
                Contact Information
              </h3>

              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-lg p-3">
                    <Mail size={20} />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-sm font-semibold uppercase text-gray-500 dark:text-gray-400">
                      Email
                    </h4>
                    <a
                      href="mailto:contact@mayurchavhan.com"
                      className="hover:text-primary-600 dark:hover:text-primary-400 text-gray-700 transition-colors dark:text-gray-300"
                    >
                      contact@mayurchavhan.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-lg p-3">
                    <Phone size={20} />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-sm font-semibold uppercase text-gray-500 dark:text-gray-400">
                      Phone
                    </h4>
                    <a
                      href="tel:+1234567890"
                      className="hover:text-primary-600 dark:hover:text-primary-400 text-gray-700 transition-colors dark:text-gray-300"
                    >
                      +1 (234) 567-890
                    </a>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-lg p-3">
                    <MapPin size={20} />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-sm font-semibold uppercase text-gray-500 dark:text-gray-400">
                      Location
                    </h4>
                    <p className="text-gray-700 dark:text-gray-300">
                      Remote, Available Worldwide
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-10">
                <h4 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
                  Connect with me
                </h4>
                <div className="flex space-x-4">
                  {socialLinks.map((link, index) => (
                    <a
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="dark:bg-dark-200 hover:bg-primary-100 dark:hover:bg-primary-900/30 hover:text-primary-600 dark:hover:text-primary-400 rounded-full bg-gray-100 p-3 text-gray-700 transition-colors dark:text-gray-300"
                      aria-label={link.name}
                    >
                      {getSocialIcon(link.icon)}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="w-full lg:w-2/3">
            <div className="dark:bg-dark-100 rounded-lg bg-white p-8 shadow-md">
              <h3 className="mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
                Send Me a Message
              </h3>

              {submitStatus.message && (
                <div
                  className={`mb-6 rounded-lg p-4 ${
                    submitStatus.success
                      ? 'bg-success-50 text-success-700'
                      : 'bg-error-50 text-error-700'
                  }`}
                >
                  {submitStatus.message}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label
                      htmlFor="name"
                      className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="dark:bg-dark-200 focus:ring-primary-500 focus:border-primary-500 w-full rounded-lg border border-gray-300 bg-white p-3 text-gray-900 outline-none focus:ring-2 dark:border-gray-700 dark:text-white"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Your Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="dark:bg-dark-200 focus:ring-primary-500 focus:border-primary-500 w-full rounded-lg border border-gray-300 bg-white p-3 text-gray-900 outline-none focus:ring-2 dark:border-gray-700 dark:text-white"
                      required
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label
                    htmlFor="subject"
                    className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="dark:bg-dark-200 focus:ring-primary-500 focus:border-primary-500 w-full rounded-lg border border-gray-300 bg-white p-3 text-gray-900 outline-none focus:ring-2 dark:border-gray-700 dark:text-white"
                    required
                  />
                </div>

                <div className="mb-6">
                  <label
                    htmlFor="message"
                    className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    className="dark:bg-dark-200 focus:ring-primary-500 focus:border-primary-500 w-full resize-none rounded-lg border border-gray-300 bg-white p-3 text-gray-900 outline-none focus:ring-2 dark:border-gray-700 dark:text-white"
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactSection;
