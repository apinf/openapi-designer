import {bindable, containerless} from 'aurelia-framework';
import {Basefield} from '../basefield';

@containerless
export class Objectfield extends Basefield {
  @bindable children
  _children = {}

  constructor(id = '', {label = '', children = [], columns = 8} = {}) {
    super(id, {label, columns});
    for (const child of children) {
      this.addChild(child);
    }
    window.object = this;
  }

  childrenChanged(arr) {
    if (Array.isArray(arr)) {
      this._children = {};
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
