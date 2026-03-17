let person1;
let heart;

let obstacles = [];
let obstacleSizes = [50, 65, 80];

let gameState;
let lives = 5;

let startTime;
let elapsedTime;
let displayTime;
let heartTimer = 0;
let nextHeartTime;

let spawnTimer = 0;
let spawnInterval = 3.0;

let bg, g, titleCard, endCard, winCard;
let pixelfy;
let bgx = 0, bgy = 0;

let heartSound, alienSound, bgMusic;

let sceneOffset;
let groundY;

// BUTTON FEATURES
let beginBtn;
let beginBtnHover;

let floatT = 0;
let floatSpeed = 0.03;
let floatAmount = 10;

function preload() {
  bg = loadImage("assets/finalpixelsky.png");
  g = loadImage("assets/grassblock.png");
  titleCard = loadImage("assets/titledrawingg.png");
  endCard = loadImage("assets/endcard.png");
  winCard = loadImage("assets/youwin.png");

  // BUTTON IMAGES
  beginBtn = loadImage("assets/beginn.png");
  beginBtnHover = loadImage("assets/begin_hoverr.png");

  heartSound = loadSound("assets/twinklewoosh.wav");
  alienSound = loadSound("assets/alienhit.wav");
  bgMusic = loadSound("assets/ghostwaltz.wav");

  pixelfy = loadFont("assets/pixelfysans.ttf");
}

function setup() {
  createCanvas(800, 580);
  noSmooth();

  sceneOffset = (height - 400) / 2;
  groundY = 280;

  bgy = 0;
  gameState = "START";

  bg.resize(width, 0);

  person1 = new Person(width / 8, groundY);
  heart = null;

  nextHeartTime = random(8, 20);
}

function draw() {
  background(0);

  if (gameState === "START") startGame();
  else if (gameState === "PLAY") playGame();
  else if (gameState === "END") endGame();
  else if (gameState === "WIN") winGame();
}

function playGame() {

  image(bg, bgx, bgy);
  image(bg, bgx, bgy - bg.height);

  bgy += 5;
  if (bgy >= bg.height) bgy = 0;

  if (!bgMusic.isPlaying()) bgMusic.loop();

  // BEAM (background layer)
  fill(55, 235, 52, 70);
  noStroke();
  quad(
    150, -90 + sceneOffset,
    650, -90 + sceneOffset,
    800, height,
    0, height
  );

  // ISLAND
  image(g, 75, 233 + sceneOffset, 650, 90);

  // PLAYER
  person1.move();
  person1.falling();
  person1.display();

  // TIMER
  elapsedTime = (millis() - startTime) / 1000.0;
  displayTime = round(elapsedTime * 100) / 100.0;

  fill(255);
  textFont(pixelfy);
  textSize(25);
  textAlign(LEFT);
  text("TIME: " + displayTime + "s", 20, 40);

  // LIVES
  textAlign(RIGHT);
  text("LIVES REMAINING: " + lives, width - 20, 40);

  if (elapsedTime >= 120) {
    gameState = "WIN";
    return;
  }

  spawnTimer += 1.0 / 60.0;

  if (elapsedTime > 100) spawnInterval = 0.5;
  else if (elapsedTime > 80) spawnInterval = 0.9;
  else if (elapsedTime > 60) spawnInterval = 1.0;
  else if (elapsedTime > 40) spawnInterval = 1.5;
  else if (elapsedTime > 20) spawnInterval = 2.0;
  else spawnInterval = 3.0;

  if (spawnTimer >= spawnInterval) {
    spawnTimer = 0;

    let sizeIndex = int(random(obstacleSizes.length));
    let w = obstacleSizes[sizeIndex];
    let h = w;

    let yPos = groundY + random(-15, 15);
    let speed = getObstacleSpeed(elapsedTime);

    obstacles.push(new Obstacle(width, yPos, w, h, speed));
  }

  for (let i = obstacles.length - 1; i >= 0; i--) {
    let obs = obstacles[i];

    obs.move();
    obs.display();

    if (personIntersect(person1, obs)) {
      if (alienSound.isPlaying()) alienSound.stop();
      alienSound.play();

      lives--;
      resetGame();
      break;
    }

    if (obs.isOffScreen()) obstacles.splice(i, 1);
  }

  heartTimer += 1.0 / 60.0;

  if (heart === null && heartTimer > nextHeartTime) {
    let heartY = groundY + random(-15, 15);

    heart = new Heart(width, heartY, 40, 40, random(2, 4));

    heartTimer = 0;
    nextHeartTime = random(8, 20);
  }

  if (heart !== null) {
    heart.move();
    heart.display();

    if (personIntersectHeart(person1, heart)) {
      if (heartSound.isPlaying()) heartSound.stop();
      heartSound.play();

      lives = min(lives + 1, 5);
      heart = null;
    } else if (heart.isOffScreen()) heart = null;
  }

  if (lives <= 0) gameState = "END";
}


// TITLE SCREEN
function startGame() {

  image(titleCard, 0, 0, width, height);

  // FLOATING CHARACTER
  floatT += floatSpeed;

  let floatX = width * 0.75;
  let floatY = 350 + sin(floatT) * floatAmount; // lower

push();
translate(floatX, floatY);
rotate(radians(-45));
image(person1.sprite, -40, -40, 80, 80);
pop();

  // BUTTON
  let btnW = 220;
  let btnH = 90;

  let btnX = 60
  let btnY = 350

  let hovering =
    mouseX > btnX &&
    mouseX < btnX + btnW &&
    mouseY > btnY &&
    mouseY < btnY + btnH;

  if (hovering) {
    image(beginBtnHover, btnX, btnY, btnW, btnH);
    cursor(HAND);
  } else {
    image(beginBtn, btnX, btnY, btnW, btnH);
    cursor(ARROW);
  }

  if (hovering && mouseIsPressed) {
    gameState = "PLAY";
    startTime = millis();
  }
}


// END / WIN

function endGame() {
  image(endCard, 0, 0, width, height);

  textAlign(CENTER);
  textSize(70);
  fill(255, 111, 241);
  text("GAME OVER", width / 2, height / 2);

  fill(255);
  textSize(20);
  text("Time survived: " + displayTime + "s", width / 2, 230);

  textSize(14);
  text("Click anywhere to restart", width / 2, 255);

  if (mouseIsPressed) {
    bgMusic.stop();
    lives = 5;
    resetGame();
    gameState = "PLAY";
    startTime = millis();
  }
}

function winGame() {
  image(winCard, 0, 0, width, height);

  textAlign(CENTER);
  textSize(70);
  fill(255, 111, 241);
  text("YOU WIN!", width / 2, height / 2);

  fill(255);
  textSize(20);
  text("Time survived: " + displayTime + "s", width / 2, 230);

  textSize(14);
  text("Click to play again", width / 2, 255);

  if (mouseIsPressed) {
    lives = 5;
    resetGame();
    gameState = "PLAY";
    startTime = millis();
  }
}


// HELPERS

function getObstacleSpeed(t) {
  if (t < 20) return 3;
  else if (t < 40) return 4;
  else if (t < 60) return 5;
  else if (t < 80) return 6;
  else if (t < 100) return 7;
  else return 8;
}

function personIntersect(p, o) {
  let dx = (p.x + p.w / 2) - (o.x + o.w / 2);
  let dy = (p.y + p.h / 2) - (o.y + o.h / 2);

  return abs(dx) < (p.w / 2 + o.w / 2) &&
         abs(dy) < (p.h / 2 + o.h / 2);
}

function personIntersectHeart(p, h) {
  let dx = (p.x + p.w / 2) - (h.x + h.w / 2);
  let dy = (p.y + p.h / 2) - (h.y + h.h / 2);

  return abs(dx) < (p.w / 2 + h.w / 2) &&
         abs(dy) < (p.h / 2 + h.h / 2);
}

function resetGame() {
  person1 = new Person(width / 8, groundY);
  obstacles = [];
  heart = null;
}