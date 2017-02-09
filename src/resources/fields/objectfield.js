import {Field} from './field';

export class ObjectField extends Field {
  fields = [];

  addField(field) {
    this.fields.push(field);
  }
}
