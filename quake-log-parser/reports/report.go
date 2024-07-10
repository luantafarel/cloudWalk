package reports

import (
	"encoding/json"
	"fmt"
	"sort"

	"quake-log-parser/parser"
)

func PrintGameReportsJSON(games map[string]*parser.Game) {
	for _, game := range games {
		game.Players = filterOutWorld(game.Players)
		game.Points = sortRankingByPoints(game.Points)
	}
	output, err := json.MarshalIndent(games, "", "  ")
	if err != nil {
		fmt.Printf("Error generating JSON: %v\n", err)
		return
	}
	fmt.Println(string(output))
}

func filterOutWorld(players []string) []string {
	var result []string
	for _, player := range players {
		if player != "<world>" {
			result = append(result, player)
		}
	}
	return result
}

func sortRankingByPoints(points map[string]int) map[string]int {
	type kv struct {
		Key   string
		Value int
	}

	var sortedPoints []kv
	for k, v := range points {
		sortedPoints = append(sortedPoints, kv{k, v})
	}

	sort.Slice(sortedPoints, func(i, j int) bool {
		return sortedPoints[i].Value > sortedPoints[j].Value
	})

	sortedMap := make(map[string]int)
	for _, kv := range sortedPoints {
		sortedMap[kv.Key] = kv.Value
	}

	return sortedMap
}
