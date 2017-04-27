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
    },
    'license': {
      'type': 'link',
      'target': '/header/contact'
    },
    'host': {
      'type': 'link',
      'target': '/header/info/host'
    },
    'basePath': {
      'type': 'link',
      'target': '/header/info/basePath'
    },
    'consumes': {
      'type': 'link',
      'target': '/mime/consumes'
    },
    'produces': {
      'type': 'link',
      'target': '/mime/produces'
    }
  }
};
