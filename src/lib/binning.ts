import type { BinDatum } from "@/types/data";
import { NUM_BINS } from "./constants";

export function computeBins(values: number[], numBins = NUM_BINS): BinDatum[] {
  const minV = Math.min(...values);
  const maxV = Math.max(...values);
  const binSize = (maxV - minV) / numBins;

  // Initialise counts to 0
  const counts = new Array<number>(numBins).fill(0);

  // bin val array[ floor( (val - min) / binSize ) ]++
  values.forEach((val) => {
    let idx = Math.floor((val - minV) / binSize);
    if (idx >= numBins) idx = numBins - 1; // clamp max value into last bin
    counts[idx]++;
  });

  return counts.map((count, i) => ({
    count,
    index: i,
    lo:  minV + i * binSize,
    hi:  minV + (i + 1) * binSize,
    mid: minV + (i + 0.5) * binSize,
  }));
}
