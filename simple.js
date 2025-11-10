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

function preload() {
  // Load all assets here in p5.js
  bg = loadImage("assets/finalpixelsky.png");
  g = loadImage("assets/grassblock.png");
  titleCard = loadImage("assets/finaltitlecard.png");
  endCard = loadImage("assets/endcard.png");
  winCard = loadImage("assets/youwin.png");
  
  heartSound = loadSound("assets/twinklewoosh.wav");
  alienSound = loadSound("assets/alienhit.wav");
  bgMusic = loadSound("assets/ghostwaltz.wav");

  pixelfy = loadFont("assets/pixelfysans.ttf");
}

function setup() {
  createCanvas(800, 400);
  bgy = 0;
  gameState = "START";
  
  bg.resize(width, 0);
  
  person1 = new Person(width / 8, height - 210);
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
  // Background scroll
  image(bg, bgx, bgy);
  image(bg, bgx, bgy - bg.height);
  bgy += 1;
  if (bgy >= bg.height) bgy = 0;
  
  if (!bgMusic.isPlaying()) bgMusic.loop();

  // Player
  person1.move();
  person1.falling();
  person1.display();

  // Alien beam + ground
  image(g, 75, 233, 650, 90);
  fill(55, 235, 52, 70);
  noStroke();
  quad(150, -20, 650, -20, 800, 420, 0, 420);

  // Timer
  elapsedTime = (millis() - startTime) / 1000.0;
  displayTime = round(elapsedTime * 100) / 100.0;
  fill(255);
  textFont(pixelfy);
  textSize(25);
  textAlign(LEFT);
  text("TIME: " + displayTime + "s", 20, 40);

  // Lives
  textAlign(RIGHT);
  text("LIVES REMAINING: " + lives, 780, 40);

  if (elapsedTime >= 120) {
    gameState = "WIN";
    return;
  }

  // Spawn interval changes over time
  spawnTimer += 1.0 / 60.0;
  if (elapsedTime > 100) spawnInterval = 0.5;
  else if (elapsedTime > 80) spawnInterval = 0.9;
  else if (elapsedTime > 60) spawnInterval = 1.0;
  else if (elapsedTime > 40) spawnInterval = 1.5;
  else if (elapsedTime > 20) spawnInterval = 2.0;
  else spawnInterval = 3.0;

  // Spawn obstacles
  if (spawnTimer >= spawnInterval) {
    spawnTimer = 0;
    let sizeIndex = int(random(obstacleSizes.length));
    let w = obstacleSizes[sizeIndex];
    let h = w;
    let yPos = (height - 210) + random(-15, 15);
    let speed = getObstacleSpeed(elapsedTime);
    obstacles.push(new Obstacle(width, yPos, w, h, speed));
  }

  // Move and display obstacles
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

  // Heart logic
  heartTimer += 1.0 / 60.0;
  if (heart === null && heartTimer > nextHeartTime) {
    let heartY = (height - 210) + random(-15, 15);
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
    } else if (heart.isOffScreen()) {
      heart = null;
    }
  }

  if (lives <= 0) gameState = "END";
}

// --- helper functions ---

function getObstacleSpeed(t) {
  if (t < 20) return 3;
  else if (t < 40) return 4;
  else if (t < 60) return 5;
  else if (t < 80) return 6;
  else if (t < 100) return 7;
  else return 8;
}

function personIntersect(p, o) {
  let distanceX = (p.x + p.w / 2) - (o.x + o.w / 2);
  let distanceY = (p.y + p.h / 2) - (o.y + o.h / 2);
  let combinedHalfW = p.w / 2 + o.w / 2;
  let combinedHalfH = p.h / 2 + o.h / 2;
  return (abs(distanceX) < combinedHalfW && abs(distanceY) < combinedHalfH);
}

function personIntersectHeart(p, h) {
  let distanceX = (p.x + p.w / 2) - (h.x + h.w / 2);
  let distanceY = (p.y + p.h / 2) - (h.y + h.h / 2);
  let combinedHalfW = p.w / 2 + h.w / 2;
  let combinedHalfH = p.h / 2 + h.h / 2;
  return (abs(distanceX) < combinedHalfW && abs(distanceY) < combinedHalfH);
}

function startGame() {
  image(titleCard, 0, 0, width, height);
  textAlign(LEFT);
  textFont(pixelfy);
  fill(255, 111, 241);
  text("Click anywhere to play!", 20, 250);

  textSize(14);
  text("Avoid colliding with the aliens \nbefore they take you to space!", 20, 275);

  textSize(12);
  fill(255);
  text("Use the arrow keys to go LEFT and RIGHT. \nPress W to jump.", 20, 310);

  if (mouseIsPressed) {
    gameState = "PLAY";
    startTime = millis();
  }
}

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
  fill(255);
  text("Click anywhere to start again!", width / 2, 255);

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
  fill(255);
  text("That was a close one...\nClick anywhere to start again!", width / 2, 255);

  if (mouseIsPressed) {
    lives = 5;
    resetGame();
    gameState = "PLAY";
    startTime = millis();
  }
}

function resetGame() {
  person1 = new Person(width / 8, height - 210);
  obstacles = [];
  heart = null;
}
