"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { Token } from "@/lib/types";

interface UseTokenBannerRotationProps {
  tokens: Token[];
  autoRotateInterval?: number;
  visibleCount?: number;
}

interface UseTokenBannerRotationReturn {
  currentIndex: number;
  visibleTokens: Token[];
  nextToken: () => void;
  prevToken: () => void;
  goToIndex: (index: number) => void;
  isPaused: boolean;
  pause: () => void;
  resume: () => void;
}

export function useTokenBannerRotation({
  tokens,
  autoRotateInterval = 5000,
  visibleCount = 5,
}: UseTokenBannerRotationProps): UseTokenBannerRotationReturn {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const totalTokens = tokens.length;

  const nextToken = useCallback(() => {
    if (totalTokens === 0) return;
    setCurrentIndex((prev) => (prev + 1) % totalTokens);
  }, [totalTokens]);

  const prevToken = useCallback(() => {
    if (totalTokens === 0) return;
    setCurrentIndex((prev) => (prev - 1 + totalTokens) % totalTokens);
  }, [totalTokens]);

  const goToIndex = useCallback(
    (index: number) => {
      if (index >= 0 && index < totalTokens) {
        setCurrentIndex(index);
      }
    },
    [totalTokens]
  );

  const pause = useCallback(() => setIsPaused(true), []);
  const resume = useCallback(() => setIsPaused(false), []);

  // Auto-rotate
  useEffect(() => {
    if (isPaused || totalTokens <= visibleCount) return;

    intervalRef.current = setInterval(nextToken, autoRotateInterval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPaused, nextToken, autoRotateInterval, totalTokens, visibleCount]);

  // Get visible tokens (wrap around)
  const visibleTokens: Token[] = [];
  if (totalTokens > 0) {
    for (let i = 0; i < Math.min(visibleCount, totalTokens); i++) {
      const idx = (currentIndex + i) % totalTokens;
      visibleTokens.push(tokens[idx]);
    }
  }

  return {
    currentIndex,
    visibleTokens,
    nextToken,
    prevToken,
    goToIndex,
    isPaused,
    pause,
    resume,
  };
}
