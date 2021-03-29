
console.log("updated");

// Defining SVG area dimensions
var svgWidth = 960;
var svgHeight = 500;

// Defining the graphs margins as an object
// will reference these later
var margin = {
    top: 60,
    right: 60,
    bottom: 90,
    left: 100
  };

// Defining the dimensions of the chart area
var chartWidth = svgWidth - margin.left - margin.right;
var chartHeight = svgHeight - margin.top - margin.bottom;

// Selecting the "scatter" id, appending SVG area to it, and setting its dimensions
var svg = d3.select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight)
    .classed("chart", true);

// Appending a SVG group area, then setting its margins
var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// X axis will include: poverty, age, household income
// Y axis will include: healthcare, smokes, obesity

// UPDATING X VALUES AND AXIS
// ==============================

// Setting an initial parameter for the x axis choice
var chosenXAxis = "poverty";

// Function which updates the x-scale variable when a x axis label is chosen
// x-scale is linear because the variables will be numbers
function xScale(journalismData, chosenXAxis) {
    //setting scales
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(journalismData, data => data[chosenXAxis]) * 0.8,
            d3.max(journalismData, data => data[chosenXAxis]) * 1.2]) // obtaining min and max for chosen x column. multiplying to make min x value used just less than data point, and max axis point just higher than max data point
        .range([0, chartWidth]); // scaling the domain so that it fits within the width of the chart

    return xLinearScale;
}

// Function which updates the xAxis variable when an x axis label is chosen
function renderXAxis(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);

    // transition to the new axis
    xAxis.transition()
        .duration(1000)
        .call(bottomAxis);

    return xAxis;
}

// UPDATING Y VALUES AND AXIS
// ==============================

// Setting an initial parameter for the y axis choice
var chosenYAxis = "healthcare";

// Function which updates the y-scale variable when a y axis label is chosen
// y-scale is linear because the variables will be numbers
function yScale(journalismData, chosenYAxis) {
    //setting scales
    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(journalismData, data => data[chosenYAxis]) * 0.8, d3.max(journalismData, data => data[chosenYAxis]) * 1.2]) 
        .range([chartHeight, 0]); // scaling the domain so that it fits within the width of the chart

    return yLinearScale;
}

// Function which updates the yAxis variable when a y axis label is chosen
function renderYAxis(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);

    // transition to the new axis
    yAxis.transition()
        .duration(1000)
        .call(leftAxis);

    return yAxis;
}

// UPDATING CIRCLE DATA AND TOOLTIPS FOR X AND Y
// ==============================

// Function which updates circles group when new axes labels are chosen
function renderCircles(circlesGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {

    // transition to the new circles
    circlesGroup.transition()
        .duration(1000)
        .attr("cx", data => newXScale(data[chosenXAxis]))
        .attr("cy", data => newYScale(data[chosenYAxis]));

    return circlesGroup;
} 

// Function which updates text in circles when new axes labels are chosen
function renderText(textGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {

    //transition to new text
    textGroup.transition()
        .duration(1000)
        .attr("dx", data => newXScale(data[chosenXAxis]))
        .attr("dy", data => newYScale(data[chosenYAxis]));

    return textGroup; 
}

// Function which updates circles group with a new tool tip when new x Axis label is chosen
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {

    // setting variables to be used
    var xlabel;
    var ylabel;
    var xsign;
    var ysign;
    var dollarsign;

    // if statement determiing variable values based on chosenXAxis
    if (chosenXAxis === "poverty") {
        xlabel = "Poverty:";
        xsign = "%";
        dollarsign = "";
    }
    else if (chosenXAxis === "age") {
        xlabel = "Age:";
        xsign = " (median)";
        dollarsign = "";
    }
    else if (chosenXAxis === "income") {
        xlabel = "Income:";
        var dollarsign = "US$";
        xsign = "US$ (median)";
    };

    // if statement determiing variable values based on chosenYAxis
    if (chosenYAxis === "healthcare") {
        ylabel = "Healthcare:";
        ysign = "%";
        dollarsign = "";
    }
    else if (chosenYAxis === "smokes") {
        ylabel = "Smokes:";
        ysign = "%";
        dollarsign = "";
    }
    else if (chosenYAxis === "obesity") {
        ylabel = "Obesity:";
        ysign = "%";
        dollarsign = "";
    }

    // Setting the tooltip features
    var toolTip = d3.tip()
        .attr("class", "d3-tip")
        .offset([80, -60])
        .html(function(data) {
            return (`${data.state}<br>${xlabel} ${dollarsign}${data[chosenXAxis]}${xsign}<br>${ylabel} ${data[chosenYAxis]}${ysign}`);}); // specifying html we want displayed in that tooltip


    circlesGroup.call(toolTip);

    circlesGroup.on("mouseover", function(data) {
        toolTip.show(data, this);
      })
        .on("mouseout", function(data, index) {
          toolTip.hide(data);
        }); // hiding tooltip on mouse out

    return circlesGroup;
}

// IMPORTING DATA
// ============================== 
// Importing data by creating a path from index.html and creating a function for this data
// Will use the functions created above in this function
d3.csv("assets/data/data.csv").then(function(journalismData, err){

    // accounting for error
    if (err) throw err;

    //testing
    //console.log(journalismData);

    // STEP 1: parsing data and setting as number
    // ==============================
    journalismData.forEach(function(data){
        data.poverty = +data.poverty;
        data.age = +data.age;
        data.income = +data.income;
        data.healthcare = +data.healthcare;
        data.obesity = +data.obesity;
        data.smokes = +data.smokes;
    })

    // STEP 2
    // ==============================
    // Creating scales for x and y axis by using the functions created above with the imported data
    var xLinearScale = xScale(journalismData, chosenXAxis);    
    var yLinearScale = yScale(journalismData, chosenYAxis);
   

    // STEP 3: creating the axes functions with d3
    // ==============================
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // STEP 4: Appending the Axes to the chart
    // ==============================
    var xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${chartHeight})`) //moving down x axis in relation to parent. so translation
        .call(bottomAxis);

    var yAxis = chartGroup.append("g")
        .classed("y-axis", true)
        .call(leftAxis);


    // STEP 5: Creating circles for the data points
    // ==============================
    var circlesGroup = chartGroup.selectAll(".stateCircle") // also works with just "circle"
        .data(journalismData) // setting the data to be used
        .enter() //preparing the add
        .append("circle") // calling it stateCircle b/c this is defined in d3Style.css
        .attr("class", "stateCircle") // still not linking to .css even when I do this
        .attr("cx", data => xLinearScale(data[chosenXAxis])) // defining centre x of the circles by passing poverty data through xLinearScale function
        .attr("cy", data => yLinearScale(data[chosenYAxis])) // defining centre y values
        .attr("r", "13") // setting the radius of the circles
        .attr("fill", "blue")
        .attr("opacity", ".7");

    // STEP 6: Creating labels for the data points
    // ==============================
    var textGroup = chartGroup.selectAll(".stateText")  
        .data(journalismData) // setting the data to be used
        .enter() //preparing the add
        .append("text")
        .text(data => data.abbr)
        .attr("dx", data => xLinearScale(data[chosenXAxis])) // defining x position by passing poverty data through xLinearScale function
        .attr("dy", data => yLinearScale(data[chosenYAxis])) // defining y position
        .attr("class", "stateText")
        .attr('font-size', 10)


    // STEP 7: CREATING AXES LABELS
    // ==============================
    
    // X AXIS

    // creating a group for the three x axis options
    var xLabelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + 20})`) // had + 30 after margin.top but couldnt see 

    // x axis option 1
    var povertyLabel = xLabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "poverty") // value which will be used for event listener\
        .attr("class", "aText")
        .classed("active", true)
        .text("In Poverty(%)");        

    // x axis option 2
    var ageLabel = xLabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 40)
        .attr("value", "age") // value which will be used for event listener\
        .attr("class", "aText")
        .classed("inactive", true)
        .text("Age (Median)");

    // x axis option 3
    var incomeLabel = xLabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 60)
        .attr("value", "income") // value which will be used for event listener\
        .attr("class", "aText")
        .classed("inactive", true)
        .text("Household Income (Median)");


    // Y AXIS

    // creating a group for the x axis options
    var yLabelsGroup = chartGroup.append("g")
        .attr('transform', `translate(${0 - margin.left/4}, ${chartHeight/2})`);

    // y axis option 1
    var healthcareLabel = yLabelsGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - 20)
        .attr("x", 0)
        .attr("class", "aText") // giving class: set as atext b/c this is in dsStyle.css
        .attr("value", "healthcare")
        .classed("active", true)
        .attr("dy", "1em")
        .text("Lacks Healthcare (%)");

    // y axis option 2
    var smokesLabel = yLabelsGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - 40)
        .attr("x", 0)
        .attr("class", "aText") // giving class: set as atext b/c this is in dsStyle.css
        .attr("value", "smokes")
        .classed("inactive", true)
        .attr("dy", "1em")
        .text("Smokes (%)");

    // y axis option 3
    var obesityLabel = yLabelsGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - 60)
        .attr("x", 0)
        .attr("class", "aText") // giving class: set as atext b/c this is in dsStyle.css
        .attr("value", "obesity")
        .classed("inactive", true)
        .attr("dy", "1em")
        .text("Obese (%)");


    // TOOLTIP
    // updating tooltip function defined above, now with imported data
    var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);


    // EVENT LISTENERS

    // X AXIS labels/values event listener
    xLabelsGroup.selectAll("text")
        .on("click", function() {

            //obtaining value of selection
            var value = d3.select(this).attr("value");
            
            // if the current 'value' we are selecting is not the same as what is currently set for the x axis
            if (value !== chosenXAxis) {

                //replace chosenXAxis with new value
                chosenXAxis = value;
                
                // Enacting the functionc created before the csv import

                // updating x scale for new data
                xLinearScale = xScale(journalismData, chosenXAxis);

                // updating x axis with transition
                xAxis = renderXAxis(xLinearScale, xAxis);

                // updating circles with new x values
                circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

                // updating text within circles
                textGroup = renderText(textGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

                // updating tooltips with new information
                circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

                console.log("okay");
                // updating classes depending on what is selected, sets which is bold
                if (chosenXAxis === "poverty") {
                    povertyLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    ageLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    incomeLabel
                        .classed("active", false)
                        .classed("inactive", true);
                } 
                else if (chosenXAxis === "age") {
                    povertyLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    ageLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    incomeLabel
                        .classed("active", false)
                        .classed("inactive", true);
                }
                else if (chosenXAxis === "income") {
                    povertyLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    ageLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    incomeLabel
                        .classed("active", true)
                        .classed("inactive", false);
                }
        
            }
        });

    // Y AXIS labels/values event listener
    yLabelsGroup.selectAll("text")
        .on("click", function(){

            //obtaining value of sleection
            var value = d3.select(this).attr("value");
            console.log("yokay")
            // if the current 'value' we are selecting is not the same as what is currently set for the x axis
            if (value !==chosenYAxis) {

                //replace chosenXAxis with new value
                chosenYAxis = value;

                // Enacting the functionc created before the csv import

                // updating y scale for new data
                yLinearScale = yScale(journalismData, chosenYAxis);

                // updating y axis with transition
                yAxis = renderYAxis(yLinearScale, yAxis);

                // updating circles with new y values
                circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

                // updating text within circles
                textGroup = renderText(textGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

                // updating tooltips with new information
                circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

                // updating classes depending on what is selected, sets which is bold
                if (chosenYAxis === "healthcare") {
                    healthcareLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    smokesLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    obesityLabel
                        .classed("active", false)
                        .classed("inactive", true);
                }
                else if (chosenYAxis === "smokes") {
                    healthcareLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    smokesLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    obesityLabel
                        .classed("active", false)
                        .classed("inactive", true);
                }
                else if (chosenYAxis === "obesity") {
                    healthcareLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    smokesLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    obesityLabel
                        .classed("active", true)
                        .classed("inactive", false);
                };
               
        
            }
        });
    }).catch(function(error) {
        console.log(error);
    });
    
//         // X axis will include: POverty, Age, household income
// // Y axis will include: healthcare, smokes. obesity

//     // STEP 6: Initialising tool tip
//     // ==============================
//     var toolTip = d3.tip().attr("class", "d3-tip").offset([80, -60]).html(function(data) {return (`${data.state}<br>Poverty: ${data.poverty}(%)<br>Healthcare: ${data.healthcare}(%)`);}); // specifying html we want displayed in that tooltip

//     // still don't know what offset does

//     // STEP 6: Initialising tool tip
//     // ==============================
//     // var toolTip = d3.tip()
//     //     .attr("class", "tooltip") //maybe this sould be d3-tip b/c that is in css
//     //     .offset([80, -60]) // not exaclty sure what this sets
//     //     .html(function(data) {
//     //         return (`${data.state}<br>Poverty: ${data.poverty}(%)<br>Healthcare: ${data.healthcare}(%)`);
//     //     }); // specifying html we want displayed in that tooltip

//     // Step 7: Create tooltip in the chart
//     // ==============================
//     chartGroup.call(toolTip);
//     // tooltip is variable but also function
//     // so doing .call(tooTip) will invoke the function

//     // Step 8: Create event listeners to display and hide the tooltip
//     // ==============================
//     circlesGroup.on("mouseover", function(data) {
//       toolTip.show(data, this);
//     })
//       // onmouseout event
//       .on("mouseout", function(data, index) {
//         toolTip.hide(data);
//       }); // hiding tooltip on mouse out
// // note if change "mouseover" to click then it will only appear when clicking

//     // Create axes labels
//     // adding text element to svg
//     // y axis??
//     chartGroup.append("text")
//       .attr("transform", "rotate(-90)")
//       .attr("y", 0 - margin.left + 40)
//       .attr("x", 0 - (chartHeight / 2))
//       .attr("class", "aText") // giving class: set as atext b/c this is in dsStyle.css
//       .text("Lacks Healthcare (%)");
//       //.attr("dy", "1em") // settingsize of text (don't think I need this because in d3style.css);


//       chartGroup.append("text")
//       .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + margin.top })`) // had + 30 after margin.top but couldnt see 
//       .attr("class", "aText")
//       .text("In Poverty(%)");
  
//     }).catch(function(error) {
//     console.log(error);
//   });


// // again, this won't tlink to my html and no changes that I make appear in the console
// // it's like it has been stuck on what it previously was

