class Bullet {
    constructor(
        image,
        position,
        rotation,
        speed,
        drift,
    ) {
        this.image = image;
        this.position = position;
        this.rotation = rotation;
        this.speed = speed;
        this.drift = drift;
        this.maxDespawnTimer = 3;
        this.despawnTimer = this.maxDespawnTimer;
    }

    update(ts) {
        this.despawnTimer -= ts;

        let moveDirection = createVector(0, -1).rotate(this.rotation);
        this.position
            .add(moveDirection.copy().mult(this.speed).mult(ts))
            .add(this.drift.copy().mult(ts));
    }

    draw() {
        push();
        imageMode(CENTER);
        translate(this.position);
        rotate(this.rotation);
        image(
            this.image,
            0,
            0,
            map(this.despawnTimer, 0, this.maxDespawnTimer, 0, 5),
            map(this.despawnTimer, 0, this.maxDespawnTimer, 0, 10));
        pop();
    }
}