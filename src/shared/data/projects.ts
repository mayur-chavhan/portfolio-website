import { Project } from '@/shared/types';

export const projects: Project[] = [
  {
    id: 1,
    title: 'AWS Multi-Account Infrastructure',
    description:
      'Automated AWS infrastructure deployment across multiple accounts using Terraform and CI/CD pipelines.',
    image:
      'https://images.pexels.com/photos/1148820/pexels-photo-1148820.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    tags: ['AWS', 'Terraform', 'CI/CD', 'CloudFormation'],
    githubUrl: 'https://github.com/mayurchavhan/aws-multi-account',
    demoUrl: 'https://demo.mayurchavhan.com/aws-multi-account',
  },
  {
    id: 2,
    title: 'Kubernetes Monitoring Stack',
    description:
      'Complete monitoring solution for Kubernetes clusters using Prometheus, Grafana, and Alertmanager.',
    image:
      'https://images.pexels.com/photos/1181271/pexels-photo-1181271.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    tags: ['Kubernetes', 'Prometheus', 'Grafana', 'Helm'],
    githubUrl: 'https://github.com/mayurchavhan/k8s-monitoring',
  },
  {
    id: 3,
    title: 'GitOps CI/CD Pipeline',
    description:
      'Implemented GitOps workflow with ArgoCD and Jenkins for continuous deployment to Kubernetes.',
    image:
      'https://images.pexels.com/photos/577585/pexels-photo-577585.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    tags: ['GitOps', 'ArgoCD', 'Jenkins', 'Kubernetes'],
    githubUrl: 'https://github.com/mayurchavhan/gitops-pipeline',
    demoUrl: 'https://demo.mayurchavhan.com/gitops',
  },
  {
    id: 4,
    title: 'Cloud Cost Optimization Tool',
    description:
      'Tool to analyze and optimize AWS cloud costs using Lambda functions and DynamoDB.',
    image:
      'https://images.pexels.com/photos/730547/pexels-photo-730547.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    tags: ['AWS', 'Lambda', 'DynamoDB', 'Python'],
    githubUrl: 'https://github.com/mayurchavhan/cloud-cost-optimizer',
  },
  {
    id: 5,
    title: 'Infrastructure as Code Framework',
    description:
      'Custom framework for managing infrastructure as code with version control and testing.',
    image:
      'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    tags: ['Terraform', 'AWS', 'Python', 'Testing'],
    githubUrl: 'https://github.com/mayurchavhan/iac-framework',
    demoUrl: 'https://demo.mayurchavhan.com/iac-framework',
  },
  {
    id: 6,
    title: 'Automated Security Scanner',
    description:
      'Security scanner for container images and Kubernetes manifests with CI integration.',
    image:
      'https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    tags: ['Security', 'Docker', 'Kubernetes', 'CI/CD'],
    githubUrl: 'https://github.com/mayurchavhan/security-scanner',
  },
];
