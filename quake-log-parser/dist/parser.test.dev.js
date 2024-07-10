"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var _require = require('./parser'),
    parseLog = _require.parseLog,
    Game = _require.Game;

describe('Game', function () {
  var game;
  beforeEach(function () {
    game = new Game();
  });
  test('should initialize correctly', function () {
    expect(game.total_kills).toBe(0);
    expect(game.players.size).toBe(0);
    expect(Object.keys(game.ranking).length).toBe(0);
    expect(Object.keys(game.kills_by_mean).length).toBe(0);
  });
  test('should add players and kills correctly', function () {
    game.addKill('player1', 'player2', 'MOD_ROCKET');
    expect(game.total_kills).toBe(1);
    expect(game.players.has('player1')).toBe(true);
    expect(game.players.has('player2')).toBe(true);
    expect(game.ranking['player1']).toBe(1);
    expect(game.ranking['player2']).toBe(-1);
    expect(game.kills_by_mean['MOD_ROCKET']).toBe(1);
  });
  test('should handle suicides correctly', function () {
    game.addKill('player1', 'player1', 'MOD_ROCKET');
    expect(game.total_kills).toBe(1);
    expect(game.ranking['player1']).toBe(0);
    expect(game.kills_by_mean['MOD_ROCKET']).toBe(1);
  });
  test('should handle <world> kills correctly', function () {
    game.addKill('<world>', 'player1', 'MOD_FALLING');
    expect(game.total_kills).toBe(1);
    expect(game.ranking['player1']).toBe(-1);
    expect(game.kills_by_mean['MOD_FALLING']).toBe(1);
  });
  test('should sort points correctly', function () {
    game.addKill('player1', 'player2', 'MOD_ROCKET');
    game.addKill('player3', 'player2', 'MOD_ROCKET');
    var sortedPoints = game.getSortedPoints();
    expect(Object.keys(sortedPoints)).toEqual(['player1', 'player3', 'player2']);
  });
});
describe('parseLog', function () {
  var sampleLog = "\n20:37 InitGame: \n20:37 Kill: 1022 2 22: <world> killed player2 by MOD_TRIGGER_HURT\n20:38 Kill: 3 2 10: player3 killed player2 by MOD_RAILGUN\n20:39 Kill: 2 2 7: player2 killed player2 by MOD_ROCKET_SPLASH\n";
  test('should parse log data correctly', function () {
    var games = parseLogFromData(sampleLog);
    var gameKeys = Object.keys(games);
    expect(gameKeys.length).toBe(1);
    var game = games[gameKeys[0]];
    expect(game.total_kills).toBe(3);
    expect(game.getPlayers()).toEqual(expect.arrayContaining(['player2', 'player3']));
    expect(game.ranking['player3']).toBe(1);
    expect(game.ranking['player2']).toBe(-3);
    expect(game.kills_by_mean['MOD_TRIGGER_HURT']).toBe(1);
    expect(game.kills_by_mean['MOD_RAILGUN']).toBe(1);
    expect(game.kills_by_mean['MOD_ROCKET_SPLASH']).toBe(1);
  });
}); // New function to parse log data directly from a string

var parseLogFromData = function parseLogFromData(data) {
  var lines = data.split('\n');
  var games = {};
  var currentGame = null;
  var gameID = 0;
  var killRegex = /(\d+):(\d+) Kill: (\d+) (\d+) (\d+): (.*) killed (.*) by (.*)/;
  lines.forEach(function (line) {
    if (line.includes('InitGame')) {
      gameID++;
      currentGame = new Game();
      games["game_".concat(gameID)] = currentGame;
    } else if (line.includes('Kill:')) {
      var matches = killRegex.exec(line);

      if (matches) {
        var _matches = _slicedToArray(matches, 9),
            killer = _matches[6],
            killed = _matches[7],
            mod = _matches[8];

        currentGame.addKill(killer, killed, mod);
      }
    }
  });
  return games;
};