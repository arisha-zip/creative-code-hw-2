public class Obstacle {
  float x;
  float y;
  int w;
  int h;
  float t = 0; //used for wavy trig based motion
  float startY; ///timer for wavy trig based motion
  float speed;

  PImage sprite;

  Obstacle(float posX, float posY, int width_, int height_, float speed_) {
    x = posX;
    y = posY;
    w = width_;
    h = height_;
    speed = speed_;
    startY = posY;

  //OUTLINING DIFFERENT SIZES OF ALIENS AND ASSIGNING THEM AN IMAGE
    if (w == 50) sprite = loadImage("greenalien.png");
    else if (w == 65) sprite = loadImage("bluealien.png");
    else if (w == 80) sprite = loadImage("purplealien.png");
  }

  void move() {
    x -= speed;
    t += 0.05; //increases timer variable  
    y = startY + sin(t * 1.7) * 20 + cos(t * 0.8) * 10; //wavy motion!
  }

  void display() {
    image(sprite, x, y, w, h);
  }

  boolean isOffScreen() {
    return x + w < 0; //making sure alien isn't visible anymore
  }
}
