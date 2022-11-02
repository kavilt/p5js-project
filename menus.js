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
    // circles
    
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
  
    game1Button.drawGame2();
    game2Button.drawGame2();
    game3Button.drawGame2();
  
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
  }
  
  // game 2 variables
  
  
  
  // background
  
  function drawBackground() {
    background(222, 82.6, 27.1);
    fill(222, 80, 24);
    triangle(0, 1000*scalarW + myPageChanger.transitionPercentExponential * 50, w, h, w, 20*scalarH - myPageChanger.transitionPercentExponential*50); // small triangle to spice up background
  }
  
  
  