import {Objectfield} from './objectfield';
import {Textfield} from './textfield';
import {Textareafield} from './textareafield';
import {Markdownfield} from './markdownfield';
import {Arrayfield} from './arrayfield';
import {Optionfield} from './optionfield';
import {Linkfield} from './linkfield';
import {LazyLinkfield} from './lazylinkfield';
import {Typefield} from './typefield';

export const fields = {
  [Textfield.TYPE]: Textfield,
  [Textareafield.TYPE]: Textareafield,
  [Markdownfield.TYPE]: Markdownfield,
  [Objectfield.TYPE]: Objectfield,
  [Arrayfield.TYPE]: Arrayfield,
  [Optionfield.TYPE]: Optionfield,
  [Linkfield.TYPE]: Linkfield,
  [LazyLinkfield.TYPE]: LazyLinkfield,
  [Typefield.TYPE]: Typefield
};
