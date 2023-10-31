'use client';

import { RedocStandalone } from 'redoc';

export default function ApiDoc() {
  return (
    <RedocStandalone
      specUrl="/api"
      options={{
        nativeScrollbars: false,
        theme: { colors: { primary: { main: '#0ea2f6' } } },
      }}
    />
  );
}
