'use client';

import { Database } from '@/types/supabase';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import NewProject from '@/components/NewProject';
import { Project } from '@/types/supabase-entities';
import { Button } from '@/components/Button';

export default function Dashboard() {
  const supabase = createClientComponentClient<Database>();
  const [projects, setProjects] = useState<Project[]>([]);
  const [createNewProjectOpen, setCreateNewProjectOpen] = useState(false);

  useEffect(() => {
    getData();
  }, [createNewProjectOpen]);

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
    <main className="flex min-h-screen flex-col justify-between p-24">
      <form action="/auth/sign-out" method="post">
        <Button type="submit">Sign out</Button>
      </form>
      <h3>Dashboard</h3>
      <div>
        <Button onClick={toggleNewProjectOpen}>Create new project</Button>
        {createNewProjectOpen && (
          <NewProject closeForm={toggleNewProjectOpen} />
        )}
      </div>
      <hr />
      Projects:
      <ul>
        {projects.map((project) => (
          <li key={project.id}>
            <Link href={`/dashboard/projects/${project.id}`}>
              <p>{project.name}</p>
            </Link>
          </li>
        ))}
      </ul>
      <hr />
    </main>
  );
}
