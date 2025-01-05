import React from "https://esm.sh/react";
import ReactDOM from "https://esm.sh/react-dom";
import * as d3 from "https://esm.sh/d3";
import { createRoot } from "https://esm.sh/react-dom/client";

class App extends React.Component {
  componentDidMount() {
    this.fetchData();
  }

  fetchData = () => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json", true);
    xhr.send();
    xhr.onload = () => {
      const results = JSON.parse(xhr.responseText);
      const data = results.data;
      const width = 1000;
      const height = 500;
      const margin = { top: 20, right: 20, bottom: 40, left: 40 };

      const xScale = d3.scaleBand()
        .domain(data.map((d) => new Date(d[0]))) 
        .range([margin.left, width - margin.right])
        .padding(0.1);

      const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, (d) => d[1])])
        .nice()
        .range([height - margin.bottom, margin.top]);

      const xAxis = d3.axisBottom(xScale).tickValues(data.filter((d, index) => index % 10 === 0).map(d => new Date(d[0]))).tickFormat(d3.timeFormat("%Y"));
      d3.select("#x-axis")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(xAxis);

      const yAxis = d3.axisLeft(yScale).ticks(10);
      d3.select("#y-axis")
        .attr("transform", `translate(${margin.left}, 0)`)
        .call(yAxis);

      const gElement = d3.select("svg g");
      gElement.selectAll(".bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", (d) => xScale(new Date(d[0])))
        .attr("y", (d) => yScale(d[1]))
        .attr("width", xScale.bandwidth())
        .attr("height", (d) => height - margin.bottom - yScale(d[1]))
        .attr("data-date", (d) => d[0])
        .attr("data-gdp", (d) => d[1])
        .on("mouseover", (event, d) => this.handleMouseOver(event, d[0], d[1]))
        .on("mouseout", this.handleMouseOut);
    }
  }

  handleMouseOver = (event, date, gdp) => {
    const tooltip = document.getElementById("tooltip");
    tooltip.style.visibility = "visible";
    tooltip.innerHTML = `<strong>Date:</strong> ${date}<br/><strong>GDP:</strong> $${gdp.toFixed(1)} Billion`;
    tooltip.setAttribute("data-date", date);
    const tooltipWidth = tooltip.offsetWidth;
    const tooltipHeight = tooltip.offsetHeight;
    const xPos = event.pageX + 10;
    const yPos = event.pageY - tooltipHeight - 10;
    tooltip.style.left = `${xPos}px`;
    tooltip.style.top = `${yPos}px`;
  }

  handleMouseOut = () => {
    const tooltip = document.getElementById("tooltip");
    tooltip.style.visibility = "hidden";
  }

  render() {
    return (
      <div>
        <h1 id="title">United States GDP</h1>
        <div className="barchart">
          <svg width="1000" height="500">
            <g id="bars"></g>
            <g id="x-axis"></g>
            <g id="y-axis"></g>
          </svg>
        </div>

        <div id="tooltip" style={{
          position: 'absolute',
 visibility: 'hidden',
          backgroundColor: 'rgba(0,0,0,0.8)',
          color: '#fff',
          borderRadius: '5px',
          padding: '5px',
          fontSize: '14px',
          pointerEvents: 'none'
        }}></div>
      </div>
    );
  }
}

const root = createRoot(document.getElementById('root'));
root.render(<App />);
