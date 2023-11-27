'use client';

import { Database } from '../../types/supabase';
import { ChangeEvent, useState } from 'react';
import { Input } from '@/components/Input';
import { Button } from '../Button';

type NewIndexFormProps = {
  closeForm: () => void;
};

export default function NewIndex({ closeForm }: NewIndexFormProps) {
  const [formData, setFormData] = useState({ name: '' });

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  return (
    <form>
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
