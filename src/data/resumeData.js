// src/data/resumeData.js
// Single source of truth — edit only this file to update the entire portfolio

export const profile = {
    name: "Veer Singh",
    firstName: "Veer",
    lastName: "Singh",
    title: "Senior Cloud · DevOps · Site Reliability Engineer",
    roles: ["Cloud Engineer", "DevOps Engineer", "Site Reliability Engineer"],
    tagline: "Building infrastructure that never sleeps",
    location: "Bangalore, India",
    email: "veeryadav6731@gmail.com",
    // phone removed from public portfolio — contact via email/LinkedIn
    github: "https://github.com/veer-singh4",
    linkedin: "https://linkedin.com/in/veer-singh-18816b179",
    medium: "https://medium.com/@veeryadav6731",
    available: true,
    resumePdf: "https://veer-singh4.github.io/Veer_Singh_Resume.pdf",
    summary: "Results-driven Senior Cloud / DevOps / SRE Engineer with 3+ years architecting and automating secure multi-cloud infrastructure at enterprise scale. Delivered 50% cloud cost reduction, 60% faster CI/CD, 30% lower MTTR, and 99.9% uptime SLOs. Holds 5 Microsoft & HashiCorp certifications including Azure Solutions Architect Expert (AZ-305), DevOps Engineer Expert (AZ-400) & AI Engineer (AI-102). Above & Beyond Award recipient. Strong SRE disciplines: SLIs/SLOs, chaos testing, DR, incident automation.",
};

export const stats = [
    { value: "50%", label: "Cost Reduced", desc: "via APIM consolidation" },
    { value: "60%", label: "Faster CI/CD", desc: "via pipeline automation" },
    { value: "99.9%", label: "Uptime SLOs", desc: "mission-critical workloads" },
    { value: "5×", label: "Certifications", desc: "Microsoft & HashiCorp" },
];

export const skills = [{
        id: "cloud",
        icon: "☁",
        title: "Cloud Platforms",
        color: "blue",
        tags: ["Azure", "AWS", "AKS", "EKS", "APIM", "Front Door", "App Gateway", "Virtual WAN", "Container Apps", "EC2", "S3", "RDS", "IAM", "Private Endpoints"],
    },
    {
        id: "iac",
        icon: "🏗",
        title: "Infrastructure as Code",
        color: "green",
        tags: ["Terraform", "Bicep", "Ansible", "Policy-as-Code", "GitOps", "ArgoCD", "Modular IaC", "State Management"],
    },
    {
        id: "containers",
        icon: "⎈",
        title: "Containers & Orchestration",
        color: "cyan",
        tags: ["Kubernetes", "Docker", "Helm", "HPA", "Ingress", "Service Mesh", "RBAC", "Liveness Probes", "DaemonSets"],
    },
    {
        id: "cicd",
        icon: "🚀",
        title: "CI/CD & DevSecOps",
        color: "purple",
        tags: ["GitHub Actions", "Azure DevOps", "GitLab CI", "Jenkins", "SAST/DAST", "Zero-Downtime Deploy", "Auto Rollback", "IaC Validation"],
    },
    {
        id: "observability",
        icon: "📊",
        title: "Observability & SRE",
        color: "amber",
        tags: ["Prometheus", "Grafana", "Datadog", "Azure Monitor", "App Insights", "Log Analytics", "SLI/SLO", "PagerDuty", "RCA", "DR Drills"],
    },
    {
        id: "ai",
        icon: "🤖",
        title: "AI, Scripting & Dev",
        color: "cyan",
        tags: ["Azure AI (AI-102)", "OpenAI on Azure", "Python", "Bash", "PowerShell", "Java/Spring Boot", "Backstage", "SQL", "Linux", "Git"],
    },
];

export const experience = [{
        id: "presidio",
        title: "Senior Cloud / DevOps Engineer",
        company: "Presidio",
        location: "Bangalore, India",
        period: "May 2024 – Present",
        type: "current",
        bullets: [
            { text: "Architected modular multi-cloud IaC platform (Terraform + Bicep) across 10+ enterprise accounts on Azure & AWS — cut provisioning time by 40%, eliminated config drift, enforced security/compliance at scale.", highlight: "40% faster provisioning" },
            { text: "Consolidated Azure APIM topology across 200+ microservices, redesigning API governance end-to-end and delivering 50% reduction in API management costs — the highest single-initiative saving on the account.", highlight: "50% cost reduction" },
            { text: "Engineered full-stack observability platform (Azure Monitor · Grafana · Datadog · App Insights) with automated alerting and runbooks, cutting incident resolution by 30% and reducing alert noise by 40%.", highlight: "30% lower MTTR" },
            { text: "Delivered automated CI/CD pipelines (GitHub Actions · ADO · GitLab) with IaC validation, SAST/DAST security gates, and zero-downtime rollback — boosted release velocity by 60% across all client environments.", highlight: "60% faster releases" },
            { text: "Designed enterprise hybrid networking (Azure Virtual WAN · Site-to-Site VPN · Private Endpoints) with multi-region DR strategy, achieving 99.9% uptime SLOs for mission-critical workloads.", highlight: "99.9% uptime SLOs" },
            { text: "Mentored 10+ engineers via IaC/Kubernetes/CI-CD masterclasses; earned Above & Beyond Award (2025) and Spot Award for sustained high-impact delivery.", highlight: "Above & Beyond Award" },
        ],
        tags: ["Terraform", "Bicep", "Azure", "AWS", "Kubernetes", "GitHub Actions", "Azure Monitor", "Grafana", "Datadog", "APIM", "Virtual WAN", "DR Strategy"],
    },
    {
        id: "pratian-sre",
        title: "Cloud Operations / Site Reliability Engineer",
        company: "Pratian Technologies · GE Healthcare",
        location: "Bangalore, India",
        period: "Feb 2023 – Apr 2024",
        type: "past",
        bullets: [
            { text: "Automated multi-cloud provisioning (Azure + AWS) with reusable Terraform modules and policy-as-code guardrails, eliminating 50% of manual infrastructure ops work with zero configuration-drift incidents.", highlight: "50% manual ops eliminated" },
            { text: "Optimised AKS clusters (HPA · Helm · liveness probes · ingress policies) — improved resource utilisation by 35%, sustained zero unplanned downtime over 8 consecutive months for GE Healthcare production workloads.", highlight: "35% better utilisation" },
            { text: "Built SRE observability stack (Prometheus · Grafana · Datadog · Azure Monitor) with SLI/SLO dashboards, improving MTTR by 25%; led incident response, RCA investigations, and quarterly DR drills.", highlight: "25% MTTR improvement" },
            { text: "Championed Backstage developer portal adoption across 50+ engineering teams, cutting service onboarding time by 30%; built zero-downtime multi-cloud CI/CD pipelines (ADO · GitLab) at scale.", highlight: "30% faster onboarding" },
        ],
        tags: ["Terraform", "AKS", "Kubernetes", "Helm", "Prometheus", "Grafana", "Datadog", "Azure DevOps", "GitLab CI", "Backstage", "SLI/SLO"],
    },
    {
        id: "pratian-swe",
        title: "Software Engineer",
        company: "Pratian Technologies",
        location: "Bangalore, India",
        period: "Jun 2022 – Jan 2023",
        type: "past",
        bullets: [
            { text: "Migrated 3 legacy monolithic applications to cloud-native Java/Spring Boot microservices on Azure & AWS, containerised with Docker, orchestrated via Kubernetes.", highlight: "3 apps migrated" },
            { text: "Built Jenkins/ADO CI/CD pipelines reducing deployment cycle time by 40% and standardising release workflows across teams.", highlight: "40% faster deployments" },
            { text: "Deployed secure, production-grade applications with IAM policies, private networking, and compliance controls, improving security posture and audit readiness.", highlight: "Security hardened" },
        ],
        tags: ["Java", "Spring Boot", "Docker", "Kubernetes", "Jenkins", "Azure DevOps", "Azure", "AWS", "IAM"],
    },
];

// Certification URLs — update with your actual Microsoft Learn / Credly share links
export const certifications = [{
        id: "az305",
        code: "AZ-305",
        issuer: "Microsoft Certified",
        name: "Azure Solutions Architect Expert",
        level: "Expert",
        levelColor: "amber",
        desc: "Advanced multi-cloud architecture, governance & infrastructure design on Azure",
        badgeColor: "#f59e0b",
        badgeGrad: ["#2d8cff", "#00e5cc"],
        icon: "🏛",
        // ↓ Replace with your actual Microsoft Learn credential share URL
        url: "https://learn.microsoft.com/api/credentials/share/en-gb/VeerSingh-9397/307A3DB8A15428?sharingId=13DA141D2FD1522A",
        linkedinUrl: "https://www.linkedin.com/in/veer-singh-18816b179/details/certifications/",
    },
    {
        id: "az400",
        code: "AZ-400",
        issuer: "Microsoft Certified",
        name: "DevOps Engineer Expert",
        level: "Expert",
        levelColor: "amber",
        desc: "CI/CD pipelines, DevSecOps, IaC automation & SRE reliability engineering",
        badgeColor: "#f59e0b",
        badgeGrad: ["#0ea5e9", "#00e5cc"],
        icon: "⚙",
        url: "https://learn.microsoft.com/api/credentials/share/en-gb/VeerSingh-9397/749CEDD0ECCDE8F8?sharingId=13DA141D2FD1522A",
        linkedinUrl: "https://www.linkedin.com/in/veer-singh-18816b179/details/certifications/",
    },
    {
        id: "ai102",
        code: "AI-102",
        issuer: "Microsoft Certified",
        name: "Azure AI Engineer Associate",
        level: "Associate",
        levelColor: "cyan",
        desc: "Azure AI Services, Cognitive APIs, OpenAI on Azure & AI-powered solutions",
        badgeColor: "#8b5cf6",
        badgeGrad: ["#8b5cf6", "#a78bfa"],
        icon: "🤖",
        url: "https://learn.microsoft.com/api/credentials/share/en-gb/VeerSingh-9397/85AFFCDA350293F7?sharingId=13DA141D2FD1522A",
        linkedinUrl: "https://www.linkedin.com/in/veer-singh-18816b179/details/certifications/",
    },
    {
        id: "az104",
        code: "AZ-104",
        issuer: "Microsoft Certified",
        name: "Azure Administrator Associate",
        level: "Associate",
        levelColor: "cyan",
        desc: "Azure infrastructure, identity, networking & governance administration",
        badgeColor: "#0078d4",
        badgeGrad: ["#0078d4", "#2d8cff"],
        icon: "🛡",
        url: "https://learn.microsoft.com/api/credentials/share/en-gb/VeerSingh-9397/483CA2F494CDBEE7?sharingId=13DA141D2FD1522A",
        linkedinUrl: "https://www.linkedin.com/in/veer-singh-18816b179/details/certifications/",
    },
    {
        id: "terraform",
        code: "TERRAFORM",
        issuer: "HashiCorp Certified",
        name: "Terraform Associate",
        level: "Associate",
        levelColor: "purple",
        desc: "Infrastructure as Code, state management, reusable modules & multi-cloud workspaces",
        badgeColor: "#7b42bc",
        badgeGrad: ["#7b42bc", "#5c30a0"],
        icon: "🏗",
        url: "https://www.credly.com/badges/ad8e8eb7-ffde-47ab-b422-fcc9b6a9f7c9/public_url",
        linkedinUrl: "https://www.linkedin.com/in/veer-singh-18816b179/details/certifications/",
    },
];

export const awards = [{
        id: "above-beyond",
        icon: "🏆",
        title: "Above & Beyond Award",
        org: "Presidio",
        year: "2025",
        desc: "Recognised for sustained cross-project, high-impact delivery of enterprise cloud solutions across multiple critical accounts — the highest peer-nominated recognition at Presidio.",
    },
    {
        id: "spot",
        icon: "⭐",
        title: "Spot Award",
        org: "Presidio",
        year: "2024",
        desc: "Awarded for exceptional multi-cloud infrastructure delivery across enterprise accounts, completed ahead of schedule with measurable business impact.",
    },
    {
        id: "ge-recognition",
        icon: "🎖",
        title: "Client Recognition Award",
        org: "GE Healthcare",
        year: "2023",
        desc: "Appreciated for automating infrastructure deployment and CI/CD pipelines, significantly reducing delivery timelines for critical healthcare production systems.",
    },
];

export const education = {
    degree: "B.Tech — Computer Science Engineering",
    institution: "Sharda University, Greater Noida",
    year: "2016 – 2020",
};

// Medium fallback posts — auto-fetch happens at runtime via RSS
// These show if Medium RSS is unavailable
export const mediumFallbackPosts = [{
        title: "How I Reduced Azure Cloud Costs by 50% Using APIM Consolidation",
        url: "https://medium.com/@veeryadav6731",
        date: "Feb 10, 2025",
        readTime: "8 min read",
        tags: ["Azure", "APIM", "Cost Optimization"],
        excerpt: "Deep dive into how I redesigned Azure API Management topology across 200+ microservices at Presidio, consolidating from 6 instances to a hub-spoke model and cutting costs by 50%.",
    },
    {
        title: "Building a Production-Grade AKS Cluster with Zero Downtime",
        url: "https://medium.com/@veeryadav6731",
        date: "Jan 18, 2025",
        readTime: "10 min read",
        tags: ["Kubernetes", "AKS", "SRE"],
        excerpt: "A step-by-step walkthrough of optimising Azure Kubernetes Service at GE Healthcare — HPA tuning, Helm standardisation, Calico network policies and achieving 35% better utilisation.",
    },
    {
        title: "Terraform Modules at Scale: Patterns for Enterprise IaC",
        url: "https://medium.com/@veeryadav6731",
        date: "Dec 5, 2024",
        readTime: "12 min read",
        tags: ["Terraform", "IaC", "DevOps"],
        excerpt: "How I built reusable Terraform module libraries across 10+ enterprise accounts with OPA policy-as-code enforcement, cutting provisioning time by 40% and eliminating config drift.",
    },
    {
        title: "SLI/SLO Design Patterns for Cloud-Native Applications",
        url: "https://medium.com/@veeryadav6731",
        date: "Nov 22, 2024",
        readTime: "9 min read",
        tags: ["SRE", "Observability", "Azure"],
        excerpt: "Practical patterns for defining meaningful SLIs and SLOs in cloud-native systems. Covers error budgets, burn rate alerts, and integrating with Prometheus, Grafana and PagerDuty.",
    },
];

// AI search context
export const searchIndex = [
    { section: "Profile", content: profile.summary, keywords: ["summary", "about", "profile", "experience", "engineer"] },
    ...skills.map(s => ({ section: "Skills", content: `${s.title}: ${s.tags.join(", ")}`, keywords: s.tags.map(t => t.toLowerCase()) })),
    ...experience.map(e => ({ section: "Experience", content: `${e.title} at ${e.company}. ${e.bullets.map(b => b.text).join(" ")}`, keywords: [...e.tags.map(t => t.toLowerCase()), e.company.toLowerCase()] })),
    ...certifications.map(c => ({ section: "Certifications", content: `${c.code} ${c.name} by ${c.issuer}. ${c.desc}`, keywords: [c.code.toLowerCase(), c.name.toLowerCase(), "certification", "cert", "certified"] })),
    ...awards.map(a => ({ section: "Awards", content: `${a.title} from ${a.org} in ${a.year}. ${a.desc}`, keywords: ["award", "recognition", a.org.toLowerCase()] })),
    { section: "Education", content: `${education.degree} from ${education.institution}, ${education.year}`, keywords: ["education", "degree", "btech", "university"] },
];