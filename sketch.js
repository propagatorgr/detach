let g = 10;

let m1El, m2El, kEl, FEl, forcesEl;
let m1v, m2v, kv, Fv;
let FvalBox, FcritBox;

let y1, v1;
let y2;

let y_eq;
let y_L0;

let SCALE = 200;
let dt = 0.016;
let L0 = 1.5;

let state="loading";
let paused=false;
let detached=false;

let prev_v1=0;
let F0 = 0;

// ----------------------------

function setup(){

  createCanvas(window.innerWidth - 260, window.innerHeight);

  m1El = document.getElementById("m1");
  m2El = document.getElementById("m2");
  kEl  = document.getElementById("k");
  FEl  = document.getElementById("F");
  forcesEl = document.getElementById("forces");

  m1v = document.getElementById("m1v");
  m2v = document.getElementById("m2v");
  kv  = document.getElementById("kv");
  Fv  = document.getElementById("Fv");

  FvalBox = document.getElementById("FvalBox");
  FcritBox = document.getElementById("FcritBox");

  // ✅ ΣΩΣΤΗ ΣΕΙΡΑ ΕΝΗΜΕΡΩΣΗΣ
  kEl.addEventListener("input", handleParamChange);
  m1El.addEventListener("input", handleParamChange);

  initSystem();
  updateLimits();
}

// ----------------------------

function handleParamChange(){
  initSystem();
  updateLimits();
}

// ----------------------------

function initSystem(){

  let m1 = +m1El.value;
  let k  = +kEl.value;

  let groundY = height - 100;

  let r2 = 35;
  y2 = groundY - r2;

  y_L0 = y2 - L0*SCALE;

  let deltaL = (m1*g)/k;
  y_eq = y_L0 + deltaL*SCALE;

  y1 = y_eq;
  v1 = 0;

  prev_v1 = 0;
  detached = false;
  paused = false;

  state = "loading";
  F0 = 0;

  setControlsEnabled(true);
}

// ----------------------------

// ✅ ΕΝΙΑΙΑ ΣΥΝΑΡΤΗΣΗ ΠΕΡΙΟΡΙΣΜΩΝ
function updateLimits(){

  let m1 = +m1El.value;
  let k  = +kEl.value;

  let R1 = 30;
  let R2 = 35;

  let groundY = height - 100;
  let y2_local = groundY - R2;
  let y_L0_local = y2_local - L0*SCALE;

  // ✅ --------- ΟΡΙΟ k ---------
  let A_geom = (y2_local - (R1 + R2) - y_L0_local) / SCALE;

  let k_min = (m1 * g) / A_geom;

  if(!isFinite(k_min) || k_min < 1) k_min = 1;

  kEl.min = Math.floor(k_min);

  if(+kEl.value < kEl.min){
    kEl.value = kEl.min;
  }

  // ✅ --------- ΟΡΙΟ F ---------
  let deltaL = (m1*g)/k;
  let y_eq_local = y_L0_local + deltaL*SCALE;

  let Amax_px = (y2_local - (R1 + R2)) - y_eq_local;
  let Amax = Amax_px / SCALE;

  if(Amax < 0) Amax = 0;

  let Fmax = k * Amax;

  if(!isFinite(Fmax) || Fmax < 0) Fmax = 0;

  FEl.max = Math.floor(Fmax);

  if(+FEl.value > FEl.max){
    FEl.value = FEl.max;
  }
}

// ----------------------------

function startSim(){

  let F = +FEl.value;
  let k = +kEl.value;

  F0 = F;

  y1 = y_eq + (F/k)*SCALE;

  FEl.value = 0;

  state = "oscillation";
  paused = false;
  detached = false;

  v1 = 0;
  prev_v1 = 0;

  setControlsEnabled(false);
}

// ----------------------------

function togglePause(){

  paused = !paused;

  let btn = document.querySelector('button[onclick="togglePause()"]');
  btn.textContent = paused ? "Resume" : "Pause";
}

// ----------------------------

function resetSim(){

  FEl.value = 0;

  initSystem();
  updateLimits();

  setControlsEnabled(true);
}

// ----------------------------

function setControlsEnabled(flag){

  m1El.disabled = !flag;
  m2El.disabled = !flag;
  kEl.disabled  = !flag;
  FEl.disabled  = !flag;
}

// ----------------------------

function draw(){

  background(255);

  let m1 = +m1El.value;
  let m2 = +m2El.value;
  let k  = +kEl.value;
  let F  = +FEl.value;

  m1v.textContent=m1;
  m2v.textContent=m2;
  kv.textContent=k;
  Fv.textContent=F;

  let Fcrit=(m1+m2)*g;
  FvalBox.textContent=F.toFixed(1);
  FcritBox.textContent=Fcrit.toFixed(1);

  if(state==="loading"){
    y1 = y_eq + (F/k)*SCALE;
  }

  if(state==="oscillation" && !paused && !detached){

    let x=(y1-y_eq)/SCALE;
    let a=-(k/m1)*x;

    v1+=a*dt;
    y1+=v1*dt*SCALE;

    if(prev_v1 < 0 && v1 >= 0){
      if(y1 < y_L0 && F0 > Fcrit){
        detached = true;
      }
    }

    prev_v1=v1;
  }

  drawScene(y1,y2,k);

  if(forcesEl.checked){
    drawForces(y1,y2,F);
  }
}

// ----------------------------

function drawScene(y1,y2,k){

  let cx = width/2;

  stroke(0);
  line(0,height-100,width,height-100);

  stroke(0,150,0);
  line(cx-50,y_eq,cx+50,y_eq);

  stroke(200,0,0);
  drawingContext.setLineDash([5,5]);
  line(cx-50,y_L0,cx+50,y_L0);
  drawingContext.setLineDash([]);

  let Apx=(F0/k)*SCALE;

  stroke(0,0,200);
  drawingContext.setLineDash([6,6]);
  line(cx-60,y_eq-Apx,cx+60,y_eq-Apx);
  line(cx-60,y_eq+Apx,cx+60,y_eq+Apx);
  drawingContext.setLineDash([]);

  drawSpring(cx,y1+30,y2-35);

  fill(180);
  ellipse(cx,y1,60);

  fill(200);
  ellipse(cx,y2,70);

  fill(0);
  text("Σ1",cx+40,y1);
  text("Σ2",cx+40,y2);

  if(detached){
    fill(255,0,0);
    textAlign(CENTER);
    textSize(18);
    text("Αποκόλληση",cx,40);
  }
}

// ----------------------------

function drawSpring(x,y1,y2){

  let step=(y2-y1)/12;

  noFill();
  beginShape();
  for(let i=0;i<=12;i++){
    let dx=(i%2)?10:-10;
    vertex(x+dx,y1+i*step);
  }
  endShape();
}

// ----------------------------

function drawArrow(x,y,dy,col){

  stroke(col);
  line(x,y,x,y+dy);

  let s = dy>0?1:-1;
  line(x,y+dy,x-6,y+dy-6*s);
  line(x,y+dy,x+6,y+dy-6*s);
}

// ----------------------------

function drawForces(y1,y2,F){

  let cx = width/2;

  let sign = (y1 < y_L0) ? -1 : 1;

  drawArrow(cx,y1,40,color(0,0,255));
  drawArrow(cx,y2,40,color(0,0,255));

  drawArrow(cx-20,y1,-40*sign,color(0,150,0));
  drawArrow(cx-20,y2,40*sign,color(0,150,0));

  if(state==="loading" && F > 0){
    drawArrow(cx+20,y1,40,color(255,150,0));
  }

  drawArrow(cx+20,y2,-40,color(150,0,150));
}
