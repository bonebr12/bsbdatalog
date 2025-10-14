import type { Flight, User } from './types';

export const users: User[] = [
  {
    id: 'user-1',
    name: 'Admin User',
    email: 'admin@example.com',
    avatarUrl: 'https://picsum.photos/seed/10/100/100',
    role: 'admin',
    alertSettings: {
      battery: 20,
      altitude: 120,
      speed: 50,
    },
  },
  {
    id: 'user-2',
    name: 'Pilot Pete',
    email: 'pilot.pete@example.com',
    avatarUrl: 'https://picsum.photos/seed/11/100/100',
    role: 'pilot',
    alertSettings: {
      battery: 25,
      altitude: 150,
      speed: 60,
    },
  },
  {
    id: 'user-3',
    name: 'Captain Carol',
    email: 'captain.carol@example.com',
    avatarUrl: 'https://picsum.photos/seed/13/100/100',
    role: 'pilot',
    alertSettings: {
      battery: 20,
      altitude: 100,
      speed: 40,
    },
  },
];

const generateTelemetry = (durationMinutes: number): Flight['telemetry'] => {
  const points = durationMinutes * 4; // 4 data points per minute
  const telemetry: Flight['telemetry'] = [];
  for (let i = 0; i < points; i++) {
    const timestamp = (i / (points - 1)) * durationMinutes * 60 * 1000;
    const progress = i / (points - 1);
    
    // Simulate a flight profile: takeoff, cruise, land
    const altitude = Math.sin(progress * Math.PI) * 100 * (0.8 + Math.random() * 0.4);
    const speed = Math.sin(progress * Math.PI) * 15 * (0.9 + Math.random() * 0.2) + Math.random() * 2;
    const temperature = 25 + Math.sin(progress * Math.PI * 2) * 5 + (Math.random() - 0.5) * 2;

    telemetry.push({
      timestamp,
      altitude: Math.max(0, altitude),
      speed: Math.max(0, speed),
      temperature,
    });
  }
  return telemetry;
}

export const flights: Flight[] = [
  {
    id: 'flight-1',
    name: 'Coastal Survey Mission',
    userId: 'user-2',
    droneId: 'drone-1',
    date: '2024-07-20T14:30:00Z',
    duration: '22m 15s',
    status: 'Processed',
    maxAltitude: 118,
    maxSpeed: 18.5,
    distance: 4.2,
    telemetry: generateTelemetry(22),
  },
  {
    id: 'flight-2',
    name: 'Urban Rooftop Inspection',
    userId: 'user-2',
    droneId: 'drone-1',
    date: '2024-07-18T09:00:00Z',
    duration: '15m 45s',
    status: 'Processed',
    maxAltitude: 85,
    maxSpeed: 12.1,
    distance: 2.1,
    telemetry: generateTelemetry(16),
  },
  {
    id: 'flight-3',
    name: 'Farmland Mapping',
    userId: 'user-2',
    droneId: 'drone-2',
    date: '2024-07-17T16:00:00Z',
    duration: '28m 30s',
    status: 'Pending',
    maxAltitude: 150,
    maxSpeed: 22.0,
    distance: 7.5,
    telemetry: [],
  },
  {
    id: 'flight-4',
    name: 'Log-file-error-demo.txt',
    userId: 'user-2',
    droneId: 'drone-1',
    date: '2024-07-16T11:20:00Z',
    duration: '5m 10s',
    status: 'Error',
    maxAltitude: 45,
    maxSpeed: 8.3,
    distance: 0.8,
    telemetry: [],
  },
    {
    id: 'flight-5',
    name: 'Mountain Ridge Fly-through',
    userId: 'user-3',
    droneId: 'drone-3',
    date: '2024-07-19T18:00:00Z',
    duration: '19m 05s',
    status: 'Processed',
    maxAltitude: 250,
    maxSpeed: 25.2,
    distance: 6.3,
    telemetry: generateTelemetry(19),
  },
];
