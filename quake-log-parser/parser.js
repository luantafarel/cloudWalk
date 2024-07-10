const fs = require('fs');

class Game {
    constructor() {
        this.total_kills = 0;
        this.players = new Set();
        this.ranking = {};
        this.kills_by_mean = {};
    }

    addPlayer(player) {
        if (player && player !== '<world>') { // if the player is not '<world>' and is not null it tries to add a new player to the set of players, if it has not already been added it initializes the player's ranking with 0
            this.players.add(player);
            if (!this.ranking[player]) {
                this.ranking[player] = 0;
            }
        }
    }

    addKill(killer, killed, mod) {
        this.total_kills++; // increments the total number of kills

        this.addPlayer(killer); // tries adding the killer to the set of players
        this.addPlayer(killed); // tries adding the killed to the set of players

        if (killer !== '<world>') { // if the killer is not '<world>' it increments the killer's point by 1, if it is '<world>' it decrements the killed's point by 1
            this.ranking[killer]++; 
            if (killer === killed) { // if the killer is the same as the killed it decrements the killer's point by 1
                this.ranking[killer] -= 1; // Suicide
            }
        } else {
            this.ranking[killed]--;
        }

        this.kills_by_mean[mod] = (this.kills_by_mean[mod] || 0) + 1;
    }

    getPlayers() {
        return Array.from(this.players); // returns the set as a array
    }

    getSortedPoints() { // sorts the object ranking to return ranking 
        return Object.entries(this.ranking)
            .sort(([, a], [, b]) => b - a)
            .reduce((acc, [key, val]) => ({ ...acc, [key]: val }), {}); 
    }
}

const parseLog = (filePath) => { // reads the log file 
    const logContent = fs.readFileSync(filePath, 'utf-8');
    const lines = logContent.split('\n');
    const games = {};

    let currentGame = null;
    let gameID = 0;

    const killRegex = /(\d+):(\d+) Kill: (\d+) (\d+) (\d+): (.*) killed (.*) by (.*)/; // regex to find kill logs 

    lines.forEach(line => {
        if (line.includes('InitGame')) { // checks the line for InitGame, if this is another game, it makes sure to initiate new structures for it 
            gameID++;
            currentGame = new Game();
            games[`game_${gameID}`] = currentGame;
        } else if (line.includes('Kill:')) { // checks the line for Kill:, if it is a kill log, it extracts the killer, killed and mod from the line and adds the kill to the current game
            const matches = killRegex.exec(line);
            if (matches) {
                const [, , , , , , killer, killed, mod] = matches; // extracts the killer, killed and mod from the line. The killer is the 6th element, the killed is the 7th element and the mod is the 8th element.
                currentGame.addKill(killer, killed, mod); // adds the kill to the current game
            }
        }
    });

    return games;
};

module.exports = { parseLog, Game };
