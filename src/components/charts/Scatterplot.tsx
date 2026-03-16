"use client";

import { useEffect, useRef } from "react";
import * as d3 from "d3";
import type { County } from "@/types/data";
import { MARGIN, VAR_META } from "@/lib/constants";
import { linearRegression } from "@/lib/regression";

interface Props {
  data: County[];
  xKey: string;
  yKey: string;
  width: number;
  height: number;
  onTooltip: (e: MouseEvent, head: string, rows: { label: string; value: string }[]) => void;
  onHideTooltip: () => void;
}

export default function Scatterplot({ data, xKey, yKey, width, height, onTooltip, onHideTooltip }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data.length) return;
    const mx = VAR_META[xKey], my = VAR_META[yKey];
    if (!mx || !my) return;

    const xLabel = mx.label;
    const yLabel = my.label;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();
    svg.attr("width", width).attr("height", height);

    const cw = width - MARGIN.left - MARGIN.right;
    const ch = height - MARGIN.top - MARGIN.bottom;
    const g  = svg.append("g").attr("transform", `translate(${MARGIN.left},${MARGIN.top})`);

    const valid = data.filter(d => {
      const x = (d as Record<string, unknown>)[xKey], y = (d as Record<string, unknown>)[yKey];
      return x != null && y != null && !isNaN(Number(x)) && !isNaN(Number(y));
    });

    const xs = valid.map(d => Number((d as Record<string, unknown>)[xKey]));
    const ys = valid.map(d => Number((d as Record<string, unknown>)[yKey]));

    const xScale = d3.scaleLinear().domain(d3.extent(xs) as [number, number]).nice().range([0, cw]);
    const yScale = d3.scaleLinear().domain(d3.extent(ys) as [number, number]).nice().range([ch, 0]);

    const xFmt = (v: d3.NumberValue) => Math.abs(d3.max(xs)!) >= 10000 ? d3.format("~s")(v) : d3.format(".1f")(v);
    const yFmt = (v: d3.NumberValue) => Math.abs(d3.max(ys)!) >= 10000 ? d3.format("~s")(v) : d3.format(".1f")(v);

    // Clip path — keeps regression line and dots inside the plot area
    svg.append("defs").append("clipPath")
      .attr("id", "plot-area")
      .append("rect")
      .attr("x", 0).attr("y", 0)
      .attr("width", cw).attr("height", ch);

    // Subtle grid
    g.append("g").attr("class", "grid").call(d3.axisLeft(yScale).ticks(6).tickSize(-cw).tickFormat(() => ""));
    g.append("g").attr("class", "grid").attr("transform", `translate(0,${ch})`).call(d3.axisBottom(xScale).ticks(6).tickSize(-ch).tickFormat(() => ""));

    // Clipped group — regression line + dots are contained within the plot area
    const clipped = g.append("g").attr("clip-path", "url(#plot-area)");

    // Regression line — extend slightly past the data range; clipping handles the rest
    const reg  = linearRegression(xs, ys);
    const xExt = d3.extent(xs) as [number, number];
    const pad  = (xExt[1] - xExt[0]) * 0.1;
    clipped.append("line")
      .attr("x1", xScale(xExt[0] - pad)).attr("y1", yScale(reg.predict(xExt[0] - pad)))
      .attr("x2", xScale(xExt[1] + pad)).attr("y2", yScale(reg.predict(xExt[1] + pad)))
      .attr("stroke", "#1e3a5f").attr("stroke-width", 1.8)
      .attr("stroke-dasharray", "6,5").attr("opacity", 0.6);

    // Dots
    clipped.selectAll("circle").data(valid).join("circle")
      .attr("cx", d => xScale(Number((d as Record<string, unknown>)[xKey])))
      .attr("cy", d => yScale(Number((d as Record<string, unknown>)[yKey])))
      .attr("r", 4)
      .attr("fill", "#7eb8e8")
      .attr("opacity", 0.65)
      .attr("stroke", "#bfdbfe").attr("stroke-width", 0.5)
      .style("cursor", "pointer")
      .on("mousemove", function(event, d) {
        onTooltip(event, `${d.County}`, [
          { label: "State",  value: d.State },
          { label: xLabel,   value: mx.fmt(Number((d as Record<string, unknown>)[xKey])) },
          { label: yLabel,   value: my.fmt(Number((d as Record<string, unknown>)[yKey])) },
        ]);
      })
      .on("mouseleave", onHideTooltip);

    // Axes drawn outside the clipped group so ticks are always visible
    g.append("g").attr("transform", `translate(0,${ch})`).call(d3.axisBottom(xScale).ticks(6).tickFormat(xFmt));
    g.append("g").call(d3.axisLeft(yScale).ticks(6).tickFormat(yFmt));

    // Axis labels
    g.append("text")
      .attr("class", "axis-lbl")
      .attr("x", cw / 2).attr("y", ch + 55)
      .attr("text-anchor", "middle")
      .text(xLabel);

    g.append("text")
      .attr("class", "axis-lbl")
      .attr("transform", "rotate(-90)")
      .attr("x", -ch / 2).attr("y", -58)
      .attr("text-anchor", "middle")
      .text(yLabel);

    // Title
    svg.append("text")
      .attr("x", MARGIN.left).attr("y", 26)
      .attr("font-family", "Inter,sans-serif")
      .attr("font-size", "14px")
      .attr("font-weight", "700")
      .attr("fill", "#1a1a2e")
      .text(`${yLabel} vs ${xLabel}`);

  }, [data, xKey, yKey, width, height, onTooltip, onHideTooltip]);

  return <svg ref={svgRef} />;
}