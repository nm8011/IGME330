import * as map from "./map.js";
import * as ajax from "./ajax.js";

// I. Variables & constants
// NB - it's easy to get [longitude,latitude] coordinates with this tool: http://geojson.io/
const lnglatNYS = [-75.71615970715911, 43.025810763917775];
const lnglatUSA = [-98.5696, 39.8282];
let geojson;
let favoriteIds = ["p20","p79","p180","p43"];

// II. Functions
const setupUI = () => {
	// NYS Zoom 5.2
	document.querySelector("#btn1").onclick = () => {
		map.setZoomLevel(5.2);
		map.setPitchAndBearing(0,0);
		map.flyTo(lnglatNYS);
	};

	// NYS isometric view
	document.querySelector("#btn2").onclick = () => {
		map.setZoomLevel(5.5);
		map.setPitchAndBearing(45,0);
		map.flyTo(lnglatNYS);
	};
	
	// World zoom 0
	document.querySelector("#btn3").onclick = () => {
		map.setZoomLevel(3);
		map.setPitchAndBearing(0,0);
		map.flyTo(lnglatUSA);
		// console.log("this happened");
	};

	refreshFavorites();
}
const showFeatureDetails = (id) =>{
	console.log(`showFeatureDetails - id=${id}`);

	const feature = getFeatureById(id);
	document.querySelector("#details-1").innerHTML = `Info for ${feature.properties.title}`;

	//TASK
	//Go ahead and get #details-2 displaying the clicked park's address, phone number, and web site:
	// the website must be a clickable link
	// the phone number must also be a clickable link - use the tel: protocol - google it if you are not familiar with how to use it
	// Get #details-3 displaying the clicked park's description
	document.querySelector("#details-2").innerHTML = `
	<b>Address:</b> ${feature.properties.address}<br>
	<b>Phone:</b> 
		<a href="tel:${feature.properties.phone}">${feature.properties.phone}</a><br>
	<b>Website:</b> 
		<a href="${feature.properties.url}">${feature.properties.url}</a><br>
	`;

	document.querySelector("#details-3").innerHTML = `${feature.properties.description}`;

}
const getFeatureById = (id) =>{
	//TASK
	// 	you need to "search" the geojson.features array for the park feature (object) that has a .id that matches the passed in id argument, and return it
	// an optimal solution uses array.find() and can be done in one line of code (but get it working however you can)
	// for(const feat of geojson.features){
	// 	if(feat.id == id){
	// 		return feat;
	// 	}
	// }
	const feature = geojson.features.find(feat => feat.id === id);
	return feature;
}

//Map Favorite
const refreshFavorites = () =>{
	const favoritesContainer = document.querySelector("#favorites-list");
	favoritesContainer.innerHTML = "";
	for(const id of favoriteIds){
		favoritesContainer.appendChild(createFavoriteElement(id));
	};
};

const createFavoriteElement = (id) =>{
	const feature = getFeatureById(id);
	const a = document.createElement("a");
	a.className = "panel-block";
	a.id = feature.id;
	a.onclick = () => {
		showFeatureDetails(a.id);
		map.setZoomLevel(6);
		map.flyTo(feature.geometry.coordinates);
	};
	a.innerHTML = `
	<span class="panel-icon">
		<i class="fas fa-map-pin"></i>
	</span>
	${feature.properties.title}
	`;
	return a;
};

const init = () => {
	map.initMap(lnglatNYS);
	ajax.downloadFile("data/parks.geojson", (str) => {
		geojson = JSON.parse(str);
		console.log(geojson);
		map.addMarkersToMap(geojson,showFeatureDetails);
		setupUI();
	});
};

init();
