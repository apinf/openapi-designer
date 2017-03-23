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
   * The displayed label for the field. This might be a header (for objects) or
   * just a label (for inputs)
   * @type {String}
   */
  label = '';
  /**
   * The number of columns this element should use.
   * @type {Number}
   */
  columns = 8;
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
   * A map containing listeners that listen to the value of this field or the
   * possible children of this field.
   * Listeners of this field are under the key {@linkplain #}. Other fields are
   * referenced using the JSON reference format ({@linkplain #/...}).
   * @type {Object}
   */
  fieldListeners = {};

  /**
   * Initialize this field with the base data.
   * @param  {String} [id='']     The index of this field.
   * @param  {String} [label='']  The label of this field.
   * @param  {Number} [columns=8] The number of columns this field should use.
   * @param  {Field} parent      The parent of this field.
   * @param  {Number} index       The numerical index of this field within the
   *                              parent.
   * @return {Field}          This field.
   */
  init(id = '', {label = '', columns = 8, parent, index} = {}) {
    this.id = id;
    this.label = label || this.id.substr(0, 1).toUpperCase() + this.id.substr(1);
    this.columns = columns;
    this.index = index;
    this.parent = parent;

    return this;
  }

  /**
   * Called by children when their value changes.
   *
   * This calls the parents {@link #childValueChanged} method and the
   * {@link #runFieldListeners} of this field.
   *
   * @param  {string[]} fieldPath The path to the field relative to this field.
   * @param  {Object} newVal    The new value of the field.
   * @param  {Object} oldVal    The old value of the field.
   */
  childValueChanged(fieldPath, newVal, oldVal) {
    if (this.parent) {
      this.parent.childValueChanged([this.index || this.id].concat(fieldPath), newVal, oldVal);
    }
    this.runFieldListeners(`#/${fieldPath.join('/')}`, newVal, oldVal);
  }

  /**
   * Called by Aurelia when {@link #value} changes.
   *
   * This calls the parents {@link #childValueChanged} method and the
   * {@link #runFieldListeners} of this field.
   *
   * @param  {Object} newVal The new value.
   * @param  {Object} oldVal The old value.
   */
  valueChanged(newVal, oldVal) {
    if (this.parent) {
      this.parent.childValueChanged([this.index || this.id], newVal, oldVal);
    }
    this.runFieldListeners('#', newVal, oldVal);
  }

  /**
   * Run the field listeners registered to this field.
   *
   * @param  {[type]} path   [description]
   * @param  {[type]} newVal [description]
   * @param  {[type]} oldVal [description]
   */
  runFieldListeners(path, newVal, oldVal) {
    if (this.fieldListeners.hasOwnProperty(path)) {
      for (const func of this.fieldListeners[path]) {
        func(newVal, oldVal);
      }
    }
  }

  /**
   * Register a field listener.
   * @param {String} path The path (in JSON reference format) to the field to
   *                      listen to.
   * @param {func}   func The callback function.
   */
  addFieldListener(path, func) {
    const listeners = this.fieldListeners[path] || [];
    listeners.push(func);
    this.fieldListeners[path] = listeners;
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
