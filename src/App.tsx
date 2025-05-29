import { env } from '@/config/env';
import {
  AboutSection,
  BlogSection,
  ContactSection,
  DevTools,
  ExperienceSection,
  Footer,
  HeroSection,
  Navbar,
  ProjectsSection,
  SkillsSection,
} from '@/features';
import { ErrorBoundary } from '@/shared/components';
import { errorTracker, performanceTracker } from '@/shared/utils';
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    // Initialize monitoring and error tracking
    const initializeMonitoring = async () => {
      try {
        await errorTracker.initialize();
        await performanceTracker.initialize();

        // Set user context for error tracking
        errorTracker.setUserContext('anonymous', {
          environment: env.NODE_ENV,
          version: env.APP_VERSION,
        });
      } catch (error) {
        console.error('Failed to initialize monitoring:', error);
      }
    };

    initializeMonitoring();

    // Update page title
    document.title = 'Mayur Chavhan | DevOps Engineer & Cloud Architect';

    // Add schema markup for SEO
    const schemaScript = document.createElement('script');
    schemaScript.type = 'application/ld+json';
    schemaScript.innerHTML = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: 'Mayur Chavhan',
      url: 'https://mayurchavhan.com',
      jobTitle: 'DevOps Engineer & Cloud Architect',
      worksFor: {
        '@type': 'Organization',
        name: 'Cloud Solutions Inc.',
      },
      sameAs: [env.GITHUB_URL, env.LINKEDIN_URL, env.TWITTER_URL],
      description: env.APP_DESCRIPTION,
    });
    document.head.appendChild(schemaScript);

    return () => {
      // Cleanup
      if (document.head.contains(schemaScript)) {
        document.head.removeChild(schemaScript);
      }
    };
  }, []);

  return (
    <ErrorBoundary>
      <div className="flex min-h-screen flex-col">
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

        {/* Development Tools */}
        <DevTools />
      </div>
    </ErrorBoundary>
  );
}

export default App;
