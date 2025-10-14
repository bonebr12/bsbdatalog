export type User = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  role: 'pilot' | 'admin';
  alertSettings: {
    battery: number;
    altitude: number;
    speed: number;
  };
};

export type Drone = {
  id: string;
  model: string;
  nickname: string;
  userId: string;
};

export type Flight = {
  id: string;
  name: string;
  userId: string;
  droneId: string;
  date: string;
  duration: string; // e.g., "18m 25s"
  status: 'Processed' | 'Pending' | 'Error';
  maxAltitude: number;
  maxSpeed: number;
  distance: number;
  telemetry: FlightFrame[];
};

export type FlightFrame = {
  timestamp: number;
  altitude: number;
  speed: number;
  temperature: number;
};
