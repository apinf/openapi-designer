export class Basefield {
  id;
  label;
  columns;

  constructor(id = '', {label = '', columns = 8} = {}) {
    this.id = id;
    this.label = label;
    this.columns = columns;
  }

  bind() {
    if (this.label.length === 0) {
      this.label = this.id.substr(0, 1).toUpperCase() + this.id.substr(1);
    }
  }

  getValue() {
    return undefined;
  }
}
