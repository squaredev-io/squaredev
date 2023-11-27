'use client';

import { useState, useEffect } from 'react';
import { Database } from '@/types/supabase';
import { Index, IndexInsert, Project } from '@/types/supabase-entities';
import Button from '@/components/Button';
import Input from '@/components/Input';
import { get } from 'cypress/types/lodash';
import Link from 'next/link';

export default function Project({ params }: { params: { projectId: string } }) {
  const [project, setProject] = useState<Project | null>(null);
  const [indexes, setIndexes] = useState<Index[]>([]);
  const [isAddingIndex, setIsAddingIndex] = useState(false);
  const [indexName, setIndexName] = useState('');

  useEffect(() => {
    // getData();
  }, []);

  const toggleIsAddingIndex = () => setIsAddingIndex(!isAddingIndex);

  const handleIndexNameChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setIndexName(e.target.value);

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
          <Button disabled={!!indexes.find((i) => i.name === indexName)}>
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
