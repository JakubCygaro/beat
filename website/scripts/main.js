const DIAMETER = 550;
const WIDTH = 600;
const HEIGHT = 600;
const CRC_X_TRANS = WIDTH / 2 - DIAMETER / 2;
const CRC_Y_TRANS = HEIGHT / 2 - DIAMETER / 2;
const ARROW_DEGREE = -90;
const DISPLAY_DEBUG = false;
const COLOR_PALETTE = ['darkred', 'darkgreen', 'darkblue', 'orange', 'purple', 'gray', 'purple']
var crc;
var canvas;
var group;
var segmentCount = 0;
var rotation = 0;
var items = [];
var reRotate = null;
var spinning = false;
var inputArea;

function setup() {
    items.push("Stary")
    items.push("Mi")
    items.push("Siada")
    for(const item of items) {
        inputArea.value += `${item}\n`
    }
    segmentCount = items.length;
}

SVG.on(document, 'DOMContentLoaded', async function() {
    let svg = SVG();
    canvas = svg.addTo('#canvas').size(WIDTH, HEIGHT)
    crc = canvas.circle(DIAMETER).move(CRC_X_TRANS, CRC_Y_TRANS).fill(COLOR_PALETTE[0]);
    group = canvas.group().attr({
        transform:`translate(${CRC_X_TRANS + DIAMETER/2},${CRC_Y_TRANS + DIAMETER/2})`,
        stroke:"#fff",
        "stroke-width":"2"
    })
    inputArea = document.getElementById('input-area')

    if (inputArea.addEventListener) {
      inputArea.addEventListener('input', inputAreaChange, false);
    } else if (inputArea.attachEvent) {
      inputArea.attachEvent('onpropertychange', inputAreaChange);
    }
    setup();
    drawSegments();
})

async function spin() {
    if(spinning || segmentCount <= 0){
        return;
    } else {
        spinning = true;
        inputArea.readOnly = true;
    }
    if (reRotate != null) {
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
    await new Promise(r => setTimeout(r, spinDuration));
    let segmentSize = (360 / segmentCount)
    let segm = ((rotate + ARROW_DEGREE) % 360) 
    segm = 360 - segm
    segm = Math.floor(segm / segmentSize)
    alert(items[segm])
    spinning = false;
    inputArea.readOnly = false;
}
function drawSegments() {
    segmentCount = items.length
    let angle = 360 / segmentCount;
    group.clear()
    let hackBoxOpacity;
    hackBoxOpacity = 0;
    group.rect(DIAMETER * 2, DIAMETER * 2).attr({
        transform: `translate(${-DIAMETER}, ${-DIAMETER})`,
        opacity: hackBoxOpacity
    });
    if (segmentCount > 0){

        let lastSegm = {
            x: 0,
            y: -DIAMETER / 2
        }
        for (i = 0; i <= segmentCount; i++){
            let x = 0 
            let y = -DIAMETER / 2
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
                
                let path;
                if (segmentCount == 1) {
                    path = group.path(`M ${lastSegm.x} ${lastSegm.y}` +
                        ` A ${DIAMETER / 2} ${DIAMETER / 2} 0 0 1 ${rotated.x} ${-rotated.y} ` + 
                        ` A ${DIAMETER / 2} ${DIAMETER / 2} 0 0 1 ${rotated.x} ${rotated.y} Z`
                    )
                } else {
                    path = group.path(`M0 0 L ${lastSegm.x} ${lastSegm.y}`+ 
                        ` A ${DIAMETER / 2} ${DIAMETER / 2} 0 0 1 ${rotated.x} ${rotated.y} Z`)
                }
                path.fill(COLOR_PALETTE[(i) % (range)])
                path.click(spin)
            }
            lastSegm = rotated;
        }
        for (i = 0; i < segmentCount; i++){
            let x = 0 
            let y = (-DIAMETER / 2) * .95
            let thisAngle = degreesToRadians((angle * i) + angle / 2)
            let rotated = rotateVector({x: x, y: y}, thisAngle);
            let angleOffsetX = rotated.x 
            let angleOffsetY = rotated.y 
            if(DISPLAY_DEBUG)
                group.path(`M0 0 ${angleOffsetX},${angleOffsetY}`).fill('#AAAA00')

            let angle90 = degreesToRadians(90)
            rotated = rotateVector(rotated, angle90);
            let normalizedPerpendiciular = normalizeVector({
                x: rotated.x,
                y: rotated.y,
            });
            let moveFactor = -30.5 + segmentCount * 0.5;
            let path = `M${normalizedPerpendiciular.x * moveFactor} ${normalizedPerpendiciular.y * moveFactor}`+
                ` ${angleOffsetX + normalizedPerpendiciular.x * moveFactor},${angleOffsetY + normalizedPerpendiciular.y * moveFactor}`
            if (DISPLAY_DEBUG)
                group.path(path).attr({
                    stroke:'#00ff00',
                })
            let text = group
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
                    startOffset:"12%",
                    "text-anchor":"start",
                    side: "end",
                    stroke: 'white',
                    fill: 'white'
                })
        }
    }
    let arrow = canvas.polygon('-5,0 15,10 15,-10')
    arrow.fill('red')    
    arrow.move(CRC_X_TRANS + DIAMETER - 5, CRC_Y_TRANS + DIAMETER / 2 - 10)

    let middleCrcDiameter = DIAMETER * 0.1;
    group.circle(middleCrcDiameter)
        .move(-middleCrcDiameter / 2,  -middleCrcDiameter / 2 )
        .fill('black')
        .click(spin)
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
function rotateVector(vec2, theta) {
    let angleOffsetX = (vec2.x * Math.cos(theta)) - (vec2.y * Math.sin(theta))
    let angleOffsetY = (vec2.y * Math.cos(theta)) + (vec2.x * Math.sin(theta))
    return {
        x: angleOffsetX,
        y: angleOffsetY
    }
}

function inputAreaChange(event) {
    items.splice(0, items.length)
    let lines = event.target.value.split('\n');
    for (const line of lines) {
        let trimmed = line.trim();
        if (trimmed !== "") {
            items.push(trimmed)
        }
    }
    segmentCount = items.length
    drawSegments()
}
//function addItem(text) {
//    let item;
//    if (text) {
//        item = text
//    } else {
//        item = document.getElementById('new-item').value.toString()
//    }
//    if (item !== "") {
//        items.push(item)
//        segmentCount = items.length
//        let itemList = document.getElementById('item-list')
//        let button = document.createElement('button')
//        let span = document.createElement('span')
//        let li = document.createElement('li')
//        li.classList = "item"
//
//        span.classList = "value"
//        span.textContent = item
//        button.dataset.action = 'delete'
//        button.textContent = "Remove"
//        li.appendChild(span)
//        li.appendChild(button)
//        itemList.appendChild(li)
//        button.addEventListener("click", onDelete);
//        drawSegments()
//    }
//}
//function onDelete(e) {
//    if (e.target.dataset.action === 'delete') {
//        let item = e.target.closest('.item')
//        let toDelete = item.firstChild.textContent;
//        let idx = items.indexOf(toDelete);
//        if(idx >= 0) {
//            items.splice(idx, 1);
//            drawSegments();
//        }
//        item.remove();
//    }
//}
