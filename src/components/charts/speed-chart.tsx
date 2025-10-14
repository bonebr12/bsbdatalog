'use client';

import { Line, LineChart, CartesianGrid, XAxis, YAxis } from 'recharts';
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

type SpeedChartProps = {
  telemetry: FlightFrame[];
};

export function SpeedChart({ telemetry }: SpeedChartProps) {
  const chartConfig = {
    speed: {
      label: 'Speed (m/s)',
      color: 'hsl(var(--chart-2))',
    },
  };

  const formattedData = telemetry.map(frame => ({
    time: frame.timestamp,
    speed: frame.speed.toFixed(1),
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Speed Profile</CardTitle>
        <CardDescription>Speed (meters/second) over flight time.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <LineChart data={formattedData}>
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
              tickFormatter={(value) => `${value} m/s`}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Line
              dataKey="speed"
              type="natural"
              stroke="var(--color-speed)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
