"use client";

import { useState, useCallback } from "react";
import type { TooltipState } from "@/types/data";

const INITIAL: TooltipState = {
  visible: false,
  x: 0,
  y: 0,
  head: "",
  rows: [],
};

export function useTooltip() {
  const [tooltip, setTooltip] = useState<TooltipState>(INITIAL);

  const showTooltip = useCallback(
    (
      event: MouseEvent,
      head: string,
      rows: { label: string; value: string }[]
    ) => {
      const x = event.clientX + 14;
      const y = event.clientY - 12;
      setTooltip({ visible: true, x, y, head, rows });
    },
    []
  );

  const hideTooltip = useCallback(() => {
    setTooltip((prev) => ({ ...prev, visible: false }));
  }, []);

  const moveTooltip = useCallback((event: MouseEvent) => {
    setTooltip((prev) =>
      prev.visible
        ? { ...prev, x: event.clientX + 14, y: event.clientY - 12 }
        : prev
    );
  }, []);

  return { tooltip, showTooltip, hideTooltip, moveTooltip };
}
