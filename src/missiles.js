class Missile {
    constructor(
        image,
        position,
        rotation,
        size,
        speed,
        turningSpeed,
        accuracy,
        predictive
    ) {
        this.image = image;
        this.position = position;
        this.rotation = rotation;
        this.size = size;
        this.speed = speed;
        this.turningSpeed = turningSpeed;
        this.accuracy = accuracy;
        this.predictive = predictive;
    }
    isColliding(object) {
        if (object instanceof Missile) {
            return this.position.dist(object.position) < (this.size / 2 + object.size / 2);
        } else if (object instanceof Bullet) {
            return this.position.dist(object.position) < (this.size / 2 + 10 / 2);
        } else {
            console.error("Unknown object type");
            return false;
        }
    }
    update(ts, player) {
        console.assert(player instanceof Ship, "player must be a Ship");
        let targetPos = player.position;
        if (this.predictive) {
            // predictive position
            let playerMoveDirection = createVector(0, -1).rotate(player.rotation).mult(player.speed);
            for (let i = 0; i < 10; i++) {
                let timeToReachPlayer = targetPos.dist(this.position) / this.speed;
                targetPos = playerMoveDirection.copy().mult(timeToReachPlayer).add(player.position);
            }
        }

        let moveDirection = createVector(0, -1).rotate(this.rotation);
        let angle = targetPos
            .copy()
            .sub(this.position)
            .angleBetween(moveDirection);
        if (angle > this.accuracy) {
            this.rotation -= this.turningSpeed * ts;
        } else if (angle < -this.accuracy) {
            this.rotation += this.turningSpeed * ts;
        }

        if (this.image === missileV3Image && ship.position.dist(this.position) < 70) {
            console.log("fire");
        }
        this.position.add(moveDirection.copy().mult(this.speed).mult(ts));
    }
    draw() {
        push();
        imageMode(CENTER);
        translate(this.position);
        rotate(this.rotation);
        image(this.image, 0, 0, this.size, this.size);
        pop();
    }
}