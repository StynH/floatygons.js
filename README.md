# floatygons.js
![npm](https://img.shields.io/npm/dw/floatygons)![npm](https://img.shields.io/npm/v/floatygons)

Random floating dots that form a polygon, something I made for my portfolio site. Every setting can be tweaked.
![Example](https://i.imgur.com/Ba46UyB.png)
![Another Example](https://i.imgur.com/PiWuNxS.png)
![Default Settings](https://i.imgur.com/G22tP8P.png)

## Usage
```js
//Make a new object, default settings.
const f = new Floatygons();

//Use the constructor to override any option.
const f = new Floatygons({
    canvasId: "#floatygonCanvas",
    clearColor: "#1b1b1b",
    dotColor: "#FFFFFF",
    lineColor: "#FFFFFF",
    maxDotsAlive: 128,
    dotSize: 3,
    maxDotSpeed: 20,
    maxConnections: 3,
    maxDistance: 200,
    fps: 144
});

//Use start() only once to begin.
const f = new Floatygons();
f.start();

//Use stop() to pause.
f.stop();

//Use resume() to start again.
f.resume();
```
