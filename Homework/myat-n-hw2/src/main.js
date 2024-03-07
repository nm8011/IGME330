/*
	main.js is primarily responsible for hooking up the UI to the rest of the application 
	and setting up the main event loop
*/

// We will write the functions in this file in the traditional ES5 way
// In this instance, we feel the code is more readable if written this way
// If you want to re-write these as ES6 arrow functions, to be consistent with the other files, go ahead!

import * as utils from './utils.js';
import * as audio from './audio.js';
import * as canvas from './canvas.js';

const drawParams = {
  showGradient  : true,
  showBars      : true,
  showCircles   : true,
  showNoise     : false,
  showInvert    : false,
  showEmboss    : false
};

const cbCircles = document.querySelector("#circles-cb");
const cbBars = document.querySelector("#bars-cb");
const cbGradient = document.querySelector("#gradient-cb");
const cbNoise = document.querySelector("#noise-cb");
const cbInvert = document.querySelector("#invert-colors-cb");
const cbEmboss = document.querySelector("#emboss-cb");


// 1 - here we are faking an enumeration
const DEFAULTS = Object.freeze({
	sound1  :  "media/New Adventure Theme.mp3"
});


const init = () =>{
  audio.setupWebaudio(DEFAULTS.sound1);
	console.log("init called");
	console.log(`Testing utils.getRandomColor() import: ${utils.getRandomColor()}`);
	let canvasElement = document.querySelector("canvas"); // hookup <canvas> element
	setupUI(canvasElement);

  //default true
  cbCircles.checked = true;
  cbBars.checked = true;
  cbGradient.checked = true;

  canvas.setupCanvas(canvasElement,audio.analyserNode);
  loop();
}

const setupUI = (canvasElement) =>{
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
    }else{
        audio.pauseCurrentSound();
        e.target.dataset.playing = "no"; //our css will set the text to "Play"
    }
  };

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
  cbCircles.onchange = e =>{
    if(!cbCircles.checked){
      drawParams.showCircles = false;
    }else{
      drawParams.showCircles = true;
    }
  }
  cbBars.onchange = e =>{
    if(!cbBars.checked){
      drawParams.showBars = false;
    }else{
      drawParams.showBars = true;
    }
  }
  cbGradient.onchange = e =>{
    if(!cbGradient.checked){
      drawParams.showGradient = false;
    }else{
      drawParams.showGradient = true;
    }
  }
  cbNoise.onchange = e =>{
    if(!cbNoise.checked){
      drawParams.showNoise = false;
    }else{
      drawParams.showNoise = true;
    }
  }
  cbInvert.onchange = e =>{
    if(!cbInvert.checked){
      drawParams.showInvert = false;
    }else{
      drawParams.showInvert = true;
    }
  }  
  cbEmboss.onchange = e =>{
    if(!cbEmboss.checked){
      drawParams.showEmboss = false;
    }else{
      drawParams.showEmboss = true;
    }
  }

} // end setupUI

const loop = () =>{
    /* NOTE: This is temporary testing code that we will delete in Part II */
        setTimeout(loop, 1000/60);
        canvas.draw(drawParams);
}

export {init};