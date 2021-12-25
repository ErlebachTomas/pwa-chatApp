const mongoose = require("mongoose");

let UserSchema = new mongoose.Schema({
        name: {
            type: String,
            require: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },

        profilePicture: {
            type: String,
        }

});
    
module.exports = mongoose.model("User", UserSchema);