import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 100);
}

export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatRelativeTime(date: Date | string): string {
  const d = new Date(date);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return formatDate(date);
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.substring(0, length).trim() + '...';
}

export function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    local: 'bg-cat-local',
    politics: 'bg-cat-politics',
    'police & fire': 'bg-cat-police',
    'police-fire': 'bg-cat-police',
    business: 'bg-cat-business',
    wwu: 'bg-cat-wwu',
    sports: 'bg-cat-sports',
    restaurants: 'bg-cat-restaurants',
    waterfront: 'bg-cat-waterfront',
    weather: 'bg-cat-weather',
  };
  return colors[category.toLowerCase()] || 'bg-gray-500';
}

export function getCategoryTextColor(category: string): string {
  const colors: Record<string, string> = {
    local: 'text-cat-local',
    politics: 'text-cat-politics',
    'police & fire': 'text-cat-police',
    'police-fire': 'text-cat-police',
    business: 'text-cat-business',
    wwu: 'text-cat-wwu',
    sports: 'text-cat-sports',
    restaurants: 'text-cat-restaurants',
    waterfront: 'text-cat-waterfront',
    weather: 'text-cat-weather',
  };
  return colors[category.toLowerCase()] || 'text-gray-500';
}

// Base64 blur placeholder for images
export const blurDataURL =
  'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAUH/8QAIhAAAQMDBAMBAAAAAAAAAAAAAQIDEQAEBQYSITETQVGB/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAZEQADAAMAAAAAAAAAAAAAAAAAAQIDEhH/2gAMAwEAAhEDEEAAAACNdY1dJbSpCgRBJJP0n7rWlcpYn//Z';
