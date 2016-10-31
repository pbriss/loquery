;(function () {
	'use strict';

    var arr = [];
    var slice = arr.slice;

	var pQuery = function(selector, context) {
        return new pQuery.fn.init(selector, context);
	};

    pQuery.fn = pQuery.prototype = {
        constructor: pQuery,
        length: 0,
        toArray: function() {
            return slice.call(this);
        }
    };

    pQuery.fn.init = function(selector, context) {
        var elem;

        if (!selector) {
            return this;
        }

        elem = document.getElementById(selector);

        if (elem) {
            this[0] = elem;
            this.length = 1;
        }

        return this;
    };

    Object.assign(pQuery, {
        parent: function() {

        },
        css: function(prop, value) {
            this.style[prop] = value;
        }
    });

	window._ = window.pQuery = pQuery;
}());