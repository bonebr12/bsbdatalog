import { cn } from "@/lib/utils";
import Link from "next/link";

const DroneIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 18a.5.5 0 1 0 1 0 .5.5 0 1 0-1 0" />
    <path d="M12 6a.5.5 0 1 0 1 0 .5.5 0 1 0-1 0" />
    <path d="M18 12a.5.5 0 1 0 0-1 .5.5 0 1 0 0 1" />
    <path d="M6 12a.5.5 0 1 0 0-1 .5.5 0 1 0 0 1" />
    <path d="M12 12a4.5 4.5 0 1 1 9 0 4.5 4.5 0 1 1-9 0" />
    <path d="M12 12a4.5 4.5 0 1 0-9 0 4.5 4.5 0 1 0 9 0" />
    <path d="M12 12c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3Z" />
    <path d="m14 14 3.09 3.09" />
    <path d="m10 10-3.09-3.09" />
    <path d="m10 14-3.09 3.09" />
    <path d="m14 10 3.09-3.09" />
  </svg>
);

export default function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("flex items-center gap-2", className)}>
      <DroneIcon className="h-6 w-6 text-primary" />
      <span className="text-xl font-bold tracking-tight font-headline">
        Drone Flight Insights
      </span>
    </Link>
  );
}
