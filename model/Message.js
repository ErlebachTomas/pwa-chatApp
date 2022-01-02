const mongoose = require('mongoose');

let messageSchema = new mongoose.Schema({

    message: {
        type: String,
        required: true
    },
    type: String,
    timestamp: Date,

    conversation: {
        type: mongoose.ObjectId,
        required: true
    },
    sender: {
        type: mongoose.ObjectId,
        required: true
    },
      
});

module.exports = mongoose.model('Message', messageSchema);


