function downloadFile(url,callbackRef){
    const xhr = new XMLHttpRequest();
    //set onerror handler
    xhr.onerror = (e) => console.log("error");
     
    //set onload handler
    xhr.onload = (e) => {
        const headers = e.target.getAllResponseHeaders();
        const jsonString = e.target.response;
        console.log(`headers = ${headers}`);
        console.log(`jsonString = ${jsonString}`);
        callbackRef(jsonString);
    }; //end xhr.onload

    //open connection using HTTP GET method
    xhr.open("GET", url);

    //

    //send request
    xhr.send();
}

export {downloadFile};