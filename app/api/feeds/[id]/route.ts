import { NextRequest, NextResponse } from 'next/server';
import { getTodayDateKey } from '@/lib/daily-verse';
import {
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

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
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

async function getFeedRow(id: string) {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from('family_feeds')
    .select('id, date_key, author, content, created_at')
    .eq('id', id)
    .single();

  if (error || !data) {
    throw new Error('감사 나눔을 찾지 못했습니다.');
  }

  return data as FamilyFeedRow;
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = (await request.json()) as {
      author?: string;
      content?: string;
    };

    const currentRow = await getFeedRow(id);

    const nextItem = validateFamilyFeedInput({
      dateKey: currentRow.date_key,
      author: body.author ?? currentRow.author,
      content: body.content ?? currentRow.content,
    });

    const supabase = getSupabaseAdminClient();
    const { data, error } = await supabase
      .from('family_feeds')
      .update({
        author: nextItem.author,
        content: nextItem.content,
      })
      .eq('id', id)
      .select('id, date_key, author, content, created_at')
      .single();

    if (error || !data) {
      throw new Error(error?.message ?? '감사 나눔을 수정하지 못했습니다.');
    }

    return NextResponse.json({
      item: mapRowToItem(data as FamilyFeedRow),
    });
  } catch (error) {
    return jsonError(
      error instanceof Error ? error.message : '감사 나눔을 수정하지 못했습니다.',
      400,
    );
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const currentRow = await getFeedRow(id);

    if (currentRow.date_key !== getTodayDateKey()) {
      return jsonError('오늘 날짜 나눔만 삭제할 수 있습니다.', 400);
    }

    const supabase = getSupabaseAdminClient();
    const { error } = await supabase.from('family_feeds').delete().eq('id', id);

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return jsonError(
      error instanceof Error ? error.message : '감사 나눔을 삭제하지 못했습니다.',
      400,
    );
  }
}
