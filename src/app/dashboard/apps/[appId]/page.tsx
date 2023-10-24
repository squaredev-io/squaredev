'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useState, useEffect } from 'react';
import { Database } from '@/types/supabase';
import { App, KnowledgeBase } from '@/types/supabase-entities';
import { Button } from '@/components/Button';

export default function App({ params }: { params: { appId: string } }) {
  const supabase = createClientComponentClient<Database>();
  const [app, setApp] = useState<App | null>(null);
  const [knowledgeBases, setKnowledgeBases] = useState<KnowledgeBase[]>([]);
  const [showNewKnowledgeBaseForm, setShowNewKnowledgeBaseForm] =
    useState(false);

  const toggleShowNewKnowledgeBaseForm = () =>
    setShowNewKnowledgeBaseForm(!showNewKnowledgeBaseForm);

  const getData = async () => {
    const { data: app, error: appError } = await supabase
      .from('apps')
      .select('*')
      .eq('id', params.appId)
      .single();

    const { data: knowledgeBases, error: knowledgeBasesError } = await supabase
      .from('knowledge_bases')
      .select('*');

    if (appError || knowledgeBasesError) {
      alert(
        `Error fetching data: App: ${appError} Knowledge Bases: ${knowledgeBasesError}`
      );
    }

    setApp(app);
    setKnowledgeBases(knowledgeBases || []);
  };

  const addKnowledgeBase = async (appId: string, knowledgeBaseId: string) => {
    const { data, error } = await supabase.from('apps_knowledge_bases').insert({
      app_id: app?.id as string,
      knowledge_base_id: knowledgeBaseId,
    });

    if (error) {
      alert(error.message);
    } else {
      getData();
      setShowNewKnowledgeBaseForm(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <h1>App: {app?.name || 'Not found'}</h1>
      <p></p>

      <Button onClick={toggleShowNewKnowledgeBaseForm}>
        Add knowledge base
      </Button>
      <ul>
        {showNewKnowledgeBaseForm &&
          knowledgeBases.map((knowledgeBase) => (
            <li
              key={knowledgeBase.id}
              onClick={() =>
                addKnowledgeBase(app?.id as string, knowledgeBase.id)
              }
            >
              {knowledgeBase.name} <Button>Add</Button>
            </li>
          ))}
      </ul>
    </>
  );
}
