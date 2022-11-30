function drawMenu() {
    startButton.buttonWithText("start", 60*scalarH);
    scoresButton.buttonWithText("view scores", 40*scalarH);
    drawImage(title, width/2, (140*scalarH) - myPageChanger.transitionPercentExponential*5, 1+myPageChanger.transitionPercentExponential/50);
    if (startButton.clicked) {
      myPageChanger.change(1); // go to game select screen
    }
    else if (scoresButton.clicked) {
      myPageChanger.change(2); // view high scores
    }
  }
  
  let game1Button;
  let game2Button;
  let game3Button;
  // selection screen (page = 1)
  let selectScale = 300*(w/1280); // scale button sizes
  if (scalarH > 0.6) {
    game1Button = new button(w/2-selectScale-(230*(w/1280)), 230*scalarH, selectScale, selectScale, 10*scalarW, 10);
    game2Button = new button(w/2-selectScale/2, 280*scalarH, selectScale, selectScale, 10*scalarW, 10);
    game3Button = new button(w/2+(230*(w/1280)), (330*scalarH), selectScale, selectScale, 10*scalarW, 10);
  }
  else{
    game1Button = new button(w/2-selectScale-(230*(w/1280)), 90*scalarH, selectScale, selectScale, 10*scalarW, 10);
    game2Button = new button(w/2-selectScale/2, 190*scalarH, selectScale, selectScale, 10*scalarW, 10);
    game3Button = new button(w/2+(230*(w/1280)), (290*scalarH), selectScale, selectScale, 10*scalarW, 10);
  }
  function drawSelect() {
    
      if(scalarH > 0.6) {
        glow(color(40, 40, 100), 32);
        fill(0, 0, 100);
        textSize((120*scalarH) - myPageChanger.transitionPercentExponential*3);
        text("game", w/2, (100*scalarH) + myPageChanger.transitionPercentExponential*3);
        textSize((70*scalarH) - myPageChanger.transitionPercentExponential*2);
        text("select", w/2, (190*scalarH) + myPageChanger.transitionPercentExponential*5);
      } else {
        glow(color(40, 40, 100), 32);
        fill(0, 0, 100);
        textSize((120*scalarH) - myPageChanger.transitionPercentExponential*3);
        text("game", w*0.78, (100*scalarH) + myPageChanger.transitionPercentExponential*3);
        textSize((70*scalarH) - myPageChanger.transitionPercentExponential*2);
        text("select", w*0.81, (190*scalarH) + myPageChanger.transitionPercentExponential*5);
      }
  
    game1Button.drawGameButton(mazeThumbnail, 0.2 * scalarH, "Maze");
    game2Button.drawGameButton(crosshairThumbnail, 0.2 * scalarH, "Duckhunt");
    game3Button.drawGameButton(noteThumbnail, 0.2 * scalarH, "Game 3");
  
    backButton.drawBack();
    if (backButton.clicked) {
      myPageChanger.change(0);
    }
    else if (game1Button.clicked) {
      myPageChanger.change(3);
    }
    else if (game2Button.clicked) {
      myPageChanger.change(4.1);
    }
    else if (game3Button.clicked) {
      myPageChanger.change(5.1, initSongSelect);
    }
  
  }
  
  
  
  // scores (page = 2)
  
  function drawScores() {
    backButton.drawBack();
    if(backButton.clicked) {
      myPageChanger.change(0);
    }
    
    textAlign(CENTER);
    strokeWeight(0);
    stroke(0, 0, 100);
    fill(0, 0, 100);
    glow(color(0, 0, 100), 32);
    textSize(70 * scalarW);
    text("High Scores", width/2, 100*scalarH);

    // boxes
    noFill();
    stroke(0, 0, 80);
    strokeWeight(5);
    rect(50*scalarW, 150*scalarH, width/2-100*scalarW, height-250*scalarH, 5);
    rect(width/2+50*scalarW, 150*scalarH, width/2-100*scalarW, height-250*scalarH, 5);
    line(70 * scalarW, 240*scalarH, width/2-75*scalarW, 240*scalarH);
    line(width/2 + 70 * scalarW, 240*scalarH, width-75*scalarW, 240*scalarH);

    textAlign(LEFT);
    noStroke();
    fill(0, 0, 100);
    textSize(50 * scalarW);
    text("Maze Game", 80*scalarW, 200*scalarH);
    text("Duckhunt", width/2+80*scalarW, 200*scalarH);

    text("Easy", 80*scalarW, 300*scalarH);
    text("Medium", 80*scalarW, 410*scalarH);
    text("Hard", 80*scalarW, 520*scalarH);

    text("Easy", width/2 + 80*scalarW, 300*scalarH);
    text("Medium", width/2 + 80*scalarW, 380*scalarH);
    text("Hard", width/2 + 80*scalarW, 460*scalarH);
    text("Extreme", width/2 + 80*scalarW, 540*scalarH);
    
    textAlign(CENTER);
    text(game1Scores[0], width/2 - 150*scalarW, 300*scalarH);
    text(game1Scores[1], width/2 - 150*scalarW, 410*scalarH);
    text(game1Scores[2], width/2 - 150*scalarW, 520*scalarH);

    text(game2Scores[1], width - 150*scalarW, 380*scalarH);
    text(game2Scores[2], width - 150*scalarW, 460*scalarH);
    text(game2Scores[3], width - 150*scalarW, 540*scalarH);
    text(game2Scores[0], width - 150*scalarW, 300*scalarH);

  }
  
  // game 2 variables
  
  
  
  // background
  
  function drawBackground() {
    background(222, 82.6, 27.1);
    fill(222, 80, 24);
    triangle(0, 1000*scalarW + myPageChanger.transitionPercentExponential * 50, w, h, w, 20*scalarH - myPageChanger.transitionPercentExponential*50); // small triangle to spice up background
  }
  
  
  