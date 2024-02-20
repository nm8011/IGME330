let ctx;
let canvas;
let paused = false;
let oneIteration = 1;
let createRectangles = true;
let createCircles = true;
let createLines = true;
// import { getRandomColor, getRandomInt } from './utils.js';

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

//canvas helper
let drawRectangle = (ctx,x,y,width,height,fillStyle="black",lineWidth=0,strokeStyle="black") => {
  ctx.save();
  ctx.fillStyle = fillStyle;
  ctx.beginPath();
  ctx.rect(x,y,width,height);
  ctx.fill();
  if(lineWidth > 0)
  {
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = strokeStyle;
    ctx.stroke();
  }
  ctx.closePath();
  ctx.restore();
}

let drawArc = (ctx,x,y,radius,fillStyle="black",lineWidth=0,strokeStyle="black",startAngle=0,endAngle=Math.PI*2) => {
  ctx.save();
  ctx.fillStyle = fillStyle;
  ctx.beginPath();
  ctx.arc(x,y,radius,startAngle,endAngle,false);
  ctx.fill();
  if(lineWidth > 0)
  {
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = strokeStyle;
    ctx.stroke();
  }
  ctx.closePath();
  ctx.restore();
}

let drawLine = (ctx,x1,y1,x2,y2,lineWidth=1,strokeStyle="black") =>{
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(x1,y1);
  ctx.lineTo(x2,y2);
  ctx.fill();
  if(lineWidth > 0)
  {
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = strokeStyle;
    ctx.stroke();
  }
  ctx.closePath();
  ctx.restore();     
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

let getRandomColor = () =>{
    let getByte = () =>{
      return 55 + Math.round(Math.random() * 200);
    }
    return `rgba(${getByte()},${getByte()},${getByte()},.8)`;
  }
  
  let getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }