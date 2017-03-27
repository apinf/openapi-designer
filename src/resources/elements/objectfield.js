import {containerless} from 'aurelia-framework';
import {Parentfield} from './abstract/parentfield';

@containerless
export class Objectfield extends Parentfield {
  collapsed = false;
  _children = {};

  init(id = '', args = {}) {
    args = Object.assign({children: {}, collapsed: false}, args);
    this._children = args.children;
    this.collapsed = args.collapsed;
    return super.init(id, args);
  }

  getValue() {
    const value = {};
    for (const [key, field] of Object.entries(this._children)) {
      if (!field || !field.showValueInParent) {
        continue;
      }
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
      _label: this._label,
      _labelFormat: this._labelFormat,
      columns: this.columns,
      collapsed: this.collapsed,
      parent: this.parent,
      index: this.index,
      children: clonedChildren
    });
    return clone;
  }
}
