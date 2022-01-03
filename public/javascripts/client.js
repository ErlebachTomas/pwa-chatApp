'use strict';

/**
 Vrátí URL pro WebSocket server
 */
function getwsURL() {
    return ((window.location.protocol === "https:") ? "wss://" : "ws://") + window.location.host
}

// WebSocket
let ws = new WebSocket(getwsURL());
let conID = null; //id konverzace
let activeParticipants = []; //aktivní okno

ws.addEventListener('open', (event) => {
    
    let username = $("#user-name").data("username");
    let json = { type: "init", username: username };

    console.log('spojení otevřeno: ', username, event);

    ws.send(JSON.stringify(json)); // init callback

});

ws.addEventListener('message', (event) => {   
    console.log('příchozí data: ', event.data);
    let data = JSON.parse(event.data);
  
    let username = $("#user-name").data("username");
    
    let participant = $("#participant-name").data("username");

    //console.log(data.sender, "aktivni", participant, username  );
    
    if (participant == data.sender || username == data.sender) {

        let msg = escape(data.message);

        if (data.sender == username) {
         
            myMessage({ msg: msg, time: data.timestamp });
        } else {
            let url = $("#participant-avatar").attr("src");
            receivedMessage({
                name: data.sender,
                profilePicture: url,
                msg: msg,
                time: data.time
            });
        }
    } else {
      
     //$('#conversation-list').find(`[data-username='odr']`).addClass('newMassageAlert');
     $('#conversation-list > a').find(`[data-username='${data.sender}']`).addClass('newMassageAlert');
        
    }

});

// main
$(document).ready(function () {


    let username = $("#user-name").data("username");
    $.getJSON("api/getUserContactList", { username: username },       
        function (data) {
            console.log("user", data);
            renderUsersList(data);

            
    });


    // načtení předchozích zpráv z prvního vlákna 
    // loadConversation($('#conversation-list > a').first());


    $(document).on("click", '#conversation-list > a', function () {
        console.log(conID);

        $(this).removeClass('newMassageAlert');
        loadConversation($(this));
    });

   

    $("#sendBox").submit(function (event) {
        //odeslání zprávy
        event.preventDefault();

        
        let text = $('#msgBox').val();
        let time = new Date();
        //let conversation = $("#user-name").data("conversation");
        let conversation = conID;
        let sender = $("#user-name").data("username");

        //conversation = "61d21b2ad46107d64a3594cc"; //todo odstranit!!!
        console.log(conversation,time); // todo time

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
       
        $('#msgBox').val(""); 
    });


});

function loadConversation(domElement) {
    

    $('#conversation-list > a').removeClass("active");
    $(domElement).addClass("active");

    let username = $("#user-name").data("username");
    let participant = $(domElement).data("username");

    $("#participant-name").data("username", participant);
    $("#participant-name").attr("data-username", participant);
      
    $("#participant-avatar").attr("src", $(domElement).find('img').attr('src'));
    $("#participant-avatar").attr("alt", $(domElement).find('img').attr('alt'));;

    $("#participant-name").text($(domElement).data("name"));
    $("#participant-status").text($(domElement).data("status"));


    $.getJSON("api/conversation", { username: username, participant: participant },
        function (data) {
            console.log(data); //get list msg

            conID = data.conversation._id; // todo data
            activeParticipants = data.conversation.participants;

            console.log("coi:" + data.conversation._id, activeParticipants );
           

            $("#participant-name").data("conversation", data.conversation._id );
            LoadMessage(username,data.messages)

        });
}

function LoadMessage(username,arr) {

    $('#chat').empty();

    arr.forEach((item) => {
        console.log("load msg", item.sender, username );

        let msg = escape(item.message);

        if (item.sender == username) {

            myMessage({ msg: msg, time: item.time });               

        } else {
            let url = $("#participant-avatar").attr("src");
            receivedMessage({
                name: item.sender,
                profilePicture: url,
                msg: msg,
                time: item.time
            });
        }
    });

}



function receivedMessage(data) {
  
    const list = ({ name, profilePicture, msg, time }) => `
    <div class="message ">
        <img class="avatar" src="${profilePicture}" alt="${name}" />
        <p class="msg-text">${msg}</p>
        <div class="small text-muted">${time}</div>
    </div>
    `;

    $('#chat').append([data].map(list).join(''));
}

function myMessage(data) {
   
    const list = ({ msg, time }) => `
    <div class="message right">        
        <p class="msg-text">${msg}</p>
        <div class="small text-muted">${time}</div>
    </div>
    `;
    
    $('#chat').append([data].map(list).join(''));
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
    const list = ({ login, name, profilePicture, status }) => `
     <a href="#" data-username="${login}" data-name="${name}"data-status="${status}" class="conversation list-group-item list-group-item-action border-0">
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