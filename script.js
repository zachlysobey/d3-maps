/* global d3, topojson */

/**
 * built using tutorial @ http://bost.ocks.org/mike/map/
 */

var width = 960;
var height = 1160;

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

d3.json("uk.json", function(error, uk) {
    if (error) {
        return console.error(error);
    }

    console.log(uk);

    const subunits = topojson.feature(uk, uk.objects.subunits);

    const projection = d3.geo.albers()
        .center([0, 55.4])
        .rotate([4.4, 0])
        .parallels([50, 60])
        .scale(6000)
        .translate([width / 2, height / 2]);

    const path = d3.geo.path()
        .projection(projection);

    svg.append("path")
        .datum(subunits)
        .attr("d", path);

    svg.selectAll(".subunit")
        .data(topojson.feature(uk, uk.objects.subunits).features)
        .enter().append("path")
        .attr("class", d => "subunit " + d.id)
        .attr("d", path);
});
