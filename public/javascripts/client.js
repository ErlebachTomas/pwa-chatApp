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
    
    let username = $("#user-name").data("username");
    let json = { type: "init", username: username };

    console.log('spojení otevřeno: ', username, event);

    ws.send(JSON.stringify(json)); // init callback

});

ws.addEventListener('message', (event) => {
    console.log('příchozí data: ', event.data);
   
});


$(document).ready(function () {
    
    renderUsersList();

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



function renderUsersList() {
    
    // https://stackoverflow.com/a/39065147
    const list = ({ id, username, name, profilePicture, status }) => `
     <a href="#" data-username="${username}"  data-conversationID="${id}" class="list-group-item list-group-item-action border-0">
        <div class="d-flex align-items-start">
            <img src="${profilePicture}" alt="${name}" class="avatar">
                <div class="flex-grow-1 ml-3">
                     ${name}
                    <div class="small"><em>${status}</em></div>
                </div>
         </div>
     </a>
    `;

    let vv = "<em>řřř</em>";
    $('#conversation-list').html([
        {
            id: "dfsdf",
            username: "test",
            profilePicture: "https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50.jpg",
            name: escape(vv),
            status: "nevíme"
        },
    
    ].map(list).join(''));
}

/**
 * Ošetření XSS
 * @param {String} s 
 */
function escape(s) {
    return s.replace(
        /[^0-9A-Za-z ]/g,
        c => "&#" + c.charCodeAt(0) + ";"
    );
}