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
  // Images
  bg = loadImage("finalpixelsky.png");
  g = loadImage("grassblock.png");
  titleCard = loadImage("finaltitlecard.png");
  endCard = loadImage("endcard.png");
  winCard = loadImage("youwin.png");

  // Fonts
  pixelfy = loadFont("pixelfysans.ttf");

  // Sounds
  heartSound = loadSound("twinklewoosh.wav");
  alienSound = loadSound("alienhit.wav");
  bgMusic = loadSound("ghostwaltz.wav");
}

function setup() {
  createCanvas(800, 400);
  bgy = 0;
  gameState = "START";
  nextHeartTime = random(8, 20);

  person1 = new Person(width / 8, height - 210);
  heart = null;
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
  bgy += 5;
  if (bgy >= bg.height) bgy = 0;

  if (!bgMusic.isPlaying()) bgMusic.loop();

  // Player movement & display
  person1.move();
  person1.falling();
  person1.display();

  // Alien abduction beam
  image(g, 75, 233, 650, 90);
  fill(55, 235, 52, 70);
  quad(150, -20, 650, -20, 800, 420, 0, 420);
  strokeWeight(5);
  stroke(55, 235, 52, 80);

  // Timer
  elapsedTime = (millis() - startTime) / 1000.0;
  displayTime = Math.round(elapsedTime * 100) / 100.0;
  fill(255);
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

  // Changing spawn rate
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
    let yPos = height - 210 + random(-15, 15);
    let speed = getObstacleSpeed(elapsedTime);
    obstacles.push(new Obstacle(width, yPos, w, h, speed));
  }

  // Obstacle movement & display
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
  if (!heart && heartTimer > nextHeartTime) {
    let heartY = height - 210 + random(-15, 15);
    heart = new Heart(width, heartY, 40, 40, random(2, 4));
    heartTimer = 0;
    nextHeartTime = random(8, 20);
  }

  if (heart) {
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

function getObstacleSpeed(t) {
  if (t < 20) return 3;
  else if (t < 40) return 4;
  else if (t < 60) return 5;
  else if (t < 80) return 6;
  else if (t < 100) return 7;
  else return 8;
}

function personIntersect(person, obstacle) {
  let distanceX = (person.x + person.w / 2) - (obstacle.x + obstacle.w / 2);
  let distanceY = (person.y + person.h / 2) - (obstacle.y + obstacle.h / 2);
  let combinedHalfW = person.w / 2 + obstacle.w / 2;
  let combinedHalfH = person.h / 2 + obstacle.h / 2;
  return abs(distanceX) < combinedHalfW && abs(distanceY) < combinedHalfH;
}

function personIntersectHeart(person, heart) {
  let distanceX = (person.x + person.w / 2) - (heart.x + heart.w / 2);
  let distanceY = (person.y + person.h / 2) - (heart.y + heart.h / 2);
  let combinedHalfW = person.w / 2 + heart.w / 2;
  let combinedHalfH = person.h / 2 + heart.h / 2;
  return abs(distanceX) < combinedHalfW && abs(distanceY) < combinedHalfH;
}

function startGame() {
  image(titleCard, 0, 0, width, height);
  textAlign(LEFT);
  textFont(pixelfy);
  fill(255, 111, 241);
  text("Click anywhere to play!", 20, 250);

  textSize(14);
  fill(255);
  text("Avoid colliding with the aliens \nbefore they take you to space!", 20, 275);

  textSize(12);
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
  text("Click anywhere to start again!", width / 2, 255);

  if (mouseIsPressed) {
    if (bgMusic.isPlaying()) bgMusic.stop();
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

class Heart {
  constructor(x_, y_, w_, h_, speed_) {
    this.x = x_;
    this.y = y_;
    this.startY = y_;
    this.w = w_;
    this.h = h_;
    this.t = 0;
    this.speed = speed_;
    this.sprite = loadImage("finalheart.png");
  }

  move() {
    this.x -= this.speed;
    this.t += 0.05;
    this.y = this.startY + sin(this.t * 1.7) * 20 + cos(this.t * 0.8) * 10;
  }

  display() {
    if (this.sprite) image(this.sprite, this.x, this.y, this.w, this.h);
    else {
      fill(255, 0, 0);
      rect(this.x, this.y, this.w, this.h);
    }
  }

  isOffScreen() {
    return this.x + this.w < 0;
  }
}

class Obstacle {
  constructor(x_, y_, w_, h_, speed_) {
    this.x = x_;
    this.y = y_;
    this.w = w_;
    this.h = h_;
    this.speed = speed_;
    this.t = 0;
    this.startY = y_;

    if (w_ === 50) this.sprite = loadImage("greenalien.png");
    else if (w_ === 65) this.sprite = loadImage("bluealien.png");
    else if (w_ === 80) this.sprite = loadImage("purplealien.png");
  }

  move() {
    this.x -= this.speed;
    this.t += 0.05;
    this.y = this.startY + sin(this.t * 1.7) * 20 + cos(this.t * 0.8) * 10;
  }

  display() {
    image(this.sprite, this.x, this.y, this.w, this.h);
  }

  isOffScreen() {
    return this.x + this.w < 0;
  }
}

class Person {
  constructor(x_, y_) {
    this.x = x_;
    this.y = y_;
    this.vy = 0;
    this.gravity = 0.6;
    this.w = 50;
    this.h = 50;
    this.speed = 10;
    this.isJumping = false;
    this.isFalling = false;
    this.facingRight = true;

    this.sprite = loadImage("pinkgirly.png");
    this.sprite.resize(this.w, this.h);
  }

  move() {
    if (keyIsDown(LEFT_ARROW) && this.x > 50) {
      this.x -= this.speed;
      this.facingRight = false;
    }
    if (keyIsDown(RIGHT_ARROW) && this.x < 700) {
      this.x += this.speed;
      this.facingRight = true;
    }
  }

  falling() {
    if (this.isFalling) {
      this.vy += this.gravity;
      this.y += this.vy;

      if (this.y >= height - 210) {
        this.y = height - 210;
        this.vy = 0;
        this.isFalling = false;
      }
    }
  }

  display() {
    push();
    if (!this.facingRight) {
      translate(this.x + this.w, this.y);
      scale(-1, 1);
      image(this.sprite, 0, 0, this.w, this.h);
    } else {
      image(this.sprite, this.x, this.y, this.w, this.h);
    }
    pop();
  }
}
