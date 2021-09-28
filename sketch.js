
let inc = 0.1;
let scl = 20;
let cols, rows;
let nParticles = 10;
let particleSize = 20;
let zOff = 0;
let lines = [];
let fr;
let alph = 255;
let roboto;
let sclSlider;
let particles = [];

let flowField = [];


let port;
let connectBtn;
let sendBtn;
let input;

let osc, playing, freq, amp;
let osc2, freq2, amp2;

// function preload() {
//   roboto = loadFont('Roboto-Light.ttf')
// }

function setup() {
  
  let myCanvas = createCanvas(displayWidth,displayHeight);

  osc = new p5.Oscillator('sawtooth');
   osc2 = new p5.Oscillator('square');
  
  
  connectBtn = createButton('talking nonsense');
  connectBtn.position(-150 +width/2, -100+height/2);
  connectBtn.mousePressed(connect);
  connectBtn.style('background-color', color(255));
  connectBtn.style('color', color(255, 10, 26));
  connectBtn.style('font-size', '36px');
  connectBtn.style('border-radius', '40px');
  connectBtn.style('border', '2px solid red');
  connectBtn.style('padding', '10px 20px');
  
  



  cols = floor(displayWidth / scl);
  rows = floor((displayHeight) / scl);

  fr = createP('');
  

  flowField = new Array(rows * cols);

  

  //textFont(roboto)
 
  for (let i = 0; i < nParticles; i++) {
    particles.push(new Particle());
  }
  
  
}

function draw() {
  background(255,11);
  

  let yOff = 0;
  for (let y = 0; y < rows; y++) {
    let xOff = 0;
    for (let x = 0; x < cols; x++) {

      let index = (x + y * cols);

       let angle = noise(xOff, yOff, zOff) * TWO_PI  ;
      //let angle = noise(yOff) * TWO_PI  ;

      let v = p5.Vector.fromAngle(angle);
      v.setMag(0.2)
      flowField[index] = v;
      xOff += inc;
      stroke(0)
      strokeWeight(1)

      push()
      translate(x * scl, y * scl)
      rotate(v.heading());
       //line(0, 0, scl, 0)
      pop()
    }

    yOff += inc;
    //zOff += 0.0005;
  }

  if (port) {  // the port mightx not have been opened here
    input = port.readUntil('\n');
          osc.start();
          amp = map(input, 150, 900, 0.02, 0.6);
          freq = map(input, 150, 900, random(100,200), random(400,500));
              
          osc.freq(freq, 0.1);
          osc.amp(amp, 0.1);
              
          osc2.start();
          amp2 = map(input, 150, 900, 0.02, 0.5);
          freq2 = map(input, 150, 900, random(10,100), random(400,500));
              
          osc2.freq(freq2, 0.1);
          osc2.amp(amp2, 0.1);
    
    for (let i = particles.length - 1; i > 0; i--) {
      particles[i].follow(flowField);
      particles[i].edges();
      particles[i].show(input);
      particles[i].update(input);

    }
  
   if (input.length > 0) {
    console.log(input)
          // let milli = millis();
          // console.log(milli);
        }
      }




  fr.html(floor(frameRate()));
  
  //noLoop();



}



class Particle {
  constructor() {
    this.pos = createVector(random(width-50,width), random(50,height-50));
    
    this.prevPos = this.pos.copy();
    this.vel = p5.Vector.random2D();
    //this.angle = PI;
   // this.vel = p5.Vector(10,0)
    this.acc = createVector(0, 0);
   
    //this.maxSpeed = 3;
   
    this.letters = ['wasabi', 'ocean', 'lung', 'relaxing','us','rib','dive','cage','hall','bend','soak','land','wake','nose','bag','worm','salty']
    this.randomLetter = random(this.letters)
    this.alpha = 255;
    this.myColor = color(255, 10, 26);


  }


  follow(vectors) {
    let x = floor(this.pos.x / scl);
    let y = floor(this.pos.y / scl);
    let index = x + y * cols;
    let force = vectors[index];
    this.applyForce(force);
  }

  pursue(particle){
    let target = particle.pos.copy;
    target.add(particle.vel);
    return particle.follow(target)

  }

  update(input) {
    this.vel.add(this.acc);
    //this.maxSpeed = map(input, 150, 800, 1, 8);
    this.maxSpeed = 6;
    
    this.vel.limit(this.maxSpeed)
    this.pos.add(this.vel);
    this.acc.mult(0);
    //this.alpha -=55;
  }

  applyForce(force) {
    this.acc.add(force);
  }



  show(input) {
    // noStroke();
    stroke(255)
    strokeWeight(3);
    
   // noFill();
    fill(this.myColor, this.alpha)
    this.myTextSize = floor(map(input, 150, 600, 5, 96))
    textSize(this.myTextSize);
    text(this.randomLetter,this.pos.x,this.pos.y)


  //  ellipse(this.pos.x, this.pos.y, this.r * 2)
  //   line(this.pos.x,this.pos.y,this.prevPos.x,this.prevPos.y)
    this.updatePrev();
  }

  updatePrev() {
    this.prevPos.x = this.pos.x;
    this.prevPos.y = this.pos.y;
  }

  finished() {
    return this.alpha < 0;
  }

  intersects(other) {
    let d = dist(this.pos.x, this.pos.y, other.pos.x, other.pos.y)
    if (d < this.r + other.r) {
      return true;
    } else {
      return false;
    }
  }

  edges() {
    if (this.pos.x > width) {
      this.pos.x = 0;
      this.acc.mult(-1);
      this.updatePrev();

    }
    if (this.pos.x < 0) {
      this.pos.x = width;
      this.acc.mult(-1);
      this.updatePrev();
    }
    if (this.pos.y > height) {
      this.pos.y = 0;
      this.acc.mult(-1);
      this.updatePrev();
    }
    if (this.pos.y < 0) {
      this.pos.y = height;
      this.acc.mult(-1);
      this.updatePrev();
    }
  }
}



function connect() {
  port = new WebSerial('Arduino', 57600);
  connectBtn.hide();
//  sendBtn.show();
  
}