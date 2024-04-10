import * as main from "./main.js";
window.onload = ()=>{
	console.log("window.onload called");
	// 1 - do preload here - load fonts, images, additional sounds, etc...
	const loadJsonXHR = () =>{
        const url = "data/av-data.json";
        const xhr = new XMLHttpRequest();

        xhr.onload = (e) =>{
            console.log(`In onload - HTTP Status Code = ${e.target.status}`);
            const string = e.target.responseText;
            let json;
            try{
                json = JSON.parse(string);
            }catch{
                document.querySelector("#output").innerHTML = "Bad JSON!";
                return;
            }

			//assign value to title but if json.title is not found, report it as so
			const title = json.title = json.title ? json.title : "No title Found";
			const audioFiles = json.audioFiles;
			const audioNames = json.audioNames;
			const description = json.description;
			const features = json.features;

			//Title of App
			document.querySelector("#title").innerHTML = title;
			document.querySelector("#titleName").innerHTML = title;

			//File Names
			const qsFile = document.querySelector("#select-track");
			for(let i = 0; i<audioFiles.length; i++){
				qsFile.options[i].value = audioFiles[i];
				qsFile.options[i].text = audioNames[i];
			}

			//Description & Features
			const qsDescription = document.querySelector("#description");
			let html = `${description}\n`;

			html += `<ul>`;
			for(let i=0; i<features.length; i++){
				html += `<li>${features[i]}</li>`
			}
			html += `</ul>`;
			console.log(features);

			qsDescription.innerHTML = html;
        };

        xhr.onerror = e => console.log(`In onerror - HTTP Status Code = ${e.target.status}`);
        xhr.open("GET", url);
        xhr.send();
	}
	loadJsonXHR();

	// 2 - start up app
	main.init();
}