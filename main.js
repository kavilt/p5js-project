function draw() {
    cursor(ARROW);
  
    drawBackground();
  
    switch (page) {
      case 0:
        drawMenu();
        break;
      case 1:
        drawSelect();
        break;
      case 2:
        drawScores();
        break;
      case 3:
        drawGame1();
        break;
      case 4:
        drawGame2();
        break;
      case 4.1:
        drawGame2DifficultySelect();
        break;
      case 5:
        drawGame3();
        break;
    }
  
    resetMatrix();
    myPageChanger.update(); // handles page transitions
    myPageChanger.draw();
    clicked = false;
  }
  