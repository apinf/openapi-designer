import 'bootstrap';
import {Textfield} from './fields/textfield';
import {ObjectField} from './fields/objectfield';

export class App {
  constructor() {
    this.message = 'Hello World!';
    this.fields = [];

    /* BEGIN TEST FORM DATA */
    const obj = new ObjectField();
    obj.title = 'Mui :3';
    const tf = new Textfield();
    tf.title = 'Yay!';
    tf.placeholder = 'Enter text';
    obj.addField(tf);

    const obj2 = new ObjectField();
    obj2.title = 'Another field';
    const tf2 = new Textfield();
    tf2.title = 'Input 2';
    tf2.placeholder = 'Enter text';
    const tf3 = new Textfield();
    tf3.title = 'Input 3';
    tf3.placeholder = 'Enter text';
    obj2.addField(tf2);
    obj2.addField(tf3);


    this.addField(obj);
    this.addField(obj2);
    /* END TEST FORM DATA */
  }

  addField(field) {
    this.fields.push(field);
  }
}
