function listen(...fields) {
  return function(target, key, descriptor) {
    descriptor.value.listen = fields;
  };
}

export class Validation {
  constructor(i18n) {
    this.i18n = i18n;
  }

  required(field) {
    if (field.isEmpty()) {
      return {
        valid: false,
        error: this.i18n.tr('validation.required-is-empty')
      };
    }
    return { valid: true };
  }

  @listen('../')
  requiredIfParent(field) {
    if (field.isEmpty() && !field.parent.isEmpty()) {
      return {
        valid: false,
        error: this.i18n.tr('validation.required-is-empty')
      };
    }
    return { valid: true };
  }

  @listen('../')
  noDuplicateKeys(field) {
    const parent = field.parent;
    if (parent.type !== 'array' || parent.format !== 'map') {
      return { valid: false, error: 'Invalid validator noDuplicateKeys for field with non-map parent' };
    }

    const keyField = parent.keyField;
    const key = field.getValue()[parent.keyField];
    for (const child of parent.children) {
      if (child === field) {
        continue;
      }
      if (child.getValue()[keyField] === key) {
        return {
          valid: false,
          error: `Duplicate key ${key}`
        };
      }
    }
    return { valid: true };
  }

  path(field) {
    const val = field.getValue();
    if (!val.startsWith('/')) {
      return {
        valid: false,
        replacement: `/${val}`
      };
    }
    return { valid: true };
  }

  hostname(field) {
    const val = field.getValue();
    if (!val || /^[^\.\s\n:]+(\.[^\.\s\n:]+)+(\:[0-9]{1,5})?$/.exec(val) !== null) {
      return { valid: true };
    }
    return {
      valid: false,
      error: this.i18n.tr('validation.invalid-hostname')
    };
  }

  email(field) {
    const val = field.getValue();
    if (!val || /^\S+@\S+$/.exec(val) !== null) {
      return { valid: true };
    }
    return {
      valid: false,
      error: this.i18n.tr('validation.invalid-email')
    };
  }

  url(field) {
    return { valid: true };
  }
}
