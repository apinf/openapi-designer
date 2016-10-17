import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';

Template.sidebar.onCreated(function() {
  this.apiname = new ReactiveVar("An API");
});

Template.sidebar.helpers({
  apiname() {
    return Template.instance().apiname.get();
  },
});

Template.container.onCreated(function() {

})

Template.container.helpers({
    apiEditor() {
        return "apied-info"
    }
})

Template["apied-info"].events = {
    "submit form": function(event, template) {
        event.preventDefault()
        $("#temporaryOutput").html(JSON.stringify($("#api-basic-data").serializeObject(), null, "    "))
    }
}

$.assignValue = function(obj, keyPath, value) {
    lastKeyIndex = keyPath.length-1;
    for (var i = 0; i < lastKeyIndex; ++ i) {
        key = keyPath[i];
        if (!(key in obj)) {
            obj[key] = {}
        }
        obj = obj[key];
    }
    obj[keyPath[lastKeyIndex]] = value;
}

$.fn.serializeObject = function() {
    let obj = {}
    let arr = this.serializeArray()
    $.each(arr, function() {
        $.assignValue(obj, this.name.split("."), this.value)
    })
    return obj
}
