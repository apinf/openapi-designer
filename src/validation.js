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

  keyRequired(field) {
    if (field.key.length === 0) {
      return {
        valid: false,
        error: this.i18n.tr('validation.key-is-required')
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
      return {
        valid: false,
        error: 'Invalid validator noDuplicateKeys for field with non-map parent'
      };
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

  @listen('../')
  noDuplicateValues(field) {
    const parent = field.parent;
    if (parent.type !== 'array') {
      return {
        valid: false,
        error: 'Invalid validator noDuplicateKeys for field with non-array parent'
      };
    }

    const value = field.getValue();
    for (const child of parent.children) {
      if (child === field) {
        continue;
      }
      if (child.getValue() === value) {
        return {
          valid: false,
          error: `Duplicate value ${value}`
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

  keyHTTPStatus(field) {
    if (/^[1-5]{1}[0-9]{2}$/.exec(field.key) === null) {
      return {
        valid: false,
        error: this.i18n.tr('validation.invalid-http-status')
      };
    }
    return { valid: true };
  }

  pathParametersExistsInAllOperations(field) {
    if (field.getType() !== 'operation') {
      // We don't need to check references here, they're checked wherever the
      // reference is pointing.
      return { valid: true };
    }

    const parseParamRef = target => {
      // Matches `#/parameters/<paramName>`
      const [, paramName] = /^\#\/parameters\/(.+)$/.exec(target);
      if (!paramName) {
        return undefined;
      }
      return field.resolveRef(`/global-definitions/${paramName}`).getValue();
    };
    const isParamInArray = (paramsField, lookingForParam) => {
      for (const arrayParam of paramsField.children) {
        let paramData = arrayParam.getValue();
        if (paramData.$ref) {
          paramData = parseParamRef(paramData.$ref);
          // No handling for nested $refs due to risk of circular reference.
          if (!paramData || paramData.$ref) {
            continue;
          }
        }
        if (paramData.in === 'path' && paramData.name === lookingForParam) {
          return true;
        }
      }
      return false;
    };

    const path = field.key;
    // The outer path field is a Typefield, but we only need the inner non-reference
    // Path field.
    field = field.child;

    const matches = path.match(/\{([^}]+?)\}/g);
    if (!matches) {
      // No parameters defined.
      return { valid: true };
    }

    const pathwideParams = field.children.parameters;
    ParamsInPath: for (const match of matches) {
      // Remove first and last character (the curly braces)
      const parameter = match.slice(1, -1);
      if (isParamInArray(pathwideParams, parameter)) {
        continue ParamsInPath;
      }
      Methods: for (const [method, child] of Object.entries(field.children)) {
        if (method === 'parameters' || child.isEmpty()) {
          continue Methods;
        }

        if (!isParamInArray(child.children.parameters, parameter)) {
          return {
            valid: false,
            error: this.i18n.tr('validation.param-not-implemented', {
              parameter,
              method: method.toUpperCase()
            })
          };
        }
      }
      return { valid: true };
    }
    return { valid: true };
  }

  keyPath(field) {
    if (!field.key.startsWith('/')) {
      field.key = `/${field.key}`;
    }
    return { valid: true };
  }

  hostname(field) {
    const val = field.getValue();
    if (!val || /^[^\.\s\n:]+(\.[^\.\s\n:]+)+(\:[0-9]{1,5})?$/.exec(val) !== null) {
      return { valid: true };
    } else if (/^\[?([0-9A-Fa-f]{0,4}:?)+\]?(\:[0-9]{1,5})?$/.exec(val) !== null) {
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
