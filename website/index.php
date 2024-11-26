<!DOCTYPE html>
<html>
    <head>
        <link rel="stylesheet" href="styles.css">
        <script src="https://cdn.jsdelivr.net/npm/@svgdotjs/svg.js@3.0/dist/svg.min.js"></script>
        <script src="scripts/main.js"></script>
    </head>
    <body>
        <div id="canvas"></div>
        <?php

        ?>
        <button onClick="spin()">
            hellow
        </button>        
        <iframe name="dummyframe" id="dummyframe" style="display: none;"></iframe>
        <form  action="javascript:void(0);" onsubmit="addItem()">
            <label for="new-item">Add:</label>
            <input type="text" id="new-item"></input>
            <input type="submit" id="add-item-button"></input>
        </form>
        <ul>
        </ul>
    </body>
</html>
