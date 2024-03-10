/*
	The purpose of this file is to take in the analyser node and a <canvas> element: 
	  - the module will create a drawing context that points at the <canvas> 
	  - it will store the reference to the analyser node
	  - in draw(), it will loop through the data in the analyser node
	  - and then draw something representative on the canvas
	  - maybe a better name for this file/module would be *visualizer.js* ?
*/
import * as utils from './utils.js';
import * as main from './main.js';

let ctx,canvasWidth,canvasHeight,gradient,analyserNode,audioData;
let angle = 0;
let rotateSpeed = 1;
const setupCanvas = (canvasElement,analyserNodeRef) =>{
	// create drawing context
	ctx = canvasElement.getContext("2d");
	canvasWidth = canvasElement.width;
	canvasHeight = canvasElement.height;
	// create a gradient that runs top to bottom
	gradient = utils.getLinearGradient(ctx,0,0,0,canvasHeight,[{percent:0,color:"blue"},{percent:.25,color:"green"},{percent:.5,color:"yellow"},{percent:.75,color:"red"},{percent:1,color:"magenta"}]);
	// keep a reference to the analyser node
	analyserNode = analyserNodeRef;
	// this is the array where the analyser data will be stored
	audioData = new Uint8Array(analyserNode.fftSize/2);
}

const draw = (params={}) =>{
  // 1 - populate the audioData array with the frequency data from the analyserNode
	// notice these arrays are passed "by reference" 
    analyserNode.getByteFrequencyData(audioData);
    // OR
	//analyserNode.getByteTimeDomainData(audioData); // waveform data
	
	// 2 - draw background
	ctx.save();
    ctx.fillStyle = "black";
    ctx.globalAlpha = .1;
    ctx.fillRect(0,0,canvasWidth,canvasHeight);
    ctx.restore();
    angle += rotateSpeed;
    if(angle > 500) angle = 10;
	// 3 - draw gradient
	if(params.showGradient){
        ctx.save();
        ctx.translate(canvasWidth / 2, canvasHeight / 2);
        ctx.rotate(angle);
        ctx.translate(-canvasWidth / 2, -canvasHeight / 2);
        ctx.fillStyle = gradient;
        ctx.globalAlpha = .3;
        ctx.fillRect(0,0,canvasWidth,canvasHeight);
        ctx.fillStyle = `rgba(184,255,255,.98)`;
        ctx.fillRect(0,0,canvasWidth,canvasHeight);
        // angle+=rotateSpeed;
        ctx.restore();     
    }
    ctx.save();
    if(params.showLine){
        const BAR_WIDTH = 30;
        const MAX_BAR_HEIGHT = 100;
        const PADDING = 4;
        const MIDDLE_Y = canvasHeight/2;
        ctx.translate(canvasWidth / 2, canvasHeight / 2);
        ctx.rotate(angle);
        ctx.translate(-canvasWidth / 2, -canvasHeight / 2);
        if(!main.play)
        {
        ctx.fillStyle = "red";
        ctx.save();
        ctx.translate(440, MIDDLE_Y-170);
        for(let b of audioData){
            let percent = b/255;
            if(percent < .02) percent = .02;
            ctx.translate(BAR_WIDTH, 0);
            ctx.rotate(Math.PI * 2/32);
            ctx.save(); //for flip
            ctx.scale(1,-1);
            ctx.fillStyle = `rgb(${b},${b-128},${255-b})`;
            ctx.fillRect(0,0,BAR_WIDTH,MAX_BAR_HEIGHT * percent);
            ctx.restore();
            ctx.translate(PADDING,10); //add space between bars
        }
        ctx.restore();
        }
    
        ctx.save();
        ctx.strokeStyle="white";
        ctx.lineWidth = 3;
        let x = 0;
        let y = MIDDLE_Y + 200;
        ctx.beginPath();
        if(!main.play)
        {
        ctx.moveTo(x,y);
        for(let b of audioData){
            //moveTo()s
            ctx.lineTo(x,y-b);
            x += (ctx.canvas.width/(audioData.length-10));
        }
        ctx.stroke();
        ctx.closePath();
     }
        ctx.restore();

    }
    ctx.restore();
	// 4 - draw bars
	if(params.showBars){
        let barSpacing = 4;
        let margin = 5;
        let screenWidthForBars = canvasWidth - (audioData.length * barSpacing) - margin * 2;
        let barWidth = screenWidthForBars / audioData.length;
        let barHeight = 200;
        let topSpacing = 100;

        ctx.save();
        ctx.fillStyle = 'rgba(255,255,255,0.50)';
        ctx.strokeStyle = 'rgba(0,0,0,0.5)';
        //loop through the data and draw!
        for(let i=0; i<audioData.length; i++){
            ctx.fillRect(margin + i * (barWidth + barSpacing),topSpacing + 256-audioData[i],barWidth,barHeight);
            ctx.strokeRect(margin + i * (barWidth + barSpacing),topSpacing + 256-audioData[i],barWidth,barHeight);
        }
        ctx.restore();
    }
	// 5 - draw circles
	if(params.showCircles){
        let maxRadius = canvasHeight/4;
        ctx.save();
        ctx.globalAlpha = 0.5;
        for(let i=0; i<audioData.length; i++){
            //red-ish circles
            let percent = audioData[i] / 255;
            
            //middle circle
            let circleRadius = percent * maxRadius;
            drawCircle(ctx,circleRadius,0,2,utils.makeColor(255, 111, 111, .34 - percent/3.0),);

            //purple outer circle
            drawCircle(ctx,circleRadius*1.5,0,2,utils.makeColor(184, 0, 255, .10 - percent/10.0));

            //red-ish circles, smaller
            drawCircle(ctx,circleRadius*0.5,0,2,utils.makeColor(200, 200, 255, .50 - percent/5.0));

            //white ring outside
            drawCircle(ctx,circleRadius*2,0,2,utils.makeColor(0,0,0,0),"rgba(255,255,255,1)",10);
        }
        ctx.restore();
    }

    // 6 - bitmap manipulation
	// TODO: right now. we are looping though every pixel of the canvas (320,000 of them!), 
	// regardless of whether or not we are applying a pixel effect
	// At some point, refactor this code so that we are looping though the image data only if
	// it is necessary

	// A) grab all of the pixels on the canvas and put them in the `data` array
	// `imageData.data` is a `Uint8ClampedArray()` typed array that has 1.28 million elements!
	// the variable `data` below is a reference to that array 
	let imageData = ctx.getImageData(0,0,canvasWidth,canvasHeight);
    let data = imageData.data;
    let length = data.length;
    let width = imageData.width; //not using here
	// B) Iterate through each pixel, stepping 4 elements at a time (which is the RGBA for 1 pixel)
    for(let i = 0; i<length; i++){
		// C) randomly change every 20th pixel to red
        if(params.showNoise && Math.random() < .05){
			// data[i] is the red channel
			// data[i+1] is the green channel
			// data[i+2] is the blue channel
			// data[i+3] is the alpha channel
			data[i] = data[i+1] = data[i+2] = 0;// zero out the red and green and blue channels
            data[i+1] = 200;
		} // end if

        //invert?
        if(params.showInvert){
            let red = data[i], green = data[i+1], blue = data[i+2];
            data[i] = 255 - red;
            data[i+1] = 255 - green;
            data[i+2] = 255 - blue;
            //data[i+3] is the alpha, but we're leaving that alone
        }
        
	} // end for

    if(params.showEmboss){
        for(let i=0; i<length; i++){
            if(i%4 == 3) continue; //skip alpha channel
            data[i] = 127 + 2*data[i] -data[i+4] - data[i+width * 4];
        }
    }

	// D) copy image data back to canvas
    ctx.putImageData(imageData, 0, 0);

    ctx.save();
    ctx.fillStyle = "black";
    ctx.globalAlpha = .1;
    ctx.fillRect(0,0,canvasWidth,canvasHeight);
    ctx.restore();
}//end draw()

const drawCircle = (ctx,radius,startAngle, endAngle, fillStyle, strokeStyle="red", linewidth=0) =>{
    ctx.save();
    ctx.fillStyle = fillStyle;
    ctx.strokeStyle = strokeStyle;
    ctx.beginPath();
    ctx.arc(canvasWidth/2, canvasHeight/2, radius, startAngle, endAngle * Math.PI, false);
    ctx.linewidth = linewidth;
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
    ctx.restore();
}
class Coin{
    spritesheetURL = "./src/coin_spritesheet.png";
    constructor(ctx, spritesheet, x, y, spriteCount){
        this.ctx = ctx;
        this.spritesheet = spritesheet;
        this.x = x;
        this.y = y;
        this.spriteCount = spriteCount;
        this.frame = 0;
        this.preloadImage(this.spritesheetURL);
    }

    drawRect()
    {
        ctx.globalAlpha = .3;
        ctx.fillStyle = `rgba(184,255,255,.98)`;
        ctx.fillRect(0,0,100,100);
        console.log("this happedn");
    }
    draw(){
        //size of sprite
        const frameWidth = this.spritesheet.width/this.spriteCount;
        const frameHeight = this.spritesheet.height;
        this.ctx.drawImage(this.spritesheet,
            this.frame * this.spritesheet.width, //x of current sprite in spritesheet
            0, //y
            frameWidth, //width of sprite
            frameHeight,
            this.x, //xPos of where we want the sprite to be
            this.y,
            frameWidth,frameHeight);
    }
    update(){
        setTimeout(() => this.update(), 100); // 10 FPS
        //increment
        this.frame = (this.frame + 1) % this.spriteCount //will reiterate the spritesheet if frame value is greater than spritecount
        this.draw();
    }

    preloadImage(url) {
        let img = new Image();
        img.onload = () => {
            this.spritesheet = img;
            this.update();
        };
        img.src = url;
    }
    // coinSpinning = [
    //     { x: 0, y: 62, w: 30, h: 30 },
    //     { x: 62, y: 62, w: 30, h: 30 },
    //     { x: 124, y: 62, w: 30, h: 30 },
    //     { x: 186, y: 62, w: 30, h: 30 },
    //     { x: 248, y: 62, w: 30, h: 30 },
    //     { x: 310, y: 62, w: 30, h: 30 },
    //     { x: 372, y: 62, w: 30, h: 30 },
    //     { x: 434, y: 62, w: 30, h: 30 },
    //     { x: 496, y: 62, w: 30, h: 30 },
    //     { x: 558, y: 62, w: 30, h: 30 },
    //     { x: 682, y: 62, w: 30, h: 30 },
    //     { x: 744, y: 62, w: 30, h: 30 },
    //     { x: 800, y: 62, w: 30, h: 30 },
    // ]
}
export {setupCanvas,draw, ctx, Coin};