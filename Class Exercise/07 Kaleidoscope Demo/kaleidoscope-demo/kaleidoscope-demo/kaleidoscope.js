// JavaScript Document

//Constants
var CANVAS_WIDTH = 800;
var CANVAS_HEIGHT = 600;
var FPS = 60;
var NUM_SQUARES = 40;
var NUM_CIRCLES = 40;
var NUM_TRIANGLES = 40;

//Global Variables
var ctx;
var squares;
var circles;
var triangles;
var drawingStyle;
var drawBackground;
var drawCircles;
var drawSquares;
var drawTriangles;
var infoElement_drawStyle; // a page element to display script information
var infoElement_drawBackground;
var infoElement_drawCircles;
var infoElement_drawSquares;
var infoElement_drawTriangles;


//wait for the page to load
window.addEventListener("load", init);
function init(e)
{
	var canvasElement = document.querySelector("canvas");
	canvasElement.width = CANVAS_WIDTH;
	canvasElement.height = CANVAS_HEIGHT;
	
	
	ctx = canvasElement.getContext("2d");
	drawingStyle = "lighter";
	drawBackground = true;
	drawCircles = true;
	drawSquares = true;
	drawTriangles = true;
	
	//set up the keyboard for interactivity
	window.addEventListener("keydown", keyPress);
	
	infoElement_drawBackground = document.getElementsByClassName("info")[0];
	infoElement_drawCircles = document.getElementsByClassName("info")[1];
	infoElement_drawSquares = document.getElementsByClassName("info")[2];
	infoElement_drawTriangles = document.getElementsByClassName("info")[3];
	infoElement_drawStyle = document.getElementsByClassName("info")[4];
	
	infoElement_drawStyle.innerHTML = drawingStyle.toUpperCase();
	infoElement_drawBackground.innerHTML = drawBackground;
	infoElement_drawCircles.innerHTML = drawCircles;
	infoElement_drawSquares.innerHTML = drawSquares;
	infoElement_drawTriangles.innerHTML = drawTriangles;
	
	//initialize some arrays
	squares = [];
	circles = [];
	triangles = [];
		
	//populate the shape arrays
	var i; var j;
	var pi = 3.1415; 
	var numRings = 4;
	var radius; var moveSpeed;
	var minMoveSpeed = 0.005;
	var rndDivAmount = 40;
	var maxMoveSpeed = 0.025;
	
	//make some circles
	for (i = 1; i <= numRings; i+=2)
	{
		radius = i * (CANVAS_HEIGHT * 0.75) / numRings;
		moveSpeed = clamp(minMoveSpeed, Math.random() / rndDivAmount, maxMoveSpeed);
		if (Math.random() <= .5) { moveSpeed *= -1; }
		for (j = 1; j <= NUM_CIRCLES / numRings; j+=2)
		{
			circles.push(new Circle(125, "#FF0000", radius, (2 * numRings * j * pi) / NUM_CIRCLES, moveSpeed));
		}
	}
	for (i = 2; i <= numRings; i+=2)
	{
		radius = (i - 1) * (CANVAS_HEIGHT * 0.75) / numRings;
		moveSpeed = clamp(minMoveSpeed, Math.random() / rndDivAmount, maxMoveSpeed);
		if (Math.random() <= .5) { moveSpeed *= -1; }
		for (j = 2; j <= NUM_CIRCLES / numRings; j+=2)
		{
			circles.push(new Circle(125, "#FF0000", radius, (2 * numRings * (j - 1) * pi) / NUM_CIRCLES, moveSpeed));
		}
	}
	
	//make some squares
	numRings = 5;
	for (i = 1; i <= numRings; i++)
	{
		radius = i * (CANVAS_HEIGHT * 0.75) / numRings;
		moveSpeed = clamp(minMoveSpeed, Math.random() / rndDivAmount, maxMoveSpeed);
		if (Math.random() <= .5) { moveSpeed *= -1; }
		for (j = 1; j <= NUM_SQUARES / numRings; j++)
		{
			squares.push(new Square(200, "#0000FF", radius, (2 * numRings * j * pi) / NUM_CIRCLES, moveSpeed));
		}
	}
	for (i = 2; i <= numRings; i+=2)
	{
		radius = (i - 1) * (CANVAS_HEIGHT * 0.75) / numRings;
		moveSpeed = clamp(minMoveSpeed, Math.random() / rndDivAmount, maxMoveSpeed);
		if (Math.random() <= .5) { moveSpeed *= -1; }
		for (j = 2; j <= NUM_SQUARES / numRings; j+=2)
		{
			squares.push(new Square(200, "#0000FF", radius, (2 * numRings * (j - 1) * pi) / NUM_CIRCLES, moveSpeed));
		}
	}
	
	
	//make some triangles
	numRings = 4;
	for (i = 1; i <= numRings; i++)
	{
		radius = i * (CANVAS_HEIGHT * 0.75) / numRings;
		moveSpeed = clamp(minMoveSpeed, Math.random() / rndDivAmount, maxMoveSpeed);
		if (Math.random() <= .5) { moveSpeed *= -1; }
		for (j = 1; j <= NUM_TRIANGLES / numRings; j++)
		{
			triangles.push(new Triangle(75 * (i * 0.75) , "#00FF00", radius, (2 * numRings * j * pi) / NUM_CIRCLES, moveSpeed));
		}
	}
	for (i = 2; i <= numRings; i+=2)
	{
		radius = (i - 1) * (CANVAS_HEIGHT * 0.75) / numRings;
		moveSpeed = clamp(minMoveSpeed, Math.random() / rndDivAmount, maxMoveSpeed);
		if (Math.random() <= .5) { moveSpeed *= -1; }
		for (j = 2; j <= NUM_TRIANGLES / numRings; j+=2)
		{
			triangles.push(new Triangle(75 * (i * 0.75) , "#00FF00", radius, (2 * numRings * (j - 1) * pi) / NUM_CIRCLES, moveSpeed));
		}
	}
	
	//set up the game loop
	setInterval(loop, 1000/FPS)
}


//game loop
function loop()
{
	//console.log("game loop");
	update();
	draw(ctx);
}
function update()
{
	circles.forEach(function(c) { c.update(); });
	squares.forEach(function(s) { s.update(); });
	triangles.forEach(function(t){t.update(); });
}
function draw(context)
{
	//clear the screen
	context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
	
	//draw the background
	if (drawBackground)
	{
		context.globalAlpha = 1.0;
		drawBackgroundGradient(context);
	}
	//set the drawing style
	context.globalAlpha = 0.15;
	context.globalCompositeOperation = drawingStyle;
	
	//draw the circles
	if (drawCircles)
	{
		circles.forEach(function(c) { c.draw(context); });
	}
	//draw the squares
	if (drawSquares)
	{
		context.globalAlpha = 0.3;
		squares.forEach(function(s) { s.draw(context); });
	}
	
	//draw the triangles
	if (drawTriangles)
	{
		context.globalAlpha = 0.2;
		triangles.forEach(function(t){t.draw(context); });
	}
}


//draw functions
function drawBackgroundGradient(context)
{
	//context.fillStyle = "black";
	//context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
	
	context.save();
	context.setTransform(1, 0, 0, 1, 0, 0);
	context.translate(CANVAS_WIDTH * 0.5, CANVAS_HEIGHT * 0.5);
	var grad = context.createRadialGradient(0, 0, CANVAS_WIDTH * 0.05, 0, 0, CANVAS_WIDTH * 0.6);
	grad.addColorStop(0, "#222222");
	grad.addColorStop(1, "black");
	context.fillStyle = grad;
	context.fillRect(-CANVAS_WIDTH * 0.5, -CANVAS_HEIGHT * 0.5, CANVAS_WIDTH, CANVAS_HEIGHT);
	context.restore();
}


//HELPER FUNCTIONS
function clamp(minVal, value, maxVal)
{
	return Math.max(minVal, Math.min(value, maxVal));
}
function keyPress(e)
{
	//console.log("Key Pressed: " + e.keyCode);
	//infoElement.innerHTML = e.keyCode;
	switch (e.keyCode)
	{
		//drawing style codes
		case 81: drawingStyle = "source-over"; break;
        case 87: drawingStyle = "source-in"; break;
        case 69: drawingStyle = "source-out"; break;
        case 82: drawingStyle = "source-atop"; break;
        case 65: drawingStyle = "destination-over"; break;
        case 83: drawingStyle = "destination-in"; break;
        case 68: drawingStyle = "destination-out"; break;
        case 70: drawingStyle = "destination-atop"; break;
        case 90: drawingStyle = "lighter"; break;
        case 88: drawingStyle = "copy"; break;
        case 67: drawingStyle = "xor"; break;
		
		//toggle shapes
		case 72: drawBackground = !drawBackground; break;
		case 74: drawCircles = !drawCircles; break;
		case 75: drawSquares = !drawSquares; break;
		case 76: drawTriangles = !drawTriangles; break;
	}
	
	//console.log("Key Pressed: " + e.keyCode + ", Drawing Style: " + drawingStyle);
	infoElement_drawStyle.innerHTML = drawingStyle.toUpperCase();
	infoElement_drawBackground.innerHTML = drawBackground;
	infoElement_drawCircles.innerHTML = drawCircles;
	infoElement_drawSquares.innerHTML = drawSquares;
	infoElement_drawTriangles.innerHTML = drawTriangles;
}


//constructors
var Circle = function(rad, col, distFromCenter, angle, moveSpeed)
{
	this.x = 0;
	this.y = 0;
	this.drawRadius = rad;
	this.color = col;
	this.updateRadius = distFromCenter;
	this.updateAngle = angle;
	this.updateSpeed = moveSpeed;
}
Circle.prototype.update = function()
{
	this.updateAngle += this.updateSpeed; //assume we are in radians
	if (this.updateAngle >= Math.PI * 2) this.updateAngle = 0;
	
	//var angleToRads = Math.PI * this.updateAngle / 180; //this conversion is unnecessary
	this.x = (Math.cos(this.updateAngle) * this.updateRadius) + (CANVAS_WIDTH * .5);
	this.y = (Math.sin(this.updateAngle) * this.updateRadius) + (CANVAS_HEIGHT * .5);
	//this.x -= (this.radius * 0.5);
	//this.y -= (this.radius * 0.5);
	
}
Circle.prototype.draw = function(context)
{
	//save the old style before making modifications
	context.save();
	context.fillStyle = this.color;

	context.setTransform(1, 0, 0, 1, 0, 0);
	context.translate(this.x, this.y); //()
	
	context.beginPath();
	context.arc(0, 0, this.drawRadius, 0, 2 * Math.PI, false);
	context.fill();
	context.closePath();
	
	//restore the old style
	context.restore();
}

var Square = function(size, col, distFromCenter, angle, moveSpeed)
{
	this.x = 0;
	this.y = 0;
	this.width = size;
	this.height = size;
	this.color = col;
	this.updateRadius = distFromCenter;
	this.updateAngle = angle;
	this.updateSpeed = moveSpeed;
}
Square.prototype.update = function()
{
	this.updateAngle -= this.updateSpeed; //assume we are in radians
	if (this.updateAngle >= Math.PI * 2) this.updateAngle = 0;
	
	//var angleToRads = Math.PI * this.updateAngle / 180; //this conversion is unnecessary
	this.x = (Math.cos(this.updateAngle) * this.updateRadius) + (CANVAS_WIDTH * .5);
	this.y = (Math.sin(this.updateAngle) * this.updateRadius) + (CANVAS_HEIGHT * .5);
	
}
Square.prototype.draw = function(context)
{
	context.save(); //store the identity context
	
	context.fillStyle = this.color;
	
	//context.beginPath();
	//context.arc(this.x, this.y, this.drawRadius, 0, 2 * Math.PI, false);
	//context.fill();
	//context.closePath();
	context.setTransform(1, 0, 0, 1, 0, 0);
	context.translate(this.x, this.y);
	context.rotate(this.updateAngle);
	context.fillRect(0, 0, this.width, this.height);
	
	context.restore();
}

var Triangle = function(sideLength, col, distFromCenter, angle, moveSpeed)
{
	this.x = 0;
	this.y = 0;
	this.length = sideLength;
	this.color = col;
	this.updateRadius = distFromCenter;
	this.updateAngle = angle;
	this.updateSpeed = moveSpeed;
}
Triangle.prototype.update = function()
{
	this.updateAngle += this.updateSpeed; //assume we are in radians
	if (this.updateAngle >= Math.PI * 2) this.updateAngle = 0;
	
	//var angleToRads = Math.PI * this.updateAngle / 180; //this conversion is unnecessary
	this.x = (Math.cos(this.updateAngle) * this.updateRadius) + (CANVAS_WIDTH * .5);
	this.y = (Math.sin(this.updateAngle) * this.updateRadius) + (CANVAS_HEIGHT * .5);
	
}
Triangle.prototype.draw = function(context)
{
	context.save(); //store the identity context
	
	context.fillStyle = this.color;
	
	context.setTransform(1, 0, 0, 1, 0, 0);
	context.translate(this.x, this.y);
	context.rotate(this.updateAngle);
	
	context.beginPath();
	context.moveTo(this.length, 0);
	context.lineTo(-this.length*0.5, this.length);
	context.lineTo(-this.length*0.5, -this.length); 
	context.fill();
	context.closePath();
	
	context.restore();
}






