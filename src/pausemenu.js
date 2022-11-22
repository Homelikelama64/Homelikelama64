function pauseMenu() {
    if (!inMainMenu && !paused && !deathMenu) {
        push();
        rectMode(CENTER);
        fill(51);
        rect(-width / 2 + 20, -height / 2 + 20, 30, 30, 10);
        pop();

        push();
        rectMode(CENTER);
        fill(255);
        rect(-width / 2 + 27, -height / 2 + 20, 7, 25, 10);
        pop();

        push();
        rectMode(CENTER);
        fill(255);
        rect(-width / 2 + 13, -height / 2 + 20, 7, 25, 10);
        pop();
    }
    if (paused && !controllSettings) {
        push();
        rectMode(CENTER);
        fill(51, 192);
        rect(0, 0, width, height);
        pop();

        push();
        rectMode(CORNERS);
        fill(51);
        rect(200, 200, -200, -200, 20);
        pop();

        buttonDraw(-175, -170, 175, -70, 20)
        push();
        translate(0, -100);
        textFont(inconsolatafont);
        textAlign(CENTER);
        textSize(70);
        text("RESUME", 0, 0);
        pop();

        buttonDraw(-175, -50, 175, 50, 20);
        push();
        translate(0, 20);
        textFont(inconsolatafont);
        textAlign(CENTER);
        textSize(70);
        text("MAIN MENU", 0, 0);
        pop();

        buttonDraw(-175, 70, 175, 170, 20)
        push();
        translate(0, 140);
        textFont(inconsolatafont);
        textAlign(CENTER);
        textSize(70);
        text("SETTINGS", 0, 0);
        pop();
    }
}
function pausedButtons() {
    // play
    if (paused && !inMainMenu && !controllSettings) {
        if (buttonClicked(-175, -170, 175, -70)) {
            paused = false;
        }
    }
    // main menu
    if (paused && !inMainMenu && !controllSettings) {
        if (buttonClicked(-175, -50, 175, 50)) {
            inMainMenu = true;
            paused = false;
            wealth += time / 8
        }
    }
    // settings
    if (paused == true && !inMainMenu && !controllSettings) {
        if (buttonClicked(-175, 70, 175, 170)) {
            controllSettings = true;
        }
    }
    // pause
    if (!inMainMenu && !paused && !deathMenu) {
        if (buttonClicked(-width / 2 + 10, -height / 2 + 10, -width / 2 + 40, -height / 2 + 30)) {
            paused = true;
        }
    }
    
}