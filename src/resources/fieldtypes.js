import {Objectfield} from './elements/objectfield';
import {Textfield} from './elements/textfield';
import {Textareafield} from './elements/textareafield';
import {Arrayfield} from './elements/arrayfield';
import {Optionfield} from './elements/optionfield';

export const fieldTypes = {
  text: Textfield,
  textarea: Textareafield,
  object: Objectfield,
  array: Arrayfield,
  option: Optionfield
};
