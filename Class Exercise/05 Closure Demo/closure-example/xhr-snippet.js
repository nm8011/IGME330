function getUser(userId) {
    // This is our XHR object, like a magic wand for HTTP requests
    var xhr = new XMLHttpRequest();

    // We're defining a function inside getUser, that's our closure
    function handleResponse() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                // Closure in action: we have access to xhr here!
                console.log("User data:", xhr.responseText);
            } else {
                console.log("Oops! Something went wrong.");
            }
        }
    }

    // Setting up our magic wand to make a request
    xhr.open("GET", "https://some-api.com/users/" + userId);
    xhr.onreadystatechange = handleResponse; // Setting the function as the callback
    xhr.send(); // Off goes the request!
}

// Time to use our function!
getUser(123); // Replace 123 with any user ID you want to fetch
