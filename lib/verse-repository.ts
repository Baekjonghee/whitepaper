import { getSupabaseAdminClient } from '@/lib/supabase-admin';
import { VERSES, type Verse } from '@/lib/verses';

type DailyVerseRow = {
  id: string;
  sort_order: number;
  reference: string;
  text: string;
};

function mapRowToVerse(row: DailyVerseRow): Verse {
  return {
    id: row.id,
    topic: '',
    reference: row.reference,
    text: row.text,
    meditationPrompt: '',
    source: 'daily_verses',
  };
}

export async function getAllDailyVerses(): Promise<Verse[]> {
  try {
    const supabase = getSupabaseAdminClient();
    const { data, error } = await supabase
      .from('daily_verses')
      .select('id, sort_order, reference, text')
      .order('sort_order', { ascending: true });

    if (error) {
      throw error;
    }

    if (!data || data.length === 0) {
      throw new Error('daily_verses table is empty.');
    }

    return (data as DailyVerseRow[]).map((row) => mapRowToVerse(row));
  } catch (error) {
    console.error('[verse-repository] failed to load daily_verses, fallback to local verses', error);
    return VERSES;
  }
}
