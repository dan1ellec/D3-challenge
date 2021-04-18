# D3-challenge - Data Journalism and D3


## Task

To investigate data from the U.S. Census Bureau and the Behavioral Risk Factor Surveillance System to create an interactive visualisation that highlights health risks facing particular demographics.


## Visualisation

A D3 interactive scatter plot that represents each state with circle elements. Each axis includes three demographics or risk factors which can be selected by the user. The transitions for the circles' locations and the range of both axes is animated to change on a click event.

![7-animated-scatter](Images/7-animated-scatter.gif)

The D3 graphic contains tooltips which reveal a specific element's data when the user hovers their cursor over the element. 

![8-tooltip](Images/8-tooltip.gif)


## Viewing

Due to the use of a CSV file, browsers will not run the index.html file unless a server is used.

Please use python -m http.server to run the visualisation. This will host the page at localhost:8000 in your web browser.




