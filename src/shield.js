class SheildCollectable {
    constructor(
        image,
        position
    ) {
        this.image = image;
        this.position = position;
    }

    draw() {
        push();
        translate(this.position);
        image(this.image, 0, 0, 25, 25);
        pop();
    }
}