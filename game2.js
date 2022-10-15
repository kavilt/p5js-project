let game2Score = 0;
let game2HighScore = 0;
let game2Lives = 5;
let game2Difficulty = 2; // 0 = easy, 1 = normal, 2 = hard, 3 = pro
let ducks = [];
let fireAnimation = 0;
let fireAnimationIncreasing = false;

function initGame2() { // reset gamestate
    game2score = 0;
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
    circle(this.x, this.y, 80);
}

// move duck, die if shot, delete if dead
duck.prototype.update = function() {
    this.x += this.v.x; 
    this.y += this.v.y;

    if (dist(640, 360, this.x, this.y) > 800) { // duck is off screen
        if (this.alive) {
            game2Lives --;
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

    if (clicked && dist(mouseX, mouseY, this.x, this.y) < 80) { // got clicked on
        this.alive = false;
        game2Score += 5;
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

    this.attemptSpawn = function() {
        this.timeSinceLastDuck ++;
        if (this.timeSinceLastDuck > this.timeToSpawn) { // ITS SPAWNIN TIME
            // spawn a duck!
            this.spawn();
            print("spawned");

            // schedule next duck spawn
            this.timeSinceLastDuck = 0;
            if (random(0, 1) < 0.2 + game2Difficulty/10) { // small chance that another spawn happens immediately
                this.timeToSpawn = random(0, 100);
            }
            else {
                this.timeToSpawn = random(100 - game2Difficulty*10, 350 - game2Difficulty*30);
            }
        }
    }

    this.spawn = function() {
        let duckX = -100;
        let duckVector = createVector(random(5+game2Difficulty*1.5, 9+game2Difficulty*2.5), -random(1, 3) - game2Difficulty/2);
        if (random(0, 1) > 0.5) { // randomly decide which side of the screen the duck appears on
            duckX = 1380;
            duckVector.x = -duckVector.x;
        }

        ducks.push(new duck(
            duckX, random(300, 600), duckVector
        ))
    }
}

myDuckSpawner = new duckSpawner();

function drawCrosshair() {
    let crosshairColor = color(0, 0, 2, 90);
    let velocity = dist(pmouseX, pmouseY, mouseX, mouseY); //approximate estimation of cursor speed
    let recoil = sigmoid((fireAnimation)/60, 10, 6)
    blur(velocity/7);
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
    resetMatrix();
}

function drawUI() {
    // score text
    glow(color(0, 0, 100), 32);
    fill(0, 0, 100);
    noStroke();
    textSize(45);
    text("score: " + game2Score, 1140, 60);

    textSize(35);
    text("best: " + game2HighScore, 1140, 100);

    // Difficulty text
    textSize(70);
    textAlign(LEFT);
    if (game2Difficulty == 0) { text("EASY", 60, 80); }
    else if (game2Difficulty == 1) { text("NORMAL", 60, 80); }
    else if (game2Difficulty == 2) { text("HARD", 60, 80); }
    else if (game2Difficulty == 3) { text("EXTREME", 60, 80); }


    textAlign(CENTER);


}

function drawGame2() { // duck hunt game,  pages 4-4.9
    // do duck stuff
    myDuckSpawner.attemptSpawn();
    drawDucks();

    drawCrosshair();

    drawUI();

    backButton.drawBack();
    if(backButton.clicked) {
        myPageChanger.change(4.1);
    } 
    else if (clicked) { // if click, start animating recoil 
        fireAnimationIncreasing = true;
    }
    if (fireAnimationIncreasing) { 
        fireAnimation += 15;
        if (fireAnimation >= 71) {
            fireAnimationIncreasing = false;
        }
    }
    if(fireAnimation > 0) {
        fireAnimation -= 2;
    }
}

let easyButton = new button(640 + 150, 100, 200, 90, 10, 10);
let normalButton = new button(640 + 170, 245, 200, 90, 10, 10);
normalButton.clr = [90, 20, 100];
let hardButton = new button(640 + 190, 390, 200, 90, 10, 10);
hardButton.clr = [20, 20, 100];
let extremeButton = new button(640 + 210, 535, 200, 90, 10, 10);
extremeButton.clr = [0, 30, 100];

function drawGame2DifficultySelect() {

    glow(color(40, 30, 100), 32);
    noStroke();
    fill(0, 0, 100);
    textSize(100 + myPageChanger.transitionPercentExponential*4);
    text("game title", 350 - myPageChanger.transitionPercentExponential * 11, 290);
    textSize(90 + myPageChanger.transitionPercentExponential*2.5);
    text("difficulty", 390 - myPageChanger.transitionPercentExponential * 6, 420);

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

function sigmoid(value, scale, offset) {
    return 1 / (1 + Math.pow(Math.E, -((value*scale)-offset)));
}