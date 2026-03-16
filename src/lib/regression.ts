export interface RegressionResult {
  slope: number;
  intercept: number;
  predict: (x: number) => number;
}

export function linearRegression(
  xs: number[],
  ys: number[]
): RegressionResult {
  const n = xs.length;
  const sx  = xs.reduce((a, b) => a + b, 0);
  const sy  = ys.reduce((a, b) => a + b, 0);
  const sxy = xs.reduce((a, x, i) => a + x * ys[i], 0);
  const sxx = xs.reduce((a, x) => a + x * x, 0);

  const slope     = (n * sxy - sx * sy) / (n * sxx - sx * sx);
  const intercept = (sy - slope * sx) / n;

  return { slope, intercept, predict: (x) => slope * x + intercept };
}
