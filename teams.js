const axios = require('axios');
const accents = require('remove-accents');

exports.stats = async function (matchList) {
    return axios.get('https://statsapi.web.nhl.com/api/v1/teams')
        .then(async (response) => {
            if (response.status === 200) {
                const teams = response.data.teams;
                return winPercentages(matchList, teams);
            }
        }, (error) => console.log(err) );
};

async function winPercentages(matchList, teams) {
    for (const match of matchList) {
        //match['test'] = 'hej';
        let homeTeam = teams.find(function (element) {
            return accents.remove(element.name) == match.home;
        });
        let awayTeam = teams.find(function (element) {
            return accents.remove(element.name) == match.away;
        });
        if (homeTeam) {
            await axios.get('https://statsapi.web.nhl.com/api/v1/teams/' + homeTeam.id + '/stats')
                .then((response) => {
                    if (response.status === 200) {
                        match.hometeamWinPercentage = response.data.stats[0].splits[0].stat.ptPctg;
                    }
                }, (error) => console.log(err));
        }
        if (awayTeam) {
            await axios.get('https://statsapi.web.nhl.com/api/v1/teams/' + awayTeam.id + '/stats')
                .then((response) => {
                    if (response.status === 200) {
                        match.awayteamWinPercentage = response.data.stats[0].splits[0].stat.ptPctg;
                    }
                }, (error) => console.log(err));
        }
    }
    return matchList;

}
