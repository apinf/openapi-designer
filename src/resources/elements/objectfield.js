import {bindable, containerless} from 'aurelia-framework';
import {Basefield} from '../basefield';

@containerless
export class Objectfield extends Basefield {
  @bindable id = '';
  @bindable label = '';
  @bindable columns = 8;
  @bindable children = [];
  @bindable collapsed = false;
  _children = {}

  init(id = '', {label = '', children = {}, columns = 8, collapsed = false, parent, index} = {}) {
    this._children = children;
    this.collapsed = collapsed;
    return super.init(id, {label, columns, parent, index});
  }

  childrenChanged(arr) {
    if (Array.isArray(arr)) {
      for (const child of arr) {
        this.addChild(child);
      }
    }
  }

  get childrenMap() {
    return this._children;
  }

  get childrenArray() {
    return Object.values(this._children);
  }

  getValue() {
    const value = {};
    for (const [key, field] of Object.entries(this._children)) {
      value[key] = field.getValue();
    }
    return value;
  }

  bind() {
    super.bind();
    this.childrenChanged(this.children);
  }

  addChild(child) {
    this._children[child.id] = child;
  }
}
