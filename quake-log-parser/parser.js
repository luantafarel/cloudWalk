const fs = require('fs');

class Game {
    constructor() {
        this.total_kills = 0;
        this.players = new Set();
        this.points = {};
        this.kills_by_mean = {};
    }

    addPlayer(player) {
        if (player && player !== '<world>') {
            this.players.add(player);
            if (!this.points[player]) {
                this.points[player] = 0;
            }
        }
    }

    addKill(killer, killed, mod) {
        this.total_kills++;

        this.addPlayer(killer);
        this.addPlayer(killed);

        if (killer !== '<world>') {
            this.points[killer] = (this.points[killer] || 0) + 1;
            if (killer === killed) {
                this.points[killer] -= 1; // Suicide
            }
        } else {
            this.points[killed] = (this.points[killed] || 0) - 1;
        }

        this.kills_by_mean[mod] = (this.kills_by_mean[mod] || 0) + 1;
    }

    getPlayers() {
        return Array.from(this.players).filter(player => player !== '<world>');
    }

    getSortedPoints() {
        return Object.entries(this.points)
            .sort(([, a], [, b]) => b - a)
            .reduce((acc, [key, val]) => ({ ...acc, [key]: val }), {});
    }
}

const parseLog = (filePath) => {
    const logContent = fs.readFileSync(filePath, 'utf-8');
    const lines = logContent.split('\n');
    const games = {};

    let currentGame = null;
    let gameID = 0;

    const killRegex = /(\d+):(\d+) Kill: (\d+) (\d+) (\d+): (.*) killed (.*) by (.*)/;

    lines.forEach(line => {
        if (line.includes('InitGame')) {
            gameID++;
            currentGame = new Game();
            games[`game_${gameID}`] = currentGame;
        } else if (line.includes('Kill:')) {
            const matches = killRegex.exec(line);
            if (matches) {
                const [, , , , , , killer, killed, mod] = matches;
                currentGame.addKill(killer, killed, mod);
            }
        }
    });

    return games;
};

module.exports = { parseLog, Game };
