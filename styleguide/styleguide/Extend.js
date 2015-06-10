/*
Copyright jQuery Foundation and other contributors, https://jquery.org/

This software consists of voluntary contributions made by many
individuals. For exact contribution history, see the revision history
available at https://github.com/jquery/jquery

The following license applies to all parts of this software except as
documented below:

====

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

*/

function Extend() {
		var options, name, src, copy, copyIsArray, clone, target = arguments[0] || {},
				i = 1,
				length = arguments.length,
				deep = false,
				toString = Object.prototype.toString,
				hasOwn = Object.prototype.hasOwnProperty,
				push = Array.prototype.push,
				slice = Array.prototype.slice,
				trim = String.prototype.trim,
				indexOf = Array.prototype.indexOf,
				class2type = {
					"[object Boolean]": "boolean",
					"[object Number]": "number",
					"[object String]": "string",
					"[object Function]": "function",
					"[object Array]": "array",
					"[object Date]": "date",
					"[object RegExp]": "regexp",
					"[object Object]": "object"
				},
		jQuery = {
			isFunction: function (obj) {
				return jQuery.type(obj) === "function"
			},
			isArray: Array.isArray ||
			function (obj) {
				return jQuery.type(obj) === "array"
			},
			isWindow: function (obj) {
				return obj != null && obj == obj.window
			},
			isNumeric: function (obj) {
				return !isNaN(parseFloat(obj)) && isFinite(obj)
			},
			type: function (obj) {
				return obj == null ? String(obj) : class2type[toString.call(obj)] || "object"
			},
			isPlainObject: function (obj) {
				if (!obj || jQuery.type(obj) !== "object" || obj.nodeType) {
					return false
				}
				try {
					if (obj.constructor && !hasOwn.call(obj, "constructor") && !hasOwn.call(obj.constructor.prototype, "isPrototypeOf")) {
						return false
					}
				} catch (e) {
					return false
				}
				var key;
				for (key in obj) {}
				return key === undefined || hasOwn.call(obj, key)
			}
		};
	if (typeof target === "boolean") {
		deep = target;
		target = arguments[1] || {};
		i = 2;
	}
	if (typeof target !== "object" && !jQuery.isFunction(target)) {
		target = {}
	}
	if (length === i) {
		target = this;
		--i;
	}
	for (i; i < length; i++) {
		if ((options = arguments[i]) != null) {
			for (name in options) {
				src = target[name];
				copy = options[name];
				if (target === copy) {
					continue
				}
				if (deep && copy && (jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)))) {
					if (copyIsArray) {
						copyIsArray = false;
						clone = src && jQuery.isArray(src) ? src : []
					} else {
						clone = src && jQuery.isPlainObject(src) ? src : {};
					}
					// WARNING: RECURSION
					target[name] = extend(deep, clone, copy);
				} else if (copy !== undefined) {
					target[name] = copy;
				}
			}
		}
	}
	return target;
};

module.exports = Extend;