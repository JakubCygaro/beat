var crc;
var draw;
var group;
var radius = 150;
var segmentCount = 2;
var rotation = 0;
const rotationVelocity = 1
const width = 300;
const height = 300;

SVG.on(document, 'DOMContentLoaded', async function() {
    let svg = SVG();
    draw = svg.addTo('#canvas').size(width, height)
    crc = draw.circle(radius).move(width/2, height/2).fill('#f06');
    drawSegments();
    await update()
})

async function update() {
    while(true){ 
        await new Promise(r => setTimeout(r, 1000/60));
        group.rotate(2);
    }
}
function drawSegments() {
    let angle = 360 / segmentCount;
    group = draw.group().attr({
        transform:`translate(${width/2 + radius/2},${height/2 + radius/2})`,
        stroke:"#fff",
        "stroke-width":"2"
    })
    for (i = 0; i < segmentCount; i++){
        let x = radius / 2
        let y = 0
        let thisAngle = degreesToRadians(angle * i)
        console.log(`x: ${x} y: ${y} thisAngle: ${thisAngle}`)
        let angleOffsetX = (x * Math.cos(thisAngle)) - (y * Math.sin(thisAngle))
        let angleOffsetY = (y * Math.cos(thisAngle)) + (x * Math.sin(thisAngle))

        console.log(`x: ${x} y: ${y} angleOX: ${angleOffsetX} angleOY: ${angleOffsetY}`)
        group.path(`M0 0 ${angleOffsetX},${angleOffsetY}`).fill('#fff')
    }
}
function degreesToRadians(degrees)
{
    var pi = Math.PI;
    return degrees * (pi/180);
}