function setup() {
    createCanvas(400,400);
    colorMode(HSB, 360, 100, 100, 100);
}


function draw() {
    background(222, 82.6, 27);

    strokeWeight(20);
    drawingContext.shadowBlur = 32;
    drawingContext.shadowColor = color(207, 7, 99);
    noFill();
    stroke(207, 7, 99);
    rect(100,100,100,100);
}