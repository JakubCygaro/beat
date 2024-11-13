<!DOCTYPE html>
<html>
    <head>
        <link rel="stylesheet" href="styles.css">
        <script src="https://cdn.jsdelivr.net/npm/@svgdotjs/svg.js@3.0/dist/svg.min.js"></script>
        <script type="text/javascript">
            var crc;
            var draw;
            var radius = 150;
            var segmentCount = 4;
            var rotation = 0;
            const rotationVelocity = 1

            SVG.on(document, 'DOMContentLoaded', async function() {
                let svg = SVG();
                draw = svg.addTo('#canvas').size(300, 300)
                
                // draw pink square
                crc = draw.circle(radius).move(100, 100).fill('#f06');
                drawSegments();
                await update()
            })

            async function update() {
                while(true){ 
                    await new Promise(r => setTimeout(r, 1000/60));
                }
            }
            function drawSegments() {
                let angle = 360 / segmentCount;
                let group = draw.group().attr({
                    transform:"translate(175,175)",
                    stroke:"#fff",
                    "stroke-width":"2"
                })
                for (i = 0; i < 4; i++){
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
        </script>
    </head>
    <body>
        <div id="canvas"></div>
        <!-- <svg width="100" height="100" id="circle-canvas">

<      </svg> -->
        <?php

            echo "hellow"
        ?>
        
    </body>
</html>