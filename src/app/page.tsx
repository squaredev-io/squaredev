import { Metadata } from 'next';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Label } from '@/components/ui/label';
import { signup } from './login/login.actions';

export const metadata: Metadata = {
  title: 'Authentication',
  description: 'Authentication forms.',
};

export default function Login() {
  return (
    <>
      <div className="md:hidden">
        <Image
          src="/examples/authentication-light.png"
          width={1280}
          height={843}
          alt="Authentication"
          className="block dark:hidden"
        />
        <Image
          src="/examples/authentication-dark.png"
          width={1280}
          height={843}
          alt="Authentication"
          className="hidden dark:block"
        />
      </div>
      <div className="container relative hidden h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        {/* <Link
          href="/examples/authentication"
          className={cn(
            buttonVariants({ variant: 'ghost' }),
            'absolute right-4 top-4 md:right-8 md:top-8'
          )}
        >
          Login
        </Link> */}
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
          <div className="absolute inset-0 bg-zinc-900" />
          <div className="relative z-20 flex items-center text-lg font-medium">
            SquareDev
          </div>
          <div className="relative z-20 mt-auto">
            <blockquote className="space-y-2">
              <p className="text-lg">
                &ldquo;We want to create the best developer experience for
                people developing with AI.&rdquo;
              </p>
              <footer className="text-sm">The Squaredev Team</footer>
            </blockquote>
          </div>
        </div>
        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                Join our early adopters program
              </h1>
              <p className="text-sm text-muted-foreground">
                Enter your credentials below to create your account
              </p>
            </div>
            <div className={cn('grid gap-6')}>
              <form
                action={async (formData) => {
                  'use server';
                  signup(null, formData);
                }}
              >
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
                  <Button type="submit">Create Account</Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
