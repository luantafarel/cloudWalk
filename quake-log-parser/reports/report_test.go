package reports

import (
	"path/filepath"
	"testing"

	"quake-log-parser/parser"
)

func TestPrintGameReportsJSON(t *testing.T) {
	logFilePath := filepath.Join("..", "logs/qgames_test.log")

	games, _ := parser.ParseLog(logFilePath)

	savedGames := PrintGameReportsJSON(games)

	if len(savedGames) == 0 {
		t.Errorf("Expected saved games in JSON, got 0")
	}

}
