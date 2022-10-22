/** @type {Ship} */
let ship;
let shipImage;
let shipBoostImage;
let shipDamagedImage;
let shipBoostDamageImage;

let missileV1Image;
let missileV2Image;
/** @type {Missile[]} */
let missiles = [];

let repairImage;
/** @type {RepairKit | null} */
let repair = null;
let warningImage;
let stars;

function preload() {
    shipImage = loadImage("images/ships/spaceship.png");
    shipBoostImage = loadImage("images/ships/spaceshipBOOST.png");
    shipDamagedImage = loadImage("images/ships/damaged/spaceshipdamaged.png");
    shipBoostDamageImage = loadImage("images/ships/damaged/spaceshipdamagedboost.png");
    warningImage = loadImage("images/icons/enemywarning.png");
    repairImage = loadImage("images/icons/repair.png");
    missileV1Image = loadImage("images/missiles/missilev1.png");
    missileV2Image = loadImage("images/missiles/missilev2.png");
    stars = loadImage("images/icons/stars.png");
}

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
        30
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
        5
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
        ship.update(ts);
        for (let missile of missiles) {
            missile.update(ts, ship.position);
        }

        for (let i = 0; i < missiles.length;) {
            let wasCollision = false;
            for (let j = i + 1; j < missiles.length;) {
                if (missiles[i].isColliding(missiles[j])) {
                    let a = missiles[i];
                    let b = missiles[j];
                    missiles.splice(missiles.indexOf(a), 1);
                    missiles.splice(missiles.indexOf(b), 1);
                    wasCollision = true;
                    break;
                }
                j++;
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
                    repair = new RepairKit(repairImage, p5.Vector.random2D().setMag(1000));
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

        starbackground();

        push();
        {
            translate(ship.position.copy().mult(-1));

            ship.draw();
            for (let missile of missiles) {
                missile.draw();
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
