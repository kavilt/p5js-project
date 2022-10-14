
// Declare Variables
var page = 0; // 0 = menu, 1 = game select, >2 = games

// Declare sound variables
var buttonClickSound;

// Preload sound files
function Preload() {
  
}

function setup() {
  createCanvas(1280, 720);
  colorMode(HSB, 360, 100, 100, 100);
}


var clicked = false;
function mouseClicked() {
  clicked = true; // true only for one frame when the user releases the mouse
}

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
}
button.prototype.update = function() { // Handles: growth on mouseover, click events
  this.heldDown = false;
  this.clicked = false;
  if (mouseX > this.x && mouseX < this.x + this.width && mouseY > this.y && mouseY < this.y + this.height) {
    cursor(HAND);
    this.expansion += (1.1-this.expansion)/6; // grow to 1.1x size
    if (mouseIsPressed) {
      this.heldDown = true;
      this.expansion = 1.05;
    }
    if (clicked) {
      this.clicked = true;
    }
  } else {
    this.expansion += (1-this.expansion)/6; // quickly shrink to 1x size
  }
}
button.prototype.drawBorder = function(){ // all buttons inherit this border
  this.update();
  translate(this.x + this.width/2, this.y + this.height/2);
  scale(this.expansion);
  drawingContext.shadowBlur = 32;
  drawingContext.shadowColor = color(207, 7, 99);
  strokeWeight(this.border);
  stroke(255, 7, 99);
  if(this.solid) {
     fill(99 + (this.expansion-1)*70); // brighten when hovered over
  } else {
    noFill();
  }
  
  rect(-this.width/2, -this.height/2, this.width, this.height, this.roundness);
}
button.prototype.drawGame1 = function() {
  this.drawBorder();
}

function pageChanger() { // handles the transitions between pages (fade to black, then fade in again)
  this.alpha = 255;
  this.decreasing = false;
  this.targetPage = 0;

  this.update = function() { // update alpha values
    if (this.decreasing) {
      this.changed = false;
      this.alpha -= 10;
      if (this.alpha < 0) {
        this.decreasing = false;
        page = this.targetPage;
        this.changed = true; // is true the moment the screen is pitch black
      }
    } else {
      this.alpha += 20;
    }
  }
}
pageChanger.prototype.draw = function() { // draw the actual transition
  noStroke();
  fill(0, 0, 0, 255-this.alpha);
  rect(0, 0, width, height);
}
pageChanger.prototype.change = function(targetPage) { // call this when the transition starts
  this.alpha = 255;
  this.decreasing = true;
  this.targetPage = targetPage;
}
var myPageChanger = new pageChanger();

/** Main Menu Elements
 * 3D Title Text
 * Torches
 * Dungeon Background
 * Main "start" button
 * */ 

let startButton = new button(800, 100, 200, 200, 10, 10);
function drawMenu() {
  startButton.drawGame1();
  if (startButton.clicked) {
    myPageChanger.change(1);
  }
}



function drawSelect() {

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