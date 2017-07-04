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

  requiredIfParent(field) {
    if (field.isEmpty() && !field.parent.isEmpty()) {
      return {
        valid: false,
        error: this.i18n.tr('validation.required-is-empty')
      };
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

  email(field) {
    return { valid: true };
  }

  url(field) {
    return { valid: true };
  }
}
