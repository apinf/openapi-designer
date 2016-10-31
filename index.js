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
							// TODO choose a validator below (or find a library)

							/* Regex validator
								+ Short
								- Generic error message
								- No unicode support
								+ Similar to Alpaca validators (they don't support unicode either)

							if (/^([A-Za-z0-9]+\.)*([A-Za-z0-9]+){1}(:[0-9]+)?$/.test(callback)) {
								callback({status: false, message: "Invalid hostname"})
							} else {
								callback({status: true})
							}
							*/

							/* Javascript validator
								+ Proper error messages
								+ Unicode support
								- Long

							let host = this.getValue()
							if (host.indexOf(":") !== -1) {
								let parts = host.split(":")
								host = parts[0]
								// Strict string -> number conversion
								let port = (+parts[1])
								if (isNaN(port)) {
									callback({status: false, message: "Invalid port"})
								} else if (port <= 0) {
									callback({status: false, message: "Port too small"})
								} else if (port >= 65536) {
									callback({status: false, message: "Port too large"})
								}
							}

							for (char of host) {
								if (isNaN(char) && char !== "." &&
									char.toLowerCase() === char.toUpperCase()) {
									callback({status: false, message: "Invalid character in hostname"})
									return
								}
							}
							callback({status: true})
							*/
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
	}
})
