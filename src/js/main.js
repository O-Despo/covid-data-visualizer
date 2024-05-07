// Import our custom CSS
import '../scss/styles.scss'
import * as d3 from "d3";
// Import all of Bootstrap's JS
import * as bootstrap from 'bootstrap'
import * as topjson from 'topojson'
import jsonData from '/static/gz_2010_us_040_00_500k.json';
// import csvData from '/static/Weekly_United_States_COVID-19_Cases_and_Deaths_by_State_-_ARCHIVED_20240427.csv';
// let height = window.innerHeight - (0.2 * window.innerHeight);
// let width = window.innerWidth - (0.2 * window.innerWidth);
// d3.csv

const state_map = { "AL": "Alabama", "AK": "Alaska", "AZ": "Arizona", "AR": "Arkansas", "CA": "California", "CO": "Colorado", "CT": "Connecticut", "DE": "Delaware", "FL": "Florida", "GA": "Georgia", "HI": "Hawaii", "ID": "Idaho", "IL": "Illinois", "IN": "Indiana", "IA": "Iowa", "KS": "Kansas", "KY": "Kentucky", "LA": "Louisiana", "ME": "Maine", "MD": "Maryland", "MA": "Massachusetts", "MI": "Michigan", "MN": "Minnesota", "MS": "Mississippi", "MO": "Missouri", "MT": "Montana", "NE": "Nebraska", "NV": "Nevada", "NH": "New Hampshire", "NJ": "New Jersey", "NM": "New Mexico", "NY": "New York", "NC": "North Carolina", "ND": "North Dakota", "OH": "Ohio", "OK": "Oklahoma", "OR": "Oregon", "PA": "Pennsylvania", "RI": "Rhode Island", "SC": "South Carolina", "SD": "South Dakota", "TN": "Tennessee", "TX": "Texas", "UT": "Utah", "VT": "Vermont", "VA": "Virginia", "WA": "Washington", "WV": "West Virginia", "WI": "Wisconsin", "WY": "Wyoming" }

const data = await d3.dsv(",", "/static/Weekly_United_States_COVID-19_Cases_and_Deaths_by_State_-_ARCHIVED_20240427.csv", (d) => {
  return {
    week: new Date(d.start_date), // convert "Year" column to Date
    state: d.state,
    cases: d.new_cases,
  };
});

const weeks_list = data.filter((item, index) => data.indexOf(item) === index).map(item => item.week)
const weeks_min = 0
const weeks_max = weeks_list.length - 1
let weeks_index = 0

function weeks_forward() {
  if(weeks_index < weeks_max) { weeks_index++ }
  setStateUI(weeks_list[weeks_index].toDateString())
  reDrawWeek(weeks_list[weeks_index])
}
function weeks_back() {
  if(weeks_index > weeks_min) { weeks_index-- }
  setStateUI(weeks_list[weeks_index])
  reDrawWeek(weeks_list[weeks_index])
}
// start_week = data[0]["week"]

document.data = data
let projection = d3.geoAlbersUsa().fitSize([1000, 600], jsonData);
// .scale(1);
// .translate([-1, 1]);
let geoGenerator = d3.geoPath()
  .projection(projection);

function update(geojson) {
  let u = d3.select('#content g.map')
    .selectAll('path')
    .data(geojson.features);

  u.enter()
    .append('path')
    .attr('state', function (d) {
      return d.properties.NAME.toLowerCase()
    })
    .attr('d', geoGenerator);
}
update(jsonData);

const min_elm = document.getElementById("min")
const max_elm = document.getElementById("max")

function reDrawWeek(week) {
  const t = d3.transition().duration(1000).ease(d3.easeLinear);
  console.log(week)
  let all_with_week = data.filter(i => i.week == week.toString() && state_map[i.state] != undefined)
  const cases_list = all_with_week.map(i => i.cases)
  const min = Math.min(...cases_list)
  const max = Math.max(...cases_list)
  
  min_elm.textContent = `min: ${min}`
  max_elm.textContent = `max: ${max}`

  const color_map = x => (x-min)/(max-min)

  for (let i in all_with_week) {
      let state_name = state_map[all_with_week[i].state]
      let select_str = "path[state=\"" + state_name.toLowerCase() + "\"]" 
      let r = color_map(all_with_week[i].cases)
      let color = `rgba(0, 0, 200, ${r})`
      console.log(`${state_name} has color ${color} cases ${all_with_week[i].cases} max ${max} min ${min}`)
      d3.select(select_str).transition(t).style("fill", color)
  }
}
``
const next_button = document.getElementById("nextbut")
next_button.addEventListener('click', weeks_forward)

const prev_button = document.getElementById("prevbut")
prev_button.addEventListener('click', weeks_back)


function setStateUI(state){
  const state_p = document.getElementById("state_ui")
  state_p.textContent = "Week: " + state 
}
