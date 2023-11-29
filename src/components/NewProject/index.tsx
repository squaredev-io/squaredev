'use client';

import { ChangeEvent, useState } from 'react';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';

type NewProjectFormProps = {
  closeForm: () => void;
};

export default function NewProject({ closeForm }: NewProjectFormProps) {
  const [formData, setFormData] = useState({ name: '' });

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  return (
    <form className="new-project">
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
