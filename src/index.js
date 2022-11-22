/** @type {Ship} */
let ship;

/** @type {Missile[]} */
let missiles = [];

/** @type {Bullet[]} */
let bullets = [];

/** @type {RepairKit | null} */
let repair = null;

/** @type {Money[]} */
let moneys = [];
let wealth;

let inMainMenu = true;
let deathMenu = false;
let deathsInGame = 0;
let paused = false;
let controllSettings = false;
let debugMode = false;

let time = 0;

let sfxVolume;
let sfxVolumeSlider;

let musicVolume;
let musicVolumeSlider;

let turningLeft = false;
let turningRight = false;

let turnLeftKey;
let turnRightKey;
let changingKey = null;

function setup() {
    let loadedWealth = window.localStorage.getItem("wealth");
    wealth = parseInt(loadedWealth);
    if (!wealth && wealth !== 0) {
        wealth = 0;
    }

    let loadedSFXVolume = window.localStorage.getItem("SFXVol");
    sfxVolume = parseFloat(loadedSFXVolume);
    if (!sfxVolume && sfxVolume !== 0) {
        sfxVolume = 0.5;
    }

    let loadedMusicVolume = window.localStorage.getItem("MUSICVol");
    musicVolume = parseFloat(loadedMusicVolume);
    if (!musicVolume && musicVolume !== 0) {
        musicVolume = 0.3;
    }

    let loadedTurnLeftKey = window.localStorage.getItem("turnLeftKey");
    turnLeftKey = { value: parseInt(loadedTurnLeftKey) };
    if (!turnLeftKey.value && turnLeftKey.value !== 0) {
        turnLeftKey.value = 'A'.charCodeAt(0);
    }
    let loadedTurnRightKey = window.localStorage.getItem("turnRightKey");
    turnRightKey = { value: parseInt(loadedTurnRightKey) };
    if (!turnRightKey.value && turnRightKey.value !== 0) {
        turnRightKey.value = 'D'.charCodeAt(0);
    }

    sfxVolumeSlider = createSlider(0, 1, sfxVolume, 0);
    sfxVolumeSlider.position(-10000, -10000);
    sfxVolumeSlider.style('width', '330px');

    musicVolumeSlider = createSlider(0, 1, musicVolume, 0);
    musicVolumeSlider.position(-10000, -10000);
    musicVolumeSlider.style('width', '330px');

    let canvas = createCanvas(windowWidth, windowHeight, WEBGL);
    angleMode(DEGREES);

    // drawMainMenu();
    canvas.mousePressed(function () {
        if (inMainMenu) {
            if (buttonClicked(-100, -50, 100, 50)) {
                time = 0;
                resetWaves();
                setupUnits();
                inMainMenu = false;
            }
        }
        pausedButtons();
        controllButtons();
        deathMenuClicked();
    });
}

function buttonClicked(posX, posY, minX, minY) {
    let screenX = map(mouseX, 0, width, -width / 2, width / 2);
    let screenY = map(mouseY, 0, height, -height / 2, height / 2);
    if (screenX >= posX && screenX <= minX && screenY >= posY && screenY <= minY) {
        return true;
    }
    return false;
}

function buttonDraw(posX, posY, minX, minY, ROUND) {
    push();
    rectMode(CORNERS);
    fill(51);
    rect(posX, posY, minX, minY, ROUND);
    pop();
}

function clamp(value, minValue, maxValue) {
    return max(min(value, maxValue), minValue);
}

function setupUnits() {
    missiles = [];
    bullets = [];
    repair = null;
    moneys = [];
    ship = new Ship(
        300,
        130,
        createVector(0, 0),
        random(0, 360),
        4,
        100,
        false,
        shipImage,
        shipBoostImage,
        shipDamagedImage,
        shipBoostDamageImage
    );
    spawnMoney();
    spawnMoney();
    spawnMoney();
}

function spawnMissileV1() {
    missiles.push(new Missile(
        missileV1Image,
        p5.Vector.random2D().setMag(random(1000, 1500)).add(ship.position),
        random(360),
        20,
        400,
        100,
        15,
        false
    ));
}
function spawnMissileV2() {
    missiles.push(new Missile(
        missileV2Image,
        p5.Vector.random2D().setMag(random(1000, 1500)).add(ship.position),
        random(360),
        45,
        800,
        40,
        0,
        true
    ));
}
function spawnMissileV3() {
    missiles.push(new Missile(
        missileV3Image,
        p5.Vector.random2D().setMag(random(1000, 1500)).add(ship.position),
        random(360),
        45,
        420,
        95,
        0,
        true
    ));
}
function spawnMoney() {
    moneys.push(new Money(
        moneyImage,
        p5.Vector.random2D().setMag(random(1000, 2000)).add(ship.position)
    ));
}


function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function tryDrawOffScreenMarker(markerImage, position) {
    let shipToMissile = position.copy().sub(ship.position);
    let clamped = shipToMissile.copy();
    clamped.x = clamp(clamped.x, -width / 2 + 10, width / 2 - 10);
    clamped.y = clamp(clamped.y, -height / 2 + 10, height / 2 - 10);

    if (!shipToMissile.equals(clamped)) {
        imageMode(CENTER);
        image(markerImage, clamped.x, clamped.y, 20, 20);
    }
}
function keyPressed() {
    if (keyCode == 27 && !inMainMenu && !controllSettings) {
        paused = !paused;
    } else if (keyCode == 27 && controllSettings == true) {
        controllSettings = false;
        sfxVolumeSlider.position(-10000, -10000);
        musicVolumeSlider.position(-10000, -10000);
    } else if (changingKey !== null) {
        changingKey.value = keyCode;
        changingKey = null;
    }
    if (keyCode == 220) {
        debugMode = !debugMode;
    }
}
function deathMenuClicked() {
    if (buttonClicked(-175, -100, 175, -15) && deathMenu) {
        wealth += time / 8;
        deathsInGame = 0;
        ship.damaged = false;
        deathMenu = false;
        resetWaves();
        time = 0;
        bullets = [];
        missiles = [];
        isLooping = true;
        repair = null;
    }
    if (buttonClicked(-175, 15, 175, 100) && deathMenu) {
        inMainMenu = true;
        deathMenu = false;
        repair = null;
        deathsInGame = 0;
        wealth += time / 8;
    }
    if (buttonClicked(-90, -10, 90, 10) && deathMenu && wealth >= 100 * deathsInGame) {
        ship.damaged = false;
        deathMenu = false;
        bullets = [];
        missiles = [];
        isLooping = true;
        repair = null;
        wealth -= 100 * deathsInGame
    } else {
        console.log("not enough money");
    }
}
let playingSound = false;
function draw() {
    const ts = deltaTime / 1000;
    if (!debugMode) {
        console.clear();
    }
    if (inMainMenu && controllSettings) {
        push();
        background(0);
        imageMode(CENTER);
        let scale = mainMenuBackground.height / height;
        image(mainMenuBackground, 0, 0, mainMenuBackground.width / scale, mainMenuBackground.height / scale);
        pop();
    } else if (inMainMenu && !controllSettings) {

        push();
        background(0);
        imageMode(CENTER);
        let scale = mainMenuBackground.height / height;
        image(mainMenuBackground, 0, 0, mainMenuBackground.width / scale, mainMenuBackground.height / scale);
        buttonDraw(-100, -50, 100, 50, 15);
        pop();

        push();
        textAlign(CENTER);
        textSize(100);
        textFont(inconsolatafont);
        text("PLAY", 0, 30);
        pop();

        push();
        buttonDraw(-75, 60, 75, 110, 10);
        textAlign(CENTER);
        textSize(30);
        textFont(inconsolatafont);
        text("SETTINGS", 0, 95);
        pop();

        if (time > 0) {
            push();
            textFont(inconsolatafont);
            textAlign(CENTER);
            textSize(50);
            text(`You surrvived for ${time.toFixed(3)} seconds!!!`, 0, -height / 2 + 50);
            pop();
        }
    } else {
        if (isLooping && !paused) {
            update(ts);
            time += ts;
        }
        starbackground();

        push();
        textFont(inconsolatafont);
        textAlign(CENTER);
        textSize(50);
        text(`${time.toFixed(3)}s`, 0, -height / 2 + 50);
        pop();



        push();
        {
            translate(ship.position.copy().mult(-1));

            ship.draw();
            for (let missile of missiles) {
                missile.draw();
            }
            for (let bullet of bullets) {
                bullet.draw();
            }

            if (repair !== null) {
                repair.draw();
            }
            for (let money of moneys) {
                money.draw();
            }
        }
        pop();

        for (let missile of missiles) {
            tryDrawOffScreenMarker(warningImage, missile.position);
        }
        for (let money of moneys) {
            tryDrawOffScreenMarker(moneyImage, money.position);
        }

        if (repair !== null)
            tryDrawOffScreenMarker(repairImage, repair.position);
    }

    pauseMenu();
    controlls();

    push();
    imageMode(CENTER);
    image(blankMoneyImage, 0, height / 2 - 100, 100, 100);
    textFont(inconsolatafont);
    textSize(50);
    textAlign(CENTER);
    translate(0, height / 2 - 85);
    rotate(-7);
    text(`$${wealth.toFixed(0)}`, 0, 0);
    pop();

    if (deathMenu) {
        isLooping = false;
        push();
        rectMode(CENTER);
        fill(150, 51, 51, 100);
        rect(0, 0, width, height);
        pop();

        push();
        buttonDraw(-175, -100, 175, -15, 20);
        textFont(inconsolatafont);
        textAlign(CENTER);
        textSize(65);
        text("RETRY", 0, -35);
        pop();

        push();
        buttonDraw(-175, 15, 175, 100, 20);
        textFont(inconsolatafont);
        textAlign(CENTER);
        textSize(65);
        text("MENU", 0, 75);
        pop();

        push();
        buttonDraw(-90, -10, 90, 10, 5);
        textFont(inconsolatafont);
        textAlign(CENTER);
        textSize(25);
        text("RESPAWN", -45, 7);
        text(`${deathsInGame * 100}`, 50, 7);
        imageMode(CENTER);
        image(moneyImage, 15, 0, 25, 25);
        pop();
    }

    if (debugMode) {
        push();
        fill(255, 0, 0, 30);
        rectMode(CORNERS);
        rect(-width, -height, width, height);
        pop();
    }
}



function update(ts) {
    if (!playingSound) {
        backgroundmusic.setVolume(musicVolume);
        backgroundmusic.loop();
        playingSound = true;
    }
    turningLeft = keyIsDown(turnLeftKey.value);
    turningRight = keyIsDown(turnRightKey.value);

    if (mouseIsPressed) {
        let screenX = map(mouseX, 0, width, -width / 2, width / 2);
        if (screenX < 0) {
            turningLeft = true;
            turningRight = false;
        } else if (screenX > 0) {
            turningLeft = false;
            turningRight = true;
        }
    }
    waves(ts);

    for (money of moneys) {
        if (money.position.dist(ship.position) >= 3000) {
            money.position = p5.Vector.random2D().setMag(random(1000, 2000)).add(ship.position);
        }
    }
    ship.update(ts);
    for (let i = 0; i < bullets.length;) {
        bullets[i].update(ts);
        if (bullets[i].despawnTimer <= 0) {
            bullets.splice(i, 1);
            continue;
        }
        if (ship.isColliding(bullets[i])) {
            if (ship.damaged) {
                inMainMenu = true;
                return;
            } else {
                ship.damaged = true;
                repair = new RepairKit(
                    repairImage,
                    p5.Vector.random2D()
                        .setMag(random(2500, 3500))
                        .add(ship.position)
                );
            }
            bullets.splice(i, 1);
            continue;
        }
        i++;
    }

    for (let i = 0; i < missiles.length;) {
        if (!missiles[i].update(ts, ship)) {
            missiles.splice(i, 1);
            continue;
        }
        let wasCollision = false;
        for (let j = i + 1; j < missiles.length; j++) {
            if (missiles[i].isColliding(missiles[j])) {
                let a = missiles[i];
                let b = missiles[j];
                missiles.splice(missiles.indexOf(a), 1);
                missiles.splice(missiles.indexOf(b), 1);
                wasCollision = true;
                break;
            }
        }
        if (wasCollision) {
            continue;
        }
        for (let j = 0; j < bullets.length; j++) {
            if (missiles[i].isColliding(bullets[j])) {
                missiles.splice(i, 1);
                bullets.splice(j, 1);
                wealth += 1;
                window.localStorage.setItem("wealth", `${wealth}`);
                wasCollision = true;
                break;
            }
        }
        if (wasCollision) {
            continue;
        }
        if (ship.isColliding(missiles[i])) {
            if (ship.damaged) {
                deathMenu = true;
                deathsInGame += 1;
                return;
            } else {
                ship.damaged = true;
                repair = new RepairKit(
                    repairImage,
                    p5.Vector.random2D()
                        .setMag(random(2500, 5000))
                        .add(ship.position)
                );
            }
            missiles.splice(i, 1);
            continue;
        }
        i++;
    }

    if (repair !== null) {
        if (ship.isColliding(repair)) {
            ship.damaged = false;
            repair = null;
        }
    }

    for (let i = 0; i < moneys.length;) {
        if (ship.isColliding(moneys[i])) {
            wealth += moneys.length;
            window.localStorage.setItem("wealth", `${wealth}`);
            spawnMoney();
            moneys.splice(i, 1);
            kaching.setVolume(sfxVolume);
            kaching.play();
            continue;
        }
        i++;
    }
}

window.addEventListener("beforeunload", function () {
    backgroundmusic.loop();
    window.localStorage.setItem("wealth", `${wealth}`);
    window.localStorage.setItem("turnLeftKey", `${turnLeftKey.value}`);
    window.localStorage.setItem("turnRightKey", `${turnRightKey.value}`);
    window.localStorage.setItem("SFXVol", `${sfxVolume}`);
    window.localStorage.setItem("MUSICVol", `${musicVolume}`);
});
