export class Basefield {
  id = '';
  label = '';
  columns = 8;
  index = undefined;
  parent = undefined;

  init(id = '', {label = '', columns = 8, parent, index} = {}) {
    this.id = id;
    this.label = label;
    this.columns = columns;
    this.index = index;
    this.parent = parent;
    this.fixLabel();
    return this;
  }

  fixLabel() {
    if (this.label.length === 0) {
      this.label = this.id.substr(0, 1).toUpperCase() + this.id.substr(1);
    }
  }

  bind() {
    this.fixLabel();
  }

  delete() {
    if (this.parent && typeof this.index === 'number') {
      this.parent.deleteChild(this.index);
    }
  }

  getValue() {
    return undefined;
  }

  setValue(value) { }

  clone() {
    const ExtendedClass = Object.getPrototypeOf(this).constructor;
    const clone = new ExtendedClass();
    clone.init(this.id, this);
    return clone;
  }
}
