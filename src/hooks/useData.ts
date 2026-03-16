"use client";

import { useState, useEffect } from "react";
import * as d3 from "d3";
import type { County } from "@/types/data";

const NUMERIC_FIELDS: (keyof County)[] = [
  "Years of Potential Life Lost Rate",
  "Average Number of Physically Unhealthy Days",
  "Average Number of Mentally Unhealthy Days",
  "% Fair or Poor Health",
  "Injury Death Rate",
  "Primary Care Physicians Rate",
  "% Uninsured",
  "% Unemployed",
  "Income Ratio",
  "% Children in Poverty",
  "Median Household Income",
  "Life Expectancy",
  "Drug Overdose Mortality Rate",
  "Firearm Fatalities Rate",
  "Homicide Rate",
  "High School Graduation Rate",
  "% Adults with Obesity",
  "% Adults Reporting Currently Smoking",
  "% Rural",
  "Population",
];

function parseRow(raw: d3.DSVRowString): County {
  const row: Partial<County> = {
    State:  raw["State"]  ?? "",
    County: raw["County"] ?? "",
  };

  NUMERIC_FIELDS.forEach((field) => {
    const raw_val = raw[field as string];
    if (raw_val === "" || raw_val == null || raw_val === "nan") {
      (row as Record<string, unknown>)[field] = null;
    } else {
      const n = parseFloat(raw_val);
      (row as Record<string, unknown>)[field] = isNaN(n) ? null : n;
    }
  });

  return row as County;
}

interface UseDataResult {
  data: County[];
  loading: boolean;
  error: string | null;
}

export function useData(): UseDataResult {
  const [data,    setData]    = useState<County[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);

  useEffect(() => {
    d3.csv("/data/merged_full_analysis_dataset.csv")
      .then((raw) => {
        const parsed = raw.map(parseRow);
        setData(parsed);
        setLoading(false);
      })
      .catch((err) => {
        setError(String(err));
        setLoading(false);
      });
  }, []);

  return { data, loading, error };
}
