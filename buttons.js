// buttons can have images inside them
let count = 1;
function button(x, y, width, height, thickness, roundness=0, solid=false) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.border = thickness; 
    this.roundness = roundness;
    this.solid = solid;
  
    this.heldDown = false;
    this.clicked = false;
    this.expansion = 1;
    this.mouseInTime = 0;
  
    this.flicker = 0;
  
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
  
      this.flicker/=2;
      if (random(0, 1) > 0.8 && this.flicker < 1) {
        this.flicker = random(5, 10);
        if (random(0, 1) > 0.98) {
          this.flicker = random(50, 70);
        }
      }
    }
  }
  
  button.prototype.drawBorder = function(){ // all buttons inherit this border
    this.update();
    translate(this.x + this.width/2, this.y + this.height/2);
    scale(this.expansion);
    rotate((this.expansion-1)*7)
    glow(color(207, 7, 100, 100-this.flicker), 35);
    strokeWeight(this.border);
    stroke(207, 7, 100, 100-this.flicker);
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
  
  // game select screen buttons with image in the center
  button.prototype.drawGameButton = function(src, scl, txt) {
    push();
    this.drawBorder();
    drawImage(src, 0, 0, scl, scl);
  
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
    text(txt,-this.width/2 + 95, this.height/2 - 13);

  
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
  let backButton = new button(18*scalarW, h-30*scalarH-60, 150*scalarW, 60*scalarH, 10, 10);