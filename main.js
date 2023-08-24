// set the canvas
let canvas;
let ctx;
canvas = document.createElement("canvas");
ctx = canvas.getContext("2d");
canvas.width = 400;
canvas.height = 700;
document.body.appendChild(canvas);

let backgroundImage, spaceShipImage, BulletImage, enemyImage, gameOverImage;
let gameOver = false;
let score = 0;

//우주선 좌표
let spaceShipX = canvas.width / 2 - 32;
let spaceShipY = canvas.height - 64;

let bulletList = []; // 총알을 저장하는 리스트
function Bullet() {
  this.x = 0;
  this.y = 0;
  this.init = function () {
    this.x = spaceShipX + 20;
    this.y = spaceShipY;
    this.alive = true;
    bulletList.push(this);
  };
  this.update = function () {
    this.y -= 7;
  };
  this.range = function () {
    for (let i = 0; i < bulletList.length; i++) {
      if (this.y <= 1) {
        this.alive = false;
      }
    }
  }
  this.checkHit = function () {
    for (let i = 0; i < enemyList.length; i++) {
      if (this.y <= enemyList[i].y &&
        this.x >= enemyList[i].x &&
        this.x <= enemyList[i].x + 40
      ) {
        score++;
        this.alive = false;
        enemyList.splice(i, 1);
      }
    }
  }
}
function generateRandomValue(min, max) {
  let randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
  return randomNumber;
}

let enemyList = [];
function Enemy() {
  this.x = 0;
  this.y = 0;
  this.init = function () {
    this.y = 0;
    this.x = generateRandomValue(0, canvas.width - 64);
    enemyList.push(this);
  }
  this.update = function () {
    this.y += 3; // 적군 속도 조절

    if (this.y >= canvas.height - 64) {
      gameOver = true;
    }
  }
}

function loadImage() {
  backgroundImage = new Image();
  backgroundImage.src = "images/background.jpg";

  spaceShipImage = new Image();
  spaceShipImage.src = "/images/spaceShip.png";

  gameOverImage = new Image();
  gameOverImage.src = "images/gameover.png";

  BulletImage = new Image();
  BulletImage.src = "images/bullet.png";

  enemyImage = new Image();
  enemyImage.src = "images/enemy.png";
}

let keysDown = {};
function setupKeyboardListener() {
  document.addEventListener("keydown", function (event) {


    keysDown[event.keyCode] = true;
  });
  document.addEventListener("keyup", function (event) {
    delete keysDown[event.keyCode];

    if (event.keyCode == 32) {
      createBullet() //총알 생성
    }
  })
}

function createBullet() {
  console.log('총알')
  let b = new Bullet(); //총알 한개 생성
  b.init();
}

let sec = 1000;
function createEnemy() {
  const interval = setInterval(function () {
    let e = new Enemy();
    e.init();
    let scoreVal = score*5
    sec = sec - scoreVal;
  }, sec)
};



function update() {
  if (39 in keysDown) {
    spaceShipX += 3; // 우주선 속도
  }
  if (37 in keysDown) {
    spaceShipX -= 3; // 우주선 속도
  }
  if (spaceShipX <= 0) {
    spaceShipX = 0;
  }
  if (spaceShipX >= canvas.width - 64) {
    spaceShipX = canvas.width - 64;
  }
  //총알 발사!
  for (let i = 0; i < bulletList.length; i++) {
    if (bulletList[i].alive) {
      bulletList[i].update();
      bulletList[i].checkHit();
      bulletList[i].range();
    }
  }
  for (let i = 0; i < enemyList.length; i++) {
    enemyList[i].update();
  }
}

function render() {
  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height)
  ctx.drawImage(spaceShipImage, spaceShipX, spaceShipY)
  ctx.fillText(`Score: ${score}`, 10, 20);
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  for (let i = 0; i < bulletList.length; i++) {
    if (bulletList[i].alive) {
      ctx.drawImage(BulletImage, bulletList[i].x, bulletList[i].y);
    }
  }
  for (let i = 0; i < enemyList.length; i++) {
    ctx.drawImage(enemyImage, enemyList[i].x, enemyList[i].y)
  }
}

function main() {
  if (!gameOver) {
    update();
    render();
    requestAnimationFrame(main);
  } else {
    ctx.drawImage(gameOverImage, 72, 220, 256, 256);
  }
}

loadImage();
setupKeyboardListener();
createEnemy();
main();
