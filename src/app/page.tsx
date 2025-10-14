import Link from 'next/link';
import Image from 'next/image';
import {
  Map,
  BarChart,
  Bell,
  UploadCloud,
  Settings,
  Shield,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { placeholderImages } from '@/lib/placeholder-images';
import Logo from '@/components/logo';

export default function LandingPage() {
  const features = [
    {
      icon: <UploadCloud className="h-10 w-10 text-primary" />,
      title: 'Seamless Log Upload',
      description: 'Easily upload your DJI .txt flight logs and let our platform handle the rest. Processing is fast and automatic.',
    },
    {
      icon: <Map className="h-10 w-10 text-primary" />,
      title: 'Interactive Flight Maps',
      description: 'Visualize your complete flight path on an interactive map. Analyze your trajectory, altitude, and key flight events.',
    },
    {
      icon: <BarChart className="h-10 w-10 text-primary" />,
      title: 'In-Depth Telemetry',
      description: 'Dive deep into your flight data with detailed charts for speed, altitude, battery life, temperature, and more.',
    },
    {
      icon: <Bell className="h-10 w-10 text-primary" />,
      title: 'Smart AI-Powered Alerts',
      description: 'Set custom safety thresholds and receive intelligent suggestions from our AI to ensure safer flights.',
    },
    {
      icon: <Shield className="h-10 w-10 text-primary" />,
      title: 'Drone Health Monitoring',
      description: 'Keep your UAV in top condition by tracking battery cycles, component health, and maintenance schedules.',
    },
    {
      icon: <Settings className="h-10 w-10 text-primary" />,
      title: 'Custom Reports',
      description: 'Generate professional, shareable reports for compliance, client presentations, or personal records.',
    },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <header className="container mx-auto flex h-20 items-center justify-between px-4">
        <Logo />
        <nav className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link href="/login">Log In</Link>
          </Button>
          <Button asChild>
            <Link href="/signup">Sign Up</Link>
          </Button>
        </nav>
      </header>

      <main className="flex-grow">
        <section className="relative h-[60vh] min-h-[500px] w-full">
          <Image
            src={placeholderImages.find(p => p.id === "hero-drone")!.imageUrl}
            alt="Drone in flight over a mountain range"
            data-ai-hint="drone landscape"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-white">
            <h1 className="font-headline text-4xl font-bold md:text-6xl">
              Unlock Your Drone's Full Story
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-primary-foreground/80">
              The ultimate platform for drone pilots to analyze, visualize, and manage flight data for enhanced safety and performance.
            </p>
            <Button size="lg" className="mt-8" asChild>
              <Link href="/signup">Get Started for Free</Link>
            </Button>
          </div>
        </section>

        <section id="features" className="container mx-auto px-4 py-16 sm:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-headline text-3xl font-bold sm:text-4xl">
              Powerful Features for Every Pilot
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              From hobbyists to professionals, Drone Flight Insights provides the tools you need to fly smarter and safer.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <Card key={feature.title} className="flex flex-col text-center transition-transform hover:scale-105 hover:shadow-xl">
                <CardHeader>
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent">
                    {feature.icon}
                  </div>
                  <CardTitle className="font-headline">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>

      <footer className="bg-muted py-8">
        <div className="container mx-auto flex flex-col items-center justify-between px-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <Logo />
          </div>
          <p className="mt-4 text-sm text-muted-foreground sm:mt-0">
            &copy; {new Date().getFullYear()} Drone Flight Insights. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
