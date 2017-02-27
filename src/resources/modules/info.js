import {bindable} from 'aurelia-framework';
import {Textfield} from '../elements/textfield';

export class Info {
  @bindable children = [
    new Textfield('title'),
    new Textfield('version'),
    new Textfield('description')
  ];
  @bindable mui = 'asd';

  attached() {
    console.log(this);
  }
}
