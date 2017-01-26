const schema = require('./schema/index');

/**
 * Convert an array into a map
 * @param  {array[object]} object The array to convert.
 * @param  {string} keyField      The name of the field is stored in within each
 *                                object in the array.
 * @return {object}               The map converted from the array.
 */
function arrayToMap (object, keyField) {
  const newObject = {};
  if (object === undefined || object === null) {
    return newObject;
  }
  object.forEach((objFuncParam) => {
    const obj = objFuncParam;
    const key = obj[keyField];
    if (key === undefined) {
      return;
    }
    delete obj[keyField];
    newObject[key] = obj;
  });
  return newObject;
}

function isEmpty (object) {
  if (object === undefined || object === null) {
    return true;
  } else if (Array.isArray(object)) {
    if (object.length === 0) {
      return true;
    }
    let empty = true;
    object.forEach((child) => {
      if (!isEmpty(child)) {
        empty = false;
        return true;
      }
      return false;
    });
    return empty;
  } else if (typeof object === 'object') {
    let empty = true;
    Object.keys(object).forEach((key) => {
      if (!isEmpty(object[key])) {
        empty = false;
        return true;
      }
      return false;
    });
    return empty;
  } else if (typeof object === 'string') {
    return object.length === 0;
  }
  return false;
}

function deleteEmptyChildren (objectFuncParam) {
  const object = objectFuncParam;
  if (Array.isArray(object)) {
    object.forEach((child, index) => {
      if (isEmpty(child)) {
        object.pop(index);
      } else {
        object[index] = deleteEmptyChildren(child);
      }
    });
  } else if (typeof object === 'object') {
    Object.keys(object).forEach((key) => {
      if (isEmpty(object[key])) {
        delete object[key];
      } else {
        object[key] = deleteEmptyChildren(object[key]);
      }
    });
  }
  return object;
}

function propertyHardRefParser (object, propKey, props) {
  const properties = props;
  const property = properties[propKey];

  const targetExists = Object.hasOwnProperty.call(object.definitions, property.$ref);
  if (!targetExists) {
    return;
  }

  const target = object.definitions[property.$ref];
  if (property.hardReference || target.hardReferenceOnly) {
    properties[propKey] = target;
  } else {
    property.$ref = `#/definitions/${property.$ref}`;
    delete property.hardReference;
  }
}

/**
 * @param  {object} object The form value
 * @return {object}        A corrected version of the output. This should be a
 *                         valid Swagger spec.
 */
module.exports = function processJSON (objectFuncParam) {
  let object = JSON.parse(JSON.stringify(objectFuncParam));

  object = deleteEmptyChildren(object);

  // Hardcoded Swagger version
  object.swagger = '2.0';

  if (object.info) {
    if (object.info.host) {
      object.host = object.info.host;
      delete object.info.host;
    }
    if (object.info.basePath) {
      object.basePath = object.info.basePath;
      delete object.info.basePath;
    }
  }

  if (object.security && object.security.length > 0) {
    object.security = arrayToMap(object.security, 'key');

    /*
     * Put the `value` field of each security object as the actual value of the
     * object.
     */
    Object.keys(object.security).forEach((key) => {
      if (Object.hasOwnProperty.call(object.security[key], 'value')) {
        object.security[key] = object.security[key].value;
      } else {
        object.security[key] = [];
      }
    });
  } else {
    delete object.security;
  }

  // Definition keys that have set the Only hard refences to true will be stored
  // here and then deleted from the definitions object at the end of processing.
  const definitionsToDelete = [];

  if (object.definitions) {
    object.definitions = arrayToMap(object.definitions, 'key');

    Object.keys(object.definitions).forEach((key) => {
      const definition = object.definitions[key];

      // Push hard reference -only definitions to the definitionsToDelete array.
      if (definition.hardReferenceOnly) {
        definitionsToDelete.push(key);
      }
      delete definition.hardReferenceOnly;

      // schemaSchema is a schema to create and validate schemas, also known as
      // a meta-schema.
      // schema.definitions is the main schema for global object definitions and
      // object definitions are basically meta-schemas.
      const schemaSchema = schema.definitions.items;

      // If the value of a property is the same as the default value, delete the
      // whole field to avoid unnecessary fields in the output.
      Object.keys(schemaSchema.properties).forEach((schemaKey) => {
        const prop = schemaSchema.properties[schemaKey];
        if (Object.hasOwnProperty.call(definition, schemaKey)
            && Object.hasOwnProperty.call(prop, 'default')) {
          if (prop.default === definition[schemaKey]) {
            delete definition[schemaKey];
          }
        }
      });

      // Convert the properties field to a map and process references in the
      // properties.
      if (definition.properties) {
        definition.properties = arrayToMap(definition.properties, 'key');
        Object.keys(definition.properties).forEach(propKey =>
          propertyHardRefParser(object, propKey, definition.properties));
      }

      // Do the same thing as previously, but for patternProperties.
      if (definition.patternProperties) {
        definition.patternProperties = arrayToMap(definition.patternProperties, 'key');
        Object.keys(definition.patternProperties).forEach(propKey =>
          propertyHardRefParser(object, propKey, definition.patternProperties));
      }
    });
  } else {
    delete object.definitions;
  }

  if (object.securityDefinitions && object.securityDefinitions.length > 0) {
    object.securityDefinitions = arrayToMap(object.security, 'key');
  } else {
    delete object.securityDefinitions;
  }

  if (object.paths && object.paths.length > 0) {
    object.paths = arrayToMap(object.paths, 'path');
    /*
     * Take all elements in the methods array and put them in the parent path
     * element with `methodName` as the key and the method object as the value.
     */
    Object.keys(object.paths).forEach((key) => {
      const path = object.paths[key];

      path.methods = arrayToMap(path.methods, 'method');

      Object.keys(path.methods).forEach((methodName) => {
        const method = path.methods[methodName];
        method.responses = arrayToMap(method.responses, 'statusCode');
        Object.keys(method.responses).forEach((propKey) => {
          const response = method.responses[propKey];
          response.headers = arrayToMap(response.headers, 'key');
          propertyHardRefParser(object, propKey, method.responses);
          const examples = {};
          if (response.examples) {
            response.examples.forEach((example) => {
              examples[example.mimeType] = example.value;
            });
          }
          response.examples = examples;
        });
        method.parameters.forEach((parameter, index) => {
          propertyHardRefParser(object, index, method.parameters);
        });
        path[methodName] = method;
      });

      // Delete the old list as it isn't actually a part of the Swagger spec
      delete path.methods;
    });
  } else {
    delete object.paths;
  }

  definitionsToDelete.forEach(key => delete object.definitions[key]);

  return object;
};
