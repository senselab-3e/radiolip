var w = 500;
var h = 500;
var inc = 100;
var inS = 10;
var inM = 0;
var step = 0.15;
var rows = [];
var timeScale = [];
var lip = [' ', 'r', 'a', 'd', 'i', 'o', 'l', 'i', 'p', ' '];
var spot = [0, 5, 7, 9, 8, 11, 6, 7, 9, 0];

class Row {
  constructor(y, l, index){
    this.amt = 25;
    this.xpos = [0];
    this.ypos = y;
    this.rates = [Math.random()*0.05];
    this.blobs = [{ x: 0, f: h/10 }];
    this.width = 50;
    this.letter = {char: l, ind: index}
    this.speed = 1;
  }
  initRow() {
    for(let i=1; i<this.amt; i++) {
      this.blobs.push({
        x: this.blobs[i-1].x + (this.blobs[i-1].f/2) + 20 + Math.floor(Math.random()*(w/4)),
        f: null
      });
      this.blobs[i].f = Math.abs((this.blobs[i].x - this.blobs[i-1].x - (this.blobs[i-1].f/2))*2);
      this.xpos.push(this.blobs[i].x);
      this.rates.push(Math.random()*0.05);
    }
  }
  drawRow() {
    for(let i=0; i<this.blobs.length; i++) {
      noStroke();
      fill('#f54545');
      ellipse(this.blobs[i].x, this.ypos, this.blobs[i].f, this.width);
    }
  }
  drawLetter(){
    textAlign(CENTER);
    fill(255, 255, 255, level*400);
    text(this.letter.char, this.blobs[this.letter.ind].x, this.ypos+4);
  }
  moveBlobs(t) {
    this.blobs[0].f = this.width + 10*Math.sin(inc*0.02);
    this.blobs[0].x = -100 + 25*Math.sin(inc*0.01);
    for(let i=0; i<this.blobs.length-1; i++) {
      this.blobs[i+1].x = this.blobs[i].x + (this.blobs[i].f/2) + 10*Math.sin(t*this.rates[i+1]*this.speed) + 20;
      this.blobs[i+1].f = Math.abs((this.blobs[i+1].x - this.blobs[i].x - (this.blobs[i].f/2))*2);
    }
  }
}

function setup() {
  frameRate(30);
  let cnv = createCanvas(w, h + 40);
  cnv.parent('container');
  cnv.mousePressed(togglePlayer);
  // cnv.mouseMoved(speedi);
  push();
  fill('#189e7f');
  rect(0, 20, w, h);
  pop();

  for(let i=0; i<10; i++) {
    rows[i] = new Row(i*50 + 25 + 20, lip[i], spot[i]);
    rows[i].initRow();
    rows[i].drawRow();
    rows[i].drawLetter();
  }
}

function draw() {
  push();
  fill('#189e7f');
  rect(0, 20, w, h);
  pop();

  drawMetadata(inM);

  for(let i=0; i<10; i++) {
    rows[i].moveBlobs(inc);
    rows[i].drawRow();
    rows[i].drawLetter();
  }
  var u = step + 0.9*Math.exp(-0.5*(  Math.pow( (inS - 0.1) / 0.03 , 2) ) );
  inc += u;
  inS+= 0.003;
  if(playing) {
    inM += u;
  } else {
    inM = 0;
  }
}

function drawMetadata(t){
  push();
  fill('#ffffff');
  rect(0, 0, w, 20);
  pop();
  push();
  fill('#ffffff');
  rect(0, h+20, w, 20);
  pop();

  var alpha = Math.abs(Math.sin(Math.PI*(0.02*t)));

  if(metadata.name) {
    fill(245, 69, 69, alpha*255);
    text(metadata.name, t*2 % (w+200) - 100, 10);
  }
  if(metadata.show) {
    fill(245, 69, 69, alpha*255);
    text(metadata.show, -1*(t*2 % (w+200)) + w +100, h+34);
  }
}

function togglePlayer() {
  if(playing){
    radiolip.pause();
    playing = false;
  } else {
    audioCtx.resume();
    radiolip.play();
    playing = true;
    inM = 0;
  }
  inS = 0;
}
