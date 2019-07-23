'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var React__default = _interopDefault(React);
var styled = require('styled-components');
var styled__default = _interopDefault(styled);

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    keys.push.apply(keys, Object.getOwnPropertySymbols(object));
  }

  if (enumerableOnly) keys = keys.filter(function (sym) {
    return Object.getOwnPropertyDescriptor(object, sym).enumerable;
  });
  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(source, true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(source).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _possibleConstructorReturn(self, call) {
  if (call && (typeof call === "object" || typeof call === "function")) {
    return call;
  }

  return _assertThisInitialized(self);
}

function _taggedTemplateLiteral(strings, raw) {
  if (!raw) {
    raw = strings.slice(0);
  }

  return Object.freeze(Object.defineProperties(strings, {
    raw: {
      value: Object.freeze(raw)
    }
  }));
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  }
}

function _iterableToArray(iter) {
  if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance");
}

function areInputsEqual(newInputs, lastInputs) {
  if (newInputs.length !== lastInputs.length) {
    return false;
  }

  for (var i = 0; i < newInputs.length; i++) {
    if (newInputs[i] !== lastInputs[i]) {
      return false;
    }
  }

  return true;
}

function memoizeOne(resultFn, isEqual) {
  if (isEqual === void 0) {
    isEqual = areInputsEqual;
  }

  var lastThis;
  var lastArgs = [];
  var lastResult;
  var calledOnce = false;

  var result = function memoized() {
    for (var _len = arguments.length, newArgs = new Array(_len), _key = 0; _key < _len; _key++) {
      newArgs[_key] = arguments[_key];
    }

    if (calledOnce && lastThis === this && isEqual(newArgs, lastArgs)) {
      return lastResult;
    }

    lastResult = resultFn.apply(this, newArgs);
    calledOnce = true;
    lastThis = this;
    lastArgs = newArgs;
    return lastResult;
  };

  return result;
}

/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
function listCacheClear() {
  this.__data__ = [];
  this.size = 0;
}

var _listCacheClear = listCacheClear;

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || (value !== value && other !== other);
}

var eq_1 = eq;

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq_1(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

var _assocIndexOf = assocIndexOf;

/** Used for built-in method references. */
var arrayProto = Array.prototype;

/** Built-in value references. */
var splice = arrayProto.splice;

/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function listCacheDelete(key) {
  var data = this.__data__,
      index = _assocIndexOf(data, key);

  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  --this.size;
  return true;
}

var _listCacheDelete = listCacheDelete;

/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function listCacheGet(key) {
  var data = this.__data__,
      index = _assocIndexOf(data, key);

  return index < 0 ? undefined : data[index][1];
}

var _listCacheGet = listCacheGet;

/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function listCacheHas(key) {
  return _assocIndexOf(this.__data__, key) > -1;
}

var _listCacheHas = listCacheHas;

/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */
function listCacheSet(key, value) {
  var data = this.__data__,
      index = _assocIndexOf(data, key);

  if (index < 0) {
    ++this.size;
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}

var _listCacheSet = listCacheSet;

/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function ListCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `ListCache`.
ListCache.prototype.clear = _listCacheClear;
ListCache.prototype['delete'] = _listCacheDelete;
ListCache.prototype.get = _listCacheGet;
ListCache.prototype.has = _listCacheHas;
ListCache.prototype.set = _listCacheSet;

var _ListCache = ListCache;

/**
 * Removes all key-value entries from the stack.
 *
 * @private
 * @name clear
 * @memberOf Stack
 */
function stackClear() {
  this.__data__ = new _ListCache;
  this.size = 0;
}

var _stackClear = stackClear;

/**
 * Removes `key` and its value from the stack.
 *
 * @private
 * @name delete
 * @memberOf Stack
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function stackDelete(key) {
  var data = this.__data__,
      result = data['delete'](key);

  this.size = data.size;
  return result;
}

var _stackDelete = stackDelete;

/**
 * Gets the stack value for `key`.
 *
 * @private
 * @name get
 * @memberOf Stack
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function stackGet(key) {
  return this.__data__.get(key);
}

var _stackGet = stackGet;

/**
 * Checks if a stack value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Stack
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function stackHas(key) {
  return this.__data__.has(key);
}

var _stackHas = stackHas;

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;

var _freeGlobal = freeGlobal;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = _freeGlobal || freeSelf || Function('return this')();

var _root = root;

/** Built-in value references. */
var Symbol$1 = _root.Symbol;

var _Symbol = Symbol$1;

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/** Built-in value references. */
var symToStringTag = _Symbol ? _Symbol.toStringTag : undefined;

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag),
      tag = value[symToStringTag];

  try {
    value[symToStringTag] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag] = tag;
    } else {
      delete value[symToStringTag];
    }
  }
  return result;
}

var _getRawTag = getRawTag;

/** Used for built-in method references. */
var objectProto$1 = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString$1 = objectProto$1.toString;

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString(value) {
  return nativeObjectToString$1.call(value);
}

var _objectToString = objectToString;

/** `Object#toString` result references. */
var nullTag = '[object Null]',
    undefinedTag = '[object Undefined]';

/** Built-in value references. */
var symToStringTag$1 = _Symbol ? _Symbol.toStringTag : undefined;

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  return (symToStringTag$1 && symToStringTag$1 in Object(value))
    ? _getRawTag(value)
    : _objectToString(value);
}

var _baseGetTag = baseGetTag;

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return value != null && (type == 'object' || type == 'function');
}

var isObject_1 = isObject;

/** `Object#toString` result references. */
var asyncTag = '[object AsyncFunction]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    proxyTag = '[object Proxy]';

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  if (!isObject_1(value)) {
    return false;
  }
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 9 which returns 'object' for typed arrays and other constructors.
  var tag = _baseGetTag(value);
  return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
}

var isFunction_1 = isFunction;

/** Used to detect overreaching core-js shims. */
var coreJsData = _root['__core-js_shared__'];

var _coreJsData = coreJsData;

/** Used to detect methods masquerading as native. */
var maskSrcKey = (function() {
  var uid = /[^.]+$/.exec(_coreJsData && _coreJsData.keys && _coreJsData.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && (maskSrcKey in func);
}

var _isMasked = isMasked;

/** Used for built-in method references. */
var funcProto = Function.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to convert.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

var _toSource = toSource;

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Used for built-in method references. */
var funcProto$1 = Function.prototype,
    objectProto$2 = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString$1 = funcProto$1.toString;

/** Used to check objects for own properties. */
var hasOwnProperty$1 = objectProto$2.hasOwnProperty;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  funcToString$1.call(hasOwnProperty$1).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!isObject_1(value) || _isMasked(value)) {
    return false;
  }
  var pattern = isFunction_1(value) ? reIsNative : reIsHostCtor;
  return pattern.test(_toSource(value));
}

var _baseIsNative = baseIsNative;

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
  return object == null ? undefined : object[key];
}

var _getValue = getValue;

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = _getValue(object, key);
  return _baseIsNative(value) ? value : undefined;
}

var _getNative = getNative;

/* Built-in method references that are verified to be native. */
var Map = _getNative(_root, 'Map');

var _Map = Map;

/* Built-in method references that are verified to be native. */
var nativeCreate = _getNative(Object, 'create');

var _nativeCreate = nativeCreate;

/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
function hashClear() {
  this.__data__ = _nativeCreate ? _nativeCreate(null) : {};
  this.size = 0;
}

var _hashClear = hashClear;

/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function hashDelete(key) {
  var result = this.has(key) && delete this.__data__[key];
  this.size -= result ? 1 : 0;
  return result;
}

var _hashDelete = hashDelete;

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/** Used for built-in method references. */
var objectProto$3 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$2 = objectProto$3.hasOwnProperty;

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet(key) {
  var data = this.__data__;
  if (_nativeCreate) {
    var result = data[key];
    return result === HASH_UNDEFINED ? undefined : result;
  }
  return hasOwnProperty$2.call(data, key) ? data[key] : undefined;
}

var _hashGet = hashGet;

/** Used for built-in method references. */
var objectProto$4 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$3 = objectProto$4.hasOwnProperty;

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas(key) {
  var data = this.__data__;
  return _nativeCreate ? (data[key] !== undefined) : hasOwnProperty$3.call(data, key);
}

var _hashHas = hashHas;

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED$1 = '__lodash_hash_undefined__';

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */
function hashSet(key, value) {
  var data = this.__data__;
  this.size += this.has(key) ? 0 : 1;
  data[key] = (_nativeCreate && value === undefined) ? HASH_UNDEFINED$1 : value;
  return this;
}

var _hashSet = hashSet;

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Hash(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `Hash`.
Hash.prototype.clear = _hashClear;
Hash.prototype['delete'] = _hashDelete;
Hash.prototype.get = _hashGet;
Hash.prototype.has = _hashHas;
Hash.prototype.set = _hashSet;

var _Hash = Hash;

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear() {
  this.size = 0;
  this.__data__ = {
    'hash': new _Hash,
    'map': new (_Map || _ListCache),
    'string': new _Hash
  };
}

var _mapCacheClear = mapCacheClear;

/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable(value) {
  var type = typeof value;
  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
    ? (value !== '__proto__')
    : (value === null);
}

var _isKeyable = isKeyable;

/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
function getMapData(map, key) {
  var data = map.__data__;
  return _isKeyable(key)
    ? data[typeof key == 'string' ? 'string' : 'hash']
    : data.map;
}

var _getMapData = getMapData;

/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function mapCacheDelete(key) {
  var result = _getMapData(this, key)['delete'](key);
  this.size -= result ? 1 : 0;
  return result;
}

var _mapCacheDelete = mapCacheDelete;

/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function mapCacheGet(key) {
  return _getMapData(this, key).get(key);
}

var _mapCacheGet = mapCacheGet;

/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function mapCacheHas(key) {
  return _getMapData(this, key).has(key);
}

var _mapCacheHas = mapCacheHas;

/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
function mapCacheSet(key, value) {
  var data = _getMapData(this, key),
      size = data.size;

  data.set(key, value);
  this.size += data.size == size ? 0 : 1;
  return this;
}

var _mapCacheSet = mapCacheSet;

/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function MapCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `MapCache`.
MapCache.prototype.clear = _mapCacheClear;
MapCache.prototype['delete'] = _mapCacheDelete;
MapCache.prototype.get = _mapCacheGet;
MapCache.prototype.has = _mapCacheHas;
MapCache.prototype.set = _mapCacheSet;

var _MapCache = MapCache;

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

/**
 * Sets the stack `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Stack
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the stack cache instance.
 */
function stackSet(key, value) {
  var data = this.__data__;
  if (data instanceof _ListCache) {
    var pairs = data.__data__;
    if (!_Map || (pairs.length < LARGE_ARRAY_SIZE - 1)) {
      pairs.push([key, value]);
      this.size = ++data.size;
      return this;
    }
    data = this.__data__ = new _MapCache(pairs);
  }
  data.set(key, value);
  this.size = data.size;
  return this;
}

var _stackSet = stackSet;

/**
 * Creates a stack cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Stack(entries) {
  var data = this.__data__ = new _ListCache(entries);
  this.size = data.size;
}

// Add methods to `Stack`.
Stack.prototype.clear = _stackClear;
Stack.prototype['delete'] = _stackDelete;
Stack.prototype.get = _stackGet;
Stack.prototype.has = _stackHas;
Stack.prototype.set = _stackSet;

var _Stack = Stack;

var defineProperty = (function() {
  try {
    var func = _getNative(Object, 'defineProperty');
    func({}, '', {});
    return func;
  } catch (e) {}
}());

var _defineProperty$1 = defineProperty;

/**
 * The base implementation of `assignValue` and `assignMergeValue` without
 * value checks.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function baseAssignValue(object, key, value) {
  if (key == '__proto__' && _defineProperty$1) {
    _defineProperty$1(object, key, {
      'configurable': true,
      'enumerable': true,
      'value': value,
      'writable': true
    });
  } else {
    object[key] = value;
  }
}

var _baseAssignValue = baseAssignValue;

/**
 * This function is like `assignValue` except that it doesn't assign
 * `undefined` values.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function assignMergeValue(object, key, value) {
  if ((value !== undefined && !eq_1(object[key], value)) ||
      (value === undefined && !(key in object))) {
    _baseAssignValue(object, key, value);
  }
}

var _assignMergeValue = assignMergeValue;

/**
 * Creates a base function for methods like `_.forIn` and `_.forOwn`.
 *
 * @private
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Function} Returns the new base function.
 */
function createBaseFor(fromRight) {
  return function(object, iteratee, keysFunc) {
    var index = -1,
        iterable = Object(object),
        props = keysFunc(object),
        length = props.length;

    while (length--) {
      var key = props[fromRight ? length : ++index];
      if (iteratee(iterable[key], key, iterable) === false) {
        break;
      }
    }
    return object;
  };
}

var _createBaseFor = createBaseFor;

/**
 * The base implementation of `baseForOwn` which iterates over `object`
 * properties returned by `keysFunc` and invokes `iteratee` for each property.
 * Iteratee functions may exit iteration early by explicitly returning `false`.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @returns {Object} Returns `object`.
 */
var baseFor = _createBaseFor();

var _baseFor = baseFor;

var _cloneBuffer = createCommonjsModule(function (module, exports) {
/** Detect free variable `exports`. */
var freeExports =  exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && 'object' == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Built-in value references. */
var Buffer = moduleExports ? _root.Buffer : undefined,
    allocUnsafe = Buffer ? Buffer.allocUnsafe : undefined;

/**
 * Creates a clone of  `buffer`.
 *
 * @private
 * @param {Buffer} buffer The buffer to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Buffer} Returns the cloned buffer.
 */
function cloneBuffer(buffer, isDeep) {
  if (isDeep) {
    return buffer.slice();
  }
  var length = buffer.length,
      result = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);

  buffer.copy(result);
  return result;
}

module.exports = cloneBuffer;
});

/** Built-in value references. */
var Uint8Array$1 = _root.Uint8Array;

var _Uint8Array = Uint8Array$1;

/**
 * Creates a clone of `arrayBuffer`.
 *
 * @private
 * @param {ArrayBuffer} arrayBuffer The array buffer to clone.
 * @returns {ArrayBuffer} Returns the cloned array buffer.
 */
function cloneArrayBuffer(arrayBuffer) {
  var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
  new _Uint8Array(result).set(new _Uint8Array(arrayBuffer));
  return result;
}

var _cloneArrayBuffer = cloneArrayBuffer;

/**
 * Creates a clone of `typedArray`.
 *
 * @private
 * @param {Object} typedArray The typed array to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned typed array.
 */
function cloneTypedArray(typedArray, isDeep) {
  var buffer = isDeep ? _cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
  return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
}

var _cloneTypedArray = cloneTypedArray;

/**
 * Copies the values of `source` to `array`.
 *
 * @private
 * @param {Array} source The array to copy values from.
 * @param {Array} [array=[]] The array to copy values to.
 * @returns {Array} Returns `array`.
 */
function copyArray(source, array) {
  var index = -1,
      length = source.length;

  array || (array = Array(length));
  while (++index < length) {
    array[index] = source[index];
  }
  return array;
}

var _copyArray = copyArray;

/** Built-in value references. */
var objectCreate = Object.create;

/**
 * The base implementation of `_.create` without support for assigning
 * properties to the created object.
 *
 * @private
 * @param {Object} proto The object to inherit from.
 * @returns {Object} Returns the new object.
 */
var baseCreate = (function() {
  function object() {}
  return function(proto) {
    if (!isObject_1(proto)) {
      return {};
    }
    if (objectCreate) {
      return objectCreate(proto);
    }
    object.prototype = proto;
    var result = new object;
    object.prototype = undefined;
    return result;
  };
}());

var _baseCreate = baseCreate;

/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}

var _overArg = overArg;

/** Built-in value references. */
var getPrototype = _overArg(Object.getPrototypeOf, Object);

var _getPrototype = getPrototype;

/** Used for built-in method references. */
var objectProto$5 = Object.prototype;

/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */
function isPrototype(value) {
  var Ctor = value && value.constructor,
      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto$5;

  return value === proto;
}

var _isPrototype = isPrototype;

/**
 * Initializes an object clone.
 *
 * @private
 * @param {Object} object The object to clone.
 * @returns {Object} Returns the initialized clone.
 */
function initCloneObject(object) {
  return (typeof object.constructor == 'function' && !_isPrototype(object))
    ? _baseCreate(_getPrototype(object))
    : {};
}

var _initCloneObject = initCloneObject;

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return value != null && typeof value == 'object';
}

var isObjectLike_1 = isObjectLike;

/** `Object#toString` result references. */
var argsTag = '[object Arguments]';

/**
 * The base implementation of `_.isArguments`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 */
function baseIsArguments(value) {
  return isObjectLike_1(value) && _baseGetTag(value) == argsTag;
}

var _baseIsArguments = baseIsArguments;

/** Used for built-in method references. */
var objectProto$6 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$4 = objectProto$6.hasOwnProperty;

/** Built-in value references. */
var propertyIsEnumerable = objectProto$6.propertyIsEnumerable;

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
var isArguments = _baseIsArguments(function() { return arguments; }()) ? _baseIsArguments : function(value) {
  return isObjectLike_1(value) && hasOwnProperty$4.call(value, 'callee') &&
    !propertyIsEnumerable.call(value, 'callee');
};

var isArguments_1 = isArguments;

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

var isArray_1 = isArray;

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
  return typeof value == 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

var isLength_1 = isLength;

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike(value) {
  return value != null && isLength_1(value.length) && !isFunction_1(value);
}

var isArrayLike_1 = isArrayLike;

/**
 * This method is like `_.isArrayLike` except that it also checks if `value`
 * is an object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array-like object,
 *  else `false`.
 * @example
 *
 * _.isArrayLikeObject([1, 2, 3]);
 * // => true
 *
 * _.isArrayLikeObject(document.body.children);
 * // => true
 *
 * _.isArrayLikeObject('abc');
 * // => false
 *
 * _.isArrayLikeObject(_.noop);
 * // => false
 */
function isArrayLikeObject(value) {
  return isObjectLike_1(value) && isArrayLike_1(value);
}

var isArrayLikeObject_1 = isArrayLikeObject;

/**
 * This method returns `false`.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {boolean} Returns `false`.
 * @example
 *
 * _.times(2, _.stubFalse);
 * // => [false, false]
 */
function stubFalse() {
  return false;
}

var stubFalse_1 = stubFalse;

var isBuffer_1 = createCommonjsModule(function (module, exports) {
/** Detect free variable `exports`. */
var freeExports =  exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && 'object' == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Built-in value references. */
var Buffer = moduleExports ? _root.Buffer : undefined;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined;

/**
 * Checks if `value` is a buffer.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
 * @example
 *
 * _.isBuffer(new Buffer(2));
 * // => true
 *
 * _.isBuffer(new Uint8Array(2));
 * // => false
 */
var isBuffer = nativeIsBuffer || stubFalse_1;

module.exports = isBuffer;
});

/** `Object#toString` result references. */
var objectTag = '[object Object]';

/** Used for built-in method references. */
var funcProto$2 = Function.prototype,
    objectProto$7 = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString$2 = funcProto$2.toString;

/** Used to check objects for own properties. */
var hasOwnProperty$5 = objectProto$7.hasOwnProperty;

/** Used to infer the `Object` constructor. */
var objectCtorString = funcToString$2.call(Object);

/**
 * Checks if `value` is a plain object, that is, an object created by the
 * `Object` constructor or one with a `[[Prototype]]` of `null`.
 *
 * @static
 * @memberOf _
 * @since 0.8.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 * }
 *
 * _.isPlainObject(new Foo);
 * // => false
 *
 * _.isPlainObject([1, 2, 3]);
 * // => false
 *
 * _.isPlainObject({ 'x': 0, 'y': 0 });
 * // => true
 *
 * _.isPlainObject(Object.create(null));
 * // => true
 */
function isPlainObject(value) {
  if (!isObjectLike_1(value) || _baseGetTag(value) != objectTag) {
    return false;
  }
  var proto = _getPrototype(value);
  if (proto === null) {
    return true;
  }
  var Ctor = hasOwnProperty$5.call(proto, 'constructor') && proto.constructor;
  return typeof Ctor == 'function' && Ctor instanceof Ctor &&
    funcToString$2.call(Ctor) == objectCtorString;
}

var isPlainObject_1 = isPlainObject;

/** `Object#toString` result references. */
var argsTag$1 = '[object Arguments]',
    arrayTag = '[object Array]',
    boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    funcTag$1 = '[object Function]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    objectTag$1 = '[object Object]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    weakMapTag = '[object WeakMap]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/** Used to identify `toStringTag` values of typed arrays. */
var typedArrayTags = {};
typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
typedArrayTags[uint32Tag] = true;
typedArrayTags[argsTag$1] = typedArrayTags[arrayTag] =
typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
typedArrayTags[dataViewTag] = typedArrayTags[dateTag] =
typedArrayTags[errorTag] = typedArrayTags[funcTag$1] =
typedArrayTags[mapTag] = typedArrayTags[numberTag] =
typedArrayTags[objectTag$1] = typedArrayTags[regexpTag] =
typedArrayTags[setTag] = typedArrayTags[stringTag] =
typedArrayTags[weakMapTag] = false;

/**
 * The base implementation of `_.isTypedArray` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 */
function baseIsTypedArray(value) {
  return isObjectLike_1(value) &&
    isLength_1(value.length) && !!typedArrayTags[_baseGetTag(value)];
}

var _baseIsTypedArray = baseIsTypedArray;

/**
 * The base implementation of `_.unary` without support for storing metadata.
 *
 * @private
 * @param {Function} func The function to cap arguments for.
 * @returns {Function} Returns the new capped function.
 */
function baseUnary(func) {
  return function(value) {
    return func(value);
  };
}

var _baseUnary = baseUnary;

var _nodeUtil = createCommonjsModule(function (module, exports) {
/** Detect free variable `exports`. */
var freeExports =  exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && 'object' == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Detect free variable `process` from Node.js. */
var freeProcess = moduleExports && _freeGlobal.process;

/** Used to access faster Node.js helpers. */
var nodeUtil = (function() {
  try {
    // Use `util.types` for Node.js 10+.
    var types = freeModule && freeModule.require && freeModule.require('util').types;

    if (types) {
      return types;
    }

    // Legacy `process.binding('util')` for Node.js < 10.
    return freeProcess && freeProcess.binding && freeProcess.binding('util');
  } catch (e) {}
}());

module.exports = nodeUtil;
});

/* Node.js helper references. */
var nodeIsTypedArray = _nodeUtil && _nodeUtil.isTypedArray;

/**
 * Checks if `value` is classified as a typed array.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 * @example
 *
 * _.isTypedArray(new Uint8Array);
 * // => true
 *
 * _.isTypedArray([]);
 * // => false
 */
var isTypedArray = nodeIsTypedArray ? _baseUnary(nodeIsTypedArray) : _baseIsTypedArray;

var isTypedArray_1 = isTypedArray;

/**
 * Gets the value at `key`, unless `key` is "__proto__" or "constructor".
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function safeGet(object, key) {
  if (key === 'constructor' && typeof object[key] === 'function') {
    return;
  }

  if (key == '__proto__') {
    return;
  }

  return object[key];
}

var _safeGet = safeGet;

/** Used for built-in method references. */
var objectProto$8 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$6 = objectProto$8.hasOwnProperty;

/**
 * Assigns `value` to `key` of `object` if the existing value is not equivalent
 * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function assignValue(object, key, value) {
  var objValue = object[key];
  if (!(hasOwnProperty$6.call(object, key) && eq_1(objValue, value)) ||
      (value === undefined && !(key in object))) {
    _baseAssignValue(object, key, value);
  }
}

var _assignValue = assignValue;

/**
 * Copies properties of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy properties from.
 * @param {Array} props The property identifiers to copy.
 * @param {Object} [object={}] The object to copy properties to.
 * @param {Function} [customizer] The function to customize copied values.
 * @returns {Object} Returns `object`.
 */
function copyObject(source, props, object, customizer) {
  var isNew = !object;
  object || (object = {});

  var index = -1,
      length = props.length;

  while (++index < length) {
    var key = props[index];

    var newValue = customizer
      ? customizer(object[key], source[key], key, object, source)
      : undefined;

    if (newValue === undefined) {
      newValue = source[key];
    }
    if (isNew) {
      _baseAssignValue(object, key, newValue);
    } else {
      _assignValue(object, key, newValue);
    }
  }
  return object;
}

var _copyObject = copyObject;

/**
 * The base implementation of `_.times` without support for iteratee shorthands
 * or max array length checks.
 *
 * @private
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 */
function baseTimes(n, iteratee) {
  var index = -1,
      result = Array(n);

  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}

var _baseTimes = baseTimes;

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER$1 = 9007199254740991;

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  var type = typeof value;
  length = length == null ? MAX_SAFE_INTEGER$1 : length;

  return !!length &&
    (type == 'number' ||
      (type != 'symbol' && reIsUint.test(value))) &&
        (value > -1 && value % 1 == 0 && value < length);
}

var _isIndex = isIndex;

/** Used for built-in method references. */
var objectProto$9 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$7 = objectProto$9.hasOwnProperty;

/**
 * Creates an array of the enumerable property names of the array-like `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @param {boolean} inherited Specify returning inherited property names.
 * @returns {Array} Returns the array of property names.
 */
function arrayLikeKeys(value, inherited) {
  var isArr = isArray_1(value),
      isArg = !isArr && isArguments_1(value),
      isBuff = !isArr && !isArg && isBuffer_1(value),
      isType = !isArr && !isArg && !isBuff && isTypedArray_1(value),
      skipIndexes = isArr || isArg || isBuff || isType,
      result = skipIndexes ? _baseTimes(value.length, String) : [],
      length = result.length;

  for (var key in value) {
    if ((inherited || hasOwnProperty$7.call(value, key)) &&
        !(skipIndexes && (
           // Safari 9 has enumerable `arguments.length` in strict mode.
           key == 'length' ||
           // Node.js 0.10 has enumerable non-index properties on buffers.
           (isBuff && (key == 'offset' || key == 'parent')) ||
           // PhantomJS 2 has enumerable non-index properties on typed arrays.
           (isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset')) ||
           // Skip index properties.
           _isIndex(key, length)
        ))) {
      result.push(key);
    }
  }
  return result;
}

var _arrayLikeKeys = arrayLikeKeys;

/**
 * This function is like
 * [`Object.keys`](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * except that it includes inherited enumerable properties.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function nativeKeysIn(object) {
  var result = [];
  if (object != null) {
    for (var key in Object(object)) {
      result.push(key);
    }
  }
  return result;
}

var _nativeKeysIn = nativeKeysIn;

/** Used for built-in method references. */
var objectProto$a = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$8 = objectProto$a.hasOwnProperty;

/**
 * The base implementation of `_.keysIn` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeysIn(object) {
  if (!isObject_1(object)) {
    return _nativeKeysIn(object);
  }
  var isProto = _isPrototype(object),
      result = [];

  for (var key in object) {
    if (!(key == 'constructor' && (isProto || !hasOwnProperty$8.call(object, key)))) {
      result.push(key);
    }
  }
  return result;
}

var _baseKeysIn = baseKeysIn;

/**
 * Creates an array of the own and inherited enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keysIn(new Foo);
 * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
 */
function keysIn(object) {
  return isArrayLike_1(object) ? _arrayLikeKeys(object, true) : _baseKeysIn(object);
}

var keysIn_1 = keysIn;

/**
 * Converts `value` to a plain object flattening inherited enumerable string
 * keyed properties of `value` to own properties of the plain object.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {Object} Returns the converted plain object.
 * @example
 *
 * function Foo() {
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.assign({ 'a': 1 }, new Foo);
 * // => { 'a': 1, 'b': 2 }
 *
 * _.assign({ 'a': 1 }, _.toPlainObject(new Foo));
 * // => { 'a': 1, 'b': 2, 'c': 3 }
 */
function toPlainObject(value) {
  return _copyObject(value, keysIn_1(value));
}

var toPlainObject_1 = toPlainObject;

/**
 * A specialized version of `baseMerge` for arrays and objects which performs
 * deep merges and tracks traversed objects enabling objects with circular
 * references to be merged.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @param {string} key The key of the value to merge.
 * @param {number} srcIndex The index of `source`.
 * @param {Function} mergeFunc The function to merge values.
 * @param {Function} [customizer] The function to customize assigned values.
 * @param {Object} [stack] Tracks traversed source values and their merged
 *  counterparts.
 */
function baseMergeDeep(object, source, key, srcIndex, mergeFunc, customizer, stack) {
  var objValue = _safeGet(object, key),
      srcValue = _safeGet(source, key),
      stacked = stack.get(srcValue);

  if (stacked) {
    _assignMergeValue(object, key, stacked);
    return;
  }
  var newValue = customizer
    ? customizer(objValue, srcValue, (key + ''), object, source, stack)
    : undefined;

  var isCommon = newValue === undefined;

  if (isCommon) {
    var isArr = isArray_1(srcValue),
        isBuff = !isArr && isBuffer_1(srcValue),
        isTyped = !isArr && !isBuff && isTypedArray_1(srcValue);

    newValue = srcValue;
    if (isArr || isBuff || isTyped) {
      if (isArray_1(objValue)) {
        newValue = objValue;
      }
      else if (isArrayLikeObject_1(objValue)) {
        newValue = _copyArray(objValue);
      }
      else if (isBuff) {
        isCommon = false;
        newValue = _cloneBuffer(srcValue, true);
      }
      else if (isTyped) {
        isCommon = false;
        newValue = _cloneTypedArray(srcValue, true);
      }
      else {
        newValue = [];
      }
    }
    else if (isPlainObject_1(srcValue) || isArguments_1(srcValue)) {
      newValue = objValue;
      if (isArguments_1(objValue)) {
        newValue = toPlainObject_1(objValue);
      }
      else if (!isObject_1(objValue) || isFunction_1(objValue)) {
        newValue = _initCloneObject(srcValue);
      }
    }
    else {
      isCommon = false;
    }
  }
  if (isCommon) {
    // Recursively merge objects and arrays (susceptible to call stack limits).
    stack.set(srcValue, newValue);
    mergeFunc(newValue, srcValue, srcIndex, customizer, stack);
    stack['delete'](srcValue);
  }
  _assignMergeValue(object, key, newValue);
}

var _baseMergeDeep = baseMergeDeep;

/**
 * The base implementation of `_.merge` without support for multiple sources.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @param {number} srcIndex The index of `source`.
 * @param {Function} [customizer] The function to customize merged values.
 * @param {Object} [stack] Tracks traversed source values and their merged
 *  counterparts.
 */
function baseMerge(object, source, srcIndex, customizer, stack) {
  if (object === source) {
    return;
  }
  _baseFor(source, function(srcValue, key) {
    stack || (stack = new _Stack);
    if (isObject_1(srcValue)) {
      _baseMergeDeep(object, source, key, srcIndex, baseMerge, customizer, stack);
    }
    else {
      var newValue = customizer
        ? customizer(_safeGet(object, key), srcValue, (key + ''), object, source, stack)
        : undefined;

      if (newValue === undefined) {
        newValue = srcValue;
      }
      _assignMergeValue(object, key, newValue);
    }
  }, keysIn_1);
}

var _baseMerge = baseMerge;

/**
 * This method returns the first argument it receives.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Util
 * @param {*} value Any value.
 * @returns {*} Returns `value`.
 * @example
 *
 * var object = { 'a': 1 };
 *
 * console.log(_.identity(object) === object);
 * // => true
 */
function identity(value) {
  return value;
}

var identity_1 = identity;

/**
 * A faster alternative to `Function#apply`, this function invokes `func`
 * with the `this` binding of `thisArg` and the arguments of `args`.
 *
 * @private
 * @param {Function} func The function to invoke.
 * @param {*} thisArg The `this` binding of `func`.
 * @param {Array} args The arguments to invoke `func` with.
 * @returns {*} Returns the result of `func`.
 */
function apply(func, thisArg, args) {
  switch (args.length) {
    case 0: return func.call(thisArg);
    case 1: return func.call(thisArg, args[0]);
    case 2: return func.call(thisArg, args[0], args[1]);
    case 3: return func.call(thisArg, args[0], args[1], args[2]);
  }
  return func.apply(thisArg, args);
}

var _apply = apply;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max;

/**
 * A specialized version of `baseRest` which transforms the rest array.
 *
 * @private
 * @param {Function} func The function to apply a rest parameter to.
 * @param {number} [start=func.length-1] The start position of the rest parameter.
 * @param {Function} transform The rest array transform.
 * @returns {Function} Returns the new function.
 */
function overRest(func, start, transform) {
  start = nativeMax(start === undefined ? (func.length - 1) : start, 0);
  return function() {
    var args = arguments,
        index = -1,
        length = nativeMax(args.length - start, 0),
        array = Array(length);

    while (++index < length) {
      array[index] = args[start + index];
    }
    index = -1;
    var otherArgs = Array(start + 1);
    while (++index < start) {
      otherArgs[index] = args[index];
    }
    otherArgs[start] = transform(array);
    return _apply(func, this, otherArgs);
  };
}

var _overRest = overRest;

/**
 * Creates a function that returns `value`.
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Util
 * @param {*} value The value to return from the new function.
 * @returns {Function} Returns the new constant function.
 * @example
 *
 * var objects = _.times(2, _.constant({ 'a': 1 }));
 *
 * console.log(objects);
 * // => [{ 'a': 1 }, { 'a': 1 }]
 *
 * console.log(objects[0] === objects[1]);
 * // => true
 */
function constant(value) {
  return function() {
    return value;
  };
}

var constant_1 = constant;

/**
 * The base implementation of `setToString` without support for hot loop shorting.
 *
 * @private
 * @param {Function} func The function to modify.
 * @param {Function} string The `toString` result.
 * @returns {Function} Returns `func`.
 */
var baseSetToString = !_defineProperty$1 ? identity_1 : function(func, string) {
  return _defineProperty$1(func, 'toString', {
    'configurable': true,
    'enumerable': false,
    'value': constant_1(string),
    'writable': true
  });
};

var _baseSetToString = baseSetToString;

/** Used to detect hot functions by number of calls within a span of milliseconds. */
var HOT_COUNT = 800,
    HOT_SPAN = 16;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeNow = Date.now;

/**
 * Creates a function that'll short out and invoke `identity` instead
 * of `func` when it's called `HOT_COUNT` or more times in `HOT_SPAN`
 * milliseconds.
 *
 * @private
 * @param {Function} func The function to restrict.
 * @returns {Function} Returns the new shortable function.
 */
function shortOut(func) {
  var count = 0,
      lastCalled = 0;

  return function() {
    var stamp = nativeNow(),
        remaining = HOT_SPAN - (stamp - lastCalled);

    lastCalled = stamp;
    if (remaining > 0) {
      if (++count >= HOT_COUNT) {
        return arguments[0];
      }
    } else {
      count = 0;
    }
    return func.apply(undefined, arguments);
  };
}

var _shortOut = shortOut;

/**
 * Sets the `toString` method of `func` to return `string`.
 *
 * @private
 * @param {Function} func The function to modify.
 * @param {Function} string The `toString` result.
 * @returns {Function} Returns `func`.
 */
var setToString = _shortOut(_baseSetToString);

var _setToString = setToString;

/**
 * The base implementation of `_.rest` which doesn't validate or coerce arguments.
 *
 * @private
 * @param {Function} func The function to apply a rest parameter to.
 * @param {number} [start=func.length-1] The start position of the rest parameter.
 * @returns {Function} Returns the new function.
 */
function baseRest(func, start) {
  return _setToString(_overRest(func, start, identity_1), func + '');
}

var _baseRest = baseRest;

/**
 * Checks if the given arguments are from an iteratee call.
 *
 * @private
 * @param {*} value The potential iteratee value argument.
 * @param {*} index The potential iteratee index or key argument.
 * @param {*} object The potential iteratee object argument.
 * @returns {boolean} Returns `true` if the arguments are from an iteratee call,
 *  else `false`.
 */
function isIterateeCall(value, index, object) {
  if (!isObject_1(object)) {
    return false;
  }
  var type = typeof index;
  if (type == 'number'
        ? (isArrayLike_1(object) && _isIndex(index, object.length))
        : (type == 'string' && index in object)
      ) {
    return eq_1(object[index], value);
  }
  return false;
}

var _isIterateeCall = isIterateeCall;

/**
 * Creates a function like `_.assign`.
 *
 * @private
 * @param {Function} assigner The function to assign values.
 * @returns {Function} Returns the new assigner function.
 */
function createAssigner(assigner) {
  return _baseRest(function(object, sources) {
    var index = -1,
        length = sources.length,
        customizer = length > 1 ? sources[length - 1] : undefined,
        guard = length > 2 ? sources[2] : undefined;

    customizer = (assigner.length > 3 && typeof customizer == 'function')
      ? (length--, customizer)
      : undefined;

    if (guard && _isIterateeCall(sources[0], sources[1], guard)) {
      customizer = length < 3 ? undefined : customizer;
      length = 1;
    }
    object = Object(object);
    while (++index < length) {
      var source = sources[index];
      if (source) {
        assigner(object, source, index, customizer);
      }
    }
    return object;
  });
}

var _createAssigner = createAssigner;

/**
 * This method is like `_.assign` except that it recursively merges own and
 * inherited enumerable string keyed properties of source objects into the
 * destination object. Source properties that resolve to `undefined` are
 * skipped if a destination value exists. Array and plain object properties
 * are merged recursively. Other objects and value types are overridden by
 * assignment. Source objects are applied from left to right. Subsequent
 * sources overwrite property assignments of previous sources.
 *
 * **Note:** This method mutates `object`.
 *
 * @static
 * @memberOf _
 * @since 0.5.0
 * @category Object
 * @param {Object} object The destination object.
 * @param {...Object} [sources] The source objects.
 * @returns {Object} Returns `object`.
 * @example
 *
 * var object = {
 *   'a': [{ 'b': 2 }, { 'd': 4 }]
 * };
 *
 * var other = {
 *   'a': [{ 'c': 3 }, { 'e': 5 }]
 * };
 *
 * _.merge(object, other);
 * // => { 'a': [{ 'b': 2, 'c': 3 }, { 'd': 4, 'e': 5 }] }
 */
var merge = _createAssigner(function(object, source, srcIndex) {
  _baseMerge(object, source, srcIndex);
});

var merge_1 = merge;

/*
object-assign
(c) Sindre Sorhus
@license MIT
*/
/* eslint-disable no-unused-vars */
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty$9 = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

function shouldUseNative() {
	try {
		if (!Object.assign) {
			return false;
		}

		// Detect buggy property enumeration order in older V8 versions.

		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
		var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
		test1[5] = 'de';
		if (Object.getOwnPropertyNames(test1)[0] === '5') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test2 = {};
		for (var i = 0; i < 10; i++) {
			test2['_' + String.fromCharCode(i)] = i;
		}
		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
			return test2[n];
		});
		if (order2.join('') !== '0123456789') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test3 = {};
		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
			test3[letter] = letter;
		});
		if (Object.keys(Object.assign({}, test3)).join('') !==
				'abcdefghijklmnopqrst') {
			return false;
		}

		return true;
	} catch (err) {
		// We don't expect any of the above to throw, but better to be safe.
		return false;
	}
}

var objectAssign = shouldUseNative() ? Object.assign : function (target, source) {
	var from;
	var to = toObject(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments[s]);

		for (var key in from) {
			if (hasOwnProperty$9.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (getOwnPropertySymbols) {
			symbols = getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var ReactPropTypesSecret = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';

var ReactPropTypesSecret_1 = ReactPropTypesSecret;

var printWarning = function() {};

if (process.env.NODE_ENV !== 'production') {
  var ReactPropTypesSecret$1 = ReactPropTypesSecret_1;
  var loggedTypeFailures = {};

  printWarning = function(text) {
    var message = 'Warning: ' + text;
    if (typeof console !== 'undefined') {
      console.error(message);
    }
    try {
      // --- Welcome to debugging React ---
      // This error was thrown as a convenience so that you can use this stack
      // to find the callsite that caused this warning to fire.
      throw new Error(message);
    } catch (x) {}
  };
}

/**
 * Assert that the values match with the type specs.
 * Error messages are memorized and will only be shown once.
 *
 * @param {object} typeSpecs Map of name to a ReactPropType
 * @param {object} values Runtime values that need to be type-checked
 * @param {string} location e.g. "prop", "context", "child context"
 * @param {string} componentName Name of the component for error messages.
 * @param {?Function} getStack Returns the component stack.
 * @private
 */
function checkPropTypes(typeSpecs, values, location, componentName, getStack) {
  if (process.env.NODE_ENV !== 'production') {
    for (var typeSpecName in typeSpecs) {
      if (typeSpecs.hasOwnProperty(typeSpecName)) {
        var error;
        // Prop type validation may throw. In case they do, we don't want to
        // fail the render phase where it didn't fail before. So we log it.
        // After these have been cleaned up, we'll let them throw.
        try {
          // This is intentionally an invariant that gets caught. It's the same
          // behavior as without this statement except with a better message.
          if (typeof typeSpecs[typeSpecName] !== 'function') {
            var err = Error(
              (componentName || 'React class') + ': ' + location + ' type `' + typeSpecName + '` is invalid; ' +
              'it must be a function, usually from the `prop-types` package, but received `' + typeof typeSpecs[typeSpecName] + '`.'
            );
            err.name = 'Invariant Violation';
            throw err;
          }
          error = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, ReactPropTypesSecret$1);
        } catch (ex) {
          error = ex;
        }
        if (error && !(error instanceof Error)) {
          printWarning(
            (componentName || 'React class') + ': type specification of ' +
            location + ' `' + typeSpecName + '` is invalid; the type checker ' +
            'function must return `null` or an `Error` but returned a ' + typeof error + '. ' +
            'You may have forgotten to pass an argument to the type checker ' +
            'creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and ' +
            'shape all require an argument).'
          );

        }
        if (error instanceof Error && !(error.message in loggedTypeFailures)) {
          // Only monitor this failure once because there tends to be a lot of the
          // same error.
          loggedTypeFailures[error.message] = true;

          var stack = getStack ? getStack() : '';

          printWarning(
            'Failed ' + location + ' type: ' + error.message + (stack != null ? stack : '')
          );
        }
      }
    }
  }
}

var checkPropTypes_1 = checkPropTypes;

var printWarning$1 = function() {};

if (process.env.NODE_ENV !== 'production') {
  printWarning$1 = function(text) {
    var message = 'Warning: ' + text;
    if (typeof console !== 'undefined') {
      console.error(message);
    }
    try {
      // --- Welcome to debugging React ---
      // This error was thrown as a convenience so that you can use this stack
      // to find the callsite that caused this warning to fire.
      throw new Error(message);
    } catch (x) {}
  };
}

function emptyFunctionThatReturnsNull() {
  return null;
}

var factoryWithTypeCheckers = function(isValidElement, throwOnDirectAccess) {
  /* global Symbol */
  var ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator;
  var FAUX_ITERATOR_SYMBOL = '@@iterator'; // Before Symbol spec.

  /**
   * Returns the iterator method function contained on the iterable object.
   *
   * Be sure to invoke the function with the iterable as context:
   *
   *     var iteratorFn = getIteratorFn(myIterable);
   *     if (iteratorFn) {
   *       var iterator = iteratorFn.call(myIterable);
   *       ...
   *     }
   *
   * @param {?object} maybeIterable
   * @return {?function}
   */
  function getIteratorFn(maybeIterable) {
    var iteratorFn = maybeIterable && (ITERATOR_SYMBOL && maybeIterable[ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL]);
    if (typeof iteratorFn === 'function') {
      return iteratorFn;
    }
  }

  /**
   * Collection of methods that allow declaration and validation of props that are
   * supplied to React components. Example usage:
   *
   *   var Props = require('ReactPropTypes');
   *   var MyArticle = React.createClass({
   *     propTypes: {
   *       // An optional string prop named "description".
   *       description: Props.string,
   *
   *       // A required enum prop named "category".
   *       category: Props.oneOf(['News','Photos']).isRequired,
   *
   *       // A prop named "dialog" that requires an instance of Dialog.
   *       dialog: Props.instanceOf(Dialog).isRequired
   *     },
   *     render: function() { ... }
   *   });
   *
   * A more formal specification of how these methods are used:
   *
   *   type := array|bool|func|object|number|string|oneOf([...])|instanceOf(...)
   *   decl := ReactPropTypes.{type}(.isRequired)?
   *
   * Each and every declaration produces a function with the same signature. This
   * allows the creation of custom validation functions. For example:
   *
   *  var MyLink = React.createClass({
   *    propTypes: {
   *      // An optional string or URI prop named "href".
   *      href: function(props, propName, componentName) {
   *        var propValue = props[propName];
   *        if (propValue != null && typeof propValue !== 'string' &&
   *            !(propValue instanceof URI)) {
   *          return new Error(
   *            'Expected a string or an URI for ' + propName + ' in ' +
   *            componentName
   *          );
   *        }
   *      }
   *    },
   *    render: function() {...}
   *  });
   *
   * @internal
   */

  var ANONYMOUS = '<<anonymous>>';

  // Important!
  // Keep this list in sync with production version in `./factoryWithThrowingShims.js`.
  var ReactPropTypes = {
    array: createPrimitiveTypeChecker('array'),
    bool: createPrimitiveTypeChecker('boolean'),
    func: createPrimitiveTypeChecker('function'),
    number: createPrimitiveTypeChecker('number'),
    object: createPrimitiveTypeChecker('object'),
    string: createPrimitiveTypeChecker('string'),
    symbol: createPrimitiveTypeChecker('symbol'),

    any: createAnyTypeChecker(),
    arrayOf: createArrayOfTypeChecker,
    element: createElementTypeChecker(),
    instanceOf: createInstanceTypeChecker,
    node: createNodeChecker(),
    objectOf: createObjectOfTypeChecker,
    oneOf: createEnumTypeChecker,
    oneOfType: createUnionTypeChecker,
    shape: createShapeTypeChecker,
    exact: createStrictShapeTypeChecker,
  };

  /**
   * inlined Object.is polyfill to avoid requiring consumers ship their own
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
   */
  /*eslint-disable no-self-compare*/
  function is(x, y) {
    // SameValue algorithm
    if (x === y) {
      // Steps 1-5, 7-10
      // Steps 6.b-6.e: +0 != -0
      return x !== 0 || 1 / x === 1 / y;
    } else {
      // Step 6.a: NaN == NaN
      return x !== x && y !== y;
    }
  }
  /*eslint-enable no-self-compare*/

  /**
   * We use an Error-like object for backward compatibility as people may call
   * PropTypes directly and inspect their output. However, we don't use real
   * Errors anymore. We don't inspect their stack anyway, and creating them
   * is prohibitively expensive if they are created too often, such as what
   * happens in oneOfType() for any type before the one that matched.
   */
  function PropTypeError(message) {
    this.message = message;
    this.stack = '';
  }
  // Make `instanceof Error` still work for returned errors.
  PropTypeError.prototype = Error.prototype;

  function createChainableTypeChecker(validate) {
    if (process.env.NODE_ENV !== 'production') {
      var manualPropTypeCallCache = {};
      var manualPropTypeWarningCount = 0;
    }
    function checkType(isRequired, props, propName, componentName, location, propFullName, secret) {
      componentName = componentName || ANONYMOUS;
      propFullName = propFullName || propName;

      if (secret !== ReactPropTypesSecret_1) {
        if (throwOnDirectAccess) {
          // New behavior only for users of `prop-types` package
          var err = new Error(
            'Calling PropTypes validators directly is not supported by the `prop-types` package. ' +
            'Use `PropTypes.checkPropTypes()` to call them. ' +
            'Read more at http://fb.me/use-check-prop-types'
          );
          err.name = 'Invariant Violation';
          throw err;
        } else if (process.env.NODE_ENV !== 'production' && typeof console !== 'undefined') {
          // Old behavior for people using React.PropTypes
          var cacheKey = componentName + ':' + propName;
          if (
            !manualPropTypeCallCache[cacheKey] &&
            // Avoid spamming the console because they are often not actionable except for lib authors
            manualPropTypeWarningCount < 3
          ) {
            printWarning$1(
              'You are manually calling a React.PropTypes validation ' +
              'function for the `' + propFullName + '` prop on `' + componentName  + '`. This is deprecated ' +
              'and will throw in the standalone `prop-types` package. ' +
              'You may be seeing this warning due to a third-party PropTypes ' +
              'library. See https://fb.me/react-warning-dont-call-proptypes ' + 'for details.'
            );
            manualPropTypeCallCache[cacheKey] = true;
            manualPropTypeWarningCount++;
          }
        }
      }
      if (props[propName] == null) {
        if (isRequired) {
          if (props[propName] === null) {
            return new PropTypeError('The ' + location + ' `' + propFullName + '` is marked as required ' + ('in `' + componentName + '`, but its value is `null`.'));
          }
          return new PropTypeError('The ' + location + ' `' + propFullName + '` is marked as required in ' + ('`' + componentName + '`, but its value is `undefined`.'));
        }
        return null;
      } else {
        return validate(props, propName, componentName, location, propFullName);
      }
    }

    var chainedCheckType = checkType.bind(null, false);
    chainedCheckType.isRequired = checkType.bind(null, true);

    return chainedCheckType;
  }

  function createPrimitiveTypeChecker(expectedType) {
    function validate(props, propName, componentName, location, propFullName, secret) {
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== expectedType) {
        // `propValue` being instance of, say, date/regexp, pass the 'object'
        // check, but we can offer a more precise error message here rather than
        // 'of type `object`'.
        var preciseType = getPreciseType(propValue);

        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + preciseType + '` supplied to `' + componentName + '`, expected ') + ('`' + expectedType + '`.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createAnyTypeChecker() {
    return createChainableTypeChecker(emptyFunctionThatReturnsNull);
  }

  function createArrayOfTypeChecker(typeChecker) {
    function validate(props, propName, componentName, location, propFullName) {
      if (typeof typeChecker !== 'function') {
        return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside arrayOf.');
      }
      var propValue = props[propName];
      if (!Array.isArray(propValue)) {
        var propType = getPropType(propValue);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an array.'));
      }
      for (var i = 0; i < propValue.length; i++) {
        var error = typeChecker(propValue, i, componentName, location, propFullName + '[' + i + ']', ReactPropTypesSecret_1);
        if (error instanceof Error) {
          return error;
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createElementTypeChecker() {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      if (!isValidElement(propValue)) {
        var propType = getPropType(propValue);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected a single ReactElement.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createInstanceTypeChecker(expectedClass) {
    function validate(props, propName, componentName, location, propFullName) {
      if (!(props[propName] instanceof expectedClass)) {
        var expectedClassName = expectedClass.name || ANONYMOUS;
        var actualClassName = getClassName(props[propName]);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + actualClassName + '` supplied to `' + componentName + '`, expected ') + ('instance of `' + expectedClassName + '`.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createEnumTypeChecker(expectedValues) {
    if (!Array.isArray(expectedValues)) {
      process.env.NODE_ENV !== 'production' ? printWarning$1('Invalid argument supplied to oneOf, expected an instance of array.') : void 0;
      return emptyFunctionThatReturnsNull;
    }

    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      for (var i = 0; i < expectedValues.length; i++) {
        if (is(propValue, expectedValues[i])) {
          return null;
        }
      }

      var valuesString = JSON.stringify(expectedValues);
      return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of value `' + propValue + '` ' + ('supplied to `' + componentName + '`, expected one of ' + valuesString + '.'));
    }
    return createChainableTypeChecker(validate);
  }

  function createObjectOfTypeChecker(typeChecker) {
    function validate(props, propName, componentName, location, propFullName) {
      if (typeof typeChecker !== 'function') {
        return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside objectOf.');
      }
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== 'object') {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an object.'));
      }
      for (var key in propValue) {
        if (propValue.hasOwnProperty(key)) {
          var error = typeChecker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret_1);
          if (error instanceof Error) {
            return error;
          }
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createUnionTypeChecker(arrayOfTypeCheckers) {
    if (!Array.isArray(arrayOfTypeCheckers)) {
      process.env.NODE_ENV !== 'production' ? printWarning$1('Invalid argument supplied to oneOfType, expected an instance of array.') : void 0;
      return emptyFunctionThatReturnsNull;
    }

    for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
      var checker = arrayOfTypeCheckers[i];
      if (typeof checker !== 'function') {
        printWarning$1(
          'Invalid argument supplied to oneOfType. Expected an array of check functions, but ' +
          'received ' + getPostfixForTypeWarning(checker) + ' at index ' + i + '.'
        );
        return emptyFunctionThatReturnsNull;
      }
    }

    function validate(props, propName, componentName, location, propFullName) {
      for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
        var checker = arrayOfTypeCheckers[i];
        if (checker(props, propName, componentName, location, propFullName, ReactPropTypesSecret_1) == null) {
          return null;
        }
      }

      return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`.'));
    }
    return createChainableTypeChecker(validate);
  }

  function createNodeChecker() {
    function validate(props, propName, componentName, location, propFullName) {
      if (!isNode(props[propName])) {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`, expected a ReactNode.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createShapeTypeChecker(shapeTypes) {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== 'object') {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type `' + propType + '` ' + ('supplied to `' + componentName + '`, expected `object`.'));
      }
      for (var key in shapeTypes) {
        var checker = shapeTypes[key];
        if (!checker) {
          continue;
        }
        var error = checker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret_1);
        if (error) {
          return error;
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createStrictShapeTypeChecker(shapeTypes) {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== 'object') {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type `' + propType + '` ' + ('supplied to `' + componentName + '`, expected `object`.'));
      }
      // We need to check all keys in case some are required but missing from
      // props.
      var allKeys = objectAssign({}, props[propName], shapeTypes);
      for (var key in allKeys) {
        var checker = shapeTypes[key];
        if (!checker) {
          return new PropTypeError(
            'Invalid ' + location + ' `' + propFullName + '` key `' + key + '` supplied to `' + componentName + '`.' +
            '\nBad object: ' + JSON.stringify(props[propName], null, '  ') +
            '\nValid keys: ' +  JSON.stringify(Object.keys(shapeTypes), null, '  ')
          );
        }
        var error = checker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret_1);
        if (error) {
          return error;
        }
      }
      return null;
    }

    return createChainableTypeChecker(validate);
  }

  function isNode(propValue) {
    switch (typeof propValue) {
      case 'number':
      case 'string':
      case 'undefined':
        return true;
      case 'boolean':
        return !propValue;
      case 'object':
        if (Array.isArray(propValue)) {
          return propValue.every(isNode);
        }
        if (propValue === null || isValidElement(propValue)) {
          return true;
        }

        var iteratorFn = getIteratorFn(propValue);
        if (iteratorFn) {
          var iterator = iteratorFn.call(propValue);
          var step;
          if (iteratorFn !== propValue.entries) {
            while (!(step = iterator.next()).done) {
              if (!isNode(step.value)) {
                return false;
              }
            }
          } else {
            // Iterator will provide entry [k,v] tuples rather than values.
            while (!(step = iterator.next()).done) {
              var entry = step.value;
              if (entry) {
                if (!isNode(entry[1])) {
                  return false;
                }
              }
            }
          }
        } else {
          return false;
        }

        return true;
      default:
        return false;
    }
  }

  function isSymbol(propType, propValue) {
    // Native Symbol.
    if (propType === 'symbol') {
      return true;
    }

    // 19.4.3.5 Symbol.prototype[@@toStringTag] === 'Symbol'
    if (propValue['@@toStringTag'] === 'Symbol') {
      return true;
    }

    // Fallback for non-spec compliant Symbols which are polyfilled.
    if (typeof Symbol === 'function' && propValue instanceof Symbol) {
      return true;
    }

    return false;
  }

  // Equivalent of `typeof` but with special handling for array and regexp.
  function getPropType(propValue) {
    var propType = typeof propValue;
    if (Array.isArray(propValue)) {
      return 'array';
    }
    if (propValue instanceof RegExp) {
      // Old webkits (at least until Android 4.0) return 'function' rather than
      // 'object' for typeof a RegExp. We'll normalize this here so that /bla/
      // passes PropTypes.object.
      return 'object';
    }
    if (isSymbol(propType, propValue)) {
      return 'symbol';
    }
    return propType;
  }

  // This handles more types than `getPropType`. Only used for error messages.
  // See `createPrimitiveTypeChecker`.
  function getPreciseType(propValue) {
    if (typeof propValue === 'undefined' || propValue === null) {
      return '' + propValue;
    }
    var propType = getPropType(propValue);
    if (propType === 'object') {
      if (propValue instanceof Date) {
        return 'date';
      } else if (propValue instanceof RegExp) {
        return 'regexp';
      }
    }
    return propType;
  }

  // Returns a string that is postfixed to a warning about an invalid type.
  // For example, "undefined" or "of type array"
  function getPostfixForTypeWarning(value) {
    var type = getPreciseType(value);
    switch (type) {
      case 'array':
      case 'object':
        return 'an ' + type;
      case 'boolean':
      case 'date':
      case 'regexp':
        return 'a ' + type;
      default:
        return type;
    }
  }

  // Returns class name of the object, if any.
  function getClassName(propValue) {
    if (!propValue.constructor || !propValue.constructor.name) {
      return ANONYMOUS;
    }
    return propValue.constructor.name;
  }

  ReactPropTypes.checkPropTypes = checkPropTypes_1;
  ReactPropTypes.PropTypes = ReactPropTypes;

  return ReactPropTypes;
};

function emptyFunction() {}

var factoryWithThrowingShims = function() {
  function shim(props, propName, componentName, location, propFullName, secret) {
    if (secret === ReactPropTypesSecret_1) {
      // It is still safe when called from React.
      return;
    }
    var err = new Error(
      'Calling PropTypes validators directly is not supported by the `prop-types` package. ' +
      'Use PropTypes.checkPropTypes() to call them. ' +
      'Read more at http://fb.me/use-check-prop-types'
    );
    err.name = 'Invariant Violation';
    throw err;
  }  shim.isRequired = shim;
  function getShim() {
    return shim;
  }  // Important!
  // Keep this list in sync with production version in `./factoryWithTypeCheckers.js`.
  var ReactPropTypes = {
    array: shim,
    bool: shim,
    func: shim,
    number: shim,
    object: shim,
    string: shim,
    symbol: shim,

    any: shim,
    arrayOf: getShim,
    element: shim,
    instanceOf: getShim,
    node: shim,
    objectOf: getShim,
    oneOf: getShim,
    oneOfType: getShim,
    shape: getShim,
    exact: getShim
  };

  ReactPropTypes.checkPropTypes = emptyFunction;
  ReactPropTypes.PropTypes = ReactPropTypes;

  return ReactPropTypes;
};

var propTypes = createCommonjsModule(function (module) {
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

if (process.env.NODE_ENV !== 'production') {
  var REACT_ELEMENT_TYPE = (typeof Symbol === 'function' &&
    Symbol.for &&
    Symbol.for('react.element')) ||
    0xeac7;

  var isValidElement = function(object) {
    return typeof object === 'object' &&
      object !== null &&
      object.$$typeof === REACT_ELEMENT_TYPE;
  };

  // By explicitly using `prop-types` you are opting into new development behavior.
  // http://fb.me/prop-types-in-prod
  var throwOnDirectAccess = true;
  module.exports = factoryWithTypeCheckers(isValidElement, throwOnDirectAccess);
} else {
  // By explicitly using `prop-types` you are opting into new production behavior.
  // http://fb.me/prop-types-in-prod
  module.exports = factoryWithThrowingShims();
}
});

var FirstPageIcon = (function () {
  return React__default.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: "24",
    height: "24",
    viewBox: "0 0 24 24"
  }, React__default.createElement("path", {
    d: "M18.41 16.59L13.82 12l4.59-4.59L17 6l-6 6 6 6zM6 6h2v12H6z"
  }), React__default.createElement("path", {
    fill: "none",
    d: "M24 24H0V0h24v24z"
  }));
});

var LastPageIcon = (function () {
  return React__default.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: "24",
    height: "24",
    viewBox: "0 0 24 24"
  }, React__default.createElement("path", {
    d: "M5.59 7.41L10.18 12l-4.59 4.59L7 18l6-6-6-6zM16 6h2v12h-2z"
  }), React__default.createElement("path", {
    fill: "none",
    d: "M0 0h24v24H0V0z"
  }));
});

var LeftIcon = (function () {
  return React__default.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: "24",
    height: "24",
    viewBox: "0 0 24 24"
  }, React__default.createElement("path", {
    d: "M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"
  }), React__default.createElement("path", {
    d: "M0 0h24v24H0z",
    fill: "none"
  }));
});

var RightIcon = (function () {
  return React__default.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: "24",
    height: "24",
    viewBox: "0 0 24 24"
  }, React__default.createElement("path", {
    d: "M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"
  }), React__default.createElement("path", {
    d: "M0 0h24v24H0z",
    fill: "none"
  }));
});

var ExpanderCollapsedIcon = (function () {
  return React__default.createElement("svg", {
    fill: "currentColor",
    height: "24",
    viewBox: "0 0 24 24",
    width: "24",
    xmlns: "http://www.w3.org/2000/svg"
  }, React__default.createElement("path", {
    d: "M8.59 16.34l4.58-4.59-4.58-4.59L10 5.75l6 6-6 6z"
  }), React__default.createElement("path", {
    d: "M0-.25h24v24H0z",
    fill: "none"
  }));
});

var ExpanderExpandedIcon = (function () {
  return React__default.createElement("svg", {
    fill: "currentColor",
    height: "24",
    viewBox: "0 0 24 24",
    width: "24",
    xmlns: "http://www.w3.org/2000/svg"
  }, React__default.createElement("path", {
    d: "M7.41 7.84L12 12.42l4.59-4.58L18 9.25l-6 6-6-6z"
  }), React__default.createElement("path", {
    d: "M0-.75h24v24H0z",
    fill: "none"
  }));
});

var propTypes$1 = {
  title: propTypes.oneOfType([propTypes.string, propTypes.node]),
  selectableRows: propTypes.bool,
  expandableRows: propTypes.bool,
  expandableDisabledField: propTypes.string,
  defaultExpandedField: propTypes.string,
  keyField: propTypes.string,
  progressPending: propTypes.bool,
  progressComponent: propTypes.oneOfType([propTypes.string, propTypes.node, propTypes.func]),
  progressCentered: propTypes.bool,
  expandableRowsComponent: propTypes.oneOfType([propTypes.arrayOf(propTypes.node), propTypes.node, propTypes.func]),
  expandableIcon: propTypes.shape({
    collapsed: propTypes.oneOfType([propTypes.string, propTypes.node, propTypes.func]),
    expanded: propTypes.oneOfType([propTypes.string, propTypes.node, propTypes.func])
  }),
  selectableRowsComponent: propTypes.oneOfType([propTypes.string, propTypes.node, propTypes.func]),
  selectableRowsComponentProps: propTypes.object,
  customTheme: propTypes.object,
  sortIcon: propTypes.oneOfType([propTypes.bool, propTypes.object]),
  sortFunction: propTypes.func,
  onSort: propTypes.func,
  striped: propTypes.bool,
  highlightOnHover: propTypes.bool,
  pointerOnHover: propTypes.bool,
  actions: propTypes.oneOfType([propTypes.arrayOf(propTypes.node), propTypes.node]),
  contextTitle: propTypes.string,
  contextActions: propTypes.oneOfType([propTypes.arrayOf(propTypes.node), propTypes.node]),
  onTableUpdate: propTypes.func,
  clearSelectedRows: propTypes.bool,
  defaultSortField: propTypes.string,
  defaultSortAsc: propTypes.bool,
  columns: propTypes.array,
  data: propTypes.array,
  className: propTypes.string,
  style: propTypes.object,
  responsive: propTypes.bool,
  overflowY: propTypes.bool,
  overflowYOffset: propTypes.string,
  noDataComponent: propTypes.oneOfType([propTypes.string, propTypes.node, propTypes.func]),
  disabled: propTypes.bool,
  noHeader: propTypes.bool,
  subHeader: propTypes.bool,
  subHeaderAlign: propTypes.string,
  subHeaderWrap: propTypes.bool,
  subHeaderComponent: propTypes.oneOfType([propTypes.arrayOf(propTypes.node), propTypes.node, propTypes.string]),
  onRowClicked: propTypes.func,
  fixedHeader: propTypes.bool,
  fixedHeaderScrollHeight: propTypes.string,
  pagination: propTypes.bool,
  paginationServer: propTypes.bool,
  paginationDefaultPage: propTypes.number,
  paginationTotalRows: propTypes.number,
  paginationPerPage: propTypes.number,
  paginationRowsPerPageOptions: propTypes.array,
  onChangePage: propTypes.func,
  onChangeRowsPerPage: propTypes.func,
  paginationComponent: propTypes.oneOfType([propTypes.arrayOf(propTypes.node), propTypes.node, propTypes.func]),
  paginationComponentOptions: propTypes.object
};
var defaultProps = {
  title: '',
  keyField: 'id',
  selectableRows: false,
  expandableRows: false,
  expandableDisabledField: '',
  defaultExpandedField: '',
  progressPending: false,
  progressComponent: React__default.createElement("h2", null, "Loading..."),
  progressCentered: false,
  expandableRowsComponent: React__default.createElement("div", null, "Add a custom expander component. Use props.data for row data"),
  expandableIcon: {
    collapsed: React__default.createElement(ExpanderCollapsedIcon, null),
    expanded: React__default.createElement(ExpanderExpandedIcon, null)
  },
  selectableRowsComponent: 'input',
  selectableRowsComponentProps: {},
  customTheme: {},
  sortIcon: false,
  sortFunction: null,
  onSort: null,
  striped: false,
  highlightOnHover: false,
  pointerOnHover: false,
  contextTitle: '',
  contextActions: [],
  onTableUpdate: null,
  clearSelectedRows: false,
  defaultSortField: null,
  defaultSortAsc: true,
  columns: [],
  data: [],
  className: null,
  style: {},
  responsive: true,
  overflowY: false,
  overflowYOffset: '250px',
  noDataComponent: 'There are no records to display',
  disabled: false,
  noHeader: false,
  subHeader: false,
  subHeaderAlign: 'right',
  subHeaderWrap: true,
  subHeaderComponent: [],
  onRowClicked: null,
  fixedHeader: false,
  fixedHeaderScrollHeight: '100vh',
  pagination: false,
  paginationServer: false,
  paginationDefaultPage: 1,
  paginationTotalRows: 0,
  paginationPerPage: 10,
  paginationRowsPerPageOptions: [10, 15, 20, 25, 30],
  onChangePage: null,
  onChangeRowsPerPage: null,
  paginationComponent: null,
  paginationComponentOptions: {
    rowsPerPageText: 'Rows per page:',
    rangeSeparatorText: 'of'
  },
  paginationIconFirstPage: React__default.createElement(FirstPageIcon, null),
  paginationIconLastPage: React__default.createElement(LastPageIcon, null),
  paginationIconNext: React__default.createElement(RightIcon, null),
  paginationIconPrevious: React__default.createElement(LeftIcon, null)
};

var keyField = defaultProps.keyField,
    selectableRowsComponent = defaultProps.selectableRowsComponent,
    selectableRowsComponentProps = defaultProps.selectableRowsComponentProps,
    expandableIcon = defaultProps.expandableIcon,
    paginationTotalRows = defaultProps.paginationTotalRows,
    paginationRowsPerPageOptions = defaultProps.paginationRowsPerPageOptions,
    paginationIconLastPage = defaultProps.paginationIconLastPage,
    paginationIconFirstPage = defaultProps.paginationIconFirstPage,
    paginationIconNext = defaultProps.paginationIconNext,
    paginationIconPrevious = defaultProps.paginationIconPrevious,
    paginationComponentOptions = defaultProps.paginationComponentOptions,
    contextTitle = defaultProps.contextTitle,
    contextActions = defaultProps.contextActions;
var defaultState = {
  selectedRows: [],
  indeterminate: false,
  keyField: keyField,
  selectableRowsComponent: selectableRowsComponent,
  selectableRowsComponentProps: selectableRowsComponentProps,
  expandableIcon: expandableIcon,
  paginationTotalRows: paginationTotalRows,
  paginationRowsPerPageOptions: paginationRowsPerPageOptions,
  paginationIconLastPage: paginationIconLastPage,
  paginationIconFirstPage: paginationIconFirstPage,
  paginationIconNext: paginationIconNext,
  paginationIconPrevious: paginationIconPrevious,
  paginationComponentOptions: paginationComponentOptions,
  contextTitle: contextTitle,
  contextActions: contextActions
};
var DataTableContext = React.createContext(defaultState);
var DataTableProvider =
/*#__PURE__*/
function (_PureComponent) {
  _inherits(DataTableProvider, _PureComponent);

  function DataTableProvider() {
    _classCallCheck(this, DataTableProvider);

    return _possibleConstructorReturn(this, _getPrototypeOf(DataTableProvider).apply(this, arguments));
  }

  _createClass(DataTableProvider, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          children = _this$props.children,
          initialState = _this$props.initialState;
      return React__default.createElement(DataTableContext.Provider, {
        value: initialState
      }, children);
    }
  }]);

  return DataTableProvider;
}(React.PureComponent);

_defineProperty(DataTableProvider, "propTypes", {
  initialState: propTypes.object.isRequired,
  children: propTypes.oneOfType([propTypes.arrayOf(propTypes.node), propTypes.node]).isRequired
});

var DataTableConsumer = DataTableContext.Consumer;

function _templateObject2() {
  var data = _taggedTemplateLiteral(["\n  display: flex;\n  flex-direction: column;\n  width: 100%;\n  height: 100%;\n  max-width: 100%;\n  ", ";\n"]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n  pointer-events: none;\n  opacity: 0.4;\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}
var disabled = styled.css(_templateObject());
var TableStyle = styled__default.div(_templateObject2(), function (props) {
  return props.disabled && disabled;
});

function _templateObject$1() {
  var data = _taggedTemplateLiteral(["\n  display: flex;\n  text-align: left;\n  background-color: ", ";\n"]);

  _templateObject$1 = function _templateObject() {
    return data;
  };

  return data;
}
var TableHead = styled__default.div(_templateObject$1(), function (props) {
  return props.theme.header.backgroundColor;
});

function _templateObject$2() {
  var data = _taggedTemplateLiteral(["\n  display: flex;\n  flex: 1 1 auto;\n  justify-content: flex-end;\n  align-items: center;\n  min-height: 56px;\n  padding-right: 8px;\n  padding-left: 8px;\n  width: 100%;\n  background-color: ", ";\n  border-top: 1px solid ", ";\n"]);

  _templateObject$2 = function _templateObject() {
    return data;
  };

  return data;
}
var TableFooter = styled__default.footer(_templateObject$2(), function (props) {
  return props.theme.pagination.backgroundColor;
}, function (props) {
  return props.theme.rows.borderColor;
});

function _templateObject$3() {
  var data = _taggedTemplateLiteral(["\n  display: flex;\n  width: 100%;\n"]);

  _templateObject$3 = function _templateObject() {
    return data;
  };

  return data;
}
var TableHeadRow = styled__default.div(_templateObject$3());

function _templateObject4() {
  var data = _taggedTemplateLiteral(["\n    @media screen and (max-width: ", "px) {\n      ", "\n    }\n  "]);

  _templateObject4 = function _templateObject4() {
    return data;
  };

  return data;
}

function _templateObject3() {
  var data = _taggedTemplateLiteral(["\n    @media screen and (max-width: 1280px) {\n      ", "\n    }\n  "]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2$1() {
  var data = _taggedTemplateLiteral(["\n    @media screen and (max-width: 959px) {\n      ", "\n    }\n  "]);

  _templateObject2$1 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject$4() {
  var data = _taggedTemplateLiteral(["\n    @media screen and (max-width: 599px) {\n      ", "\n    }\n  "]);

  _templateObject$4 = function _templateObject() {
    return data;
  };

  return data;
}
var media = {
  sm: function sm() {
    return styled.css(_templateObject$4(), styled.css.apply(void 0, arguments));
  },
  md: function md() {
    return styled.css(_templateObject2$1(), styled.css.apply(void 0, arguments));
  },
  lg: function lg() {
    return styled.css(_templateObject3(), styled.css.apply(void 0, arguments));
  },
  custom: function custom(value) {
    return function () {
      return styled.css(_templateObject4(), value, styled.css.apply(void 0, arguments));
    };
  }
};

function _templateObject9() {
  var data = _taggedTemplateLiteral(["\n    display: none;\n  "]);

  _templateObject9 = function _templateObject9() {
    return data;
  };

  return data;
}

function _templateObject8() {
  var data = _taggedTemplateLiteral(["\n    display: none;\n  "]);

  _templateObject8 = function _templateObject8() {
    return data;
  };

  return data;
}

function _templateObject7() {
  var data = _taggedTemplateLiteral(["\n    display: none;\n  "]);

  _templateObject7 = function _templateObject7() {
    return data;
  };

  return data;
}

function _templateObject6() {
  var data = _taggedTemplateLiteral(["\n    display: none;\n  "]);

  _templateObject6 = function _templateObject6() {
    return data;
  };

  return data;
}

function _templateObject5() {
  var data = _taggedTemplateLiteral(["\n    min-width: ", ";\n    max-width: ", ";\n  "]);

  _templateObject5 = function _templateObject5() {
    return data;
  };

  return data;
}

function _templateObject4$1() {
  var data = _taggedTemplateLiteral(["\n  flex-grow: ", ";\n  flex-shrink: 0;\n  flex-basis: 0;\n  max-width: ", ";\n  min-width: ", ";\n  ", ";\n  ", ";\n  ", ";\n  ", ";\n\n  &:first-child {\n    padding-left: calc(", " / 2);\n  }\n\n  /* calculate left/right edge paddings */\n  ", ";\n\n  /* handle hiding cells */\n  ", ";\n  ", ";\n  ", ";\n  ", ";\n"]);

  _templateObject4$1 = function _templateObject4() {
    return data;
  };

  return data;
}

function _templateObject3$1() {
  var data = _taggedTemplateLiteral(["\n  position: relative;\n  display: flex;\n  align-items: center;\n  box-sizing: border-box;\n  line-height: normal;\n  padding-left: calc(", " / 6);\n  padding-right: calc(", " / 6);\n  padding-top: calc(", " / 12);\n  padding-bottom: calc(", " / 12);\n"]);

  _templateObject3$1 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2$2() {
  var data = _taggedTemplateLiteral(["\n  &:last-child {\n    padding-right: calc(", " / 2);\n  }\n"]);

  _templateObject2$2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject$5() {
  var data = _taggedTemplateLiteral(["\n  &:not(:last-child) {\n    padding-right: calc(", " / 2);\n  }\n"]);

  _templateObject$5 = function _templateObject() {
    return data;
  };

  return data;
}
var lastCellPaddingWhenButton = styled.css(_templateObject$5(), function (props) {
  return props.theme.cells.cellPadding;
});
var lastCellPadding = styled.css(_templateObject2$2(), function (props) {
  return props.theme.cells.cellPadding;
});
var CellBase = styled__default.div(_templateObject3$1(), function (props) {
  return props.theme.cells.cellPadding;
}, function (props) {
  return props.theme.cells.cellPadding;
}, function (props) {
  return props.theme.cells.cellPadding;
}, function (props) {
  return props.theme.cells.cellPadding;
}); // Flex calculations

var Cell = styled__default(CellBase)(_templateObject4$1(), function (props) {
  return props.column.grow === 0 || props.column.button ? 0 : props.column.grow || 1;
}, function (props) {
  return props.column.maxWidth || '100%';
}, function (props) {
  return props.column.minWidth || '100px';
}, function (props) {
  return props.column.width && styled.css(_templateObject5(), props.column.width, props.column.width);
}, function (props) {
  return props.column.right && 'justify-content: flex-end';
}, function (props) {
  return (props.column.center || props.column.button) && 'justify-content: center';
}, function (props) {
  return props.column.compact && "padding: calc(".concat(props.theme.cells.cellPadding, " / 12)");
}, function (props) {
  return props.theme.cells.cellPadding;
}, function (props) {
  return props.column.button ? lastCellPaddingWhenButton : lastCellPadding;
}, function (props) {
  return props.column.hide && props.column.hide === 'sm' && media.sm(_templateObject6());
}, function (props) {
  return props.column.hide && props.column.hide === 'md' && media.md(_templateObject7());
}, function (props) {
  return props.column.hide && props.column.hide === 'lg' && media.lg(_templateObject8());
}, function (props) {
  return props.column.hide && Number.isInteger(props.column.hide) && media.custom(props.column.hide)(_templateObject9());
});

// Found this seed-based random generator somewhere
// Based on The Central Randomizer 1.3 (C) 1997 by Paul Houle (houle@msc.cornell.edu)

var seed = 1;

/**
 * return a random number based on a seed
 * @param seed
 * @returns {number}
 */
function getNextValue() {
    seed = (seed * 9301 + 49297) % 233280;
    return seed/(233280.0);
}

function setSeed(_seed_) {
    seed = _seed_;
}

var randomFromSeed = {
    nextValue: getNextValue,
    seed: setSeed
};

var ORIGINAL = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_-';
var alphabet;
var previousSeed;

var shuffled;

function reset() {
    shuffled = false;
}

function setCharacters(_alphabet_) {
    if (!_alphabet_) {
        if (alphabet !== ORIGINAL) {
            alphabet = ORIGINAL;
            reset();
        }
        return;
    }

    if (_alphabet_ === alphabet) {
        return;
    }

    if (_alphabet_.length !== ORIGINAL.length) {
        throw new Error('Custom alphabet for shortid must be ' + ORIGINAL.length + ' unique characters. You submitted ' + _alphabet_.length + ' characters: ' + _alphabet_);
    }

    var unique = _alphabet_.split('').filter(function(item, ind, arr){
       return ind !== arr.lastIndexOf(item);
    });

    if (unique.length) {
        throw new Error('Custom alphabet for shortid must be ' + ORIGINAL.length + ' unique characters. These characters were not unique: ' + unique.join(', '));
    }

    alphabet = _alphabet_;
    reset();
}

function characters(_alphabet_) {
    setCharacters(_alphabet_);
    return alphabet;
}

function setSeed$1(seed) {
    randomFromSeed.seed(seed);
    if (previousSeed !== seed) {
        reset();
        previousSeed = seed;
    }
}

function shuffle() {
    if (!alphabet) {
        setCharacters(ORIGINAL);
    }

    var sourceArray = alphabet.split('');
    var targetArray = [];
    var r = randomFromSeed.nextValue();
    var characterIndex;

    while (sourceArray.length > 0) {
        r = randomFromSeed.nextValue();
        characterIndex = Math.floor(r * sourceArray.length);
        targetArray.push(sourceArray.splice(characterIndex, 1)[0]);
    }
    return targetArray.join('');
}

function getShuffled() {
    if (shuffled) {
        return shuffled;
    }
    shuffled = shuffle();
    return shuffled;
}

/**
 * lookup shuffled letter
 * @param index
 * @returns {string}
 */
function lookup(index) {
    var alphabetShuffled = getShuffled();
    return alphabetShuffled[index];
}

function get () {
  return alphabet || ORIGINAL;
}

var alphabet_1 = {
    get: get,
    characters: characters,
    seed: setSeed$1,
    lookup: lookup,
    shuffled: getShuffled
};

var crypto = typeof window === 'object' && (window.crypto || window.msCrypto); // IE 11 uses window.msCrypto

var randomByte;

if (!crypto || !crypto.getRandomValues) {
    randomByte = function(size) {
        var bytes = [];
        for (var i = 0; i < size; i++) {
            bytes.push(Math.floor(Math.random() * 256));
        }
        return bytes;
    };
} else {
    randomByte = function(size) {
        return crypto.getRandomValues(new Uint8Array(size));
    };
}

var randomByteBrowser = randomByte;

/**
 * Secure random string generator with custom alphabet.
 *
 * Alphabet must contain 256 symbols or less. Otherwise, the generator
 * will not be secure.
 *
 * @param {generator} random The random bytes generator.
 * @param {string} alphabet Symbols to be used in new random string.
 * @param {size} size The number of symbols in new random string.
 *
 * @return {string} Random string.
 *
 * @example
 * const format = require('nanoid/format')
 *
 * function random (size) {
 *   const result = []
 *   for (let i = 0; i < size; i++) {
 *     result.push(randomByte())
 *   }
 *   return result
 * }
 *
 * format(random, "abcdef", 5) //=> "fbaef"
 *
 * @name format
 * @function
 */
var format = function (random, alphabet, size) {
  var mask = (2 << Math.log(alphabet.length - 1) / Math.LN2) - 1;
  var step = Math.ceil(1.6 * mask * size / alphabet.length);

  var id = '';
  while (true) {
    var bytes = random(step);
    for (var i = 0; i < step; i++) {
      var byte = bytes[i] & mask;
      if (alphabet[byte]) {
        id += alphabet[byte];
        if (id.length === size) return id
      }
    }
  }
};

function generate(number) {
    var loopCounter = 0;
    var done;

    var str = '';

    while (!done) {
        str = str + format(randomByteBrowser, alphabet_1.get(), 1);
        done = number < (Math.pow(16, loopCounter + 1 ) );
        loopCounter++;
    }
    return str;
}

var generate_1 = generate;

// Ignore all milliseconds before a certain time to reduce the size of the date entropy without sacrificing uniqueness.
// This number should be updated every year or so to keep the generated id short.
// To regenerate `new Date() - 0` and bump the version. Always bump the version!
var REDUCE_TIME = 1459707606518;

// don't change unless we change the algos or REDUCE_TIME
// must be an integer and less than 16
var version = 6;

// Counter is used when shortid is called multiple times in one second.
var counter;

// Remember the last time shortid was called in case counter is needed.
var previousSeconds;

/**
 * Generate unique id
 * Returns string id
 */
function build(clusterWorkerId) {
    var str = '';

    var seconds = Math.floor((Date.now() - REDUCE_TIME) * 0.001);

    if (seconds === previousSeconds) {
        counter++;
    } else {
        counter = 0;
        previousSeconds = seconds;
    }

    str = str + generate_1(version);
    str = str + generate_1(clusterWorkerId);
    if (counter > 0) {
        str = str + generate_1(counter);
    }
    str = str + generate_1(seconds);
    return str;
}

var build_1 = build;

function isShortId(id) {
    if (!id || typeof id !== 'string' || id.length < 6 ) {
        return false;
    }

    var nonAlphabetic = new RegExp('[^' +
      alphabet_1.get().replace(/[|\\{}()[\]^$+*?.-]/g, '\\$&') +
    ']');
    return !nonAlphabetic.test(id);
}

var isValid = isShortId;

var lib = createCommonjsModule(function (module) {





// if you are using cluster or multiple servers use this to make each instance
// has a unique value for worker
// Note: I don't know if this is automatically set when using third
// party cluster solutions such as pm2.
var clusterWorkerId =  0;

/**
 * Set the seed.
 * Highly recommended if you don't want people to try to figure out your id schema.
 * exposed as shortid.seed(int)
 * @param seed Integer value to seed the random alphabet.  ALWAYS USE THE SAME SEED or you might get overlaps.
 */
function seed(seedValue) {
    alphabet_1.seed(seedValue);
    return module.exports;
}

/**
 * Set the cluster worker or machine id
 * exposed as shortid.worker(int)
 * @param workerId worker must be positive integer.  Number less than 16 is recommended.
 * returns shortid module so it can be chained.
 */
function worker(workerId) {
    clusterWorkerId = workerId;
    return module.exports;
}

/**
 *
 * sets new characters to use in the alphabet
 * returns the shuffled alphabet
 */
function characters(newCharacters) {
    if (newCharacters !== undefined) {
        alphabet_1.characters(newCharacters);
    }

    return alphabet_1.shuffled();
}

/**
 * Generate unique id
 * Returns string id
 */
function generate() {
  return build_1(clusterWorkerId);
}

// Export all other functions as properties of the generate function
module.exports = generate;
module.exports.generate = generate;
module.exports.seed = seed;
module.exports.worker = worker;
module.exports.characters = characters;
module.exports.isValid = isValid;
});
var lib_1 = lib.generate;
var lib_2 = lib.seed;
var lib_3 = lib.worker;
var lib_4 = lib.characters;
var lib_5 = lib.isValid;

var shortid = lib;

/**
 * A specialized version of `_.map` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 */
function arrayMap(array, iteratee) {
  var index = -1,
      length = array == null ? 0 : array.length,
      result = Array(length);

  while (++index < length) {
    result[index] = iteratee(array[index], index, array);
  }
  return result;
}

var _arrayMap = arrayMap;

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED$2 = '__lodash_hash_undefined__';

/**
 * Adds `value` to the array cache.
 *
 * @private
 * @name add
 * @memberOf SetCache
 * @alias push
 * @param {*} value The value to cache.
 * @returns {Object} Returns the cache instance.
 */
function setCacheAdd(value) {
  this.__data__.set(value, HASH_UNDEFINED$2);
  return this;
}

var _setCacheAdd = setCacheAdd;

/**
 * Checks if `value` is in the array cache.
 *
 * @private
 * @name has
 * @memberOf SetCache
 * @param {*} value The value to search for.
 * @returns {number} Returns `true` if `value` is found, else `false`.
 */
function setCacheHas(value) {
  return this.__data__.has(value);
}

var _setCacheHas = setCacheHas;

/**
 *
 * Creates an array cache object to store unique values.
 *
 * @private
 * @constructor
 * @param {Array} [values] The values to cache.
 */
function SetCache(values) {
  var index = -1,
      length = values == null ? 0 : values.length;

  this.__data__ = new _MapCache;
  while (++index < length) {
    this.add(values[index]);
  }
}

// Add methods to `SetCache`.
SetCache.prototype.add = SetCache.prototype.push = _setCacheAdd;
SetCache.prototype.has = _setCacheHas;

var _SetCache = SetCache;

/**
 * A specialized version of `_.some` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {boolean} Returns `true` if any element passes the predicate check,
 *  else `false`.
 */
function arraySome(array, predicate) {
  var index = -1,
      length = array == null ? 0 : array.length;

  while (++index < length) {
    if (predicate(array[index], index, array)) {
      return true;
    }
  }
  return false;
}

var _arraySome = arraySome;

/**
 * Checks if a `cache` value for `key` exists.
 *
 * @private
 * @param {Object} cache The cache to query.
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function cacheHas(cache, key) {
  return cache.has(key);
}

var _cacheHas = cacheHas;

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1,
    COMPARE_UNORDERED_FLAG = 2;

/**
 * A specialized version of `baseIsEqualDeep` for arrays with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Array} array The array to compare.
 * @param {Array} other The other array to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `array` and `other` objects.
 * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
 */
function equalArrays(array, other, bitmask, customizer, equalFunc, stack) {
  var isPartial = bitmask & COMPARE_PARTIAL_FLAG,
      arrLength = array.length,
      othLength = other.length;

  if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
    return false;
  }
  // Assume cyclic values are equal.
  var stacked = stack.get(array);
  if (stacked && stack.get(other)) {
    return stacked == other;
  }
  var index = -1,
      result = true,
      seen = (bitmask & COMPARE_UNORDERED_FLAG) ? new _SetCache : undefined;

  stack.set(array, other);
  stack.set(other, array);

  // Ignore non-index properties.
  while (++index < arrLength) {
    var arrValue = array[index],
        othValue = other[index];

    if (customizer) {
      var compared = isPartial
        ? customizer(othValue, arrValue, index, other, array, stack)
        : customizer(arrValue, othValue, index, array, other, stack);
    }
    if (compared !== undefined) {
      if (compared) {
        continue;
      }
      result = false;
      break;
    }
    // Recursively compare arrays (susceptible to call stack limits).
    if (seen) {
      if (!_arraySome(other, function(othValue, othIndex) {
            if (!_cacheHas(seen, othIndex) &&
                (arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
              return seen.push(othIndex);
            }
          })) {
        result = false;
        break;
      }
    } else if (!(
          arrValue === othValue ||
            equalFunc(arrValue, othValue, bitmask, customizer, stack)
        )) {
      result = false;
      break;
    }
  }
  stack['delete'](array);
  stack['delete'](other);
  return result;
}

var _equalArrays = equalArrays;

/**
 * Converts `map` to its key-value pairs.
 *
 * @private
 * @param {Object} map The map to convert.
 * @returns {Array} Returns the key-value pairs.
 */
function mapToArray(map) {
  var index = -1,
      result = Array(map.size);

  map.forEach(function(value, key) {
    result[++index] = [key, value];
  });
  return result;
}

var _mapToArray = mapToArray;

/**
 * Converts `set` to an array of its values.
 *
 * @private
 * @param {Object} set The set to convert.
 * @returns {Array} Returns the values.
 */
function setToArray(set) {
  var index = -1,
      result = Array(set.size);

  set.forEach(function(value) {
    result[++index] = value;
  });
  return result;
}

var _setToArray = setToArray;

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG$1 = 1,
    COMPARE_UNORDERED_FLAG$1 = 2;

/** `Object#toString` result references. */
var boolTag$1 = '[object Boolean]',
    dateTag$1 = '[object Date]',
    errorTag$1 = '[object Error]',
    mapTag$1 = '[object Map]',
    numberTag$1 = '[object Number]',
    regexpTag$1 = '[object RegExp]',
    setTag$1 = '[object Set]',
    stringTag$1 = '[object String]',
    symbolTag = '[object Symbol]';

var arrayBufferTag$1 = '[object ArrayBuffer]',
    dataViewTag$1 = '[object DataView]';

/** Used to convert symbols to primitives and strings. */
var symbolProto = _Symbol ? _Symbol.prototype : undefined,
    symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;

/**
 * A specialized version of `baseIsEqualDeep` for comparing objects of
 * the same `toStringTag`.
 *
 * **Note:** This function only supports comparing values with tags of
 * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {string} tag The `toStringTag` of the objects to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalByTag(object, other, tag, bitmask, customizer, equalFunc, stack) {
  switch (tag) {
    case dataViewTag$1:
      if ((object.byteLength != other.byteLength) ||
          (object.byteOffset != other.byteOffset)) {
        return false;
      }
      object = object.buffer;
      other = other.buffer;

    case arrayBufferTag$1:
      if ((object.byteLength != other.byteLength) ||
          !equalFunc(new _Uint8Array(object), new _Uint8Array(other))) {
        return false;
      }
      return true;

    case boolTag$1:
    case dateTag$1:
    case numberTag$1:
      // Coerce booleans to `1` or `0` and dates to milliseconds.
      // Invalid dates are coerced to `NaN`.
      return eq_1(+object, +other);

    case errorTag$1:
      return object.name == other.name && object.message == other.message;

    case regexpTag$1:
    case stringTag$1:
      // Coerce regexes to strings and treat strings, primitives and objects,
      // as equal. See http://www.ecma-international.org/ecma-262/7.0/#sec-regexp.prototype.tostring
      // for more details.
      return object == (other + '');

    case mapTag$1:
      var convert = _mapToArray;

    case setTag$1:
      var isPartial = bitmask & COMPARE_PARTIAL_FLAG$1;
      convert || (convert = _setToArray);

      if (object.size != other.size && !isPartial) {
        return false;
      }
      // Assume cyclic values are equal.
      var stacked = stack.get(object);
      if (stacked) {
        return stacked == other;
      }
      bitmask |= COMPARE_UNORDERED_FLAG$1;

      // Recursively compare objects (susceptible to call stack limits).
      stack.set(object, other);
      var result = _equalArrays(convert(object), convert(other), bitmask, customizer, equalFunc, stack);
      stack['delete'](object);
      return result;

    case symbolTag:
      if (symbolValueOf) {
        return symbolValueOf.call(object) == symbolValueOf.call(other);
      }
  }
  return false;
}

var _equalByTag = equalByTag;

/**
 * Appends the elements of `values` to `array`.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {Array} values The values to append.
 * @returns {Array} Returns `array`.
 */
function arrayPush(array, values) {
  var index = -1,
      length = values.length,
      offset = array.length;

  while (++index < length) {
    array[offset + index] = values[index];
  }
  return array;
}

var _arrayPush = arrayPush;

/**
 * The base implementation of `getAllKeys` and `getAllKeysIn` which uses
 * `keysFunc` and `symbolsFunc` to get the enumerable property names and
 * symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @param {Function} symbolsFunc The function to get the symbols of `object`.
 * @returns {Array} Returns the array of property names and symbols.
 */
function baseGetAllKeys(object, keysFunc, symbolsFunc) {
  var result = keysFunc(object);
  return isArray_1(object) ? result : _arrayPush(result, symbolsFunc(object));
}

var _baseGetAllKeys = baseGetAllKeys;

/**
 * A specialized version of `_.filter` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {Array} Returns the new filtered array.
 */
function arrayFilter(array, predicate) {
  var index = -1,
      length = array == null ? 0 : array.length,
      resIndex = 0,
      result = [];

  while (++index < length) {
    var value = array[index];
    if (predicate(value, index, array)) {
      result[resIndex++] = value;
    }
  }
  return result;
}

var _arrayFilter = arrayFilter;

/**
 * This method returns a new empty array.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {Array} Returns the new empty array.
 * @example
 *
 * var arrays = _.times(2, _.stubArray);
 *
 * console.log(arrays);
 * // => [[], []]
 *
 * console.log(arrays[0] === arrays[1]);
 * // => false
 */
function stubArray() {
  return [];
}

var stubArray_1 = stubArray;

/** Used for built-in method references. */
var objectProto$b = Object.prototype;

/** Built-in value references. */
var propertyIsEnumerable$1 = objectProto$b.propertyIsEnumerable;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeGetSymbols = Object.getOwnPropertySymbols;

/**
 * Creates an array of the own enumerable symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 */
var getSymbols = !nativeGetSymbols ? stubArray_1 : function(object) {
  if (object == null) {
    return [];
  }
  object = Object(object);
  return _arrayFilter(nativeGetSymbols(object), function(symbol) {
    return propertyIsEnumerable$1.call(object, symbol);
  });
};

var _getSymbols = getSymbols;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeKeys = _overArg(Object.keys, Object);

var _nativeKeys = nativeKeys;

/** Used for built-in method references. */
var objectProto$c = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$a = objectProto$c.hasOwnProperty;

/**
 * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeys(object) {
  if (!_isPrototype(object)) {
    return _nativeKeys(object);
  }
  var result = [];
  for (var key in Object(object)) {
    if (hasOwnProperty$a.call(object, key) && key != 'constructor') {
      result.push(key);
    }
  }
  return result;
}

var _baseKeys = baseKeys;

/**
 * Creates an array of the own enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects. See the
 * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * for more details.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keys(new Foo);
 * // => ['a', 'b'] (iteration order is not guaranteed)
 *
 * _.keys('hi');
 * // => ['0', '1']
 */
function keys(object) {
  return isArrayLike_1(object) ? _arrayLikeKeys(object) : _baseKeys(object);
}

var keys_1 = keys;

/**
 * Creates an array of own enumerable property names and symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names and symbols.
 */
function getAllKeys(object) {
  return _baseGetAllKeys(object, keys_1, _getSymbols);
}

var _getAllKeys = getAllKeys;

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG$2 = 1;

/** Used for built-in method references. */
var objectProto$d = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$b = objectProto$d.hasOwnProperty;

/**
 * A specialized version of `baseIsEqualDeep` for objects with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalObjects(object, other, bitmask, customizer, equalFunc, stack) {
  var isPartial = bitmask & COMPARE_PARTIAL_FLAG$2,
      objProps = _getAllKeys(object),
      objLength = objProps.length,
      othProps = _getAllKeys(other),
      othLength = othProps.length;

  if (objLength != othLength && !isPartial) {
    return false;
  }
  var index = objLength;
  while (index--) {
    var key = objProps[index];
    if (!(isPartial ? key in other : hasOwnProperty$b.call(other, key))) {
      return false;
    }
  }
  // Assume cyclic values are equal.
  var stacked = stack.get(object);
  if (stacked && stack.get(other)) {
    return stacked == other;
  }
  var result = true;
  stack.set(object, other);
  stack.set(other, object);

  var skipCtor = isPartial;
  while (++index < objLength) {
    key = objProps[index];
    var objValue = object[key],
        othValue = other[key];

    if (customizer) {
      var compared = isPartial
        ? customizer(othValue, objValue, key, other, object, stack)
        : customizer(objValue, othValue, key, object, other, stack);
    }
    // Recursively compare objects (susceptible to call stack limits).
    if (!(compared === undefined
          ? (objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack))
          : compared
        )) {
      result = false;
      break;
    }
    skipCtor || (skipCtor = key == 'constructor');
  }
  if (result && !skipCtor) {
    var objCtor = object.constructor,
        othCtor = other.constructor;

    // Non `Object` object instances with different constructors are not equal.
    if (objCtor != othCtor &&
        ('constructor' in object && 'constructor' in other) &&
        !(typeof objCtor == 'function' && objCtor instanceof objCtor &&
          typeof othCtor == 'function' && othCtor instanceof othCtor)) {
      result = false;
    }
  }
  stack['delete'](object);
  stack['delete'](other);
  return result;
}

var _equalObjects = equalObjects;

/* Built-in method references that are verified to be native. */
var DataView = _getNative(_root, 'DataView');

var _DataView = DataView;

/* Built-in method references that are verified to be native. */
var Promise = _getNative(_root, 'Promise');

var _Promise = Promise;

/* Built-in method references that are verified to be native. */
var Set = _getNative(_root, 'Set');

var _Set = Set;

/* Built-in method references that are verified to be native. */
var WeakMap = _getNative(_root, 'WeakMap');

var _WeakMap = WeakMap;

/** `Object#toString` result references. */
var mapTag$2 = '[object Map]',
    objectTag$2 = '[object Object]',
    promiseTag = '[object Promise]',
    setTag$2 = '[object Set]',
    weakMapTag$1 = '[object WeakMap]';

var dataViewTag$2 = '[object DataView]';

/** Used to detect maps, sets, and weakmaps. */
var dataViewCtorString = _toSource(_DataView),
    mapCtorString = _toSource(_Map),
    promiseCtorString = _toSource(_Promise),
    setCtorString = _toSource(_Set),
    weakMapCtorString = _toSource(_WeakMap);

/**
 * Gets the `toStringTag` of `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
var getTag = _baseGetTag;

// Fallback for data views, maps, sets, and weak maps in IE 11 and promises in Node.js < 6.
if ((_DataView && getTag(new _DataView(new ArrayBuffer(1))) != dataViewTag$2) ||
    (_Map && getTag(new _Map) != mapTag$2) ||
    (_Promise && getTag(_Promise.resolve()) != promiseTag) ||
    (_Set && getTag(new _Set) != setTag$2) ||
    (_WeakMap && getTag(new _WeakMap) != weakMapTag$1)) {
  getTag = function(value) {
    var result = _baseGetTag(value),
        Ctor = result == objectTag$2 ? value.constructor : undefined,
        ctorString = Ctor ? _toSource(Ctor) : '';

    if (ctorString) {
      switch (ctorString) {
        case dataViewCtorString: return dataViewTag$2;
        case mapCtorString: return mapTag$2;
        case promiseCtorString: return promiseTag;
        case setCtorString: return setTag$2;
        case weakMapCtorString: return weakMapTag$1;
      }
    }
    return result;
  };
}

var _getTag = getTag;

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG$3 = 1;

/** `Object#toString` result references. */
var argsTag$2 = '[object Arguments]',
    arrayTag$1 = '[object Array]',
    objectTag$3 = '[object Object]';

/** Used for built-in method references. */
var objectProto$e = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$c = objectProto$e.hasOwnProperty;

/**
 * A specialized version of `baseIsEqual` for arrays and objects which performs
 * deep comparisons and tracks traversed objects enabling objects with circular
 * references to be compared.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} [stack] Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function baseIsEqualDeep(object, other, bitmask, customizer, equalFunc, stack) {
  var objIsArr = isArray_1(object),
      othIsArr = isArray_1(other),
      objTag = objIsArr ? arrayTag$1 : _getTag(object),
      othTag = othIsArr ? arrayTag$1 : _getTag(other);

  objTag = objTag == argsTag$2 ? objectTag$3 : objTag;
  othTag = othTag == argsTag$2 ? objectTag$3 : othTag;

  var objIsObj = objTag == objectTag$3,
      othIsObj = othTag == objectTag$3,
      isSameTag = objTag == othTag;

  if (isSameTag && isBuffer_1(object)) {
    if (!isBuffer_1(other)) {
      return false;
    }
    objIsArr = true;
    objIsObj = false;
  }
  if (isSameTag && !objIsObj) {
    stack || (stack = new _Stack);
    return (objIsArr || isTypedArray_1(object))
      ? _equalArrays(object, other, bitmask, customizer, equalFunc, stack)
      : _equalByTag(object, other, objTag, bitmask, customizer, equalFunc, stack);
  }
  if (!(bitmask & COMPARE_PARTIAL_FLAG$3)) {
    var objIsWrapped = objIsObj && hasOwnProperty$c.call(object, '__wrapped__'),
        othIsWrapped = othIsObj && hasOwnProperty$c.call(other, '__wrapped__');

    if (objIsWrapped || othIsWrapped) {
      var objUnwrapped = objIsWrapped ? object.value() : object,
          othUnwrapped = othIsWrapped ? other.value() : other;

      stack || (stack = new _Stack);
      return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
    }
  }
  if (!isSameTag) {
    return false;
  }
  stack || (stack = new _Stack);
  return _equalObjects(object, other, bitmask, customizer, equalFunc, stack);
}

var _baseIsEqualDeep = baseIsEqualDeep;

/**
 * The base implementation of `_.isEqual` which supports partial comparisons
 * and tracks traversed objects.
 *
 * @private
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @param {boolean} bitmask The bitmask flags.
 *  1 - Unordered comparison
 *  2 - Partial comparison
 * @param {Function} [customizer] The function to customize comparisons.
 * @param {Object} [stack] Tracks traversed `value` and `other` objects.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 */
function baseIsEqual(value, other, bitmask, customizer, stack) {
  if (value === other) {
    return true;
  }
  if (value == null || other == null || (!isObjectLike_1(value) && !isObjectLike_1(other))) {
    return value !== value && other !== other;
  }
  return _baseIsEqualDeep(value, other, bitmask, customizer, baseIsEqual, stack);
}

var _baseIsEqual = baseIsEqual;

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG$4 = 1,
    COMPARE_UNORDERED_FLAG$2 = 2;

/**
 * The base implementation of `_.isMatch` without support for iteratee shorthands.
 *
 * @private
 * @param {Object} object The object to inspect.
 * @param {Object} source The object of property values to match.
 * @param {Array} matchData The property names, values, and compare flags to match.
 * @param {Function} [customizer] The function to customize comparisons.
 * @returns {boolean} Returns `true` if `object` is a match, else `false`.
 */
function baseIsMatch(object, source, matchData, customizer) {
  var index = matchData.length,
      length = index,
      noCustomizer = !customizer;

  if (object == null) {
    return !length;
  }
  object = Object(object);
  while (index--) {
    var data = matchData[index];
    if ((noCustomizer && data[2])
          ? data[1] !== object[data[0]]
          : !(data[0] in object)
        ) {
      return false;
    }
  }
  while (++index < length) {
    data = matchData[index];
    var key = data[0],
        objValue = object[key],
        srcValue = data[1];

    if (noCustomizer && data[2]) {
      if (objValue === undefined && !(key in object)) {
        return false;
      }
    } else {
      var stack = new _Stack;
      if (customizer) {
        var result = customizer(objValue, srcValue, key, object, source, stack);
      }
      if (!(result === undefined
            ? _baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG$4 | COMPARE_UNORDERED_FLAG$2, customizer, stack)
            : result
          )) {
        return false;
      }
    }
  }
  return true;
}

var _baseIsMatch = baseIsMatch;

/**
 * Checks if `value` is suitable for strict equality comparisons, i.e. `===`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` if suitable for strict
 *  equality comparisons, else `false`.
 */
function isStrictComparable(value) {
  return value === value && !isObject_1(value);
}

var _isStrictComparable = isStrictComparable;

/**
 * Gets the property names, values, and compare flags of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the match data of `object`.
 */
function getMatchData(object) {
  var result = keys_1(object),
      length = result.length;

  while (length--) {
    var key = result[length],
        value = object[key];

    result[length] = [key, value, _isStrictComparable(value)];
  }
  return result;
}

var _getMatchData = getMatchData;

/**
 * A specialized version of `matchesProperty` for source values suitable
 * for strict equality comparisons, i.e. `===`.
 *
 * @private
 * @param {string} key The key of the property to get.
 * @param {*} srcValue The value to match.
 * @returns {Function} Returns the new spec function.
 */
function matchesStrictComparable(key, srcValue) {
  return function(object) {
    if (object == null) {
      return false;
    }
    return object[key] === srcValue &&
      (srcValue !== undefined || (key in Object(object)));
  };
}

var _matchesStrictComparable = matchesStrictComparable;

/**
 * The base implementation of `_.matches` which doesn't clone `source`.
 *
 * @private
 * @param {Object} source The object of property values to match.
 * @returns {Function} Returns the new spec function.
 */
function baseMatches(source) {
  var matchData = _getMatchData(source);
  if (matchData.length == 1 && matchData[0][2]) {
    return _matchesStrictComparable(matchData[0][0], matchData[0][1]);
  }
  return function(object) {
    return object === source || _baseIsMatch(object, source, matchData);
  };
}

var _baseMatches = baseMatches;

/** `Object#toString` result references. */
var symbolTag$1 = '[object Symbol]';

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike_1(value) && _baseGetTag(value) == symbolTag$1);
}

var isSymbol_1 = isSymbol;

/** Used to match property names within property paths. */
var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
    reIsPlainProp = /^\w*$/;

/**
 * Checks if `value` is a property name and not a property path.
 *
 * @private
 * @param {*} value The value to check.
 * @param {Object} [object] The object to query keys on.
 * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
 */
function isKey(value, object) {
  if (isArray_1(value)) {
    return false;
  }
  var type = typeof value;
  if (type == 'number' || type == 'symbol' || type == 'boolean' ||
      value == null || isSymbol_1(value)) {
    return true;
  }
  return reIsPlainProp.test(value) || !reIsDeepProp.test(value) ||
    (object != null && value in Object(object));
}

var _isKey = isKey;

/** Error message constants. */
var FUNC_ERROR_TEXT = 'Expected a function';

/**
 * Creates a function that memoizes the result of `func`. If `resolver` is
 * provided, it determines the cache key for storing the result based on the
 * arguments provided to the memoized function. By default, the first argument
 * provided to the memoized function is used as the map cache key. The `func`
 * is invoked with the `this` binding of the memoized function.
 *
 * **Note:** The cache is exposed as the `cache` property on the memoized
 * function. Its creation may be customized by replacing the `_.memoize.Cache`
 * constructor with one whose instances implement the
 * [`Map`](http://ecma-international.org/ecma-262/7.0/#sec-properties-of-the-map-prototype-object)
 * method interface of `clear`, `delete`, `get`, `has`, and `set`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to have its output memoized.
 * @param {Function} [resolver] The function to resolve the cache key.
 * @returns {Function} Returns the new memoized function.
 * @example
 *
 * var object = { 'a': 1, 'b': 2 };
 * var other = { 'c': 3, 'd': 4 };
 *
 * var values = _.memoize(_.values);
 * values(object);
 * // => [1, 2]
 *
 * values(other);
 * // => [3, 4]
 *
 * object.a = 2;
 * values(object);
 * // => [1, 2]
 *
 * // Modify the result cache.
 * values.cache.set(object, ['a', 'b']);
 * values(object);
 * // => ['a', 'b']
 *
 * // Replace `_.memoize.Cache`.
 * _.memoize.Cache = WeakMap;
 */
function memoize(func, resolver) {
  if (typeof func != 'function' || (resolver != null && typeof resolver != 'function')) {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  var memoized = function() {
    var args = arguments,
        key = resolver ? resolver.apply(this, args) : args[0],
        cache = memoized.cache;

    if (cache.has(key)) {
      return cache.get(key);
    }
    var result = func.apply(this, args);
    memoized.cache = cache.set(key, result) || cache;
    return result;
  };
  memoized.cache = new (memoize.Cache || _MapCache);
  return memoized;
}

// Expose `MapCache`.
memoize.Cache = _MapCache;

var memoize_1 = memoize;

/** Used as the maximum memoize cache size. */
var MAX_MEMOIZE_SIZE = 500;

/**
 * A specialized version of `_.memoize` which clears the memoized function's
 * cache when it exceeds `MAX_MEMOIZE_SIZE`.
 *
 * @private
 * @param {Function} func The function to have its output memoized.
 * @returns {Function} Returns the new memoized function.
 */
function memoizeCapped(func) {
  var result = memoize_1(func, function(key) {
    if (cache.size === MAX_MEMOIZE_SIZE) {
      cache.clear();
    }
    return key;
  });

  var cache = result.cache;
  return result;
}

var _memoizeCapped = memoizeCapped;

/** Used to match property names within property paths. */
var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;

/** Used to match backslashes in property paths. */
var reEscapeChar = /\\(\\)?/g;

/**
 * Converts `string` to a property path array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the property path array.
 */
var stringToPath = _memoizeCapped(function(string) {
  var result = [];
  if (string.charCodeAt(0) === 46 /* . */) {
    result.push('');
  }
  string.replace(rePropName, function(match, number, quote, subString) {
    result.push(quote ? subString.replace(reEscapeChar, '$1') : (number || match));
  });
  return result;
});

var _stringToPath = stringToPath;

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/** Used to convert symbols to primitives and strings. */
var symbolProto$1 = _Symbol ? _Symbol.prototype : undefined,
    symbolToString = symbolProto$1 ? symbolProto$1.toString : undefined;

/**
 * The base implementation of `_.toString` which doesn't convert nullish
 * values to empty strings.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */
function baseToString(value) {
  // Exit early for strings to avoid a performance hit in some environments.
  if (typeof value == 'string') {
    return value;
  }
  if (isArray_1(value)) {
    // Recursively convert values (susceptible to call stack limits).
    return _arrayMap(value, baseToString) + '';
  }
  if (isSymbol_1(value)) {
    return symbolToString ? symbolToString.call(value) : '';
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

var _baseToString = baseToString;

/**
 * Converts `value` to a string. An empty string is returned for `null`
 * and `undefined` values. The sign of `-0` is preserved.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 * @example
 *
 * _.toString(null);
 * // => ''
 *
 * _.toString(-0);
 * // => '-0'
 *
 * _.toString([1, 2, 3]);
 * // => '1,2,3'
 */
function toString(value) {
  return value == null ? '' : _baseToString(value);
}

var toString_1 = toString;

/**
 * Casts `value` to a path array if it's not one.
 *
 * @private
 * @param {*} value The value to inspect.
 * @param {Object} [object] The object to query keys on.
 * @returns {Array} Returns the cast property path array.
 */
function castPath(value, object) {
  if (isArray_1(value)) {
    return value;
  }
  return _isKey(value, object) ? [value] : _stringToPath(toString_1(value));
}

var _castPath = castPath;

/** Used as references for various `Number` constants. */
var INFINITY$1 = 1 / 0;

/**
 * Converts `value` to a string key if it's not a string or symbol.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {string|symbol} Returns the key.
 */
function toKey(value) {
  if (typeof value == 'string' || isSymbol_1(value)) {
    return value;
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY$1) ? '-0' : result;
}

var _toKey = toKey;

/**
 * The base implementation of `_.get` without support for default values.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @returns {*} Returns the resolved value.
 */
function baseGet(object, path) {
  path = _castPath(path, object);

  var index = 0,
      length = path.length;

  while (object != null && index < length) {
    object = object[_toKey(path[index++])];
  }
  return (index && index == length) ? object : undefined;
}

var _baseGet = baseGet;

/**
 * Gets the value at `path` of `object`. If the resolved value is
 * `undefined`, the `defaultValue` is returned in its place.
 *
 * @static
 * @memberOf _
 * @since 3.7.0
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @param {*} [defaultValue] The value returned for `undefined` resolved values.
 * @returns {*} Returns the resolved value.
 * @example
 *
 * var object = { 'a': [{ 'b': { 'c': 3 } }] };
 *
 * _.get(object, 'a[0].b.c');
 * // => 3
 *
 * _.get(object, ['a', '0', 'b', 'c']);
 * // => 3
 *
 * _.get(object, 'a.b.c', 'default');
 * // => 'default'
 */
function get$1(object, path, defaultValue) {
  var result = object == null ? undefined : _baseGet(object, path);
  return result === undefined ? defaultValue : result;
}

var get_1 = get$1;

/**
 * The base implementation of `_.hasIn` without support for deep paths.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {Array|string} key The key to check.
 * @returns {boolean} Returns `true` if `key` exists, else `false`.
 */
function baseHasIn(object, key) {
  return object != null && key in Object(object);
}

var _baseHasIn = baseHasIn;

/**
 * Checks if `path` exists on `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} path The path to check.
 * @param {Function} hasFunc The function to check properties.
 * @returns {boolean} Returns `true` if `path` exists, else `false`.
 */
function hasPath(object, path, hasFunc) {
  path = _castPath(path, object);

  var index = -1,
      length = path.length,
      result = false;

  while (++index < length) {
    var key = _toKey(path[index]);
    if (!(result = object != null && hasFunc(object, key))) {
      break;
    }
    object = object[key];
  }
  if (result || ++index != length) {
    return result;
  }
  length = object == null ? 0 : object.length;
  return !!length && isLength_1(length) && _isIndex(key, length) &&
    (isArray_1(object) || isArguments_1(object));
}

var _hasPath = hasPath;

/**
 * Checks if `path` is a direct or inherited property of `object`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path to check.
 * @returns {boolean} Returns `true` if `path` exists, else `false`.
 * @example
 *
 * var object = _.create({ 'a': _.create({ 'b': 2 }) });
 *
 * _.hasIn(object, 'a');
 * // => true
 *
 * _.hasIn(object, 'a.b');
 * // => true
 *
 * _.hasIn(object, ['a', 'b']);
 * // => true
 *
 * _.hasIn(object, 'b');
 * // => false
 */
function hasIn(object, path) {
  return object != null && _hasPath(object, path, _baseHasIn);
}

var hasIn_1 = hasIn;

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG$5 = 1,
    COMPARE_UNORDERED_FLAG$3 = 2;

/**
 * The base implementation of `_.matchesProperty` which doesn't clone `srcValue`.
 *
 * @private
 * @param {string} path The path of the property to get.
 * @param {*} srcValue The value to match.
 * @returns {Function} Returns the new spec function.
 */
function baseMatchesProperty(path, srcValue) {
  if (_isKey(path) && _isStrictComparable(srcValue)) {
    return _matchesStrictComparable(_toKey(path), srcValue);
  }
  return function(object) {
    var objValue = get_1(object, path);
    return (objValue === undefined && objValue === srcValue)
      ? hasIn_1(object, path)
      : _baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG$5 | COMPARE_UNORDERED_FLAG$3);
  };
}

var _baseMatchesProperty = baseMatchesProperty;

/**
 * The base implementation of `_.property` without support for deep paths.
 *
 * @private
 * @param {string} key The key of the property to get.
 * @returns {Function} Returns the new accessor function.
 */
function baseProperty(key) {
  return function(object) {
    return object == null ? undefined : object[key];
  };
}

var _baseProperty = baseProperty;

/**
 * A specialized version of `baseProperty` which supports deep paths.
 *
 * @private
 * @param {Array|string} path The path of the property to get.
 * @returns {Function} Returns the new accessor function.
 */
function basePropertyDeep(path) {
  return function(object) {
    return _baseGet(object, path);
  };
}

var _basePropertyDeep = basePropertyDeep;

/**
 * Creates a function that returns the value at `path` of a given object.
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Util
 * @param {Array|string} path The path of the property to get.
 * @returns {Function} Returns the new accessor function.
 * @example
 *
 * var objects = [
 *   { 'a': { 'b': 2 } },
 *   { 'a': { 'b': 1 } }
 * ];
 *
 * _.map(objects, _.property('a.b'));
 * // => [2, 1]
 *
 * _.map(_.sortBy(objects, _.property(['a', 'b'])), 'a.b');
 * // => [1, 2]
 */
function property(path) {
  return _isKey(path) ? _baseProperty(_toKey(path)) : _basePropertyDeep(path);
}

var property_1 = property;

/**
 * The base implementation of `_.iteratee`.
 *
 * @private
 * @param {*} [value=_.identity] The value to convert to an iteratee.
 * @returns {Function} Returns the iteratee.
 */
function baseIteratee(value) {
  // Don't store the `typeof` result in a variable to avoid a JIT bug in Safari 9.
  // See https://bugs.webkit.org/show_bug.cgi?id=156034 for more details.
  if (typeof value == 'function') {
    return value;
  }
  if (value == null) {
    return identity_1;
  }
  if (typeof value == 'object') {
    return isArray_1(value)
      ? _baseMatchesProperty(value[0], value[1])
      : _baseMatches(value);
  }
  return property_1(value);
}

var _baseIteratee = baseIteratee;

/**
 * The base implementation of `_.forOwn` without support for iteratee shorthands.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Object} Returns `object`.
 */
function baseForOwn(object, iteratee) {
  return object && _baseFor(object, iteratee, keys_1);
}

var _baseForOwn = baseForOwn;

/**
 * Creates a `baseEach` or `baseEachRight` function.
 *
 * @private
 * @param {Function} eachFunc The function to iterate over a collection.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Function} Returns the new base function.
 */
function createBaseEach(eachFunc, fromRight) {
  return function(collection, iteratee) {
    if (collection == null) {
      return collection;
    }
    if (!isArrayLike_1(collection)) {
      return eachFunc(collection, iteratee);
    }
    var length = collection.length,
        index = fromRight ? length : -1,
        iterable = Object(collection);

    while ((fromRight ? index-- : ++index < length)) {
      if (iteratee(iterable[index], index, iterable) === false) {
        break;
      }
    }
    return collection;
  };
}

var _createBaseEach = createBaseEach;

/**
 * The base implementation of `_.forEach` without support for iteratee shorthands.
 *
 * @private
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array|Object} Returns `collection`.
 */
var baseEach = _createBaseEach(_baseForOwn);

var _baseEach = baseEach;

/**
 * The base implementation of `_.map` without support for iteratee shorthands.
 *
 * @private
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 */
function baseMap(collection, iteratee) {
  var index = -1,
      result = isArrayLike_1(collection) ? Array(collection.length) : [];

  _baseEach(collection, function(value, key, collection) {
    result[++index] = iteratee(value, key, collection);
  });
  return result;
}

var _baseMap = baseMap;

/**
 * The base implementation of `_.sortBy` which uses `comparer` to define the
 * sort order of `array` and replaces criteria objects with their corresponding
 * values.
 *
 * @private
 * @param {Array} array The array to sort.
 * @param {Function} comparer The function to define sort order.
 * @returns {Array} Returns `array`.
 */
function baseSortBy(array, comparer) {
  var length = array.length;

  array.sort(comparer);
  while (length--) {
    array[length] = array[length].value;
  }
  return array;
}

var _baseSortBy = baseSortBy;

/**
 * Compares values to sort them in ascending order.
 *
 * @private
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {number} Returns the sort order indicator for `value`.
 */
function compareAscending(value, other) {
  if (value !== other) {
    var valIsDefined = value !== undefined,
        valIsNull = value === null,
        valIsReflexive = value === value,
        valIsSymbol = isSymbol_1(value);

    var othIsDefined = other !== undefined,
        othIsNull = other === null,
        othIsReflexive = other === other,
        othIsSymbol = isSymbol_1(other);

    if ((!othIsNull && !othIsSymbol && !valIsSymbol && value > other) ||
        (valIsSymbol && othIsDefined && othIsReflexive && !othIsNull && !othIsSymbol) ||
        (valIsNull && othIsDefined && othIsReflexive) ||
        (!valIsDefined && othIsReflexive) ||
        !valIsReflexive) {
      return 1;
    }
    if ((!valIsNull && !valIsSymbol && !othIsSymbol && value < other) ||
        (othIsSymbol && valIsDefined && valIsReflexive && !valIsNull && !valIsSymbol) ||
        (othIsNull && valIsDefined && valIsReflexive) ||
        (!othIsDefined && valIsReflexive) ||
        !othIsReflexive) {
      return -1;
    }
  }
  return 0;
}

var _compareAscending = compareAscending;

/**
 * Used by `_.orderBy` to compare multiple properties of a value to another
 * and stable sort them.
 *
 * If `orders` is unspecified, all values are sorted in ascending order. Otherwise,
 * specify an order of "desc" for descending or "asc" for ascending sort order
 * of corresponding values.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {boolean[]|string[]} orders The order to sort by for each property.
 * @returns {number} Returns the sort order indicator for `object`.
 */
function compareMultiple(object, other, orders) {
  var index = -1,
      objCriteria = object.criteria,
      othCriteria = other.criteria,
      length = objCriteria.length,
      ordersLength = orders.length;

  while (++index < length) {
    var result = _compareAscending(objCriteria[index], othCriteria[index]);
    if (result) {
      if (index >= ordersLength) {
        return result;
      }
      var order = orders[index];
      return result * (order == 'desc' ? -1 : 1);
    }
  }
  // Fixes an `Array#sort` bug in the JS engine embedded in Adobe applications
  // that causes it, under certain circumstances, to provide the same value for
  // `object` and `other`. See https://github.com/jashkenas/underscore/pull/1247
  // for more details.
  //
  // This also ensures a stable sort in V8 and other engines.
  // See https://bugs.chromium.org/p/v8/issues/detail?id=90 for more details.
  return object.index - other.index;
}

var _compareMultiple = compareMultiple;

/**
 * The base implementation of `_.orderBy` without param guards.
 *
 * @private
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function[]|Object[]|string[]} iteratees The iteratees to sort by.
 * @param {string[]} orders The sort orders of `iteratees`.
 * @returns {Array} Returns the new sorted array.
 */
function baseOrderBy(collection, iteratees, orders) {
  var index = -1;
  iteratees = _arrayMap(iteratees.length ? iteratees : [identity_1], _baseUnary(_baseIteratee));

  var result = _baseMap(collection, function(value, key, collection) {
    var criteria = _arrayMap(iteratees, function(iteratee) {
      return iteratee(value);
    });
    return { 'criteria': criteria, 'index': ++index, 'value': value };
  });

  return _baseSortBy(result, function(object, other) {
    return _compareMultiple(object, other, orders);
  });
}

var _baseOrderBy = baseOrderBy;

/**
 * This method is like `_.sortBy` except that it allows specifying the sort
 * orders of the iteratees to sort by. If `orders` is unspecified, all values
 * are sorted in ascending order. Otherwise, specify an order of "desc" for
 * descending or "asc" for ascending sort order of corresponding values.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Array[]|Function[]|Object[]|string[]} [iteratees=[_.identity]]
 *  The iteratees to sort by.
 * @param {string[]} [orders] The sort orders of `iteratees`.
 * @param- {Object} [guard] Enables use as an iteratee for methods like `_.reduce`.
 * @returns {Array} Returns the new sorted array.
 * @example
 *
 * var users = [
 *   { 'user': 'fred',   'age': 48 },
 *   { 'user': 'barney', 'age': 34 },
 *   { 'user': 'fred',   'age': 40 },
 *   { 'user': 'barney', 'age': 36 }
 * ];
 *
 * // Sort by `user` in ascending order and by `age` in descending order.
 * _.orderBy(users, ['user', 'age'], ['asc', 'desc']);
 * // => objects for [['barney', 36], ['barney', 34], ['fred', 48], ['fred', 40]]
 */
function orderBy(collection, iteratees, orders, guard) {
  if (collection == null) {
    return [];
  }
  if (!isArray_1(iteratees)) {
    iteratees = iteratees == null ? [] : [iteratees];
  }
  orders = guard ? undefined : orders;
  if (!isArray_1(orders)) {
    orders = orders == null ? [] : [orders];
  }
  return _baseOrderBy(collection, iteratees, orders);
}

var orderBy_1 = orderBy;

var sort = function sort(rows) {
  var field = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  var direction = arguments.length > 2 ? arguments[2] : undefined;
  var sortFn = arguments.length > 3 ? arguments[3] : undefined;

  if (sortFn && typeof sortFn === 'function') {
    return sortFn(rows, field, direction);
  }

  return orderBy_1(rows, field, direction);
};
var getProperty = function getProperty(row, selector, format) {
  if (typeof selector !== 'string') {
    throw new Error('selector must be a . delimted string eg (my.property)');
  }

  if (format && typeof format === 'function') {
    return format(row);
  }

  return selector.split('.').reduce(function (acc, part) {
    return acc && acc[part];
  }, row);
};
var insertItem = function insertItem(array, item) {
  var index = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  return [].concat(_toConsumableArray(array.slice(0, index)), [item], _toConsumableArray(array.slice(index)));
};
var removeItem = function removeItem(array, item) {
  var newArray = array.slice();
  newArray.splice(newArray.findIndex(function (a) {
    return a === item;
  }), 1);
  return newArray;
}; // Make sure columns have unique id's

var decorateColumns = function decorateColumns(columns) {
  return columns.map(function (column) {
    return _objectSpread2({
      id: shortid.generate()
    }, column);
  });
};
var getSortDirection = function getSortDirection(direction) {
  return direction ? 'asc' : 'desc';
};
var handleFunctionProps = function handleFunctionProps(object) {
  for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  var newObject;
  Object.keys(object).map(function (o) {
    return object[o];
  }).forEach(function (value, index) {
    var oldObject = object;

    if (typeof value === 'function') {
      newObject = _objectSpread2({}, oldObject, _defineProperty({}, Object.keys(object)[index], value.apply(void 0, args)));
      delete oldObject[value];
    }
  });
  return newObject || object;
};
var getNumberOfPages = function getNumberOfPages(rowCount, rowsPerPage) {
  return Math.ceil(rowCount / rowsPerPage);
};

function _templateObject2$3() {
  var data = _taggedTemplateLiteral(["\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n"]);

  _templateObject2$3 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject$6() {
  var data = _taggedTemplateLiteral(["\n  font-size: ", ";\n  font-weight: 400;\n  white-space: ", ";\n  min-height: ", ";\n\n  .react-data-table--cell-content {\n    color: inherit;\n    overflow: ", ";\n    text-overflow: ellipsis;\n  }\n"]);

  _templateObject$6 = function _templateObject() {
    return data;
  };

  return data;
}
var TableCellStyle = styled__default(Cell)(_templateObject$6(), function (props) {
  return props.theme.rows.fontSize;
}, function (props) {
  return props.column.wrap ? 'normal' : 'nowrap';
}, function (props) {
  return props.theme.rows.height;
}, function (props) {
  return props.column.allowOverflow ? 'visible' : 'hidden';
});
var ClickClip = styled__default.div(_templateObject2$3());
var TableCell = React.memo(function (_ref) {
  var column = _ref.column,
      row = _ref.row,
      rowClickable = _ref.rowClickable;
  return React__default.createElement(TableCellStyle, {
    column: column,
    className: "rdt_TableCell"
  }, !column.ignoreRowClick && rowClickable && React__default.createElement(ClickClip, {
    "data-tag": "___react-data-table--click-clip___"
  }), React__default.createElement("div", {
    className: "react-data-table--cell-content"
  }, column.cell ? column.cell(row) : getProperty(row, column.selector, column.format)));
});
TableCell.propTypes = {
  column: propTypes.object,
  row: propTypes.object,
  rowClickable: propTypes.bool
};
TableCell.defaultProps = {
  column: {},
  row: {},
  rowClickable: false
};

var baseCheckboxStyle = {
  fontSize: '18px',
  cursor: 'pointer',
  marginLeft: '9px'
};

var Checkbox =
/*#__PURE__*/
function (_PureComponent) {
  _inherits(Checkbox, _PureComponent);

  function Checkbox(props) {
    var _this;

    _classCallCheck(this, Checkbox);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Checkbox).call(this, props));

    _defineProperty(_assertThisInitialized(_this), "handleClick", function (e) {
      var _this$props = _this.props,
          onClick = _this$props.onClick,
          data = _this$props.data;
      onClick(data, e);
    });

    _this.checkbox = React.createRef();
    return _this;
  }

  _createClass(Checkbox, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var indeterminate = this.props.indeterminate;
      this.checkbox.current.indeterminate = indeterminate;
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      var indeterminate = this.props.indeterminate;

      if (prevProps.indeterminate !== indeterminate) {
        this.checkbox.current.indeterminate = indeterminate;
      }
    }
  }, {
    key: "render",
    value: function render() {
      // remove indeterminate to prevent browser warnings
      var _this$props2 = this.props,
          component = _this$props2.component,
          componentOptions = _this$props2.componentOptions,
          indeterminate = _this$props2.indeterminate,
          checked = _this$props2.checked,
          name = _this$props2.name,
          checkboxStatusSelector = _this$props2.checkboxStatusSelector;
      var TagName = component;
      var baseStyle = TagName !== 'input' ? componentOptions.style : baseCheckboxStyle;
      var resolvedComponentOptions = handleFunctionProps(componentOptions, indeterminate);
      return React__default.createElement(TagName, _extends({
        type: "checkbox"
      }, resolvedComponentOptions, {
        // allow this component to fully control these options
        ref: this.checkbox,
        style: baseStyle,
        onClick: this.handleClick,
        name: name,
        "aria-label": name,
        checked: checked,
        onChange: function onChange() {
          return null;
        } // prevent uncontrolled checkbox warnings -  we don't need onChange
        ,
        disabled: name !== 'select-all-rows' && !checkboxStatusSelector
      }));
    }
  }]);

  return Checkbox;
}(React.PureComponent);

_defineProperty(Checkbox, "propTypes", {
  indeterminate: propTypes.bool,
  component: propTypes.oneOfType([propTypes.string, propTypes.node, propTypes.func]),
  onClick: propTypes.func.isRequired,
  componentOptions: propTypes.object,
  data: propTypes.object,
  style: propTypes.object,
  checked: propTypes.bool,
  name: propTypes.string.isRequired,
  checkboxStatusSelector: propTypes.bool
});

_defineProperty(Checkbox, "defaultProps", {
  indeterminate: false,
  component: 'input',
  componentOptions: {
    style: {}
  },
  data: {},
  style: null,
  checked: false,
  checkboxStatusSelector: true
});

function _templateObject$7() {
  var data = _taggedTemplateLiteral(["\n  flex: 0 0 48px;\n  font-size: ", ";\n  color: ", ";\n  min-height: ", ";\n"]);

  _templateObject$7 = function _templateObject() {
    return data;
  };

  return data;
}
var TableCellCheckboxStyle = styled__default(CellBase)(_templateObject$7(), function (props) {
  return props.theme.rows.fontSize;
}, function (props) {
  return props.theme.rows.fontColor;
}, function (props) {
  return props.theme.rows.height;
});
var TableCellCheckbox = React.memo(function (_ref) {
  var checked = _ref.checked,
      row = _ref.row,
      onClick = _ref.onClick,
      checkboxStatusSelector = _ref.checkboxStatusSelector;

  var _useContext = React.useContext(DataTableContext),
      keyField = _useContext.keyField,
      selectableRowsComponent = _useContext.selectableRowsComponent,
      selectableRowsComponentProps = _useContext.selectableRowsComponentProps;

  return React__default.createElement(TableCellCheckboxStyle, {
    onClick: function onClick(e) {
      return e.stopPropagation();
    },
    className: "rdt_TableCell"
  }, React__default.createElement(Checkbox, {
    name: "select-row-".concat(row[keyField]),
    component: selectableRowsComponent,
    componentOptions: selectableRowsComponentProps,
    checked: checked,
    onClick: onClick,
    data: row,
    checkboxStatusSelector: row[checkboxStatusSelector]
  }));
});
TableCellCheckbox.propTypes = {
  row: propTypes.object,
  checked: propTypes.bool,
  onClick: propTypes.func,
  checkboxStatusSelector: propTypes.string
};
TableCellCheckbox.defaultProps = {
  row: {},
  checked: false,
  onClick: null,
  checkboxStatusSelector: ''
};

function _templateObject$8() {
  var data = _taggedTemplateLiteral(["\n  display: inline-flex;\n  outline: none;\n  border: none;\n  width: 40px;\n  height: 40px;\n  background-color: transparent;\n  color: ", ";\n\n  &:disabled {\n    color: ", ";\n  }\n\n  &:hover:enabled {\n    cursor: pointer;\n  }\n"]);

  _templateObject$8 = function _templateObject() {
    return data;
  };

  return data;
}
var ButtonStyle = styled__default.button(_templateObject$8(), function (props) {
  return props.theme.expander.expanderColor;
}, function (props) {
  return props.theme.expander.expanderColorDisabled;
});

var ExpanderButton = function ExpanderButton(_ref) {
  var expanded = _ref.expanded,
      row = _ref.row,
      onToggled = _ref.onToggled,
      disabled = _ref.disabled;

  var _React$useContext = React__default.useContext(DataTableContext),
      expandableIcon = _React$useContext.expandableIcon,
      keyField = _React$useContext.keyField;

  var icon = expanded ? expandableIcon.expanded : expandableIcon.collapsed;

  var handleToggle = function handleToggle(e) {
    return onToggled && onToggled(row, e);
  };

  return React__default.createElement(ButtonStyle, {
    onClick: handleToggle,
    "data-testid": "expander-button-".concat(row[keyField]),
    disabled: disabled,
    role: "button"
  }, icon);
};

ExpanderButton.propTypes = {
  row: propTypes.object.isRequired,
  expanded: propTypes.bool,
  onToggled: propTypes.func,
  disabled: propTypes.bool
};
ExpanderButton.defaultProps = {
  onToggled: null,
  expanded: false,
  disabled: false
};

function _templateObject$9() {
  var data = _taggedTemplateLiteral(["\n  flex: 0 0 56px;\n  white-space: nowrap;\n  font-weight: 400;\n  font-size: ", ";\n  color: ", ";\n  min-height: ", ";\n\n  &:not(:first-child) {\n    padding-left: 0;\n  }\n"]);

  _templateObject$9 = function _templateObject() {
    return data;
  };

  return data;
}
var TableCellExpanderStyle = styled__default(CellBase)(_templateObject$9(), function (props) {
  return props.theme.rows.fontSize;
}, function (props) {
  return props.theme.rows.fontColor;
}, function (props) {
  return props.theme.rows.height;
});
var TableCellExpander = React.memo(function (_ref) {
  var column = _ref.column,
      row = _ref.row,
      expanded = _ref.expanded,
      onExpandToggled = _ref.onExpandToggled,
      disabled = _ref.disabled;
  return React__default.createElement(TableCellExpanderStyle, {
    column: column,
    onClick: function onClick(e) {
      return e.stopPropagation();
    }
  }, React__default.createElement(ExpanderButton, {
    onToggled: onExpandToggled,
    row: row,
    expanded: expanded,
    disabled: disabled
  }));
});
TableCellExpander.propTypes = {
  column: propTypes.object,
  row: propTypes.object,
  expanded: propTypes.bool,
  onExpandToggled: propTypes.func.isRequired,
  disabled: propTypes.bool
};
TableCellExpander.defaultProps = {
  column: {},
  row: {},
  expanded: false,
  disabled: false
};

function _templateObject$a() {
  var data = _taggedTemplateLiteral(["\n  width: 100%;\n  box-sizing: border-box;\n  color: ", ";\n  background-color: ", ";\n"]);

  _templateObject$a = function _templateObject() {
    return data;
  };

  return data;
}
// eslint-disable-next-line arrow-body-style

var renderChildren = function renderChildren(children, data) {
  return React.Children.map(children, function (child) {
    return React.cloneElement(child, {
      data: data
    });
  });
};

var ExpanderRowStyle = styled__default.div(_templateObject$a(), function (props) {
  return props.theme.expander.fontColor;
}, function (props) {
  return props.theme.expander.backgroundColor;
});

var ExpanderRow = function ExpanderRow(_ref) {
  var data = _ref.data,
      children = _ref.children;
  return React__default.createElement(ExpanderRowStyle, {
    className: "rdt_ExpanderRow"
  }, renderChildren(children, data));
};

ExpanderRow.propTypes = {
  data: propTypes.object,
  children: propTypes.oneOfType([propTypes.arrayOf(propTypes.node), propTypes.node])
};
ExpanderRow.defaultProps = {
  data: {},
  children: null
};

function _templateObject6$1() {
  var data = _taggedTemplateLiteral(["\n  display: flex;\n  width: 100%;\n  box-sizing: border-box;\n  min-height: ", ";\n  ", ";\n  background-color: ", ";\n  color: ", ";\n  ", ";\n  ", ";\n  ", ";\n"]);

  _templateObject6$1 = function _templateObject6() {
    return data;
  };

  return data;
}

function _templateObject5$1() {
  var data = _taggedTemplateLiteral(["\n  &:hover {\n    cursor: pointer;\n  }\n"]);

  _templateObject5$1 = function _templateObject5() {
    return data;
  };

  return data;
}

function _templateObject4$2() {
  var data = _taggedTemplateLiteral(["\n  &:hover {\n    color: ", ";\n    background-color: ", ";\n    transition-duration: 0.15s;\n    transition-property: background-color;\n  }\n"]);

  _templateObject4$2 = function _templateObject4() {
    return data;
  };

  return data;
}

function _templateObject3$2() {
  var data = _taggedTemplateLiteral(["\n  &:nth-child(odd) {\n    background-color: ", ";\n  }\n"]);

  _templateObject3$2 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2$4() {
  var data = _taggedTemplateLiteral(["\n  margin-top: ", ";\n  margin-bottom: ", ";\n  border-radius: ", ";\n  border-style: solid;\n  border-width: ", ";\n  border-color: ", ";\n  ", ";\n"]);

  _templateObject2$4 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject$b() {
  var data = _taggedTemplateLiteral(["\n  border-top-style: solid;\n  border-top-width: ", ";\n  border-top-color: ", ";\n"]);

  _templateObject$b = function _templateObject() {
    return data;
  };

  return data;
}
var defaultRowsCSS = styled.css(_templateObject$b(), function (props) {
  return props.theme.rows.borderWidth;
}, function (props) {
  return props.theme.rows.borderColor;
});
var spacedRowsCSS = styled.css(_templateObject2$4(), function (props) {
  return props.theme.rows.spacingMargin || 0;
}, function (props) {
  return props.theme.rows.spacingMargin || 0;
}, function (props) {
  return props.theme.rows.spacingBorderRadius || 0;
}, function (props) {
  return props.theme.rows.borderWidth;
}, function (props) {
  return props.theme.rows.borderColor;
}, function (props) {
  return props.theme.rows.spacingShadow && "box-shadow: ".concat(props.theme.rows.spacingShadow);
});
var stripedCSS = styled.css(_templateObject3$2(), function (props) {
  return props.theme.rows.stripedColor;
});
var hightlightCSS = styled.css(_templateObject4$2(), function (props) {
  return props.theme.rows.hoverFontColor;
}, function (props) {
  return props.theme.rows.hoverBackgroundColor;
});
var pointerCSS = styled.css(_templateObject5$1());
var TableRowStyle = styled__default.div(_templateObject6$1(), function (props) {
  return props.theme.rows.height;
}, function (props) {
  return props.theme.rows.spacing === 'spaced' ? spacedRowsCSS : defaultRowsCSS;
}, function (props) {
  return props.theme.rows.backgroundColor;
}, function (props) {
  return props.theme.rows.fontColor;
}, function (props) {
  return props.striped && stripedCSS;
}, function (props) {
  return props.highlightOnHover && hightlightCSS;
}, function (props) {
  return props.pointerOnHover && pointerCSS;
});

var TableRow =
/*#__PURE__*/
function (_PureComponent) {
  _inherits(TableRow, _PureComponent);

  function TableRow(props) {
    var _this;

    _classCallCheck(this, TableRow);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(TableRow).call(this, props));

    _defineProperty(_assertThisInitialized(_this), "handleRowClick", function (e) {
      // use event delegation allow events to propogate only when the element with data-tag __react-data-table--click-clip___ is present
      if (e.target && e.target.getAttribute('data-tag') === '___react-data-table--click-clip___') {
        var _this$props = _this.props,
            onRowClicked = _this$props.onRowClicked,
            row = _this$props.row;
        onRowClicked(row, e);
      }
    });

    _defineProperty(_assertThisInitialized(_this), "toggleRowExpand", function () {
      _this.setState(function (state) {
        return {
          expanded: !state.expanded
        };
      });
    });

    _this.state = {
      expanded: props.defaultExpanded
    };
    return _this;
  }

  _createClass(TableRow, [{
    key: "render",
    value: function render() {
      var _this$props2 = this.props,
          keyField = _this$props2.keyField,
          columns = _this$props2.columns,
          row = _this$props2.row,
          onRowClicked = _this$props2.onRowClicked,
          selectableRows = _this$props2.selectableRows,
          expandableRows = _this$props2.expandableRows,
          striped = _this$props2.striped,
          highlightOnHover = _this$props2.highlightOnHover,
          pointerOnHover = _this$props2.pointerOnHover,
          expandableRowsComponent = _this$props2.expandableRowsComponent,
          expandableDisabledField = _this$props2.expandableDisabledField,
          onRowSelected = _this$props2.onRowSelected,
          isRowSelected = _this$props2.isRowSelected,
          checkboxStatusSelector = _this$props2.checkboxStatusSelector;
      var expanded = this.state.expanded;
      return React__default.createElement(React__default.Fragment, null, React__default.createElement(TableRowStyle, {
        striped: striped,
        highlightOnHover: highlightOnHover,
        pointerOnHover: pointerOnHover,
        onClick: this.handleRowClick,
        className: "rdt_TableRow"
      }, selectableRows && React__default.createElement(TableCellCheckbox, {
        checked: isRowSelected(row),
        onClick: onRowSelected,
        row: row,
        checkboxStatusSelector: checkboxStatusSelector
      }), expandableRows && React__default.createElement(TableCellExpander, {
        expanded: expanded,
        row: row,
        onExpandToggled: this.toggleRowExpand,
        disabled: row[expandableDisabledField] || false
      }), columns.map(function (column) {
        return React__default.createElement(TableCell, {
          key: "cell-".concat(column.id, "-").concat(row[keyField]),
          column: column,
          row: row,
          rowClickable: !!onRowClicked || column.button
        });
      })), expandableRows && expanded && React__default.createElement(ExpanderRow, {
        key: "expander--".concat(row[keyField]),
        data: row
      }, expandableRowsComponent));
    }
  }]);

  return TableRow;
}(React.PureComponent);

_defineProperty(TableRow, "propTypes", {
  keyField: propTypes.string.isRequired,
  columns: propTypes.array.isRequired,
  row: propTypes.object.isRequired,
  onRowClicked: propTypes.func.isRequired,
  defaultExpanded: propTypes.bool.isRequired,
  selectableRows: propTypes.bool.isRequired,
  expandableRows: propTypes.bool.isRequired,
  striped: propTypes.bool.isRequired,
  highlightOnHover: propTypes.bool.isRequired,
  pointerOnHover: propTypes.bool.isRequired,
  expandableRowsComponent: propTypes.oneOfType([propTypes.arrayOf(propTypes.node), propTypes.node, propTypes.func]).isRequired,
  expandableDisabledField: propTypes.string.isRequired,
  onRowSelected: propTypes.func.isRequired,
  isRowSelected: propTypes.func.isRequired,
  checkboxStatusSelector: propTypes.string
});

_defineProperty(TableRow, "defaultProps", {
  checkboxStatusSelector: ''
});

_defineProperty(TableRow, "contextType", DataTableContext);

function _templateObject$c() {
  var data = _taggedTemplateLiteral(["\n  padding: 2px;\n  color: inherit;\n  flex-grow: 0;\n  flex-shrink: 0;\n  ", ";\n  ", ";\n"]);

  _templateObject$c = function _templateObject() {
    return data;
  };

  return data;
}
var Icon = styled__default.span(_templateObject$c(), function (props) {
  return props.sortActive ? 'opacity: 1' : 'opacity: 0';
}, function (props) {
  return props.sortDirection === 'desc' && 'transform: rotate(180deg)';
});

var NativeSortIcon = function NativeSortIcon(_ref) {
  var sortActive = _ref.sortActive,
      sortDirection = _ref.sortDirection,
      sortIcon = _ref.sortIcon;
  return React__default.createElement(Icon, {
    sortActive: sortActive,
    sortDirection: sortDirection
  }, sortIcon);
};

NativeSortIcon.propTypes = {
  sortDirection: propTypes.string.isRequired,
  sortActive: propTypes.bool,
  sortIcon: propTypes.node
};
NativeSortIcon.defaultProps = {
  sortActive: false,
  sortIcon: React__default.createElement(React__default.Fragment, null, "\u25B2")
};

function _templateObject3$3() {
  var data = _taggedTemplateLiteral(["\n  color: ", ";\n  font-size: ", ";\n  font-weight: ", ";\n  display: inline-flex;\n  align-items: center;\n  height: 100%;\n  line-height: 1;\n  user-select: none;\n  ", ";\n\n  span.__rdt_custom_sort_icon__ {\n    i,\n    svg {\n      ", ";\n      color: inherit;\n      font-size: 18px !important;\n      height: 18px !important;\n      width: 18px !important;\n      backface-visibility: hidden;\n      transform-style: preserve-3d;\n      transition-duration: 125ms;\n      transition-property: transform;\n    }\n\n    &.asc i,\n    &.asc svg {\n      transform: rotate(180deg);\n    }\n  }\n\n  &:hover {\n    ", ";\n    ", ";\n    ", ";\n\n    span,\n    span.__rdt_custom_sort_icon__ * {\n      ", ";\n    }\n  }\n"]);

  _templateObject3$3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2$5() {
  var data = _taggedTemplateLiteral(["\n  min-height: ", ";\n"]);

  _templateObject2$5 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject$d() {
  var data = _taggedTemplateLiteral(["\n  color: ", ";\n"]);

  _templateObject$d = function _templateObject() {
    return data;
  };

  return data;
}
var activeColCSS = styled.css(_templateObject$d(), function (props) {
  return props.theme.header.fontColorActive;
});
var TableColStyle = styled__default(Cell)(_templateObject2$5(), function (props) {
  return props.theme.header.height;
});
var ColumnSortable = styled__default.div(_templateObject3$3(), function (props) {
  return props.theme.header.fontColor;
}, function (props) {
  return props.theme.header.fontSize;
}, function (props) {
  return props.theme.header.fontWeight;
}, function (props) {
  return props.sortActive && activeColCSS;
}, function (props) {
  return props.sortActive ? 'opacity: 1' : 'opacity: 0';
}, function (_ref) {
  var column = _ref.column;
  return column.sortable && 'cursor: pointer';
}, function (_ref2) {
  var column = _ref2.column;
  return column.sortable && activeColCSS;
}, function (_ref3) {
  var sortActive = _ref3.sortActive,
      column = _ref3.column;
  return !sortActive && column.sortable && 'opacity: 1';
}, function (_ref4) {
  var sortActive = _ref4.sortActive,
      column = _ref4.column;
  return !sortActive && column.sortable && 'opacity: 0.60';
});

var TableCol =
/*#__PURE__*/
function (_PureComponent) {
  _inherits(TableCol, _PureComponent);

  function TableCol() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, TableCol);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(TableCol)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _defineProperty(_assertThisInitialized(_this), "onColumnClick", function (e) {
      var _this$props = _this.props,
          column = _this$props.column,
          onColumnClick = _this$props.onColumnClick;
      var sortDirection = _this.context.sortDirection;
      onColumnClick(column, sortDirection, e);
    });

    return _this;
  }

  _createClass(TableCol, [{
    key: "renderNativeSortIcon",
    value: function renderNativeSortIcon(sortActive) {
      var column = this.props.column;
      var sortDirection = this.context.sortDirection;
      return React__default.createElement(NativeSortIcon, {
        column: column,
        sortActive: sortActive,
        sortDirection: sortDirection
      });
    }
  }, {
    key: "renderCustomSortIcon",
    value: function renderCustomSortIcon() {
      var sortIcon = this.props.sortIcon;
      var sortDirection = this.context.sortDirection;
      return React__default.createElement("span", {
        className: [sortDirection, '__rdt_custom_sort_icon__'].join(' ')
      }, sortIcon);
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props2 = this.props,
          column = _this$props2.column,
          sortIcon = _this$props2.sortIcon;
      var sortColumn = this.context.sortColumn;
      var sortActive = column.sortable && sortColumn === column.selector;
      var nativeSortIconLeft = !sortIcon && !column.right;
      var nativeSortIconRight = !sortIcon && column.right;
      var customSortIconLeft = sortIcon && !column.right;
      var customSortIconRight = sortIcon && column.right;
      return React__default.createElement(TableColStyle, {
        className: "rdt_TableCol",
        column: column // required by Cell.js

      }, column.name && React__default.createElement(ColumnSortable, {
        id: "column-".concat(column.selector),
        role: "button",
        className: "rdt_TableCol_Sortable",
        onClick: this.onColumnClick,
        sortActive: sortActive,
        column: column
      }, customSortIconRight && this.renderCustomSortIcon(), nativeSortIconRight && this.renderNativeSortIcon(sortActive), React__default.createElement("div", null, column.name), customSortIconLeft && this.renderCustomSortIcon(), nativeSortIconLeft && this.renderNativeSortIcon(sortActive)));
    }
  }]);

  return TableCol;
}(React.PureComponent);

_defineProperty(TableCol, "propTypes", {
  onColumnClick: propTypes.func.isRequired,
  column: propTypes.object.isRequired,
  sortIcon: propTypes.oneOfType([propTypes.bool, propTypes.object]).isRequired
});

_defineProperty(TableCol, "contextType", DataTableContext);

function _templateObject$e() {
  var data = _taggedTemplateLiteral(["\n  flex: 0 0 48px;\n  user-select: none;\n  white-space: nowrap;\n  font-size: ", ";\n  color: ", ";\n  min-height: ", ";\n"]);

  _templateObject$e = function _templateObject() {
    return data;
  };

  return data;
}
var TableColStyle$1 = styled__default(CellBase)(_templateObject$e(), function (props) {
  return props.theme.header.fontSize;
}, function (props) {
  return props.theme.header.fontColor;
}, function (props) {
  return props.theme.header.height;
});
var TableCol$1 = React.memo(function (_ref) {
  var onClick = _ref.onClick;

  var _useContext = React.useContext(DataTableContext),
      selectableRowsComponent = _useContext.selectableRowsComponent,
      selectableRowsComponentProps = _useContext.selectableRowsComponentProps,
      allSelected = _useContext.allSelected,
      indeterminate = _useContext.indeterminate;

  return React__default.createElement(TableColStyle$1, {
    className: "rdt_TableCol"
  }, React__default.createElement(Checkbox, {
    name: "select-all-rows",
    component: selectableRowsComponent,
    componentOptions: selectableRowsComponentProps,
    onClick: onClick,
    checked: allSelected,
    indeterminate: indeterminate
  }));
});
TableCol$1.propTypes = {
  onClick: propTypes.func
};
TableCol$1.defaultProps = {
  onClick: null
};

function _templateObject2$6() {
  var data = _taggedTemplateLiteral(["\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  background-color: ", ";\n  z-index: 1;\n  transform: ", ";\n  transition-duration: ", ";\n  transition-timing-function: cubic-bezier(0, 0, 0.2, 1);\n  transition-delay: 0;\n  will-change: transform;\n  align-items: center;\n  justify-content: space-between;\n  display: flex;\n  padding: 16px 16px 16px 24px;\n"]);

  _templateObject2$6 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject$f() {
  var data = _taggedTemplateLiteral(["\n  color: ", ";\n  font-size: ", ";\n  font-weight: 400;\n"]);

  _templateObject$f = function _templateObject() {
    return data;
  };

  return data;
}
var Title = styled__default.div(_templateObject$f(), function (props) {
  return props.theme.contextMenu.fontColor;
}, function (props) {
  return props.theme.contextMenu.fontSize;
});
var ContextMenuStyle = styled__default.div(_templateObject2$6(), function (props) {
  return props.theme.contextMenu.backgroundColor;
}, function (props) {
  return props.visible ? 'translate3d(0, 0, 0)' : 'translate3d(0, -100%, 0)';
}, function (props) {
  return props.theme.contextMenu.transitionTime;
});

var generateDefaultContextTitle = function generateDefaultContextTitle(contextTitle, selectedCount) {
  if (selectedCount === 0) {
    return null;
  }

  return contextTitle || "".concat(selectedCount, " item").concat(selectedCount > 1 ? 's' : '', " selected");
};

var ContextMenu = function ContextMenu() {
  var _useContext = React.useContext(DataTableContext),
      contextTitle = _useContext.contextTitle,
      contextActions = _useContext.contextActions,
      selectedCount = _useContext.selectedCount;

  return React__default.createElement(ContextMenuStyle, {
    visible: selectedCount > 0
  }, React__default.createElement(Title, null, generateDefaultContextTitle(contextTitle, selectedCount)), React__default.createElement("div", null, contextActions));
};

function _templateObject3$4() {
  var data = _taggedTemplateLiteral(["\n  flex: 1 0 auto;\n  display: flex;\n  align-items: center;\n  justify-content: flex-end;\n\n  > * {\n    margin-left: 5px;\n  }\n"]);

  _templateObject3$4 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2$7() {
  var data = _taggedTemplateLiteral(["\n  flex: 1 0 auto;\n  color: ", ";\n  font-size: ", ";\n  font-weight: 400;\n"]);

  _templateObject2$7 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject$g() {
  var data = _taggedTemplateLiteral(["\n  position: relative;\n  overflow: visible;\n  display: flex;\n  flex: 1 1 auto;\n  align-items: center;\n  justify-content: space-between;\n  padding: 4px 16px 4px 24px;\n  min-height: ", ";\n  width: 100%;\n  background-color: ", ";\n  flex-wrap: wrap;\n"]);

  _templateObject$g = function _templateObject() {
    return data;
  };

  return data;
}
var TableHeaderStyle = styled__default.header(_templateObject$g(), function (props) {
  return props.theme.title.height;
}, function (props) {
  return props.theme.title.backgroundColor;
});
var Title$1 = styled__default.div(_templateObject2$7(), function (props) {
  return props.theme.title.fontColor;
}, function (props) {
  return props.theme.title.fontSize;
});
var Actions = styled__default.div(_templateObject3$4());

var TableHeader = function TableHeader(_ref) {
  var title = _ref.title,
      actions = _ref.actions;
  return React__default.createElement(TableHeaderStyle, {
    className: "rdt_TableHeader"
  }, React__default.createElement(Title$1, null, title), React__default.createElement(Actions, null, actions), React__default.createElement(ContextMenu, null));
};

TableHeader.propTypes = {
  title: propTypes.oneOfType([propTypes.string, propTypes.node]).isRequired,
  actions: propTypes.oneOfType([propTypes.arrayOf(propTypes.node), propTypes.node])
};
TableHeader.defaultProps = {
  actions: []
};

function _templateObject$h() {
  var data = _taggedTemplateLiteral(["\n  position: relative;\n  display: flex;\n  flex: 1 1 auto;\n  align-items: center;\n  padding: 0 16px 8px 24px;\n  width: 100%;\n  background-color: ", ";\n  justify-content: ", ";\n  flex-wrap: ", ";\n"]);

  _templateObject$h = function _templateObject() {
    return data;
  };

  return data;
}
var alignMap = {
  left: 'flex-start',
  right: 'flex-end',
  center: 'center'
};
var SubheaderWrapper = styled__default.header(_templateObject$h(), function (props) {
  return props.theme.title.backgroundColor;
}, function (props) {
  return alignMap[props.align];
}, function (props) {
  return props.wrapContent ? 'wrap' : 'nowrap';
});

var TableSubheader = function TableSubheader(_ref) {
  var align = _ref.align,
      wrapContent = _ref.wrapContent,
      component = _ref.component;
  return React__default.createElement(SubheaderWrapper, {
    align: align,
    wrapContent: wrapContent
  }, component);
};

TableSubheader.propTypes = {
  component: propTypes.oneOfType([propTypes.arrayOf(propTypes.node), propTypes.node, propTypes.string]),
  align: propTypes.oneOf(['center', 'left', 'right']),
  wrapContent: propTypes.bool
};
TableSubheader.defaultProps = {
  component: null,
  align: 'right',
  wrapContent: true
};

function _templateObject2$8() {
  var data = _taggedTemplateLiteral(["\n    max-height: ", ";\n    overflow-y: scroll;\n  "]);

  _templateObject2$8 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject$i() {
  var data = _taggedTemplateLiteral(["\n  display: flex;\n  flex-direction: column;\n  ", ";\n"]);

  _templateObject$i = function _templateObject() {
    return data;
  };

  return data;
}
var TableBody = styled__default.div(_templateObject$i(), function (_ref) {
  var fixedHeader = _ref.fixedHeader,
      hasOffset = _ref.hasOffset,
      offset = _ref.offset,
      fixedHeaderScrollHeight = _ref.fixedHeaderScrollHeight;
  return fixedHeader && styled.css(_templateObject2$8(), hasOffset ? "calc(".concat(fixedHeaderScrollHeight, " - ").concat(offset, ")") : fixedHeaderScrollHeight);
});
TableBody.defaultProps = {
  fixedHeaderScrollHeight: '100vh',
  offset: 0
};

function _templateObject2$9() {
  var data = _taggedTemplateLiteral(["\n    padding-bottom: ", ";\n    margin-bottom: -", ";\n  "]);

  _templateObject2$9 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject$j() {
  var data = _taggedTemplateLiteral(["\n  position: relative;\n  width: 100%;\n  ", ";\n  ", ";\n"]);

  _templateObject$j = function _templateObject() {
    return data;
  };

  return data;
}
/* Hack when using layovers/menus that get clipped by overflow-x
  when a table is responsive due to overflow-xy scroll spec stupidity.
  Note: The parent element height must be set to 100%!
  https://www.brunildo.org/test/Overflowxy2.html
*/

var ResponsiveWrapper = styled__default.div(_templateObject$j(), function (props) {
  return props.responsive && 'overflow-x: auto';
}, function (props) {
  return props.overflowY && props.responsive && props.overflowYOffset && styled.css(_templateObject2$9(), props.overflowYOffset, props.overflowYOffset);
});

function _templateObject$k() {
  var data = _taggedTemplateLiteral(["\n  position: ", ";\n  ", ";\n  text-align: center;\n  display: flex;\n  justify-content: center;\n  width: 100%;\n  height: 100%;\n"]);

  _templateObject$k = function _templateObject() {
    return data;
  };

  return data;
}
var ProgressWrapperStyle = styled__default.div(_templateObject$k(), function (props) {
  return props.centered ? 'absolute' : 'relative';
}, function (props) {
  return props.centered && 'align-items: center';
});

var ProgressWrapper = function ProgressWrapper(_ref) {
  var component = _ref.component,
      centered = _ref.centered;
  return React__default.createElement(ProgressWrapperStyle, {
    centered: centered
  }, component);
};

ProgressWrapper.propTypes = {
  component: propTypes.oneOfType([propTypes.string, propTypes.node, propTypes.func]).isRequired,
  centered: propTypes.bool
};
ProgressWrapper.defaultProps = {
  centered: false
};

function _templateObject$l() {
  var data = _taggedTemplateLiteral(["\n  position: relative;\n  display: table;\n  width: 100%;\n  height: 100%;\n"]);

  _templateObject$l = function _templateObject() {
    return data;
  };

  return data;
}
var TableWrapper = styled__default.div(_templateObject$l());

function _templateObject$m() {
  var data = _taggedTemplateLiteral(["\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  width: 100%;\n  height: 100%;\n  padding: 16px;\n"]);

  _templateObject$m = function _templateObject() {
    return data;
  };

  return data;
}
var NoDataWrapperMessage = styled__default.div(_templateObject$m());

var NoDataWrapper = function NoDataWrapper(_ref) {
  var component = _ref.component;
  return React__default.createElement(NoDataWrapperMessage, null, component);
};

NoDataWrapper.propTypes = {
  component: propTypes.oneOfType([propTypes.string, propTypes.node]).isRequired
};

var DropDownIcon = (function () {
  return React__default.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: "24",
    height: "24",
    viewBox: "0 0 24 24"
  }, React__default.createElement("path", {
    d: "M7 10l5 5 5-5z"
  }), React__default.createElement("path", {
    d: "M0 0h24v24H0z",
    fill: "none"
  }));
});

function _templateObject2$a() {
  var data = _taggedTemplateLiteral(["\n  /* width: 100%; */\n  position: relative;\n  flex-shrink: 0;\n  margin-left: 8px;\n  margin-right: 32px;\n  font-size: ", ";\n  color: ", ";\n\n  svg {\n    top: 1;\n    right: 0;\n    color: ", ";\n    position: absolute;\n    pointer-events: none;\n    fill: currentColor;\n    width: 1em;\n    height: 1em;\n    display: inline-block;\n    font-size: 24px;\n    transition: fill 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;\n    user-select: none;\n    flex-shrink: 0;\n  }\n"]);

  _templateObject2$a = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject$n() {
  var data = _taggedTemplateLiteral(["\n  cursor: pointer;\n  height: 24px;\n  min-width: 24px;\n  user-select: none;\n  padding-left: 8px;\n  padding-right: 16px;\n  box-sizing: content-box;\n  font-size: ", ";\n  color: ", ";\n  outline: none;\n  border: none;\n  background-color: transparent;\n  appearance: none;\n\n  &::-ms-expand {\n    display: none;\n  }\n\n  &:disabled::-ms-expand {\n    background: #f60;\n  }\n"]);

  _templateObject$n = function _templateObject() {
    return data;
  };

  return data;
}
var SelectControl = styled__default.select(_templateObject$n(), function (props) {
  return props.theme.pagination.fontSize;
}, function (props) {
  return props.theme.pagination.fontColor;
});
var SelectWrapper = styled__default.div(_templateObject2$a(), function (props) {
  return props.theme.pagination.fontSize;
}, function (props) {
  return props.theme.pagination.fontColor;
}, function (props) {
  return props.theme.pagination.fontColor;
});

var Select = function Select(props) {
  return React__default.createElement(SelectWrapper, null, React__default.createElement(SelectControl, props), React__default.createElement(DropDownIcon, null));
};

function _templateObject3$5() {
  var data = _taggedTemplateLiteral(["\n  flex-shrink: 1;\n  font-size: ", ";\n  color: ", ";\n"]);

  _templateObject3$5 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2$b() {
  var data = _taggedTemplateLiteral(["\n  display: flex;\n  border-radius: 4px;\n  margin-left: 20px;\n  white-space: nowrap;\n"]);

  _templateObject2$b = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject$o() {
  var data = _taggedTemplateLiteral(["\n  position: relative;\n  display: block;\n  outline: none;\n  user-select: none;\n  cursor: pointer;\n  border: none;\n  border-radius: 50%;\n  background-color: transparent;\n  height: 40px;\n  width: 40px;\n  padding: 8px;\n  margin: 2px;\n  transition: 0.3s;\n\n  svg {\n    fill: ", ";\n  }\n\n  &:disabled {\n    opacity: 0.4;\n    cursor: unset;\n  }\n\n  &:hover:not(:disabled) {\n    background-color: ", ";\n  }\n"]);

  _templateObject$o = function _templateObject() {
    return data;
  };

  return data;
}
var Button = styled__default.button(_templateObject$o(), function (props) {
  return props.theme.pagination.buttonFontColor;
}, function (props) {
  return props.theme.pagination.buttonHoverBackground;
});
var PageList = styled__default.div(_templateObject2$b());
var Span = styled__default.span(_templateObject3$5(), function (props) {
  return props.theme.pagination.fontSize;
}, function (props) {
  return props.theme.pagination.fontColor;
});

var Pagination =
/*#__PURE__*/
function (_PureComponent) {
  _inherits(Pagination, _PureComponent);

  function Pagination() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, Pagination);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(Pagination)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _defineProperty(_assertThisInitialized(_this), "handlePrevious", function () {
      var _this$props = _this.props,
          onChangePage = _this$props.onChangePage,
          currentPage = _this$props.currentPage;
      onChangePage(currentPage - 1);
    });

    _defineProperty(_assertThisInitialized(_this), "handleNext", function () {
      var _this$props2 = _this.props,
          onChangePage = _this$props2.onChangePage,
          currentPage = _this$props2.currentPage;
      onChangePage(currentPage + 1);
    });

    _defineProperty(_assertThisInitialized(_this), "handleFirst", function () {
      var onChangePage = _this.props.onChangePage;
      onChangePage(1);
    });

    _defineProperty(_assertThisInitialized(_this), "handleLast", function () {
      var _this$props3 = _this.props,
          onChangePage = _this$props3.onChangePage,
          rowsPerPage = _this$props3.rowsPerPage,
          rowCount = _this$props3.rowCount;
      onChangePage(getNumberOfPages(rowCount, rowsPerPage));
    });

    _defineProperty(_assertThisInitialized(_this), "handleRowsPerPage", function (_ref) {
      var target = _ref.target;
      var _this$props4 = _this.props,
          onChangeRowsPerPage = _this$props4.onChangeRowsPerPage,
          currentPage = _this$props4.currentPage;
      onChangeRowsPerPage(Number(target.value), currentPage);
    });

    return _this;
  }

  _createClass(Pagination, [{
    key: "render",
    value: function render() {
      var _this$props5 = this.props,
          theme = _this$props5.theme,
          rowsPerPage = _this$props5.rowsPerPage,
          currentPage = _this$props5.currentPage,
          rowCount = _this$props5.rowCount;
      var _this$context = this.context,
          paginationRowsPerPageOptions = _this$context.paginationRowsPerPageOptions,
          paginationIconLastPage = _this$context.paginationIconLastPage,
          paginationIconFirstPage = _this$context.paginationIconFirstPage,
          paginationIconNext = _this$context.paginationIconNext,
          paginationIconPrevious = _this$context.paginationIconPrevious,
          paginationComponentOptions = _this$context.paginationComponentOptions;
      var numPages = getNumberOfPages(rowCount, rowsPerPage);
      var lastIndex = currentPage * rowsPerPage;
      var firstIndex = lastIndex - rowsPerPage + 1;
      var disabledLesser = currentPage === 1;
      var disabledGreater = currentPage === numPages;
      var rowsPerPageText = paginationComponentOptions.rowsPerPageText,
          rangeSeparatorText = paginationComponentOptions.rangeSeparatorText;
      var status = currentPage === numPages ? "".concat(firstIndex, "-").concat(rowCount, " ").concat(rangeSeparatorText, " ").concat(rowCount) : "".concat(firstIndex, "-").concat(lastIndex, " ").concat(rangeSeparatorText, " ").concat(rowCount);
      return React__default.createElement(React__default.Fragment, null, React__default.createElement(Span, null, rowsPerPageText), React__default.createElement(Select, {
        onChange: this.handleRowsPerPage,
        defaultValue: rowsPerPage
      }, paginationRowsPerPageOptions.map(function (num) {
        return React__default.createElement("option", {
          key: num,
          value: num
        }, num);
      })), React__default.createElement(Span, null, status), React__default.createElement(PageList, null, React__default.createElement(Button, {
        id: "pagination-first-page",
        onClick: this.handleFirst,
        disabled: disabledLesser,
        theme: theme
      }, paginationIconFirstPage), React__default.createElement(Button, {
        id: "pagination-previous-page",
        onClick: this.handlePrevious,
        disabled: disabledLesser,
        theme: theme
      }, paginationIconPrevious), React__default.createElement(Button, {
        id: "pagination-next-page",
        onClick: this.handleNext,
        disabled: disabledGreater,
        theme: theme
      }, paginationIconNext), React__default.createElement(Button, {
        id: "pagination-last-page",
        onClick: this.handleLast,
        disabled: disabledGreater,
        theme: theme
      }, paginationIconLastPage)));
    }
  }]);

  return Pagination;
}(React.PureComponent);

_defineProperty(Pagination, "propTypes", {
  rowsPerPage: propTypes.number.isRequired,
  rowCount: propTypes.number.isRequired,
  onChangePage: propTypes.func.isRequired,
  onChangeRowsPerPage: propTypes.func.isRequired,
  theme: propTypes.object.isRequired,
  currentPage: propTypes.number.isRequired
});

_defineProperty(Pagination, "contextType", DataTableContext);

var handleSelectAll = function handleSelectAll(rows, allChecked, checkboxStatusSelector) {
  var allSelected = !allChecked;
  var activeSelectedRows = rows.filter(function (row) {
    return row[checkboxStatusSelector] !== false;
  });
  return {
    allSelected: allSelected,
    selectedCount: allSelected ? activeSelectedRows.length : 0,
    selectedRows: allSelected ? activeSelectedRows : []
  };
};
var handleRowSelected = function handleRowSelected(rows, row, selectedRows, checkboxStatusSelector) {
  var activeSelectedRows = rows.filter(function (rowItem) {
    return rowItem[checkboxStatusSelector] !== false;
  });

  if (selectedRows.find(function (r) {
    return r === row;
  })) {
    return {
      selectedCount: selectedRows.length > 0 ? selectedRows.length - 1 : 0,
      allSelected: false,
      selectedRows: removeItem(selectedRows, row)
    };
  }

  return {
    selectedCount: selectedRows.length + 1,
    allSelected: selectedRows.length + 1 === activeSelectedRows.length,
    selectedRows: insertItem(selectedRows, row)
  };
};
var handleSort = function handleSort(selector, sortable, state) {
  if (sortable) {
    var sortDirection = state.sortDirection,
        sortColumn = state.sortColumn;
    var direction = sortDirection; // change sort direction only if sortColumn (currently selected column) is === the newly clicked column
    // otherwise, retain sort direction if the column is swiched

    if (sortColumn === selector) {
      direction = sortDirection === 'asc' ? 'desc' : 'asc';
    }

    return {
      sortColumn: selector,
      sortDirection: direction
    };
  }

  return _objectSpread2({}, state);
};
var clearSelected = function clearSelected(clearedRowsFlag) {
  return {
    allSelected: false,
    selectedCount: 0,
    selectedRows: [],
    clearSelectedRows: clearedRowsFlag
  };
};

var getDefaultTheme = (function () {
  return {
    title: {
      fontSize: '22px',
      fontColor: 'rgba(0,0,0,.87)',
      backgroundColor: 'transparent',
      height: '56px'
    },
    header: {
      fontSize: '12px',
      fontWeight: '500',
      fontColor: 'rgba(0,0,0,.54)',
      fontColorActive: 'rgba(0,0,0,.87)',
      backgroundColor: 'transparent',
      height: '48px'
    },
    contextMenu: {
      backgroundColor: '#e3f2fd',
      fontSize: '18px',
      fontColor: 'rgba(0,0,0,.87)',
      transitionTime: '225ms'
    },
    rows: {
      // default || spaced
      spacing: 'default',
      fontSize: '13px',
      fontColor: 'rgba(0,0,0,.87)',
      backgroundColor: 'transparent',
      borderWidth: '1px',
      borderColor: 'rgba(0,0,0,.12)',
      stripedColor: 'rgba(0,0,0,.03)',
      hoverFontColor: 'rgba(0,0,0,.87)',
      hoverBackgroundColor: 'rgba(0,0,0,.08)',
      height: '48px'
    },
    cells: {
      cellPadding: '48px'
    },
    expander: {
      fontColor: 'rgba(0,0,0,.87)',
      expanderColor: 'rgba(0,0,0,.54)',
      expanderColorDisabled: 'rgba(0,0,0,.12)',
      backgroundColor: 'transparent'
    },
    pagination: {
      fontSize: '13px',
      fontColor: 'rgba(0,0,0,.54)',
      backgroundColor: 'transparent',
      buttonFontColor: 'rgba(0,0,0,.54)',
      buttonHoverBackground: 'rgba(0,0,0,.12)'
    }
  };
});

var DataTable =
/*#__PURE__*/
function (_Component) {
  _inherits(DataTable, _Component);

  _createClass(DataTable, null, [{
    key: "getDerivedStateFromProps",
    value: function getDerivedStateFromProps(props, state) {
      // allow clearing of rows via passed clearSelectedRows toggle prop
      if (props.clearSelectedRows !== state.clearSelectedRows) {
        return clearSelected(props.clearSelectedRows);
      }

      return null;
    }
  }]);

  function DataTable(props) {
    var _this;

    _classCallCheck(this, DataTable);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(DataTable).call(this, props));

    _defineProperty(_assertThisInitialized(_this), "handleSelectAll", function () {
      var _this$props = _this.props,
          data = _this$props.data,
          checkboxStatusSelector = _this$props.checkboxStatusSelector;

      _this.setState(function (state) {
        return handleSelectAll(data, state.allSelected, checkboxStatusSelector);
      });
    });

    _defineProperty(_assertThisInitialized(_this), "handleRowSelected", function (row) {
      var _this$props2 = _this.props,
          data = _this$props2.data,
          checkboxStatusSelector = _this$props2.checkboxStatusSelector;

      _this.setState(function (state) {
        return handleRowSelected(data, row, state.selectedRows, checkboxStatusSelector);
      });
    });

    _defineProperty(_assertThisInitialized(_this), "checkIfRowSeleted", function (row) {
      var selectedRows = _this.state.selectedRows;
      return selectedRows.some(function (srow) {
        return srow === row;
      });
    });

    _defineProperty(_assertThisInitialized(_this), "handleRowClicked", function (row, e) {
      var onRowClicked = _this.props.onRowClicked;

      if (onRowClicked) {
        onRowClicked(row, e);
      }
    });

    _defineProperty(_assertThisInitialized(_this), "handleSortChange", function (column) {
      var onSort = _this.props.onSort;

      _this.setState(function (state) {
        var newState = handleSort(column.selector, column.sortable, state);

        if (column.sortable && onSort) {
          onSort(column, newState.sortDirection);
        }

        return newState;
      });
    });

    _defineProperty(_assertThisInitialized(_this), "handleChangePage", function (currentPage) {
      var _this$props3 = _this.props,
          onChangePage = _this$props3.onChangePage,
          data = _this$props3.data,
          paginationTotalRows = _this$props3.paginationTotalRows;

      _this.setState({
        currentPage: currentPage
      });

      if (onChangePage) {
        onChangePage(currentPage, paginationTotalRows || data.length);
      }
    });

    _defineProperty(_assertThisInitialized(_this), "handleChangeRowsPerPage", function (newRowsPerPage, currentPage) {
      var _this$props4 = _this.props,
          onChangeRowsPerPage = _this$props4.onChangeRowsPerPage,
          data = _this$props4.data,
          paginationTotalRows = _this$props4.paginationTotalRows,
          paginationServer = _this$props4.paginationServer;
      var rowCount = paginationTotalRows || data.length;
      var updatedPage = getNumberOfPages(rowCount, newRowsPerPage);
      var recalculatedPage = Math.min(currentPage, updatedPage);

      if (onChangeRowsPerPage) {
        onChangeRowsPerPage(newRowsPerPage, recalculatedPage);
      } // update the currentPage for client-side pagination
      // server - side should be handled by onChangeRowsPerPage


      if (!paginationServer) {
        _this.handleChangePage(recalculatedPage);
      }

      _this.setState({
        rowsPerPage: newRowsPerPage,
        currentPage: recalculatedPage
      });
    });

    var sortDirection = getSortDirection(props.defaultSortAsc);
    _this.columns = decorateColumns(props.columns);
    _this.sortedRows = memoizeOne(function (rows, defaultSortField, direction) {
      return sort(rows, defaultSortField, direction, props.sortFunction);
    });
    _this.mergeTheme = memoizeOne(function (theme, customTheme) {
      return merge_1(theme, customTheme);
    });
    _this.PaginationComponent = props.paginationComponent || Pagination;
    _this.state = {
      allSelected: false,
      selectedCount: 0,
      selectedRows: [],
      sortColumn: props.defaultSortField,
      sortDirection: sortDirection,
      clearSelectedRows: false,
      currentPage: props.paginationDefaultPage,
      rowsPerPage: props.paginationPerPage
    };
    return _this;
  }

  _createClass(DataTable, [{
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps, prevState) {
      var onTableUpdate = this.props.onTableUpdate;
      var _this$state = this.state,
          selectedRows = _this$state.selectedRows,
          sortDirection = _this$state.sortDirection,
          sortColumn = _this$state.sortColumn;

      if (onTableUpdate && (prevState.selectedRows !== selectedRows || prevState.sortDirection !== sortDirection || prevState.sortColumn !== sortColumn)) {
        var _this$state2 = this.state,
            allSelected = _this$state2.allSelected,
            selectedCount = _this$state2.selectedCount,
            clearSelectedRows = _this$state2.clearSelectedRows;
        onTableUpdate({
          allSelected: allSelected,
          selectedCount: selectedCount,
          selectedRows: selectedRows,
          sortColumn: sortColumn,
          sortDirection: sortDirection,
          clearSelectedRows: clearSelectedRows
        });
      }
    }
  }, {
    key: "calculateRows",
    value: function calculateRows() {
      var _this$props5 = this.props,
          data = _this$props5.data,
          pagination = _this$props5.pagination,
          paginationServer = _this$props5.paginationServer;
      var _this$state3 = this.state,
          currentPage = _this$state3.currentPage,
          rowsPerPage = _this$state3.rowsPerPage,
          sortDirection = _this$state3.sortDirection,
          sortColumn = _this$state3.sortColumn;
      var sortedRows = this.sortedRows(data, sortColumn, sortDirection);

      if (pagination && !paginationServer) {
        // when using client-side pagination we can just slice the data set
        var lastIndex = currentPage * rowsPerPage;
        var firstIndex = lastIndex - rowsPerPage;
        return sortedRows.slice(firstIndex, lastIndex);
      }

      return sortedRows;
    }
  }, {
    key: "renderColumns",
    value: function renderColumns() {
      var _this2 = this;

      var sortIcon = this.props.sortIcon;
      return this.columns.map(function (column) {
        return React__default.createElement(TableCol, {
          key: column.id,
          column: column,
          onColumnClick: _this2.handleSortChange,
          sortIcon: sortIcon
        });
      });
    }
  }, {
    key: "renderRows",
    value: function renderRows() {
      var _this3 = this;

      var _this$props6 = this.props,
          keyField = _this$props6.keyField,
          defaultExpandedField = _this$props6.defaultExpandedField,
          selectableRows = _this$props6.selectableRows,
          expandableRows = _this$props6.expandableRows,
          striped = _this$props6.striped,
          highlightOnHover = _this$props6.highlightOnHover,
          pointerOnHover = _this$props6.pointerOnHover,
          expandableRowsComponent = _this$props6.expandableRowsComponent,
          expandableDisabledField = _this$props6.expandableDisabledField,
          checkboxStatusSelector = _this$props6.checkboxStatusSelector;
      return this.calculateRows().map(function (row, i) {
        return React__default.createElement(TableRow, {
          key: row[keyField] || i,
          row: row,
          columns: _this3.columns,
          keyField: keyField,
          selectableRows: selectableRows,
          expandableRows: expandableRows,
          striped: striped,
          highlightOnHover: highlightOnHover,
          pointerOnHover: pointerOnHover,
          expandableRowsComponent: expandableRowsComponent,
          expandableDisabledField: expandableDisabledField,
          defaultExpanded: row[defaultExpandedField] || false,
          onRowClicked: _this3.handleRowClicked,
          onRowSelected: _this3.handleRowSelected,
          isRowSelected: _this3.checkIfRowSeleted,
          checkboxStatusSelector: checkboxStatusSelector
        });
      });
    }
  }, {
    key: "renderTableHead",
    value: function renderTableHead() {
      var _this$props7 = this.props,
          selectableRows = _this$props7.selectableRows,
          expandableRows = _this$props7.expandableRows;
      return React__default.createElement(TableHead, {
        className: "rdt_TableHead"
      }, React__default.createElement(TableHeadRow, {
        className: "rdt_TableHeadRow"
      }, selectableRows && React__default.createElement(TableCol$1, {
        onClick: this.handleSelectAll
      }), expandableRows && React__default.createElement(CellBase, {
        style: {
          flex: '0 0 56px'
        }
      }), this.renderColumns()));
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props8 = this.props,
          data = _this$props8.data,
          keyField = _this$props8.keyField,
          selectableRowsComponent = _this$props8.selectableRowsComponent,
          selectableRowsComponentProps = _this$props8.selectableRowsComponentProps,
          expandableIcon = _this$props8.expandableIcon,
          paginationTotalRows = _this$props8.paginationTotalRows,
          paginationRowsPerPageOptions = _this$props8.paginationRowsPerPageOptions,
          paginationIconLastPage = _this$props8.paginationIconLastPage,
          paginationIconFirstPage = _this$props8.paginationIconFirstPage,
          paginationIconNext = _this$props8.paginationIconNext,
          paginationIconPrevious = _this$props8.paginationIconPrevious,
          paginationComponentOptions = _this$props8.paginationComponentOptions,
          title = _this$props8.title,
          customTheme = _this$props8.customTheme,
          actions = _this$props8.actions,
          className = _this$props8.className,
          style = _this$props8.style,
          responsive = _this$props8.responsive,
          overflowY = _this$props8.overflowY,
          overflowYOffset = _this$props8.overflowYOffset,
          progressPending = _this$props8.progressPending,
          progressComponent = _this$props8.progressComponent,
          progressCentered = _this$props8.progressCentered,
          noDataComponent = _this$props8.noDataComponent,
          disabled = _this$props8.disabled,
          noHeader = _this$props8.noHeader,
          fixedHeader = _this$props8.fixedHeader,
          fixedHeaderScrollHeight = _this$props8.fixedHeaderScrollHeight,
          pagination = _this$props8.pagination,
          subHeader = _this$props8.subHeader,
          subHeaderAlign = _this$props8.subHeaderAlign,
          subHeaderWrap = _this$props8.subHeaderWrap,
          subHeaderComponent = _this$props8.subHeaderComponent,
          contextTitle = _this$props8.contextTitle,
          contextActions = _this$props8.contextActions;
      var _this$state4 = this.state,
          rowsPerPage = _this$state4.rowsPerPage,
          currentPage = _this$state4.currentPage,
          selectedRows = _this$state4.selectedRows,
          allSelected = _this$state4.allSelected,
          selectedCount = _this$state4.selectedCount,
          sortColumn = _this$state4.sortColumn,
          sortDirection = _this$state4.sortDirection;
      var theme = this.mergeTheme(getDefaultTheme(), customTheme);
      var enabledPagination = pagination && !progressPending && data.length > 0;
      var init = {
        allSelected: allSelected,
        selectedCount: selectedCount,
        sortColumn: sortColumn,
        sortDirection: sortDirection,
        keyField: keyField,
        selectableRowsComponent: selectableRowsComponent,
        selectableRowsComponentProps: selectableRowsComponentProps,
        expandableIcon: expandableIcon,
        paginationRowsPerPageOptions: paginationRowsPerPageOptions,
        paginationIconLastPage: paginationIconLastPage,
        paginationIconFirstPage: paginationIconFirstPage,
        paginationIconNext: paginationIconNext,
        paginationIconPrevious: paginationIconPrevious,
        paginationComponentOptions: paginationComponentOptions,
        contextTitle: contextTitle,
        contextActions: contextActions,
        indeterminate: selectedRows.length > 0 && !allSelected
      };
      return React__default.createElement(styled.ThemeProvider, {
        theme: theme
      }, React__default.createElement(DataTableProvider, {
        initialState: init
      }, React__default.createElement(ResponsiveWrapper, {
        responsive: responsive,
        className: className,
        style: style,
        overflowYOffset: overflowYOffset,
        overflowY: overflowY
      }, !noHeader && React__default.createElement(TableHeader, {
        title: title,
        actions: actions,
        pending: progressPending
      }), subHeader && React__default.createElement(TableSubheader, {
        align: subHeaderAlign,
        wrapContent: subHeaderWrap,
        component: subHeaderComponent
      }), React__default.createElement(TableWrapper, null, progressPending && React__default.createElement(ProgressWrapper, {
        component: progressComponent,
        centered: progressCentered
      }), !data.length > 0 && !progressPending && React__default.createElement(NoDataWrapper, {
        component: noDataComponent
      }), data.length > 0 && React__default.createElement(TableStyle, {
        disabled: disabled,
        className: "rdt_Table"
      }, this.renderTableHead(), React__default.createElement(TableBody, {
        fixedHeader: fixedHeader,
        fixedHeaderScrollHeight: fixedHeaderScrollHeight,
        hasOffset: overflowY,
        offset: overflowYOffset,
        className: "rdt_TableBody"
      }, this.renderRows())), enabledPagination && React__default.createElement(TableFooter, {
        className: "rdt_TableFooter"
      }, React__default.createElement(this.PaginationComponent, {
        onChangePage: this.handleChangePage,
        onChangeRowsPerPage: this.handleChangeRowsPerPage,
        rowCount: paginationTotalRows || data.length,
        currentPage: currentPage,
        rowsPerPage: rowsPerPage,
        theme: theme
      }))))));
    }
  }]);

  return DataTable;
}(React.Component);

_defineProperty(DataTable, "propTypes", propTypes$1);

_defineProperty(DataTable, "defaultProps", defaultProps);

module.exports = DataTable;
//# sourceMappingURL=react-data-table-component.dev.js.map
