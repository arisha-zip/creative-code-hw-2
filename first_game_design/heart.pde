public class Heart {
  float x;
  float y;
  float startY; //used for wavy trig based motion
  int w = 15;
  int h = 15;
  float t = 0; //timer used for trig based motion
  float speed;
  PImage sprite;
  
  Heart(float posX, float posY, int width_, int height_, float speed_) {
    x = posX;
    y = posY;
    startY = posY;
    w = width_;
    h = height_;
    speed = speed_;
    sprite = loadImage("finalheart copy.png"); 
  }

  void move() {
    x -= speed;             
    t += 0.05; //increases timer variable            
    y = startY + sin(t*1.7)*20 + cos(t*0.8)*10; //wavy motion
  }

  void display() {
    if (sprite != null) { //detects if image is there
      image(sprite, x, y, w, h);
    } else {
      fill(255, 0, 0); //just in case there's some kind of error and the heart never shows up
      rect(x, y, w, h);
    }
  }

  boolean isOffScreen() {
    return x + w < 0; //making sure heart isn't visible anymore
  }
}
