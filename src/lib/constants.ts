import * as d3 from "d3";
import type { VarMeta } from "@/types/data";

export const NUM_BINS = 12;

export const MARGIN = { top: 40, right: 24, bottom: 72, left: 76 };

export const STATE_COLORS: Record<string, string> = {
  Alabama:     "#c0392b",
  California:  "#2471a3",
  Connecticut: "#17a589",
  Georgia:     "#d68910",
  Louisiana:   "#7d3c98",
  Mississippi: "#e67e22",
  "New Mexico":"#1e8449",
  "New York":  "#2e4057",
};

export const VAR_META: Record<string, VarMeta> = {
  "Median Household Income": {
    type: "numerical", label: "Median Household Income", group: "income",
    fmt: (v) => "$" + d3.format(",.0f")(v),
  },
  "Income Ratio": {
    type: "numerical", label: "Income Ratio (inequality)", group: "income",
    fmt: (v) => d3.format(".2f")(v),
  },
  "% Children in Poverty": {
    type: "numerical", label: "% Children in Poverty", group: "income",
    fmt: (v) => d3.format(".1f")(v) + "%",
  },
  "% Uninsured": {
    type: "numerical", label: "% Uninsured", group: "income",
    fmt: (v) => d3.format(".1f")(v) + "%",
  },
  "% Unemployed": {
    type: "numerical", label: "% Unemployed", group: "income",
    fmt: (v) => d3.format(".1f")(v) + "%",
  },
  "Life Expectancy": {
    type: "numerical", label: "Life Expectancy", group: "health",
    fmt: (v) => d3.format(".1f")(v) + " yrs",
  },
  "% Fair or Poor Health": {
    type: "numerical", label: "% Fair or Poor Health", group: "health",
    fmt: (v) => d3.format(".1f")(v) + "%",
  },
  "Average Number of Physically Unhealthy Days": {
    type: "numerical", label: "Avg Physically Unhealthy Days", group: "health",
    fmt: (v) => d3.format(".1f")(v) + " days",
  },
  "Average Number of Mentally Unhealthy Days": {
    type: "numerical", label: "Avg Mentally Unhealthy Days", group: "health",
    fmt: (v) => d3.format(".1f")(v) + " days",
  },
  "Years of Potential Life Lost Rate": {
    type: "numerical", label: "Years of Life Lost Rate", group: "health",
    fmt: (v) => d3.format(",.0f")(v),
  },
  "% Adults with Obesity": {
    type: "numerical", label: "% Adults with Obesity", group: "behavior",
    fmt: (v) => d3.format(".1f")(v) + "%",
  },
  "% Adults Reporting Currently Smoking": {
    type: "numerical", label: "% Adults Smoking", group: "behavior",
    fmt: (v) => d3.format(".1f")(v) + "%",
  },
  "Drug Overdose Mortality Rate": {
    type: "numerical", label: "Drug Overdose Mortality Rate", group: "behavior",
    fmt: (v) => d3.format(".1f")(v),
  },
  "Primary Care Physicians Rate": {
    type: "numerical", label: "Primary Care Physicians Rate", group: "access",
    fmt: (v) => d3.format(".1f")(v),
  },
  "High School Graduation Rate": {
    type: "numerical", label: "High School Graduation Rate", group: "access",
    fmt: (v) => d3.format(".1f")(v) + "%",
  },
  "% Rural": {
    type: "numerical", label: "% Rural", group: "access",
    fmt: (v) => d3.format(".1f")(v) + "%",
  },
  Population: {
    type: "numerical", label: "Population", group: "access",
    fmt: (v) => d3.format(",.0f")(v),
  },
  State: {
    type: "categorical", label: "State", group: "access",
    fmt: (v) => String(v),
  },
};

export const VAR_GROUPS = {
  income:   "Income / Economic",
  health:   "Health Outcomes",
  behavior: "Health Behaviors",
  access:   "Access & Demographics",
} as const;
