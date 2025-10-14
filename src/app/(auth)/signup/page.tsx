import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function SignupPage() {
  return (
    <>
      <h1 className="text-3xl font-bold font-headline">Create an account</h1>
      <p className="text-balance text-muted-foreground">
        Enter your information to create an account
      </p>
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="full-name">Full name</Label>
          <Input id="full-name" placeholder="Max Robinson" required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" required />
        </div>
        <Button type="submit" className="w-full">
          Create account
        </Button>
        <Button variant="outline" className="w-full">
          Sign up with Google
        </Button>
      </div>
      <div className="mt-4 text-center text-sm">
        Already have an account?{' '}
        <Link href="/login" className="underline">
          Login
        </Link>
      </div>
    </>
  );
}
