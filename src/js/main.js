// Import our custom CSS
import '../scss/styles.scss'
import * as d3 from "d3"; // Importing everything is dumb fix later
// Import all of Bootstrap's JS
// import * as bootstrap from 'bootstrap'
// import * as topjson from 'topojson'
import mapData from '/gz_2010_us_050_00_20m.json'
import jsonData from '/covid_cases_by_week.json'

// Functions for gui
function weeks_forward() {
  if (weeks_index < weeks_max) { weeks_index++ }
  setWeekUI(weeks_list[weeks_index])
  reDrawWeek(weeks_list[weeks_index])
}

function weeks_back() {
  if (weeks_index > weeks_min) { weeks_index-- }
  setWeekUI(weeks_list[weeks_index])
  reDrawWeek(weeks_list[weeks_index])
}

// Load GeoJSON and map to projection + add sates to map
let projection = d3.geoAlbersUsa().fitSize([1000, 600], mapData);
let geoGenerator = d3.geoPath().projection(projection);

function update(geojson) {
  let u = d3.select('#content g.map')
    .selectAll('path')
    .data(geojson.features);

  // Behavoir on entrance
  u.enter()
    .append('path')
    .attr('fips', function (d) {
      return d.properties.STATE + d.properties.COUNTY
    })
    .attr('d', geoGenerator)
    // Highlight on mouseover
    .on('mouseover', (d, i) => {
      let select_str = "path[state=\"" + i.properties.NAME.toLowerCase() + "\"]"
      let t = d3.transition().duration(100).ease(d3.easeLinear)
      d3.select(select_str).transition(t).style("stroke-width", "3px")
    })
    // Unlighlet on mouseout
    .on('mouseout', (d, i) => {
      let select_str = "path[state=\"" + i.properties.NAME.toLowerCase() + "\"]"
      let t = d3.transition().duration(750).ease(d3.easeLinear)
      d3.select(select_str).transition(t).style("stroke-width", "1px")
    })
}

let weeks_list = jsonData['weeks']
const weeks_min = 0
const weeks_max = weeks_list.length - 1
let weeks_index = 0

function reDrawWeek(week) {
  // Will get new data from the dataset by week and draw it
  const t = d3.transition().duration(800).ease(d3.easeLinear);
  console.log(week)
  console.log(jsonData[week])
  const min = jsonData[week]['cumulative_deaths']['min']
  const max = jsonData[week]['cumulative_deaths']['max']

  min_elm.textContent = `min: ${min}`
  max_elm.textContent = `max: ${max}`

  const color_map = x => (x - min) / (max - min)

  for (let index in jsonData[week]['data']) {
    let week_county_entry = jsonData[week]['data'][index]
    let select_str = "path[fips=\"" + week_county_entry['fips'] + "\"]"
    let r = color_map(week_county_entry['cumulative_cases'])
    let color = `rgba(0, 0, 200, ${r})`

    // Debuga
    // console.log(`${state_name} has color ${color} cases ${all_with_week[i].cases} max ${max} min ${min}`)
    d3.select(select_str).transition(t).style("fill", color)
  }
}

// Add UI elements
const next_button = document.getElementById("nextbut")
next_button.addEventListener('click', weeks_forward)

const prev_button = document.getElementById("prevbut")
prev_button.addEventListener('click', weeks_back)

function setWeekUI(week) {
  const state_p = document.getElementById("state_ui")
  state_p.textContent = "Week: " + week
}

// Slecect UI elements
const min_elm = document.getElementById("min")
const max_elm = document.getElementById("max")

document.querySelector('#more_info_but').addEventListener('click', function () {
  document.querySelector('#blurb').classList.toggle('blurb_max');
});

// Call upate on map
update(mapData);