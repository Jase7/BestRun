var bcrypt = require('bcryptjs');
const saltRounds = 10;

exports.comparePasswords = async function (plainPassword, hash) {
    try {
        const match = await bcrypt.compare(plainPassword, hash);
        return match;
    }catch (e) {
        throw Error('Error while compare password');
    }
};


exports.generateHash = async function (plainPassword) {
    try {
        const salt = await bcrypt.genSalt(saltRounds);
        const hash= await bcrypt.hash(plainPassword, salt, null);
        return hash;
    }catch (e) {
        throw Error('Error while generate hash');
    }
};