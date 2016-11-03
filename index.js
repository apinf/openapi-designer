$("#form").alpaca({
	schema: {
		"title": "Open API designer",
		"type": "object",
		"properties": {
			"info": {
				"type": "object",
				"title": "Info",
				"properties": {
					"title": {
						"type": "string",
						"title": "Title"
					},
					"version": {
						"type": "string",
						"title": "Version",
					},
					"termsOfService": {
						"type": "string",
						"title": "Terms of Service",
					},
					"contact": {
						"title": "Contact",
						"type": "object",
						"properties": {
							"name": {
								"type": "string",
								"title": "Name"
							},
							"url": {
								"type": "string",
								"format": "url",
								"title": "URL"
							},
							"email": {
								"type": "string",
								"format": "email",
								"title": "Email"
							}
						}
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
								"format": "url",
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
					}
				}
			},
			"schemes": {
				"title": "Schemes",
				"type": "array",
				"items": {
					"title": "Scheme",
					"type": "string",
					"enum": ["http", "https", "ws", "wss"]
				},
				"minItems": 1
			}
		}
	},
	options: {
		fields: {
			info: {
				fields: {
					host: {
						validator: function(callback) {
							let query = new SRL('\
								begin with capture (                                     \
								    capture (                                            \
								        any of (digit, letter, one of "-") once or more, \
								        literally "." once                               \
								    ) never or more,                                     \
								    any of (digit, letter, one of "-") once or more      \
								) once,                                                  \
								capture (                                                \
								    literally ":" once,                                  \
								    digit once or more                                   \
								) optional,                                              \
								must end, case insensitive                               \
							')
							if (query.isMatching(this.getValue())) {
								callback({status: true})
							} else {
								callback({status: false, message: "Invalid hostname e.g. host.example.com:80"})
							}
						}
					},
					basePath: {
						validator: function(callback) {
							if (!this.getValue().startsWith("/")) {
								this.setValue("/" + this.getValue())
							}
						}
					}
				}
			}
		}
	},
	postRender: control => {
		control.on("change", function() {
			$("#preview").JSONView(this.getValue())
		})
	}
})
