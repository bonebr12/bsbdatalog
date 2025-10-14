import Image from 'next/image';
import Logo from '@/components/logo';
import { placeholderImages } from '@/lib/placeholder-images';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <div className="mb-4">
              <Logo />
            </div>
            {children}
          </div>
        </div>
      </div>
      <div className="hidden bg-muted lg:block">
        <Image
          src={placeholderImages.find(p => p.id === 'hero-drone')!.imageUrl}
          alt="Image"
          data-ai-hint="drone landscape"
          width="1920"
          height="1080"
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}
