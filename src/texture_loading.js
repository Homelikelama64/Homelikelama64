let shipImage;
let shipBoostImage;
let shipDamagedImage;
let shipBoostDamageImage;
let bulletImage;

let missileV1Image;
let missileV2Image;
let missileV3Image;
let missileV3DebImage;

let moneyImage;
let blankMoneyImage;
let repairImage;
let warningImage;
let stars;
let mainMenuBackground;

let inconsolatafont;

function preload() {
    shipImage = loadImage("images/ships/spaceship.png");
    shipBoostImage = loadImage("images/ships/spaceshipBOOST.png");
    shipDamagedImage = loadImage("images/ships/damaged/spaceshipdamaged.png");
    shipBoostDamageImage = loadImage("images/ships/damaged/spaceshipdamagedboost.png");

    bulletImage = loadImage("images/ships/bullet.png");
    warningImage = loadImage("images/icons/enemywarning.png");
    moneyImage = loadImage("images/icons/money.png");
    blankMoneyImage = loadImage("images/icons/blankmoney.png");
    repairImage = loadImage("images/icons/repair.png");

    missileV1Image = loadImage("images/missiles/missilev1.png");
    missileV2Image = loadImage("images/missiles/missilev2.png");
    missileV3Image = loadImage("images/missiles/missilev3.png");
    missileV3DebImage = loadImage("images/missiles/missilev3deb.png");

    stars = loadImage("images/icons/stars.png");
    mainMenuBackground = loadImage("images/icons/mainmenubackground.jpg");

    inconsolatafont = loadFont("fonts/Inconsolata.otf");
}