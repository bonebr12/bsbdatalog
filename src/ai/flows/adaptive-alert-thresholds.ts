'use server';
/**
 * @fileOverview A flow for intelligently suggesting and adjusting alert thresholds based on flight conditions and drone health data.
 *
 * - adaptiveAlertThresholds - A function that handles the adaptive alert threshold process.
 * - AdaptiveAlertThresholdsInput - The input type for the adaptiveAlertThresholds function.
 * - AdaptiveAlertThresholdsOutput - The return type for the adaptiveAlertThresholds function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AdaptiveAlertThresholdsInputSchema = z.object({
  flightData: z.string().describe('Flight data including drone health metrics and flight conditions.'),
  currentThresholds: z.string().describe('The current alert thresholds set by the user.'),
  droneType: z.string().describe('The type or model of the drone.'),
  pilotExperience: z.string().describe('The pilot\u0027s experience level (e.g., beginner, intermediate, advanced).'),
});
export type AdaptiveAlertThresholdsInput = z.infer<typeof AdaptiveAlertThresholdsInputSchema>;

const AdaptiveAlertThresholdsOutputSchema = z.object({
  suggestedThresholds: z.string().describe('Suggested alert thresholds based on flight data and conditions.'),
  reasoning: z.string().describe('Explanation of why the thresholds were suggested.'),
});
export type AdaptiveAlertThresholdsOutput = z.infer<typeof AdaptiveAlertThresholdsOutputSchema>;

export async function adaptiveAlertThresholds(input: AdaptiveAlertThresholdsInput): Promise<AdaptiveAlertThresholdsOutput> {
  return adaptiveAlertThresholdsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'adaptiveAlertThresholdsPrompt',
  input: {schema: AdaptiveAlertThresholdsInputSchema},
  output: {schema: AdaptiveAlertThresholdsOutputSchema},
  prompt: `You are an expert in drone flight safety and data analysis.

  Based on the flight data, current alert thresholds, drone type, and pilot experience, you will suggest optimized alert thresholds.
  Explain your reasoning for the suggested changes.

  Flight Data: {{{flightData}}}
  Current Thresholds: {{{currentThresholds}}}
  Drone Type: {{{droneType}}}
  Pilot Experience: {{{pilotExperience}}}

  Consider factors such as battery level, altitude, speed, temperature, and any error messages to determine if the current thresholds are appropriate.
  If thresholds need adjustment, provide specific, actionable recommendations.
  Ensure that the suggested thresholds are safe and practical for the given scenario.

  Output in JSON format:
  {
    "suggestedThresholds": "...\",
    "reasoning": "..."
  }`,
});

const adaptiveAlertThresholdsFlow = ai.defineFlow(
  {
    name: 'adaptiveAlertThresholdsFlow',
    inputSchema: AdaptiveAlertThresholdsInputSchema,
    outputSchema: AdaptiveAlertThresholdsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
