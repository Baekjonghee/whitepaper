import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

function hasValue(name: string) {
  const value = process.env[name];
  return typeof value === 'string' && value.trim().length > 0;
}

export async function GET() {
  return NextResponse.json({
    hasNextPublicSupabaseUrl: hasValue('NEXT_PUBLIC_SUPABASE_URL'),
    hasSupabaseUrl: hasValue('SUPABASE_URL'),
    hasServiceRoleKey: hasValue('SUPABASE_SERVICE_ROLE_KEY'),
    hasSecretKey: hasValue('SUPABASE_SECRET_KEY'),
  });
}
