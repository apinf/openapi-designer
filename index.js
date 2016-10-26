$("#form").alpaca({
	"schema": {
		"title": "Open API designer",
		"type": "object",
		"properties": {
			"title": {
				"type": "string",
				"title": "Title"
			},
			"version": {
				"type": "string",
				"title": "Version",
			},
			"license": {
				"title": "License",
				"type": "object",
				"properties": {
					"name": {
						"type": "string",
						"title": "Name"
					},
					"url": {
						"type": "string",
						"title": "URL"
					},
				}
			},
			"host": {
				"type": "string",
				"title": "Host"
			},
			"basePath": {
				"type": "string",
				"title": "Base path"
			},
			"schemes": {
				"description": "Schemes",
				"type": "array",
				"items": {
					"title": "Scheme",
					"type": "string"
				},
				"minItems": 1
			}
		}
	}
})
