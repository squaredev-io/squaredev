'use client';
import Button from '@/components/Button';
import Input from '@/components/Input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { redirect } from 'next/navigation';
import {
  experimental_useFormStatus as useFormStatus,
  // @ts-expect-error
  experimental_useFormState as useFormState,
} from 'react-dom';
import { createApiKey } from '../projects.actions';

const initialFormState = {
  error: null,
};

export default function NewApiKeyPage() {
  const [createApiKeyFormState, createApiKeyFormAction] = useFormState(
    createApiKey,
    initialFormState
  );

  return (
    <Card>
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold tracking-tight">
          {createApiKeyFormState?.error}
        </h1>
      </div>
      <CardHeader className="flex flex-col space-y-1 h-screen/2 w-screen/2">
        <div className="flex justify-between">
          <h1 className="text-3xl font-bold tracking-tight">New API Key</h1>
        </div>
      </CardHeader>
      <CardContent>
        <form
          className="flex space-x-4 text-sm text-muted-foreground"
          action={createApiKeyFormAction}
        >
          <Label className="sr-only" htmlFor="name">
            Project name
          </Label>
          <Input
            id="name"
            placeholder="My project"
            autoCapitalize="none"
            autoCorrect="off"
            name="name"
          />
          <Button type="submit">
            {/* {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )} */}
            Create API Key
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
