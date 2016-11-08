;(function (Sizzle, _) {
    'use strict';

    var root;
    
    // Regular expressions
    var rsingleTag = (/^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i);
    var rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/; // A simple way to check for HTML strings
    
    var loQuery = function(selector, context) {
        return new loQuery.fn.init(selector, context);
    };
    
    _.extend(loQuery, {
        // 'this' refers to the internal element being evaluated
        addClass: function(className) {
            this.classList.add(className);
        },
        css: function(prop, value) {
            this.style[prop] = value;
        },
        hasClass: function(className) {
            return [].includes.call(this.classList, className);
        },
        removeClass: function(className) {
            this.classList.remove(className);
        },
        closest: function(selector) {
            return this.closest(selector);
        },
        parent: function() {
            return this.parentNode;
        }
    });
    
    loQuery.fn = loQuery.prototype = {
        constructor: loQuery,
        length: 0,
        get: function(num) {
            // Return all the elements in a clean array
            if (num == null) {
                return _.slice(this);
            }
            // Return just the one element from the set
            return num < 0 ? this[num + this.length] : this[num];
        },
        pushStack: function(elems) {
    
            // Build a new loQuery matched element set
            var result = _.merge(this.constructor(), elems);
    
            // Add the old object onto the stack (as a reference)
            result.prevObject = this;
    
            // Return the newly-formed element set
            return result;
        },
        splice: [].splice
    };
    
    _.extend(loQuery.fn, {
        // 'this' refers to loQuery.fn
        parent: function() {
            return this.matches('parent');
        },
        closest: function(selector) {
            return this.matches('closest', selector);
        },
        addClass: function(className) {
            return this.apply('addClass', className);
        },
        removeClass: function(className) {
            return this.apply('removeClass', className);
        },
        hasClass: function(className) {
            return this.matches('hasClass', className).length > 0;
        },
        css: function(prop, value) {
            return this.apply('css', prop, value);
        },
        apply: function(fn) {
            var args = _.slice(arguments, 1);
            _.each(this, function(elem) {
                loQuery[fn].apply(elem, args);
            });
            return this;
        },
        matches: function(fn) {
            var current,
                len = this.length,
                result = [],
                args = _.slice(arguments, 1);
            
            _.each(this, function(elem) {
                current = loQuery[fn].apply(elem, args);
                if (current) {
                    result.push(current);
                }
            });
            
            return len > 1 ? _.sortedUniq(result) : result;
        },
        find: function(selector) {
            var result,
                len = this.length;
        
            result = this.pushStack([]);
    
            _.each(this, function(elem) {
                loQuery.find(selector, elem, result);
            });
        
            return len > 1 ? _.sortedUniq(result) : result;
        },
    });
    
    var init = loQuery.fn.init = function(selector, context) {
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
    
                // CASE: _.query(html) -> _.query(array)
                if (match[1]) {
                    context = context instanceof loQuery ? context[0] : context;
    
                    // CASE: _.query(html, props)
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
                // CASE: _.query(#id)
                else {
                    elem = document.getElementById(match[2]);
    
                    if (elem) {
                        // Inject the element into the loQuery object
                        this[0] = elem;
                        this.length = 1;
                    }
                    return this;
                }
            }
            // CASE: _.query(expr, $(...))
            else if (!context) {
                return (context || root).find(selector);
            }
            // CASE: _.query(expr, context)
            else {
                return this.constructor(context).find(selector);
            }
        }
        // CASE: _.query(DOMElement)
        else if (selector.nodeType) {
            this[0] = selector;
            this.length = 1;
            return this;
        }
    };
    
    init.prototype = loQuery.fn;
    
    // Utilize Sizzle CSS selector engine
    loQuery.find = Sizzle;
    
    root = loQuery(document);
    
    _.query = window.loQuery = loQuery;

}(Sizzle, window._));