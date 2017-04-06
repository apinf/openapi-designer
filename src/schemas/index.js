import {header} from './header';
import {mime} from './mime';
import {security} from './security';
import {tags} from './tags';

export const schema = {
  'type': 'object',
  'children': {
    header,
    mime,
    security,
    tags,
    'info': {
      'type': 'link',
      'target': '/header/info'
    },
    'contact': {
      'type': 'link',
      'target': '/header/contact'
    }
  }
};
