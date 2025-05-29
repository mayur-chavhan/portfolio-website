import { TimelineItem } from '../types';

export const timelineItems: TimelineItem[] = [
  {
    id: 1,
    company: 'Cloud Solutions Inc.',
    position: 'Senior DevOps Engineer',
    duration: 'Jan 2022 - Present',
    description: 'Leading DevOps initiatives and cloud architecture for enterprise clients.',
    logo: 'https://images.pexels.com/photos/2068664/pexels-photo-2068664.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    achievements: [
      'Reduced deployment time by 75% through implementation of GitOps workflows',
      'Architected multi-region AWS infrastructure serving millions of users',
      'Led migration of 50+ applications to Kubernetes',
      'Implemented cost optimization strategies saving $200K annually',
    ],
    technologies: ['AWS', 'Kubernetes', 'Terraform', 'ArgoCD', 'Jenkins', 'Docker'],
  },
  {
    id: 2,
    company: 'TechInnovate',
    position: 'DevOps Engineer',
    duration: 'Mar 2019 - Dec 2021',
    description: 'Managed cloud infrastructure and CI/CD pipelines for SaaS products.',
    logo: 'https://images.pexels.com/photos/753695/pexels-photo-753695.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    achievements: [
      'Built automated CI/CD pipelines for 30+ microservices',
      'Implemented infrastructure as code using Terraform across AWS accounts',
      'Developed monitoring and alerting system with Prometheus and Grafana',
      'Reduced infrastructure costs by 35% through right-sizing and spot instances',
    ],
    technologies: ['AWS', 'Docker', 'Terraform', 'Jenkins', 'Python', 'Prometheus'],
  },
  {
    id: 3,
    company: 'Global Systems Ltd',
    position: 'Systems Administrator',
    duration: 'Jun 2017 - Feb 2019',
    description: 'Managed on-premises infrastructure and led cloud migration initiatives.',
    logo: 'https://images.pexels.com/photos/1181271/pexels-photo-1181271.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    achievements: [
      'Migrated legacy applications to AWS cloud infrastructure',
      'Implemented automation for routine maintenance tasks',
      'Reduced system downtime by 80% through redundancy improvements',
      'Managed Linux server fleet of 100+ machines',
    ],
    technologies: ['Linux', 'AWS', 'Ansible', 'Bash', 'Monitoring Tools'],
  },
];