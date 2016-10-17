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

/*Template.hello.events({
  'click button'(event, instance) {
    // increment the counter when button is clicked
    instance.counter.set(instance.counter.get() + 1);
  },
});*/
