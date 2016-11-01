;(function (_) {
	'use strict';

    var root;
    var arr = [];
    var slice = arr.slice;

    // Regular expressions
    var rsingleTag = (/^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i);
    var rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/; // A simple way to check for HTML strings

    var pQuery = function(selector, context) {
        return new pQuery.fn.init(selector, context);
    };

    pQuery.fn = pQuery.prototype = {
        constructor: pQuery,
        length: 0,
        toArray: function() {
            return slice.call(this);
        },
        get: function(num) {
            // Return all the elements in a clean array
            if (num == null) {
                return slice.call(this);
            }
            // Return just the one element from the set
            return num < 0 ? this[num + this.length] : this[num];
        },
        pushStack: function(elems) {

            // Build a new jQuery matched element set
            var result = _.merge(this.constructor(), elems);

            // Add the old object onto the stack (as a reference)
            result.prevObject = this;

            // Return the newly-formed element set
            return result;
        },
    };

    _.extend(pQuery.fn, {
        find: function(selector) {
            var i, result,
                len = this.length,
                self = this;

            result = this.pushStack([]);

            for (i = 0; i < len; i++) {
                pQuery.find(selector, self[i], result);
            }

            return len > 1 ? _.sortedUniq(result) : result;
        },
        parent: function() {

        },
        css: function(prop, value) {
            this.style[prop] = value;
        }
    });

    var init = pQuery.fn.init = function(selector, context) {
        var elem, match;

        if (!selector) {
            return this;
        }

        if (typeof selector === 'string') {
            // String is wrapped in '<>', we can skip the regex check
            if (selector[0] === '<' && selector[selector.length - 1] === '>' && selector.length >= 3) {
                match = [null, selector, null];
            }
            else {
                match = rquickExpr.exec(selector);
            }

            // Match html or make sure no context is specified for #id
            if (match && (match[1] || !context)) {

                // CASE: pq(html) -> pq(array)
                if (match[1]) {
                    context = context instanceof pQuery ? context[0] : context;

                    // CASE: pq(html, props)
                    if (rsingleTag.test(match[1]) && _.isPlainObject(context)) {
                        for (match in context) {
                            // Properties of context are called as methods if possible
                            if (_.isFunction(this[match])) {
                                this[match](context[match]);

                                // ...and otherwise set as attributes
                            }
                            else {
                                this.attr(match, context[match]);
                            }
                        }
                    }
                    return this;
                }
                // CASE: pq(#id)
                else {
                    elem = document.getElementById(match[2]);

                    if (elem) {
                        // Inject the element into the pQuery object
                        this[0] = elem;
                        this.length = 1;
                    }
                    return this;
                }
            }
            // CASE: pq(expr, $(...))
            else if (!context || context.jquery) {
                return (context || root).find(selector);
            }
            // CASE: pq(expr, context)
            else {
                return this.constructor(context).find(selector);
            }
        }
        // CASE: pq(DOMElement)
        else if (selector.nodeType) {
            this[0] = selector;
            this.length = 1;
            return this;
        }
    };

    init.prototype = pQuery.fn;

    root = pQuery(document);

	_.query = window.pQuery = pQuery;

}(window._));