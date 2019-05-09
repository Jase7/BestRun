// const client_id  = process.env.FACEBOOK_CLIENT_ID;
// const client_secret = process.env.FACEBOOK_CLIENT_SECRET;

const fetch = require('node-fetch');

exports.getUser = code => {
    let appToken;
    let url =
        'https://graph.facebook.com/oauth/access_token?client_id=' +
        process.env.FACEBOOK_CLIENT_ID +
        '&client_secret=' +
        process.env.FACEBOOK_CLIENT_SECRET +
        '&grant_type=client_credentials';
    return fetch(url, {method: 'GET'})
        .then(response => response.json())
        .then(response => {
            appToken = response.access_token;
            return fetch(
                'https://graph.facebook.com/debug_token?input_token=' +
                code +
                '&access_token=' +
                appToken,
                {
                    method: 'GET'
                }
            );
        })
        .then(response => response.json())
        .then(response => {
            const {app_id, is_valid, user_id} = response.data;
            if (app_id !== process.env.FACEBOOK_CLIENT_ID) {
                throw new Error(
                    'invalid app id: expected [' +
                    process.env.FACEBOOK_CLIENT_ID +
                    '] but was [' +
                    app_id +
                    ']'
                );
            }
            if (!is_valid) {
                throw new Error('token is not valid');
            }
            return fetch('https://graph.facebook.com/' +
                user_id + '?fields=id,name,last_name,picture,email&access_token=' + appToken, {
                method: 'GET',
            });
        })
        .then(response => response.json())
        .then(response => {
            console.log(appToken);
            console.log(response);
            const {id, last_name,picture, email, name} = response;
            let user = {
                name: name,
                surnames:last_name,
                photo: picture.data.url,
                facebookId: id,
                email: email
            };
            return user;
        })

        .catch(err => {
            throw new Error(
                'error while authenticating facebook user: ' + JSON.stringify(err)
            );
        });
};