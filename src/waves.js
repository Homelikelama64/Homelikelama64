let v1Timer = 0;
let v2Timer = 0;
let v3Timer = 0

let v1DelayTimer = 6;
let v2DelayTimer = 23;
let v3DelayTimer = 60

let moneyspawntime = 0;
let moneyspawntimedelay = 40;

function resetWaves() {
    v1Timer = 0;
    v1DelayTimer = 6;
    v2Timer = 0;
    v2DelayTimer = 23;
    v3Timer = 0;
    v3DelayTimer = 60;

    moneyspawntime = 0;
    moneyspawntimedelay = 40;
}

function waves(ts) {
    moneyspawntime += ts;
    while (moneyspawntime >= moneyspawntimedelay) {
        moneyspawntime -= moneyspawntimedelay;
        spawnMoney();
        moneyspawntimedelay = max(moneyspawntimedelay - 5, 20);
    }
    v1Timer += ts;
    while (v1Timer >= v1DelayTimer) {
        v1Timer -= v1DelayTimer;
        spawnMissileV1();
        v1DelayTimer = max(v1DelayTimer - 0.07, 2);
    }
    v2Timer += ts;
    while (v2Timer >= v2DelayTimer) {
        v2Timer -= v2DelayTimer;
        spawnMissileV2();
        v2DelayTimer = max(v2DelayTimer - 0.05, 6);
    }
    v3Timer += ts;
    while (v3Timer >= v3DelayTimer) {
        v3Timer -= v3DelayTimer;
        spawnMissileV3();
        v3DelayTimer = max(v3DelayTimer - 3, 45);
    }
}
