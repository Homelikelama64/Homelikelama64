/** @type {Ship} */
let ship;

/** @type {Missile[]} */
let missiles = [];

/** @type {Bullet[]} */
let bullets = [];

/** @type {RepairKit | null} */
let repair = null;

let inMainMenu = true;

let time = 0;

function setup() {
    let canvas = createCanvas(windowWidth, windowHeight, WEBGL);
    angleMode(DEGREES);

    // drawMainMenu();
    canvas.mousePressed(function () {
        if (inMainMenu) {
            let screenX = map(mouseX, 0, width, -width / 2, width / 2);
            let screenY = map(mouseY, 0, height, -height / 2, height / 2);
            if (screenX >= -100 && screenX <= 100 && screenY >= -50 && screenY <= 50) {
                time = 0;
                resetWaves();
                setupUnits();
                inMainMenu = false;
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
function spawnMissileV2(position, rotation) {
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

        if (time > 0) {
            push();
            textFont(inconsolatafont);
            textAlign(CENTER);
            textSize(50);
            text(`You surrvived
${time.toFixed(3)}s`, 0, -height / 2 + 50);
            pop();
        }
    } else {
        if (isLooping)
            update(ts);

        time += ts;

        starbackground();

        push();
        textFont(inconsolatafont);
        textAlign(CENTER);
        textSize(50);
        text(`${time.toFixed(3)}s`, 0, -height / 2 + 50);
        pop();

        if (keyIsDown(27)) {
            inMainMenu = true;
            return;
        }

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
        }
        pop();

        for (let missile of missiles) {
            tryDrawOffScreenMarker(warningImage, missile.position);
        }

        if (repair !== null)
            tryDrawOffScreenMarker(repairImage, repair.position);
    }
}

function update(ts) {
    waves(ts);
    ship.update(ts, bullets);
    for (let missile of missiles) {
        missile.update(ts, ship);
    }
    for (let i = 0; i < bullets.length;) {
        bullets[i].update(ts);
        if (bullets[i].despawnTimer <= 0) {
            bullets.splice(i, 1);
            continue;
        }
        i++;
    }

    for (let i = 0; i < missiles.length;) {
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
}
