'use client';

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import type { FlightFrame } from '@/lib/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

type AltitudeChartProps = {
  telemetry: FlightFrame[];
};

export function AltitudeChart({ telemetry }: AltitudeChartProps) {
  const chartConfig = {
    altitude: {
      label: 'Altitude (m)',
      color: 'hsl(var(--chart-1))',
    },
  };
  
  const formattedData = telemetry.map(frame => ({
    time: frame.timestamp,
    altitude: frame.altitude.toFixed(1),
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Altitude Profile</CardTitle>
        <CardDescription>Altitude (meters) over flight time.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <AreaChart data={formattedData}>
            <defs>
              <linearGradient id="fillAltitude" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-altitude)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-altitude)" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="time"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `${Math.floor(value / 60000)}m`}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `${value}m`}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Area
              dataKey="altitude"
              type="natural"
              fill="url(#fillAltitude)"
              stroke="var(--color-altitude)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
