
const { OAuth2Client } = require('google-auth-library');
var client = new OAuth2Client( process.env.GOOGLE_CLIENT_ID, '', '');

exports.getUser = code => {
    return client
        .verifyIdToken({ idToken: code, audience: process.env.GOOGLE_CLIENT_ID })
        .then(login => {
            var payload = login.getPayload();

            var audience = payload.aud;
            if (audience !== process.env.GOOGLE_CLIENT_ID) {
                throw new Error(
                    'error while authenticating google user: audience mismatch: wanted [' +
                    process.env.GOOGLE_CLIENT_ID +
                    '] but was [' +
                    audience +
                    ']'
                );
            }
            return {
                name: payload['given_name'],
                surnames: payload['family_name'],
                photo: payload['picture'],
                googleId: payload['sub'],
                emailVerified: payload['email_verified'],
                email: payload['email']
            };
        })
        .then(user => {
            return user;
        })
        .catch(err => {
            throw new Error(
                'error while authenticating google user: ' + JSON.stringify(err)
            );
        });
};