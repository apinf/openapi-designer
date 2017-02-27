import {bindable} from 'aurelia-framework';

export class Objectfield {
  @bindable label
  @bindable id
  @bindable children = {};

  constructor(id = '', label = '', children = []) {
    this.id = id;
    this.label = label;
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
    this.children[child.id] = child;
  }

  bind() {
    if (this.label.length === 0) {
      this.label = this.id.substr(0, 1).toUpperCase() + this.id.substr(1);
    }
  }
}
