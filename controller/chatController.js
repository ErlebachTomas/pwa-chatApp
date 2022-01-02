const  Message = require('../model/Message');
const  User = require('../model/User');
const  Conversation = require('../model/Conversation');

//todo API + apiary.io
// https://docs.mongodb.com/manual/reference/sql-comparison/#select


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


