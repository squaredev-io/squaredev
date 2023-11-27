import { useState, useEffect } from 'react';
import Button from '@/components/Button';
import Input from '@/components/Input';
import { get } from 'cypress/types/lodash';
import Link from 'next/link';

export default function Project({ params }: { params: { projectId: string } }) {
  return (
    <>
      <h1>project: 'Not found'</h1>
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
