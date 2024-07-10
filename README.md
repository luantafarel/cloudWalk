# File Descriptions Golang Project

## `main.go`
- **Purpose**: Entry point of the application.
- **Functions**:
  - `main()`: Initializes the necessary components and starts the process of parsing and generating reports.

## `parser/game.go`
- **Purpose**: Contains logic for parsing game-related data from logs.
- **Functions**:
  - `ParseGame(data []byte)`: Parses the game data from the provided byte slice.
  - `NewGame(id string) *Game`: Initializes a new game instance.
  - `UpdateGame(game *Game, event Event)`: Updates the game state based on the event.

## `parser/player.go`
- **Purpose**: Handles parsing of player-specific data.
- **Functions**:
  - `ParsePlayer(data []byte)`: Parses the player data from the provided byte slice.
  - `NewPlayer(id string) *Player`: Initializes a new player instance.
  - `UpdatePlayer(player *Player, action Action)`: Updates the player state based on the action.

## `parser/parser.go`
- **Purpose**: Orchestrates the parsing process.
- **Functions**:
  - `ParseLog(logFile string) ([]Game, []Player)`: Reads the log file and returns parsed game and player data.
  - `parseLine(line string) (Event, Action)`: Parses a single line from the log and extracts the event and action.

## `reports/report.go`
- **Purpose**: Generates reports based on the parsed data.
- **Functions**:
  - `GenerateReport(games []Game, players []Player) string`: Compiles and formats the parsed data into a human-readable report.
  - `FormatGameReport(game Game) string`: Formats a single game report.
  - `FormatPlayerReport(player Player) string`: Formats a single player report.

## `logs/qgames.log`
- **Purpose**: Sample log file containing raw data to be parsed.
- **Content**: Contains game events, player actions, and other relevant information.

## Run the project
To run the project, while in the root folder of quake-log-parser run 
```bash
    go mod init
    go run main.go
```
## Run Tests
To run the project, while in the root folder of quake-log-parser run 
```bash
    go mod init
    go test ./...
```

# File Descriptions

## `src/parser.js`
- **Purpose**: Contains logic for parsing game-related logs, managing game state, and computing player statistics.
- **Classes and Functions**:
  - **Class `Game`**: Manages the state of a game, including players, kills, and scores.
    - **Constructor `constructor()`**: Initializes a new game instance with total kills, players, points, and kills by mean.
    - **Method `addPlayer(player)`**: Adds a player to the game and initializes their points if they are new.
    - **Method `addKill(killer, killed, mod)`**: Records a kill event, updates points for the killer and the killed, and tracks the method of kill.
    - **Method `getPlayers()`**: Returns a list of players, excluding `<world>`.
    - **Method `getSortedPoints()`**: Returns the player points sorted in descending order.
  - **Function `parseLog(filePath)`**: Parses a log file, extracts game events, and returns a dictionary of game instances.
    - **Parameters**: `filePath` (string) - Path to the log file to be parsed.
    - **Returns**: Dictionary of game instances with game IDs as keys.

## Run the project
To run the project, while in the root folder of quake-log-parser run 
```bash
    npm ci
    npm start
```
## Outputs
- Both outputs of the executions were provided on :
    - goresponse.json: the output of go execution.
    - noderesponse.json: the output for the node executuion.