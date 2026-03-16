"use client";

import { useState, useEffect, useRef, RefObject } from "react";
import type { ChartDims } from "@/types/data";

export function useChartDims(
  ref: RefObject<HTMLDivElement>,
  defaultH = 420
): ChartDims {
  const [dims, setDims] = useState<ChartDims>({ width: 700, height: defaultH });

  useEffect(() => {
    if (!ref.current) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width } = entry.contentRect;
        setDims({ width, height: defaultH });
      }
    });

    observer.observe(ref.current);

    // Set initial size
    setDims({
      width:  ref.current.clientWidth || 700,
      height: defaultH,
    });

    return () => observer.disconnect();
  }, [ref, defaultH]);

  return dims;
}
