//Floatygons.js
//By Styn van de Haterd @ 2019
class Floatygons{
    constructor(){
        let defaults = {
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
        };

        if (arguments[0] && typeof arguments[0] === "object") {
            this.options = this.extendDefaults(defaults, arguments[0]);
        }
        else{
            this.options = defaults;
        }

        this.options.interval = 1000 / this.options.fps;
        this.dots = [];
    };

    extendDefaults = (source, properties) => {
        let property;
        for (property in properties) {
            if (properties.hasOwnProperty(property)) {
                source[property] = properties[property];
            }
        }
        return source;
    };

    getRandom = (min, max) => {
        return Math.floor(Math.random() * (max - min + 1) ) + min;
    };

    increaseBrightness = (hex, lum) =>{
        hex = String(hex).replace(/[^0-9a-f]/gi, "");

        if (hex.length < 6) {
            hex = hex.replace(/(.)/g, '$1$1');
        }
        lum = lum || 0;

        let rgb = "#", c;
        for (let i = 0; i < 3; ++i) {
            c = parseInt(hex.substr(i * 2, 2), 16);
            c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
            rgb += ("00" + c).substr(c.length);
        }
        return rgb;
    };

    spawnDot = () =>{
        return {
            x: this.getRandom(0, this.canvasWidth),
            y: this.getRandom(0, this.canvasHeight),
            vx: this.getRandom(-this.options.maxDotSpeed, this.options.maxDotSpeed),
            vy: this.getRandom(-this.options.maxDotSpeed, this.options.maxDotSpeed),
            markedForDeletion: false,
            connections: []
        };
    };

    manhattanDistance = (dotA, dotB) =>{
        return Math.abs(dotB.x - dotA.x) + Math.abs(dotB.y - dotA.y);
    };

    seekConnection = (dot) => {
        for(let other of this.dots){
            if(other === dot) continue;

            const distance =  this.manhattanDistance(dot, other);
            if(distance < this.options.maxDistance
                && other.connections.filter(d => d === dot).length === 0
                && dot.connections.filter(d => d === other).length === 0
            ){
                return other;
            }
        }
        return undefined;
    };

    setup = () =>{
        this.canvas = document.querySelector(this.options.canvasId);
        this.ctx =  this.canvas.getContext("2d");

        const parent = this.canvas.parentElement;

        this.ctx.canvas.width = parent.clientWidth;
        this.ctx.canvas.height = parent.clientHeight;

        this.canvasWidth = this.ctx.canvas.width;
        this.canvasHeight = this.ctx.canvas.height;

        for(let i = 0; i < this.options.maxDotsAlive; ++i){
            this.dots.push(this.spawnDot());
        }
    };

    clearScreen = () => {
        this.ctx.fillStyle = this.options.clearColor;
        this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
    };

    drawLine = (dotA, dotB) => {
        this.ctx.strokeStyle = this.increaseBrightness(this.options.lineColor, -(this.manhattanDistance(dotA, dotB) / this.options.maxDistance) + 0.075);
        this.ctx.beginPath();
        this.ctx.moveTo(dotA.x + this.options.dotSize / 2, dotA.y + this.options.dotSize / 2);
        this.ctx.lineTo(dotB.x + this.options.dotSize / 2, dotB.y + this.options.dotSize / 2);
        this.ctx.stroke();
    };

    drawDot = (dot) => {
        for(let connection of dot.connections){
            this.drawLine(dot, connection);
        }

        this.ctx.fillStyle = this.options.dotColor;
        this.ctx.fillRect(dot.x,dot.y, this.options.dotSize, this.options.dotSize);
    };

    updateDot = (dot) => {
        dot.x += dot.vx * (this.options.interval / 1000.0);
        dot.y += dot.vy * (this.options.interval / 1000.0);

        //Check positioning for deletion
        if(dot.x > this.canvasWidth || dot.x < 0 || dot.y > this.canvasHeight || dot.y < 0){
            dot.markedForDeletion = true;
            return;
        }

        //Check if new connections available
        if(dot.connections.length < this.options.maxConnections){
            const connection = this.seekConnection(dot);
            if(connection !== undefined){
                dot.connections.push(connection);
            }
        }

        //Check existing connections
        let i = dot.connections.length - 1;
        while(i >= 0){
            if(dot.connections[i].markedForDeletion || this.manhattanDistance(dot, dot.connections[i]) > this.options.maxDistance){
                dot.connections.splice(i, 1);
            }
            --i;
        }
    };

    update = () => {
        this.clearScreen();

        let i = this.dots.length - 1;
        let dotsRemoved = 0;
        while(i >= 0){
            let dot = this.dots[i];
            //Update
            this.updateDot(dot);

            //Remove dot if needed.
            if(dot.markedForDeletion){
                this.dots.splice(i, 1);
                ++dotsRemoved;
                --i;
                continue;
            }

            //Draw
            this.drawDot(dot);
            --i;
        }

        for(let n = 0; n < dotsRemoved; ++n){
            this.dots.push(this.spawnDot());
        }
    };

    start = () =>{
        this.setup();
        this.clearScreen();
        setInterval(this.update, this.options.interval);
    };
}
