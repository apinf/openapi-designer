const hostFieldValidator = new SRL('\
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

$("#form").alpaca({
	schemaSource: "/schema.json",
	options: { fields: { info: { fields: {
		host: {
			validator: function(callback) {
				if (hostFieldValidator.isMatching(this.getValue())) {
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
	}}}},
	postRender: control => {
		control.on("change", function() {
			$("#preview").JSONView(this.getValue())
		})
	}
})
