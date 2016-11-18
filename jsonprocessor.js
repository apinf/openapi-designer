
module.exports = function processJSON (object) {
  // Temporary patch for bug with nested maps in Alpaca.
  // See https://github.com/gitana/alpaca/issues/444
  if (object.paths === undefined) {
    return object;
  }
  Object.keys(object.paths).forEach((key) => {
    const elem = object.paths[key];
    if (elem.methods.length === 0) {
      return;
    }
    const methodsMap = {};
    elem.methods.forEach((method) => {
      const methodName = method.methodName;
      if (methodName === undefined) {
        return;
      }
      const methodObj = method;
      delete methodObj.methodName;
      methodsMap[methodName] = methodObj;
    });
    elem.methods = methodsMap;
  });
  return object;
};
