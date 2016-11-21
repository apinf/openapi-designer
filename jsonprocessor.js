
/**
 * This takes all elements in the methods array and puts them in the parent
 * path element with the `methodName` field as the key and the method object
 * as a value.
 *
 * @param  {object} object The output from Alpaca
 * @return {object}        A corrected version of the output. This should be a
 *                         valid Swagger spec.
 */
module.exports = function processJSON (object) {
  if (object.paths === undefined) {
    return object;
  }
  Object.keys(object.paths).forEach((key) => {
    const path = object.paths[key];

    path.methods.forEach((method) => {
      const methodName = method.methodName;
      // Ignore if method is not set or if path already has the same method.
      if (methodName === undefined || {}.hasOwnProperty.call(path, methodName)) {
        return;
      }

      // Delete the key from the method object.
      const methodObj = method;
      delete methodObj.methodName;
      // Set the method object as a child of the path object.
      path[methodName] = method;
    });
    // Delete the old list as it isn't actually a part of the Swagger spec
    delete path.methods;
  });
  return object;
};
