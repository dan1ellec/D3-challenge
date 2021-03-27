
console.log("working again");

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


    // STEP 3: creating the axes functions with d3
    // ==============================
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // STEP 4: Appending the Axes to the chart
    // ==============================
    chartGroup.append("g")
      .attr("transform", `translate(0, ${chartHeight})`)
      .call(bottomAxis);
    // appending axis to chart, moving down x axis in relation to parent. so translation

    chartGroup.append("g")
      .call(leftAxis);


    // STEP 5: Creating circles for the data points
    // ==============================
    var circlesGroup = chartGroup.selectAll("circle")
        .data(journalismData) // setting the data to be used
        .enter() //preparing the add
        .append("circle") // calling it stateCircle b/c this is defined in d3Style.css
        .attr("cx", data => xLinearScale(data.poverty)) // defining centre x of the circles by passing poverty data through xLinearScale function
        .attr("cy", data => yLinearScale(data.healthcare)) // defining centre y values
        .attr("r", "15") // setting the radius of the circles
        .attr("fill", "blue")
        .attr("opacity", ".5");

    
    

    // STEP 6: Initialising tool tip
    // ==============================
    var toolTip = d3.tip().attr("class", "d3-tip").offset([80, -60]).html(function(data) {return (`${data.state}<br>Poverty: ${data.poverty}(%)<br>Healthcare: ${data.healthcare}(%)`);}); // specifying html we want displayed in that tooltip

    // STEP 6: Initialising tool tip
    // ==============================
    // var toolTip = d3.tip()
    //     .attr("class", "tooltip") //maybe this sould be d3-tip b/c that is in css
    //     .offset([80, -60]) // not exaclty sure what this sets
    //     .html(function(data) {
    //         return (`${data.state}<br>Poverty: ${data.poverty}(%)<br>Healthcare: ${data.healthcare}(%)`);
    //     }); // specifying html we want displayed in that tooltip

    // Step 7: Create tooltip in the chart
    // ==============================
    chartGroup.call(toolTip);
    // tooltip is variable but also function
    // so doing .call(tooTip) will invoke the function

    // Step 8: Create event listeners to display and hide the tooltip
    // ==============================
    circlesGroup.on("click", function(data) {
      toolTip.show(data, this);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      }); // hiding tooltip on mouse out

    // Create axes labels
    // adding text element to svg
    // y axis??
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (chartHeight / 2))
      .attr("class", "aText") // giving class: set as atext b/c this is in dsStyle.css
      .text("Lacks Healthcare (%)");
      //.attr("dy", "1em") // settingsize of text (don't think I need this because in d3style.css);


      chartGroup.append("text")
      .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + margin.top })`) // had + 30 after margin.top but couldnt see 
      .attr("class", "aText")
      .text("In Poverty(%)");
  
    }).catch(function(error) {
    console.log(error);
  });


// again, this won't tlink to my html and no changes that I make appear in the console
// it's like it has been stuck on what it previously was

