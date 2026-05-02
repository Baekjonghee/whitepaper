'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  FAMILY_AUTHORS,
  FAMILY_FEED_MAX_LENGTH,
  formatFamilyFeedTimestamp,
  validateFamilyFeedInput,
  type FamilyAuthor,
  type FamilyFeedItem,
} from '@/lib/family-feed';

type FamilyFeedSectionProps = {
  dateKey: string;
  readOnly?: boolean;
  title?: string;
};

type StorageMode = 'server' | 'local';

const FALLBACK_STORAGE_KEY = 'family-feeds-fallback-v1';

function canUseLocalStorage() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

function readLocalFeedStore(): FamilyFeedItem[] {
  if (!canUseLocalStorage()) {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(FALLBACK_STORAGE_KEY);

    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw) as FamilyFeedItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeLocalFeedStore(items: FamilyFeedItem[]) {
  if (!canUseLocalStorage()) {
    return;
  }

  window.localStorage.setItem(FALLBACK_STORAGE_KEY, JSON.stringify(items));
}

function getLocalFeedsByDate(dateKey: string) {
  return readLocalFeedStore()
    .filter((item) => item.dateKey === dateKey)
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

function saveLocalFeed(input: {
  dateKey: string;
  author: string;
  content: string;
}): FamilyFeedItem {
  const validated = validateFamilyFeedInput(input);
  const nextItem: FamilyFeedItem = {
    id: `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    dateKey: validated.dateKey,
    author: validated.author,
    content: validated.content,
    createdAt: new Date().toISOString(),
  };

  const currentItems = readLocalFeedStore();
  writeLocalFeedStore([nextItem, ...currentItems]);

  return nextItem;
}

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
  title = '오늘의 감사 나눔',
}: FamilyFeedSectionProps) {
  const [feeds, setFeeds] = useState<FamilyFeedItem[]>([]);
  const [author, setAuthor] = useState<FamilyAuthor | ''>('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [storageMode, setStorageMode] = useState<StorageMode>('server');

  useEffect(() => {
    let ignore = false;

    const loadFeeds = async () => {
      setIsLoading(true);
      setError('');

      try {
        const items = await fetchFamilyFeeds(dateKey);

        if (!ignore) {
          setFeeds(items);
          setStorageMode('server');
        }
      } catch (loadError) {
        if (!ignore) {
          setFeeds(getLocalFeedsByDate(dateKey));
          setStorageMode('local');
          setError(
            loadError instanceof Error
              ? `${loadError.message} 로컬 저장 모드로 전환합니다.`
              : '가족 피드를 불러오지 못해 로컬 저장 모드로 전환합니다.',
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
      setStorageMode('server');
      setAuthor('');
      setContent('');
    } catch (submitError) {
      try {
        const localItem = saveLocalFeed({
          dateKey,
          author,
          content,
        });

        setFeeds((previous) => [localItem, ...previous]);
        setStorageMode('local');
        setAuthor('');
        setContent('');
        setError('서버 저장이 불안정해 이 기기에 임시 저장했습니다.');
      } catch (fallbackError) {
        setError(
          fallbackError instanceof Error
            ? fallbackError.message
            : submitError instanceof Error
              ? submitError.message
              : '가족 피드를 저장하지 못했습니다.',
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="rounded-[28px] border border-slate-200/80 bg-[#f7f3fb] px-4 py-5 shadow-sm sm:px-6 sm:py-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold tracking-[0.18em] text-violet-500 uppercase">
            gratitude
          </p>
          <h2 className="mt-2 text-2xl font-bold text-slate-900">{title}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            {readOnly
              ? '선택한 날짜에 남긴 가족 나눔을 확인할 수 있습니다.'
              : '말씀 아래 오늘의 감사나 기도제목을 짧게 남겨보세요.'}
          </p>
          {storageMode === 'local' ? (
            <p className="mt-2 text-xs leading-6 text-amber-700">
              현재 서버 연결이 불안정해 이 기기 저장소로 임시 동작 중입니다.
            </p>
          ) : null}
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
            <span className="rounded-md bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700">
              오늘의 감사
            </span>

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
              placeholder="오늘 감사한 일이나 기도제목을 남겨보세요."
              className="w-full resize-none rounded-2xl border border-slate-200 bg-[#faf8fd] px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition focus:border-violet-400"
            />
          </div>

          <div className="mt-3 flex items-center justify-between gap-3 border-t border-slate-100 pt-3">
            <div className="flex items-center gap-3 text-sm">
              <span className="font-medium text-slate-500">
                {remainingLength}/{FAMILY_FEED_MAX_LENGTH}
              </span>
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
            가족 피드를 불러오는 중입니다...
          </div>
        ) : feeds.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white/70 px-4 py-6 text-center text-sm leading-6 text-slate-600">
            {readOnly
              ? '이 날짜에는 아직 남겨진 나눔이 없습니다.'
              : '첫 감사 나눔을 남겨보세요.'}
          </div>
        ) : (
          feeds.map((feed, index) => (
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