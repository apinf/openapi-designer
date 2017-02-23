import {bindable} from 'aurelia-framework';

export class Textfield {
  @bindable id = '';
  @bindable label = '';
  @bindable placeholder = 'Enter value...';
  @bindable value = '';
}
