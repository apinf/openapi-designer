import {containerless, bindable} from 'aurelia-framework';
import {Field} from './abstract/field';
import {parseJSON} from '../jsonparser';

/**
 * Typefield is a {@link Field} that shows different child forms depending on
 * the type the user chooses.
 *
 * This allows for theoretically infinite nesting because it uses lazy
 * evaluation and supports $refs in type options.
 */
@containerless
export class Typefield extends Field {
  /**
   * The type that is currently selected.
   * @type {String}
   */
  @bindable selectedType = '';
  /**
   * The key to set the value of the child field to in the output of this field.
   * @type {String}
   */
  valueKey = '';
  keyKey = '';
  key = '';
  keyPlaceholder = '';
  /**
   * Whether or not to show the chosen type in the value of this field.
   * @type {Boolean}
   */
  showType = true;
  /**
   * Whether or not to copy the value over to the new child when switching types.
   *
   * N.B. Absolutely nothing is done to ensure the data ends up in the right
   * place. Only use this if most of the fields in different types are in nearly
   * the same places.
   * @type {Boolean}
   */
  copyValue = false;
  /**
   * The current child field.
   * @type {Field}
   * @private
   */
  child = undefined;
  /**
   * The schemas for the available types.
   * @type {Object}
   */
  types = {};
  /**
   * Whether or not the UI element should be collapsed (i.e. only show the title)
   * @type {Boolean}
   */
  collapsed = false;
  isCollapsible = true;

  childCollapseChanged(field, isNowCollapsed) {}

  toggleCollapse() {
    this.setCollapsed(!this.collapsed);
  }

  setCollapsed(collapsed) {
    this.collapsed = collapsed;
    if (this.parent) {
      this.parent.childCollapseChanged(this, this.collapsed);
    }
  }

  /** @inheritdoc */
  init(id = '', args = {}) {
    args = Object.assign({
      valueKey: '',
      keyKey: '',
      keyPlaceholder: 'Object key...',
      showType: true,
      copyValue: false,
      collapsed: false,
      types: { 'null': { 'type': 'text' } }
    }, args);
    this.types = args.types;
    this.valueKey = args.valueKey;
    this.keyKey = args.keyKey;
    this.keyPlaceholder = args.keyPlaceholder;
    this.showType = args.showType;
    this.copyValue = args.copyValue;
    this.collapsed = args.collapsed;
    this.defaultType = args.defaultType;
    this.selectedType = args.defaultType || Object.keys(this.types)[0];
    this.selectedTypeChanged(this.selectedType);
    return super.init(id, args);
  }

  /**
   * Called by Aurelia when the selected type changes (e.g. from the dropdown)
   * @param {String} newType The new type.
   */
  selectedTypeChanged(newType) {
    const newSchema = this.types[newType];
    const value = this.copyValue ? this.getValue() : undefined;
    let newChild;
    if (newSchema.hasOwnProperty('$ref')) {
      newChild = this.resolveRef(newSchema.$ref).clone();
    } else {
      newChild = parseJSON(newType, JSON.parse(JSON.stringify(newSchema)));
    }
    if (newChild) {
      newChild.parent = this;
      if (value) {
        this.setValue(value);
      }
      this.child = newChild;
    }
  }

  /**
   * Get the value of this field.
   *
   * If the child is undefined, this will return undefined.
   * If {@link #showType} is {@linkplain false}, the raw value of the child is
   * returned.
   * If {@link #showType} is {@linkplain true} and {@link #valueKey} is defined
   * OR the raw value of the child is not an object, the raw value of the child
   * will be placed in an object wit child is an object, the type will simply
   * be added to the raw value of the child.
   *
   * @return {Object} The value.
   */
  getValue() {
    if (!this.child) {
      return undefined;
    }

    let value = this.child.getValue();
    if (!this.showType) {
      return value;
    }
    if (this.valueKey || typeof value !== 'object' || Array.isArray(value)) {
      const valueKey = this.valueKey || 'value';
      value = {
        type: this.selectedType,
        [valueKey]: value
      };
    } else {
      value.type = this.selectedType;
    }
    if (this.keyKey) {
      value[this.keyKey] = this.key;
    }
    return value;
  }

  setValue(value) {
    if (!this.showType) {
      this.child.setValue(value);
    } else if (typeof value === 'object' && !Array.isArray(value)) {
      delete value.type;
      this.child.setValue(value);
    } else {
      this.child.setValue(value[this.valueKey || 'value']);
    }
  }

  setType(type) {
    this.selectedType = type;
  }

  getType() {
    return this.selectedType;
  }

  /**
   * Get all the possible type names.
   * @return {String[]} The names of the possible types.
   */
  get possibleTypes() {
    return Object.keys(this.types);
  }
}
