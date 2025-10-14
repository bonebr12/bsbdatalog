import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronLeft, Maximize, Orbit, Thermometer, Timer, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';

import { flights } from '@/lib/data';
import { placeholderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AltitudeChart } from '@/components/charts/altitude-chart';
import { SpeedChart } from '@/components/charts/speed-chart';
import { TemperatureChart } from '@/components/charts/temperature-chart';

export default function FlightDetailPage({ params }: { params: { flightId: string } }) {
  const flight = flights.find((f) => f.id === params.flightId);

  if (!flight) {
    notFound();
  }

  const stats = [
    { label: 'Duration', value: flight.duration, icon: <Timer className="h-4 w-4 text-muted-foreground" /> },
    { label: 'Max Altitude', value: `${flight.maxAltitude} m`, icon: <TrendingUp className="h-4 w-4 text-muted-foreground" /> },
    { label: 'Max Speed', value: `${flight.maxSpeed} m/s`, icon: <Orbit className="h-4 w-4 text-muted-foreground" /> },
    { label: 'Distance', value: `${flight.distance} km`, icon: <Maximize className="h-4 w-4 text-muted-foreground" /> },
  ];

  return (
    <>
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" className="h-7 w-7" asChild>
          <Link href="/dashboard">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0 font-headline">
          {flight.name}
        </h1>
        <div className="hidden items-center gap-2 md:ml-auto md:flex">
          <Button variant="outline" size="sm">
            Download Report
          </Button>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
        <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Flight Path</CardTitle>
            </CardHeader>
            <CardContent>
              <Image
                src={placeholderImages.find((p) => p.id === 'flight-map')!.imageUrl}
                alt="Flight path map"
                data-ai-hint="map satellite"
                width={1200}
                height={800}
                className="rounded-lg object-cover"
              />
            </CardContent>
          </Card>
          <div className="grid gap-4 md:grid-cols-2 lg:gap-8">
            <AltitudeChart telemetry={flight.telemetry} />
            <SpeedChart telemetry={flight.telemetry} />
          </div>
           <div className="grid gap-4 md:grid-cols-2 lg:gap-8">
            <TemperatureChart telemetry={flight.telemetry} />
          </div>
        </div>
        <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Flight Details</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Date</span>
                <span>{format(new Date(flight.date), 'MMM d, yyyy')}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Drone ID</span>
                <span>{flight.droneId}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Status</span>
                <span>{flight.status}</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Key Metrics</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              {stats.map(stat => (
                <div key={stat.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {stat.icon}
                    <span className="text-muted-foreground">{stat.label}</span>
                  </div>
                  <span className="font-medium">{stat.value}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
