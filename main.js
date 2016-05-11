var request = require('request');

request.post(
    'http://scannerssl.azurewebsites.net',
    { form: { key: 'hamzakhan.org' } },
    function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(body)
        }
        console.log(error);
    }
);