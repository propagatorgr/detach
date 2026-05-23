let g = 10;

let m1El, m2El, kEl, FEl, forcesEl;
let m1v, m2v, kv, Fv;

let FvalBox, FcritBox, statusBox;

let state = "loading";
let paused = false;

let y1, v1;
let y2;
let y_eq;

let dt = 0.016;

let SCALE = 200;
let L0 = 1.5;

let Amax_px = 140;

// --------------------------------

function setup() {
  createCanvas(window.innerWidth - 260, window.innerHeight);

  m1El = document.getElementById("m1");
  m2El = document.getElementById("m2");
  kEl = document.getElementById("k");
  FEl = document.getElementById("F");
  forcesEl = document.getElementById("forces");

  m1v = document.getElementById("m1v");
  m2v = document.getElementById("m2v");
  kv = document.getElementById("kv");
  Fv = document.getElementById("Fv");

  FvalBox = document.getElementById("FvalBox");
  FcritBox = document.getElementById("FcritBox");
  statusBox = document.getElementById("statusBox");

  kEl.addEventListener("input", updateFmax);

  initSystem();
}

// --------------------------------

function initSystem(){
  let m1 = +m1El.value;
  let k = +kEl.value;

  let groundY = height - 100;
  y2 = groundY;

  let deltaL = (m1 * g) / k;
  y_eq = y2 - (L0 + deltaL) * SCALE;

  y1 = y_eq;
  v1 = 0;

  state = "loading";
  paused = false;

  updateFmax();
}

// --------------------------------

function updateFmax(){
  let k = +kEl.value;

  let Amax = Amax_px / SCALE;
  let Fmax = k * Amax;

  FEl.max = Math.round(Fmax);

  if (+FEl.value > Fmax) {
    FEl.value = Fmax;
  }
}

// --------------------------------

function startSim(){
  v1 = 0;
  state = "oscillation";
}

function togglePause(){
  paused = !paused;
}

function resetSim(){
  FEl.value = 0;
  initSystem();
}

// --------------------------------

function draw(){

  background(255);

  let m1 = +m1El.value;
  let m2 = +m2El.value;
  let k = +kEl.value;
  let F = +FEl.value;

  updateLabels(m1,m2,k,F);

  let groundY = height - 100;

  // loading
  if(state==="loading"){
    y1 = y_eq + (F/k)*SCALE;
  }

  // ταλάντωση
  if(state==="oscillation" && !paused){
    let x = (y1 - y_eq)/SCALE;
    let a = -(k/m1)*x;

    v1 += a*dt;
    y1 += v1*dt*SCALE;
  }

  let lift = (F >= (m1+m2)*g);

  drawScene(y1,y2,groundY,y_eq,F,k,lift);

  if(forcesEl.checked){
    drawForces(y1,y2,state,lift);
  }

  // ✅ ΜΟΝΟ PANEL — ΟΧΙ canvas

  let Fcrit = (m1 + m2) * g;

  FvalBox.textContent = F.toFixed(1);
  FcritBox.textContent = Fcrit.toFixed(1);

  if(state !== "oscillation"){
    statusBox.style.color = "gray";
    statusBox.textContent = "Πάτα 'Έναρξη'";
  }
  else if (Math.abs(F - Fcrit) < 1){
    statusBox.style.color = "orange";
    statusBox.textContent = "Στο όριο αποκόλλησης";
  }
  else if (F < Fcrit){
    statusBox.style.color = "blue";
    statusBox.textContent = "Δεν υπάρχει αποκόλληση";
  }
  else{
    statusBox.style.color = "red";
    statusBox.textContent = "Αποκόλληση";
  }
}

// --------------------------------

function drawScene(y1,y2,groundY,y_eq,F,k,lift){

  let cx = width/2;

  stroke(0);
  strokeWeight(2);
  line(0,groundY+20,width,groundY+20);

  stroke(0,150,0);
  line(cx-50,y_eq,cx+50,y_eq);

  let Apx = (F/k)*SCALE;

  stroke(0,0,200);
  drawingContext.setLineDash([6,6]);
  line(cx-60,y_eq - Apx,cx+60,y_eq - Apx);
  line(cx-60,y_eq + Apx,cx+60,y_eq + Apx);
  drawingContext.setLineDash([]);

  drawSpring(cx,y1,y2);

  fill(180);
  ellipse(cx,y1,60);

  fill(200);
  ellipse(cx,y2,70);

  fill(0);
  noStroke();
  textAlign(CENTER);
  text("Σ1",cx,y1-35);
  text("Σ2",cx,y2-40);

  if(state==="oscillation" && lift){
    fill(255,0,0);
    text("Αποκόλληση",cx,40);
  }
}

// --------------------------------

function drawSpring(x,y1,y2){
  let coils=12;
  let step=(y2-y1)/coils;

  stroke(0);
  noFill();

  beginShape();
  for(let i=0;i<=coils;i++){
    let dx=(i%2===0)?-10:10;
    vertex(x+dx,y1+i*step);
  }
  endShape();
}

// --------------------------------

function drawArrow(x,y,dy,col){
  stroke(col);
  line(x,y,x,y+dy);

  let s = dy>0?1:-1;
  line(x,y+dy,x-6,y+dy-6*s);
  line(x,y+dy,x+6,y+dy-6*s);
}

// --------------------------------

function drawForces(y1,y2,state,lift){

  let cx = width/2;

  drawArrow(cx,y1,40,color(0,0,255));
  drawArrow(cx,y2,40,color(0,0,255));

  drawArrow(cx-20,y1,-40,color(0,150,0));
  drawArrow(cx-20,y2,-40,color(0,150,0));

  if(state==="loading"){
    drawArrow(cx+20,y1,40,color(255,150,0));
  }

  if(!lift){
    drawArrow(cx+20,y2,-40,color(150,0,150));
  }
}

// --------------------------------

function updateLabels(m1,m2,k,F){
  m1v.textContent = m1+" kg";
  m2v.textContent = m2+" kg";
  kv.textContent = k+" N/m";
  Fv.textContent = Math.round(F)+" N";
}
