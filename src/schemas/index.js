import {header} from './header';
import {mime} from './mime';
import {security} from './security';
import {tags} from './tags';
import {paths} from './paths';
import {types} from './types';
import {parameters} from './parameters';
import {responses} from './responses';

export const fieldsToShow = {
  'header': [
    'info',
    'contact',
    'license',
    'host',
    'basePath',
    'schemes'
  ],
  'global-definitions': ['definitions', 'parameters', 'responses'],
  'mime': ['consumes', 'produces'],
  'global-security': ['security', 'securityDefinitions']
};

export const schema = {
  'type': 'object',
  'children': {
    header,
    mime,
    'global-security': security,
    tags,
    paths,
    'global-definitions': {
      'type': 'object',
      'format': 'tabs',
      'label': 'Global definitions',
      'children': {
        types,
        parameters,
        responses
      }
    },
    'parameters': {
      'type': 'link',
      'target': '/global-definitions/parameters'
    },
    'responses': {
      'type': 'link',
      'target': '/global-definitions/responses'
    },
    'definitions': {
      'type': 'link',
      'target': '/global-definitions/types'
    },
    'security': {
      'type': 'link',
      'target': '/global-security/requirements'
    },
    'securityDefinitions': {
      'type': 'link',
      'target': '/global-security/definitions'
    },
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
      'target': '/header/license'
    },
    'host': {
      'type': 'link',
      'target': '/header/host/host'
    },
    'basePath': {
      'type': 'link',
      'target': '/header/host/basePath'
    },
    'schemes': {
      'type': 'link',
      'target': '/header/host/schemes'
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
