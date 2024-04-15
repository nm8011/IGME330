export default class PhylloFlower{
    constructor(n=0, centerX=0, centerY=0, divergence=137.5, c=4, fps=30){
        this.n = 0; //n should be initialized to 0 in your constructor
        //The values of the other 4 properties must be passed into the constructor as parameters
        this.centerX = centerX;
        this.centerY = centerY;
        this.divergence = divergence;
        this.c = c;
        this.fps = fps;
    }

    draw(ctx){	//a draw() method that takes a ctx argument
        let angle = this.n * this.dtr(this.divergence);
        let radius = this.c * Math.sqrt(this.n);
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
}
