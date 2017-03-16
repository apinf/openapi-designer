import {fieldTypes} from './fieldtypes';

export function parseJSON(id, obj) {
  if (obj.type === 'object') {
    for (const [key, field] of Object.entries(obj.children)) {
      obj.children[key] = parseJSON(key, field);
    }
  } else if (obj.type === 'array') {
    obj.item = parseJSON(obj.item.id, obj.item);
  }
  return new fieldTypes[obj.type]().init(id, obj);
}
