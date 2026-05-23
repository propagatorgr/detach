let g = 10;

// καταστάσεις
let state = "loading"; // loading → oscillation

let y1, v1;
let y2;

let y_eq;      // ισορροπία (κέντρο-κέντρο)
let y_target;  // θέση μετά την F

let dt = 0.02;
let substeps = 8;

// φυσικό μήκος (κέντρο→κέντρο)
let L0 = 200;

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

  let m1 = +m1El.value;
  let m2 = +m2El.value;
  let k = +kEl.value;

  let groundY = height - 100;

  y2 = groundY;

  // ΙΣΟΡΡΟΠΙΑ: kΔL = (m1+m2)g
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
  v1 = 0;
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

  // -------- στόχος: A = F/k --------
  let A = F / k;
  y_target = y_eq + A;

  // --------------------------------
  // 1. LOADING (με F)
  // --------------------------------
  if (state === "loading") {
    y1 += (y_target - y1) * 0.15;
  }

  // --------------------------------
  // 2. ΤΑΛΑΝΤΩΣΗ (χωρίς F)
  // --------------------------------
  if (state === "oscillation") {

    for (let i = 0; i < substeps; i++) {

      let dt_s = dt / substeps;

      let L = y2 - y1;              // ΚΕΝΤΡΟ-ΚΕΝΤΡΟ
      let Fel = -k * (L - L0);

      let a1 = (m1 * g + Fel) / m1;

      v1 += a1 * dt_s;
      y1 += v1 * dt_s;
    }
  }

  // --------------------------------
  // αποκόλληση (σύμφωνα με το μοντέλο σου)
  // --------------------------------
  let lift = (F >= (m1 + m2) * g);

  drawScene(y1, y2, lift);

  if (forcesEl.checked) {
    drawForces(y1, y2, state, lift);
  }
}

// --------------------------------

function drawScene(y1, y2, lift) {

  let cx = width / 2;
  let groundY = height - 100;

  stroke(0);
  line(0, groundY + 30, width, groundY + 30);

  // ελατήριο
  drawSpring(cx, y1, y2);

  // σώματα
  fill(180);
  ellipse(cx, y1, 60);

  fill(200);
  ellipse(cx, y2, 70);

  fill(0);
  noStroke();
  textAlign(CENTER);
  text("Σ1", cx, y1 - 35);
  text("Σ2", cx, y2 - 40);

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
    let dx = (i % 2 === 0) ? -10 : 10;
    vertex(x + dx, yTop + i * step);
  }
  endShape();
}

// --------------------------------

function drawArrow(x, y, dy, label) {

  stroke(255, 0, 0);
  strokeWeight(2);

  line(x, y, x, y + dy);

  let sign = Math.sign(dy);
  let size = 8;

  push();
  translate(x, y + dy);
  line(0, 0, -size, -sign * size);
  line(0, 0, size, -sign * size);
  pop();

  noStroke();
  fill(255, 0, 0);
  text(label, x + 5, y + dy);
}

// --------------------------------

function drawForces(y1, y2, state, lift) {

  let cx = width / 2;

  // Σ1
  drawArrow(cx, y1, 40, "m1g");
  if (state === "loading") {
    drawArrow(cx + 20, y1, 40, "F");
  }
  drawArrow(cx - 20, y1, -40, "Fελ");

  // Σ2
  drawArrow(cx, y2, 40, "m2g");
  drawArrow(cx - 20, y2, -40, "Fελ");

  if (!lift) {
    drawArrow(cx + 20, y2, -40, "N");
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
