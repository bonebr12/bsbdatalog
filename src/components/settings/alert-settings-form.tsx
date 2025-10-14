'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { getAdaptiveAlerts } from '@/app/actions/alerts';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Wand2, Loader2, Bot } from 'lucide-react';

const initialState = {
  message: '',
  errors: null,
  data: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Wand2 className="mr-2 h-4 w-4" />
      )}
      Get AI Suggestions
    </Button>
  );
}

export function AlertSettingsForm() {
  const [state, formAction] = useFormState(getAdaptiveAlerts, initialState);

  const defaultThresholds = JSON.stringify(
    {
      battery_low: '20%',
      max_altitude: '120m',
      high_wind_speed: '15m/s',
    },
    null,
    2
  );

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <form action={formAction}>
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">AI-Powered Alert Suggestions</CardTitle>
            <CardDescription>
              Let our AI analyze your flight history and suggest optimized alert thresholds for enhanced safety.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="currentThresholds">Current Thresholds (JSON)</Label>
              <Textarea
                id="currentThresholds"
                name="currentThresholds"
                defaultValue={defaultThresholds}
                rows={5}
                placeholder='{ "battery_low": "20%" }'
              />
              {state.errors?.currentThresholds && (
                <p className="text-sm text-destructive">{state.errors.currentThresholds[0]}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="droneType">Drone Type</Label>
              <Select name="droneType" defaultValue="DJI Mavic 3 Pro">
                <SelectTrigger id="droneType">
                  <SelectValue placeholder="Select drone type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DJI Mavic 3 Pro">DJI Mavic 3 Pro</SelectItem>
                  <SelectItem value="DJI Air 2S">DJI Air 2S</SelectItem>
                  <SelectItem value="Autel EVO II">Autel EVO II</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
               {state.errors?.droneType && (
                <p className="text-sm text-destructive">{state.errors.droneType[0]}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="pilotExperience">Pilot Experience</Label>
              <Select name="pilotExperience" defaultValue="Intermediate">
                <SelectTrigger id="pilotExperience">
                  <SelectValue placeholder="Select pilot experience" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Beginner">Beginner (0-25 hours)</SelectItem>
                  <SelectItem value="Intermediate">Intermediate (25-100 hours)</SelectItem>
                  <SelectItem value="Advanced">Advanced (100+ hours)</SelectItem>
                </SelectContent>
              </Select>
              {state.errors?.pilotExperience && (
                <p className="text-sm text-destructive">{state.errors.pilotExperience[0]}</p>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <SubmitButton />
          </CardFooter>
        </Card>
      </form>
      <div className="flex flex-col gap-6">
        <Card className="flex-grow">
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2">
              <Bot className="h-6 w-6 text-primary"/>
              AI Recommendations
            </CardTitle>
            <CardDescription>
              Suggestions from our AI will appear here.
            </CardDescription>
          </CardHeader>
          <CardContent>
             {state.data ? (
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Suggested Thresholds:</h4>
                   <pre className="bg-muted p-4 rounded-lg text-sm">{state.data.suggestedThresholds}</pre>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Reasoning:</h4>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">{state.data.reasoning}</p>
                </div>
              </div>
            ) : (
                 <div className="text-center text-muted-foreground p-8">
                    <p>No suggestions yet. Fill out the form and click "Get AI Suggestions".</p>
                </div>
            )}
            {state.message && !state.data && <p className="text-destructive">{state.message}</p>}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
