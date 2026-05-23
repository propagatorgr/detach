let g = 9.8;
let y1, v1;
let y2, v2;

let running = false;

let L0 = 180; // ΠΟΛΥ μεγαλύτερο φυσικό μήκος
let dt = 0.03;

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

  y2 = groundY;

  // Δίνουμε ΑΡΧΙΚΗ ΠΑΡΑΜΟΡΦΩΣΗ για να υπάρξει ταλάντωση
  y1 = y2 - L0 - 80;

  v1 = 0;
  v2 = 0;

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

  // ----------- ΦΥΣΙΚΗ -----------

  let L = (y2 - y1);
  let Fel = k * (L - L0);

  if (running) {

    // Σ1
    let a1 = (F + m1*g - Fel) / m1;
    v1 += a1 * dt;
    y1 += v1;

    // Σ2
    let Fnet2 = Fel - m2*g;

    if (y2 >= groundY) {
      y2 = groundY;
      v2 = 0;

      // επαφή
      if (Fnet2 > 0) {
        // αποκόλληση
        let a2 = Fnet2 / m2;
        v2 += a2 * dt;
        y2 += v2;
      }
    } else {
      // ελεύθερη κίνηση
      let a2 = Fnet2 / m2;
      v2 += a2 * dt;
      y2 += v2;
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

  // ελατήριο
  drawSpring(cx, y1, y2);

  // σώματα
  fill(180);
  rect(cx - 30, y1 - 30, 60, 60);

  fill(200);
  rect(cx - 35, y2 - 35, 70, 70);

  fill(0);
  noStroke();
  textAlign(CENTER);
  text("Σ1", cx, y1 - 40);
  text("Σ2", cx, y2 - 45);
}

// --------------------------------

function drawSpring(x, y1, y2) {

  let coils = 14;
  let step = (y2 - y1) / coils;

  stroke(0);
  noFill();

  beginShape();
  for (let i = 0; i <= coils; i++) {
    let dx = (i % 2 === 0) ? -12 : 12;
    vertex(x + dx, y1 + i * step);
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
  text(label, x + dx + 4, y + dy);
}

// --------------------------------

function drawForces(y1, y2, m1, m2, F, Fel) {

  let cx = width / 2;

  // Σ1 (κέντρο σώματος)
  drawArrow(cx, y1, 0, 50, "m1g");
  drawArrow(cx + 25, y1, 0, 50, "F");
  drawArrow(cx - 25, y1, 0, -50, "Fελ");

  // Σ2
  drawArrow(cx, y2, 0, 50, "m2g");
  drawArrow(cx - 25, y2, 0, -50, "Fελ");

  if (y2 >= height - 80) {
    drawArrow(cx + 25, y2, 0, -50, "N");
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

