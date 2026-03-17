class Heart {

  constructor(posX, posY, width_, height_, speed_) {

    this.x = posX;
    this.y = posY;

    this.w = width_;
    this.h = height_;

    this.speed = speed_;

    this.startY = posY;   // base vertical position
    this.t = 0;           // timer for wave motion

    this.sprite = loadImage("assets/finalheart.png");
  }


  move() {

    // move left
    this.x -= this.speed;

    // floating motion
    this.t += 0.05;

    this.y =
      this.startY +
      sin(this.t * 1.7) * 20 +
      cos(this.t * 0.8) * 10;
  }


  display() {

    if (this.sprite) {

      image(this.sprite, this.x, this.y, this.w, this.h);

    } else {

      fill(255, 0, 0);
      rect(this.x, this.y, this.w, this.h);
    }
  }


  isOffScreen() {

    // remove when completely off the left side
    return this.x < -this.w;
  }
}