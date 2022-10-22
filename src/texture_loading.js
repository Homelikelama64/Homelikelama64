let shipImage;
let shipBoostImage;
let shipDamagedImage;
let shipBoostDamageImage;

let missileV1Image;
let missileV2Image;

let repairImage;
let warningImage;
let stars;

function preload() {
    shipImage = loadImage("images/ships/spaceship.png");
    shipBoostImage = loadImage("images/ships/spaceshipBOOST.png");
    shipDamagedImage = loadImage("images/ships/damaged/spaceshipdamaged.png");
    shipBoostDamageImage = loadImage("images/ships/damaged/spaceshipdamagedboost.png");
    warningImage = loadImage("images/icons/enemywarning.png");
    repairImage = loadImage("images/icons/repair.png");
    missileV1Image = loadImage("images/missiles/missilev1.png");
    missileV2Image = loadImage("images/missiles/missilev2.png");
    stars = loadImage("images/icons/stars.png");
}