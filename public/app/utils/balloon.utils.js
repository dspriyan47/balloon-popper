var BalloonUtils = {};

BalloonUtils.getYCenter = function(){
    let yCenter = CANVAS_HEIGHT + BALLOON_RADIUS + 15 + Math.floor(Math.random() * Math.floor(BALLOON_Y_CENTER_THRESHOLD));
    console.log("y center is: ", yCenter);
    // return 250;
    return yCenter;
}

BalloonUtils.getXCenter = function(){
    let xCenter = (Math.random() * Math.floor(BALLOON_X_CENTER_PARTS)) * (BALLOON_RADIUS*2);
    if(xCenter < BALLOON_RADIUS){
        xCenter = BALLOON_RADIUS;
    }else if(xCenter > (CANVAS_WIDTH - BALLOON_RADIUS)){
        xCenter = CANVAS_WIDTH - (BALLOON_RADIUS + 10);
    }
    console.log("x center is: ", xCenter);
    // return 200;
    return xCenter;
}