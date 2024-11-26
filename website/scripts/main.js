var crc;
var draw;
var group;
var radius = 300;
var segmentCount = 4;
var rotation = 0;
var items = []
const rotationVelocity = 1
const width = 300;
const height = 300;
const crcXTrans = 0;
const crcYTrans = 0;

SVG.on(document, 'DOMContentLoaded', async function() {
    let svg = SVG();
    draw = svg.addTo('#canvas').size(width, height)
    crc = draw.circle(radius).move(crcXTrans, crcYTrans).fill('#f06');
    drawSegments();
    //await update()
})

async function spin() {
    let rotate = Math.random() * (1500 - 1000) + 1500 
    group.animate({
        duration: 2000,
        delay: 0,
        when: 'now',
        swing: false,
        times: 1,
        wait: 0
    }).rotate(rotate)
}
async function update() {
    while(true){ 
        await new Promise(r => setTimeout(r, 1000/60));
        group.rotate(2);
    }
}
function drawSegments() {
    let angle = 360 / segmentCount;
    group = draw.group().attr({
        transform:`translate(${crcXTrans + radius/2},${crcYTrans + radius/2})`,
        stroke:"#fff",
        "stroke-width":"2"
    })
    group.rect(radius * 2, radius * 2).attr({
        transform: `translate(${-radius}, ${-radius})`,
        opacity: 0
    });
    for (i = 0; i < segmentCount; i++){
        let x = radius / 2
        let y = 0
        let thisAngle = degreesToRadians(angle * i)
        //console.log(`x: ${x} y: ${y} thisAngle: ${thisAngle}`)
        let angleOffsetX = (x * Math.cos(thisAngle)) - (y * Math.sin(thisAngle))
        let angleOffsetY = (y * Math.cos(thisAngle)) + (x * Math.sin(thisAngle))

        //console.log(`x: ${x} y: ${y} angleOX: ${angleOffsetX} angleOY: ${angleOffsetY}`)
        group.path(`M0 0 ${angleOffsetX},${angleOffsetY}`).fill('#fff')
    }
}

function addItem() {
    let item = document.getElementById('new-item').value.toString()
    items.push(item)
    console.log(items)
}

function drawItems() {
    for (const item of items) {
        
    }
}

function degreesToRadians(degrees)
{
    var pi = Math.PI;
    return degrees * (pi/180);
}

