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
    throw new Error(payload.message ?? '가족 피드를 불러오지 못했습니다.');
  }

  return payload.items ?? [];
}

export default function FamilyFeedSection({
  dateKey,
  readOnly = false,
  title = '가족 피드',
}: FamilyFeedSectionProps) {
  const [feeds, setFeeds] = useState<FamilyFeedItem[]>([]);
  const [author, setAuthor] = useState<FamilyAuthor | ''>('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
              : '가족 피드를 불러오지 못했습니다.',
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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/feeds', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dateKey,
          author,
          content,
        }),
      });

      const payload = (await response.json()) as {
        item?: FamilyFeedItem;
        message?: string;
      };

      if (!response.ok || !payload.item) {
        throw new Error(payload.message ?? '가족 피드를 저장하지 못했습니다.');
      }

      setFeeds((previous) => [payload.item as FamilyFeedItem, ...previous]);
      setAuthor('');
      setContent('');
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : '가족 피드를 저장하지 못했습니다.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="rounded-3xl border border-white/60 bg-white/80 p-5 shadow-sm backdrop-blur-sm sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold tracking-[0.18em] text-amber-900 uppercase">
            Family Feed
          </p>
          <h2 className="mt-2 text-2xl font-bold text-slate-900">{title}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            {readOnly
              ? '선택한 날짜에 남긴 가족 나눔을 확인할 수 있습니다.'
              : '기도제목 또는 감사나눔을 70자 이내로 남겨보세요.'}
          </p>
        </div>

        <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-900">
          {feeds.length}개
        </span>
      </div>

      {!readOnly ? (
        <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-[180px_minmax(0,1fr)]">
            <label className="space-y-2">
              <span className="text-sm font-semibold text-slate-800">작성자</span>
              <select
                value={author}
                onChange={(event) => setAuthor(event.target.value as FamilyAuthor | '')}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-amber-700"
              >
                <option value="">작성자 선택</option>
                {FAMILY_AUTHORS.map((member) => (
                  <option key={member} value={member}>
                    {member}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-2">
              <span className="text-sm font-semibold text-slate-800">가족 나눔</span>
              <textarea
                value={content}
                onChange={(event) => setContent(event.target.value)}
                maxLength={FAMILY_FEED_MAX_LENGTH}
                rows={3}
                placeholder="예: 오늘 말씀 붙들고 서로 격려하게 해주세요."
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition focus:border-amber-700"
              />
            </label>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-slate-500">남은 글자 수 · {remainingLength}</p>
              {error ? <p className="mt-1 text-sm text-rose-600">{error}</p> : null}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center rounded-full bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? '저장 중...' : '가족 피드 남기기'}
            </button>
          </div>
        </form>
      ) : null}

      <div className="mt-6 space-y-3">
        {isLoading ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/70 px-4 py-6 text-center text-sm leading-6 text-slate-600">
            가족 피드를 불러오는 중입니다...
          </div>
        ) : feeds.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/70 px-4 py-6 text-center text-sm leading-6 text-slate-600">
            {readOnly
              ? '이 날짜에는 아직 남겨진 가족 피드가 없습니다.'
              : '첫 가족 나눔을 남겨보세요.'}
          </div>
        ) : (
          feeds.map((feed) => (
            <article
              key={feed.id}
              className="rounded-2xl border border-slate-100 bg-white px-4 py-4 shadow-sm"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">
                  {feed.author}
                </span>
                <span className="text-xs text-slate-500">
                  {formatFamilyFeedTimestamp(feed.createdAt)}
                </span>
              </div>
              <p className="mt-3 text-sm leading-7 text-slate-800">{feed.content}</p>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
