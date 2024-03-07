/*
	The purpose of this file is to take in the analyser node and a <canvas> element: 
	  - the module will create a drawing context that points at the <canvas> 
	  - it will store the reference to the analyser node
	  - in draw(), it will loop through the data in the analyser node
	  - and then draw something representative on the canvas
	  - maybe a better name for this file/module would be *visualizer.js* ?
*/

import * as utils from './utils.js';

let ctx,canvasWidth,canvasHeight,gradient,analyserNode,audioData;
let flower, flower2;
let n = 0;

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

    flower = new PhylloFlower(0, canvasWidth * (1/4), canvasHeight/2, 137.5, 4, 60);
    flower2 = new PhylloFlower(0, canvasWidth * (3/4), canvasHeight/2, 137.5, 4, 60);

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
		
	// 3 - draw gradient
	if(params.showGradient){
        ctx.save();
        ctx.fillStyle = gradient;
        ctx.globalAlpha = .3;
        ctx.fillRect(0,0,canvasWidth,canvasHeight);
        ctx.fillStyle = `rgba(184,255,255,.98)`;
        ctx.fillRect(0,0,canvasWidth,canvasHeight);

        ctx.restore();        
    }
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
            drawCircle(ctx,circleRadius,0,2,utils.makeColor(255, 111, 111, .34 - percent/3.0));

            //purple outer circle
            drawCircle(ctx,circleRadius*1.5,0,2,utils.makeColor(184, 0, 255, .10 - percent/10.0));

            //yellow-ish circles, smaller
            drawCircle(ctx,circleRadius*0.5,0,2,utils.makeColor(200, 200, 255, .50 - percent/5.0));

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

    flower.draw();
    flower2.draw();

	// D) copy image data back to canvas
    ctx.putImageData(imageData, 0, 0);
}//end draw()

class PhylloFlower{
    constructor(n=0, centerX=0, centerY=0, divergence=137.5, c=4, fps=60){
        this.n = 0; //n should be initialized to 0 in your constructor
        //The values of the other 4 properties must be passed into the constructor as parameters
        this.centerX = centerX;
        this.centerY = centerY;
        this.divergence = divergence;
        this.c = c;
        this.fps = fps;
    }

    draw(){	//a draw() method that takes a ctx argument
        let percent = audioData[this.n] / 255;
        let angle = this.n * this.dtr(this.divergence) * percent;
        let radius = this.c * Math.sqrt(this.n) * percent;
        let x = radius * Math.cos(angle) + this.centerX;
        let y = radius * Math.sin(angle) + this.centerY;
        let color = `hsl(${this.n/5 % 361},100%,50%)`;
        this.drawCircle(ctx,x,y,2,color);
        this.n++;
    }

    drawCircle(ctx,x,y,radius,color){
    ctx.save();
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x,y,radius,0,Math.PI * 2);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
    }

    dtr(degrees){ return degrees * (Math.PI/180);}
    update(){
        setTimeout(() => this.update,1000/this.fps);
        draw(ctx);
    }
}
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

export {setupCanvas,draw,PhylloFlower};