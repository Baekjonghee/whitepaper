import { NextRequest, NextResponse } from 'next/server';
import { APP_LAUNCH_DATE_KEY, isValidDateKey } from '@/lib/daily-verse';
import {
  FAMILY_AUTHORS,
  formatFamilyFeedTimestamp,
  isFamilyAuthor,
  validateFamilyFeedInput,
  type FamilyFeedItem,
} from '@/lib/family-feed';
import { getSupabaseAdminClient } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

type FamilyFeedRow = {
  id: string;
  date_key: string;
  author: string;
  content: string;
  created_at: string;
};

function jsonError(message: string, status: number) {
  return NextResponse.json({ message }, { status });
}

function mapRowToItem(row: FamilyFeedRow): FamilyFeedItem {
  if (!isFamilyAuthor(row.author)) {
    throw new Error('DB에 허용되지 않은 작성자가 저장되어 있습니다.');
  }

  return {
    id: row.id,
    dateKey: row.date_key,
    author: row.author,
    content: row.content,
    createdAt: row.created_at,
  };
}

export async function GET(request: NextRequest) {
  const dateKey = request.nextUrl.searchParams.get('date');

  if (!dateKey || !isValidDateKey(dateKey) || dateKey < APP_LAUNCH_DATE_KEY) {
    return jsonError('유효한 날짜가 아닙니다.', 400);
  }

  try {
    const supabase = getSupabaseAdminClient();
    const { data, error } = await supabase
      .from('family_feeds')
      .select('id, date_key, author, content, created_at')
      .eq('date_key', dateKey)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json({
      items: (data ?? []).map((row) => mapRowToItem(row as FamilyFeedRow)),
    });
  } catch (error) {
    return jsonError(
      error instanceof Error ? error.message : '가족 피드를 불러오지 못했습니다.',
      500,
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      dateKey?: string;
      author?: string;
      content?: string;
    };

    const nextItem = validateFamilyFeedInput({
      dateKey: body.dateKey ?? '',
      author: body.author ?? '',
      content: body.content ?? '',
    });

    const supabase = getSupabaseAdminClient();
    const { data, error } = await supabase
      .from('family_feeds')
      .insert({
        date_key: nextItem.dateKey,
        author: nextItem.author,
        content: nextItem.content,
      })
      .select('id, date_key, author, content, created_at')
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json(
      {
        item: mapRowToItem(data as FamilyFeedRow),
      },
      { status: 201 },
    );
  } catch (error) {
    return jsonError(
      error instanceof Error ? error.message : '가족 피드를 저장하지 못했습니다.',
      400,
    );
  }
}
