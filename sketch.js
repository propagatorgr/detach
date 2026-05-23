let g = 10;

// καταστάσεις
let state = "loading"; // loading → release → oscillation

let y1, v1;
let y2;

let y_eq;      // θέση ισορροπίας
let y_target;  // θέση A = F/k

let dt = 0.02;

// γεωμετρία
let blockH1 = 60;
let blockH2 = 70;
let L0 = 140;

// --------------------------------

function setup() {
  createCanvas(window.innerWidth - 260, window.innerHeight);
  initSystem();
}

function windowResized() {
  resizeCanvas(window.innerWidth - 260, window.innerHeight);
  initSystem();
}

// --------------------------------

function initSystem() {

  let groundY = height - 80;

  let m1 = +m1El.value;
  let m2 = +m2El.value;
  let k = +kEl.value;

  y2 = groundY;

  // Θέση ισορροπίας (μόνο βάρη)
  let deltaL = (m1 + m2) * g / k;
  let L_eq = L0 + deltaL;

  y_eq = y2 - L_eq;

  y1 = y_eq;
  v1 = 0;

  state = "loading";
}

// --------------------------------

function startSim() {
  state = "oscillation";
  v1 = 0; // αφήνεται από ηρεμία
}

function resetSim() {
  initSystem();
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

  // στόχος: A = F/k
  let A = F / k;
  y_target = y_eq + A;

  // -------------------------------
  // 1. LOADING (με F)
  // -------------------------------
  if (state === "loading") {

    // ομαλή μετάβαση
    y1 += (y_target - y1) * 0.1;
  }

  // -------------------------------
  // 2. ΤΑΛΑΝΤΩΣΗ (χωρίς F)
  // -------------------------------
  if (state === "oscillation") {

    for (let i = 0; i < 6; i++) {

      let small_dt = dt / 6;

      let topOfS2 = y2 - blockH2 / 2;
      let bottomOfS1 = y1 + blockH1 / 2;

      let L = topOfS2 - bottomOfS1;
      let Fel = -k * (L - L0);

      let a1 = (m1 * g + Fel) / m1;

      v1 += a1 * small_dt;
      y1 += v1 * small_dt;
    }
  }

  // --------------------------------
  // ΑΠΟΚΟΛΛΗΣΗ (λογικό flag)
  // --------------------------------
  let lift = (F >= (m1 + m2) * g);

  drawScene(y1, y2, groundY, lift);

  if (forcesEl.checked) {
    drawForces(y1, y2, m1, m2, F, lift);
  }
}

// --------------------------------

function drawScene(y1, y2, groundY, lift) {

  let cx = width / 2;

  // έδαφος
  stroke(0);
  line(0, groundY + 30, width, groundY + 30);

  // ελατήριο
  drawSpring(cx, y1 + blockH1 / 2, y2 - blockH2 / 2);

  // σώματα
  fill(180);
  rect(cx - 30, y1 - blockH1 / 2, 60, blockH1);

  fill(200);
  rect(cx - 35, y2 - blockH2 / 2, 70, blockH2);

  fill(0);
  noStroke();
  textAlign(CENTER);
  text("Σ1", cx, y1 - 40);
  text("Σ2", cx, y2 - 45);

  // ένδειξη αποκόλλησης
  if (lift) {
    fill(255, 0, 0);
    text("Αποκόλληση", cx, 30);
  }
}

// --------------------------------

function drawSpring(x, yTop, yBottom) {

  let coils = 14;
  let step = (yBottom - yTop) / coils;

  stroke(0);
  noFill();

  beginShape();
  for (let i = 0; i <= coils; i++) {
    let dx = (i % 2 === 0) ? -12 : 12;
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

function drawForces(y1, y2, m1, m2, F, lift) {

  let cx = width / 2;

  // Σ1
  drawArrow(cx, y1, 0, 40, "m1g");
  if (state === "loading") {
    drawArrow(cx + 25, y1, 0, 40, "F");
  }
  drawArrow(cx - 25, y1, 0, -40, "Fελ");

  // Σ2
  drawArrow(cx, y2, 0, 40, "m2g");
  drawArrow(cx - 25, y2, 0, -40, "Fελ");

  if (!lift) {
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
