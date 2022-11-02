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

        push();
        rectMode(CORNERS);
        fill(51);
        rect(320, -195, 350, -225);
        pop();


        push();
        imageMode(CENTER);
        image(xImage, 335, -210, 25, 25);
        pop();

        // turn left
        push();
        rectMode(CORNERS);
        fill(51);
        rect(-335, -210, 235, -150);
        pop();

        // turn right
        push();
        rectMode(CORNERS);
        fill(51);
        rect(-335, -140, 235, -80);
        pop();

        push();
        translate(0, 50);
        textFont(inconsolatafont);
        textAlign(CORNER);
        textSize(70);
        text(`Turn Left  = ${String.fromCharCode(turnLeftKey.value)}`, -335, -210);
        pop();

        push();
        translate(0, 50);
        textFont(inconsolatafont);
        textAlign(CORNER);
        textSize(70);
        text(`Turn Right = ${String.fromCharCode(turnRightKey.value)}`, -335, -140);
        pop();
    }
}
function controllButtons() {
    let screenX = map(mouseX, 0, width, -width / 2, width / 2);
    let screenY = map(mouseY, 0, height, -height / 2, height / 2);
    // exit settings
    if (!inMainMenu && controllSettings) {
        if (screenX >= 320 && screenX <= 350 && screenY >= -225 && screenY <= -195) {
            controllSettings = false;
        }
    }
    // turn left
    if (!inMainMenu && controllSettings) {
        if (screenX >= -335 && screenX <= 235 && screenY >= -210 && screenY <= -150) {
            changingKey = turnLeftKey;
        }
    }
    // turn right
    if (!inMainMenu && controllSettings) {
        if (screenX >= -335 && screenX <= 235 && screenY >= -140 && screenY <= -80) {
            changingKey = turnRightKey;
        }
    }
}