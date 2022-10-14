// Size of art 
let w = 400;
let h = 400;

function setup() {
  createCanvas(w,h);
}

function draw() {
  background(255);
  translate(w/2, h/2);

  // draw here, canvas center is 0, 0
  scale(sin(frameCount/100)*2);
  square(-20,-20,40);


  point(0, 0);
}