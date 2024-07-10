package parser

import (
	"path/filepath"
	"testing"
)

func TestParseLogs(t *testing.T) {
	logFilePath := filepath.Join("..", "logs/qgames_test.log")

	games, _ := ParseLog(logFilePath)

	if len(games) == 0 {
		t.Errorf("Expected games to be parsed, got 0")
	}

	for _, game := range games {
		if game.TotalKills == 0 {
			t.Errorf("Expected game to have total kills, got 0")
		}
		if len(game.Players) == 0 {
			t.Errorf("Expected game to have players, got 0")
		}
		if len(game.KillsByMean) == 0 {
			t.Errorf("Expected game to have kills by means, got 0")
		}
	}
}
