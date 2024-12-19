var crc;
var canvas;
var group;
var diameter = 300;
var segmentCount = 0;
var rotation = 0;
var items = []
var reRotate = null
var spinning = false;
const rotationVelocity = 1
const WIDTH = 400;
const HEIGHT = 400;
const crcXTrans = 0;
const crcYTrans = 0;
const ARROW_DEGREE = -90;
const DISPLAY_DEBUG = false;
const COLOR_PALETTE = ['darkred', 'darkgreen', 'darkblue', 'orange', 'purple', 'gray', 'purple']

SVG.on(document, 'DOMContentLoaded', async function() {
    let svg = SVG();
    canvas = svg.addTo('#canvas').size(WIDTH, HEIGHT)
    crc = canvas.circle(diameter).move(crcXTrans, crcYTrans).fill('#f06');
    group = canvas.group().attr({
        transform:`translate(${crcXTrans + diameter/2},${crcYTrans + diameter/2})`,
        stroke:"#fff",
        "stroke-width":"2"
    })
    addItem("dupa")
    addItem("siupa")
    drawSegments();
})

async function spin() {
    if(spinning){
        return;
    } else {
        spinning = true;
    }
    if (reRotate != null) {
        //console.log(reRotate)
        group.animate({
            duration: 500,
            delay: 0,
            when: 'now',
            swing: false,
            times: 1,
            wait: 0
        }).rotate(reRotate)
        await new Promise(r => setTimeout(r, 1000));
    } 
    let spinDuration = 1000 * 3;
    let rotate = Math.random() * (2000 - 1000) + 1000 
    group.animate({
        duration: spinDuration,
        delay: 0,
        when: 'now',
        swing: false,
        times: 1,
        wait: 0
    }).rotate(rotate)

    reRotate = -rotate
    //console.log(rotate)
    await new Promise(r => setTimeout(r, spinDuration));
    let segmentSize = (360 / segmentCount)
    let segm = ((rotate + ARROW_DEGREE) % 360) 
    //console.log(`segm: ${segm}`)
    segm = 360 - segm
    //console.log(`segmentSize: ${segmentSize}`)
    //console.log(`segm: ${segm}`)
    segm = Math.floor(segm / segmentSize)
    //console.log(`segm: ${segm}`)
    alert(items[segm])
    spinning = false;
}
function drawSegments() {
    segmentCount = items.length
    let angle = 360 / segmentCount;
    group.clear()
    let hackBoxOpacity;
    hackBoxOpacity = 0;
    group.rect(diameter * 2, diameter * 2).attr({
        transform: `translate(${-diameter}, ${-diameter})`,
        opacity: hackBoxOpacity
    });
    let lastSegm = {
        x: 0,
        y: -diameter / 2
    }
    for (i = 0; i <= segmentCount; i++){
        let x = 0 
        let y = -diameter / 2
        let thisAngle = degreesToRadians(angle * i)
        let rotated = rotateVector({x: x, y: y}, thisAngle);
        if (lastSegm){
            // if the segment count is even i need at least 2 unique colors
            // but if it is odd i need at least 3
            let range = segmentCount % 2 === 0 ?
                        COLOR_PALETTE.length % 2 === 0 ?
                            COLOR_PALETTE.length :
                            COLOR_PALETTE.length - 1
                        :
                        COLOR_PALETTE.length % 2 === 0 ?
                            COLOR_PALETTE.length - 1 :
                            COLOR_PALETTE.length ;
            console.log(`segmentCount: ${segmentCount}\nrange: ${range}`)
            group.path(`M0 0 L ${lastSegm.x} ${lastSegm.y} A ${diameter / 2} ${diameter / 2} 0 0 1 ${rotated.x} ${rotated.y} Z`)
                .fill(COLOR_PALETTE[(i) % (
                    range
                )])
        }
        lastSegm = rotated;
    }
    for (i = 0; i < segmentCount; i++){
        let x = 0 
        let y = -diameter / 2
        let thisAngle = degreesToRadians((angle * i) + angle / 2)
        let rotated = rotateVector({x: x, y: y}, thisAngle);
        let angleOffsetX = rotated.x 
        let angleOffsetY = rotated.y 
        if(DISPLAY_DEBUG)
            group.path(`M0 0 ${angleOffsetX},${angleOffsetY}`).fill('#AAAA00')

        let angle90 = degreesToRadians(90)
        rotated = rotateVector(rotated, angle90);
        //perpX = (angleOffsetX  * Math.cos(angle90)) - (angleOffsetY  * Math.sin(angle90))
        //perpY = (angleOffsetY  * Math.cos(angle90)) + (angleOffsetX   * Math.sin(angle90))
        let normalizedPerpendiciular = normalizeVector({
            x: rotated.x,
            y: rotated.y,
        });
        let moveFactor = -20.5;
        let path = `M${normalizedPerpendiciular.x * moveFactor} ${normalizedPerpendiciular.y * moveFactor} ${angleOffsetX + normalizedPerpendiciular.x * moveFactor},${angleOffsetY + normalizedPerpendiciular.y * moveFactor}`
        if (DISPLAY_DEBUG)
            group.path(path).attr({
                stroke:'#00ff00',
            })
        //console.log(`item: ${items[i]}`)
        group
            .text(items[i])
            .attr({
            })
            .path(path)
            .font({ 
                size: -moveFactor, 
                family: 'Arial' ,
            })
            .attr({
                "text-color": 'yellow',
                startOffset:"50%",
                "text-anchor":"middle",
                side: "left",
                stroke: 'white'
            })
    }
    let arrow = canvas.polygon('0,0 15,10 15,-10')
    arrow.fill('#000000')    
    arrow.move(crcXTrans + diameter, crcYTrans + diameter / 2 - 10)
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
    //console.log(items)
}
function onDelete(e) {
    if (e.target.dataset.action === 'delete') {
        let item = e.target.closest('.item')
        let toDelete = item.firstChild.textContent;
        //console.log(toDelete)
        let idx = items.indexOf(toDelete);
        //console.log(idx)
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
function rotateVector(vec2, theta) {
    let angleOffsetX = (vec2.x * Math.cos(theta)) - (vec2.y * Math.sin(theta))
    let angleOffsetY = (vec2.y * Math.cos(theta)) + (vec2.x * Math.sin(theta))
    return {
        x: angleOffsetX,
        y: angleOffsetY
    }
}
