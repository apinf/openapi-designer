import 'aurelia-mdl';
import {componentHandler} from 'encapsulated-mdl';
import {Textfield} from './resources/elements/textfield';

export class App {
  info = [
    new Textfield('title'),
    new Textfield('version'),
    new Textfield('description')
  ];

  attached() {
    componentHandler.upgradeElement(document.getElementById('container'));
  }
}
