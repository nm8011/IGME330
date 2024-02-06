const words1 = ["Acute", "Aft", "Anti-matter", "Bipolar", "Cargo", "Command", "Communication", "Computer", "Deuterium", "Dorsal", "Emergency", "Engineering", "Environmental", "Flight", "Fore", "Guidance", "Heat", "Impulse", "Increased", "Inertial", "Infinite", "Ionizing", "Isolinear", "Lateral", "Linear", "Matter", "Medical", "Navigational", "Optical", "Optimal", "Optional", "Personal", "Personnel", "Phased", "Reduced", "Science", "Ship's", "Shuttlecraft", "Structural", "Subspace", "Transporter", "Ventral"];
const words2 = ["Propulsion", "Dissipation", "Sensor", "Improbability", "Buffer", "Graviton", "Replicator", "Matter", "Anti-matter", "Organic", "Power", "Silicon", "Holographic", "Transient", "Integrity", "Plasma", "Fusion", "Control", "Access", "Auto", "Destruct", "Isolinear", "Transwarp", "Energy", "Medical", "Environmental", "Coil", "Impulse", "Warp", "Phaser", "Operating", "Photon", "Deflector", "Integrity", "Control", "Bridge", "Dampening", "Display", "Beam", "Quantum", "Baseline", "Input"];
const words3 = ["Chamber", "Interface", "Coil", "Polymer", "Biosphere", "Platform", "Thruster", "Deflector", "Replicator", "Tricorder", "Operation", "Array", "Matrix", "Grid", "Sensor", "Mode", "Panel", "Storage", "Conduit", "Pod", "Hatch", "Regulator", "Display", "Inverter", "Spectrum", "Generator", "Cloud", "Field", "Terminal", "Module", "Procedure", "System", "Diagnostic", "Device", "Beam", "Probe", "Bank", "Tie-In", "Facility", "Bay", "Indicator", "Cell"];

const init = () => {
    generateTechno(1);
    loadBabble();
    document.querySelector("#btn-gen-1").addEventListener("click",() => generateTechno(1));
    document.querySelector("#btn-gen-5").addEventListener("click",() => generateTechno(5));

}
function loadBabble() {
    const xhr = new XMLHttpRequest();

    xhr.open("GET", "data/babble-data.json");
    xhr.responseType = "json";

    xhr.onload = (e) => {

        const data = xhr.responseText;

        if(!data){
            document.querySelector("#output").innerHTML = "JSON is null!";
            return;
          }
          console.log(data);
        data = JSON.parse(data);
        

        words1 = data.words1;
        words2 = data.words2;
        words3 = data.words3;
    };

    xhr.send();
  }

//import es6 arrow function randomElement
import { randomElement } from "./utils.js";
const generateTechno = (num) => {
    if(num == 1)
    {
    // return randomElement(words1) + " " + randomElement(words2) + " " + randomElement(words3);
    const str = `${randomElement(words1)} ${randomElement(words2)} ${randomElement(words3)}!`;
    document.querySelector("#output").innerHTML = str;
    }
    else
    {
        //make empty string
        let str = '';
        //for each iteration add to str
        for (let i = 0; i < num; i++) {
            str += `${randomElement(words1)} ${randomElement(words2)} ${randomElement(words3)}!<br>`;
        }
        document.querySelector("#output").innerHTML = str;
    }
}
init();

