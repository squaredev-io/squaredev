'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useState, useEffect } from 'react';
import { Database } from '@/types/supabase';
import { Index, IndexInsert, Project } from '@/types/supabase-entities';
import Button from '@/components/Button';
import Input from '@/components/Input';
import { get } from 'cypress/types/lodash';
import Link from 'next/link';

export default function Project({ params }: { params: { projectId: string } }) {
  const supabase = createClientComponentClient<Database>();
  const [project, setProject] = useState<Project | null>(null);
  const [indexes, setIndexes] = useState<Index[]>([]);
  const [isAddingIndex, setIsAddingIndex] = useState(false);
  const [indexName, setIndexName] = useState('');

  const getData = async () => {
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', params.projectId)
      .single();

    if (projectError) {
      alert(`Error fetching data: project: ${projectError}`);
    }

    const { data: indexes, error: indexesError } = await supabase
      .from('indexes')
      .select('*')
      .eq('project_id', params.projectId);

    if (indexesError) {
      alert(`Error fetching data: indexes: ${indexesError}`);
    }

    setProject(project);
    setIndexes(indexes || []);
  };

  useEffect(() => {
    getData();
  }, []);

  const toggleIsAddingIndex = () => setIsAddingIndex(!isAddingIndex);

  const handleIndexNameChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setIndexName(e.target.value);

  const addIndex = async () => {
    const newIndex: IndexInsert = {
      name: indexName,
      project_id: params.projectId,
    };
    const { data: index, error: indexError } = await supabase
      .from('indexes')
      .insert(newIndex)
      .single();

    if (indexError) {
      alert(`Error adding index: ${indexError}`);
    }

    getData();
    toggleIsAddingIndex();
  };

  return (
    <>
      <h1>project: {project?.name || 'Not found'}</h1>
      <Button onClick={toggleIsAddingIndex}>Add index</Button>

      {isAddingIndex && (
        <>
          <Input
            onChange={handleIndexNameChange}
            type="text"
            placeholder="index name"
            name="name"
          />
          <Button
            disabled={!!indexes.find((i) => i.name === indexName)}
            onClick={addIndex}
          >
            add
          </Button>
        </>
      )}

      <p>Indexes:</p>
      <ul>
        {indexes.map((index) => (
          <li key={index.id}>
            <Link href={`/dashboard/projects/${index.id}/indexes/${index.id}`}>
              <p>{index.name}</p>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
