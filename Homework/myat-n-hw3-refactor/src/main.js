/*
	main.js is primarily responsible for hooking up the UI to the rest of the application 
	and setting up the main event loop
*/
import * as utils from './utils.js';
import * as audio from './audio.js';
import * as canvas from './canvas.js';
import * as nav from './navigation.js';
const drawParams = {
  showGradient  : true,
  showBars      : true,
  showCircles   : true,
  showLine      : true,
  showNoise     : false,
  showInvert    : false,
  showEmboss    : false
};

//Visualization
const cbCircles = document.querySelector("#cb-circles");
const cbBars = document.querySelector("#cb-bars");
const cbGradient = document.querySelector("#cb-gradient");
const cbNoise = document.querySelector("#cb-noise");
const cbInvert = document.querySelector("#cb-invert-colors");
const cbEmboss = document.querySelector("#cb-emboss");
const cbLine = document.querySelector("#cb-line");

let coinOne;
let coinTwo;
let coinImg;
let canvasWidth = canvas.canvasWidth;
let canvasHeight = canvas.canvasHeight;
let play;

// 1 - here we are faking an enumeration
const DEFAULTS = Object.freeze({
	sound1  :  "media/New Adventure Theme.mp3"
});

const init = () =>{
  audio.setupWebaudio(DEFAULTS.sound1); //defaults to first audio track
	let canvasElement = document.querySelector("canvas"); // hookup <canvas> element
	setupUI(canvasElement);

  //default true
  cbCircles.checked = true;
  cbBars.checked = true;
  cbGradient.checked = true;
  cbLine.checked = true;

  const ctx = canvasElement.getContext("2d");

  coinOne = new canvas.Coin(ctx,coinImg,canvasWidth/4,canvasHeight/2, 13);
  coinTwo = new canvas.Coin(ctx,coinImg,(canvasWidth/4) *3,canvasHeight/2, 13);

  let spritesheetURL = "./src/coin_spritesheet.png";
  //Setup canvas

  canvas.setupCanvas(canvasElement,audio.analyserNode);
  loop();
  coinOne.preloadImage(spritesheetURL);
  coinTwo.preloadImage(spritesheetURL);
}

const setupUI = (canvasElement) =>{
  nav.burgerClicked();
  
  // A - hookup fullscreen button
  const fsButton = document.querySelector("#btn-fs");
	const playButton = document.querySelector("#btn-play");
  // add .onclick event to button
  fsButton.onclick = e => {
    console.log("goFullscreen() called");
    utils.goFullscreen(canvasElement);
  };

  //add .onclick evenet to button
  playButton.onclick = e => {
    console.log(`audioCtx.state before = ${audio.audioCtx.state}`);

    //check if context is in suspended state(autoplay policy)
    if (audio.audioCtx.state == "suspended"){
        audio.audioCtx.resume();
    }
    console.log(`audioCtx.state after = ${audio.audioCtx.state}`);
    if(e.target.dataset.playing == "no"){
        //if track is currently paused, play it
        audio.playCurrentSound();
        e.target.dataset.playing = "yes"; //our CSS will set the text to "Paused"
        //if track is playing, pause it
        play = false;
    }else{
        audio.pauseCurrentSound();
        e.target.dataset.playing = "no"; //our css will set the text to "Play"
        play = true;
    }
  };

  //Sliders
  // C - hookup volume slider & label
  let volumeSlider = document.querySelector("#slider-volume");
  let volumeLabel = document.querySelector("#label-volume");
  //add .oninput event to slider
  volumeSlider.oninput = e =>{
    //set the gain
    audio.setVolume(e.target.value);
    //update value of label to match value of sldier
    volumeLabel.innerHTML = Math.round((e.target.value/2 * 100));
  };
  //set value of label to match initial value of slider
  volumeSlider.dispatchEvent(new Event("input"));

  //D - hookup track <select>
  let trackSelect = document.querySelector("#select-track");
  //add .onchange event to <select>
  trackSelect.onchange = e =>{
    audio.loadSoundFile(e.target.value);
    //pause the current track if it is playing
    if (playButton.dataset.playing == "yes"){
        playButton.dispatchEvent(new MouseEvent("click"));
    }
  };

  //Checkboxes
  cbBars.onchange = e => {drawParams.showBars = utils.toggleCheckbox(cbBars)};
  cbCircles.onchange = e => {drawParams.showCircles = utils.toggleCheckbox(cbCircles)};
  cbGradient.onchange = e => {drawParams.showGradient = utils.toggleCheckbox(cbGradient)};
  cbNoise.onchange = e => {drawParams.showNoise = utils.toggleCheckbox(cbNoise)};
  cbInvert.onchange = e => {drawParams.showInvert = utils.toggleCheckbox(cbInvert)};
  cbEmboss.onchange = e => {drawParams.showEmboss = utils.toggleCheckbox(cbEmboss)};
  cbLine.onchange = e => {drawParams.showLine = utils.toggleCheckbox(cbLine)};
} // end setupUI

const loop = () =>{
    /* NOTE: This is temporary testing code that we will delete in Part II */
        setTimeout(loop, 1000/60);
        canvas.draw(drawParams);
}

export {init,play};