import {Objectfield} from './elements/objectfield';
import {Textfield} from './elements/textfield';
import {Textareafield} from './elements/textareafield';
import {Arrayfield} from './elements/arrayfield';

export const fieldTypes = {
  text: Textfield,
  textarea: Textareafield,
  object: Objectfield,
  array: Arrayfield
};
