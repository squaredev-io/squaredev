import { createSwaggerSpec } from 'next-swagger-doc';
import { NextResponse } from 'next/server';
import { generateOpenApi } from '@/lib/public-api/openapi';

export function GET() {
  const spec = generateOpenApi();

  return NextResponse.json(spec);
}
