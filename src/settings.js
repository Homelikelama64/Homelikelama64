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
        rect(0, 0, 700, 450, 20);
        pop();

        // cancel
        buttonDraw(310, -185, 345, -220, 10);
        push();
        imageMode(CENTER);
        image(xImage, 328, -203, 25, 25);
        pop();

        // turn left
        buttonDraw(-335, -210, 235, -150, 20);

        // turn right
        buttonDraw(-335, -140, 235, -80, 20);

        // sfx 
        buttonDraw(-335, -70, 235, -25, 20);

        // music
        buttonDraw(-335, -15, 235, 35, 20)

        // turn left
        push();
        translate(0, 50);
        textFont(inconsolatafont);
        textAlign(CORNER);
        textSize(70);
        text(`Turn Left  = ${String.fromCharCode(turnLeftKey.value)}`, -330, -210);
        pop();

        // turn right
        push();
        translate(0, 50);
        textFont(inconsolatafont);
        textAlign(CORNER);
        textSize(70);
        text(`Turn Right = ${String.fromCharCode(turnRightKey.value)}`, -330, -140);
        pop();

        //SFX
        push();
        sfxVolumeSlider.position(width / 2 - 110, height / 2 - 55);
        textFont(inconsolatafont);
        textAlign(CORNER);
        textSize(50);
        text("SFX VOL", -330, -30);
        pop();

        //music
        push();
        musicVolumeSlider.position(width / 2 - 110, height / 2 + 5);
        textFont(inconsolatafont);
        textAlign(CORNER);
        textSize(50);
        text("Music VOL", -330, 30);
        pop();

        //apply
        push();
        buttonDraw(180, 150, 350, 225, 20);
        textFont(inconsolatafont);
        textAlign(CORNER);
        textSize(65);
        text("APPLY", 185, 205);
        pop();
    }
}
function controllButtons() {
    // cancel
    if (controllSettings) {
        if (buttonClicked(310, -220, 345, -185)) {
            controllSettings = false;
            sfxVolumeSlider.position(-10000, -10000);
            musicVolumeSlider.position(-10000, -10000);
            clickSound.play();
        }
    }
    // apply
    if (controllSettings) {
        if (buttonClicked(180, 150, 350, 225)) {
            sfxVolume = sfxVolumeSlider.value();
            musicVolume = musicVolumeSlider.value();
            backgroundmusic.setVolume(musicVolume);
            clickSound.setVolume(sfxVolume * 2);
            clickSound.play();
        }
    }
    // turn left
    if (controllSettings) {
        if (buttonClicked(-335, -210, 235, -150)) {
            changingKey = turnLeftKey;
            clickSound.play();
        }
    }
    // turn right
    if (controllSettings) {
        if (buttonClicked(-335, -140, 235, -80)) {
            changingKey = turnRightKey;
            clickSound.play();
        }
    }
    if (!controllSettings && inMainMenu) {
        if (buttonClicked(-75, 60, 75, 110)) {
            controllSettings = true;
            clickSound.play();
        }
    }
}