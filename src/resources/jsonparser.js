import {fieldTypes} from './fieldtypes';

export function parseJSON(id, obj, parent = undefined) {
  const createdObj = new fieldTypes[obj.type]();
  if (obj.type === 'object') {
    for (const [key, field] of Object.entries(obj.children)) {
      obj.children[key] = parseJSON(key, field, createdObj);
    }
  } else if (obj.type === 'array') {
    obj.item = parseJSON(obj.item.id, obj.item, createdObj);
  }
  obj.parent = parent;
  return createdObj.init(id, obj);
}
