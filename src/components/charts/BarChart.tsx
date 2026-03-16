"use client";

import { useEffect, useRef } from "react";
import * as d3 from "d3";
import type { County, Orientation } from "@/types/data";
import { MARGIN, STATE_COLORS } from "@/lib/constants";

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

export default function BarChart({ data, varKey, width, height, orientation, onTooltip, onHideTooltip }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data.length) return;
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();
    svg.attr("width", width).attr("height", height);

    const counts = d3.rollup(data, v=>v.length, d=>String((d as Record<string,unknown>)[varKey]));
    const colorInterp = d3.interpolate(COLOR_LIGHT, COLOR_DARK);
    const barColor = (cat: string, i: number, total: number) =>
      varKey === "State" ? (STATE_COLORS[cat] ?? "#93c5fd") : colorInterp(i / Math.max(total - 1, 1));

    const cw = width-MARGIN.left-MARGIN.right, ch = height-MARGIN.top-MARGIN.bottom;
    const g  = svg.append("g").attr("transform",`translate(${MARGIN.left},${MARGIN.top})`);

    if (orientation === "upright") {
      const cats = [...counts.entries()].sort((a,b)=>b[1]-a[1]);
      const x = d3.scaleBand().domain(cats.map(d=>d[0])).range([0,cw]).padding(0.3);
      const y = d3.scaleLinear().domain([0,d3.max(cats,d=>d[1])!*1.15]).range([ch,0]);

      g.append("g").attr("class","grid").call(d3.axisLeft(y).ticks(5).tickSize(-cw).tickFormat(()=>""));

      g.selectAll("rect").data(cats).join("rect")
        .attr("x",d=>x(d[0])!).attr("y",d=>y(d[1]))
        .attr("width",x.bandwidth()).attr("height",d=>ch-y(d[1]))
        .attr("fill",(_,i)=>barColor(cats[i][0],i,cats.length)).attr("rx",4)
        .style("cursor","pointer")
        .on("mousemove",function(event,d){ onTooltip(event,d[0],[{label:"Counties",value:String(d[1])}]); })
        .on("mouseleave",onHideTooltip);

      g.selectAll(".vlbl").data(cats).join("text")
        .attr("x",d=>x(d[0])!+x.bandwidth()/2).attr("y",d=>y(d[1])-5)
        .attr("text-anchor","middle").attr("fill","#9ca3af").attr("font-size","10px").attr("font-family","Inter,sans-serif")
        .text(d=>d[1]);

      g.append("g").attr("transform",`translate(0,${ch})`).call(d3.axisBottom(x).tickSize(3)).selectAll("text").attr("transform","rotate(-28)").style("text-anchor","end");
      g.append("g").call(d3.axisLeft(y).ticks(5));
      g.append("text").attr("class","axis-lbl").attr("x",cw/2).attr("y",ch+62).attr("text-anchor","middle").text(varKey);
      g.append("text").attr("class","axis-lbl").attr("transform","rotate(-90)").attr("x",-ch/2).attr("y",-58).attr("text-anchor","middle").text("Number of Counties");
    } else {
      const cats = [...counts.entries()].sort((a,b)=>a[1]-b[1]);
      const y = d3.scaleBand().domain(cats.map(d=>d[0])).range([0,ch]).padding(0.3);
      const x = d3.scaleLinear().domain([0,d3.max(cats,d=>d[1])!*1.15]).range([0,cw]);

      g.append("g").attr("class","grid").call(d3.axisBottom(x).ticks(5).tickSize(-ch).tickFormat(()=>""));
      g.selectAll("rect").data(cats).join("rect")
        .attr("y",d=>y(d[0])!).attr("x",0)
        .attr("height",y.bandwidth()).attr("width",d=>x(d[1]))
        .attr("fill",(_,i)=>barColor(cats[i][0],i,cats.length)).attr("rx",4)
        .style("cursor","pointer")
        .on("mousemove",function(event,d){ onTooltip(event,d[0],[{label:"Counties",value:String(d[1])}]); })
        .on("mouseleave",onHideTooltip);

      g.selectAll(".vlbl").data(cats).join("text")
        .attr("y",d=>y(d[0])!+y.bandwidth()/2+4).attr("x",d=>x(d[1])+4)
        .attr("fill","#9ca3af").attr("font-size","10px").attr("font-family","Inter,sans-serif").text(d=>d[1]);

      g.append("g").call(d3.axisLeft(y).tickSize(3));
      g.append("g").attr("transform",`translate(0,${ch})`).call(d3.axisBottom(x).ticks(5));
      g.append("text").attr("class","axis-lbl").attr("x",cw/2).attr("y",ch+48).attr("text-anchor","middle").text("Number of Counties");
      g.append("text").attr("class","axis-lbl").attr("transform","rotate(-90)").attr("x",-ch/2).attr("y",-62).attr("text-anchor","middle").text(varKey);
    }

    svg.append("text").attr("x",MARGIN.left).attr("y",26).attr("font-family","Inter,sans-serif").attr("font-size","14px").attr("font-weight","700").attr("fill","#1a1a2e").text(`${varKey} — Distribution by County`);
  }, [data,varKey,width,height,orientation,onTooltip,onHideTooltip]);

  return <svg ref={svgRef}/>;
}
