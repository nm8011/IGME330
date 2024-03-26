let ctx;
let canvas;
let paused = false;
let oneIteration = 1;
let createRectangles = true;
let createCircles = true;
let createLines = true;
import { getRandomColor, getRandomInt } from './utils.js';
import { drawRectangle,drawLine,drawArc } from './canvas-untils.js';
let init = () =>{
    console.log("page loaded!");
    
    canvas = document.querySelector("canvas");
    
    ctx = canvas.getContext("2d");
    
    // Background Rectangle
    drawRectangle(ctx,20,20,600,440,"red");

    drawRectangle(ctx,120,120,400,300,"yellow",10,"magenta");

    drawLine(ctx,20,20,620,460,5,"magenta");

    drawLine(ctx,620,20,20,460,5,"magenta");
    
    //Face circle
    drawArc(ctx,320,240,50,"green",5,"purple");

    //Smile circle
    drawArc(ctx,320,240,20,"gray",5,"yellow", 0, Math.PI);

    //left eye
    drawArc(ctx,300,225,10,"white",1,"black");

    //right eye
    drawArc(ctx,340,225,10,"white",1,"black");

    drawLine(ctx,20,300,620,300,20,"black");

    setupUI();

    update();
}

let update = () => {
  if(paused) return;
  requestAnimationFrame(update);
  if(createRectangles) drawRandomRect(ctx);
  if(createCircles) drawRandomArc(ctx);
  if(createLines) drawRandomLine(ctx);
}

// event handlers
let canvasClicked = (e) => {
  let rect = e.target.getBoundingClientRect();
  let mouseX = e.clientX - rect.x;
  let mouseY = e.clientY - rect.y;
  console.log(mouseX,mouseY);
  for(let i=0; i<25; i++){
    let x = getRandomInt(-75,75) + mouseX;
    let y = getRandomInt(-75,75) + mouseY;
    let radius = getRandomInt(10,25);
    let color = getRandomColor();
    drawArc(ctx,x,y,radius,color);
  }
}

//draw random
let drawRandomRect = (ctx) =>{
    drawRectangle(ctx,getRandomInt(0,640),getRandomInt(0,480),getRandomInt(10,90),getRandomInt(10,90),getRandomColor(),getRandomInt(2,12),getRandomColor());
}
let drawRandomArc = (ctx) => {
    drawArc(ctx,getRandomInt(0,640),getRandomInt(0,480),getRandomInt(10,100),getRandomColor(),getRandomInt(2,12),getRandomColor());
}
let drawRandomLine = (ctx) =>{
  drawLine(ctx,getRandomInt(0,640),getRandomInt(0,480),getRandomInt(0,640),getRandomInt(0,480),getRandomInt(2,12),getRandomColor());
}

// helpers
let setupUI = () =>{
  document.querySelector("#btn-pause").onclick = ()=>{
    paused = true;
    oneIteration = 0;
  };
  
  document.querySelector("#btn-play").onclick = ()=>{
    if(oneIteration == 0)
    {
      paused = false;
      update();
      oneIteration++;
    }
  };

  document.querySelector("#btn-clear").onclick = () =>{
    drawRectangle(ctx,0,0,640,480,"white");
  }
  canvas.onclick = canvasClicked;

  document.querySelector("#cb-rectangles").onclick = (e)=>{
    createRectangles = e.target.checked;
  }

  document.querySelector("#cb-circles").onclick = (e)=>{
    createCircles = e.target.checked;
  }

  document.querySelector("#cb-lines").onclick = (e)=>{
    createLines = e.target.checked;
  }
}
init();