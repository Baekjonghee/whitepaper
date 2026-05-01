import { NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabase = getSupabaseAdminClient();

    const [{ error: dailyVersesError }, { error: familyFeedsError }] = await Promise.all([
      supabase.from('daily_verses').select('id', { head: true, count: 'exact' }).limit(1),
      supabase.from('family_feeds').select('id', { head: true, count: 'exact' }).limit(1),
    ]);

    return NextResponse.json({
      ok: !dailyVersesError && !familyFeedsError,
      dailyVersesError: dailyVersesError?.message ?? null,
      familyFeedsError: familyFeedsError?.message ?? null,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        dailyVersesError: null,
        familyFeedsError: error instanceof Error ? error.message : 'Unknown Supabase error',
      },
      { status: 500 },
    );
  }
}
