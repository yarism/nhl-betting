const express = require('express');
const app = express();
const axios = require('axios');
const cheerio = require('cheerio');
const teams = require('./teams');

app.get('/', function (req, res) {
    //return res.send('Hello world');
    axios.get('https://1x2.se/odds/ishockey/usa/nhl')
    .then((response) => {
        if(response.status === 200) {
            const html = response.data;
            const $ = cheerio.load(html); 
            const matchList = [];
            $('.matchList__row').each(function(i, elem) {
                matchList[i] = {
                    home: $(this).find('.matchList__side--home .matchList__local').text().trim(),
                    away: $(this).find('.matchList__side--away .matchList__local').text().trim(),
                    homeOdds: $(this).find('.matchList__outcomeList .matchList__outcomeItem:nth-child(1)').text().trim(),
                    tieOdds: $(this).find('.matchList__outcomeList .matchList__outcomeItem:nth-child(2)').text().trim(),
                    awayOdds: $(this).find('.matchList__outcomeList .matchList__outcomeItem:nth-child(3)').text().trim()
                }
            });
            teams.stats(matchList).then(result => {
                return res.send(result);
            }).catch(err => {
                // process error here
            });
        }
    }, (error) => console.log(err) );
});

app.listen(process.env.PORT || 8080);