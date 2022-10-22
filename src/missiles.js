class Missile {
    constructor(
        image,
        position,
        rotation,
        speed,
        turningSpeed,
        accuracy
    ) {
        this.image = image;
        this.position = position;
        this.rotation = rotation;
        this.speed = speed;
        this.turningSpeed = turningSpeed;
        this.accuracy = accuracy;
    }
    isColliding(object) {
        console.assert(object instanceof Missile, "Unknown object type");
        return this.position.dist(object.position) < 15;
    }
    update(ts, player_position) {
        let moveDirection = createVector(0, -1).rotate(this.rotation);
        this.position.add(moveDirection.copy().mult(this.speed).mult(ts));

        let angle = player_position
            .copy()
            .sub(this.position)
            .angleBetween(moveDirection);
        if (angle > this.accuracy) {
            this.rotation -= this.turningSpeed * ts;
        } else if (angle < -this.accuracy) {
            this.rotation += this.turningSpeed * ts;
        } else {
            // this.rotation += random(-this.turningSpeed, this.turningSpeed);
        }
    }
    draw() {
        push();
        imageMode(CENTER);
        translate(this.position);
        rotate(this.rotation);
        image(this.image, 0, 0, 20, 20);
        pop();
    }
}