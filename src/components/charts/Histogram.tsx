"use client";

import { useEffect, useRef } from "react";
import * as d3 from "d3";
import type { County, Orientation } from "@/types/data";
import { MARGIN, VAR_META, NUM_BINS } from "@/lib/constants";
import { computeBins } from "@/lib/binning";

interface Props {
  data: County[];
  varKey: string;
  width: number;
  height: number;
  orientation: Orientation;
  onTooltip: (e: MouseEvent, head: string, rows: { label: string; value: string }[]) => void;
  onHideTooltip: () => void;
}

const COLOR_LIGHT = "#93c5fd";
const COLOR_DARK  = "#1d4ed8";

export default function Histogram({ data, varKey, width, height, orientation, onTooltip, onHideTooltip }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data.length) return;
    const meta = VAR_META[varKey];
    const svg  = d3.select(svgRef.current);
    svg.selectAll("*").remove();
    svg.attr("width", width).attr("height", height);

    const vals = data.map((d) => (d as Record<string,unknown>)[varKey] as number|null).filter((v): v is number => v!=null && !isNaN(v));
    if (!vals.length) return;

    const bins = computeBins(vals, NUM_BINS);
    const minV = d3.min(vals)!, maxV = d3.max(vals)!, maxCnt = d3.max(bins, b=>b.count)!;
    const colorInterp = d3.interpolate(COLOR_LIGHT, COLOR_DARK);
    const tickFmt = (v: d3.NumberValue) => { const n=Number(v); if(Math.abs(maxV)>=10000) return d3.format("~s")(n); if(Math.abs(maxV)>=100) return d3.format(".0f")(n); return d3.format(".2f")(n); };

    const cw = width-MARGIN.left-MARGIN.right, ch = height-MARGIN.top-MARGIN.bottom;
    const g  = svg.append("g").attr("transform",`translate(${MARGIN.left},${MARGIN.top})`);

    if (orientation === "upright") {
      const x = d3.scaleLinear().domain([minV,maxV]).range([0,cw]);
      const y = d3.scaleLinear().domain([0,maxCnt*1.15]).range([ch,0]);
      const bw = cw/NUM_BINS;

      g.append("g").attr("class","grid").call(d3.axisLeft(y).ticks(6).tickSize(-cw).tickFormat(()=>""));

      g.selectAll("rect").data(bins).join("rect")
        .attr("x",d=>d.index*bw+1).attr("y",d=>y(d.count))
        .attr("width",bw-2).attr("height",d=>ch-y(d.count))
        .attr("fill",d=>colorInterp(d.index/(NUM_BINS-1))).attr("rx",4)
        .style("cursor","pointer")
        .on("mousemove",function(event,d){ onTooltip(event,`${meta.fmt(d.lo)} — ${meta.fmt(d.hi)}`,[{label:"Count",value:String(d.count)}]); })
        .on("mouseleave",onHideTooltip);

      g.append("g").attr("transform",`translate(0,${ch})`).call(d3.axisBottom(x).ticks(NUM_BINS).tickFormat(tickFmt).tickSize(4)).selectAll("text").attr("transform","rotate(-25)").style("text-anchor","end");
      g.append("g").call(d3.axisLeft(y).ticks(6));
      g.append("text").attr("class","axis-lbl").attr("x",cw/2).attr("y",ch+60).attr("text-anchor","middle").text(`${varKey}${maxV>=1000?" ($)":""}`);
      g.append("text").attr("class","axis-lbl").attr("transform","rotate(-90)").attr("x",-ch/2).attr("y",-58).attr("text-anchor","middle").text("Number of Counties");
    } else {
      const y = d3.scaleLinear().domain([minV,maxV]).range([ch,0]);
      const x = d3.scaleLinear().domain([0,maxCnt*1.15]).range([0,cw]);
      const bh = ch/NUM_BINS;

      g.append("g").attr("class","grid").call(d3.axisBottom(x).ticks(5).tickSize(-ch).tickFormat(()=>""));
      g.selectAll("rect").data(bins).join("rect")
        .attr("y",d=>ch-(d.index+1)*bh+1).attr("x",0)
        .attr("height",bh-2).attr("width",d=>x(d.count))
        .attr("fill",d=>colorInterp(d.index/(NUM_BINS-1))).attr("rx",4)
        .style("cursor","pointer")
        .on("mousemove",function(event,d){ onTooltip(event,`${meta.fmt(d.lo)} — ${meta.fmt(d.hi)}`,[{label:"Count",value:String(d.count)}]); })
        .on("mouseleave",onHideTooltip);
      g.append("g").call(d3.axisLeft(y).ticks(NUM_BINS).tickFormat(tickFmt));
      g.append("g").attr("transform",`translate(0,${ch})`).call(d3.axisBottom(x).ticks(5));
      g.append("text").attr("class","axis-lbl").attr("x",cw/2).attr("y",ch+48).attr("text-anchor","middle").text("Number of Counties");
      g.append("text").attr("class","axis-lbl").attr("transform","rotate(-90)").attr("x",-ch/2).attr("y",-60).attr("text-anchor","middle").text(varKey);
    }

    svg.append("text").attr("x",MARGIN.left).attr("y",26).attr("font-family","Inter,sans-serif").attr("font-size","14px").attr("font-weight","700").attr("fill","#1a1a2e").text(`Distribution of ${varKey}`);
  }, [data,varKey,width,height,orientation,onTooltip,onHideTooltip]);

  return <svg ref={svgRef}/>;
}
