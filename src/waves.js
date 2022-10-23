let v1Timer = 0;
let v2Timer = 0;

function resetWaves() {
    v1Timer = 0;
    v2Timer = 0;
}

function waves(ts) {
    v1Timer += ts;
    while (v1Timer >= 6) {
        v1Timer -= 6;
        spawnMissileV1();
    }
    v2Timer += ts;
    while (v2Timer >= 23) {
        v2Timer -= 23;
        spawnMissileV2();
    }
}
