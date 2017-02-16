define('app',['exports', './resources/fields/textfield', './resources/fields/objectfield', 'bootstrap'], function (exports, _textfield, _objectfield) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.App = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var App = exports.App = function () {
    function App() {
      _classCallCheck(this, App);

      this.message = 'Hello World!';
      this.fields = [];

      var obj = new _objectfield.ObjectField();
      obj.title = 'Mui :3';
      var tf = new _textfield.Textfield();
      tf.title = 'Yay!';
      tf.placeholder = 'Enter text';
      obj.addField(tf);

      var obj2 = new _objectfield.ObjectField();
      obj2.title = 'Another field';
      var tf2 = new _textfield.Textfield();
      tf2.title = 'Input 2';
      tf2.placeholder = 'Enter text';
      var tf3 = new _textfield.Textfield();
      tf3.title = 'Input 3';
      tf3.placeholder = 'Enter text';
      obj2.addField(tf2);
      obj2.addField(tf3);

      this.addField(obj);
      this.addField(obj2);
    }

    App.prototype.addField = function addField(field) {
      this.fields.push(field);
    };

    return App;
  }();
});
define('environment',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    debug: true,
    testing: true
  };
});
define('main',['exports', './environment'], function (exports, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.configure = configure;

  var _environment2 = _interopRequireDefault(_environment);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  Promise.config({
    warnings: {
      wForgottenReturn: false
    }
  });

  function configure(aurelia) {
    aurelia.use.standardConfiguration().feature('resources');

    if (_environment2.default.debug) {
      aurelia.use.developmentLogging();
    }

    if (_environment2.default.testing) {
      aurelia.use.plugin('aurelia-testing');
    }

    aurelia.start().then(function () {
      return aurelia.setRoot();
    });
  }
});
define('resources/index',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.configure = configure;
  function configure(config) {}
});
define('resources/fields/field',['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var Field = exports.Field = function () {
    function Field() {
      _classCallCheck(this, Field);

      this.title = '';
    }

    _createClass(Field, [{
      key: 'type',
      get: function get() {
        var className = this._type || this.constructor.name.toLowerCase();

        return className || 'blank';
      }
    }, {
      key: 'model',
      get: function get() {
        return {
          title: this.title
        };
      }
    }, {
      key: 'modelText',
      get: function get() {
        return JSON.stringify(this.model);
      }
    }]);

    return Field;
  }();
});
define('resources/fields/objectfield',['exports', './field'], function (exports, _field) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.ObjectField = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  }

  var ObjectField = exports.ObjectField = function (_Field) {
    _inherits(ObjectField, _Field);

    function ObjectField() {
      var _temp, _this, _ret;

      _classCallCheck(this, ObjectField);

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return _ret = (_temp = (_this = _possibleConstructorReturn(this, _Field.call.apply(_Field, [this].concat(args))), _this), _this.fields = [], _temp), _possibleConstructorReturn(_this, _ret);
    }

    ObjectField.prototype.addField = function addField(field) {
      this.fields.push(field);
    };

    return ObjectField;
  }(_field.Field);
});
define('resources/fields/textfield',['exports', './field'], function (exports, _field) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Textfield = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  }

  var Textfield = exports.Textfield = function (_Field) {
    _inherits(Textfield, _Field);

    function Textfield() {
      var _temp, _this, _ret;

      _classCallCheck(this, Textfield);

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return _ret = (_temp = (_this = _possibleConstructorReturn(this, _Field.call.apply(_Field, [this].concat(args))), _this), _this.value = '', _this.placeholder = '', _temp), _possibleConstructorReturn(_this, _ret);
    }

    return Textfield;
  }(_field.Field);
});
define('text!app.html', ['module'], function(module) { module.exports = "<template><require from=\"bootstrap/css/bootstrap.min.css\"></require><require from=\"./resources/fields/textfield\"></require><require from=\"../styles/index.css\"></require><div class=\"jumbotron\"><h1>${message}</h1></div><div class=\"container\"><div class=\"card\" repeat.for=\"field of fields\"><compose view=\"./resources/fields/${field.type}.html\" view-model.bind=\"field\"></compose></div></div></template>"; });
define('text!resources/fields/blank.html', ['module'], function(module) { module.exports = "<template><h1 textcontent.one-way=\"title\"></h1></template>"; });
define('text!resources/fields/objectfield.html', ['module'], function(module) { module.exports = "<template><h1 textcontent.bind=\"title\"></h1><div class=\"card\" repeat.for=\"field of fields\"><compose view=\"./${field.type}.html\" view-model.bind=\"field\"></compose></div></template>"; });
define('text!resources/fields/textfield.html', ['module'], function(module) { module.exports = "<template><div class=\"textfield-wrapper\"><label textcontent.one-way=\"title\"></label><input type=\"text\" value.bind=\"value\" placeholder.one-way=\"placeholder\"></div></template>"; });
//# sourceMappingURL=app-bundle.js.map