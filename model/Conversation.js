const mongoose = require("mongoose");

let ConversationSchema = new mongoose.Schema({

    participants: Array
        
});

module.exports = mongoose.model("Conversation", ConversationSchema);



