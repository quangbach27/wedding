"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Heart, LoaderCircle, Pause, Play } from "lucide-react";
import LatestWish from "@/components/ui/latest-wish-card";
import { WishCard } from "@/components/ui/wish-card";
import type { WishPage } from "@/lib/repository/wish";

export default function WishWallList({
  initialPage,
}: {
  initialPage: WishPage;
}) {
  const [page, setPage] = useState(initialPage);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [autoScroll, setAutoScroll] = useState(true);
  const isLoadingRef = useRef(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const touchStartYRef = useRef<number | null>(null);
  const latest = page.items[0] ?? null;
  const wishes = page.items.slice(1);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // Respect reduced-motion preferences; users can still explicitly enable scrolling.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAutoScroll(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function refresh() {
      try {
        const response = await fetch("/api/wishes?limit=11", {
          cache: "no-store",
        });
        if (!response.ok) {
          throw new Error(`Unable to refresh wishes (${response.status})`);
        }

        const nextPage: WishPage = await response.json();
        if (cancelled) return;
        setPage(nextPage);
        setError(null);
        scrollContainerRef.current?.scrollTo({
          top: 0,
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
            ? "instant"
            : "smooth",
        });
      } catch (refreshError) {
        if (cancelled) return;
        console.error("refresh wishes failed:", refreshError);
        setError("Không thể cập nhật lời chúc. Vui lòng tải lại trang.");
      }
    }

    window.addEventListener("wishes:changed", refresh);
    return () => {
      cancelled = true;
      window.removeEventListener("wishes:changed", refresh);
    };
  }, []);

  const loadMore = useCallback(async () => {
    if (!page.nextCursor || isLoadingRef.current) return;

    isLoadingRef.current = true;
    setPending(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        limit: "10",
        cursor: page.nextCursor,
      });
      const response = await fetch(`/api/wishes?${params}`, {
        cache: "no-store",
      });
      if (!response.ok) {
        throw new Error(`Unable to load wishes (${response.status})`);
      }

      const nextPage: WishPage = await response.json();
      setPage((current) => ({
        items: [...current.items, ...nextPage.items],
        nextCursor: nextPage.nextCursor,
      }));
    } catch (loadError) {
      console.error("load more wishes failed:", loadError);
      setError("Không thể tải thêm lời chúc. Vui lòng thử lại.");
    } finally {
      isLoadingRef.current = false;
      setPending(false);
    }
  }, [page.nextCursor]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    const sentinel = loadMoreRef.current;
    if (!container || !sentinel || !page.nextCursor || error) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) void loadMore();
      },
      {
        root: container,
        rootMargin: "0px 0px 160px 0px",
      },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [error, loadMore, page.nextCursor]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!autoScroll || !container) return;

    let animationFrame = 0;
    let previousTime = 0;
    let position = container.scrollTop;
    const pixelsPerSecond = 30;

    const scroll = (time: number) => {
      if (!previousTime) previousTime = time;
      const elapsed = Math.min(time - previousTime, 50);
      previousTime = time;

      const maxScroll = container.scrollHeight - container.clientHeight;
      if (Math.abs(container.scrollTop - position) > 1) {
        position = container.scrollTop;
      }

      if (maxScroll > 0) {
        if (position >= maxScroll - 1) {
          position = 0;
        } else {
          position = Math.min(
            position + (pixelsPerSecond * elapsed) / 1000,
            maxScroll,
          );
        }
        container.scrollTo({ top: position, behavior: "instant" });
      }

      animationFrame = window.requestAnimationFrame(scroll);
    };

    animationFrame = window.requestAnimationFrame(scroll);
    return () => window.cancelAnimationFrame(animationFrame);
  }, [autoScroll]);

  if (!latest) {
    return (
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
        <div className="border-gold-light/50 rounded-2xl border border-dashed bg-white/60 px-6 py-10 text-center">
          <Heart
            aria-hidden="true"
            className="text-gold mx-auto mb-3 size-7"
          />
          <p className="text-ink font-medium">Chưa có lời chúc nào</p>
          <p className="text-ink/65 mt-1 text-sm">
            Hãy gửi lời chúc đầu tiên đến cô dâu và chú rể nhé.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      <div className="shrink-0">
        <div className="mb-3 flex items-center justify-between gap-3">
          <p className="text-ink/60 text-xs font-semibold tracking-[0.2em] uppercase">
            Lời chúc mới nhất
          </p>
          <button
            type="button"
            onClick={() => setAutoScroll((enabled) => !enabled)}
            aria-pressed={autoScroll}
            aria-label={
              autoScroll ? "Tạm dừng tự động cuộn" : "Bật tự động cuộn"
            }
            className="text-ink/70 hover:text-green focus-visible:outline-gold-dark inline-flex shrink-0 items-center gap-1.5 rounded-full px-2 py-1 text-xs font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            {autoScroll ? (
              <Pause aria-hidden="true" className="size-3.5" />
            ) : (
              <Play aria-hidden="true" className="size-3.5" />
            )}
            {autoScroll ? "Tạm dừng" : "Tự cuộn"}
          </button>
        </div>
        <LatestWish initial={latest} />
      </div>

      <div
        ref={scrollContainerRef}
        className="min-h-0 max-h-[60dvh] flex-1 overflow-y-auto overscroll-contain pr-1 [-webkit-overflow-scrolling:touch] md:max-h-none"
        aria-label="Danh sách lời chúc có thể cuộn"
        onWheel={() => setAutoScroll(false)}
        onTouchStart={(event) => {
          touchStartYRef.current =
            event.touches.length === 1 ? event.touches[0].clientY : null;
        }}
        onTouchMove={(event) => {
          const startY = touchStartYRef.current;
          const currentY = event.touches[0]?.clientY;
          if (
            startY !== null &&
            currentY !== undefined &&
            Math.abs(currentY - startY) > 8
          ) {
            touchStartYRef.current = null;
            setAutoScroll(false);
          }
        }}
        onTouchEnd={() => {
          touchStartYRef.current = null;
        }}
        onTouchCancel={() => {
          touchStartYRef.current = null;
        }}
        onKeyDown={() => setAutoScroll(false)}
      >
        {wishes.length > 0 ? (
          <ol className="space-y-3" aria-label="Các lời chúc trước đó">
            {wishes.map((wish) => (
              <li key={wish.id}>
                <WishCard
                  name={wish.name}
                  message={wish.message}
                  createdAt={wish.createdAt}
                  className="rounded-2xl p-4"
                />
              </li>
            ))}
          </ol>
        ) : (
          <p className="text-ink/65 py-4 text-center text-sm">
            Chưa có lời chúc nào khác.
          </p>
        )}

        {error && (
          <div className="space-y-2 py-4 text-center">
            <p role="alert" className="text-sm text-red-600">
              {error}
            </p>
            <button
              type="button"
              onClick={() => {
                setError(null);
                void loadMore();
              }}
              className="text-gold-dark text-sm font-semibold underline underline-offset-2"
            >
              Thử tải lại
            </button>
          </div>
        )}

        {pending && (
          <div className="flex justify-center py-4" aria-label="Đang tải">
            <LoaderCircle
              aria-hidden="true"
              className="text-gold-dark size-5 animate-spin"
            />
          </div>
        )}
        {page.nextCursor && !error && (
          <div ref={loadMoreRef} aria-hidden="true" className="h-1" />
        )}
      </div>
    </div>
  );
}
