$("#form").alpaca({
	"schema": {
		"title": "What do you think of Alpaca?",
		"type": "object",
		"properties": {
			"name": {
				"type": "string",
				"title": "Name"
			},
			"ranking": {
				"type": "string",
				"title": "Ranking",
				"enum": ['excellent', 'not too shabby', 'alpaca built my hotrod']
			}
		}
	}
})
