const controller = require('../controller/chatController');

test('Ověření hesla', async () => {
    let hash = controller.hash("heslo");
    expect(controller.compare("heslo", hash)).toBe(true);
});


test('chybné heslo', async () => {
    let hash = controller.hash("heslo");   
    expect(controller.compare("veslo", hash)).toBe(false);
});