export interface NavItem {
  name: string;
  href: string;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  tags: string[];
  githubUrl: string;
  demoUrl?: string;
}

export interface Skill {
  name: string;
  icon: string;
  level: number;
}

export interface SkillCategory {
  name: string;
  skills: Skill[];
}

export interface TimelineItem {
  id: number;
  company: string;
  position: string;
  duration: string;
  description: string;
  logo: string;
  achievements: string[];
  technologies: string[];
}

export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  url: string;
  date: string;
  readTime: string;
  category: string;
}

export interface SocialLink {
  name: string;
  url: string;
  icon: string;
}
