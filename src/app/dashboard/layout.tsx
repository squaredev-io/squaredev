import Image from 'next/image';
import { MainNav } from './components/main-nav';
import { UserNav } from './components/user-nav';
import Link from 'next/link';
import { ProjectNav } from './components/project-nav';

export default function MainLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params?: { projectId: string };
}) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <div className="flex-1">
        <div className="border-b sticky top-0 bg-background">
          <div className="flex h-16 items-center px-4">
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <Image src="/logo.png" width="120" height="64" alt="Squaredev" />
            </Link>
            <MainNav className="mx-6" />
            <div className="ml-auto flex items-center space-x-4">
              <UserNav />
            </div>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}
