function controlls() {
    if (controllSettings == true) {
        push();
        rectMode(CENTER);
        fill(51, 192);
        rect(0, 0, width, height);
        pop();

        push();
        rectMode(CENTER);
        fill(51);
        rect(0, 0, 700, 450);
        pop();

        // X image
        buttonDraw(320, -195, 350, -225);
        push();
        imageMode(CENTER);
        image(xImage, 335, -210, 25, 25);
        pop();

        // turn left
        buttonDraw(-335, -210, 235, -150);

        // turn right
        buttonDraw(-335, -140, 235, -80);

        buttonDraw(-335, -70, 235, -25);

        // turn left
        push();
        translate(0, 50);
        textFont(inconsolatafont);
        textAlign(CORNER);
        textSize(70);
        text(`Turn Left  = ${String.fromCharCode(turnLeftKey.value)}`, -335, -210);
        pop();

        // turn right
        push();
        translate(0, 50);
        textFont(inconsolatafont);
        textAlign(CORNER);
        textSize(70);
        text(`Turn Right = ${String.fromCharCode(turnRightKey.value)}`, -335, -140);
        pop();

        push();
        sfxVolumeSlider.position(width / 2 - 150, height / 2 - 55);
        textFont(inconsolatafont);
        textAlign(CORNER);
        textSize(50);
        text("SFX VOL", -335, -30);
        pop();
    }
}
function controllButtons() {
    // exit settings
    if (!inMainMenu && controllSettings) {
        if (buttonClicked(320, -225, 350, -195)) {
            controllSettings = false;
            sfxVolumeSlider.position(-10000, -10000);
        }
    }
    // turn left
    if (!inMainMenu && controllSettings) {
        if (buttonClicked(-335, -210, 235, -150)) {
            changingKey = turnLeftKey;
        }
    }
    // turn right
    if (!inMainMenu && controllSettings) {
        if (buttonClicked(-335, -140, 235, -80)) {
            changingKey = turnRightKey;
        }
    }
}