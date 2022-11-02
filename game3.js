
let controls = [68, 70, 74, 75]; // DF JK by default

let scrollSpeed = 20 * scalarH;
let game3Difficulty = 2; // 0 = easy, 3 = extreme
let lanes = [];
let numLanes = controls.length;
let laneWidth = 100 * scalarW;
let laneHeight = 650 * scalarH;
let laneStartY = 20 * scalarH;
let laneStartX = 700 * scalarW;

let recentHit = 0;
let timeSinceLastHit = 0;
let hits = [];
let combo = 0;
let songOver = false;

let leniency = 4.5; // how many frames can the user be off by, and still receive max?

let songOffset = 0; // start the song at x beats

let songSkipTo = 0;

let gen;

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

lane.prototype.addNote = function (time) {
    this.notes.push(new note(0, time));
}

lane.prototype.drawLane = function () {
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
    stroke(0, 0, 0);

    // draw individual notes in lane
    this.drawNotes();
    fill(0, 0, 0); // idk, but note highlights breaks without this

    // flash lane red if missed
    noGlow();
    gradient(color(0, 100, 100, this.missAnimation), color(0, 100, 100, 0), this.x + laneWidth / 2, this.y + laneHeight, this.x + laneWidth / 2, this.y);
    rect(this.x, this.y, laneWidth, laneHeight);
    noGradient();
    this.missAnimation -= 5;
    this.hitAnimation -= 4;
    this.hitColorEnd = [...this.hitColor]; // make a copy without same reference
    this.hitColorEnd[3] = 0;
    this.hitColor[3] = this.hitAnimation;

    // small glow when keys are pressed
    gradient(color(this.hitColor), color(this.hitColorEnd), this.x + laneWidth / 2, this.y + laneHeight, this.x + laneWidth / 2, this.y + laneHeight - laneHeight / 2 - this.hitAnimation);
    rect(this.x, this.y, laneWidth, laneHeight);
    noGradient();
}

lane.prototype.update = function () {
    // update the notes
    for (let i = 0; i < this.notes.length; i++) {
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
            if (Math.abs(this.notes[0].timeToPF) < leniency * 3) {
                combo++;
                timeSinceLastHit = 0;
                // calculate hit judgement (and set hit color)
                if (Math.abs(this.notes[0].timeToPF) < leniency) {
                    hits.push(300); // perfect!
                    recentHit = 300;
                    this.hitColor = [200, 100, 100, 100];
                }
                else if (Math.abs(this.notes[0].timeToPF) < leniency * 2) {
                    hits.push(200); // okay
                    recentHit = 200;
                    this.hitColor = [60, 100, 100, 100];
                }
                else if (Math.abs(this.notes[0].timeToPF) < leniency * 2.5) {
                    hits.push(100); // bad :(
                    recentHit = 100;
                    this.hitColor = [270, 100, 100, 100];
                }

                this.notes.splice(0, 1); //remove the note!
            } else if (Math.abs(this.notes[0].timeToPF < leniency * 3)) { // if the input is wayyyy too early, just ignore it
                this.notes.splice(0, 1);
                this.missAnimation = 50;
                combo = 0;
                hits.push(0); // miss :(
            }
        }
    }
}

lane.prototype.drawNotes = function () {
    glow(color(90, 90, 80), 32);
    if (this.ind >= 2) {
        glow(color(230, 90, 80), 32);
    }

    for (let i = 0; i < this.notes.length; i++) {
        let opacity = laneHeight - this.notes[i].position + 60;
        opacity = constrain(opacity, 0, 100);
        opacity *= constrain(this.notes[i].position / 120, 0, 1);
        fill(color(90, 90, 80, opacity));
        if (this.ind >= 2) {
            fill(290, 70, 70, opacity);
        }
        noStroke();
        circle(this.x + laneWidth / 2, this.notes[i].position + this.y, laneWidth / 2);
        text(this.notes[i].beatTime, this.x + 30, this.notes[i].position + this.y - 70);
        if (!this.notes[i].alive) { // notes scrolled off the screen, weren't hit
            combo = 0;
            this.missAnimation = 50;
            hits.push(0);
            this.notes.splice(i, 1);
        }
    }
}

function note(duration, beatTime) {
    this.type = 0; // 0 = note, 1 = long note
    this.duration = duration; // duration measured in beats (1 = quarter, 0.5 = sixteenth, etc)
    this.held = false; // for long notes only
    this.position = 0;
    this.endPosition = 0;
    this.alive = true;
    this.timeToPF = 0; // amount of frames that need to pass in order for the note hit to be "perfect"

    this.beatTime = beatTime;

    if (this.duration != undefined) {
        this.type = 1;
    }

    this.update = function () {

        this.endPosition =

            this.position += scrollSpeed;
        if (this.timeToPF < -leniency * 3) {
            this.alive = false;
        }

        this.timeToPF = -(this.position - (laneHeight - laneWidth / 2)) / scrollSpeed;
    }
}


// create lanes[]
for (let i = 0; i < numLanes; i++) {
    lanes.push(new lane(laneStartX + laneWidth * i, laneStartY, laneHeight, i));
}

function drawLanes() {
    for (let i = 0; i < lanes.length; i++) {
        lanes[i].update();
        lanes[i].drawLane();
    }
}


// song generation tools
// https://imgur.com/gallery/lCmvuS0 for explanation


/** available modes:
 * singleStream
 * lightJumpStream
 * denseJumpStream
 * rollLeft
 * rollRight
 * rest (do nothing)
 * 
 * available independent modes: (execute only once)
 * single (1arg)
 * jump (2arg)
 * hand (3arg)
 * quad (0arg)
 */

const modes = ['singleStream', 'lightJumpStream', 'denseJumpStream', 'rollLeft', 'rollRight', 'rest']; // none require args
const commands = ['setBpm', 'setBeat', 'setLane']
let generator = function (bpm, offset, file) {
    this.bpm = bpm;
    this.offset = offset; //  in beats
    this.scn = new Scanner(file);
    this.lane = 0;
    this.difficulty = game3Difficulty;
    this.rate = 0.25;
    this.beat = 0;
    this.totalBeats = 0;

    this.history = [[0], [0], [0], [0], [0]];

    this.mode = 'rest';
    this.args = [];
    this.previousMode = this.mode;

    this.scnLines = this.scn.output;
    this.prevLine = "";

    this.currentLine = 0;

    // check text file for current action + time of next action
    this.scnLine = this.getLine().split(" ");
    this.mode = this.scnLine[1];
    const found = modes.includes(this.mode); // does the mode not require arguments? if so, rate is the next number
    if (found) {
        this.rate = parseFloat(this.scnLine[2], 10);
        if (this.mode == 'rest') { this.rate = 0.25; }
    } else {
        for (let i = 2; i < this.scnLine.length; i++) {
            this.args[i - 2] = this.scnLine[i];
        }
        this.rate = 0.25;
    }
    this.prevLine = this.scnLine;
    this.scnLine = this.getLine().split(" ");

    this.update = function () {
        fill(0, 0, 100);
        textSize(50);
        text(this.totalBeats, 200, h / 2);

        timeSinceNewSong = millis() - time; // song started
        if (timeSinceNewSong > timeOfNextBeat) { // beat elapsed

            // scan text file, determine what action to take
            // this.scnLine[0] refers to the number in the textfile (the beat count)
            if (this.totalBeats >= parseFloat(this.scnLine[0]) && !songOver) {
                this.scan();

                // while nextLine is a command: 
                // read the command, execute it

                // if line is a mode, execute it
                // else: line is a single instance, execute it
            }

            this.totalBeats += this.rate;

            // generate notes based on mode
            switch (this.mode) {
                case 'singleStream':
                    this.singleStream();
                    break;
                case 'lightJumpStream':
                    this.lightJumpStream();
                    break;
                case 'denseJumpStream':
                    this.denseJumpStream();
                    break;
                case 'rollLeft':
                    this.roll();
                    break;
                case 'rollRight':
                    this.roll(true);
                    break;
                case 'rest':
                    break;
                case 'single':
                    this.single(this.args[0]);
                    break;
                case 'jump':
                    this.jump(this.args[0], this.args[1]);
                    break;
                case 'hand':
                    this.jump(this.args[0], this.args[1], this.args[2]);
                    break;
                case 'quad':
                    this.quad();
            }

            this.pruneHistory();

            msPerBeat = 60 * 1000 / this.bpm * this.rate;
            timeOfNextBeat += msPerBeat;
        }
    }
}
generator.prototype.getLine = function () { // also returns the 
    if (this.currentLine < this.scnLines.length - 1) {
        this.currentLine++;
        return this.scnLines[this.currentLine - 1];
    }
    else {
        songOver = true;
        console.log(this.totalBeats + ", song over");
        return "0 0";
    }
}

generator.prototype.scan = function () { // scan lines of text file (read until a mode is found)
    let nextLine = this.scnLine[1];

    while (commands.includes(nextLine)) { // the line is a command

        for (let i = 2; i < this.scnLine.length; i++) { // find arguments after command
            this.args[i - 2] = this.scnLine[i];
        }
        switch (nextLine) { // execute the command
            case 'setBpm':
                this.bpm = parseFloat(this.args[0]);
                break;
            case 'setBeat':
                this.beat = parseInt(this.args[0]);
                break;
            case 'setLane':
                this.line = parseInt(this.args[0]);
                break;
        }

        this.scnLine = this.getLine().split(" ");
        nextLine = this.scnLine[1];
    }

    // loop is exited, next line is no longer a command
    // check if next line is a mode or a single instance
    // console.log(nextLine);
    const found = modes.includes(nextLine);
    if (found) { // is mode, update accordingly
        this.rate = parseFloat(this.scnLine[2], 10);
        this.mode = nextLine;
        if (this.mode == 'rest') { this.rate = 0.25; }
    }

    else { // is a single instance, read args first
        this.mode = nextLine;
        for (let i = 2; i < this.scnLine.length; i++) {
            this.args[i - 2] = this.scnLine[i];
        }
        this.rate = 0.25;
    }

    this.scnLine = this.getLine().split(" "); // prepare for next line
    // console.log(this.scnLine[1]);

}
generator.prototype.setMode = function (mode, rate) {
    this.previousMode = this.mode;
    this.mode = mode;
    this.rate = rate;
}

generator.prototype.setRate = function (rate) {
    this.rate = rate;
}

generator.prototype.args = function (argsList) {
    this.args = argsList;
}

generator.prototype.singleStream = function () { // difficulty doesn't matter, only rate
    switch (this.lane) {
        case 0:
            this.lane = 1;
            break;
        case 1:
            this.lane = random(0, 1) > 0.4 ? 2 : 3;
            if (this.history[1].includes(2) && !this.history[0].includes(0)) { // do not repeat notes in jump
                this.lane = random(0, 1) > 0.7 ? 0 : this.lane;
            }
            break;
        case 2:
            this.lane = random(0, 1) > 0.4 ? 1 : 0;
            if (this.history[1].includes(1) && !this.history[0].includes(3)) { // notes in jump
                this.lane = random(0, 1) > 0.7 ? 3 : this.lane;
            }
            break;
        case 3:
            this.lane = 2;
            break;
    }
    makeNote(this.lane);
    this.history.splice(0, 0, [this.lane]);
}

generator.prototype.lightJumpStream = function (offset) { // jumps every 4 notes
    if (offset != undefined) { this.beat = offset; }
    let r = random(0, 1);
    switch (this.lane) {
        case 0:
            if (this.beat != 0) {
                this.singleStream();
            } else {
                if (r > 0.5) { //  either do lanes 3,4 or lanes 2,4
                    makeNote(2);
                    makeNote(3);
                    this.history.splice(0, 0, [2, 3]);
                    this.lane = 2;
                } else {
                    makeNote(1);
                    makeNote(3);
                    this.history.splice(0, 0, [1, 3]);
                    this.lane = 3;
                }
            }
            break;
        case 1:
            if (this.beat != 0) {
                this.singleStream();
            } else {
                if (r > 0.5) { // either do lanes 3,4 or lanes 1,4
                    makeNote(2);
                    makeNote(3);
                    this.history.splice(0, 0, [2, 3]);
                    this.lane = 2;
                } else {
                    makeNote(0);
                    makeNote(3);
                    this.history.splice(0, 0, [0, 3]);
                    this.lane = 3;
                }
            }
            break;
        case 2:
            if (this.beat != 0) {
                this.singleStream();
            } else {
                if (r > 0.5) { // either do lanes 1,2 or lanes 1,4
                    makeNote(0);
                    makeNote(1);
                    this.history.splice(0, 0, [0, 1]);
                    this.lane = 1;
                } else {
                    makeNote(0);
                    makeNote(3);
                    this.history.splice(0, 0, [0, 3]);
                    this.lane = 0;
                }
            }
            break;
        case 3:
            if (this.beat != 0) {
                this.singleStream();
            } else {
                if (r > 0.5) { //  either do lanes 1,2 or lanes 1,3
                    makeNote(0);
                    makeNote(1);
                    this.history.splice(0, 0, [0, 1]);
                    this.lane = 1;
                } else {
                    makeNote(0);
                    makeNote(2);
                    this.history.splice(0, 0, [0, 2]);
                    this.lane = 0;
                }
            }
            break;
    }

    this.beat++;
    if (this.beat > 3) {
        this.beat = 0;
    }
}

generator.prototype.denseJumpStream = function (offset) {
    if (offset != undefined) { this.beat = offset; }
    this.lightJumpStream();
    if (this.beat > 1) {
        this.beat = 0;
    }
}

generator.prototype.roll = function (direction) { // true = right, false = left
    makeNote(this.lane);
    this.history.splice(0, 0, [this.lane]);
    if (direction) { //right
        this.lane++;
        if (this.lane > 3) {
            this.lane = 0;
        }
    } else {
        this.lane--;
        if (this.lane < 0) {
            this.lane = 3;
        }
    }
}

generator.prototype.single = function (lane) {
    makeNote(lane);
    this.history.splice(0, 0, [lane1]);
    this.mode = this.previousMode; // only want one note!
}

generator.prototype.jump = function (lane1, lane2) {
    makeNote(lane1);
    makeNote(lane2);
    this.history.splice(0, 0, [lane1, lane2]);
    this.mode = this.previousMode; // only want one jump!
}

generator.prototype.hand = function (lane1, lane2, lane3) {
    makeNote(lane1);
    makeNote(lane2);
    makeNote(lane3);
    this.history.splice(0, 0, [lane1, lane2, lane3]);
    this.mode = this.previousMode; // only want one hand!
}

generator.prototype.quad = function () {
    makeNote(0);
    makeNote(1);
    makeNote(2);
    makeNote(3);
    this.history.splice(0, 0, [0, 1, 2, 3]);
    this.mode = this.previousMode;
}

generator.prototype.pruneHistory = function () {
    this.history.splice(4, 1); // remove the 5th item in the array
}

generator.prototype.skipTo = function (line) {
    // assume that line corresponds to a line in the map text file

    // jump lines in text until find the first that corresponds with param
    // spam scan calls until this.scnLine[0] == line
    while (this.scnLine[0] != line) {
        this.scan();
    }

    this.scan();

    console.log("test" + this.mode);
    // process all commands, stop when this.scnLine > line
    
    // find total beats 
    time = millis();
    msPerBeat = 60 * 1000 / this.bpm;
    timeSinceNewSong = millis() - line*msPerBeat;
    this.totalBeats = line;

    // convert beats into seconds
    return this.totalBeats/this.bpm*60;

}

function makeNote(laneNum) {
    lanes[laneNum].addNote(gen.totalBeats);
}




let startCountdown = 0
let started = false;
let init = false;
let item;
let skip = 0;
function drawGame3() { // piano tiles game,  pages 5-5.9
    if (!init) {
        init = true;
        initGame3();
    }

    if (songSkipTo != 0) {
        skip = gen.skipTo(songSkipTo);
        console.log(gen.mode);
        item.song.seek(skip);
        songSkipTo = 0;
    }

    startCountdown++;
    if (!started && laneHeight / scrollSpeed < startCountdown) {
        item.song.stop();
        item.song.seek(skip);
        item.song.volume(musicVolume);
        item.song.play();
        started = true;
    }

    drawLanes();

    // do the note spawning
    if (!songOver) {
        gen.update();
    }

    // text stats
    textSize(80);
    fill(0, 0, 100, 50);
    noStroke();
    text(combo, laneStartX + (numLanes / 2) * laneWidth, 200);

    textAlign(RIGHT);
    //text(round(calculateAccuracy()*100, 2), 1210, 80);
    textAlign(CENTER);

    fill(0, 0, 100, 70 - timeSinceLastHit * 5);
    //text(recentHit, laneStartX + (numLanes/2) * laneWidth, 300);

    backButton.drawBack();
    if (backButton.clicked) {
        myPageChanger.change(5.1);
        item.song.stop();
    }

    timeSinceLastHit++;
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
    timeOfNextBeat = (1000 * 60 / item.bpm) - (item.preview * 1000) % (1000 * 60 / item.bpm);
    item.song.seek(item.preview);
    item.song.fade(0, musicVolume, 600);
    item.song.play();
}

let flashAlpha = 0;
let startGame3button = new button(w * 0.82, h * 0.85, 200 * scalarW, 100, 10, 10);
function drawGame3SongSelect() {
    timeSinceNewSong = millis() - time;
    msPerBeat = 60 * 1000 / myScrollList.scrollElements[myScrollList.selected].bpm;
    fill(0, 0, 100, flashAlpha / 4);
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
    rect(775 * scalarW, 0, 505 * scalarW, h);
    //noGlow();

    // big image preview on very right
    glow(color(0, 0, 0, 30), 50);
    let previewImage = myScrollList.scrollElements[myScrollList.selected].imgLarge;
    image(previewImage, 775 * scalarW, 100 * scalarH);
    // lines above and below
    stroke(0, 0, 40);
    strokeWeight(3);
    line(775 * scalarW, 100 * scalarH, w, 100 * scalarH);
    line(775 * scalarW, 100 * scalarH + previewImage.height, w, 100 * scalarH + previewImage.height);
    noGlow();

    myScrollList.draw();

    // top bar above scroll menu
    noStroke();
    fill(230, 15, 80, 100);
    glow(color(0, 0, 0, 20), 52);
    rect(175 * scalarW, 0, 600 + 1000 * scalarW, 99 * scalarH);
    noGlow();

    // song select sideways text
    push();
    textFont("Consolas");
    textSize(120);
    fill(0, 0, 100);
    translate(w * 0.075, h * 0.6);
    rotate(-90);
    text("song", -50, -10);
    fill(170, 20, 100);
    textSize(80);
    text("select", 220, 0);
    pop();

    // big white separator between left and scrollList
    strokeWeight(10);
    stroke(0, 0, 100);
    line(175 * scalarW, 0, 175 * scalarW, h);

    // bottom white bar
    noStroke();
    fill(0, 0, 100);
    rect(175 * scalarW, h * 0.93, w, h * 0.07);

    // start button
    startGame3button.buttonWithText("START", 32);
    if (startGame3button.clicked) {
        init = false;
        myPageChanger.change(5);
        myScrollList.stopPreview();
    }
}

function calculateAccuracy() {
    let sum = 0;
    if (hits.length == 0) {
        return 1;
    }
    for (let i = 0; i < hits.length; i++) {
        sum += hits[i];
    }
    return sum / (300 * hits.length);
}

function initGame3() {
    hits = [];
    combo = 0;
    for (let i = 0; i < lanes.length; i++) {
        lanes[i].notes = [];
    }
    time = millis();
    timeSinceNewSong = 0;
    timeOfNextBeat = 0;
    startCountdown = 0;
    started = false;
    item = myScrollList.scrollElements[myScrollList.selected];
    gen = new generator(item.bpm, 0, item.file);
}



