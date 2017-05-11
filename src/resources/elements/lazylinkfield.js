import {containerless} from 'aurelia-framework';
import {Field} from './abstract/field';

/**
 * LazyLinkfield is a field that lazily proxies the a whole field (value & UI)
 * to another place.
 */
@containerless
export class LazyLinkfield extends Field {
  target = '#';
  overrides = {};
  _child = undefined;

  /** @inheritdoc */
  init(id = '', args = {}) {
    this.target = args.target || '#';
    this.overrides = args.overrides || {};
    return super.init(id, args);
  }

  createChild() {
    this._child = this.resolveRef(this.target).clone();
    this._child.parent = this;
    for (const [field, value] of Object.entries(this.overrides)) {
      const lastSlash = field.lastIndexOf('/');
      const path = field.substr(0, lastSlash);
      const fieldName = field.substr(lastSlash + 1, field.length);
      this._child.resolveRef(path)[fieldName] = value;
    }
  }

  deleteChild() {
    this._child = undefined;
  }

  shouldDisplay() {
    const display = super.shouldDisplay();
    if (display) {
      if (this._child === undefined) {
        this.createChild();
      }
    } else if (this._child !== undefined) {
      this.deleteChild();
    }
    return display;
  }

  get child() {
    return this.display ? this._child : undefined;
  }

  /**
   * Set the value of the target field.
   *
   * @override
   * @param {Object} value The new value to set to the target field.
   */
  setValue(value) {
    if (!this._child) {
      return;
    }
    this._child.setValue(value);
  }


  /**
   * Get the value of the target field.
   *
   * @override
   * @return {Object} The value of the target field, or undefined if
   *                  {@link #resolveTarget} returns {@linkplain undefined}.
   */
  getValue() {
    return this._child ? this._child.getValue() : undefined;
  }
}
