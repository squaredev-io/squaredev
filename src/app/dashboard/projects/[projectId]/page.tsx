import { useState, useEffect } from 'react';
import Button from '@/components/Button';
import Input from '@/components/Input';
import { get } from 'cypress/types/lodash';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { Project } from '@/types/project';

const loadProject = async (projectId: string) => {
  const res = await fetch(
    `${process.env.PLATFORM_API}/users/api-keys/${projectId}`,
    {
      headers: {
        Authorization: `Bearer ${cookies().get('access_token')?.value}`,
      },
    }
  );
  const json = (await res.json()) as ApiKey;
  return json;
};

export default async function Project({
  params,
}: {
  params: { projectId: string };
}) {
  const project = await loadProject(params.projectId);

  return (
    <>
      <h1>Api Key: {project.key}</h1>
      {/* <Button onClick={toggleIsAddingIndex}>Add index</Button>

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
      </ul> */}
    </>
  );
}
