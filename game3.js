
let scrollSpeed = 16;
let game3Difficulty = 2; // 0 = easy, 3 = extreme
let lanes = [];
let numLanes = 4;
let laneWidth = 80;
let laneHeight = 600;
let laneStartY = 50;
let laneStartX = 300;

let controls = [68, 70, 74, 75]; // DF JK by default

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
  stroke(0, 0, 0);
  noGlow();
  fill(color(0, 0, 70, 50));
  rect(this.x, this.y, laneWidth, laneHeight);

  line(this.x, this.y + this.height - laneWidth, this.x + laneWidth, this.y + this.height - laneWidth);

  // draw individual notes in lane
  this.drawNotes();

  // flash lane red if missed
  fill(0, 100, 100, this.missAnimation);
  rect(this.x, this.y, laneWidth, laneHeight);
  this.missAnimation -= 10;
}

lane.prototype.update = function() {
  // update the notes
  for (let i = 0; i < this.notes.length; i ++) {
    if(this.notes[i] != null) {
      this.notes[i].update();
    }
  }

  // test whether the user hit the note

  // on keyboard:
  if (typed[controls[this.ind]]) { // if the key corresponding to the lane was pressed:
    this.notes.splice(0, 1);
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
      if (!this.notes[i].alive) {
        this.missAnimation = 70;
        this.notes.splice(i, 1);
      }
    }
  }
}


function note() {
  this.position = 0;
  this.alive = true;;

  this.update = function() {
    this.position += scrollSpeed;
    if(this.position > laneStartY + laneHeight + 50) {
      this.alive = false;
    }
  }
}


// create lanes[]
for (let i = 0; i < numLanes; i ++) {
  lanes.push(new lane(laneStartX + laneWidth * i, laneStartY, laneHeight, i));
}

function drawLanes() {
  for (let i = 0; i < lanes.length; i ++) {
    lanes[i].drawLane();
    lanes[i].update();
  }
}

function drawGame3() { // piano tiles game,  pages 5-5.9

  drawLanes();

  if (frameCount % 20 == 0) {
    let tempLane = round(random(2, 4));
    for (let i = 0; i < tempLane; i ++) {
      lanes[round(random(0, 3))].addNote();
    }
  }

  


backButton.drawBack();
if(backButton.clicked) {
  myPageChanger.change(1);
}
}