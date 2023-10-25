import { createSwaggerSpec } from 'next-swagger-doc';
import { NextResponse } from 'next/server';

export function GET() {
  const spec: Record<string, any> = createSwaggerSpec({
    apiFolder: 'src/app/api',
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'SquareDev Public API',
        version: 'beta',
      },
    },
  });

  return NextResponse.json(spec);
}
