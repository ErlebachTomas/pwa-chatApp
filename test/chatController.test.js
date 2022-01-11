const controller = require('../controller/chatController');
const app = require('./server');

const request = require('supertest');
const mongoose = require('mongoose');

afterAll(() => { mongoose.connection.close(); }); //ukončit spojení po testech

test("seznam uživatelů", async () => {

    const res = await request(app).get("/api/getAllUsers");        
    expect(res.statusCode).toEqual(200);   
    expect(res.body.length).toBeGreaterThan(0);

});

test("Konverzace", async () => {
    let username = "marek";
    let participant = "jan";

    const res = await request(app).get("/api/conversation?username=" + username +"&participant=" + participant);

    expect(res.statusCode).toEqual(200);
    expect(res.body.conversation.participants).toEqual(expect.arrayContaining([username, participant]));
    expect(res.body).toHaveProperty("messages");
});

test("Ověření hesla", async () => {
    let hash = controller.hash("heslo");
    expect(controller.compare("heslo", hash)).toBe(true);
});


test("chybné heslo", async () => {
    let hash = controller.hash("heslo");
    expect(controller.compare("veslo", hash)).toBe(false);
});


test("Kontakty", async () => {
    let username = "marek";
  
    const res = await request(app).get("/api/getUserContactList?username=" + username);

    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toBeGreaterThan(0);

    expect(res.body[0]).toHaveProperty("login");
    expect(res.body[0]).toHaveProperty("name");
    expect(res.body[0]).toHaveProperty("profilePicture");
});




