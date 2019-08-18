var balloons = [];
var balloonSpeedFactor = 1;
var tickRefreshThreshold = 15;
var timerTicks = 0;
var balloonId = 1;

var stop = false;
var frameCount = 0;
var $results = $("#results");
var fps, fpsInterval, startTime, now, then, elapsed;

function startGame() {
    initBalloons();
    initSounds();
    // score.init();
    // score.update(0);
    initTimer();
    gameArea.start();
}

function initSounds() {
    createjs.Sound.registerSound("sounds/burst.wav", "burst");
}

function initBalloons() {
    for (let i = 0; i < INITIAL_BALLOON_COUNT; i++) {
        gameArea.addNewBalloon();
    }
}

function initTimer() {
    var display = document.querySelector('#timer'),
        timer = new CountDownTimer(GAME_TIMER_IN_MINUTES),
        timeObj = CountDownTimer.parse(GAME_TIMER_IN_MINUTES);

    format(timeObj.minutes, timeObj.seconds);

    timer.onTick(format);

    timer.start();

    function format(minutes, seconds) {
        if (minutes + seconds == 0) {
            setTimeout(function () {
                gameArea.clear();
                gameArea.stop();
                clearParticles();
                alert("GAME OVER");
            }, 500);
        }
        timerTicks++;
        timerTicks = (timerTicks > tickRefreshThreshold) ? 1 : timerTicks;
        // console.log("TICKS: ",timerTicks);
        balloonSpeedFactor = (timerTicks == tickRefreshThreshold) ? balloonSpeedFactor + 0.5 : balloonSpeedFactor;
        // console.log("SPEED FACTOR: ",balloonSpeedFactor);
        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;
        display.textContent = `${minutes} : ${seconds}`;
    }
}

var gameArea = {
    canvas: document.createElement("canvas"),
    start: function () {
        this.canvas.setAttribute("id", "canvas");
        this.canvas.width = CANVAS_WIDTH;
        this.canvas.height = CANVAS_HEIGHT;
        this.context = this.canvas.getContext("2d");
        // init bg cloud
        // this.initGameBg();
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        // this.interval = setInterval(updateGameArea, 1000/60);
        this.startAnimatingBalloons(60);
        // draw();
        // init explode particle on click
        frame(this.context);

        this.canvas.addEventListener('touchend', (event) => {
            const pos = {
                x: event.changedTouches[0].pageX,
                y: event.changedTouches[0].pageY
            };

            balloons = balloons.filter((balloon) => {
                if (isClickIntersecting(pos, balloon)) {
                    window.navigator.vibrate(30); // vibrate for 200ms
                    // score.update(1);
                    const touchColor = balloon.darkColor;
                    createjs.Sound.play("burst");
                    // updateGameArea();
                    initParticles(SPREAD_PARTICLE_COUNT, pos.x, pos.y, touchColor);
                    return false;
                }
                return true;
            });

        }, false);
    },
    addNewBalloon: function () {
        let createdBalloon = new CANVASBALLOON.Balloon(BalloonUtils.getXCenter(), BalloonUtils.getYCenter(), BALLOON_RADIUS, getRandomColor(), balloonId);
        balloonId++;
        balloons.push(createdBalloon);
    },
    clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop: function () {
        clearInterval(this.interval);
    },
    initGameBg: function () {
        myclouds = new CloudProcessor(CLOUD_COUNT);
    },
    startAnimatingBalloons: function (fps) {
        fpsInterval = 1000 / fps;
        then = Date.now();
        startTime = then;
        console.log(startTime);
        this.animateBalloonScreen();
    },
    animateBalloonScreen: function () {
        if (stop) {
            return;
        }
        requestAnimationFrame(gameArea.animateBalloonScreen);
        now = Date.now();
        elapsed = now - then;
        if (elapsed > fpsInterval) {
            then = now - (elapsed % fpsInterval);
            gameArea.redrawGameArea();
        }
    },
    redrawGameArea: function () {
        gameArea.clear();
        if (balloons.length > 0) {
            for (var i = balloons.length - 1; i >= 0 && balloons.length > 0; i--) {
                balloons[i].newPos(balloonSpeedFactor);
                if (!balloons[i].dependentBalloonAdded && (balloons[i].centerY < (CANVAS_HEIGHT - ((BALLOON_RADIUS * 2) + 10)))) {
                    balloons[i].dependentBalloonAdded = true;
                    gameArea.addNewBalloon();
                }
    
                if (balloons[i].centerY <= -70) {
                    balloons.splice(i, 1);
                } else {
                    balloons[i].update(gameArea.context);
                }
            }
        } else {
            initBalloons();
        }
    }
}

function hasSameColor(color, shape) {
    return shape.color === color;
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