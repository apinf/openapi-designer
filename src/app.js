import 'aurelia-mdl';
import {componentHandler} from 'encapsulated-mdl';

export class App {
  attached() {
    componentHandler.upgradeElement(document.getElementById('container'));
  }
}
