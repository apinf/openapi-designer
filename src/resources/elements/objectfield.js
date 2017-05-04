import {containerless} from 'aurelia-framework';
import {Parentfield} from './abstract/parentfield';

/**
 * Objectfield is a {@link Parentfield} that has children. The child fields are
 * usually predefined.
 */
@containerless
export class Objectfield extends Parentfield {
  /**
   * Whether or not the UI element should be collapsed (i.e. only show the title)
   * @type {Boolean}
   */
  collapsed = false;
  /** @inheritdoc */
  _children = {};
  /**
   * The key field to use.
   * @type {Field}
   */
  keyFieldName = undefined;

  /** @inheritdoc */
  init(id = '', args = {}) {
    args = Object.assign({children: {}, collapsed: false, keyField: undefined}, args);
    this._children = args.children;
    this.collapsed = args.collapsed;
    this.keyFieldName = args.keyField;
    return super.init(id, args);
  }

  get keyField() {
    return this._children[this.keyFieldName];
  }

  /**
   * @inheritdoc
   * @return {Object} The values of the children in an object. The keys are the
   *                  IDs of the children.
   */
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

  /**
   * @inheritdoc
   */
  get iterableChildren() {
    return Object.values(this.children);
  }

  /**
   * @inheritdoc
   */
  get children() {
    if (!this.keyField) {
      return this._children;
    }
    const children = Object.assign({}, this._children);
    delete children[this.keyFieldName];
    return children;
  }

  /**
   * Set the values of the children of this field.
   *
   * @param {Object} value The values for the children with the ID of the child
   *                       as the object key.
   */
  setValue(value) {
    for (const [key, field] of Object.entries(value)) {
      if (this._children.hasOwnProperty(key)) {
        this._children[key].setValue(field);
      }
    }
  }

  /**
   * Add the given child to this object.
   * @param {Field} child The child to add.
   */
  addChild(child) {
    this._children[child.id] = child;
  }

  /** @inheritdoc */
  clone() {
    const clone = new Objectfield();
    const clonedChildren = {};
    for (const [key, field] of Object.entries(this._children)) {
      clonedChildren[key] = field.clone();
    }
    clone.init(this.id, {
      label: this._label,
      columns: this.columns,
      collapsed: this.collapsed,
      parent: this.parent,
      index: this.index,
      keyField: this.keyFieldName,
      children: clonedChildren
    });
    return clone;
  }

  /**
   * @private
   */
  getViewStrategy() {
    return `resources/elements/objectfield${this.keyField === undefined ? '' : '-keyed'}.html`;
  }
}
