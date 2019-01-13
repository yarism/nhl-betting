const express = require('express');
const app = express();
const apicache = require('apicache');
const cors = require('cors')
const nhl = require('./nhl');

const cache = apicache.middleware;

app.use(cors());

app.get('/', cache('5 minutes'), function (req, res) {
    nhl.games().then(result => {
        return res.send(result);
    });
});

app.listen(process.env.PORT || 8080);