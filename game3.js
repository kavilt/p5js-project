
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
let maxCombo = 0;
let songOver = false;
let game3Score = 0;
let game3HighScores = [];
let totalNotes = 0;
let finalTotalNotes = 0;
let maxScore;
// score calculation: maxScore = totalNotes * totalComboMultiplier -> scale to 1 million

let leniency = 3; // how many frames can the user be off by, and still receive max?

let songOffset = -1; // offset in frames, where negative means hitting later is better

let songSkipTo = 0; //160

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

    noStroke();
    fill(color(0, 0, 35, 50));
    rect(this.x, this.y, laneWidth, laneHeight);

    glow(color(0, 0, 0), 32);
    stroke(color(0, 0, 40));
    noFill();
    rect(this.x, this.y, laneWidth, laneHeight);
    
    noGlow();

    stroke(0, 0, 50);
    strokeWeight(5);
    line(this.x, this.y + this.height - laneWidth, this.x + laneWidth, this.y + this.height - laneWidth);

    // circle to indicate when to press keys
    strokeWeight(2);
    stroke(0, 0, 100, 50);
    circle(this.x + laneWidth/2, this.y + this.height - laneWidth/2, laneWidth*0.75);

    // text the correct letter inside the circle
    fill(0, 0, 100);
    textSize(30 * scalarW);
    text(String.fromCharCode(controls[this.ind]), this.x + laneWidth/2, this.y + this.height - laneWidth/2);

    strokeWeight(7);
    
    // draw individual notes in lane
    stroke(0, 0, 0);
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
            if (Math.abs(this.notes[0].timeToPF - songOffset) < leniency * 3) {
                combo ++;
                if (combo > maxCombo) {
                    maxCombo = combo;
                }

                timeSinceLastHit = 0;
                // calculate hit judgement (and set hit color)
                if (Math.abs(this.notes[0].timeToPF - songOffset) < leniency) {
                    hits.push(300); // perfect!
                    recentHit = 300;
                    this.hitColor = [200, 100, 100, 100];
                }
                else if (Math.abs(this.notes[0].timeToPF - songOffset) < leniency * 2) {
                    hits.push(200); // okay
                    recentHit = 200;
                    this.hitColor = [60, 100, 100, 100];
                }
                else if (Math.abs(this.notes[0].timeToPF - songOffset) < leniency * 2.5) {
                    hits.push(100); // bad :(
                    recentHit = 100;
                    this.hitColor = [270, 100, 100, 100];
                }

                this.notes.splice(0, 1); //remove the note!
            } else if (Math.abs(this.notes[0].timeToPF - songOffset ) < leniency * 4) { // if the input is wayyyy too early, just ignore it
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
        //this.notes[i].beatTime, this.x + 30, this.notes[i].position + this.y - 70);
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
const commands = ['setBpm', 'setBeat', 'setLane', 'end'];
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

        timeSinceNewSong = millis() - time; // song started
        if (timeSinceNewSong > timeOfNextBeat) { // beat elapsed
            if(this.totalBeats % 1 == 0) {
                flashAlpha = 10;
            }
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

            this.genNotes();

            msPerBeat = 60 * 1000 / this.bpm * this.rate;
            timeOfNextBeat += msPerBeat;
        }
    }

    this.genNotes = function() {
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
                this.hand(this.args[0], this.args[1], this.args[2]);
                break;
            case 'quad':
                this.quad();
        }

        this.pruneHistory();
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
            case 'end':
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
    totalNotes ++;
}

let flashAlpha = 0;

let startCountdown = 0
let started = false;
let init = false;
let item;
let skip = 0;
let tutorialCountdown = 500;
let ended = false;
let endCountdown = 0;
function drawGame3() { // piano tiles game,  pages 5-5.9

    fill(0, 0, 100, flashAlpha / 4);
    rect(0, 0, w, h);
    flashAlpha -= 2;

    drawLanes();

    if (tutorialCountdown > 0) {
        tutorialCountdown -= 3;

        let a = 500 -(500 - tutorialCountdown); // alpha

        fill(0, 0, 0, a);
        rect(0, 0, width, height);

        noStroke();
        fill(0, 0, 100, a);

        glow(color(0, 0, 100), 32);

        textSize((60*scalarW) + myPageChanger.transitionPercentExponential*2.5);
        text("press", width/2 - myPageChanger.transitionPercentExponential * 11, 100*scalarH);
        text("in time with the beat!", width/2 - myPageChanger.transitionPercentExponential * 6, 300*scalarH);

        textSize((80*scalarW) + myPageChanger.transitionPercentExponential*2.5);
        text("D, F, J, K", width/2 - myPageChanger.transitionPercentExponential * 11, 200*scalarH);

        noFill();
        stroke(0, 0, 100, a);
        strokeWeight(10);
        rect(300*scalarW, 500*scalarH, width-600*scalarW, 30*scalarH, 50);
        
        noStroke();
        fill(0, 0, 100);
        rect(300*scalarW, 500*scalarH, map(tutorialCountdown, 500, 0, 0, width-600*scalarW), 30*scalarH, 50);
        noGlow();
    }

    else if (!init) {
        init = true;
        maxScore = calculateTotalScore();
        finalTotalNotes = totalNotes;
        initGame3();
    }

    if (songSkipTo != 0) {
        skip = gen.skipTo(songSkipTo);
        console.log(gen.mode);
        item.song.seek(skip);
        songSkipTo = 0;
    }

    startCountdown++;
    if (!started && laneHeight / scrollSpeed < startCountdown && init) {
        item.song.stop();
        item.song.seek(skip);
        item.song.volume(musicVolume);
        item.song.play();
        started = true;
    }


    // do the note spawning
    if (!songOver && init) {
        gen.update();
    }

    // text stats

    if (init) {
        textSize(100*scalarW);
        fill(0, 0, 100);
        noStroke();
        text("SCORE", 300*scalarW, 200*scalarH);
        
        fill(0, 0, 100, 80);
        textSize(80*scalarW);
        text("accuracy", 300*scalarW, 400*scalarH);

        fill(0, 0, 100, 60);
        textSize(50*scalarW);
        text("max combo", 300*scalarW, 550*scalarH);

        textSize(80*scalarW);
        fill(0, 0, 100, 50);
        text(combo, laneStartX + (numLanes / 2) * laneWidth, 200);
        text(round(calculateScore(maxScore)), 300 * scalarW, 300 * scalarH);
        textSize(60*scalarW);
        text(round(calculateAccuracy()*100, 2) + "%", 300*scalarW, 480 * scalarH);
        textSize(40*scalarW);
        text(maxCombo, 300*scalarW, 600*scalarH);
        
        fill(0, 0, 100, 70 - timeSinceLastHit * 5);
    
    }

    if (init && songOver) { // song has ended!
        console.log("end");
        endCountdown ++;
    }

    if (endCountdown == 50) {
         myPageChanger.change(5.2);
         if (calculateScore(maxScore) > item.highScore) {
            item.highScore = calculateScore(maxScore);
         }
    }

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

let startGame3button = new button(w * 0.82, h * 0.85, 200 * scalarW, 100, 10, 10);
function drawGame3SongSelect() {
    let item = myScrollList.scrollElements[myScrollList.selected];
    timeSinceNewSong = millis() - time;
    msPerBeat = 60 * 1000 / item.bpm;
    fill(0, 0, 100, flashAlpha / 4);
    rect(0, 0, w, h);
    flashAlpha -= 2;
    //text(round(timeSinceNewSong)+"ms, " + round(timeOfNextBeat), 40, 20);
    // 
    if (timeSinceNewSong > timeOfNextBeat) {
        timeOfNextBeat += msPerBeat;
        flashAlpha = 30;
        buttonClickSound.volume(1);
        buttonClickSound.play();
    }


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

    // high score
    fill(0, 0, 50);
    textSize(25*scalarH);
    textAlign(LEFT, CENTER);
    text("best score: ", 185*scalarW, h-25*scalarH);
    fill(340, 100, 100);
    text(round(item.highScore), 330*scalarW, h-25*scalarH);

    textAlign(CENTER);
    // start button
    fill('black');
    startGame3button.buttonWithText("START", 32, [170, 80, 100, 100]);
    if (startGame3button.clicked) {
        init = false;
        myPageChanger.change(5);
        myScrollList.stopPreview();
    }
    fill(0, 0, 100);
}

// page 5.2on
function drawGame3EndScreen() {

    let item = myScrollList.scrollElements[myScrollList.selected];
    
    // draw top bar
    fill(0, 0, 0, 20);
    noStroke();
    rect(0, 0, width, 120*scalarH);
    
    // draw images
    let previewImageLarge = myScrollList.scrollElements[myScrollList.selected].imgLarge;

    // far right big
    image(previewImageLarge, 675 * scalarW, 180 * scalarH);

    // top left small
    let previewImage = myScrollList.scrollElements[myScrollList.selected].img;
    previewImage.resize(80*scalarH, 0);
    image(previewImage, 90 * scalarW, 20 * scalarH);

    // top left elements
    textAlign(LEFT);
    textSize(40*scalarH);
    fill(0, 0, 80);
    text(item.name, 120*scalarW + 80*scalarH, 45 * scalarH);
    textSize(30*scalarH);
    text("by " + item.artist, 120*scalarW + 80*scalarH, 85*scalarH);

    // score and combo boxes
    textAlign(LEFT, BOTTOM);
    glow(color(200, 100, 100), 32);
    fill(0, 0, 100);
    textSize(65*scalarH);
    text("SCORE", 100*scalarW, 220*scalarH);
    text("COMBO", 130*scalarW, 480*scalarH);
    noGlow();

    // score box
    fill(0, 0, 100, 20);
    rect(100*scalarW, 250*scalarH, 400*scalarW, 120*scalarH, 20);
    fill(0, 0, 100);
    rect(100*scalarW, 210*scalarH, 400*scalarW, 110*scalarH, 20);
    rect(100*scalarW, 250*scalarH, 400*scalarW, 70*scalarH);
    noFill();
    strokeWeight(4);
    stroke(200, 100, 100);
    rect(100*scalarW, 210*scalarH, 400*scalarW, 160*scalarH, 20);

    noStroke();
    // combo box
    fill(0, 0, 100, 20);
    rect(210*scalarW, 470*scalarH, 400*scalarW, 130*scalarH, 20);
    fill(0, 0, 100);
    rect(130*scalarW, 470*scalarH, 250*scalarW, 130*scalarH, 20);
    rect(150*scalarW, 470*scalarH, 230*scalarW, 130*scalarH);
    noFill();
    strokeWeight(4);
    stroke(200, 100, 100);
    rect(130*scalarW, 470*scalarH, 480*scalarW, 130*scalarH, 20);

    noStroke();
    textAlign(CENTER, CENTER);
    fill(340, 80, 100);
    text(round(calculateScore(maxScore)), 300*scalarW, 269*scalarH);
    text(maxCombo, 255*scalarW, 539*scalarH);

    textAlign(LEFT);
    fill(0, 0, 100);
    textSize(25*scalarH);
    text("best score:", 110*scalarW, 345*scalarH);
    
    fill(190, 100, 100);
    text("perfect", 390*scalarW, 490*scalarH);
    fill(55, 100, 100);
    text("okay", 390*scalarW, 520*scalarH);
    fill(300, 100, 100);
    text("bad", 390*scalarW, 550*scalarH);
    fill(0, 100, 100);
    text("miss", 390*scalarW, 580*scalarH);

    let hitCount = [0, 0, 0, 0];
    for (let i = 0; i < hits.length; i ++) {
        if (hits[i] == 300) { hitCount[0] ++; }
        if (hits[i] == 200) { hitCount[1] ++; }
        if (hits[i] == 100) { hitCount[2] ++; }
        if (hits[i] == 0) { hitCount[3] ++; }
        
    }

    textAlign(RIGHT);
    fill(0, 0, 100);
    text(round(item.highScore), 490*scalarW, 345*scalarH);
    fill(190, 100, 100);
    text(hitCount[0], 590*scalarW, 490*scalarH);
    fill(55, 100, 100);
    text(hitCount[1], 590*scalarW, 520*scalarH);
    fill(300, 100, 100);
    text(hitCount[2], 590*scalarW, 550*scalarH);
    fill(0, 100, 100);
    text(hitCount[3], 590*scalarW, 580*scalarH);

    textAlign(CENTER, CENTER);

    // top right rank badge
    let acc = calculateAccuracy() * 100;
    if (acc > 95) {
        fill(50, 100, 100);
        glow(color(50, 100, 100), 32);
        textSize(100*scalarH);
        text("S", width-100*scalarW, 130*scalarH/2);
    } else if (acc > 90) {
        fill(120, 100, 100);
        glow(color(120, 100, 100), 32);
        textSize(100*scalarH);
        text("A", width-100*scalarW, 130*scalarH/2);
    } else if (acc > 85) {
        fill(190, 80, 100);
        glow(color(190, 80, 100), 32);
        textSize(100*scalarH);
        text("B", width-100*scalarW, 130*scalarH/2);
    } else if (acc > 67) {
        fill(300, 100, 100);
        glow(color(300, 100, 100), 32);
        textSize(100*scalarH);
        text("C", width-100*scalarW, 130*scalarH/2);
    } else {
        fill(0, 100, 100);
        glow(color(0, 100, 100), 32);
        textSize(100*scalarH);
        text("D", width-100*scalarW, 130*scalarH/2);
    }

    // top right accuracy 
    fill(0, 0, 80);
    noGlow();
    textSize(40*scalarH);
    text(round(acc, 2) + "%", width-230*scalarW, 130*scalarH/2);


    backButton.drawBack();
    if (backButton.clicked) {
        myPageChanger.change(5.1);
        item.song.stop();
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

function calculateScore(maxScore) {
    // scale maxScore between 0 and 1 million, find the conversion factor
    let conversion = 100000 / maxScore;

    // calculate score using values in hits[]
    let currentScore = 0;
    let combo = 0;
    for (let i = 0; i < hits.length; i ++) {
        currentScore += hits[i] * (1 + combo/finalTotalNotes);
        if (hits[i] != 0) {
            combo ++;
        } else {
            combo = 0;
        }
    }

    return currentScore * conversion;
}

function initGame3() {
    hits = [];
    combo = 0;
    for (let i = 0; i < lanes.length; i++) {
        lanes[i].notes = [];
    }
    songOver = false;
    time = millis();
    timeSinceNewSong = 0;
    timeOfNextBeat = 0;
    startCountdown = 0;
    skip = 0;
    ended = false;
    songOver = false;
    endCountdown = 0;
    item = myScrollList.scrollElements[myScrollList.selected];
    gen = new generator(item.bpm, 0, item.file);
    maxCombo = 0;
}

function calculateTotalScore() {
    // calculate total notes by doing a fake gen run
    totalNotes = 0;
    initGame3(); // make sure all variables are reset
    while (!songOver) {
        if (gen.totalBeats >= parseFloat(gen.scnLine[0]) && !songOver) {
            gen.scan();
        }
        gen.update();
        gen.genNotes();
        gen.totalBeats += gen.rate;
        if (gen.currentLine >= gen.scnLines.length-1) {
            songOver = true;
        }
    }

    console.log("total notes:" + totalNotes);

    // calculate max score including combo multiplier
    // combo multiplier = noteValue * (1+combo/100)
    let maxScore = 0;
    for (let combo = 0; combo < totalNotes; combo ++) {
        maxScore += 300 * (1 + combo/totalNotes);
    }

    console.log("total score: " + maxScore);

    return maxScore;
}