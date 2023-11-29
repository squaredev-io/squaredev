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
import { ApiKey } from '@/types/api-keys';

const getApiKeys = async () => {
  const response = fetch(`${process.env.PLATFORM_API}/users/api-keys`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${cookies().get('access_token')?.value}`,
    },
  });

  return (await response).json() as unknown as ApiKey[];
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
        {apiKeys.map((apiKey, i) => {
          const dateWithDistance = formatDistance(
            new Date(apiKey.created_datetime),
            new Date(),
            {
              includeSeconds: true,
              addSuffix: true,
            }
          );
          return (
            <Link key={i} href={`/dashboard/projects/${apiKey.id}`}>
              <Card>
                <CardHeader className="space-y-0">
                  <div className="flex flex-col space-y-1">
                    <div className="flex justify-between">
                      <CardTitle>{apiKey.name}</CardTitle>

                      <Button
                        variant="ghost"
                        className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
                      >
                        <MoreHorizontalIcon className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </div>

                    <CardDescription>
                      Add a nice description here. @Mega add a field in the
                      database please.
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex space-x-4 text-sm text-muted-foreground">
                    <div>{dateWithDistance}</div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
