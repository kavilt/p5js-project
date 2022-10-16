
let controls = [68, 70, 74, 75]; // DF JK by default

let scrollSpeed = 16;
let game3Difficulty = 2; // 0 = easy, 3 = extreme
let lanes = [];
let numLanes = controls.length;
let laneWidth = 80;
let laneHeight = 600;
let laneStartY = 50;
let laneStartX = 700;

let recentHit = 0;
let timeSinceLastHit = 0;
let hits = [];
let combo = 0;

let leniency = 5; // how many frames can the user be off by, and still receive max?

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
  
  this.notes = [];
  this.x
}

lane.prototype.addNote = function() {
  this.notes.push(new note());
}

lane.prototype.drawLane = function() {
  // Outline of lane
  noGlow();
  stroke(0, 0, 0);
  fill(color(0, 0, 70, 50));
  rect(this.x, this.y, laneWidth, laneHeight);

  stroke(0, 0, 30);
  line(this.x, this.y + this.height - laneWidth, this.x + laneWidth, this.y + this.height - laneWidth);
  stroke(0,0,0);

  // draw individual notes in lane
  this.drawNotes();

  // flash lane red if missed
  noGlow();
  fill(0, 100, 100, this.missAnimation);
  rect(this.x, this.y, laneWidth, laneHeight);
  this.missAnimation -= 8;
}

lane.prototype.update = function() {
  // update the notes
  for (let i = 0; i < this.notes.length; i ++) {
      this.notes[i].update();
  }

  // test whether the user hit the note

  // on keyboard:

  // if the key corresponding to the lane was pressed:
  if (typed[controls[this.ind]]) {
    buttonClickSound.stop();
    buttonClickSound.play(); 
    if (this.notes.length > 0) {
      if (this.notes[0].timeToPF > -leniency*3) {
        combo ++;
        timeSinceLastHit = 0;
        // calculate hit judgement
        if (Math.abs(this.notes[0].timeToPF) < leniency) {
          hits.push(300); // perfect!
          recentHit = 300;
        }
        else if (Math.abs(this.notes[0].timeToPF) < leniency*2) {
          hits.push(200); // okay
          recentHit = 200;
        }
        else if (Math.abs(this.notes[0].timeToPF) < leniency*2.5) {
          hits.push(100); // bad :(
            recentHit = 100;
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
    let tempLane = round(random(0.7, 2.2));
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