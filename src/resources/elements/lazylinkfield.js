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
      let target;
      let fieldPath;
      if (field.includes(';')) {
        [elementPath, fieldPath] = field.split(';');
        fieldPath = fieldPath.split('/');
        target = this._child.resolveRef(elementPath);
      } else {
        fieldPath = field.split('/');
        target = this._child;
      }
      const lastFieldPathEntry = fieldPath.splice(-1)[0];
      target = this.resolveRawPath(target, fieldPath);
      if (value === null) {
        delete target[lastFieldPathEntry];
      } else {
        target[lastFieldPathEntry] = value;
      }
    }
  }

  resolveRawPath(object, path) {
    if (path.length === 0) {
      return object;
    } else if (path[0] === '#') {
      return this.resolveRawPath(object, path.splice(1));
    }
    return this.resolveRawPath(object[path[0]], path.splice(1));
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
