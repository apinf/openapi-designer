import {Basefield} from './basefield';

export class Parentfield extends Basefield {
  _children

  init(id = '', {label = '', columns = 8, parent, index} = {}) {
    return super.init(id, {label, columns, parent, index});
  }

  get iterableChildren() {
    return Object.values(this._children);
  }
}
