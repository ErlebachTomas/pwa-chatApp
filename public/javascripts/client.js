'use strict';

/**
 Vrátí URL pro WebSocket server
 */
function getwsURL() {
    return ((window.location.protocol === "https:") ? "wss://" : "ws://") + window.location.host
}

let ws = new WebSocket(getwsURL());

ws.addEventListener('open', (event) => {
    console.log('spojení otevřeno: ', event);
});

ws.addEventListener('message', (event) => {    
    console.log('příchozí data: ', event.data);
});


$(document).ready(function () {
    console.log(getwsURL());
});

