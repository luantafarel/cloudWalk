package parser

type Game struct {
	TotalKills  int            `json:"total_kills"`
	Players     []string       `json:"players"`
	Points      map[string]int `json:"ranking"`
	KillsByMean map[string]int `json:"kills_by_mean"`
}

func NewGame() *Game {
	return &Game{
		Players:     []string{},
		Points:      make(map[string]int),
		KillsByMean: make(map[string]int),
	}
}

func (g *Game) AddPlayer(player string) {
	for _, p := range g.Players {
		if p == player {
			return
		}
	}
	g.Players = append(g.Players, player)
}
