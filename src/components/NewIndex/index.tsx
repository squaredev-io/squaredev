'use client';

import { Database } from '../../types/supabase';
import { ChangeEvent, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Input } from '@/components/Input';
import { Button } from '../Button';

type NewIndexFormProps = {
  closeForm: () => void;
};

export default function NewIndex({ closeForm }: NewIndexFormProps) {
  const supabase = createClientComponentClient<Database>();
  const [formData, setFormData] = useState({ name: '' });

  const onSubmit = async (e: any) => {
    e.preventDefault();
    const { data, error } = await supabase.from('indexes').insert({
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
    <form onSubmit={onSubmit}>
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
