'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  FAMILY_AUTHORS,
  FAMILY_FEED_MAX_LENGTH,
  formatFamilyFeedTimestamp,
  type FamilyAuthor,
  type FamilyFeedItem,
} from '@/lib/family-feed';

type FamilyFeedSectionProps = {
  dateKey: string;
  readOnly?: boolean;
  title?: string;
};

async function fetchFamilyFeeds(dateKey: string) {
  const response = await fetch(`/api/feeds?date=${dateKey}`, {
    cache: 'no-store',
  });

  const payload = (await response.json()) as {
    items?: FamilyFeedItem[];
    message?: string;
  };

  if (!response.ok) {
    throw new Error(payload.message ?? '감사 나눔을 불러오지 못했습니다.');
  }

  return payload.items ?? [];
}

async function createFamilyFeed(input: {
  dateKey: string;
  author: FamilyAuthor | '';
  content: string;
}) {
  const response = await fetch('/api/feeds', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  const payload = (await response.json()) as {
    item?: FamilyFeedItem;
    message?: string;
  };

  if (!response.ok || !payload.item) {
    throw new Error(payload.message ?? '감사 나눔을 저장하지 못했습니다.');
  }

  return payload.item;
}

async function updateFamilyFeed(input: {
  id: string;
  author: FamilyAuthor | '';
  content: string;
}) {
  const response = await fetch(`/api/feeds/${input.id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      author: input.author,
      content: input.content,
    }),
  });

  const payload = (await response.json()) as {
    item?: FamilyFeedItem;
    message?: string;
  };

  if (!response.ok || !payload.item) {
    throw new Error(payload.message ?? '감사 나눔을 수정하지 못했습니다.');
  }

  return payload.item;
}

async function deleteFamilyFeed(id: string) {
  const response = await fetch(`/api/feeds/${id}`, {
    method: 'DELETE',
  });

  const payload = (await response.json()) as {
    success?: boolean;
    message?: string;
  };

  if (!response.ok || !payload.success) {
    throw new Error(payload.message ?? '감사 나눔을 삭제하지 못했습니다.');
  }
}

export default function FamilyFeedSection({
  dateKey,
  readOnly = false,
  title = '오늘의 감사 나눔',
}: FamilyFeedSectionProps) {
  const [feeds, setFeeds] = useState<FamilyFeedItem[]>([]);
  const [author, setAuthor] = useState<FamilyAuthor | ''>('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editAuthor, setEditAuthor] = useState<FamilyAuthor | ''>('');
  const [editContent, setEditContent] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    const loadFeeds = async () => {
      setIsLoading(true);
      setError('');

      try {
        const items = await fetchFamilyFeeds(dateKey);

        if (!ignore) {
          setFeeds(items);
        }
      } catch (loadError) {
        if (!ignore) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : '감사 나눔을 불러오지 못했습니다.',
          );
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    };

    void loadFeeds();

    return () => {
      ignore = true;
    };
  }, [dateKey]);

  const remainingLength = useMemo(
    () => FAMILY_FEED_MAX_LENGTH - content.length,
    [content.length],
  );

  const editRemainingLength = useMemo(
    () => FAMILY_FEED_MAX_LENGTH - editContent.length,
    [editContent.length],
  );

  const handleReset = () => {
    setAuthor('');
    setContent('');
    setError('');
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const item = await createFamilyFeed({
        dateKey,
        author,
        content,
      });

      setFeeds((previous) => [item, ...previous]);
      setAuthor('');
      setContent('');
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : '감사 나눔을 저장하지 못했습니다.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const startEditing = (feed: FamilyFeedItem) => {
    setEditingId(feed.id);
    setEditAuthor(feed.author);
    setEditContent(feed.content);
    setError('');
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditAuthor('');
    setEditContent('');
  };

  const handleUpdate = async (feedId: string) => {
    setError('');
    setIsUpdating(true);

    try {
      const updatedItem = await updateFamilyFeed({
        id: feedId,
        author: editAuthor,
        content: editContent,
      });

      setFeeds((previous) =>
        previous.map((feed) => (feed.id === feedId ? updatedItem : feed)),
      );
      cancelEditing();
    } catch (updateError) {
      setError(
        updateError instanceof Error
          ? updateError.message
          : '감사 나눔을 수정하지 못했습니다.',
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async (feedId: string) => {
    const confirmed = window.confirm('이 감사 나눔을 삭제할까요?');

    if (!confirmed) {
      return;
    }

    setError('');
    setDeletingId(feedId);

    try {
      await deleteFamilyFeed(feedId);
      setFeeds((previous) => previous.filter((feed) => feed.id !== feedId));

      if (editingId === feedId) {
        cancelEditing();
      }
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : '감사 나눔을 삭제하지 못했습니다.',
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <section className="rounded-[28px] border border-slate-200/80 bg-[#f7f3fb] px-4 py-5 shadow-sm sm:px-6 sm:py-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
        </div>

        <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-violet-700 shadow-sm">
          {feeds.length}개
        </span>
      </div>

      {!readOnly ? (
        <form
          className="mt-5 rounded-[24px] border border-violet-200/80 bg-white/90 p-3 shadow-sm"
          onSubmit={handleSubmit}
        >
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={author}
              onChange={(event) => setAuthor(event.target.value as FamilyAuthor | '')}
              className="min-w-[140px] rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-violet-400"
            >
              <option value="">작성자 선택</option>
              {FAMILY_AUTHORS.map((member) => (
                <option key={member} value={member}>
                  {member}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-3">
            <textarea
              value={content}
              onChange={(event) => setContent(event.target.value)}
              maxLength={FAMILY_FEED_MAX_LENGTH}
              rows={2}
              placeholder="감사한 일이나 기도제목을 남겨보세요."
              className="w-full resize-none rounded-2xl border border-slate-200 bg-[#faf8fd] px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition focus:border-violet-400"
            />
          </div>

          <div className="mt-3 flex items-center justify-between gap-3 border-t border-slate-100 pt-3">
            <div className="flex items-center gap-3 text-sm">
              <span className="font-medium text-slate-500">{remainingLength}/{FAMILY_FEED_MAX_LENGTH}</span>
              {error ? <span className="text-rose-600">{error}</span> : null}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleReset}
                className="rounded-full px-4 py-2 text-sm font-semibold text-slate-500 transition hover:bg-slate-100"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-full bg-violet-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? '저장 중...' : '올리기'}
              </button>
            </div>
          </div>
        </form>
      ) : null}

      <div className="mt-5 space-y-3">
        {isLoading ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white/70 px-4 py-6 text-center text-sm leading-6 text-slate-600">
            감사 나눔을 불러오는 중입니다...
          </div>
        ) : feeds.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white/70 px-4 py-6 text-center text-sm leading-6 text-slate-600">
            {readOnly ? '이 날짜에는 아직 남겨진 나눔이 없습니다.' : '첫 감사 나눔을 남겨보세요.'}
          </div>
        ) : (
          feeds.map((feed, index) => {
            const isEditing = editingId === feed.id;

            return (
              <article
                key={feed.id}
                className="rounded-2xl border border-violet-100 bg-white px-4 py-4 shadow-sm"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-violet-100 px-2.5 py-1 text-xs font-semibold text-violet-700">
                      {index + 1}번째 감사
                    </span>
                    <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">
                      {feed.author}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">
                      {formatFamilyFeedTimestamp(feed.createdAt)}
                    </span>
                    {!readOnly ? (
                      <>
                        <button
                          type="button"
                          onClick={() => startEditing(feed)}
                          className="rounded-full px-3 py-1 text-xs font-semibold text-violet-700 transition hover:bg-violet-50"
                        >
                          수정
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(feed.id)}
                          disabled={deletingId === feed.id}
                          className="rounded-full px-3 py-1 text-xs font-semibold text-rose-600 transition hover:bg-rose-50 disabled:opacity-60"
                        >
                          {deletingId === feed.id ? '삭제 중...' : '삭제'}
                        </button>
                      </>
                    ) : null}
                  </div>
                </div>

                {isEditing ? (
                  <div className="mt-3 rounded-2xl border border-slate-200 bg-[#faf8fd] p-3">
                    <select
                      value={editAuthor}
                      onChange={(event) => setEditAuthor(event.target.value as FamilyAuthor | '')}
                      className="min-w-[140px] rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-violet-400"
                    >
                      <option value="">작성자 선택</option>
                      {FAMILY_AUTHORS.map((member) => (
                        <option key={member} value={member}>
                          {member}
                        </option>
                      ))}
                    </select>

                    <textarea
                      value={editContent}
                      onChange={(event) => setEditContent(event.target.value)}
                      maxLength={FAMILY_FEED_MAX_LENGTH}
                      rows={2}
                      className="mt-3 w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition focus:border-violet-400"
                    />

                    <div className="mt-3 flex items-center justify-between gap-3">
                      <span className="text-sm font-medium text-slate-500">
                        {editRemainingLength}/{FAMILY_FEED_MAX_LENGTH}
                      </span>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={cancelEditing}
                          className="rounded-full px-4 py-2 text-sm font-semibold text-slate-500 transition hover:bg-slate-100"
                        >
                          취소
                        </button>
                        <button
                          type="button"
                          onClick={() => handleUpdate(feed.id)}
                          disabled={isUpdating}
                          className="rounded-full bg-violet-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {isUpdating ? '저장 중...' : '저장'}
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="mt-3 text-sm leading-7 text-slate-800">{feed.content}</p>
                )}
              </article>
            );
          })
        )}
      </div>
    </section>
  );
}
