import { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Thank you',
  description: 'Thank you for signing up.',
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
                Thank your for joining SquareDev.
              </h1>
              <p className="text-sm text-muted-foreground">
                We will get back to you as soon as possible with how to use your
                account.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
