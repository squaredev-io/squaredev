'use client';
import { cn } from '@/lib/utils';
// import { Icons } from '@/components/icons';/
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Label } from '@/components/ui/label';
import {
  experimental_useFormStatus as useFormStatus,
  // @ts-expect-error
  experimental_useFormState as useFormState,
} from 'react-dom';
import { signup, signin } from '../login.actions';

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

const initialFormState = {
  error: null,
};

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [signupState, signupAction] = useFormState(signup, initialFormState);
  const [signinState, signinAction] = useFormState(signin, initialFormState);

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      {signupState?.error}
      {signinState?.error}

      <form action={signupAction} method="post">
        <div className="grid gap-2">
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="email">
              Email
            </Label>
            <Input
              id="email"
              placeholder="name@example.com"
              // type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              name="email"
            />
          </div>
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="email">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              autoCorrect="off"
              name="password"
            />
          </div>
          <Button type="submit">
            {/* {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )} */}
            Create Account
          </Button>
        </div>
      </form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with your existing account
          </span>
        </div>
      </div>

      <form action="/auth/sign-in" method="post">
        <div className="grid gap-2">
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="email">
              Email
            </Label>
            <Input
              id="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              name="email"
            />
          </div>
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="email">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              autoCorrect="off"
              name="password"
            />
          </div>
          <Button type="submit" formAction={signinAction}>
            {/* {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )} */}
            Sign In with Email
          </Button>
        </div>
      </form>
    </div>
  );
}
