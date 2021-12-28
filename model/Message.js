const mongoose = require('mongoose');

let messageSchema = new mongoose.Schema({

    message: {
        type: String,
        required: true
    },    
    type: String,
    timestamp: Date,

    conversation: mongoose.ObjectId,
    sender: mongoose.ObjectId    
});

module.exports = mongoose.model('Message', messageSchema);


