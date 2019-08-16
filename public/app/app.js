var balloonObj;
var balloons = [];
var burstSound;
function startGame() {
    initBalloons();
    initSounds();
    gameArea.start();
}

function initSounds(){
    burstSound = new Audio("sounds/Game-Shot.mp3");
    burstSound.preload = 'auto';
    burstSound.load();
    createjs.Sound.registerSound("sounds/burst.wav", "burst");
}

function initBalloons(){
    for(let i=0; i<INITIAL_BALLOON_COUNT; i++){
        balloons.push(new CANVASBALLOON.Balloon(BalloonUtils.getXCenter(), BalloonUtils.getYCenter(), BALLOON_RADIUS, getRandomColor()));
    }
}

var gameArea = {
    canvas: document.createElement("canvas"),
    start: function () {
        this.canvas.setAttribute("id", "canvas");
        this.canvas.width = CANVAS_WIDTH;
        this.canvas.height = CANVAS_HEIGHT;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(updateGameArea, 20);
        frame();

        this.canvas.addEventListener('click', function (event) {
            const pos = {
            	x: event.pageX,
            	y: event.pageY
            };

            balloons = balloons.filter((balloon) => {
                if (isClickIntersecting(pos, balloon)) {
                    const touchColor = balloon.darkColor;
                    createjs.Sound.play("burst");
                    updateGameArea();
                    initParticles("10",pos.x, pos.y, touchColor);
                    return false;
                }
                return true;
            });

        }, false);
    },
    clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop: function () {
        clearInterval(this.interval);
    }
}

function updateGameArea() {
    gameArea.clear();
    if(balloons.length > 0){
        for(var i = balloons.length -1; i >= 0 && balloons.length>0 ; i--){
            balloons[i].newPos();
            if (!balloons[i].dependentBalloonAdded && (balloons[i].centerY < (CANVAS_HEIGHT - ((BALLOON_RADIUS*2)+10)))){
                balloons[i].dependentBalloonAdded = true;
                balloons.push(new CANVASBALLOON.Balloon(BalloonUtils.getXCenter(), BalloonUtils.getYCenter(), BALLOON_RADIUS, getRandomColor()));
            }

            if (balloons[i].centerY <= -70) {
                balloons.splice(i, 1);
                updateGameArea();
            }else{
                balloons[i].update();
            }            
        }
    }else{
        initBalloons();
    }
}

function isClickIntersecting(point, circle) {

    dx = Math.abs(circle.centerX - point.x);
    dy = Math.abs(circle.centerY - point.y);
    R = circle.radius;

    distance = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
    return distance <= R;
}

function getRandomColor() {
    var colorIndex = Math.floor((Math.random() * balloonColorPallete.length));
    return balloonColorPallete[colorIndex];
}

window.requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 1000 / 60);
        };
})();