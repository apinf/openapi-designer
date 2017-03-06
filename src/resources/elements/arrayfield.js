import {bindable, containerless} from 'aurelia-framework';
import {Basefield} from '../basefield';
import {fieldTypes} from '../fieldtypes';

@containerless
export class Arrayfield extends Basefield {
  @bindable item
  @bindable collapsed = false;
  items = []

  init(id = '', {label = '', item = {type = 'text', id = 'arrElem'} = {}, columns = 8, collapsed = false, parent, index} = {}) {
    this.item = item;
    this.collapsed = collapsed;
    return super.init(id, {label, columns, parent, index});
  }

  getValue() {
    const value = [];
    for (const [index, item] of Object.entries(this.items)) {
      value[index] = item.getValue();
    }
    return value;
  }

  setValue(value) {
    this.items = [];
    for (const item of value) {
      const index = this.addChild();
      this.items[index].setValue(item);
    }
  }

  addChild() {
    const index = this.items.length;
    const field = new fieldTypes[this.item.type]();
    const id = `${this.item.id}-${index}`;
    const args = Object.assign({
      index,
      parent: this,
      label: `${this.item.labelFormat} #${(index + 1)}`
    }, this.item);
    field.init(id, args);
    this.items.push(field);
    return index;
  }

  deleteChild(index) {
    this.items.splice(index, 1);
    for (let i = index; i < this.items.length; i++) {
      const item = this.items[i];
      item.index = i;
      item.label = `${this.item.labelFormat} #${(i + 1)}`;
    }
  }
}
