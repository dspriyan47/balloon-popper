/**
 * @namespace Core namespace
 */
var CANVASBALLOON = {};

// Constants
CANVASBALLOON.KAPPA = (4 * (Math.sqrt(2) - 1)) / 3;
CANVASBALLOON.WIDTH_FACTOR = 0.0333;
CANVASBALLOON.HEIGHT_FACTOR = 0.4;
CANVASBALLOON.TIE_WIDTH_FACTOR = 0.12;
CANVASBALLOON.TIE_HEIGHT_FACTOR = 0.10;
CANVASBALLOON.TIE_CURVE_FACTOR = 0.13;
CANVASBALLOON.GRADIENT_FACTOR = 0.3;
CANVASBALLOON.GRADIENT_CIRCLE_RADIUS = 3;

/**
 * Creates a new Balloon
 * @class	Represents a balloon displayed on a HTML5 canvas
 * @param	{String}	canvasElementID		Unique ID of the canvas element displaying the balloon
 * @param	{Number}	centerX				X-coordinate of the balloon's center
 * @param	{Number}	centerY				Y-coordinate of the balloon's center
 * @param	{Number}	radius				Radius of the balloon
 * @param	{String}	color				String representing the balloon's base color
 */
CANVASBALLOON.Balloon = function (centerX, centerY, radius, color, index=ID_NOT_SET) {

    this.centerX = centerX;
    this.centerY = centerY;
    this.radius = radius;
    this.darkColor = color.dark;
    this.lightColor = color.light;
    this.dependentBalloonAdded = false;
    this.id = index;

    this.newPos = function (decreaseFactor) {
        this.centerY -= decreaseFactor;
    }
    this.update = function (canvasContext, hitCanvasContext=false) {
        ctx = canvasContext;
        this.draw(canvasContext);
        if(hitCanvasContext){
            this.draw(hitCanvasContext, true);
        }
    }
}

CANVASBALLOON.Balloon.prototype.drawCircle = function (canvasContext) {

var ctx = canvasContext;
ctx.fillStyle = "#3370d4"; //blue
ctx.beginPath();
ctx.arc(this.centerX, this.centerY, this.radius, 0, 2 * Math.PI);
ctx.closePath();
ctx.fill();
}

/**
 * Draws the balloon on the canvas
 */
CANVASBALLOON.Balloon.prototype.draw = function (canvasContext, drawingHitContext=false) {

    // Prepare constants

    var gfxContext = canvasContext;
    var centerX = this.centerX;
    var centerY = this.centerY;
    var radius = this.radius;

    var handleLength = CANVASBALLOON.KAPPA * radius;

    var widthDiff = (radius * CANVASBALLOON.WIDTH_FACTOR);
    var heightDiff = (radius * CANVASBALLOON.HEIGHT_FACTOR);

    var balloonBottomY = centerY + radius + heightDiff;
    this.yEnd = balloonBottomY;
    // Begin balloon path

    gfxContext.beginPath();

    // Top Left Curve

    var topLeftCurveStartX = centerX - radius;
    var topLeftCurveStartY = centerY;

    var topLeftCurveEndX = centerX;
    var topLeftCurveEndY = centerY - radius;

    gfxContext.moveTo(topLeftCurveStartX, topLeftCurveStartY);
    gfxContext.bezierCurveTo(topLeftCurveStartX, topLeftCurveStartY - handleLength - widthDiff,
        topLeftCurveEndX - handleLength, topLeftCurveEndY,
        topLeftCurveEndX, topLeftCurveEndY);

    // Top Right Curve

    var topRightCurveStartX = centerX;
    var topRightCurveStartY = centerY - radius;

    var topRightCurveEndX = centerX + radius;
    var topRightCurveEndY = centerY;

    gfxContext.bezierCurveTo(topRightCurveStartX + handleLength + widthDiff, topRightCurveStartY,
        topRightCurveEndX, topRightCurveEndY - handleLength,
        topRightCurveEndX, topRightCurveEndY);

    // Bottom Right Curve

    var bottomRightCurveStartX = centerX + radius;
    var bottomRightCurveStartY = centerY;

    var bottomRightCurveEndX = centerX;
    var bottomRightCurveEndY = balloonBottomY;

    gfxContext.bezierCurveTo(bottomRightCurveStartX, bottomRightCurveStartY + handleLength,
        bottomRightCurveEndX + handleLength, bottomRightCurveEndY,
        bottomRightCurveEndX, bottomRightCurveEndY);

    // Bottom Left Curve

    var bottomLeftCurveStartX = centerX;
    var bottomLeftCurveStartY = balloonBottomY;

    var bottomLeftCurveEndX = centerX - radius;
    var bottomLeftCurveEndY = centerY;

    gfxContext.bezierCurveTo(bottomLeftCurveStartX - handleLength, bottomLeftCurveStartY,
        bottomLeftCurveEndX, bottomLeftCurveEndY + handleLength,
        bottomLeftCurveEndX, bottomLeftCurveEndY);

    // Create balloon gradient

    if(!drawingHitContext){
        var gradientOffset = (radius / 3);

        var balloonGradient =
            gfxContext.createRadialGradient(centerX + gradientOffset, centerY - gradientOffset,
                CANVASBALLOON.GRADIENT_CIRCLE_RADIUS,
                centerX, centerY, radius + heightDiff);
        balloonGradient.addColorStop(0, this.lightColor); //lightColor
        balloonGradient.addColorStop(0.7, this.darkColor); //darkColor
        
        gfxContext.fillStyle = balloonGradient;
        gfxContext.fill();
        
        if(this.id != ID_NOT_SET){
            gfxContext.font = '25px Comic Sans MS';
            gfxContext.fillStyle = "red";
            gfxContext.fillText(this.id, this.centerX, this.centerY); 
        }
    }else{
        gfxContext.fillStyle = this.colorKey;
        gfxContext.fill();
    }

    // End balloon path

    // Create balloon tie

    var halfTieWidth = (radius * CANVASBALLOON.TIE_WIDTH_FACTOR) / 2;
    var tieHeight = (radius * CANVASBALLOON.TIE_HEIGHT_FACTOR);
    var tieCurveHeight = (radius * CANVASBALLOON.TIE_CURVE_FACTOR);

    gfxContext.beginPath();
    gfxContext.moveTo(centerX - 1, balloonBottomY);
    gfxContext.lineTo(centerX - halfTieWidth, balloonBottomY + tieHeight);
    gfxContext.quadraticCurveTo(centerX, balloonBottomY + tieCurveHeight,
        centerX + halfTieWidth, balloonBottomY + tieHeight);
    gfxContext.lineTo(centerX + 1, balloonBottomY);
    gfxContext.fill();
}