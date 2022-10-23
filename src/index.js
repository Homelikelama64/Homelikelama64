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

let time = 0;

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
    waves(ts);
    for (money of moneys) {
        if (money.position.dist(ship.position) >= 3000) {
            money.position = p5.Vector.random2D().setMag(random(1000, 2000)).add(ship.position)
        }
    }
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

    for (let i = 0; i < moneys.length;) {
        if (ship.isColliding(moneys[i])) {
            wealth += 1;
            spawnMoney();
            moneys.splice(i, 1);
            continue;
        }
        i++;
    }
}

window.addEventListener("beforeunload", function () {
    window.localStorage.setItem("wealth", `${wealth}`);
});
