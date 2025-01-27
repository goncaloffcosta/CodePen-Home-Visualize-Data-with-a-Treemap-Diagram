const datasetURL = "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json";

const width = 1000;
const height = 600;

const svg = d3.select("#treemap")
  .attr("width", width)
  .attr("height", height);

const tooltip = d3.select("#tooltip");

fetch(datasetURL)
  .then(response => response.json())
  .then(data => {
    const root = d3.hierarchy(data)
      .sum(d => d.value)
      .sort((a, b) => b.value - a.value);

    d3.treemap()
      .size([width, height])
      .paddingInner(1)(root);

    const colorScale = d3.scaleOrdinal()
      .domain(data.children.map(d => d.name))
      .range(d3.schemeCategory10);

    const tiles = svg.selectAll("g")
      .data(root.leaves())
      .enter()
      .append("g")
      .attr("transform", d => `translate(${d.x0}, ${d.y0})`);

    tiles.append("rect")
      .attr("class", "tile")
      .attr("width", d => d.x1 - d.x0)
      .attr("height", d => d.y1 - d.y0)
      .attr("fill", d => colorScale(d.data.category))
      .attr("data-name", d => d.data.name)
      .attr("data-category", d => d.data.category)
      .attr("data-value", d => d.data.value)
      .on("mouseover", (event, d) => {
        tooltip.style("opacity", 1)
          .style("left", `${event.pageX + 10}px`)
          .style("top", `${event.pageY - 20}px`)
          .attr("data-value", d.data.value)
          .html(`
            Name: ${d.data.name}<br>
            Category: ${d.data.category}<br>
            Value: $${d.data.value.toLocaleString()}
          `);
      })
      .on("mouseout", () => tooltip.style("opacity", 0));

    tiles.append("text")
      .attr("class", "tile-text")
      .selectAll("tspan")
      .data(d => d.data.name.split(" "))
      .enter()
      .append("tspan")
      .attr("x", 4)
      .attr("y", (d, i) => 15 + i * 12)
      .text(d => d);

    const legend = d3.select("#legend");

    const legendItems = legend.selectAll(".legend-item")
      .data(data.children.map(d => d.name))
      .enter()
      .append("div")
      .attr("class", "legend-item")
      .style("background-color", d => colorScale(d))
      .text(d => d);
  })
  .catch(error => console.error("Error loading data:", error));
