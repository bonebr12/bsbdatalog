import { Separator } from '@/components/ui/separator';
import { AlertSettingsForm } from '@/components/settings/alert-settings-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-medium font-headline md:text-2xl">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Manage your account settings, alert preferences, and more.
        </p>
      </div>
      <Separator />

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">User Profile</CardTitle>
            <CardDescription>Update your personal information.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" defaultValue="Pilot Pete" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue="pete@droneinsights.com" />
            </div>
          </CardContent>
          <CardContent>
            <Button>Save Changes</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Notification Preferences</CardTitle>
            <CardDescription>Choose how you receive alerts and updates.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox id="email-notifications" defaultChecked />
              <Label htmlFor="email-notifications">Email Notifications</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="push-notifications" />
              <Label htmlFor="push-notifications">Push Notifications (Mobile App)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="weekly-summary" />
              <Label htmlFor="weekly-summary">Weekly Flight Summary Email</Label>
            </div>
          </CardContent>
          <CardContent>
            <Button>Save Preferences</Button>
          </CardContent>
        </Card>
      </div>

      <Separator />
      <AlertSettingsForm />
    </div>
  );
}
