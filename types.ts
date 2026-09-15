export type UserRole = "ADMIN" | "USER";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface ProjectDTO {
  id: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  techStack: string[];
  imageUrl: string;
  liveUrl?: string;
  repoUrl?: string;
  featured: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface SkillDTO {
  id: string;
  name: string;
  category: string;
  level: number;
  order: number;
}

export interface BlogPostDTO {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImageUrl?: string;
  tags: string[];
  published: boolean;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MessageDTO {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface SettingsDTO {
  siteTitle: string;
  tagline: string;
  aboutText: string;
  avatarUrl?: string;
  resumeUrl?: string;
  email: string;
  location?: string;
  socialLinks: { platform: string; url: string }[];
  theme: {
    mode: "light" | "dark";
    accentColor: string;
  };
}
