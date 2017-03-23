/**
 * Field is the base for actual field type elements.
 */
export class Field {
  /**
   * The ID of the field. Not displayed to the user directly.
   * @type {String}
   */
  id = '';
  /**
   * The internal storage for a static label.
   * @type {String}
   * @private
   */
  _label = '';
  /**
   * The internal storage for a non-static label.
   * @type {String}
   * @private
   */
  _labelFormat = '';
  /**
   * The number of columns this element should use.
   * @type {Number}
   */
  columns = 8;
  /**
   * The conditions on which to display this field.
   * @type {String}
   */
  conditions = {};
  /**
   * The index of this element within the parent. This should only be defined if
   * the parent stores children using numerical indexes. For object-like child
   * storage, the {@link #id} field should be used instead.
   * @type {Number}
   */
  index = undefined;
  /**
   * The parent of this field.
   * @type {Field}
   */
  parent = undefined;

  /**
   * Initialize this field with the base data.
   * @param  {String} [id='']     The index of this field.
   * @param  {String} [label='']  The label of this field.
   * @param  {Number} [columns=8] The number of columns this field should use.
   * @param  {Field}  parent      The parent of this field.
   * @param  {Number} index       The numerical index of this field within the
   *                              parent.
   * @return {Field}              This field.
   */
  init(id = '', {label = '', columns = 8, conditions = {}, parent, index} = {}) {
    this.id = id;
    this.labelFormat = label || this.id.substr(0, 1).toUpperCase() + this.id.substr(1);
    this.conditions = conditions;
    this.columns = columns;
    this.index = index;
    this.parent = parent;

    return this;
  }

  get display() {
    for (const [path, value] of Object.entries(this.conditions)) {
      const elem = this.resolvePath(path.split('/'));

      if (!elem) {
        return false;
      }

      const elemValue = elem.getValue();

      if (Array.isArray(value)) {
        if (!value.includes(elemValue)) {
          return false;
        }
      } else if (value !== elemValue) {
        return false;
      }
    }
    return true;
  }

  /**
   * The displayed label for the field. This might be a header (for objects) or
   * just a label (for inputs).
   * @return {String} The label to display.
   */
  get label() {
    if (!this._labelFormat) {
      return this._label;
    }
    let label = this._labelFormat;
    label.replace(/$index/g, this.index + 1);

    if (this._labelFormat.includes('${')) {
      const regex = /\${(.+)?}/;

      let result = regex.exec(label);
      while (result !== null) {
        const index = result.index;
        const match = result[0];
        const path = result[1];
        let replacement = '';

        const elem = this.resolvePath(path.split('/'));
        if (elem !== undefined) {
          replacement = elem.getValue();
        }

        label = label.substr(0, index) + replacement + label.substr(index + match.length);
        result = regex.exec(label);
      }
    }

    return label;
  }

  set labelFormat(newLabel) {
    if (newLabel.includes('$') || (newLabel.includes('${') && newLabel.includes('}'))) {
      this._labelFormat = newLabel;
    } else {
      this._labelFormat = '';
      this._label = newLabel;
    }
  }

  /**
   * Get the label format.
   */
  get labelFormat() {
    return this._labelFormat || this._label;
  }

  /**
   * Resolve a path (in JSON reference format) relative to this field.
   *
   * @param  {String} ref The JSON reference to resolve.
   * @return {Field}      The field at the path, or undefined if not found.
   */
  resolveRef(ref) {
    return this.resolvePath(ref.substr(2).split('/'));
  }

  /**
   * Resolve a path (array) relative to this field.
   *
   * @param  {String[]} path The path to resolve.
   * @return {Field}         The field at the path, or undefined if not found.
   */
  resolvePath(path) {
    if (path.length === 0) {
      return this;
    } else if (path[0] === '..') {
      return this.parent.resolvePath(path.splice(1));
    }
    return undefined;
  }

  /**
   * Find the top-level parent of this field.
   *
   * @return {Field} The top-level parent field.
   */
  superParent() {
    if (this.parent) {
      return this.parent.superParent();
    }
    return this;
  }

  /**
   * Delete this field from the parent.
   */
  delete() {
    if (this.parent) {
      this.parent.deleteChild(this.index || this.id);
    }
  }

  /**
   * Get the value of this field.
   *
   * @return {Object} The value of this field.
   */
  getValue() {
    return undefined;
  }

  /**
   * Set the value of this field.
   *
   * @param {Object} value The new value to set to this field.
   */
  setValue(value) { }

  /**
   * Clone this field.
   *
   * @return {Field} A deep clone of this field.
   */
  clone() {
    const ExtendedClass = Object.getPrototypeOf(this).constructor;
    const clone = new ExtendedClass();
    clone.init(this.id, this);
    return clone;
  }
}
