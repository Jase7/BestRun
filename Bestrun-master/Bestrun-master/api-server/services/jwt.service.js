const jwt = require('jsonwebtoken');

exports.generateJWT = function (name, surnames, id, email, role, active) {
    const today = new Date();
    const expirationDate = new Date(today);
    expirationDate.setDate(today.getDate() + 60);

    return jwt.sign({
            name: name,
            surnames: surnames,
            email: email,
            id: id,
            role: role,
            exp: parseInt(expirationDate.getTime() / 1000, 10)
        },
        process.env.JWT_KEY);
};

exports.getData = async function (headers) {
    try {
        const token = getToken(headers);
        if (token)
            return await jwt.verify(token, process.env.JWT_KEY);
        return null;
    } catch (e) {
        throw Error("Error Occured while getting data token")
    }
};

function getToken(headers) {
    if (headers && headers.authorization) {
        let parted = headers.authorization.split(' ');
        if(!parted)return null;
        if (parted.length === 2) {
            return parted[1];
        } else {
            return null;
        }
    } else {
        return null;
    }
}