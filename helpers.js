function pageChanger() { // handles the transitions between pages (fade to black, then fade in again)
    this.alpha = 0;
    this.decreasing = true;
    this.targetPage = null;
    this.transitionPercent = 0; // value between 0-1, 0=start of transition, 1=peak of transition (black)
    this.transitionPercentExponential = 0;
    this.callback = null;

    this.update = function () { // update alpha values
        this.transitionPercent = map(constrain(this.alpha, 0, 100), 0, 100, 1, 0);
        this.transitionPercentExponential = Math.pow(this.transitionPercent, 2);
        if (this.decreasing) {
            this.alpha -= 4;
            if (this.alpha < 0) {
                this.decreasing = false;
                if (this.targetPage != null) {
                    page = this.targetPage;
                    if (this.callback != null) {
                        this.callback();
                    }
                }
            }
        } else {
            this.alpha += 6;
        }
    }

    this.draw = function () { // draw transition overlay over screen
        noStroke();
        noGlow();
        fill(0, 0, 0, 100 - this.alpha);
        rect(0, 0, width, height);
    }
    this.change = function (targetPage, callback) { // cue a transition
        this.alpha = 100;
        this.decreasing = true;
        this.targetPage = targetPage;
        this.callback = callback;
    }
}
let myPageChanger = new pageChanger();

function Scanner(file) {
    this.line = 0;
    this.output = songFiles[file]; // load immediately upon initialization
}


function glow(color, blurriness, canv = null) {
    if (canv == null) {
        drawingContext.shadowBlur = blurriness;
        drawingContext.shadowColor = color;
    }
}
function noGlow() {
    drawingContext.shadowBlur = 0;
    drawingContext.shadowColor = null;
}

let oldFillStyle;
let oldStrokeStyle;
function gradient(color1, color2, x1, y1, x2, y2) {
    let grad = drawingContext.createLinearGradient(x1, y1, x2, y2);
    grad.addColorStop(0, color1);
    grad.addColorStop(1, color2);
    oldFillStyle = drawingContext.fillStyle;
    oldStrokeStyle = drawingContext.strokeStyle;
    drawingContext.fillStyle = grad;
    drawingContext.strokeStyle = grad;
}
function noGradient() {
    drawingContext.fillStyle = oldFillStyle;
    drawingContext.strokeStyle = oldStrokeStyle;
}
function blur(blurriness) {
    drawingContext.filter = 'blur(' + str(blurriness) + 'px)';
}
function noBlur(canv = null) {
    if (canv == null) {
        drawingContext.filter = 'blur(0px)';
    } else {
        canv.drawingContext.filter = 'blur(0px)';
    }
}

function drawImage(img, x, y, percentSizeX, percentSizeY) { // same as image(), but center the image at x, y, and size is from 0-1
    push();
    translate(x, y);
    if (arguments.length == 4) {
        scale(percentSizeX);
    }
    else if (arguments.length == 5 && percentSizeY) {
        scale(percentSizeX, percentSizeY);
    }

    image(img, -img.width / 2, -img.height / 2);

    pop();
}

// used in duck game
function camera() {
    this.x = 0;
    this.y = 0;
    this.vx = 0;
    this.vy = 0;
    this.returnSpeed = 1.3;
    this.timeSinceShake = 100;
    this.mode = 0; // 0 for white flash (gun recoil) and 1 for red (hp loss)
}

camera.prototype.draw = function () {
    if (this.mode == 0) {
        fill(0, 0, 100, 40 - (this.timeSinceShake * 5));
    } else {
        fill(0, 100, 100, 40 - (this.timeSinceShake * 5));
    }
    rect(-100, -100, w + 200, h + 200);
    translate(this.x, this.y);

    this.x += this.vx + random(-1, 1) * abs(this.vx) / 2;
    this.y += this.vy + random(-1, 1) * abs(this.vy) / 2;

    this.vx /= this.returnSpeed;
    this.vy /= this.returnSpeed;

    this.x /= this.returnSpeed;
    this.y /= this.returnSpeed;

    this.timeSinceShake++;

}

camera.prototype.shake = function (vx, vy) {
    this.vx = vx;
    this.vy = vy;
    this.timeSinceShake = 0;
}

myCam = new camera();