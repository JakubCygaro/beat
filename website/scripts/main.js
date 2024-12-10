var crc;
var draw;
var group;
var radius = 300;
var segmentCount = 0;
var rotation = 0;
var items = []//["dupa", "siupa"]
const rotationVelocity = 1
const width = 300;
const height = 300;
const crcXTrans = 0;
const crcYTrans = 0;

const DISPLAY_DEBUG = false;

SVG.on(document, 'DOMContentLoaded', async function() {
    let svg = SVG();
    draw = svg.addTo('#canvas').size(width, height)
    crc = draw.circle(radius).move(crcXTrans, crcYTrans).fill('#f06');
    group = draw.group().attr({
        transform:`translate(${crcXTrans + radius/2},${crcYTrans + radius/2})`,
        stroke:"#fff",
        "stroke-width":"2"
    })
    addItem("dupa")
    addItem("siupa")
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
    let hackBoxOpacity;
    //if (DISPLAY_DEBUG)
    //    hackBoxOpacity = 10;
    //else
    hackBoxOpacity = 0;
    group.rect(radius * 2, radius * 2).attr({
        transform: `translate(${-radius}, ${-radius})`,
        opacity: hackBoxOpacity
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
        let x = radius / 2
        let y = 0
        let thisAngle = degreesToRadians((angle * i) + angle / 2)
        let angleOffsetX = (x * Math.cos(thisAngle)) - (y * Math.sin(thisAngle))
        let angleOffsetY = (y * Math.cos(thisAngle)) + (x * Math.sin(thisAngle))
        if(DISPLAY_DEBUG)
            group.path(`M0 0 ${angleOffsetX},${angleOffsetY}`).fill('#AAAA00')

        let angle90 = degreesToRadians(90)
        perpX = (angleOffsetX  * Math.cos(angle90)) - (angleOffsetY  * Math.sin(angle90))
        perpY = (angleOffsetY  * Math.cos(angle90)) + (angleOffsetX   * Math.sin(angle90))
        let normalizedPerpendiciular = normalizeVector({
            x: perpX,
            y: perpY,
        });
        let moveFactor = -20.5;
        let path = `M${normalizedPerpendiciular.x * moveFactor} ${normalizedPerpendiciular.y * moveFactor} ${angleOffsetX + normalizedPerpendiciular.x * moveFactor},${angleOffsetY + normalizedPerpendiciular.y * moveFactor}`
        if (DISPLAY_DEBUG)
            group.path(path).attr({
                stroke:'#00ff00',
            })
        console.log(`item: ${items[i]}`)
        let text = group
            .text(items[i])
            .path(path)
            .font({ 
                size: -moveFactor, 
                family: 'Arial' 
            })
            .attr({
                startOffset:"50%",
                "text-anchor":"middle",
                side: "left"
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
        let itemList = document.getElementById('item-list')
        let button = document.createElement('button')
        let span = document.createElement('span')
        let li = document.createElement('li')
        li.classList = "item"
        span.classList = "value"
        span.textContent = item
        button.dataset.action = 'delete'
        button.textContent = "Remove"
        li.appendChild(span)
        li.appendChild(button)
        itemList.appendChild(li)
        button.addEventListener("click", onDelete);
        drawSegments()
    }
    console.log(items)
}
function onDelete(e) {
    if (e.target.dataset.action === 'delete') {
        let item = e.target.closest('.item')
        let toDelete = item.firstChild.textContent;
        console.log(toDelete)
        let idx = items.indexOf(toDelete);
        console.log(idx)
        if(idx >= 0) {
            items.splice(idx, 1);
            drawSegments();
        }
        item.remove();
    }
}
function degreesToRadians(degrees)
{
    var pi = Math.PI;
    return degrees * (pi/180);
}

function normalizeVector(vector) {
    let magnitude = Math.sqrt(vector.x * vector.x + vector.y * vector.y)
    return {
        x: vector.x / magnitude,
        y: vector.y / magnitude
    }
}
function dotProduct(v1, v2) {
    return v1.x * v2.x + v1.y * v2.y
}
function perpendiciularVector(vector) {
    let e;
    let dot;
    do {
        e = {
            x: -Math.random(),
            y: Math.random()
        }
        e = normalizeVector(e)
        dot = dotProduct(e, vector)
    } while(dot >= 0.5)
    let tmp = dotProduct(dotProduct(e, vector), vector)
    return {
        x: e.x - tmp,
        y: e.y - tmp
    }
}
