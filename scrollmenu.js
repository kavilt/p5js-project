let time = 0;

function scrollList(x, y, w, h, thickness) {
  this.x = x;
  this.y = y;
  this.w = w;
  this.h = h;
  this.offset = 5; // grow the margins of the scrollList by this amount, so glow effects will bleed out onto main canvas
  this.thickness = thickness; // height of each element in the list
  this.scrollElement = function(name, artist, bpm, duration, song, prev, img, imgLarge, file) {
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
    this.file = file;
    this.highScore = 0;
    this.bestAcc = 0;
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

scrollList.prototype.addItem = function(name, artist, bpm, duration, song, preview, img, largeImg, file) {
  this.scrollElements.push(new this.scrollElement(name, artist, bpm, duration, song, preview, img, largeImg, file));
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
            time = millis();
            timeOfNextBeat = (1000*60 / item.bpm) - (item.preview * 1000) % (1000 * 60 / item.bpm);
            item.song.seek(item.preview);
            item.song.fade(0, musicVolume, 600);
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
      time = millis();
      timeOfNextBeat = (1000*60 / this.scrollElements[this.selected].bpm) - (this.scrollElements[this.selected].preview * 1000) % (1000 * 60 / this.scrollElements[this.selected].bpm);
      this.scrollElements[this.selected-1].song.stop();
      this.scrollElements[this.selected].song.seek(this.scrollElements[this.selected].preview);
      this.scrollElements[this.selected].song.fade(0, musicVolume, 600);
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
      time = millis();
      timeOfNextBeat = (1000*60 / this.scrollElements[this.selected].bpm) - (this.scrollElements[this.selected].preview * 1000) % (1000 * 60 / this.scrollElements[this.selected].bpm);
      buttonClickSound.play();
      animationPercent = 0;
      this.scrollElements[this.selected+1].song.stop();
      this.scrollElements[this.selected].song.seek(this.scrollElements[this.selected].preview);
      this.scrollElements[this.selected].song.fade(0, musicVolume, 600);
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
  this.scrollElements[this.playing].song.fade(musicVolume, 0, 1000);
  console.log("STOPPED");
}