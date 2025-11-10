class Heart {
  constructor(posX, posY, width_, height_, speed_) {
    this.x = posX;
    this.y = posY;
    this.startY = posY; // used for wavy trig-based motion
    this.w = width_;
    this.h = height_;
    this.t = 0; // timer for trig-based motion
    this.speed = speed_;
    this.sprite = loadImage("assets/finalheart.png");
  }

  move() {
    this.x -= this.speed;
    this.t += 0.05; // increases timer variable
    this.y = this.startY + sin(this.t * 1.7) * 20 + cos(this.t * 0.8) * 10; // wavy motion
  }

  display() {
    if (this.sprite) {
      image(this.sprite, this.x, this.y, this.w, this.h);
    } else {
      fill(255, 0, 0); // fallback if the image doesn’t load
      rect(this.x, this.y, this.w, this.h);
    }
  }

  isOffScreen() {
    return this.x + this.w < 0; // true if heart is off the left edge
  }
}
