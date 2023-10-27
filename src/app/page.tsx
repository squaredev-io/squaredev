import * as React from 'react';
import { MainNav } from './components/nav';
import Button from '@/components/Button';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <>
      <div className="border-b">
        <div className="flex h-16 items-center px-4">
          <MainNav className="mx-6" />
        </div>
      </div>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="max-w-4xl w-full px-6 py-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Welcome to SquareDev!
          </h1>
          <p className="text-gray-700 mb-6">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod
            euismod nisi, vel dictum elit bibendum vel. Nullam euismod, nisl vel
            lacinia bibendum, velit sapien bibendum nunc, vel bibendum sapien
            sapien vel velit. Sed euismod euismod nisi, vel dictum elit bibendum
            vel. Nullam euismod, nisl vel lacinia bibendum, velit sapien
            bibendum nunc, vel bibendum sapien sapien vel velit.
          </p>
          <Link href="/login">
            <Button className="mr-4">Get Started</Button>
          </Link>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="bg-white shadow-md rounded-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Feature 1
              </h2>
              <p className="text-gray-700">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                euismod euismod nisi, vel dictum elit bibendum vel. Nullam
                euismod, nisl vel lacinia bibendum, velit sapien bibendum nunc,
                vel bibendum sapien sapien vel velit.
              </p>
            </div>
            <div className="bg-white shadow-md rounded-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Feature 2
              </h2>
              <p className="text-gray-700">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                euismod euismod nisi, vel dictum elit bibendum vel. Nullam
                euismod, nisl vel lacinia bibendum, velit sapien bibendum nunc,
                vel bibendum sapien sapien vel velit.
              </p>
            </div>
            <div className="bg-white shadow-md rounded-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Feature 3
              </h2>
              <p className="text-gray-700">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                euismod euismod nisi, vel dictum elit bibendum vel. Nullam
                euismod, nisl vel lacinia bibendum, velit sapien bibendum nunc,
                vel bibendum sapien sapien vel velit.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
