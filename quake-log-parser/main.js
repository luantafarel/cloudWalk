const { parseLog } = require('./parser');

const logFilePath = './logs/qgames.log';

const games = parseLog(logFilePath);

const results = Object.keys(games).map(gameID => {
    const game = games[gameID];
    return {
        game_id: gameID,
        total_kills: game.total_kills,
        players: game.getPlayers(),
        ranking: game.getSortedPoints(),
        kills_by_mean: game.kills_by_mean
    };
});

console.log(JSON.stringify(results, null, 2));