package reports

import (
	"reflect"
	"testing"
)

func TestSortRankingByPoints(t *testing.T) {
	input := map[string]int{
		"Isgalamido":     1,
		"Dono da Bola":   1,
		"Oootsimo":       8,
		"Assasinu Credi": 7,
		"Chessus":        8,
		"Zeh":            12,
		"Mal":            2,
	}

	expected := map[string]int{
		"Zeh":            12,
		"Oootsimo":       8,
		"Chessus":        8,
		"Assasinu Credi": 7,
		"Mal":            2,
		"Isgalamido":     1,
		"Dono da Bola":   1,
	}

	sorted := sortRankingByPoints(input)
	if !reflect.DeepEqual(sorted, expected) {
		t.Errorf("Sorted ranking does not match expected.\nGot: %+v\nExpected: %+v", sorted, expected)
	}
}
