class Person {
  constructor(posX, posY) {
    this.x = posX;
    this.y = posY;

    this.vy = 0; // vertical velocity
    this.gravity = 0.6; // how fast the person falls

    this.w = 50;
    this.h = 50;

    this.speed = 10;
    this.jumpHeight = 0; // kept for reference

    this.isJumping = false;
    this.isFalling = false;

    this.sprite = loadImage("assets/pinkgirly.png");
    this.facingRight = true; // determines direction based on arrow key
  }

  move() {
    if (keyIsPressed) {
      if (keyCode === LEFT_ARROW && this.x > 50) {
        this.x -= this.speed;
        this.facingRight = false;
      } else if (keyCode === RIGHT_ARROW && this.x < 700) {
        this.x += this.speed;
        this.facingRight = true;
      } else if (key === 'w' && !this.isFalling) {
        this.vy = -12; // upward velocity for jump
        this.isFalling = true;
        this.isJumping = false;
      }
    }
  }

  falling() {
    if (this.isFalling) {
      this.vy += this.gravity; // apply gravity
      this.y += this.vy;       // update position

      // stop falling when reaching the ground
      if (this.y >= height - 210) {
        this.y = height - 210;
        this.vy = 0;
        this.isFalling = false;
      }
    }
  }

  topOfJump() {
    // no longer needed
  }

  land() {
    // no longer needed
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
