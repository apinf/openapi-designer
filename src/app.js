import 'aurelia-mdl';
import {componentHandler} from 'encapsulated-mdl';
import {Objectfield} from './resources/elements/objectfield';
import {Textfield} from './resources/elements/textfield';
import {Textareafield} from './resources/elements/textareafield';

export class App {
  info = [
    new Objectfield('info', {children: [
      new Textfield('title', {columns: 5}),
      new Textfield('version', {columns: 3}),
      new Textareafield('description'),
      new Textfield('termsofservice', {label: 'Terms of Service'})
    ]}),
    new Objectfield('contact', {children: [
      new Textfield('name'),
      new Textfield('email'),
      new Textfield('url')
    ]})
  ];

  attached() {
    componentHandler.upgradeElement(document.getElementById('container'));
  }
}
