public class Person {
  float x;
  float y;
  
  float vy = 0;        // vertical velocity
  float gravity = 0.6; // how fast i'm falling

  int w = 50;
  int h = 50;

  float speed; 
  int jumpHeight;     // kept for reference

  boolean isJumping;
  boolean isFalling;

  PImage sprite;
  boolean facingRight = true; //setting up for person to be facing left or right based on which arrow key is pressed

  Person(float posX, float posY) {
    x = posX;
    y = posY;

    speed = 10;
    isJumping = false;
    isFalling = false;

    sprite = loadImage("pinkgirly.png");
    sprite.resize(w, h);
  }

  //SETTING BOUNDARIES FOR WHERE PERSON CAN MOVE (basically can't move off the chunk of earth)
  void move() {
    if (keyPressed) {
      if (keyCode == LEFT && x > 50) {
        x -= speed;
        facingRight = false;
      } else if (keyCode == RIGHT && x < 700) {
        x += speed;
        facingRight = true;
      } else if (key == 'w' && !isFalling) {
        vy = -12;       // how high person can jump, upward velocity 
        isFalling = true;
        isJumping = false;
      }
    }
  }

  void falling() {
    if (isFalling) {
      vy += gravity;  // shows gravity accelerating downward
      y += vy;        // updates vertical position

      // stops at when meets the ground
      if (y >= height - 210) {
        y = height - 210;
        vy = 0;
        isFalling = false;
      }
    }
  }

  void topOfJump() {
    // no longer needed 
  }
  void land() {
    // no longer needed 
  }
  //for the two functions above, intially created jumping ability with a different method, which changed after i decided to incorporate gravity and velocity 
  //keeping them here as placeholders as i don't want to create an error
 
  void display() {
    pushMatrix(); //creating transformation of person only
    if (!facingRight) {
      translate(x + w, y);
      scale(-1, 1);
      image(sprite, 0, 0, w, h);
    } else {
      image(sprite, x, y, w, h);
    }
    popMatrix();
  }
}
