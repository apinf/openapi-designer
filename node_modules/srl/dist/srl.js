var SRL =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	const Builder = __webpack_require__(1)
	const Interpreter = __webpack_require__(5)

	/**
	 * SRL facade for SRL Builder and SRL Language.
	 *
	 * @param  {string} query
	 * @return {Builder}
	 */
	function SRL(query) {
	    return query && typeof query === 'string' ?
	        new Interpreter(query).builder :
	        new Builder()
	}

	module.exports = SRL


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	const SyntaxException = __webpack_require__(2)
	const BuilderException = __webpack_require__(3)
	const ImplementationException = __webpack_require__(4)

	const NON_LITERAL_CHARACTERS = '[\\^$.|?*+()/'
	const METHOD_TYPE_BEGIN = 0b00001
	const METHOD_TYPE_CHARACTER = 0b00010
	const METHOD_TYPE_GROUP = 0b00100
	const METHOD_TYPE_QUANTIFIER = 0b01000
	const METHOD_TYPE_ANCHOR = 0b10000
	const METHOD_TYPE_UNKNOWN = 0b11111
	const METHOD_TYPES_ALLOWED_FOR_CHARACTERS = METHOD_TYPE_BEGIN | METHOD_TYPE_ANCHOR | METHOD_TYPE_GROUP | METHOD_TYPE_QUANTIFIER | METHOD_TYPE_CHARACTER

	const simpleMapper = {
	    'startsWith': {
	        'add': '^',
	        'type': METHOD_TYPE_ANCHOR,
	        'allowed': METHOD_TYPE_BEGIN
	    },
	    'mustEnd': {
	        'add': '$',
	        'type': METHOD_TYPE_ANCHOR,
	        'allowed': METHOD_TYPE_CHARACTER | METHOD_TYPE_QUANTIFIER | METHOD_TYPE_GROUP
	    },
	    'onceOrMore': {
	        'add': '+',
	        'type': METHOD_TYPE_QUANTIFIER,
	        'allowed': METHOD_TYPE_CHARACTER | METHOD_TYPE_GROUP
	    },
	    'neverOrMore': {
	        'add': '*',
	        'type': METHOD_TYPE_QUANTIFIER,
	        'allowed': METHOD_TYPE_CHARACTER | METHOD_TYPE_GROUP
	    },
	    'any': {
	        'add': '.',
	        'type': METHOD_TYPE_CHARACTER,
	        'allowed': METHOD_TYPES_ALLOWED_FOR_CHARACTERS
	    },
	    'tab': {
	        'add': '\\t',
	        'type': METHOD_TYPE_CHARACTER,
	        'allowed': METHOD_TYPES_ALLOWED_FOR_CHARACTERS
	    },
	    'newLine': {
	        'add': '\\n',
	        'type': METHOD_TYPE_CHARACTER,
	        'allowed': METHOD_TYPES_ALLOWED_FOR_CHARACTERS
	    },
	    'whitespace': {
	        'add': '\\s',
	        'type': METHOD_TYPE_CHARACTER,
	        'allowed': METHOD_TYPES_ALLOWED_FOR_CHARACTERS
	    },
	    'noWhitespace': {
	        'add': '\\S',
	        'type': METHOD_TYPE_CHARACTER,
	        'allowed': METHOD_TYPES_ALLOWED_FOR_CHARACTERS
	    },
	    'anyCharacter': {
	        'add': '\\w',
	        'type': METHOD_TYPE_CHARACTER,
	        'allowed': METHOD_TYPES_ALLOWED_FOR_CHARACTERS
	    },
	    'noCharacter': {
	        'add': '\\W',
	        'type': METHOD_TYPE_CHARACTER,
	        'allowed': METHOD_TYPES_ALLOWED_FOR_CHARACTERS
	    }
	}

	class Builder {
	    /**
	     * @constructor
	     */
	    constructor() {
	        /** @var {array} _regEx Regular Expression being built. */
	        this._regEx = []

	        /** @var {string} _modifiers Raw modifier to apply on. */
	        this._modifiers = 'g'

	        /** @var {number} _lastMethodType Type of last method, to avoid invalid builds. */
	        this._lastMethodType = METHOD_TYPE_BEGIN

	        /** @var {RegExp|null} _result Regular Expression Object built. */
	        this._result = null

	        /** @var {string} _group Desired group, if any */
	        this._group = '%s'

	        /** @var {string} _implodeString String to join with. */
	        this._implodeString = ''

	        /** @var {array} _captureNames Save capture names to map */
	        this._captureNames = []
	    }

	    /**********************************************************/
	    /*                     CHARACTERS                         */
	    /**********************************************************/

	    /**
	     * Add raw Regular Expression to current expression.
	     *
	     * @param  {string|RegExp} regularExpression
	     * @throws {BuilderException}
	     * @return {Builder}
	     */
	    raw(regularExpression) {
	        regularExpression = regularExpression instanceof RegExp ?
	            regularExpression.toString().slice(1, -1) :
	            regularExpression

	        this._lastMethodType = METHOD_TYPE_UNKNOWN
	        this.add(regularExpression)

	        if (!this._isValid()) {
	            this._revertLast()
	            throw new BuilderException('Adding raw would invalidate this regular expression. Reverted.')
	        }

	        return this
	    }

	    /**
	     * Literally match one of these characters.
	     *
	     * @param  {string} chars
	     * @return {Builder}
	     */
	    oneOf(chars) {
	        this._validateAndAddMethodType(METHOD_TYPE_CHARACTER, METHOD_TYPES_ALLOWED_FOR_CHARACTERS)

	        let result = chars.split('').map((character) => this.escape(character)).join('')
	        result = result.replace('-', '\\-').replace(']', '\\]')

	        return this.add(`[${result}]`)
	    }

	    /**
	     * Literally match all of these characters in that order.
	     *
	     * @param  {string} chars One or more characters
	     * @return {Builder}
	     */
	    literally(chars) {
	        this._validateAndAddMethodType(METHOD_TYPE_CHARACTER, METHOD_TYPES_ALLOWED_FOR_CHARACTERS)
	        const result = chars.split('').map((character) => this.escape(character)).join('')

	        return this.add(`(?:${result})`)
	    }

	    /**
	     * Match any digit (in given span). Default will be a digit between 0 and 9.
	     *
	     * @param  {number} min
	     * @param  {number} max
	     * @return {Builder}
	     */
	    digit(min = 0, max = 9) {
	        this._validateAndAddMethodType(METHOD_TYPE_CHARACTER, METHOD_TYPES_ALLOWED_FOR_CHARACTERS)

	        return this.add(`[${min}-${max}]`)
	    }

	    /**
	     * Match any uppercase letter (between A to Z).
	     *
	     * @param  {string} min
	     * @param  {string} max
	     * @return {Builder}
	     */
	    uppercaseLetter(min = 'A', max = 'Z') {
	        return this.add(`[${min}-${max}]`)
	    }

	    /**
	     * Match any lowercase letter (bwteen a to z).
	     * @param  {string} min
	     * @param  {string} max
	     * @return {Builder}
	     */
	    letter(min = 'a', max = 'z') {
	        this._validateAndAddMethodType(METHOD_TYPE_CHARACTER, METHOD_TYPES_ALLOWED_FOR_CHARACTERS)

	        return this.add(`[${min}-${max}]`)
	    }

	    /**********************************************************/
	    /*                        GROUPS                          */
	    /**********************************************************/

	    /**
	     * Match any of these condition.
	     *
	     * @param  {Closure|Builder|string} conditions Anonymous function with its Builder as first parameter.
	     * @return {Builer}
	     */
	    anyOf(conditions) {
	        this._validateAndAddMethodType(METHOD_TYPE_GROUP, METHOD_TYPES_ALLOWED_FOR_CHARACTERS)

	        return this._addClosure(new Builder()._extends('(?:%s)', '|'), conditions)
	    }

	    /**
	     * Match all of these conditions, but in a non capture group.
	     *
	     * @param  {Closure|Builder|string} conditions Anonymous function with its Builder as a first parameter.
	     * @return {Builder}
	     */
	    group(conditions) {
	        this._validateAndAddMethodType(METHOD_TYPE_GROUP, METHOD_TYPES_ALLOWED_FOR_CHARACTERS)

	        return this._addClosure(new Builder()._extends('(?:%s)'), conditions)
	    }

	    /**
	     * Match all of these conditions, Basically reverts back to the default mode, if coming from anyOf, etc.
	     *
	     * @param  {Closure|Builder|string} conditions
	     * @return {Builder}
	     */
	    and(conditions) {
	        this._validateAndAddMethodType(METHOD_TYPE_GROUP, METHOD_TYPES_ALLOWED_FOR_CHARACTERS)

	        return this._addClosure(new Builder(), conditions)
	    }

	    /**
	     * Positive lookahead. Match the previous condition only if followed by given conditions.
	     *
	     * @param  {Closure|Builder|string} condition Anonymous function with its Builder as a first parameter.
	     * @return {Builder}
	     */
	    ifFollowedBy(conditions) {
	        this._validateAndAddMethodType(METHOD_TYPE_GROUP, METHOD_TYPES_ALLOWED_FOR_CHARACTERS)

	        return this._addClosure(new Builder()._extends('(?=%s)'), conditions)
	    }

	    /**
	     * Negative lookahead. Match the previous condition only if NOT followed by given conditions.
	     *
	     * @param  {Closure|Builder|string} condition Anonymous function with its Builder as a first parameter.
	     * @return {Builder}
	     */
	    ifNotFollowedBy(conditions) {
	        this._validateAndAddMethodType(METHOD_TYPE_GROUP, METHOD_TYPES_ALLOWED_FOR_CHARACTERS)

	        return this._addClosure(new Builder()._extends('(?!%s)'), conditions)
	    }

	    /**
	     * Create capture group of given conditions.
	     *
	     * @param  {Closure|Builder|string} condition Anonymous function with its Builder as a first parameter.
	     * @param  {String} name
	     * @return {Builder}
	     */
	    capture(conditions, name) {
	        if (name) {
	            this._captureNames.push(name)
	        }

	        this._validateAndAddMethodType(METHOD_TYPE_GROUP, METHOD_TYPES_ALLOWED_FOR_CHARACTERS)

	        return this._addClosure(new Builder()._extends('(%s)'), conditions)
	    }

	    /**********************************************************/
	    /*                      QUANTIFIERS                       */
	    /**********************************************************/

	    /**
	     * Make the last or given condition optional.
	     *
	     * @param  {null|Closure|Builder|string} conditions Anonymous function with its Builder as a first parameter.
	     * @return {Builder}
	     */
	    optional(conditions = null) {
	        this._validateAndAddMethodType(METHOD_TYPE_QUANTIFIER, METHOD_TYPE_CHARACTER | METHOD_TYPE_GROUP)

	        if (!conditions) {
	            return this.add('?')
	        }

	        return this._addClosure(new Builder()._extends('(?:%s)?'), conditions)
	    }

	    /**
	     * Previous match must occur so often.
	     *
	     * @param  {number} min
	     * @param  {number} max
	     * @return {Builder}
	     */
	    between(min, max) {
	        this._validateAndAddMethodType(METHOD_TYPE_QUANTIFIER, METHOD_TYPE_CHARACTER | METHOD_TYPE_GROUP)

	        return this.add(`{${min},${max}}`)
	    }

	    /**
	     * Previous match must occur at least this often.
	     *
	     * @param  {number} min
	     * @return {Builder}
	     */
	    atLeast(min) {
	        this._validateAndAddMethodType(METHOD_TYPE_QUANTIFIER, METHOD_TYPE_CHARACTER | METHOD_TYPE_GROUP)

	        return this.add(`{${min},}`)
	    }

	    /**
	     * Previous match must occur exactly once.
	     *
	     * @return {Builder}
	     */
	    once() {
	        return this.exactly(1)
	    }

	    /**
	     * Previous match must occur exactly twice.
	     *
	     * @return {Builder}
	     */
	    twice() {
	        return this.exactly(2)
	    }

	    /**
	     * Previous match must occur exactly this often.
	     *
	     * @param  {number} count
	     * @return {Builder}
	     */
	    exactly(count) {
	        this._validateAndAddMethodType(METHOD_TYPE_QUANTIFIER, METHOD_TYPE_CHARACTER | METHOD_TYPE_GROUP)

	        return this.add(`{${count}}`)
	    }

	    /**
	     * Match less chars instead of more (lazy).
	     *
	     * @return {Builder}
	     * @throws {ImplementationException}
	     */
	    lazy() {
	        const chars = '+*}?'
	        const raw = this.getRawRegex()
	        const last = raw.substr(-1)
	        const lastMethodType = this._lastMethodType
	        this._lastMethodType = METHOD_TYPE_QUANTIFIER

	        if (!chars.includes(last)) {
	            if (last === ')' && chars.includes(raw.substr(-2, 1))) {
	                const target = lastMethodType === METHOD_TYPE_GROUP ? this._revertLast().slice(0, -1) + '?)' : '?'
	                return this.add(target)
	            }

	            throw new ImplementationException('Cannot apply laziness at this point. Only applicable after quantifier.')
	        }

	        return this.add('?')
	    }

	    /**
	     * Match up to the given condition.
	     *
	     * @param  {Closure|Builder|string} toCondition
	     * @return {Builder}
	     */
	    until(toCondition) {
	        this.lazy()
	        this._validateAndAddMethodType(METHOD_TYPE_GROUP, METHOD_TYPES_ALLOWED_FOR_CHARACTERS)

	        return this._addClosure(new Builder(), toCondition)
	    }

	    /**********************************************************/
	    /*                   MODIFIER MAPPER                      */
	    /**********************************************************/

	    multiLine() {
	        return this._addUniqueModifier('m')
	    }

	    caseInsensitive() {
	        return this._addUniqueModifier('i')
	    }

	    // Todo
	    // unicode()
	    // sticky()

	    /**********************************************************/
	    /*                   SIMPLE MAPPER                        */
	    /**********************************************************/

	    startsWith() {
	        return this._addFromMapper('startsWith')
	    }

	    mustEnd() {
	        return this._addFromMapper('mustEnd')
	    }

	    onceOrMore() {
	        return this._addFromMapper('onceOrMore')
	    }

	    neverOrMore() {
	        return this._addFromMapper('neverOrMore')
	    }

	    any() {
	        return this._addFromMapper('any')
	    }

	    tab() {
	        return this._addFromMapper('tab')
	    }

	    newLine() {
	        return this._addFromMapper('newLine')
	    }

	    whitespace() {
	        return this._addFromMapper('whitespace')
	    }

	    noWhitespace() {
	        return this._addFromMapper('noWhitespace')
	    }

	    anyCharacter() {
	        return this._addFromMapper('anyCharacter')
	    }

	    noCharacter() {
	        return this._addFromMapper('noCharacter')
	    }

	    /**********************************************************/
	    /*                   INTERNAL METHODS                     */
	    /**********************************************************/

	    /**
	     * Escape specific character.
	     *
	     * @param  {string} character
	     * @return {string}
	     */
	    escape(character) {
	        return (NON_LITERAL_CHARACTERS.includes(character) ? '\\' : '') + character
	    }

	    /**
	     * Get the raw regular expression string.
	     *
	     * @return string
	     */
	    getRawRegex() {
	        return this._group.replace('%s', this._regEx.join(this._implodeString))
	    }

	    /**
	     * Get all set modifiers.
	     *
	     * @return {string}
	     */
	    getModifiers() {
	        return this._modifiers
	    }

	    /**
	     * Add condition to the expression query.
	     *
	     * @param  {string} condition
	     * @return {Builder}
	     */
	    add(condition) {
	        this._result = null // Reset result to make up a new one.
	        this._regEx.push(condition)
	        return this
	    }

	    /**
	     * Validate method call. This will throw an exception if the called method makes no sense at this point.
	     * Will add the current type as the last method type.
	     *
	     * @param  {number} type
	     * @param  {number} allowed
	     * @param  {string} methodName
	     */
	    _validateAndAddMethodType(type, allowed, methodName) {
	        if (allowed & this._lastMethodType) {
	            this._lastMethodType = type
	            return
	        }

	        const message = {
	            [METHOD_TYPE_BEGIN]: 'at the beginning',
	            [METHOD_TYPE_CHARACTER]: 'after a literal character',
	            [METHOD_TYPE_GROUP]: 'after a group',
	            [METHOD_TYPE_QUANTIFIER]: 'after a quantifier',
	            [METHOD_TYPE_ANCHOR]: 'after an anchor'
	        }[this._lastMethodType]

	        throw new ImplementationException(
	            `Method ${methodName} is not allowed ${message || 'here'}`
	        )
	    }

	    /**
	     * Add the value form simple mapper to the regular expression.
	     *
	     * @param  {string} name
	     * @return {Builder}
	     * @throws {BuilderException}
	     */
	    _addFromMapper(name) {
	        const item = simpleMapper[name]
	        if (!item) {
	            throw new BuilderException('Unknown mapper.')
	        }

	        this._validateAndAddMethodType(item.type, item.allowed, name)
	        return this.add(item.add)
	    }

	    /**
	     * Add a specific unique modifier. This will ignore all modifiers already set.
	     *
	     * @param  {string} modifier
	     * @return {Builder}
	     */
	    _addUniqueModifier(modifier) {
	        this._result = null

	        if (!this._modifiers.includes(modifier)) {
	            this._modifiers += modifier
	        }

	        return this
	    }

	    /**
	     * Build the given Closure or string and append it to the current expression.
	     *
	     * @param  {Builder} builder
	     * @param  {Closure|Builder|string} conditions Either a closure, literal character string or another Builder instance.
	     */
	    _addClosure(builder, conditions) {
	        if (typeof conditions === 'string') {
	            builder.literally(conditions)
	        } else if (conditions instanceof Builder) {
	            builder.raw(conditions.getRawRegex())
	        } else {
	            conditions(builder)
	        }

	        return this.add(builder.getRawRegex())
	    }

	    /**
	     * Get and remove last added element.
	     *
	     * @return  {string}
	     */
	    _revertLast() {
	        return this._regEx.pop()
	    }

	    /**
	     * Build and return the resulting RegExp object. This will apply all the modifiers.
	     *
	     * @return {RegExp}
	     * @throws {SyntaxException}
	     */
	    get() {
	        if (this._isValid()) {
	            return this._result
	        } else {
	            throw new SyntaxException('Generated expression seems to be invalid.')
	        }
	    }

	    /**
	     * Validate regular expression.
	     *
	     * @return {boolean}
	     */
	    _isValid() {
	        if (this._result) {
	            return true
	        } else {
	            try {
	                this._result = new RegExp(this.getRawRegex(), this.getModifiers())
	                return true
	            } catch (e) {
	                return false
	            }
	        }
	    }

	    /**
	     * Extends self to match more cases.
	     *
	     * @param  {string} group
	     * @param  {string} implodeString
	     * @return {Builder}
	     */
	    _extends(group, implodeString = '') {
	        this._group = group
	        this._implodeString = implodeString
	        return this
	    }

	    /**
	     * Clone a new builder object.
	     *
	     * @return {Builder}
	     */
	    clone() {
	        const clone = new Builder()

	        // Copy deeply
	        clone._regEx = Array.from(this._regEx)
	        clone._modifiers = this._modifiers
	        clone._lastMethodType = this._lastMethodType
	        clone._group = this._group

	        return clone
	    }

	    /**
	     * Remote specific flag.
	     *
	     * @param  {string} flag
	     * @return {Builder}
	     */
	    removeModifier(flag) {
	        this._modifiers = this._modifiers.replace(flag, '')
	        this._result = null

	        return this
	    }

	    /**********************************************************/
	    /*                   REGEX METHODS                        */
	    /**********************************************************/
	    exec() {
	        const regexp = this.get()
	        return regexp.exec.apply(regexp, arguments)
	    }

	    test() {
	        const regexp = this.get()
	        return regexp.test.apply(regexp, arguments)
	    }

	    /**********************************************************/
	    /*                 ADDITIONAL METHODS                     */
	    /**********************************************************/

	    /**
	     * Just like test in RegExp, but reset lastIndex.
	     *
	     * @param  {string} target
	     * @return {boolean}
	     */
	    isMatching(target) {
	        const result = this.test(target)
	        this.get().lastIndex = 0
	        return result
	    }

	    /**
	     * Map capture index to name.
	     * When `exec` give the result like: [ 'aa ', 'aa', index: 0, input: 'aa bb cc dd' ]
	     * Then help to resolve to return: [ 'aa ', 'aa', index: 0, input: 'aa bb cc dd', [captureName]: 'aa' ]
	     *
	     * @param {object} result
	     * @return {object}
	     */
	    _mapCaptureIndexToName(result) {
	        const names = this._captureNames

	        return Array.prototype.reduce.call(result.slice(1), (result, current, index) => {
	            if (names[index]) {
	                result[names[index]] = current || ''
	            }

	            return result
	        }, result)
	    }

	    /**
	     * Just like match in String, but reset lastIndex.
	     *
	     * @param  {string} target
	     * @return {array|null}
	     */
	    getMatch(target) {
	        const regex = this.get()
	        const result = regex.exec(target)
	        regex.lastIndex = 0

	        return this._mapCaptureIndexToName(result)
	    }

	    /**
	     * Get all matches, just like loop for RegExp.exec.
	     * @param  {string} target
	     */
	    getMatches(target) {
	        const result = []
	        const regex = this.get()
	        let temp = null

	        while (temp = regex.exec(target)) {
	            temp = this._mapCaptureIndexToName(temp)
	            result.push(temp)
	        }
	        regex.lastIndex = 0

	        return result
	    }
	}

	module.exports = Builder


/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict'

	class SyntaxException extends Error {
	}

	module.exports = SyntaxException


/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict'

	class BuilderException extends Error {
	}

	module.exports = BuilderException


/***/ },
/* 4 */
/***/ function(module, exports) {

	'use strict'

	class ImplementationException extends Error {
	}

	module.exports = ImplementationException


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	const Cache = __webpack_require__(6)
	const Literally = __webpack_require__(7)
	const parseParentheses = __webpack_require__(8)
	const buildQuery = __webpack_require__(9)
	const methodMatch = __webpack_require__(12)

	const InterpreterException = __webpack_require__(18)

	class Interpreter {
	    /**
	     * @constructor
	     * @param  {string} query
	     */
	    constructor(query) {
	        const rawQuery = this.rawQuery = query.trim().replace(/\s*;$/, '')

	        if (Cache.has(rawQuery)) {
	            this.builder = Cache.get(rawQuery).clone()
	        } else {
	            this.build()
	        }
	    }

	    /**
	     * Resolve and then build the query.
	     */
	    build() {
	        this.resolvedQuery = this.resolveQuery(parseParentheses(this.rawQuery))

	        this.builder = buildQuery(this.resolvedQuery)

	        // Add built query to cache, to avoid rebuilding the same query over and over.
	        Cache.set(this.rawQuery, this.builder)
	    }

	    /**
	     * Resolve the query array recursively and insert Methods.
	     *
	     * @param array $query
	     * @return array
	     * @throws InterpreterException
	     */
	    resolveQuery(query) {
	        // Using for, since the array will be altered. Foreach would change behaviour.
	        for (let i = 0; i < query.length; i++) {
	            let item = query[i]

	            if (typeof item === 'string') {
	                // Remove commas and remove item if empty.
	                item = query[i] = item.replace(/,/g, ' ')

	                if (item === '') {
	                    continue
	                }

	                try {
	                    // A string can be interpreted as a method. Let's try resolving the method then.
	                    const method = methodMatch(item.trim())

	                    // If anything was left over (for example parameters), grab them and insert them.
	                    const leftOver = item.replace(new RegExp(method.origin, 'i'), '')
	                    query[i] = method
	                    if (leftOver !== '') {
	                        query.splice(i + 1, 0, leftOver.trim())
	                    }
	                } catch (e) {
	                    // There could be some parameters, so we'll split them and try to parse them again
	                    const matches = item.match(/(.*?)[\s]+(.*)/)

	                    if (matches) {
	                        query[i] = matches[1].trim()

	                        if (matches[2]) {
	                            query.splice(i + 1, 0, matches[2].trim())
	                        }
	                    }
	                }
	            } else if (Array.isArray(item)) {
	                query[i] = this.resolveQuery(item)
	            } else if (!item instanceof Literally) {
	                throw new InterpreterException(`Unexpected statement: ${JSON.stringify(item)}`)
	            }
	        }

	        return query.filter((item) => item !== '')
	    }

	    /**
	     * Return the built RegExp object.
	     *
	     * @return {RegExp}
	     */
	    get() {
	        return this.builder.get()
	    }
	}

	module.exports = Interpreter


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	const Builder = __webpack_require__(1)
	const _cache = {}

	/**
	 * Temporary cache for already built SRL queries to speed up loops.
	 */
	const Cache = {
	    /**
	     * Set Builder for SRL to cache.
	     *
	     * @param  {string} query
	     * @param  {Builder} builder
	     */
	    set(query, builder) {
	        _cache[query] = builder
	    },

	    /**
	     * Get SRL from cache, or return new Builder.
	     *
	     * @param  {string} query
	     * @return {Builder}
	     */
	    get(query) {
	        return _cache[query] || new Builder()
	    },

	    /**
	     * Validate if current SRL is a already in cache.
	     *
	     * @param  {string} query
	     * @return {boolean}
	     */
	    has(query) {
	        return !!_cache[query]
	    }
	}

	module.exports = Cache


/***/ },
/* 7 */
/***/ function(module, exports) {

	'use strict'

	/**
	 * Wrapper for literal strings that should not be split, tainted or interpreted in any way.
	 */
	class Literally {
	    /**
	     * @constructor
	     * @param  {string} string
	     */
	    constructor(string) {
	        // Just like stripslashes in PHP
	        this._string = string.replace(/\\(.)/mg, '$1')
	    }


	    /**
	     * @return  {string}
	     */
	    toString() {
	        return this._string
	    }
	}

	module.exports = Literally


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	const SyntaxException = __webpack_require__(2)
	const Literally = __webpack_require__(7)

	/**
	 * Parse parentheses and return multidimensional array containing the structure of the input string.
	 * It will parse ( and ) and supports nesting, escaping using backslash and strings using ' or ".
	 *
	 * @param  {string} query
	 * @return {array}
	 * @throws {SyntaxException}
	 */
	function parseParentheses(query) {
	    let openCount = 0
	    let openPos = false
	    let closePos = false
	    let inString = false
	    let backslash = false
	    const stringPositions = []
	    const stringLength = query.length

	    if (query[0] === '(' && query[stringLength - 1] === ')') {
	        query = query.slice(1, -1)
	    }

	    loop:
	    for (let i = 0; i < stringLength; i++) {
	        const char = query[i]

	        if (inString) {
	            if (
	                char === inString &&
	                (query[i - 1] !== '\\' || (query[i - 1] === '\\' && query[i - 2] === '\\'))
	            ) {
	                // We're no more in the string. Either the ' or " was not escaped, or it was but the backslash
	                // before was escaped as well.
	                inString = false

	                // Also, to create a "Literally" object later on, save the string end position.
	                stringPositions[stringPositions.length - 1].end = i - 1
	            }

	            continue
	        }

	        if (backslash) {
	            // Backslash was defined in the last char. Reset it and continue, since it only matches one character.
	            backslash = false
	            continue
	        }

	        switch (char) {
	        case '\\':
	            // Set the backslash flag. This will skip one character.
	            backslash = true
	            break
	        case '"':
	        case '\'':
	            // Set the string flag. This will tell the parser to skip over this string.
	            inString = char
	            // Also, to create a "Literally" object later on, save the string start position.
	            stringPositions.push({ start: i })
	            break
	        case '(':
	            // Opening parenthesis, increase the count and set the pointer if it's the first one.
	            openCount++
	            if (openPos === false) {
	                openPos = i
	            }
	            break
	        case ')':
	            // Closing parenthesis, remove count
	            openCount--
	            if (openCount === 0) {
	                // If this is the matching one, set the closing pointer and break the loop, since we don't
	                // want to match any following pairs. Those will be taken care of in a later recursion step.
	                closePos = i
	                break loop
	            }
	            break
	        }
	    }

	    if (openCount !== 0) {
	        throw new SyntaxException('Non-matching parenthesis found.')
	    }

	    if (closePos === false) {
	        // No parentheses found. Use end of string.
	        openPos = closePos = stringLength
	    }

	    let result = createLiterallyObjects(query, openPos, stringPositions)

	    if (openPos !== closePos) {
	        // Parentheses found.
	        // First part is definitely without parentheses, since we'll match the first pair.
	        result = result.concat([
	            // This is the inner part of the parentheses pair. There may be some more nested pairs, so we'll check them.
	            parseParentheses(query.substr(openPos + 1, closePos - openPos - 1))
	            // Last part of the string wasn't checked at all, so we'll have to re-check it.
	        ], parseParentheses(query.substr(closePos + 1)))
	    }

	    return result.filter((item) => typeof item !== 'string' || item.length)
	}

	/**
	 * Replace all "literal strings" with a Literally object to simplify parsing later on.
	 *
	 * @param  {string} string
	 * @param  {number} openPos
	 * @param  {array} stringPositions
	 * @return {array}
	 * @throws {SyntaxException}
	 */
	function createLiterallyObjects(query, openPos, stringPositions) {
	    const firstRaw = query.substr(0, openPos)
	    const result = [firstRaw.trim()]
	    let pointer = 0

	    stringPositions.forEach((stringPosition) => {
	        if (!stringPosition.end) {
	            throw new SyntaxException('Invalid string ending found.')
	        }

	        if (stringPosition.end < firstRaw.length) {
	            // At least one string exists in first part, create a new object.

	            // Remove the last part, since this wasn't parsed.
	            result.pop()

	            // Add part between pointer and string occurrence.
	            result.push(firstRaw.substr(pointer, stringPosition.start - pointer).trim())

	            // Add the string as object.
	            result.push(new Literally(firstRaw.substr(
	                stringPosition.start + 1,
	                stringPosition.end - stringPosition.start
	            )))

	            result.push(firstRaw.substr(stringPosition.end + 2).trim())

	            pointer = stringPosition.end + 2
	        }
	    })

	    return result
	}

	module.exports = parseParentheses


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	const Method = __webpack_require__(10)
	const Builder = __webpack_require__(1)
	const NonCapture = __webpack_require__(11)
	const SyntaxException = __webpack_require__(2)

	/**
	 * After the query was resolved, it can be built and thus executed.
	 *
	 * @param array $query
	 * @param Builder|null $builder If no Builder is given, the default Builder will be taken.
	 * @return Builder
	 * @throws SyntaxException
	 */
	function buildQuery(query, builder = new Builder()) {
	    for (let i = 0; i < query.length; i++) {
	        const method = query[i]

	        if (Array.isArray(method)) {
	            builder.and(buildQuery(method, new NonCapture()))
	            continue
	        }

	        if (!method instanceof Method) {
	            // At this point, there should only be methods left, since all parameters are already taken care of.
	            // If that's not the case, something didn't work out.
	            throw new SyntaxException(`Unexpected statement: ${method}`)
	        }

	        const parameters = []
	        // If there are parameters, walk through them and apply them if they don't start a new method.
	        while (query[i + 1] && !(query[i + 1] instanceof Method)) {
	            parameters.push(query[i + 1])

	            // Since the parameters will be appended to the method object, they are already parsed and can be
	            // removed from further parsing. Don't use unset to keep keys incrementing.
	            query.splice(i + 1, 1)
	        }

	        try {
	            // Now, append that method to the builder object.
	            method.setParameters(parameters).callMethodOn(builder)
	        } catch (e) {
	            if (Array.isArray(parameters[0])) {
	                method.callMethodOn(builder)
	                builder.and(buildQuery(parameters[0], new NonCapture()))
	            } else {
	                throw new SyntaxException(`Invalid parameter given for ${method.origin}`)
	            }
	        }
	    }

	    return builder
	}

	module.exports = buildQuery


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	const SyntaxException = __webpack_require__(2)
	const ImplementationException = __webpack_require__(4)

	const Literally = __webpack_require__(7)

	class Method {
	    /**
	     * @constructor
	     * @param  {string} origin
	     * @param  {string} methodName
	     * @param  {function} buildQuery
	     */
	    constructor(origin, methodName, buildQuery) {
	        /** @var {string} origin Contains the original method name (case-sensitive). */
	        this.origin = origin
	        /** @var {string} methodName Contains the method name to execute. */
	        this.methodName = methodName

	        /** @var {array} parameters Contains the parsed parameters to pass on execution. */
	        this.parameters = []
	        /** @var {array} executedCallbacks Contains all executed callbacks for that method. Helps finding "lost" groups. */
	        this.executedCallbacks = []

	        /** @var {function} buildQuery Reference to buildQuery since js DON'T support circular dependency well */
	        this.buildQuery = buildQuery
	    }

	    /**
	     * @param  {Builder} builder
	     * @throws {SyntaxException}
	     * @return {Builder|mixed}
	     */
	    callMethodOn(builder) {
	        const methodName = this.methodName
	        const parameters = this.parameters

	        try {
	            builder[methodName].apply(builder, parameters)

	            parameters.forEach((parameter, index) => {
	                if (
	                    typeof parameter === 'function' &&
	                    !this.executedCallbacks.includes(index)
	                ) {
	                    // Callback wasn't executed, but expected to. Assuming parentheses without method, so let's "and" it.
	                    builder.group(parameter)
	                }
	            })
	        } catch (e) {
	            if (e instanceof ImplementationException) {
	                throw new SyntaxException(e.message)
	            } else {
	                throw new SyntaxException(`'${methodName}' does not allow the use of sub-queries.`)
	            }
	        }
	    }

	    /**
	     * Set and parse raw parameters for method.
	     *
	     * @param  {array} params
	     * @throws {SyntaxException}
	     * @return {Method}
	     */
	    setParameters(parameters) {
	        this.parameters = parameters.map((parameter, index) => {
	            if (parameter instanceof Literally) {
	                return parameter.toString()
	            } else if (Array.isArray(parameter)) {
	                // Assuming the user wanted to start a sub-query. This means, we'll create a callback for them.
	                return (builder) => {
	                    this.executedCallbacks.push(index)
	                    this.buildQuery(parameter, builder)
	                }
	            } else {
	                return parameter
	            }
	        })

	        return this
	    }
	}

	module.exports = Method


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	const Builder = __webpack_require__(1)

	class NonCapture extends Builder {
	    constructor() {
	        super()

	        /** @var {string} _group Desired non capture group. */
	        this._group = '(?:%s)'
	    }
	}

	module.exports = NonCapture


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	const buildQuery = __webpack_require__(9)
	const DefaultMethod = __webpack_require__(10)
	const SimpleMethod = __webpack_require__(13)
	const ToMethod = __webpack_require__(14)
	const TimesMethod = __webpack_require__(15)
	const AndMethod = __webpack_require__(16)
	const AsMethod = __webpack_require__(17)

	const SyntaxException = __webpack_require__(2)

	// Unimplemented: all lazy, single line, unicode, first match
	const mapper = {
	    'any character': { 'class': SimpleMethod, 'method': 'anyCharacter' },
	    'no character': { 'class': SimpleMethod, 'method': 'noCharacter' },
	    'multi line': { 'class': SimpleMethod, 'method': 'multiLine' },
	    'case insensitive': { 'class': SimpleMethod, 'method': 'caseInsensitive' },
	    'starts with': { 'class': SimpleMethod, 'method': 'startsWith' },
	    'begin with': { 'class': SimpleMethod, 'method': 'startsWith' },
	    'must end': { 'class': SimpleMethod, 'method': 'mustEnd' },
	    'once or more': { 'class': SimpleMethod, 'method': 'onceOrMore' },
	    'never or more': { 'class': SimpleMethod, 'method': 'neverOrMore' },
	    'new line': { 'class': SimpleMethod, 'method': 'newLine' },
	    'whitespace': { 'class': SimpleMethod, 'method': 'whitespace' },
	    'no whitespace': { 'class': SimpleMethod, 'method': 'noWhitespace' },
	    'anything': { 'class': SimpleMethod, 'method': 'any' },
	    'tab': { 'class': SimpleMethod, 'method': 'atb' },
	    'digit': { 'class': SimpleMethod, 'method': 'digit' },
	    'number': { 'class': SimpleMethod, 'method': 'digit' },
	    'letter': { 'class': SimpleMethod, 'method': 'letter' },
	    'uppercase': { 'class': SimpleMethod, 'method': 'uppercaseLetter' },
	    'once': { 'class': SimpleMethod, 'method': 'once' },
	    'twice': { 'class': SimpleMethod, 'method': 'twice' },

	    'literally': { 'class': DefaultMethod, 'method': 'literally' },
	    'either of': { 'class': DefaultMethod, 'method': 'anyOf' },
	    'any of': { 'class': DefaultMethod, 'method': 'anyOf' },
	    'if followed by': { 'class': DefaultMethod, 'method': 'ifFollowedBy' },
	    'if not followed by': { 'class': DefaultMethod, 'method': 'ifNotFollowedBy' },
	    'optional': { 'class': DefaultMethod, 'method': 'optional' },
	    'until': { 'class': DefaultMethod, 'method': 'until' },
	    'raw': { 'class': DefaultMethod, 'method': 'raw' },
	    'one of': { 'class': DefaultMethod, 'method': 'oneOf' },

	    'digit from': { 'class': ToMethod, 'method': 'digit' },
	    'number from': { 'class': ToMethod, 'method': 'digit' },
	    'letter from': { 'class': ToMethod, 'method': 'letter' },
	    'uppercase letter from': { 'class': ToMethod, 'method': 'uppercaseLetter' },
	    'exactly': { 'class': TimesMethod, 'method': 'exactly' },
	    'at least': { 'class': TimesMethod, 'method': 'atLeast' },
	    'between': { 'class': AndMethod, 'method': 'between' },
	    'capture': { 'class': AsMethod, 'method': 'capture' }
	}

	/**
	 * Match a string part to a method. Please note that the string must start with a method.
	 *
	 * @param {string} part
	 * @throws {SyntaxException} If no method was found, a SyntaxException will be thrown.
	 * @return {method}
	 */
	function methodMatch(part) {
	    let maxMatch = null
	    let maxMatchCount = 0

	    // Go through each mapper and check if the name matches. Then, take the highest match to avoid matching
	    // 'any', if 'any character' was given, and so on.
	    Object.keys(mapper).forEach((key) => {
	        const regex = new RegExp(`^(${key.replace(' ', ') (')})`, 'i')
	        const matches = part.match(regex)

	        const count = matches ? matches.length : 0

	        if (count > maxMatchCount) {
	            maxMatchCount = count
	            maxMatch = key
	        }
	    })

	    if (maxMatch) {
	        // We've got a match. Create the desired object and populate it.
	        const item = mapper[maxMatch]
	        return new item['class'](maxMatch, item.method, buildQuery)
	    }

	    throw new SyntaxException(`Invalid method: ${part}`)
	}

	module.exports = methodMatch


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	const Method = __webpack_require__(10)
	const SyntaxException = __webpack_require__(2)

	/**
	 * Method having no parameters. Will throw SyntaxException if a parameter is provided.
	 */
	class SimpleMethod extends Method {
	    /**
	     * @inheritdoc
	     */
	    setParameters(parameters) {
	        if (parameters.length !== 0) {
	            throw new SyntaxException('Invalid parameters.')
	        }

	        return this
	    }
	}

	module.exports = SimpleMethod


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	const Method = __webpack_require__(10)

	/**
	 * Method having simple parameter(s) ignoring "to".
	 */
	class ToMethod extends Method {
	    /**
	     * @inheritdoc
	     */
	    setParameters(parameters) {
	        parameters = parameters.filter((parameter) => {
	            return typeof parameter !== 'string' || parameter.toLowerCase() !== 'to'
	        })

	        return super.setParameters(parameters)
	    }
	}

	module.exports = ToMethod



/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	const Method = __webpack_require__(10)
	const SyntaxException = __webpack_require__(2)

	/**
	 * Method having one or two parameters. First is simple, ignoring second "time" or "times". Will throw SyntaxException if more parameters provided.
	 */
	class TimeMethod extends Method {
	    /**
	     * @inheritdoc
	     */
	    setParameters(parameters) {
	        parameters = parameters.filter((parameter) => {
	            if (typeof parameter !== 'string') {
	                return true
	            }

	            const lower = parameter.toLowerCase()

	            return lower !== 'times' && lower !== 'time'
	        })

	        if (parameters.length > 1) {
	            throw new SyntaxException('Invalid parameter.')
	        }

	        return super.setParameters(parameters)
	    }
	}

	module.exports = TimeMethod



/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	const Method = __webpack_require__(10)

	/**
	 * Method having simple parameter(s) ignoring "and" and "times".
	 */
	class AndMethod extends Method {
	    /**
	     * @inheritdoc
	     */
	    setParameters(parameters) {
	        parameters = parameters.filter((parameter) => {
	            if (typeof parameter !== 'string') {
	                return true
	            }

	            const lower = parameter.toLowerCase()
	            return lower !== 'and' && lower !== 'times' && lower !== 'time'
	        })

	        return super.setParameters(parameters)
	    }
	}

	module.exports = AndMethod


/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	const Method = __webpack_require__(10)

	/**
	 * Method having simple parameter(s) ignoring "as".
	 */
	class AsMethod extends Method {
	    /**
	     * @inheritdoc
	     */
	    setParameters(parameters) {
	        parameters = parameters.filter((parameter) => {
	            if (typeof parameter !== 'string') {
	                return true
	            }

	            const lower = parameter.toLowerCase()
	            return lower !== 'as'
	        })

	        return super.setParameters(parameters)
	    }
	}

	module.exports = AsMethod


/***/ },
/* 18 */
/***/ function(module, exports) {

	'use strict'

	class Interpreter extends Error {
	}

	module.exports = Interpreter


/***/ }
/******/ ]);