
// Declare Variables
let page = 1; // 0 = menu, 1 = game select, 2 = view scores, >2 = games
let keys = [];
let typed = [];
let clicked = false;
let scalarW = (w/1280);
let scalarH = (h/720);

// Declare sound variables
let buttonClickSound;
let buttonHoverSound;

// Declare image files
let title;
let heart;

// Preload sound and image files

function preload() {
  buttonClickSound = new Howl({src: "assets/menuclick.ogg"});
  buttonHoverSound = new Howl({src: "assets/button hover.ogg"})

  title = loadImage('assets/placeholder.png');
  heart = loadImage('assets/heart.png');

}

function setup() {
  createCanvas(constrain(windowWidth, 0, 1920), constrain(windowHeight, 0, 1080));
  colorMode(HSB, 360, 100, 100, 100);
  textAlign(CENTER, CENTER);
  angleMode(DEGREES);
}


function pageChanger() { // handles the transitions between pages (fade to black, then fade in again)
  this.alpha = 0;
  this.decreasing = true;
  this.targetPage = null;
  this.transitionPercent = 0; // value between 0-1, 0=start of transition, 1=peak of transition (black)
  this.transitionPercentExponential = 0;

  this.update = function() { // update alpha values
    this.transitionPercent = map(constrain(this.alpha, 0, 100), 0, 100, 1, 0);
    this.transitionPercentExponential = Math.pow(this.transitionPercent, 2);
    if (this.decreasing) {
      this.alpha -= 4;
      if (this.alpha < 0) {
        this.decreasing = false;
        if (this.targetPage != null) {page = this.targetPage; }
      }
    } else {
      this.alpha += 6;
    }
  }

  this.draw = function() { // draw transition overlay over screen
    noStroke();
    noGlow();
    fill(0, 0, 0, 100-this.alpha);
    rect(0, 0, width, height);
  }

  this.change = function(targetPage) { // cue a transition
    this.alpha = 100;
    this.decreasing = true;
    this.targetPage = targetPage;
  }
}
var myPageChanger = new pageChanger();

// buttons can have images inside them
function button(x, y, width, height, thickness, roundness=0, solid=false) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.border = thickness; 
  this.roundness = roundness;
  this.solid = solid;
  this.clr;

  this.heldDown = false;
  this.clicked = false;
  this.expansion = 1;
  this.mouseInTime = 0;

  this.update = function() {
    this.clicked = false;
    if (mouseX > this.x && mouseX < this.x + this.width && mouseY > this.y && mouseY < this.y + this.height) {
      if (this.mouseInTime == 0) { // play hover sound
        buttonHoverSound.rate(1);
        buttonHoverSound.volume(0.1);
        buttonHoverSound.play();
      }
      this.mouseInTime ++;
      cursor(HAND);
      this.expansion += (1.1-this.expansion)/6; // grow to 1.1x size
      if (mouseIsPressed) {
        if (!this.heldDown) { // the user JUST clicked the button down
          buttonClickSound.rate(0.8);
          buttonClickSound.play();
        }
        this.heldDown = true;
        this.expansion = 1.05;
      }else{ this.heldDown = false; }
      if (clicked) {
        this.clicked = true; // the user clicked and released the button
        buttonClickSound.rate(1);
        buttonClickSound.play();
      }
    } else {
      if (this.mouseInTime > 0) { // the user just left the button
        buttonHoverSound.rate(0.85); // pitch it down a bit
        buttonHoverSound.volume(0.02);
        buttonHoverSound.play();
      }
      this.expansion += (1-this.expansion)/6; // quickly shrink to 1x size
      this.mouseInTime = 0;
    }
  }
}

button.prototype.drawBorder = function(){ // all buttons inherit this border
  if(this.clr == undefined) {this.clr = color(207, 7, 100);}
  this.update();
  translate(this.x + this.width/2, this.y + this.height/2);
  scale(this.expansion);
  rotate((this.expansion-1)*7)
  glow(color(this.clr), 35);
  strokeWeight(this.border);
  stroke(color(this.clr));
  if(this.solid) {
     fill(99 + (this.expansion-1)*70); // brighten when hovered over
  } else {
    noFill();
  }
  
  rect(-this.width/2, -this.height/2, this.width, this.height, this.roundness);
}

// Each button will have its custom function, because they all look different

// START button
button.prototype.buttonWithText = function(txt, txtSize) { 
  push();
  this.drawBorder();
  textSize(txtSize);
  textFont('Consolas');
  fill(360, 0, 100);
  noStroke();

  text(txt, 0, 0);
  pop();
}

// game select screen buttons
button.prototype.drawGame2 = function() {
  push();
  this.drawBorder();
  circle(0, 0, 40, 40);

  noStroke();
  glow(color(200, 100, 100), 32);
  fill(222, 82.6, 27.1); // slightly lighter blue
  rect(-this.width/2 + 20, this.height/2 - 44, 150, 60, 10);

  glow(color(0, 0, 100), 32);
  noFill();
  stroke(0, 0, 100);
  strokeWeight(5);
  rect(-this.width/2 + 20, this.height/2 - 44, 150, 60, 10);

  noStroke();
  fill(0, 0, 100);
  textSize(30);
  text("game 1",-this.width/2 + 95, this.height/2 - 16);

  pop();
}

// back button
button.prototype.drawBack = function() {
  push();
  this.update();
  translate(this.x + this.width/2, this.y + this.height/2);
  scale(this.expansion);
  glow(color(207, 7, 99), 35);
  fill(0, 0, 100);
  noStroke();
  textSize(40);
  text("back", 0, 0);

  pop();
}



// main menu (page = 0)
let startButton = new button(w/2-(140*scalarW), 320*scalarH, 280*scalarW, 100*scalarW, 8, 10);
let scoresButton = new button(w/2-(140*scalarW), 520*scalarH, 280*scalarW, 100*scalarW, 8, 10);
let backButton = new button(30, h-30-60, 150, 60, 10, 10);
function drawMenu() {
  startButton.buttonWithText("start", 60*scalarH);
  scoresButton.buttonWithText("view scores", 40*scalarH);
  drawImage(title, width/2, (140*scalarH) - myPageChanger.transitionPercentExponential*5, 1+myPageChanger.transitionPercentExponential/50);
  if (startButton.clicked) {
    myPageChanger.change(1); // go to game select screen
  }
  else if (scoresButton.clicked) {
    myPageChanger.change(2); // view high scores
  }
}

let game1Button;
let game2Button;
let game3Button;
// selection screen (page = 1)
let selectScale = 300*(w/1280); // scale button sizes
if (scalarH > 0.6) {
  game1Button = new button(w/2-selectScale-(230*(w/1280)), 230*scalarH, selectScale, selectScale, 10*scalarW, 10);
  game2Button = new button(w/2-selectScale/2, 280*scalarH, selectScale, selectScale, 10*scalarW, 10);
  game3Button = new button(w/2+(230*(w/1280)), (330*scalarH), selectScale, selectScale, 10*scalarW, 10);
}
else{
  game1Button = new button(w/2-selectScale-(230*(w/1280)), 90*scalarH, selectScale, selectScale, 10*scalarW, 10);
  game2Button = new button(w/2-selectScale/2, 190*scalarH, selectScale, selectScale, 10*scalarW, 10);
  game3Button = new button(w/2+(230*(w/1280)), (290*scalarH), selectScale, selectScale, 10*scalarW, 10);
}
function drawSelect() {
  // circles
  
    if(scalarH > 0.6) {
      glow(color(40, 40, 100), 32);
      fill(0, 0, 100);
      textSize((120*scalarH) - myPageChanger.transitionPercentExponential*3);
      text("game", w/2, (100*scalarH) + myPageChanger.transitionPercentExponential*3);
      textSize((70*scalarH) - myPageChanger.transitionPercentExponential*2);
      text("select", w/2, (190*scalarH) + myPageChanger.transitionPercentExponential*5);
    } else {
      glow(color(40, 40, 100), 32);
      fill(0, 0, 100);
      textSize((120*scalarH) - myPageChanger.transitionPercentExponential*3);
      text("game", w*0.78, (100*scalarH) + myPageChanger.transitionPercentExponential*3);
      textSize((70*scalarH) - myPageChanger.transitionPercentExponential*2);
      text("select", w*0.81, (190*scalarH) + myPageChanger.transitionPercentExponential*5);
    }

  game1Button.drawGame2();
  game2Button.drawGame2();
  game3Button.drawGame2();

  backButton.drawBack();
  if (backButton.clicked) {
    myPageChanger.change(0);
  }
  else if (game1Button.clicked) {
    myPageChanger.change(3);
  }
  else if (game2Button.clicked) {
    myPageChanger.change(4.1);
  }
  else if (game3Button.clicked) {
    myPageChanger.change(5);
  }

}



// scores (page = 2)

function drawScores() {
  backButton.drawBack();
  if(backButton.clicked) {
    myPageChanger.change(0);
  }
}

// game 2 variables



// background

function drawBackground() {
  background(222, 82.6, 27.1);
  fill(222, 80, 24);
  triangle(0, 1000*scalarW + myPageChanger.transitionPercentExponential * 50, w, h, w, 20*scalarH - myPageChanger.transitionPercentExponential*50); // small triangle to spice up background
}

function glow(color, blurriness) {
  drawingContext.shadowBlur = blurriness;
  drawingContext.shadowColor = color;
}
function noGlow() {
  drawingContext.shadowBlur = 0;
  drawingContext.shadowColor = null;
}

let oldFillStyle;
let oldStrokeStyle;
function gradient(color1, color2, x1, y1, x2, y2) {
  let grad =  drawingContext.createLinearGradient(x1, y1, x2, y2);
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
function noBlur() {
  drawingContext.filter = 'blur(0px)';
}

function drawImage(img, x, y, percentSizeX, percentSizeY) { // same as image(), but center the image at x, y, and size is from 0-1
  push();
  translate(x, y);
  if (arguments.length == 4) {
    scale(percentSizeX);
  }
  else if (arguments.length == 5) {
    scale(percentSizeX, percentSizeY);
  }
  image(img, -img.width/2, -img.height/2);

  pop();
}

function camera() {
  this.x = 0;
  this.y = 0;
  this.vx = 0;
  this.vy = 0;
  this.returnSpeed = 1.3;
  this.timeSinceShake = 100;
}

camera.prototype.draw = function() {
  fill(0, 0, 100, 40 - (this.timeSinceShake * 5));
  rect(-100, -100, w+200, h+200);
  translate(this.x, this.y);

  this.x += this.vx + random(-1, 1) * abs(this.vx)/2;
  this.y += this.vy + random(-1, 1) * abs(this.vy)/2;

  this.vx /= this.returnSpeed;
  this.vy /= this.returnSpeed;

  this.x /= this.returnSpeed;
  this.y /= this.returnSpeed;

  this.timeSinceShake ++;

}

camera.prototype.shake = function(vx, vy) {
  this.vx = vx;
  this.vy = vy;
  this.timeSinceShake = 0;
}

myCam = new camera();

function mouseClicked() {
  clicked = true; // true only for one frame when the user releases the mouse
}

function touchEnded() { // for mobile
  clicked = true;
}

function keyPressed() {
  keys[keyCode] = true;
  typed[keyCode] = true;
}

function keyReleased() {
  keys[keyCode] = false;
}