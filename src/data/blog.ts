import { BlogPost } from '../types';

export const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: 'Kubernetes Best Practices for Production Environments',
    excerpt: 'Essential practices for running reliable and secure Kubernetes clusters in production.',
    image: 'https://images.pexels.com/photos/1181271/pexels-photo-1181271.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    url: 'https://techwhale.in/kubernetes-best-practices',
    date: 'Apr 10, 2023',
    readTime: '8 min read',
    category: 'Kubernetes',
  },
  {
    id: 2,
    title: 'Terraform Module Design Patterns',
    excerpt: 'Learn how to structure your Terraform code for maintainability and reusability.',
    image: 'https://images.pexels.com/photos/577585/pexels-photo-577585.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    url: 'https://techwhale.in/terraform-modules',
    date: 'Mar 15, 2023',
    readTime: '10 min read',
    category: 'Infrastructure as Code',
  },
  {
    id: 3,
    title: 'Implementing GitOps with ArgoCD',
    excerpt: 'A comprehensive guide to GitOps practices using ArgoCD and Kubernetes.',
    image: 'https://images.pexels.com/photos/1148820/pexels-photo-1148820.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    url: 'https://techwhale.in/gitops-argocd',
    date: 'Feb 28, 2023',
    readTime: '12 min read',
    category: 'DevOps',
  },
  {
    id: 4,
    title: 'AWS Cost Optimization Strategies',
    excerpt: 'Practical strategies to reduce your AWS bill without sacrificing performance.',
    image: 'https://images.pexels.com/photos/730547/pexels-photo-730547.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    url: 'https://techwhale.in/aws-cost-optimization',
    date: 'Jan 20, 2023',
    readTime: '7 min read',
    category: 'Cloud',
  },
];