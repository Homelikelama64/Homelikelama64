function starbackground() {
    push();
    texture(stars);
    textureWrap(REPEAT);

    let backgroundSize = height * 1.5;
    if (width > height) {
        backgroundSize = width * 1.5;
    }

    let u = ship.position.x / backgroundSize;
    let v = ship.position.y / backgroundSize;

    beginShape(TRIANGLES);
    vertex(-backgroundSize / 2, -backgroundSize / 2, 0, u, v);
    vertex(backgroundSize / 2, -backgroundSize / 2, 0, u + 1, v);
    vertex(backgroundSize / 2, backgroundSize / 2, 0, u + 1, v + 1);

    vertex(backgroundSize / 2, backgroundSize / 2, 0, u + 1, v + 1);
    vertex(-backgroundSize / 2, backgroundSize / 2, 0, u, v + 1);
    vertex(-backgroundSize / 2, -backgroundSize / 2, 0, u, v);
    endShape();
    pop();
}