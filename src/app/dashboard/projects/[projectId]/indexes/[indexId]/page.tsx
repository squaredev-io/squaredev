'use client';

import { useState, useEffect } from 'react';
import { Database } from '@/types/supabase';
import { Index, Document } from '@/types/supabase-entities';
import { param } from 'cypress/types/jquery';

export default function Index({
  params,
}: {
  params: { projectId: string; indexId: string };
}) {
  const [file, setFile] = useState<File>();
  const [index, setIndex] = useState<Index | null>(null);
  const [documents, setDocuments] = useState<Document[] | []>([]);
  const [editingId, setEditingId] = useState<Document['id'] | null>(null);
  const [editedText, setEditedText] = useState('');

  const handleEditClick = (id: string, text: string) => {
    setEditingId(id);
    setEditedText(text);
  };

  const handleCancelClick = () => {
    setEditingId(null);
    setEditedText('');
  };

  useEffect(() => {
    getData();
  }, []);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) return;

    try {
      const data = new FormData();
      data.set('file', file);

      const res = await fetch(
        `/dashboard/projects/${params.projectId}/indexes/${params.indexId}/upload`,
        {
          method: 'POST',
          body: data,
        }
      );
      if (!res.ok) throw new Error(await res.text());
      getData();
    } catch (e: any) {
      alert(`Error uploading file: ${e.message}`);
      console.error(e);
    }
  };

  return (
    <>
      <h1>Index: {index?.name || 'Not found'}</h1>
      <p>Upload document</p>
      <form onSubmit={onSubmit}>
        <input
          type="file"
          accept="application/pdf"
          name="file"
          id="file"
          onChange={(e) => setFile(e.target.files?.[0])}
        />
        <input type="submit" value="Upload" name="submit" />
      </form>
      <hr />

      <h2>Documents</h2>
      {documents?.map((document) => (
        <div key={document.id}>
          {editingId === document.id ? (
            <div>
              <textarea
                rows={10}
                style={{ width: '60%' }}
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
              />
              <button>Save</button>
              <button onClick={handleCancelClick}>Cancel</button>
            </div>
          ) : (
            <div onClick={() => handleEditClick(document.id, document.content)}>
              <p>
                {document.content.slice(0, 50) +
                  (document.content.length > 15 ? '...' : '')}
              </p>
            </div>
          )}
        </div>
      ))}
    </>
  );
}
