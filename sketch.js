
// Declare Variables
let page = 5.1; // 0 = menu, 1 = game select, 2 = view scores, >2 = games
let keys = [];
let typeTap = [];
let typed = [];
let clicked = false;
let scrolled = 0;
let scalarW = (w/1280);
let scalarH = (h/720);
let canvas2;
let myScrollList;

// Declare sound variables
let buttonClickSound;
let buttonHoverSound;
let songs = [];

// Declare image files
let title;
let heart;
let playButton;
let thumbnails = []; // game3 song covers
let previews = [];

// Preload sound and image files

function preload() {
  buttonClickSound = new Howl({src: "assets/menuclick.ogg"});
  buttonHoverSound = new Howl({src: "assets/button hover.ogg"})

  songs[0] = new Howl({src: "assets/songs/brain power.mp3", html5: true, volume: 0.5});
  songs[1] = new Howl({src: "assets/songs/meAndU.mp3", html5: true, volume: 0.5});

  title = loadImage('assets/placeholder.png');
  heart = loadImage('assets/heart.png');
  playButton = loadImage('assets/playbutton.png');

}

function setup() {
  createCanvas(constrain(w, 0, 1920), constrain(h, 0, 1080));
  colorMode(HSB, 360, 100, 100, 100);
  textAlign(CENTER, CENTER);
  angleMode(DEGREES);
  canvas2 = createGraphics(400, 400);
  myScrollList = new scrollList(175*scalarW, 90*scalarH, 600*scalarW, 575*scalarH, 130);
  canvas2.textAlign(CENTER, CENTER);
  addSongs();
  playButton.resize(45*scalarW, 0);


}

function addSongs() {
  thumbnails[0] = loadImage('assets/thumbnails/BRAIN POWER.png');
  thumbnails[1] = loadImage('assets/thumbnails/succducc.jpg', resizeThumbnails)
  previews[0] = loadImage('assets/thumbnails/BRAIN POWER.png');
  previews[1] = loadImage('assets/thumbnails/succducc.jpg', resizePreviews)
  for (let i = 0; i < 100; i ++) {
    if(3 < i < 4){
      myScrollList.addItem("me & u", "succducc", 160, 192, songs[1], 94, thumbnails[1], previews[1]); // BRAIN  POWERRRRR
    }
    myScrollList.addItem("Brain Power", "NOMA", 170, 110, songs[0], 70, thumbnails[0], previews[0]); // BRAIN  POWERRRRR
  }

  
  
}

function resizeThumbnails() {
  for (let i = 0; i < thumbnails.length; i ++) {
    thumbnails[i].resize(80*scalarW, 0);
  }
}

function resizePreviews() {
  for (let i = 0; i < previews.length; i ++) {
    previews[i].resize(505*scalarW, 0); // fill the remaining space on the right side of screen
  }
}

function pageChanger() { // handles the transitions between pages (fade to black, then fade in again)
  this.alpha = 0;
  this.decreasing = true;
  this.targetPage = null;
  this.transitionPercent = 0; // value between 0-1, 0=start of transition, 1=peak of transition (black)
  this.transitionPercentExponential = 0;
  this.callback = null;

  this.update = function() { // update alpha values
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

  this.draw = function() { // draw transition overlay over screen
    noStroke();
    noGlow();
    fill(0, 0, 0, 100-this.alpha);
    rect(0, 0, width, height);
  }

  this.change = function(targetPage, callback) { // cue a transition
    this.alpha = 100;
    this.decreasing = true;
    this.targetPage = targetPage;
    this.callback = callback;
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
let backButton = new button(18*scalarW, h-30*scalarH-60, 150*scalarW, 60*scalarH, 10, 10);
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
    myPageChanger.change(5.1, initSongSelect);
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

function glow(color, blurriness, canv=null) {
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
function noBlur(canv=null) {
  if (canv==null) {
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

function scrollList(x, y, w, h, thickness) {
  this.x = x;
  this.y = y;
  this.w = w;
  this.h = h;
  this.offset = 5; // grow the margins of the scrollList by this amount, so glow effects will bleed out onto main canvas
  this.thickness = thickness; // height of each element in the list
  this.scrollElement = function(name, artist, bpm, duration, song, prev, img, imgLarge) {
    this.name = name;
    this.artist = artist;
    this.bpm = bpm;
    this.duration = duration;
    this.song = song;
    this.img = img;
    this.imgLarge = imgLarge;
    this.height = thickness;
    this.targetHeight = this.height + 50;
    this.animationPercent = 0;
    this.preview = prev;
  }
  this.scrollElements = [];

  this.position = 50;
  this.v = 0; // scroll velocity
  this.selected = 0; // current item index which is selected
  this.snapping = false; // if true, scrolling from current position -> position of selected
  this.dragging = false;
  this.distMoved = 0;
  this.playing = 0;
  canvas2.resizeCanvas(this.w+this.offset*2, this.h+this.offset*2);
  canvas2.colorMode(HSB, 360, 100, 100, 100);
}

scrollList.prototype.addItem = function(name, artist, bpm, duration, song, preview, img, largeImg) {
  this.scrollElements.push(new this.scrollElement(name, artist, bpm, duration, song, preview, img, largeImg));
}

let animationPercent = 0;
let selectedPos = 0;

scrollList.prototype.draw = function() {
  canvas2.clear();

  canvas2.translate(this.offset, this.position + this.offset);

  // for i in songs, if scroll position is close to index, draw
  let pos = 0; // secondary counter that keeps track of actual position
  let mouseIsOver = null; // keep track of which list item the user is hovering over
  animationPercent += (1-animationPercent)/5;

  // draw buffer item before the 0th item
  canvas2.fill(260, 10, 70, 50);
  canvas2.noStroke();
  canvas2.rect(0, -200, this.w, 200);

  // where most of the drawing happens
  for (let i = 0; i < this.scrollElements.length; i ++) {
    let item = this.scrollElements[i];
    item.animationPercent = map(item.targetHeight - item.height, 0, 50, 1, 0);
    if (-this.position < pos + 200*scalarH && -this.position + this.h > pos - 200*scalarH) { // Item is on screen (or almost), so draw it

      // mouse over detection
      if (mouseX > this.x && mouseX < this.x + this.w && mouseY > this.y + pos + this.position && mouseY < this.y + pos + item.height + this.position) {
        mouseIsOver = i;
        if (clicked && !this.dragging) { // if the user is scrolling by dragging, releasing mouse shouldnt select item
          if (this.selected != mouseIsOver) {
            frameCount = 0;
            animationPercent = 0;
            this.scrollElements[this.selected].song.stop();
            this.selected = mouseIsOver;
            item.song.seek(item.preview);
            item.song.fade(0, 0.5, 600);
            item.song.play();
            this.playing = i;
            // is the selected item outside of the scroll panel? If so, change update position so it appears again
  
            if(this.checkVisible() != 0) {this.jump(); }
  
            buttonClickSound.play();
          }
        }
      }
      
      canvas2.fill(260, 10, 70, 50);
      canvas2.stroke(0, 0, 20, 50);
      if (this.selected == i) { // if the song is selected, it grows slightly taller
        // grow the element up!
        item.height += (item.targetHeight - item.height)/7;
        canvas2.rect(0, pos, this.w, item.height);
        selectedPos = pos;
        
      } else { // song isnt selected (normal list item)
        item.height += (this.thickness - item.height) / 5;
        canvas2.noStroke();
        canvas2.strokeWeight(2);
        canvas2.rect(0, pos, this.w, item.height);
        
        // draw divider between songs
        canvas2.stroke(270, 7, 55);
        canvas2.line(20, pos, this.w-20, pos);
      }
      
      // draw the UI elements on each tile
      // the left circle 
      canvas2.noStroke();
      canvas2.fill(273, 50, 30);
      canvas2.circle(20 * scalarW + item.height/4.5, pos + item.height/2, 40 + item.height/10);
      
      // and the number inside it
      canvas2.textFont("monospace");
      canvas2.textSize(35*scalarW);
      
      canvas2.drawingContext.shadowBlur=32;
      canvas2.drawingContext.shadowColor=color(170, 100, 85);
      canvas2.fill(170, 100, 85);
      canvas2.text(i+1, 20 * scalarW + item.height/4.5, pos + item.height/2+2); // 20*scalarW + item.height/4.5
      canvas2.drawingContext.shadowColor = null;
      canvas2.drawingContext.shadowBlur = 0;
      
      // place the image to the right
      canvas2.push();
      canvas2.resetMatrix();
      canvas2.translate(item.height/2 + 70*scalarW + this.offset, this.position+this.offset + pos + item.height/2);
      canvas2.scale(0.9 + 0.3*item.animationPercent + item.animationPercent * 0.03 * sin(frameCount*3));
      // draw small shadow under object
      canvas2.drawingContext.shadowBlur = 20 + 30*item.animationPercent;
      canvas2.drawingContext.shadowColor=color(0, 0, 0, 40 + 20*item.animationPercent);
      canvas2.noStroke();
      canvas2.rect(-item.img.width/2+2, -item.img.height/2+2, item.img.width-4, item.img.height-4);
      canvas2.drawingContext.shadowBlur = 0;
      canvas2.drawingContext.shadowColor=null;
      
      canvas2.image(item.img, -item.img.width/2, -item.img.height/2);
      canvas2.pop();
      
      // draw playing icon if selected
      if (this.selected == i) {
        canvas2.fill(0, 0, 100);
        canvas2.noStroke();
        canvas2.drawingContext.shadowBlur = 40;
        canvas2.drawingContext.shadowColor=color(0, 0, 100, 100);
        canvas2.tint(100, animationPercent*100);
        canvas2.image(playButton, item.height/2 - thumbnails[0].width/2 + 70*scalarW + 17.5*scalarW, pos - playButton.height/2 + item.height/2);
        canvas2.drawingContext.shadowBlur = 0;
        canvas2.drawingContext.shadowColor=null; 
        canvas2.tint(100, 100);
      }

      // Song title
      canvas2.drawingContext.shadowBlur = 40;
      canvas2.drawingContext.shadowColor=color(0, 0, 0, 60);
      canvas2.fill(0, 0, 80 + item.animationPercent*30);
      //canvas2.textSize(35 + (this.selected == i ? 15*animationPercent : 0));
      canvas2.textSize(35 + item.animationPercent*15);
      //console.log(item.animationPercent);
      canvas2.textAlign(LEFT, CENTER);
      canvas2.text(item.name, item.height/2 + 130*scalarW, pos + item.height/2 - item.height*0.1*item.animationPercent);
      
      // artist / song information, only if selected
      if (this.selected == i) {
        canvas2.fill(0, 0, 90, 90*item.animationPercent)
        //canvas2.textSize(30 * item.animationPercent);
        canvas2.textSize(30);
        canvas2.text("by " + item.artist + "   bpm: " + item.bpm, item.height/2 + 130*scalarW, pos + item.height/2 + item.height*0.12*item.animationPercent);
      }
      canvas2.drawingContext.shadowBlur = 0;
      canvas2.drawingContext.shadowColor=null; 
      canvas2.textAlign(CENTER, CENTER);

    }
    pos += item.height;
  }

  // draw buffer item before the last item
  canvas2.fill(260, 10, 70, 50);
  canvas2.stroke(270, 7, 55);
  canvas2.line(20, pos, this.w-20, pos);
  canvas2.noStroke();
  canvas2.rect(0, pos, this.w, 200);

  // small glow aura around selected
  canvas2.noFill();
  canvas2.drawingContext.shadowColor = color(0, 0, 100);
  canvas2.drawingContext.shadowBlur = 32;
  canvas2.strokeWeight(5*scalarW);
  canvas2.stroke(0, 0, 100, 80);
  canvas2.rect(0, selectedPos + 2, this.w, this.scrollElements[this.selected].height-4, 10); 

  canvas2.drawingContext.shadowColor = null;
  canvas2.drawingContext.shadowBlur = 0;

  if (typeTap[40]) {
    this.selected += 1;
    this.selected = constrain(this.selected, 0, this.scrollElements.length-1);
    if (this.playing != this.selected) {
      if (this.checkVisible() != 0) { this.jump(); }
      frameCount = 0;
      buttonClickSound.play();
      animationPercent = 0;
      this.scrollElements[this.selected-1].song.stop();
      this.scrollElements[this.selected].song.seek(this.scrollElements[this.selected].preview);
      this.scrollElements[this.selected].song.fade(0, 0.5, 600);
      this.scrollElements[this.selected].song.play();
      this.playing = this.selected;
    }
  }

  if (typeTap[38]) {
    this.selected -= 1;
    this.selected = constrain(this.selected, 0, this.scrollElements.length-1);
    if (this.playing != this.selected) {
      if (this.checkVisible() != 0) { this.jump(); }
      frameCount = 0;
      buttonClickSound.play();
      animationPercent = 0;
      this.scrollElements[this.selected+1].song.stop();
      this.scrollElements[this.selected].song.seek(this.scrollElements[this.selected].preview);
      this.scrollElements[this.selected].song.fade(0, 0.5, 600);
      this.scrollElements[this.selected].song.play();
      this.playing = this.selected;
    }
  }

  //constrain scroll position
  this.position = constrain(this.position, -pos + this.h - 20*scalarH, 20*scalarH);

  // update list scroll position
  // user is dragging
  if (mouseIsPressed && mouseX > this.x && mouseX < this.x+this.w && mouseY > this.y && mouseY < this.y+this.h) {
    this.position -= (pmouseY - mouseY);
    this.distMoved -= (pmouseY - mouseY);
    if (Math.abs(this.distMoved) > 5) { // if more than 5 pixels of scroll, user is dragging and not "clicking"
      this.dragging = true;
    }
    this.v = -(pmouseY - mouseY);
  } else { // let velocity carry the scroll
    this.position += this.v;
    this.v /= 1.3;
    this.dragging = false;
    this.distMoved = 0;
  }

  // scroll wheel handling
  let sign = Math.sign(scrolled);
  this.v -= Math.pow((Math.abs(scrolled)),0.7) * sign;

  if (this.snapping) {
    let snapDistance = this.checkVisible();
    if (Math.abs(snapDistance) > 500) {
      this.v = (-this.position - this.thickness/2 - this.selected*this.thickness + this.h/2) / 20;
    }
    else if (snapDistance > 0) {
      this.v += 5;
    }
    else {
      this.v += -5;
    }
    if (this.checkVisible() == 0) { this.snapping = false;} 
  }

  canvas2.resetMatrix();

  image(canvas2, this.x-this.offset, this.y-this.offset);
}

scrollList.prototype.checkVisible = function() { // false if selected item is currently outside of list window
  if (this.selected*this.thickness > -this.position  && this.selected*this.thickness < -this.position + this.h - this.thickness) {
    return 0; // fully visible
  }
  else{  // not visible
    return -this.position - this.thickness/2 - this.selected*this.thickness + this.h/2
  }
}

scrollList.prototype.jump = function() {
  this.snapping = true;
}

scrollList.prototype.stopPreview = function() {
  this.scrollElements[this.playing].song.fade(0.5, 0, 1000);
  console.log("STOPPED");
}

function mouseClicked() {
  clicked = true; // true only for one frame when the user releases the mouse
}

function mouseWheel(event) {
  scrolled = event.delta;
}

function touchEnded() { // for mobile
  clicked = true;
}

function keyPressed() {
  keys[keyCode] = true;
  typeTap[keyCode] = true;
}

function keyReleased() {
  keys[keyCode] = false;
}