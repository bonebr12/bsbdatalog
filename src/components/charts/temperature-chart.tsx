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

type TemperatureChartProps = {
  telemetry: FlightFrame[];
};

export function TemperatureChart({ telemetry }: TemperatureChartProps) {
  const chartConfig = {
    temperature: {
      label: 'Temperature (°C)',
      color: 'hsl(var(--chart-3))',
    },
  };

  const formattedData = telemetry.map(frame => ({
    time: frame.timestamp,
    temperature: frame.temperature.toFixed(1),
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Temperature Profile</CardTitle>
        <CardDescription>Temperature (°C) over flight time.</CardDescription>
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
              tickFormatter={(value) => `${value}°C`}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Line
              dataKey="temperature"
              type="natural"
              stroke="var(--color-temperature)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
