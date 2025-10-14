'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Activity,
  ArrowUpRight,
  Clock,
  DollarSign,
  Users,
  Upload,
} from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { flights } from '@/lib/data';
import { FlightUploadDialog } from '@/components/dashboard/flight-upload-dialog';
import { format, formatDistanceToNow } from 'date-fns';

export default function Dashboard() {
  const [isUploadDialogOpen, setUploadDialogOpen] = useState(false);
  const recentFlights = flights.slice(0, 5);

  const getStatusBadge = (status: 'Processed' | 'Pending' | 'Error') => {
    switch (status) {
      case 'Processed':
        return <Badge variant="default" className="bg-green-500 hover:bg-green-600">Processed</Badge>;
      case 'Pending':
        return <Badge variant="secondary">Pending</Badge>;
      case 'Error':
        return <Badge variant="destructive">Error</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl font-headline">Dashboard</h1>
        <div className="ml-auto flex items-center gap-2">
          <Button onClick={() => setUploadDialogOpen(true)}>
            <Upload className="mr-2 h-4 w-4" />
            Upload Log
          </Button>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Flights</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{flights.length}</div>
            <p className="text-xs text-muted-foreground">+2 since last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Flight Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12h 45m</div>
            <p className="text-xs text-muted-foreground">+1h 12m from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alerts Triggered</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">1 high wind warning</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Drone Health
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">98%</div>
            <p className="text-xs text-muted-foreground">
              Last serviced 2 months ago
            </p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader className="flex flex-row items-center">
          <div className="grid gap-2">
            <CardTitle>Recent Flights</CardTitle>
            <CardDescription>
              An overview of your most recent flight logs.
            </CardDescription>
          </div>
          <Button asChild size="sm" className="ml-auto gap-1">
            <Link href="#">
              View All
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Flight Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">Duration</TableHead>
                <TableHead className="hidden md:table-cell">Date</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentFlights.map((flight) => (
                <TableRow key={flight.id}>
                  <TableCell>
                    <div className="font-medium">{flight.name}</div>
                    <div className="hidden text-sm text-muted-foreground md:inline">
                      Drone ID: {flight.droneId}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(flight.status)}</TableCell>
                  <TableCell className="hidden md:table-cell">{flight.duration}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {formatDistanceToNow(new Date(flight.date), { addSuffix: true })}
                  </TableCell>
                  <TableCell>
                    <Button asChild size="sm" variant="outline" disabled={flight.status !== 'Processed'}>
                      <Link href={`/flights/${flight.id}`}>View Details</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <FlightUploadDialog open={isUploadDialogOpen} onOpenChange={setUploadDialogOpen} />
    </>
  );
}
