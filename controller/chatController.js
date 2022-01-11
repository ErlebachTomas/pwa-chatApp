const  Message = require('../model/Message');
const  User = require('../model/User');
const  Conversation = require('../model/Conversation');
const ObjectId = require('mongodb').ObjectId;

const bcrypt = require("bcrypt");

//https://docs.mongodb.com/manual/reference/sql-comparison/#select

/**
 * Vrátí seznam všech uživatelů (username, jméno, avatar)
 * @param {any} req
 * @param {any} res
 */
exports.getAllUsers = async function (req, res) {

    try {
        let data = await User.find({}, { login: 1, name: 1, profilePicture: 1 });
        res.json(data);

    } catch (err) {
        res.status(500).json(err);
    }
};

/**
 * Seznam kontaktů 
 * @param {any} username id
 */
exports.getUserContactList = async function (username) {

    let contactList = await User.find(
        { login: { $ne: username } },
        { login: 1, name: 1, profilePicture: 1, status: 1 }).lean();
    
    return contactList;
}
/**
 * Seznam účastníků konverzace
 * @param {String} cid id konverzace
 */
exports.getConversation = async function (id) {

    let cid = new ObjectId(id);
    let conversation = await Conversation.findOne({ _id: cid }, {}).lean();

    return conversation;
}


/**
 * Zahashování hesla
 * @param {string} text heslo
 * @returns {string} hash
 */
exports.hash = function (text) {

    return bcrypt.hashSync(text, 12);

};

/**
 * Ověření hesla  
 * @param {string} text heslo
 * @param {string} hash 
 * @returns {boolean} result true pokud je stejny 
 */
exports.compare = function (text, hash) {

    return bcrypt.compareSync(text, hash);
};


