import * as storage from "./storage.js"
// let items = ["???!!!"];
let items = storage.readFromLocalStorage("abc1234-list-app"); //get item from local storage
console.log(items);
// I. declare and implement showItems()
// - this will show the contents of the items array in the <ol>
const showItems = () => {
  const thingList = document.querySelector('.ml-4');
  console.log(thingList);
  // loop though items and stick each array element into an <li>
  // use array.map()!
  let html = "";
  console.log(items.length);
  console.log(items[0]);
  console.log(items[1]);
  html = items.map(item => `<li>${item}</li>`).join('');
  console.log(html);
  // update the innerHTML of the <ol> already on the page
  thingList.innerHTML = html;
  console.log(html);
};

// II. declare and implement addItem(str)
// - this will add `str` to the `items` array (so long as `str` is length greater than 0)
const addItem = str => {
  if(str.length > 0) {
    items.push(str); //add to items
    storage.writeToLocalStorage("abc1234-list-app", items); //store to localstorage
    showItems(); //update showitems;
  }
};


// Also:
// - call `addItem()`` when the button is clicked, and also clear out the <input>
// - and be sure to update .localStorage by calling `writeToLocalStorage("items",items)`
const addButton = document.querySelector('#btn-add');
addButton.addEventListener('click', () => {
  const input = document.querySelector('#thing-text');
  console.log(input);
  addItem(input.value);
  input.value = '';
});

// When the page loads:
// - load in the `items` array from storage.js and display the current items
// you might want to double-check that you loaded an array ...
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray
// ... and if you didn't, set `items` to an empty array
showItems();

// Got it working? 
// - Add a "Clear List" button that empties the items array
const clearButton = document.querySelector('#btn-clear');
clearButton.addEventListener('click', () =>{
  items = [];
  storage.writeToLocalStorage("abc1234-list-app", items);
  showItems();
  console.log("Clear!");
}
)