'use client';
import Button from '@/components/Button';
import Input from '@/components/Input';
import { createProject } from '@/app/actions';
import {
  // @ts-expect-error
  experimental_useFormState as useFormState,
} from 'react-dom';
import { useState } from 'react';
import { CopyIcon, CheckIcon } from 'lucide-react';

const initialState = {
  error: null,
};

export default function NewProject() {
  const [state, formAction] = useFormState(createProject, initialState);
  const [copied, setCopied] = useState(false);

  console.log({ state });

  return (
    <>
      <div className="flex flex-col items-center">
        <h1 className="text-3xl font-bold">New Project</h1>
        <div className="flex flex-col items-center">
          <form action={formAction}>
            <Input
              id="project-name"
              placeholder="project name"
              autoCapitalize="none"
              name="project-name"
              required
            />
            <Input
              id="project-description"
              placeholder="Project description"
              autoCapitalize="none"
              name="project-description"
            />
            <Button type="submit">Create Project</Button>
          </form>

          {state.api_key && (
            <div className="text-sm text-gray-500">
              Copy the api key now. You'll never see it again.
              <br />
              {state.api_key}
              <Button
                onClick={() => {
                  navigator.clipboard.writeText(state.api_key);
                  setCopied(true);
                }}
              >
                {copied ? <CheckIcon /> : <CopyIcon />}
              </Button>
            </div>
          )}

          {state.error && (
            <div className="text-sm text-gray-500">{state.error}</div>
          )}
        </div>
      </div>
    </>
  );
}
