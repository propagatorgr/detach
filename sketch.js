let g = 9.8;

let y1, v1;
let y2, v2;

let running = false;

function setup() {
  createCanvas(window.innerWidth - 260, window.innerHeight);
  resetSim();
}

function windowResized() {
  resizeCanvas(window.innerWidth - 260, window.innerHeight);
}

function startSim() {
  running = true;
}

function resetSim() {
  let groundY = height - 80;

  y2 = groundY;   // ακουμπάει στο έδαφος
  y1 = y2 - 120;

  v1 = 0;
  v2 = 0;

  running = false;
}

function draw() {

  background(255);

  let m1 = +m1El.value;
  let m2 = +m2El.value;
  let k = +kEl.value;
  let F = +FEl.value;

  updateLabels(m1, m2, k, F);

  let groundY = height - 80;

  // μήκος ελατηρίου
  let L = y2 - y1 - 40;
  let L0 = 100;

  let Fel = k * (L - L0);

  if (running) {

    // Σ1
    let a1 = (F + m1*g - Fel) / m1;
    v1 += a1 * 0.1;
    y1 += v1;

    // Σ2
    let N = 0;

    let F2 = Fel - m2*g;

    // αν πατάει κάτω
    if (y2 >= groundY) {
      y2 = groundY;
      v2 = 0;

      if (F2 < 0) {
        N = -F2;
      } else {
        // αποκόλληση
        let a2 = F2 / m2;
        v2 += a2 * 0.1;
        y2 += v2;
      }
    } else {
      let a2 = F2 / m2;
      v2 += a2 * 0.1;
      y2 += v2;
    }
  }

  drawScene(y1, y2, groundY);

  if (forcesEl.checked) {
    drawForces(y1, y2, m1, m2, F, Fel);
  }
}

// ------------------------

function drawScene(y1, y2, groundY) {

  stroke(0);
  line(0, groundY+30, width, groundY+30);

  let cx = width/2;

  // ελατήριο
  drawSpring(cx, y1, y2);

  fill(180);
  rect(cx-25, y1-25, 50, 50);

  fill(200);
  rect(cx-30, y2-30, 60, 60);

  noStroke();
  fill(0);
  textAlign(CENTER);
  text("Σ1", cx, y1-35);
  text("Σ2", cx, y2-40);
}

function drawSpring(x, y1, y2) {
  let coils = 10;
  let step = (y2-y1)/coils;

  noFill();
  stroke(0);

  beginShape();
  for (let i=0;i<=coils;i++){
    let dx = (i%2==0)?-10:10;
    vertex(x+dx, y1+i*step);
  }
  endShape();
}

function drawArrow(x,y,dy,label){
  stroke(255,0,0);
  line(x,y,x,y+dy);
  fill(255,0,0);
  noStroke();
  text(label,x+5,y+dy);
}

function drawForces(y1,y2,m1,m2,F,Fel){

  let cx = width/2;

  // Σ1
  drawArrow(cx, y1-10, 40, "m1g");
  drawArrow(cx+20, y1-10, 40, "F");
  drawArrow(cx-20, y1+10, -40, "Fελ");

  // Σ2
  drawArrow(cx, y2-10, 40, "m2g");
  drawArrow(cx-20, y2+10, -40, "Fελ");
}

// ------------------------

function updateLabels(m1,m2,k,F){
  m1v.textContent = m1 + " kg";
  m2v.textContent = m2 + " kg";
  kv.textContent = k + " N/m";
  Fv.textContent = F + " N";
}

// shortcuts
const m1El = document.getElementById("m1");
const m2El = document.getElementById("m2");
const kEl = document.getElementById("k");
const FEl = document.getElementById("F");
const forcesEl = document.getElementById("forces");

const m1v = document.getElementById("m1v");
const m2v = document.getElementById("m2v");
const kv = document.getElementById("kv");
const Fv = document.getElementById("Fv");
