export interface County {
  State: string;
  County: string;
  "Years of Potential Life Lost Rate": number | null;
  "Average Number of Physically Unhealthy Days": number | null;
  "Average Number of Mentally Unhealthy Days": number | null;
  "% Fair or Poor Health": number | null;
  "Injury Death Rate": number | null;
  "Primary Care Physicians Rate": number | null;
  "% Uninsured": number | null;
  "% Unemployed": number | null;
  "Income Ratio": number | null;
  "% Children in Poverty": number | null;
  "Median Household Income": number | null;
  "Life Expectancy": number | null;
  "Drug Overdose Mortality Rate": number | null;
  "Firearm Fatalities Rate": number | null;
  "Homicide Rate": number | null;
  "High School Graduation Rate": number | null;
  "% Adults with Obesity": number | null;
  "% Adults Reporting Currently Smoking": number | null;
  "% Rural": number | null;
  Population: number | null;
}

export type VarType = "numerical" | "categorical";

export interface VarMeta {
  type: VarType;
  label: string;
  fmt: (v: number) => string;
  group: "income" | "health" | "behavior" | "access";
}

export type VarKey = keyof County;

export type Orientation = "upright" | "sideways";
export type AxisAssign = "x" | "y";
export type ActiveTab = "dist" | "scatter";

export interface BinDatum {
  count: number;
  index: number;
  lo: number;
  hi: number;
  mid: number;
}

export interface ChartDims {
  width: number;
  height: number;
}

export interface TooltipState {
  visible: boolean;
  x: number;
  y: number;
  head: string;
  rows: { label: string; value: string }[];
}
