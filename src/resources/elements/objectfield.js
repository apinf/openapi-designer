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

  /** @inheritdoc */
  init(id = '', args = {}) {
    args = Object.assign({children: {}, collapsed: false}, args);
    this._children = args.children;
    this.collapsed = args.collapsed;
    return super.init(id, args);
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
