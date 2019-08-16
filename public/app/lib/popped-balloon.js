// Configuration, Play with these
var canvas;
var ctx;

var config = {
    particleNumber: 30,
    maxParticleSize: 15,
    maxSpeed: 4,
    colorVariation: 50
};


// Some Variables hanging out
var particles = [];

// Particle Constructor
var Particle = function (x, y, c) {
    // X Coordinate
    this.x = x || Math.round(Math.random() * canvas.width);
    // Y Coordinate
    this.y = y || Math.round(Math.random() * canvas.height);
    // Saving the base position
    this.basePosition = {x: x, y: y};
    // Radius of the space dust
    this.r = Math.ceil(Math.random() * config.maxParticleSize);
    // Color of the rock, given some randomness
    // this.c = colorVariation(colorPalette.matter[Math.floor(Math.random() * colorPalette.matter.length)],
    //     true);
    this.c = c;
    // Speed of which the rock travels
    this.s = Math.pow(Math.ceil(Math.random() * config.maxSpeed), .7);
    // Direction the Rock flies
    this.d = Math.round(Math.random() * 360);
    this.updateCounter = 0;
    this.baseColor = c;
};

// Used to find the rocks next point in space, accounting for speed and direction
var updateParticleModel = function (p) {
    var a = 180 - (p.d + 90); // find the 3rd angle
    p.d > 0 && p.d < 180 ? p.x += p.s * Math.sin(p.d) / Math.sin(p.s) : p.x -= p.s * Math.sin(p.d) / Math
        .sin(p.s);
    p.d > 90 && p.d < 270 ? p.y += p.s * Math.sin(a) / Math.sin(p.s) : p.y -= p.s * Math.sin(a) / Math.sin(p
        .s);
    p.updateCounter++;      
    const transparencyLevel = getColorTranparencyValue(p.updateCounter);
    p.c = p.baseColor+transparencyLevel;
    return p;
};

var getColorTranparencyValue = function (counterValue){
    let alphaLevel = 100 - Math.ceil(counterValue/5)*5;
    return COLOR_ALPHA_LEVELS[alphaLevel];
}

// Just the function that physically draws the particles
// Physically? sure why not, physically.
var drawParticle = function (x, y, r, c) {
    ctx.beginPath();
    ctx.fillStyle = c;
    ctx.arc(x, y, r, 0, 2 * Math.PI, false);
    ctx.fill();
    ctx.closePath();
};

// Remove particles that aren't on the canvas
var cleanUpArray = function () {
    particles = particles.filter((p) => {
        return (p.updateCounter < 70);
    });
};


var initParticles = function (numParticles, x, y, color) {
    for (let i = 0; i < numParticles; i++) {
        particles.push(new Particle(x, y, color));
    }
    particles.forEach((p) => {
        drawParticle(p.x, p.y, p.r, p.c);
    });
};

// That thing


// Our Frame function
var frame = function (ctx) {
    canvas = document.getElementById('canvas'),
    ctx = canvas.getContext('2d');

    // Update Particle models to new position
    particles.map((p) => {
        return updateParticleModel(p);
    });
    cleanUpArray();
    // Draw em'
    particles.forEach((p) => {
        drawParticle(p.x, p.y, p.r, p.c);
    });
    // Play the same song? Ok!
    window.requestAnimFrame(frame);
};