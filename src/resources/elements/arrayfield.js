import {containerless} from 'aurelia-framework';
import {Parentfield} from './abstract/parentfield';
import {Field} from './abstract/field';

/**
 * Arrayfield is a field that has a variable number of the same kind of child.
 */
@containerless
export class Arrayfield extends Parentfield {
  /**
   * The base object that is cloned whenever a new child is added.
   * @type {Field}
   */
  item;
  /**
   * Whether or not the UI element should be collapsed (i.e. only show the title)
   * @type {Boolean}
   */
  collapsed = false;
  /**
   * The output format ({@linkplain array} or {@linkplain map})
   * @type {String}
   */
  format = 'array';
  /**
   * The field that is used as the key if {@link #format} is {@linkplain map}
   * @type {String}
   */
  keyField = '_key';
  _children = [];

  /** @inheritdoc */
  init(id = '', {label = '', format = 'array', keyField = '_key', item, columns = 8, collapsed = false, parent, index} = {}) {
    this.item = item;
    this.format = format;
    this.keyField = keyField;
    this.collapsed = collapsed;
    return super.init(id, {label, columns, parent, index});
  }

  /**
   * @inheritdoc
   * @return {Object[]|Object} The values of the children of this array in the
   *                           format specified by {@link #format}.
   */
  getValue() {
    let value = undefined;
    if (this.format === 'map') {
      value = {};
      for (const item of this._children) {
        const data = item.getValue();
        const key = data[this.keyField];
        delete data[this.keyField];
        value[key] = data;
      }
    } else if (this.format === 'array') {
      value = [];
      for (const [index, item] of Object.entries(this._children)) {
        value[index] = item.getValue();
      }
    }
    return value;
  }

  /**
   * Set the value of this field.
   *
   * @param {Object|Object[]} value The new value in the format specified by
   *                                {@link #format}.
   */
  setValue(value) {
    this._children = [];
    for (const [key, item] of Object.entries(value)) {
      const index = this.addChild();
      if (this.format === 'map') {
        item[this.keyField] = key;
      }
      this._children[index].setValue(item);
    }
  }

  /**
   * Add a new blank child to this array.
   */
  addChild() {
    if (!(this.item instanceof Field)) {
      return;
    }

    const field = this.item.clone();
    field.index = this._children.length;
    field.id = `${this.item.id}-${field.index}`;
    field.label = `${field.label} #${(field.index + 1)}`;
    this._children.push(field);
    return field.index;
  }

  /**
   * Delete the child with the given index from this field.
   *
   * @param  {Number} index The index of the child.
   */
  deleteChild(index) {
    if (this._children.length === 0) {
      return;
    }

    this._children.splice(index, 1);
    for (let i = index; i < this._children.length; i++) {
      const item = this._children[i];
      item.index = i;
      item.label = `${this.item.label} #${(i + 1)}`;
    }
  }

  /** @inheritdoc */
  clone() {
    const clone = new Arrayfield();
    clone.init(this.id, this);
    if (this.item instanceof Field) {
      clone.item = this.item.clone();
    }
    return clone;
  }
}
