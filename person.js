class Person {

  constructor(posX, posY) {

    this.x = posX;
    this.y = posY;

    // remember where the ground is
    this.groundY = posY;

    this.vy = 0;
    this.gravity = 0.6;

    this.w = 50;
    this.h = 50;

    this.speed = 10;

    this.isFalling = false;

    this.sprite = loadImage("assets/pinkgirlygreenn.png");

    this.facingRight = true;
  }


  move() {

    if (keyIsPressed) {

      if (keyCode === LEFT_ARROW && this.x > 50) {
        this.x -= this.speed;
        this.facingRight = false;
      }

      else if (keyCode === RIGHT_ARROW && this.x < 700) {
        this.x += this.speed;
        this.facingRight = true;
      }

      else if ((key === 'w' || key === 'W') && !this.isFalling) {

        this.vy = -12;
        this.isFalling = true;
      }
    }
  }


  falling() {

    if (this.isFalling) {

      this.vy += this.gravity;

      this.y += this.vy;

      // land on ground
      if (this.y >= this.groundY) {

        this.y = this.groundY;

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
    }

    else {

      image(this.sprite, this.x, this.y, this.w, this.h);
    }

    pop();
  }
}