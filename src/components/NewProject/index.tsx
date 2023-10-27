'use client';

import { Database } from '../../types/supabase';
import { ChangeEvent, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';

type NewProjectFormProps = {
  closeForm: () => void;
};

export default function NewProject({ closeForm }: NewProjectFormProps) {
  const supabase = createClientComponentClient<Database>();
  const [formData, setFormData] = useState({ name: '' });

  const createNewProject = async (e: any) => {
    e.preventDefault();
    const { data, error } = await supabase.from('projects').insert({
      name: formData.name,
    });
    if (error) {
      console.error(error);
      alert(error.message);
    } else {
      closeForm();
    }
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  return (
    <form className="new-project" onSubmit={createNewProject}>
      <div className="flex w-full max-w-sm items-center space-x-2">
        <Input
          type="text"
          name="name"
          required
          onChange={handleChange}
          value={formData.name}
        />
        <Button type="submit">Create</Button>
      </div>
    </form>
  );
}
