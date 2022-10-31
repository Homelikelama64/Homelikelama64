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
        boostDamageImage
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
        this.fireDelay = 0.2;
        this.fireTimer = this.fireDelay;
    }

    isColliding(object) {
        if (object instanceof Missile) {
            return this.position.dist(object.position) < (object.size / 2 + 50 / 2);
        } else if (object instanceof RepairKit) {
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
            this.fireTimer += this.fireDelay;
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
        pop();
    }
}
