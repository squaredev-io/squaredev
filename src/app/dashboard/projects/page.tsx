'use client';

import { Database } from '@/types/supabase';
import { formatDistance } from 'date-fns';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import NewProject from '@/components/NewProject';
import { Project } from '@/types/supabase-entities';
import { Button } from '@/components/Button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../../components/ui/card';
import { DollarSignIcon, MoreHorizontalIcon } from 'lucide-react';

export default function Dashboard() {
  const supabase = createClientComponentClient<Database>();
  const [projects, setProjects] = useState<Project[]>([
    {
      id: '1',
      name: 'Test',
      api_key: null,
      created_at: '2023-11-01 08:36:40.221753+00',
      user_id: null,
    },
  ]);
  const [createNewProjectOpen, setCreateNewProjectOpen] = useState(false);

  useEffect(() => {
    // getData();
  });

  const getData = async () => {
    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select('*');

    if (projectsError) {
      alert(`Error fetching data: projects: ${projectsError?.message}`);
    }
    setProjects(projects || []);
  };

  const toggleNewProjectOpen = () =>
    setCreateNewProjectOpen(!createNewProjectOpen);

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Overview</h2>
          <p className="text-muted-foreground">
            Your projects will be shown here.
          </p>
        </div>
        <div className="flex items-center space-x-2"></div>
      </div>
      <div className="grid gap-8 pt-12 md:grid-cols-2 lg:grid-cols-4">
        {projects.map((project, i) => {
          const dateWithDistance = formatDistance(
            new Date(project.created_at),
            new Date(),
            {
              includeSeconds: true,
              addSuffix: true,
            }
          );
          return (
            <Link key={i} href={`/dashboard/projects/${project.id}`}>
              <Card>
                <CardHeader className="space-y-0">
                  <div className="flex flex-col space-y-1">
                    <div className="flex justify-between">
                      <CardTitle>{project.name}</CardTitle>

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
