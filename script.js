/* global d3, topojson */

/**
 * built using tutorial @ http://bost.ocks.org/mike/map/
 */

const width = 960;
const height = 1160;

const svg = appendNewSvgElement(width, height);
const path = d3.geo.path().projection(buildProjection());

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

function drawInteriorBorders(uk) {
    const mesh = topojson.mesh(uk, uk.objects.subunits, (a, b) => a !== b && a.id !== 'IRL');
    svg.append('path')
        .datum(mesh)
        .attr('d', path)
        .attr('class', 'subunit-boundary');
}

function drawIrishCoustline(uk) {
    const mesh = topojson.mesh(uk, uk.objects.subunits, (a, b) => a === b && a.id === 'IRL');
    svg.append('path')
        .datum(mesh)
        .attr('d', path)
        .attr('class', 'subunit-boundary IRL');
}
