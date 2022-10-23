/** @type {Ship} */
let ship;

/** @type {Missile[]} */
let missiles = [];

/** @type {Bullet[]} */
let bullets = [];

/** @type {RepairKit | null} */
let repair = null;

let inMainMenu = true;

function setup() {
    let canvas = createCanvas(windowWidth, windowHeight, WEBGL);
    // drawMainMenu();
    canvas.mousePressed(function () {
        if (inMainMenu) {
            inMainMenu = false;
            loop();
        }
    });

    angleMode(DEGREES);
    setupShip();
}

function clamp(value, minValue, maxValue) {
    return max(min(value, maxValue), minValue);
}

function setupShip() {
    ship = new Ship(
        300,
        120,
        createVector(0, 0),
        0,
        4,
        100,
        false,
        shipImage,
        shipBoostImage,
        shipDamagedImage,
        shipBoostDamageImage
    );
    for (let i = 0; i < 5; i++) {
        missiles.push(spawnMissileV1(p5.Vector.random2D().setMag(1000), random(360)));
        missiles.push(spawnMissileV2(p5.Vector.random2D().setMag(1000), random(360)));
    }
}

function spawnMissileV1(position, rotation) {
    return new Missile(
        missileV1Image,
        position,
        rotation,
        20,
        400,
        100,
        15,
        false
    );
}
function spawnMissileV2(position, rotation) {
    return new Missile(
        missileV2Image,
        position,
        rotation,
        45,
        800,
        40,
        0,
        true
    );
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

    } else {
        if (isLooping)
            update(ts);

        starbackground();

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
                // TODO: game over
                noLoop();
                break;
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
