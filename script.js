/* global d3, topojson */

/**
 * built using tutorial @ http://bost.ocks.org/mike/map/
 */

const width = 960;
const height = 1160;

const svg = appendNewSvgElement(width, height);
const projection = buildProjection();
const path = d3.geo.path()
    .projection(projection)
    .pointRadius(2);

getUkGeoData().then(drawMap);

function appendNewSvgElement(width, height) {
    return d3.select('body').append('svg')
        .attr('width', width)
        .attr('height', height);
}

function buildProjection() {
    return d3.geo.albers()
        .center([0, 55.4])
        .rotate([4.4, 0])
        .parallels([50, 60])
        .scale(1200 * 5)
        .translate([width / 2, height / 2]);
}

function getUkGeoData() {
    return new Promise(function(resolve, reject){
         d3.json('uk.json', function(err, data){
             if (err !== null) { return reject(err) };
             resolve(data);
         });
    });
}

function drawMap(ukData) {
    drawSubunits(ukData);
    drawBoundaries(ukData);
    displayPlaces(ukData);
    addCountryLabels(ukData);
}

function drawSubunits(ukData) {
    svg.selectAll('.subunit')
        .data(topojson.feature(ukData, ukData.objects.subunits).features)
        .enter()
        .append('path')
        .attr('class', d => 'subunit ' + d.id)
        .attr('d', path);
}

function drawBoundaries(ukData) {
    drawInteriorBorders(ukData);
    drawIrishCoustline(ukData);
}

function drawInteriorBorders(ukData) {
    const mesh = topojson.mesh(ukData, ukData.objects.subunits, (a, b) => a !== b && a.id !== 'IRL');
    svg.append('path')
        .datum(mesh)
        .attr('d', path)
        .attr('class', 'subunit-boundary');
}

function drawIrishCoustline(ukData) {
    const mesh = topojson.mesh(ukData, ukData.objects.subunits, (a, b) => a === b && a.id === 'IRL');
    svg.append('path')
        .datum(mesh)
        .attr('d', path)
        .attr('class', 'subunit-boundary IRL');
}

function displayPlaces(ukData) {
    svg.append('path')
        .datum(topojson.feature(ukData, ukData.objects.places))
        .attr('d', path)
        .attr('class', 'place');

    svg.selectAll('.place-label')
        .data(topojson.feature(ukData, ukData.objects.places).features)
        .enter()
        .append('text')
        .attr('class', 'place-label')
        .attr('transform', d => `translate(${projection(d.geometry.coordinates)})`)
        .attr('dy', '.35em')
        .text(d => d.properties.name);

    svg.selectAll('.place-label')
        .attr('x', d => d.geometry.coordinates[0] > -1 ? 6 : -6)
        .style('text-anchor', d => d.geometry.coordinates[0] > -1 ? 'start' : 'end');
}

function addCountryLabels(ukData) {
    svg.selectAll('.subunit-label')
        .data(topojson.feature(ukData, ukData.objects.subunits).features)
        .enter()
        .append('text')
        .attr('class', d => `subunit-label ${d.id}`)
        .attr('transform', d => `translate(${path.centroid(d)})`)
        .attr('dy', '.35em')
        .text(d => d.properties.name);
}
