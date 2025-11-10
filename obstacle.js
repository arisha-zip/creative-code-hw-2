class Obstacle {
  constructor(posX, posY, width_, height_, speed_) {
    this.x = posX;
    this.y = posY;
    this.w = width_;
    this.h = height_;
    this.t = 0; // timer for wavy trig-based motion
    this.startY = posY;
    this.speed = speed_;
    this.sprite = null;

    // Assign image based on size
    if (this.w === 50) {
      this.sprite = loadImage("greenalien.png");
    } else if (this.w === 65) {
      this.sprite = loadImage("bluealien.png");
    } else if (this.w === 80) {
      this.sprite = loadImage("purplealien.png");
    }
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
      fill(255, 0, 0);
      rect(this.x, this.y, this.w, this.h);
    }
  }

  isOffScreen() {
    return this.x + this.w < 0; // true if obstacle is off-screen
  }
}
