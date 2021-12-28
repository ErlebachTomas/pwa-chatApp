'use strict';

/**
 Vrátí URL pro WebSocket server
 */
function getwsURL() {
    return ((window.location.protocol === "https:") ? "wss://" : "ws://") + window.location.host
}

// WebSocket
let ws = new WebSocket(getwsURL());

ws.addEventListener('open', (event) => {
    console.log('spojení otevřeno: ', event);
});

ws.addEventListener('message', (event) => {
    console.log('příchozí data: ', event.data);
   
});


$(document).ready(function () {

    $("#sendBox").submit(function (event) {

        event.preventDefault();
        let msg = $('#msgBox').val();

        if (msg.length !== 0) {           
            
            //todo format obj
            let json = { type: "text", msg: msg };           
            ws.send(JSON.stringify(json));
        }
              
     
    });


});

