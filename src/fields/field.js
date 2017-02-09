export class Field {
  title = '';

  get type() {
    let className = this._type || this.constructor.name.toLowerCase();
    // className = className.substr(0, className.length - 'field'.length);
    return className || 'blank';
  }

  get model() {
    return {
      title: this.title
    };
  }

  get modelText() {
    return JSON.stringify(this.model);
  }
}
