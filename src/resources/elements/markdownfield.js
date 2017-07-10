import {containerless} from 'aurelia-framework';
import {Textareafield} from './textareafield';
import SimpleMDE from 'simplemde';

/**
 * Markdownfield is a {@link Textareafield} that supports WYSIWYG markdown editing.
 */
@containerless
export class Markdownfield extends Textareafield {
  static TYPE = 'markdown';

  /**
   * @inheritdoc
   */
  init(id = '', args = {}) {
    return super.init(id, args);
  }

  attached() {
    this.editor = new SimpleMDE({
      element: this.editorElem,
      indentWithTabs: true,
      lineWrapping: true,
      placeholder: this.placeholder,
      status: false,
      tabSize: 2,
      toolbar: false,
      autoDownloadFontAwesome: false,
      forceSync: true,
      spellChecker: false
    });
  }
}
