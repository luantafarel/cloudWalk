package reports

import (
	"encoding/json"
	"fmt"

	"quake-log-parser/parser"
)

func PrintGameReportsJSON(games map[string]*parser.Game) []byte {
	output, err := json.MarshalIndent(games, "", "  ") // Marshal games map to JSON with indentation
	if err != nil {
		fmt.Printf("Error generating JSON: %v\n", err)
		return nil
	}
	fmt.Println(string(output)) // Print JSON output.
	return output
}
