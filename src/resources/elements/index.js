import {Objectfield} from './objectfield';
import {Textfield} from './textfield';
import {Textareafield} from './textareafield';
import {Arrayfield} from './arrayfield';
import {Optionfield} from './optionfield';
import {Linkfield} from './linkfield';
import {LazyLinkfield} from './lazylinkfield';
import {Typefield} from './typefield';

export const fields = {
  text: Textfield,
  textarea: Textareafield,
  object: Objectfield,
  array: Arrayfield,
  option: Optionfield,
  link: Linkfield,
  lazylink: LazyLinkfield,
  selectable: Typefield
};
