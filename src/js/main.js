// Import our custom CSS
import '../scss/styles.scss'
import * as d3 from "d3";
// Import all of Bootstrap's JS
import * as bootstrap from 'bootstrap'
import * as topjson from 'topojson'
import jsonData from '/static/gz_2010_us_040_00_500k.json';

// const svg_elm = document.creat`eElementNS("http://www.w3.org/2000/svg",'svg');
// svg_elm.setAttribute("xmln", "http://www.w3.org/2000/svg");
// svg_elm.setAttribute("height", "700px");
// svg_elm.setAttribute("width", "100px");

// const g_elm = document.createElement("g");
// g_elm.className = "map";

// svg_elm.appendChild(g_elm);

// const content_elm = document.getElementById("content");
// content_elm.appendChild(svg_elm);`

let projection = d3.geoAlbersUsa().fitSize([1400,500], jsonData);
  // .scale()
  // .translate([-1, 1]);
let geoGenerator = d3.geoPath()
  .projection(projection);

function update(geojson) {
  let u = d3.select('#content g.map')
    .selectAll('path')
    .data(geojson.features);

  u.enter()
    .append('path')
    .attr('state', function(d) {
      return d.properties.NAME.toLowerCase()
    })
    .attr('d', geoGenerator);
}

update(jsonData);

const t = d3.transition().duration(1000).ease(d3.easeLinear);

d3.select("path[state='ohio']").transition(t).style("fill", "red")
d3.select("path[state='utah']").transition(t).style("fill", "red")
console.log(document.querySelector("path[state='ohio']"))
// d3.selectAll('pa')