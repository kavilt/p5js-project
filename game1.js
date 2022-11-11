let game1Difficulty = 1; // sets type of maze

function drawGame1() { //  maze game,  pages 3-3.9
  backButton.drawBack();
  let easyButton = new button((640 + 150)*scalarW, 100*scalarH, 200, 90, 10, 10)
  let normalButton = new button((640 + 170)*scalarW, 245*scalarH, 200, 90, 10, 10);
  normalButton.clr = [90, 20, 100];
  let hardButton = new button((640 + 190)*scalarW, 390*scalarH, 200, 90, 10, 10);
  hardButton.clr = [20, 20, 100];
  let extremeButton = new button((640 + 210)*scalarW, 535*scalarH, 200, 90, 10, 10);
  extremeButton.clr = [0, 30, 100];

  glow(color(40, 30, 100), 32);
  noStroke();
  fill(0, 0, 100);
  textSize((100*scalarW) + myPageChanger.transitionPercentExponential*4);
  text("Maze", 350 - myPageChanger.transitionPercentExponential * 11, 290*scalarH);
  textSize((90*scalarW) + myPageChanger.transitionPercentExponential*2.5);
  text("difficulty settings", 390 - myPageChanger.transitionPercentExponential * 6, 420*scalarH);

  easyButton.buttonWithText("easy", 40);
  normalButton.buttonWithText("normal", 40);
  hardButton.buttonWithText("hard", 40);
  extremeButton.buttonWithText("extreme", 40);


  backButton.drawBack();

  if(backButton.clicked) {
    myPageChanger.change(1);
  } 
  if(easyButton.clicked) {
    game1Difficulty = 0;
    myPageChanger.change(3.2);
  }
else if(normalButton.clicked) {
    game1Difficulty = 1;
    myPageChanger.change(3.2);
  }
else if(hardButton.clicked) {
    game1Difficulty = 2;
    myPageChanger.change(3.2);
  }
else if(extremeButton.clicked) {
    game1Difficulty = 3;
    myPageChanger.change(3.2);
  }
}
function drawGame1DifficultySelect() {

}

function drawMaze(){
  fill(255,0,255);
  rect(350,0,30,520);
  rect(350,570,30,50);
  rect(1000, 620, 30, -570);
  if(game1Difficulty == 0){
    rect(430, 570, 30, -520);
    rect(430, 50, 100, 30);
    rect(580, 000, 30, 130);
    rect(610, 130, -90, 30);
    rect(430, 540, 520, 30);
    rect(510, 130, 30, 150);
    rect(510, 280, 30, 130);
    rect(430, 460, 240, 30);
    rect(590, 410, 30, -190);
    rect(670, 290, 30, -250);
    rect(670, 490,30, -150);
    rect(590, 220, 80, 30);
    rect(750, 460, 200, 30);
    rect()

  }
}
