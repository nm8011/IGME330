// 6 - the stuff on the page we will be changing
let h1Element;
let scoreElement;
let statusElement;
let score = 0;

// 7 - dat.GUI only calls "top-level" properties of an object
// To get around this issue,  we are creating `controllerObject` below
// and giving it setter and getters
// that will be called whenever dat.GUI tries to change a property value.
// Thus if dat.GUI trying to change the value of controllerObject.h1Color  ...
// this calls the setter (which is a method) - `set h1Color(value)` below ...
// which triggers a block of code to run ...
// and we can then run any code and set any properties that we wish

const controllerObject = {
	// "backing" property we are using to keep track of values
	_h1FontWeight 						: 700, 			// `controllerObject.h1FontWeight` is the "public" property that dat.GUI will call
	_h1Color 									: "black",	// `controllerObject.h1Color` is the "public" property that dat.GUI will call
	_bodyBackgroundColor			: "#FFFFFF", // `controllerObject.bodyBackgroundColor` is the "public" property that dat.GUI will call
	_h1FontFamily							: "Serif",	// `controllerObject.fontFamily` is the "public" property that dat.GUI will call
	_h1FontSize								: 24,				// `controllerObject.fontSize` is the "public" property that dat.GUI will call

	// keep track of the h1's `style.color` value
	set h1Color(value){
		this._h1Color = value;
		h1Element.style.color = value;
	},
	
	get h1Color(){
		return this._h1Color;
	},
	
	// keep track of the <body> `style.background-color` value
	set bodyBackgroundColor(value){
		this._bodyBackgroundColor = value;
		document.body.style.backgroundColor = value;
	},
	
	get bodyBackgroundColor(){
		return this._bodyBackgroundColor;
	},
	
	// keep track of the h1's `style.fontWeight` value
	set h1FontWeight(value){
		this._h1FontWeight = value;
		h1Element.style.fontWeight = value;
	},
	
	get h1FontWeight(){
		return this._h1FontWeight;
	},
	
	// keep track of the h1's `style.fontFamily` value
	set h1FontFamily(value){
		this._h1FontFamily = value;
		h1Element.style.fontFamily = value;
	},
	
	get h1FontFamily(){
		return this._h1FontFamily;
	},
	
	// keep track of the h1's `style.fontSize` value
	set h1FontSize(value){
		this._h1FontSize = value;
		h1Element.style.fontSize = value + "pt";
	},
	
	get h1FontSize(){
		return this._h1FontSize;
	},
	
	increaseTheScore(){
		// call a function that is outside of `controllerObject`
		scoredPoint();
	},
	
	decreaseTheScore(){
		// call a function that is outside of `controllerObject`
		lostPoint();
	}
};

/* START READING COMMENTS HERE */
function init(){
	// 1 - here are the page elements that we will be updating based on input from dat.GUI
	h1Element = document.querySelector("h1");
	scoreElement = document.querySelector("#score");
	
	// 2 - make a new dat.GUI instance and close it
	const gui = new dat.GUI({ width: 400 });
	gui.close();
	
	// 3 - start adding controls to our dat.GUI instance
	
	// 3A - top-level properties like `h1Element.innerHTML` are easy to link to dat.GUI
	gui.add(h1Element, 'innerHTML').name('h1.innerHTML');
	
	// 3B - but nested properties like `h1Element.style.color` can't be accessed directly by dat.GUI
	// so we use our `controllerObject` and its setters and getters to trigger the code we want to run
	// whenever the values of dat.GUI change
	gui.add(controllerObject, 'h1Color', { Black: "black", Red: "red", Green: "green", Blue: "blue" } ).name('h1.style.color');
	gui.addColor(controllerObject, 'bodyBackgroundColor').name('document.body.style.backgroundColor');
	gui.add(controllerObject, 'h1FontWeight').min(100).max(900).step(100).name('h1.style.fontWeight');
	gui.add(controllerObject, 'h1FontFamily', ["Serif","Sans-serif","Monospace","Cursive","Fantasy"]).name('h1.style.fontFamily');
	gui.add(controllerObject, 'h1FontSize', 5, 50).name('h1.style.fontSize'); // Min and max
	
	// 3C - make some buttons
	// here we are calling `controllerObject.increaseTheScore()` and `controllerObject.decreaseTheScore()` **methods**
	// which then call `scoredPoint()` and `lostPoint()` below
	gui.add(controllerObject, 'increaseTheScore').name('Score ++');
	gui.add(controllerObject, 'decreaseTheScore').name('Score --');

}

// 4 - this is called by the `controllerObject` above
function scoredPoint(){
	score ++;
	scoreElement.innerHTML = `Score: ${score}`;
}

// 5 - this is called by the `controllerObject` above
function lostPoint(){
	score --;
	scoreElement.innerHTML = `Score: ${score}`;
}

export {init};

	