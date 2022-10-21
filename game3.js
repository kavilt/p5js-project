
let controls = [68, 70, 74, 75]; // DF JK by default

let scrollSpeed = 18 * scalarH;
let game3Difficulty = 2; // 0 = easy, 3 = extreme
let lanes = [];
let numLanes = controls.length;
let laneWidth = 100 * scalarW;
let laneHeight = 650 * scalarH;
let laneStartY = 20 * scalarH;
let laneStartX = 700   * scalarW;

let recentHit = 0;
let timeSinceLastHit = 0;
let hits = [];
let combo = 0;

let leniency = 4.5; // how many frames can the user be off by, and still receive max?

function initGame3() {
  hits = [];
  combo = 0;
}

function lane(x, y, height, indx) { // each lane keeps track of notes
  this.x = x;
  this.y = y;
  this.height = height;
  this.ind = indx;
  this.missAnimation = 0;
  this.hitAnimation = 0;
  this.hitColor = [0, 0, 0, 0];
  
  this.notes = [];
  this.x
}

lane.prototype.addNote = function() {
  this.notes.push(new note());
}

lane.prototype.drawLane = function() {
  // Outline of lane
  noGlow();
  noStroke();
  fill(color(0, 0, 35, 50));
  rect(this.x, this.y, laneWidth, laneHeight);

  glow(color(0, 0, 0), 32);
  stroke(color(0, 0, 40));
  noFill();
  rect(this.x, this.y, laneWidth, laneHeight);

  noGlow();

  stroke(0, 0, 30);
  line(this.x, this.y + this.height - laneWidth, this.x + laneWidth, this.y + this.height - laneWidth);
  stroke(0,0,0);

  // draw individual notes in lane
  this.drawNotes();
  fill(0,0,0); // idk, but note highlights breaks without this

  // flash lane red if missed
  noGlow();
  gradient(color(0, 100, 100, this.missAnimation), color(0, 100, 100, 0), this.x + laneWidth/2, this.y + laneHeight, this.x + laneWidth/2, this.y);
  rect(this.x, this.y, laneWidth, laneHeight);
  noGradient();
  this.missAnimation -= 5;
  this.hitAnimation -= 4;
  this.hitColorEnd = [...this.hitColor]; // make a copy without same reference
  this.hitColorEnd[3] = 0;
  this.hitColor[3] = this.hitAnimation;
  
  // small glow when keys are pressed
  gradient(color(this.hitColor), color(this.hitColorEnd), this.x + laneWidth/2, this.y + laneHeight, this.x + laneWidth/2, this.y + laneHeight - laneHeight/2 - this.hitAnimation);
  rect(this.x, this.y, laneWidth, laneHeight);
  noGradient();
}

lane.prototype.update = function() {
  // update the notes
  for (let i = 0; i < this.notes.length; i ++) {
      this.notes[i].update();
  }

  // test whether the user hit the note

  // on keyboard:

  // if the key corresponding to the lane was pressed:
  if (typeTap[controls[this.ind]]) {
    this.hitColor = [0, 0, 100, 100]; // if the user hit literally nothing
    this.hitAnimation = 70;
    buttonClickSound.stop();
    buttonClickSound.play(); 
    if (this.notes.length > 0) {
      if (this.notes[0].timeToPF > -leniency*3) {
        combo ++;
        timeSinceLastHit = 0;
        // calculate hit judgement (and set hit color)
        if (Math.abs(this.notes[0].timeToPF) < leniency) {
          hits.push(300); // perfect!
          recentHit = 300;
          this.hitColor = [200, 100, 100, 100];
        }
        else if (Math.abs(this.notes[0].timeToPF) < leniency*2) {
          hits.push(200); // okay
          recentHit = 200;
          this.hitColor = [60, 100, 100, 100];
        }
        else if (Math.abs(this.notes[0].timeToPF) < leniency*2.5) {
          hits.push(100); // bad :(
            recentHit = 100;
            this.hitColor = [270, 100, 100, 100];
        }

        this.notes.splice(0, 1); //remove the note!
      } else if (this.notes[0].timeToPF < -leniency*3 && this.notes[0].timeToPF > -leniency*6) { // if its 100px too early, ignore
        this.notes.splice(0, 1);
        this.missAnimation = 50;
        combo = 0;
        hits.push(0); // miss :(
      }
    }
  }
}

lane.prototype.drawNotes = function() {
  glow(color(90, 90, 80), 32);

  for (let i = 0; i < this.notes.length; i ++) {
    if (1 == 1) {
      let opacity = laneHeight - this.notes[i].position + 60;
      opacity = constrain(opacity, 0, 100);
      opacity *= constrain(this.notes[i].position/120, 0, 1);
      fill(color(90, 90, 80, opacity));
      noStroke();
      circle(this.x + laneWidth/2, this.notes[i].position + this.y, laneWidth/3);
      if (!this.notes[i].alive) { // notes scrolled off the screen, weren't hit
        combo = 0;
        this.missAnimation = 50;
        hits.push(0);
        this.notes.splice(i, 1);
      }
    }
  }
}


function note() {
  this.position = 0;
  this.alive = true;
  this.timeToPF = 0; // amount of frames that need to pass in order for the note hit to be "perfect"

  this.update = function() {
    this.position += scrollSpeed;
    if(this.position > laneStartY + laneHeight + 50) {
      this.alive = false;
    }

    this.timeToPF = (this.position - (laneHeight - laneWidth/2)) / scrollSpeed;
    if (this.timeToPF == 0) {
      buttonHoverSound.stop();
      buttonHoverSound.play();
    }
  }
}


// create lanes[]
for (let i = 0; i < numLanes; i ++) {
  lanes.push(new lane(laneStartX + laneWidth * i, laneStartY, laneHeight, i));
}

function drawLanes() {
  for (let i = 0; i < lanes.length; i ++) {
    lanes[i].update();
    lanes[i].drawLane();
  }
}

function drawGame3() { // piano tiles game,  pages 5-5.9

  drawLanes();

  // spawn notes
  if (frameCount % 12 == 0) {
    let tempLane = round(random(1.5, 2.4));
    let laneSpawns = [];
    for (let i = 0; i < tempLane; i ++) {
      laneSpawns[round(random(0, numLanes-1))] = true;
    }
    for (let i = 0; i < laneSpawns.length; i ++) {
      if (laneSpawns[i]) {
        lanes[i].addNote();
      }
    }
  }

  // text stats
  textSize(80);
  fill(0, 0, 100, 50);
  noStroke();
  text(combo, laneStartX + (numLanes/2) * laneWidth, 200);
  
  textAlign(RIGHT);
  text(round(calculateAccuracy()*100, 2), 1210, 80);
  textAlign(CENTER);

  fill(0, 0, 100, 70-timeSinceLastHit*5);
  text(recentHit, laneStartX + (numLanes/2) * laneWidth, 300);

  backButton.drawBack();
  if(backButton.clicked) {
    myPageChanger.change(1);
  }

  timeSinceLastHit ++;
}



/** User can:
 * choose song using scroll list (right side)
 * choose from 4 different difficulties for each song (Left side)
 */

function initSongSelect() {
  myScrollList.jump();

  // start playing selected song

  let item = myScrollList.scrollElements[myScrollList.selected];
  time = millis();
  timeOfNextBeat = (1000*60 / item.bpm) - (item.preview * 1000) % (1000 * 60 / item.bpm);
  item.song.seek(item.preview);
  item.song.fade(0, musicVolume, 600);
  item.song.play();
}

let flashAlpha = 0;
function drawGame3SongSelect() {
  timeSinceNewSong = millis() - time;
  msPerBeat = 60 * 1000 / myScrollList.scrollElements[myScrollList.selected].bpm;
  fill(0, 0, 100, flashAlpha/4);
  rect(0, 0, w, h);
  //text(round(timeSinceNewSong)+"ms, " + round(timeOfNextBeat), 40, 20);
  // 
  if (timeSinceNewSong > timeOfNextBeat) {
    timeOfNextBeat += msPerBeat;
    flashAlpha = 30;
    buttonClickSound.volume(1);
    buttonClickSound.play();
  }

  flashAlpha -= 2;

  backButton.drawBack();
  if (backButton.clicked) {
    myPageChanger.change(1);
    myScrollList.stopPreview();
  }
  
  // big background behind preview image
  // glow(color(330, 30, 100), 32);
  //fill(330, 20, 100);
  fill(230, 15, 80, 100);
  rect(775*scalarW, 0, 505*scalarW, h);
  //noGlow();
  
  // big image preview on very right
  glow(color(0, 0, 0, 30), 50);
  let previewImage = myScrollList.scrollElements[myScrollList.selected].imgLarge;
  image(previewImage, 775*scalarW, 100*scalarH);
  // lines above and below
  stroke(0, 0, 40);
  strokeWeight(3);
  line(775*scalarW, 100*scalarH, w, 100*scalarH);
  line(775*scalarW, 100*scalarH + previewImage.height, w, 100*scalarH + previewImage.height);
  noGlow();
  
  myScrollList.draw();
  
  // top bar above scroll menu
  noStroke();
  fill(230, 15, 80, 100);
  glow(color(0, 0, 0, 20), 52);
  rect(175*scalarW, 0, 600+1000*scalarW, 99*scalarH);
  noGlow();

  // song select sideways text
  push();
  textFont("Consolas");
  textSize(120);
  fill(0, 0, 100);
  translate(w*0.075, h*0.6);
  rotate(-90);
  text("song", -50, -10);
  fill(170, 20, 100);
  textSize(80);
  text("select", 220, 0);
  pop();

  // big white separator between left and scrollList
  strokeWeight(10);
  stroke(0, 0, 100);
  line(175*scalarW, 0, 175*scalarW, h);

  // bottom white bar
  noStroke();
  fill(0, 0, 100);
  rect(175*scalarW, h*0.93, w, h*0.07);
}



function calculateAccuracy() {
  let sum = 0;
  if (hits.length == 0) {
    return 1;
  }
  for(let i = 0; i < hits.length; i ++) {
    sum += hits[i];
  }
  return sum / (300*hits.length);
}