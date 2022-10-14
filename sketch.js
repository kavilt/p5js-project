
// Declare Variables
let page = 0; // 0 = menu, 1 = game select, >2 = games

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
}


let clicked = false;


function pageChanger() { // handles the transitions between pages (fade to black, then fade in again)
  this.alpha = 100;
  this.decreasing = false;
  this.targetPage = 0;

  this.update = function() { // update alpha values
    if (this.decreasing) {
      this.alpha -= 6;
      if (this.alpha < 0) {
        this.decreasing = false;
        page = this.targetPage;
      }
    } else {
      this.alpha += 7;
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
  this.border = thickness; // border thickness. If zero, fill it in solid
  this.roundness = roundness;
  this.solid = solid;
  this.sound;

  this.heldDown = false;
  this.clicked = false;
  this.expansion = 1;
  this.mouseInTime = 0;

  this.update = function() {
    this.heldDown = false;
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
        this.heldDown = true;
        this.expansion = 1.05;
      }
      if (clicked) {
        this.clicked = true;
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
button.prototype.drawMenuStart = function() { 
  this.drawBorder();
  textSize(60);
  textFont('Consolas');
  fill(360, 0, 100);
  noStroke();

  text("start", 0, 0);
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

let startButton = new button(500, 350, 280, 100, 10, 10);
function drawMenu() {
  startButton.drawMenuStart();
  drawImage(title, width/2, 140);
  if (startButton.clicked) {
    myPageChanger.change(1);
  }
}

let game1Button = new button(640-530, 230, 150*2, 150*2, 10, 10);
let game2Button = new button(640-150, 280, 150*2, 150*2, 10, 10);
let game3Button = new button(640+230, 330, 150*2, 150*2, 10, 10);
let backButton = new button(30, 720-30-60, 150, 60, 10, 10);
function drawSelect() {
  game1Button.drawGame2();
  game2Button.drawGame2();
  game3Button.drawGame2();

  backButton.drawBack();
  if (backButton.clicked) {
    myPageChanger.change(0);
  }

  glow(color(0, 30, 100), 32)

  textSize(120);
  text("game", 640, 100);
  textSize(70);
  text("select", 640, 190);
}


function draw() {
  background(222, 82.6, 27.1);
  cursor(ARROW);

  switch (page) {
    case 0:
      drawMenu();
      break;
    case 1:
      drawSelect();
  }

  resetMatrix();
  myPageChanger.update();
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
  if (arguments.length == 3) {
    image(img, x - img.width/2, y - img.height/2);
  }
  else {
    image(img, x - img.width/2, y - img.height/2, img.width/percentSizeX, img.height/percentSizeY);
  }
}

function mouseClicked() {
  clicked = true; // true only for one frame when the user releases the mouse
}