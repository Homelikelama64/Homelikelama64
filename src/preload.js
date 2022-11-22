let shipImage;
let shipBoostImage;
let shipDamagedImage;
let shipBoostDamageImage;
let bulletImage;

let missileV1Image;
let missileV2Image;
let missileV3Image;
let missileV3DebImage;
let missileV3Imagebullet;

let moneyImage;
let blankMoneyImage;
let repairImage;
let warningImage;
let xImage;

let stars;
let mainMenuBackground;

let inconsolatafont;

let kaching;
let beepSound;
let backgroundmusic;
let clickSound;

function preload() {
    soundFormats('mp3', 'ogg');

    shipImage = loadImage("images/ships/spaceship.png");
    shipBoostImage = loadImage("images/ships/spaceshipBOOST.png");
    shipDamagedImage = loadImage("images/ships/damaged/spaceshipdamaged.png");
    shipBoostDamageImage = loadImage("images/ships/damaged/spaceshipdamagedboost.png");

    bulletImage = loadImage("images/ships/bullet.png");
    warningImage = loadImage("images/icons/enemywarning.png");
    moneyImage = loadImage("images/icons/money.png");
    blankMoneyImage = loadImage("images/icons/blankmoney.png");
    repairImage = loadImage("images/icons/repair.png");
    xImage = loadImage("images/icons/X.png");

    missileV1Image = loadImage("images/missiles/missilev1.png");
    missileV2Image = loadImage("images/missiles/missilev2.png");
    missileV3Image = loadImage("images/missiles/missilev3.png");
    missileV3DebImage = loadImage("images/missiles/missilev3deb.png");
    missileV3Imagebullet = loadImage("images/missiles/missilev3bullet.png");

    stars = loadImage("images/backgrounds/stars.png");
    mainMenuBackground = loadImage("images/backgrounds/mainmenubackground.png");

    inconsolatafont = loadFont("fonts/Inconsolata.otf");

    kaching = loadSound("sounds/Kaching.mp3");
    beepSound = loadSound("sounds/beep.mp3");
    backgroundmusic = loadSound("sounds/spacebackgroundmusic.mp3");
    clickSound = loadSound("sounds/click.mp3");
}