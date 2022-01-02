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
   // todo zpracovaní zpráv
});

// main
$(document).ready(function () {

    let username = $("#user-name").data("username");
    $.getJSON("api/getUserContactList", { username: username },       
        function (data) {
            console.log("user", data);
            renderUsersList(data);
    });


    // načtení předchozích zpráv z vlákna
    $('#conversation-list > a').on("click", loadConversation(this));

    loadConversation($('#conversation-list > a').first());

    $("#sendBox").submit(function (event) {
        //odeslání zprávy
        event.preventDefault();

        let text = $('#msgBox').val();
        let time = new Date();
        let conversation = "id";
        let sender = "id";

        let msg = {
            message: text,
            type: "text",
            timestamp: time,
            conversation: conversation,
            sender: sender
        }

        if (msg.length !== 0) {  
            let json = { type: "text", msg: msg };           
            ws.send(JSON.stringify(json));
        }
                   
    });


});

function loadConversation(domElement) {
    console.log("ok");

    $('#conversation-list > a').removeClass("active");
    $(domElement).addClass("active");

    let username = $("#user-name").data("username");
    let participant = $(domElement).data("username");

    $("#participant-avatar").val($(domElement).find('img').attr('src'));;
    $("#participant-name").val($(domElement).data("name"));
    $("participant-status").val($(domElement).data("status"));

    $.getJSON("api/conversation", { username: username, participant: participant },
        function (data) {
            console.log(data); //todo load msg
        });
}


function receivedMessage(sender, msg) {
  
    const list = ({name, profilePicture, time }) => `
    <div class="message right">
        <img class="avatar" src="${profilePicture}" alt="${name}" />
        <p class="msg-text">${msg}</p>
        <div class="small text-muted">${time}</div>
    </div>
    `;

    $('.chat').append([item].map(list).join(''));
}


/**
 * Vykreslí list kontaktů
 * @param {any} data
 */
function renderUsersList(data) {
    data.forEach((item) => {
        renderUsersCard(item);
    });
}

/**
 * Vykreslí kartu v seznamu kontaktů
 * @param {any} item
 */
function renderUsersCard(item) {
    
    // https://stackoverflow.com/a/39065147
    const list = ({ username, name, profilePicture, status }) => `
     <a href="#" data-username="${username}" data-name="${name}"data-status="${status}" class="list-group-item list-group-item-action border-0">
        <div class="d-flex align-items-start">
            <img src="${profilePicture}" alt="${name}" class="avatar">
                <div class="flex-grow-1 ml-3">
                     ${name}
                    <div class="small"><em>${status}</em></div>
                </div>
         </div>
     </a>
    `;
        
    $('#conversation-list').append([item].map(list).join(''));
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