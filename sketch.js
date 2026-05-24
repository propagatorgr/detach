let g = 10;

let m1El, m2El, kEl, FEl, forcesEl;
let m1v, m2v, kv, Fv;
let FvalBox, FcritBox;

let y1, v1;
let y2;

let y_eq;
let y_L0;

let dt = 0.016;
let SCALE;

let L0 = 1.5;

let state = "loading";
let paused = false;
let detached = false;

let prev_v1 = 0;

// --------------------------------

function setup(){

  let canvas = createCanvas(10,10);
  canvas.parent("canvas-wrapper");

  m1El = document.getElementById("m1");
  m2El = document.getElementById("m2");
  kEl  = document.getElementById("k");
  FEl  = document.getElementById("F");
  forcesEl = document.getElementById("forces");

  m1v = document.getElementById("m1v");
  m2v = document.getElementById("m2v");
  kv  = document.getElementById("kv");
  Fv  = document.getElementById("Fv");

  FvalBox  = document.getElementById("FvalBox");
  FcritBox = document.getElementById("FcritBox");

  kEl.addEventListener("input", updateFmax);

  resizeSystem();
  initSystem();
}

// --------------------------------

function windowResized(){
  resizeSystem();
  initSystem();
}

function resizeSystem(){

  let w = document.getElementById("canvas-wrapper").offsetWidth;
  let h = window.innerHeight;

  resizeCanvas(w, h);

  // ✅ δυναμικό scaling
  SCALE = height / 4;
}

// --------------------------------

function initSystem(){

  let m1 = +m1El.value;
  let k  = +kEl.value;

  let groundY = height - 80;

  let r2 = 25;
  y2 = groundY - r2;

  y_L0 = y2 - L0 * SCALE;

  let deltaL = (m1 * g) / k;
  y_eq = y_L0 + deltaL * SCALE;

  y1 = y_eq;
  v1 = 0;

  prev_v1 = 0;

  state = "loading";
  paused = false;
  detached = false;

  updateFmax();
}

// --------------------------------

function updateFmax(){
  let k = +kEl.value;
  let Amax = (height/6) / SCALE;
  let Fmax = k * Amax;

  FEl.max = Math.round(Fmax);

  if(+FEl.value > Fmax){
    FEl.value = Fmax;
  }
}

// --------------------------------

function startSim(){
  state="oscillation";
  v1=0;
  prev_v1=0;
}

function togglePause(){
  paused=!paused;
}

function resetSim(){
  FEl.value=0;
  initSystem();
}

// --------------------------------

function draw(){

  background(255);

  let m1 = +m1El.value;
  let m2 = +m2El.value;
  let k  = +kEl.value;
  let F  = +FEl.value;

  m1v.textContent = m1;
  m2v.textContent = m2;
  kv.textContent  = k;
  Fv.textContent  = F;

  let Fcrit = (m1+m2)*g;

  FvalBox.textContent = F.toFixed(1);
  FcritBox.textContent = Fcrit.toFixed(1);

  if(state==="loading"){
    y1 = y_eq + (F/k)*SCALE;
  }

  if(state==="oscillation" && !paused && !detached){

    let x = (y1-y_eq)/SCALE;
    let a = -(k/m1)*x;

    v1+=a*dt;
    y1+=v1*dt*SCALE;

    // ✅ κορυφή
    if(prev_v1 < 0 && v1 >= 0){

      if(y1 < y_L0 && F > Fcrit){
        detached = true;
      }
    }

    prev_v1 = v1;
  }

  drawScene(y1,y2,k);

  if(forcesEl.checked){
    drawForces(y1,y2);
  }
}

// --------------------------------

function drawScene(y1,y2,k){

  let cx = width/2;
  let r1=25, r2=25;

  line(0,height-80,width,height-80);

  stroke(0,150,0);
  line(cx-50,y_eq,cx+50,y_eq);

  stroke(200,0,0);
  drawingContext.setLineDash([5,5]);
  line(cx-50,y_L0,cx+50,y_L0);
  drawingContext.setLineDash([]);

  drawSpring(cx,y1+r1,y2-r2);

  fill(180);
  ellipse(cx,y1,50);

  fill(200);
  ellipse(cx,y2,50);

  fill(0);
  noStroke();
  text("Σ1",cx+30,y1);
  text("Σ2",cx+30,y2);

  if(detached){
    fill(255,0,0);
    textAlign(CENTER);
    textSize(18);
    text("Αποκόλληση",cx,40);
  }
}

// --------------------------------

function drawSpring(x,y1,y2){

  let step=(y2-y1)/10;

  noFill();
  beginShape();
  for(let i=0;i<=10;i++){
    let dx=(i%2)?8:-8;
    vertex(x+dx,y1+i*step);
  }
  endShape();
}

// --------------------------------

function drawArrow(x,y,dy,col){
  stroke(col);
  line(x,y,x,y+dy);
}

// --------------------------------

function drawForces(y1,y2){

  let cx = width/2;

  let sign = (y1 < y_L0) ? -1 : 1;

  drawArrow(cx,y1,30,color(0,0,255));
  drawArrow(cx,y2,30,color(0,0,255));

  drawArrow(cx-15,y1,-30*sign,color(0,150,0));
  drawArrow(cx-15,y2,30*sign,color(0,150,0));
}
