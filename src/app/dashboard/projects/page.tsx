import { formatDistance } from 'date-fns';
import Link from 'next/link';
import { Button } from '@/components/Button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../../components/ui/card';
import { MoreHorizontalIcon } from 'lucide-react';
import { cookies } from 'next/headers';
import { Project } from '@/types/project';
import ProjectsList from './projects-list';

const getApiKeys = async () => {
  const response = fetch(`${process.env.PLATFORM_API}/users/api-keys`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${cookies().get('access_token')?.value}`,
    },
  });

  return (await response).json() as unknown as Project[];
};

export default async function Dashboard() {
  const apiKeys = await getApiKeys();

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Overview</h2>
          <p className="text-muted-foreground">
            Your projects will be shown here.
          </p>
          <Button
            variant="default"
            className="flex h-8 w-30 p-0 data-[state=open]:bg-muted"
          >
            <Link href="/dashboard/projects/new">New project</Link>
            <span className="sr-only">Open menu</span>
          </Button>
        </div>
        <div className="flex items-center space-x-2"></div>
      </div>
      <div className="grid gap-8 pt-12 md:grid-cols-2 lg:grid-cols-4">
        <ProjectsList projects={apiKeys ?? []} />
      </div>
    </div>
  );
}
