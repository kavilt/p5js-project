let game1Difficulty = 1; // sets type of maze
let ready = 1;
let point = 0;
let end = 0;


function drawGame1() { //  maze game,  pages 3-3.9
  backButton.drawBack();
  let easyButton = new button((640 + 150)*scalarW, 100*scalarH, 200, 90, 10, 10)
  let normalButton = new button((640 + 170)*scalarW, 245*scalarH, 200, 90, 10, 10);
  normalButton.clr = [90, 20, 100];
  let hardButton = new button((640 + 190)*scalarW, 390*scalarH, 200, 90, 10, 10);
  hardButton.clr = [20, 20, 100];

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
}
function drawGame1DifficultySelect() {

}

function drawMaze(){
  backButton.drawBack();
  if(backButton.clicked) {
    myPageChanger.change(3);
    point = 0;
  } 
  glow(color(40, 30, 100), 32);
  noStroke();
  fill(0, 0, 100);
  textSize((100*scalarW) + myPageChanger.transitionPercentExponential*4);
  text("Maze", 200 - myPageChanger.transitionPercentExponential * 11, 100*scalarH);
  textSize((60*scalarW) + myPageChanger.transitionPercentExponential*2.5);
  text("Move your", 200 - myPageChanger.transitionPercentExponential * 6, 250*scalarH);
  text("mouse", 200 - myPageChanger.transitionPercentExponential * 6, 320*scalarH);
  text("through", 200 - myPageChanger.transitionPercentExponential * 6, 380*scalarH);
  text("the maze", 200 - myPageChanger.transitionPercentExponential * 6, 440*scalarH);
  textSize((50*scalarW) + myPageChanger.transitionPercentExponential*4);
  text("Points:" + point, 1200 - myPageChanger.transitionPercentExponential * 11, 150*scalarH);
  textSize((50*scalarW) + myPageChanger.transitionPercentExponential*4);
  text("Get Lowest #" , 1200 - myPageChanger.transitionPercentExponential * 11, 200*scalarH);
  noGlow();
  fill(255,0,255);
  rect(350,0,30,520);
  rect(350,570,30,500);
  rect(1000, 620, 30, -570);
  rect(350, 620, 680, 30);

  if(ready == 0 && end == 0){
    glow(color(40, 30, 100), 32);
    noStroke();
    fill('red');
    textSize((100*scalarW) + myPageChanger.transitionPercentExponential*4);
    text("End Game", 500 - myPageChanger.transitionPercentExponential * 11, 100*scalarH);
    text("Go to Start", 500 - myPageChanger.transitionPercentExponential * 11, 200*scalarH);
    noGlow();
  }else if(end == 1){
    glow(color(40, 30, 100), 32);
    noStroke();
    fill('red');
    textSize((100*scalarW) + myPageChanger.transitionPercentExponential*4);
    fill('green');
    text("You Win!", 700 - myPageChanger.transitionPercentExponential * 11, 100*scalarH);
    text("You got " + point + "point(s)!", 700 - myPageChanger.transitionPercentExponential * 11, 250*scalarH);
    text("Can you get fewer?", 700 - myPageChanger.transitionPercentExponential * 11, 400*scalarH);
    noGlow();
  }else{
  if(game1Difficulty == 2){
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
    rect(750, 460, 250, 30);
    rect(670, 100, 350, 30);
    rect(750, 0, 30, 50);
    rect(670, 290, 200, -30);
    rect(820, 130, 30, -100);
    rect(670, 360, 200, -30);
    rect(750, 180, 260, 30);
    rect(910, 180, 30, 220);
    rect(750, 400, 190, 30);
    rect(900, 0, 30, 50);
    ready = 1;
  }
  if(game1Difficulty == 1){
    circle(580, 250, 50);
    circle(480, 300, 100);
    circle(640, 100, 75);
    circle(480, 360, 90);
    circle(675, 75, 150);
    circle(500, 50, 50);
    circle(590, 385, 65);
    circle(480, 420, 50);
    circle(750, 560, 100);
    circle(900, 100, 100);
    circle(850, 460, 200);
    circle(775, 245, 70);
    circle(850, 250, 100);
    circle(450, 200, 85);
    circle(500, 430, 60);
    circle(600, 550, 100);
    circle(700, 350, 100);
    circle(960, 180, 50);
    circle(470, 550, 75);
    circle(680, 250, 80);
    circle(550, 150, 60);
    circle(800, 155, 60);
    circle(950, 300, 75);
    ready = 2;
  }
  if(game1Difficulty == 0){
    triangle(500,450, 550,200, 600, 500);
    triangle(480,60, 580, 200, 650, 125);
    triangle(390, 0, 600, 50, 750, 25 );
    triangle(980, 60, 750, 55, 800, 100);
    triangle(880, 450, 925, 580, 800, 360);
    triangle(790, 0, 850, 30, 990, 25);
    triangle(600, 250, 640, 200, 700, 390);
    triangle(390, 200, 425, 185, 435, 300);
    triangle(680, 580, 620, 480, 700, 420);
    triangle(390, 490, 420, 525, 450, 575);
    triangle(480, 500, 550, 560, 600, 580);
    triangle(750, 250, 825, 335, 900, 180);
    triangle(980, 200, 850, 350, 900, 400);
    triangle(725, 450, 800, 425, 780, 590);
    triangle(675, 150, 800, 120, 725, 250);
    triangle(400, 80, 450, 110, 415, 150);
    triangle(470, 170, 495, 300, 480, 390);
    ready = 3;
  }
}

  playGame1();
}
function playGame1(){
  if(pmouseX < 360){
    ready = 1;
    if(end == 1){
      point = 0;
      end = 0;
    }
  }else if(pmouseX > 1030 && ready != 0){
    MazeOver();
  }
  if(ready == 1) {
    strokeWeight(35);
    stroke('orange');
    line(mouseX, mouseY, pmouseX, pmouseY);
    if(MouseRect(430, 50, 30, 520)){
      point += 1;
      endMaze();
    }
    if(MouseRect(430, 50, 100, 30)){
      point += 1;
      endMaze();
    }
    if(MouseRect(580, 000, 30, 130)){
      point += 1;
      endMaze();
    }
    if(MouseRect(520, 130, 90, 30)){
      point += 1;
      endMaze();
    }
    if(MouseRect(430, 540, 520, 30)){
      point += 1;
      endMaze();
    }
    if(MouseRect(510, 130, 30, 150)){
      point += 1;
      endMaze();
    }
    if(MouseRect(510, 280, 30, 130)){
      point += 1;
      endMaze();
    }
    if(MouseRect(430, 460, 240, 30)){
      point += 1;
      endMaze();
    }
    if(MouseRect(590, 220, 30, 190)){
      point += 1;
      endMaze();
    }
    if(MouseRect(670, 50, 30, 250)){
      point += 1;
      endMaze();
    }
    if(MouseRect(670, 340,30, 150)){
      point += 1;
      endMaze();
    }
    if(MouseRect(590, 220, 80, 30)){
      point += 1;
      endMaze();
    }
    if(MouseRect(750, 460, 250, 30)){
      point += 1;
      endMaze();
    }
    if(MouseRect(670, 100, 350, 30)){
      point += 1;
      endMaze();
    }
    if(MouseRect(750, 0, 30, 50)){
      point += 1;
      endMaze();
    }
    if(MouseRect(670, 260, 200, 30)){
      point += 1;
      endMaze();
    }
    if(MouseRect(820, 30, 30, 100)){
      point += 1;
      endMaze();
    }
    if(MouseRect(670, 330, 200, 30)){
      point += 1;
      endMaze();
    }
    if(MouseRect(750, 180, 260, 30)){
      point += 1;
      endMaze();
    }
    if(MouseRect(910, 180, 30, 220)){
      point += 1;
      endMaze();
    }
    if(MouseRect(750, 400, 190, 30)){
      point += 1;
      endMaze();
    }
    if(MouseRect(900, 0, 30, 50)){
      point += 1;
      endMaze();
    }
    if(pmouseY > 630 -12 && pmouseX > 360){
      point += 1;
      endMaze();
    }
    
  }
  if(ready == 2){
    strokeWeight(30);
    stroke('orange');
    line(mouseX, mouseY, pmouseX, pmouseY);
    if(MouseCic(580, 250, 50)){
      point += 1;
      endMaze();
    }
    if(MouseCic(480, 300, 100)){
      point += 1;
      endMaze();
    }
    if(MouseCic(640, 100, 75)){
      point += 1;
      endMaze();
    }
    if(MouseCic(480, 360, 90)){
      point += 1;
      endMaze();
    }
    if(MouseCic(675, 75, 150)){
      point += 1;
      endMaze();
    }
    if(MouseCic(500, 50, 50)){
      point += 1;
      endMaze();
    }
    if(MouseCic(590, 385, 65)){
      point += 1;
      endMaze();
    }
    if(MouseCic(480, 420, 50)){
      point += 1;
      endMaze();
    }
    if(MouseCic(750, 560, 100)){
      point += 1;
      endMaze();
    }
    if(MouseCic(900, 100, 100)){
      point += 1;
      endMaze();
    }
    if(MouseCic(850, 460, 200)){
      point += 1;
      endMaze();
    }
    if(MouseCic(775, 245, 70)){
      point += 1;
      endMaze();
    }
    if(MouseCic(850, 250, 100)){
      point += 1;
      endMaze();
    }
    if(MouseCic(450, 200, 85)){
      point += 1;
      endMaze();
    }
    if(MouseCic(500, 430, 60)){
      point += 1;
      endMaze();
    }
    if(MouseCic(600, 550, 100)){
      point += 1;
      endMaze();
    }
    if(MouseCic(700, 350, 100)){
      point += 1;
      endMaze();
    }
    if(MouseCic(960, 180, 50)){
      point += 1;
      endMaze();
    }
    if(MouseCic(470, 550, 75)){
      point += 1;
      endMaze();
    }
    if(MouseCic(680, 250, 80)){
      point += 1;
      endMaze();
    }
    if(MouseCic(550, 150, 60)){
      point += 1;
      endMaze();
    }
    if(MouseCic(800, 155, 60)){
      point += 1;
      endMaze();
    }
    if(MouseCic(950, 300, 75)){
      point += 1;
      endMaze();
    }
    if(pmouseY > 630-12 && pmouseX > 360){
      point += 1;
      endMaze();
    }

  }

  if(ready == 3){
    strokeWeight(20);
    stroke('orange');
    line(mouseX, mouseY, pmouseX, pmouseY);
  if(MouseTriangle(500,450, 550,200, 600, 500)){
    point += 1;
    endMaze();
  }
  if(MouseTriangle(480,60, 580, 200, 650, 125)){
    point += 1;
    endMaze();
  }
  if(MouseTriangle(390, 0, 600, 50, 750, 25)){
    point += 1;
    endMaze();
  }
  if(MouseTriangle(980, 60, 750, 55, 800, 100)){
    point += 1;
    endMaze();
  }
  if(MouseTriangle(880, 450, 925, 580, 800, 360)){
    point += 1;
    endMaze();
  }
  if(MouseTriangle(790, 0, 850, 30, 990, 25)){
    point += 1;
    endMaze();
  }
  if(MouseTriangle(600, 250, 640, 200, 700, 390)){
    point += 1;
    endMaze();
  }
  if(MouseTriangle(390, 200, 425, 185, 435, 300)){
    point += 1;
    endMaze();
  }
  if(MouseTriangle(680, 580, 620, 480, 700, 420)){
    point += 1;
    endMaze();
  }
  if(MouseTriangle(390, 490, 420, 525, 450, 575)){
    point += 1;
    endMaze();
  }
  if(MouseTriangle(480, 500, 550, 560, 600, 580)){
    point += 1;
    endMaze();
  }
  if(MouseTriangle(750, 250, 825, 335, 900, 180)){
    point += 1;
    endMaze();
  }
  if(MouseTriangle(980, 200, 850, 350, 900, 400)){
    point += 1;
    endMaze();
  }
  if(MouseTriangle(725, 450, 800, 425, 780, 590)){
    point += 1;
    endMaze();
  }
  if(MouseTriangle(675, 150, 800, 120, 725, 250)){
    point += 1;
    endMaze();
  }
  if(MouseTriangle(400, 80, 450, 110, 415, 150)){
    point += 1;
    endMaze();
  }
  if(MouseTriangle(470, 170, 495, 300, 480, 390)){
    point += 1;
    endMaze();
  }
  if(pmouseY > 630-8 && pmouseX > 360){
    point += 1;
    endMaze();
  }
}

if(MouseRect(350,0,30,520) || MouseRect(350,570,30,500)|| MouseRect(1000, 50, 30, 570)){
  point += 1;
  endMaze();
}
}
function TriArea(a, b, c) {
    return abs((a[0]*(b[1]-c[1]) + b[0]*(c[1]-a[1])+ c[0]*(a[1]-b[1]))/2);
}

function MouseTriangle(x1, y1, x2, y2, x3, y3){
    let point = [mouseX - sqrt(10), mouseY - 10];
    let area = TriArea([x1, y1], [x2, y2], [x3, y3]);
    let areaA = TriArea([x1, y1], [x2, y2], point);
    let areaB = TriArea(point, [x2, y2], [x3, y3]);
    let areaC = TriArea([x1, y1], point, [x3, y3]);
    if(abs(areaA + areaB + areaC - area) < 0.001){
      return true;
    }
    point = [mouseX + sqrt(10), mouseY - 10];
    area = TriArea([x1, y1], [x2, y2], [x3, y3]);
    areaA = TriArea([x1, y1], [x2, y2], point);
    areaB = TriArea(point, [x2, y2], [x3, y3]);
    areaC= TriArea([x1, y1], point, [x3, y3]);
    if(abs(areaA + areaB + areaC - area) < 0.001){
      return true;
    }
    point = [mouseX + sqrt(10), mouseY + 10];
    area = TriArea([x1, y1], [x2, y2], [x3, y3]);
    areaA = TriArea([x1, y1], [x2, y2], point);
    areaB = TriArea(point, [x2, y2], [x3, y3]);
    areaC= TriArea([x1, y1], point, [x3, y3]);
    if(abs(areaA + areaB + areaC - area) < 0.001){
      return true;
    }
    point = [mouseX - sqrt(10), mouseY + 10];
    area = TriArea([x1, y1], [x2, y2], [x3, y3]);
    areaA = TriArea([x1, y1], [x2, y2], point);
    areaB = TriArea(point, [x2, y2], [x3, y3]);
    areaC= TriArea([x1, y1], point, [x3, y3]);
    if(abs(areaA + areaB + areaC - area) < 0.001){
      return true;
    }
    point = [mouseX - 10, mouseY + sqrt(10)];
    area = TriArea([x1, y1], [x2, y2], [x3, y3]);
    areaA = TriArea([x1, y1], [x2, y2], point);
    areaB = TriArea(point, [x2, y2], [x3, y3]);
    areaC= TriArea([x1, y1], point, [x3, y3]);
    if(abs(areaA + areaB + areaC - area) < 0.001){
      return true;
    }
    point = [mouseX - 10, mouseY - sqrt(10)];
    area = TriArea([x1, y1], [x2, y2], [x3, y3]);
    areaA = TriArea([x1, y1], [x2, y2], point);
    areaB = TriArea(point, [x2, y2], [x3, y3]);
    areaC= TriArea([x1, y1], point, [x3, y3]);
    if(abs(areaA + areaB + areaC - area) < 0.001){
      return true;
    }
    point = [mouseX + 10, mouseY + sqrt(10)];
    area = TriArea([x1, y1], [x2, y2], [x3, y3]);
    areaA = TriArea([x1, y1], [x2, y2], point);
    areaB = TriArea(point, [x2, y2], [x3, y3]);
    areaC= TriArea([x1, y1], point, [x3, y3]);
    if(abs(areaA + areaB + areaC - area) < 0.001){
      return true;
    }
    point = [mouseX + 10, mouseY - sqrt(10)];
    area = TriArea([x1, y1], [x2, y2], [x3, y3]);
    areaA = TriArea([x1, y1], [x2, y2], point);
    areaB = TriArea(point, [x2, y2], [x3, y3]);
    areaC= TriArea([x1, y1], point, [x3, y3]);
    if(abs(areaA + areaB + areaC - area) < 0.001){
      return true;
    }
    return false;
}
function MouseRect(w1, h1, w2, h2){
  if( w1 == 350 || w1 == 1000){
    if(ready == 2){
      if(mouseX+12 > w1 && (mouseX-12 < w1+w2) && (mouseY+12 > h1) && (mouseY-12 < (h1+h2))){
        return true;
      }
    }else if(ready == 3){
      if(mouseX +10> w1 && (mouseX-10< w1+w2) && (mouseY+10 > h1) && (mouseY-10 < (h1+h2))){
        return true;
      }
    }
  }else if(mouseX+17.5 > w1 && (mouseX-17.5 < w1+w2) && (mouseY+17.5 > h1) && (mouseY-17.5 < (h1+h2))){
    return true;
  }
  return false;
}
function MouseCic(x,y,r){
  if(dist(x, y, mouseX +12 , mouseY +12 ) < r/2 || dist(x,y, mouseX - 12, mouseY - 12) < r/2 || dist(x,y, mouseX + 12, mouseY - 12) < r/2 || dist(x,y, mouseX - 12, mouseY + 12) < r/2){
    return true;
  }
  return false;
}
function endMaze(){
  ready = 0;
  glow(color(40, 30, 100), 32);
  noStroke();
  fill('red');
  textSize((100*scalarW) + myPageChanger.transitionPercentExponential*4);
  text("End Game", 400 - myPageChanger.transitionPercentExponential * 11, 100*scalarH);
  noGlow();
}
function MazeOver(){
  if(ready != 0){
  glow(color(40, 30, 100), 32);
  noStroke();
  fill('red');
  textSize((100*scalarW) + myPageChanger.transitionPercentExponential*4);
  fill('green');
  text("You Win!", 700 - myPageChanger.transitionPercentExponential * 11, 100*scalarH);
  text("You got " + point + "point(s)!", 700 - myPageChanger.transitionPercentExponential * 11, 250*scalarH);
  text("Can you get fewer?", 700 - myPageChanger.transitionPercentExponential * 11, 400*scalarH);
  noGlow();
  ready = 0;
  end = 1;
  }
}
