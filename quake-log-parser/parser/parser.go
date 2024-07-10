package parser

import (
	"bufio"
	"fmt"
	"os"
	"regexp"
	"strconv"
	"strings"
)

func ParseLog(filePath string) (map[string]*Game, error) {
	file, err := os.Open(filePath) // Open log file
	if err != nil {                // Check if there was an error opening the file
		return nil, err
	}
	defer file.Close() // Defer closing the file

	scanner := bufio.NewScanner(file) // Create a scanner for the file
	games := make(map[string]*Game)   // Create a map of games
	gameID := 0                       // Initialize game ID
	currentGame := NewGame()          // Initialize current game

	killRegex := regexp.MustCompile(`(\d+):(\d+) Kill: (\d+) (\d+) (\d+): (.*) killed (.*) by (.*)`) // Create regex for kill events

	for scanner.Scan() {
		line := scanner.Text() // Read line from file

		if strings.Contains(line, "InitGame") { // Check if line contains "InitGame", which indicates the start of a new game
			gameID++
			currentGame = NewGame()                           // Create a new game
			games["game_"+strconv.Itoa(gameID)] = currentGame // Add game to games map
			fmt.Printf("Initialized game %d\n", gameID)       // Print message indicating that a new game was initialized
		} else if strings.Contains(line, "Kill:") { // Check if line contains "Kill:", which indicates a kill event
			matches := killRegex.FindStringSubmatch(line) // Execute regex on line
			if len(matches) > 0 {                         // Check the regex returned properly
				mod := matches[8]    // Get mod from matches
				killer := matches[6] // Get killer from matches
				killed := matches[7] // Get killed from matches

				currentGame.TotalKills++                                                                           // Increment total kills for current game
				fmt.Printf("Game %d: Kill event - Killer: %s, Killed: %s, Mod: %s\n", gameID, killer, killed, mod) // Print kill event details

				currentGame.AddPlayer(killed) // since killed is never "<world>", we can add it to the game before checks

				if killer != "<world>" { // Check if killer is not "<world>"
					currentGame.AddPlayer(killer)    // executes AddPlayer method for killer
					currentGame.addPoints(killer, 1) // Add points to killer
					if killer == killed {            // Suicide check
						currentGame.addPoints(killer, -1)
					}
				} else {
					currentGame.addPoints(killed, -1) // if killer is "<world>" it counts as suicide
				}

				if _, exists := currentGame.KillsByMean[mod]; !exists { // check if mod is in the map of killsByMean, if it isn't creates it
					currentGame.KillsByMean[mod] = 0
				}
				currentGame.KillsByMean[mod]++
			}
		}
	}

	if err := scanner.Err(); err != nil {
		return nil, err
	}

	return games, nil
}

func (g *Game) addPoints(player string, points int) {
	g.Points[player] += points
}
