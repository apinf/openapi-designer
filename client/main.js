import { Template } from 'meteor/templating'
import { ReactiveVar } from 'meteor/reactive-var'

import './main.html'

Template.sidebar.onCreated(function() {
	this.apiname = new ReactiveVar("An API")
})

Template.sidebar.helpers({
	apiname() {
		return Template.instance().apiname.get()
	},
})

Template.container.onCreated(function() {

})

Template.container.helpers({
	apiEditor() {
		return "apied-info"
	}
})

var api = {}

Template.io.events = {
	"change form": function(event, template) {
		event.preventDefault()
		api = $("#api-basic-data").serializeObject()
		Template.swaggerViewer.update()
	},

	"click #api-export": function(event, template) {
		event.preventDefault()
		let str = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(api, null, "  "))
		let download = document.createElement("a")
		download.setAttribute("href", str)
		download.setAttribute("download", "swagger.json")
		download.innerHTML = "Download Open API definition file"
		download.hidden = true
		document.body.appendChild(download)
		download.click()
		download.remove()
	},

	"change #api-import": function(event, template) {
		event.preventDefault()
		let file = event.target.files[0]
		let reader = new FileReader()
		reader.readAsText(file, "UTF-8"),
		reader.onload = evt => {
			api = JSON.parse(evt.target.result)
			Template.io.importFromObject()
		}
	}
}

Template.io.importFromObject = function() {
	for (key in api) {
		// TODO import data
	}
}

Template.swaggerViewer.update = function() {
	$("#swagger-viewer").JSONView(api)
}

$.assignValue = function(obj, keyPath, value) {
	lastKeyIndex = keyPath.length-1
	for (var i = 0; i < lastKeyIndex; ++ i) {
		key = keyPath[i]
		if (!(key in obj)) {
			obj[key] = {}
		}
		obj = obj[key]
	}
	obj[keyPath[lastKeyIndex]] = value
}

$.fn.serializeObject = function() {
	let obj = {}
	let arr = this.serializeArray()
	$.each(arr, function() {
		$.assignValue(obj, this.name.split("."), this.value)
	})
	return obj
}
