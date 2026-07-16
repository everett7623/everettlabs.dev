import { getCollection, type CollectionEntry } from 'astro:content';

export type Project = CollectionEntry<'projects'>;

export async function getAllProjects(): Promise<Project[]> {
  const projects = await getCollection('projects');
  return projects;
}

export async function getFeaturedProjects(): Promise<Project[]> {
  const projects = await getCollection('projects');
  return projects
    .filter((p: Project) => p.data.featured)
    .sort((a: Project, b: Project) => a.data.homeOrder - b.data.homeOrder);
}

export async function getInfrastructureProjects(): Promise<Project[]> {
  const projects = await getCollection('projects');
  return projects
    .filter((p) => p.data.category === 'infrastructure')
    .sort((a: Project, b: Project) => a.data.homeOrder - b.data.homeOrder);
}

export async function getCommunityProjects(): Promise<Project[]> {
  const projects = await getCollection('projects');
  return projects
    .filter((p) => p.data.category === 'community')
    .sort((a: Project, b: Project) => a.data.homeOrder - b.data.homeOrder);
}

export async function getProductProjects(): Promise<Project[]> {
  const projects = await getCollection('projects');
  return projects
    .filter((p) => p.data.category === 'product')
    .sort((a: Project, b: Project) => a.data.homeOrder - b.data.homeOrder);
}

export async function getProjectBySlug(slug: string): Promise<Project | undefined> {
  const projects = await getCollection('projects');
  return projects.find((p: Project) => p.data.slug === slug);
}
