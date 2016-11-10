const validatorPatterns = {
	mimeType: new SRL('\
		begin with capture (                                                   \
		    any of (digit, letter) once,                                       \
		    any of (digit, letter, one of "!#$&-^_.+") between 0 and 126 times \
		)                                                                      \
		literally "/"                                                          \
		capture (                                                              \
		    any of (digit, letter) once,                                       \
		    any of (digit, letter, one of "!#$&-^_.+") between 0 and 126 times \
		)                                                                      \
		must end, case insensitive                                             \
	'),
	hostname: new SRL('\
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
}

const validators = {
	mimeType(callback) {
		if (validatorPatterns.mimeType.isMatching(this.getValue())) {
			callback({status: true})
		} else {
			callback({status: false, message: "Invalid MIME type e.g. application/vnd.github.v3.raw+json"})
		}
	},
	hostname(callback) {
		if (validatorPatterns.hostname.isMatching(this.getValue())) {
			callback({status: true})
		} else {
			callback({status: false, message: "Invalid hostname e.g. host.example.com:80"})
		}
	},
	basePath(callback) {
		if (!this.getValue().startsWith("/")) {
			this.setValue("/" + this.getValue())
		}
	}
}

function download() {
	let str = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.getValue(), null, "  "))
	let download = document.createElement("a")
	download.setAttribute("href", str)
	download.setAttribute("download", "swagger.json")
	download.innerHTML = "Download Open API specification file"
	download.hidden = true
	document.body.appendChild(download)
	download.click()
	download.remove()
}

let form = undefined

function jsonPreview() {
	$("#json-preview").removeClass("hidden")
	if (form !== undefined) {
		$("#json-preview").JSONView(form)
	}
}

function richPreview() {
	$("#rich-preview").removeClass("hidden")
	if (form !== undefined) {
		// TODO rich preview
	}
}

$("#form").alpaca({
	schemaSource: "./schema.json",
	options: {
		fields: {
			info: { fields: {
				host: { validator: validators.hostname },
				basePath: { validator: validators.basePath }
			}},
			consumes: {
				items: { validator: validators.mimeType },
				toolbarSticky: true
			},
			produces: {
				items: { validator: validators.mimeType },
				toolbarSticky: true
			},
			paths: {
				type: "map",
				toolbarSticky: true,
				items: { methods: {
					// This isn't working, `methods` isn't a map in the JSON output
					type: "map",
					toolbarSticky: true
				}}
			}
		},
		form: { buttons: {
			download: {
				click: download,
				type: "button",
				value: "Download as JSON",
				styles: "btn btn-primary"
			}
		}}
	},
	postRender: control => {
		control.on("change", function() {
			form = this.getValue()
			if (!$("#json-preview").hasClass("hidden")) {
				$("#json-preview").JSONView(this.getValue())
			} else if (!$("#rich-preview").hasClass("hidden")) {
				// TODO rich preview
			}
		})
	}
})
