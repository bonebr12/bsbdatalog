'use server';

import { z } from 'zod';
import { adaptiveAlertThresholds } from '@/ai/flows/adaptive-alert-thresholds';

const formSchema = z.object({
  currentThresholds: z.string().min(1, 'Current thresholds are required.'),
  droneType: z.string().min(1, 'Drone type is required.'),
  pilotExperience: z.string().min(1, 'Pilot experience is required.'),
});

export async function getAdaptiveAlerts(prevState: any, formData: FormData) {
  try {
    const validatedFields = formSchema.safeParse({
      currentThresholds: formData.get('currentThresholds'),
      droneType: formData.get('droneType'),
      pilotExperience: formData.get('pilotExperience'),
    });

    if (!validatedFields.success) {
      return {
        message: 'Invalid form data.',
        errors: validatedFields.error.flatten().fieldErrors,
        data: null,
      };
    }

    // In a real app, flight data would be queried from your database
    const mockFlightData = `
      - Flight 1: Battery drop to 15%, High wind warnings, Max altitude 120m, Max speed 22m/s
      - Flight 2: Normal operation, Battery ended at 30%, Max altitude 100m, Max speed 15m/s
      - Flight 3: Battery drop to 20%, Occasional gimbal vibration, Max altitude 110m, Max speed 18m/s
    `;

    const result = await adaptiveAlertThresholds({
      flightData: mockFlightData,
      ...validatedFields.data,
    });
    
    return {
      message: 'Suggestions generated successfully.',
      errors: null,
      data: result,
    };
  } catch (error) {
    console.error(error);
    return {
      message: 'An unexpected error occurred.',
      errors: null,
      data: null,
    };
  }
}
