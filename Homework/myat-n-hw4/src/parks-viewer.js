// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";   
import { getDatabase, ref, set, push, onValue } from  "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCZicxDIArOA5Lnmfw_wZknjZP49GTSkOE",
  authDomain: "favorite-parks-7324f.firebaseapp.com",
  projectId: "favorite-parks-7324f",
  storageBucket: "favorite-parks-7324f.appspot.com",
  messagingSenderId: "423819251384",
  appId: "1:423819251384:web:56eb6ed573bb0800746e4d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
console.log(app); // make sure firebase is loaded


const parks = {
    "p79"   : "Letchworth State Park",
    "p20"   : "Hamlin Beach State Park",
    "p180"  : "Brookhaven State Park",
    "p35"   : "Allan H. Treman State Marine Park",
    "p118"  : "Stony Brook State Park",
    "p142"  : "Watkins Glen State Park",
    "p62"   : "Taughannock Falls State Park",
    "p84"   : "Selkirk Shores State Park",
    "p43"   : "Chimney Bluffs State Park",
    "p200"  : "Shirley Chisholm State Park",
    "p112"  : "Saratoga Spa State Park"
  };

const writeUserData = (userId, name, email) => {
    const db = getDatabase();
    set(ref(db, "users/" + userId), {
      username: name,
      email: email
    });
  };
  
  writeUserData("abc1234","Ace Coder","ace@rit.edu");
  writeUserData("xyz9876","Ima Student","ima@rit.edu");

  const displayList = () =>{
    const db = getDatabase();
    const parkRef = ref(db, 'favparks');
    
    const favParkListElement = document.querySelector('#park-popularity');
  
    let html = "";
   for(let id in parks){
        html += 
        `<li>
            <strong>${parks[id]} (${id})</strong> - Likes: ${id}
        </li>`;
    };
    favParkListElement.innerHTML = html;
  }
  displayList();
