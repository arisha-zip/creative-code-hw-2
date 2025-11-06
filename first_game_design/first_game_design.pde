Person person1;
Heart heart;

import processing.sound.*;

ArrayList<Obstacle> obstacles; // list of all my obstacles, needed since I want to have variety
int[] obstacleSizes = {50, 65, 80}; // different obstacle sizes

String gameState;
int lives = 5;

float startTime;
float elapsedTime; //tracks seconds since game starts
float displayTime;
float heartTimer = 0; //tracks time since last heart showed up
float nextHeartTime = random(8, 20); //another heart will appear in between the next 8-10 seconds

float spawnTimer = 0; // time since last obstacle
float spawnInterval = 3.0; //initial interval in seconds

PImage bg;//sky background
PImage g; //grass earth chunk 
PImage titleCard;
PImage endCard;
PImage winCard;
PFont pixelfy;
float bgx, bgy;

SoundFile heartSound;
SoundFile alienSound;
SoundFile bgMusic; 

void setup() {
  size(800, 400);
  bgy = 0; // focusing on y since i'm doing a vertical background scroll
    
  gameState = "START"; //start screen 

  //ADDING IN MY ILLUSTRATIONS/IMAGES
  bg = loadImage("finalpixelsky.png");
  bg.resize(width, 0); 
  g = loadImage("grassblock.png");
  titleCard = loadImage("finaltitlecard.png");
  endCard = loadImage("endcard.png");
  winCard = loadImage("youwin.png");
  pixelfy = createFont("pixelfysans.ttf", 25);

  person1 = new Person(width/8, height-210); 
  obstacles = new ArrayList<Obstacle>(); 
  heart = null; //no hearts will appear on screen for now
  
  //ADDING IN MY SOUNDS
  heartSound = new SoundFile(this, "twinklewoosh.wav");
  alienSound = new SoundFile(this, "alienhit.wav");
  bgMusic = new SoundFile(this, "ghostwaltz.wav");
}

void draw() {
  background(0);

  //OUTLINING MY GAME STATES
  if (gameState.equals("START")) startGame();
  else if (gameState.equals("PLAY")) playGame();
  else if (gameState.equals("END")) endGame();
  else if (gameState == "WIN") winGame();
}

void playGame() {
  // BACKGROUND SCROLL
  image(bg, bgx, bgy);
  image(bg, bgx, bgy - bg.height); //loading in bg twice so it doesn't look choppy it once it's done scrolling through
  bgy += 5; // sets how fast bg moves down
  if (bgy >= bg.height) {  
  bgy = 0; //resetting bg automatically
  }
  
  if (!bgMusic.isPlaying()) {
  bgMusic.loop();
}

  // PLAYER MOVEMENT + DISPLAY
  person1.move();
  person1.falling();
  person1.display();

  // ILLUSTRATING ALIEN ABDUCTION BEAM
  image(g, 75, 233, 650, 90);
  fill(55, 235, 52, 70);
  quad(150, -20, 650, -20, 800, 420, 0, 420);
  strokeWeight(5);
  stroke(55, 235, 52, 80);

  // TIMER (aka the player's score)
  elapsedTime = (millis() - startTime) / 1000.0; //dividing converts it to seconds
  displayTime = round(elapsedTime * 100) / 100.0; //ensuring 2 decimal places display
  fill(255);
  textSize(25);
  textAlign(LEFT);
  text("TIME: " + displayTime + "s", 20, 40);

  // LIVES
  textAlign(RIGHT);
  text("LIVES REMAINING: " + lives, 780, 40);
  if (elapsedTime >= 120) { //full game lasts 2 minutes
      gameState = "WIN";
      return; // stops any further game updates
  }

  // CHANGING SPAWN RATE OVER TIME
  spawnTimer += 1.0/60.0; //using frame rate to consistenly update timer (60 FPS)
  if (elapsedTime > 100) spawnInterval = 0.5; //after 100 seconds, interval between each alien spawning in is 0.5 seconds, the interval gets smaller as the game progresses
  else if (elapsedTime > 80) spawnInterval = 0.9; 
  else if (elapsedTime > 60) spawnInterval = 1.0;
  else if (elapsedTime > 40) spawnInterval = 1.5;
  else if (elapsedTime > 20) spawnInterval = 2.0; //same logic as outlined above
  else spawnInterval = 3.0; //default interval between aliens in the beginning is  3 seconds

  // SPAWN OBSTACLES
  if (spawnTimer >= spawnInterval) { //making sure enough time has passed before next alien shows up
    spawnTimer = 0; //resetting timer
    //randomly choosing which alien will pop up next, categorizing by sizes
    int sizeIndex = int(random(obstacleSizes.length));
    int w = obstacleSizes[sizeIndex];
    int h = w; //confirming all obstacles are square
    float yPos = (height - 210) + random(-15, 15); //setting up vertical position of obstacle, the random variation is there to make their exact position less predictable
    float speed = getObstacleSpeed(elapsedTime);
    obstacles.add(new Obstacle(width, yPos, w, h, speed)); //referencing back to changing spawn rate over time, shows aliens will be coming from edge of screen
  }

  // OBSTACLE MOVEMENT + DISPLAY
  for (int i = obstacles.size()-1; i >= 0; i--) { //looping backwards in case i want to more easily adjust game in the future
    Obstacle obs = obstacles.get(i); //assigning to abbreviations to make things less long 
    obs.move();
    obs.display();

    if (personIntersect(person1, obs)) { 
      if (alienSound.isPlaying()) alienSound.stop(); //preventing overwhelming layering of sound when spawns are more frequent
      alienSound.play();
       //fun alien sounds effect plays when player collides 
      
      lives--; //collision means number of lives decrease by 1
      resetGame(); //collision resets position of player
      break;
    }

    if (obs.isOffScreen()) obstacles.remove(i); //mainly to just prevent the game from crashing or slowing cuz of the amount of aliens
  }

  // HEART/POWER-UP LOGIC
  heartTimer += 1.0 / 60.0; //similar to the alien spawnrate logic, using frame rate to consistenly update timer
  if (heart == null && heartTimer > nextHeartTime) { 
    float heartY = (height - 210) + random(-15, 15);
    heart = new Heart(width, heartY, 40, 40, random(2, 4)); 
    heartTimer = 0;
    nextHeartTime = random(8, 20); //also spawns a random, less frequent, intervals
  }

  if (heart != null) { //basically saying that if the heart is on screen, it will move/display
    heart.move();
    heart.display();

    if (personIntersectHeart(person1, heart)) {
      if (heartSound.isPlaying()) heartSound.stop();
      heartSound.play(); //fun twinkle sound effect plays!!
      
      lives = min(lives + 1, 5); //heart increases number of lives, but maxes out at 5
      heart = null; // remove heart safely
    } else if (heart.isOffScreen()) { //same logic used with aliens, making sure the game doesn't run slow because of things being displayed off screen
      heart = null;
    }
  }

  if (lives <= 0) gameState = "END"; 
}

  //OBSTACLE SPEEDS
  float getObstacleSpeed(float t) {
    if (t < 20) return 3; //for the first 20 seconds, aliens move 3 pix per fram
    else if (t < 40) return 4; //same logic
    else if (t < 60) return 5;
    else if (t < 80) return 6;
     else if (t < 100) return 7;
    else return 8; //at the hardest level, aliens move 8 pix per frame
  }
  
  // COLLISION WITH OBSTACLES
  //i used rectangle based collision detection since all my objects are technically squares
  boolean personIntersect(Person person1, Obstacle obstacle1) {
    float distanceX = (person1.x + person1.w/2) - (obstacle1.x + obstacle1.w/2);
    float distanceY = (person1.y + person1.h/2) - (obstacle1.y + obstacle1.h/2);
    float combinedHalfW = person1.w/2 + obstacle1.w/2;
    float combinedHalfH = person1.h/2 + obstacle1.h/2;
    return (abs(distanceX) < combinedHalfW && abs(distanceY) < combinedHalfH);
  }

  // COLLISION WITH HEARTS
  //used same collision logic as with obstacles
  boolean personIntersectHeart(Person person1, Heart heart) {
    float distanceX = (person1.x + person1.w/2) - (heart.x + heart.w/2);
    float distanceY = (person1.y + person1.h/2) - (heart.y + heart.h/2);
    float combinedHalfW = person1.w/2 + heart.w/2;
    float combinedHalfH = person1.h/2 + heart.h/2;
    return (abs(distanceX) < combinedHalfW && abs(distanceY) < combinedHalfH);
  }

void startGame() {
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

  if (mousePressed) {
    gameState = "PLAY";
    startTime = millis();
  }
}

void endGame() {
  image(endCard, 0, 0, width, height);
  textAlign(CENTER);
  textSize(70);
  fill(255, 111, 241);
  text("GAME OVER", width/2, height/2);

  fill(255);
  textSize(20);
  text("Time survived: " + displayTime + "s", width/2, 230);

  textSize(14);
  fill(255);
  text("Click anywhere to start again!", width/2, 255);

  if (mousePressed) {
    bgMusic.stop(); //i liked the idea of the music still playing after you've lost, which is why it doesn't stop until you mouse press and reset the game 
    lives = 5;
    resetGame();
    gameState = "PLAY";
    startTime = millis();
  }
}

void winGame() {
  image(winCard, 0, 0, width, height);
  textAlign(CENTER);
  textSize(70);
  fill(255, 111, 241);
  text("YOU WIN!", width/2, height/2);

  fill(255);
  textSize(20);
  text("Time survived: " + displayTime + "s", width/2, 230);

  textSize(14);
  fill(255);
  text("That was a close one...\nClick anywhere to start again!", width/2, 255);

  if (mousePressed) {
    lives = 5;
    resetGame();
    gameState = "PLAY";
    startTime = millis();
  }
}

void resetGame() { //clearing all the objects for a fresh restart
  person1 = new Person(width/8, height-210);
  obstacles.clear();
  heart = null; 
}
