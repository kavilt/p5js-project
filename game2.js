let game2Score = 0;
let game2HighScore = 0;
let game2Lives = 5;
let game2Difficulty = 2; // 0 = easy, 1 = normal, 2 = hard, 3 = pro
let ducks = [];
let scorePopups = [];
let fireAnimation = 0;
let fireAnimationIncreasing = false;
let scoreMultiplier = 1;
let timeSinceLastKill = 0;

function initGame2() { // reset gamestate
    game2Score = 0;
    game2Lives = 5;
    ducks = [];
}


function duck(x, y, vector) {
    this.x = x;
    this.y = y;
    this.v = vector;

    this.alive = true;
    this.deathAnimation = 0;
}
duck.prototype.draw = function() {
    fill(0, 0, 100); 
    circle(this.x, this.y, 80*scalarW);
}
// move duck, die if shot, delete if dead
duck.prototype.update = function() {
    this.x += this.v.x; 
    this.y += this.v.y;

    if (dist(640, 360, this.x, this.y) > 800) { // duck is off screen, player missed
        if (this.alive) {
            game2Lives --;
            missSound.stop();
            missSound.volume(1);
            missSound.play();
            missSound.fade(1, 0, 700);
            let v = p5.Vector.fromAngle(random(180, 360), 10);
            myCam.mode = 1;
            myCam.shake(v.x, v.y);
        }
        this.alive = false;
    }

    if (this.deathAnimation > 0) { // duck was just killed. keep alive until animation finishes
        this.alive = true;
        this.deathAnimation ++;
        if (this.deathAnimation > 100) { // once duck dies, they can be removed from the game
            this.alive = false;
        }
    }
    if (clicked && dist(mouseX, mouseY, this.x, this.y) < 80 && fireAnimation < 10) { // got clicked on
        this.alive = false;
        if (timeSinceLastKill < 80 * scalarW) { // kills in rapid succession will award more points
            scoreMultiplier ++;
        }
        let inc = 5*scoreMultiplier;
        scorePopups.push(new scorePopup(this.x+random(-5, 5), this.y - 5, inc));
        game2Score += inc;
        timeSinceLastKill = 0;
    }

}
// draws all ducks inside the list ducks[]
function drawDucks() {
    for (let i = 0; i < ducks.length; i ++) {
        if (ducks[i] != null && ducks[i].alive){
            ducks[i].update();
            ducks[i].draw();
        } 
        else { // remove duck from list
            ducks[i] = null;
        }
    }
}
// spawns ducks.
function duckSpawner() {
    this.timeSinceLastDuck = 0;
    this.timeToSpawn = 100; // timeSinceLastDuck value needed in order to successfully spawn new duck
    this.backToBackCount = 0;

    this.attemptSpawn = function() {
        this.timeSinceLastDuck ++;
        if (this.timeSinceLastDuck > this.timeToSpawn) { // ITS SPAWNIN TIME
            // spawn a duck!
            this.spawn();
            // schedule next duck spawn
            this.timeSinceLastDuck = 0;

            if (random(0, 1) < 0.2 + game2Difficulty/10 && this.backToBackCount < 2) { // small chance that another spawn happens immediately
                 // prevent >2 ducks from spawning rapidly
                this.timeToSpawn = random(0, 100);    
                this.backToBackCount ++; 
            }
            else {
                this.timeToSpawn = random(100 - game2Difficulty*10, 350 - game2Difficulty*30);
                this.backToBackCount = 0;
            }
        }
    }

    this.spawn = function() {
        let duckX = -100*scalarW;
        let duckVector = createVector(random(5+game2Difficulty*1.5, 9+game2Difficulty*2.5)*scalarW, (-random(1, 3) - game2Difficulty/2)*scalarH);
        if (random(0, 1) > 0.5) { // randomly decide which side of the screen the duck appears on
            duckX = 1380;
            duckVector.x = -duckVector.x;
        }

        ducks.push(new duck(
            duckX, random(300*scalarH, 450*scalarH), duckVector
        ))
    }
}
myDuckSpawner = new duckSpawner();


function drawCrosshair() {
    let crosshairColor = color(0, 0, 2, 90);
    let velocity = dist(pmouseX, pmouseY, mouseX, mouseY); //approximate estimation of cursor speed
    let recoil = sigmoid((fireAnimation)/60, 10, 6)

    push();
    blur(velocity/7); // simulate motion blur
    noCursor();
    translate(mouseX, mouseY);
    rotate(recoil*20);
    scale(1 + recoil/20);
    fill(0, 100, 70);
    circle(0, 0, 10);

    noFill();
    stroke(crosshairColor);
    strokeWeight(6);
    circle(0, 0, 170);

    strokeWeight(3);
    rectMode(CENTER);
    rect(0, 65, 0, 40);
    rect(0, -65, 0, 40);
    rect(65, 0, 40, 0);
    rect(-65, 0, 40, 0);

    rectMode(CORNER);
    noBlur();
    pop();
}

function drawGame2UI() {
    // score text
    glow(color(0, 0, 100), 32);
    fill(0, 0, 100);
    noStroke();
    textSize(45*scalarW);
    text("score: " + game2Score, 1140*scalarW, 60*scalarH);

    textSize(35*scalarW);
    text("best: " + game2HighScore, 1140*scalarW, 100*scalarH);
    if (game2Score > game2HighScore) {
        game2HighScore = game2Score;
    }
    // health
    for (let i = 0; i < game2Lives; i ++) {
        drawImage(heart, (1190*scalarW) - (i * 50), 650*scalarH, 0.1);
        drawImage(heart, (1190*scalarW) - (i * 50), 650*scalarH, 0.1);
        
    }

    // Difficulty text
    textSize(70*scalarW);
    textAlign(LEFT);
    if (game2Difficulty == 0) { text("EASY", 60*scalarW, 80*scalarH); }
    else if (game2Difficulty == 1) { text("NORMAL", 60*scalarW, 80*scalarH); }
    else if (game2Difficulty == 2) { text("HARD", 60*scalarW, 80*scalarH); }
    else if (game2Difficulty == 3) { text("EXTREME", 60*scalarW, 80*scalarH); }
    textAlign(CENTER);
}

function drawGame2() { // duck hunt game,  pages 4-4.9

    if (mouseIsPressed) {
        clicked = true;
    }

    timeSinceLastKill ++;
    if (timeSinceLastKill > 80) {
        scoreMultiplier = 1;
    }
    if(backButton.clicked) {
        myPageChanger.change(4.1);
    } 
    else if (clicked && fireAnimation < 10) { // if click, start animating recoil and play shoot sound
        fireAnimationIncreasing = true;
        let v = p5.Vector.fromAngle(random(180, 360), 12);
        myCam.mode = 0;
        myCam.shake(v.x, v.y);
        shootSound.play();
        shootSound.volume(0.2);
        shootSound.fade(0.2, 0, 1000);
    }
    // do duck stuff
    myDuckSpawner.attemptSpawn();
    drawDucks();

    drawScorePopups();
    
    drawCrosshair();
    
    drawGame2UI();

    backButton.drawBack();
    if (fireAnimationIncreasing) { 
        fireAnimation += 15;
        if (fireAnimation >= 71) {
            fireAnimationIncreasing = false;
        }
    }
    if(fireAnimation > 0) {
        fireAnimation -= 2;
    }

    // switch to death scene if dead
    if (game2Lives == 0) {
        game2Lives = -1;
        myPageChanger.change(4.2);
        loseSound.play();
    }
}


let easyButton = new button((640 + 150)*scalarW, 100*scalarH, 200, 90, 10, 10);
let normalButton = new button((640 + 170)*scalarW, 245*scalarH, 200, 90, 10, 10);
normalButton.clr = [90, 20, 100];
let hardButton = new button((640 + 190)*scalarW, 390*scalarH, 200, 90, 10, 10);
hardButton.clr = [20, 20, 100];
let extremeButton = new button((640 + 210)*scalarW, 535*scalarH, 200, 90, 10, 10);
extremeButton.clr = [0, 30, 100];
function drawGame2DifficultySelect() {

    glow(color(40, 30, 100), 32);
    noStroke();
    fill(0, 0, 100);
    textSize((100*scalarW) + myPageChanger.transitionPercentExponential*4);
    text("game title", 350 - myPageChanger.transitionPercentExponential * 11, 290*scalarH);
    textSize((90*scalarW) + myPageChanger.transitionPercentExponential*2.5);
    text("difficulty", 390 - myPageChanger.transitionPercentExponential * 6, 420*scalarH);

    easyButton.buttonWithText("easy", 40);
    normalButton.buttonWithText("normal", 40);
    hardButton.buttonWithText("hard", 40);
    extremeButton.buttonWithText("extreme", 40);

    if(easyButton.clicked) {
        game2Difficulty = 0;
        initGame2();
        myPageChanger.change(4);
    }
    else if(normalButton.clicked) {
        game2Difficulty = 1;
        initGame2();
        myPageChanger.change(4);
    }
    else if(hardButton.clicked) {
        game2Difficulty = 2;
        initGame2();
        myPageChanger.change(4);
    }
    else if(extremeButton.clicked) {
        game2Difficulty = 3;
        initGame2();
        myPageChanger.change(4);
    }
    backButton.drawBack();
    if(backButton.clicked) {
        myPageChanger.change(1);
    }
}

function drawGame2DeathScreen() {

    glow(color(0, 100, 100), 32);
    fill(0, 0, 100);
    noStroke();
    textSize(110*scalarW);
    text("GAME", 640*scalarW, 130*scalarH);
    textSize(130*scalarW);
    text("OVER", 640*scalarW, 250*scalarH);

    textAlign(RIGHT);
    noGlow();
    textSize(50*scalarW);
    fill(0, 0, 80);
    text("difficulty:", 400*scalarW, 400*scalarH);
    text("score:", 400*scalarW, 500*scalarH);
    text("objects hit:", 950*scalarW, 400*scalarH);
    text("high score:", 950*scalarW, 500*scalarH);

    fill(0, 0, 100);
    glow(color(0, 0, 100), 32);
    textSize(60*scalarW);
    if (game2Difficulty == 0) { text("easy", 600*scalarW, 400*scalarH); }
    else if (game2Difficulty == 1) { text("normal", 600*scalarW, 400*scalarH); }
    else if (game2Difficulty == 2) { text("hard", 600*scalarW, 400*scalarH); }
    else if (game2Difficulty == 3) { textSize(45*scalarW); text("extreme", 600*scalarW, 400*scalarH); }
    textSize(50*scalarW);
    text(game2Score, 600*scalarW, 500*scalarH);
    text(game2Score/5, 1150*scalarW, 400*scalarH);
    text(game2HighScore, 1150*scalarW, 500*scalarH);

    textAlign(CENTER);

    backButton.drawBack();
    if (backButton.clicked) {
        myPageChanger.change(4.1);
    }
}

// utility functions
function sigmoid(value, scale, offset) { // used for recoil animation
    return 1 / (1 + Math.pow(Math.E, -((value*scale)-offset)));
}


function scorePopup(x, y, value) {
    this.x = x;
    this.y = y;
    this.vely = 10;
    this.velx = random(-1, 1); 
    this.timeAlive = 0;
    this.alive = true;
    this.value = value;
    this.draw = function() {
        this.timeAlive ++;
        fill(50, 70, 100, 110 - Math.pow(this.timeAlive, 1.2));
        glow(50, 100, 100);
        noStroke();
        textSize(40 + this.value/2 + this.timeAlive/4);
        text(this.value, this.x, this.y);

        this.x += this.velx;
        this.y -= this.vely;

        this.vely /= 1.2;
        this.velx /= 1.3;

        if (this.timeAlive > 50) {
            this.alive = false;
        }
        noGlow();
    }
}

function drawScorePopups() {
    for (let i = 0; i < scorePopups.length; i ++) {
        if (scorePopups[i] != null && scorePopups[i].alive){
            scorePopups[i].draw();
        } 
        else { // remove scorePopup from list
            scorePopups[i] = null;
        }
    }
}