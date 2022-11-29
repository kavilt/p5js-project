

function draw() {
    frameRate(60);
    cursor(ARROW);
  
    drawBackground();

    myCam.draw();
  
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
        case 4.2:
        drawGame2DeathScreen();
        break;
        case 5:
        drawGame3();
        break;
        case 5.1:
        drawGame3SongSelect();
        break;
        case 5.2:
        drawGame3EndScreen();
        break;
    }

    resetMatrix();
    myPageChanger.update(); // handles page transitions
    myPageChanger.draw();
    clicked = false;
    typed = [];
    typeTap = [];
    //console.log(scrolled);
    scrolled = 0;
}

