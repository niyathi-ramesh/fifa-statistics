var allWorldCupData;

d3.csv("data/fifa-world-cup.csv", (data) => {
  allWorldCupData = data;
  allWorldCupData.forEach((d) => {
    d.year = +d.YEAR;
    d.teams = +d.TEAMS;
    d.matches = +d.MATCHES;
    d.goals = +d.GOALS;
    d.attendance = +d.AVERAGE_ATTENDANCE;
  });

  updateBarChart("attendance");
});

function chooseData() {
  let dataset = document.getElementById("dataset");
  let selection = dataset.options[dataset.selectedIndex].text;
  updateBarChart(selection.toLowerCase());
}

function updateBarChart(selectedDimension) {
  const svg = d3.select("#barChart");

  const width = svg.attr("width");
  const height = svg.attr("height");

  const margin = {
    top: 10,
    right: 10,
    bottom: 70,
    left: 60,
  };

  const yMin = 0;
  const yMax = d3.max(allWorldCupData, (d) => d[selectedDimension]);

  const xRange1 = margin.left;
  const xRange2 = width - margin.right;
  const yRange1 = margin.top;
  const yRange2 = height - margin.bottom;

  const xScale = d3
    .scaleBand()
    .domain(allWorldCupData.map((d) => d.year))
    .range([xRange2, xRange1]);
  const yScaleReversed = d3
    .scaleLinear()
    .domain([yMin, yMax])
    .range([yRange2, yRange1])
    .nice();

  const yScale = d3
    .scaleLinear()
    .domain([yMin, yMax])
    .range([yRange1, yRange2])
    .nice();

  const colorScale = d3
    .scaleLinear()
    .domain([yMin, yMax])
    .range(["lightgray", "steelblue"]);

  const xAxis = d3.axisBottom().scale(xScale);
  const yAxis = d3.axisLeft().scale(yScaleReversed);

  d3.select("#xAxis")
    .attr("transform", "translate(0," + yRange2 + ")")
    .transition()
    .duration(2000)
    .call(xAxis)
    .selectAll("text")
    .attr("y", 0)
    .attr("x", -45)
    .attr("dy", ".35em")
    .attr("transform", "rotate(270)")
    .style("text-anchor", "start");

  d3.select("#yAxis")
    .attr("transform", "translate(" + (xRange1 - 1) + ", 0)")
    .transition()
    .duration(2000)
    .call(yAxis);

  const barGroup = d3.select("#bars").selectAll("rect");
  d3.select("#bars").attr("transform", "scale(1, -1) translate(0, -330)");
  let bars = barGroup.data(allWorldCupData);
  bars = bars.enter().append("rect").merge(bars);

  bars
    .attr("width", xScale.step())
    .attr("x", (d, i) => {
      return xScale(d.year);
    })
    .merge(bars);

  bars
    .transition()
    .duration(2000)
    .attr("height", (d) => yScale(d[selectedDimension]))
    .style("fill", (d) => colorScale(d[selectedDimension]));

  bars
    .on("mouseover", function (d) {
      d3.select(this).style("fill", "red").style("cursor", "pointer");
    })
    .on("mouseout", function (d) {
      d3.select(this)
        .style("fill", colorScale(d[selectedDimension]))
        .style("cursor", "default");
    })
    .on("click", function (d) {
      console.log("Selected Bar: \n", d);
    })
    .on("touch", function (d) {
      console.log("Selected Bar: \n", d);
    });
}
