import React, { useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import SkillsSection from './components/SkillsSection';
import ProjectsSection from './components/ProjectsSection';
import ExperienceSection from './components/ExperienceSection';
import BlogSection from './components/BlogSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';

function App() {
  useEffect(() => {
    // Update page title
    document.title = 'Mayur Chavhan | DevOps Engineer & Cloud Architect';
    
    // Add schema markup for SEO
    const schemaScript = document.createElement('script');
    schemaScript.type = 'application/ld+json';
    schemaScript.innerHTML = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Person',
      'name': 'Mayur Chavhan',
      'url': 'https://mayurchavhan.com',
      'jobTitle': 'DevOps Engineer & Cloud Architect',
      'worksFor': {
        '@type': 'Organization',
        'name': 'Cloud Solutions Inc.'
      },
      'sameAs': [
        'https://github.com/mayurchavhan',
        'https://linkedin.com/in/mayurchavhan',
        'https://twitter.com/mayurchavhan'
      ],
      'description': 'DevOps Engineer and Cloud Architect specializing in AWS, Kubernetes, and Automation.'
    });
    document.head.appendChild(schemaScript);

    return () => {
      document.head.removeChild(schemaScript);
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <HeroSection />
        <AboutSection />
        <SkillsSection />
        <ProjectsSection />
        <ExperienceSection />
        <BlogSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}

export default App;