import {bindable} from 'aurelia-framework';

export class Objectfield {
  @bindable label
  @bindable headerSize
  @bindable children = {};

  constructor(label = '', headerSize = 3, children = []) {
    this.label = label;
    this.headerSize = headerSize;
    for (const child of children) {
      this.addChild(child);
    }
  }

  childrenChanged(arr) {
    if (Array.isArray(arr)) {
      this.children = {};
      for (const child of arr) {
        this.addChild(child);
      }
    }
  }

  get childrenArray() {
    return Object.values(this.children);
  }

  getValue() {
    const value = {};
    for (const [key, field] of Object.entries(this.children)) {
      value[key] = field.getValue();
    }
    return value;
  }

  addChild(child) {
    child.__observers__.parentNode = this;
    this.children[child.id] = child;
  }
}
