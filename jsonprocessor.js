/**
 * Convert an array into a map
 * @param  {array[object]} object The array to convert.
 * @param  {string} keyField      The name of the field is stored in within each
 *                                object in the array.
 * @return {object}               The map converted from the array.
 */
function arrayToMap (object, keyField) {
  const newObject = {};
  object.forEach((objFuncParam) => {
    const obj = objFuncParam;
    const key = obj[keyField];
    delete obj[keyField];
    newObject[key] = obj;
  });
  return newObject;
}

/**
 * @param  {object} object The form value
 * @return {object}        A corrected version of the output. This should be a
 *                         valid Swagger spec.
 */
module.exports = function processJSON (objectFuncParam) {
  const object = JSON.parse(JSON.stringify(objectFuncParam));

  if (object.security && object.security.length > 0) {
    object.security = arrayToMap(object.security, 'key');

    /*
     * Put the `value` field of each security object as the actual value of the
     * object.
     */
    Object.keys(object.security).forEach((key) => {
      object.security[key] = object.security[key].value;
    });
  } else {
    object.security = {};
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
        path[methodName] = path.methods[methodName];
      });

      // Delete the old list as it isn't actually a part of the Swagger spec
      delete path.methods;
    });
  } else {
    object.paths = {};
  }

  return object;
};
