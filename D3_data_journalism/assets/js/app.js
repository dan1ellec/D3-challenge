
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

console.log("working......");


// super weird but this wouldn't work wednesday night.  
// it was like this wasn't even connected to the html file
// but now it is working sooooo?


// ACTIVITIES TO CONSIDER

// Lesson 3 activity 9
// Lesson 3 activity 12 for bonus - rewatch this 


// Importing data and creating a function for this data
// note: this is the path from the csv file!!!!!!!
d3.csv("assets/data/data.csv").then(function(journalismData){

    //testing
    console.log(journalismData);

    // STEP 1: parsing data and setting as number
    journalismData.forEach(function(data){
        data.poverty = +data.poverty;
        data.povertyMoe = +data.povertyMoe;
        data.age = +data.age
        data.ageMoe = +data.ageMoe;
        data.income = +data.income;
        data.incomeMoe = +data.incomeMoe;
        data.healthcare = +data.healthcare;
        data.healthcareLow = +data.healthcareLow;
        data.healthcareHigh = +data.healthcareHigh;
        data.obesity = +data.obesity;
        data.obesityLow = +data.obesityLow;
        data.obesityHigh = +data.obesityHigh;
        data.smokes = +data.smokes;
        data.smokesLow = +data.smokesLow;
        data.smokesHigh = +data.smokesHigh;
        // do I need to set id as a number??? or is it okay as a string??
    })

    // STEP 2

    // going to start with Healthcare vs. Poverty
    // Healthcare as y and Poverty as x

    // Creating scales for x and y axis
    // These will need to be linear scales b/c numbers

    var xLinearScale = d3.scaleLinear()
        .domain(d3.extent(journalismData, data => data.poverty)) // obtaining min and max for poverty column, could set min and just mind max but not sure 
        .range([0,chartWidth]); // scaling the outlines domain so that it fits within the width of the chart

    var yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(journalismData, data => data.healthcare)]) // setting this to go from zero to the max value in healthcare column. 
        .range([chartHeight, 0]);
    // saying, obtain journalism data. for every 'data' point (data could be anything, x even), obtain the healthcare column values. then find the max of these


    // STEP 3
    // creating the axis function

    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // STEP 4: Append Axes to the chart
    // ==============================
    // appending axis to chart, moving down x axis in relation to parent. so translation
    chartGroup.append("g")
      .attr("transform", `translate(0, ${chartHeight})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);


})

// again, this won't tlink to my html and no changes that I make appear in the console
// it's like it has been stuck on what it previously was

