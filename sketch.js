let g = 9.8;

let y1, v1;
let y2, v2;

let running = false;

let dt = 0.02;
let damping = 0.995;

// γεωμετρία
let blockH1 = 60;
let blockH2 = 70;
let L0 = 160;

// --------------------------------

function setup() {
  createCanvas(window.innerWidth - 260, window.innerHeight);
  resetSim();
}

function windowResized() {
  resizeCanvas(window.innerWidth - 260, window.innerHeight);
}

// --------------------------------

function startSim() {
  running = true;
}

function resetSim() {

  let groundY = height - 80;

  let m1 = +m1El.value;
  let m2 = +m2El.value;
  let k = +kEl.value;

  y2 = groundY;
  v2 = 0;

  // ΘΕΣΗ ΙΣΟΡΡΟΠΙΑΣ (σημαντικό!)
  let deltaL = (m1 + m2) * g / k;

  let L_eq = L0 + deltaL;

  // ξεκινάμε λίγο πιο πάνω → ταλάντωση
  y1 = y2 - L_eq - 30;
  v1 = 0;

  running = false;
}

// --------------------------------

function draw() {

  background(255);

  let m1 = +m1El.value;
  let m2 = +m2El.value;
  let k = +kEl.value;
  let F = +FEl.value;

  updateLabels(m1, m2, k, F);

  let groundY = height - 80;

  // ----------- ΕΛΑΤΗΡΙΟ -----------

  let topOfS2 = y2 - blockH2 / 2;
  let bottomOfS1 = y1 + blockH1 / 2;

  let L = topOfS2 - bottomOfS1;

  // clamp για να μη καταρρεύσει
  L = constrain(L, 40, height);

  let Fel = -k * (L - L0);

  if (running) {

    // --- Σ1 ---
    let a1 = (F + m1 * g + Fel) / m1;

    v1 += a1 * dt;
    v1 *= damping;
    y1 += v1 * dt;

    // --- Σ2 ---
    let force2 = -Fel - m2 * g;

    if (y2 >= groundY) {

      y2 = groundY;
      if (v2 > 0) v2 = 0;

      if (force2 > 0) {
        let a2 = force2 / m2;
        v2 += a2 * dt;
        v2 *= damping;
        y2 += v2 * dt;
      }

    } else {

      let a2 = force2 / m2;
      v2 += a2 * dt;
      v2 *= damping;
      y2 += v2 * dt;
    }
  }

  drawScene(y1, y2, groundY);

  if (forcesEl.checked) {
    drawForces(y1, y2, m1, m2, F, Fel);
  }
}

// --------------------------------

function drawScene(y1, y2, groundY) {

  let cx = width / 2;

  stroke(0);
  line(0, groundY + 30, width, groundY + 30);

  drawSpring(cx, y1 + blockH1 / 2, y2 - blockH2 / 2);

  fill(180);
  rect(cx - 30, y1 - blockH1 / 2, 60, blockH1);

  fill(200);
  rect(cx - 35, y2 - blockH2 / 2, 70, blockH2);

  fill(0);
  noStroke();
  textAlign(CENTER);
  text("Σ1", cx, y1 - 40);
  text("Σ2", cx, y2 - 45);
}

// --------------------------------

function drawSpring(x, yTop, yBottom) {

  let coils = 12;
  let step = (yBottom - yTop) / coils;

  stroke(0);
  noFill();

  beginShape();
  for (let i = 0; i <= coils; i++) {
    let dx = (i % 2 === 0) ? -10 : 10;
    vertex(x + dx, yTop + i * step);
  }
  endShape();
}

// --------------------------------

function drawArrow(x, y, dx, dy, label) {

  stroke(255, 0, 0);
  strokeWeight(2);

  line(x, y, x + dx, y + dy);

  let angle = atan2(dy, dx);
  let size = 8;

  push();
  translate(x + dx, y + dy);
  rotate(angle);
  line(0, 0, -size, -size / 2);
  line(0, 0, -size, size / 2);
  pop();

  noStroke();
  fill(255, 0, 0);
  text(label, x + dx + 5, y + dy);
}

// --------------------------------

function drawForces(y1, y2, m1, m2, F, Fel) {

  let cx = width / 2;

  // Σ1
  drawArrow(cx, y1, 0, 40, "m1g");
  drawArrow(cx + 25, y1, 0, 40, "F");
  drawArrow(cx - 25, y1, 0, -40, "Fελ");

  // Σ2
  drawArrow(cx, y2, 0, 40, "m2g");
  drawArrow(cx - 25, y2, 0, -40, "Fελ");

  if (y2 >= height - 80) {
    drawArrow(cx + 25, y2, 0, -40, "N");
  }
}

// --------------------------------

function updateLabels(m1, m2, k, F) {
  m1v.textContent = m1 + " kg";
  m2v.textContent = m2 + " kg";
  kv.textContent = k + " N/m";
  Fv.textContent = F + " N";
}

// --------------------------------

const m1El = document.getElementById("m1");
const m2El = document.getElementById("m2");
const kEl = document.getElementById("k");
const FEl = document.getElementById("F");
const forcesEl = document.getElementById("forces");

const m1v = document.getElementById("m1v");
const m2v = document.getElementById("m2v");
const kv = document.getElementById("kv");
const Fv = document.getElementById("Fv");
