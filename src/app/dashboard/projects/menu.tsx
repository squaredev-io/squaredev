'use client';

import Button from '@/components/Button';
import { Project } from '@/types/project';
import { useState } from 'react';
import {
  experimental_useFormStatus as useFormStatus,
  // @ts-expect-error
  experimental_useFormState as useFormState,
} from 'react-dom';

const initialState = {
  message: null,
};

export default function Menu({
  children,
  project,
}: {
  children?: React.ReactNode;
  project: Project;
}) {
  // state for modal
  const [isOpen, setIsOpen] = useState(false);
  // const [state, formAction] = useFormState(deleteProject, initialState);

  return (
    <>
      <div className="flex items-center space-x-2">
        <Button
          onClick={() => {
            setIsOpen(true);
          }}
        >
          delete
        </Button>
      </div>
      {isOpen && (
        <form>
          <input type="hidden" name="project-id" value={project.id} />
          <div className="fixed inset-0 z-50 flex items-center justify-center w-full h-full bg-black bg-opacity-50 text-slate-950">
            <div className="relative z-50 w-11/12 p-8 bg-white border border-gray-300 rounded-lg">
              <h2 className="text-xl font-semibold text-center">
                Are you sure you want to delete this project?
              </h2>
              <div className="flex justify-center mt-4 space-x-4">
                <Button
                  variant="default"
                  onClick={() => {
                    setIsOpen(false);
                  }}
                >
                  Cancel
                </Button>
                <Button variant="destructive">Delete</Button>
              </div>
            </div>
          </div>
        </form>
      )}
    </>
  );
}
