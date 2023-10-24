'use client';

import { Database } from '@/types/supabase';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import NewApp from '@/components/NewApp';
import NewKnowledgeBase from '@/components/NewKnowledgeBase';
import { App, KnowledgeBase } from '@/types/supabase-entities';
import { Button } from '@/components/Button';

export default function Dashboard() {
  const supabase = createClientComponentClient<Database>();
  const [apps, setApps] = useState<App[]>([]);
  const [knowledgeBases, setKnowledgeBases] = useState<KnowledgeBase[]>([]);
  const [createNewAppOpen, setCreateNewAppOpen] = useState(false);
  const [createNewKnowledgeBaseOpen, setCreateNewKnowledgeBaseOpen] =
    useState(false);

  useEffect(() => {
    getData();
  }, [createNewAppOpen, createNewKnowledgeBaseOpen]);

  const getData = async () => {
    const { data: apps, error: appsError } = await supabase
      .from('apps')
      .select('*');

    const { data: knowledgeBases, error: knowledgeBasesError } = await supabase
      .from('knowledge_bases')
      .select('*');

    if (appsError || knowledgeBasesError) {
      alert(
        `Error fetching data: Apps: ${appsError?.message} Knowledge Bases: ${knowledgeBasesError?.message}`
      );
    }

    setApps(apps || []);
    setKnowledgeBases(knowledgeBases || []);
  };

  const toggleNewAppOpen = () => setCreateNewAppOpen(!createNewAppOpen);
  const toggleNewKnowledgeBaseOpen = () =>
    setCreateNewKnowledgeBaseOpen(!createNewKnowledgeBaseOpen);

  return (
    <main className="flex min-h-screen flex-col justify-between p-24">
      <form action="/auth/sign-out" method="post">
        <Button type="submit">Sign out</Button>
      </form>
      <h3>Dashboard</h3>
      <div>
        <Button onClick={toggleNewAppOpen}>Create new App</Button>
        {createNewAppOpen && <NewApp closeForm={toggleNewAppOpen} />}
      </div>
      <div>
        <Button onClick={toggleNewKnowledgeBaseOpen}>
          Create new Knowledge Base
        </Button>
      </div>
      {createNewKnowledgeBaseOpen && (
        <NewKnowledgeBase closeForm={toggleNewKnowledgeBaseOpen} />
      )}
      <hr />
      Apps:
      <ul>
        {apps.map((app) => (
          <li key={app.id}>
            <Link href={`/dashboard/apps/${app.id}`}>
              <p>{app.name}</p>
            </Link>
          </li>
        ))}
      </ul>
      <hr />
      Knowledge Bases:
      <ul>
        {knowledgeBases.map((kb) => (
          <li key={kb.id}>
            <Link href={`/dashboard/knowledge-bases/${kb.id}`}>
              <p>{kb.name}</p>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
