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
let paused = false;

let time = 0;

let turningLeft = false;
let turningRight = false;

function setup() {
    let canvas = createCanvas(windowWidth, windowHeight, WEBGL);
    angleMode(DEGREES);

    let loadedWealth = window.localStorage.getItem("wealth");
    if (loadedWealth !== null && loadedWealth !== undefined) {
        wealth = parseInt(loadedWealth);
    } else {
        wealth = 0;
    }

    // drawMainMenu();
    canvas.mousePressed(function () {
        let screenX = map(mouseX, 0, width, -width / 2, width / 2);
        let screenY = map(mouseY, 0, height, -height / 2, height / 2);
        if (inMainMenu) {
            if (screenX >= -100 && screenX <= 100 && screenY >= -50 && screenY <= 50) {
                time = 0;
                resetWaves();
                setupUnits();
                inMainMenu = false;
            }
        }
        if (paused == true && !inMainMenu) {
            if (screenX >= -175 && screenX <= 175 && screenY >= -170 && screenY <= -70) {
                paused = false
            }
        } 
        if (paused == true && !inMainMenu) {
            if (screenX >= -175 && screenX <= 175 && screenY >= -50 && screenY <= 50) {
                inMainMenu = true
                paused = false;
            }
        }
        if (paused == true && !inMainMenu) {
            if (screenX >= -175 && screenX <= 175 && screenY >= 70 && screenY <= 170) {
                console.log("not done yet")
                // TODO:
            }
        }
    });
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
        120,
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
    if (keyCode == 27 && !inMainMenu) {
        paused = !paused;
    }
}
function draw() {
    const ts = deltaTime / 1000;
    if (inMainMenu) {

        push();
        background(0);
        imageMode(CENTER);
        let scale = mainMenuBackground.height / height;
        image(mainMenuBackground, 0, 0, mainMenuBackground.width / scale, mainMenuBackground.height / scale);
        fill(51);
        rectMode(CORNERS);
        rect(-100, -50, 100, 50);
        pop();

        push();
        textAlign(CENTER);
        textSize(100);
        textFont(inconsolatafont);
        text("PLAY", 0, 30);
        pop();

        push();
        textAlign(CENTER);
        textSize(30);
        textFont(inconsolatafont);
        textStyle(BOLD);
        text("CONTROLS:", width / 2 - 100, 0);
        text("A and D to turn the ship", width / 2 - 180, 30);
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
    if (paused == true) {
        push();
        rectMode(CENTER);
        fill(51, 128);
        rect(0, 0, width, height);
        pop();

        push();
        rectMode(CORNERS);
        fill(51);
        rect(200, 200, -200, -200);
        pop();


        push();
        translate(0, -120);
        rectMode(CORNERS);
        fill(51);
        rect(-175, -50, 175, 50);
        pop();

        push();
        translate(0, -100);
        textFont(inconsolatafont);
        textAlign(CENTER);
        textSize(70);
        text("RESUME", 0, 0);
        pop();

        push();
        translate(0, 0);
        rectMode(CORNERS);
        fill(51);
        rect(-175, -50, 175, 50);
        pop();

        push();
        translate(0, 20);
        textFont(inconsolatafont);
        textAlign(CENTER);
        textSize(70);
        text("MAIN MENU", 0, 0);
        pop();

        push();
        translate(0, 120);
        rectMode(CORNERS);
        fill(51);
        rect(-175, -50, 175, 50);
        pop();

        push();
        translate(0, 140);
        textFont(inconsolatafont);
        textAlign(CENTER);
        textSize(70);
        text("SETTINGS", 0, 0);
        pop();
    }
    push();
    imageMode(CENTER);
    image(blankMoneyImage, 0, height / 2 - 100, 100, 100);
    textFont(inconsolatafont);
    textSize(50);
    textAlign(CENTER);
    translate(0, height / 2 - 85);
    rotate(-7);
    text(`$${wealth}`, 0, 0);
    pop();
}



function update(ts) {
    wealth = wealth || 0;
    turningLeft = keyIsDown(65);
    turningRight = keyIsDown(68);

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
                wasCollision = true;
                break;
            }
        }
        if (wasCollision) {
            continue;
        }
        if (ship.isColliding(missiles[i])) {
            if (ship.damaged) {
                inMainMenu = true;
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
            wealth += 3;
            spawnMoney();
            moneys.splice(i, 1);
            kaching.play();
            continue;
        }
        i++;
    }
}

window.addEventListener("beforeunload", function () {
    window.localStorage.setItem("wealth", `${wealth}`);
});
