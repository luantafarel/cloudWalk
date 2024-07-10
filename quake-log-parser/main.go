package main

import (
	"fmt"

	"quake-log-parser/parser"
	"quake-log-parser/reports"
)

func main() {
	logFilePath := "logs/qgames.log"
	games, err := parser.ParseLog(logFilePath)
	if err != nil {
		fmt.Printf("Error parsing log file: %v\n", err)
		return
	}

	reports.PrintGameReportsJSON(games)
}
