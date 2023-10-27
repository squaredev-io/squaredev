'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useState, useEffect } from 'react';
import { Database } from '@/types/supabase';
import { Index, Document } from '@/types/supabase-entities';
import { param } from 'cypress/types/jquery';

export default function Index({
  params,
}: {
  params: { projectId: string; indexId: string };
}) {
  const supabase = createClientComponentClient<Database>();
  const [file, setFile] = useState<File>();
  const [index, setIndex] = useState<Index | null>(null);
  const [documents, setDocuments] = useState<Document[] | []>([]);
  const [editingId, setEditingId] = useState<Document['id'] | null>(null);
  const [editedText, setEditedText] = useState('');

  const handleEditClick = (id: string, text: string) => {
    setEditingId(id);
    setEditedText(text);
  };

  const handleSaveClick = async (id: string) => {
    const document = documents?.find((d) => d.id === id);
    if (!document) return;

    console.log(id);

    const { data: updatedDocument, error } = await supabase
      .from('documents')
      .update({ content: editedText })
      .eq('id', id);

    if (error) {
      alert(`Error updating document: ${error.message}`);
      return;
    }
    setEditingId(null);
    setEditedText('');
    getData();
  };

  const handleCancelClick = () => {
    setEditingId(null);
    setEditedText('');
  };

  const getData = async () => {
    const { data: index, error: indexError } = await supabase
      .from('indexes')
      .select('*')
      .eq('id', params.indexId)
      .single();

    if (indexError) {
      alert(`Error fetching data: ${indexError}`);
    }

    const { data: documents, error: documentsError } = await supabase
      .from('documents')
      .select('*')
      .eq('index_id', params.indexId);

    if (documentsError) {
      alert(`Error fetching data:Documents: ${documentsError}`);
    }

    setIndex(index || null);
    setDocuments(documents || []);
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
              <button onClick={() => handleSaveClick(document.id)}>Save</button>
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
