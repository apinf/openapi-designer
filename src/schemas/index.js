import {header} from './header';
import {mime} from './mime';
import {security} from './security';

export const schema = {
  'type': 'object',
  'children': {
    header,
    mime,
    security,
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
