import { Database } from '@/types/supabase';
import Link from 'next/link';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { Button } from '@/components/Button';
import { cookies } from 'next/headers';
import ProjectsList from './projects-list';

const supabase = createServerComponentClient<Database>({ cookies });

const getData = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('User not found');
  }

  const { data: projects, error: projectsError } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', user.id);

  if (projectsError) {
    console.log(`Error fetching data: projects: ${projectsError?.message}`);
  }
  return projects || [];
};

export default async function Dashboard() {
  const projects = await getData();

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
        <ProjectsList projects={projects} />
      </div>
    </div>
  );
}
