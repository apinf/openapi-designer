import {Objectfield} from './objectfield';
import {Textfield} from './textfield';
import {Textareafield} from './textareafield';
import {Arrayfield} from './arrayfield';
import {Optionfield} from './optionfield';
import {Linkfield} from './linkfield';
import {LazyLinkfield} from './lazylinkfield';
import {Typefield} from './typefield';

export const fields = {
  [Textfield.type]: Textfield,
  [Textareafield.type]: Textareafield,
  [Objectfield.type]: Objectfield,
  [Arrayfield.type]: Arrayfield,
  [Optionfield.type]: Optionfield,
  [Linkfield.type]: Linkfield,
  [LazyLinkfield.type]: LazyLinkfield,
  [Typefield.type]: Typefield
};
