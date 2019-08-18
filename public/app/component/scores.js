var score = {
    canvas: document.createElement("canvas"),
    init: function() {
        this.canvas.setAttribute("id", "scoreCanvas");
        this.canvas.width = 200;
        this.canvas.height = 60;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.score = 0; 
    },
    update: function(score=0) {
        this.clear();
        this.score = this.score + score;
        this.context.shadowOffsetX = 3;
        this.context.shadowOffsetY = 2;
        this.context.shadowBlur = 2;
        this.context.shadowColor = "rgba(0, 0, 0, 0.5)";

        this.context.font = '25px Comic Sans MS';
        this.context.fillStyle = "red";
        this.context.fillText(this.score, 60, 40); 

        let balloonIcon = new CANVASBALLOON.Balloon(30, 25, 20, { light: "#F4E2D8", dark: "#BA5370" });
        balloonIcon.update(this.context);
    },
    clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}