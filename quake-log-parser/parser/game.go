package parser

type Game struct {
	TotalKills  int            `json:"total_kills"`
	Players     []string       `json:"players"`
	Points      map[string]int `json:"ranking"`
	KillsByMean map[string]int `json:"kills_by_mean"`
}

func NewGame() *Game { // Struct constructor for Game contains a slice of players, a map of points, and a map of kills by mean
	return &Game{
		Players:     []string{},
		Points:      make(map[string]int),
		KillsByMean: make(map[string]int),
	}
}

func (g *Game) AddPlayer(player string) { // AddPlayer method for Game struct
	for _, p := range g.Players { // Check if player is already in the game
		if p == player { // If player is already in the game, return
			return
		}
	}
	g.Players = append(g.Players, player) // If player is not in the game, add player to the game
}
