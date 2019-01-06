const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs'); 

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
            console.log(matchList);
            axios.get('https://statsapi.web.nhl.com/api/v1/teams')
                .then((response) => {
                    if(response.status === 200) {
                        //console.log(response.data.teams);
                        const teams = response.data.teams;

                        matchList.forEach(function(match) {
                            let homeTeam = teams.find(function(element) {
                                return element.name === match.home;
                            });
                            let awayTeam = teams.find(function(element) {
                                return element.name === match.away;
                            });
                            axios.get('https://statsapi.web.nhl.com/api/v1/teams/' + homeTeam.id + '/stats')
                                .then((response) => {
                                    if(response.status === 200) {
                                        console.log(match.home);
                                        console.log(response.data.stats[0].splits[0].stat);
                                    }
                                }, (error) => console.log(err) );

                            axios.get('https://statsapi.web.nhl.com/api/v1/teams/' + awayTeam.id + '/stats')
                                .then((response) => {
                                    if(response.status === 200) {
                                        console.log(match.away);
                                        console.log(response.data.stats[0].splits[0].stat);
                                    }
                                }, (error) => console.log(err) );
                        });
                    }
                }, (error) => console.log(err) );
        }
    }, (error) => console.log(err) );

/*axios.get('https://statsapi.web.nhl.com/api/v1/teams')
    .then((response) => {
        if(response.status === 200) {
            console.log(response.data.teams);
        }
    }, (error) => console.log(err) );*/