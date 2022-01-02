const mongoose = require("mongoose");

let UserSchema = new mongoose.Schema({

        login: {
            type: String,
            require: true,
            unique: true,
        },
        name: {
            type: String,
            require: true,        
        },
        password: {
            type: String,
            required: true,
        },
        profilePicture: {
            type: String,
        },
        status: {
            type: String,
        }

});
    
module.exports = mongoose.model("User", UserSchema);