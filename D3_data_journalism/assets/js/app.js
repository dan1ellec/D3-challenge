
console.log("working");

// Defining SVG area dimensions
var svgWidth = 960;
var svgHeight = 500;

// Defining the graphs margins as an object
// will reference these later
var margin = {
    top: 60,
    right: 60,
    bottom: 80,
    left: 100
  };
// have made bottom and eft larger to leave room for axes, will check these dimensions

// Defining the dimensions of the chart area
var chartWidth = svgWidth - margin.left - margin.right;
var chartHeight = svgHeight - margin.top - margin.bottom;

// Selecting the "scatter" id, appending SVG area to it, and setting its dimensions
var svg = d3.select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);


// Appending a SVG group area, then setting its margins
var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

console.log("working");