import {bindable, containerless} from 'aurelia-framework';
import {Parentfield} from './abstract/parentfield';

@containerless
export class Objectfield extends Parentfield {
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

  getValue() {
    const value = {};
    for (const [key, field] of Object.entries(this._children)) {
      value[key] = field.getValue();
    }
    return value;
  }

  setValue(value) {
    for (const [key, field] of Object.entries(value)) {
      if (this._children.hasOwnProperty(key)) {
        this._children[key].setValue(field);
      }
    }
  }

  bind() {
    super.bind();
    this.childrenChanged(this.children);
  }

  addChild(child) {
    this._children[child.id] = child;
  }

  clone() {
    const clone = new Objectfield();
    const clonedChildren = {};
    for (const [key, field] of Object.entries(this._children)) {
      clonedChildren[key] = field.clone();
    }
    clone.init(this.id, {
      label: this.label,
      columns: this.columns,
      collapsed: this.collapsed,
      parent: this.parent,
      index: this.index,
      children: clonedChildren
    });
    return clone;
  }
}
