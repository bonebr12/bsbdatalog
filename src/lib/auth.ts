import type { User } from '@/lib/types';
import { placeholderImages } from './placeholder-images';

// In a real app, you'd get this from your auth provider (e.g., Firebase Auth, NextAuth)
export async function getCurrentUser(): Promise<User | null> {
  // --- Simulation Control ---
  // Change this value to 'admin', 'pilot', or null to test different states.
  const userRole: 'admin' | 'pilot' | null = 'admin';
  // --------------------------

  if (userRole === 'admin') {
    return {
      id: 'user-1',
      name: 'Admin User',
      email: 'admin@droneinsights.com',
      avatarUrl: placeholderImages.find(p => p.id === 'user-avatar-1')?.imageUrl || '',
      role: 'admin',
      alertSettings: {
        battery: 20,
        altitude: 120,
        speed: 50,
      },
    };
  }
  
  if (userRole === 'pilot') {
    return {
      id: 'user-2',
      name: 'Pilot Pete',
      email: 'pete@droneinsights.com',
      avatarUrl: placeholderImages.find(p => p.id === 'user-avatar-2')?.imageUrl || '',
      role: 'pilot',
      alertSettings: {
        battery: 25,
        altitude: 150,
        speed: 60,
      },
    };
  }

  return null;
}
