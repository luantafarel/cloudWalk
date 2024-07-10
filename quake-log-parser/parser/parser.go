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
	file, err := os.Open(filePath)
	if err != nil {
		return nil, err
	}
	defer file.Close()

	scanner := bufio.NewScanner(file)
	games := make(map[string]*Game)
	gameID := 0
	currentGame := NewGame()

	killRegex := regexp.MustCompile(`(\d+):(\d+) Kill: (\d+) (\d+) (\d+): (.*) killed (.*) by (.*)`)

	for scanner.Scan() {
		line := scanner.Text()

		if strings.Contains(line, "InitGame") {
			gameID++
			currentGame = NewGame()
			games["game_"+strconv.Itoa(gameID)] = currentGame
			fmt.Printf("Initialized game %d\n", gameID)
		} else if strings.Contains(line, "Kill:") {
			matches := killRegex.FindStringSubmatch(line)
			if len(matches) > 0 {
				mod := matches[8]
				killer := matches[6]
				killed := matches[7]

				currentGame.TotalKills++
				fmt.Printf("Game %d: Kill event - Killer: %s, Killed: %s, Mod: %s\n", gameID, killer, killed, mod)

				if killer != "<world>" {
					currentGame.AddPlayer(killer)
				}
				currentGame.AddPlayer(killed)

				if killer != "<world>" {
					currentGame.addPoints(killer, 1)
					if killer == killed { // Suicide check
						currentGame.addPoints(killer, -1)
					}
				} else {
					currentGame.addPoints(killed, -1)
				}

				if _, exists := currentGame.KillsByMean[mod]; !exists {
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
