
// Declare Variables
let page = 0; // 0 = menu, 1 = game select, 2 = view scores, >2 = games

// Declare sound variables
let buttonClickSound;
let buttonHoverSound;

// Declare image files
let title;

// Preload sound and image files
function preload() {
  buttonClickSound = loadSound("assets/menuclick.ogg")
  buttonHoverSound = loadSound("assets/button hover.ogg");

  title = loadImage('assets/placeholder.png');
}

function setup() {
  createCanvas(1280, 720);
  colorMode(HSB, 360, 100, 100, 100);
  textAlign(CENTER, CENTER);
  angleMode(DEGREES);
}


let clicked = false;


function pageChanger() { // handles the transitions between pages (fade to black, then fade in again)
  this.alpha = 0;
  this.decreasing = true;
  this.targetPage = 0;
  this.transitionPercent = 0; // value between 0-1, 0=start of transition, 1=peak of transition (black)
  this.transitionPercentExponential = 0;

  this.update = function() { // update alpha values
    this.transitionPercent = map(constrain(this.alpha, 0, 100), 0, 100, 1, 0);
    this.transitionPercentExponential = Math.pow(this.transitionPercent, 2);
    print(this.transitionPercent);
    if (this.decreasing) {
      this.alpha -= 4;
      if (this.alpha < 0) {
        this.decreasing = false;
        page = this.targetPage;
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
  this.sound;

  this.heldDown = false;
  this.clicked = false;
  this.expansion = 1;
  this.mouseInTime = 0;

  this.update = function() {
    this.clicked = false;
    if (mouseX > this.x && mouseX < this.x + this.width && mouseY > this.y && mouseY < this.y + this.height) {
      if (this.mouseInTime == 0) {
        buttonHoverSound.stop();
        buttonHoverSound.rate(1);
        buttonHoverSound.setVolume(0.1);
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
        this.clicked = true;
        buttonClickSound.stop();
        buttonClickSound.rate(1);
        buttonClickSound.play();
      }
    } else {
      if (this.mouseInTime > 0) { // the user just left the button
        buttonHoverSound.stop();
        buttonHoverSound.rate(0.85); // pitch it down a bit
        buttonHoverSound.setVolume(0.02);
        buttonHoverSound.play();
      }
      this.expansion += (1-this.expansion)/6; // quickly shrink to 1x size
      this.mouseInTime = 0;
    }
  }
}
button.prototype.drawBorder = function(){ // all buttons inherit this border
  this.update();
  translate(this.x + this.width/2, this.y + this.height/2);
  scale(this.expansion);
  rotate((this.expansion-1)*7)
  glow(color(207, 7, 99), 35);
  strokeWeight(this.border);
  stroke(255, 7, 99);
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
  this.drawBorder();
  textSize(txtSize);
  textFont('Consolas');
  fill(360, 0, 100);
  noStroke();

  text(txt, 0, 0);
  resetMatrix();
}

// game select screen buttons
button.prototype.drawGame2 = function() {
  this.drawBorder();
  circle(0, 0, 40, 40);

  resetMatrix();
}

// back button
button.prototype.drawBack = function() {
  this.update();
  translate(this.x + this.width/2, this.y + this.height/2);
  scale(this.expansion);
  glow(color(207, 7, 99), 35);
  fill(0, 0, 100);
  noStroke();
  textSize(40);
  text("back", 0, 0);

  resetMatrix();
}

let startButton = new button(500, 350, 280, 100, 8, 10);
let scoresButton = new button(500, 520, 280, 100, 8, 10);
let backButton = new button(30, 720-30-60, 150, 60, 10, 10);
function drawMenu() {
  startButton.buttonWithText("start", 60);
  scoresButton.buttonWithText("view scores", 40);
  drawImage(title, width/2, 140 - myPageChanger.transitionPercentExponential*5, 1+myPageChanger.transitionPercentExponential/50);
  if (startButton.clicked) {
    myPageChanger.change(1); // go to game select screen
  }
  else if (scoresButton.clicked) {
    myPageChanger.change(2); // view high scores
  }
}

let game1Button = new button(640-530, 230, 150*2, 150*2, 10, 10);
let game2Button = new button(640-150, 280, 150*2, 150*2, 10, 10);
let game3Button = new button(640+230, 330, 150*2, 150*2, 10, 10);
function drawSelect() {
  game1Button.drawGame2();
  game2Button.drawGame2();
  game3Button.drawGame2();

  backButton.drawBack();
  if (backButton.clicked) {
    myPageChanger.change(0);
  }

  glow(color(20, 40, 100), 32)

  textSize(120 + myPageChanger.transitionPercentExponential*8);
  text("game", 640, 100 - myPageChanger.transitionPercentExponential*8);
  textSize(70 + myPageChanger.transitionPercentExponential*5);
  text("select", 640, 190 - myPageChanger.transitionPercentExponential*5);
}

function drawScores() {
  backButton.drawBack();
  if(backButton.clicked) {
    myPageChanger.change(0);
  }
}

function draw() {
  cursor(ARROW);

  background(222, 82.6, 27.1);
  fill(222, 80, 24);
  triangle(0, 1000 + myPageChanger.transitionPercentExponential * 50, 1280, 720, 1280, 20 - myPageChanger.transitionPercentExponential*50); // small triangle to spice up background

  switch (page) {
    case 0:
      drawMenu();
      break;
    case 1:
      drawSelect();
      break;
    case 2:
      drawScores();
  }

  resetMatrix();
  myPageChanger.update(); // handles page transitions
  myPageChanger.draw();
  clicked = false;
}



function glow(color, blurriness) {
  drawingContext.shadowBlur = blurriness;
  drawingContext.shadowColor = color;
}
function noGlow() {
  drawingContext.shadowBlur = 0;
  drawingContext.shadowColor = null;
}

function drawImage(img, x, y, percentSizeX, percentSizeY) { // same as image(), but center the image at x, y, and size is from 0-1
  translate(x, y);
  if (arguments.length == 4) {
    scale(percentSizeX);
  }
  else if (arguments.length == 5) {
    scale(percentSizeX, percentSizeY);
  }
  image(img, -img.width/2, -img.height/2);

  resetMatrix();
}

function mouseClicked() {
  clicked = true; // true only for one frame when the user releases the mouse
}