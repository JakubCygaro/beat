var crc;
var draw;
var group;
var radius = 300;
var segmentCount = 4;
var rotation = 0;
var items = ["dupa", "siupa"]
const rotationVelocity = 1
const width = 300;
const height = 300;
const crcXTrans = 0;
const crcYTrans = 0;

SVG.on(document, 'DOMContentLoaded', async function() {
    let svg = SVG();
    draw = svg.addTo('#canvas').size(width, height)
    crc = draw.circle(radius).move(crcXTrans, crcYTrans).fill('#f06');
    group = draw.group().attr({
        transform:`translate(${crcXTrans + radius/2},${crcYTrans + radius/2})`,
        stroke:"#fff",
        "stroke-width":"2"
    })
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
    segmentCount = items.length
    let angle = 360 / segmentCount;
    group.clear()
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
    for (i = 0; i < segmentCount; i++){
        let x = radius / 4
        let y = 0
        //x = (x * Math.cos(degreesToRadians(angle / 2))) - (y * Math.sin(degreesToRadians(angle / 2)))
        //y = (y * Math.cos(degreesToRadians(angle / 2))) + (x * Math.sin(degreesToRadians(angle / 2)))
        let thisAngle = degreesToRadians((angle * i) + angle / 2)
        //console.log(`x: ${x} y: ${y} thisAngle: ${thisAngle}`)
        let angleOffsetX = (x * Math.cos(thisAngle)) - (y * Math.sin(thisAngle))
        let angleOffsetY = (y * Math.cos(thisAngle)) + (x * Math.sin(thisAngle))

        //console.log(`x: ${x} y: ${y} angleOX: ${angleOffsetX} angleOY: ${angleOffsetY}`)
        let path = `M0 0 ${angleOffsetX},${angleOffsetY}`
        console.log(`item: ${items[i]}`)
        //let text = group.text(items[i])
        //text.path(path)
        //    .font({ 
        //        size: 20.5, 
        //        family: 'Arial' 
        //    })
        //    .attr({
        //        startOffset:"50%",
        //        "text-anchor":"middle"
        //    })
        //group.path(path).attr({
        //    stroke:'#00ff00'
        //})
        let text = group.text(items[i])
                        .font({
                            size: 20,
                            family: 'Arial'
                        })
                        .attr({
                            transform: `translate(${angleOffsetX}, ${angleOffsetY})`,
                            startOffset:"50%",
                            "text-anchor":"middle"
                        })
    }
}

function addItem(text) {
    let item;
    if (text) {
        item = text
    } else {
        item = document.getElementById('new-item').value.toString()
    }
    if (item !== "") {
        items.push(item)
        segmentCount = items.length
        drawSegments()
    }
    console.log(items)
}

//function drawItems() {
//    for (const item of items) {
//        
//    }
//}

function degreesToRadians(degrees)
{
    var pi = Math.PI;
    return degrees * (pi/180);
}

