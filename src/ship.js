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
    }

    isColliding(object) {
        if (object instanceof Missile) {
            return this.position.dist(object.position) < 40;
        } else if (object instanceof RepairKit) {
            return this.position.dist(object.position) < 40;
        } else {
            console.error("Unknown object type");
            return false;
        }
    }

    update(ts) {
        if (keyIsDown(65)) { // a
            this.rotation -= this.turningSpeed * ts;
        }
        if (keyIsDown(68)) { // d
            this.rotation += this.turningSpeed * ts;
        }
        this.position.add(createVector(0, -this.speed).rotate(this.rotation).mult(ts));
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
