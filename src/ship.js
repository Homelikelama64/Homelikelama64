class Ship {
    constructor(
        speed,
        turningSpeed,
        position,
        rotation,
        boost,
        boostAmount,
        damaged,
        image,
        boostImage,
        damagedImage,
        boostDamageImage,
        shieldToggle,
        shipShieldImage
    ) {
        this.speed = speed;
        this.turningSpeed = turningSpeed;
        this.position = position;
        this.rotation = rotation;
        this.boost = boost;
        this.boostAmount = boostAmount;
        this.damaged = damaged;
        this.image = image;
        this.boostImage = boostImage;
        this.damagedImage = damagedImage;
        this.boostDamageImage = boostDamageImage;
        this.fireDelay = 0.075;
        this.fireTimer = this.fireDelay;
        this.shootLeft = true;
        this.shieldToggle = shieldToggle;
        this.shipShieldImage = shipShieldImage;
    }

    isColliding(object) {
        if (object instanceof Missile) {
            return this.position.dist(object.position) < (object.size / 2 + 50 / 2);
        } else if (object instanceof RepairKit) {
            return this.position.dist(object.position) < 40;
        } else if (object instanceof SheildCollectable) {
            return this.position.dist(object.position) < 40;
        } else if (object instanceof Money) {
            return this.position.dist(object.position) < 40;
        } else if (object instanceof Bullet) {
            return this.position.dist(object.position) < 20 && object.is_enemy;
        } else {
            console.error("Unknown object type");
            return false;
        }
    }

    update(ts) {
        if (turningLeft) {
            this.rotation -= this.turningSpeed * ts;
        }
        if (turningRight) {
            this.rotation += this.turningSpeed * ts;
        }
        let forward = createVector(0, -1).rotate(this.rotation);
        let movement = forward.copy().mult(this.speed);
        this.position.add(movement.copy().mult(ts));

        this.fireTimer -= ts;
        while (this.fireTimer <= 0) {
            let aimingAtMissile = false;
            for (let missile of missiles) {
                let shipToMissile = missile.position.copy().sub(this.position);
                if (Math.abs(forward.angleBetween(shipToMissile)) < 15 && ship.position.dist(missile.position) < 1200) {
                    aimingAtMissile = true;
                    break;
                }
            }
            if (aimingAtMissile) {
                this.fireTimer += this.fireDelay;
                if (this.shootLeft) {
                    bullets.push(new Bullet(
                        bulletImage,
                        this.position.copy().add(forward.copy().mult(14).rotate(-45)),
                        this.rotation,
                        300,
                        movement,
                        2,
                        false,
                        createVector(5, 10)
                    ));
                } else {
                    bullets.push(new Bullet(
                        bulletImage,
                        this.position.copy().add(forward.copy().mult(14).rotate(45)),
                        this.rotation,
                        300,
                        movement,
                        2,
                        false,
                        createVector(5, 10)
                    ));
                }
                this.shootLeft = !this.shootLeft;
            } else {
                this.fireTimer = 0;
                break;
            }
        }
    }

    draw() {
        push();
        translate(this.position);
        rotate(this.rotation);
        imageMode(CENTER);
        if (this.damaged) {
            image(this.damagedImage, 0, 0, 50, 50);
        } else {
            image(this.image, 0, 0, 50, 50);
        }
        if (this.shieldToggle) {
            image(shieldImage, 0, 0, 55, 55);
        }
        pop();
    }
}
