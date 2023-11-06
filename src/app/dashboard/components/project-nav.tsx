import Link from 'next/link';
import { cn } from '@/lib/utils';

// TODO: Fix typing please
export function ProjectNav({ className, projectId, ...props }: any) {
  return (
    <nav
      className={cn('flex items-center space-x-4 lg:space-x-6', className)}
      {...props}
    >
      <Link
        href={`/dashboard/projects/${projectId}/indexes`}
        className="text-sm font-medium transition-colors hover:text-primary"
      >
        Indexes
      </Link>
    </nav>
  );
}
