(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["main"],{

/***/ "./node_modules/hammerjs/hammer.js":
/*!*****************************************!*\
  !*** ./node_modules/hammerjs/hammer.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;/*! Hammer.JS - v2.0.7 - 2016-04-22
 * http://hammerjs.github.io/
 *
 * Copyright (c) 2016 Jorik Tangelder;
 * Licensed under the MIT license */
(function(window, document, exportName, undefined) {
  'use strict';

var VENDOR_PREFIXES = ['', 'webkit', 'Moz', 'MS', 'ms', 'o'];
var TEST_ELEMENT = document.createElement('div');

var TYPE_FUNCTION = 'function';

var round = Math.round;
var abs = Math.abs;
var now = Date.now;

/**
 * set a timeout with a given scope
 * @param {Function} fn
 * @param {Number} timeout
 * @param {Object} context
 * @returns {number}
 */
function setTimeoutContext(fn, timeout, context) {
    return setTimeout(bindFn(fn, context), timeout);
}

/**
 * if the argument is an array, we want to execute the fn on each entry
 * if it aint an array we don't want to do a thing.
 * this is used by all the methods that accept a single and array argument.
 * @param {*|Array} arg
 * @param {String} fn
 * @param {Object} [context]
 * @returns {Boolean}
 */
function invokeArrayArg(arg, fn, context) {
    if (Array.isArray(arg)) {
        each(arg, context[fn], context);
        return true;
    }
    return false;
}

/**
 * walk objects and arrays
 * @param {Object} obj
 * @param {Function} iterator
 * @param {Object} context
 */
function each(obj, iterator, context) {
    var i;

    if (!obj) {
        return;
    }

    if (obj.forEach) {
        obj.forEach(iterator, context);
    } else if (obj.length !== undefined) {
        i = 0;
        while (i < obj.length) {
            iterator.call(context, obj[i], i, obj);
            i++;
        }
    } else {
        for (i in obj) {
            obj.hasOwnProperty(i) && iterator.call(context, obj[i], i, obj);
        }
    }
}

/**
 * wrap a method with a deprecation warning and stack trace
 * @param {Function} method
 * @param {String} name
 * @param {String} message
 * @returns {Function} A new function wrapping the supplied method.
 */
function deprecate(method, name, message) {
    var deprecationMessage = 'DEPRECATED METHOD: ' + name + '\n' + message + ' AT \n';
    return function() {
        var e = new Error('get-stack-trace');
        var stack = e && e.stack ? e.stack.replace(/^[^\(]+?[\n$]/gm, '')
            .replace(/^\s+at\s+/gm, '')
            .replace(/^Object.<anonymous>\s*\(/gm, '{anonymous}()@') : 'Unknown Stack Trace';

        var log = window.console && (window.console.warn || window.console.log);
        if (log) {
            log.call(window.console, deprecationMessage, stack);
        }
        return method.apply(this, arguments);
    };
}

/**
 * extend object.
 * means that properties in dest will be overwritten by the ones in src.
 * @param {Object} target
 * @param {...Object} objects_to_assign
 * @returns {Object} target
 */
var assign;
if (typeof Object.assign !== 'function') {
    assign = function assign(target) {
        if (target === undefined || target === null) {
            throw new TypeError('Cannot convert undefined or null to object');
        }

        var output = Object(target);
        for (var index = 1; index < arguments.length; index++) {
            var source = arguments[index];
            if (source !== undefined && source !== null) {
                for (var nextKey in source) {
                    if (source.hasOwnProperty(nextKey)) {
                        output[nextKey] = source[nextKey];
                    }
                }
            }
        }
        return output;
    };
} else {
    assign = Object.assign;
}

/**
 * extend object.
 * means that properties in dest will be overwritten by the ones in src.
 * @param {Object} dest
 * @param {Object} src
 * @param {Boolean} [merge=false]
 * @returns {Object} dest
 */
var extend = deprecate(function extend(dest, src, merge) {
    var keys = Object.keys(src);
    var i = 0;
    while (i < keys.length) {
        if (!merge || (merge && dest[keys[i]] === undefined)) {
            dest[keys[i]] = src[keys[i]];
        }
        i++;
    }
    return dest;
}, 'extend', 'Use `assign`.');

/**
 * merge the values from src in the dest.
 * means that properties that exist in dest will not be overwritten by src
 * @param {Object} dest
 * @param {Object} src
 * @returns {Object} dest
 */
var merge = deprecate(function merge(dest, src) {
    return extend(dest, src, true);
}, 'merge', 'Use `assign`.');

/**
 * simple class inheritance
 * @param {Function} child
 * @param {Function} base
 * @param {Object} [properties]
 */
function inherit(child, base, properties) {
    var baseP = base.prototype,
        childP;

    childP = child.prototype = Object.create(baseP);
    childP.constructor = child;
    childP._super = baseP;

    if (properties) {
        assign(childP, properties);
    }
}

/**
 * simple function bind
 * @param {Function} fn
 * @param {Object} context
 * @returns {Function}
 */
function bindFn(fn, context) {
    return function boundFn() {
        return fn.apply(context, arguments);
    };
}

/**
 * let a boolean value also be a function that must return a boolean
 * this first item in args will be used as the context
 * @param {Boolean|Function} val
 * @param {Array} [args]
 * @returns {Boolean}
 */
function boolOrFn(val, args) {
    if (typeof val == TYPE_FUNCTION) {
        return val.apply(args ? args[0] || undefined : undefined, args);
    }
    return val;
}

/**
 * use the val2 when val1 is undefined
 * @param {*} val1
 * @param {*} val2
 * @returns {*}
 */
function ifUndefined(val1, val2) {
    return (val1 === undefined) ? val2 : val1;
}

/**
 * addEventListener with multiple events at once
 * @param {EventTarget} target
 * @param {String} types
 * @param {Function} handler
 */
function addEventListeners(target, types, handler) {
    each(splitStr(types), function(type) {
        target.addEventListener(type, handler, false);
    });
}

/**
 * removeEventListener with multiple events at once
 * @param {EventTarget} target
 * @param {String} types
 * @param {Function} handler
 */
function removeEventListeners(target, types, handler) {
    each(splitStr(types), function(type) {
        target.removeEventListener(type, handler, false);
    });
}

/**
 * find if a node is in the given parent
 * @method hasParent
 * @param {HTMLElement} node
 * @param {HTMLElement} parent
 * @return {Boolean} found
 */
function hasParent(node, parent) {
    while (node) {
        if (node == parent) {
            return true;
        }
        node = node.parentNode;
    }
    return false;
}

/**
 * small indexOf wrapper
 * @param {String} str
 * @param {String} find
 * @returns {Boolean} found
 */
function inStr(str, find) {
    return str.indexOf(find) > -1;
}

/**
 * split string on whitespace
 * @param {String} str
 * @returns {Array} words
 */
function splitStr(str) {
    return str.trim().split(/\s+/g);
}

/**
 * find if a array contains the object using indexOf or a simple polyFill
 * @param {Array} src
 * @param {String} find
 * @param {String} [findByKey]
 * @return {Boolean|Number} false when not found, or the index
 */
function inArray(src, find, findByKey) {
    if (src.indexOf && !findByKey) {
        return src.indexOf(find);
    } else {
        var i = 0;
        while (i < src.length) {
            if ((findByKey && src[i][findByKey] == find) || (!findByKey && src[i] === find)) {
                return i;
            }
            i++;
        }
        return -1;
    }
}

/**
 * convert array-like objects to real arrays
 * @param {Object} obj
 * @returns {Array}
 */
function toArray(obj) {
    return Array.prototype.slice.call(obj, 0);
}

/**
 * unique array with objects based on a key (like 'id') or just by the array's value
 * @param {Array} src [{id:1},{id:2},{id:1}]
 * @param {String} [key]
 * @param {Boolean} [sort=False]
 * @returns {Array} [{id:1},{id:2}]
 */
function uniqueArray(src, key, sort) {
    var results = [];
    var values = [];
    var i = 0;

    while (i < src.length) {
        var val = key ? src[i][key] : src[i];
        if (inArray(values, val) < 0) {
            results.push(src[i]);
        }
        values[i] = val;
        i++;
    }

    if (sort) {
        if (!key) {
            results = results.sort();
        } else {
            results = results.sort(function sortUniqueArray(a, b) {
                return a[key] > b[key];
            });
        }
    }

    return results;
}

/**
 * get the prefixed property
 * @param {Object} obj
 * @param {String} property
 * @returns {String|Undefined} prefixed
 */
function prefixed(obj, property) {
    var prefix, prop;
    var camelProp = property[0].toUpperCase() + property.slice(1);

    var i = 0;
    while (i < VENDOR_PREFIXES.length) {
        prefix = VENDOR_PREFIXES[i];
        prop = (prefix) ? prefix + camelProp : property;

        if (prop in obj) {
            return prop;
        }
        i++;
    }
    return undefined;
}

/**
 * get a unique id
 * @returns {number} uniqueId
 */
var _uniqueId = 1;
function uniqueId() {
    return _uniqueId++;
}

/**
 * get the window object of an element
 * @param {HTMLElement} element
 * @returns {DocumentView|Window}
 */
function getWindowForElement(element) {
    var doc = element.ownerDocument || element;
    return (doc.defaultView || doc.parentWindow || window);
}

var MOBILE_REGEX = /mobile|tablet|ip(ad|hone|od)|android/i;

var SUPPORT_TOUCH = ('ontouchstart' in window);
var SUPPORT_POINTER_EVENTS = prefixed(window, 'PointerEvent') !== undefined;
var SUPPORT_ONLY_TOUCH = SUPPORT_TOUCH && MOBILE_REGEX.test(navigator.userAgent);

var INPUT_TYPE_TOUCH = 'touch';
var INPUT_TYPE_PEN = 'pen';
var INPUT_TYPE_MOUSE = 'mouse';
var INPUT_TYPE_KINECT = 'kinect';

var COMPUTE_INTERVAL = 25;

var INPUT_START = 1;
var INPUT_MOVE = 2;
var INPUT_END = 4;
var INPUT_CANCEL = 8;

var DIRECTION_NONE = 1;
var DIRECTION_LEFT = 2;
var DIRECTION_RIGHT = 4;
var DIRECTION_UP = 8;
var DIRECTION_DOWN = 16;

var DIRECTION_HORIZONTAL = DIRECTION_LEFT | DIRECTION_RIGHT;
var DIRECTION_VERTICAL = DIRECTION_UP | DIRECTION_DOWN;
var DIRECTION_ALL = DIRECTION_HORIZONTAL | DIRECTION_VERTICAL;

var PROPS_XY = ['x', 'y'];
var PROPS_CLIENT_XY = ['clientX', 'clientY'];

/**
 * create new input type manager
 * @param {Manager} manager
 * @param {Function} callback
 * @returns {Input}
 * @constructor
 */
function Input(manager, callback) {
    var self = this;
    this.manager = manager;
    this.callback = callback;
    this.element = manager.element;
    this.target = manager.options.inputTarget;

    // smaller wrapper around the handler, for the scope and the enabled state of the manager,
    // so when disabled the input events are completely bypassed.
    this.domHandler = function(ev) {
        if (boolOrFn(manager.options.enable, [manager])) {
            self.handler(ev);
        }
    };

    this.init();

}

Input.prototype = {
    /**
     * should handle the inputEvent data and trigger the callback
     * @virtual
     */
    handler: function() { },

    /**
     * bind the events
     */
    init: function() {
        this.evEl && addEventListeners(this.element, this.evEl, this.domHandler);
        this.evTarget && addEventListeners(this.target, this.evTarget, this.domHandler);
        this.evWin && addEventListeners(getWindowForElement(this.element), this.evWin, this.domHandler);
    },

    /**
     * unbind the events
     */
    destroy: function() {
        this.evEl && removeEventListeners(this.element, this.evEl, this.domHandler);
        this.evTarget && removeEventListeners(this.target, this.evTarget, this.domHandler);
        this.evWin && removeEventListeners(getWindowForElement(this.element), this.evWin, this.domHandler);
    }
};

/**
 * create new input type manager
 * called by the Manager constructor
 * @param {Hammer} manager
 * @returns {Input}
 */
function createInputInstance(manager) {
    var Type;
    var inputClass = manager.options.inputClass;

    if (inputClass) {
        Type = inputClass;
    } else if (SUPPORT_POINTER_EVENTS) {
        Type = PointerEventInput;
    } else if (SUPPORT_ONLY_TOUCH) {
        Type = TouchInput;
    } else if (!SUPPORT_TOUCH) {
        Type = MouseInput;
    } else {
        Type = TouchMouseInput;
    }
    return new (Type)(manager, inputHandler);
}

/**
 * handle input events
 * @param {Manager} manager
 * @param {String} eventType
 * @param {Object} input
 */
function inputHandler(manager, eventType, input) {
    var pointersLen = input.pointers.length;
    var changedPointersLen = input.changedPointers.length;
    var isFirst = (eventType & INPUT_START && (pointersLen - changedPointersLen === 0));
    var isFinal = (eventType & (INPUT_END | INPUT_CANCEL) && (pointersLen - changedPointersLen === 0));

    input.isFirst = !!isFirst;
    input.isFinal = !!isFinal;

    if (isFirst) {
        manager.session = {};
    }

    // source event is the normalized value of the domEvents
    // like 'touchstart, mouseup, pointerdown'
    input.eventType = eventType;

    // compute scale, rotation etc
    computeInputData(manager, input);

    // emit secret event
    manager.emit('hammer.input', input);

    manager.recognize(input);
    manager.session.prevInput = input;
}

/**
 * extend the data with some usable properties like scale, rotate, velocity etc
 * @param {Object} manager
 * @param {Object} input
 */
function computeInputData(manager, input) {
    var session = manager.session;
    var pointers = input.pointers;
    var pointersLength = pointers.length;

    // store the first input to calculate the distance and direction
    if (!session.firstInput) {
        session.firstInput = simpleCloneInputData(input);
    }

    // to compute scale and rotation we need to store the multiple touches
    if (pointersLength > 1 && !session.firstMultiple) {
        session.firstMultiple = simpleCloneInputData(input);
    } else if (pointersLength === 1) {
        session.firstMultiple = false;
    }

    var firstInput = session.firstInput;
    var firstMultiple = session.firstMultiple;
    var offsetCenter = firstMultiple ? firstMultiple.center : firstInput.center;

    var center = input.center = getCenter(pointers);
    input.timeStamp = now();
    input.deltaTime = input.timeStamp - firstInput.timeStamp;

    input.angle = getAngle(offsetCenter, center);
    input.distance = getDistance(offsetCenter, center);

    computeDeltaXY(session, input);
    input.offsetDirection = getDirection(input.deltaX, input.deltaY);

    var overallVelocity = getVelocity(input.deltaTime, input.deltaX, input.deltaY);
    input.overallVelocityX = overallVelocity.x;
    input.overallVelocityY = overallVelocity.y;
    input.overallVelocity = (abs(overallVelocity.x) > abs(overallVelocity.y)) ? overallVelocity.x : overallVelocity.y;

    input.scale = firstMultiple ? getScale(firstMultiple.pointers, pointers) : 1;
    input.rotation = firstMultiple ? getRotation(firstMultiple.pointers, pointers) : 0;

    input.maxPointers = !session.prevInput ? input.pointers.length : ((input.pointers.length >
        session.prevInput.maxPointers) ? input.pointers.length : session.prevInput.maxPointers);

    computeIntervalInputData(session, input);

    // find the correct target
    var target = manager.element;
    if (hasParent(input.srcEvent.target, target)) {
        target = input.srcEvent.target;
    }
    input.target = target;
}

function computeDeltaXY(session, input) {
    var center = input.center;
    var offset = session.offsetDelta || {};
    var prevDelta = session.prevDelta || {};
    var prevInput = session.prevInput || {};

    if (input.eventType === INPUT_START || prevInput.eventType === INPUT_END) {
        prevDelta = session.prevDelta = {
            x: prevInput.deltaX || 0,
            y: prevInput.deltaY || 0
        };

        offset = session.offsetDelta = {
            x: center.x,
            y: center.y
        };
    }

    input.deltaX = prevDelta.x + (center.x - offset.x);
    input.deltaY = prevDelta.y + (center.y - offset.y);
}

/**
 * velocity is calculated every x ms
 * @param {Object} session
 * @param {Object} input
 */
function computeIntervalInputData(session, input) {
    var last = session.lastInterval || input,
        deltaTime = input.timeStamp - last.timeStamp,
        velocity, velocityX, velocityY, direction;

    if (input.eventType != INPUT_CANCEL && (deltaTime > COMPUTE_INTERVAL || last.velocity === undefined)) {
        var deltaX = input.deltaX - last.deltaX;
        var deltaY = input.deltaY - last.deltaY;

        var v = getVelocity(deltaTime, deltaX, deltaY);
        velocityX = v.x;
        velocityY = v.y;
        velocity = (abs(v.x) > abs(v.y)) ? v.x : v.y;
        direction = getDirection(deltaX, deltaY);

        session.lastInterval = input;
    } else {
        // use latest velocity info if it doesn't overtake a minimum period
        velocity = last.velocity;
        velocityX = last.velocityX;
        velocityY = last.velocityY;
        direction = last.direction;
    }

    input.velocity = velocity;
    input.velocityX = velocityX;
    input.velocityY = velocityY;
    input.direction = direction;
}

/**
 * create a simple clone from the input used for storage of firstInput and firstMultiple
 * @param {Object} input
 * @returns {Object} clonedInputData
 */
function simpleCloneInputData(input) {
    // make a simple copy of the pointers because we will get a reference if we don't
    // we only need clientXY for the calculations
    var pointers = [];
    var i = 0;
    while (i < input.pointers.length) {
        pointers[i] = {
            clientX: round(input.pointers[i].clientX),
            clientY: round(input.pointers[i].clientY)
        };
        i++;
    }

    return {
        timeStamp: now(),
        pointers: pointers,
        center: getCenter(pointers),
        deltaX: input.deltaX,
        deltaY: input.deltaY
    };
}

/**
 * get the center of all the pointers
 * @param {Array} pointers
 * @return {Object} center contains `x` and `y` properties
 */
function getCenter(pointers) {
    var pointersLength = pointers.length;

    // no need to loop when only one touch
    if (pointersLength === 1) {
        return {
            x: round(pointers[0].clientX),
            y: round(pointers[0].clientY)
        };
    }

    var x = 0, y = 0, i = 0;
    while (i < pointersLength) {
        x += pointers[i].clientX;
        y += pointers[i].clientY;
        i++;
    }

    return {
        x: round(x / pointersLength),
        y: round(y / pointersLength)
    };
}

/**
 * calculate the velocity between two points. unit is in px per ms.
 * @param {Number} deltaTime
 * @param {Number} x
 * @param {Number} y
 * @return {Object} velocity `x` and `y`
 */
function getVelocity(deltaTime, x, y) {
    return {
        x: x / deltaTime || 0,
        y: y / deltaTime || 0
    };
}

/**
 * get the direction between two points
 * @param {Number} x
 * @param {Number} y
 * @return {Number} direction
 */
function getDirection(x, y) {
    if (x === y) {
        return DIRECTION_NONE;
    }

    if (abs(x) >= abs(y)) {
        return x < 0 ? DIRECTION_LEFT : DIRECTION_RIGHT;
    }
    return y < 0 ? DIRECTION_UP : DIRECTION_DOWN;
}

/**
 * calculate the absolute distance between two points
 * @param {Object} p1 {x, y}
 * @param {Object} p2 {x, y}
 * @param {Array} [props] containing x and y keys
 * @return {Number} distance
 */
function getDistance(p1, p2, props) {
    if (!props) {
        props = PROPS_XY;
    }
    var x = p2[props[0]] - p1[props[0]],
        y = p2[props[1]] - p1[props[1]];

    return Math.sqrt((x * x) + (y * y));
}

/**
 * calculate the angle between two coordinates
 * @param {Object} p1
 * @param {Object} p2
 * @param {Array} [props] containing x and y keys
 * @return {Number} angle
 */
function getAngle(p1, p2, props) {
    if (!props) {
        props = PROPS_XY;
    }
    var x = p2[props[0]] - p1[props[0]],
        y = p2[props[1]] - p1[props[1]];
    return Math.atan2(y, x) * 180 / Math.PI;
}

/**
 * calculate the rotation degrees between two pointersets
 * @param {Array} start array of pointers
 * @param {Array} end array of pointers
 * @return {Number} rotation
 */
function getRotation(start, end) {
    return getAngle(end[1], end[0], PROPS_CLIENT_XY) + getAngle(start[1], start[0], PROPS_CLIENT_XY);
}

/**
 * calculate the scale factor between two pointersets
 * no scale is 1, and goes down to 0 when pinched together, and bigger when pinched out
 * @param {Array} start array of pointers
 * @param {Array} end array of pointers
 * @return {Number} scale
 */
function getScale(start, end) {
    return getDistance(end[0], end[1], PROPS_CLIENT_XY) / getDistance(start[0], start[1], PROPS_CLIENT_XY);
}

var MOUSE_INPUT_MAP = {
    mousedown: INPUT_START,
    mousemove: INPUT_MOVE,
    mouseup: INPUT_END
};

var MOUSE_ELEMENT_EVENTS = 'mousedown';
var MOUSE_WINDOW_EVENTS = 'mousemove mouseup';

/**
 * Mouse events input
 * @constructor
 * @extends Input
 */
function MouseInput() {
    this.evEl = MOUSE_ELEMENT_EVENTS;
    this.evWin = MOUSE_WINDOW_EVENTS;

    this.pressed = false; // mousedown state

    Input.apply(this, arguments);
}

inherit(MouseInput, Input, {
    /**
     * handle mouse events
     * @param {Object} ev
     */
    handler: function MEhandler(ev) {
        var eventType = MOUSE_INPUT_MAP[ev.type];

        // on start we want to have the left mouse button down
        if (eventType & INPUT_START && ev.button === 0) {
            this.pressed = true;
        }

        if (eventType & INPUT_MOVE && ev.which !== 1) {
            eventType = INPUT_END;
        }

        // mouse must be down
        if (!this.pressed) {
            return;
        }

        if (eventType & INPUT_END) {
            this.pressed = false;
        }

        this.callback(this.manager, eventType, {
            pointers: [ev],
            changedPointers: [ev],
            pointerType: INPUT_TYPE_MOUSE,
            srcEvent: ev
        });
    }
});

var POINTER_INPUT_MAP = {
    pointerdown: INPUT_START,
    pointermove: INPUT_MOVE,
    pointerup: INPUT_END,
    pointercancel: INPUT_CANCEL,
    pointerout: INPUT_CANCEL
};

// in IE10 the pointer types is defined as an enum
var IE10_POINTER_TYPE_ENUM = {
    2: INPUT_TYPE_TOUCH,
    3: INPUT_TYPE_PEN,
    4: INPUT_TYPE_MOUSE,
    5: INPUT_TYPE_KINECT // see https://twitter.com/jacobrossi/status/480596438489890816
};

var POINTER_ELEMENT_EVENTS = 'pointerdown';
var POINTER_WINDOW_EVENTS = 'pointermove pointerup pointercancel';

// IE10 has prefixed support, and case-sensitive
if (window.MSPointerEvent && !window.PointerEvent) {
    POINTER_ELEMENT_EVENTS = 'MSPointerDown';
    POINTER_WINDOW_EVENTS = 'MSPointerMove MSPointerUp MSPointerCancel';
}

/**
 * Pointer events input
 * @constructor
 * @extends Input
 */
function PointerEventInput() {
    this.evEl = POINTER_ELEMENT_EVENTS;
    this.evWin = POINTER_WINDOW_EVENTS;

    Input.apply(this, arguments);

    this.store = (this.manager.session.pointerEvents = []);
}

inherit(PointerEventInput, Input, {
    /**
     * handle mouse events
     * @param {Object} ev
     */
    handler: function PEhandler(ev) {
        var store = this.store;
        var removePointer = false;

        var eventTypeNormalized = ev.type.toLowerCase().replace('ms', '');
        var eventType = POINTER_INPUT_MAP[eventTypeNormalized];
        var pointerType = IE10_POINTER_TYPE_ENUM[ev.pointerType] || ev.pointerType;

        var isTouch = (pointerType == INPUT_TYPE_TOUCH);

        // get index of the event in the store
        var storeIndex = inArray(store, ev.pointerId, 'pointerId');

        // start and mouse must be down
        if (eventType & INPUT_START && (ev.button === 0 || isTouch)) {
            if (storeIndex < 0) {
                store.push(ev);
                storeIndex = store.length - 1;
            }
        } else if (eventType & (INPUT_END | INPUT_CANCEL)) {
            removePointer = true;
        }

        // it not found, so the pointer hasn't been down (so it's probably a hover)
        if (storeIndex < 0) {
            return;
        }

        // update the event in the store
        store[storeIndex] = ev;

        this.callback(this.manager, eventType, {
            pointers: store,
            changedPointers: [ev],
            pointerType: pointerType,
            srcEvent: ev
        });

        if (removePointer) {
            // remove from the store
            store.splice(storeIndex, 1);
        }
    }
});

var SINGLE_TOUCH_INPUT_MAP = {
    touchstart: INPUT_START,
    touchmove: INPUT_MOVE,
    touchend: INPUT_END,
    touchcancel: INPUT_CANCEL
};

var SINGLE_TOUCH_TARGET_EVENTS = 'touchstart';
var SINGLE_TOUCH_WINDOW_EVENTS = 'touchstart touchmove touchend touchcancel';

/**
 * Touch events input
 * @constructor
 * @extends Input
 */
function SingleTouchInput() {
    this.evTarget = SINGLE_TOUCH_TARGET_EVENTS;
    this.evWin = SINGLE_TOUCH_WINDOW_EVENTS;
    this.started = false;

    Input.apply(this, arguments);
}

inherit(SingleTouchInput, Input, {
    handler: function TEhandler(ev) {
        var type = SINGLE_TOUCH_INPUT_MAP[ev.type];

        // should we handle the touch events?
        if (type === INPUT_START) {
            this.started = true;
        }

        if (!this.started) {
            return;
        }

        var touches = normalizeSingleTouches.call(this, ev, type);

        // when done, reset the started state
        if (type & (INPUT_END | INPUT_CANCEL) && touches[0].length - touches[1].length === 0) {
            this.started = false;
        }

        this.callback(this.manager, type, {
            pointers: touches[0],
            changedPointers: touches[1],
            pointerType: INPUT_TYPE_TOUCH,
            srcEvent: ev
        });
    }
});

/**
 * @this {TouchInput}
 * @param {Object} ev
 * @param {Number} type flag
 * @returns {undefined|Array} [all, changed]
 */
function normalizeSingleTouches(ev, type) {
    var all = toArray(ev.touches);
    var changed = toArray(ev.changedTouches);

    if (type & (INPUT_END | INPUT_CANCEL)) {
        all = uniqueArray(all.concat(changed), 'identifier', true);
    }

    return [all, changed];
}

var TOUCH_INPUT_MAP = {
    touchstart: INPUT_START,
    touchmove: INPUT_MOVE,
    touchend: INPUT_END,
    touchcancel: INPUT_CANCEL
};

var TOUCH_TARGET_EVENTS = 'touchstart touchmove touchend touchcancel';

/**
 * Multi-user touch events input
 * @constructor
 * @extends Input
 */
function TouchInput() {
    this.evTarget = TOUCH_TARGET_EVENTS;
    this.targetIds = {};

    Input.apply(this, arguments);
}

inherit(TouchInput, Input, {
    handler: function MTEhandler(ev) {
        var type = TOUCH_INPUT_MAP[ev.type];
        var touches = getTouches.call(this, ev, type);
        if (!touches) {
            return;
        }

        this.callback(this.manager, type, {
            pointers: touches[0],
            changedPointers: touches[1],
            pointerType: INPUT_TYPE_TOUCH,
            srcEvent: ev
        });
    }
});

/**
 * @this {TouchInput}
 * @param {Object} ev
 * @param {Number} type flag
 * @returns {undefined|Array} [all, changed]
 */
function getTouches(ev, type) {
    var allTouches = toArray(ev.touches);
    var targetIds = this.targetIds;

    // when there is only one touch, the process can be simplified
    if (type & (INPUT_START | INPUT_MOVE) && allTouches.length === 1) {
        targetIds[allTouches[0].identifier] = true;
        return [allTouches, allTouches];
    }

    var i,
        targetTouches,
        changedTouches = toArray(ev.changedTouches),
        changedTargetTouches = [],
        target = this.target;

    // get target touches from touches
    targetTouches = allTouches.filter(function(touch) {
        return hasParent(touch.target, target);
    });

    // collect touches
    if (type === INPUT_START) {
        i = 0;
        while (i < targetTouches.length) {
            targetIds[targetTouches[i].identifier] = true;
            i++;
        }
    }

    // filter changed touches to only contain touches that exist in the collected target ids
    i = 0;
    while (i < changedTouches.length) {
        if (targetIds[changedTouches[i].identifier]) {
            changedTargetTouches.push(changedTouches[i]);
        }

        // cleanup removed touches
        if (type & (INPUT_END | INPUT_CANCEL)) {
            delete targetIds[changedTouches[i].identifier];
        }
        i++;
    }

    if (!changedTargetTouches.length) {
        return;
    }

    return [
        // merge targetTouches with changedTargetTouches so it contains ALL touches, including 'end' and 'cancel'
        uniqueArray(targetTouches.concat(changedTargetTouches), 'identifier', true),
        changedTargetTouches
    ];
}

/**
 * Combined touch and mouse input
 *
 * Touch has a higher priority then mouse, and while touching no mouse events are allowed.
 * This because touch devices also emit mouse events while doing a touch.
 *
 * @constructor
 * @extends Input
 */

var DEDUP_TIMEOUT = 2500;
var DEDUP_DISTANCE = 25;

function TouchMouseInput() {
    Input.apply(this, arguments);

    var handler = bindFn(this.handler, this);
    this.touch = new TouchInput(this.manager, handler);
    this.mouse = new MouseInput(this.manager, handler);

    this.primaryTouch = null;
    this.lastTouches = [];
}

inherit(TouchMouseInput, Input, {
    /**
     * handle mouse and touch events
     * @param {Hammer} manager
     * @param {String} inputEvent
     * @param {Object} inputData
     */
    handler: function TMEhandler(manager, inputEvent, inputData) {
        var isTouch = (inputData.pointerType == INPUT_TYPE_TOUCH),
            isMouse = (inputData.pointerType == INPUT_TYPE_MOUSE);

        if (isMouse && inputData.sourceCapabilities && inputData.sourceCapabilities.firesTouchEvents) {
            return;
        }

        // when we're in a touch event, record touches to  de-dupe synthetic mouse event
        if (isTouch) {
            recordTouches.call(this, inputEvent, inputData);
        } else if (isMouse && isSyntheticEvent.call(this, inputData)) {
            return;
        }

        this.callback(manager, inputEvent, inputData);
    },

    /**
     * remove the event listeners
     */
    destroy: function destroy() {
        this.touch.destroy();
        this.mouse.destroy();
    }
});

function recordTouches(eventType, eventData) {
    if (eventType & INPUT_START) {
        this.primaryTouch = eventData.changedPointers[0].identifier;
        setLastTouch.call(this, eventData);
    } else if (eventType & (INPUT_END | INPUT_CANCEL)) {
        setLastTouch.call(this, eventData);
    }
}

function setLastTouch(eventData) {
    var touch = eventData.changedPointers[0];

    if (touch.identifier === this.primaryTouch) {
        var lastTouch = {x: touch.clientX, y: touch.clientY};
        this.lastTouches.push(lastTouch);
        var lts = this.lastTouches;
        var removeLastTouch = function() {
            var i = lts.indexOf(lastTouch);
            if (i > -1) {
                lts.splice(i, 1);
            }
        };
        setTimeout(removeLastTouch, DEDUP_TIMEOUT);
    }
}

function isSyntheticEvent(eventData) {
    var x = eventData.srcEvent.clientX, y = eventData.srcEvent.clientY;
    for (var i = 0; i < this.lastTouches.length; i++) {
        var t = this.lastTouches[i];
        var dx = Math.abs(x - t.x), dy = Math.abs(y - t.y);
        if (dx <= DEDUP_DISTANCE && dy <= DEDUP_DISTANCE) {
            return true;
        }
    }
    return false;
}

var PREFIXED_TOUCH_ACTION = prefixed(TEST_ELEMENT.style, 'touchAction');
var NATIVE_TOUCH_ACTION = PREFIXED_TOUCH_ACTION !== undefined;

// magical touchAction value
var TOUCH_ACTION_COMPUTE = 'compute';
var TOUCH_ACTION_AUTO = 'auto';
var TOUCH_ACTION_MANIPULATION = 'manipulation'; // not implemented
var TOUCH_ACTION_NONE = 'none';
var TOUCH_ACTION_PAN_X = 'pan-x';
var TOUCH_ACTION_PAN_Y = 'pan-y';
var TOUCH_ACTION_MAP = getTouchActionProps();

/**
 * Touch Action
 * sets the touchAction property or uses the js alternative
 * @param {Manager} manager
 * @param {String} value
 * @constructor
 */
function TouchAction(manager, value) {
    this.manager = manager;
    this.set(value);
}

TouchAction.prototype = {
    /**
     * set the touchAction value on the element or enable the polyfill
     * @param {String} value
     */
    set: function(value) {
        // find out the touch-action by the event handlers
        if (value == TOUCH_ACTION_COMPUTE) {
            value = this.compute();
        }

        if (NATIVE_TOUCH_ACTION && this.manager.element.style && TOUCH_ACTION_MAP[value]) {
            this.manager.element.style[PREFIXED_TOUCH_ACTION] = value;
        }
        this.actions = value.toLowerCase().trim();
    },

    /**
     * just re-set the touchAction value
     */
    update: function() {
        this.set(this.manager.options.touchAction);
    },

    /**
     * compute the value for the touchAction property based on the recognizer's settings
     * @returns {String} value
     */
    compute: function() {
        var actions = [];
        each(this.manager.recognizers, function(recognizer) {
            if (boolOrFn(recognizer.options.enable, [recognizer])) {
                actions = actions.concat(recognizer.getTouchAction());
            }
        });
        return cleanTouchActions(actions.join(' '));
    },

    /**
     * this method is called on each input cycle and provides the preventing of the browser behavior
     * @param {Object} input
     */
    preventDefaults: function(input) {
        var srcEvent = input.srcEvent;
        var direction = input.offsetDirection;

        // if the touch action did prevented once this session
        if (this.manager.session.prevented) {
            srcEvent.preventDefault();
            return;
        }

        var actions = this.actions;
        var hasNone = inStr(actions, TOUCH_ACTION_NONE) && !TOUCH_ACTION_MAP[TOUCH_ACTION_NONE];
        var hasPanY = inStr(actions, TOUCH_ACTION_PAN_Y) && !TOUCH_ACTION_MAP[TOUCH_ACTION_PAN_Y];
        var hasPanX = inStr(actions, TOUCH_ACTION_PAN_X) && !TOUCH_ACTION_MAP[TOUCH_ACTION_PAN_X];

        if (hasNone) {
            //do not prevent defaults if this is a tap gesture

            var isTapPointer = input.pointers.length === 1;
            var isTapMovement = input.distance < 2;
            var isTapTouchTime = input.deltaTime < 250;

            if (isTapPointer && isTapMovement && isTapTouchTime) {
                return;
            }
        }

        if (hasPanX && hasPanY) {
            // `pan-x pan-y` means browser handles all scrolling/panning, do not prevent
            return;
        }

        if (hasNone ||
            (hasPanY && direction & DIRECTION_HORIZONTAL) ||
            (hasPanX && direction & DIRECTION_VERTICAL)) {
            return this.preventSrc(srcEvent);
        }
    },

    /**
     * call preventDefault to prevent the browser's default behavior (scrolling in most cases)
     * @param {Object} srcEvent
     */
    preventSrc: function(srcEvent) {
        this.manager.session.prevented = true;
        srcEvent.preventDefault();
    }
};

/**
 * when the touchActions are collected they are not a valid value, so we need to clean things up. *
 * @param {String} actions
 * @returns {*}
 */
function cleanTouchActions(actions) {
    // none
    if (inStr(actions, TOUCH_ACTION_NONE)) {
        return TOUCH_ACTION_NONE;
    }

    var hasPanX = inStr(actions, TOUCH_ACTION_PAN_X);
    var hasPanY = inStr(actions, TOUCH_ACTION_PAN_Y);

    // if both pan-x and pan-y are set (different recognizers
    // for different directions, e.g. horizontal pan but vertical swipe?)
    // we need none (as otherwise with pan-x pan-y combined none of these
    // recognizers will work, since the browser would handle all panning
    if (hasPanX && hasPanY) {
        return TOUCH_ACTION_NONE;
    }

    // pan-x OR pan-y
    if (hasPanX || hasPanY) {
        return hasPanX ? TOUCH_ACTION_PAN_X : TOUCH_ACTION_PAN_Y;
    }

    // manipulation
    if (inStr(actions, TOUCH_ACTION_MANIPULATION)) {
        return TOUCH_ACTION_MANIPULATION;
    }

    return TOUCH_ACTION_AUTO;
}

function getTouchActionProps() {
    if (!NATIVE_TOUCH_ACTION) {
        return false;
    }
    var touchMap = {};
    var cssSupports = window.CSS && window.CSS.supports;
    ['auto', 'manipulation', 'pan-y', 'pan-x', 'pan-x pan-y', 'none'].forEach(function(val) {

        // If css.supports is not supported but there is native touch-action assume it supports
        // all values. This is the case for IE 10 and 11.
        touchMap[val] = cssSupports ? window.CSS.supports('touch-action', val) : true;
    });
    return touchMap;
}

/**
 * Recognizer flow explained; *
 * All recognizers have the initial state of POSSIBLE when a input session starts.
 * The definition of a input session is from the first input until the last input, with all it's movement in it. *
 * Example session for mouse-input: mousedown -> mousemove -> mouseup
 *
 * On each recognizing cycle (see Manager.recognize) the .recognize() method is executed
 * which determines with state it should be.
 *
 * If the recognizer has the state FAILED, CANCELLED or RECOGNIZED (equals ENDED), it is reset to
 * POSSIBLE to give it another change on the next cycle.
 *
 *               Possible
 *                  |
 *            +-----+---------------+
 *            |                     |
 *      +-----+-----+               |
 *      |           |               |
 *   Failed      Cancelled          |
 *                          +-------+------+
 *                          |              |
 *                      Recognized       Began
 *                                         |
 *                                      Changed
 *                                         |
 *                                  Ended/Recognized
 */
var STATE_POSSIBLE = 1;
var STATE_BEGAN = 2;
var STATE_CHANGED = 4;
var STATE_ENDED = 8;
var STATE_RECOGNIZED = STATE_ENDED;
var STATE_CANCELLED = 16;
var STATE_FAILED = 32;

/**
 * Recognizer
 * Every recognizer needs to extend from this class.
 * @constructor
 * @param {Object} options
 */
function Recognizer(options) {
    this.options = assign({}, this.defaults, options || {});

    this.id = uniqueId();

    this.manager = null;

    // default is enable true
    this.options.enable = ifUndefined(this.options.enable, true);

    this.state = STATE_POSSIBLE;

    this.simultaneous = {};
    this.requireFail = [];
}

Recognizer.prototype = {
    /**
     * @virtual
     * @type {Object}
     */
    defaults: {},

    /**
     * set options
     * @param {Object} options
     * @return {Recognizer}
     */
    set: function(options) {
        assign(this.options, options);

        // also update the touchAction, in case something changed about the directions/enabled state
        this.manager && this.manager.touchAction.update();
        return this;
    },

    /**
     * recognize simultaneous with an other recognizer.
     * @param {Recognizer} otherRecognizer
     * @returns {Recognizer} this
     */
    recognizeWith: function(otherRecognizer) {
        if (invokeArrayArg(otherRecognizer, 'recognizeWith', this)) {
            return this;
        }

        var simultaneous = this.simultaneous;
        otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
        if (!simultaneous[otherRecognizer.id]) {
            simultaneous[otherRecognizer.id] = otherRecognizer;
            otherRecognizer.recognizeWith(this);
        }
        return this;
    },

    /**
     * drop the simultaneous link. it doesnt remove the link on the other recognizer.
     * @param {Recognizer} otherRecognizer
     * @returns {Recognizer} this
     */
    dropRecognizeWith: function(otherRecognizer) {
        if (invokeArrayArg(otherRecognizer, 'dropRecognizeWith', this)) {
            return this;
        }

        otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
        delete this.simultaneous[otherRecognizer.id];
        return this;
    },

    /**
     * recognizer can only run when an other is failing
     * @param {Recognizer} otherRecognizer
     * @returns {Recognizer} this
     */
    requireFailure: function(otherRecognizer) {
        if (invokeArrayArg(otherRecognizer, 'requireFailure', this)) {
            return this;
        }

        var requireFail = this.requireFail;
        otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
        if (inArray(requireFail, otherRecognizer) === -1) {
            requireFail.push(otherRecognizer);
            otherRecognizer.requireFailure(this);
        }
        return this;
    },

    /**
     * drop the requireFailure link. it does not remove the link on the other recognizer.
     * @param {Recognizer} otherRecognizer
     * @returns {Recognizer} this
     */
    dropRequireFailure: function(otherRecognizer) {
        if (invokeArrayArg(otherRecognizer, 'dropRequireFailure', this)) {
            return this;
        }

        otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
        var index = inArray(this.requireFail, otherRecognizer);
        if (index > -1) {
            this.requireFail.splice(index, 1);
        }
        return this;
    },

    /**
     * has require failures boolean
     * @returns {boolean}
     */
    hasRequireFailures: function() {
        return this.requireFail.length > 0;
    },

    /**
     * if the recognizer can recognize simultaneous with an other recognizer
     * @param {Recognizer} otherRecognizer
     * @returns {Boolean}
     */
    canRecognizeWith: function(otherRecognizer) {
        return !!this.simultaneous[otherRecognizer.id];
    },

    /**
     * You should use `tryEmit` instead of `emit` directly to check
     * that all the needed recognizers has failed before emitting.
     * @param {Object} input
     */
    emit: function(input) {
        var self = this;
        var state = this.state;

        function emit(event) {
            self.manager.emit(event, input);
        }

        // 'panstart' and 'panmove'
        if (state < STATE_ENDED) {
            emit(self.options.event + stateStr(state));
        }

        emit(self.options.event); // simple 'eventName' events

        if (input.additionalEvent) { // additional event(panleft, panright, pinchin, pinchout...)
            emit(input.additionalEvent);
        }

        // panend and pancancel
        if (state >= STATE_ENDED) {
            emit(self.options.event + stateStr(state));
        }
    },

    /**
     * Check that all the require failure recognizers has failed,
     * if true, it emits a gesture event,
     * otherwise, setup the state to FAILED.
     * @param {Object} input
     */
    tryEmit: function(input) {
        if (this.canEmit()) {
            return this.emit(input);
        }
        // it's failing anyway
        this.state = STATE_FAILED;
    },

    /**
     * can we emit?
     * @returns {boolean}
     */
    canEmit: function() {
        var i = 0;
        while (i < this.requireFail.length) {
            if (!(this.requireFail[i].state & (STATE_FAILED | STATE_POSSIBLE))) {
                return false;
            }
            i++;
        }
        return true;
    },

    /**
     * update the recognizer
     * @param {Object} inputData
     */
    recognize: function(inputData) {
        // make a new copy of the inputData
        // so we can change the inputData without messing up the other recognizers
        var inputDataClone = assign({}, inputData);

        // is is enabled and allow recognizing?
        if (!boolOrFn(this.options.enable, [this, inputDataClone])) {
            this.reset();
            this.state = STATE_FAILED;
            return;
        }

        // reset when we've reached the end
        if (this.state & (STATE_RECOGNIZED | STATE_CANCELLED | STATE_FAILED)) {
            this.state = STATE_POSSIBLE;
        }

        this.state = this.process(inputDataClone);

        // the recognizer has recognized a gesture
        // so trigger an event
        if (this.state & (STATE_BEGAN | STATE_CHANGED | STATE_ENDED | STATE_CANCELLED)) {
            this.tryEmit(inputDataClone);
        }
    },

    /**
     * return the state of the recognizer
     * the actual recognizing happens in this method
     * @virtual
     * @param {Object} inputData
     * @returns {Const} STATE
     */
    process: function(inputData) { }, // jshint ignore:line

    /**
     * return the preferred touch-action
     * @virtual
     * @returns {Array}
     */
    getTouchAction: function() { },

    /**
     * called when the gesture isn't allowed to recognize
     * like when another is being recognized or it is disabled
     * @virtual
     */
    reset: function() { }
};

/**
 * get a usable string, used as event postfix
 * @param {Const} state
 * @returns {String} state
 */
function stateStr(state) {
    if (state & STATE_CANCELLED) {
        return 'cancel';
    } else if (state & STATE_ENDED) {
        return 'end';
    } else if (state & STATE_CHANGED) {
        return 'move';
    } else if (state & STATE_BEGAN) {
        return 'start';
    }
    return '';
}

/**
 * direction cons to string
 * @param {Const} direction
 * @returns {String}
 */
function directionStr(direction) {
    if (direction == DIRECTION_DOWN) {
        return 'down';
    } else if (direction == DIRECTION_UP) {
        return 'up';
    } else if (direction == DIRECTION_LEFT) {
        return 'left';
    } else if (direction == DIRECTION_RIGHT) {
        return 'right';
    }
    return '';
}

/**
 * get a recognizer by name if it is bound to a manager
 * @param {Recognizer|String} otherRecognizer
 * @param {Recognizer} recognizer
 * @returns {Recognizer}
 */
function getRecognizerByNameIfManager(otherRecognizer, recognizer) {
    var manager = recognizer.manager;
    if (manager) {
        return manager.get(otherRecognizer);
    }
    return otherRecognizer;
}

/**
 * This recognizer is just used as a base for the simple attribute recognizers.
 * @constructor
 * @extends Recognizer
 */
function AttrRecognizer() {
    Recognizer.apply(this, arguments);
}

inherit(AttrRecognizer, Recognizer, {
    /**
     * @namespace
     * @memberof AttrRecognizer
     */
    defaults: {
        /**
         * @type {Number}
         * @default 1
         */
        pointers: 1
    },

    /**
     * Used to check if it the recognizer receives valid input, like input.distance > 10.
     * @memberof AttrRecognizer
     * @param {Object} input
     * @returns {Boolean} recognized
     */
    attrTest: function(input) {
        var optionPointers = this.options.pointers;
        return optionPointers === 0 || input.pointers.length === optionPointers;
    },

    /**
     * Process the input and return the state for the recognizer
     * @memberof AttrRecognizer
     * @param {Object} input
     * @returns {*} State
     */
    process: function(input) {
        var state = this.state;
        var eventType = input.eventType;

        var isRecognized = state & (STATE_BEGAN | STATE_CHANGED);
        var isValid = this.attrTest(input);

        // on cancel input and we've recognized before, return STATE_CANCELLED
        if (isRecognized && (eventType & INPUT_CANCEL || !isValid)) {
            return state | STATE_CANCELLED;
        } else if (isRecognized || isValid) {
            if (eventType & INPUT_END) {
                return state | STATE_ENDED;
            } else if (!(state & STATE_BEGAN)) {
                return STATE_BEGAN;
            }
            return state | STATE_CHANGED;
        }
        return STATE_FAILED;
    }
});

/**
 * Pan
 * Recognized when the pointer is down and moved in the allowed direction.
 * @constructor
 * @extends AttrRecognizer
 */
function PanRecognizer() {
    AttrRecognizer.apply(this, arguments);

    this.pX = null;
    this.pY = null;
}

inherit(PanRecognizer, AttrRecognizer, {
    /**
     * @namespace
     * @memberof PanRecognizer
     */
    defaults: {
        event: 'pan',
        threshold: 10,
        pointers: 1,
        direction: DIRECTION_ALL
    },

    getTouchAction: function() {
        var direction = this.options.direction;
        var actions = [];
        if (direction & DIRECTION_HORIZONTAL) {
            actions.push(TOUCH_ACTION_PAN_Y);
        }
        if (direction & DIRECTION_VERTICAL) {
            actions.push(TOUCH_ACTION_PAN_X);
        }
        return actions;
    },

    directionTest: function(input) {
        var options = this.options;
        var hasMoved = true;
        var distance = input.distance;
        var direction = input.direction;
        var x = input.deltaX;
        var y = input.deltaY;

        // lock to axis?
        if (!(direction & options.direction)) {
            if (options.direction & DIRECTION_HORIZONTAL) {
                direction = (x === 0) ? DIRECTION_NONE : (x < 0) ? DIRECTION_LEFT : DIRECTION_RIGHT;
                hasMoved = x != this.pX;
                distance = Math.abs(input.deltaX);
            } else {
                direction = (y === 0) ? DIRECTION_NONE : (y < 0) ? DIRECTION_UP : DIRECTION_DOWN;
                hasMoved = y != this.pY;
                distance = Math.abs(input.deltaY);
            }
        }
        input.direction = direction;
        return hasMoved && distance > options.threshold && direction & options.direction;
    },

    attrTest: function(input) {
        return AttrRecognizer.prototype.attrTest.call(this, input) &&
            (this.state & STATE_BEGAN || (!(this.state & STATE_BEGAN) && this.directionTest(input)));
    },

    emit: function(input) {

        this.pX = input.deltaX;
        this.pY = input.deltaY;

        var direction = directionStr(input.direction);

        if (direction) {
            input.additionalEvent = this.options.event + direction;
        }
        this._super.emit.call(this, input);
    }
});

/**
 * Pinch
 * Recognized when two or more pointers are moving toward (zoom-in) or away from each other (zoom-out).
 * @constructor
 * @extends AttrRecognizer
 */
function PinchRecognizer() {
    AttrRecognizer.apply(this, arguments);
}

inherit(PinchRecognizer, AttrRecognizer, {
    /**
     * @namespace
     * @memberof PinchRecognizer
     */
    defaults: {
        event: 'pinch',
        threshold: 0,
        pointers: 2
    },

    getTouchAction: function() {
        return [TOUCH_ACTION_NONE];
    },

    attrTest: function(input) {
        return this._super.attrTest.call(this, input) &&
            (Math.abs(input.scale - 1) > this.options.threshold || this.state & STATE_BEGAN);
    },

    emit: function(input) {
        if (input.scale !== 1) {
            var inOut = input.scale < 1 ? 'in' : 'out';
            input.additionalEvent = this.options.event + inOut;
        }
        this._super.emit.call(this, input);
    }
});

/**
 * Press
 * Recognized when the pointer is down for x ms without any movement.
 * @constructor
 * @extends Recognizer
 */
function PressRecognizer() {
    Recognizer.apply(this, arguments);

    this._timer = null;
    this._input = null;
}

inherit(PressRecognizer, Recognizer, {
    /**
     * @namespace
     * @memberof PressRecognizer
     */
    defaults: {
        event: 'press',
        pointers: 1,
        time: 251, // minimal time of the pointer to be pressed
        threshold: 9 // a minimal movement is ok, but keep it low
    },

    getTouchAction: function() {
        return [TOUCH_ACTION_AUTO];
    },

    process: function(input) {
        var options = this.options;
        var validPointers = input.pointers.length === options.pointers;
        var validMovement = input.distance < options.threshold;
        var validTime = input.deltaTime > options.time;

        this._input = input;

        // we only allow little movement
        // and we've reached an end event, so a tap is possible
        if (!validMovement || !validPointers || (input.eventType & (INPUT_END | INPUT_CANCEL) && !validTime)) {
            this.reset();
        } else if (input.eventType & INPUT_START) {
            this.reset();
            this._timer = setTimeoutContext(function() {
                this.state = STATE_RECOGNIZED;
                this.tryEmit();
            }, options.time, this);
        } else if (input.eventType & INPUT_END) {
            return STATE_RECOGNIZED;
        }
        return STATE_FAILED;
    },

    reset: function() {
        clearTimeout(this._timer);
    },

    emit: function(input) {
        if (this.state !== STATE_RECOGNIZED) {
            return;
        }

        if (input && (input.eventType & INPUT_END)) {
            this.manager.emit(this.options.event + 'up', input);
        } else {
            this._input.timeStamp = now();
            this.manager.emit(this.options.event, this._input);
        }
    }
});

/**
 * Rotate
 * Recognized when two or more pointer are moving in a circular motion.
 * @constructor
 * @extends AttrRecognizer
 */
function RotateRecognizer() {
    AttrRecognizer.apply(this, arguments);
}

inherit(RotateRecognizer, AttrRecognizer, {
    /**
     * @namespace
     * @memberof RotateRecognizer
     */
    defaults: {
        event: 'rotate',
        threshold: 0,
        pointers: 2
    },

    getTouchAction: function() {
        return [TOUCH_ACTION_NONE];
    },

    attrTest: function(input) {
        return this._super.attrTest.call(this, input) &&
            (Math.abs(input.rotation) > this.options.threshold || this.state & STATE_BEGAN);
    }
});

/**
 * Swipe
 * Recognized when the pointer is moving fast (velocity), with enough distance in the allowed direction.
 * @constructor
 * @extends AttrRecognizer
 */
function SwipeRecognizer() {
    AttrRecognizer.apply(this, arguments);
}

inherit(SwipeRecognizer, AttrRecognizer, {
    /**
     * @namespace
     * @memberof SwipeRecognizer
     */
    defaults: {
        event: 'swipe',
        threshold: 10,
        velocity: 0.3,
        direction: DIRECTION_HORIZONTAL | DIRECTION_VERTICAL,
        pointers: 1
    },

    getTouchAction: function() {
        return PanRecognizer.prototype.getTouchAction.call(this);
    },

    attrTest: function(input) {
        var direction = this.options.direction;
        var velocity;

        if (direction & (DIRECTION_HORIZONTAL | DIRECTION_VERTICAL)) {
            velocity = input.overallVelocity;
        } else if (direction & DIRECTION_HORIZONTAL) {
            velocity = input.overallVelocityX;
        } else if (direction & DIRECTION_VERTICAL) {
            velocity = input.overallVelocityY;
        }

        return this._super.attrTest.call(this, input) &&
            direction & input.offsetDirection &&
            input.distance > this.options.threshold &&
            input.maxPointers == this.options.pointers &&
            abs(velocity) > this.options.velocity && input.eventType & INPUT_END;
    },

    emit: function(input) {
        var direction = directionStr(input.offsetDirection);
        if (direction) {
            this.manager.emit(this.options.event + direction, input);
        }

        this.manager.emit(this.options.event, input);
    }
});

/**
 * A tap is ecognized when the pointer is doing a small tap/click. Multiple taps are recognized if they occur
 * between the given interval and position. The delay option can be used to recognize multi-taps without firing
 * a single tap.
 *
 * The eventData from the emitted event contains the property `tapCount`, which contains the amount of
 * multi-taps being recognized.
 * @constructor
 * @extends Recognizer
 */
function TapRecognizer() {
    Recognizer.apply(this, arguments);

    // previous time and center,
    // used for tap counting
    this.pTime = false;
    this.pCenter = false;

    this._timer = null;
    this._input = null;
    this.count = 0;
}

inherit(TapRecognizer, Recognizer, {
    /**
     * @namespace
     * @memberof PinchRecognizer
     */
    defaults: {
        event: 'tap',
        pointers: 1,
        taps: 1,
        interval: 300, // max time between the multi-tap taps
        time: 250, // max time of the pointer to be down (like finger on the screen)
        threshold: 9, // a minimal movement is ok, but keep it low
        posThreshold: 10 // a multi-tap can be a bit off the initial position
    },

    getTouchAction: function() {
        return [TOUCH_ACTION_MANIPULATION];
    },

    process: function(input) {
        var options = this.options;

        var validPointers = input.pointers.length === options.pointers;
        var validMovement = input.distance < options.threshold;
        var validTouchTime = input.deltaTime < options.time;

        this.reset();

        if ((input.eventType & INPUT_START) && (this.count === 0)) {
            return this.failTimeout();
        }

        // we only allow little movement
        // and we've reached an end event, so a tap is possible
        if (validMovement && validTouchTime && validPointers) {
            if (input.eventType != INPUT_END) {
                return this.failTimeout();
            }

            var validInterval = this.pTime ? (input.timeStamp - this.pTime < options.interval) : true;
            var validMultiTap = !this.pCenter || getDistance(this.pCenter, input.center) < options.posThreshold;

            this.pTime = input.timeStamp;
            this.pCenter = input.center;

            if (!validMultiTap || !validInterval) {
                this.count = 1;
            } else {
                this.count += 1;
            }

            this._input = input;

            // if tap count matches we have recognized it,
            // else it has began recognizing...
            var tapCount = this.count % options.taps;
            if (tapCount === 0) {
                // no failing requirements, immediately trigger the tap event
                // or wait as long as the multitap interval to trigger
                if (!this.hasRequireFailures()) {
                    return STATE_RECOGNIZED;
                } else {
                    this._timer = setTimeoutContext(function() {
                        this.state = STATE_RECOGNIZED;
                        this.tryEmit();
                    }, options.interval, this);
                    return STATE_BEGAN;
                }
            }
        }
        return STATE_FAILED;
    },

    failTimeout: function() {
        this._timer = setTimeoutContext(function() {
            this.state = STATE_FAILED;
        }, this.options.interval, this);
        return STATE_FAILED;
    },

    reset: function() {
        clearTimeout(this._timer);
    },

    emit: function() {
        if (this.state == STATE_RECOGNIZED) {
            this._input.tapCount = this.count;
            this.manager.emit(this.options.event, this._input);
        }
    }
});

/**
 * Simple way to create a manager with a default set of recognizers.
 * @param {HTMLElement} element
 * @param {Object} [options]
 * @constructor
 */
function Hammer(element, options) {
    options = options || {};
    options.recognizers = ifUndefined(options.recognizers, Hammer.defaults.preset);
    return new Manager(element, options);
}

/**
 * @const {string}
 */
Hammer.VERSION = '2.0.7';

/**
 * default settings
 * @namespace
 */
Hammer.defaults = {
    /**
     * set if DOM events are being triggered.
     * But this is slower and unused by simple implementations, so disabled by default.
     * @type {Boolean}
     * @default false
     */
    domEvents: false,

    /**
     * The value for the touchAction property/fallback.
     * When set to `compute` it will magically set the correct value based on the added recognizers.
     * @type {String}
     * @default compute
     */
    touchAction: TOUCH_ACTION_COMPUTE,

    /**
     * @type {Boolean}
     * @default true
     */
    enable: true,

    /**
     * EXPERIMENTAL FEATURE -- can be removed/changed
     * Change the parent input target element.
     * If Null, then it is being set the to main element.
     * @type {Null|EventTarget}
     * @default null
     */
    inputTarget: null,

    /**
     * force an input class
     * @type {Null|Function}
     * @default null
     */
    inputClass: null,

    /**
     * Default recognizer setup when calling `Hammer()`
     * When creating a new Manager these will be skipped.
     * @type {Array}
     */
    preset: [
        // RecognizerClass, options, [recognizeWith, ...], [requireFailure, ...]
        [RotateRecognizer, {enable: false}],
        [PinchRecognizer, {enable: false}, ['rotate']],
        [SwipeRecognizer, {direction: DIRECTION_HORIZONTAL}],
        [PanRecognizer, {direction: DIRECTION_HORIZONTAL}, ['swipe']],
        [TapRecognizer],
        [TapRecognizer, {event: 'doubletap', taps: 2}, ['tap']],
        [PressRecognizer]
    ],

    /**
     * Some CSS properties can be used to improve the working of Hammer.
     * Add them to this method and they will be set when creating a new Manager.
     * @namespace
     */
    cssProps: {
        /**
         * Disables text selection to improve the dragging gesture. Mainly for desktop browsers.
         * @type {String}
         * @default 'none'
         */
        userSelect: 'none',

        /**
         * Disable the Windows Phone grippers when pressing an element.
         * @type {String}
         * @default 'none'
         */
        touchSelect: 'none',

        /**
         * Disables the default callout shown when you touch and hold a touch target.
         * On iOS, when you touch and hold a touch target such as a link, Safari displays
         * a callout containing information about the link. This property allows you to disable that callout.
         * @type {String}
         * @default 'none'
         */
        touchCallout: 'none',

        /**
         * Specifies whether zooming is enabled. Used by IE10>
         * @type {String}
         * @default 'none'
         */
        contentZooming: 'none',

        /**
         * Specifies that an entire element should be draggable instead of its contents. Mainly for desktop browsers.
         * @type {String}
         * @default 'none'
         */
        userDrag: 'none',

        /**
         * Overrides the highlight color shown when the user taps a link or a JavaScript
         * clickable element in iOS. This property obeys the alpha value, if specified.
         * @type {String}
         * @default 'rgba(0,0,0,0)'
         */
        tapHighlightColor: 'rgba(0,0,0,0)'
    }
};

var STOP = 1;
var FORCED_STOP = 2;

/**
 * Manager
 * @param {HTMLElement} element
 * @param {Object} [options]
 * @constructor
 */
function Manager(element, options) {
    this.options = assign({}, Hammer.defaults, options || {});

    this.options.inputTarget = this.options.inputTarget || element;

    this.handlers = {};
    this.session = {};
    this.recognizers = [];
    this.oldCssProps = {};

    this.element = element;
    this.input = createInputInstance(this);
    this.touchAction = new TouchAction(this, this.options.touchAction);

    toggleCssProps(this, true);

    each(this.options.recognizers, function(item) {
        var recognizer = this.add(new (item[0])(item[1]));
        item[2] && recognizer.recognizeWith(item[2]);
        item[3] && recognizer.requireFailure(item[3]);
    }, this);
}

Manager.prototype = {
    /**
     * set options
     * @param {Object} options
     * @returns {Manager}
     */
    set: function(options) {
        assign(this.options, options);

        // Options that need a little more setup
        if (options.touchAction) {
            this.touchAction.update();
        }
        if (options.inputTarget) {
            // Clean up existing event listeners and reinitialize
            this.input.destroy();
            this.input.target = options.inputTarget;
            this.input.init();
        }
        return this;
    },

    /**
     * stop recognizing for this session.
     * This session will be discarded, when a new [input]start event is fired.
     * When forced, the recognizer cycle is stopped immediately.
     * @param {Boolean} [force]
     */
    stop: function(force) {
        this.session.stopped = force ? FORCED_STOP : STOP;
    },

    /**
     * run the recognizers!
     * called by the inputHandler function on every movement of the pointers (touches)
     * it walks through all the recognizers and tries to detect the gesture that is being made
     * @param {Object} inputData
     */
    recognize: function(inputData) {
        var session = this.session;
        if (session.stopped) {
            return;
        }

        // run the touch-action polyfill
        this.touchAction.preventDefaults(inputData);

        var recognizer;
        var recognizers = this.recognizers;

        // this holds the recognizer that is being recognized.
        // so the recognizer's state needs to be BEGAN, CHANGED, ENDED or RECOGNIZED
        // if no recognizer is detecting a thing, it is set to `null`
        var curRecognizer = session.curRecognizer;

        // reset when the last recognizer is recognized
        // or when we're in a new session
        if (!curRecognizer || (curRecognizer && curRecognizer.state & STATE_RECOGNIZED)) {
            curRecognizer = session.curRecognizer = null;
        }

        var i = 0;
        while (i < recognizers.length) {
            recognizer = recognizers[i];

            // find out if we are allowed try to recognize the input for this one.
            // 1.   allow if the session is NOT forced stopped (see the .stop() method)
            // 2.   allow if we still haven't recognized a gesture in this session, or the this recognizer is the one
            //      that is being recognized.
            // 3.   allow if the recognizer is allowed to run simultaneous with the current recognized recognizer.
            //      this can be setup with the `recognizeWith()` method on the recognizer.
            if (session.stopped !== FORCED_STOP && ( // 1
                    !curRecognizer || recognizer == curRecognizer || // 2
                    recognizer.canRecognizeWith(curRecognizer))) { // 3
                recognizer.recognize(inputData);
            } else {
                recognizer.reset();
            }

            // if the recognizer has been recognizing the input as a valid gesture, we want to store this one as the
            // current active recognizer. but only if we don't already have an active recognizer
            if (!curRecognizer && recognizer.state & (STATE_BEGAN | STATE_CHANGED | STATE_ENDED)) {
                curRecognizer = session.curRecognizer = recognizer;
            }
            i++;
        }
    },

    /**
     * get a recognizer by its event name.
     * @param {Recognizer|String} recognizer
     * @returns {Recognizer|Null}
     */
    get: function(recognizer) {
        if (recognizer instanceof Recognizer) {
            return recognizer;
        }

        var recognizers = this.recognizers;
        for (var i = 0; i < recognizers.length; i++) {
            if (recognizers[i].options.event == recognizer) {
                return recognizers[i];
            }
        }
        return null;
    },

    /**
     * add a recognizer to the manager
     * existing recognizers with the same event name will be removed
     * @param {Recognizer} recognizer
     * @returns {Recognizer|Manager}
     */
    add: function(recognizer) {
        if (invokeArrayArg(recognizer, 'add', this)) {
            return this;
        }

        // remove existing
        var existing = this.get(recognizer.options.event);
        if (existing) {
            this.remove(existing);
        }

        this.recognizers.push(recognizer);
        recognizer.manager = this;

        this.touchAction.update();
        return recognizer;
    },

    /**
     * remove a recognizer by name or instance
     * @param {Recognizer|String} recognizer
     * @returns {Manager}
     */
    remove: function(recognizer) {
        if (invokeArrayArg(recognizer, 'remove', this)) {
            return this;
        }

        recognizer = this.get(recognizer);

        // let's make sure this recognizer exists
        if (recognizer) {
            var recognizers = this.recognizers;
            var index = inArray(recognizers, recognizer);

            if (index !== -1) {
                recognizers.splice(index, 1);
                this.touchAction.update();
            }
        }

        return this;
    },

    /**
     * bind event
     * @param {String} events
     * @param {Function} handler
     * @returns {EventEmitter} this
     */
    on: function(events, handler) {
        if (events === undefined) {
            return;
        }
        if (handler === undefined) {
            return;
        }

        var handlers = this.handlers;
        each(splitStr(events), function(event) {
            handlers[event] = handlers[event] || [];
            handlers[event].push(handler);
        });
        return this;
    },

    /**
     * unbind event, leave emit blank to remove all handlers
     * @param {String} events
     * @param {Function} [handler]
     * @returns {EventEmitter} this
     */
    off: function(events, handler) {
        if (events === undefined) {
            return;
        }

        var handlers = this.handlers;
        each(splitStr(events), function(event) {
            if (!handler) {
                delete handlers[event];
            } else {
                handlers[event] && handlers[event].splice(inArray(handlers[event], handler), 1);
            }
        });
        return this;
    },

    /**
     * emit event to the listeners
     * @param {String} event
     * @param {Object} data
     */
    emit: function(event, data) {
        // we also want to trigger dom events
        if (this.options.domEvents) {
            triggerDomEvent(event, data);
        }

        // no handlers, so skip it all
        var handlers = this.handlers[event] && this.handlers[event].slice();
        if (!handlers || !handlers.length) {
            return;
        }

        data.type = event;
        data.preventDefault = function() {
            data.srcEvent.preventDefault();
        };

        var i = 0;
        while (i < handlers.length) {
            handlers[i](data);
            i++;
        }
    },

    /**
     * destroy the manager and unbinds all events
     * it doesn't unbind dom events, that is the user own responsibility
     */
    destroy: function() {
        this.element && toggleCssProps(this, false);

        this.handlers = {};
        this.session = {};
        this.input.destroy();
        this.element = null;
    }
};

/**
 * add/remove the css properties as defined in manager.options.cssProps
 * @param {Manager} manager
 * @param {Boolean} add
 */
function toggleCssProps(manager, add) {
    var element = manager.element;
    if (!element.style) {
        return;
    }
    var prop;
    each(manager.options.cssProps, function(value, name) {
        prop = prefixed(element.style, name);
        if (add) {
            manager.oldCssProps[prop] = element.style[prop];
            element.style[prop] = value;
        } else {
            element.style[prop] = manager.oldCssProps[prop] || '';
        }
    });
    if (!add) {
        manager.oldCssProps = {};
    }
}

/**
 * trigger dom event
 * @param {String} event
 * @param {Object} data
 */
function triggerDomEvent(event, data) {
    var gestureEvent = document.createEvent('Event');
    gestureEvent.initEvent(event, true, true);
    gestureEvent.gesture = data;
    data.target.dispatchEvent(gestureEvent);
}

assign(Hammer, {
    INPUT_START: INPUT_START,
    INPUT_MOVE: INPUT_MOVE,
    INPUT_END: INPUT_END,
    INPUT_CANCEL: INPUT_CANCEL,

    STATE_POSSIBLE: STATE_POSSIBLE,
    STATE_BEGAN: STATE_BEGAN,
    STATE_CHANGED: STATE_CHANGED,
    STATE_ENDED: STATE_ENDED,
    STATE_RECOGNIZED: STATE_RECOGNIZED,
    STATE_CANCELLED: STATE_CANCELLED,
    STATE_FAILED: STATE_FAILED,

    DIRECTION_NONE: DIRECTION_NONE,
    DIRECTION_LEFT: DIRECTION_LEFT,
    DIRECTION_RIGHT: DIRECTION_RIGHT,
    DIRECTION_UP: DIRECTION_UP,
    DIRECTION_DOWN: DIRECTION_DOWN,
    DIRECTION_HORIZONTAL: DIRECTION_HORIZONTAL,
    DIRECTION_VERTICAL: DIRECTION_VERTICAL,
    DIRECTION_ALL: DIRECTION_ALL,

    Manager: Manager,
    Input: Input,
    TouchAction: TouchAction,

    TouchInput: TouchInput,
    MouseInput: MouseInput,
    PointerEventInput: PointerEventInput,
    TouchMouseInput: TouchMouseInput,
    SingleTouchInput: SingleTouchInput,

    Recognizer: Recognizer,
    AttrRecognizer: AttrRecognizer,
    Tap: TapRecognizer,
    Pan: PanRecognizer,
    Swipe: SwipeRecognizer,
    Pinch: PinchRecognizer,
    Rotate: RotateRecognizer,
    Press: PressRecognizer,

    on: addEventListeners,
    off: removeEventListeners,
    each: each,
    merge: merge,
    extend: extend,
    assign: assign,
    inherit: inherit,
    bindFn: bindFn,
    prefixed: prefixed
});

// this prevents errors when Hammer is loaded in the presence of an AMD
//  style loader but by script tag, not by the loader.
var freeGlobal = (typeof window !== 'undefined' ? window : (typeof self !== 'undefined' ? self : {})); // jshint ignore:line
freeGlobal.Hammer = Hammer;

if (true) {
    !(__WEBPACK_AMD_DEFINE_RESULT__ = (function() {
        return Hammer;
    }).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
} else {}

})(window, document, 'Hammer');


/***/ }),

/***/ "./src/$$_lazy_route_resource lazy recursive":
/*!**********************************************************!*\
  !*** ./src/$$_lazy_route_resource lazy namespace object ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncaught exception popping up in devtools
	return Promise.resolve().then(function() {
		var e = new Error('Cannot find module "' + req + '".');
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = "./src/$$_lazy_route_resource lazy recursive";

/***/ }),

/***/ "./src/app/accounts/accounts.component.html":
/*!**************************************************!*\
  !*** ./src/app/accounts/accounts.component.html ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<section>\n  <header><h1>Account Mangement</h1></header>\n</section>"

/***/ }),

/***/ "./src/app/accounts/accounts.component.scss":
/*!**************************************************!*\
  !*** ./src/app/accounts/accounts.component.scss ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/accounts/accounts.component.ts":
/*!************************************************!*\
  !*** ./src/app/accounts/accounts.component.ts ***!
  \************************************************/
/*! exports provided: AccountsComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AccountsComponent", function() { return AccountsComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var AccountsComponent = /** @class */ (function () {
    function AccountsComponent() {
    }
    AccountsComponent.prototype.ngOnInit = function () {
    };
    AccountsComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-accounts',
            template: __webpack_require__(/*! ./accounts.component.html */ "./src/app/accounts/accounts.component.html"),
            styles: [__webpack_require__(/*! ./accounts.component.scss */ "./src/app/accounts/accounts.component.scss")]
        }),
        __metadata("design:paramtypes", [])
    ], AccountsComponent);
    return AccountsComponent;
}());



/***/ }),

/***/ "./src/app/app.component.html":
/*!************************************!*\
  !*** ./src/app/app.component.html ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<main class=\"app-container\">\n    <app-top-nav (sidenavToggleEvent)=\"eventReceiveSidenavToggle($event)\"></app-top-nav>\n    <app-side-nav></app-side-nav>\n    <section [class.active]=\"isSideBarMini\"><router-outlet></router-outlet></section>\n</main>"

/***/ }),

/***/ "./src/app/app.component.scss":
/*!************************************!*\
  !*** ./src/app/app.component.scss ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "section {\n  padding-top: 50px;\n  padding-left: 160px;\n  background-color: white; }\n\nsection.active {\n  padding-left: 0px; }\n"

/***/ }),

/***/ "./src/app/app.component.ts":
/*!**********************************!*\
  !*** ./src/app/app.component.ts ***!
  \**********************************/
/*! exports provided: AppComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppComponent", function() { return AppComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _side_nav_side_nav_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./side-nav/side-nav.component */ "./src/app/side-nav/side-nav.component.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var AppComponent = /** @class */ (function () {
    function AppComponent() {
        this.isSideBarMini = false;
    }
    AppComponent.prototype.eventReceiveSidenavToggle = function ($event) {
        this.isSideBarMini = !this.isSideBarMini;
        this.topNavChild.toggleSideNav();
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])(_side_nav_side_nav_component__WEBPACK_IMPORTED_MODULE_1__["SideNavComponent"]),
        __metadata("design:type", _side_nav_side_nav_component__WEBPACK_IMPORTED_MODULE_1__["SideNavComponent"])
    ], AppComponent.prototype, "topNavChild", void 0);
    AppComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-root',
            template: __webpack_require__(/*! ./app.component.html */ "./src/app/app.component.html"),
            styles: [__webpack_require__(/*! ./app.component.scss */ "./src/app/app.component.scss")]
        })
    ], AppComponent);
    return AppComponent;
}());



/***/ }),

/***/ "./src/app/app.module.ts":
/*!*******************************!*\
  !*** ./src/app/app.module.ts ***!
  \*******************************/
/*! exports provided: AppModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppModule", function() { return AppModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/platform-browser */ "./node_modules/@angular/platform-browser/fesm5/platform-browser.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _angular_http__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/http */ "./node_modules/@angular/http/fesm5/http.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/platform-browser/animations */ "./node_modules/@angular/platform-browser/fesm5/animations.js");
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm5/material.es5.js");
/* harmony import */ var hammerjs__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! hammerjs */ "./node_modules/hammerjs/hammer.js");
/* harmony import */ var hammerjs__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(hammerjs__WEBPACK_IMPORTED_MODULE_9__);
/* harmony import */ var _app_component__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./app.component */ "./src/app/app.component.ts");
/* harmony import */ var _side_nav_side_nav_component__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./side-nav/side-nav.component */ "./src/app/side-nav/side-nav.component.ts");
/* harmony import */ var _top_nav_top_nav_component__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./top-nav/top-nav.component */ "./src/app/top-nav/top-nav.component.ts");
/* harmony import */ var _shared_services_global_nestedAgGrid_shared_service__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./shared/services/global/nestedAgGrid.shared.service */ "./src/app/shared/services/global/nestedAgGrid.shared.service.ts");
/* harmony import */ var _shared_services_global_buttonStates_shared_service__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./shared/services/global/buttonStates.shared.service */ "./src/app/shared/services/global/buttonStates.shared.service.ts");
/* harmony import */ var _shared_services_global_api_settings_shared_service__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./shared/services/global/api-settings.shared.service */ "./src/app/shared/services/global/api-settings.shared.service.ts");
/* harmony import */ var _shared_services_global_codes_shared_service__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./shared/services/global/codes.shared.service */ "./src/app/shared/services/global/codes.shared.service.ts");
/* harmony import */ var _shared_services_global_snackbar_shared_service__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./shared/services/global/snackbar.shared.service */ "./src/app/shared/services/global/snackbar.shared.service.ts");
/* harmony import */ var _shared_components_snackbars_success_success_snackbar_component__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./shared/components/snackbars/success/success.snackbar.component */ "./src/app/shared/components/snackbars/success/success.snackbar.component.ts");
/* harmony import */ var _shared_components_snackbars_error_error_snackbar_component__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ./shared/components/snackbars/error/error.snackbar.component */ "./src/app/shared/components/snackbars/error/error.snackbar.component.ts");
/* harmony import */ var ag_grid_angular__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ag-grid-angular */ "./node_modules/ag-grid-angular/main.js");
/* harmony import */ var ag_grid_angular__WEBPACK_IMPORTED_MODULE_20___default = /*#__PURE__*/__webpack_require__.n(ag_grid_angular__WEBPACK_IMPORTED_MODULE_20__);
/* harmony import */ var ngx_papaparse__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ngx-papaparse */ "./node_modules/ngx-papaparse/ngx-papaparse.es5.js");
/* harmony import */ var ng_sidebar__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! ng-sidebar */ "./node_modules/ng-sidebar/lib/index.js");
/* harmony import */ var ng_sidebar__WEBPACK_IMPORTED_MODULE_22___default = /*#__PURE__*/__webpack_require__.n(ng_sidebar__WEBPACK_IMPORTED_MODULE_22__);
/* harmony import */ var _dashboard_dashboard_component__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! ./dashboard/dashboard.component */ "./src/app/dashboard/dashboard.component.ts");
/* harmony import */ var _carrier_carrier_table_carrier_table_component__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! ./carrier/carrier-table/carrier-table.component */ "./src/app/carrier/carrier-table/carrier-table.component.ts");
/* harmony import */ var _carrier_carrier_table_dialog_add_carrier_add_carrier_dialog_component__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__(/*! ./carrier/carrier-table/dialog/add-carrier/add-carrier-dialog.component */ "./src/app/carrier/carrier-table/dialog/add-carrier/add-carrier-dialog.component.ts");
/* harmony import */ var _carrier_carrier_table_dialog_del_carrier_del_carrier_dialog_component__WEBPACK_IMPORTED_MODULE_26__ = __webpack_require__(/*! ./carrier/carrier-table/dialog/del-carrier/del-carrier-dialog.component */ "./src/app/carrier/carrier-table/dialog/del-carrier/del-carrier-dialog.component.ts");
/* harmony import */ var _shared_api_services_carrier_carrier_api_service__WEBPACK_IMPORTED_MODULE_27__ = __webpack_require__(/*! ./shared/api-services/carrier/carrier.api.service */ "./src/app/shared/api-services/carrier/carrier.api.service.ts");
/* harmony import */ var _shared_services_carrier_carrier_shared_service__WEBPACK_IMPORTED_MODULE_28__ = __webpack_require__(/*! ./shared/services/carrier/carrier.shared.service */ "./src/app/shared/services/carrier/carrier.shared.service.ts");
/* harmony import */ var _carrier_carrier_profile_carrier_profile_component__WEBPACK_IMPORTED_MODULE_29__ = __webpack_require__(/*! ./carrier/carrier-profile/carrier-profile.component */ "./src/app/carrier/carrier-profile/carrier-profile.component.ts");
/* harmony import */ var _carrier_carrier_profile_dialog_del_carrier_profile_dialog_del_carrier_profile_dialog_component__WEBPACK_IMPORTED_MODULE_30__ = __webpack_require__(/*! ./carrier/carrier-profile/dialog/del-carrier-profile-dialog/del-carrier-profile-dialog.component */ "./src/app/carrier/carrier-profile/dialog/del-carrier-profile-dialog/del-carrier-profile-dialog.component.ts");
/* harmony import */ var _carrier_carrier_profile_dialog_add_carrier_profile_dialog_add_carrier_profile_dialog_component__WEBPACK_IMPORTED_MODULE_31__ = __webpack_require__(/*! ./carrier/carrier-profile/dialog/add-carrier-profile-dialog/add-carrier-profile-dialog.component */ "./src/app/carrier/carrier-profile/dialog/add-carrier-profile-dialog/add-carrier-profile-dialog.component.ts");
/* harmony import */ var _shared_api_services_carrier_carrier_profile_api_service__WEBPACK_IMPORTED_MODULE_32__ = __webpack_require__(/*! ./shared/api-services/carrier/carrier-profile.api.service */ "./src/app/shared/api-services/carrier/carrier-profile.api.service.ts");
/* harmony import */ var _ratecard_rate_cards_table_rate_cards_table_component__WEBPACK_IMPORTED_MODULE_33__ = __webpack_require__(/*! ./ratecard/rate-cards-table/rate-cards-table.component */ "./src/app/ratecard/rate-cards-table/rate-cards-table.component.ts");
/* harmony import */ var _ratecard_rate_cards_table_dialog_delete_rate_cards_delete_rate_cards_dialog_component__WEBPACK_IMPORTED_MODULE_34__ = __webpack_require__(/*! ./ratecard/rate-cards-table/dialog/delete-rate-cards/delete-rate-cards-dialog.component */ "./src/app/ratecard/rate-cards-table/dialog/delete-rate-cards/delete-rate-cards-dialog.component.ts");
/* harmony import */ var _ratecard_rate_cards_add_trunks_rate_cards_add_trunks_component__WEBPACK_IMPORTED_MODULE_35__ = __webpack_require__(/*! ./ratecard/rate-cards-add-trunks/rate-cards-add-trunks.component */ "./src/app/ratecard/rate-cards-add-trunks/rate-cards-add-trunks.component.ts");
/* harmony import */ var _ratecard_rate_cards_convert_csv_rate_cards_convert_csv_component__WEBPACK_IMPORTED_MODULE_36__ = __webpack_require__(/*! ./ratecard/rate-cards-convert-csv/rate-cards-convert-csv.component */ "./src/app/ratecard/rate-cards-convert-csv/rate-cards-convert-csv.component.ts");
/* harmony import */ var _shared_services_ratecard_iso_codes_shared_service__WEBPACK_IMPORTED_MODULE_37__ = __webpack_require__(/*! ./shared/services/ratecard/iso-codes.shared.service */ "./src/app/shared/services/ratecard/iso-codes.shared.service.ts");
/* harmony import */ var _shared_api_services_ratecard_rate_cards_api_service__WEBPACK_IMPORTED_MODULE_38__ = __webpack_require__(/*! ./shared/api-services/ratecard/rate-cards.api.service */ "./src/app/shared/api-services/ratecard/rate-cards.api.service.ts");
/* harmony import */ var _shared_services_ratecard_rate_cards_shared_service__WEBPACK_IMPORTED_MODULE_39__ = __webpack_require__(/*! ./shared/services/ratecard/rate-cards.shared.service */ "./src/app/shared/services/ratecard/rate-cards.shared.service.ts");
/* harmony import */ var _ratecard_ratecard_importer_importer_table_importer_table_component__WEBPACK_IMPORTED_MODULE_40__ = __webpack_require__(/*! ./ratecard/ratecard-importer/importer-table/importer-table.component */ "./src/app/ratecard/ratecard-importer/importer-table/importer-table.component.ts");
/* harmony import */ var _shared_api_services_ratecard_importer_api_service__WEBPACK_IMPORTED_MODULE_41__ = __webpack_require__(/*! ./shared/api-services/ratecard/importer.api.service */ "./src/app/shared/api-services/ratecard/importer.api.service.ts");
/* harmony import */ var _shared_services_ratecard_importer_shared_service__WEBPACK_IMPORTED_MODULE_42__ = __webpack_require__(/*! ./shared/services/ratecard/importer.shared.service */ "./src/app/shared/services/ratecard/importer.shared.service.ts");
/* harmony import */ var _ratecard_ratecard_importer_importer_table_dialog_upload_rates_upload_rates_dialog_component__WEBPACK_IMPORTED_MODULE_43__ = __webpack_require__(/*! ./ratecard/ratecard-importer/importer-table/dialog/upload-rates/upload-rates-dialog.component */ "./src/app/ratecard/ratecard-importer/importer-table/dialog/upload-rates/upload-rates-dialog.component.ts");
/* harmony import */ var _ratecard_ratecard_view_carrier_s_ratecard_view_carrier_component__WEBPACK_IMPORTED_MODULE_44__ = __webpack_require__(/*! ./ratecard/ratecard-view-carrier-s/ratecard-view-carrier.component */ "./src/app/ratecard/ratecard-view-carrier-s/ratecard-view-carrier.component.ts");
/* harmony import */ var _ratecard_ratecard_view_carrier_p_ratecard_view_carrier_p_component__WEBPACK_IMPORTED_MODULE_45__ = __webpack_require__(/*! ./ratecard/ratecard-view-carrier-p/ratecard-view-carrier-p.component */ "./src/app/ratecard/ratecard-view-carrier-p/ratecard-view-carrier-p.component.ts");
/* harmony import */ var _shared_services_ratecard_main_table_std_shared_service__WEBPACK_IMPORTED_MODULE_46__ = __webpack_require__(/*! ./shared/services/ratecard/main-table-std.shared.service */ "./src/app/shared/services/ratecard/main-table-std.shared.service.ts");
/* harmony import */ var _shared_services_ratecard_main_table_prem_shared_service__WEBPACK_IMPORTED_MODULE_47__ = __webpack_require__(/*! ./shared/services/ratecard/main-table-prem.shared.service */ "./src/app/shared/services/ratecard/main-table-prem.shared.service.ts");
/* harmony import */ var _shared_services_ratecard_main_table_common_shared_service__WEBPACK_IMPORTED_MODULE_48__ = __webpack_require__(/*! ./shared/services/ratecard/main-table-common.shared.service */ "./src/app/shared/services/ratecard/main-table-common.shared.service.ts");
/* harmony import */ var _trunks_trunks_table_trunks_table_component__WEBPACK_IMPORTED_MODULE_49__ = __webpack_require__(/*! ./trunks/trunks-table/trunks-table.component */ "./src/app/trunks/trunks-table/trunks-table.component.ts");
/* harmony import */ var _trunks_trunks_table_dialog_add_trunks_add_trunks_component__WEBPACK_IMPORTED_MODULE_50__ = __webpack_require__(/*! ./trunks/trunks-table/dialog/add-trunks/add-trunks.component */ "./src/app/trunks/trunks-table/dialog/add-trunks/add-trunks.component.ts");
/* harmony import */ var _trunks_trunks_table_dialog_delete_trunks_delete_trunks_component__WEBPACK_IMPORTED_MODULE_51__ = __webpack_require__(/*! ./trunks/trunks-table/dialog/delete-trunks/delete-trunks.component */ "./src/app/trunks/trunks-table/dialog/delete-trunks/delete-trunks.component.ts");
/* harmony import */ var _ratecard_rate_cards_table_dialog_delete_rates_delete_rates_component__WEBPACK_IMPORTED_MODULE_52__ = __webpack_require__(/*! ./ratecard/rate-cards-table/dialog/delete-rates/delete-rates.component */ "./src/app/ratecard/rate-cards-table/dialog/delete-rates/delete-rates.component.ts");
/* harmony import */ var _ratecard_rate_cards_table_dialog_detach_trunks_detach_trunks_component__WEBPACK_IMPORTED_MODULE_53__ = __webpack_require__(/*! ./ratecard/rate-cards-table/dialog/detach-trunks/detach-trunks.component */ "./src/app/ratecard/rate-cards-table/dialog/detach-trunks/detach-trunks.component.ts");
/* harmony import */ var _shared_api_services_trunk_trunks_api_service__WEBPACK_IMPORTED_MODULE_54__ = __webpack_require__(/*! ./shared/api-services/trunk/trunks.api.service */ "./src/app/shared/api-services/trunk/trunks.api.service.ts");
/* harmony import */ var _shared_services_trunk_trunks_shared_service__WEBPACK_IMPORTED_MODULE_55__ = __webpack_require__(/*! ./shared/services/trunk/trunks.shared.service */ "./src/app/shared/services/trunk/trunks.shared.service.ts");
/* harmony import */ var _callplan_call_plan_table_call_plan_table_component__WEBPACK_IMPORTED_MODULE_56__ = __webpack_require__(/*! ./callplan/call-plan-table/call-plan-table.component */ "./src/app/callplan/call-plan-table/call-plan-table.component.ts");
/* harmony import */ var _callplan_call_plan_table_dialog_add_callplan_add_callplan_component__WEBPACK_IMPORTED_MODULE_57__ = __webpack_require__(/*! ./callplan/call-plan-table/dialog/add-callplan/add-callplan.component */ "./src/app/callplan/call-plan-table/dialog/add-callplan/add-callplan.component.ts");
/* harmony import */ var _callplan_call_plan_table_dialog_del_callplan_del_callplan_component__WEBPACK_IMPORTED_MODULE_58__ = __webpack_require__(/*! ./callplan/call-plan-table/dialog/del-callplan/del-callplan.component */ "./src/app/callplan/call-plan-table/dialog/del-callplan/del-callplan.component.ts");
/* harmony import */ var _callplan_call_plan_table_dialog_add_rate_card_add_rate_card_component__WEBPACK_IMPORTED_MODULE_59__ = __webpack_require__(/*! ./callplan/call-plan-table/dialog/add-rate-card/add-rate-card.component */ "./src/app/callplan/call-plan-table/dialog/add-rate-card/add-rate-card.component.ts");
/* harmony import */ var _callplan_call_plan_table_dialog_dettach_ratecards_dettach_ratecards_component__WEBPACK_IMPORTED_MODULE_60__ = __webpack_require__(/*! ./callplan/call-plan-table/dialog/dettach-ratecards/dettach-ratecards.component */ "./src/app/callplan/call-plan-table/dialog/dettach-ratecards/dettach-ratecards.component.ts");
/* harmony import */ var _callplan_call_plan_table_dialog_add_code_add_code_component__WEBPACK_IMPORTED_MODULE_61__ = __webpack_require__(/*! ./callplan/call-plan-table/dialog/add-code/add-code.component */ "./src/app/callplan/call-plan-table/dialog/add-code/add-code.component.ts");
/* harmony import */ var _callplan_call_plan_table_dialog_dettach_codes_dettach_codes_component__WEBPACK_IMPORTED_MODULE_62__ = __webpack_require__(/*! ./callplan/call-plan-table/dialog/dettach-codes/dettach-codes.component */ "./src/app/callplan/call-plan-table/dialog/dettach-codes/dettach-codes.component.ts");
/* harmony import */ var _callplan_call_plan_add_ratecard_call_plan_add_ratecard_component__WEBPACK_IMPORTED_MODULE_63__ = __webpack_require__(/*! ./callplan/call-plan-add-ratecard/call-plan-add-ratecard.component */ "./src/app/callplan/call-plan-add-ratecard/call-plan-add-ratecard.component.ts");
/* harmony import */ var _callplan_call_plan_add_code_call_plan_add_code_component__WEBPACK_IMPORTED_MODULE_64__ = __webpack_require__(/*! ./callplan/call-plan-add-code/call-plan-add-code.component */ "./src/app/callplan/call-plan-add-code/call-plan-add-code.component.ts");
/* harmony import */ var _shared_api_services_callplan_call_plan_api_service__WEBPACK_IMPORTED_MODULE_65__ = __webpack_require__(/*! ./shared/api-services/callplan/call-plan.api.service */ "./src/app/shared/api-services/callplan/call-plan.api.service.ts");
/* harmony import */ var _shared_services_callplan_call_plan_shared_service__WEBPACK_IMPORTED_MODULE_66__ = __webpack_require__(/*! ./shared/services/callplan/call-plan.shared.service */ "./src/app/shared/services/callplan/call-plan.shared.service.ts");
/* harmony import */ var _shared_services_callplan_attach_callplan_codes_shared_service__WEBPACK_IMPORTED_MODULE_67__ = __webpack_require__(/*! ./shared/services/callplan/attach-callplan-codes.shared.service */ "./src/app/shared/services/callplan/attach-callplan-codes.shared.service.ts");
/* harmony import */ var _lcr_lcr_callplan_table_lcr_callplan_table_component__WEBPACK_IMPORTED_MODULE_68__ = __webpack_require__(/*! ./lcr/lcr-callplan-table/lcr-callplan-table.component */ "./src/app/lcr/lcr-callplan-table/lcr-callplan-table.component.ts");
/* harmony import */ var _lcr_lcr_carrier_table_lcr_carrier_table_component__WEBPACK_IMPORTED_MODULE_69__ = __webpack_require__(/*! ./lcr/lcr-carrier-table/lcr-carrier-table.component */ "./src/app/lcr/lcr-carrier-table/lcr-carrier-table.component.ts");
/* harmony import */ var _lcr_lcr_ratecard_table_lcr_ratecard_table_component__WEBPACK_IMPORTED_MODULE_70__ = __webpack_require__(/*! ./lcr/lcr-ratecard-table/lcr-ratecard-table.component */ "./src/app/lcr/lcr-ratecard-table/lcr-ratecard-table.component.ts");
/* harmony import */ var _lcr_lcr_trunk_table_lcr_trunk_table_component__WEBPACK_IMPORTED_MODULE_71__ = __webpack_require__(/*! ./lcr/lcr-trunk-table/lcr-trunk-table.component */ "./src/app/lcr/lcr-trunk-table/lcr-trunk-table.component.ts");
/* harmony import */ var _shared_api_services_lcr_lcr_api_service__WEBPACK_IMPORTED_MODULE_72__ = __webpack_require__(/*! ./shared/api-services/lcr/lcr.api.service */ "./src/app/shared/api-services/lcr/lcr.api.service.ts");
/* harmony import */ var _shared_services_lcr_lcr_shared_service__WEBPACK_IMPORTED_MODULE_73__ = __webpack_require__(/*! ./shared/services/lcr/lcr.shared.service */ "./src/app/shared/services/lcr/lcr.shared.service.ts");
/* harmony import */ var _accounts_accounts_component__WEBPACK_IMPORTED_MODULE_74__ = __webpack_require__(/*! ./accounts/accounts.component */ "./src/app/accounts/accounts.component.ts");
/* harmony import */ var _login_login_component__WEBPACK_IMPORTED_MODULE_75__ = __webpack_require__(/*! ./login/login.component */ "./src/app/login/login.component.ts");
/* harmony import */ var _registration_registration_component__WEBPACK_IMPORTED_MODULE_76__ = __webpack_require__(/*! ./registration/registration.component */ "./src/app/registration/registration.component.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
// * Core Modules







// * UI Library: Angular Materials






// ? Main components



// ? Global Services







// ! Third Party Components



// ? DashBoard

// ? Carrier






// tslint:disable-next-line:max-line-length



// ? Ratecard







// ? Ratecard Importer




// ? Ratecard View By Carrier





// ? Trunks







// ? Call Plan












// ? LCR






// ? Accounts



var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"])({
            declarations: [
                // Main Layout Components
                _app_component__WEBPACK_IMPORTED_MODULE_10__["AppComponent"], _side_nav_side_nav_component__WEBPACK_IMPORTED_MODULE_11__["SideNavComponent"], _top_nav_top_nav_component__WEBPACK_IMPORTED_MODULE_12__["TopNavComponent"],
                // User
                _login_login_component__WEBPACK_IMPORTED_MODULE_75__["LoginComponent"], _registration_registration_component__WEBPACK_IMPORTED_MODULE_76__["RegistrationComponent"],
                // Dashboard
                _dashboard_dashboard_component__WEBPACK_IMPORTED_MODULE_23__["DashboardComponent"],
                // Carrier
                _carrier_carrier_table_carrier_table_component__WEBPACK_IMPORTED_MODULE_24__["CarrierTableComponent"], _carrier_carrier_table_dialog_add_carrier_add_carrier_dialog_component__WEBPACK_IMPORTED_MODULE_25__["AddCarrierDialogComponent"], _carrier_carrier_table_dialog_del_carrier_del_carrier_dialog_component__WEBPACK_IMPORTED_MODULE_26__["DelCarrierDialogComponent"], _carrier_carrier_profile_carrier_profile_component__WEBPACK_IMPORTED_MODULE_29__["CarrierProfileComponent"],
                _carrier_carrier_profile_dialog_del_carrier_profile_dialog_del_carrier_profile_dialog_component__WEBPACK_IMPORTED_MODULE_30__["DelCarrierProfileDialogComponent"], _carrier_carrier_profile_dialog_add_carrier_profile_dialog_add_carrier_profile_dialog_component__WEBPACK_IMPORTED_MODULE_31__["AddCarrierProfileDialogComponent"],
                // Ratecard
                _ratecard_rate_cards_table_rate_cards_table_component__WEBPACK_IMPORTED_MODULE_33__["RateCardsTableComponent"], _ratecard_rate_cards_table_dialog_delete_rate_cards_delete_rate_cards_dialog_component__WEBPACK_IMPORTED_MODULE_34__["DeleteRateCardsDialogComponent"], _ratecard_ratecard_importer_importer_table_importer_table_component__WEBPACK_IMPORTED_MODULE_40__["ImporterTableComponent"],
                _ratecard_ratecard_importer_importer_table_dialog_upload_rates_upload_rates_dialog_component__WEBPACK_IMPORTED_MODULE_43__["UploadRatesDialogComponent"], _ratecard_rate_cards_add_trunks_rate_cards_add_trunks_component__WEBPACK_IMPORTED_MODULE_35__["RateCardsAddTrunksComponent"], _ratecard_rate_cards_convert_csv_rate_cards_convert_csv_component__WEBPACK_IMPORTED_MODULE_36__["RateCardsConvertCsvComponent"], _ratecard_rate_cards_table_dialog_delete_rates_delete_rates_component__WEBPACK_IMPORTED_MODULE_52__["DeleteRatesComponent"],
                _ratecard_ratecard_view_carrier_s_ratecard_view_carrier_component__WEBPACK_IMPORTED_MODULE_44__["RatecardViewCarrierComponent"], _ratecard_ratecard_view_carrier_p_ratecard_view_carrier_p_component__WEBPACK_IMPORTED_MODULE_45__["RatecardViewCarrierPComponent"],
                // Trunk
                _trunks_trunks_table_trunks_table_component__WEBPACK_IMPORTED_MODULE_49__["TrunksTableComponent"], _trunks_trunks_table_dialog_add_trunks_add_trunks_component__WEBPACK_IMPORTED_MODULE_50__["AddTrunksComponent"], _trunks_trunks_table_dialog_delete_trunks_delete_trunks_component__WEBPACK_IMPORTED_MODULE_51__["DeleteTrunksComponent"], _ratecard_rate_cards_table_dialog_detach_trunks_detach_trunks_component__WEBPACK_IMPORTED_MODULE_53__["DetachTrunksComponent"],
                // Call Plan
                _callplan_call_plan_table_call_plan_table_component__WEBPACK_IMPORTED_MODULE_56__["CallPlanTableComponent"], _callplan_call_plan_table_dialog_add_callplan_add_callplan_component__WEBPACK_IMPORTED_MODULE_57__["AddCallPlanComponent"], _callplan_call_plan_table_dialog_del_callplan_del_callplan_component__WEBPACK_IMPORTED_MODULE_58__["DelCallPlanComponent"], _callplan_call_plan_add_ratecard_call_plan_add_ratecard_component__WEBPACK_IMPORTED_MODULE_63__["CallPlanAddRatecardComponent"],
                _callplan_call_plan_add_code_call_plan_add_code_component__WEBPACK_IMPORTED_MODULE_64__["CallPlanAddCodeComponent"], _callplan_call_plan_table_dialog_add_code_add_code_component__WEBPACK_IMPORTED_MODULE_61__["AddCodeComponent"], _callplan_call_plan_table_dialog_add_rate_card_add_rate_card_component__WEBPACK_IMPORTED_MODULE_59__["AddRateCardComponent"], _callplan_call_plan_table_dialog_dettach_ratecards_dettach_ratecards_component__WEBPACK_IMPORTED_MODULE_60__["DettachRatecardsComponent"],
                _callplan_call_plan_table_dialog_dettach_codes_dettach_codes_component__WEBPACK_IMPORTED_MODULE_62__["DettachCodesComponent"],
                // LCR
                _lcr_lcr_callplan_table_lcr_callplan_table_component__WEBPACK_IMPORTED_MODULE_68__["LcrCallPlanTableComponent"], _lcr_lcr_carrier_table_lcr_carrier_table_component__WEBPACK_IMPORTED_MODULE_69__["LcrCarrierTableComponent"], _lcr_lcr_ratecard_table_lcr_ratecard_table_component__WEBPACK_IMPORTED_MODULE_70__["LcrRatecardTableComponent"], _lcr_lcr_trunk_table_lcr_trunk_table_component__WEBPACK_IMPORTED_MODULE_71__["LcrTrunkTableComponent"],
                // Account
                _accounts_accounts_component__WEBPACK_IMPORTED_MODULE_74__["AccountsComponent"],
                // Global
                _shared_components_snackbars_success_success_snackbar_component__WEBPACK_IMPORTED_MODULE_18__["SuccessSnackbarComponent"], _shared_components_snackbars_error_error_snackbar_component__WEBPACK_IMPORTED_MODULE_19__["ErrorSnackbarComponent"],
            ],
            imports: [
                // Core Angular Modules
                _angular_http__WEBPACK_IMPORTED_MODULE_3__["HttpModule"], _angular_common_http__WEBPACK_IMPORTED_MODULE_4__["HttpClientModule"], _angular_platform_browser__WEBPACK_IMPORTED_MODULE_1__["BrowserModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormsModule"], _angular_common__WEBPACK_IMPORTED_MODULE_5__["CommonModule"], _angular_forms__WEBPACK_IMPORTED_MODULE_2__["ReactiveFormsModule"],
                // Third Party Modules
                ngx_papaparse__WEBPACK_IMPORTED_MODULE_21__["PapaParseModule"], ng_sidebar__WEBPACK_IMPORTED_MODULE_22__["SidebarModule"], ag_grid_angular__WEBPACK_IMPORTED_MODULE_20__["AgGridModule"].withComponents([]),
                // Angular Materials Modules
                _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_7__["BrowserAnimationsModule"], _angular_material__WEBPACK_IMPORTED_MODULE_8__["MatFormFieldModule"], _angular_material__WEBPACK_IMPORTED_MODULE_8__["MatInputModule"], _angular_material__WEBPACK_IMPORTED_MODULE_8__["MatStepperModule"], _angular_material__WEBPACK_IMPORTED_MODULE_8__["MatButtonModule"], _angular_material__WEBPACK_IMPORTED_MODULE_8__["MatSelectModule"], _angular_material__WEBPACK_IMPORTED_MODULE_8__["MatCheckboxModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_8__["MatRadioModule"], _angular_material__WEBPACK_IMPORTED_MODULE_8__["MatIconModule"], _angular_material__WEBPACK_IMPORTED_MODULE_8__["MatDialogModule"], _angular_material__WEBPACK_IMPORTED_MODULE_8__["MatToolbarModule"], _angular_material__WEBPACK_IMPORTED_MODULE_8__["MatDatepickerModule"], _angular_material__WEBPACK_IMPORTED_MODULE_8__["MatNativeDateModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_8__["MatTabsModule"], _angular_material__WEBPACK_IMPORTED_MODULE_8__["MatAutocompleteModule"], _angular_material__WEBPACK_IMPORTED_MODULE_8__["MatExpansionModule"], _angular_material__WEBPACK_IMPORTED_MODULE_8__["MatSliderModule"], _angular_material__WEBPACK_IMPORTED_MODULE_8__["MatSnackBarModule"],
                // Ag Grid & Routing
                _angular_router__WEBPACK_IMPORTED_MODULE_6__["RouterModule"].forRoot([
                    { path: '', component: _dashboard_dashboard_component__WEBPACK_IMPORTED_MODULE_23__["DashboardComponent"] },
                    { path: 'dashboard', component: _dashboard_dashboard_component__WEBPACK_IMPORTED_MODULE_23__["DashboardComponent"] },
                    { path: 'carrier-view', component: _carrier_carrier_table_carrier_table_component__WEBPACK_IMPORTED_MODULE_24__["CarrierTableComponent"] },
                    { path: 'carrier-profile', component: _carrier_carrier_profile_carrier_profile_component__WEBPACK_IMPORTED_MODULE_29__["CarrierProfileComponent"] },
                    { path: 'rate-card-importer', component: _ratecard_ratecard_importer_importer_table_importer_table_component__WEBPACK_IMPORTED_MODULE_40__["ImporterTableComponent"] },
                    { path: 'rate-card-view', component: _ratecard_rate_cards_table_rate_cards_table_component__WEBPACK_IMPORTED_MODULE_33__["RateCardsTableComponent"] },
                    { path: 'rate-card-add-trunks', component: _ratecard_rate_cards_add_trunks_rate_cards_add_trunks_component__WEBPACK_IMPORTED_MODULE_35__["RateCardsAddTrunksComponent"] },
                    { path: 'rate-card-convert-csv', component: _ratecard_rate_cards_convert_csv_rate_cards_convert_csv_component__WEBPACK_IMPORTED_MODULE_36__["RateCardsConvertCsvComponent"] },
                    { path: 'rate-card-view-carrier', component: _ratecard_ratecard_view_carrier_s_ratecard_view_carrier_component__WEBPACK_IMPORTED_MODULE_44__["RatecardViewCarrierComponent"] },
                    { path: 'rate-card-view-carrier-p', component: _ratecard_ratecard_view_carrier_p_ratecard_view_carrier_p_component__WEBPACK_IMPORTED_MODULE_45__["RatecardViewCarrierPComponent"] },
                    { path: 'trunks', component: _trunks_trunks_table_trunks_table_component__WEBPACK_IMPORTED_MODULE_49__["TrunksTableComponent"] },
                    { path: 'call-plan-view', component: _callplan_call_plan_table_call_plan_table_component__WEBPACK_IMPORTED_MODULE_56__["CallPlanTableComponent"] },
                    { path: 'call-plan-add-ratecard', component: _callplan_call_plan_add_ratecard_call_plan_add_ratecard_component__WEBPACK_IMPORTED_MODULE_63__["CallPlanAddRatecardComponent"] },
                    { path: 'call-plan-add-code', component: _callplan_call_plan_add_code_call_plan_add_code_component__WEBPACK_IMPORTED_MODULE_64__["CallPlanAddCodeComponent"] },
                    { path: 'lcr-carrier', component: _lcr_lcr_carrier_table_lcr_carrier_table_component__WEBPACK_IMPORTED_MODULE_69__["LcrCarrierTableComponent"] },
                    { path: 'lcr-ratecard', component: _lcr_lcr_ratecard_table_lcr_ratecard_table_component__WEBPACK_IMPORTED_MODULE_70__["LcrRatecardTableComponent"] },
                    { path: 'lcr-trunk', component: _lcr_lcr_trunk_table_lcr_trunk_table_component__WEBPACK_IMPORTED_MODULE_71__["LcrTrunkTableComponent"] },
                    { path: 'lcr-callplan', component: _lcr_lcr_callplan_table_lcr_callplan_table_component__WEBPACK_IMPORTED_MODULE_68__["LcrCallPlanTableComponent"] },
                    { path: 'accounts', component: _accounts_accounts_component__WEBPACK_IMPORTED_MODULE_74__["AccountsComponent"] },
                    { path: 'login', component: _login_login_component__WEBPACK_IMPORTED_MODULE_75__["LoginComponent"] },
                    { path: 'registration', component: _registration_registration_component__WEBPACK_IMPORTED_MODULE_76__["RegistrationComponent"] }
                ])
            ],
            providers: [
                // Global services
                _shared_services_global_nestedAgGrid_shared_service__WEBPACK_IMPORTED_MODULE_13__["NestedAgGridService"], _shared_services_global_snackbar_shared_service__WEBPACK_IMPORTED_MODULE_17__["SnackbarSharedService"], _shared_services_global_buttonStates_shared_service__WEBPACK_IMPORTED_MODULE_14__["ToggleButtonStateService"], _shared_services_global_codes_shared_service__WEBPACK_IMPORTED_MODULE_16__["CodesSharedService"],
                _shared_services_global_api_settings_shared_service__WEBPACK_IMPORTED_MODULE_15__["ApiSettingsSharedService"],
                // Carrier
                _shared_api_services_carrier_carrier_api_service__WEBPACK_IMPORTED_MODULE_27__["CarrierService"], _shared_services_carrier_carrier_shared_service__WEBPACK_IMPORTED_MODULE_28__["CarrierSharedService"],
                _shared_api_services_carrier_carrier_profile_api_service__WEBPACK_IMPORTED_MODULE_32__["CarrierProfileService"],
                // Ratecard
                _shared_api_services_ratecard_importer_api_service__WEBPACK_IMPORTED_MODULE_41__["ImporterService"], _shared_services_ratecard_importer_shared_service__WEBPACK_IMPORTED_MODULE_42__["ImporterSharedService"], _shared_api_services_ratecard_rate_cards_api_service__WEBPACK_IMPORTED_MODULE_38__["RateCardsService"], _shared_services_ratecard_rate_cards_shared_service__WEBPACK_IMPORTED_MODULE_39__["RateCardsSharedService"],
                // Ratecard Viewer
                _shared_services_ratecard_iso_codes_shared_service__WEBPACK_IMPORTED_MODULE_37__["IsoCodesSharedService"], _shared_services_ratecard_main_table_std_shared_service__WEBPACK_IMPORTED_MODULE_46__["MainTableStdSharedService"], _shared_services_ratecard_main_table_prem_shared_service__WEBPACK_IMPORTED_MODULE_47__["MainTablePremSharedService"],
                _shared_services_ratecard_main_table_common_shared_service__WEBPACK_IMPORTED_MODULE_48__["MainTableCommonSharedService"],
                _shared_api_services_trunk_trunks_api_service__WEBPACK_IMPORTED_MODULE_54__["TrunksService"], _shared_services_trunk_trunks_shared_service__WEBPACK_IMPORTED_MODULE_55__["TrunksSharedService"],
                _shared_api_services_callplan_call_plan_api_service__WEBPACK_IMPORTED_MODULE_65__["CallPlanService"], _shared_services_callplan_call_plan_shared_service__WEBPACK_IMPORTED_MODULE_66__["CallPlanSharedService"], _shared_services_callplan_attach_callplan_codes_shared_service__WEBPACK_IMPORTED_MODULE_67__["CodesFormSharedService"],
                _shared_api_services_lcr_lcr_api_service__WEBPACK_IMPORTED_MODULE_72__["LCRService"], _shared_services_lcr_lcr_shared_service__WEBPACK_IMPORTED_MODULE_73__["LCRSharedService"],
            ],
            bootstrap: [_app_component__WEBPACK_IMPORTED_MODULE_10__["AppComponent"]],
            entryComponents: [
                // Carrier
                _carrier_carrier_table_dialog_add_carrier_add_carrier_dialog_component__WEBPACK_IMPORTED_MODULE_25__["AddCarrierDialogComponent"], _carrier_carrier_table_dialog_del_carrier_del_carrier_dialog_component__WEBPACK_IMPORTED_MODULE_26__["DelCarrierDialogComponent"],
                _carrier_carrier_profile_dialog_add_carrier_profile_dialog_add_carrier_profile_dialog_component__WEBPACK_IMPORTED_MODULE_31__["AddCarrierProfileDialogComponent"], _carrier_carrier_profile_dialog_del_carrier_profile_dialog_del_carrier_profile_dialog_component__WEBPACK_IMPORTED_MODULE_30__["DelCarrierProfileDialogComponent"],
                // Ratecard
                _ratecard_rate_cards_table_dialog_delete_rate_cards_delete_rate_cards_dialog_component__WEBPACK_IMPORTED_MODULE_34__["DeleteRateCardsDialogComponent"], _ratecard_ratecard_importer_importer_table_dialog_upload_rates_upload_rates_dialog_component__WEBPACK_IMPORTED_MODULE_43__["UploadRatesDialogComponent"],
                _shared_components_snackbars_success_success_snackbar_component__WEBPACK_IMPORTED_MODULE_18__["SuccessSnackbarComponent"], _shared_components_snackbars_error_error_snackbar_component__WEBPACK_IMPORTED_MODULE_19__["ErrorSnackbarComponent"],
                _trunks_trunks_table_dialog_delete_trunks_delete_trunks_component__WEBPACK_IMPORTED_MODULE_51__["DeleteTrunksComponent"], _trunks_trunks_table_dialog_add_trunks_add_trunks_component__WEBPACK_IMPORTED_MODULE_50__["AddTrunksComponent"], _ratecard_rate_cards_table_dialog_delete_rates_delete_rates_component__WEBPACK_IMPORTED_MODULE_52__["DeleteRatesComponent"], _ratecard_rate_cards_table_dialog_detach_trunks_detach_trunks_component__WEBPACK_IMPORTED_MODULE_53__["DetachTrunksComponent"],
                _callplan_call_plan_table_dialog_add_callplan_add_callplan_component__WEBPACK_IMPORTED_MODULE_57__["AddCallPlanComponent"], _callplan_call_plan_table_dialog_del_callplan_del_callplan_component__WEBPACK_IMPORTED_MODULE_58__["DelCallPlanComponent"], _callplan_call_plan_table_dialog_add_code_add_code_component__WEBPACK_IMPORTED_MODULE_61__["AddCodeComponent"], _callplan_call_plan_table_dialog_add_rate_card_add_rate_card_component__WEBPACK_IMPORTED_MODULE_59__["AddRateCardComponent"],
                _callplan_call_plan_table_dialog_dettach_ratecards_dettach_ratecards_component__WEBPACK_IMPORTED_MODULE_60__["DettachRatecardsComponent"], _callplan_call_plan_table_dialog_dettach_codes_dettach_codes_component__WEBPACK_IMPORTED_MODULE_62__["DettachCodesComponent"]
            ],
        })
    ], AppModule);
    return AppModule;
}());



/***/ }),

/***/ "./src/app/callplan/call-plan-add-code/call-plan-add-code.component.html":
/*!*******************************************************************************!*\
  !*** ./src/app/callplan/call-plan-add-code/call-plan-add-code.component.html ***!
  \*******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<section>\n    <div class=\"callplan-container\">\n        <ag-grid-angular id=\"callplan-table\" class=\"ag-theme-balham\" \n            [columnDefs]=\"columnDefsCallplan\" [rowData]=\"rowDataCallplan\"\n            [enableFilter]=\"true\" [floatingFilter]=\"true\"\n            [rowSelection]=\"rowSelectionS\" [suppressRowClickSelection]=\"true\" (selectionChanged)=\"onSelectionChanged($event)\"\n            [enableSorting]=\"true\" [suppressMovableColumns]=\"true\"\n            [enableColResize]=\"true\" (gridSizeChanged)=\"onGridSizeChanged($event)\"\n            [headerHeight]=\"40\" [floatingFiltersHeight]=\"30\"\n        \n            (gridReady)=\"onGridReadyCallplan($event)\"\n        >\n        </ag-grid-angular>\n    </div>\n\n    <div class=\"stepper-container\">\n        <mat-horizontal-stepper [linear]=\"true\" #stepper>\n\n            <mat-step [stepControl]=\"addCodeInfoFormGroup\">\n                <ng-template matStepLabel>Enter Code Info</ng-template>\n                <form [formGroup]=\"addCodeInfoFormGroup\">\n\n                    <mat-form-field> \n                        <mat-select placeholder=\"Carrier Code\" formControlName=\"carrierCtrl\">\n                            <mat-option *ngFor=\"let code of carrierInfo\" [value]=\"code.code\">\n                                {{code.code}} - {{code.name}}\n                            </mat-option>\n                        </mat-select>\n                    </mat-form-field>\n            \n                    <mat-form-field> \n                        <mat-select placeholder=\"Plan Type\" formControlName=\"plantypeCtrl\">\n                            <mat-option *ngFor=\"let planType of codePlanTypes\" [value]=\"planType.code\">\n                                {{planType.name}}\n                            </mat-option>\n                        </mat-select>\n                    </mat-form-field>\n\n                    <mat-form-field> \n                        <mat-select placeholder=\"Plan Priority\" formControlName=\"planpriorityCtrl\">\n                            <mat-option *ngFor=\"let planPriority of planPriorityList\" [value]=\"planPriority.num\">\n                                {{planPriority.num}}\n                            </mat-option>\n                        </mat-select>\n                    </mat-form-field>\n\n                    <mat-form-field >\n                        <input matInput placeholder=\"Length of plan in days\" formControlName=\"dayperiodCtrl\" matTooltip=\"Type 0 for unlimited days\" >\n                        <mat-hint align=\"end\">Type 0 for unlimited days</mat-hint>\n                        <mat-error *ngIf=\"addCodeInfoFormGroup.get('dayperiodCtrl').hasError('required')\">\n                            Plan in days is <strong>required</strong>\n                        </mat-error>\n                        <mat-error *ngIf=\"addCodeInfoFormGroup.get('dayperiodCtrl').hasError('pattern') && !addCodeInfoFormGroup.get('dayperiodCtrl').hasError('required')\">\n                            Please enter numbers only\n                        </mat-error>\n                    </mat-form-field>\n\n                    <mat-form-field> \n                        <input matInput #input maxlength=\"2\" placeholder=\"Enter Plan Number\" formControlName=\"plannumberCtrl\" >\n                        <mat-hint align=\"end\">Plan number 00 -> 20 - {{input.value?.length || 0}} / 2</mat-hint>\n                        <mat-error *ngIf=\"addCodeInfoFormGroup.get('plannumberCtrl').hasError('required')\">\n                            Plan number days is <strong>required</strong>\n                        </mat-error>\n                        <mat-error *ngIf=\"addCodeInfoFormGroup.get('plannumberCtrl').hasError('pattern') && !addCodeInfoFormGroup.get('plannumberCtrl').hasError('required')\">\n                            Please enter numbers only\n                        </mat-error>\n                    </mat-form-field>    \n                </form>\n\n                <div class=\"stepper-controls\">\n                    <button mat-button matStepperNext [disabled]=\"!addCodeInfoFormGroup.valid\">Next</button>\n                    <button mat-button (click)=\"insertDummyDataCodes()\">TEST DATA</button>\n                </div>\n            </mat-step>\n\n            <mat-step [stepControl]=\"attachCodesFormGroup\" class=\"attachcodes-mat-step\">\n                <ng-template matStepLabel>Attach Codes</ng-template>\n                <form [formGroup]=\"attachCodesFormGroup\" class=\"attachcodes-form\">\n                    <div formArrayName=\"codes\" *ngFor=\"let codeFG of attachCodesFormGroup.get['codes'].controls; let i = index\">\n                        <button *ngIf=\"attachCodesFormGroup.get['codes'].controls.length > 1\" (click)=\"removeAddress(i)\" class=\"country-code-trash\">\n                            <i class=\"fas fa-trash\"></i>\n                        </button>\n                        <div [formGroupName]=\"i\" class=\"addcodes-container\">\n                            <div class=\"origination-section\">\n                                <mat-form-field class=\"select-width\">\n                                    <mat-select placeholder=\"Origination Code\" formControlName=\"originationCtrl\">\n                                    <mat-option *ngFor=\"let code of countryCodeList\" [value]=\"code.code\">{{code.country}} - {{code.code}}</mat-option>\n                                    </mat-select>\n                                </mat-form-field>\n                            </div>\n                            <div class=\"destination-section\">\n                                <mat-form-field class=\"select-width\">\n                                    <mat-select placeholder=\"Destination Code\" formControlName=\"destinationCtrl\" (change)=\"onSelectChangeDest($event)\" multiple>\n                                    <mat-option *ngFor=\"let code of countryCodeList\" [value]=\"code.code\">{{code.country}} - {{code.code}}</mat-option>\n                                    </mat-select>\n                                </mat-form-field>\n                            </div>\n                        </div>\n                    </div> <!-- end nested array FormGroup -->\n\n                    <div class=\"stepper-controls\">\n                        <button mat-button (click)=\"addCodes()\"> Add New Country Code</button>\n                        <button mat-button matStepperPrevious >Back</button>\n                        <button mat-button matStepperNext (click)=\"codesObjBuilder()\" [disabled]=\"!attachCodesFormGroup.valid\">Next</button>\n                    </div>\n                </form>\n            </mat-step>\n\n            <mat-step [stepControl]=\"\">\n                <ng-template matStepLabel>Review, Submit</ng-template>\n                <pre class=\"finalCodesObj-preview\">{{finalCodesObj | json}}</pre>\n                <div>\n                    <button mat-button matStepperPrevious>Back</button>  \n                    <button mat-button (click)=\"click_attachCodes()\">Submit</button>\n                </div>\n            </mat-step>\n\n        </mat-horizontal-stepper>\n    </div>\n\n</section>"

/***/ }),

/***/ "./src/app/callplan/call-plan-add-code/call-plan-add-code.component.scss":
/*!*******************************************************************************!*\
  !*** ./src/app/callplan/call-plan-add-code/call-plan-add-code.component.scss ***!
  \*******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "section {\n  margin-top: 5px;\n  margin-left: 5px;\n  margin-right: 5px;\n  display: flex; }\n  section button {\n    border: 1px solid black;\n    margin-right: 5px; }\n  section .callplan-container {\n    flex: 1;\n    height: auto; }\n  section .callplan-container #callplan-table {\n      width: 100%;\n      height: 85vh; }\n  section .stepper-container {\n    flex: 2;\n    height: 85vh; }\n  section .stepper-container form {\n      display: flex;\n      flex-direction: column;\n      align-content: center; }\n  section .stepper-container form mat-form-field {\n        flex: 1;\n        padding-left: 5%;\n        padding-right: 5%; }\n  section .stepper-container .stepper-controls {\n      padding-left: 5%;\n      padding-right: 5%;\n      margin-top: 1%; }\n  section .stepper-container .attachcodes-form {\n      width: 100%;\n      height: 85vh;\n      overflow-y: auto; }\n  section .stepper-container .attachcodes-form div {\n        display: flex; }\n  section .stepper-container .attachcodes-form div .country-code-trash {\n          border: none; }\n  section .stepper-container .attachcodes-form div .country-code-trash:hover {\n            color: red; }\n  section .stepper-container .attachcodes-form div .country-code-trash:focus {\n            outline: 0; }\n  section .stepper-container .attachcodes-form div .addcodes-container {\n          display: flex;\n          flex: 9; }\n  section .stepper-container .attachcodes-form div .addcodes-container .origination-section {\n            flex: 1; }\n  section .stepper-container .attachcodes-form div .addcodes-container .destination-section {\n            flex: 2; }\n  section .stepper-container .attachcodes-form div .addcodes-container mat-form-field {\n            width: 100%; }\n  section .finalCodesObj-preview {\n    width: 100%;\n    height: 40vh; }\n"

/***/ }),

/***/ "./src/app/callplan/call-plan-add-code/call-plan-add-code.component.ts":
/*!*****************************************************************************!*\
  !*** ./src/app/callplan/call-plan-add-code/call-plan-add-code.component.ts ***!
  \*****************************************************************************/
/*! exports provided: CallPlanAddCodeComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CallPlanAddCodeComponent", function() { return CallPlanAddCodeComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _shared_api_services_callplan_call_plan_api_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./../../shared/api-services/callplan/call-plan.api.service */ "./src/app/shared/api-services/callplan/call-plan.api.service.ts");
/* harmony import */ var _shared_api_services_carrier_carrier_api_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./../../shared/api-services/carrier/carrier.api.service */ "./src/app/shared/api-services/carrier/carrier.api.service.ts");
/* harmony import */ var _shared_services_global_codes_shared_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./../../shared/services/global/codes.shared.service */ "./src/app/shared/services/global/codes.shared.service.ts");
/* harmony import */ var _shared_services_global_buttonStates_shared_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./../../shared/services/global/buttonStates.shared.service */ "./src/app/shared/services/global/buttonStates.shared.service.ts");
/* harmony import */ var _shared_services_global_snackbar_shared_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./../../shared/services/global/snackbar.shared.service */ "./src/app/shared/services/global/snackbar.shared.service.ts");
/* harmony import */ var _shared_services_callplan_attach_callplan_codes_shared_service__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./../../shared/services/callplan/attach-callplan-codes.shared.service */ "./src/app/shared/services/callplan/attach-callplan-codes.shared.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};








var CallPlanAddCodeComponent = /** @class */ (function () {
    function CallPlanAddCodeComponent(callplanService, carrierService, _codes, _toggleButton, _snackbar, _formBuilder, _codesForm) {
        this.callplanService = callplanService;
        this.carrierService = carrierService;
        this._codes = _codes;
        this._toggleButton = _toggleButton;
        this._snackbar = _snackbar;
        this._formBuilder = _formBuilder;
        this._codesForm = _codesForm;
        this.rowSelectionS = 'single';
        this.finalCodesObj = [];
        this.columnDefsCallplan = this.createColumnDefsCallplan();
    }
    CallPlanAddCodeComponent.prototype.ngOnInit = function () {
        this.get_allCallplan();
        this.get_allCarrier();
        this.initCodesFormData();
        this.initCodesformGroup();
    };
    // ================================================================================
    // Attach Codes API
    // ================================================================================
    CallPlanAddCodeComponent.prototype.get_allCallplan = function () {
        var _this = this;
        this.callplanService.get_allCallplan().subscribe(function (data) {
            _this.rowDataCallplan = data;
        });
    };
    CallPlanAddCodeComponent.prototype.get_allCarrier = function () {
        var _this = this;
        this.carrierService.get_carriers().subscribe(function (data) {
            _this.carrierInfo = data;
            console.log(data);
        });
    };
    CallPlanAddCodeComponent.prototype.post_attachNewCode = function (callplanId, body) {
        var _this = this;
        this.callplanService.post_newPlanCode(callplanId, body).subscribe(function (resp) {
            console.log(resp);
            if (resp.status === 200) {
                _this._snackbar.snackbar_success('Codes Attached Successful.', 2000);
            }
        }, function (error) {
            console.log(error);
            _this._snackbar.snackbar_error('Codes Attached failed.', 2000);
        });
    };
    // ================================================================================
    // Form Data & Form Groups
    // ================================================================================
    CallPlanAddCodeComponent.prototype.initCodesFormData = function () {
        this.countryCodeList = this._codes.getCountryCodes();
        this.codePlanTypes = this._codesForm.provideCodePlanTypes();
        this.planPriorityList = this._codesForm.providePriorityList();
    };
    CallPlanAddCodeComponent.prototype.initCodesformGroup = function () {
        this.addCodeInfoFormGroup = this._formBuilder.group(this.buildAddCodeInfoFormGroup());
        this.attachCodesFormGroup = this._formBuilder.group({
            codes: this._formBuilder.array([
                this.buildCountryCodeFormGroup()
            ])
        });
    };
    CallPlanAddCodeComponent.prototype.buildAddCodeInfoFormGroup = function () {
        return {
            carrierCtrl: ['', _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required],
            plantypeCtrl: ['', _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required],
            planpriorityCtrl: ['', _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required],
            dayperiodCtrl: ['', [_angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required, _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].pattern('^[0-9]*$')]],
            plannumberCtrl: ['', [_angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required, _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].pattern('^[0-9]*$')]]
        };
    };
    CallPlanAddCodeComponent.prototype.buildCountryCodeFormGroup = function () {
        return this._formBuilder.group({
            originationCtrl: ['', _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required],
            destinationCtrl: ['', _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required]
        });
    };
    // ================================================================================
    // AG Grid Init
    // ================================================================================
    CallPlanAddCodeComponent.prototype.onGridReadyCallplan = function (params) {
        this.gridApiCallplan = params.api;
        params.api.sizeColumnsToFit();
    };
    CallPlanAddCodeComponent.prototype.createColumnDefsCallplan = function () {
        return [
            {
                headerName: 'Call Plan', field: 'title',
                checkboxSelection: true,
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Carrier Name', field: 'carrier_name',
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Available', field: 'available',
            }
        ];
    };
    // ================================================================================
    // AG Grid UI
    // ================================================================================
    CallPlanAddCodeComponent.prototype.onGridSizeChanged = function (params) {
        params.api.sizeColumnsToFit();
    };
    CallPlanAddCodeComponent.prototype.onSelectionChanged = function (params) {
        this.callplanId = this.gridApiCallplan.getSelectedRows()[0].id;
    };
    CallPlanAddCodeComponent.prototype.onSelectChangeDest = function (params) {
        var formArrLen = this.attachCountryCodesFormGroup.get('codes').value.length;
        for (var i = 0; i < formArrLen; i++) {
            var destinationCtrl = this.attachCountryCodesFormGroup.get('codes')['controls'][i].get('destinationCtrl').value;
            for (var x = 0; x < destinationCtrl.length; x++) {
                var destinationSetValue = this.attachCountryCodesFormGroup.get('codes')['controls'][i].get('destinationCtrl');
                if (destinationCtrl[0] === '0') {
                    destinationSetValue.setValue(['0']);
                }
            }
        }
    };
    // ================================================================================
    // Form Controls
    // ================================================================================
    CallPlanAddCodeComponent.prototype.addCodes = function () {
        var control = this.attachCodesFormGroup.controls['codes'];
        control.push(this.buildCountryCodeFormGroup());
    };
    CallPlanAddCodeComponent.prototype.removeAddress = function (index) {
        var control = this.attachCodesFormGroup.controls['codes'];
        control.removeAt(index);
    };
    CallPlanAddCodeComponent.prototype.codesObjBuilder = function () {
        var countryCodeArr = this.attachCodesFormGroup.get('codes').value;
        for (var i = 0; i < countryCodeArr.length; i++) {
            var ori_cc = countryCodeArr[i].originationCtrl;
            var destinationLen = countryCodeArr[i].destinationCtrl.length;
            for (var x = 0; x < destinationLen; x++) {
                this.finalCodesObj.push({
                    ori_cc: parseInt(ori_cc, 0),
                    des_cc: parseInt(countryCodeArr[i].destinationCtrl[x], 0),
                    carrier_code: this.addCodeInfoFormGroup.get('carrierCtrl').value,
                    planType: this.addCodeInfoFormGroup.get('plantypeCtrl').value,
                    priority: this.addCodeInfoFormGroup.get('planpriorityCtrl').value,
                    day_period: parseInt(this.addCodeInfoFormGroup.get('dayperiodCtrl').value, 0),
                    planNumber: parseInt(this.addCodeInfoFormGroup.get('plannumberCtrl').value, 0)
                });
            }
        }
    };
    CallPlanAddCodeComponent.prototype.click_attachCodes = function () {
        for (var i = 0; i < this.finalCodesObj.length; i++) {
            this.post_attachNewCode(this.callplanId, this.finalCodesObj[i]);
        }
        this.resetForms();
    };
    CallPlanAddCodeComponent.prototype.resetForms = function () {
        this.addCodeInfoFormGroup.reset();
        this.attachCodesFormGroup.reset();
        this.finalCodesObj = [];
    };
    CallPlanAddCodeComponent.prototype.insertDummyDataCodes = function () {
        this.addCodeInfoFormGroup.get('plantypeCtrl').setValue(0);
        this.addCodeInfoFormGroup.get('planpriorityCtrl').setValue(1);
        this.addCodeInfoFormGroup.get('dayperiodCtrl').setValue(27);
        this.addCodeInfoFormGroup.get('plannumberCtrl').setValue(1);
    };
    CallPlanAddCodeComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-call-plan-add-code',
            template: __webpack_require__(/*! ./call-plan-add-code.component.html */ "./src/app/callplan/call-plan-add-code/call-plan-add-code.component.html"),
            styles: [__webpack_require__(/*! ./call-plan-add-code.component.scss */ "./src/app/callplan/call-plan-add-code/call-plan-add-code.component.scss")]
        }),
        __metadata("design:paramtypes", [_shared_api_services_callplan_call_plan_api_service__WEBPACK_IMPORTED_MODULE_2__["CallPlanService"],
            _shared_api_services_carrier_carrier_api_service__WEBPACK_IMPORTED_MODULE_3__["CarrierService"],
            _shared_services_global_codes_shared_service__WEBPACK_IMPORTED_MODULE_4__["CodesSharedService"],
            _shared_services_global_buttonStates_shared_service__WEBPACK_IMPORTED_MODULE_5__["ToggleButtonStateService"],
            _shared_services_global_snackbar_shared_service__WEBPACK_IMPORTED_MODULE_6__["SnackbarSharedService"],
            _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormBuilder"],
            _shared_services_callplan_attach_callplan_codes_shared_service__WEBPACK_IMPORTED_MODULE_7__["CodesFormSharedService"]])
    ], CallPlanAddCodeComponent);
    return CallPlanAddCodeComponent;
}());



/***/ }),

/***/ "./src/app/callplan/call-plan-add-ratecard/call-plan-add-ratecard.component.html":
/*!***************************************************************************************!*\
  !*** ./src/app/callplan/call-plan-add-ratecard/call-plan-add-ratecard.component.html ***!
  \***************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<section>\n    <div class=\"callplan-container\">\n        <ag-grid-angular id=\"callplan-table\" class=\"ag-theme-balham\" \n            [columnDefs]=\"columnDefsCallplan\" [rowData]=\"rowDataCallplan\"\n            [enableFilter]=\"true\" [floatingFilter]=\"true\"\n            [rowSelection]=\"rowSelectionS\" [suppressRowClickSelection]=\"true\"\n            [enableSorting]=\"true\" [suppressMovableColumns]=\"true\"\n            [enableColResize]=\"true\" (gridSizeChanged)=\"onGridSizeChanged($event)\"\n            [headerHeight]=\"40\" [floatingFiltersHeight]=\"30\"\n        \n            (gridReady)=\"on_GridReady_CallPlan($event)\"\n        >\n        </ag-grid-angular>\n        <button mat-button (click)=\"resetAttachRatecardForm()\" [disabled]=\"toggleButtonStates()\" class=\"deselect-button\"> Deselect All </button>\n    </div>\n\n    <div class=\"ratecard-container\">\n        <ag-grid-angular id=\"ratecardgroup-table\" class=\"ag-theme-balham\" \n            [columnDefs]=\"columnDefsRatecard\" [rowData]=\"rowDataRatecard\"\n            [enableFilter]=\"true\" [floatingFilter]=\"true\" [suppressMovableColumns]=\"true\"\n            [rowSelection]=\"rowSelectionM\" [suppressRowClickSelection]=\"true\" [groupSelectsChildren]=\"true\"\n            (selectionChanged)=\"onSelectionChanged()\" [enableSorting]=\"true\"\n            [enableColResize]=\"true\" (gridSizeChanged)=\"onGridSizeChanged($event)\"\n            [getNodeChildDetails]=\"getNodeChildDetails\"\n            [pagination]=\"true\" [paginationAutoPageSize]=\"true\"\n            [headerHeight]=\"40\" [floatingFiltersHeight]=\"30\"\n        \n            (gridReady)=\"on_GridReady_Ratecard($event)\"\n        >\n        </ag-grid-angular>\n    </div>\n\n    <div class=\"ratecard-importer\">\n        <ag-grid-angular id=\"ratecardReview-table\" class=\"ag-theme-balham\" \n            [columnDefs]=\"columnDefsReview\" [rowData]=\"\"\n            [stopEditingWhenGridLosesFocus]=\"true\" [singleClickEdit]=\"true\" \n            [enableFilter]=\"true\" [floatingFilter]=\"true\"\n            [enableColResize]=\"true\" [enableSorting]=\"true\"\n            [pagination]=\"true\" [paginationAutoPageSize]=\"true\"\n            [enableCellChangeFlash]=\"true\" (gridSizeChanged)=\"onGridSizeChanged($event)\"\n            [headerHeight]=\"40\" [floatingFiltersHeight]=\"30\"\n\n            (gridReady)=\"on_GridReady_Review($event)\"\n        >\n        </ag-grid-angular>\n            <span>Priority:</span>\n            <mat-slider max=\"10\" min=\"1\" thumb-label=\"true\" value=\"1\" tickInterval=\"1\" (change)=\"handleSliderChange($event)\" [disabled]=\"toggleButtonStates()\"></mat-slider>\n            <button mat-button class=\"attach-ratecard\" (click)=\"click_attachRatecard()\"> Attach Ratecards </button>\n    </div>\n    \n</section>\n"

/***/ }),

/***/ "./src/app/callplan/call-plan-add-ratecard/call-plan-add-ratecard.component.scss":
/*!***************************************************************************************!*\
  !*** ./src/app/callplan/call-plan-add-ratecard/call-plan-add-ratecard.component.scss ***!
  \***************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "section {\n  margin-top: 5px;\n  margin-left: 5px;\n  margin-right: 5px; }\n  section .callplan-container {\n    width: 10%;\n    height: auto;\n    float: left; }\n  section .callplan-container #callplan-table {\n      width: 100%;\n      height: 82.5vh;\n      float: left; }\n  section .callplan-container .deselect-button {\n      margin-top: 30px; }\n  section .ratecard-container {\n    width: 40%;\n    height: auto;\n    float: left; }\n  section .ratecard-container #ratecardgroup-table {\n      width: 100%;\n      height: 85vh;\n      float: left; }\n  section .ratecard-importer {\n    width: 50%;\n    height: auto;\n    float: left; }\n  section .ratecard-importer #ratecardReview-table {\n      width: 99%;\n      height: 85vh;\n      float: left; }\n  section .ratecard-importer mat-slider {\n      width: 20vw;\n      margin-left: 5px;\n      margin-right: 5px; }\n  section button {\n    border: 1px solid #E0E0E0;\n    width: auto;\n    height: auto;\n    padding-left: 5px;\n    padding-right: 5px; }\n  section button.attach-ratecard {\n    border: 2px solid green;\n    margin-right: 5px; }\n"

/***/ }),

/***/ "./src/app/callplan/call-plan-add-ratecard/call-plan-add-ratecard.component.ts":
/*!*************************************************************************************!*\
  !*** ./src/app/callplan/call-plan-add-ratecard/call-plan-add-ratecard.component.ts ***!
  \*************************************************************************************/
/*! exports provided: CallPlanAddRatecardComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CallPlanAddRatecardComponent", function() { return CallPlanAddRatecardComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _shared_api_services_callplan_call_plan_api_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./../../shared/api-services/callplan/call-plan.api.service */ "./src/app/shared/api-services/callplan/call-plan.api.service.ts");
/* harmony import */ var _shared_services_callplan_call_plan_shared_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../shared/services/callplan/call-plan.shared.service */ "./src/app/shared/services/callplan/call-plan.shared.service.ts");
/* harmony import */ var _shared_api_services_ratecard_rate_cards_api_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./../../shared/api-services/ratecard/rate-cards.api.service */ "./src/app/shared/api-services/ratecard/rate-cards.api.service.ts");
/* harmony import */ var _shared_services_global_nestedAgGrid_shared_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./../../shared/services/global/nestedAgGrid.shared.service */ "./src/app/shared/services/global/nestedAgGrid.shared.service.ts");
/* harmony import */ var _shared_services_global_snackbar_shared_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./../../shared/services/global/snackbar.shared.service */ "./src/app/shared/services/global/snackbar.shared.service.ts");
/* harmony import */ var _shared_services_global_buttonStates_shared_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./../../shared/services/global/buttonStates.shared.service */ "./src/app/shared/services/global/buttonStates.shared.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};







var CallPlanAddRatecardComponent = /** @class */ (function () {
    function CallPlanAddRatecardComponent(callPlanService, callPlanSharedService, rateCardsService, nestedAgGridService, snackbarSharedService, toggleButtonStateService) {
        this.callPlanService = callPlanService;
        this.callPlanSharedService = callPlanSharedService;
        this.rateCardsService = rateCardsService;
        this.nestedAgGridService = nestedAgGridService;
        this.snackbarSharedService = snackbarSharedService;
        this.toggleButtonStateService = toggleButtonStateService;
        // AG grid UI props
        this.rowSelectionS = 'single';
        this.rowSelectionM = 'multiple';
        this.getNodeChildDetails = this.nestedAgGridService.returnSetGroups();
        this.columnDefsCallplan = this.createColumnDefsCallPlan();
        this.columnDefsRatecard = this.createColumnDefsRatecard();
        this.columnDefsReview = this.createColumnDefsReview();
    }
    CallPlanAddRatecardComponent.prototype.ngOnInit = function () {
        this.get_CallPlans();
        this.get_RateCards();
    };
    // ================================================================================
    // API Service
    // ================================================================================
    CallPlanAddRatecardComponent.prototype.get_CallPlans = function () {
        var _this = this;
        this.callPlanService.get_allCallplan().subscribe(function (data) { _this.rowDataCallplan = data; });
    };
    CallPlanAddRatecardComponent.prototype.get_RateCards = function () {
        var _this = this;
        this.rateCardsService.get_ratecard().subscribe(function (data) { _this.rowDataRatecard = _this.nestedAgGridService.formatDataToNestedArr(data); });
    };
    CallPlanAddRatecardComponent.prototype.post_attachRateCard = function (callplanId, ratecardId, body) {
        var _this = this;
        this.callPlanService.post_attachRateCard(callplanId, ratecardId, body)
            .subscribe(function (resp) {
            console.log(resp);
            if (resp.status === 200) {
                _this.snackbarSharedService.snackbar_success('Ratecard attached successful.', 2000);
            }
        }, function (error) {
            console.log(error);
            _this.snackbarSharedService.snackbar_error('Ratecard failed to attach.', 2000);
        });
    };
    // ================================================================================
    // AG Grid Init
    // ================================================================================
    CallPlanAddRatecardComponent.prototype.on_GridReady_CallPlan = function (params) {
        this.gridApiCallPlan = params.api;
        params.api.sizeColumnsToFit();
    };
    CallPlanAddRatecardComponent.prototype.on_GridReady_Ratecard = function (params) {
        this.gridApiRatecard = params.api;
        params.api.sizeColumnsToFit();
    };
    CallPlanAddRatecardComponent.prototype.on_GridReady_Review = function (params) {
        this.gridApiDetails = params.api;
        params.api.sizeColumnsToFit();
    };
    CallPlanAddRatecardComponent.prototype.createColumnDefsCallPlan = function () {
        return [
            {
                headerName: 'Call Plan', field: 'title',
                checkboxSelection: true,
            }
        ];
    };
    CallPlanAddRatecardComponent.prototype.createColumnDefsRatecard = function () {
        return [
            {
                headerName: 'Ratecard Group', field: 'ratecard_bundle', checkboxSelection: true,
                cellRenderer: 'agGroupCellRenderer', width: 300,
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Country', field: 'country',
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Carrier', field: 'carrier_name',
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Priority', field: 'priority', hide: true,
            }
        ];
    };
    CallPlanAddRatecardComponent.prototype.createColumnDefsReview = function () {
        return [
            {
                headerName: 'ID', field: 'id', width: 80,
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Ratecard Name', field: 'name',
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Country', field: 'country',
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Offer', field: 'offer', width: 100,
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Carrier', field: 'carrier_name',
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Priority', field: 'priority', editable: true,
            }
        ];
    };
    // ================================================================================
    // AG Grid UI events
    // ================================================================================
    CallPlanAddRatecardComponent.prototype.onGridSizeChanged = function (params) {
        params.api.sizeColumnsToFit();
    };
    CallPlanAddRatecardComponent.prototype.resetAttachRatecardForm = function () {
        this.gridApiCallPlan.deselectAll();
        this.gridApiRatecard.deselectAll();
        this.gridApiDetails.setRowData([]);
    };
    CallPlanAddRatecardComponent.prototype.onSelectionChanged = function () {
        this.gridApiDetails.setRowData(this.generateDetailsRowData());
        this.gridSelectionStatus = this.generateDetailsRowData().length;
    };
    CallPlanAddRatecardComponent.prototype.handleSliderChange = function (params) {
        var currentSliderValue = params.value;
        this.currentSliderValue = currentSliderValue;
        this.updateDetailGridData(currentSliderValue);
    };
    CallPlanAddRatecardComponent.prototype.click_attachRatecard = function () {
        this.generateApiService();
        this.gridApiRatecard.deselectAll();
        this.gridApiDetails.setRowData([]);
    };
    // ================================================================================
    // UI States
    // ================================================================================
    CallPlanAddRatecardComponent.prototype.toggleButtonStates = function () {
        return this.toggleButtonStateService.toggleButtonStates(this.gridSelectionStatus);
    };
    CallPlanAddRatecardComponent.prototype.updateDetailGridData = function (currentSliderValue) {
        var itemsToUpdate = [];
        this.gridApiDetails.forEachNodeAfterFilterAndSort(function (rowNode) {
            var data = rowNode.data;
            data.priority = currentSliderValue;
            itemsToUpdate.push(data);
        });
        this.gridApiDetails.updateRowData({ update: itemsToUpdate });
    };
    // ================================================================================
    // AG Grid Fetch Data
    // ================================================================================
    CallPlanAddRatecardComponent.prototype.getSelectedCallPlanData = function () {
        return this.gridApiCallPlan.getSelectedRows();
    };
    CallPlanAddRatecardComponent.prototype.getSelectedRatecardData = function () {
        return this.gridApiRatecard.getSelectedRows();
    };
    CallPlanAddRatecardComponent.prototype.getSelectedDetailsData = function (num) {
        return this.gridApiDetails.getRowNode(num);
    };
    CallPlanAddRatecardComponent.prototype.generateDetailsRowData = function () {
        var ratecardData = this.getSelectedRatecardData();
        var detailsRowData = [];
        for (var i = 0; i < ratecardData.length; i++) {
            detailsRowData.push({
                id: ratecardData[i].id,
                name: ratecardData[i].name,
                country: ratecardData[i].country,
                offer: ratecardData[i].offer,
                carrier_name: ratecardData[i].carrier_name,
                priority: 1
            });
        }
        return detailsRowData;
    };
    CallPlanAddRatecardComponent.prototype.generateApiService = function () {
        var callplanId = this.getSelectedCallPlanData()[0].id;
        var detailTableLen = this.gridApiDetails.paginationGetRowCount();
        for (var i = 0; i < detailTableLen; i++) {
            var ratecardId = this.getSelectedDetailsData("" + i).data.id;
            var body = { priority: this.getSelectedDetailsData("" + i).data.priority };
            this.post_attachRateCard(callplanId, ratecardId, body);
        }
    };
    CallPlanAddRatecardComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-call-plan-add-ratecard',
            template: __webpack_require__(/*! ./call-plan-add-ratecard.component.html */ "./src/app/callplan/call-plan-add-ratecard/call-plan-add-ratecard.component.html"),
            styles: [__webpack_require__(/*! ./call-plan-add-ratecard.component.scss */ "./src/app/callplan/call-plan-add-ratecard/call-plan-add-ratecard.component.scss")]
        }),
        __metadata("design:paramtypes", [_shared_api_services_callplan_call_plan_api_service__WEBPACK_IMPORTED_MODULE_1__["CallPlanService"],
            _shared_services_callplan_call_plan_shared_service__WEBPACK_IMPORTED_MODULE_2__["CallPlanSharedService"],
            _shared_api_services_ratecard_rate_cards_api_service__WEBPACK_IMPORTED_MODULE_3__["RateCardsService"],
            _shared_services_global_nestedAgGrid_shared_service__WEBPACK_IMPORTED_MODULE_4__["NestedAgGridService"],
            _shared_services_global_snackbar_shared_service__WEBPACK_IMPORTED_MODULE_5__["SnackbarSharedService"],
            _shared_services_global_buttonStates_shared_service__WEBPACK_IMPORTED_MODULE_6__["ToggleButtonStateService"]])
    ], CallPlanAddRatecardComponent);
    return CallPlanAddRatecardComponent;
}());



/***/ }),

/***/ "./src/app/callplan/call-plan-table/call-plan-table.component.html":
/*!*************************************************************************!*\
  !*** ./src/app/callplan/call-plan-table/call-plan-table.component.html ***!
  \*************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<section>\n    <div class=\"all-callplans-container\">\n        <ag-grid-angular class=\"ag-theme-balham\" id=\"all-callplans\" [animateRows]=\"true\"\n            [columnDefs]=\"columnDefs\" [rowData]=\"rowData\"\n            [rowSelection]=\"defineRowSelectionTypeS\" (selectionChanged)=\"onSelectionChangedCallPlan()\" (rowSelected)=\"onRowSelectedCallplan()\" \n            [suppressRowClickSelection]=\"true\"\n            [stopEditingWhenGridLosesFocus]=\"true\" (cellValueChanged)=\"onCellValueChanged($event)\" [singleClickEdit]=\"true\"\n            [enableFilter]=\"true\" [floatingFilter]=\"true\" [enableSorting]=\"true\"\n            [enableColResize]=\"true\" (gridSizeChanged)=\"onGridSizeChanged($event)\"\n            [pagination]=\"true\" [paginationAutoPageSize]=\"true\"\n            [suppressLoadingOverlay]=\"true\" [suppressNoRowsOverlay]=\"true\"\n            [headerHeight]=\"40\" [floatingFiltersHeight]=\"30\"\n            [enableCellChangeFlash]=\"true\"\n\n            (gridReady)=\"on_GridReady_Callplan($event)\"\n        >\n        </ag-grid-angular>\n\n        <mat-toolbar-row>\n            <button (click)=\"openDialogDel()\" [disabled]=\"toggleButtonStateCallplan()\" class=\"del\"> <i class=\"fas fa-trash-alt\"></i> </button>\n            <button (click)=\"openDialogAddCallPlan()\"> <i class=\"fas fa-plus\"></i> Call Plan</button>\n            <button [disabled]=\"toggleButtonStateCallplan()\" (click)=\"click_sendToLCR()\"> <i class=\"fas fa-server\"></i> Send Callplan</button>\n        </mat-toolbar-row>\n    </div>\n\n    <div class=\"details-container\">\n        <mat-tab-group>\n            <mat-tab label=\"More Details\">\n                <ag-grid-angular class=\"ag-theme-balham\" id=\"call-plans-detail\" [animateRows]=\"true\"\n                    [columnDefs]=\"columnDefsDetail\" [rowData]=\"\"\n                    [stopEditingWhenGridLosesFocus]=\"true\" [singleClickEdit]=\"true\" (cellValueChanged)=\"onCellValueChanged($event)\"\n                    [enableColResize]=\"true\" (gridSizeChanged)=\"onGridSizeChanged($event)\"\n                    [enableCellChangeFlash]=\"true\"\n                    [suppressLoadingOverlay]=\"true\" [suppressNoRowsOverlay]=\"true\"\n                    [headerHeight]=\"40\" [floatingFiltersHeight]=\"30\"\n\n                    (gridReady)=\"on_GridReady_Details($event)\"\n                >\n                </ag-grid-angular>\n                <ag-grid-angular class=\"ag-theme-balham\" id=\"call-plans-detail2\" [animateRows]=\"true\"\n                    [columnDefs]=\"columnDefsDetail2\" [rowData]=\"\"\n                    [stopEditingWhenGridLosesFocus]=\"true\" [singleClickEdit]=\"true\" (cellValueChanged)=\"onCellValueChanged($event)\"\n                    [enableColResize]=\"true\" (gridSizeChanged)=\"onGridSizeChanged($event)\"\n                    [suppressNoRowsOverlay]=\"true\" [suppressLoadingOverlay]=\"true\"\n                    [enableCellChangeFlash]=\"true\"\n                    [headerHeight]=\"40\" [floatingFiltersHeight]=\"30\"\n                    \n                    (gridReady)=\"on_GridReady_Details2($event)\"\n                >\n                </ag-grid-angular>\n            </mat-tab>\n            <mat-tab label=\"Rate Cards\">\n                    <ag-grid-angular class=\"ag-theme-balham\" id=\"call-plans-ratecards\" [animateRows]=\"true\"\n                        [getNodeChildDetails]=\"getNodeChildDetails\"\n                        [columnDefs]=\"columnDefsRatecards\" [rowData]=\"\"  (rowSelected)=\"onRowSelectedRatecard()\"\n                        [rowSelection]=\"defineRowSelectionType\" (selectionChanged)=\"aggrid_rateCards_selectionChanged()\" [groupSelectsChildren]=\"true\" \n                        [suppressRowClickSelection]=\"true\"\n                        [stopEditingWhenGridLosesFocus]=\"true\" \n                        [enableFilter]=\"true\" [floatingFilter]=\"true\"\n                        [enableSorting]=\"true\"\n                        [enableColResize]=\"true\" (gridSizeChanged)=\"onGridSizeChanged($event)\"\n                        [pagination]=\"true\" [paginationAutoPageSize]=\"true\"\n                        [suppressLoadingOverlay]=\"true\" [enableCellChangeFlash]=\"true\"\n                        [headerHeight]=\"40\" [floatingFiltersHeight]=\"30\"\n\n                        (gridReady)=\"on_GridReady_Ratecards($event)\"\n                    >\n                    </ag-grid-angular>\n\n                    <mat-toolbar-row class=\"toolbar-details\">\n                        <button (click)=\"openDialogDetachRatecards()\" [disabled]=\"toggleButtonStateRatecard ()\" class=\"del\"> <i class=\"fas fa-trash-alt\"></i> </button>\n                        <button (click)=\"openDialogAttachRateCard()\" [disabled]=\"toggleButtonStateCallplan()\"> <i class=\"fas fa-plus-circle\"></i> Ratecard</button>\n                        <mat-form-field class=\"search-bar\">\n                            <span matPrefix><i class=\"fas fa-search\"></i> &nbsp;</span>\n                            <input matInput placeholder=\"Global Search...\" >\n                        </mat-form-field>\n                    </mat-toolbar-row>\n            </mat-tab>\n            <mat-tab label=\"Codes\">\n                <ag-grid-angular class=\"ag-theme-balham\" id=\"call-plans-codes\" [animateRows]=\"true\"\n                    [columnDefs]=\"columnDefsCodes\" [rowData]=\"\" (rowSelected)=\"onRowSelectedCode()\"\n                    [rowSelection]=\"defineRowSelectionType\" (selectionChanged)=\"aggrid_codes_selectionChanged()\" [suppressRowClickSelection]=\"true\"\n                    [stopEditingWhenGridLosesFocus]=\"true\" [singleClickEdit]=\"true\" (cellValueChanged)=\"onCellValueChanged_codes($event)\"\n                    [enableFilter]=\"true\" [floatingFilter]=\"true\"\n                    [enableSorting]=\"true\"\n                    [enableColResize]=\"true\" (gridSizeChanged)=\"onGridSizeChanged($event)\"\n                    [pagination]=\"true\" [paginationAutoPageSize]=\"true\"\n                    [suppressLoadingOverlay]=\"true\"\n                    [enableCellChangeFlash]=\"true\"\n                    [headerHeight]=\"40\" [floatingFiltersHeight]=\"30\"\n\n                    (gridReady)=\"on_GridReady_Codes($event)\"\n                >\n                </ag-grid-angular>\n                <mat-toolbar-row class=\"toolbar-details\">\n                    <button (click)=\"openDialogDetachCodes()\" [disabled]=\"toggleButtonStateCode()\" class=\"del\"> <i class=\"fas fa-trash-alt\"></i> </button>\n                    <button (click)=\"openDialogAttachCode()\" [disabled]=\"toggleButtonStateCallplan()\"> <i class=\"fas fa-plus-circle\"></i> Code</button>\n                    <mat-form-field class=\"search-bar\">\n                        <span matPrefix><i class=\"fas fa-search\"></i> &nbsp;</span>\n                        <input matInput placeholder=\"Global Search...\" >\n                    </mat-form-field>\n                </mat-toolbar-row>\n            </mat-tab>\n        </mat-tab-group>\n    </div>\n\n</section>"

/***/ }),

/***/ "./src/app/callplan/call-plan-table/call-plan-table.component.scss":
/*!*************************************************************************!*\
  !*** ./src/app/callplan/call-plan-table/call-plan-table.component.scss ***!
  \*************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "/deep/ .mat-tab-body-content {\n  overflow: hidden !important; }\n\nsection {\n  margin-top: 5px;\n  margin-left: 5px;\n  margin-right: 5px;\n  overflow: hidden; }\n\nsection .all-callplans-container {\n    width: 30%;\n    height: 100%;\n    border-right: 1px solid #E0E0E0;\n    float: left; }\n\nsection .all-callplans-container #all-callplans {\n      width: 99.7%;\n      height: 85vh;\n      float: left; }\n\nsection .all-callplans-container mat-toolbar-row {\n      width: 99.7%;\n      height: auto;\n      float: left; }\n\nsection .all-callplans-container mat-toolbar-row span {\n        font-size: 12px; }\n\nsection .all-callplans-container mat-toolbar-row button {\n        background-color: Transparent;\n        width: auto;\n        height: 32px;\n        padding-left: 5px;\n        padding-right: 5px;\n        border: 1px solid #E0E0E0;\n        margin-right: 5px; }\n\nsection .all-callplans-container mat-toolbar-row button:hover {\n        background-color: #E0E0E0; }\n\nsection .all-callplans-container mat-toolbar-row button:focus {\n        outline: 0; }\n\nsection .all-callplans-container mat-toolbar-row mat-form-field {\n        height: 32px;\n        font-size: 11px; }\n\nsection .all-callplans-container mat-toolbar-row .del {\n        padding-right: 6px;\n        padding-left: 6px; }\n\nsection .details-container {\n    width: 99.8%;\n    height: 90vh; }\n\nsection .details-container mat-tab-group {\n      width: auto;\n      height: 100vh; }\n\nsection .details-container /deep/ mat-tab-header {\n      height: 40px; }\n\nsection .details-container #call-plans-detail {\n      width: 100%;\n      height: 100px;\n      overflow: none; }\n\nsection .details-container #call-plans-detail /deep/ ag-header-row {\n        border-top: 10px solid black !important; }\n\nsection .details-container #call-plans-detail2 {\n      width: 100%;\n      height: 100px;\n      overflow: none; }\n\nsection .details-container #call-plans-detail2 /deep/ ag-header-row {\n        border-top: 10px solid black !important; }\n\nsection .details-container #call-plans-ratecards {\n      width: 100%;\n      height: 81.5vh; }\n\nsection .details-container .toolbar-details {\n      width: 100%;\n      height: 34px;\n      float: left; }\n\nsection .details-container .toolbar-details button {\n        height: 32px;\n        margin-left: 10px;\n        border: 1px solid #E0E0E0; }\n\nsection .details-container .toolbar-details button:hover {\n        background-color: #E0E0E0; }\n\nsection .details-container .toolbar-details button:focus {\n        outline: 0; }\n\nsection .details-container .toolbar-details .search-bar {\n        float: right;\n        position: relative;\n        width: 30%;\n        font-size: 11px; }\n\nsection .details-container #call-plans-codes {\n      width: 100%;\n      height: 81.5vh; }\n\n.mat-button {\n  margin-left: 20px; }\n\n.ag-header-row {\n  font-weight: bolder;\n  font-size: 1em; }\n\n.selectedRow div:nth-child(1) {\n  background-color: #ffffff; }\n\n.ag-header-container {\n  border-color: #ffffff; }\n\n.ag-header-cell {\n  border-bottom: 1px solid #ffffff; }\n\n.ag-header-cell-resize {\n  width: 1.5px;\n  color: #ffffff; }\n\n.ag-theme-balham .ag-floating-filter-body input {\n  border-bottom: 1.5px solid #ffffff; }\n\n.del {\n  border: 1px solid black; }\n"

/***/ }),

/***/ "./src/app/callplan/call-plan-table/call-plan-table.component.ts":
/*!***********************************************************************!*\
  !*** ./src/app/callplan/call-plan-table/call-plan-table.component.ts ***!
  \***********************************************************************/
/*! exports provided: CallPlanTableComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CallPlanTableComponent", function() { return CallPlanTableComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm5/material.es5.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _shared_services_global_nestedAgGrid_shared_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./../../shared/services/global/nestedAgGrid.shared.service */ "./src/app/shared/services/global/nestedAgGrid.shared.service.ts");
/* harmony import */ var _shared_api_services_callplan_call_plan_api_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./../../shared/api-services/callplan/call-plan.api.service */ "./src/app/shared/api-services/callplan/call-plan.api.service.ts");
/* harmony import */ var _shared_services_callplan_call_plan_shared_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../shared/services/callplan/call-plan.shared.service */ "./src/app/shared/services/callplan/call-plan.shared.service.ts");
/* harmony import */ var _shared_services_global_snackbar_shared_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./../../shared/services/global/snackbar.shared.service */ "./src/app/shared/services/global/snackbar.shared.service.ts");
/* harmony import */ var _shared_services_global_buttonStates_shared_service__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./../../shared/services/global/buttonStates.shared.service */ "./src/app/shared/services/global/buttonStates.shared.service.ts");
/* harmony import */ var _dialog_del_callplan_del_callplan_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./dialog/del-callplan/del-callplan.component */ "./src/app/callplan/call-plan-table/dialog/del-callplan/del-callplan.component.ts");
/* harmony import */ var _dialog_add_callplan_add_callplan_component__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./dialog/add-callplan/add-callplan.component */ "./src/app/callplan/call-plan-table/dialog/add-callplan/add-callplan.component.ts");
/* harmony import */ var _dialog_add_code_add_code_component__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./dialog/add-code/add-code.component */ "./src/app/callplan/call-plan-table/dialog/add-code/add-code.component.ts");
/* harmony import */ var _dialog_add_rate_card_add_rate_card_component__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./dialog/add-rate-card/add-rate-card.component */ "./src/app/callplan/call-plan-table/dialog/add-rate-card/add-rate-card.component.ts");
/* harmony import */ var _dialog_dettach_ratecards_dettach_ratecards_component__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./dialog/dettach-ratecards/dettach-ratecards.component */ "./src/app/callplan/call-plan-table/dialog/dettach-ratecards/dettach-ratecards.component.ts");
/* harmony import */ var _dialog_dettach_codes_dettach_codes_component__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./dialog/dettach-codes/dettach-codes.component */ "./src/app/callplan/call-plan-table/dialog/dettach-codes/dettach-codes.component.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};














var CallPlanTableComponent = /** @class */ (function () {
    function CallPlanTableComponent(callPlanService, callPlanSharedService, nestedAgGridService, dialog, formBuilder, _snackbar, _buttonToggle) {
        this.callPlanService = callPlanService;
        this.callPlanSharedService = callPlanSharedService;
        this.nestedAgGridService = nestedAgGridService;
        this.dialog = dialog;
        this.formBuilder = formBuilder;
        this._snackbar = _snackbar;
        this._buttonToggle = _buttonToggle;
        // Props for AG Grid
        this.defineRowSelectionType = 'multiple';
        this.defineRowSelectionTypeS = 'single';
        this.columnDefs = this.createColumnDefs();
        this.columnDefsDetail = this.createColumnDefsDetail();
        this.columnDefsDetail2 = this.createColumnDefsDetail2();
        this.columnDefsRatecards = this.createColumnDefsRatecards();
        this.columnDefsCodes = this.createColumnDefsCodes();
    }
    CallPlanTableComponent.prototype.ngOnInit = function () {
        this.getNodeChildDetails = this.nestedAgGridService.returnSetGroups();
        this.get_allCallPlansData();
    };
    // ================================================================================
    // API
    // ================================================================================
    CallPlanTableComponent.prototype.get_allCallPlansData = function () {
        var _this = this;
        this.callPlanService.get_allCallplan()
            .subscribe(function (data) { _this.rowData = data; }, function (error) { console.log(error); });
    };
    CallPlanTableComponent.prototype.get_specificCallPlanData = function (callPlanId) {
        var _this = this;
        this.callPlanService.get_specificCallplan(callPlanId)
            .subscribe(function (data) {
            _this.callPlanSharedService.changeCallPlanObj(data);
            _this.gridApiDetail.updateRowData({ add: [data] });
            _this.gridApiDetail2.updateRowData({ add: [data] });
            var ratecardData = _this.nestedAgGridService.formatDataToNestedArr(data.ratecards);
            _this.gridApiRatecards.setRowData(ratecardData);
            _this.gridApiCodes.setRowData(data.codes);
        });
    };
    CallPlanTableComponent.prototype.put_editCallPlan = function (callPlanObj, callplan_id) {
        var _this = this;
        this.callPlanService.put_editCallPlan(callPlanObj, callplan_id)
            .subscribe(function (resp) {
            console.log(resp);
            if (resp.status === 200) {
                _this._snackbar.snackbar_success('Edit Successful', 2000);
            }
        }, function (error) {
            console.log(error);
            _this._snackbar.snackbar_error("Edit Failed", 2000);
        });
    };
    CallPlanTableComponent.prototype.put_editCodes = function (callplanId, codesId, body) {
        var _this = this;
        this.callPlanService.put_editPlanCode(callplanId, codesId, body)
            .subscribe(function (resp) {
            console.log(resp);
            if (resp.status === 200) {
                _this._snackbar.snackbar_success('Edit Successful', 2000);
            }
        }, function (error) {
            console.log(error);
            _this._snackbar.snackbar_error("Edit Failed", 2000);
        });
    };
    CallPlanTableComponent.prototype.post_callplanToLCR = function (callplan_id, body) {
        var _this = this;
        this.callPlanService.post_callplanToLCR(callplan_id, body)
            .subscribe(function (resp) {
            console.log(resp);
            if (resp.status === 200) {
                _this._snackbar.snackbar_success('Callplan successfully inserted into LCR.', 3000);
            }
        }, function (error) {
            console.log(error);
            _this._snackbar.snackbar_error("Error: Something is wrong. Check if Callplan has codes, ratecards, and trunks.", 3000);
        });
    };
    // ================================================================================
    // AG Grid Initialiation
    // ================================================================================
    CallPlanTableComponent.prototype.on_GridReady_Callplan = function (params) {
        this.gridApiCallplan = params.api;
        params.api.sizeColumnsToFit();
    };
    CallPlanTableComponent.prototype.on_GridReady_Details = function (params) {
        this.gridApiDetail = params.api;
        params.api.sizeColumnsToFit();
    };
    CallPlanTableComponent.prototype.on_GridReady_Details2 = function (params) {
        this.gridApiDetail2 = params.api;
        params.api.sizeColumnsToFit();
    };
    CallPlanTableComponent.prototype.on_GridReady_Ratecards = function (params) {
        this.gridApiRatecards = params.api;
        params.api.sizeColumnsToFit();
    };
    CallPlanTableComponent.prototype.on_GridReady_Codes = function (params) {
        this.gridApiCodes = params.api;
        this.columnApiCodes = params.ColumnApi;
        params.api.sizeColumnsToFit();
    };
    CallPlanTableComponent.prototype.createColumnDefs = function () {
        return [
            {
                headerName: 'Call Plans', field: 'title',
                checkboxSelection: true, editable: true,
                width: 250, cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Carrier Name', field: 'carrier_name',
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Available', field: 'available', editable: true,
                cellEditor: 'select', cellEditorParams: { values: ['available', 'unavailable', 'deleted', 'staged', 'deleted'] },
            },
        ];
    };
    CallPlanTableComponent.prototype.createColumnDefsDetail = function () {
        return [
            {
                headerName: 'Sub Title', field: 'subtitle', editable: true,
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Valid Through', field: 'valid_through', editable: true,
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Days in Plan', field: 'day_period', editable: true,
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Buy Price', field: 'buy_price',
                editable: true, filter: 'agNumberColumnFilter',
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Sell Price', field: 'sell_price',
                editable: true, filter: 'agNumberColumnFilter',
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
        ];
    };
    CallPlanTableComponent.prototype.createColumnDefsDetail2 = function () {
        return [
            {
                headerName: 'Plan Rank', field: 'ranking',
                editable: true, cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Activated on?', field: 'activeWhen', editable: true,
                cellEditor: 'select', cellEditorParams: { values: ['IMMEDIATELY', 'SUCCESS_CALL'] },
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Promotion?', editable: true, field: 'isPurchasable',
                valueFormatter: function (params) {
                    if (params.value === 1) {
                        return true;
                    }
                    if (params.value === 0) {
                        return false;
                    }
                },
                cellEditor: 'select', cellEditorParams: { values: ['true', 'false'] },
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Plan Type', field: 'planTypeName', editable: true, cellEditor: 'select',
                cellEditorParams: { values: ['UNLIMITED_CALL_PLAN', 'PAY_AS_YOU_GO_CALL_PLAN', 'MINUTES_CALL_PLAN'] },
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Max Destination #', field: 'maxDestNumbers',
                editable: true,
            },
            {
                headerName: 'Max Minutes', field: 'maxMinutes',
                editable: true,
            }
        ];
    };
    CallPlanTableComponent.prototype.createColumnDefsRatecards = function () {
        return [
            {
                headerName: 'Ratecard Name', field: 'ratecard_bundle', checkboxSelection: true,
                headerCheckboxSelection: true, cellRenderer: 'agGroupCellRenderer', width: 400,
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Country', field: 'country',
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Offer', field: 'offer',
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Carrier Name', field: 'carrier_name',
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            }
        ];
    };
    CallPlanTableComponent.prototype.createColumnDefsCodes = function () {
        return [
            {
                headerName: 'Codes', field: 'code', checkboxSelection: true,
                headerCheckboxSelection: true, width: 300,
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Origination Country', field: 'ori_cc', editable: true,
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Destination Country', field: 'des_cc', editable: true,
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Carrier Code', field: 'carrier_code',
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Plan Type', field: 'planType', editable: true,
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Days in Code', field: 'day_period', editable: true,
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Plan Number', field: 'planNumber', editable: true,
            }
        ];
    };
    // ================================================================================
    // AG Grid UI
    // ================================================================================
    CallPlanTableComponent.prototype.onGridSizeChanged = function (params) {
        params.api.sizeColumnsToFit();
    };
    CallPlanTableComponent.prototype.onSelectionChangedCallPlan = function () {
        this.clearTableRowData();
        this.rowSelectionCallplan = this.gridApiCallplan.getSelectedRows(); // pass global row obj to row selection global var
        this.rowIdAll = this.rowSelectionCallplan[0].id; // pass callplan row id to global var
        this.callplanTitle = this.rowSelectionCallplan[0].title; // pass call plan title to ratecard dialog
        this.get_specificCallPlanData(this.rowIdAll);
    };
    CallPlanTableComponent.prototype.clearTableRowData = function () {
        this.gridApiDetail.setRowData([]);
        this.gridApiDetail2.setRowData([]);
        this.gridApiRatecards.setRowData([]);
        this.gridApiCodes.setRowData([]);
    };
    CallPlanTableComponent.prototype.aggrid_rateCards_selectionChanged = function () {
        this.rowSelectionRatecards = this.gridApiRatecards.getSelectedRows();
    };
    CallPlanTableComponent.prototype.aggrid_codes_selectionChanged = function () {
        this.rowSelectionCodes = this.gridApiCodes.getSelectedRows();
    };
    // ================================================================================
    // Button Toggle
    // ================================================================================
    CallPlanTableComponent.prototype.toggleButtonStateCallplan = function () {
        return this._buttonToggle.toggleButtonStates(this.gridSelectionStatusCallplan);
    };
    CallPlanTableComponent.prototype.toggleButtonStateRatecard = function () {
        return this._buttonToggle.toggleButtonStates(this.gridSelectionStatusRatecard);
    };
    CallPlanTableComponent.prototype.toggleButtonStateCode = function () {
        return this._buttonToggle.toggleButtonStates(this.gridSelectionStatusCode);
    };
    CallPlanTableComponent.prototype.onRowSelectedCallplan = function () {
        this.selectedCallplanIndex = this.gridApiCallplan.getSelectedNodes()[0].rowIndex; // Get rowindex of callplan;
        this.gridSelectionStatusCallplan = this.gridApiCallplan.getSelectedNodes().length;
    };
    CallPlanTableComponent.prototype.onRowSelectedRatecard = function () {
        this.gridSelectionStatusRatecard = this.gridApiRatecards.getSelectedNodes().length;
    };
    CallPlanTableComponent.prototype.onRowSelectedCode = function () {
        this.gridSelectionStatusCode = this.gridApiCodes.getSelectedNodes().length;
    };
    // ================================================================================
    // Delete and Add Row Data AG Grid
    // @Todo
    // ================================================================================
    CallPlanTableComponent.prototype.aggrid_delRow = function (string) {
        if (string === 'del-callplan') {
            this.gridApiCallplan.updateRowData({ remove: this.rowSelectionCallplan });
        }
        if (string === 'detach-ratecards') {
            this.gridApiCallplan.deselectAll();
            this.gridApiCallplan.selectIndex(this.selectedCallplanIndex, false, false);
        }
        if (string === 'detach-codes') {
            this.gridApiCodes.updateRowData({ remove: this.rowSelectionCodes });
        }
    };
    CallPlanTableComponent.prototype.aggrid_addRow_codes = function (obj) {
        this.gridApiCallplan.deselectAll();
        this.gridApiCallplan.selectNode(this.nodeSelection);
    };
    CallPlanTableComponent.prototype.aggrid_addRow_callplans = function (obj) {
        this.gridApiCallplan.updateRowData({ add: [obj] });
    };
    CallPlanTableComponent.prototype.onCellValueChanged = function (params) {
        var id = params.data.id;
        var date = Date.parse(params.data.valid_through).toString();
        var forPromotion;
        if (params.data.isPurchasable === 1 || params.data.isPurchasable === 'true') {
            forPromotion = true;
        }
        if (params.data.isPurchasable === 0 || params.data.isPurchasable === 'false') {
            forPromotion = false;
        }
        var detailObj = {
            carrier_id: params.data.carrier_id,
            title: params.data.title,
            subtitle: params.data.subtitle,
            available: params.data.available,
            valid_through: date,
            buy_price: parseFloat(params.data.buy_price),
            sell_price: parseFloat(params.data.sell_price),
            day_period: parseInt(params.data.day_period, 0),
            planTypeName: params.data.planTypeName,
            activeWhen: params.data.activeWhen,
            ranking: parseInt(params.data.ranking, 0),
            isPurchasable: forPromotion,
            maxDestNumbers: parseInt(params.data.maxDestNumbers, 0),
            maxMinutes: parseInt(params.data.maxMinutes, 0)
        };
        this.put_editCallPlan(detailObj, id);
    };
    CallPlanTableComponent.prototype.onCellValueChanged_codes = function (params) {
        var callplanId = this.gridApiCallplan.getSelectedRows()[0].id;
        var codesId = params.data.id;
        var codesObj = {
            ori_cc: parseInt(params.data.ori_cc, 0),
            des_cc: parseInt(params.data.des_cc, 0),
            carrier_code: params.data.carrier_code,
            planType: parseInt(params.data.planType, 0),
            priority: parseInt(params.data.priority, 0),
            day_period: parseInt(params.data.day_period, 0),
            planNumber: parseInt(params.data.planNumber, 0)
        };
        this.put_editCodes(callplanId, codesId, codesObj);
    };
    CallPlanTableComponent.prototype.click_sendToLCR = function () {
        this.sendCallplanToLCR();
    };
    CallPlanTableComponent.prototype.sendCallplanToLCR = function () {
        var callplan_id = this.gridApiCallplan.getSelectedNodes()[0].data.id;
        var body = {};
        this.post_callplanToLCR(callplan_id, body);
    };
    // ================================================================================
    // Dialog Callplan
    // ================================================================================
    CallPlanTableComponent.prototype.openDialogDel = function () {
        var _this = this;
        this.callPlanSharedService.changeRowAll(this.rowIdAll);
        var dialogRef = this.dialog.open(_dialog_del_callplan_del_callplan_component__WEBPACK_IMPORTED_MODULE_8__["DelCallPlanComponent"], {});
        var sub = dialogRef.componentInstance.event_onDel
            .subscribe(function (data) {
            _this.aggrid_delRow(data);
        });
        dialogRef.afterClosed().subscribe(function () {
            sub.unsubscribe();
        });
    };
    CallPlanTableComponent.prototype.openDialogAddCallPlan = function () {
        var _this = this;
        var dialogRef = this.dialog.open(_dialog_add_callplan_add_callplan_component__WEBPACK_IMPORTED_MODULE_9__["AddCallPlanComponent"], {
            height: 'auto',
            width: '70vw'
        });
        var sub = dialogRef.componentInstance.event_onAdd.subscribe(function (data) {
            _this.aggrid_addRow_callplans(data);
        });
        dialogRef.afterClosed().subscribe(function () {
            sub.unsubscribe();
        });
    };
    // ================================================================================
    // Dialog Ratecard
    // ================================================================================
    CallPlanTableComponent.prototype.openDialogAttachRateCard = function () {
        var _this = this;
        this.callPlanSharedService.changeRowAll(this.rowIdAll);
        var dialogRef = this.dialog.open(_dialog_add_rate_card_add_rate_card_component__WEBPACK_IMPORTED_MODULE_11__["AddRateCardComponent"], {
            panelClass: 'ratecard-callplan-screen-dialog',
            maxWidth: '90vw',
            autoFocus: false,
            data: this.gridApiCallplan.getSelectedRows()[0].title
        });
        dialogRef.afterClosed().subscribe(function () {
            _this.gridApiCallplan.deselectAll();
            _this.gridApiCallplan.selectIndex(_this.selectedCallplanIndex, false, false);
        });
    };
    CallPlanTableComponent.prototype.openDialogDetachRatecards = function () {
        var _this = this;
        this.callPlanSharedService.changeRowAll(this.rowIdAll);
        this.callPlanSharedService.changeRowRatecards(this.rowSelectionRatecards);
        var dialogRef = this.dialog.open(_dialog_dettach_ratecards_dettach_ratecards_component__WEBPACK_IMPORTED_MODULE_12__["DettachRatecardsComponent"], {});
        var sub = dialogRef.componentInstance.event_onDettach
            .subscribe(function (data) {
            _this.aggrid_delRow(data);
        });
        dialogRef.afterClosed().subscribe(function () {
            sub.unsubscribe();
        });
    };
    // ================================================================================
    // Dialog Codes
    // ================================================================================
    CallPlanTableComponent.prototype.openDialogAttachCode = function () {
        var _this = this;
        this.callPlanSharedService.changeRowAll(this.rowIdAll);
        var dialogRef = this.dialog.open(_dialog_add_code_add_code_component__WEBPACK_IMPORTED_MODULE_10__["AddCodeComponent"], {
            height: 'auto',
            width: '70%',
        });
        dialogRef.afterClosed().subscribe(function () {
            _this.gridApiCallplan.deselectAll();
            _this.gridApiCallplan.selectIndex(_this.selectedCallplanIndex, false, false);
        });
    };
    CallPlanTableComponent.prototype.openDialogDetachCodes = function () {
        var _this = this;
        this.callPlanSharedService.changeRowAll(this.rowIdAll);
        this.callPlanSharedService.changeRowCodes(this.rowSelectionCodes);
        var dialogRef = this.dialog.open(_dialog_dettach_codes_dettach_codes_component__WEBPACK_IMPORTED_MODULE_13__["DettachCodesComponent"], {});
        var sub = dialogRef.componentInstance.event_onDettach
            .subscribe(function (data) {
            _this.aggrid_delRow(data);
        });
        dialogRef.afterClosed().subscribe(function () {
            sub.unsubscribe();
        });
    };
    CallPlanTableComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-call-plan-table',
            template: __webpack_require__(/*! ./call-plan-table.component.html */ "./src/app/callplan/call-plan-table/call-plan-table.component.html"),
            styles: [__webpack_require__(/*! ./call-plan-table.component.scss */ "./src/app/callplan/call-plan-table/call-plan-table.component.scss")]
        }),
        __metadata("design:paramtypes", [_shared_api_services_callplan_call_plan_api_service__WEBPACK_IMPORTED_MODULE_4__["CallPlanService"],
            _shared_services_callplan_call_plan_shared_service__WEBPACK_IMPORTED_MODULE_5__["CallPlanSharedService"],
            _shared_services_global_nestedAgGrid_shared_service__WEBPACK_IMPORTED_MODULE_3__["NestedAgGridService"],
            _angular_material__WEBPACK_IMPORTED_MODULE_1__["MatDialog"],
            _angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormBuilder"],
            _shared_services_global_snackbar_shared_service__WEBPACK_IMPORTED_MODULE_6__["SnackbarSharedService"],
            _shared_services_global_buttonStates_shared_service__WEBPACK_IMPORTED_MODULE_7__["ToggleButtonStateService"]])
    ], CallPlanTableComponent);
    return CallPlanTableComponent;
}());



/***/ }),

/***/ "./src/app/callplan/call-plan-table/dialog/add-callplan/add-callplan.component.html":
/*!******************************************************************************************!*\
  !*** ./src/app/callplan/call-plan-table/dialog/add-callplan/add-callplan.component.html ***!
  \******************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<mat-horizontal-stepper> <!-- linear forces user to complete ea step -->\n\n    <!-- Choose Call Plan Step -->\n    <mat-step [stepControl]=\"addCarrierFormGroup\" [completed]=\"false\">\n        <form [formGroup]=\"addCarrierFormGroup\">\n            <ng-template matStepLabel>Choose Carrier</ng-template>\n            <mat-form-field>\n                <mat-select placeholder=\"Carriers\" formControlName=\"carrierCtrl\">\n                    <mat-option *ngFor=\"let carrier of carrierObj\" [value]=\"carrier.id\">\n                        {{ carrier.carrier }}\n                    </mat-option>\n                </mat-select>\n            </mat-form-field>\n            <div>\n            <button mat-button matStepperNext [disabled]=\"addCarrierFormGroup.invalid\"> Next </button>\n            </div>\n        </form>\n    </mat-step>\n\n    <!-- Attach Call Plan Step -->\n    <mat-step [stepControl]=\"attachCallPlanFormGroup\" [completed]=\"false\">\n        <form [formGroup]=\"attachCallPlanFormGroup\"> \n        <ng-template matStepLabel>Add Call Plan</ng-template>\n\n            <mat-form-field class=\"half-width\">\n                <input matInput placeholder=\"Title\" formControlName=\"titleCtrl\" >\n                <mat-error *ngIf=\"attachCallPlanFormGroup.get('titleCtrl').hasError('required')\">\n                    Title is <strong>required</strong>\n                </mat-error>\n            </mat-form-field>\n\n            <mat-form-field class=\"half-width\">\n                <input matInput placeholder=\"Subtitle\" formControlName=\"subtitleCtrl\" >\n            </mat-form-field>\n\n            <mat-form-field class=\"half-width\"> \n                <mat-select placeholder=\"Status\" formControlName=\"availableCtrl\">\n                    <mat-option *ngFor=\"let s of status\" [value]=\"s.value\">\n                        {{ s.value }}\n                    </mat-option>\n                </mat-select>\n            </mat-form-field>  \n\n            <mat-form-field class=\"half-width\">\n                <input matInput [matDatepicker]=\"picker\" placeholder=\"Plan Valid Until\" formControlName=\"validthroughCtrl\">\n                <mat-datepicker #picker disabled=\"false\"></mat-datepicker>\n                <mat-datepicker-toggle matSuffix [for]=\"picker\" disabled=\"false\"></mat-datepicker-toggle>\n            </mat-form-field>\n\n            <mat-form-field class=\"half-width\"> <!-- Buy price input -->\n                <span matPrefix>$ &nbsp;</span>\n                <input matInput placeholder=\"Buying Price of Call Plan\" formControlName=\"buypriceCtrl\" >\n                <mat-hint align=\"end\">Please type price in currency format ~##.##</mat-hint>\n                <mat-error *ngIf=\"attachCallPlanFormGroup.get('buypriceCtrl').hasError('required')\">\n                    Buy Price is <strong>required</strong>\n                </mat-error>\n                <mat-error *ngIf=\"attachCallPlanFormGroup.get('buypriceCtrl').hasError('pattern') && !attachCallPlanFormGroup.get('buypriceCtrl').hasError('required')\">\n                    Type amount in currency format ~##.##\n                </mat-error>\n            </mat-form-field>\n\n            <mat-form-field class=\"half-width\"> <!-- Sell price input -->\n                <span matPrefix>$ &nbsp;</span>\n                <input matInput placeholder=\"Selling Price of Call Plan\" formControlName=\"sellpriceCtrl\" >\n                <mat-hint align=\"end\">Please type price in currency format ~##.##</mat-hint>\n                <mat-error *ngIf=\"attachCallPlanFormGroup.get('sellpriceCtrl').hasError('required')\">\n                    Sell Price is <strong>required</strong>\n                </mat-error>\n                <mat-error *ngIf=\"attachCallPlanFormGroup.get('sellpriceCtrl').hasError('pattern') && !attachCallPlanFormGroup.get('sellpriceCtrl').hasError('required')\">\n                    Type amount in currency format ~##.##\n                </mat-error>\n            </mat-form-field>\n\n            <mat-form-field class=\"half-width\">\n                <input matInput placeholder=\"Length of plan in days\" formControlName=\"dayperiodCtrl\">\n                <mat-hint align=\"end\">Type 0 for unlimited days</mat-hint>\n                <mat-error *ngIf=\"attachCallPlanFormGroup.get('dayperiodCtrl').hasError('required')\">\n                    Plan in days is <strong>required</strong>\n                </mat-error>\n                <mat-error *ngIf=\"attachCallPlanFormGroup.get('dayperiodCtrl').hasError('pattern') && !attachCallPlanFormGroup.get('dayperiodCtrl').hasError('required')\">\n                    Please enter numbers only\n                </mat-error>\n            </mat-form-field>\n\n            <mat-form-field class=\"half-width\">\n                <input matInput placeholder=\"Call Plan Rank\" formControlName=\"rankingCtrl\" >\n                <mat-error *ngIf=\"attachCallPlanFormGroup.get('rankingCtrl').hasError('required')\">\n                    Call plan rank is <strong>required</strong>\n                </mat-error>\n                <mat-error *ngIf=\"attachCallPlanFormGroup.get('rankingCtrl').hasError('pattern') && !attachCallPlanFormGroup.get('rankingCtrl').hasError('required')\">\n                    Please enter numbers only\n                </mat-error>\n            </mat-form-field>\n\n            <mat-form-field> \n                <mat-select placeholder=\"Call Plan Type\" formControlName=\"plantypeCtrl\" (change)=\"onChangePlanType()\">\n                    <mat-option *ngFor=\"let plan of callplanPlanType\" [value]=\"plan.value\">\n                        {{ plan.name }}\n                    </mat-option>\n                </mat-select>\n            </mat-form-field>     \n            \n            <mat-form-field class=\"half-width\" *ngIf=\"onChangePlanType()\">\n                <input matInput placeholder=\"Maximum Destination Numbers\" formControlName=\"maxdestinationCtrl\" >\n                <mat-error *ngIf=\"attachCallPlanFormGroup.get('maxdestinationCtrl').hasError('required')\">\n                    Call plan rank is <strong>required</strong>\n                </mat-error>\n                <mat-error *ngIf=\"attachCallPlanFormGroup.get('maxdestinationCtrl').hasError('pattern') && !attachCallPlanFormGroup.get('maxdestinationCtrl').hasError('required')\">\n                    Please enter numbers only\n                </mat-error>\n            </mat-form-field>\n \n            <mat-form-field class=\"half-width\" *ngIf=\"onChangePlanType()\">\n                <input matInput placeholder=\"Maximum Minutes\" formControlName=\"maxminutesCtrl\" >\n                <mat-error *ngIf=\"attachCallPlanFormGroup.get('maxminutesCtrl').hasError('required')\">\n                    Call plan rank is <strong>required</strong>\n                </mat-error>\n                <mat-error *ngIf=\"attachCallPlanFormGroup.get('maxminutesCtrl').hasError('pattern') && !attachCallPlanFormGroup.get('maxminutesCtrl').hasError('required')\">\n                    Please enter numbers only\n                </mat-error>\n            </mat-form-field>\n\n            <mat-form-field class=\"half-width\"> \n                <mat-select placeholder=\"Active When\" formControlName=\"activewhenCtrl\">\n                    <mat-option *ngFor=\"let active of activeWhen\" [value]=\"active.value\">\n                        {{ active.name }}\n                    </mat-option>\n                </mat-select>\n            </mat-form-field>  \n\n            <mat-form-field class=\"half-width\"> \n                <mat-select placeholder=\"Is this for a Promotion?\" formControlName=\"promoCtrl\">\n                    <mat-option *ngFor=\"let p of promotion\" [value]=\"p.value\">\n                        {{ p.name }}\n                    </mat-option>\n                </mat-select>\n            </mat-form-field>  \n\n            <mat-form-field>\n                <input matInput placeholder=\"Description\" formControlName=\"descriptionCtrl\" >\n                <mat-error *ngIf=\"attachCallPlanFormGroup.get('descriptionCtrl').hasError('required')\">\n                    Call plan rank is <strong>required</strong>\n                </mat-error>\n            </mat-form-field>\n\n        <div> \n            <button mat-button matStepperPrevious >Back</button>\n            <button mat-button matStepperNext [disabled]=\"\n            attachCallPlanFormGroup.get('titleCtrl').invalid || attachCallPlanFormGroup.get('promoCtrl').invalid\n            || attachCallPlanFormGroup.get('buypriceCtrl').invalid\n            \"\n            > Next</button>\n            <button mat-button (click)=\"insertDummyDataCallPlan()\"> Insert Dummy Data </button>\n        </div>     \n        </form>\n    </mat-step> \n\n    <!-- Enter Code Initial Step -->\n    <mat-step [stepControl]=\"attachCodesFormGroup\" [completed]=\"false\">\n        <form [formGroup]=\"attachCodesFormGroup\" >\n        <ng-template matStepLabel>Enter Code Info</ng-template>\n\n            <mat-form-field> \n                <mat-select placeholder=\"Carrier Code\" formControlName=\"carrierCtrl\">\n                    <mat-option *ngFor=\"let code of carrierObj\" [value]=\"code.code\">\n                        {{code.code}} - {{code.carrier}}\n                    </mat-option>\n                </mat-select>\n            </mat-form-field>\n\n            <mat-form-field> \n                <mat-select placeholder=\"Plan Type\" formControlName=\"plantypeCtrl\">\n                    <mat-option *ngFor=\"let planType of codesPlanType\" [value]=\"planType.code\">\n                        {{planType.name}}\n                    </mat-option>\n                </mat-select>\n            </mat-form-field>\n\n            <mat-form-field> \n                <mat-select placeholder=\"Plan Priority\" formControlName=\"planpriorityCtrl\">\n                    <mat-option *ngFor=\"let planPriority of planPriorityList\" [value]=\"planPriority.num\">\n                        {{planPriority.num}}\n                    </mat-option>\n                </mat-select>\n            </mat-form-field>\n\n            <mat-form-field >\n                    <input matInput placeholder=\"Length of plan in days\" formControlName=\"dayperiodCtrl\">\n                    <mat-hint align=\"end\">Type 0 for unlimited days</mat-hint>\n                    <mat-error *ngIf=\"attachCodesFormGroup.get('dayperiodCtrl').hasError('required')\">\n                        Plan in days is <strong>required</strong>\n                    </mat-error>\n                    <mat-error *ngIf=\"attachCodesFormGroup.get('dayperiodCtrl').hasError('pattern') && !attachCodesFormGroup.get('dayperiodCtrl').hasError('required')\">\n                        Please enter numbers only\n                    </mat-error>\n            </mat-form-field>\n\n            <mat-form-field >\n                    <input matInput #input maxlength=\"2\" placeholder=\"Enter Plan Number\" formControlName=\"plannumberCtrl\" >\n                    <mat-hint align=\"end\">Plan number 00 -> 20 - {{input.value?.length || 0}} / 2</mat-hint>\n                    <mat-error *ngIf=\"attachCodesFormGroup.get('plannumberCtrl').hasError('required')\">\n                        Plan number days is <strong>required</strong>\n                    </mat-error>\n                    <mat-error *ngIf=\"attachCodesFormGroup.get('plannumberCtrl').hasError('pattern') && !attachCodesFormGroup.get('plannumberCtrl').hasError('required')\">\n                        Please enter numbers only\n                    </mat-error>\n            </mat-form-field>\n\n        <div>\n            <button mat-button matStepperPrevious >Back</button>\n            <button mat-button matStepperNext [disabled]=\"attachCodesFormGroup.invalid\" >Next</button>\n            <button mat-button (click)=\"insertDummyDataCodes()\" >Add Dummy Test Data</button>\n        </div>\n        </form>\n    </mat-step>\n      \n    <!-- Enter Country Code Step -->\n    <mat-step [stepControl]=\"attachCountryCodesFormGroup\" [completed]=\"false\">\n        <form [formGroup]=\"attachCountryCodesFormGroup\">\n        <ng-template matStepLabel>Enter Code Info</ng-template>\n            <div class=\"country-code-form\">\n                <div formArrayName=\"codes\" *ngFor=\"let codeFG of attachCountryCodesFormGroup.get['codes'].controls; let counter=index\">\n                <span> <b>Code Group {{counter + 1}}:</b> </span>\n                <button *ngIf=\"attachCountryCodesFormGroup.get('codes').controls.length > 1\" (click)=\"removeGroup(counter)\" class=\"country-code-trash\"> <i class=\"fas fa-trash\"></i> </button>\n                    <div [formGroupName]=\"counter\">\n                        \n                        <div class=\"origination-section\">\n                            <mat-form-field class=\"select-width\">\n                              <mat-select placeholder=\"Origination Code\" formControlName=\"originationCtrl\">\n                                <mat-option *ngFor=\"let code of countryCodeList\" [value]=\"code.code\">{{code.country}} - {{code.code}}</mat-option>\n                              </mat-select>\n                            </mat-form-field>\n                        </div>\n            \n                        <div class=\"destination-section\">\n                            <mat-form-field class=\"select-width\">\n                              <mat-select placeholder=\"Destination Code\" formControlName=\"destinationCtrl\" (change)=\"onSelectChangeDest($event)\" multiple>\n                                <mat-option *ngFor=\"let code of countryCodeList\" [value]=\"code.code\">{{code.country}} - {{code.code}}</mat-option>\n                              </mat-select>\n                            </mat-form-field>\n                        </div>\n\n                    </div>\n                </div> <!-- end nested array FormGroup -->\n            </div>\n        <div>\n            <button mat-button (click)=\"addCodes()\">Add New Country Code</button>\n            <button mat-button matStepperPrevious >Back</button>\n            <button mat-button matStepperNext (click)=\"codesObjBuilder()\" [disabled]=\"attachCountryCodesFormGroup.invalid\">Next</button>\n        </div>\n        </form>\n    </mat-step>\n    \n    <!-- Details & Finalize  -->\n    <mat-step [completed]=\"false\">\n        <ng-template matStepLabel>Review, Submit</ng-template>\n            <div class=\"details\">\n                <span><b>Combined JSON for DB</b></span>\n                <pre>{{finalCallPlanObj | json}}</pre>\n            </div>\n        <div>\n            <button mat-button matStepperPrevious>Back</button>  \n            <button mat-button (click)=\"click_addCallPlan()\">Submit</button>\n        </div>\n    </mat-step>\n</mat-horizontal-stepper>"

/***/ }),

/***/ "./src/app/callplan/call-plan-table/dialog/add-callplan/add-callplan.component.scss":
/*!******************************************************************************************!*\
  !*** ./src/app/callplan/call-plan-table/dialog/add-callplan/add-callplan.component.scss ***!
  \******************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "button {\n  border: 1px solid black;\n  margin-right: 5px; }\n\nmat-form-field {\n  width: 96%;\n  margin-bottom: 1%; }\n\n.origination-section {\n  width: 20%;\n  float: left; }\n\n.destination-section {\n  width: 79%;\n  float: left; }\n\n.half-width {\n  width: 49%; }\n\n.country-code-form {\n  overflow-y: scroll;\n  height: 30vh; }\n\n.details {\n  overflow-y: scroll;\n  height: 30vh; }\n\n.country-code-trash {\n  border: none; }\n\n.country-code-trash:hover {\n  color: red; }\n\n.country-code-trash:focus {\n  outline: 0; }\n\n/deep/ .mat-horizontal-stepper-header {\n  pointer-events: none !important; }\n"

/***/ }),

/***/ "./src/app/callplan/call-plan-table/dialog/add-callplan/add-callplan.component.ts":
/*!****************************************************************************************!*\
  !*** ./src/app/callplan/call-plan-table/dialog/add-callplan/add-callplan.component.ts ***!
  \****************************************************************************************/
/*! exports provided: AddCallPlanComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AddCallPlanComponent", function() { return AddCallPlanComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm5/material.es5.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _shared_api_services_callplan_call_plan_api_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./../../../../shared/api-services/callplan/call-plan.api.service */ "./src/app/shared/api-services/callplan/call-plan.api.service.ts");
/* harmony import */ var _shared_services_callplan_call_plan_shared_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../shared/services/callplan/call-plan.shared.service */ "./src/app/shared/services/callplan/call-plan.shared.service.ts");
/* harmony import */ var _shared_api_services_carrier_carrier_api_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./../../../../shared/api-services/carrier/carrier.api.service */ "./src/app/shared/api-services/carrier/carrier.api.service.ts");
/* harmony import */ var _shared_services_global_codes_shared_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./../../../../shared/services/global/codes.shared.service */ "./src/app/shared/services/global/codes.shared.service.ts");
/* harmony import */ var _shared_services_callplan_attach_callplan_codes_shared_service__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./../../../../shared/services/callplan/attach-callplan-codes.shared.service */ "./src/app/shared/services/callplan/attach-callplan-codes.shared.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (undefined && undefined.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};








var AddCallPlanComponent = /** @class */ (function () {
    function AddCallPlanComponent(dialogRef, data, formBuilder, callPlanService, callPlanSharedService, carrierService, codesSharedService, codesFormSharedService) {
        this.dialogRef = dialogRef;
        this.data = data;
        this.formBuilder = formBuilder;
        this.callPlanService = callPlanService;
        this.callPlanSharedService = callPlanSharedService;
        this.carrierService = carrierService;
        this.codesSharedService = codesSharedService;
        this.codesFormSharedService = codesFormSharedService;
        // Events
        this.event_onAdd = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
        // callplan
        this.carrierObj = [];
        this.promotion = [
            { name: 'Yes', value: true },
            { name: 'No', value: false },
        ];
        this.unlimitedPlanToggle = false;
        this.callPlanObj = [];
        // Patterns
        this.currencyPattern = /^\d+\.\d{2}$/;
        this.numPattern = '^[0-9]+$';
        this.codesPlanType = [
            { code: 0, name: 'Pay as you go' },
            { code: 1, name: 'Unlimited plan' },
            { code: 2, name: 'Minute plan' },
            { code: 3, name: 'Money plan' }
        ];
        this.planPriorityList = [
            { num: 1 }, { num: 2 }, { num: 3 }, { num: 4 }, { num: 5 }, { num: 6 }, { num: 7 }, { num: 8 }, { num: 9 }
        ];
    }
    AddCallPlanComponent.prototype.ngOnInit = function () {
        this.countryCodeList = this.codesSharedService.getCountryCodes();
        this.initFormGroups();
        this.initFormData();
        this.get_CarrierCodes();
        this.attachCallPlanFormGroup.get('validthroughCtrl').disable();
    };
    /*
        ~~~~~~~~~~ Call API Service ~~~~~~~~~~
    */
    AddCallPlanComponent.prototype.get_CarrierCodes = function () {
        var _this = this;
        this.carrierService.get_carriers().subscribe(function (data) { _this.extractCarrierNames(data); }, function (error) { console.log(error); });
    };
    AddCallPlanComponent.prototype.post_callPlan = function () {
        this.callPlanService.post_newCallPlan(this.finalCallPlanObj)
            .subscribe(function (resp) { return console.log(resp); });
    };
    // ================================================================================
    // Data Init
    // ================================================================================
    AddCallPlanComponent.prototype.initFormData = function () {
        this.status = this.codesFormSharedService.provideStatus();
        this.callplanPlanType = this.codesFormSharedService.provideCallplanPlanType();
        this.activeWhen = this.codesFormSharedService.provideActiveWhen();
    };
    AddCallPlanComponent.prototype.initFormGroups = function () {
        this.addCarrierFormGroup = this.formBuilder.group({
            carrierCtrl: ['', _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required]
        });
        this.attachCallPlanFormGroup = this.formBuilder.group(this.initAttachCallplanForms());
        this.attachCodesFormGroup = this.formBuilder.group(this.initAttachCodesForms());
        this.attachCountryCodesFormGroup = this.formBuilder.group({
            codes: this.formBuilder.array([
                this.initCountryCodeFormGroup()
            ])
        });
    };
    AddCallPlanComponent.prototype.initAttachCallplanForms = function () {
        return {
            titleCtrl: ['', _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required],
            subtitleCtrl: [''],
            availableCtrl: ['', _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required],
            validthroughCtrl: ['', _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required],
            buypriceCtrl: ['', [_angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required, _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].pattern(this.currencyPattern)]],
            sellpriceCtrl: ['', [_angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required, _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].pattern(this.currencyPattern)]],
            dayperiodCtrl: ['', [_angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required, _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].pattern(this.numPattern)]],
            rankingCtrl: ['', [_angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required, _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].pattern(this.numPattern)]],
            plantypeCtrl: ['', _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required],
            maxdestinationCtrl: ['', [_angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required, _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].pattern(this.numPattern)]],
            maxminutesCtrl: ['', [_angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required, _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].pattern(this.numPattern)]],
            activewhenCtrl: ['', _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required],
            promoCtrl: ['', _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required],
            descriptionCtrl: ['', _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required]
        };
    };
    AddCallPlanComponent.prototype.initAttachCodesForms = function () {
        return {
            carrierCtrl: ['', _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required],
            plantypeCtrl: ['', _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required],
            planpriorityCtrl: ['', _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required],
            dayperiodCtrl: ['', [_angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required, _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].pattern(this.numPattern)]],
            plannumberCtrl: ['', [_angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required, _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].pattern(this.numPattern)]]
        };
    };
    /*
        ~~~~~~~~~~ Extract Data from JSON into input format ~~~~~~~~~~
    */
    AddCallPlanComponent.prototype.extractCarrierNames = function (data) {
        for (var i = 0; i < data.length; i++) {
            this.carrierObj.push({ id: data[i].id, carrier: data[i].name, code: data[i].code });
        }
    };
    /*
        ~~~~~~~~~~ Form related UI Methods ~~~~~~~~~~
    */
    AddCallPlanComponent.prototype.onChangePlanType = function () {
        var planType = this.attachCallPlanFormGroup.get('plantypeCtrl').value;
        if (planType === 'UNLIMITED_CALL_PLAN') {
            return true;
        }
        else {
            return false;
        }
    };
    AddCallPlanComponent.prototype.initCountryCodeFormGroup = function () {
        return this.formBuilder.group({
            originationCtrl: ['', _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required],
            destinationCtrl: ['', _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required]
        });
    };
    AddCallPlanComponent.prototype.addCodes = function () {
        var control = this.attachCountryCodesFormGroup.controls['codes'];
        control.push(this.initCountryCodeFormGroup());
    };
    AddCallPlanComponent.prototype.removeGroup = function (index) {
        var control = this.attachCountryCodesFormGroup.controls['codes'];
        control.removeAt(index);
    };
    /*
        ~~~~~~~~~~ aggrid Event methods ~~~~~~~~~~
    */
    AddCallPlanComponent.prototype.aggrid_addCallPlan = function () {
        this.event_onAdd.emit(this.finalCallPlanObj);
    };
    /*
        ~~~~~~~~~~ Create Final Call Plan Object ~~~~~~~~~~
    */
    AddCallPlanComponent.prototype.pushStaticCallPlanFieldToObj = function () {
        var maxDestNumber;
        var maxMinutes;
        // check if maxdestination/maxminutes fields are skipped then assign them a value of 0 instead of being nulled
        if (this.attachCallPlanFormGroup.get('maxdestinationCtrl').value === '') {
            maxDestNumber = 0;
        }
        else {
            maxDestNumber = parseInt(this.attachCallPlanFormGroup.get('maxdestinationCtrl').value, 0);
        }
        if (this.attachCallPlanFormGroup.get('maxminutesCtrl').value === '') {
            maxMinutes = 0;
        }
        else {
            maxMinutes = parseInt(this.attachCallPlanFormGroup.get('maxminutesCtrl').value, 0);
        }
        this.finalCallPlanObj = {
            carrier_id: this.addCarrierFormGroup.get('carrierCtrl').value,
            title: this.attachCallPlanFormGroup.get('titleCtrl').value,
            subtitle: this.attachCallPlanFormGroup.get('subtitleCtrl').value,
            available: this.attachCallPlanFormGroup.get('availableCtrl').value,
            valid_through: Date.parse(this.attachCallPlanFormGroup.get('validthroughCtrl').value).toString,
            buy_price: parseFloat(this.attachCallPlanFormGroup.get('buypriceCtrl').value),
            sell_price: parseFloat(this.attachCallPlanFormGroup.get('sellpriceCtrl').value),
            day_period: parseInt(this.attachCallPlanFormGroup.get('dayperiodCtrl').value, 0),
            ranking: parseInt(this.attachCallPlanFormGroup.get('rankingCtrl').value, 0),
            planTypeName: this.attachCallPlanFormGroup.get('plantypeCtrl').value,
            maxDestNumbers: maxDestNumber,
            maxMinutes: maxMinutes,
            activeWhen: this.attachCallPlanFormGroup.get('activewhenCtrl').value,
            isPurchasable: this.attachCallPlanFormGroup.get('promoCtrl').value,
            description: this.attachCallPlanFormGroup.get('descriptionCtrl').value,
            codes: []
        };
    };
    AddCallPlanComponent.prototype.codesObjBuilder = function () {
        this.pushStaticCallPlanFieldToObj();
        var countryCodeArr = this.attachCountryCodesFormGroup.get('codes').value;
        for (var i = 0; i < countryCodeArr.length; i++) {
            var ori_cc = countryCodeArr[i].originationCtrl;
            var destinationLen = countryCodeArr[i].destinationCtrl.length;
            for (var x = 0; x < destinationLen; x++) {
                this.finalCallPlanObj.codes.push({
                    ori_cc: parseInt(ori_cc, 0),
                    dest_cc: parseInt(countryCodeArr[i].destinationCtrl[x], 0),
                    carrier_code: this.attachCodesFormGroup.get('carrierCtrl').value,
                    planType: this.attachCodesFormGroup.get('plantypeCtrl').value,
                    priority: this.attachCodesFormGroup.get('planpriorityCtrl').value,
                    day_period: this.attachCodesFormGroup.get('dayperiodCtrl').value,
                    planNumber: this.attachCodesFormGroup.get('plannumberCtrl').value
                });
            }
        }
    };
    /*
        ~~~~~~~~~~ UI Interactions ~~~~~~~~~~~
    */
    AddCallPlanComponent.prototype.onSelectChangeDest = function (params) {
        var formArrLen = this.attachCountryCodesFormGroup.get('codes').value.length;
        for (var i = 0; i < formArrLen; i++) {
            var destinationCtrl = this.attachCountryCodesFormGroup.get('codes')['controls'][i].get('destinationCtrl').value;
            for (var x = 0; x < destinationCtrl.length; x++) {
                var destinationSetValue = this.attachCountryCodesFormGroup.get('codes')['controls'][i].get('destinationCtrl');
                if (destinationCtrl[0] === '0') {
                    destinationSetValue.setValue(['0']);
                }
                else {
                }
            }
        }
    };
    AddCallPlanComponent.prototype.click_addCallPlan = function () {
        this.post_callPlan();
        this.aggrid_addCallPlan();
        this.closeDialog();
    };
    AddCallPlanComponent.prototype.closeDialog = function () {
        this.dialogRef.close();
    };
    /*
        ~~~~~~~~~~ Test Data ~~~~~~~~~~
    */
    AddCallPlanComponent.prototype.insertDummyDataCallPlan = function () {
        var randomInt = Math.floor(Math.random() * Math.floor(1000));
        this.attachCallPlanFormGroup.get('titleCtrl').setValue("Random title " + randomInt);
        this.attachCallPlanFormGroup.get('subtitleCtrl').setValue("Random subtitle " + randomInt);
        this.attachCallPlanFormGroup.get('availableCtrl').setValue("available");
        this.attachCallPlanFormGroup.get('buypriceCtrl').setValue("1.11");
        this.attachCallPlanFormGroup.get('sellpriceCtrl').setValue("2.22");
        this.attachCallPlanFormGroup.get('dayperiodCtrl').setValue("27");
        this.attachCallPlanFormGroup.get('rankingCtrl').setValue("1");
        this.attachCallPlanFormGroup.get('plantypeCtrl').setValue("PAY_AS_YOU_GO_CALL_PLAN");
        this.attachCallPlanFormGroup.get('maxdestinationCtrl').setValue("0");
        this.attachCallPlanFormGroup.get('maxminutesCtrl').setValue("0");
        this.attachCallPlanFormGroup.get('activewhenCtrl').setValue("IMMEDIATELY");
        this.attachCallPlanFormGroup.get('promoCtrl').setValue(true);
        this.attachCallPlanFormGroup.get('descriptionCtrl').setValue('this is a description');
        console.log(this.attachCallPlanFormGroup.value);
    };
    AddCallPlanComponent.prototype.insertDummyDataCodes = function () {
        this.attachCodesFormGroup.get('carrierCtrl').setValue("OBT");
        this.attachCodesFormGroup.get('plantypeCtrl').setValue(0);
        this.attachCodesFormGroup.get('planpriorityCtrl').setValue(1);
        this.attachCodesFormGroup.get('dayperiodCtrl').setValue(27);
        this.attachCodesFormGroup.get('plannumberCtrl').setValue(1);
        console.log(this.attachCodesFormGroup.value);
    };
    AddCallPlanComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-add-callplan',
            template: __webpack_require__(/*! ./add-callplan.component.html */ "./src/app/callplan/call-plan-table/dialog/add-callplan/add-callplan.component.html"),
            styles: [__webpack_require__(/*! ./add-callplan.component.scss */ "./src/app/callplan/call-plan-table/dialog/add-callplan/add-callplan.component.scss")]
        }),
        __param(1, Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Inject"])(_angular_material__WEBPACK_IMPORTED_MODULE_1__["MAT_DIALOG_DATA"])),
        __metadata("design:paramtypes", [_angular_material__WEBPACK_IMPORTED_MODULE_1__["MatDialogRef"], Object, _angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormBuilder"],
            _shared_api_services_callplan_call_plan_api_service__WEBPACK_IMPORTED_MODULE_3__["CallPlanService"],
            _shared_services_callplan_call_plan_shared_service__WEBPACK_IMPORTED_MODULE_4__["CallPlanSharedService"],
            _shared_api_services_carrier_carrier_api_service__WEBPACK_IMPORTED_MODULE_5__["CarrierService"],
            _shared_services_global_codes_shared_service__WEBPACK_IMPORTED_MODULE_6__["CodesSharedService"],
            _shared_services_callplan_attach_callplan_codes_shared_service__WEBPACK_IMPORTED_MODULE_7__["CodesFormSharedService"]])
    ], AddCallPlanComponent);
    return AddCallPlanComponent;
}());



/***/ }),

/***/ "./src/app/callplan/call-plan-table/dialog/add-code/add-code.component.html":
/*!**********************************************************************************!*\
  !*** ./src/app/callplan/call-plan-table/dialog/add-code/add-code.component.html ***!
  \**********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n<mat-horizontal-stepper> <!-- linear forces user to complete ea step -->\n\n    <!-- Enter Code Step -->\n    <mat-step [stepControl]=\"attachCodesFormGroup\" [completed]=\"false\">\n        <form [formGroup]=\"attachCodesFormGroup\">\n        <ng-template matStepLabel>Enter Code Info</ng-template>\n\n            <mat-form-field> \n                <mat-select placeholder=\"Carrier Code\" formControlName=\"carrierCtrl\">\n                    <mat-option *ngFor=\"let code of carrierCodesObj\" [value]=\"code.code\">\n                        {{code.code}} - {{code.carrier}}\n                    </mat-option>\n                </mat-select>\n            </mat-form-field>\n\n            <mat-form-field> \n                <mat-select placeholder=\"Plan Type\" formControlName=\"plantypeCtrl\">\n                    <mat-option *ngFor=\"let planType of codePlanTypes\" [value]=\"planType.code\">\n                        {{planType.name}}\n                    </mat-option>\n                </mat-select>\n            </mat-form-field>\n\n            <mat-form-field> \n                <mat-select placeholder=\"Plan Priority\" formControlName=\"planpriorityCtrl\">\n                    <mat-option *ngFor=\"let planPriority of planPriorityList\" [value]=\"planPriority.num\">\n                        {{planPriority.num}}\n                    </mat-option>\n                </mat-select>\n            </mat-form-field>\n\n            <mat-form-field >\n                <input matInput placeholder=\"Length of plan in days\" formControlName=\"dayperiodCtrl\" matTooltip=\"Type 0 for unlimited days\" >\n                <mat-hint align=\"end\">Type 0 for unlimited days</mat-hint>\n                <mat-error *ngIf=\"attachCodesFormGroup.get('dayperiodCtrl').hasError('required')\">\n                    Plan in days is <strong>required</strong>\n                </mat-error>\n                <mat-error *ngIf=\"attachCodesFormGroup.get('dayperiodCtrl').hasError('pattern') && !attachCodesFormGroup.get('dayperiodCtrl').hasError('required')\">\n                    Please enter numbers only\n                </mat-error>\n            </mat-form-field>\n\n            <mat-form-field> \n                <input matInput #input maxlength=\"2\" placeholder=\"Enter Plan Number\" formControlName=\"plannumberCtrl\" >\n                <mat-hint align=\"end\">Plan number 00 -> 20 - {{input.value?.length || 0}} / 2</mat-hint>\n                <mat-error *ngIf=\"attachCodesFormGroup.get('plannumberCtrl').hasError('required')\">\n                    Plan number days is <strong>required</strong>\n                </mat-error>\n                <mat-error *ngIf=\"attachCodesFormGroup.get('plannumberCtrl').hasError('pattern') && !attachCodesFormGroup.get('plannumberCtrl').hasError('required')\">\n                    Please enter numbers only\n                </mat-error>\n            </mat-form-field>         \n\n        <div>\n            <button mat-button matStepperPrevious >Back</button>\n            <button mat-button matStepperNext [disabled]=\"!attachCodesFormGroup.valid\">Next</button>\n            <button mat-button (click)=\"insertDummyDataCodes()\">TEST DATA</button>\n        </div>\n        </form>\n    </mat-step>\n\n     <!-- Enter Country Code Step -->\n     <mat-step [stepControl]=\"attachCountryCodesFormGroup\" [completed]=\"false\">\n            <form [formGroup]=\"attachCountryCodesFormGroup\">\n            <ng-template matStepLabel>Attach Codes</ng-template>\n                \n            <div class=\"country-code-form\">\n                <div formArrayName=\"codes\" *ngFor=\"let codeFG of attachCountryCodesFormGroup.get['codes'].controls; let counter=index\">\n                <span> <b>Code Group {{counter + 1}}:</b> </span>\n                <button *ngIf=\"attachCountryCodesFormGroup.get['codes'].controls.length > 1\" (click)=\"removeAddress(counter)\" class=\"country-code-trash\"> <i class=\"fas fa-trash\"></i> </button>\n                    <div [formGroupName]=\"counter\" class=\"addcodes-container\">\n                    \n                        <div class=\"origination-section\">\n                            <mat-form-field class=\"select-width\">\n                                <mat-select placeholder=\"Origination Code\" formControlName=\"originationCtrl\">\n                                <mat-option *ngFor=\"let code of countryCodeList\" [value]=\"code.code\">{{code.country}} - {{code.code}}</mat-option>\n                                </mat-select>\n                            </mat-form-field>\n                        </div>\n            \n                        <div class=\"destination-section\">\n                            <mat-form-field class=\"select-width\">\n                                <mat-select placeholder=\"Destination Code\" formControlName=\"destinationCtrl\" (change)=\"onSelectChangeDest($event)\" multiple>\n                                <mat-option *ngFor=\"let code of countryCodeList\" [value]=\"code.code\">{{code.country}} - {{code.code}}</mat-option>\n                                </mat-select>\n                            </mat-form-field>\n                        </div>\n    \n                    </div>\n                </div> <!-- end nested array FormGroup -->\n            </div>\n\n            <div>\n                <button mat-button (click)=\"addCodes()\"> Add New Country Code</button>\n                <button mat-button matStepperPrevious >Back</button>\n                <button mat-button matStepperNext (click)=\"codesObjBuilder()\" [disabled]=\"!attachCountryCodesFormGroup.valid\">Next</button>\n            </div>\n            </form>\n        </mat-step>\n    \n    <!-- Details & Finalize  -->\n    <mat-step [completed]=\"false\">\n        <ng-template matStepLabel>Review, Submit</ng-template>\n        <pre class=\"finalCodesObj-preview\">{{finalCodesObj | json}}</pre>\n        <div>\n            <button mat-button matStepperPrevious>Back</button>  \n            <button mat-button (click)=\"click_attachCodes()\">Submit</button>\n        </div>\n    </mat-step>\n    \n</mat-horizontal-stepper>"

/***/ }),

/***/ "./src/app/callplan/call-plan-table/dialog/add-code/add-code.component.scss":
/*!**********************************************************************************!*\
  !*** ./src/app/callplan/call-plan-table/dialog/add-code/add-code.component.scss ***!
  \**********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "mat-horizontal-stepper mat-form-field {\n  width: 96%;\n  margin-bottom: 2%; }\n\nmat-horizontal-stepper button {\n  border: 1px solid black;\n  margin-right: 5px; }\n\nmat-horizontal-stepper .finalCodesObj-preview {\n  height: 40vh;\n  overflow: scroll; }\n\nmat-horizontal-stepper .addcodes-container {\n  display: flex; }\n\nmat-horizontal-stepper .addcodes-container .origination-section {\n    flex: 1; }\n\nmat-horizontal-stepper .addcodes-container .destination-section {\n    flex: 2; }\n\n.half-width {\n  width: 49%; }\n\n.country-code-trash {\n  border: none; }\n\n.country-code-trash:hover {\n  color: red; }\n\n.country-code-trash:focus {\n  outline: 0; }\n\n/deep/ .mat-horizontal-stepper-header {\n  pointer-events: none !important; }\n"

/***/ }),

/***/ "./src/app/callplan/call-plan-table/dialog/add-code/add-code.component.ts":
/*!********************************************************************************!*\
  !*** ./src/app/callplan/call-plan-table/dialog/add-code/add-code.component.ts ***!
  \********************************************************************************/
/*! exports provided: AddCodeComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AddCodeComponent", function() { return AddCodeComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm5/material.es5.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _shared_api_services_callplan_call_plan_api_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./../../../../shared/api-services/callplan/call-plan.api.service */ "./src/app/shared/api-services/callplan/call-plan.api.service.ts");
/* harmony import */ var _shared_services_callplan_call_plan_shared_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../shared/services/callplan/call-plan.shared.service */ "./src/app/shared/services/callplan/call-plan.shared.service.ts");
/* harmony import */ var _shared_api_services_carrier_carrier_api_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./../../../../shared/api-services/carrier/carrier.api.service */ "./src/app/shared/api-services/carrier/carrier.api.service.ts");
/* harmony import */ var _shared_services_global_codes_shared_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./../../../../shared/services/global/codes.shared.service */ "./src/app/shared/services/global/codes.shared.service.ts");
/* harmony import */ var _shared_services_callplan_attach_callplan_codes_shared_service__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./../../../../shared/services/callplan/attach-callplan-codes.shared.service */ "./src/app/shared/services/callplan/attach-callplan-codes.shared.service.ts");
/* harmony import */ var _shared_services_global_snackbar_shared_service__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./../../../../shared/services/global/snackbar.shared.service */ "./src/app/shared/services/global/snackbar.shared.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (undefined && undefined.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};









var AddCodeComponent = /** @class */ (function () {
    function AddCodeComponent(dialogRef, data, formBuilder, callPlanService, callPlanSharedService, carrierService, codesSharedService, codesFormSharedService, _snackbar) {
        this.dialogRef = dialogRef;
        this.data = data;
        this.formBuilder = formBuilder;
        this.callPlanService = callPlanService;
        this.callPlanSharedService = callPlanSharedService;
        this.carrierService = carrierService;
        this.codesSharedService = codesSharedService;
        this.codesFormSharedService = codesFormSharedService;
        this._snackbar = _snackbar;
        // Form Data
        this.callPlanObj = [];
        this.carrierCodesObj = [];
        // Service props
        this.finalCodesObj = [];
    }
    AddCodeComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.get_CarrierCodes();
        this.initCodesFormData();
        this.initCodesFormGroup();
        this.callPlanSharedService.currentRowAll.subscribe(function (data) { return _this.currentRowId = data; });
    };
    // ================================================================================
    // API services
    // ================================================================================
    AddCodeComponent.prototype.get_CarrierCodes = function () {
        var _this = this;
        this.carrierService.get_carriers().subscribe(function (data) {
            console.log(data);
            _this.extractCarrierCodes(data);
        }, function (error) { console.log(error); });
    };
    AddCodeComponent.prototype.post_attachCallPlanCodes = function (callplanId, body) {
        var _this = this;
        this.callPlanService.post_newPlanCode(callplanId, body).subscribe(function (resp) {
            console.log(resp);
            if (resp.status === 200) {
                _this._snackbar.snackbar_success('Codes Attached Successful.', 2000);
            }
        }, function (error) {
            console.log(error);
            _this._snackbar.snackbar_error('Codes Attached failed.', 2000);
        });
    };
    // ================================================================================
    // Init Forms & Form Data
    // ================================================================================
    AddCodeComponent.prototype.initCodesFormData = function () {
        this.countryCodeList = this.codesSharedService.getCountryCodes();
        this.codePlanTypes = this.codesFormSharedService.provideCodePlanTypes();
        this.planPriorityList = this.codesFormSharedService.providePriorityList();
    };
    AddCodeComponent.prototype.initCodesFormGroup = function () {
        this.attachCodesFormGroup = this.formBuilder.group(this.buildAttachCodesFormGroup());
        this.attachCountryCodesFormGroup = this.formBuilder.group({
            codes: this.formBuilder.array([
                this.initCountryCodeFormGroup()
            ])
        });
    };
    AddCodeComponent.prototype.buildAttachCodesFormGroup = function () {
        return {
            carrierCtrl: ['', _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required],
            plantypeCtrl: ['', _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required],
            planpriorityCtrl: ['', _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required],
            dayperiodCtrl: ['', [_angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required, _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].pattern('^[0-9]*$')]],
            plannumberCtrl: ['', [_angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required, _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].pattern('^[0-9]*$')]]
        };
    };
    /*
        ~~~~~~~~~~ Extract Data from JSON into input Format ~~~~~~~~~~
    */
    AddCodeComponent.prototype.extractCarrierCodes = function (data) {
        for (var i = 0; i < data.length; i++) {
            this.carrierCodesObj.push({ code: data[i].code, carrier: data[i].name });
        }
    };
    AddCodeComponent.prototype.insertDummyDataCodes = function () {
        this.attachCodesFormGroup.get('plantypeCtrl').setValue(0);
        this.attachCodesFormGroup.get('planpriorityCtrl').setValue(1);
        this.attachCodesFormGroup.get('dayperiodCtrl').setValue(27);
        this.attachCodesFormGroup.get('plannumberCtrl').setValue(1);
    };
    /*
        ~~~~~~~~~~ Form related UI ~~~~~~~~~~
    */
    AddCodeComponent.prototype.initCountryCodeFormGroup = function () {
        return this.formBuilder.group({
            originationCtrl: ['', _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required],
            destinationCtrl: ['', _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required]
        });
    };
    AddCodeComponent.prototype.onSelectChangeDest = function (params) {
        var formArrLen = this.attachCountryCodesFormGroup.get('codes').value.length;
        for (var i = 0; i < formArrLen; i++) {
            var destinationCtrl = this.attachCountryCodesFormGroup.get('codes')['controls'][i].get('destinationCtrl').value;
            for (var x = 0; x < destinationCtrl.length; x++) {
                var destinationSetValue = this.attachCountryCodesFormGroup.get('codes')['controls'][i].get('destinationCtrl');
                if (destinationCtrl[0] === '0') {
                    destinationSetValue.setValue(['0']);
                }
            }
        }
    };
    AddCodeComponent.prototype.addCodes = function () {
        var control = this.attachCountryCodesFormGroup.controls['codes'];
        control.push(this.initCountryCodeFormGroup());
    };
    AddCodeComponent.prototype.removeAddress = function (index) {
        var control = this.attachCountryCodesFormGroup.controls['codes'];
        control.removeAt(index);
    };
    AddCodeComponent.prototype.codesObjBuilder = function () {
        var countryCodeArr = this.attachCountryCodesFormGroup.get('codes').value;
        for (var i = 0; i < countryCodeArr.length; i++) {
            var ori_cc = countryCodeArr[i].originationCtrl;
            var destinationLen = countryCodeArr[i].destinationCtrl.length;
            for (var x = 0; x < destinationLen; x++) {
                this.finalCodesObj.push({
                    ori_cc: parseInt(ori_cc, 0),
                    des_cc: parseInt(countryCodeArr[i].destinationCtrl[x], 0),
                    carrier_code: this.attachCodesFormGroup.get('carrierCtrl').value,
                    planType: this.attachCodesFormGroup.get('plantypeCtrl').value,
                    priority: this.attachCodesFormGroup.get('planpriorityCtrl').value,
                    day_period: parseInt(this.attachCodesFormGroup.get('dayperiodCtrl').value, 0),
                    planNumber: parseInt(this.attachCodesFormGroup.get('plannumberCtrl').value, 0)
                });
            }
        }
    };
    /*
        ~~~~~~~~~~ UI Interactions ~~~~~~~~~~
    */
    AddCodeComponent.prototype.click_attachCodes = function () {
        this.post_attachCodes();
        this.closeDialog();
    };
    AddCodeComponent.prototype.post_attachCodes = function () {
        for (var i = 0; i < this.finalCodesObj.length; i++) {
            this.post_attachCallPlanCodes(this.currentRowId, this.finalCodesObj[i]);
        }
    };
    AddCodeComponent.prototype.closeDialog = function () {
        this.dialogRef.close();
    };
    AddCodeComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-add-code',
            template: __webpack_require__(/*! ./add-code.component.html */ "./src/app/callplan/call-plan-table/dialog/add-code/add-code.component.html"),
            styles: [__webpack_require__(/*! ./add-code.component.scss */ "./src/app/callplan/call-plan-table/dialog/add-code/add-code.component.scss")]
        }),
        __param(1, Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Inject"])(_angular_material__WEBPACK_IMPORTED_MODULE_1__["MAT_DIALOG_DATA"])),
        __metadata("design:paramtypes", [_angular_material__WEBPACK_IMPORTED_MODULE_1__["MatDialogRef"], Object, _angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormBuilder"],
            _shared_api_services_callplan_call_plan_api_service__WEBPACK_IMPORTED_MODULE_3__["CallPlanService"],
            _shared_services_callplan_call_plan_shared_service__WEBPACK_IMPORTED_MODULE_4__["CallPlanSharedService"],
            _shared_api_services_carrier_carrier_api_service__WEBPACK_IMPORTED_MODULE_5__["CarrierService"],
            _shared_services_global_codes_shared_service__WEBPACK_IMPORTED_MODULE_6__["CodesSharedService"],
            _shared_services_callplan_attach_callplan_codes_shared_service__WEBPACK_IMPORTED_MODULE_7__["CodesFormSharedService"],
            _shared_services_global_snackbar_shared_service__WEBPACK_IMPORTED_MODULE_8__["SnackbarSharedService"]])
    ], AddCodeComponent);
    return AddCodeComponent;
}());



/***/ }),

/***/ "./src/app/callplan/call-plan-table/dialog/add-rate-card/add-rate-card.component.html":
/*!********************************************************************************************!*\
  !*** ./src/app/callplan/call-plan-table/dialog/add-rate-card/add-rate-card.component.html ***!
  \********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div mat-dialog-title> Insert Ratecards into Callplan: <strong>{{callplanTitle}}</strong>\n    <button mat-button class=\"submit\" (click)=\"click_attachRatecard()\" [disabled]=\"toggleButtonStates()\"> Submit Ratecards </button>\n</div>\n\n<div class=\"ratecardAll-container\">\n    <ag-grid-angular id=\"ratecardgroup-table\" class=\"ag-theme-balham\" \n        [columnDefs]=\"columnDefs\" [rowData]=\"rowData\"\n        [enableFilter]=\"true\" [floatingFilter]=\"true\"\n        [rowSelection]=\"rowSelection\" [suppressRowClickSelection]=\"true\" [groupSelectsChildren]=\"true\" (rowSelected)=\"rowSelected()\"\n        (selectionChanged)=\"onSelectionChanged()\" [enableSorting]=\"true\"\n        [enableColResize]=\"true\"\n        [getNodeChildDetails]=\"getNodeChildDetails\"\n        [pagination]=\"true\" [paginationAutoPageSize]=\"true\"\n    \n        (gridReady)=\"on_GridReady($event)\"\n    >\n    </ag-grid-angular>\n    <div class=\"toolbar-ratecards-list\">\n            <button mat-button (click)=\"deselectAll()\" [disabled]=\"toggleButtonStates()\"> Deselect All </button>\n    </div>\n</div>\n\n<div class=\"ratecard-importer\">\n    <ag-grid-angular id=\"ratecardReview-table\" class=\"ag-theme-balham\" \n        [columnDefs]=\"columnDefsReview\" [rowData]=\"\"\n        [stopEditingWhenGridLosesFocus]=\"true\" [singleClickEdit]=\"true\" \n        [enableFilter]=\"true\" [floatingFilter]=\"true\"\n        [enableColResize]=\"true\" [enableSorting]=\"true\"\n        [pagination]=\"true\" [paginationAutoPageSize]=\"true\"\n        [enableCellChangeFlash]=\"true\"\n        (gridReady)=\"on_GridReady_Review($event)\"\n    >\n    </ag-grid-angular>\n    <div class=\"toolbar-callplan-list\">\n        <mat-slider max=\"10\" min=\"1\" thumb-label=\"true\" value=\"1\" tickInterval=\"1\" (change)=\"handleSliderChange($event)\" [disabled]=\"toggleButtonStates()\"> \n        </mat-slider> <br>\n        <span><strong>Priority:</strong> {{currentSliderValue}}</span>\n    </div>\n</div>\n"

/***/ }),

/***/ "./src/app/callplan/call-plan-table/dialog/add-rate-card/add-rate-card.component.scss":
/*!********************************************************************************************!*\
  !*** ./src/app/callplan/call-plan-table/dialog/add-rate-card/add-rate-card.component.scss ***!
  \********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "button {\n  border: 1px solid #E0E0E0;\n  width: auto;\n  height: auto;\n  padding-left: 5px;\n  padding-right: 5px; }\n\n.submit {\n  float: right;\n  border: 2px solid green; }\n\n.toolbar-ratecards-list {\n  float: left;\n  width: auto;\n  height: auto; }\n\n.toolbar-callplan-list {\n  float: left;\n  width: auto;\n  height: auto;\n  margin-left: 1%; }\n\n/deep/ .ratecard-callplan-screen-dialog {\n  width: 100vw;\n  height: 98vh;\n  overflow: hidden; }\n\n.ratecardAll-container {\n  width: 35vw;\n  height: auto;\n  float: left;\n  border-top: 1px solid #E0E0E0; }\n\n.ratecardAll-container #ratecardgroup-table {\n    width: 100%;\n    height: 80vh;\n    float: left; }\n\n.ratecard-importer {\n  width: 52vw;\n  height: auto;\n  float: left;\n  border-top: 1px solid #E0E0E0; }\n\n.ratecard-importer #ratecardReview-table {\n    width: 99%;\n    height: 80vh;\n    float: left;\n    border-left: 1px solid #E0E0E0; }\n\n.ratecard-importer mat-slider {\n    width: 20vw; }\n"

/***/ }),

/***/ "./src/app/callplan/call-plan-table/dialog/add-rate-card/add-rate-card.component.ts":
/*!******************************************************************************************!*\
  !*** ./src/app/callplan/call-plan-table/dialog/add-rate-card/add-rate-card.component.ts ***!
  \******************************************************************************************/
/*! exports provided: AddRateCardComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AddRateCardComponent", function() { return AddRateCardComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm5/material.es5.js");
/* harmony import */ var _shared_services_global_nestedAgGrid_shared_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./../../../../shared/services/global/nestedAgGrid.shared.service */ "./src/app/shared/services/global/nestedAgGrid.shared.service.ts");
/* harmony import */ var _shared_api_services_callplan_call_plan_api_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./../../../../shared/api-services/callplan/call-plan.api.service */ "./src/app/shared/api-services/callplan/call-plan.api.service.ts");
/* harmony import */ var _shared_services_callplan_call_plan_shared_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../shared/services/callplan/call-plan.shared.service */ "./src/app/shared/services/callplan/call-plan.shared.service.ts");
/* harmony import */ var _shared_api_services_ratecard_rate_cards_api_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./../../../../shared/api-services/ratecard/rate-cards.api.service */ "./src/app/shared/api-services/ratecard/rate-cards.api.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (undefined && undefined.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};






var AddRateCardComponent = /** @class */ (function () {
    function AddRateCardComponent(dialogRef, callplanTitle, callPlanService, callPlanSharedService, rateCardsService, nestedAgGridService) {
        this.dialogRef = dialogRef;
        this.callplanTitle = callplanTitle;
        this.callPlanService = callPlanService;
        this.callPlanSharedService = callPlanSharedService;
        this.rateCardsService = rateCardsService;
        this.nestedAgGridService = nestedAgGridService;
        // UI Props
        this.buttonToggleBoolean = true;
        this.getNodeChildDetails = this.nestedAgGridService.returnSetGroups();
        this.columnDefs = this.createColumnDefs();
        this.columnDefsReview = this.createColumnDefsReview();
    }
    AddRateCardComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.get_RateCards();
        this.callPlanSharedService.currentRowAll.subscribe(function (data) { return _this.currentRowId = data; });
    };
    /*
        ~~~~~~~~~~ Call API services ~~~~~~~~~~
    */
    AddRateCardComponent.prototype.get_RateCards = function () {
        var _this = this;
        this.rateCardsService.get_ratecard().subscribe(function (data) {
            _this.rowData = _this.nestedAgGridService.formatDataToNestedArr(data);
        }, function (error) { console.log(error); });
    };
    AddRateCardComponent.prototype.post_attachRateCard = function () {
        var callplanId = this.currentRowId;
        var selectedRows = this.gridApi.getSelectedRows();
        for (var i = 0; i < selectedRows.length; i++) {
            var ratecardId = selectedRows[i].id;
            var body = {
                priority: selectedRows[i].priority
            };
            this.callPlanService.post_attachRateCard(callplanId, ratecardId, body)
                .subscribe(function (resp) { return console.log(resp); });
        }
    };
    /*
        ~~~~~~~~~~ AG Grid Initiation ~~~~~~~~~~
    */
    AddRateCardComponent.prototype.on_GridReady = function (params) {
        this.gridApi = params.api;
        params.api.sizeColumnsToFit();
        this.rowSelection = 'multiple';
    };
    AddRateCardComponent.prototype.on_GridReady_Review = function (params) {
        this.gridApiDetails = params.api;
        params.api.sizeColumnsToFit();
    };
    AddRateCardComponent.prototype.createColumnDefs = function () {
        return [
            {
                headerName: 'Ratecard Group', field: 'ratecard_bundle', checkboxSelection: true,
                cellRenderer: 'agGroupCellRenderer', width: 300
            },
            {
                headerName: 'Country', field: 'country'
            },
            {
                headerName: 'Carrier', field: 'carrier_name'
            },
            {
                headerName: 'Priority', field: 'priority', hide: true,
            }
        ];
    };
    AddRateCardComponent.prototype.createColumnDefsReview = function () {
        return [
            {
                headerName: 'ID', field: 'id',
            },
            {
                headerName: 'Ratecard Name', field: 'ratecard_bundle',
            },
            {
                headerName: 'Country', field: 'country'
            },
            {
                headerName: 'Offer', field: 'offer'
            },
            {
                headerName: 'Carrier', field: 'carrier_name'
            },
            {
                headerName: 'Priority', field: 'priority', editable: true
            }
        ];
    };
    /*
        ~~~~~~~~~~ Grid UI Interctions ~~~~~~~~~~
    */
    AddRateCardComponent.prototype.aggrid_gridSizeChanged = function (params) {
        params.api.sizeColumnsToFit();
    };
    AddRateCardComponent.prototype.onSelectionChanged = function () {
        this.gridApiDetails.setRowData([]);
        var selectedRow = this.gridApi.getSelectedRows();
        this.gridApiDetails.setRowData(selectedRow);
    };
    AddRateCardComponent.prototype.deselectAll = function () {
        this.gridApi.deselectAll();
    };
    /*
        ~~~~~~~~~~ UI Interactions ~~~~~~~~~~
    */
    AddRateCardComponent.prototype.handleSliderChange = function (params) {
        var currentSliderValue = params.value;
        this.currentSliderValue = currentSliderValue;
        this.updateDetailGridData(currentSliderValue);
    };
    AddRateCardComponent.prototype.updateDetailGridData = function (currentSliderValue) {
        var itemsToUpdate = [];
        this.gridApiDetails.forEachNodeAfterFilterAndSort(function (rowNode) {
            var data = rowNode.data;
            data.priority = currentSliderValue;
            itemsToUpdate.push(data);
        });
        this.gridApiDetails.updateRowData({ update: itemsToUpdate });
        this.gridApi.updateRowData({ update: itemsToUpdate });
    };
    AddRateCardComponent.prototype.rowSelected = function () {
        this.gridSelectionStatus = this.gridApi.getSelectedNodes().length;
    };
    AddRateCardComponent.prototype.toggleButtonStates = function () {
        if (this.gridSelectionStatus > 0) {
            this.buttonToggleBoolean = false;
        }
        else {
            this.buttonToggleBoolean = true;
        }
        return this.buttonToggleBoolean;
    };
    AddRateCardComponent.prototype.click_attachRatecard = function () {
        this.post_attachRateCard();
        this.closeDialog();
    };
    AddRateCardComponent.prototype.closeDialog = function () {
        this.dialogRef.close();
    };
    AddRateCardComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-add-rate-card',
            template: __webpack_require__(/*! ./add-rate-card.component.html */ "./src/app/callplan/call-plan-table/dialog/add-rate-card/add-rate-card.component.html"),
            styles: [__webpack_require__(/*! ./add-rate-card.component.scss */ "./src/app/callplan/call-plan-table/dialog/add-rate-card/add-rate-card.component.scss")]
        }),
        __param(1, Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Inject"])(_angular_material__WEBPACK_IMPORTED_MODULE_1__["MAT_DIALOG_DATA"])),
        __metadata("design:paramtypes", [_angular_material__WEBPACK_IMPORTED_MODULE_1__["MatDialogRef"], Object, _shared_api_services_callplan_call_plan_api_service__WEBPACK_IMPORTED_MODULE_3__["CallPlanService"],
            _shared_services_callplan_call_plan_shared_service__WEBPACK_IMPORTED_MODULE_4__["CallPlanSharedService"],
            _shared_api_services_ratecard_rate_cards_api_service__WEBPACK_IMPORTED_MODULE_5__["RateCardsService"],
            _shared_services_global_nestedAgGrid_shared_service__WEBPACK_IMPORTED_MODULE_2__["NestedAgGridService"]])
    ], AddRateCardComponent);
    return AddRateCardComponent;
}());



/***/ }),

/***/ "./src/app/callplan/call-plan-table/dialog/del-callplan/del-callplan.component.html":
/*!******************************************************************************************!*\
  !*** ./src/app/callplan/call-plan-table/dialog/del-callplan/del-callplan.component.html ***!
  \******************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<h2 mat-dialog-title>Are you sure?</h2>\n\n    <div mat-dialog-actions>\n        <button mat-button tabindex=\"-1\" (click)=\"click_delCallPlan()\" >Yes</button>\n        <button mat-button tabindex=\"-1\" (click)=\"closeDialog()\">No</button>\n    </div>"

/***/ }),

/***/ "./src/app/callplan/call-plan-table/dialog/del-callplan/del-callplan.component.scss":
/*!******************************************************************************************!*\
  !*** ./src/app/callplan/call-plan-table/dialog/del-callplan/del-callplan.component.scss ***!
  \******************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "button {\n  border: 1px solid black; }\n"

/***/ }),

/***/ "./src/app/callplan/call-plan-table/dialog/del-callplan/del-callplan.component.ts":
/*!****************************************************************************************!*\
  !*** ./src/app/callplan/call-plan-table/dialog/del-callplan/del-callplan.component.ts ***!
  \****************************************************************************************/
/*! exports provided: DelCallPlanComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DelCallPlanComponent", function() { return DelCallPlanComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm5/material.es5.js");
/* harmony import */ var _shared_services_callplan_call_plan_shared_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../shared/services/callplan/call-plan.shared.service */ "./src/app/shared/services/callplan/call-plan.shared.service.ts");
/* harmony import */ var _shared_api_services_callplan_call_plan_api_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./../../../../shared/api-services/callplan/call-plan.api.service */ "./src/app/shared/api-services/callplan/call-plan.api.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (undefined && undefined.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};




var DelCallPlanComponent = /** @class */ (function () {
    function DelCallPlanComponent(_dialogRef, data, _callPlanService, callPlanSharedServce) {
        this._dialogRef = _dialogRef;
        this.data = data;
        this._callPlanService = _callPlanService;
        this.callPlanSharedServce = callPlanSharedServce;
        this.event_onDel = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"];
    }
    DelCallPlanComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.callPlanSharedServce.currentRowAll
            .subscribe(function (receivedRowId) { return _this.rowIdAll = receivedRowId; });
    };
    DelCallPlanComponent.prototype.click_delCallPlan = function () {
        this.del_delCallPlan();
        this.aggrid_delCallPlan();
        this.closeDialog();
    };
    DelCallPlanComponent.prototype.aggrid_delCallPlan = function () {
        this.event_onDel.emit('del-callplan');
    };
    DelCallPlanComponent.prototype.del_delCallPlan = function () {
        this._callPlanService.del_callPlan(this.rowIdAll)
            .subscribe(function (resp) { return console.log(resp); });
    };
    // On method call close dialog
    DelCallPlanComponent.prototype.closeDialog = function () {
        this._dialogRef.close();
    };
    DelCallPlanComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-del-callplan',
            template: __webpack_require__(/*! ./del-callplan.component.html */ "./src/app/callplan/call-plan-table/dialog/del-callplan/del-callplan.component.html"),
            styles: [__webpack_require__(/*! ./del-callplan.component.scss */ "./src/app/callplan/call-plan-table/dialog/del-callplan/del-callplan.component.scss")]
        }),
        __param(1, Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Inject"])(_angular_material__WEBPACK_IMPORTED_MODULE_1__["MAT_DIALOG_DATA"])),
        __metadata("design:paramtypes", [_angular_material__WEBPACK_IMPORTED_MODULE_1__["MatDialogRef"], Object, _shared_api_services_callplan_call_plan_api_service__WEBPACK_IMPORTED_MODULE_3__["CallPlanService"],
            _shared_services_callplan_call_plan_shared_service__WEBPACK_IMPORTED_MODULE_2__["CallPlanSharedService"]])
    ], DelCallPlanComponent);
    return DelCallPlanComponent;
}());



/***/ }),

/***/ "./src/app/callplan/call-plan-table/dialog/dettach-codes/dettach-codes.component.html":
/*!********************************************************************************************!*\
  !*** ./src/app/callplan/call-plan-table/dialog/dettach-codes/dettach-codes.component.html ***!
  \********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<h2 mat-dialog-title>Are you sure?</h2>\n\n    <div mat-dialog-actions>\n        <button mat-button tabindex=\"-1\" (click)=\"click_dettachRatecards()\" >Yes</button>\n        <button mat-button tabindex=\"-1\" (click)=\"closeDialog()\">No</button>\n    </div>"

/***/ }),

/***/ "./src/app/callplan/call-plan-table/dialog/dettach-codes/dettach-codes.component.scss":
/*!********************************************************************************************!*\
  !*** ./src/app/callplan/call-plan-table/dialog/dettach-codes/dettach-codes.component.scss ***!
  \********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "button {\n  border: 1px solid black; }\n"

/***/ }),

/***/ "./src/app/callplan/call-plan-table/dialog/dettach-codes/dettach-codes.component.ts":
/*!******************************************************************************************!*\
  !*** ./src/app/callplan/call-plan-table/dialog/dettach-codes/dettach-codes.component.ts ***!
  \******************************************************************************************/
/*! exports provided: DettachCodesComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DettachCodesComponent", function() { return DettachCodesComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm5/material.es5.js");
/* harmony import */ var _shared_api_services_callplan_call_plan_api_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./../../../../shared/api-services/callplan/call-plan.api.service */ "./src/app/shared/api-services/callplan/call-plan.api.service.ts");
/* harmony import */ var _shared_services_callplan_call_plan_shared_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../shared/services/callplan/call-plan.shared.service */ "./src/app/shared/services/callplan/call-plan.shared.service.ts");
/* harmony import */ var _shared_services_global_snackbar_shared_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./../../../../shared/services/global/snackbar.shared.service */ "./src/app/shared/services/global/snackbar.shared.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (undefined && undefined.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};





var DettachCodesComponent = /** @class */ (function () {
    function DettachCodesComponent(dialogRef, data, callPlanService, callPlanSharedServce, _snackbar) {
        this.dialogRef = dialogRef;
        this.data = data;
        this.callPlanService = callPlanService;
        this.callPlanSharedServce = callPlanSharedServce;
        this._snackbar = _snackbar;
        this.event_onDettach = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"];
    }
    DettachCodesComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.callPlanSharedServce.currentRowAll
            .subscribe(function (receivedRowId) { return _this.rowIdAll = receivedRowId; });
        this.callPlanSharedServce.currentCodesObj
            .subscribe(function (receivedRowObj) { return _this.rowObjCodes = receivedRowObj; });
    };
    DettachCodesComponent.prototype.click_dettachRatecards = function () {
        this.del_detachCodes();
        this.aggrid_dettachCodes();
        this.closeDialog();
    };
    DettachCodesComponent.prototype.aggrid_dettachCodes = function () {
        this.event_onDettach.emit('detach-codes');
    };
    DettachCodesComponent.prototype.del_detachCodes = function () {
        var _this = this;
        var rowCodesId;
        for (var i = 0; i < this.rowObjCodes.length; i++) {
            rowCodesId = this.rowObjCodes[i].id;
            this.callPlanService.del_planCode(this.rowIdAll, rowCodesId)
                .subscribe(function (resp) {
                console.log(resp);
                if (resp.status === 200) {
                    _this._snackbar.snackbar_success('Codes Delete Successful.', 2000);
                }
            }, function (error) {
                console.log(error);
                _this._snackbar.snackbar_error('Codes Delete failed.', 2000);
            });
        }
    };
    DettachCodesComponent.prototype.closeDialog = function () {
        this.dialogRef.close();
    };
    DettachCodesComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-dettach-codes',
            template: __webpack_require__(/*! ./dettach-codes.component.html */ "./src/app/callplan/call-plan-table/dialog/dettach-codes/dettach-codes.component.html"),
            styles: [__webpack_require__(/*! ./dettach-codes.component.scss */ "./src/app/callplan/call-plan-table/dialog/dettach-codes/dettach-codes.component.scss")]
        }),
        __param(1, Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Inject"])(_angular_material__WEBPACK_IMPORTED_MODULE_1__["MAT_DIALOG_DATA"])),
        __metadata("design:paramtypes", [_angular_material__WEBPACK_IMPORTED_MODULE_1__["MatDialogRef"], Object, _shared_api_services_callplan_call_plan_api_service__WEBPACK_IMPORTED_MODULE_2__["CallPlanService"],
            _shared_services_callplan_call_plan_shared_service__WEBPACK_IMPORTED_MODULE_3__["CallPlanSharedService"],
            _shared_services_global_snackbar_shared_service__WEBPACK_IMPORTED_MODULE_4__["SnackbarSharedService"]])
    ], DettachCodesComponent);
    return DettachCodesComponent;
}());



/***/ }),

/***/ "./src/app/callplan/call-plan-table/dialog/dettach-ratecards/dettach-ratecards.component.html":
/*!****************************************************************************************************!*\
  !*** ./src/app/callplan/call-plan-table/dialog/dettach-ratecards/dettach-ratecards.component.html ***!
  \****************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<h2 mat-dialog-title>Are you sure?</h2>\n\n    <div mat-dialog-actions>\n        <button mat-button tabindex=\"-1\" (click)=\"click_dettachRatecards()\" >Yes</button>\n        <button mat-button tabindex=\"-1\" (click)=\"closeDialog()\">No</button>\n    </div>"

/***/ }),

/***/ "./src/app/callplan/call-plan-table/dialog/dettach-ratecards/dettach-ratecards.component.scss":
/*!****************************************************************************************************!*\
  !*** ./src/app/callplan/call-plan-table/dialog/dettach-ratecards/dettach-ratecards.component.scss ***!
  \****************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "button {\n  border: 1px solid black; }\n"

/***/ }),

/***/ "./src/app/callplan/call-plan-table/dialog/dettach-ratecards/dettach-ratecards.component.ts":
/*!**************************************************************************************************!*\
  !*** ./src/app/callplan/call-plan-table/dialog/dettach-ratecards/dettach-ratecards.component.ts ***!
  \**************************************************************************************************/
/*! exports provided: DettachRatecardsComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DettachRatecardsComponent", function() { return DettachRatecardsComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm5/material.es5.js");
/* harmony import */ var _shared_api_services_callplan_call_plan_api_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./../../../../shared/api-services/callplan/call-plan.api.service */ "./src/app/shared/api-services/callplan/call-plan.api.service.ts");
/* harmony import */ var _shared_services_callplan_call_plan_shared_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../shared/services/callplan/call-plan.shared.service */ "./src/app/shared/services/callplan/call-plan.shared.service.ts");
/* harmony import */ var _shared_services_global_snackbar_shared_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./../../../../shared/services/global/snackbar.shared.service */ "./src/app/shared/services/global/snackbar.shared.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (undefined && undefined.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};





var DettachRatecardsComponent = /** @class */ (function () {
    function DettachRatecardsComponent(dialogRef, data, callPlanService, callPlanSharedServce, _snackbar) {
        this.dialogRef = dialogRef;
        this.data = data;
        this.callPlanService = callPlanService;
        this.callPlanSharedServce = callPlanSharedServce;
        this._snackbar = _snackbar;
        this.event_onDettach = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"];
    }
    DettachRatecardsComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.callPlanSharedServce.currentRowAll.subscribe(function (receivedRowId) { return _this.rowIdAll = receivedRowId; });
        this.callPlanSharedServce.currentRatecardsObj.subscribe(function (receivedRowObj) { return _this.rowObjRatecards = receivedRowObj; });
    };
    DettachRatecardsComponent.prototype.click_dettachRatecards = function () {
        this.del_detachRatecards();
        this.aggrid_dettachratecards();
        this.closeDialog();
    };
    DettachRatecardsComponent.prototype.aggrid_dettachratecards = function () {
        this.event_onDettach.emit('detach-ratecards');
    };
    DettachRatecardsComponent.prototype.del_detachRatecards = function () {
        var _this = this;
        var rowRatecardsId;
        for (var i = 0; i < this.rowObjRatecards.length; i++) {
            rowRatecardsId = this.rowObjRatecards[i].id;
            this.callPlanService.del_detachRateCard(this.rowIdAll, rowRatecardsId)
                .subscribe(function (resp) {
                console.log(resp);
                if (resp.status === 200) {
                    _this._snackbar.snackbar_success('Ratecard Delete Successful.', 2000);
                }
            }, function (error) {
                console.log(error);
                _this._snackbar.snackbar_error('Ratecard Delete Failed.', 2000);
            });
        }
    };
    DettachRatecardsComponent.prototype.closeDialog = function () {
        this.dialogRef.close();
    };
    DettachRatecardsComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-dettach-ratecards',
            template: __webpack_require__(/*! ./dettach-ratecards.component.html */ "./src/app/callplan/call-plan-table/dialog/dettach-ratecards/dettach-ratecards.component.html"),
            styles: [__webpack_require__(/*! ./dettach-ratecards.component.scss */ "./src/app/callplan/call-plan-table/dialog/dettach-ratecards/dettach-ratecards.component.scss")]
        }),
        __param(1, Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Inject"])(_angular_material__WEBPACK_IMPORTED_MODULE_1__["MAT_DIALOG_DATA"])),
        __metadata("design:paramtypes", [_angular_material__WEBPACK_IMPORTED_MODULE_1__["MatDialogRef"], Object, _shared_api_services_callplan_call_plan_api_service__WEBPACK_IMPORTED_MODULE_2__["CallPlanService"],
            _shared_services_callplan_call_plan_shared_service__WEBPACK_IMPORTED_MODULE_3__["CallPlanSharedService"],
            _shared_services_global_snackbar_shared_service__WEBPACK_IMPORTED_MODULE_4__["SnackbarSharedService"]])
    ], DettachRatecardsComponent);
    return DettachRatecardsComponent;
}());



/***/ }),

/***/ "./src/app/carrier/carrier-profile/carrier-profile.component.html":
/*!************************************************************************!*\
  !*** ./src/app/carrier/carrier-profile/carrier-profile.component.html ***!
  \************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<section id=\"grid-wrapper\">\n    <div class=\"table-container\">\n        <ag-grid-angular class=\"ag-theme-balham\" \n            [columnDefs]=\"columnDefs\" [rowData]=\"rowData\" [animateRows]=\"true\"\n            [rowSelection]=\"rowSelection\" (selectionChanged)=\"selectionChanged()\" [suppressRowClickSelection]=\"true\"\n            [stopEditingWhenGridLosesFocus]=\"true\" [singleClickEdit]=\"true\" \n            [floatingFilter]=\"true\" [enableSorting]=\"true\"\n            [enableColResize]=\"true\" (gridSizeChanged)=\"gridSizeChanged($event)\"\n            [pagination]=\"true\" [paginationAutoPageSize]=\"true\"\n            [headerHeight]=\"40\" [floatingFiltersHeight]=\"30\"\n            [enableCellChangeFlash]=\"true\"\n\n            (gridReady)=\"onGridReady($event)\"\n        >\n        </ag-grid-angular>  \n        \n        <mat-toolbar-row>\n            <button (click)=\"openDialogDel()\" [disabled]=\"\"> <i class=\"fas fa-trash-alt\"></i> </button>\n            <button (click)=\"openDialogAdd()\"> <i class=\"fas fa-plus\"></i> Profile </button>\n            <mat-form-field class=\"search-bar\">\n                <span matPrefix><i class=\"fas fa-search\"></i> &nbsp;</span>\n                <input matInput placeholder=\"Search Profile Table...\" >\n            </mat-form-field>\n        </mat-toolbar-row>\n    </div>\n</section>\n\n"

/***/ }),

/***/ "./src/app/carrier/carrier-profile/carrier-profile.component.scss":
/*!************************************************************************!*\
  !*** ./src/app/carrier/carrier-profile/carrier-profile.component.scss ***!
  \************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "section {\n  margin-top: 5px;\n  margin-left: 5px;\n  margin-right: 5px; }\n  section .table-container {\n    width: 100%;\n    height: 100%; }\n  section .table-container ag-grid-angular {\n      width: 99.7%;\n      height: 85vh; }\n  section .table-container ag-grid-angular /deep/ .ag-header-row {\n        font-weight: bold; }\n  section .table-container mat-toolbar-row {\n      height: auto; }\n  section .table-container mat-toolbar-row button {\n        background-color: Transparent;\n        width: auto;\n        height: 30px;\n        padding-right: 1em;\n        padding-left: 1em;\n        border: 1px solid #E0E0E0;\n        margin-right: 5px; }\n  section .table-container mat-toolbar-row button:hover {\n          background-color: #E0E0E0; }\n  section .table-container mat-toolbar-row button:focus {\n          outline: 0; }\n  section .table-container mat-toolbar-row mat-form-field {\n        font-size: 14px; }\n  section .table-container mat-toolbar-row .search-bar {\n        float: right;\n        width: 40%;\n        padding-right: 5px;\n        margin-top: -10px; }\n"

/***/ }),

/***/ "./src/app/carrier/carrier-profile/carrier-profile.component.ts":
/*!**********************************************************************!*\
  !*** ./src/app/carrier/carrier-profile/carrier-profile.component.ts ***!
  \**********************************************************************/
/*! exports provided: CarrierProfileComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CarrierProfileComponent", function() { return CarrierProfileComponent; });
/* harmony import */ var _shared_services_global_buttonStates_shared_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./../../shared/services/global/buttonStates.shared.service */ "./src/app/shared/services/global/buttonStates.shared.service.ts");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm5/material.es5.js");
/* harmony import */ var _shared_services_global_snackbar_shared_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../shared/services/global/snackbar.shared.service */ "./src/app/shared/services/global/snackbar.shared.service.ts");
/* harmony import */ var _dialog_add_carrier_profile_dialog_add_carrier_profile_dialog_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./dialog/add-carrier-profile-dialog/add-carrier-profile-dialog.component */ "./src/app/carrier/carrier-profile/dialog/add-carrier-profile-dialog/add-carrier-profile-dialog.component.ts");
/* harmony import */ var _dialog_del_carrier_profile_dialog_del_carrier_profile_dialog_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./dialog/del-carrier-profile-dialog/del-carrier-profile-dialog.component */ "./src/app/carrier/carrier-profile/dialog/del-carrier-profile-dialog/del-carrier-profile-dialog.component.ts");
/* harmony import */ var _shared_api_services_carrier_carrier_profile_api_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./../../shared/api-services/carrier/carrier-profile.api.service */ "./src/app/shared/api-services/carrier/carrier-profile.api.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};







var CarrierProfileComponent = /** @class */ (function () {
    function CarrierProfileComponent(_dialog, _snackbarSharedService, _toggleButtonStateService, _carrierProfileService) {
        this._dialog = _dialog;
        this._snackbarSharedService = _snackbarSharedService;
        this._toggleButtonStateService = _toggleButtonStateService;
        this._carrierProfileService = _carrierProfileService;
        this.quickSearchValue = '';
        this.rowSelection = 'single';
        this.columnDefs = this.createColumnDefs();
    }
    CarrierProfileComponent.prototype.ngOnInit = function () {
        this.get_carrierProfiles();
    };
    // ================================================================================
    // Carrier Profile API
    // ================================================================================
    CarrierProfileComponent.prototype.get_carrierProfiles = function () {
    };
    CarrierProfileComponent.prototype.put_editCarrierProfiles = function () {
    };
    CarrierProfileComponent.prototype.onRefreshRowData = function () {
        // this.carrierService.get_carriers().subscribe(
        //     (data) => {
        //         this.gridApi.setRowData(data);
        //     }
        // );
    };
    // ================================================================================
    // AG Grid Init
    // ================================================================================
    CarrierProfileComponent.prototype.onGridReady = function (params) {
        this.gridApi = params.api;
        params.api.sizeColumnsToFit();
    };
    CarrierProfileComponent.prototype.createColumnDefs = function () {
        return [
            {
                headerName: 'Carrier Name', field: 'carrier_name'
            },
            {
                headerName: 'Carrier Code', field: 'carrier_code'
            },
            {
                headerName: 'Profile Name', field: 'profle_name'
            },
            {
                headerName: 'Rows From Top', field: 'rowsFromTop'
            },
            {
                headerName: 'Rows From Bottom', field: 'rowsFromBottom'
            },
            {
                headerName: 'Destination Column', field: 'destCol'
            },
            {
                headerName: 'Prefix Column', field: 'prefixCol'
            },
            {
                headerName: 'Rates Column', field: 'ratesCol'
            },
            {
                headerName: 'Status Column', field: 'statusCol'
            }
        ];
    };
    // ================================================================================
    // * Grid UI Interactions
    // ================================================================================
    CarrierProfileComponent.prototype.gridSizeChanged = function (params) {
        params.api.sizeColumnsToFit();
    };
    CarrierProfileComponent.prototype.selectionChanged = function () {
        var selectedRows = this.gridApi.getSelectedRows();
        this.rowObj = selectedRows;
    };
    // ================================================================================
    // * Carrier Profile Dialog
    // ================================================================================
    CarrierProfileComponent.prototype.openDialogAdd = function () {
        var _this = this;
        var dialogRef = this._dialog.open(_dialog_add_carrier_profile_dialog_add_carrier_profile_dialog_component__WEBPACK_IMPORTED_MODULE_4__["AddCarrierProfileDialogComponent"], {
            width: '70%',
        });
        dialogRef.afterClosed().subscribe(function () {
            _this.onRefreshRowData(); // * when the dialog closes call fn to refresh rowdata
        });
    };
    CarrierProfileComponent.prototype.openDialogDel = function () {
        var _this = this;
        var dialogRef = this._dialog.open(_dialog_del_carrier_profile_dialog_del_carrier_profile_dialog_component__WEBPACK_IMPORTED_MODULE_5__["DelCarrierProfileDialogComponent"], {});
        dialogRef.afterClosed().subscribe(function () {
            _this.onRefreshRowData(); // * when the dialog closes call fn to refresh rowdata
        });
    };
    CarrierProfileComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-carrier-profile',
            template: __webpack_require__(/*! ./carrier-profile.component.html */ "./src/app/carrier/carrier-profile/carrier-profile.component.html"),
            styles: [__webpack_require__(/*! ./carrier-profile.component.scss */ "./src/app/carrier/carrier-profile/carrier-profile.component.scss")]
        }),
        __metadata("design:paramtypes", [_angular_material__WEBPACK_IMPORTED_MODULE_2__["MatDialog"],
            _shared_services_global_snackbar_shared_service__WEBPACK_IMPORTED_MODULE_3__["SnackbarSharedService"],
            _shared_services_global_buttonStates_shared_service__WEBPACK_IMPORTED_MODULE_0__["ToggleButtonStateService"],
            _shared_api_services_carrier_carrier_profile_api_service__WEBPACK_IMPORTED_MODULE_6__["CarrierProfileService"]])
    ], CarrierProfileComponent);
    return CarrierProfileComponent;
}());



/***/ }),

/***/ "./src/app/carrier/carrier-profile/dialog/add-carrier-profile-dialog/add-carrier-profile-dialog.component.html":
/*!*********************************************************************************************************************!*\
  !*** ./src/app/carrier/carrier-profile/dialog/add-carrier-profile-dialog/add-carrier-profile-dialog.component.html ***!
  \*********************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<mat-horizontal-stepper linear>\n\n    <mat-step [stepControl]=\"addCarrierProfileFormGroup\" [completed]=\"false\">\n        <form [formGroup]=\"addCarrierProfileFormGroup\">\n        <ng-template matStepLabel>Select Carrier</ng-template>\n\n            <mat-form-field class=\"full-width-form-field\">\n                <mat-select placeholder=\"Carrier Name\" formControlName=\"carrierNameCtrl\">\n                    <mat-option *ngFor=\"let carrier of carrierObj\" [value]=\"carrier.name\">\n                        {{ carrier.name }}\n                    </mat-option>\n                </mat-select>\n            </mat-form-field>\n\n            <mat-form-field class=\"full-width-form-field\">\n                <input matInput placeholder=\"Profile Name\" formControlName=\"profileNameCtrl\">\n            </mat-form-field>\n\n            <div mat-dialog-actions>\n                <button mat-button matStepperNext (click)=\"click_generateProfilePreview()\" [disabled]=\"!addCarrierProfileFormGroup.valid\"> Next </button>\n            </div>\n\n        </form>\n    </mat-step>\n\n    <!-- Details & Finalize  -->\n    <mat-step [completed]=\"false\">\n        <ng-template matStepLabel>Review, Submit</ng-template>\n            <div class=\"details\">\n                <pre>{{profilePreviewObj | json}}</pre>\n            </div>\n        <div>\n            <button mat-button matStepperPrevious>Back</button>  \n            <button mat-button class=\"submit\" (click)=\"click_sendProfileReq()\">Submit</button>\n        </div>\n    </mat-step>\n</mat-horizontal-stepper>\n\n\n"

/***/ }),

/***/ "./src/app/carrier/carrier-profile/dialog/add-carrier-profile-dialog/add-carrier-profile-dialog.component.scss":
/*!*********************************************************************************************************************!*\
  !*** ./src/app/carrier/carrier-profile/dialog/add-carrier-profile-dialog/add-carrier-profile-dialog.component.scss ***!
  \*********************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "form {\n  display: -ms-grid;\n  display: grid;\n  -ms-grid-columns: (1fr)[1];\n      grid-template-columns: repeat(1, 1fr); }\n\nbutton {\n  border: 1px solid black; }\n\n.submit {\n  margin-left: 5px; }\n"

/***/ }),

/***/ "./src/app/carrier/carrier-profile/dialog/add-carrier-profile-dialog/add-carrier-profile-dialog.component.ts":
/*!*******************************************************************************************************************!*\
  !*** ./src/app/carrier/carrier-profile/dialog/add-carrier-profile-dialog/add-carrier-profile-dialog.component.ts ***!
  \*******************************************************************************************************************/
/*! exports provided: AddCarrierProfileDialogComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AddCarrierProfileDialogComponent", function() { return AddCarrierProfileDialogComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm5/material.es5.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _shared_api_services_carrier_carrier_profile_api_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./../../../../shared/api-services/carrier/carrier-profile.api.service */ "./src/app/shared/api-services/carrier/carrier-profile.api.service.ts");
/* harmony import */ var _shared_api_services_carrier_carrier_api_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./../../../../shared/api-services/carrier/carrier.api.service */ "./src/app/shared/api-services/carrier/carrier.api.service.ts");
/* harmony import */ var _shared_services_global_snackbar_shared_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./../../../../shared/services/global/snackbar.shared.service */ "./src/app/shared/services/global/snackbar.shared.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (undefined && undefined.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};






var AddCarrierProfileDialogComponent = /** @class */ (function () {
    function AddCarrierProfileDialogComponent(_dialogRef, data, _formBuilder, _carrierSerivce, _snackbarSharedService, _carrierProfileService) {
        var _this = this;
        this._dialogRef = _dialogRef;
        this.data = data;
        this._formBuilder = _formBuilder;
        this._carrierSerivce = _carrierSerivce;
        this._snackbarSharedService = _snackbarSharedService;
        this._carrierProfileService = _carrierProfileService;
        this.profilePreviewObj = {};
        this.getCarrierName = function () { return _this.addCarrierProfileFormGroup.get('carrierNameCtrl').value; };
        this.getCarrierCode = function () {
            for (var i = 0; _this.carrierObj.length; i++) {
                if (_this.carrierObj[i].name === _this.getCarrierName()) {
                    return _this.carrierObj[i].code;
                }
            }
        };
        this.getProfileName = function () { return _this.addCarrierProfileFormGroup.get('profileNameCtrl').value; };
    }
    AddCarrierProfileDialogComponent.prototype.ngOnInit = function () {
        this.get_carriers();
        this.addCarrierProfileFormGroup = this.generateAddCarrierProfileFormGroup();
    };
    // ================================================================================
    // * Carrier Profile API Services
    // ================================================================================
    AddCarrierProfileDialogComponent.prototype.get_carriers = function () {
        var _this = this;
        this._carrierSerivce.get_carriers()
            .subscribe(function (data) {
            console.log(data);
            _this.carrierObj = data;
        });
    };
    AddCarrierProfileDialogComponent.prototype.post_addCarrierProfile = function (body) {
        var _this = this;
        this._carrierProfileService.get_carrierProfiles()
            .subscribe(function (resp) {
            console.log(resp);
            if (resp.status === 200) {
                _this._snackbarSharedService.snackbar_success('Carrier Profile successfully inserted.', 2000);
            }
        }, function (error) {
            console.log(error);
            _this._snackbarSharedService.snackbar_error('Carrier Profile failed to insert.', 2000);
        });
    };
    // ================================================================================
    // * Form Group & Data
    // ================================================================================
    AddCarrierProfileDialogComponent.prototype.generateAddCarrierProfileFormGroup = function () {
        return this._formBuilder.group({
            carrierNameCtrl: [_angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required],
            carrierCodeCtrl: [_angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required],
            profileNameCtrl: ['', _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required]
        });
    };
    AddCarrierProfileDialogComponent.prototype.formCarrierProfileObj = function () {
        return {
            carrier_name: this.getCarrierName(),
            carrier_code: this.getCarrierCode(),
            profile_name: this.getProfileName(),
            rowsFromTop: 0,
            rowsFromBottom: 0,
            colOfDest: 0,
            colOfPrefix: 0,
            colOfRates: 0
        };
    };
    AddCarrierProfileDialogComponent.prototype.formCarrierProfilePreview = function () {
        this.profilePreviewObj = this.formCarrierProfileObj();
    };
    // ================================================================================
    // * Dialog
    // ================================================================================
    AddCarrierProfileDialogComponent.prototype.click_generateProfilePreview = function () {
        // this.formCarrierProfileObj();
        this.formCarrierProfilePreview();
    };
    AddCarrierProfileDialogComponent.prototype.click_sendProfileReq = function () {
        this.post_addCarrierProfile(this.formCarrierProfileObj());
        this.closeDialog();
    };
    AddCarrierProfileDialogComponent.prototype.closeDialog = function () {
        this._dialogRef.close();
    };
    AddCarrierProfileDialogComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-add-carrier-profile-dialog',
            template: __webpack_require__(/*! ./add-carrier-profile-dialog.component.html */ "./src/app/carrier/carrier-profile/dialog/add-carrier-profile-dialog/add-carrier-profile-dialog.component.html"),
            styles: [__webpack_require__(/*! ./add-carrier-profile-dialog.component.scss */ "./src/app/carrier/carrier-profile/dialog/add-carrier-profile-dialog/add-carrier-profile-dialog.component.scss")]
        }),
        __param(1, Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Inject"])(_angular_material__WEBPACK_IMPORTED_MODULE_1__["MAT_DIALOG_DATA"])),
        __metadata("design:paramtypes", [_angular_material__WEBPACK_IMPORTED_MODULE_1__["MatDialogRef"], Object, _angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormBuilder"],
            _shared_api_services_carrier_carrier_api_service__WEBPACK_IMPORTED_MODULE_4__["CarrierService"],
            _shared_services_global_snackbar_shared_service__WEBPACK_IMPORTED_MODULE_5__["SnackbarSharedService"],
            _shared_api_services_carrier_carrier_profile_api_service__WEBPACK_IMPORTED_MODULE_3__["CarrierProfileService"]])
    ], AddCarrierProfileDialogComponent);
    return AddCarrierProfileDialogComponent;
}());



/***/ }),

/***/ "./src/app/carrier/carrier-profile/dialog/del-carrier-profile-dialog/del-carrier-profile-dialog.component.html":
/*!*********************************************************************************************************************!*\
  !*** ./src/app/carrier/carrier-profile/dialog/del-carrier-profile-dialog/del-carrier-profile-dialog.component.html ***!
  \*********************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<h2 mat-dialog-title>Are you sure?</h2>\n\n<div mat-dialog-actions>\n    <button mat-button tabindex=\"-1\" (click)=\"click_delCarrier()\" >Yes</button>\n    <button mat-button tabindex=\"-1\" (click)=\"closeDialog()\">No</button>\n</div>"

/***/ }),

/***/ "./src/app/carrier/carrier-profile/dialog/del-carrier-profile-dialog/del-carrier-profile-dialog.component.scss":
/*!*********************************************************************************************************************!*\
  !*** ./src/app/carrier/carrier-profile/dialog/del-carrier-profile-dialog/del-carrier-profile-dialog.component.scss ***!
  \*********************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "button {\n  border: 1px solid black; }\n"

/***/ }),

/***/ "./src/app/carrier/carrier-profile/dialog/del-carrier-profile-dialog/del-carrier-profile-dialog.component.ts":
/*!*******************************************************************************************************************!*\
  !*** ./src/app/carrier/carrier-profile/dialog/del-carrier-profile-dialog/del-carrier-profile-dialog.component.ts ***!
  \*******************************************************************************************************************/
/*! exports provided: DelCarrierProfileDialogComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DelCarrierProfileDialogComponent", function() { return DelCarrierProfileDialogComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm5/material.es5.js");
/* harmony import */ var _shared_services_carrier_carrier_shared_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./../../../../shared/services/carrier/carrier.shared.service */ "./src/app/shared/services/carrier/carrier.shared.service.ts");
/* harmony import */ var _shared_services_global_snackbar_shared_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./../../../../shared/services/global/snackbar.shared.service */ "./src/app/shared/services/global/snackbar.shared.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (undefined && undefined.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};




var DelCarrierProfileDialogComponent = /** @class */ (function () {
    function DelCarrierProfileDialogComponent(_dialogRef, data, _carrierSharedService, _snackbarSharedService) {
        this._dialogRef = _dialogRef;
        this.data = data;
        this._carrierSharedService = _carrierSharedService;
        this._snackbarSharedService = _snackbarSharedService;
    }
    DelCarrierProfileDialogComponent.prototype.ngOnInit = function () {
    };
    // ================================================================================
    // * Carrier Profile Del API
    // ================================================================================
    DelCarrierProfileDialogComponent.prototype.del_carrierProfile = function (rowId) {
        // this._carrierProfileService.del_carrierProfile(rowId)
        //     .subscribe(
        //         (resp: Response) => {
        //             console.log(resp);
        //             if ( resp.status === 200 ) {
        //                 this._snackbarSharedService.snackbar_success('Carrier Profile successfully deleted.', 2000);
        //             }
        //         },
        //         error => {
        //             console.log(error);
        //                 this._snackbarSharedService.snackbar_error('Carrier failed to delete.', 2000);
        //         }
        //     );
    };
    // ================================================================================
    // * Dialog
    // ================================================================================
    DelCarrierProfileDialogComponent.prototype.click_delCarrier = function () {
        // this.del_carrier(this.rowObj[0].id);
        this.closeDialog();
    };
    DelCarrierProfileDialogComponent.prototype.closeDialog = function () {
        this._dialogRef.close();
    };
    DelCarrierProfileDialogComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-del-carrier-profile-dialog',
            template: __webpack_require__(/*! ./del-carrier-profile-dialog.component.html */ "./src/app/carrier/carrier-profile/dialog/del-carrier-profile-dialog/del-carrier-profile-dialog.component.html"),
            styles: [__webpack_require__(/*! ./del-carrier-profile-dialog.component.scss */ "./src/app/carrier/carrier-profile/dialog/del-carrier-profile-dialog/del-carrier-profile-dialog.component.scss")]
        }),
        __param(1, Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Inject"])(_angular_material__WEBPACK_IMPORTED_MODULE_1__["MAT_DIALOG_DATA"])),
        __metadata("design:paramtypes", [_angular_material__WEBPACK_IMPORTED_MODULE_1__["MatDialogRef"], Object, _shared_services_carrier_carrier_shared_service__WEBPACK_IMPORTED_MODULE_2__["CarrierSharedService"],
            _shared_services_global_snackbar_shared_service__WEBPACK_IMPORTED_MODULE_3__["SnackbarSharedService"]])
    ], DelCarrierProfileDialogComponent);
    return DelCarrierProfileDialogComponent;
}());



/***/ }),

/***/ "./src/app/carrier/carrier-table/carrier-table.component.html":
/*!********************************************************************!*\
  !*** ./src/app/carrier/carrier-table/carrier-table.component.html ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<section id=\"grid-wrapper\">\n    <div class=\"table-container\">\n        <ag-grid-angular class=\"ag-theme-balham\" \n            [columnDefs]=\"columnDefs\" [rowData]=\"rowData\" [animateRows]=\"true\"\n            [rowSelection]=\"rowSelection\" (selectionChanged)=\"selectionChanged()\" (rowSelected)=\"rowSelected()\" [suppressRowClickSelection]=\"true\"\n            [stopEditingWhenGridLosesFocus]=\"true\" [singleClickEdit]=\"true\" (cellValueChanged)=\"onCellValueChanged($event)\"\n            [floatingFilter]=\"true\" [enableSorting]=\"true\"\n            [enableColResize]=\"true\" (gridSizeChanged)=\"gridSizeChanged($event)\"\n            [pagination]=\"true\" [paginationAutoPageSize]=\"true\"\n            [headerHeight]=\"40\" [floatingFiltersHeight]=\"30\"\n\n            [enableCellChangeFlash]=\"true\"\n\n            (gridReady)=\"on_GridReady($event)\"\n        >\n        </ag-grid-angular>  \n        \n        <mat-toolbar-row>\n            <button (click)=\"openDialogDel()\" [disabled]=\"toggleButtonStates()\"> <i class=\"fas fa-trash-alt\"></i> </button>\n            <button (click)=\"openDialogAdd()\"> <i class=\"fas fa-plus\"></i> Carrier </button>\n            <mat-form-field class=\"search-bar\">\n                    <span matPrefix><i class=\"fas fa-search\"></i> &nbsp;</span>\n                    <input matInput placeholder=\"Search Carrier Table...\" (keyup)=\"onQuickFilterChanged()\" [(ngModel)]=\"quickSearchValue\">\n            </mat-form-field>\n        </mat-toolbar-row>\n    </div>\n</section>\n\n\n\n\n"

/***/ }),

/***/ "./src/app/carrier/carrier-table/carrier-table.component.scss":
/*!********************************************************************!*\
  !*** ./src/app/carrier/carrier-table/carrier-table.component.scss ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "section {\n  margin-top: 5px;\n  margin-left: 5px;\n  margin-right: 5px; }\n  section .table-container {\n    width: 100%;\n    height: 100%; }\n  section .table-container ag-grid-angular {\n      width: 99.7%;\n      height: 85vh; }\n  section .table-container ag-grid-angular /deep/ .ag-header-row {\n        font-weight: bold; }\n  section .table-container mat-toolbar-row {\n      height: auto; }\n  section .table-container mat-toolbar-row button {\n        background-color: Transparent;\n        height: 30px;\n        padding-left: 1em;\n        padding-right: 1em;\n        border: 1px solid #E0E0E0;\n        margin-right: 5px; }\n  section .table-container mat-toolbar-row button:hover {\n          background-color: #E0E0E0; }\n  section .table-container mat-toolbar-row button:focus {\n          outline: 0; }\n  section .table-container mat-toolbar-row mat-form-field {\n        font-size: 14px; }\n  section .table-container mat-toolbar-row .search-bar {\n        float: right;\n        width: 40%;\n        padding-right: 5px;\n        margin-top: -10px; }\n"

/***/ }),

/***/ "./src/app/carrier/carrier-table/carrier-table.component.ts":
/*!******************************************************************!*\
  !*** ./src/app/carrier/carrier-table/carrier-table.component.ts ***!
  \******************************************************************/
/*! exports provided: CarrierTableComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CarrierTableComponent", function() { return CarrierTableComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm5/material.es5.js");
/* harmony import */ var _carrier_table_dialog_del_carrier_del_carrier_dialog_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../carrier-table/dialog/del-carrier/del-carrier-dialog.component */ "./src/app/carrier/carrier-table/dialog/del-carrier/del-carrier-dialog.component.ts");
/* harmony import */ var _carrier_table_dialog_add_carrier_add_carrier_dialog_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../carrier-table/dialog/add-carrier/add-carrier-dialog.component */ "./src/app/carrier/carrier-table/dialog/add-carrier/add-carrier-dialog.component.ts");
/* harmony import */ var _shared_api_services_carrier_carrier_api_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./../../shared/api-services/carrier/carrier.api.service */ "./src/app/shared/api-services/carrier/carrier.api.service.ts");
/* harmony import */ var _shared_services_carrier_carrier_shared_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./../../shared/services/carrier/carrier.shared.service */ "./src/app/shared/services/carrier/carrier.shared.service.ts");
/* harmony import */ var _shared_services_global_snackbar_shared_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./../../shared/services/global/snackbar.shared.service */ "./src/app/shared/services/global/snackbar.shared.service.ts");
/* harmony import */ var _shared_services_global_buttonStates_shared_service__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./../../shared/services/global/buttonStates.shared.service */ "./src/app/shared/services/global/buttonStates.shared.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};








var CarrierTableComponent = /** @class */ (function () {
    function CarrierTableComponent(// inject your service
    carrierService, carrierSharedService, _dialog, snackbarSharedService, toggleButtonStateService) {
        this.carrierService = carrierService;
        this.carrierSharedService = carrierSharedService;
        this._dialog = _dialog;
        this.snackbarSharedService = snackbarSharedService;
        this.toggleButtonStateService = toggleButtonStateService;
        this.quickSearchValue = '';
        this.rowSelection = 'single';
        this.columnDefs = this.createColumnDefs();
    }
    CarrierTableComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.get_carrierRowData();
        this.carrierSharedService.currentRowObj.subscribe(function (giveRowObj) { return _this.rowObj = giveRowObj; });
    };
    // ================================================================================
    // Carrier API Service
    // ================================================================================
    CarrierTableComponent.prototype.get_carrierRowData = function () {
        var _this = this;
        this.carrierService.get_carriers().subscribe(function (data) { return _this.rowData = data; }, function (error) { return console.log(error); });
    };
    CarrierTableComponent.prototype.put_editCarrier = function (carrierObj, id) {
        var _this = this;
        this.carrierService.put_EditCarrier(carrierObj, id)
            .subscribe(function (resp) {
            console.log(resp);
            if (resp.status === 200) {
                _this.snackbarSharedService.snackbar_success('Edit Successful.', 2000);
            }
        }, function (error) {
            console.log(error);
            _this.snackbarSharedService.snackbar_error('Edit failed.', 2000);
        });
    };
    // ================================================================================
    // AG Grid Init
    // ================================================================================
    CarrierTableComponent.prototype.on_GridReady = function (params) {
        this.gridApi = params.api;
        params.api.sizeColumnsToFit();
    };
    CarrierTableComponent.prototype.createColumnDefs = function () {
        return [
            {
                headerName: 'Name', field: 'name',
                editable: true, checkboxSelection: true,
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Phone Number', field: 'phone',
                editable: true,
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Email', field: 'email',
                editable: true,
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Address', field: 'address',
                width: 400, editable: true,
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Taxable', field: 'taxable', editable: true,
                cellEditor: 'select', cellEditorParams: { values: ['true', 'false'] },
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Tier Number', field: 'tier', editable: true,
                cellEditor: 'select', cellEditorParams: { values: [1, 2, 3, 4, 5] },
                filter: 'agNumberColumnFilter',
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Carrier Code', field: 'code',
                editable: true,
            },
        ];
    };
    // ================================================================================
    // Grid UI Interactions
    // ================================================================================
    CarrierTableComponent.prototype.gridSizeChanged = function (params) {
        params.api.sizeColumnsToFit();
    };
    CarrierTableComponent.prototype.selectionChanged = function () {
        var selectedRows = this.gridApi.getSelectedRows();
        this.rowObj = selectedRows;
    };
    // ================================================================================
    // AG Grid Events
    // ================================================================================
    CarrierTableComponent.prototype.rowSelected = function () {
        this.gridSelectionStatus = this.gridApi.getSelectedNodes().length;
    };
    CarrierTableComponent.prototype.toggleButtonStates = function () {
        return this.toggleButtonStateService.toggleButtonStates(this.gridSelectionStatus);
    };
    CarrierTableComponent.prototype.onQuickFilterChanged = function () {
        this.gridApi.setQuickFilter(this.quickSearchValue);
    };
    // ================================================================================
    // API Interactions
    // ================================================================================
    CarrierTableComponent.prototype.onRefreshRowData = function () {
        var _this = this;
        this.carrierService.get_carriers().subscribe(function (data) {
            _this.gridApi.setRowData(data);
        });
    };
    CarrierTableComponent.prototype.onCellValueChanged = function (params) {
        var id = params.data.id;
        var taxable = params.data.taxable;
        if (taxable === 'false') {
            taxable = false;
        }
        else {
            taxable = true;
        }
        var carrierObj = {
            code: params.data.code,
            name: params.data.name,
            email: params.data.email,
            phone: params.data.phone,
            address: params.data.address,
            taxable: taxable,
            tier: parseInt(params.data.tier, 0)
        };
        this.put_editCarrier(carrierObj, id);
    };
    // ================================================================================
    // Carrier Dialog
    // ================================================================================
    CarrierTableComponent.prototype.openDialogAdd = function () {
        var _this = this;
        var dialogRef = this._dialog.open(_carrier_table_dialog_add_carrier_add_carrier_dialog_component__WEBPACK_IMPORTED_MODULE_3__["AddCarrierDialogComponent"], {
            width: '40%',
        });
        dialogRef.afterClosed().subscribe(function () {
            _this.onRefreshRowData();
        });
    };
    CarrierTableComponent.prototype.openDialogDel = function () {
        var _this = this;
        this.carrierSharedService.changeRowObj(this.rowObj);
        var dialogRef = this._dialog.open(_carrier_table_dialog_del_carrier_del_carrier_dialog_component__WEBPACK_IMPORTED_MODULE_2__["DelCarrierDialogComponent"], {});
        dialogRef.afterClosed().subscribe(function () {
            _this.onRefreshRowData();
        });
    };
    CarrierTableComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-carrier-table',
            template: __webpack_require__(/*! ./carrier-table.component.html */ "./src/app/carrier/carrier-table/carrier-table.component.html"),
            styles: [__webpack_require__(/*! ./carrier-table.component.scss */ "./src/app/carrier/carrier-table/carrier-table.component.scss")]
        }),
        __metadata("design:paramtypes", [_shared_api_services_carrier_carrier_api_service__WEBPACK_IMPORTED_MODULE_4__["CarrierService"],
            _shared_services_carrier_carrier_shared_service__WEBPACK_IMPORTED_MODULE_5__["CarrierSharedService"],
            _angular_material__WEBPACK_IMPORTED_MODULE_1__["MatDialog"],
            _shared_services_global_snackbar_shared_service__WEBPACK_IMPORTED_MODULE_6__["SnackbarSharedService"],
            _shared_services_global_buttonStates_shared_service__WEBPACK_IMPORTED_MODULE_7__["ToggleButtonStateService"]])
    ], CarrierTableComponent);
    return CarrierTableComponent;
}());



/***/ }),

/***/ "./src/app/carrier/carrier-table/dialog/add-carrier/add-carrier-dialog.component.html":
/*!********************************************************************************************!*\
  !*** ./src/app/carrier/carrier-table/dialog/add-carrier/add-carrier-dialog.component.html ***!
  \********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<mat-horizontal-stepper linear>\n\n    <!-- Enter Carrier Info Step -->\n    <mat-step [stepControl]=\"addCarrierFormGroup\" [completed]=\"false\">\n        <form [formGroup]=\"addCarrierFormGroup\">\n        <ng-template matStepLabel>Enter Carrier Info</ng-template>\n\n            <mat-form-field class=\"half-width\">\n                <input matInput placeholder=\"Name\" formControlName=\"nameCtrl\">\n                <mat-error *ngIf=\"addCarrierFormGroup.get('nameCtrl').hasError('required')\">\n                    Name is <strong>required</strong>\n                </mat-error>\n            </mat-form-field>\n\n            <mat-form-field class=\"half-width\">\n                <input matInput placeholder=\"Email\" formControlName=\"emailCtrl\">\n                <mat-error *ngIf=\"addCarrierFormGroup.get('emailCtrl').hasError('email') && !addCarrierFormGroup.get('emailCtrl').hasError('required')\">\n                    Please enter a valid email address\n                </mat-error>\n                <mat-error *ngIf=\"addCarrierFormGroup.get('emailCtrl').hasError('required')\">\n                    Email is <strong>required</strong>\n                </mat-error>\n            </mat-form-field>\n\n            <mat-form-field class=\"half-width\">\n                <input matInput placeholder=\"Address\" formControlName=\"addressCtrl\">\n                <mat-error *ngIf=\"addCarrierFormGroup.get('addressCtrl').hasError('required')\">\n                    Address is <strong>required</strong>\n                </mat-error>\n            </mat-form-field>\n\n            <mat-form-field class=\"half-width\">\n                <input matInput placeholder=\"Phone Number\" formControlName=\"phoneCtrl\">\n                <mat-error *ngIf=\"addCarrierFormGroup.get('phoneCtrl').hasError('pattern') && !addCarrierFormGroup.get('phoneCtrl').hasError('required')\">\n                    Please enter a valid Phone Number\n                </mat-error>\n                <mat-error *ngIf=\"addCarrierFormGroup.get('phoneCtrl').hasError('required')\">\n                    Phone Number is <strong>required</strong>\n                </mat-error>\n            </mat-form-field>\n\n            <mat-form-field class=\"half-width\">\n                <mat-select matInput placeholder=\"Taxable\" formControlName=\"taxableCtrl\">\n                    <mat-option *ngFor=\"let taxable of taxableOptions\" [value]=\"taxable.value\">\n                        {{taxable.viewValue}}\n                    </mat-option>\n                </mat-select>\n            </mat-form-field>\n\n            <mat-form-field class=\"half-width\">\n                <mat-select matInput placeholder=\"Tier\" formControlName=\"tierCtrl\">\n                    <mat-option *ngFor=\"let tier of tierOptions\" [value]=\"tier.value\">\n                        {{tier.viewValue}}\n                    </mat-option>\n                </mat-select>\n            </mat-form-field>\n\n            <mat-form-field class=\"half-width\" hintLabel=\"Max 3 characters\">\n                <input matInput #input maxlength=\"3\" placeholder=\"Code\" formControlName=\"codeCtrl\">\n                <mat-hint align=\"end\">{{input.value?.length || 0}} / 3</mat-hint>\n                <mat-error *ngIf=\"addCarrierFormGroup.get('codeCtrl').hasError('pattern') && !addCarrierFormGroup.get('codeCtrl').hasError('required')\">\n                    Please use Capital Alphabetical characters only\n                </mat-error>\n                <mat-error *ngIf=\"addCarrierFormGroup.get('codeCtrl').hasError('required')\">\n                    Code is <strong>required</strong>\n                </mat-error>\n            </mat-form-field>\n\n            <div mat-dialog-actions>\n                <button mat-button matStepperNext (click)=\"formCarrierObj()\" [disabled]=\"!addCarrierFormGroup.valid\"> Next </button>\n            </div>\n        </form>\n    </mat-step>\n\n    <!-- Details & Finalize  -->\n    <mat-step [completed]=\"false\">\n        <ng-template matStepLabel>Review, Submit</ng-template>\n            <div class=\"details\">\n                <pre>{{ formCarrierObj() | json }}</pre>\n            </div>\n        <div>\n            <button mat-button matStepperPrevious>Back</button>  \n            <button mat-button (click)=\"click_addCarrier()\">Submit</button>\n        </div>\n    </mat-step>\n</mat-horizontal-stepper>\n\n\n"

/***/ }),

/***/ "./src/app/carrier/carrier-table/dialog/add-carrier/add-carrier-dialog.component.scss":
/*!********************************************************************************************!*\
  !*** ./src/app/carrier/carrier-table/dialog/add-carrier/add-carrier-dialog.component.scss ***!
  \********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "mat-form-field {\n  width: 100%; }\n\nbutton {\n  border: 1px solid black; }\n\n/deep/ .mat-dialog-actions:last-child {\n  margin-bottom: 0; }\n\n.half-width {\n  width: 49%;\n  margin-bottom: 1%; }\n"

/***/ }),

/***/ "./src/app/carrier/carrier-table/dialog/add-carrier/add-carrier-dialog.component.ts":
/*!******************************************************************************************!*\
  !*** ./src/app/carrier/carrier-table/dialog/add-carrier/add-carrier-dialog.component.ts ***!
  \******************************************************************************************/
/*! exports provided: AddCarrierDialogComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AddCarrierDialogComponent", function() { return AddCarrierDialogComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm5/material.es5.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _shared_api_services_carrier_carrier_api_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./../../../../shared/api-services/carrier/carrier.api.service */ "./src/app/shared/api-services/carrier/carrier.api.service.ts");
/* harmony import */ var _shared_services_global_snackbar_shared_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./../../../../shared/services/global/snackbar.shared.service */ "./src/app/shared/services/global/snackbar.shared.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (undefined && undefined.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};





var AddCarrierDialogComponent = /** @class */ (function () {
    function AddCarrierDialogComponent(_dialogRef, data, _formBuilder, _carrierService, _snackbarSharedService) {
        var _this = this;
        this._dialogRef = _dialogRef;
        this.data = data;
        this._formBuilder = _formBuilder;
        this._carrierService = _carrierService;
        this._snackbarSharedService = _snackbarSharedService;
        // * Input Props
        this.taxableOptions = [
            { value: false, viewValue: 'No' },
            { value: true, viewValue: 'Yes' },
        ];
        this.tierOptions = [
            { value: 1, viewValue: 'Tier 1' },
            { value: 2, viewValue: 'Tier 2' },
            { value: 3, viewValue: 'Tier 3' },
            { value: 4, viewValue: 'Tier 4' },
            { value: 5, viewValue: 'Tier 5' },
        ];
        // ================================================================================
        // * Carrier API Services
        // ================================================================================
        this.post_addCarrier = function (body) {
            _this._carrierService.post_AddRow(body)
                .subscribe(function (resp) {
                console.log(resp);
                if (resp.status === 200) {
                    _this._snackbarSharedService.snackbar_success('Carrier successfully inserted.', 2000);
                }
            }, function (error) {
                console.log(error);
                _this._snackbarSharedService.snackbar_error('Carrier failed to insert.', 2000);
            });
        };
        // ================================================================================
        // * Form Group & Data
        // ================================================================================
        this.generateAddCarrierForm = function () {
            return _this._formBuilder.group({
                nameCtrl: ['', _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required],
                emailCtrl: ['', [_angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required, _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].email]],
                addressCtrl: ['', _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required],
                phoneCtrl: ['', [_angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required, _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].pattern('^[0-9]+$')]],
                taxableCtrl: ['', _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required],
                tierCtrl: ['', _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required],
                codeCtrl: ['', [_angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required, _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].pattern('[A-Z]{3}')]]
            });
        };
        this.formCarrierObj = function () {
            return {
                code: _this.addCarrierFormGroup.get('codeCtrl').value,
                name: _this.addCarrierFormGroup.get('nameCtrl').value,
                email: _this.addCarrierFormGroup.get('emailCtrl').value,
                phone: _this.addCarrierFormGroup.get('phoneCtrl').value,
                address: _this.addCarrierFormGroup.get('addressCtrl').value,
                taxable: _this.addCarrierFormGroup.get('taxableCtrl').value,
                tier: _this.addCarrierFormGroup.get('tierCtrl').value
            };
        };
        // ================================================================================
        // * Dialog
        // ================================================================================
        this.click_addCarrier = function () {
            _this.post_addCarrier(_this.formCarrierObj());
            _this.closeDialog();
        };
        this.closeDialog = function () {
            _this._dialogRef.close();
        };
    }
    AddCarrierDialogComponent.prototype.ngOnInit = function () {
        this.addCarrierFormGroup = this.generateAddCarrierForm();
    };
    AddCarrierDialogComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-add-carrier-dialog-inner',
            template: __webpack_require__(/*! ./add-carrier-dialog.component.html */ "./src/app/carrier/carrier-table/dialog/add-carrier/add-carrier-dialog.component.html"),
            styles: [__webpack_require__(/*! ./add-carrier-dialog.component.scss */ "./src/app/carrier/carrier-table/dialog/add-carrier/add-carrier-dialog.component.scss")]
        }),
        __param(1, Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Inject"])(_angular_material__WEBPACK_IMPORTED_MODULE_1__["MAT_DIALOG_DATA"])),
        __metadata("design:paramtypes", [_angular_material__WEBPACK_IMPORTED_MODULE_1__["MatDialogRef"], Object, _angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormBuilder"],
            _shared_api_services_carrier_carrier_api_service__WEBPACK_IMPORTED_MODULE_3__["CarrierService"],
            _shared_services_global_snackbar_shared_service__WEBPACK_IMPORTED_MODULE_4__["SnackbarSharedService"]])
    ], AddCarrierDialogComponent);
    return AddCarrierDialogComponent;
}());



/***/ }),

/***/ "./src/app/carrier/carrier-table/dialog/del-carrier/del-carrier-dialog.component.html":
/*!********************************************************************************************!*\
  !*** ./src/app/carrier/carrier-table/dialog/del-carrier/del-carrier-dialog.component.html ***!
  \********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<h2 mat-dialog-title>Are you sure?</h2>\n\n<div mat-dialog-actions>\n    <button mat-button tabindex=\"-1\" (click)=\"click_delCarrier()\" >Yes</button>\n    <button mat-button tabindex=\"-1\" (click)=\"closeDialog()\">No</button>\n</div>\n"

/***/ }),

/***/ "./src/app/carrier/carrier-table/dialog/del-carrier/del-carrier-dialog.component.scss":
/*!********************************************************************************************!*\
  !*** ./src/app/carrier/carrier-table/dialog/del-carrier/del-carrier-dialog.component.scss ***!
  \********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "button {\n  border: 1px solid black; }\n"

/***/ }),

/***/ "./src/app/carrier/carrier-table/dialog/del-carrier/del-carrier-dialog.component.ts":
/*!******************************************************************************************!*\
  !*** ./src/app/carrier/carrier-table/dialog/del-carrier/del-carrier-dialog.component.ts ***!
  \******************************************************************************************/
/*! exports provided: DelCarrierDialogComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DelCarrierDialogComponent", function() { return DelCarrierDialogComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm5/material.es5.js");
/* harmony import */ var _shared_api_services_carrier_carrier_api_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./../../../../shared/api-services/carrier/carrier.api.service */ "./src/app/shared/api-services/carrier/carrier.api.service.ts");
/* harmony import */ var _shared_services_carrier_carrier_shared_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./../../../../shared/services/carrier/carrier.shared.service */ "./src/app/shared/services/carrier/carrier.shared.service.ts");
/* harmony import */ var _shared_services_global_snackbar_shared_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./../../../../shared/services/global/snackbar.shared.service */ "./src/app/shared/services/global/snackbar.shared.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (undefined && undefined.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};





var DelCarrierDialogComponent = /** @class */ (function () {
    function DelCarrierDialogComponent(_dialogRef, data, _carrierService, _carrierSharedService, _snackbarSharedService) {
        this._dialogRef = _dialogRef;
        this.data = data;
        this._carrierService = _carrierService;
        this._carrierSharedService = _carrierSharedService;
        this._snackbarSharedService = _snackbarSharedService;
    }
    DelCarrierDialogComponent.prototype.ngOnInit = function () {
        var _this = this;
        this._carrierSharedService.currentRowObj.subscribe(function (receivedRowID) { return _this.rowObj = receivedRowID; });
    };
    // ================================================================================
    // * Carrier Del API
    // ================================================================================
    DelCarrierDialogComponent.prototype.del_carrier = function (rowId) {
        var _this = this;
        this._carrierService.del_DeleteRow(rowId)
            .subscribe(function (resp) {
            console.log(resp);
            if (resp.status === 200) {
                _this._snackbarSharedService.snackbar_success('Carrier successfully deleted.', 2000);
            }
        }, function (error) {
            console.log(error);
            _this._snackbarSharedService.snackbar_error('Carrier failed to delete.', 2000);
        });
    };
    // ================================================================================
    // * Dialog
    // ================================================================================
    DelCarrierDialogComponent.prototype.click_delCarrier = function () {
        this.del_carrier(this.rowObj[0].id);
        this.closeDialog();
    };
    DelCarrierDialogComponent.prototype.closeDialog = function () {
        this._dialogRef.close();
    };
    DelCarrierDialogComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-del-carrier-dialog-inner',
            template: __webpack_require__(/*! ./del-carrier-dialog.component.html */ "./src/app/carrier/carrier-table/dialog/del-carrier/del-carrier-dialog.component.html"),
            styles: [__webpack_require__(/*! ./del-carrier-dialog.component.scss */ "./src/app/carrier/carrier-table/dialog/del-carrier/del-carrier-dialog.component.scss")]
        }),
        __param(1, Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Inject"])(_angular_material__WEBPACK_IMPORTED_MODULE_1__["MAT_DIALOG_DATA"])),
        __metadata("design:paramtypes", [_angular_material__WEBPACK_IMPORTED_MODULE_1__["MatDialogRef"], Object, _shared_api_services_carrier_carrier_api_service__WEBPACK_IMPORTED_MODULE_2__["CarrierService"],
            _shared_services_carrier_carrier_shared_service__WEBPACK_IMPORTED_MODULE_3__["CarrierSharedService"],
            _shared_services_global_snackbar_shared_service__WEBPACK_IMPORTED_MODULE_4__["SnackbarSharedService"]])
    ], DelCarrierDialogComponent);
    return DelCarrierDialogComponent;
}());



/***/ }),

/***/ "./src/app/dashboard/dashboard.component.html":
/*!****************************************************!*\
  !*** ./src/app/dashboard/dashboard.component.html ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<section>\n  <header><h1>Dashboard</h1></header>\n</section>"

/***/ }),

/***/ "./src/app/dashboard/dashboard.component.scss":
/*!****************************************************!*\
  !*** ./src/app/dashboard/dashboard.component.scss ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/dashboard/dashboard.component.ts":
/*!**************************************************!*\
  !*** ./src/app/dashboard/dashboard.component.ts ***!
  \**************************************************/
/*! exports provided: DashboardComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DashboardComponent", function() { return DashboardComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var DashboardComponent = /** @class */ (function () {
    function DashboardComponent() {
    }
    DashboardComponent.prototype.ngOnInit = function () {
    };
    DashboardComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-dashboard',
            template: __webpack_require__(/*! ./dashboard.component.html */ "./src/app/dashboard/dashboard.component.html"),
            styles: [__webpack_require__(/*! ./dashboard.component.scss */ "./src/app/dashboard/dashboard.component.scss")]
        }),
        __metadata("design:paramtypes", [])
    ], DashboardComponent);
    return DashboardComponent;
}());



/***/ }),

/***/ "./src/app/lcr/lcr-callplan-table/lcr-callplan-table.component.html":
/*!**************************************************************************!*\
  !*** ./src/app/lcr/lcr-callplan-table/lcr-callplan-table.component.html ***!
  \**************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<section>\n    <div class=\"lcr-callplan-all-container\">\n        <ag-grid-angular id=\"callplan-table\" class=\"ag-theme-balham\" \n            [columnDefs]=\"columnDefs\" [rowData]=\"rowData\" [animateRows]=\"true\"\n            [enableFilter]=\"true\" [floatingFilter]=\"true\"\n            (selectionChanged)=\"selectionChanged($event)\" [suppressRowClickSelection]=\"true\"\n            [enableSorting]=\"true\"\n            [enableColResize]=\"true\" (gridSizeChanged)=\"gridSizeChanged($event)\"\n            [pagination]=\"true\" [paginationAutoPageSize]=\"true\"\n            [headerHeight]=\"40\" [floatingFiltersHeight]=\"30\"\n            (gridReady)=\"on_gridReady($event)\"\n        >\n        </ag-grid-angular>\n        <div class=\"toolbar-ratecards-list\">\n        </div>\n    </div>\n\n    <div class=\"lcr-callplan-detail-container\">\n        <ag-grid-angular id=\"callplan-detail-table\" class=\"ag-theme-balham\" \n            [columnDefs]=\"columnDefsDetails\" [rowData]=\"\"\n            [enableFilter]=\"true\" [floatingFilter]=\"true\" [enableSorting]=\"true\"\n            [enableColResize]=\"true\" (gridSizeChanged)=\"gridSizeChanged($event)\"\n            [suppressLoadingOverlay]=\"true\" [suppressNoRowsOverlay]=\"true\"\n            [headerHeight]=\"40\" [floatingFiltersHeight]=\"30\"\n            (gridReady)=\"on_gridReady_details($event)\"\n        >\n        </ag-grid-angular>\n        <ag-grid-angular id=\"callplan-detail-table2\" class=\"ag-theme-balham\" \n            [columnDefs]=\"columnDefsDetails2\" [rowData]=\"\"\n            [enableFilter]=\"true\" [floatingFilter]=\"true\" [enableSorting]=\"true\"\n            [enableColResize]=\"true\" (gridSizeChanged)=\"gridSizeChanged($event)\"\n            [suppressLoadingOverlay]=\"true\" [suppressNoRowsOverlay]=\"true\"\n            [headerHeight]=\"40\" [floatingFiltersHeight]=\"30\"\n            (gridReady)=\"on_gridReady_details2($event)\"\n        >\n        </ag-grid-angular>\n    </div>\n</section>"

/***/ }),

/***/ "./src/app/lcr/lcr-callplan-table/lcr-callplan-table.component.scss":
/*!**************************************************************************!*\
  !*** ./src/app/lcr/lcr-callplan-table/lcr-callplan-table.component.scss ***!
  \**************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "section {\n  margin-top: 5px;\n  margin-left: 5px;\n  margin-right: 5px;\n  overflow: hidden; }\n  section .lcr-callplan-all-container {\n    width: 40%;\n    height: 100%;\n    float: left; }\n  section .lcr-callplan-all-container #callplan-table {\n      width: 99.7%;\n      height: 84vh;\n      float: left; }\n  section .lcr-callplan-detail-container {\n    width: 60%;\n    height: 100%;\n    float: left; }\n  section .lcr-callplan-detail-container #callplan-detail-table {\n      width: 99.7%;\n      height: 100px;\n      float: left; }\n  section .lcr-callplan-detail-container #callplan-detail-table2 {\n      width: 99.7%;\n      height: 100px;\n      float: left; }\n"

/***/ }),

/***/ "./src/app/lcr/lcr-callplan-table/lcr-callplan-table.component.ts":
/*!************************************************************************!*\
  !*** ./src/app/lcr/lcr-callplan-table/lcr-callplan-table.component.ts ***!
  \************************************************************************/
/*! exports provided: LcrCallPlanTableComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LcrCallPlanTableComponent", function() { return LcrCallPlanTableComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _shared_api_services_lcr_lcr_api_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../shared/api-services/lcr/lcr.api.service */ "./src/app/shared/api-services/lcr/lcr.api.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var LcrCallPlanTableComponent = /** @class */ (function () {
    function LcrCallPlanTableComponent(lcrService) {
        this.lcrService = lcrService;
        this.columnDefs = this.createColumnDefs();
        this.columnDefsDetails = this.createColumnDefsReview();
        this.columnDefsDetails2 = this.createColumnDefsReview2();
    }
    LcrCallPlanTableComponent.prototype.ngOnInit = function () {
        this.get_allOffers();
    };
    /*
        ~~~~~~~~~~ Ratecard API services ~~~~~~~~~~
    */
    LcrCallPlanTableComponent.prototype.get_allOffers = function () {
        var _this = this;
        this.lcrService.get_allOffers()
            .subscribe(function (data) {
            _this.rowData = data;
            console.log(data);
        });
    };
    LcrCallPlanTableComponent.prototype.get_specificOffer = function (carrier_id) {
        var _this = this;
        this.lcrService.get_specificOffer(carrier_id)
            .subscribe(function (data) {
            _this.gridApiDetails.setRowData([data.metadata]);
            _this.gridApiDetails2.setRowData([data.metadata]);
            console.log(data.metadata);
        });
    };
    /*
        ~~~~~~~~~~ AG Grid Initiation ~~~~~~~~~~
    */
    LcrCallPlanTableComponent.prototype.on_gridReady = function (params) {
        this.gridApi = params.api;
        params.api.sizeColumnsToFit();
    };
    LcrCallPlanTableComponent.prototype.on_gridReady_details = function (params) {
        this.gridApiDetails = params.api;
        params.api.sizeColumnsToFit();
    };
    LcrCallPlanTableComponent.prototype.on_gridReady_details2 = function (params) {
        this.gridApiDetails2 = params.api;
        params.api.sizeColumnsToFit();
    };
    LcrCallPlanTableComponent.prototype.createColumnDefs = function () {
        return [
            {
                headerName: 'Id', field: 'id', checkboxSelection: true, width: 100,
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'code', field: 'code',
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Description', field: 'description',
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Valid Through', field: 'valid_through',
                valueFormatter: function (params) { return new Date(params.value * 1000).toDateString(); }
            },
        ];
    };
    LcrCallPlanTableComponent.prototype.createColumnDefsReview = function () {
        return [
            {
                headerName: 'Title', field: 'title',
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Subtitle', field: 'subtitle',
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Type Name', field: 'typeName',
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Active When', field: 'activeWhen',
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Buy Price', field: 'buyPrice', width: 100,
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Sell Price', field: 'sellPrice', width: 100,
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
        ];
    };
    LcrCallPlanTableComponent.prototype.createColumnDefsReview2 = function () {
        return [
            {
                headerName: 'Day Period', field: 'dayPeriod',
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Max Dest #', field: 'maxDestNumbers',
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Max Minutes', field: 'maxMinutes',
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Ranking', field: 'ranking',
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Purchasable?', field: 'isPurchasable',
            },
        ];
    };
    /*
        ~~~~~~~~~~ Grid UI Interctions ~~~~~~~~~~
    */
    LcrCallPlanTableComponent.prototype.gridSizeChanged = function (params) {
        params.api.sizeColumnsToFit();
    };
    LcrCallPlanTableComponent.prototype.selectionChanged = function (params) {
        var id = this.gridApi.getSelectedRows()[0].id;
        this.get_specificOffer(id);
    };
    LcrCallPlanTableComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-lcr-callplan-table',
            template: __webpack_require__(/*! ./lcr-callplan-table.component.html */ "./src/app/lcr/lcr-callplan-table/lcr-callplan-table.component.html"),
            styles: [__webpack_require__(/*! ./lcr-callplan-table.component.scss */ "./src/app/lcr/lcr-callplan-table/lcr-callplan-table.component.scss")]
        }),
        __metadata("design:paramtypes", [_shared_api_services_lcr_lcr_api_service__WEBPACK_IMPORTED_MODULE_1__["LCRService"]])
    ], LcrCallPlanTableComponent);
    return LcrCallPlanTableComponent;
}());



/***/ }),

/***/ "./src/app/lcr/lcr-carrier-table/lcr-carrier-table.component.html":
/*!************************************************************************!*\
  !*** ./src/app/lcr/lcr-carrier-table/lcr-carrier-table.component.html ***!
  \************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<section>\n    <div class=\"lcr-carrier-all-container\">\n        <ag-grid-angular id=\"carrier-table\" class=\"ag-theme-balham\" \n            [columnDefs]=\"columnDefs\" [rowData]=\"rowData\" [animateRows]=\"true\"\n            [enableFilter]=\"true\" [floatingFilter]=\"true\"\n            [suppressRowClickSelection]=\"true\"\n            [enableSorting]=\"true\"\n            [enableColResize]=\"true\" (gridSizeChanged)=\"gridSizeChanged($event)\"\n            [pagination]=\"true\" [paginationAutoPageSize]=\"true\"\n            [headerHeight]=\"40\" [floatingFiltersHeight]=\"30\"\n        \n            (gridReady)=\"on_gridReady($event)\"\n        >\n        </ag-grid-angular>\n    </div>\n</section>"

/***/ }),

/***/ "./src/app/lcr/lcr-carrier-table/lcr-carrier-table.component.scss":
/*!************************************************************************!*\
  !*** ./src/app/lcr/lcr-carrier-table/lcr-carrier-table.component.scss ***!
  \************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "section {\n  margin-top: 5px;\n  margin-left: 5px;\n  margin-right: 5px; }\n  section .lcr-carrier-all-container {\n    width: 100%;\n    height: 100%;\n    float: left; }\n  section .lcr-carrier-all-container #carrier-table {\n      width: 99.7%;\n      height: 85vh;\n      border-top: 1px solid #E0E0E0; }\n"

/***/ }),

/***/ "./src/app/lcr/lcr-carrier-table/lcr-carrier-table.component.ts":
/*!**********************************************************************!*\
  !*** ./src/app/lcr/lcr-carrier-table/lcr-carrier-table.component.ts ***!
  \**********************************************************************/
/*! exports provided: LcrCarrierTableComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LcrCarrierTableComponent", function() { return LcrCarrierTableComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _shared_api_services_lcr_lcr_api_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../shared/api-services/lcr/lcr.api.service */ "./src/app/shared/api-services/lcr/lcr.api.service.ts");
/* harmony import */ var _shared_services_lcr_lcr_shared_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../shared/services/lcr/lcr.shared.service */ "./src/app/shared/services/lcr/lcr.shared.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var LcrCarrierTableComponent = /** @class */ (function () {
    function LcrCarrierTableComponent(lcrService, lcrSharedService) {
        this.lcrService = lcrService;
        this.lcrSharedService = lcrSharedService;
        this.columnDefs = this.createColumnDefs();
    }
    LcrCarrierTableComponent.prototype.ngOnInit = function () {
        this.get_allCarriers();
    };
    /*
        ~~~~~~~~~~ Ratecard API services ~~~~~~~~~~
    */
    LcrCarrierTableComponent.prototype.get_allCarriers = function () {
        var _this = this;
        this.lcrService.get_allCarriers()
            .subscribe(function (data) {
            _this.rowData = data;
            _this.lcrSharedService.change_providerJson(data);
        });
    };
    /*
        ~~~~~~~~~~ AG Grid Initiation ~~~~~~~~~~
    */
    LcrCarrierTableComponent.prototype.on_gridReady = function (params) {
        this.gridApi = params.api;
        params.api.sizeColumnsToFit();
    };
    LcrCarrierTableComponent.prototype.createColumnDefs = function () {
        return [
            {
                headerName: 'Id', field: 'id', width: 100,
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Name', field: 'name',
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Rates Email', field: 'alerts_email',
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Active?', field: 'active',
            },
        ];
    };
    /*
        ~~~~~~~~~~ Grid UI Interctions ~~~~~~~~~~
    */
    LcrCarrierTableComponent.prototype.gridSizeChanged = function (params) {
        params.api.sizeColumnsToFit();
    };
    LcrCarrierTableComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-lcr-carrier-table',
            template: __webpack_require__(/*! ./lcr-carrier-table.component.html */ "./src/app/lcr/lcr-carrier-table/lcr-carrier-table.component.html"),
            styles: [__webpack_require__(/*! ./lcr-carrier-table.component.scss */ "./src/app/lcr/lcr-carrier-table/lcr-carrier-table.component.scss")]
        }),
        __metadata("design:paramtypes", [_shared_api_services_lcr_lcr_api_service__WEBPACK_IMPORTED_MODULE_1__["LCRService"],
            _shared_services_lcr_lcr_shared_service__WEBPACK_IMPORTED_MODULE_2__["LCRSharedService"]])
    ], LcrCarrierTableComponent);
    return LcrCarrierTableComponent;
}());



/***/ }),

/***/ "./src/app/lcr/lcr-ratecard-table/lcr-ratecard-table.component.html":
/*!**************************************************************************!*\
  !*** ./src/app/lcr/lcr-ratecard-table/lcr-ratecard-table.component.html ***!
  \**************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<section>\n    <div class=\"lcr-ratecard-all-container\">\n        <ag-grid-angular id=\"ratecard-table\" class=\"ag-theme-balham\" \n            [columnDefs]=\"columnDefs\" [rowData]=\"rowData\" [animateRows]=\"true\"\n            [enableFilter]=\"true\" [floatingFilter]=\"true\"\n            [suppressRowClickSelection]=\"true\"\n            [enableSorting]=\"true\"\n            [enableColResize]=\"true\" (gridSizeChanged)=\"gridSizeChanged($event)\"\n            [pagination]=\"true\" [paginationAutoPageSize]=\"true\"\n            [headerHeight]=\"40\" [floatingFiltersHeight]=\"30\"\n\n            (gridReady)=\"on_gridReady($event)\"\n        >\n        </ag-grid-angular>\n        <div class=\"toolbar-ratecards-list\">\n        </div>\n    </div>\n\n    <div class=\"lcr-rates-container\">\n        <ag-grid-angular id=\"rates-table\" class=\"ag-theme-balham\" \n            [columnDefs]=\"columnDefsRates\" [rowData]=\"\"\n            [enableFilter]=\"true\" [floatingFilter]=\"true\" [enableSorting]=\"true\"\n            [enableColResize]=\"true\" (gridSizeChanged)=\"gridSizeChanged($event)\"\n            [suppressLoadingOverlay]=\"true\" [suppressNoRowsOverlay]=\"true\"\n            [pagination]=\"true\" [paginationAutoPageSize]=\"true\"\n            [headerHeight]=\"40\" [floatingFiltersHeight]=\"30\"\n            \n            (gridReady)=\"on_gridReady_rates($event)\"\n        >\n        </ag-grid-angular>\n    </div>\n</section>"

/***/ }),

/***/ "./src/app/lcr/lcr-ratecard-table/lcr-ratecard-table.component.scss":
/*!**************************************************************************!*\
  !*** ./src/app/lcr/lcr-ratecard-table/lcr-ratecard-table.component.scss ***!
  \**************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "section {\n  margin-top: 5px;\n  margin-left: 5px;\n  margin-right: 5px;\n  overflow: hidden; }\n  section .lcr-ratecard-all-container {\n    width: 40%;\n    height: 100%;\n    float: left; }\n  section .lcr-ratecard-all-container #ratecard-table {\n      width: 99.7%;\n      height: 84vh;\n      float: left; }\n  section .lcr-rates-container {\n    width: 60%;\n    height: 100%;\n    float: left; }\n  section .lcr-rates-container #rates-table {\n      width: 100%;\n      height: 84vh;\n      float: left; }\n"

/***/ }),

/***/ "./src/app/lcr/lcr-ratecard-table/lcr-ratecard-table.component.ts":
/*!************************************************************************!*\
  !*** ./src/app/lcr/lcr-ratecard-table/lcr-ratecard-table.component.ts ***!
  \************************************************************************/
/*! exports provided: LcrRatecardTableComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LcrRatecardTableComponent", function() { return LcrRatecardTableComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _shared_api_services_lcr_lcr_api_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../shared/api-services/lcr/lcr.api.service */ "./src/app/shared/api-services/lcr/lcr.api.service.ts");
/* harmony import */ var _shared_services_lcr_lcr_shared_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../shared/services/lcr/lcr.shared.service */ "./src/app/shared/services/lcr/lcr.shared.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var LcrRatecardTableComponent = /** @class */ (function () {
    function LcrRatecardTableComponent(lcrService, lcrSharedService) {
        this.lcrService = lcrService;
        this.lcrSharedService = lcrSharedService;
        this.columnDefs = this.createColumnDefs();
        this.columnDefsRates = this.createColumnDefsRates();
    }
    LcrRatecardTableComponent.prototype.ngOnInit = function () {
        this.get_allRatecards();
    };
    /*
        ~~~~~~~~~~ Ratecard API services ~~~~~~~~~~
    */
    LcrRatecardTableComponent.prototype.get_allRatecards = function () {
        var _this = this;
        this.lcrService.get_allRatecards()
            .subscribe(function (data) {
            _this.get_allProviders();
            _this.rowData = _this.lcrSharedService.get_rowDataWithProviderName(data, _this.providerData);
        });
    };
    LcrRatecardTableComponent.prototype.get_rates = function (ratecard_id) {
        var _this = this;
        this.lcrService.get_ratesInRatecard(ratecard_id)
            .subscribe(function (data) {
            _this.gridApiRates.setRowData(data);
            console.log(data.metadata);
        });
    };
    LcrRatecardTableComponent.prototype.get_allProviders = function () {
        var _this = this;
        this.lcrSharedService.current_providerJson.subscribe(function (data) { _this.providerData = data; });
    };
    /*
        ~~~~~~~~~~ AG Grid Initiation ~~~~~~~~~~
    */
    LcrRatecardTableComponent.prototype.on_gridReady = function (params) {
        this.gridApi = params.api;
        params.api.sizeColumnsToFit();
    };
    LcrRatecardTableComponent.prototype.on_gridReady_rates = function (params) {
        this.gridApiRates = params.api;
        params.api.sizeColumnsToFit();
    };
    LcrRatecardTableComponent.prototype.createColumnDefs = function () {
        return [
            {
                headerName: 'Id', field: 'id', checkboxSelection: true, width: 100,
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Provider', field: 'provider_name',
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Name', field: 'name',
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Active', field: 'active', width: 100,
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
        ];
    };
    LcrRatecardTableComponent.prototype.createColumnDefsRates = function () {
        return [
            {
                headerName: 'Id', field: 'id',
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Destination Id', field: 'destination_id',
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Buy Rate', field: 'buyrate',
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Sell Rate', field: 'sellrate',
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Active?', field: 'active',
            },
        ];
    };
    /*
        ~~~~~~~~~~ Grid UI Interctions ~~~~~~~~~~
    */
    LcrRatecardTableComponent.prototype.gridSizeChanged = function (params) {
        params.api.sizeColumnsToFit();
    };
    LcrRatecardTableComponent.prototype.selectionChanged = function (params) {
        var id = this.gridApi.getSelectedRows()[0].id;
        console.log(id);
        this.get_rates(id);
    };
    LcrRatecardTableComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-lcr-ratecard-table',
            template: __webpack_require__(/*! ./lcr-ratecard-table.component.html */ "./src/app/lcr/lcr-ratecard-table/lcr-ratecard-table.component.html"),
            styles: [__webpack_require__(/*! ./lcr-ratecard-table.component.scss */ "./src/app/lcr/lcr-ratecard-table/lcr-ratecard-table.component.scss")]
        }),
        __metadata("design:paramtypes", [_shared_api_services_lcr_lcr_api_service__WEBPACK_IMPORTED_MODULE_1__["LCRService"],
            _shared_services_lcr_lcr_shared_service__WEBPACK_IMPORTED_MODULE_2__["LCRSharedService"]])
    ], LcrRatecardTableComponent);
    return LcrRatecardTableComponent;
}());



/***/ }),

/***/ "./src/app/lcr/lcr-trunk-table/lcr-trunk-table.component.html":
/*!********************************************************************!*\
  !*** ./src/app/lcr/lcr-trunk-table/lcr-trunk-table.component.html ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<section>\n    <div class=\"lcr-trunk-all-container\">\n        <ag-grid-angular id=\"trunk-table\" class=\"ag-theme-balham\" \n            [columnDefs]=\"columnDefs\" [rowData]=\"trunkData\" [animateRows]=\"true\"\n            [enableFilter]=\"true\" [floatingFilter]=\"true\"\n            [suppressRowClickSelection]=\"true\"\n            [enableSorting]=\"true\"\n            [enableColResize]=\"true\" (gridSizeChanged)=\"gridSizeChanged($event)\"\n            [pagination]=\"true\" [paginationAutoPageSize]=\"true\"\n            [headerHeight]=\"40\" [floatingFiltersHeight]=\"30\"\n        \n            (gridReady)=\"on_gridReady($event)\"\n        >\n        </ag-grid-angular>\n    </div>      \n</section>"

/***/ }),

/***/ "./src/app/lcr/lcr-trunk-table/lcr-trunk-table.component.scss":
/*!********************************************************************!*\
  !*** ./src/app/lcr/lcr-trunk-table/lcr-trunk-table.component.scss ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "section {\n  margin-top: 5px;\n  margin-left: 5px;\n  margin-right: 5px; }\n  section .lcr-trunk-all-container {\n    width: 100%;\n    height: 100%;\n    float: left; }\n  section .lcr-trunk-all-container #trunk-table {\n      width: 99.7%;\n      height: 85vh;\n      border-top: 1px solid #E0E0E0; }\n"

/***/ }),

/***/ "./src/app/lcr/lcr-trunk-table/lcr-trunk-table.component.ts":
/*!******************************************************************!*\
  !*** ./src/app/lcr/lcr-trunk-table/lcr-trunk-table.component.ts ***!
  \******************************************************************/
/*! exports provided: LcrTrunkTableComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LcrTrunkTableComponent", function() { return LcrTrunkTableComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _shared_api_services_lcr_lcr_api_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../shared/api-services/lcr/lcr.api.service */ "./src/app/shared/api-services/lcr/lcr.api.service.ts");
/* harmony import */ var _shared_services_lcr_lcr_shared_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../shared/services/lcr/lcr.shared.service */ "./src/app/shared/services/lcr/lcr.shared.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var LcrTrunkTableComponent = /** @class */ (function () {
    function LcrTrunkTableComponent(lcrService, lcrSharedService) {
        this.lcrService = lcrService;
        this.lcrSharedService = lcrSharedService;
        this.columnDefs = this.createColumnDefs();
    }
    LcrTrunkTableComponent.prototype.ngOnInit = function () {
        this.get_allTrunks();
    };
    /*
        ~~~~~~~~~~ Ratecard API services ~~~~~~~~~~
    */
    LcrTrunkTableComponent.prototype.get_allTrunks = function () {
        var _this = this;
        this.lcrService.get_allTrunks()
            .subscribe(function (data) {
            _this.get_allProviders();
            _this.trunkData = _this.lcrSharedService.get_rowDataWithProviderName(data, _this.providerData);
        });
    };
    LcrTrunkTableComponent.prototype.get_allProviders = function () {
        var _this = this;
        this.lcrSharedService.current_providerJson.subscribe(function (data) { _this.providerData = data; });
    };
    /*
        ~~~~~~~~~~ AG Grid Initiation ~~~~~~~~~~
    */
    LcrTrunkTableComponent.prototype.on_gridReady = function (params) {
        this.gridApi = params.api;
        params.api.sizeColumnsToFit();
    };
    LcrTrunkTableComponent.prototype.createColumnDefs = function () {
        return [
            {
                headerName: 'Id', field: 'id', width: 100,
            },
            {
                headerName: 'Cloudonix Id', field: 'cx_trunk_id',
            },
            {
                headerName: 'Provider', field: 'provider_name',
            },
            {
                headerName: 'Active?', field: 'active',
            },
        ];
    };
    /*
        ~~~~~~~~~~ Grid UI Interctions ~~~~~~~~~~
    */
    LcrTrunkTableComponent.prototype.gridSizeChanged = function (params) {
        params.api.sizeColumnsToFit();
    };
    LcrTrunkTableComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-lcr-trunk-table',
            template: __webpack_require__(/*! ./lcr-trunk-table.component.html */ "./src/app/lcr/lcr-trunk-table/lcr-trunk-table.component.html"),
            styles: [__webpack_require__(/*! ./lcr-trunk-table.component.scss */ "./src/app/lcr/lcr-trunk-table/lcr-trunk-table.component.scss")]
        }),
        __metadata("design:paramtypes", [_shared_api_services_lcr_lcr_api_service__WEBPACK_IMPORTED_MODULE_1__["LCRService"],
            _shared_services_lcr_lcr_shared_service__WEBPACK_IMPORTED_MODULE_2__["LCRSharedService"]])
    ], LcrTrunkTableComponent);
    return LcrTrunkTableComponent;
}());



/***/ }),

/***/ "./src/app/login/login.component.html":
/*!********************************************!*\
  !*** ./src/app/login/login.component.html ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<section>\n    <header><h1>Login</h1></header>\n</section>"

/***/ }),

/***/ "./src/app/login/login.component.scss":
/*!********************************************!*\
  !*** ./src/app/login/login.component.scss ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "section {\n  width: 85%;\n  height: auto;\n  margin-top: 50px;\n  margin-left: 150px;\n  position: fixed;\n  background-color: white;\n  overflow: hidden; }\n  section header {\n    margin-left: 30px; }\n"

/***/ }),

/***/ "./src/app/login/login.component.ts":
/*!******************************************!*\
  !*** ./src/app/login/login.component.ts ***!
  \******************************************/
/*! exports provided: LoginComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LoginComponent", function() { return LoginComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var LoginComponent = /** @class */ (function () {
    function LoginComponent() {
    }
    LoginComponent.prototype.ngOnInit = function () {
    };
    LoginComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-login',
            template: __webpack_require__(/*! ./login.component.html */ "./src/app/login/login.component.html"),
            styles: [__webpack_require__(/*! ./login.component.scss */ "./src/app/login/login.component.scss")]
        }),
        __metadata("design:paramtypes", [])
    ], LoginComponent);
    return LoginComponent;
}());



/***/ }),

/***/ "./src/app/ratecard/rate-cards-add-trunks/rate-cards-add-trunks.component.html":
/*!*************************************************************************************!*\
  !*** ./src/app/ratecard/rate-cards-add-trunks/rate-cards-add-trunks.component.html ***!
  \*************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<section>\n    <div class=\"ratecardAll-container\">\n        <ag-grid-angular id=\"ratecardgroup-table\" class=\"ag-theme-balham\" \n        [columnDefs]=\"columnDefs\" [rowData]=\"rowData\"\n        [enableFilter]=\"true\" [floatingFilter]=\"true\"\n        [rowSelection]=\"rowSelection\" [suppressRowClickSelection]=\"true\" [groupSelectsChildren]=\"true\" \n        [enableSorting]=\"true\"\n        [enableColResize]=\"true\"\n        [getNodeChildDetails]=\"getNodeChildDetails\"\n        [pagination]=\"true\" [paginationAutoPageSize]=\"true\"\n        [headerHeight]=\"40\" [floatingFiltersHeight]=\"30\"\n\n        (gridReady)=\"on_GridReady($event)\"\n        >\n        </ag-grid-angular>\n        <div class=\"toolbar-ratecards-list\">\n            <button mat-button (click)=\"click_deselectAll()\"> Clear All </button>\n        </div>\n    </div>\n\n    <div class=\"trunk-container\">\n        <ag-grid-angular id=\"trunk-table\" class=\"ag-theme-balham\" \n        [columnDefs]=\"columnDefsTrunk\" [rowData]=\"rowDataTrunk\"\n        [enableFilter]=\"true\" [floatingFilter]=\"true\"\n        [enableColResize]=\"true\" [enableSorting]=\"true\"\n        (selectionChanged)=\"onSelectionChangedTrunk($event)\"\n        [headerHeight]=\"40\" [floatingFiltersHeight]=\"30\"\n\n        (gridReady)=\"on_GridReady_trunk($event)\"\n        >   \n        </ag-grid-angular>\n    </div>\n    <div class=\"ratecard-importer\">\n        <ag-grid-angular id=\"review-table\" class=\"ag-theme-balham\" \n        [columnDefs]=\"columnDefsReview\" [rowData]=\"\"\n        [enableFilter]=\"true\" [floatingFilter]=\"true\"\n        [enableColResize]=\"true\" [enableSorting]=\"true\"\n        [pagination]=\"true\" [paginationAutoPageSize]=\"true\"\n        [headerHeight]=\"40\" [floatingFiltersHeight]=\"30\"\n        \n        (gridReady)=\"on_GridReady_review($event)\"\n        >\n        </ag-grid-angular>\n        <button mat-button class=\"submit\" (click)=\"click_attachTrunks()\"> Attach Trunks </button>\n    </div>\n</section>\n    "

/***/ }),

/***/ "./src/app/ratecard/rate-cards-add-trunks/rate-cards-add-trunks.component.scss":
/*!*************************************************************************************!*\
  !*** ./src/app/ratecard/rate-cards-add-trunks/rate-cards-add-trunks.component.scss ***!
  \*************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "section {\n  width: 99%;\n  height: 100%;\n  margin-top: 5px;\n  margin-left: 5px;\n  margin-right: 5px; }\n  section .mat-button {\n    border: 1px solid black; }\n  section .submit {\n    float: left;\n    border: 2px solid green; }\n  section .close {\n    float: right;\n    border: 1px solid black; }\n  section .ratecardAll-container {\n    width: 45%;\n    height: auto;\n    float: left; }\n  section .ratecardAll-container #ratecardgroup-table {\n      width: 100%;\n      height: 86vh;\n      float: left; }\n  section .trunk-container {\n    width: 10%;\n    height: auto;\n    float: left; }\n  section .trunk-container #trunk-table {\n      width: 100%;\n      height: 83.5vh;\n      float: left; }\n  section .ratecard-importer {\n    width: 44.9%;\n    height: auto;\n    float: left; }\n  section .ratecard-importer #review-table {\n      width: 100%;\n      height: 86vh;\n      float: left; }\n"

/***/ }),

/***/ "./src/app/ratecard/rate-cards-add-trunks/rate-cards-add-trunks.component.ts":
/*!***********************************************************************************!*\
  !*** ./src/app/ratecard/rate-cards-add-trunks/rate-cards-add-trunks.component.ts ***!
  \***********************************************************************************/
/*! exports provided: RateCardsAddTrunksComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RateCardsAddTrunksComponent", function() { return RateCardsAddTrunksComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _shared_api_services_ratecard_rate_cards_api_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./../../shared/api-services/ratecard/rate-cards.api.service */ "./src/app/shared/api-services/ratecard/rate-cards.api.service.ts");
/* harmony import */ var _shared_services_ratecard_rate_cards_shared_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./../../shared/services/ratecard/rate-cards.shared.service */ "./src/app/shared/services/ratecard/rate-cards.shared.service.ts");
/* harmony import */ var _shared_api_services_trunk_trunks_api_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./../../shared/api-services/trunk/trunks.api.service */ "./src/app/shared/api-services/trunk/trunks.api.service.ts");
/* harmony import */ var _shared_services_global_nestedAgGrid_shared_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./../../shared/services/global/nestedAgGrid.shared.service */ "./src/app/shared/services/global/nestedAgGrid.shared.service.ts");
/* harmony import */ var _shared_services_global_snackbar_shared_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./../../shared/services/global/snackbar.shared.service */ "./src/app/shared/services/global/snackbar.shared.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var RateCardsAddTrunksComponent = /** @class */ (function () {
    function RateCardsAddTrunksComponent(rateCardsService, rateCardsSharedService, trunksService, nestedAgGridService, snackbarSharedService) {
        this.rateCardsService = rateCardsService;
        this.rateCardsSharedService = rateCardsSharedService;
        this.trunksService = trunksService;
        this.nestedAgGridService = nestedAgGridService;
        this.snackbarSharedService = snackbarSharedService;
        this.event_onAdd = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"];
        // props
        this.finalRatecardToTrunkArr = [];
        this.getNodeChildDetails = this.nestedAgGridService.returnSetGroups();
        this.columnDefs = this.createColumnDefs();
        this.columnDefsTrunk = this.createColumnsDefsTrunk();
        this.columnDefsReview = this.createColumnDefsReview();
    }
    RateCardsAddTrunksComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.get_ratecards();
        this.get_trunks();
        this.rateCardsSharedService.currentRowAllObj.subscribe(function (data) { return _this.ratecardsObj = data; });
    };
    // ================================================================================
    // API Service
    // ================================================================================
    RateCardsAddTrunksComponent.prototype.get_ratecards = function () {
        var _this = this;
        this.rateCardsService.get_ratecard().subscribe(function (data) {
            _this.rowData = _this.nestedAgGridService.formatDataToNestedArr(data);
        }, function (error) { console.log(error); });
    };
    RateCardsAddTrunksComponent.prototype.get_trunks = function () {
        var _this = this;
        this.trunksService.get_allTrunks().subscribe(function (data) {
            _this.rowDataTrunk = data;
        }, function (error) { console.log(error); });
    };
    RateCardsAddTrunksComponent.prototype.post_attachTrunksToRatecard = function (ratecardId, trunkId) {
        var _this = this;
        this.rateCardsService.post_AttachTrunk(ratecardId, trunkId)
            .subscribe(function (resp) {
            console.log(resp.status);
            if (resp.status === 200) {
                _this.snackbarSharedService.snackbar_success('Trunk Successfully attached to Ratecard.', 5000);
            }
            else {
            }
        });
    };
    // ================================================================================
    // AG Grid Init
    // ================================================================================
    RateCardsAddTrunksComponent.prototype.on_GridReady = function (params) {
        this.gridApi = params.api;
        params.api.sizeColumnsToFit();
        this.rowSelection = 'multiple';
    };
    RateCardsAddTrunksComponent.prototype.on_GridReady_trunk = function (params) {
        this.gridApiTrunk = params.api;
        params.api.sizeColumnsToFit();
    };
    RateCardsAddTrunksComponent.prototype.on_GridReady_review = function (params) {
        this.gridApiReview = params.api;
        params.api.sizeColumnsToFit();
    };
    RateCardsAddTrunksComponent.prototype.createColumnDefs = function () {
        return [
            {
                headerName: 'Ratecard Group', field: 'ratecard_bundle', checkboxSelection: true,
                cellRenderer: 'agGroupCellRenderer', width: 300,
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Country', field: 'country', width: 120,
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Carrier', field: 'carrier_name', width: 80,
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Priority', field: 'priority', hide: true,
            }
        ];
    };
    RateCardsAddTrunksComponent.prototype.createColumnsDefsTrunk = function () {
        return [
            {
                headerName: 'Choose Trunk', field: 'trunk_name', checkboxSelection: true,
            }
        ];
    };
    RateCardsAddTrunksComponent.prototype.createColumnDefsReview = function () {
        return [
            {
                headerName: 'Ratecard Name', field: 'name',
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Country', field: 'country',
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Carrier', field: 'carrier_name',
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Trunk Name', field: 'trunk_name',
            },
        ];
    };
    /*
        ~~~~~~~~~~ AG Grid Methods ~~~~~~~~~~
    */
    RateCardsAddTrunksComponent.prototype.onSelectionChangedTrunk = function (params) {
        var selectedRatecards = this.gridApi.getSelectedRows();
        var selectedTrunk = this.gridApiTrunk.getSelectedRows();
        this.gridApiReview.setRowData(this.processReviewTable(selectedRatecards, selectedTrunk));
    };
    RateCardsAddTrunksComponent.prototype.click_deselectAll = function () {
        this.gridApi.deselectAll();
        this.gridApiTrunk.deselectAll();
    };
    /*
        ~~~~~~~~~~ Data Processing ~~~~~~~~~~
    */
    RateCardsAddTrunksComponent.prototype.processReviewTable = function (selectedRatecards, selectedTrunk) {
        var reviewData = [];
        for (var i = 0; i < selectedRatecards.length; i++) {
            reviewData.push({
                ratecard_id: selectedRatecards[i].id,
                name: selectedRatecards[i].name,
                country: selectedRatecards[i].country,
                offer: selectedRatecards[i].offer,
                carrier_name: selectedRatecards[i].carrier_name,
                trunk_name: selectedTrunk[0].trunk_name,
                trunk_id: selectedTrunk[0].id
            });
        }
        return reviewData;
    };
    RateCardsAddTrunksComponent.prototype.processReviewTableToSubmit = function () {
        var finalRatecardToTrunkArr = [];
        this.gridApiReview.forEachNodeAfterFilterAndSort(function (rowNode) {
            finalRatecardToTrunkArr.push({
                ratecard_id: rowNode.data.ratecard_id,
                trunk_id: rowNode.data.trunk_id
            });
        });
        console.log(finalRatecardToTrunkArr);
        for (var i = 0; i < finalRatecardToTrunkArr.length; i++) {
            this.post_attachTrunksToRatecard(finalRatecardToTrunkArr[i].ratecard_id, finalRatecardToTrunkArr[i].trunk_id);
        }
    };
    RateCardsAddTrunksComponent.prototype.click_attachTrunks = function () {
        this.processReviewTableToSubmit();
        this.gridApiTrunk.deselectAll();
        this.gridApiReview.setRowData([]);
    };
    RateCardsAddTrunksComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-rate-cards-add-trunks',
            template: __webpack_require__(/*! ./rate-cards-add-trunks.component.html */ "./src/app/ratecard/rate-cards-add-trunks/rate-cards-add-trunks.component.html"),
            styles: [__webpack_require__(/*! ./rate-cards-add-trunks.component.scss */ "./src/app/ratecard/rate-cards-add-trunks/rate-cards-add-trunks.component.scss")]
        }),
        __metadata("design:paramtypes", [_shared_api_services_ratecard_rate_cards_api_service__WEBPACK_IMPORTED_MODULE_1__["RateCardsService"],
            _shared_services_ratecard_rate_cards_shared_service__WEBPACK_IMPORTED_MODULE_2__["RateCardsSharedService"],
            _shared_api_services_trunk_trunks_api_service__WEBPACK_IMPORTED_MODULE_3__["TrunksService"],
            _shared_services_global_nestedAgGrid_shared_service__WEBPACK_IMPORTED_MODULE_4__["NestedAgGridService"],
            _shared_services_global_snackbar_shared_service__WEBPACK_IMPORTED_MODULE_5__["SnackbarSharedService"]])
    ], RateCardsAddTrunksComponent);
    return RateCardsAddTrunksComponent;
}());



/***/ }),

/***/ "./src/app/ratecard/rate-cards-convert-csv/rate-cards-convert-csv.component.html":
/*!***************************************************************************************!*\
  !*** ./src/app/ratecard/rate-cards-convert-csv/rate-cards-convert-csv.component.html ***!
  \***************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<section>\n    <div class=\"ratecards-table-container\">\n        <ag-grid-angular class=\"ag-theme-balham\" id=\"ratecards-table\"\n        [getNodeChildDetails]=\"getNodeChildDetails\"\n        [columnDefs]=\"columnDefs\" [rowData]=\"rowData\" [animateRows]=\"true\"\n        [rowSelection]=\"rowSelectionTypeM\" (rowSelected)=\"rowSelected($event)\" [groupSelectsChildren]=\"true\"\n        [stopEditingWhenGridLosesFocus]=\"true\" [singleClickEdit]=\"true\" [suppressRowClickSelection]=\"true\"\n        [floatingFilter]=\"true\" [enableSorting]=\"true\"\n        [enableColResize]=\"true\" (gridSizeChanged)=\"gridSizeChanged($event)\"\n        [suppressLoadingOverlay]=\"true\" [suppressNoRowsOverlay]=\"true\"\n        [pagination]=\"true\" [paginationAutoPageSize]=\"true\"\n        [headerHeight]=\"40\" [floatingFiltersHeight]=\"30\"\n\n        [enableCellChangeFlash]=\"true\"\n\n        (gridReady)=\"on_GridReady($event)\"\n        >\n        </ag-grid-angular>\n\n        <button mat-button (click)=\"onConvertJsonToCsv()\"> Convert to CSV Files </button> |\n        <button mat-button (click)=\"onConvertJsonToCsvOneFile()\"> Step 1 -> Call services and add to global Arr </button>\n        <button mat-button (click)=\"formOneFile()\" [disabled]=\"disableStep2\"> Step 2 -> Download file </button>\n    </div>\n</section>"

/***/ }),

/***/ "./src/app/ratecard/rate-cards-convert-csv/rate-cards-convert-csv.component.scss":
/*!***************************************************************************************!*\
  !*** ./src/app/ratecard/rate-cards-convert-csv/rate-cards-convert-csv.component.scss ***!
  \***************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "button {\n  border: 1px solid black; }\n\nsection {\n  width: 100%;\n  height: 100%;\n  margin-top: 5px;\n  margin-left: 5px;\n  margin-right: 5px; }\n\nsection .ratecards-table-container {\n    width: 99%;\n    height: auto;\n    float: left; }\n\nsection .ratecards-table-container #ratecards-table {\n      width: 100%;\n      height: 80vh;\n      float: left;\n      margin-bottom: 10px; }\n"

/***/ }),

/***/ "./src/app/ratecard/rate-cards-convert-csv/rate-cards-convert-csv.component.ts":
/*!*************************************************************************************!*\
  !*** ./src/app/ratecard/rate-cards-convert-csv/rate-cards-convert-csv.component.ts ***!
  \*************************************************************************************/
/*! exports provided: RateCardsConvertCsvComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RateCardsConvertCsvComponent", function() { return RateCardsConvertCsvComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var ngx_papaparse__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ngx-papaparse */ "./node_modules/ngx-papaparse/ngx-papaparse.es5.js");
/* harmony import */ var file_saver_FileSaver__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! file-saver/FileSaver */ "./node_modules/file-saver/FileSaver.js");
/* harmony import */ var file_saver_FileSaver__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(file_saver_FileSaver__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _shared_services_global_nestedAgGrid_shared_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./../../shared/services/global/nestedAgGrid.shared.service */ "./src/app/shared/services/global/nestedAgGrid.shared.service.ts");
/* harmony import */ var _shared_api_services_ratecard_rate_cards_api_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./../../shared/api-services/ratecard/rate-cards.api.service */ "./src/app/shared/api-services/ratecard/rate-cards.api.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var RateCardsConvertCsvComponent = /** @class */ (function () {
    function RateCardsConvertCsvComponent(rateCardsService, nestedAgGridService, papa) {
        this.rateCardsService = rateCardsService;
        this.nestedAgGridService = nestedAgGridService;
        this.papa = papa;
        this.rowSelectionTypeM = 'multiple';
        this.arrOfRates = [];
        this.disableStep2 = true;
        this.getNodeChildDetails = this.nestedAgGridService.returnSetGroups();
        this.columnDefs = this.createColumnDefs();
    }
    RateCardsConvertCsvComponent.prototype.ngOnInit = function () {
        this.get_ratecards();
    };
    // ================================================================================
    // Ratecard API Service
    // ================================================================================
    RateCardsConvertCsvComponent.prototype.get_ratecards = function () {
        var _this = this;
        this.rateCardsService.get_ratecard().subscribe(function (data) {
            _this.rowData = _this.nestedAgGridService.formatDataToNestedArr(data);
        }, function (error) { console.log(error); });
    };
    RateCardsConvertCsvComponent.prototype.get_specificRatecard = function (ratecard_id, fileName) {
        var _this = this;
        this.rateCardsService.get_ratesInRatecard(ratecard_id)
            .subscribe(function (data) {
            var csv = _this.papaUnparse(data);
            _this.saveToFileSystem(csv, fileName);
        });
    };
    RateCardsConvertCsvComponent.prototype.get_specificRatecardOneFile = function (ratecard_id, fileName) {
        var _this = this;
        this.rateCardsService.get_ratesInRatecard(ratecard_id)
            .subscribe(function (data) {
            _this.arrOfRates.push(data);
        });
    };
    // ================================================================================
    // AG Grid Initiation
    // ================================================================================
    RateCardsConvertCsvComponent.prototype.on_GridReady = function (params) {
        this.gridApi = params.api;
        params.api.sizeColumnsToFit();
    };
    RateCardsConvertCsvComponent.prototype.createColumnDefs = function () {
        return [
            {
                headerName: 'RateCard Group', field: 'ratecard_bundle',
                cellRenderer: 'agGroupCellRenderer', checkboxSelection: true,
                width: 300, cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Country', field: 'country', width: 180,
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Approve?', editable: true, field: 'confirmed', width: 100,
                valueFormatter: function (params) {
                    if (params.value === 1) {
                        return true;
                    }
                    if (params.value === 0) {
                        return false;
                    }
                },
                cellEditor: 'select', cellEditorParams: { values: [true, false] },
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Enabled?', field: 'active', filter: 'agNumberColumnFilter', hide: true, width: 100,
            }
        ];
    };
    // ================================================================================
    // AG Grid events
    // ================================================================================
    RateCardsConvertCsvComponent.prototype.gridSizeChanged = function (params) {
        params.api.sizeColumnsToFit();
    };
    RateCardsConvertCsvComponent.prototype.rowSelected = function (params) {
        this.currentSelectedRows = this.gridApi.getSelectedRows();
    };
    // ================================================================================
    // CSV conversion
    // ================================================================================
    RateCardsConvertCsvComponent.prototype.onConvertJsonToCsv = function () {
        for (var i = 0; i < this.currentSelectedRows.length; i++) {
            var eachRatecard = this.currentSelectedRows[i].id;
            var fileName = this.getSelectedFileNames(i);
            this.get_specificRatecard(eachRatecard, fileName);
        }
    };
    RateCardsConvertCsvComponent.prototype.getSelectedFileNames = function (id) {
        var ratecard_name = this.gridApi.getSelectedRows()[id].ratecard_bundle;
        var country = this.gridApi.getSelectedRows()[id].country;
        var carrier = this.gridApi.getSelectedRows()[id].carrier_name;
        var currentTime = Date.now();
        var fileName = (ratecard_name + "_" + country + "_" + carrier + "_" + currentTime).replace(/\s/g, '');
        return fileName;
    };
    RateCardsConvertCsvComponent.prototype.papaUnparse = function (json) {
        var config = {
            header: false,
        };
        var fields = ['prefix', 'destination', 'sell_rate', 'sell_rate_minimum', 'sell_rate_increment',
            'buy_rate', 'buy_rate_minimum', 'buy_rate_increment'];
        var csv = this.papa.unparse({ data: json, fields: fields }, config);
        return csv;
    };
    RateCardsConvertCsvComponent.prototype.saveToFileSystem = function (csv, filenameinput) {
        var filename = filenameinput;
        var blob = new Blob([csv], { type: 'text/plain' });
        Object(file_saver_FileSaver__WEBPACK_IMPORTED_MODULE_2__["saveAs"])(blob, filename);
    };
    // ================================================================================
    // CSV conversion
    // ================================================================================
    RateCardsConvertCsvComponent.prototype.onConvertJsonToCsvOneFile = function () {
        for (var i = 0; i < this.currentSelectedRows.length; i++) {
            var eachRatecard = this.currentSelectedRows[i].id;
            var fileName = this.getSelectedFileNames(0);
            this.get_specificRatecardOneFile(eachRatecard, fileName);
        }
        this.flipButtonDisable();
    };
    RateCardsConvertCsvComponent.prototype.flipButtonDisable = function () {
        this.disableStep2 = !this.disableStep2;
    };
    RateCardsConvertCsvComponent.prototype.getSelectedFileNamesAZ = function (id) {
        var ratecard_name = this.gridApi.getSelectedRows()[id].ratecard_bundle;
        var country = this.gridApi.getSelectedRows()[id].country;
        var carrier = this.gridApi.getSelectedRows()[id].carrier_name;
        var currentTime = Date.now();
        var fileName = (ratecard_name + "_AZ_" + carrier + "_" + currentTime).replace(/\s/g, '');
        return fileName;
    };
    RateCardsConvertCsvComponent.prototype.formOneFile = function () {
        var fileName = this.getSelectedFileNamesAZ(0);
        var merged = [].concat.apply([], this.arrOfRates);
        var mergedWithCents = [];
        for (var i = 0; i < merged.length; i++) {
            mergedWithCents.push({
                prefix: merged[i].prefix,
                destination: merged[i].destination,
                sell_rate: merged[i].sell_rate * 100,
                sell_rate_minimum: merged[i].sell_rate_minimum,
                sell_rate_increment: merged[i].sell_rate_increment,
                buy_rate: merged[i].buy_rate * 100,
                buy_rate_minimum: merged[i].buy_rate_minimum,
                buy_rate_increment: merged[i].buy_rate_increment
            });
        }
        var csv = this.papaUnparse(mergedWithCents);
        this.saveToFileSystem(csv, fileName);
        this.arrOfRates = [];
        this.disableStep2 = !this.disableStep2;
    };
    RateCardsConvertCsvComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-rate-cards-convert-csv',
            template: __webpack_require__(/*! ./rate-cards-convert-csv.component.html */ "./src/app/ratecard/rate-cards-convert-csv/rate-cards-convert-csv.component.html"),
            styles: [__webpack_require__(/*! ./rate-cards-convert-csv.component.scss */ "./src/app/ratecard/rate-cards-convert-csv/rate-cards-convert-csv.component.scss")]
        }),
        __metadata("design:paramtypes", [_shared_api_services_ratecard_rate_cards_api_service__WEBPACK_IMPORTED_MODULE_4__["RateCardsService"],
            _shared_services_global_nestedAgGrid_shared_service__WEBPACK_IMPORTED_MODULE_3__["NestedAgGridService"],
            ngx_papaparse__WEBPACK_IMPORTED_MODULE_1__["PapaParseService"]])
    ], RateCardsConvertCsvComponent);
    return RateCardsConvertCsvComponent;
}());



/***/ }),

/***/ "./src/app/ratecard/rate-cards-table/dialog/delete-rate-cards/delete-rate-cards-dialog.component.html":
/*!************************************************************************************************************!*\
  !*** ./src/app/ratecard/rate-cards-table/dialog/delete-rate-cards/delete-rate-cards-dialog.component.html ***!
  \************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<h2 mat-dialog-title>Are you sure?</h2>\n\n    <div mat-dialog-actions>\n        <button tabindex=\"-1\" mat-button (click)=\"click_delRateCard()\" >Yes</button>\n        <button tabindex=\"-1\" mat-button (click)=\"closeDialog()\">No</button>\n    </div>"

/***/ }),

/***/ "./src/app/ratecard/rate-cards-table/dialog/delete-rate-cards/delete-rate-cards-dialog.component.scss":
/*!************************************************************************************************************!*\
  !*** ./src/app/ratecard/rate-cards-table/dialog/delete-rate-cards/delete-rate-cards-dialog.component.scss ***!
  \************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "button {\n  border: 1px solid black; }\n"

/***/ }),

/***/ "./src/app/ratecard/rate-cards-table/dialog/delete-rate-cards/delete-rate-cards-dialog.component.ts":
/*!**********************************************************************************************************!*\
  !*** ./src/app/ratecard/rate-cards-table/dialog/delete-rate-cards/delete-rate-cards-dialog.component.ts ***!
  \**********************************************************************************************************/
/*! exports provided: DeleteRateCardsDialogComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DeleteRateCardsDialogComponent", function() { return DeleteRateCardsDialogComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm5/material.es5.js");
/* harmony import */ var _shared_api_services_ratecard_rate_cards_api_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./../../../../shared/api-services/ratecard/rate-cards.api.service */ "./src/app/shared/api-services/ratecard/rate-cards.api.service.ts");
/* harmony import */ var _shared_services_ratecard_rate_cards_shared_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./../../../../shared/services/ratecard/rate-cards.shared.service */ "./src/app/shared/services/ratecard/rate-cards.shared.service.ts");
/* harmony import */ var _shared_services_global_snackbar_shared_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./../../../../shared/services/global/snackbar.shared.service */ "./src/app/shared/services/global/snackbar.shared.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (undefined && undefined.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};





var DeleteRateCardsDialogComponent = /** @class */ (function () {
    function DeleteRateCardsDialogComponent(dialogRef, data, rateCardsService, rateCardsSharedService, _snackbar) {
        this.dialogRef = dialogRef;
        this.data = data;
        this.rateCardsService = rateCardsService;
        this.rateCardsSharedService = rateCardsSharedService;
        this._snackbar = _snackbar;
    }
    DeleteRateCardsDialogComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.rateCardsSharedService.currentRowAllObj.subscribe(function (data) { return _this.rowObj = data; });
    };
    DeleteRateCardsDialogComponent.prototype.del_disableRatecard = function () {
        var _this = this;
        var rowId = this.rowObj[0].id;
        this.rateCardsService.del_deleteRatecard(rowId)
            .subscribe(function (resp) {
            console.log(resp);
            if (resp.status === 200) {
                _this._snackbar.snackbar_success('Ratecard Disabled', 2000);
            }
        }, function (error) {
            console.log(error);
            _this._snackbar.snackbar_error('Ratecard Failed to Disable', 2000);
        });
    };
    DeleteRateCardsDialogComponent.prototype.click_delRateCard = function () {
        this.del_disableRatecard();
        this.closeDialog();
    };
    DeleteRateCardsDialogComponent.prototype.closeDialog = function () {
        this.dialogRef.close();
    };
    DeleteRateCardsDialogComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-del-rate-cards-dialog',
            template: __webpack_require__(/*! ./delete-rate-cards-dialog.component.html */ "./src/app/ratecard/rate-cards-table/dialog/delete-rate-cards/delete-rate-cards-dialog.component.html"),
            styles: [__webpack_require__(/*! ./delete-rate-cards-dialog.component.scss */ "./src/app/ratecard/rate-cards-table/dialog/delete-rate-cards/delete-rate-cards-dialog.component.scss")]
        }),
        __param(1, Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Inject"])(_angular_material__WEBPACK_IMPORTED_MODULE_1__["MAT_DIALOG_DATA"])),
        __metadata("design:paramtypes", [_angular_material__WEBPACK_IMPORTED_MODULE_1__["MatDialogRef"], Object, _shared_api_services_ratecard_rate_cards_api_service__WEBPACK_IMPORTED_MODULE_2__["RateCardsService"],
            _shared_services_ratecard_rate_cards_shared_service__WEBPACK_IMPORTED_MODULE_3__["RateCardsSharedService"],
            _shared_services_global_snackbar_shared_service__WEBPACK_IMPORTED_MODULE_4__["SnackbarSharedService"]])
    ], DeleteRateCardsDialogComponent);
    return DeleteRateCardsDialogComponent;
}());



/***/ }),

/***/ "./src/app/ratecard/rate-cards-table/dialog/delete-rates/delete-rates.component.html":
/*!*******************************************************************************************!*\
  !*** ./src/app/ratecard/rate-cards-table/dialog/delete-rates/delete-rates.component.html ***!
  \*******************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<h2 mat-dialog-title>Are you sure?</h2>\n\n    <div mat-dialog-actions>\n        <button mat-button tabindex=\"-1\" (click)=\"click_deleteRates()\" >Yes</button>\n        <button mat-button tabindex=\"-1\" (click)=\"closeDialog()\">No</button>\n    </div>"

/***/ }),

/***/ "./src/app/ratecard/rate-cards-table/dialog/delete-rates/delete-rates.component.scss":
/*!*******************************************************************************************!*\
  !*** ./src/app/ratecard/rate-cards-table/dialog/delete-rates/delete-rates.component.scss ***!
  \*******************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "button {\n  border: 1px solid black; }\n"

/***/ }),

/***/ "./src/app/ratecard/rate-cards-table/dialog/delete-rates/delete-rates.component.ts":
/*!*****************************************************************************************!*\
  !*** ./src/app/ratecard/rate-cards-table/dialog/delete-rates/delete-rates.component.ts ***!
  \*****************************************************************************************/
/*! exports provided: DeleteRatesComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DeleteRatesComponent", function() { return DeleteRatesComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm5/material.es5.js");
/* harmony import */ var _shared_api_services_ratecard_rate_cards_api_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./../../../../shared/api-services/ratecard/rate-cards.api.service */ "./src/app/shared/api-services/ratecard/rate-cards.api.service.ts");
/* harmony import */ var _shared_services_ratecard_rate_cards_shared_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./../../../../shared/services/ratecard/rate-cards.shared.service */ "./src/app/shared/services/ratecard/rate-cards.shared.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (undefined && undefined.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};




var DeleteRatesComponent = /** @class */ (function () {
    function DeleteRatesComponent(dialogRef, data, rateCardsService, rateCardsSharedService) {
        this.dialogRef = dialogRef;
        this.data = data;
        this.rateCardsService = rateCardsService;
        this.rateCardsSharedService = rateCardsSharedService;
        this.event_onDel = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"];
    }
    DeleteRatesComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.rateCardsSharedService.currentRowRatesObj
            .subscribe(function (data) { return _this.rowRatesObj = data; });
    };
    DeleteRatesComponent.prototype.click_deleteRates = function () {
        // this.del_delRates();
        this.aggrid_deleteRates();
        this.closeDialog();
    };
    // del_delRates() {
    //     let rowRatesId: number;
    //     for( let i = 0; i<this.rowRatesObj.length; i++ ) {
    //         rowRatesId = this.rowRatesObj[i].id;
    //         this.ratesService.del_Rates(rowRatesId)
    //             .subscribe(resp => console.log(resp))
    //     }
    // };
    DeleteRatesComponent.prototype.aggrid_deleteRates = function () {
        this.event_onDel.emit('delete-rates');
    };
    DeleteRatesComponent.prototype.closeDialog = function () {
        this.dialogRef.close();
    };
    DeleteRatesComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-delete-rates',
            template: __webpack_require__(/*! ./delete-rates.component.html */ "./src/app/ratecard/rate-cards-table/dialog/delete-rates/delete-rates.component.html"),
            styles: [__webpack_require__(/*! ./delete-rates.component.scss */ "./src/app/ratecard/rate-cards-table/dialog/delete-rates/delete-rates.component.scss")]
        }),
        __param(1, Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Inject"])(_angular_material__WEBPACK_IMPORTED_MODULE_1__["MAT_DIALOG_DATA"])),
        __metadata("design:paramtypes", [_angular_material__WEBPACK_IMPORTED_MODULE_1__["MatDialogRef"], Object, _shared_api_services_ratecard_rate_cards_api_service__WEBPACK_IMPORTED_MODULE_2__["RateCardsService"],
            _shared_services_ratecard_rate_cards_shared_service__WEBPACK_IMPORTED_MODULE_3__["RateCardsSharedService"]])
    ], DeleteRatesComponent);
    return DeleteRatesComponent;
}());



/***/ }),

/***/ "./src/app/ratecard/rate-cards-table/dialog/detach-trunks/detach-trunks.component.html":
/*!*********************************************************************************************!*\
  !*** ./src/app/ratecard/rate-cards-table/dialog/detach-trunks/detach-trunks.component.html ***!
  \*********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<h2 mat-dialog-title>Are you sure?</h2>\n\n    <div mat-dialog-actions>\n        <button mat-button tabindex=\"-1\" (click)=\"click_detachTrunks()\" >Yes</button>\n        <button mat-button tabindex=\"-1\" (click)=\"closeDialog()\">No</button>\n    </div>"

/***/ }),

/***/ "./src/app/ratecard/rate-cards-table/dialog/detach-trunks/detach-trunks.component.scss":
/*!*********************************************************************************************!*\
  !*** ./src/app/ratecard/rate-cards-table/dialog/detach-trunks/detach-trunks.component.scss ***!
  \*********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "button {\n  border: 1px solid black; }\n"

/***/ }),

/***/ "./src/app/ratecard/rate-cards-table/dialog/detach-trunks/detach-trunks.component.ts":
/*!*******************************************************************************************!*\
  !*** ./src/app/ratecard/rate-cards-table/dialog/detach-trunks/detach-trunks.component.ts ***!
  \*******************************************************************************************/
/*! exports provided: DetachTrunksComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DetachTrunksComponent", function() { return DetachTrunksComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm5/material.es5.js");
/* harmony import */ var _shared_api_services_ratecard_rate_cards_api_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./../../../../shared/api-services/ratecard/rate-cards.api.service */ "./src/app/shared/api-services/ratecard/rate-cards.api.service.ts");
/* harmony import */ var _shared_services_ratecard_rate_cards_shared_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./../../../../shared/services/ratecard/rate-cards.shared.service */ "./src/app/shared/services/ratecard/rate-cards.shared.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (undefined && undefined.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};




var DetachTrunksComponent = /** @class */ (function () {
    function DetachTrunksComponent(dialogRef, data, rateCardsService, rateCardsSharedService) {
        this.dialogRef = dialogRef;
        this.data = data;
        this.rateCardsService = rateCardsService;
        this.rateCardsSharedService = rateCardsSharedService;
        this.event_onDel = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"];
    }
    DetachTrunksComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.rateCardsSharedService.currentRowTrunksObj.subscribe(function (data) { return _this.rowRatesObj = data; });
        this.rateCardsSharedService.currentRowAllObj.subscribe(function (data) { return _this.ratecardId = data; });
    };
    DetachTrunksComponent.prototype.click_detachTrunks = function () {
        this.del_detachTrunks();
        this.aggrid_deleteTrunks();
        this.closeDialog();
    };
    ;
    DetachTrunksComponent.prototype.del_detachTrunks = function () {
        var trunksId;
        for (var i = 0; i < this.rowRatesObj.length; i++) {
            trunksId = this.rowRatesObj[i].id;
            this.rateCardsService.del_DetachTrunk(this.ratecardId[0].id, trunksId)
                .subscribe(function (resp) { return console.log(resp); });
        }
    };
    ;
    DetachTrunksComponent.prototype.aggrid_deleteTrunks = function () {
        this.event_onDel.emit('delete-trunks');
    };
    ;
    DetachTrunksComponent.prototype.closeDialog = function () {
        this.dialogRef.close();
    };
    ;
    DetachTrunksComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-detach-trunks',
            template: __webpack_require__(/*! ./detach-trunks.component.html */ "./src/app/ratecard/rate-cards-table/dialog/detach-trunks/detach-trunks.component.html"),
            styles: [__webpack_require__(/*! ./detach-trunks.component.scss */ "./src/app/ratecard/rate-cards-table/dialog/detach-trunks/detach-trunks.component.scss")]
        }),
        __param(1, Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Inject"])(_angular_material__WEBPACK_IMPORTED_MODULE_1__["MAT_DIALOG_DATA"])),
        __metadata("design:paramtypes", [_angular_material__WEBPACK_IMPORTED_MODULE_1__["MatDialogRef"], Object, _shared_api_services_ratecard_rate_cards_api_service__WEBPACK_IMPORTED_MODULE_2__["RateCardsService"],
            _shared_services_ratecard_rate_cards_shared_service__WEBPACK_IMPORTED_MODULE_3__["RateCardsSharedService"]])
    ], DetachTrunksComponent);
    return DetachTrunksComponent;
}());



/***/ }),

/***/ "./src/app/ratecard/rate-cards-table/rate-cards-table.component.html":
/*!***************************************************************************!*\
  !*** ./src/app/ratecard/rate-cards-table/rate-cards-table.component.html ***!
  \***************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<section id=\"grid-wrapper\">\n    <div class=\"all-ratecards-container\">\n        <div class=\"top-toolbar\">\n            <button (click)=\"expandAll(true)\"> <i class=\"fas fa-expand\"></i> </button>\n            <button (click)=\"expandAll(false)\"> <i class=\"fas fa-compress\"></i> </button>\n        </div>\n        <ag-grid-angular class=\"ag-theme-balham\" id=\"all-ratecards-table\"\n            [getNodeChildDetails]=\"getNodeChildDetails\"\n            [columnDefs]=\"columnDefs\" [rowData]=\"rowData\" [animateRows]=\"true\"\n            [rowSelection]=\"rowSelectionTypeS\" (selectionChanged)=\"aggrid_selectionChanged()\" (rowSelected)=\"rowSelected()\"\n            [stopEditingWhenGridLosesFocus]=\"true\" (cellValueChanged)=\"aggrid_onCellValueChanged($event)\" [singleClickEdit]=\"true\" [suppressRowClickSelection]=\"true\"\n            [floatingFilter]=\"true\" [enableSorting]=\"true\"\n            [enableColResize]=\"true\" (gridSizeChanged)=\"gridSizeChanged($event)\"\n            [pagination]=\"true\" [paginationAutoPageSize]=\"true\"\n            [suppressLoadingOverlay]=\"true\" [suppressNoRowsOverlay]=\"true\"\n            [headerHeight]=\"40\" [floatingFiltersHeight]=\"30\"\n\n            [enableCellChangeFlash]=\"true\"\n\n            (gridReady)=\"on_GridReady($event)\"\n        >\n        </ag-grid-angular>\n\n        <mat-toolbar-row>\n            <button (click)=\"openDialogDelRatecard()\" [disabled]=\"toggleButtonStates()\"> <i class=\"fas fa-trash-alt\"></i> </button>\n            \n            <mat-form-field class=\"search-bar\">\n                    <span matPrefix><i class=\"fas fa-search\"></i> &nbsp;</span>\n                    <input matInput placeholder=\"Global Search...\" (keyup)=\"onQuickFilterChanged()\" [(ngModel)]=\"quickSearchValue\">\n            </mat-form-field>\n        </mat-toolbar-row>\n    </div>\n\n    <div class=\"details-container\">\n        <mat-tab-group>\n           <mat-tab label=\"Rates\">\n                <ag-grid-angular class=\"ag-theme-balham\" id=\"rates-table\" [animateRows]=\"true\"\n                    [columnDefs]=\"columnDefsRates\" [rowData]=\"\" \n                    [enableColResize]=\"true\"\n                    [rowSelection]=\"rowSelectionTypeM\" (selectionChanged)=\"aggrid_rates_selectionChanged()\"  [suppressRowClickSelection]=\"true\"\n                    (cellValueChanged)=\"aggrid_onCellValueChanged_rates($event)\"\n                    [stopEditingWhenGridLosesFocus]=\"true\" [singleClickEdit]=\"true\"\n                    [enableFilter]=\"true\" [floatingFilter]=\"true\" [enableSorting]=\"true\"\n                    [enableColResize]=\"true\" (gridSizeChanged)=\"gridSizeChanged($event)\"\n                    [pagination]=\"true\" [paginationAutoPageSize]=\"true\"\n                    [headerHeight]=\"40\" [floatingFiltersHeight]=\"30\"\n                \n                    [enableCellChangeFlash]=\"true\"\n                \n                    (gridReady)=\"on_GridReady_Rates($event)\"\n                >\n                </ag-grid-angular>\n                <mat-toolbar-row>\n                    <button (click)=\"openDialogDelRates()\" class=\"del\"> <i class=\"fas fa-trash-alt\"></i> </button>\n                    <!-- <button (click)=\"openDialogUpload()\" class=\"upload-ratecards\"> <i class=\"fas fa-upload\"></i> Rate Card</button> -->\n                    \n                    <mat-form-field class=\"search-bar\">\n                            <span matPrefix><i class=\"fas fa-search\"></i> &nbsp;</span>\n                            <input matInput placeholder=\"Global Search...\" (keyup)=\"onQuickFilterChanged()\" [(ngModel)]=\"quickSearchValue\">\n                    </mat-form-field>\n                            \n                </mat-toolbar-row>\n            </mat-tab>\n            <mat-tab label=\"Trunks\">\n                <ag-grid-angular class=\"ag-theme-balham\" id=\"trunks-table\"\n                    [columnDefs]=\"columnDefsTrunks\" [rowData]=\"\" [animateRows]=\"true\"\n                    (selectionChanged)=\"aggrid_trunks_selectionChanged()\" (rowSelected)=\"rowSelected_trunks($event)\"\n                    [stopEditingWhenGridLosesFocus]=\"true\" (cellValueChanged)=\"aggrid_onCellValueChanged($event)\" [suppressRowClickSelection]=\"true\"\n                    [floatingFilter]=\"true\"\n                    [enableSorting]=\"true\"\n                    [enableColResize]=\"true\" (gridSizeChanged)=\"gridSizeChanged($event)\"\n                    [pagination]=\"true\" [paginationAutoPageSize]=\"true\"\n                    [suppressLoadingOverlay]=\"true\" [suppressNoRowsOverlay]=\"true\"\n                    [headerHeight]=\"40\" [floatingFiltersHeight]=\"30\"\n        \n                    [enableCellChangeFlash]=\"true\"\n        \n                    (gridReady)=\"on_GridReady_Trunks($event)\"\n                >\n                </ag-grid-angular>\n                <mat-toolbar-row>\n                    <button (click)=\"openDialogDetachTrunks()\" [disabled]=\"toggleButtonStates_trunks()\" class=\"del\"> <i class=\"fas fa-trash-alt\"></i> </button>\n                    <mat-form-field class=\"search-bar\">\n                            <span matPrefix><i class=\"fas fa-search\"></i> &nbsp;</span>\n                            <input matInput placeholder=\"Global Search...\" (keyup)=\"onQuickFilterChanged()\" [(ngModel)]=\"quickSearchValue\">\n                    </mat-form-field>\n                </mat-toolbar-row>\n            </mat-tab>\n        </mat-tab-group>\n    </div>\n</section>\n\n\n\n\n\n"

/***/ }),

/***/ "./src/app/ratecard/rate-cards-table/rate-cards-table.component.scss":
/*!***************************************************************************!*\
  !*** ./src/app/ratecard/rate-cards-table/rate-cards-table.component.scss ***!
  \***************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "/deep/ .mat-tab-body-content {\n  overflow: hidden !important; }\n\nsection {\n  margin-top: 5px;\n  margin-left: 5px;\n  margin-right: 5px;\n  overflow: hidden; }\n\nsection .all-ratecards-container {\n    width: 45%;\n    height: 100%;\n    border-right: 1px solid #E0E0E0;\n    float: left; }\n\nsection .all-ratecards-container #all-ratecards-table {\n      width: 99.7%;\n      height: 84vh;\n      border-top: 1px solid #E0E0E0; }\n\nsection .all-ratecards-container .top-toolbar {\n      height: 40px; }\n\nsection .all-ratecards-container .top-toolbar button {\n        width: 40px;\n        height: 40px;\n        background-color: Transparent;\n        border: none; }\n\nsection .all-ratecards-container .top-toolbar button:hover {\n        background-color: #E0E0E0; }\n\nsection .all-ratecards-container .top-toolbar button:focus {\n        outline: 0; }\n\nsection .all-ratecards-container mat-toolbar-row {\n      height: auto;\n      width: 99.7%;\n      float: left; }\n\nsection .all-ratecards-container mat-toolbar-row button {\n        background-color: Transparent;\n        width: auto;\n        height: 32px;\n        padding-left: 5px;\n        padding-right: 5px;\n        border: 1px solid #E0E0E0; }\n\nsection .all-ratecards-container mat-toolbar-row .rate-card {\n        width: 120px; }\n\nsection .all-ratecards-container mat-toolbar-row button:hover {\n        background-color: #E0E0E0; }\n\nsection .all-ratecards-container mat-toolbar-row button:focus {\n        outline: 0; }\n\nsection .all-ratecards-container mat-toolbar-row mat-form-field {\n        font-size: 14px; }\n\nsection .all-ratecards-container mat-toolbar-row .search-bar {\n        float: right;\n        width: 40%;\n        position: relative;\n        font-size: 11px; }\n\nsection .details-container {\n    width: 100%;\n    height: 100%; }\n\nsection .details-container mat-tab-group {\n      height: 100%; }\n\nsection .details-container /deep/ mat-tab-header {\n      height: 40px; }\n\nsection .details-container mat-toolbar-row {\n      width: 99.7%;\n      height: 34px;\n      float: left; }\n\nsection .details-container mat-toolbar-row button {\n        height: 32px;\n        margin-left: 10px;\n        border: 1px solid #E0E0E0; }\n\nsection .details-container mat-toolbar-row button:hover {\n        background-color: #E0E0E0; }\n\nsection .details-container mat-toolbar-row button:focus {\n        outline: 0; }\n\nsection .details-container mat-toolbar-row .search-bar {\n        float: right;\n        position: relative;\n        width: 40%;\n        font-size: 11px; }\n\nsection .details-container #rates-table {\n      width: 99.7%;\n      height: 84vh; }\n\nsection .details-container #trunks-table {\n      width: 99.7%;\n      height: 84vh; }\n"

/***/ }),

/***/ "./src/app/ratecard/rate-cards-table/rate-cards-table.component.ts":
/*!*************************************************************************!*\
  !*** ./src/app/ratecard/rate-cards-table/rate-cards-table.component.ts ***!
  \*************************************************************************/
/*! exports provided: RateCardsTableComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RateCardsTableComponent", function() { return RateCardsTableComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm5/material.es5.js");
/* harmony import */ var _dialog_delete_rates_delete_rates_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./dialog/delete-rates/delete-rates.component */ "./src/app/ratecard/rate-cards-table/dialog/delete-rates/delete-rates.component.ts");
/* harmony import */ var _dialog_delete_rate_cards_delete_rate_cards_dialog_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./dialog/delete-rate-cards/delete-rate-cards-dialog.component */ "./src/app/ratecard/rate-cards-table/dialog/delete-rate-cards/delete-rate-cards-dialog.component.ts");
/* harmony import */ var _dialog_detach_trunks_detach_trunks_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./dialog/detach-trunks/detach-trunks.component */ "./src/app/ratecard/rate-cards-table/dialog/detach-trunks/detach-trunks.component.ts");
/* harmony import */ var _shared_services_global_nestedAgGrid_shared_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./../../shared/services/global/nestedAgGrid.shared.service */ "./src/app/shared/services/global/nestedAgGrid.shared.service.ts");
/* harmony import */ var _shared_services_global_snackbar_shared_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./../../shared/services/global/snackbar.shared.service */ "./src/app/shared/services/global/snackbar.shared.service.ts");
/* harmony import */ var _shared_api_services_ratecard_rate_cards_api_service__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./../../shared/api-services/ratecard/rate-cards.api.service */ "./src/app/shared/api-services/ratecard/rate-cards.api.service.ts");
/* harmony import */ var _shared_services_ratecard_rate_cards_shared_service__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./../../shared/services/ratecard/rate-cards.shared.service */ "./src/app/shared/services/ratecard/rate-cards.shared.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};









var RateCardsTableComponent = /** @class */ (function () {
    function RateCardsTableComponent(rateCardsService, rateCardsSharedService, nestedAgGridService, dialog, _snackbar) {
        this.rateCardsService = rateCardsService;
        this.rateCardsSharedService = rateCardsSharedService;
        this.nestedAgGridService = nestedAgGridService;
        this.dialog = dialog;
        this._snackbar = _snackbar;
        // Props for AG Grid
        this.rowSelectionTypeM = 'multiple';
        this.rowSelectionTypeS = 'single';
        // Props for button toggle
        this.buttonToggleBoolean = true;
        this.buttonToggleBoolean_trunks = true;
        this.quickSearchValue = '';
        this.columnDefs = this.createColumnDefs();
        this.columnDefsRates = this.createColumnDefsRates();
        this.columnDefsTrunks = this.createColumnsDefsTrunks();
    }
    RateCardsTableComponent.prototype.ngOnInit = function () {
        this.getNodeChildDetails = this.nestedAgGridService.returnSetGroups();
        this.get_allRatecards();
    };
    /*
        ~~~~~~~~~~ Ratecard API services ~~~~~~~~~~
    */
    RateCardsTableComponent.prototype.get_allRatecards = function () {
        var _this = this;
        this.rateCardsService.get_ratecard()
            .subscribe(function (data) {
            _this.rowData = _this.nestedAgGridService.formatDataToNestedArr(data);
            console.log(data);
        }, function (error) { return console.log(error); });
    };
    RateCardsTableComponent.prototype.put_editRateCard = function (rateCardObj, id) {
        var _this = this;
        this.rateCardsService.put_editRatecard(rateCardObj, id)
            .subscribe(function (resp) {
            console.log(resp);
            if (resp.status === 200) {
                _this._snackbar.snackbar_success('Edit Successful', 2000);
            }
        }, function (error) {
            console.log(error);
            _this._snackbar.snackbar_error('Edit Failed', 2000);
        });
    };
    RateCardsTableComponent.prototype.put_editRates = function (id, rateCardObj) {
        var _this = this;
        this.rateCardsService.put_EditRates(id, rateCardObj)
            .subscribe(function (resp) {
            console.log(resp);
            if (resp.status === 200) {
                _this._snackbar.snackbar_success('Edit Successful', 2000);
            }
        }, function (error) {
            console.log(error);
            _this._snackbar.snackbar_error('Edit Failed', 2000);
        });
    };
    /*
        ~~~~~~~~~~ AG Grid Initiation ~~~~~~~~~~
    */
    RateCardsTableComponent.prototype.on_GridReady = function (params) {
        this.gridApi = params.api;
        params.api.sizeColumnsToFit();
    };
    RateCardsTableComponent.prototype.on_GridReady_Rates = function (params) {
        this.gridApiRates = params.api;
        params.api.sizeColumnsToFit();
    };
    RateCardsTableComponent.prototype.on_GridReady_Trunks = function (params) {
        this.gridApiTrunks = params.api;
        params.api.sizeColumnsToFit();
    };
    RateCardsTableComponent.prototype.createColumnDefs = function () {
        return [
            {
                headerName: 'RateCard Group', field: 'ratecard_bundle',
                cellRenderer: 'agGroupCellRenderer', checkboxSelection: true,
                width: 300, cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Country', field: 'country', width: 180,
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Approve?', editable: true, field: 'confirmed', width: 100,
                valueFormatter: function (params) {
                    if (params.value === 1) {
                        return true;
                    }
                    if (params.value === 0) {
                        return false;
                    }
                },
                cellEditor: 'select', cellEditorParams: { values: [true, false] },
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Enabled?', field: 'active', filter: 'agNumberColumnFilter', width: 100, editable: true,
                valueFormatter: function (params) {
                    if (params.value === 1) {
                        return true;
                    }
                    if (params.value === 0) {
                        return false;
                    }
                },
                cellEditor: 'select', cellEditorParams: { values: [true, false] },
            }
        ];
    };
    RateCardsTableComponent.prototype.createColumnDefsRates = function () {
        return [
            {
                headerName: 'Prefix', field: 'prefix',
                checkboxSelection: true, headerCheckboxSelection: true,
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Destination', field: 'destination', width: 300,
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Buy Rate', field: 'buy_rate', editable: true,
                filter: 'agNumberColumnFilter', width: 150,
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Sell Rate', field: 'sell_rate', editable: true,
                filter: 'agNumberColumnFilter', width: 150,
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Difference',
                valueGetter: function (params) {
                    var diff = (params.data.sell_rate - params.data.buy_rate);
                    var percent = ((diff) / params.data.buy_rate) * 100;
                    var diffFixed = diff.toFixed(4);
                    var percentFixed = percent.toFixed(2);
                    return diffFixed + "(" + percentFixed + "%)";
                }, cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Approved?', field: 'confirmed', editable: true, width: 100,
                cellEditor: 'select', cellEditorParams: { values: [true, false] },
                valueFormatter: function (params) {
                    if (params.value === 1) {
                        return true;
                    }
                    if (params.value === 0) {
                        return false;
                    }
                }, cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Enabled?', field: 'active', width: 100,
                valueFormatter: function (params) {
                    if (params.value === 1) {
                        return true;
                    }
                    if (params.value === 0) {
                        return false;
                    }
                }
            }
        ];
    };
    RateCardsTableComponent.prototype.createColumnsDefsTrunks = function () {
        return [
            {
                headerName: 'Trunk Id', field: 'cx_trunk_id',
                checkboxSelection: true, cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Carrier Name', field: 'carrier_name',
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Trunk IP', field: 'trunk_ip',
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Trunk Port', field: 'trunk_port',
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Meta Data', field: 'metadata',
            }
        ];
    };
    /*
        ~~~~~~~~~~ Grid UI Interactions ~~~~~~~~~~
    */
    RateCardsTableComponent.prototype.gridSizeChanged = function (params) {
        params.api.sizeColumnsToFit();
    };
    RateCardsTableComponent.prototype.onQuickFilterChanged = function () {
        this.gridApi.setQuickFilter(this.quickSearchValue);
    };
    RateCardsTableComponent.prototype.activeFilter = function () {
        var activeFilterComponent = this.gridApi.getFilterInstance('active');
        activeFilterComponent.setModel({
            type: 'greaterThan',
            filter: 0
        });
        this.gridApi.onFilterChanged();
    };
    RateCardsTableComponent.prototype.expandAll = function (expand) {
        this.gridApi.forEachNode(function (node) {
            if (node.group) {
                node.setExpanded(expand);
            }
        });
    };
    /*
        ~~~~~ Selection ~~~~~
    */
    RateCardsTableComponent.prototype.aggrid_selectionChanged = function () {
        var _this = this;
        this.gridApiRates.setRowData([]);
        this.gridApiTrunks.setRowData([]);
        this.rowRatecardObj = this.gridApi.getSelectedRows();
        this.selectedRatecardId = this.rowRatecardObj[0].id;
        this.rateCardsService.get_ratesInRatecard(this.selectedRatecardId)
            .subscribe(function (data) {
            _this.gridApiRates.updateRowData({ add: data });
        });
        this.rateCardsService.get_specificRatecard(this.selectedRatecardId)
            .subscribe(function (data) {
            _this.gridApiTrunks.updateRowData({ add: data.trunks });
        });
    };
    RateCardsTableComponent.prototype.aggrid_rates_selectionChanged = function () {
        this.rowSelectionRates = this.gridApiRates.getSelectedRows();
        console.log(this.rowSelectionRates);
    };
    RateCardsTableComponent.prototype.aggrid_trunks_selectionChanged = function () {
        this.rowSelectionTrunks = this.gridApiTrunks.getSelectedRows();
        console.log(this.rowSelectionTrunks);
    };
    /*
        ~~~~~~~~~~ Button Toggle ~~~~~~~~~~
    */
    RateCardsTableComponent.prototype.rowSelected = function () {
        this.gridSelectionStatus = this.gridApi.getSelectedNodes().length;
    };
    RateCardsTableComponent.prototype.toggleButtonStates = function () {
        if (this.gridSelectionStatus > 0) {
            this.buttonToggleBoolean = false;
        }
        else {
            this.buttonToggleBoolean = true;
        }
        return this.buttonToggleBoolean;
    };
    RateCardsTableComponent.prototype.rowSelected_trunks = function (params) {
        this.gridSelectionStatus_trunks = this.gridApiTrunks.getSelectedNodes().length;
    };
    RateCardsTableComponent.prototype.toggleButtonStates_trunks = function () {
        if (this.gridSelectionStatus_trunks > 0) {
            this.buttonToggleBoolean_trunks = false;
        }
        else {
            this.buttonToggleBoolean_trunks = true;
        }
        return this.buttonToggleBoolean_trunks;
    };
    /*
        ~~~~~ Addition ~~~~~
    */
    RateCardsTableComponent.prototype.aggrid_addRow = function (obj) {
        this.gridApi.updateRowData({ add: [obj] });
    };
    RateCardsTableComponent.prototype.aggrid_trunks_addRow = function (obj) {
        this.gridApiTrunks.updateRowData({ add: [obj] });
    };
    /*
        ~~~~~ Edit ~~~~~
    */
    RateCardsTableComponent.prototype.aggrid_onCellValueChanged = function (params) {
        var id = params.data.id;
        var rateCardObj = {
            name: params.data.name,
            carrier_id: params.data.carrier_id,
            confirmed: JSON.parse(params.data.confirmed)
        };
        this.put_editRateCard(rateCardObj, id);
    };
    RateCardsTableComponent.prototype.aggrid_onCellValueChanged_rates = function (params) {
        var id = params.data.id;
        var active;
        var confirmed;
        if (params.data.active === 1) {
            active = true;
        }
        if (params.data.active === 0) {
            active = false;
        }
        if (params.data.confirmed === 'true') {
            confirmed = true;
        }
        if (params.data.confirmed === 'false') {
            confirmed = false;
        }
        var ratesObj = {
            ratecard_id: this.selectedRatecardId,
            prefix: params.data.prefix,
            destination: params.data.destination,
            active: active,
            sell_rate: parseFloat(params.data.sell_rate),
            buy_rate: parseFloat(params.data.buy_rate),
            sell_rate_minimum: params.data.sell_rate_minimum,
            sell_rate_increment: params.data.sell_rate_increment,
            buy_rate_minimum: params.data.buy_rate_minimum,
            buy_rate_increment: params.data.buy_rate_increment,
            confirmed: confirmed
        };
        this.put_editRates(id, ratesObj);
    };
    /*
        ~~~~~~~~~~ Dialog ~~~~~~~~~~
    */
    RateCardsTableComponent.prototype.openDialogDelRatecard = function () {
        var _this = this;
        this.rateCardsSharedService.changeRowAllObj(this.rowRatecardObj);
        var dialogRef = this.dialog.open(_dialog_delete_rate_cards_delete_rate_cards_dialog_component__WEBPACK_IMPORTED_MODULE_3__["DeleteRateCardsDialogComponent"], {});
        dialogRef.afterClosed().subscribe(function () {
            _this.get_allRatecards();
        });
    };
    RateCardsTableComponent.prototype.openDialogDelRates = function () {
        this.rateCardsSharedService.changeRowRatesObj(this.rowSelectionRates);
        var dialogRef = this.dialog.open(_dialog_delete_rates_delete_rates_component__WEBPACK_IMPORTED_MODULE_2__["DeleteRatesComponent"], {});
        var sub = dialogRef.componentInstance.event_onDel.subscribe(function (data) {
        });
        dialogRef.afterClosed().subscribe(function () {
            sub.unsubscribe();
        });
    };
    /*
        ~~~~~ Trunks ~~~~~
    */
    RateCardsTableComponent.prototype.openDialogDetachTrunks = function () {
        this.rateCardsSharedService.changeRowAllObj(this.rowRatecardObj);
        this.rateCardsSharedService.changeRowTrunksObj(this.rowSelectionTrunks);
        var dialogRef = this.dialog.open(_dialog_detach_trunks_detach_trunks_component__WEBPACK_IMPORTED_MODULE_4__["DetachTrunksComponent"], {});
        var sub = dialogRef.componentInstance.event_onDel.subscribe(function (data) {
        });
        dialogRef.afterClosed().subscribe(function () {
            sub.unsubscribe();
        });
    };
    RateCardsTableComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-rate-cards-table',
            template: __webpack_require__(/*! ./rate-cards-table.component.html */ "./src/app/ratecard/rate-cards-table/rate-cards-table.component.html"),
            styles: [__webpack_require__(/*! ./rate-cards-table.component.scss */ "./src/app/ratecard/rate-cards-table/rate-cards-table.component.scss")]
        }),
        __metadata("design:paramtypes", [_shared_api_services_ratecard_rate_cards_api_service__WEBPACK_IMPORTED_MODULE_7__["RateCardsService"],
            _shared_services_ratecard_rate_cards_shared_service__WEBPACK_IMPORTED_MODULE_8__["RateCardsSharedService"],
            _shared_services_global_nestedAgGrid_shared_service__WEBPACK_IMPORTED_MODULE_5__["NestedAgGridService"],
            _angular_material__WEBPACK_IMPORTED_MODULE_1__["MatDialog"],
            _shared_services_global_snackbar_shared_service__WEBPACK_IMPORTED_MODULE_6__["SnackbarSharedService"]])
    ], RateCardsTableComponent);
    return RateCardsTableComponent;
}());



/***/ }),

/***/ "./src/app/ratecard/ratecard-importer/importer-table/dialog/upload-rates/upload-rates-dialog.component.html":
/*!******************************************************************************************************************!*\
  !*** ./src/app/ratecard/ratecard-importer/importer-table/dialog/upload-rates/upload-rates-dialog.component.html ***!
  \******************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<mat-horizontal-stepper> <!-- linear forces user to complete ea step -->\n    \n    <!-- Choose Carrier Step -->\n    <mat-step [stepControl]=\"carrierFormGroup\" [completed]=\"false\">\n        <form [formGroup]=\"carrierFormGroup\">\n            <ng-template matStepLabel>Choose Carrier</ng-template>\n            <mat-form-field>\n                <mat-select placeholder=\"Carriers\" formControlName=\"carrierCtrl\">\n                    <mat-option *ngFor=\"let option of carrierObj\" [value]=\"option.id\" >\n                        {{option.name}}\n                    </mat-option>\n                </mat-select>\n            </mat-form-field>\n            <div class='profiles'>\n                <b>Availiable Profiles</b> <br>\n                Profiles trigger on matching an exact Carrier Name string. <br><br>\n                PowerNet Global, VoxBeam, Alcazar, Bankai Group, PCCW Global, StarSSip, Teleinx, VoiPlatinum Portal, VOIP Routes\n            </div>\n            <div>\n                <button mat-button matStepperNext [disabled]=\"!carrierFormGroup.valid\"> Next </button>\n            </div>\n        </form>\n    </mat-step>\n    \n    <!-- Choose Rate Card Step -->\n    <mat-step [stepControl]=\"ratecardFormGroup\" [completed]=\"false\">\n        <form [formGroup]=\"ratecardFormGroup\">\n            <ng-template matStepLabel>Enter Rate Card Name</ng-template>\n                <mat-form-field>\n                    <input matInput placeholder=\"Enter Ratecard Name\" formControlName=\"ratecardCtrl\">\n                </mat-form-field>\n                <mat-form-field>\n                    <mat-select placeholder=\"Choose Ratecard Tier\" formControlName=\"ratecardTierCtrl\">\n                        <mat-option *ngFor=\"let tier of ratecardTier\" [value]=\"tier.value\" >\n                            {{tier.viewValue}}\n                        </mat-option>\n                    </mat-select>\n                </mat-form-field>\n            <div>\n                <button mat-button matStepperPrevious >Back</button>\n                <button mat-button matStepperNext [disabled]=\"!ratecardFormGroup.valid\"> Next </button>\n            </div>\n        </form>\n    </mat-step>\n    \n    <!-- Choose Sell Rate Mark up Step -->\n    <mat-step [stepControl]=\"percentFormGroup\" [completed]=\"false\">\n        <form [formGroup]=\"percentFormGroup\" class=\"rate-modifier-step\">\n            <ng-template matStepLabel>Choose Upload Parameters</ng-template>\n\n            <div class=\"rate-modifier-form-group\">\n                <div class=\"toggle-checkbox\">\n                    <mat-checkbox disableRipple formControlName=\"teleUCheckboxCtrl\">Add to Wholesale</mat-checkbox>\n                </div>\n                <mat-form-field class=\"percent-input\">\n                    <input matInput placeholder=\"Enter Markup\" formControlName=\"teleUPercentCtrl\" (change)=\"getMarkupTeleuAsPercent()\">\n                </mat-form-field>\n                <div class=\"percent-display\">\n                    {{ getMarkupTeleuAsPercent() }}%\n                </div>\n            </div>\n\n            <hr>\n\n            <div class=\"rate-modifier-form-group\">\n                <div class=\"toggle-checkbox\">\n                    <mat-checkbox disableRipple formControlName=\"privateCheckboxCtrl\" [disabled]=\"true\">As Private Offer</mat-checkbox> \n                </div>\n                <mat-form-field class=\"percent-input\">\n                    <input matInput placeholder=\"Enter Markup\" formControlName=\"privatePercentCtrl\" (change)=\"getMarkupPrivateAsPercent()\">\n                </mat-form-field>\n                <div class=\"percent-display\">\n                    {{ getMarkupPrivateAsPercent() }}%\n                </div>\n            </div>\n\n            <div>\n                <button mat-button matStepperPrevious >Back</button>\n                <button mat-button matStepperNext (click)=\"clickConstructJson()\"> Next</button>\n            </div>\n        </form>\n    </mat-step>\n    \n    <!-- Upload Rates Step -->\n    <mat-step [stepControl]=\"uploadRatesFormGroup\" [completed]=\"false\">\n        <form [formGroup]=\"uploadRatesFormGroup\">\n            <ng-template matStepLabel>Upload CSV</ng-template>\n            <button class=\"uploadBtn\" mat-button (click)=\"fileInput.click()\">\n                <span>Select CSV File</span>\n                <input #fileInput type=\"file\" (change)=\"changeListenerUploadBtn($event)\" accept=\".csv\" formControlName=\"uploadRatesCtrl\" style=\"display:none;\" />\n            </button>\n            <div>\n                <b>File Name:</b> {{fileName}} <br>\n                <b>Rates Inserted:</b> {{ratesPreviewObj.length}} <br>\n                <b>Preview First 3 rates:</b> <br>\n                <pre>{{ratesPreviewObj[0] | json }} {{ratesPreviewObj[1] | json }} {{ratesPreviewObj[2] | json }}</pre>\n            </div>\n            <div>\n                <button mat-button matStepperPrevious >Back</button>\n                <button mat-button matStepperNext [disabled]=\"uploadValidator()\"> Next </button>\n            </div>\n        </form>\n    </mat-step>\n    \n    <!-- Details & Finalize  -->\n    <mat-step [completed]=\"false\">\n        <ng-template matStepLabel>Review</ng-template>\n        <div class=\"details\">\n            <pre>{{finalRatecardPreviewObj | json}}</pre>\n        </div>\n        <div>\n            <button mat-button matStepperPrevious>Back</button>\n            <button mat-button matStepperNext (click)=\"post_addRates()\" >Next</button>\n        </div>\n    </mat-step>\n\n    <!-- Add Trunks -->\n    <mat-step [completed]=\"false\">\n        <ng-template matStepLabel>Attach Trunk to Ratecards, Submit</ng-template>\n        <ag-grid-angular id=\"trunks-table\" class=\"ag-theme-balham\" [animateRows]=\"true\"\n        [columnDefs]=\"columnDefs\" [rowData]=\"rowData\" [suppressRowClickSelection]=\"true\" (rowSelected)=\"rowSelected()\"\n        [enableFilter]=\"true\" [floatingFilter]=\"true\"\n        [enableSorting]=\"true\" [enableColResize]=\"true\"\n        [pagination]=\"true\" [paginationAutoPageSize]=\"true\"\n        [suppressNoRowsOverlay]=\"true\" [enableCellChangeFlash]=\"true\"\n        [headerHeight]=\"40\" [floatingFiltersHeight]=\"30\"\n\n        (gridReady)=\"on_GridReady($event)\"\n    >\n    </ag-grid-angular>\n    <div>\n        <button mat-button matStepperPrevious>Back</button>\n        <button mat-button (click)=\"click_addRates()\" [disabled]=\"toggleButtonStates()\">Submit</button>\n        Total Rates Processed: <b>{{totalRatesProcessed}}</b>\n    </div>\n    </mat-step>\n    \n</mat-horizontal-stepper>\n"

/***/ }),

/***/ "./src/app/ratecard/ratecard-importer/importer-table/dialog/upload-rates/upload-rates-dialog.component.scss":
/*!******************************************************************************************************************!*\
  !*** ./src/app/ratecard/ratecard-importer/importer-table/dialog/upload-rates/upload-rates-dialog.component.scss ***!
  \******************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "@media only screen and (max-width: 1800px) {\n  /deep/ .mat-step-label {\n    font-size: 11px; } }\n\n.uploadBtn {\n  border: 1px solid black;\n  width: 100%;\n  margin-bottom: 20px; }\n\nmat-form-field {\n  width: 100%; }\n\nbutton {\n  border: 1px solid black;\n  margin-right: 5px; }\n\n.rate-modifier-form-group {\n  display: flex; }\n\n.rate-modifier-form-group .toggle-checkbox {\n    flex: 1;\n    margin-top: 15px;\n    padding-right: 10px; }\n\n.rate-modifier-form-group .percent-input {\n    flex: 4; }\n\n.rate-modifier-form-group .percent-display {\n    flex: 1;\n    margin-top: 15px; }\n\nmat-checkbox {\n  -webkit-user-select: none;\n     -moz-user-select: none;\n      -ms-user-select: none;\n          user-select: none; }\n\npre {\n  height: 20vh;\n  overflow-y: scroll; }\n\n.profiles {\n  margin-bottom: 2%; }\n\n#trunks-table {\n  height: 50vh;\n  width: 100%; }\n"

/***/ }),

/***/ "./src/app/ratecard/ratecard-importer/importer-table/dialog/upload-rates/upload-rates-dialog.component.ts":
/*!****************************************************************************************************************!*\
  !*** ./src/app/ratecard/ratecard-importer/importer-table/dialog/upload-rates/upload-rates-dialog.component.ts ***!
  \****************************************************************************************************************/
/*! exports provided: UploadRatesDialogComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UploadRatesDialogComponent", function() { return UploadRatesDialogComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm5/material.es5.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var ngx_papaparse__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ngx-papaparse */ "./node_modules/ngx-papaparse/ngx-papaparse.es5.js");
/* harmony import */ var _shared_api_services_ratecard_importer_api_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./../../../../../shared/api-services/ratecard/importer.api.service */ "./src/app/shared/api-services/ratecard/importer.api.service.ts");
/* harmony import */ var _shared_services_ratecard_importer_shared_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./../../../../../shared/services/ratecard/importer.shared.service */ "./src/app/shared/services/ratecard/importer.shared.service.ts");
/* harmony import */ var _shared_api_services_trunk_trunks_api_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./../../../../../shared/api-services/trunk/trunks.api.service */ "./src/app/shared/api-services/trunk/trunks.api.service.ts");
/* harmony import */ var _shared_services_global_snackbar_shared_service__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./../../../../../shared/services/global/snackbar.shared.service */ "./src/app/shared/services/global/snackbar.shared.service.ts");
/* harmony import */ var _shared_services_global_buttonStates_shared_service__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./../../../../../shared/services/global/buttonStates.shared.service */ "./src/app/shared/services/global/buttonStates.shared.service.ts");
/* harmony import */ var _shared_api_services_carrier_carrier_profile_api_service__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./../../../../../shared/api-services/carrier/carrier-profile.api.service */ "./src/app/shared/api-services/carrier/carrier-profile.api.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (undefined && undefined.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};










var UploadRatesDialogComponent = /** @class */ (function () {
    function UploadRatesDialogComponent(dialogRef, data, _papa, _formBuilder, importerService, importerSharedService, trunksService, snackbarSharedService, toggleButtonStateService, _carrierSharedService) {
        this.dialogRef = dialogRef;
        this.data = data;
        this._papa = _papa;
        this._formBuilder = _formBuilder;
        this.importerService = importerService;
        this.importerSharedService = importerSharedService;
        this.trunksService = trunksService;
        this.snackbarSharedService = snackbarSharedService;
        this.toggleButtonStateService = toggleButtonStateService;
        this._carrierSharedService = _carrierSharedService;
        // event
        this.event_passTrunkId = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"];
        // DB Objects
        this.carrierObj = [];
        this.currentRateCardNames = []; // rate cards obj populated by method  currentRateCardList()
        this.ratecardTier = [
            { value: 'standard', viewValue: 'Silver' },
            { value: 'standard', viewValue: 'Standard' },
            { value: 'premium', viewValue: 'Gold' },
            { value: 'premium', viewValue: 'Premium' },
            { value: 'premium', viewValue: 'Platinum' },
        ];
        this.teleuPercent = 0;
        this.disableUploadBoolean = true;
        this.finalRatecardPreviewObj = [];
        this.ratesPreviewObj = [];
        this.totalRatesProcessed = 0;
    }
    UploadRatesDialogComponent.prototype.ngOnInit = function () {
        this.get_carrier();
        this.get_trunks();
        this.columnDefs = this.createColumnDefs();
        this.carrierFormGroup = this._formBuilder.group({
            carrierCtrl: ['', _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required]
        });
        this.ratecardFormGroup = this._formBuilder.group({
            ratecardCtrl: ['', _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required],
            ratecardTierCtrl: ['', _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required]
        });
        this.percentFormGroup = this._formBuilder.group({
            teleUCheckboxCtrl: [false],
            teleUPercentCtrl: [1, _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].pattern('^[0-9]')],
            privateCheckboxCtrl: [true],
            privatePercentCtrl: [1.02, _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].pattern('^[0-9]')]
        });
        this.uploadRatesFormGroup = this._formBuilder.group({
            uploadRatesCtrl: ['']
        });
        this.percentFormGroup.controls.teleUCheckboxCtrl.setValue(false);
        this.percentFormGroup.controls.privateCheckboxCtrl.setValue(true);
    };
    // ================================================================================
    // * API Services
    // ================================================================================
    UploadRatesDialogComponent.prototype.get_carrier = function () {
        var _this = this;
        this.importerService.get_CarrierNames()
            .subscribe(function (data) { _this.carrierObj = data; }, function (error) { console.log(error); });
    };
    UploadRatesDialogComponent.prototype.get_trunks = function () {
        var _this = this;
        this.trunksService.get_allTrunks()
            .subscribe(function (data) { _this.rowData = data; }, function (error) { console.log(error); });
    };
    UploadRatesDialogComponent.prototype.post_addRates = function () {
        var _this = this;
        this.importerService.post_AddRateCard(this.finalRatecardObj)
            .subscribe(function (resp) {
            for (var i = 0; i < resp.length; i++) {
                _this.totalRatesProcessed += resp[i].rates.length;
            }
            if (resp.status === 200) {
                _this.snackbarSharedService.snackbar_success('Ratecards successful imported.', 2000);
            }
        }, function (error) {
            console.log(error);
            _this.snackbarSharedService.snackbar_error('Ratecards failed to import.', 2000);
        });
    };
    // ================================================================================
    // * AG Grid Init
    // ================================================================================
    UploadRatesDialogComponent.prototype.on_GridReady = function (params) {
        this.gridApi = params.api;
        params.api.sizeColumnsToFit();
    };
    UploadRatesDialogComponent.prototype.createColumnDefs = function () {
        return [
            {
                headerName: 'Trunk Name', field: 'trunk_name',
                checkboxSelection: true, width: 350,
                cellStyle: { 'border-right': '2px solid #E0E0E0' },
            },
            {
                headerName: 'Carrier', field: 'carrier_name',
                cellStyle: { 'border-right': '2px solid #E0E0E0' },
            },
            {
                headerName: 'Trunk IP', field: 'trunk_ip',
                cellStyle: { 'border-right': '2px solid #E0E0E0' },
            },
            {
                headerName: 'Trunk Port', field: 'trunk_port',
            }
        ];
    };
    // ================================================================================
    // * Extract Data
    // ================================================================================
    UploadRatesDialogComponent.prototype.extract_CarrierName = function () {
        for (var i = 0; i < this.carrierObj.length; i++) {
            if (this.carrierObj[i].id === this.input_getCarrierId()) {
                return this.carrierObj[i].name;
            }
        }
    };
    /*
        ~~~~~~~~~~ Get data from input ~~~~~~~~~~
    */
    UploadRatesDialogComponent.prototype.input_getCarrierId = function () {
        return this.carrierFormGroup.get('carrierCtrl').value;
    };
    UploadRatesDialogComponent.prototype.input_getRateCardName = function () {
        return this.ratecardFormGroup.get('ratecardCtrl').value;
    };
    UploadRatesDialogComponent.prototype.input_getMarkupPrivate = function () {
        return this.percentFormGroup.get('privatePercentCtrl').value;
    };
    UploadRatesDialogComponent.prototype.input_getMarkupTeleu = function () {
        return this.percentFormGroup.get('teleUPercentCtrl').value;
    };
    UploadRatesDialogComponent.prototype.getMarkupTeleuAsPercent = function () {
        if (this.input_getMarkupTeleu() > 0) {
            var value = ((this.input_getMarkupTeleu() * 100) - 100).toFixed(4);
            return value;
        }
        else {
            return 0;
        }
    };
    UploadRatesDialogComponent.prototype.getMarkupPrivateAsPercent = function () {
        if (this.input_getMarkupTeleu() > 0) {
            var value = ((this.input_getMarkupPrivate() * 100) - 100).toFixed(4);
            return value;
        }
        else {
            return 0;
        }
    };
    /*
        ~~~~~~~~~~ UI Interactions ~~~~~~~~~~
    */
    // For button Toggle
    UploadRatesDialogComponent.prototype.rowSelected = function () {
        this.gridSelectionStatus = this.gridApi.getSelectedNodes().length;
    };
    UploadRatesDialogComponent.prototype.toggleButtonStates = function () {
        return this.toggleButtonStateService.toggleButtonStates(this.gridSelectionStatus);
    };
    UploadRatesDialogComponent.prototype.checkBoxValueTeleU = function () {
        return !this.percentFormGroup.get('teleUCheckboxCtrl').value;
    };
    UploadRatesDialogComponent.prototype.checkBoxValuePrivate = function () {
        return !this.percentFormGroup.get('privateCheckboxCtrl').value;
    };
    UploadRatesDialogComponent.prototype.changeListenerUploadBtn = function (event) {
        if (event.target.files && event.target.files[0]) {
            var csvFile = event.target.files[0];
            this.fileName = csvFile.name;
            this.papaParse(csvFile);
            this.disableUploadBoolean = false; // pass boolean flag for valdation
        }
        else {
            this.disableUploadBoolean = true;
        }
    };
    UploadRatesDialogComponent.prototype.uploadValidator = function () {
        if (this.disableUploadBoolean === true) {
            return true;
        }
        if (this.disableUploadBoolean === false) {
            return false;
        }
    };
    /*
        ~~~~~~~~~~ AG Grid Methods ~~~~~~~~~~
    */
    UploadRatesDialogComponent.prototype.aggrid_addRatecard = function () {
        var _this = this;
        this.importerSharedService.currentPostTableObj.subscribe(function (data) { _this.postTableArr = data; });
        this.event_passTrunkId.emit(this.gridApi.getSelectedRows[0]);
    };
    // ================================================================================
    // Construct JSON
    // ================================================================================
    UploadRatesDialogComponent.prototype.clickConstructJson = function () {
        this.pushFinalRatecard();
        this.pushFinalRatecardPreview();
    };
    UploadRatesDialogComponent.prototype.pushFinalRatecard = function () {
        // * push final ratecard obj to a global var, so the api can subscribe on
        this.finalRatecardObj = {
            name: this.ratecardFormGroup.get('ratecardCtrl').value + ' - ' + this.ratecardFormGroup.get('ratecardTierCtrl').value,
            carrier_id: this.input_getCarrierId(),
            addToTeleU: this.percentFormGroup.get('teleUCheckboxCtrl').value,
            teleUMarkup: this.percentFormGroup.get('teleUPercentCtrl').value,
            asAPrivate: this.percentFormGroup.get('privateCheckboxCtrl').value,
            privateMarkup: this.percentFormGroup.get('privatePercentCtrl').value,
            tier: this.ratecardFormGroup.get('ratecardTierCtrl').value,
            rates: []
        };
    };
    UploadRatesDialogComponent.prototype.pushFinalRatecardPreview = function () {
        // * remove the last entry in the object
        this.finalRatecardPreviewObj.push({
            name: this.ratecardFormGroup.get('ratecardCtrl').value + ' - ' + this.ratecardFormGroup.get('ratecardTierCtrl').value,
            carrier_id: this.input_getCarrierId(),
            addToTeleU: this.percentFormGroup.get('teleUCheckboxCtrl').value,
            teleUMarkup: this.percentFormGroup.get('teleUPercentCtrl').value,
            asAPrivate: this.percentFormGroup.get('privateCheckboxCtrl').value,
            privateMarkup: this.percentFormGroup.get('privatePercentCtrl').value,
            tier: this.ratecardFormGroup.get('ratecardTierCtrl').value,
        });
    };
    // ================================================================================
    // Dialog
    // ================================================================================
    UploadRatesDialogComponent.prototype.closeDialog = function () {
        this.dialogRef.close();
    };
    UploadRatesDialogComponent.prototype.passTrunkId = function () {
        this.event_passTrunkId.emit(this.gridApi.getSelectedRows()[0].id);
    };
    UploadRatesDialogComponent.prototype.click_addRates = function () {
        this.passTrunkId();
        this.closeDialog();
    };
    /*
        ~~~~~~~~~~ CSV Parser ~~~~~~~~~~
    */
    UploadRatesDialogComponent.prototype.papaParse = function (csvFile) {
        var _this = this;
        this._papa.parse(csvFile, {
            complete: function (results) {
                console.log('Parsed: ', results);
                var data = results.data;
                _this.profileSorter(data);
            }
        });
    };
    UploadRatesDialogComponent.prototype.profileSorter = function (data) {
        var currentCarrierName = this.extract_CarrierName();
        if (currentCarrierName.toLowerCase() === 'powernet global') {
            console.log('using Power Net Global Profile');
            this.powerNetGlobalProfile(data);
        }
        if (currentCarrierName.toLowerCase() === 'voxbeam') {
            console.log('using VoxBeam Profile');
            this.voxBeamProfile(data);
        }
        if (currentCarrierName.toLowerCase() === 'alcazar') {
            console.log('using Alcazar Networks Inc Profile');
            this.alcazarNetworksProfile(data);
        }
        if (currentCarrierName.toLowerCase() === 'bankai group') {
            this.bankaiGroupProfile(data);
        }
        if (currentCarrierName.toLowerCase() === 'pccw global') {
            console.log('using PCCW Global Profile');
            this.pccwGlobalProfile(data);
        }
        if (currentCarrierName.toLowerCase() === 'starssip') {
            console.log('using Starsipp Profile');
            this.starsippProfile(data);
        }
        if (currentCarrierName.toLowerCase() === 'teleinx') {
            console.log('using Teleinx Profile');
            this.teleinxProfile(data);
        }
        if (currentCarrierName.toLowerCase() === 'voiplatinum portal') {
            console.log('using VoiPlatinum Profile');
            this.voiPlatinumProfile(data);
        }
        if (currentCarrierName.toLowerCase() === 'voip routes') {
            console.log('using VOIP Routes Profile');
            this.voipRoutesProfile(data);
        }
        if (currentCarrierName.toLowerCase() === 'megatel') {
            console.log('uing Megatel Profile');
            this.megatelProfile(data);
        }
        if (currentCarrierName.toLowerCase() === 'telia carrier') {
            console.log('using Telia Carrier Profile');
            this.teliaCarrierProfile(data);
        }
        if (currentCarrierName.toLowerCase() === 'all world communications') {
            console.log('using All World Communications Profile');
            this.allWorldCommunications(data);
        }
        if (currentCarrierName.toLowerCase() === 'kftel') {
            console.log('using KFTel Profile');
            this.kftelProfile(data);
        }
        if (currentCarrierName.toLowerCase() === 'pst') {
            console.log('using PST profile');
            this.pstProfile(data);
        }
        if (currentCarrierName.toLowerCase() === 'default') {
            console.log('using Default Profile');
            this.defaultProfile(data);
        }
        if (currentCarrierName.toLowerCase() === 'macarena') {
            console.log('using Macerena Profile');
            this.macarenaProfile(data);
        }
        this.importerSharedService.changeRatesCSVAmount(this.ratesPreviewObj.length);
    };
    UploadRatesDialogComponent.prototype.generateRateObj = function (destination, prefix, buyrate, sellrate) {
        var destinationRemoveBadChar = destination.replace(/\\|'|\\'/, '');
        if (destinationRemoveBadChar.length > 64) {
            destinationRemoveBadChar = destinationRemoveBadChar.substring(0, 64);
        }
        this.finalRatecardObj.rates.push({ destination: destinationRemoveBadChar,
            prefix: prefix,
            buy_rate: buyrate,
            buy_rate_minimum: 1,
            buy_rate_increment: 1,
            sell_rate: sellrate,
            sell_rate_minimum: 60,
            sell_rate_increment: 60
        });
        this.ratesPreviewObj.push({ destination: destinationRemoveBadChar,
            prefix: prefix,
            buy_rate: buyrate,
            buy_rate_minimum: 1,
            buy_rate_increment: 1,
            sell_rate: sellrate,
            sell_rate_minimum: 60,
            sell_rate_increment: 60
        });
    };
    UploadRatesDialogComponent.prototype.defaultProfile = function (data) {
        var dataSliced = data.slice(1);
        for (var i = 0; i < dataSliced.length; i++) {
            var destination = dataSliced[i][0];
            var prefix = dataSliced[i][1];
            var buyrate = dataSliced[i][2] * 1;
            var sellrate = buyrate;
            this.generateRateObj(destination, prefix, buyrate, sellrate);
        }
    };
    UploadRatesDialogComponent.prototype.powerNetGlobalProfile = function (data) {
        var dataSliced = data.slice(3);
        for (var i = 0; i < dataSliced.length; i++) {
            var destination = dataSliced[i][0];
            var prefix = dataSliced[i][1];
            var buyrate = dataSliced[i][2].slice(1) * 1;
            var sellrate = buyrate;
            this.generateRateObj(destination, prefix, buyrate, sellrate);
        }
    };
    UploadRatesDialogComponent.prototype.voxBeamProfile = function (data) {
        var dataSliced = data.slice(1);
        for (var i = 0; i < dataSliced.length; i++) {
            var destination = dataSliced[i][2];
            var prefix = dataSliced[i][0];
            var buyrate = dataSliced[i][3] * 1;
            var sellrate = buyrate;
            this.generateRateObj(destination, prefix, buyrate, sellrate);
        }
    };
    UploadRatesDialogComponent.prototype.alcazarNetworksProfile = function (data) {
        var dataSliced = data.slice(7);
        for (var i = 0; i < dataSliced.length; i++) {
            var destination = dataSliced[i][0];
            var prefix = dataSliced[i][1];
            if (destination.charAt(0) === '"' || destination.charAt(0) === "'") {
                destination = destination.slice(1, -1);
            }
            if (prefix.charAt(0) === '"' || prefix.charAt(0) === "'") {
                prefix = prefix.slice(1, -1);
            }
            var buyrate = dataSliced[i][2] * 1;
            var sellrate = buyrate;
            this.generateRateObj(destination, prefix, buyrate, sellrate);
        }
    };
    UploadRatesDialogComponent.prototype.bankaiGroupProfile = function (data) {
        var dataSliced = data.slice(1);
        for (var i = 0; i < dataSliced.length; i++) {
            var destination = dataSliced[i][0];
            var prefix = dataSliced[i][1];
            if (destination.charAt(0) === '"' || destination.charAt(0) === "'") {
                destination = destination.slice(1, -1);
            }
            if (prefix.charAt(0) === '"' || prefix.charAt(0) === '\'') {
                prefix = prefix.slice(1, -1);
            }
            var buyrate = dataSliced[i][3] * 1;
            var sellrate = buyrate;
            this.generateRateObj(destination, prefix, buyrate, sellrate);
        }
    };
    UploadRatesDialogComponent.prototype.pccwGlobalProfile = function (data) {
        var dataSliced = data.slice(13);
        for (var i = 0; i < dataSliced.length; i++) {
            var destination = dataSliced[i][0];
            var prefix = dataSliced[i][1];
            if (destination.charAt(0) === '"' || destination.charAt(0) === '\'') {
                destination = destination.slice(1, -1);
            }
            if (prefix.charAt(0) === '"' || prefix.charAt(0) === '\'') {
                prefix = prefix.slice(1, -1);
            }
            var buyrate = dataSliced[i][4] * 1;
            var sellrate = buyrate;
            this.generateRateObj(destination, prefix, buyrate, sellrate);
        }
    };
    UploadRatesDialogComponent.prototype.starsippProfile = function (data) {
        var dataSliced = data.slice(1);
        for (var i = 0; i < dataSliced.length; i++) {
            var destination = dataSliced[i][1];
            var prefix = dataSliced[i][2];
            if (destination.charAt(0) === '"' || destination.charAt(0) === '\'') {
                destination = destination.slice(1, -1);
            }
            if (prefix.charAt(0) === '"' || prefix.charAt(0) === '\'') {
                prefix = prefix.slice(1, -1);
            }
            var buyrate = dataSliced[i][3] * 1;
            var sellrate = buyrate;
            this.generateRateObj(destination, prefix, buyrate, sellrate);
        }
    };
    UploadRatesDialogComponent.prototype.teleinxProfile = function (data) {
        var dataSliced = data.slice(1);
        for (var i = 0; i < dataSliced.length; i++) {
            var destination = dataSliced[i][1];
            var prefix = dataSliced[i][2];
            if (destination.charAt(0) === '"' || destination.charAt(0) === '\'') {
                destination = destination.slice(1, -1);
            }
            if (prefix.charAt(0) === '"' || prefix.charAt(0) === '\'') {
                prefix = prefix.slice(1, -1);
            }
            var buyrate = dataSliced[i][3] * 1;
            var sellrate = buyrate;
            this.generateRateObj(destination, prefix, buyrate, sellrate);
        }
    };
    UploadRatesDialogComponent.prototype.voiPlatinumProfile = function (data) {
        var dataSliced = data.slice(1, -1);
        for (var i = 0; i < dataSliced.length; i++) {
            var destination = dataSliced[i][0];
            var prefix = dataSliced[i][1];
            if (destination.charAt(0) === '"' || destination.charAt(0) === '\'') {
                destination = destination.slice(1, -1);
            }
            if (prefix.charAt(0) === '"' || prefix.charAt(0) === '\'') {
                prefix = prefix.slice(1, -1);
            }
            var buyrate = dataSliced[i][2] * 1;
            var sellrate = buyrate;
            this.generateRateObj(destination, prefix, buyrate, sellrate);
        }
    };
    UploadRatesDialogComponent.prototype.voipRoutesProfile = function (data) {
        var dataSliced = data.slice(9);
        for (var i = 0; i < dataSliced.length; i++) {
            var destination = dataSliced[i][1];
            var prefix = dataSliced[i][0];
            if (destination.charAt(0) === '"' || destination.charAt(0) === '\'') {
                destination = destination.slice(1, -1);
            }
            if (prefix.charAt(0) === '"' || prefix.charAt(0) === '\'') {
                prefix = prefix.slice(1, -1);
            }
            var buyrate = dataSliced[i][2] * 1;
            var sellrate = buyrate;
            this.generateRateObj(destination, prefix, buyrate, sellrate);
        }
    };
    UploadRatesDialogComponent.prototype.megatelProfile = function (data) {
        var dataSliced = data.slice(2);
        for (var i = 0; i < dataSliced.length; i++) {
            var destination = dataSliced[i][0];
            var prefix = dataSliced[i][2];
            var buyrate = dataSliced[i][4] * 1;
            var sellrate = buyrate;
            this.generateRateObj(destination, prefix, buyrate, sellrate);
        }
    };
    UploadRatesDialogComponent.prototype.teliaCarrierProfile = function (data) {
        var dataSliced = data.slice(18);
        for (var i = 0; i < dataSliced.length; i++) {
            var destination = dataSliced[i][1];
            var prefix = dataSliced[i][2];
            var buyrate = dataSliced[i][3] * 1;
            var sellrate = buyrate;
            this.generateRateObj(destination, prefix, buyrate, sellrate);
        }
    };
    UploadRatesDialogComponent.prototype.allWorldCommunications = function (data) {
        var dataSliced = data.slice(8, -1);
        for (var i = 0; i < dataSliced.length; i++) {
            var destination = dataSliced[i][2];
            var prefix = dataSliced[i][1];
            var buyrate = dataSliced[i][3] * 1;
            var sellrate = buyrate;
            this.generateRateObj(destination, prefix, buyrate, sellrate);
        }
    };
    UploadRatesDialogComponent.prototype.kftelProfile = function (data) {
        var dataSliced = data.slice(1, -9);
        for (var i = 0; i < dataSliced.length; i++) {
            var destination = dataSliced[i][0];
            var prefix = dataSliced[i][1];
            var buyrate = dataSliced[i][2] * 1;
            var sellrate = buyrate;
            this.generateRateObj(destination, prefix, buyrate, sellrate);
        }
    };
    UploadRatesDialogComponent.prototype.pstProfile = function (data) {
        var dataSliced = data.slice(5, -4);
        for (var i = 0; i < dataSliced.length; i++) {
            var destination = dataSliced[i][1];
            var prefix = dataSliced[i][0];
            var buyrate = dataSliced[i][2] * 1;
            var sellrate = buyrate;
            this.generateRateObj(destination, prefix, buyrate, sellrate);
        }
    };
    UploadRatesDialogComponent.prototype.macarenaProfile = function (data) {
        var dataSliced = data.slice(8);
        for (var i = 0; i < dataSliced.length; i++) {
            var destination = dataSliced[i][1];
            var prefix = dataSliced[i][0];
            var buyrate = dataSliced[i][2] * 1;
            var sellrate = buyrate;
            this.generateRateObj(destination, prefix, buyrate, sellrate);
        }
    };
    UploadRatesDialogComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-upload-rates',
            template: __webpack_require__(/*! ./upload-rates-dialog.component.html */ "./src/app/ratecard/ratecard-importer/importer-table/dialog/upload-rates/upload-rates-dialog.component.html"),
            styles: [__webpack_require__(/*! ./upload-rates-dialog.component.scss */ "./src/app/ratecard/ratecard-importer/importer-table/dialog/upload-rates/upload-rates-dialog.component.scss")]
        }),
        __param(1, Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Inject"])(_angular_material__WEBPACK_IMPORTED_MODULE_1__["MAT_DIALOG_DATA"])),
        __metadata("design:paramtypes", [_angular_material__WEBPACK_IMPORTED_MODULE_1__["MatDialogRef"], Object, ngx_papaparse__WEBPACK_IMPORTED_MODULE_3__["PapaParseService"],
            _angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormBuilder"],
            _shared_api_services_ratecard_importer_api_service__WEBPACK_IMPORTED_MODULE_4__["ImporterService"],
            _shared_services_ratecard_importer_shared_service__WEBPACK_IMPORTED_MODULE_5__["ImporterSharedService"],
            _shared_api_services_trunk_trunks_api_service__WEBPACK_IMPORTED_MODULE_6__["TrunksService"],
            _shared_services_global_snackbar_shared_service__WEBPACK_IMPORTED_MODULE_7__["SnackbarSharedService"],
            _shared_services_global_buttonStates_shared_service__WEBPACK_IMPORTED_MODULE_8__["ToggleButtonStateService"],
            _shared_api_services_carrier_carrier_profile_api_service__WEBPACK_IMPORTED_MODULE_9__["CarrierProfileService"]])
    ], UploadRatesDialogComponent);
    return UploadRatesDialogComponent;
}());



/***/ }),

/***/ "./src/app/ratecard/ratecard-importer/importer-table/importer-table.component.html":
/*!*****************************************************************************************!*\
  !*** ./src/app/ratecard/ratecard-importer/importer-table/importer-table.component.html ***!
  \*****************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<section id=\"grid-wrapper\">\n    <div class=\"table-container\">\n        <div class=\"top-toolbar\">\n            <button (click)=\"expandAll(true)\"> <i class=\"fas fa-expand\"></i> </button>\n            <button (click)=\"expandAll(false)\"> <i class=\"fas fa-compress\"></i> </button>\n        </div>\n        \n        <ag-grid-angular class=\"ag-theme-balham\" \n        [columnDefs]=\"columnDefs\" [rowData]=\"rowData\" [animateRows]=\"true\"\n        [stopEditingWhenGridLosesFocus]=\"true\" [singleClickEdit]=\"true\" (cellValueChanged)=\"onCellValueChanged($event)\"\n        [floatingFilter]=\"true\" [enableSorting]=\"true\"\n        [enableColResize]=\"true\" (gridSizeChanged)=\"gridSizeChanged($event)\"\n        [pagination]=\"true\" [paginationAutoPageSize]=\"true\"\n        [getNodeChildDetails]=\"getNodeChildDetails\"\n        [suppressLoadingOverlay]=\"true\" [suppressNoRowsOverlay]=\"true\"\n        [headerHeight]=\"40\" [floatingFiltersHeight]=\"30\"\n\n        [enableCellChangeFlash]=\"true\"\n\n        (gridReady)=\"on_GridReady($event)\"\n        >\n        </ag-grid-angular>\n\n        <mat-toolbar-row>\n            <button (click)=\"openDialogUpload()\"> <i class=\"fas fa-upload\"></i> Rate Card</button>\n            <span> (Rates from CSV/Total Rates processed)  <b>{{totalRatesFromCSV}}/{{totalRatesProcessed}}</b></span>\n            <mat-form-field class=\"search-bar\">\n                    <span matPrefix><i class=\"fas fa-search\"></i> &nbsp;</span>\n                    <input matInput placeholder=\"Search Table...\">\n            </mat-form-field>\n        </mat-toolbar-row>\n    </div>\n\n</section>"

/***/ }),

/***/ "./src/app/ratecard/ratecard-importer/importer-table/importer-table.component.scss":
/*!*****************************************************************************************!*\
  !*** ./src/app/ratecard/ratecard-importer/importer-table/importer-table.component.scss ***!
  \*****************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "section {\n  margin-top: 5px;\n  margin-left: 5px;\n  margin-right: 5px; }\n  section .table-container {\n    width: 100%;\n    height: 100%;\n    float: left; }\n  section .table-container ag-grid-angular {\n      width: 99.7%;\n      height: 85vh; }\n  section .table-container ag-grid-angular /deep/ .teleu-buyrate-highlight {\n        color: #ffffff;\n        font-weight: bold;\n        background-color: #006400; }\n  section .table-container ag-grid-angular /deep/ .teleu_db-buyrate-highlight {\n        color: #ffffff;\n        font-weight: bold;\n        background-color: #8b0000; }\n  section .table-container .top-toolbar {\n      height: 30px; }\n  section .table-container .top-toolbar button {\n        width: 30px;\n        height: 30px;\n        background-color: Transparent;\n        border: none; }\n  section .table-container .top-toolbar button:hover {\n        background-color: #E0E0E0; }\n  section .table-container .top-toolbar button:focus {\n        outline: 0; }\n  section .table-container mat-toolbar-row {\n      height: auto; }\n  section .table-container mat-toolbar-row button {\n        background-color: Transparent;\n        width: auto;\n        height: 30px;\n        padding: 5px;\n        border: 1px solid #E0E0E0; }\n  section .table-container mat-toolbar-row button:hover {\n        background-color: #E0E0E0; }\n  section .table-container mat-toolbar-row button:focus {\n        outline: 0; }\n  section .table-container mat-toolbar-row mat-form-field {\n        font-size: 14px; }\n  section .table-container mat-toolbar-row .search-bar {\n        float: right;\n        position: relative;\n        width: 40%;\n        padding-right: 5px;\n        margin-top: -10px; }\n  section .ag-header-row {\n    font-weight: bolder;\n    font-size: 1em; }\n  section .selectedRow div:nth-child(1) {\n    background-color: #ffffff; }\n  section .ag-header-container {\n    border-color: #ffffff; }\n  section .ag-header-cell {\n    border-bottom: 1px solid #ffffff; }\n  section .ag-header-cell-resize {\n    width: 1.5px;\n    color: #ffffff; }\n  section .ag-theme-balham .ag-floating-filter-body input {\n    border-bottom: 1.5px solid #ffffff; }\n  section .add, section .del {\n    border: 1px solid black; }\n"

/***/ }),

/***/ "./src/app/ratecard/ratecard-importer/importer-table/importer-table.component.ts":
/*!***************************************************************************************!*\
  !*** ./src/app/ratecard/ratecard-importer/importer-table/importer-table.component.ts ***!
  \***************************************************************************************/
/*! exports provided: ImporterTableComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ImporterTableComponent", function() { return ImporterTableComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm5/material.es5.js");
/* harmony import */ var _shared_api_services_ratecard_importer_api_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./../../../shared/api-services/ratecard/importer.api.service */ "./src/app/shared/api-services/ratecard/importer.api.service.ts");
/* harmony import */ var _shared_services_ratecard_importer_shared_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./../../../shared/services/ratecard/importer.shared.service */ "./src/app/shared/services/ratecard/importer.shared.service.ts");
/* harmony import */ var _shared_api_services_ratecard_rate_cards_api_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./../../../shared/api-services/ratecard/rate-cards.api.service */ "./src/app/shared/api-services/ratecard/rate-cards.api.service.ts");
/* harmony import */ var _shared_services_global_snackbar_shared_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./../../../shared/services/global/snackbar.shared.service */ "./src/app/shared/services/global/snackbar.shared.service.ts");
/* harmony import */ var _dialog_upload_rates_upload_rates_dialog_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./dialog/upload-rates/upload-rates-dialog.component */ "./src/app/ratecard/ratecard-importer/importer-table/dialog/upload-rates/upload-rates-dialog.component.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};







var ImporterTableComponent = /** @class */ (function () {
    function ImporterTableComponent(importerService, importerSharedService, dialog, rateCardsService, snackbarSharedService) {
        this.importerService = importerService;
        this.importerSharedService = importerSharedService;
        this.dialog = dialog;
        this.rateCardsService = rateCardsService;
        this.snackbarSharedService = snackbarSharedService;
        this.quickSearchValue = '';
        this.totalRatesProcessed = 0;
        this.totalRatesFromCSV = 0;
        this.columnDefs = this.createColumnDefs();
    }
    ImporterTableComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.getNodeChildDetails = this.setGroups();
        this.importerSharedService.currentPostTableObj.subscribe(function (data) {
            _this.totalRatesProcessed = 0;
            _this.rowData = data;
            for (var i = 0; i < _this.rowData.length; i++) {
                _this.totalRatesProcessed += _this.rowData[i].rates.length;
            }
        });
        this.importerSharedService.currentRatesCSVAmount.subscribe(function (data) {
            _this.totalRatesFromCSV = 0;
            _this.totalRatesFromCSV = data;
        });
    };
    // ================================================================================
    // Ratecard Importer API Services
    // ================================================================================
    ImporterTableComponent.prototype.put_EditRates = function (id, ratecardObj) {
        var _this = this;
        this.importerService.put_EditRates(id, ratecardObj)
            .subscribe(function (resp) {
            console.log(resp);
            if (resp.status === 200) {
                _this.snackbarSharedService.snackbar_success('Edit Successful.', 2000);
            }
        }, function (error) {
            console.log(error);
            _this.snackbarSharedService.snackbar_error('Edit failed.', 2000);
        });
    };
    ImporterTableComponent.prototype.post_attachTrunkToRatecard = function (ratecardId, trunkId) {
        var _this = this;
        this.rateCardsService.post_AttachTrunk(ratecardId, trunkId)
            .subscribe(function (resp) {
            console.log(resp);
            if (resp.status === 200) {
                _this.snackbarSharedService.snackbar_success('Trunk successfully attached.', 2000);
            }
        }, function (error) {
            console.log(error);
            _this.snackbarSharedService.snackbar_error('Trunk failed to attach.', 2000);
        });
    };
    ImporterTableComponent.prototype.put_editTeleuDbRates = function (teleu_db_rate_id, body) {
        var _this = this;
        this.rateCardsService.put_EditTeleuDbRates(teleu_db_rate_id, body)
            .subscribe(function (resp) {
            console.log(resp);
            if (resp.status === 200) {
                _this.snackbarSharedService.snackbar_success('Edit Successful.', 2000);
            }
        }, function (error) {
            console.log(error);
            _this.snackbarSharedService.snackbar_error('Edit failed.', 2000);
        });
    };
    /*
        ~~~~~~~~~~ AG Grid Initialization ~~~~~~~~~~
    */
    ImporterTableComponent.prototype.on_GridReady = function (params) {
        this.gridApi = params.api;
        params.api.sizeColumnsToFit();
    };
    ImporterTableComponent.prototype.createColumnDefs = function () {
        return [
            {
                headerName: 'Ratecard Name', field: 'ratecard_name',
                cellRenderer: 'agGroupCellRenderer', width: 350,
                valueFormatter: function (params) {
                    var ratecard_name = params.data.ratecard_name;
                    if (ratecard_name) {
                        var country = ratecard_name.split('#');
                        return country[0] + ' - ' + country[2];
                    }
                    else {
                        return ratecard_name;
                    }
                },
                cellStyle: { 'border-right': '2px solid #E0E0E0' },
            },
            {
                headerName: 'Prefix', field: 'prefix', width: 150,
                // checkboxSelection: true, headerCheckboxSelection: true,
                cellStyle: { 'border-right': '2px solid #E0E0E0' },
            },
            // {
            //     headerName: 'Tele-U(Data Base)',
            //     marryChildren: true,
            //     children: [
            //         {
            //             headerName: 'Buy Rate', field: 'teleu_db_buy_rate', width: 140,
            //             editable: true, columnGroupShow: 'closed',
            //             cellClassRules: {
            //                 'teleu_db-buyrate-highlight': function(params) {
            //                     return params.value < params.data.teleu_buy_rate;
            //                 }
            //             },
            //             cellStyle: { 'border-right': '1px solid #E0E0E0' },
            //         },
            //         {
            //             headerName: 'Sell Rate', field: 'teleu_db_sell_rate', width: 140,
            //             editable: true, columnGroupShow: 'closed',
            //             cellStyle: { 'border-right': '1px solid #E0E0E0' },
            //         },
            //         {
            //             headerName: 'Difference', width: 170,
            //             valueGetter: function(params) {
            //                 if (params.data.teleu_db_buy_rate > 0) {
            //                     const diff = (params.data.teleu_db_sell_rate - params.data.teleu_db_buy_rate);
            //                     const percent = ((diff) / params.data.teleu_db_buy_rate) * 100;
            //                     const diffFixed = diff.toFixed(4);
            //                     const percentFixed = percent.toFixed(2);
            //                     return `${diffFixed}(${percentFixed}%)`;
            //                 } else {
            //                     return '';
            //                 }
            //             }, columnGroupShow: 'closed',
            //             cellStyle: { 'border-right': '1px solid #E0E0E0' },
            //         },
            //         {
            //             headerName: 'Fixed', field: 'fixed', width: 120, editable: true,
            //             cellEditor: 'select', cellEditorParams: {values: [ 'true', 'false']},
            //             columnGroupShow: 'closed',
            //             cellStyle: { 'border-right': '2px solid #E0E0E0' },
            //         }
            //     ]
            // },
            // {
            //     headerName: 'Tele-U(From Ratecard)',
            //     marryChildren: true,
            //     children: [
            //         {
            //             headerName: 'Buy Rate', field: 'teleu_buy_rate', width: 140,
            //             editable: true, volatile: true, columnGroupShow: 'closed',
            //             cellClassRules: {
            //                 'teleu-buyrate-highlight': function(params) {
            //                     return params.value > params.data.teleu_db_buy_rate;
            //                 }
            //             },
            //             cellStyle: { 'border-right': '1px solid #E0E0E0' },
            //         },
            //         {
            //             headerName: 'Sell Rate', field: 'teleu_sell_rate', width: 140,
            //             editable: true, columnGroupShow: 'closed',
            //             cellStyle: { 'border-right': '1px solid #E0E0E0' },
            //         },
            //         {
            //             headerName: 'Difference', width: 170, columnGroupShow: 'closed',
            //             valueGetter: function(params) {
            //                 if (params.data.teleu_buy_rate > 0) {
            //                     const diff = (params.data.teleu_sell_rate - params.data.teleu_buy_rate);
            //                     const percent = ((diff) / params.data.teleu_buy_rate) * 100;
            //                     const diffFixed = diff.toFixed(4);
            //                     const percentFixed = percent.toFixed(2);
            //                     return `${diffFixed}(${percentFixed}%)`;
            //                 } else {
            //                     return '';
            //                 }
            //             },
            //             cellStyle: { 'border-right': '1px solid #E0E0E0' },
            //         },
            //         {
            //             headerName: 'Confirmed?', field: 'teleu_confirmed', width: 120, editable: true,
            //             cellEditor: 'select', cellEditorParams: {values: [ 'true', 'false']},
            //             cellStyle: {
            //                 'border-right': '2px solid #E0E0E0'
            //             }, columnGroupShow: 'closed',
            //         }
            //     ]
            // },
            {
                headerName: 'Private Offer',
                marryChildren: true,
                children: [
                    {
                        headerName: 'Buy Rate', field: 'private_buy_rate', width: 160,
                        editable: true,
                        cellStyle: { 'border-right': '1px solid #E0E0E0' },
                    },
                    {
                        headerName: 'Sell Rate', field: 'private_sell_rate', width: 140,
                        editable: true,
                        cellStyle: { 'border-right': '1px solid #E0E0E0' },
                    },
                    {
                        headerName: 'Difference', width: 170,
                        valueGetter: function (params) {
                            if (params.data.private_buy_rate > 0) {
                                var diff = (params.data.private_sell_rate - params.data.private_buy_rate);
                                var percent = ((diff) / params.data.private_buy_rate) * 100;
                                var diffFixed = diff.toFixed(4);
                                var percentFixed = percent.toFixed(2);
                                return diffFixed + "(" + percentFixed + "%)";
                            }
                            else {
                                return '';
                            }
                        },
                        cellStyle: { 'border-right': '1px solid #E0E0E0' },
                    },
                    {
                        headerName: 'Confirmed?', field: 'private_confirmed', width: 120, editable: true,
                        cellEditor: 'select', cellEditorParams: { values: ['true', 'false'] },
                    }
                ]
            }
        ];
    };
    ImporterTableComponent.prototype.setGroups = function () {
        return function getNodeChildDetails(rowItem) {
            if (rowItem.rates) {
                return {
                    group: true,
                    children: rowItem.rates,
                    key: rowItem.ratecard_name
                };
            }
            else {
                return null;
            }
        };
    };
    /*
        ~~~~~~~~~~ Grid UI  ~~~~~~~~~~
    */
    ImporterTableComponent.prototype.gridSizeChanged = function (params) {
        params.api.sizeColumnsToFit();
    };
    ImporterTableComponent.prototype.expandAll = function (expand) {
        this.gridApi.forEachNode(function (node) {
            if (node.group) {
                node.setExpanded(expand);
            }
        });
    };
    /*
        ~~~~~~~~~~ Grid CRUD  ~~~~~~~~~~
    */
    ImporterTableComponent.prototype.onCellValueChanged = function (params) {
        var teleu_rate_id = params.data.teleu_rate_id;
        var private_rate_id = params.data.private_rate_id;
        var teleu_db_rate_id = params.data.teleu_db_rate_id;
        var body_TeleU = {
            buy_rate: parseFloat(params.data.teleu_buy_rate),
            sell_rate: parseFloat(params.data.teleu_sell_rate)
        };
        var body_Private = {
            buy_rate: parseFloat(params.data.private_buy_rate),
            sell_rate: parseFloat(params.data.private_sell_rate)
        };
        var body_TeleU_DB = {
            buy_rate: parseFloat(params.data.teleu_db_buy_rate),
            sell_rate: parseFloat(params.data.teleu_db_sell_rate),
            isFixed: JSON.parse(params.data.fixed)
        };
        if (params.data.teleu_buy_rate) {
            this.put_EditRates(teleu_rate_id, body_TeleU);
        }
        if (params.data.private_buy_rate) {
            this.put_EditRates(private_rate_id, body_Private);
        }
        if (params.data.teleu_db_buy_rate) {
            this.put_editTeleuDbRates(teleu_db_rate_id, body_TeleU_DB);
        }
        params.api.redrawRows(); // reset view for css changes on edit
    };
    /*
        ~~~~~~~~~~ Dialog ~~~~~~~~~~
    */
    ImporterTableComponent.prototype.openDialogUpload = function () {
        var _this = this;
        this.totalRatesFromCSV = 0;
        var dialogRef = this.dialog.open(_dialog_upload_rates_upload_rates_dialog_component__WEBPACK_IMPORTED_MODULE_6__["UploadRatesDialogComponent"], {
            width: '80vw'
        });
        var sub = dialogRef.componentInstance.event_passTrunkId.subscribe(function (data) {
            var ratecardIdArr = [];
            var trunkId = data;
            _this.gridApi.forEachNode(function (rowNode) {
                if (rowNode.data['ratecard_id (Private)']) {
                    ratecardIdArr.push(rowNode.data['ratecard_id (Private)']);
                }
                if (rowNode.data['ratecard_id (TeleU)']) {
                    ratecardIdArr.push(rowNode.data['ratecard_id (TeleU)']);
                }
            });
            for (var i = 0; i < ratecardIdArr.length; i++) {
                _this.post_attachTrunkToRatecard(ratecardIdArr[i], trunkId);
            }
        });
        dialogRef.afterClosed().subscribe(function () {
            sub.unsubscribe();
        });
    };
    ImporterTableComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-importer-table',
            template: __webpack_require__(/*! ./importer-table.component.html */ "./src/app/ratecard/ratecard-importer/importer-table/importer-table.component.html"),
            styles: [__webpack_require__(/*! ./importer-table.component.scss */ "./src/app/ratecard/ratecard-importer/importer-table/importer-table.component.scss")]
        }),
        __metadata("design:paramtypes", [_shared_api_services_ratecard_importer_api_service__WEBPACK_IMPORTED_MODULE_2__["ImporterService"],
            _shared_services_ratecard_importer_shared_service__WEBPACK_IMPORTED_MODULE_3__["ImporterSharedService"],
            _angular_material__WEBPACK_IMPORTED_MODULE_1__["MatDialog"],
            _shared_api_services_ratecard_rate_cards_api_service__WEBPACK_IMPORTED_MODULE_4__["RateCardsService"],
            _shared_services_global_snackbar_shared_service__WEBPACK_IMPORTED_MODULE_5__["SnackbarSharedService"]])
    ], ImporterTableComponent);
    return ImporterTableComponent;
}());



/***/ }),

/***/ "./src/app/ratecard/ratecard-view-carrier-p/ratecard-view-carrier-p.component.html":
/*!*****************************************************************************************!*\
  !*** ./src/app/ratecard/ratecard-view-carrier-p/ratecard-view-carrier-p.component.html ***!
  \*****************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<!-- Container for sidebar(s) + page content -->\n<ng-sidebar-container>\n\n    <!-- Carrier | Country sidebar -->\n    <ng-sidebar [(opened)]=\"booleanCountryCarrierSidebar\" position=\"right\" >\n        <div class=\"country-carrier-picker-container\">\n            <ag-grid-angular class=\"ag-theme-balham\" id=\"country-picker-table\"\n                [columnDefs]=\"columnDefsCountry\" [rowData]=\"rowDataCountry\"\n                [rowSelection]=\"rowSelectionS\" (selectionChanged)=\"onSelectionChangedCountry()\" [suppressRowClickSelection]=\"true\"\n                [floatingFilter]=\"true\" [enableSorting]=\"true\" (gridSizeChanged)=\"gridSizeChanged($event)\"\n                [headerHeight]=\"40\" [floatingFiltersHeight]=\"30\"\n\n                (gridReady)=\"on_GridReady_country($event)\"\n            >\n            </ag-grid-angular>\n            <ag-grid-angular class=\"ag-theme-balham\" id=\"carrier-picker-table\"\n                [columnDefs]=\"columnDefsCarrier\" [rowData]=\"\"\n                [rowSelection]=\"rowSelectionM\" (rowSelected)=\"rowSelectedCarrier($event)\" [suppressRowClickSelection]=\"true\"\n                [floatingFilter]=\"true\" (gridSizeChanged)=\"gridSizeChanged($event)\"\n                [headerHeight]=\"40\" [floatingFiltersHeight]=\"30\"\n\n                (gridReady)=\"on_GridReady_carrier($event)\"\n            >\n            </ag-grid-angular>\n        </div>\n    </ng-sidebar>\n    \n    <!-- Page content -->\n    <div ng-sidebar-content>\n        <div class=\"top-table-toolbar\">\n            <div class=\"toggle-filter-menu\">\n            </div>\n            <div class=\"toggle-country-carrier-menu\">\n                <button (click)=\"toggleCountryCarrierSidebar()\"> <i class=\"fas fa-globe\"></i> <span class=\"country-carrier-header\">Country | Carrier</span></button>\n            </div>\n        </div>\n\n        <div class=\"main-container\">\n            <ag-grid-angular class=\"ag-theme-balham\" id=\"main-table\"\n                [columnDefs]=\"columnDefsMain\" [rowData]=\"\" [animateRows]=\"true\"\n                [suppressRowClickSelection]=\"true\"\n                [enableSorting]=\"true\"\n                [enableColResize]=\"true\"\n                [suppressDragLeaveHidesColumns]=\"true\"\n                [suppressLoadingOverlay]=\"true\" [suppressNoRowsOverlay]=\"true\"\n                [headerHeight]=\"40\" [floatingFiltersHeight]=\"30\"\n                [enableCellChangeFlash]=\"true\"\n\n                (gridReady)=\"on_GridReady($event)\"\n            >\n            </ag-grid-angular>\n\n        </div>\n        <button mat-button class=\"export\" (click)=\"exportAsCsv()\">Export as CSV</button>\n    </div>\n    \n</ng-sidebar-container>\n\n\n"

/***/ }),

/***/ "./src/app/ratecard/ratecard-view-carrier-p/ratecard-view-carrier-p.component.scss":
/*!*****************************************************************************************!*\
  !*** ./src/app/ratecard/ratecard-view-carrier-p/ratecard-view-carrier-p.component.scss ***!
  \*****************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "ng-sidebar-container {\n  margin-left: 10px;\n  width: auto;\n  height: calc(100vh - 60px);\n  overflow-y: hidden; }\n  ng-sidebar-container .export {\n    border: 1px solid black;\n    margin-top: 5px;\n    margin-right: 5px; }\n  ng-sidebar-container .percent-markup {\n    height: 30px;\n    font-size: 11px; }\n  ng-sidebar-container /deep/ .notable-variance {\n    background-color: red;\n    color: white;\n    font-weight: bold; }\n  .top-table-toolbar {\n  height: 30px; }\n  .top-table-toolbar .selected-country-name-header {\n    line-height: 35px;\n    float: left;\n    margin-left: 30%;\n    font-weight: bold; }\n  .top-table-toolbar button {\n    background-color: transparent;\n    border: none;\n    line-height: 35px; }\n  .top-table-toolbar button .fa-bars {\n      font-size: 20px; }\n  .top-table-toolbar button .filter-header {\n      padding-left: 5px; }\n  .top-table-toolbar button .filter-header:active {\n      color: gray; }\n  .top-table-toolbar button .country-carrier-header {\n      padding-right: 5px; }\n  .top-table-toolbar button:focus {\n      outline: 0; }\n  .top-table-toolbar button:hover {\n      color: gray; }\n  .top-table-toolbar .toggle-filter-menu {\n    float: left; }\n  .top-table-toolbar .toggle-country-carrier-menu {\n    float: right; }\n  /deep/ .ng-sidebar {\n  margin-top: 40px; }\n  /deep/ .ng-sidebar .country-carrier-picker-container {\n    width: 31vw;\n    height: auto;\n    margin-right: 10px;\n    display: flex; }\n  /deep/ .ng-sidebar .country-carrier-picker-container #country-picker-table {\n      width: 48%;\n      height: calc(100vh - 160px);\n      flex: 1; }\n  /deep/ .ng-sidebar .country-carrier-picker-container #carrier-picker-table {\n      width: 48%;\n      height: calc(100vh - 160px);\n      flex: 1; }\n  /deep/ .main-container {\n  width: 100%;\n  height: 100%;\n  float: left; }\n  /deep/ .main-container #main-table {\n    width: 99.5%;\n    height: calc(100vh - 160px);\n    border-top: 1px solid #E0E0E0;\n    border-right: 1px solid #E0E0E0; }\n  /deep/ .main-container #main-table .highlight-column {\n      background-color: rgba(255, 215, 0, 0.2); }\n  /deep/ .main-container .button {\n    margin-top: 1%;\n    margin-left: 5px;\n    border: 1px solid black; }\n  /deep/ .main-container .exceptions-container {\n    display: inline-block; }\n  /deep/ .main-container .exceptions-container span {\n      height: 15px;\n      padding: 0;\n      margin: 0; }\n  /deep/ .main-container .ag-header-cell-text {\n    color: black; }\n  /deep/ .main-container .fa-minus {\n    float: right;\n    margin-top: 5px;\n    font-size: 15px; }\n  /deep/ .main-container .fa-minus:hover {\n      color: red; }\n"

/***/ }),

/***/ "./src/app/ratecard/ratecard-view-carrier-p/ratecard-view-carrier-p.component.ts":
/*!***************************************************************************************!*\
  !*** ./src/app/ratecard/ratecard-view-carrier-p/ratecard-view-carrier-p.component.ts ***!
  \***************************************************************************************/
/*! exports provided: RatecardViewCarrierPComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RatecardViewCarrierPComponent", function() { return RatecardViewCarrierPComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_material_dialog__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/material/dialog */ "./node_modules/@angular/material/esm5/dialog.es5.js");
/* harmony import */ var _shared_services_ratecard_iso_codes_shared_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./../../shared/services/ratecard/iso-codes.shared.service */ "./src/app/shared/services/ratecard/iso-codes.shared.service.ts");
/* harmony import */ var _shared_api_services_ratecard_rate_cards_api_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./../../shared/api-services/ratecard/rate-cards.api.service */ "./src/app/shared/api-services/ratecard/rate-cards.api.service.ts");
/* harmony import */ var _shared_services_ratecard_main_table_prem_shared_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./../../shared/services/ratecard/main-table-prem.shared.service */ "./src/app/shared/services/ratecard/main-table-prem.shared.service.ts");
/* harmony import */ var _shared_services_ratecard_main_table_common_shared_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./../../shared/services/ratecard/main-table-common.shared.service */ "./src/app/shared/services/ratecard/main-table-common.shared.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (undefined && undefined.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};






var RatecardViewCarrierPComponent = /** @class */ (function () {
    function RatecardViewCarrierPComponent(_isoCodes, _rateCardsService, _mainTablePrem, _elementRef, _renderer, _dialog, _mainTableCommon) {
        this._isoCodes = _isoCodes;
        this._rateCardsService = _rateCardsService;
        this._mainTablePrem = _mainTablePrem;
        this._renderer = _renderer;
        this._dialog = _dialog;
        this._mainTableCommon = _mainTableCommon;
        // gridUi
        this.rowSelectionM = 'multiple';
        this.rowSelectionS = 'single';
        this.booleanCountryCarrierSidebar = true;
        this.filterByTeleU = function (array) { return array.filter(function (arrItem) {
            var type = arrItem.ratecard_name.split('#')[2];
            if (type === 'teleU') {
                return type;
            }
        }); };
        this.filterByPremium = function (array) { return array.filter(function (arrItem) {
            if (arrItem.ratecard_tier === 'premium') {
                return arrItem.ratecard_tier;
            }
        }); };
        this.columnDefsCountry = this.createColumnDefsCountry();
        this.columnDefsCarrier = this.createColumnDefsCarrier();
    }
    RatecardViewCarrierPComponent.prototype.ngOnInit = function () {
        this.rowDataCountry = this._isoCodes.getCountryCodes();
    };
    // ================================================================================
    // Carrier-View API Services
    // ================================================================================
    RatecardViewCarrierPComponent.prototype.get_specificCarrierRatesByCountry = function (isoCode) {
        var _this = this;
        this._rateCardsService.get_ratesByCountry(isoCode)
            .subscribe(function (data) { _this.processData(data); });
    };
    RatecardViewCarrierPComponent.prototype.get_everyCountryRates = function () {
        var _this = this;
        var countryArr = [];
        var _loop_1 = function (i) {
            this_1._rateCardsService.get_ratesByCountry(this_1.rowDataCountry[i].code)
                .subscribe(function (resp) {
                // * doing some pre data filtering
                var rowDataFilteredByTeleU = _this.filterByTeleU(resp);
                var rowDataFilteredByPremium = _this.filterByPremium(rowDataFilteredByTeleU);
                var rowDataFilteredForBlankRates = _this._mainTableCommon.filterOutBlankArrays(rowDataFilteredByPremium, 'rates');
                // * combine each result into a new array
                for (var x = 0; x < rowDataFilteredForBlankRates.length; x++) {
                    countryArr.push(rowDataFilteredForBlankRates[x]);
                }
                if (i >= 230) {
                    var hash_1 = Object.create(null);
                    var result = countryArr.filter(function (obj) {
                        if (!hash_1[obj.carrier_id]) {
                            hash_1[obj.carrier_id] = obj.rates;
                            return true;
                        }
                        Array.prototype.push.apply(hash_1[obj.carrier_id], obj.rates);
                    });
                    var carrierGroupHeadersArr = _this._mainTablePrem.createColumnGroupHeaders(result);
                    var columnDefsForMain = _this._mainTablePrem.createCarrierColumnDefs(carrierGroupHeadersArr, result);
                    _this.columnDefsMain = _this._mainTablePrem.createCarrierColumnDefs(carrierGroupHeadersArr, result);
                    var finalRowData = _this._mainTablePrem.createRowData(result);
                    _this.gridApiMain.setRowData(finalRowData);
                    _this.setCarrierRowData(carrierGroupHeadersArr);
                }
            });
        };
        var this_1 = this;
        for (var i = 0; i <= 240; i++) {
            _loop_1(i);
        }
    };
    RatecardViewCarrierPComponent.prototype.processData = function (rowData) {
        var rowDataFilteredByTeleU = this.filterByTeleU(rowData);
        var rowDataFilteredByPremium = this.filterByPremium(rowDataFilteredByTeleU);
        var rowDataFilteredForBlankRates = this._mainTableCommon.filterOutBlankArrays(rowDataFilteredByPremium, 'rates');
        var carrierGroupHeadersArr = this._mainTablePrem.createColumnGroupHeaders(rowDataFilteredForBlankRates);
        var columnDefsForMain = this._mainTablePrem.createCarrierColumnDefs(carrierGroupHeadersArr, rowDataFilteredForBlankRates);
        this.columnDefsMain = this._mainTablePrem.createCarrierColumnDefs(carrierGroupHeadersArr, rowDataFilteredForBlankRates);
        var finalRowData = this._mainTablePrem.createRowData(rowDataFilteredForBlankRates);
        this.gridApiMain.setRowData(finalRowData);
        this.setCarrierRowData(carrierGroupHeadersArr);
    };
    // ================================================================================
    // AG Grid Init
    // ================================================================================
    RatecardViewCarrierPComponent.prototype.on_GridReady = function (params) {
        this.gridApiMain = params.api;
        this.columnApiMain = params.columnApi;
        this.gridApiMain.setGroupHeaderHeight(30);
    };
    RatecardViewCarrierPComponent.prototype.on_GridReady_country = function (params) {
        this.gridApiCountry = params.api;
        params.api.sizeColumnsToFit();
        this.gridApiCountry.selectIndex(0, true, null);
    };
    RatecardViewCarrierPComponent.prototype.on_GridReady_carrier = function (params) {
        this.gridApiCarrier = params.api;
        params.api.sizeColumnsToFit();
    };
    RatecardViewCarrierPComponent.prototype.createColumnDefsCountry = function () {
        return [
            {
                headerName: 'Country', field: 'country', checkboxSelection: true,
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
                unSortIcon: true,
            },
            {
                headerName: 'Code', field: 'code', hide: true, unSortIcon: true,
            }
        ];
    };
    RatecardViewCarrierPComponent.prototype.createColumnDefsCarrier = function () {
        return [
            {
                headerName: 'Carriers', field: 'ratecard_name_modified', colId: 'carrierToggle',
                checkboxSelection: true, headerCheckboxSelection: true, unSortIcon: true,
            }
        ];
    };
    RatecardViewCarrierPComponent.prototype.setCarrierRowData = function (rowData) {
        this.gridApiCarrier.setRowData(rowData);
        this.gridApiCarrier.selectAll();
    };
    // ================================================================================
    // AG Grid shared Fn
    // ================================================================================
    RatecardViewCarrierPComponent.prototype.gridSizeChanged = function (params) {
        params.api.sizeColumnsToFit();
    };
    // ================================================================================
    // AG Grid Country Table
    // ================================================================================
    RatecardViewCarrierPComponent.prototype.onSelectionChangedCountry = function () {
        var selectedCode = this.gridApiCountry.getSelectedRows()[0].code;
        this.gridApiMain.setRowData([]);
        if (selectedCode === 'world') {
            this.get_everyCountryRates();
        }
        else {
            this.get_specificCarrierRatesByCountry(selectedCode);
        }
    };
    // ================================================================================
    // AG Grid Carrier Table
    // ================================================================================
    RatecardViewCarrierPComponent.prototype.rowSelectedCarrier = function (params) {
        this.detectColVisibility(params.node.selected, params.data.colId);
    };
    // ================================================================================
    // Top toolbar
    // ===============================================================================
    RatecardViewCarrierPComponent.prototype.toggleCountryCarrierSidebar = function () {
        this.booleanCountryCarrierSidebar = !this.booleanCountryCarrierSidebar;
    };
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // AG Grid Main Table - Header - Hide
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    RatecardViewCarrierPComponent.prototype.deselectCarrierTableCheckbox = function (event, id) {
        var rowNode = this.gridApiCarrier.getRowNode(id);
        rowNode.setSelected(false);
    };
    RatecardViewCarrierPComponent.prototype.detectColVisibility = function (condition, colId) {
        if (condition === true) {
            this.showCol("carrier_rate_" + colId);
            this.showCol("carrier_dest_" + colId);
        }
        if (condition === false) {
            this.hideCol("carrier_rate_" + colId);
            this.hideCol("carrier_dest_" + colId);
        }
    };
    RatecardViewCarrierPComponent.prototype.hideCol = function (colId) {
        this.columnApiMain.setColumnVisible(colId, false);
    };
    RatecardViewCarrierPComponent.prototype.showCol = function (colId) {
        this.columnApiMain.setColumnVisible(colId, true);
    };
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // AG Grid Main Table - Export
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    RatecardViewCarrierPComponent.prototype.exportAsCsv = function () {
        var exporterParams = {};
        this.gridApiMain.exportDataAsCsv(exporterParams);
    };
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Top Toolbar - markup
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    RatecardViewCarrierPComponent.prototype.onMarkupChange = function (params) {
        this.updateOurRateCol(params);
    };
    RatecardViewCarrierPComponent.prototype.updateOurRateCol = function (currentSelectValue) {
        var _this = this;
        this.gridApiMain.forEachNode(function (rowNode) {
            var avgRate = _this.gridApiMain.getValue('our_rate', rowNode);
            var ourRateAfterMarkup = avgRate * currentSelectValue;
            rowNode.setDataValue('our_rate', ourRateAfterMarkup.toFixed(4));
        });
    };
    RatecardViewCarrierPComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-ratecard-view-carrier-p',
            template: __webpack_require__(/*! ./ratecard-view-carrier-p.component.html */ "./src/app/ratecard/ratecard-view-carrier-p/ratecard-view-carrier-p.component.html"),
            styles: [__webpack_require__(/*! ./ratecard-view-carrier-p.component.scss */ "./src/app/ratecard/ratecard-view-carrier-p/ratecard-view-carrier-p.component.scss")]
        }),
        __param(3, Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Inject"])(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ElementRef"])),
        __metadata("design:paramtypes", [_shared_services_ratecard_iso_codes_shared_service__WEBPACK_IMPORTED_MODULE_2__["IsoCodesSharedService"],
            _shared_api_services_ratecard_rate_cards_api_service__WEBPACK_IMPORTED_MODULE_3__["RateCardsService"],
            _shared_services_ratecard_main_table_prem_shared_service__WEBPACK_IMPORTED_MODULE_4__["MainTablePremSharedService"],
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ElementRef"],
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["Renderer"],
            _angular_material_dialog__WEBPACK_IMPORTED_MODULE_1__["MatDialog"],
            _shared_services_ratecard_main_table_common_shared_service__WEBPACK_IMPORTED_MODULE_5__["MainTableCommonSharedService"]])
    ], RatecardViewCarrierPComponent);
    return RatecardViewCarrierPComponent;
}());



/***/ }),

/***/ "./src/app/ratecard/ratecard-view-carrier-s/ratecard-view-carrier.component.html":
/*!***************************************************************************************!*\
  !*** ./src/app/ratecard/ratecard-view-carrier-s/ratecard-view-carrier.component.html ***!
  \***************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<!-- Container for sidebar(s) + page content -->\n<ng-sidebar-container>\n\n    <!-- Carrier | Country sidebar -->\n    <ng-sidebar [(opened)]=\"booleanCountryCarrierSidebar\" position=\"right\" >\n        <div class=\"country-carrier-picker-container\">\n            <ag-grid-angular class=\"ag-theme-balham\" id=\"country-picker-table\"\n                [columnDefs]=\"columnDefsCountry\" [rowData]=\"rowDataCountry\"\n                [rowSelection]=\"rowSelectionS\" (selectionChanged)=\"onSelectionChangedCountry()\" [suppressRowClickSelection]=\"true\"\n                [floatingFilter]=\"true\" [enableSorting]=\"true\" (gridSizeChanged)=\"gridSizeChanged($event)\"\n                [headerHeight]=\"40\" [floatingFiltersHeight]=\"30\"\n\n                (gridReady)=\"on_GridReady_country($event)\"\n            >\n            </ag-grid-angular>\n            <ag-grid-angular class=\"ag-theme-balham\" id=\"carrier-picker-table\"\n                [columnDefs]=\"columnDefsCarrier\" [rowData]=\"\"\n                [rowSelection]=\"rowSelectionM\" (rowSelected)=\"rowSelectedCarrier($event)\" [suppressRowClickSelection]=\"true\"\n                [floatingFilter]=\"true\" (gridSizeChanged)=\"gridSizeChanged($event)\"\n                [headerHeight]=\"40\" [floatingFiltersHeight]=\"30\"\n\n                (gridReady)=\"on_GridReady_carrier($event)\"\n            >\n            </ag-grid-angular>\n        </div>\n    </ng-sidebar>\n    \n    <!-- Page content -->\n    <div ng-sidebar-content>\n        <div class=\"top-table-toolbar\">\n            <div class=\"toggle-filter-menu\">\n            </div>\n            <div class=\"toggle-country-carrier-menu\">\n                <button (click)=\"toggleCountryCarrierSidebar()\"> <i class=\"fas fa-globe\"></i> <span class=\"country-carrier-header\">Country | Carrier</span></button>\n            </div>\n        </div>\n\n        <div class=\"main-container\">\n            <ag-grid-angular class=\"ag-theme-balham\" id=\"main-table\"\n                [columnDefs]=\"columnDefsMain\" [rowData]=\"\" [animateRows]=\"true\"\n                [suppressRowClickSelection]=\"true\"\n                [enableSorting]=\"true\"\n                [enableColResize]=\"true\"\n                [suppressDragLeaveHidesColumns]=\"true\"\n                [suppressLoadingOverlay]=\"true\" [suppressNoRowsOverlay]=\"true\"\n                [headerHeight]=\"40\" [floatingFiltersHeight]=\"30\"\n                [enableCellChangeFlash]=\"true\"\n\n                (gridReady)=\"on_GridReady($event)\"\n            >\n            </ag-grid-angular>\n\n        </div>\n        <button mat-button class=\"export\" (click)=\"exportAsCsv()\">Export as CSV</button>\n    </div>\n    \n</ng-sidebar-container>\n\n\n"

/***/ }),

/***/ "./src/app/ratecard/ratecard-view-carrier-s/ratecard-view-carrier.component.scss":
/*!***************************************************************************************!*\
  !*** ./src/app/ratecard/ratecard-view-carrier-s/ratecard-view-carrier.component.scss ***!
  \***************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "ng-sidebar-container {\n  margin-left: 10px;\n  width: auto;\n  height: calc(100vh - 60px);\n  overflow-y: hidden; }\n  ng-sidebar-container .export {\n    border: 1px solid black;\n    margin-top: 5px;\n    margin-right: 5px; }\n  ng-sidebar-container .percent-markup {\n    height: 30px;\n    font-size: 11px; }\n  ng-sidebar-container /deep/ .notable-variance {\n    background-color: red;\n    color: white;\n    font-weight: bold; }\n  .top-table-toolbar {\n  height: 30px; }\n  .top-table-toolbar .selected-country-name-header {\n    line-height: 35px;\n    float: left;\n    margin-left: 30%;\n    font-weight: bold; }\n  .top-table-toolbar button {\n    background-color: transparent;\n    border: none;\n    line-height: 35px; }\n  .top-table-toolbar button .fa-bars {\n      font-size: 20px; }\n  .top-table-toolbar button .filter-header {\n      padding-left: 5px; }\n  .top-table-toolbar button .filter-header:active {\n      color: gray; }\n  .top-table-toolbar button .country-carrier-header {\n      padding-right: 5px; }\n  .top-table-toolbar button:focus {\n      outline: 0; }\n  .top-table-toolbar button:hover {\n      color: gray; }\n  .top-table-toolbar .toggle-filter-menu {\n    float: left; }\n  .top-table-toolbar .toggle-country-carrier-menu {\n    float: right; }\n  /deep/ .ng-sidebar {\n  margin-top: 40px; }\n  /deep/ .ng-sidebar .country-carrier-picker-container {\n    width: 31vw;\n    height: auto;\n    margin-right: 10px;\n    display: flex; }\n  /deep/ .ng-sidebar .country-carrier-picker-container #country-picker-table {\n      width: 48%;\n      height: calc(100vh - 160px);\n      flex: 1; }\n  /deep/ .ng-sidebar .country-carrier-picker-container #carrier-picker-table {\n      width: 48%;\n      height: calc(100vh - 160px);\n      flex: 1; }\n  /deep/ .main-container {\n  width: 100%;\n  height: 100%;\n  float: left; }\n  /deep/ .main-container #main-table {\n    width: 99.5%;\n    height: calc(100vh - 160px);\n    border-top: 1px solid #E0E0E0;\n    border-right: 1px solid #E0E0E0; }\n  /deep/ .main-container #main-table .highlight-column {\n      background-color: rgba(255, 215, 0, 0.2); }\n  /deep/ .main-container .button {\n    margin-top: 1%;\n    margin-left: 5px;\n    border: 1px solid black; }\n  /deep/ .main-container .exceptions-container {\n    display: inline-block; }\n  /deep/ .main-container .exceptions-container span {\n      height: 15px;\n      padding: 0;\n      margin: 0; }\n  /deep/ .main-container .ag-header-cell-text {\n    color: black; }\n  /deep/ .main-container .fa-minus {\n    float: right;\n    margin-top: 5px;\n    font-size: 15px; }\n  /deep/ .main-container .fa-minus:hover {\n      color: red; }\n"

/***/ }),

/***/ "./src/app/ratecard/ratecard-view-carrier-s/ratecard-view-carrier.component.ts":
/*!*************************************************************************************!*\
  !*** ./src/app/ratecard/ratecard-view-carrier-s/ratecard-view-carrier.component.ts ***!
  \*************************************************************************************/
/*! exports provided: RatecardViewCarrierComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RatecardViewCarrierComponent", function() { return RatecardViewCarrierComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_material_dialog__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/material/dialog */ "./node_modules/@angular/material/esm5/dialog.es5.js");
/* harmony import */ var _shared_services_ratecard_iso_codes_shared_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./../../shared/services/ratecard/iso-codes.shared.service */ "./src/app/shared/services/ratecard/iso-codes.shared.service.ts");
/* harmony import */ var _shared_api_services_ratecard_rate_cards_api_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./../../shared/api-services/ratecard/rate-cards.api.service */ "./src/app/shared/api-services/ratecard/rate-cards.api.service.ts");
/* harmony import */ var _shared_services_ratecard_main_table_std_shared_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./../../shared/services/ratecard/main-table-std.shared.service */ "./src/app/shared/services/ratecard/main-table-std.shared.service.ts");
/* harmony import */ var _shared_services_ratecard_main_table_common_shared_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./../../shared/services/ratecard/main-table-common.shared.service */ "./src/app/shared/services/ratecard/main-table-common.shared.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (undefined && undefined.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};






var RatecardViewCarrierComponent = /** @class */ (function () {
    function RatecardViewCarrierComponent(_isoCodes, _rateCardsService, _mainTableStd, _elementRef, _renderer, _dialog, _mainTableCommon) {
        this._isoCodes = _isoCodes;
        this._rateCardsService = _rateCardsService;
        this._mainTableStd = _mainTableStd;
        this._renderer = _renderer;
        this._dialog = _dialog;
        this._mainTableCommon = _mainTableCommon;
        // gridUi
        this.rowSelectionM = 'multiple';
        this.rowSelectionS = 'single';
        this.booleanCountryCarrierSidebar = true;
        this.filterByTeleU = function (array) { return array.filter(function (arrItem) {
            var type = arrItem.ratecard_name.split('#')[2];
            if (type === 'teleU') {
                return type;
            }
        }); };
        this.filterByStandard = function (array) { return array.filter(function (arrItem) {
            if (arrItem.ratecard_tier === 'standard') {
                return arrItem.ratecard_tier;
            }
        }); };
        this.columnDefsCountry = this.createColumnDefsCountry();
        this.columnDefsCarrier = this.createColumnDefsCarrier();
    }
    RatecardViewCarrierComponent.prototype.ngOnInit = function () {
        this.rowDataCountry = this._isoCodes.getCountryCodes();
    };
    // ================================================================================
    // Carrier-View API Services
    // ================================================================================
    RatecardViewCarrierComponent.prototype.get_specificCarrierRatesByCountry = function (isoCode) {
        var _this = this;
        this._rateCardsService.get_ratesByCountry(isoCode)
            .subscribe(function (data) { _this.processData(data); console.log(data); });
    };
    RatecardViewCarrierComponent.prototype.get_everyCountryRates = function () {
        var _this = this;
        var countryArr = [];
        var _loop_1 = function (i) {
            this_1._rateCardsService.get_ratesByCountry(this_1.rowDataCountry[i].code)
                .subscribe(function (resp) {
                // * doing some pre data filtering
                var rowDataFilteredByTeleU = _this.filterByTeleU(resp);
                var rowDataFilteredByPremium = _this.filterByStandard(rowDataFilteredByTeleU);
                var rowDataFilteredForBlankRates = _this._mainTableCommon.filterOutBlankArrays(rowDataFilteredByPremium, 'rates');
                // * combine each result into a new array
                for (var x = 0; x < rowDataFilteredForBlankRates.length; x++) {
                    countryArr.push(rowDataFilteredForBlankRates[x]);
                }
                if (i >= 239) {
                    var hash_1 = Object.create(null);
                    var result = countryArr.filter(function (obj) {
                        if (!hash_1[obj.carrier_id]) {
                            hash_1[obj.carrier_id] = obj.rates;
                            return true;
                        }
                        Array.prototype.push.apply(hash_1[obj.carrier_id], obj.rates);
                    });
                    var carrierGroupHeadersArr = _this._mainTableStd.createColumnGroupHeaders(result);
                    var columnDefsForMain = _this._mainTableStd.createCarrierColumnDefs(carrierGroupHeadersArr, result);
                    _this.columnDefsMain = _this._mainTableStd.createCarrierColumnDefs(carrierGroupHeadersArr, result);
                    var finalRowData = _this._mainTableStd.createRowData(result);
                    _this.gridApiMain.setRowData(finalRowData);
                    _this.setCarrierRowData(carrierGroupHeadersArr);
                }
            });
        };
        var this_1 = this;
        for (var i = 0; i <= 240; i++) {
            _loop_1(i);
        }
    };
    RatecardViewCarrierComponent.prototype.processData = function (rowData) {
        var rowDataFilteredByTeleU = this.filterByTeleU(rowData);
        var rowDataFilteredForStandard = this.filterByStandard(rowDataFilteredByTeleU);
        var rowDataFilteredForBlankRates = this._mainTableCommon.filterOutBlankArrays(rowDataFilteredForStandard, 'rates');
        var carrierGroupHeadersArr = this._mainTableStd.createColumnGroupHeaders(rowDataFilteredForBlankRates);
        var columnDefsForMain = this._mainTableStd.createCarrierColumnDefs(carrierGroupHeadersArr, rowDataFilteredForBlankRates);
        this.columnDefsMain = this._mainTableStd.createCarrierColumnDefs(carrierGroupHeadersArr, rowDataFilteredForBlankRates);
        var finalRowData = this._mainTableStd.createRowData(rowDataFilteredForBlankRates);
        this.gridApiMain.setRowData(finalRowData);
        this.setCarrierRowData(carrierGroupHeadersArr);
    };
    // ================================================================================
    // AG Grid Init
    // ================================================================================
    RatecardViewCarrierComponent.prototype.on_GridReady = function (params) {
        this.gridApiMain = params.api;
        this.columnApiMain = params.columnApi;
        this.gridApiMain.setGroupHeaderHeight(30);
    };
    RatecardViewCarrierComponent.prototype.on_GridReady_country = function (params) {
        this.gridApiCountry = params.api;
        params.api.sizeColumnsToFit();
        this.gridApiCountry.selectIndex(0, true, null);
    };
    RatecardViewCarrierComponent.prototype.on_GridReady_carrier = function (params) {
        this.gridApiCarrier = params.api;
        params.api.sizeColumnsToFit();
    };
    RatecardViewCarrierComponent.prototype.createColumnDefsCountry = function () {
        return [
            {
                headerName: 'Country', field: 'country', checkboxSelection: true,
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
                unSortIcon: true,
            },
            {
                headerName: 'Code', field: 'code', hide: true, unSortIcon: true,
            }
        ];
    };
    RatecardViewCarrierComponent.prototype.createColumnDefsCarrier = function () {
        return [
            {
                headerName: 'Carriers', field: 'ratecard_name_modified', colId: 'carrierToggle',
                checkboxSelection: true, headerCheckboxSelection: true, unSortIcon: true,
            }
        ];
    };
    RatecardViewCarrierComponent.prototype.setCarrierRowData = function (rowData) {
        this.gridApiCarrier.setRowData(rowData);
        this.gridApiCarrier.selectAll();
    };
    // ================================================================================
    // AG Grid shared Fn
    // ================================================================================
    RatecardViewCarrierComponent.prototype.gridSizeChanged = function (params) {
        params.api.sizeColumnsToFit();
    };
    // ================================================================================
    // AG Grid Country Table
    // ================================================================================
    RatecardViewCarrierComponent.prototype.onSelectionChangedCountry = function () {
        var selectedCode = this.gridApiCountry.getSelectedRows()[0].code;
        this.gridApiMain.setRowData([]);
        if (selectedCode === 'world') {
            this.get_everyCountryRates();
        }
        else {
            this.get_specificCarrierRatesByCountry(selectedCode);
        }
    };
    // ================================================================================
    // AG Grid Carrier Table
    // ================================================================================
    RatecardViewCarrierComponent.prototype.rowSelectedCarrier = function (params) {
        this.detectColVisibility(params.node.selected, params.data.colId);
    };
    // ================================================================================
    // Top toolbar
    // ===============================================================================
    RatecardViewCarrierComponent.prototype.toggleCountryCarrierSidebar = function () {
        this.booleanCountryCarrierSidebar = !this.booleanCountryCarrierSidebar;
    };
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // AG Grid Main Table - Header - Hide
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    RatecardViewCarrierComponent.prototype.deselectCarrierTableCheckbox = function (event, id) {
        var rowNode = this.gridApiCarrier.getRowNode(id);
        rowNode.setSelected(false);
    };
    RatecardViewCarrierComponent.prototype.detectColVisibility = function (condition, colId) {
        if (condition === true) {
            this.showCol("carrier_rate_" + colId);
            this.showCol("carrier_dest_" + colId);
        }
        if (condition === false) {
            this.hideCol("carrier_rate_" + colId);
            this.hideCol("carrier_dest_" + colId);
        }
    };
    RatecardViewCarrierComponent.prototype.hideCol = function (colId) {
        this.columnApiMain.setColumnVisible(colId, false);
    };
    RatecardViewCarrierComponent.prototype.showCol = function (colId) {
        this.columnApiMain.setColumnVisible(colId, true);
    };
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // AG Grid Main Table - Export
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    RatecardViewCarrierComponent.prototype.exportAsCsv = function () {
        var exporterParams = {};
        this.gridApiMain.exportDataAsCsv(exporterParams);
    };
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Top Toolbar - markup
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    RatecardViewCarrierComponent.prototype.onMarkupChange = function (params) {
        this.updateOurRateCol(params);
    };
    RatecardViewCarrierComponent.prototype.updateOurRateCol = function (currentSelectValue) {
        var _this = this;
        this.gridApiMain.forEachNode(function (rowNode) {
            var avgRate = _this.gridApiMain.getValue('our_rate', rowNode);
            var ourRateAfterMarkup = avgRate * currentSelectValue;
            rowNode.setDataValue('our_rate', ourRateAfterMarkup.toFixed(4));
        });
    };
    RatecardViewCarrierComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-ratecard-view-carrier',
            template: __webpack_require__(/*! ./ratecard-view-carrier.component.html */ "./src/app/ratecard/ratecard-view-carrier-s/ratecard-view-carrier.component.html"),
            styles: [__webpack_require__(/*! ./ratecard-view-carrier.component.scss */ "./src/app/ratecard/ratecard-view-carrier-s/ratecard-view-carrier.component.scss")]
        }),
        __param(3, Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Inject"])(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ElementRef"])),
        __metadata("design:paramtypes", [_shared_services_ratecard_iso_codes_shared_service__WEBPACK_IMPORTED_MODULE_2__["IsoCodesSharedService"],
            _shared_api_services_ratecard_rate_cards_api_service__WEBPACK_IMPORTED_MODULE_3__["RateCardsService"],
            _shared_services_ratecard_main_table_std_shared_service__WEBPACK_IMPORTED_MODULE_4__["MainTableStdSharedService"],
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ElementRef"],
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["Renderer"],
            _angular_material_dialog__WEBPACK_IMPORTED_MODULE_1__["MatDialog"],
            _shared_services_ratecard_main_table_common_shared_service__WEBPACK_IMPORTED_MODULE_5__["MainTableCommonSharedService"]])
    ], RatecardViewCarrierComponent);
    return RatecardViewCarrierComponent;
}());



/***/ }),

/***/ "./src/app/registration/registration.component.html":
/*!**********************************************************!*\
  !*** ./src/app/registration/registration.component.html ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<section>\n    <header><h1>Registration</h1></header>\n</section>"

/***/ }),

/***/ "./src/app/registration/registration.component.scss":
/*!**********************************************************!*\
  !*** ./src/app/registration/registration.component.scss ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "section {\n  width: 85%;\n  height: auto;\n  margin-top: 50px;\n  margin-left: 150px;\n  position: fixed;\n  background-color: white;\n  overflow: hidden; }\n  section header {\n    margin-left: 30px; }\n"

/***/ }),

/***/ "./src/app/registration/registration.component.ts":
/*!********************************************************!*\
  !*** ./src/app/registration/registration.component.ts ***!
  \********************************************************/
/*! exports provided: RegistrationComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RegistrationComponent", function() { return RegistrationComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var RegistrationComponent = /** @class */ (function () {
    function RegistrationComponent() {
    }
    RegistrationComponent.prototype.ngOnInit = function () {
    };
    RegistrationComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-registration',
            template: __webpack_require__(/*! ./registration.component.html */ "./src/app/registration/registration.component.html"),
            styles: [__webpack_require__(/*! ./registration.component.scss */ "./src/app/registration/registration.component.scss")]
        }),
        __metadata("design:paramtypes", [])
    ], RegistrationComponent);
    return RegistrationComponent;
}());



/***/ }),

/***/ "./src/app/shared/api-services/callplan/call-plan.api.service.ts":
/*!***********************************************************************!*\
  !*** ./src/app/shared/api-services/callplan/call-plan.api.service.ts ***!
  \***********************************************************************/
/*! exports provided: CallPlanService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CallPlanService", function() { return CallPlanService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_http__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/http */ "./node_modules/@angular/http/fesm5/http.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _services_global_api_settings_shared_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./../../services/global/api-settings.shared.service */ "./src/app/shared/services/global/api-settings.shared.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var CallPlanService = /** @class */ (function () {
    function CallPlanService(_http, _apiSettings) {
        this._http = _http;
        this._apiSettings = _apiSettings;
        this.headers = new _angular_http__WEBPACK_IMPORTED_MODULE_1__["Headers"]({ 'Content-Type': 'application/json', 'Accept': 'q=0.8;application/json;q=0.9' });
        this.options = new _angular_http__WEBPACK_IMPORTED_MODULE_1__["RequestOptions"]({ headers: this.headers });
        this.url = this._apiSettings.getUrl();
    }
    CallPlanService.prototype.get_allCallplan = function () {
        return this._http
            .get(this.url + 'callplans/')
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["map"])(function (res) { return res.json(); }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["catchError"])(this.handleError), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["tap"])(function (res) { return console.log(res); }));
    };
    CallPlanService.prototype.get_specificCallplan = function (callplan_id) {
        return this._http
            .get(this.url + 'callplans/' + callplan_id)
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["map"])(function (res) { return res.json(); }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["catchError"])(this.handleError));
    };
    CallPlanService.prototype.post_newCallPlan = function (body) {
        return this._http
            .post(this.url + 'callplans/', body, this.options)
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["catchError"])(this.handleError));
    };
    CallPlanService.prototype.del_callPlan = function (callplan_id) {
        return this._http
            .delete(this.url + 'callplans/' + callplan_id)
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["catchError"])(this.handleError));
    };
    CallPlanService.prototype.put_editCallPlan = function (body, callplan_id) {
        return this._http
            .put(this.url + 'callplans/' + callplan_id, body)
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["catchError"])(this.handleError));
    };
    // attach rate card to call plan
    CallPlanService.prototype.post_attachRateCard = function (callplan_id, ratecard_id, body) {
        return this._http
            .post(this.url + 'callplans/' + callplan_id + '/ratecards/' + ratecard_id, body)
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["catchError"])(this.handleError));
    };
    // detach rate card from call plan
    CallPlanService.prototype.del_detachRateCard = function (callplan_id, ratecard_id) {
        return this._http
            .delete(this.url + 'callplans/' + callplan_id + '/ratecards/' + ratecard_id)
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["catchError"])(this.handleError));
    };
    // add new plan code from callplan
    CallPlanService.prototype.post_newPlanCode = function (callplan_id, body) {
        return this._http
            .post(this.url + 'callplans/' + callplan_id + '/code', body)
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["catchError"])(this.handleError));
    };
    // update plan code from callplan
    CallPlanService.prototype.put_editPlanCode = function (callplan_id, code_id, body) {
        return this._http
            .put(this.url + 'callplans/' + callplan_id + '/code/' + code_id, body)
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["catchError"])(this.handleError));
    };
    // delete plan code from callplan
    CallPlanService.prototype.del_planCode = function (callplan_id, code_id) {
        return this._http
            .delete(this.url + 'callplans/' + callplan_id + '/code/' + code_id)
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["catchError"])(this.handleError));
    };
    /*
        ~~~~~~~~~~ LCR ~~~~~~~~~~
    */
    CallPlanService.prototype.post_callplanToLCR = function (callplan_id, body) {
        return this._http
            .post(this.url + 'lcr/callplans/' + callplan_id, body)
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["catchError"])(this.handleError));
    };
    CallPlanService.prototype.handleError = function (error) {
        console.error(error);
    };
    CallPlanService = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])(),
        __metadata("design:paramtypes", [_angular_http__WEBPACK_IMPORTED_MODULE_1__["Http"],
            _services_global_api_settings_shared_service__WEBPACK_IMPORTED_MODULE_3__["ApiSettingsSharedService"]])
    ], CallPlanService);
    return CallPlanService;
}());



/***/ }),

/***/ "./src/app/shared/api-services/carrier/carrier-profile.api.service.ts":
/*!****************************************************************************!*\
  !*** ./src/app/shared/api-services/carrier/carrier-profile.api.service.ts ***!
  \****************************************************************************/
/*! exports provided: CarrierProfileService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CarrierProfileService", function() { return CarrierProfileService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_http__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/http */ "./node_modules/@angular/http/fesm5/http.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _services_global_api_settings_shared_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./../../services/global/api-settings.shared.service */ "./src/app/shared/services/global/api-settings.shared.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var CarrierProfileService = /** @class */ (function () {
    function CarrierProfileService(_http, _apiSettings) {
        this._http = _http;
        this._apiSettings = _apiSettings;
        this.headers = new _angular_http__WEBPACK_IMPORTED_MODULE_1__["Headers"]({ 'Content-Type': 'application/json', 'Accept': 'q=0.8;application/json;q=0.9' });
        this.options = new _angular_http__WEBPACK_IMPORTED_MODULE_1__["RequestOptions"]({ headers: this.headers });
        this.url = this._apiSettings.getUrl();
    }
    CarrierProfileService.prototype.get_carrierProfiles = function () {
        return this._http
            .get(this.url + 'carrierProfiles/') // ! .
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["map"])(function (res) { return res.json(); }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["catchError"])(this.handleError));
    };
    CarrierProfileService.prototype.handleError = function (error) {
        console.error(error);
    };
    CarrierProfileService = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])(),
        __metadata("design:paramtypes", [_angular_http__WEBPACK_IMPORTED_MODULE_1__["Http"],
            _services_global_api_settings_shared_service__WEBPACK_IMPORTED_MODULE_3__["ApiSettingsSharedService"]])
    ], CarrierProfileService);
    return CarrierProfileService;
}());



/***/ }),

/***/ "./src/app/shared/api-services/carrier/carrier.api.service.ts":
/*!********************************************************************!*\
  !*** ./src/app/shared/api-services/carrier/carrier.api.service.ts ***!
  \********************************************************************/
/*! exports provided: CarrierService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CarrierService", function() { return CarrierService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_http__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/http */ "./node_modules/@angular/http/fesm5/http.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _services_global_api_settings_shared_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./../../services/global/api-settings.shared.service */ "./src/app/shared/services/global/api-settings.shared.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var CarrierService = /** @class */ (function () {
    function CarrierService(_http, _apiSettings) {
        this._http = _http;
        this._apiSettings = _apiSettings;
        this.headers = new _angular_http__WEBPACK_IMPORTED_MODULE_1__["Headers"]({ 'Content-Type': 'application/json', 'Accept': 'q=0.8;application/json;q=0.9' });
        this.options = new _angular_http__WEBPACK_IMPORTED_MODULE_1__["RequestOptions"]({ headers: this.headers });
        this.url = this._apiSettings.getUrl();
    }
    CarrierService.prototype.get_carriers = function () {
        return this._http
            .get(this.url + 'carriers/')
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["map"])(function (res) { return res.json(); }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["catchError"])(this.handleError));
    };
    CarrierService.prototype.post_AddRow = function (body) {
        return this._http
            .post(this.url + 'carriers/', body, this.options)
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["catchError"])(this.handleError));
    };
    CarrierService.prototype.del_DeleteRow = function (rowId) {
        return this._http
            .delete(this.url + 'carriers/' + rowId)
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["catchError"])(this.handleError));
    };
    CarrierService.prototype.put_EditCarrier = function (body, rowId) {
        return this._http
            .put(this.url + 'carriers/' + rowId, body)
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["catchError"])(this.handleError));
    };
    CarrierService.prototype.handleError = function (error) {
        console.error(error);
    };
    CarrierService = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])(),
        __metadata("design:paramtypes", [_angular_http__WEBPACK_IMPORTED_MODULE_1__["Http"],
            _services_global_api_settings_shared_service__WEBPACK_IMPORTED_MODULE_3__["ApiSettingsSharedService"]])
    ], CarrierService);
    return CarrierService;
}());



/***/ }),

/***/ "./src/app/shared/api-services/lcr/lcr.api.service.ts":
/*!************************************************************!*\
  !*** ./src/app/shared/api-services/lcr/lcr.api.service.ts ***!
  \************************************************************/
/*! exports provided: LCRService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LCRService", function() { return LCRService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_http__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/http */ "./node_modules/@angular/http/fesm5/http.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _services_global_api_settings_shared_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./../../services/global/api-settings.shared.service */ "./src/app/shared/services/global/api-settings.shared.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var LCRService = /** @class */ (function () {
    function LCRService(_http, _apiSettings) {
        this._http = _http;
        this._apiSettings = _apiSettings;
        this.headers = new _angular_http__WEBPACK_IMPORTED_MODULE_1__["Headers"]({ 'Content-Type': 'application/json', 'Accept': 'q=0.8;application/json;q=0.9' });
        this.options = new _angular_http__WEBPACK_IMPORTED_MODULE_1__["RequestOptions"]({ headers: this.headers });
        this.url = this._apiSettings.getUrl();
    }
    LCRService.prototype.get_allOffers = function () {
        return this._http
            .get(this.url + 'lcr/offers')
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["map"])(function (res) { return res.json(); }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["catchError"])(this.handleError));
    };
    LCRService.prototype.get_specificOffer = function (carrier_id) {
        return this._http
            .get(this.url + '/lcr/offers/' + carrier_id)
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["map"])(function (res) { return res.json(); }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["catchError"])(this.handleError));
    };
    LCRService.prototype.get_allCarriers = function () {
        return this._http
            .get(this.url + 'lcr/providers')
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["map"])(function (res) { return res.json(); }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["catchError"])(this.handleError));
    };
    LCRService.prototype.get_allTrunks = function () {
        return this._http
            .get(this.url + 'lcr/trunks')
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["map"])(function (res) { return res.json(); }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["catchError"])(this.handleError));
    };
    LCRService.prototype.get_allRatecards = function () {
        return this._http
            .get(this.url + 'lcr/ratecards')
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["map"])(function (res) { return res.json(); }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["catchError"])(this.handleError));
    };
    LCRService.prototype.get_ratesInRatecard = function (ratecard_id) {
        return this._http
            .get(this.url + 'lcr/ratecards/' + ratecard_id + '/rates')
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["map"])(function (res) { return res.json(); }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["catchError"])(this.handleError));
    };
    LCRService.prototype.handleError = function (error) {
        console.error(error);
    };
    LCRService = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])(),
        __metadata("design:paramtypes", [_angular_http__WEBPACK_IMPORTED_MODULE_1__["Http"],
            _services_global_api_settings_shared_service__WEBPACK_IMPORTED_MODULE_3__["ApiSettingsSharedService"]])
    ], LCRService);
    return LCRService;
}());



/***/ }),

/***/ "./src/app/shared/api-services/ratecard/importer.api.service.ts":
/*!**********************************************************************!*\
  !*** ./src/app/shared/api-services/ratecard/importer.api.service.ts ***!
  \**********************************************************************/
/*! exports provided: ImporterService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ImporterService", function() { return ImporterService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_http__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/http */ "./node_modules/@angular/http/fesm5/http.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _services_ratecard_importer_shared_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./../../services/ratecard/importer.shared.service */ "./src/app/shared/services/ratecard/importer.shared.service.ts");
/* harmony import */ var _shared_services_global_api_settings_shared_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./../../../shared/services/global/api-settings.shared.service */ "./src/app/shared/services/global/api-settings.shared.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var ImporterService = /** @class */ (function () {
    function ImporterService(_http, _importer, _apiSettings) {
        this._http = _http;
        this._importer = _importer;
        this._apiSettings = _apiSettings;
        this.headers = new _angular_http__WEBPACK_IMPORTED_MODULE_1__["Headers"]({ 'Content-Type': 'application/json', 'Accept': 'q=0.8;application/json;q=0.9' });
        this.options = new _angular_http__WEBPACK_IMPORTED_MODULE_1__["RequestOptions"]({ headers: this.headers });
        this.url = this._apiSettings.getUrl();
    }
    ImporterService.prototype.post_AddRateCard = function (body) {
        var _this = this;
        return this._http
            .post(this.url + 'ratecards/', body)
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["map"])(function (res) { return res.json(); }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["catchError"])(this.handleError), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["tap"])(function (res) { _this._importer.changePostTableObj(res); }));
    };
    ImporterService.prototype.put_EditRates = function (ratesId, body) {
        return this._http
            .put(this.url + 'rates/' + ratesId, body)
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["map"])(function (res) { return res.json(); }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["catchError"])(this.handleError));
    };
    ImporterService.prototype.put_EditTeleUDatabase = function (teleuId, body) {
        return this._http
            .put(this.url + 'teleu/rate/' + teleuId, body)
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["map"])(function (res) { return res.json(); }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["catchError"])(this.handleError));
    };
    ImporterService.prototype.get_CarrierNames = function () {
        return this._http
            .get(this.url + 'carriers/')
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["map"])(function (res) { return res.json(); }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["catchError"])(this.handleError));
    };
    ImporterService.prototype.handleError = function (error) {
        console.error(error);
    };
    ImporterService = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])(),
        __metadata("design:paramtypes", [_angular_http__WEBPACK_IMPORTED_MODULE_1__["Http"],
            _services_ratecard_importer_shared_service__WEBPACK_IMPORTED_MODULE_3__["ImporterSharedService"],
            _shared_services_global_api_settings_shared_service__WEBPACK_IMPORTED_MODULE_4__["ApiSettingsSharedService"]])
    ], ImporterService);
    return ImporterService;
}());



/***/ }),

/***/ "./src/app/shared/api-services/ratecard/rate-cards.api.service.ts":
/*!************************************************************************!*\
  !*** ./src/app/shared/api-services/ratecard/rate-cards.api.service.ts ***!
  \************************************************************************/
/*! exports provided: RateCardsService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RateCardsService", function() { return RateCardsService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_http__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/http */ "./node_modules/@angular/http/fesm5/http.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _services_global_api_settings_shared_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./../../services/global/api-settings.shared.service */ "./src/app/shared/services/global/api-settings.shared.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var RateCardsService = /** @class */ (function () {
    function RateCardsService(_http, _apiSettings) {
        this._http = _http;
        this._apiSettings = _apiSettings;
        this.headers = new _angular_http__WEBPACK_IMPORTED_MODULE_1__["Headers"]({ 'Content-Type': 'application/json', 'Accept': 'q=0.8;application/json;q=0.9' });
        this.options = new _angular_http__WEBPACK_IMPORTED_MODULE_1__["RequestOptions"]({ headers: this.headers });
        this.url = this._apiSettings.getUrl();
    }
    RateCardsService.prototype.get_ratecard = function () {
        return this._http
            .get(this.url + 'ratecards/?active=1')
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["map"])(function (res) { return res.json(); }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["catchError"])(this.handleError));
    };
    RateCardsService.prototype.get_ratesInRatecard = function (ratecardId) {
        return this._http
            .get(this.url + 'ratecards/' + ratecardId + '/rates')
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["map"])(function (res) { return res.json(); }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["catchError"])(this.handleError));
    };
    RateCardsService.prototype.get_specificRatecard = function (ratecardId) {
        return this._http
            .get(this.url + 'ratecards/' + ratecardId)
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["map"])(function (res) { return res.json(); }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["catchError"])(this.handleError));
    };
    RateCardsService.prototype.get_ratesByCountry = function (isoCode) {
        return this._http
            .get(this.url + 'carriers/ratecards/rates/' + isoCode + '?active=1')
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["map"])(function (res) { return res.json(); }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["catchError"])(this.handleError));
    };
    RateCardsService.prototype.post_addRatecard = function (body) {
        return this._http
            .post(this.url + 'ratecards/', body)
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["catchError"])(this.handleError));
    };
    RateCardsService.prototype.del_deleteRatecard = function (rowId) {
        return this._http
            .delete(this.url + 'ratecards/' + rowId)
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["catchError"])(this.handleError));
    };
    RateCardsService.prototype.put_editRatecard = function (body, rowID) {
        return this._http
            .put(this.url + 'ratecards/' + rowID, body)
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["catchError"])(this.handleError));
    };
    RateCardsService.prototype.post_AttachTrunk = function (ratecardId, trunkId) {
        var body = {};
        return this._http
            .post(this.url + 'ratecards/' + ratecardId + '/trunks/' + trunkId, body)
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["catchError"])(this.handleError));
    };
    RateCardsService.prototype.del_DetachTrunk = function (ratecardId, trunkId) {
        var body = {};
        return this._http
            .delete(this.url + 'ratecards/' + ratecardId + '/trunks/' + trunkId, body)
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["catchError"])(this.handleError));
    };
    RateCardsService.prototype.put_EditRates = function (ratesId, body) {
        return this._http
            .put(this.url + 'rates/' + ratesId, body)
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["catchError"])(this.handleError));
    };
    RateCardsService.prototype.put_EditTeleuDbRates = function (teleuDbRatesId, body) {
        return this._http
            .put(this.url + '/teleu/rate/' + teleuDbRatesId, body)
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["catchError"])(this.handleError));
    };
    RateCardsService.prototype.handleError = function (error) {
        console.error(error);
    };
    RateCardsService = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])(),
        __metadata("design:paramtypes", [_angular_http__WEBPACK_IMPORTED_MODULE_1__["Http"],
            _services_global_api_settings_shared_service__WEBPACK_IMPORTED_MODULE_3__["ApiSettingsSharedService"]])
    ], RateCardsService);
    return RateCardsService;
}());



/***/ }),

/***/ "./src/app/shared/api-services/trunk/trunks.api.service.ts":
/*!*****************************************************************!*\
  !*** ./src/app/shared/api-services/trunk/trunks.api.service.ts ***!
  \*****************************************************************/
/*! exports provided: TrunksService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TrunksService", function() { return TrunksService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_http__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/http */ "./node_modules/@angular/http/fesm5/http.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _services_global_api_settings_shared_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./../../services/global/api-settings.shared.service */ "./src/app/shared/services/global/api-settings.shared.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var TrunksService = /** @class */ (function () {
    function TrunksService(_http, _apiSettings) {
        this._http = _http;
        this._apiSettings = _apiSettings;
        this.url = this._apiSettings.getUrl();
    }
    TrunksService.prototype.get_allTrunks = function () {
        return this._http
            .get(this.url + 'trunks')
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["map"])(function (res) { return res.json(); }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["catchError"])(this.handleError));
    };
    TrunksService.prototype.get_specificTrunk = function (trunkId) {
        return this._http
            .get(this.url + 'trunks/' + trunkId)
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["map"])(function (res) { return res.json(); }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["catchError"])(this.handleError));
    };
    TrunksService.prototype.post_addTrunk = function (body) {
        return this._http
            .post(this.url + 'trunks', body)
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["catchError"])(this.handleError));
    };
    TrunksService.prototype.del_deleteTrunk = function (trunkId) {
        return this._http
            .delete(this.url + 'trunks/' + trunkId)
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["catchError"])(this.handleError));
    };
    TrunksService.prototype.put_editTrunk = function (trunkId, body) {
        return this._http
            .put(this.url + 'trunks/' + trunkId, body)
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["catchError"])(this.handleError));
    };
    TrunksService.prototype.handleError = function (error) {
        console.error(error);
    };
    TrunksService = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])(),
        __metadata("design:paramtypes", [_angular_http__WEBPACK_IMPORTED_MODULE_1__["Http"],
            _services_global_api_settings_shared_service__WEBPACK_IMPORTED_MODULE_3__["ApiSettingsSharedService"]])
    ], TrunksService);
    return TrunksService;
}());



/***/ }),

/***/ "./src/app/shared/components/snackbars/error/error.snackbar.component.html":
/*!*********************************************************************************!*\
  !*** ./src/app/shared/components/snackbars/error/error.snackbar.component.html ***!
  \*********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<section>\n\n    <div class='top-container'>\n      <i class=\"fas fa-exclamation-circle\"></i> <span>Error!</span>\n    </div>\n  \n    <div class='bottom-container'>\n      <span> {{data}} </span>\n    </div>\n  \n  </section>"

/***/ }),

/***/ "./src/app/shared/components/snackbars/error/error.snackbar.component.scss":
/*!*********************************************************************************!*\
  !*** ./src/app/shared/components/snackbars/error/error.snackbar.component.scss ***!
  \*********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "/deep/ .snackbar-error-container {\n  background-color: #F44336; }\n\nsection .top-container {\n  height: 2em; }\n\nsection .top-container .fa-exclamation-circle {\n    font-size: 1.8em;\n    float: left; }\n\nsection .top-container span {\n    line-height: 1.8em;\n    margin-left: 1em;\n    font-size: 1.2em;\n    font-weight: bold; }\n\nsection .bottom-container {\n  height: 2em; }\n\nsection .bottom-container span {\n    line-height: 3em;\n    font-size: .9em; }\n"

/***/ }),

/***/ "./src/app/shared/components/snackbars/error/error.snackbar.component.ts":
/*!*******************************************************************************!*\
  !*** ./src/app/shared/components/snackbars/error/error.snackbar.component.ts ***!
  \*******************************************************************************/
/*! exports provided: ErrorSnackbarComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ErrorSnackbarComponent", function() { return ErrorSnackbarComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm5/material.es5.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (undefined && undefined.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};


var ErrorSnackbarComponent = /** @class */ (function () {
    function ErrorSnackbarComponent(data) {
        this.data = data;
    }
    ErrorSnackbarComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            template: __webpack_require__(/*! ./error.snackbar.component.html */ "./src/app/shared/components/snackbars/error/error.snackbar.component.html"),
            styles: [__webpack_require__(/*! ./error.snackbar.component.scss */ "./src/app/shared/components/snackbars/error/error.snackbar.component.scss")],
        }),
        __param(0, Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Inject"])(_angular_material__WEBPACK_IMPORTED_MODULE_1__["MAT_SNACK_BAR_DATA"])),
        __metadata("design:paramtypes", [Object])
    ], ErrorSnackbarComponent);
    return ErrorSnackbarComponent;
}());



/***/ }),

/***/ "./src/app/shared/components/snackbars/success/success.snackbar.component.html":
/*!*************************************************************************************!*\
  !*** ./src/app/shared/components/snackbars/success/success.snackbar.component.html ***!
  \*************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<section>\n\n    <div class='top-container'>\n      <i class=\"far fa-check-circle\"></i> <span>Success!</span>\n    </div>\n  \n    <div class='bottom-container'>\n      <span> {{data}} </span>\n    </div>\n  \n  </section>"

/***/ }),

/***/ "./src/app/shared/components/snackbars/success/success.snackbar.component.scss":
/*!*************************************************************************************!*\
  !*** ./src/app/shared/components/snackbars/success/success.snackbar.component.scss ***!
  \*************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "/deep/ .snackbar-success-container {\n  background-color: #4CAF50; }\n\nsection .top-container {\n  height: 2em; }\n\nsection .top-container .fa-check-circle {\n    font-size: 1.8em;\n    float: left; }\n\nsection .top-container span {\n    line-height: 1.8em;\n    margin-left: 1em;\n    font-size: 1.2em;\n    font-weight: bold; }\n\nsection .bottom-container {\n  height: 2em; }\n\nsection .bottom-container span {\n    line-height: 3em;\n    font-size: .9em; }\n"

/***/ }),

/***/ "./src/app/shared/components/snackbars/success/success.snackbar.component.ts":
/*!***********************************************************************************!*\
  !*** ./src/app/shared/components/snackbars/success/success.snackbar.component.ts ***!
  \***********************************************************************************/
/*! exports provided: SuccessSnackbarComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SuccessSnackbarComponent", function() { return SuccessSnackbarComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm5/material.es5.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (undefined && undefined.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};


var SuccessSnackbarComponent = /** @class */ (function () {
    function SuccessSnackbarComponent(data) {
        this.data = data;
    }
    SuccessSnackbarComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            template: __webpack_require__(/*! ./success.snackbar.component.html */ "./src/app/shared/components/snackbars/success/success.snackbar.component.html"),
            styles: [__webpack_require__(/*! ./success.snackbar.component.scss */ "./src/app/shared/components/snackbars/success/success.snackbar.component.scss")],
        }),
        __param(0, Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Inject"])(_angular_material__WEBPACK_IMPORTED_MODULE_1__["MAT_SNACK_BAR_DATA"])),
        __metadata("design:paramtypes", [Object])
    ], SuccessSnackbarComponent);
    return SuccessSnackbarComponent;
}());



/***/ }),

/***/ "./src/app/shared/services/callplan/attach-callplan-codes.shared.service.ts":
/*!**********************************************************************************!*\
  !*** ./src/app/shared/services/callplan/attach-callplan-codes.shared.service.ts ***!
  \**********************************************************************************/
/*! exports provided: CodesFormSharedService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CodesFormSharedService", function() { return CodesFormSharedService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var CodesFormSharedService = /** @class */ (function () {
    function CodesFormSharedService() {
    }
    CodesFormSharedService.prototype.provideStatus = function () {
        return [
            { value: 'available' },
            { value: 'unavailable' },
            { value: 'deleted' },
            { value: 'staged' },
            { value: 'pending' }
        ];
    };
    CodesFormSharedService.prototype.provideCallplanPlanType = function () {
        return [
            { name: 'Unlimited', value: 'UNLIMITED_CALL_PLAN' },
            { name: 'Pay As You Go', value: 'PAY_AS_YOU_GO_CALL_PLAN' },
            { name: 'Minutes', value: 'MINUTES_CALL_PLAN' }
        ];
    };
    CodesFormSharedService.prototype.provideActiveWhen = function () {
        return [
            { name: 'Activated Immediately', value: 'IMMEDIATELY' },
            { name: 'Activated on a successful call', value: 'SUCCESS_CALL' }
        ];
    };
    CodesFormSharedService.prototype.providePromotion = function () {
        return [
            { name: 'Yes', value: true },
            { name: 'No', value: false }
        ];
    };
    CodesFormSharedService.prototype.provideCodePlanTypes = function () {
        return [
            { code: 0, name: 'Pay as you go' },
            { code: 1, name: 'Unlimited plan' },
            { code: 2, name: 'Minute plan' },
            { code: 3, name: 'Money plan' }
        ];
    };
    CodesFormSharedService.prototype.providePriorityList = function () {
        return [
            { num: 1 },
            { num: 2 },
            { num: 3 },
            { num: 4 },
            { num: 5 },
            { num: 6 },
            { num: 7 },
            { num: 8 },
            { num: 9 }
        ];
    };
    CodesFormSharedService = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])()
    ], CodesFormSharedService);
    return CodesFormSharedService;
}());



/***/ }),

/***/ "./src/app/shared/services/callplan/call-plan.shared.service.ts":
/*!**********************************************************************!*\
  !*** ./src/app/shared/services/callplan/call-plan.shared.service.ts ***!
  \**********************************************************************/
/*! exports provided: CallPlanSharedService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CallPlanSharedService", function() { return CallPlanSharedService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};


var CallPlanSharedService = /** @class */ (function () {
    function CallPlanSharedService() {
        // Passing rowIdAll from callplan-all-table => delete dialog
        this.rowAllSource = new rxjs__WEBPACK_IMPORTED_MODULE_1__["BehaviorSubject"](0);
        this.currentRowAll = this.rowAllSource.asObservable();
        // Passing rowObj Ratecards from callplan-ratecards-table => dettach ratecards dialog
        this.rowRatecardsObjSource = new rxjs__WEBPACK_IMPORTED_MODULE_1__["BehaviorSubject"]({});
        this.currentRatecardsObj = this.rowRatecardsObjSource.asObservable();
        // Passing rowObj codes from callplan-ratecards-table => dettach ratecards dialog
        this.rowCodesObjSource = new rxjs__WEBPACK_IMPORTED_MODULE_1__["BehaviorSubject"]({});
        this.currentCodesObj = this.rowCodesObjSource.asObservable();
        // Passing Call Plan Object
        this.callPlanObjSource = new rxjs__WEBPACK_IMPORTED_MODULE_1__["BehaviorSubject"]({});
        this.currentCallPlanObj = this.callPlanObjSource.asObservable();
    }
    CallPlanSharedService.prototype.changeRowAll = function (rowAllId) {
        this.rowAllSource.next(rowAllId);
    };
    CallPlanSharedService.prototype.changeRowRatecards = function (rowRatecardsObj) {
        this.rowRatecardsObjSource.next(rowRatecardsObj);
    };
    CallPlanSharedService.prototype.changeRowCodes = function (rowCodesObj) {
        this.rowCodesObjSource.next(rowCodesObj);
    };
    CallPlanSharedService.prototype.changeCallPlanObj = function (callPlanObj) {
        this.callPlanObjSource.next(callPlanObj);
    };
    CallPlanSharedService = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])()
    ], CallPlanSharedService);
    return CallPlanSharedService;
}());



/***/ }),

/***/ "./src/app/shared/services/carrier/carrier.shared.service.ts":
/*!*******************************************************************!*\
  !*** ./src/app/shared/services/carrier/carrier.shared.service.ts ***!
  \*******************************************************************/
/*! exports provided: CarrierSharedService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CarrierSharedService", function() { return CarrierSharedService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};


var CarrierSharedService = /** @class */ (function () {
    function CarrierSharedService() {
        // example of services to communicate between sibling components
        // https://angularfirebase.com/lessons/sharing-data-between-angular-components-four-methods/
        // https://stackblitz.com/edit/sharing-data-any-comp?file=main.ts <- simplified example
        // Passing rowID from carrier-table => delete dialog
        this.rowObjSource = new rxjs__WEBPACK_IMPORTED_MODULE_1__["BehaviorSubject"]({});
        this.currentRowObj = this.rowObjSource.asObservable();
    }
    CarrierSharedService.prototype.changeRowObj = function (rowId) {
        this.rowObjSource.next(rowId);
        console.log('updated rowId: ' + rowId);
    };
    CarrierSharedService = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])()
    ], CarrierSharedService);
    return CarrierSharedService;
}());



/***/ }),

/***/ "./src/app/shared/services/global/api-settings.shared.service.ts":
/*!***********************************************************************!*\
  !*** ./src/app/shared/services/global/api-settings.shared.service.ts ***!
  \***********************************************************************/
/*! exports provided: ApiSettingsSharedService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ApiSettingsSharedService", function() { return ApiSettingsSharedService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var ApiSettingsSharedService = /** @class */ (function () {
    function ApiSettingsSharedService() {
    }
    ApiSettingsSharedService.prototype.getUrl = function () {
        var url = 'http://172.20.13.129:8943/';
        return url;
    };
    ApiSettingsSharedService = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])()
    ], ApiSettingsSharedService);
    return ApiSettingsSharedService;
}());



/***/ }),

/***/ "./src/app/shared/services/global/buttonStates.shared.service.ts":
/*!***********************************************************************!*\
  !*** ./src/app/shared/services/global/buttonStates.shared.service.ts ***!
  \***********************************************************************/
/*! exports provided: ToggleButtonStateService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ToggleButtonStateService", function() { return ToggleButtonStateService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var ToggleButtonStateService = /** @class */ (function () {
    function ToggleButtonStateService() {
        this.toggleButtonStates = function (gridSelectionStatus) {
            return gridSelectionStatus > 0 ? false : true;
        };
    }
    ToggleButtonStateService = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])()
    ], ToggleButtonStateService);
    return ToggleButtonStateService;
}());



/***/ }),

/***/ "./src/app/shared/services/global/codes.shared.service.ts":
/*!****************************************************************!*\
  !*** ./src/app/shared/services/global/codes.shared.service.ts ***!
  \****************************************************************/
/*! exports provided: CodesSharedService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CodesSharedService", function() { return CodesSharedService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var CodesSharedService = /** @class */ (function () {
    function CodesSharedService() {
    }
    CodesSharedService.prototype.getCountryCodes = function () {
        return [
            {
                'country': 'All',
                'code': '0'
            },
            {
                'country': 'Afghanistan',
                'code': '93'
            },
            {
                'country': 'Albania',
                'code': '355'
            },
            {
                'country': 'Algeria',
                'code': '213'
            },
            {
                'country': 'American Samoa',
                'code': '1684'
            },
            {
                'country': 'Andorra',
                'code': '376'
            },
            {
                'country': 'Angola',
                'code': '244'
            },
            {
                'country': 'Anguilla',
                'code': '1264'
            },
            {
                'country': 'Antarctica',
                'code': '672'
            },
            {
                'country': 'Antigua and Barbuda',
                'code': '1268'
            },
            {
                'country': 'Argentina',
                'code': '54'
            },
            {
                'country': 'Armenia',
                'code': '374'
            },
            {
                'country': 'Aruba',
                'code': '297'
            },
            {
                'country': 'Australia',
                'code': '61'
            },
            {
                'country': 'Austria',
                'code': '43'
            },
            {
                'country': 'Azerbaijan',
                'code': '994'
            },
            {
                'country': 'Bahamas',
                'code': '1242'
            },
            {
                'country': 'Bahrain',
                'code': '973'
            },
            {
                'country': 'Bangladesh',
                'code': '880'
            },
            {
                'country': 'Barbados',
                'code': '1246'
            },
            {
                'country': 'Belarus',
                'code': '375'
            },
            {
                'country': 'Belgium',
                'code': '32'
            },
            {
                'country': 'Belize',
                'code': '501'
            },
            {
                'country': 'Benin',
                'code': '229'
            },
            {
                'country': 'Bermuda',
                'code': '1441'
            },
            {
                'country': 'Bhutan',
                'code': '975'
            },
            {
                'country': 'Bolivia',
                'code': '591'
            },
            {
                'country': 'Bosnia and Herzegovina',
                'code': '387'
            },
            {
                'country': 'Botswana',
                'code': '267'
            },
            {
                'country': 'Brazil',
                'code': '55'
            },
            {
                'country': 'British Indian Ocean Territory',
                'code': '246'
            },
            {
                'country': 'British Virgin Islands',
                'code': '1284'
            },
            {
                'country': 'Brunei',
                'code': '673'
            },
            {
                'country': 'Bulgaria',
                'code': '359'
            },
            {
                'country': 'Burkina Faso',
                'code': '226'
            },
            {
                'country': 'Burundi',
                'code': '257'
            },
            {
                'country': 'Cambodia',
                'code': '855'
            },
            {
                'country': 'Cameroon',
                'code': '237'
            },
            {
                'country': 'Canada',
                'code': '1'
            },
            {
                'country': 'Cape Verde',
                'code': '238'
            },
            {
                'country': 'Cayman Islands',
                'code': '1345'
            },
            {
                'country': 'Central African Republic',
                'code': '236'
            },
            {
                'country': 'Chad',
                'code': '235'
            },
            {
                'country': 'Chile',
                'code': '56'
            },
            {
                'country': 'China',
                'code': '86'
            },
            {
                'country': 'Christmas Island',
                'code': '61'
            },
            {
                'country': 'Cocos Islands',
                'code': '61'
            },
            {
                'country': 'Colombia',
                'code': '57'
            },
            {
                'country': 'Comoros',
                'code': '269'
            },
            {
                'country': 'Cook Islands',
                'code': '682'
            },
            {
                'country': 'Costa Rica',
                'code': '506'
            },
            {
                'country': 'Croatia',
                'code': '385'
            },
            {
                'country': 'Cuba',
                'code': '53'
            },
            {
                'country': 'Curacao',
                'code': '599'
            },
            {
                'country': 'Cyprus',
                'code': '357'
            },
            {
                'country': 'Czech Republic',
                'code': '420'
            },
            {
                'country': 'Democratic Republic of the Congo',
                'code': '243'
            },
            {
                'country': 'Denmark',
                'code': '45'
            },
            {
                'country': 'Djibouti',
                'code': '253'
            },
            {
                'country': 'Dominica',
                'code': '1767'
            },
            {
                'country': 'Dominican Republic',
                'code': '1809, 1829, 1849'
            },
            {
                'country': 'East Timor',
                'code': '670'
            },
            {
                'country': 'Ecuador',
                'code': '593'
            },
            {
                'country': 'Egypt',
                'code': '20'
            },
            {
                'country': 'El Salvador',
                'code': '503'
            },
            {
                'country': 'Equatorial Guinea',
                'code': '240'
            },
            {
                'country': 'Eritrea',
                'code': '291'
            },
            {
                'country': 'Estonia',
                'code': '372'
            },
            {
                'country': 'Ethiopia',
                'code': '251'
            },
            {
                'country': 'Falkland Islands',
                'code': '500'
            },
            {
                'country': 'Faroe Islands',
                'code': '298'
            },
            {
                'country': 'Fiji',
                'code': '679'
            },
            {
                'country': 'Finland',
                'code': '358'
            },
            {
                'country': 'France',
                'code': '33'
            },
            {
                'country': 'French Polynesia',
                'code': '689'
            },
            {
                'country': 'Gabon',
                'code': '241'
            },
            {
                'country': 'Gambia',
                'code': '220'
            },
            {
                'country': 'Georgia',
                'code': '995'
            },
            {
                'country': 'Germany',
                'code': '49'
            },
            {
                'country': 'Ghana',
                'code': '233'
            },
            {
                'country': 'Gibraltar',
                'code': '350'
            },
            {
                'country': 'Greece',
                'code': '30'
            },
            {
                'country': 'Greenland',
                'code': '299'
            },
            {
                'country': 'Grenada',
                'code': '1473'
            },
            {
                'country': 'Guam',
                'code': '1671'
            },
            {
                'country': 'Guatemala',
                'code': '502'
            },
            {
                'country': 'Guernsey',
                'code': '441481'
            },
            {
                'country': 'Guinea',
                'code': '224'
            },
            {
                'country': 'GuineaBissau',
                'code': '245'
            },
            {
                'country': 'Guyana',
                'code': '592'
            },
            {
                'country': 'Haiti',
                'code': '509'
            },
            {
                'country': 'Honduras',
                'code': '504'
            },
            {
                'country': 'Hong Kong',
                'code': '852'
            },
            {
                'country': 'Hungary',
                'code': '36'
            },
            {
                'country': 'Iceland',
                'code': '354'
            },
            {
                'country': 'India',
                'code': '91'
            },
            {
                'country': 'Indonesia',
                'code': '62'
            },
            {
                'country': 'Iran',
                'code': '98'
            },
            {
                'country': 'Iraq',
                'code': '964'
            },
            {
                'country': 'Ireland',
                'code': '353'
            },
            {
                'country': 'Isle of Man',
                'code': '441624'
            },
            {
                'country': 'Israel',
                'code': '972'
            },
            {
                'country': 'Italy',
                'code': '39'
            },
            {
                'country': 'Ivory Coast',
                'code': '225'
            },
            {
                'country': 'Jamaica',
                'code': '1876'
            },
            {
                'country': 'Japan',
                'code': '81'
            },
            {
                'country': 'Jersey',
                'code': '441534'
            },
            {
                'country': 'Jordan',
                'code': '962'
            },
            {
                'country': 'Kazakhstan',
                'code': '7'
            },
            {
                'country': 'Kenya',
                'code': '254'
            },
            {
                'country': 'Kiribati',
                'code': '686'
            },
            {
                'country': 'Kosovo',
                'code': '383'
            },
            {
                'country': 'Kuwait',
                'code': '965'
            },
            {
                'country': 'Kyrgyzstan',
                'code': '996'
            },
            {
                'country': 'Laos',
                'code': '856'
            },
            {
                'country': 'Latvia',
                'code': '371'
            },
            {
                'country': 'Lebanon',
                'code': '961'
            },
            {
                'country': 'Lesotho',
                'code': '266'
            },
            {
                'country': 'Liberia',
                'code': '231'
            },
            {
                'country': 'Libya',
                'code': '218'
            },
            {
                'country': 'Liechtenstein',
                'code': '423'
            },
            {
                'country': 'Lithuania',
                'code': '370'
            },
            {
                'country': 'Luxembourg',
                'code': '352'
            },
            {
                'country': 'Macau',
                'code': '853'
            },
            {
                'country': 'Macedonia',
                'code': '389'
            },
            {
                'country': 'Madagascar',
                'code': '261'
            },
            {
                'country': 'Malawi',
                'code': '265'
            },
            {
                'country': 'Malaysia',
                'code': '60'
            },
            {
                'country': 'Maldives',
                'code': '960'
            },
            {
                'country': 'Mali',
                'code': '223'
            },
            {
                'country': 'Malta',
                'code': '356'
            },
            {
                'country': 'Marshall Islands',
                'code': '692'
            },
            {
                'country': 'Mauritania',
                'code': '222'
            },
            {
                'country': 'Mauritius',
                'code': '230'
            },
            {
                'country': 'Mayotte',
                'code': '262'
            },
            {
                'country': 'Mexico',
                'code': '52'
            },
            {
                'country': 'Micronesia',
                'code': '691'
            },
            {
                'country': 'Moldova',
                'code': '373'
            },
            {
                'country': 'Monaco',
                'code': '377'
            },
            {
                'country': 'Mongolia',
                'code': '976'
            },
            {
                'country': 'Montenegro',
                'code': '382'
            },
            {
                'country': 'Montserrat',
                'code': '1664'
            },
            {
                'country': 'Morocco',
                'code': '212'
            },
            {
                'country': 'Mozambique',
                'code': '258'
            },
            {
                'country': 'Myanmar',
                'code': '95'
            },
            {
                'country': 'Namibia',
                'code': '264'
            },
            {
                'country': 'Nauru',
                'code': '674'
            },
            {
                'country': 'Nepal',
                'code': '977'
            },
            {
                'country': 'Netherlands',
                'code': '31'
            },
            {
                'country': 'Netherlands Antilles',
                'code': '599'
            },
            {
                'country': 'New Caledonia',
                'code': '687'
            },
            {
                'country': 'New Zealand',
                'code': '64'
            },
            {
                'country': 'Nicaragua',
                'code': '505'
            },
            {
                'country': 'Niger',
                'code': '227'
            },
            {
                'country': 'Nigeria',
                'code': '234'
            },
            {
                'country': 'Niue',
                'code': '683'
            },
            {
                'country': 'North Korea',
                'code': '850'
            },
            {
                'country': 'Northern Mariana Islands',
                'code': '1670'
            },
            {
                'country': 'Norway',
                'code': '47'
            },
            {
                'country': 'Oman',
                'code': '968'
            },
            {
                'country': 'Pakistan',
                'code': '92'
            },
            {
                'country': 'Palau',
                'code': '680'
            },
            {
                'country': 'Palestine',
                'code': '970'
            },
            {
                'country': 'Panama',
                'code': '507'
            },
            {
                'country': 'Papua New Guinea',
                'code': '675'
            },
            {
                'country': 'Paraguay',
                'code': '595'
            },
            {
                'country': 'Peru',
                'code': '51'
            },
            {
                'country': 'Philippines',
                'code': '63'
            },
            {
                'country': 'Pitcairn',
                'code': '64'
            },
            {
                'country': 'Poland',
                'code': '48'
            },
            {
                'country': 'Portugal',
                'code': '351'
            },
            {
                'country': 'Puerto Rico',
                'code': '1787, 1939'
            },
            {
                'country': 'Qatar',
                'code': '974'
            },
            {
                'country': 'Republic of the Congo',
                'code': '242'
            },
            {
                'country': 'Reunion',
                'code': '262'
            },
            {
                'country': 'Romania',
                'code': '40'
            },
            {
                'country': 'Russia',
                'code': '7'
            },
            {
                'country': 'Rwanda',
                'code': '250'
            },
            {
                'country': 'Saint Barthelemy',
                'code': '590'
            },
            {
                'country': 'Saint Helena',
                'code': '290'
            },
            {
                'country': 'Saint Kitts and Nevis',
                'code': '1869'
            },
            {
                'country': 'Saint Lucia',
                'code': '1758'
            },
            {
                'country': 'Saint Martin',
                'code': '590'
            },
            {
                'country': 'Saint Pierre and Miquelon',
                'code': '508'
            },
            {
                'country': 'Saint Vincent and the Grenadines',
                'code': '1784'
            },
            {
                'country': 'Samoa',
                'code': '685'
            },
            {
                'country': 'San Marino',
                'code': '378'
            },
            {
                'country': 'Sao Tome and Principe',
                'code': '239'
            },
            {
                'country': 'Saudi Arabia',
                'code': '966'
            },
            {
                'country': 'Senegal',
                'code': '221'
            },
            {
                'country': 'Serbia',
                'code': '381'
            },
            {
                'country': 'Seychelles',
                'code': '248'
            },
            {
                'country': 'Sierra Leone',
                'code': '232'
            },
            {
                'country': 'Singapore',
                'code': '65'
            },
            {
                'country': 'Sint Maarten',
                'code': '1721'
            },
            {
                'country': 'Slovakia',
                'code': '421'
            },
            {
                'country': 'Slovenia',
                'code': '386'
            },
            {
                'country': 'Solomon Islands',
                'code': '677'
            },
            {
                'country': 'Somalia',
                'code': '252'
            },
            {
                'country': 'South Africa',
                'code': '27'
            },
            {
                'country': 'South Korea',
                'code': '82'
            },
            {
                'country': 'South Sudan',
                'code': '211'
            },
            {
                'country': 'Spain',
                'code': '34'
            },
            {
                'country': 'Sri Lanka',
                'code': '94'
            },
            {
                'country': 'Sudan',
                'code': '249'
            },
            {
                'country': 'Suriname',
                'code': '597'
            },
            {
                'country': 'Svalbard and Jan Mayen',
                'code': '47'
            },
            {
                'country': 'Swaziland',
                'code': '268'
            },
            {
                'country': 'Sweden',
                'code': '46'
            },
            {
                'country': 'Switzerland',
                'code': '41'
            },
            {
                'country': 'Syria',
                'code': '963'
            },
            {
                'country': 'Taiwan',
                'code': '886'
            },
            {
                'country': 'Tajikistan',
                'code': '992'
            },
            {
                'country': 'Tanzania',
                'code': '255'
            },
            {
                'country': 'Thailand',
                'code': '66'
            },
            {
                'country': 'Togo',
                'code': '228'
            },
            {
                'country': 'Tokelau',
                'code': '690'
            },
            {
                'country': 'Tonga',
                'code': '676'
            },
            {
                'country': 'Trinidad and Tobago',
                'code': '1868'
            },
            {
                'country': 'Tunisia',
                'code': '216'
            },
            {
                'country': 'Turkey',
                'code': '90'
            },
            {
                'country': 'Turkmenistan',
                'code': '993'
            },
            {
                'country': 'Turks and Caicos Islands',
                'code': '1649'
            },
            {
                'country': 'Tuvalu',
                'code': '688'
            },
            {
                'country': 'U.S. Virgin Islands',
                'code': '1340'
            },
            {
                'country': 'Uganda',
                'code': '256'
            },
            {
                'country': 'Ukraine',
                'code': '380'
            },
            {
                'country': 'United Arab Emirates',
                'code': '971'
            },
            {
                'country': 'United Kingdom',
                'code': '44'
            },
            {
                'country': 'United States',
                'code': '1'
            },
            {
                'country': 'Uruguay',
                'code': '598'
            },
            {
                'country': 'Uzbekistan',
                'code': '998'
            },
            {
                'country': 'Vanuatu',
                'code': '678'
            },
            {
                'country': 'Vatican',
                'code': '379'
            },
            {
                'country': 'Venezuela',
                'code': '58'
            },
            {
                'country': 'Vietnam',
                'code': '84'
            },
            {
                'country': 'Wallis and Futuna',
                'code': '681'
            },
            {
                'country': 'Western Sahara',
                'code': '212'
            },
            {
                'country': 'Yemen',
                'code': '967'
            },
            {
                'country': 'Zambia',
                'code': '260'
            },
            {
                'country': 'Zimbabwe',
                'code': '263'
            }
        ];
    };
    CodesSharedService = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])()
    ], CodesSharedService);
    return CodesSharedService;
}());



/***/ }),

/***/ "./src/app/shared/services/global/nestedAgGrid.shared.service.ts":
/*!***********************************************************************!*\
  !*** ./src/app/shared/services/global/nestedAgGrid.shared.service.ts ***!
  \***********************************************************************/
/*! exports provided: NestedAgGridService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NestedAgGridService", function() { return NestedAgGridService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var NestedAgGridService = /** @class */ (function () {
    function NestedAgGridService() {
    }
    NestedAgGridService.prototype.formatDataToNestedArr = function (input) {
        var splitName = splitNameStringByPound(input);
        var addFieldData = formJSONWithNewFields(input);
        var groupedData = groupDataByName(addFieldData);
        var formattedData = formNewJSONObj(groupedData);
        var finalData = insertObjInNestedChildrenArr(formattedData, groupedData);
        function splitNameStringByPound(json) {
            return json.map(function (data) { return data.name.split('#'); });
        }
        function formJSONWithNewFields(json) {
            var splitNameFields = splitNameStringByPound(input);
            var insertNewFieldsArrPrivate = [];
            var insertNewFieldsArrTeleU = [];
            for (var i = 0; i < json.length; i++) {
                if (splitNameFields[i][2] === 'private') {
                    insertNewFieldsArrPrivate.push({
                        ratecard_bundle: splitNameFields[i][0] + ': [Private]',
                        name: splitNameFields[i][0],
                        dateAdded: splitNameFields[i][1],
                        offer: splitNameFields[i][2],
                        country: splitNameFields[i][3],
                        id: json[i].id,
                        carrier_id: json[i].carrier_id,
                        carrier_name: json[i].carrier_name,
                        confirmed: json[i].confirmed,
                        active: json[i].active,
                        priority: 1
                    });
                }
                if (splitNameFields[i][2] === 'teleU') {
                    insertNewFieldsArrTeleU.push({
                        ratecard_bundle: splitNameFields[i][0] + ': [TeleU]',
                        name: splitNameFields[i][0],
                        dateAdded: splitNameFields[i][1],
                        offer: splitNameFields[i][2],
                        country: splitNameFields[i][3],
                        id: json[i].id,
                        carrier_id: json[i].carrier_id,
                        carrier_name: json[i].carrier_name,
                        confirmed: json[i].confirmed,
                        active: json[i].active,
                        priority: 1
                    });
                }
            }
            var combinedNewFieldsArr = insertNewFieldsArrPrivate.concat(insertNewFieldsArrTeleU);
            return combinedNewFieldsArr;
        }
        function groupDataByName(json) {
            Array.prototype.groupBy = function (prop) {
                return this.reduce(function (groups, item) {
                    groups[item[prop]] = groups[item[prop]] || [];
                    groups[item[prop]].push(item);
                    return groups;
                }, {});
            };
            var data = json.groupBy('ratecard_bundle');
            var dataArr = [];
            for (var item in data) {
                if (item) {
                    dataArr.push(data[item]);
                }
            }
            return dataArr;
        }
        function formNewJSONObj(groupDataByNameObj) {
            var formattedObj = [];
            for (var i = 0; i < groupDataByNameObj.length; i++) {
                formattedObj.push({
                    ratecard_bundle: groupDataByNameObj[i][0].ratecard_bundle,
                    children: []
                });
            }
            return formattedObj;
        }
        function insertObjInNestedChildrenArr(formattedData, groupedData) {
            for (var i = 0; i < formattedData.length; i++) {
                for (var x = 0; x < groupedData[i].length; x++) {
                    formattedData[i].children.push(groupedData[i][x]);
                }
            }
            return formattedData;
        }
        return finalData;
    };
    NestedAgGridService.prototype.returnSetGroups = function () {
        return function getNodeChildDetails(rowItem) {
            if (rowItem.children) {
                return {
                    group: true,
                    children: rowItem.children,
                    key: rowItem.ratecard_bundle
                };
            }
            else {
                return null;
            }
        };
    };
    NestedAgGridService = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])()
    ], NestedAgGridService);
    return NestedAgGridService;
}());



/***/ }),

/***/ "./src/app/shared/services/global/snackbar.shared.service.ts":
/*!*******************************************************************!*\
  !*** ./src/app/shared/services/global/snackbar.shared.service.ts ***!
  \*******************************************************************/
/*! exports provided: SnackbarSharedService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SnackbarSharedService", function() { return SnackbarSharedService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm5/material.es5.js");
/* harmony import */ var _components_snackbars_success_success_snackbar_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./../../components/snackbars/success/success.snackbar.component */ "./src/app/shared/components/snackbars/success/success.snackbar.component.ts");
/* harmony import */ var _components_snackbars_error_error_snackbar_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./../../components/snackbars/error/error.snackbar.component */ "./src/app/shared/components/snackbars/error/error.snackbar.component.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var SnackbarSharedService = /** @class */ (function () {
    function SnackbarSharedService(snackBar) {
        this.snackBar = snackBar;
    }
    SnackbarSharedService.prototype.snackbar_success = function (msg, duration) {
        this.snackBar.openFromComponent(_components_snackbars_success_success_snackbar_component__WEBPACK_IMPORTED_MODULE_2__["SuccessSnackbarComponent"], {
            duration: duration,
            data: msg,
            horizontalPosition: 'right',
            verticalPosition: 'bottom',
            panelClass: 'snackbar-success-container'
        });
    };
    SnackbarSharedService.prototype.snackbar_error = function (msg, duration) {
        this.snackBar.openFromComponent(_components_snackbars_error_error_snackbar_component__WEBPACK_IMPORTED_MODULE_3__["ErrorSnackbarComponent"], {
            duration: duration,
            data: msg,
            horizontalPosition: 'right',
            verticalPosition: 'bottom',
            panelClass: 'snackbar-error-container'
        });
    };
    SnackbarSharedService.prototype.snackbar_info = function (msg, duration) {
    };
    SnackbarSharedService = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])(),
        __metadata("design:paramtypes", [_angular_material__WEBPACK_IMPORTED_MODULE_1__["MatSnackBar"]])
    ], SnackbarSharedService);
    return SnackbarSharedService;
}());



/***/ }),

/***/ "./src/app/shared/services/lcr/lcr.shared.service.ts":
/*!***********************************************************!*\
  !*** ./src/app/shared/services/lcr/lcr.shared.service.ts ***!
  \***********************************************************/
/*! exports provided: LCRSharedService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LCRSharedService", function() { return LCRSharedService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};


var LCRSharedService = /** @class */ (function () {
    function LCRSharedService() {
        this.source_providerJson = new rxjs__WEBPACK_IMPORTED_MODULE_1__["BehaviorSubject"]([]);
        this.current_providerJson = this.source_providerJson.asObservable();
    }
    LCRSharedService.prototype.change_providerJson = function (trunkJson) {
        this.source_providerJson.next(trunkJson);
    };
    LCRSharedService.prototype.get_rowDataWithProviderName = function (jsonToBeManipulated, providerData) {
        for (var i = 0; i < jsonToBeManipulated.length; i++) {
            for (var x = 0; x < providerData.length; x++) {
                if (jsonToBeManipulated[i].provider_id === providerData[x].id) {
                    Object.assign(jsonToBeManipulated[i], { provider_name: providerData[x].name });
                }
            }
        }
        return jsonToBeManipulated;
    };
    LCRSharedService = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])()
    ], LCRSharedService);
    return LCRSharedService;
}());



/***/ }),

/***/ "./src/app/shared/services/ratecard/importer.shared.service.ts":
/*!*********************************************************************!*\
  !*** ./src/app/shared/services/ratecard/importer.shared.service.ts ***!
  \*********************************************************************/
/*! exports provided: ImporterSharedService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ImporterSharedService", function() { return ImporterSharedService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};


var ImporterSharedService = /** @class */ (function () {
    function ImporterSharedService() {
        this.postTableObjSource = new rxjs__WEBPACK_IMPORTED_MODULE_1__["BehaviorSubject"]([]);
        this.currentPostTableObj = this.postTableObjSource.asObservable();
        this.postRatesCSVAmount = new rxjs__WEBPACK_IMPORTED_MODULE_1__["BehaviorSubject"](0);
        this.currentRatesCSVAmount = this.postRatesCSVAmount.asObservable();
    }
    ImporterSharedService.prototype.changePostTableObj = function (rowArr) {
        this.postTableObjSource.next(rowArr);
        console.log(rowArr);
    };
    ImporterSharedService.prototype.changeRatesCSVAmount = function (ratesAmount) {
        this.postRatesCSVAmount.next(ratesAmount);
        console.log(ratesAmount);
    };
    ImporterSharedService = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])()
    ], ImporterSharedService);
    return ImporterSharedService;
}());



/***/ }),

/***/ "./src/app/shared/services/ratecard/iso-codes.shared.service.ts":
/*!**********************************************************************!*\
  !*** ./src/app/shared/services/ratecard/iso-codes.shared.service.ts ***!
  \**********************************************************************/
/*! exports provided: IsoCodesSharedService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "IsoCodesSharedService", function() { return IsoCodesSharedService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var IsoCodesSharedService = /** @class */ (function () {
    function IsoCodesSharedService() {
    }
    IsoCodesSharedService.prototype.getCountryCodes = function () {
        return [
            {
                'country': 'World',
                'code': 'world',
                'call_code': '000'
            },
            {
                'country': 'Afghanistan',
                'code': 'af',
                'call_code': '93'
            },
            {
                'country': 'Albania',
                'code': 'al',
                'call_code': '355'
            },
            {
                'country': 'Algeria',
                'code': 'dz',
                'call_code': '213'
            },
            {
                'country': 'American Samoa',
                'code': 'as',
                'call_code': '1684'
            },
            {
                'country': 'Andorra',
                'code': 'ad',
                'call_code': '376'
            },
            {
                'country': 'Angola',
                'code': 'ao',
                'call_code': '244'
            },
            {
                'country': 'Anguilla',
                'code': 'ai',
                'call_code': '1264'
            },
            {
                'country': 'Antarctica',
                'code': 'aq',
                'call_code': '672'
            },
            {
                'country': 'Antigua and Barbuda',
                'code': 'ag',
                'call_code': '1268'
            },
            {
                'country': 'Argentina',
                'code': 'ar',
                'call_code': '54'
            },
            {
                'country': 'Armenia',
                'code': 'am',
                'call_code': '374'
            },
            {
                'country': 'Aruba',
                'code': 'aw',
                'call_code': '297'
            },
            {
                'country': 'Australia',
                'code': 'au',
                'call_code': '61'
            },
            {
                'country': 'Austria',
                'code': 'at',
                'call_code': '43'
            },
            {
                'country': 'Azerbaijan',
                'code': 'az',
                'call_code': '994'
            },
            {
                'country': 'Bahamas',
                'code': 'bs',
                'call_code': '1242'
            },
            {
                'country': 'Bahrain',
                'code': 'bh',
                'call_code': '973'
            },
            {
                'country': 'Bangladesh',
                'code': 'bd',
                'call_code': '880'
            },
            {
                'country': 'Barbados',
                'code': 'bb',
                'call_code': '1246'
            },
            {
                'country': 'Belarus',
                'code': 'by',
                'call_code': '375'
            },
            {
                'country': 'Belgium',
                'code': 'be',
                'call_code': '32'
            },
            {
                'country': 'Belize',
                'code': 'bz',
                'call_code': '501'
            },
            {
                'country': 'Benin',
                'code': 'bj',
                'call_code': '229'
            },
            {
                'country': 'Bermuda',
                'code': 'bm',
                'call_code': '1441'
            },
            {
                'country': 'Bhutan',
                'code': 'bt',
                'call_code': '975'
            },
            {
                'country': 'Bolivia',
                'code': 'bo',
                'call_code': '591'
            },
            {
                'country': 'Bosnia and Herzegovina',
                'code': 'ba',
                'call_code': '387'
            },
            {
                'country': 'Botswana',
                'code': 'bw',
                'call_code': '267'
            },
            {
                'country': 'Brazil',
                'code': 'br',
                'call_code': '55'
            },
            {
                'country': 'British Indian Ocean Territory',
                'code': 'io',
                'call_code': '246'
            },
            {
                'country': 'British Virgin Islands',
                'code': 'vg',
                'call_code': '1284'
            },
            {
                'country': 'Brunei',
                'code': 'bn',
                'call_code': '673'
            },
            {
                'country': 'Bulgaria',
                'code': 'bg',
                'call_code': '359'
            },
            {
                'country': 'Burkina Faso',
                'code': 'bf',
                'call_code': '226'
            },
            {
                'country': 'Burundi',
                'code': 'bi',
                'call_code': '257'
            },
            {
                'country': 'Cambodia',
                'code': 'kh',
                'call_code': '855'
            },
            {
                'country': 'Cameroon',
                'code': 'cm',
                'call_code': '237'
            },
            {
                'country': 'Canada',
                'code': 'ca',
                'call_code': '1'
            },
            {
                'country': 'Cape Verde',
                'code': 'cv',
                'call_code': '238'
            },
            {
                'country': 'Cayman Islands',
                'code': 'ky',
                'call_code': '1345'
            },
            {
                'country': 'Central African Republic',
                'code': 'cf',
                'call_code': '236'
            },
            {
                'country': 'Chad',
                'code': 'td',
                'call_code': '235'
            },
            {
                'country': 'Chile',
                'code': 'cl',
                'call_code': '56'
            },
            {
                'country': 'China',
                'code': 'cn',
                'call_code': '86'
            },
            {
                'country': 'Christmas Island',
                'code': 'cx',
                'call_code': '61'
            },
            {
                'country': 'Cocos Islands',
                'code': 'cc',
                'call_code': '61'
            },
            {
                'country': 'Colombia',
                'code': 'co',
                'call_code': '57'
            },
            {
                'country': 'Comoros',
                'code': 'km',
                'call_code': '269'
            },
            {
                'country': 'Cook Islands',
                'code': 'ck',
                'call_code': '682'
            },
            {
                'country': 'Costa Rica',
                'code': 'cr',
                'call_code': '506'
            },
            {
                'country': 'Croatia',
                'code': 'hr',
                'call_code': '385'
            },
            {
                'country': 'Cuba',
                'code': 'cu',
                'call_code': '53'
            },
            {
                'country': 'Curacao',
                'code': 'cw',
                'call_code': '599'
            },
            {
                'country': 'Cyprus',
                'code': 'cy',
                'call_code': '357'
            },
            {
                'country': 'Czech Republic',
                'code': 'cz',
                'call_code': '420'
            },
            {
                'country': 'Democratic Republic of the Congo',
                'code': 'cd',
                'call_code': '243'
            },
            {
                'country': 'Denmark',
                'code': 'dk',
                'call_code': '45'
            },
            {
                'country': 'Djibouti',
                'code': 'dj',
                'call_code': '253'
            },
            {
                'country': 'Dominica',
                'code': 'dm',
                'call_code': '1767'
            },
            {
                'country': 'Dominican Republic',
                'code': 'do',
                'call_code': '1809, 1829, 1849'
            },
            {
                'country': 'East Timor',
                'code': 'tl',
                'call_code': '670'
            },
            {
                'country': 'Ecuador',
                'code': 'ec',
                'call_code': '593'
            },
            {
                'country': 'Egypt',
                'code': 'eg',
                'call_code': '20'
            },
            {
                'country': 'El Salvador',
                'code': 'sv',
                'call_code': '503'
            },
            {
                'country': 'Equatorial Guinea',
                'code': 'gq',
                'call_code': '240'
            },
            {
                'country': 'Eritrea',
                'code': 'er',
                'call_code': '291'
            },
            {
                'country': 'Estonia',
                'code': 'ee',
                'call_code': '372'
            },
            {
                'country': 'Ethiopia',
                'code': 'et',
                'call_code': '251'
            },
            {
                'country': 'Falkland Islands',
                'code': 'fk',
                'call_code': '500'
            },
            {
                'country': 'Faroe Islands',
                'code': 'fo',
                'call_code': '298'
            },
            {
                'country': 'Fiji',
                'code': 'fj',
                'call_code': '679'
            },
            {
                'country': 'Finland',
                'code': 'fi',
                'call_code': '358'
            },
            {
                'country': 'France',
                'code': 'fr',
                'call_code': '33'
            },
            {
                'country': 'French Polynesia',
                'code': 'pf',
                'call_code': '689'
            },
            {
                'country': 'Gabon',
                'code': 'ga',
                'call_code': '241'
            },
            {
                'country': 'Gambia',
                'code': 'gm',
                'call_code': '220'
            },
            {
                'country': 'Georgia',
                'code': 'ge',
                'call_code': '995'
            },
            {
                'country': 'Germany',
                'code': 'de',
                'call_code': '49'
            },
            {
                'country': 'Ghana',
                'code': 'gh',
                'call_code': '233'
            },
            {
                'country': 'Gibraltar',
                'code': 'gi',
                'call_code': '350'
            },
            {
                'country': 'Greece',
                'code': 'gr',
                'call_code': '30'
            },
            {
                'country': 'Greenland',
                'code': 'gl',
                'call_code': '299'
            },
            {
                'country': 'Grenada',
                'code': 'gd',
                'call_code': '1473'
            },
            {
                'country': 'Guam',
                'code': 'gu',
                'call_code': '1671'
            },
            {
                'country': 'Guatemala',
                'code': 'gt',
                'call_code': '502'
            },
            {
                'country': 'Guernsey',
                'code': 'gg',
                'call_code': '441481'
            },
            {
                'country': 'Guinea',
                'code': 'gn',
                'call_code': '224'
            },
            {
                'country': 'GuineaBissau',
                'code': 'gw',
                'call_code': '245'
            },
            {
                'country': 'Guyana',
                'code': 'gy',
                'call_code': '592'
            },
            {
                'country': 'Haiti',
                'code': 'ht',
                'call_code': '509'
            },
            {
                'country': 'Honduras',
                'code': 'hn',
                'call_code': '504'
            },
            {
                'country': 'Hong Kong',
                'code': 'hk',
                'call_code': '852'
            },
            {
                'country': 'Hungary',
                'code': 'hu',
                'call_code': '36'
            },
            {
                'country': 'Iceland',
                'code': 'is',
                'call_code': '354'
            },
            {
                'country': 'India',
                'code': 'in',
                'call_code': '91'
            },
            {
                'country': 'Indonesia',
                'code': 'id',
                'call_code': '62'
            },
            {
                'country': 'Iran',
                'code': 'ir',
                'call_code': '98'
            },
            {
                'country': 'Iraq',
                'code': 'iq',
                'call_code': '964'
            },
            {
                'country': 'Ireland',
                'code': 'ie',
                'call_code': '353'
            },
            {
                'country': 'Isle of Man',
                'code': 'im',
                'call_code': '441624'
            },
            {
                'country': 'Israel',
                'code': 'il',
                'call_code': '972'
            },
            {
                'country': 'Italy',
                'code': 'it',
                'call_code': '39'
            },
            {
                'country': 'Ivory Coast',
                'code': 'ci',
                'call_code': '225'
            },
            {
                'country': 'Jamaica',
                'code': 'jm',
                'call_code': '1876'
            },
            {
                'country': 'Japan',
                'code': 'jp',
                'call_code': '81'
            },
            {
                'country': 'Jersey',
                'code': 'je',
                'call_code': '441534'
            },
            {
                'country': 'Jordan',
                'code': 'jo',
                'call_code': '962'
            },
            {
                'country': 'Kazakhstan',
                'code': 'kz',
                'call_code': '7'
            },
            {
                'country': 'Kenya',
                'code': 'ke',
                'call_code': '254'
            },
            {
                'country': 'Kiribati',
                'code': 'ki',
                'call_code': '686'
            },
            {
                'country': 'Kosovo',
                'code': 'xk',
                'call_code': '383'
            },
            {
                'country': 'Kuwait',
                'code': 'kw',
                'call_code': '965'
            },
            {
                'country': 'Kyrgyzstan',
                'code': 'kg',
                'call_code': '996'
            },
            {
                'country': 'Laos',
                'code': 'la',
                'call_code': '856'
            },
            {
                'country': 'Latvia',
                'code': 'lv',
                'call_code': '371'
            },
            {
                'country': 'Lebanon',
                'code': 'lb',
                'call_code': '961'
            },
            {
                'country': 'Lesotho',
                'code': 'ls',
                'call_code': '266'
            },
            {
                'country': 'Liberia',
                'code': 'lr',
                'call_code': '231'
            },
            {
                'country': 'Libya',
                'code': 'ly',
                'call_code': '218'
            },
            {
                'country': 'Liechtenstein',
                'code': 'li',
                'call_code': '423'
            },
            {
                'country': 'Lithuania',
                'code': 'lt',
                'call_code': '370'
            },
            {
                'country': 'Luxembourg',
                'code': 'lu',
                'call_code': '352'
            },
            {
                'country': 'Macau',
                'code': 'mo',
                'call_code': '853'
            },
            {
                'country': 'Macedonia',
                'code': 'mk',
                'call_code': '389'
            },
            {
                'country': 'Madagascar',
                'code': 'mg',
                'call_code': '261'
            },
            {
                'country': 'Malawi',
                'code': 'mw',
                'call_code': '265'
            },
            {
                'country': 'Malaysia',
                'code': 'my',
                'call_code': '60'
            },
            {
                'country': 'Maldives',
                'code': 'mv',
                'call_code': '960'
            },
            {
                'country': 'Mali',
                'code': 'ml',
                'call_code': '223'
            },
            {
                'country': 'Malta',
                'code': 'mt',
                'call_code': '356'
            },
            {
                'country': 'Marshall Islands',
                'code': 'mh',
                'call_code': '692'
            },
            {
                'country': 'Mauritania',
                'code': 'mr',
                'call_code': '222'
            },
            {
                'country': 'Mauritius',
                'code': 'mu',
                'call_code': '230'
            },
            {
                'country': 'Mayotte',
                'code': 'yt',
                'call_code': '262'
            },
            {
                'country': 'Mexico',
                'code': 'mx',
                'call_code': '52'
            },
            {
                'country': 'Micronesia',
                'code': 'fm',
                'call_code': '691'
            },
            {
                'country': 'Moldova',
                'code': 'md',
                'call_code': '373'
            },
            {
                'country': 'Monaco',
                'code': 'mc',
                'call_code': '377'
            },
            {
                'country': 'Mongolia',
                'code': 'mn',
                'call_code': '976'
            },
            {
                'country': 'Montenegro',
                'code': 'me',
                'call_code': '382'
            },
            {
                'country': 'Montserrat',
                'code': 'ms',
                'call_code': '1664'
            },
            {
                'country': 'Morocco',
                'code': 'ma',
                'call_code': '212'
            },
            {
                'country': 'Mozambique',
                'code': 'mz',
                'call_code': '258'
            },
            {
                'country': 'Myanmar',
                'code': 'mm',
                'call_code': '95'
            },
            {
                'country': 'Namibia',
                'code': 'na',
                'call_code': '264'
            },
            {
                'country': 'Nauru',
                'code': 'nr',
                'call_code': '674'
            },
            {
                'country': 'Nepal',
                'code': 'np',
                'call_code': '977'
            },
            {
                'country': 'Netherlands',
                'code': 'nl',
                'call_code': '31'
            },
            {
                'country': 'Netherlands Antilles',
                'code': 'an',
                'call_code': '599'
            },
            {
                'country': 'New Caledonia',
                'code': 'nc',
                'call_code': '687'
            },
            {
                'country': 'New Zealand',
                'code': 'nz',
                'call_code': '64'
            },
            {
                'country': 'Nicaragua',
                'code': 'ni',
                'call_code': '505'
            },
            {
                'country': 'Niger',
                'code': 'ne',
                'call_code': '227'
            },
            {
                'country': 'Nigeria',
                'code': 'ng',
                'call_code': '234'
            },
            {
                'country': 'Niue',
                'code': 'nu',
                'call_code': '683'
            },
            {
                'country': 'North Korea',
                'code': 'kp',
                'call_code': '850'
            },
            {
                'country': 'Northern Mariana Islands',
                'code': 'mp',
                'call_code': '1670'
            },
            {
                'country': 'Norway',
                'code': 'no',
                'call_code': '47'
            },
            {
                'country': 'Oman',
                'code': 'om',
                'call_code': '968'
            },
            {
                'country': 'Pakistan',
                'code': 'pk',
                'call_code': '92'
            },
            {
                'country': 'Palau',
                'code': 'pw',
                'call_code': '680'
            },
            {
                'country': 'Palestine',
                'code': 'ps',
                'call_code': '970'
            },
            {
                'country': 'Panama',
                'code': 'pa',
                'call_code': '507'
            },
            {
                'country': 'Papua New Guinea',
                'code': 'pg',
                'call_code': '675'
            },
            {
                'country': 'Paraguay',
                'code': 'py',
                'call_code': '595'
            },
            {
                'country': 'Peru',
                'code': 'pe',
                'call_code': '51'
            },
            {
                'country': 'Philippines',
                'code': 'ph',
                'call_code': '63'
            },
            {
                'country': 'Pitcairn',
                'code': 'pn',
                'call_code': '64'
            },
            {
                'country': 'Poland',
                'code': 'pl',
                'call_code': '48'
            },
            {
                'country': 'Portugal',
                'code': 'pt',
                'call_code': '351'
            },
            {
                'country': 'Puerto Rico',
                'code': 'pr',
                'call_code': '1787, 1939'
            },
            {
                'country': 'Qatar',
                'code': 'qa',
                'call_code': '974'
            },
            {
                'country': 'Republic of the Congo',
                'code': 'cg',
                'call_code': '242'
            },
            {
                'country': 'Reunion',
                'code': 're',
                'call_code': '262'
            },
            {
                'country': 'Romania',
                'code': 'ro',
                'call_code': '40'
            },
            {
                'country': 'Russia',
                'code': 'ru',
                'call_code': '7'
            },
            {
                'country': 'Rwanda',
                'code': 'rw',
                'call_code': '250'
            },
            {
                'country': 'Saint Barthelemy',
                'code': 'bl',
                'call_code': '590'
            },
            {
                'country': 'Saint Helena',
                'code': 'sh',
                'call_code': '290'
            },
            {
                'country': 'Saint Kitts and Nevis',
                'code': 'kn',
                'call_code': '1869'
            },
            {
                'country': 'Saint Lucia',
                'code': 'lc',
                'call_code': '1758'
            },
            {
                'country': 'Saint Martin',
                'code': 'mf',
                'call_code': '590'
            },
            {
                'country': 'Saint Pierre and Miquelon',
                'code': 'pm',
                'call_code': '508'
            },
            {
                'country': 'Saint Vincent and the Grenadines',
                'code': 'vc',
                'call_code': '1784'
            },
            {
                'country': 'Samoa',
                'code': 'ws',
                'call_code': '685'
            },
            {
                'country': 'San Marino',
                'code': 'sm',
                'call_code': '378'
            },
            {
                'country': 'Sao Tome and Principe',
                'code': 'st',
                'call_code': '239'
            },
            {
                'country': 'Saudi Arabia',
                'code': 'sa',
                'call_code': '966'
            },
            {
                'country': 'Senegal',
                'code': 'sn',
                'call_code': '221'
            },
            {
                'country': 'Serbia',
                'code': 'rs',
                'call_code': '381'
            },
            {
                'country': 'Seychelles',
                'code': 'sc',
                'call_code': '248'
            },
            {
                'country': 'Sierra Leone',
                'code': 'sl',
                'call_code': '232'
            },
            {
                'country': 'Singapore',
                'code': 'sg',
                'call_code': '65'
            },
            {
                'country': 'Sint Maarten',
                'code': 'sx',
                'call_code': '1721'
            },
            {
                'country': 'Slovakia',
                'code': 'sk',
                'call_code': '421'
            },
            {
                'country': 'Slovenia',
                'code': 'si',
                'call_code': '386'
            },
            {
                'country': 'Solomon Islands',
                'code': 'sb',
                'call_code': '677'
            },
            {
                'country': 'Somalia',
                'code': 'so',
                'call_code': '252'
            },
            {
                'country': 'South Africa',
                'code': 'za',
                'call_code': '27'
            },
            {
                'country': 'South Korea',
                'code': 'kr',
                'call_code': '82'
            },
            {
                'country': 'South Sudan',
                'code': 'ss',
                'call_code': '211'
            },
            {
                'country': 'Spain',
                'code': 'es',
                'call_code': '34'
            },
            {
                'country': 'Sri Lanka',
                'code': 'lk',
                'call_code': '94'
            },
            {
                'country': 'Sudan',
                'code': 'sd',
                'call_code': '249'
            },
            {
                'country': 'Suriname',
                'code': 'sr',
                'call_code': '597'
            },
            {
                'country': 'Svalbard and Jan Mayen',
                'code': 'sj',
                'call_code': '47'
            },
            {
                'country': 'Swaziland',
                'code': 'sz',
                'call_code': '268'
            },
            {
                'country': 'Sweden',
                'code': 'se',
                'call_code': '46'
            },
            {
                'country': 'Switzerland',
                'code': 'ch',
                'call_code': '41'
            },
            {
                'country': 'Syria',
                'code': 'sy',
                'call_code': '963'
            },
            {
                'country': 'Taiwan',
                'code': 'tw',
                'call_code': '886'
            },
            {
                'country': 'Tajikistan',
                'code': 'tj',
                'call_code': '992'
            },
            {
                'country': 'Tanzania',
                'code': 'tz',
                'call_code': '255'
            },
            {
                'country': 'Thailand',
                'code': 'th',
                'call_code': '66'
            },
            {
                'country': 'Togo',
                'code': 'tg',
                'call_code': '228'
            },
            {
                'country': 'Tokelau',
                'code': 'tk',
                'call_code': '690'
            },
            {
                'country': 'Tonga',
                'code': 'to',
                'call_code': '676'
            },
            {
                'country': 'Trinidad and Tobago',
                'code': 'tt',
                'call_code': '1868'
            },
            {
                'country': 'Tunisia',
                'code': 'tn',
                'call_code': '216'
            },
            {
                'country': 'Turkey',
                'code': 'tr',
                'call_code': '90'
            },
            {
                'country': 'Turkmenistan',
                'code': 'tm',
                'call_code': '993'
            },
            {
                'country': 'Turks and Caicos Islands',
                'code': 'tc',
                'call_code': '1649'
            },
            {
                'country': 'Tuvalu',
                'code': 'tv',
                'call_code': '688'
            },
            {
                'country': 'U.S. Virgin Islands',
                'code': 'vi',
                'call_code': '1340'
            },
            {
                'country': 'Uganda',
                'code': 'ug',
                'call_code': '256'
            },
            {
                'country': 'Ukraine',
                'code': 'ua',
                'call_code': '380'
            },
            {
                'country': 'United Arab Emirates',
                'code': 'ae',
                'call_code': '971'
            },
            {
                'country': 'United Kingdom',
                'code': 'gb',
                'call_code': '44'
            },
            {
                'country': 'United States',
                'code': 'us',
                'call_code': '1'
            },
            {
                'country': 'Uruguay',
                'code': 'uy',
                'call_code': '598'
            },
            {
                'country': 'Uzbekistan',
                'code': 'uz',
                'call_code': '998'
            },
            {
                'country': 'Vanuatu',
                'code': 'vu',
                'call_code': '678'
            },
            {
                'country': 'Vatican',
                'code': 'va',
                'call_code': '379'
            },
            {
                'country': 'Venezuela',
                'code': 've',
                'call_code': '58'
            },
            {
                'country': 'Vietnam',
                'code': 'vn',
                'call_code': '84'
            },
            {
                'country': 'Wallis and Futuna',
                'code': 'wf',
                'call_code': '681'
            },
            {
                'country': 'Western Sahara',
                'code': 'eh',
                'call_code': '212'
            },
            {
                'country': 'Yemen',
                'code': 'ye',
                'call_code': '967'
            },
            {
                'country': 'Zambia',
                'code': 'zm',
                'call_code': '260'
            },
            {
                'country': 'Zimbabwe',
                'code': 'zw',
                'call_code': '263'
            }
        ];
    };
    IsoCodesSharedService = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])()
    ], IsoCodesSharedService);
    return IsoCodesSharedService;
}());



/***/ }),

/***/ "./src/app/shared/services/ratecard/main-table-common.shared.service.ts":
/*!******************************************************************************!*\
  !*** ./src/app/shared/services/ratecard/main-table-common.shared.service.ts ***!
  \******************************************************************************/
/*! exports provided: MainTableCommonSharedService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MainTableCommonSharedService", function() { return MainTableCommonSharedService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var MainTableCommonSharedService = /** @class */ (function () {
    function MainTableCommonSharedService() {
        // ! Utility functions for formatting ratecard resp into AG Grid format
        // * Filtering out nums out of the arr of objs and converting remaining valid strings to floats
        // * Remove the first number which is the prefix of the rate
        this.extractRates = function (array) {
            var dataArr = [];
            var arr = Object.values(array.data);
            for (var i = 0; i < arr.length; i++) {
                if (arr[i] > 0) {
                    dataArr.push(arr[i] * 1);
                }
            }
            var ratesArr = dataArr.slice(1);
            return ratesArr;
        };
        // * Remove Ratecards that do not have any rates inside
        this.filterOutBlankArrays = function (array, innerArr) {
            return array.filter(function (arrItem) { return arrItem[innerArr].length > 0; });
        };
    }
    // * Returns the variance of the given Arr, takes an arr of nums
    MainTableCommonSharedService.prototype.returnVariance = function (array) {
        var mean = array.reduce(function (acc, value) { return (acc + value) / array.length; });
        var diff = array.map(function (num) { return Math.pow(num - mean, 2); });
        var variance = diff.reduce(function (acc, value) { return (acc + value) / array.length; });
        return variance;
    };
    // * Returns the mean of the given Arr, takes an arr of nums
    MainTableCommonSharedService.prototype.returnMean = function (array) {
        var sum = array.reduce(function (acc, value) { return acc + value; });
        var mean = (sum / array.length);
        return mean;
    };
    // * Returns the joined items of the given Arr, Takes arr of strings & seperator string
    MainTableCommonSharedService.prototype.joinStrings = function (array, seperator) {
        var joinStrings = function (arr) {
            var join = array.reduce(function (acc, value) { return acc + (" " + seperator + " ") + value; });
            return join;
        };
        return joinStrings(array);
    };
    MainTableCommonSharedService = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])()
    ], MainTableCommonSharedService);
    return MainTableCommonSharedService;
}());



/***/ }),

/***/ "./src/app/shared/services/ratecard/main-table-prem.shared.service.ts":
/*!****************************************************************************!*\
  !*** ./src/app/shared/services/ratecard/main-table-prem.shared.service.ts ***!
  \****************************************************************************/
/*! exports provided: MainTablePremSharedService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MainTablePremSharedService", function() { return MainTablePremSharedService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _main_table_common_shared_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./main-table-common.shared.service */ "./src/app/shared/services/ratecard/main-table-common.shared.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var MainTablePremSharedService = /** @class */ (function () {
    function MainTablePremSharedService(_mainTableCommon) {
        this._mainTableCommon = _mainTableCommon;
    }
    MainTablePremSharedService.prototype.createColumnGroupHeaders = function (input) {
        var colGroupArr = [];
        for (var i = 0; i < input.length; i++) {
            var ratecardModified = input[i].ratecard_name.split('#');
            var ratecardNameModified = ratecardModified[0];
            var ratecardDestinationModified = ratecardModified[2];
            colGroupArr.push({
                colId: "" + i,
                groupHeaderName: "Carrier " + input[i].carrier_id,
                carrier_coverage: input[i].carrier_coverage,
                carrier_id: input[i].carrier_id,
                carrier_name: input[i].carrier_name,
                carrier_tier: input[i].carrier_tier,
                end_ts: input[i].end_ts,
                popular_deals: input[i].popular_deals,
                quality_of_service: input[i].quality_of_service,
                quantity_available: input[i].quantity_available,
                ratecard_id: input[i].ratecard_id,
                ratecard_name: input[i].ratecard_name,
                rating: input[i].rating,
                resellable: input[i].resellable,
                ratecard_name_modified: ratecardNameModified,
                ratecard_destination_modified: ratecardDestinationModified
            });
        }
        return colGroupArr;
    };
    MainTablePremSharedService.prototype.createCarrierColumnDefs = function (carrierGroupHeadersArr, filteredData) {
        var carrierColumnDefs = []; // * Arr that will contain the columnDefs
        // * Imported helper fns
        var _mainTableCommon = this._mainTableCommon;
        carrierColumnDefs.push({
            headerName: 'Standard Ratecard',
            children: [
                // {
                //         headerName: 'Variance Flag', field: 'variance', width: 120, colId: 'high_variance',
                //         filter: 'agNumberColumnFilter', lockPosition: true,
                //         valueGetter(params) {
                //             const ratesArr = _mainTableCommon.extractRates(params).sort();
                //             const returnVariance = _mainTableCommon.returnVariance(ratesArr);
                //             if ( returnVariance >= .0009  ) {
                //                 return 'High Variance';
                //             } else {
                //                 return '';
                //             }
                //         },
                //         hide: true,
                //         cellStyle: { 'border-right': '1px solid #E0E0E0' },
                // },
                {
                    headerName: 'Prefix', field: 'prefix', width: 100, colId: 'prefix',
                    cellStyle: { 'border-right': '1px solid #E0E0E0' },
                    lockPosition: true, unSortIcon: true,
                },
                {
                    headerName: 'Destination', field: 'destination', colId: 'destination',
                    width: 300, lockPosition: true,
                    cellStyle: { 'border-right': '1px solid #E0E0E0', 'background': 'lightblue' }
                },
                {
                    headerName: '* 2%', field: 'our_rate_2p', width: 100, colId: 'our_rate_2p',
                    filter: 'agNumberColumnFilter', editable: true, lockPosition: true,
                    valueGetter: function (params) {
                        var ratesArr = _mainTableCommon.extractRates(params).sort();
                        var min = Math.min.apply(Math, ratesArr).toFixed(4);
                        var minToNum = parseFloat(min) * 1.02;
                        return minToNum.toFixed(4);
                    },
                    cellStyle: { 'border-right': '1px solid #E0E0E0', 'background': 'lightgreen' }
                },
                {
                    headerName: 'Effective', field: '', width: 100, colId: 'eff_date',
                    filter: 'agDateColumnFilter', lockPosition: true,
                    valueGetter: function () {
                        var d = new Date();
                        var month = d.getMonth() + 1;
                        var date = d.getFullYear() + "." + month + "." + d.getDate();
                        return date;
                    },
                    cellStyle: { 'border-right': '1px solid #E0E0E0' }
                },
                {
                    headerName: 'Status', field: 'status', width: 100, colId: 'status',
                    editable: true, lockPosition: true,
                    valueGetter: function () {
                        return 'current';
                    },
                    cellStyle: { 'border-right': '1px solid #000000' }
                },
            ]
        }, {
            headerName: 'Calc',
            children: [
                {
                    headerName: 'Calc', width: 70,
                    columnGroupShow: 'closed'
                },
                {
                    headerName: '* 1%', field: 'our_rate_1p', width: 100, colId: 'our_rate_1p',
                    filter: 'agNumberColumnFilter', editable: true, lockPosition: true,
                    valueGetter: function (params) {
                        var ratesArr = _mainTableCommon.extractRates(params);
                        var min = Math.min.apply(Math, ratesArr).toFixed(4);
                        var minToNum = parseFloat(min) * 1.01;
                        return minToNum.toFixed(4);
                    },
                    cellStyle: { 'border-right': '1px solid #E0E0E0' },
                    columnGroupShow: 'open'
                },
                {
                    headerName: '* 3%', field: 'our_rate_3p', width: 100, colId: 'our_rate_3p',
                    filter: 'agNumberColumnFilter', editable: true, lockPosition: true,
                    valueGetter: function (params) {
                        var ratesArr = _mainTableCommon.extractRates(params);
                        var min = Math.min.apply(Math, ratesArr).toFixed(4);
                        var minToNum = parseFloat(min) * 1.03;
                        return minToNum.toFixed(4);
                    },
                    cellStyle: { 'border-right': '1px solid #000000' },
                    columnGroupShow: 'open'
                },
                {
                    headerName: 'Lowest Rate', field: 'lowest_rate', width: 120, colId: 'lowest_rate',
                    filter: 'agNumberColumnFilter', lockPosition: true,
                    valueGetter: function (params) {
                        var ratesArr = _mainTableCommon.extractRates(params);
                        var min = Math.min.apply(Math, ratesArr).toFixed(4);
                        return min;
                    },
                    cellStyle: { 'border-right': '1px solid #E0E0E0' },
                    columnGroupShow: 'open'
                },
                {
                    headerName: 'Average', field: 'average', width: 120, colId: 'average',
                    filter: 'agNumberColumnFilter', lockPosition: true,
                    valueGetter: function (params) {
                        var ratesArr = _mainTableCommon.extractRates(params);
                        var mean = _mainTableCommon.returnMean(ratesArr).toFixed(4);
                        return mean;
                    },
                    cellStyle: { 'border-right': '1px solid #E0E0E0' },
                    columnGroupShow: 'open'
                },
                {
                    headerName: 'Variance', field: 'variance', width: 120, colId: 'variance',
                    filter: 'agNumberColumnFilter', lockPosition: true,
                    valueGetter: function (params) {
                        var ratesArr = _mainTableCommon.extractRates(params).sort();
                        var returnVariance = _mainTableCommon.returnVariance(ratesArr).toFixed(5);
                        return returnVariance;
                    },
                    cellClassRules: {
                        'notable-variance': function (params) {
                            var ratesArr = _mainTableCommon.extractRates(params).sort();
                            var returnVariance = _mainTableCommon.returnVariance(ratesArr);
                            return returnVariance >= .0009;
                        }
                    },
                    cellStyle: { 'border-right': '1px solid #E0E0E0' },
                    columnGroupShow: 'open'
                },
                {
                    headerName: 'Low->High', field: 'lowhigh', width: 200, colId: 'lowhigh',
                    filter: 'agNumberColumnFilter', lockPosition: true,
                    valueGetter: function (params) {
                        var ratesArr = _mainTableCommon.extractRates(params).sort();
                        if (ratesArr.length > 1) {
                            return _mainTableCommon.joinStrings(ratesArr, '|');
                        }
                        else {
                            return ratesArr[0];
                        }
                    },
                    cellStyle: { 'border-right': '1px solid #000000' },
                    columnGroupShow: 'open'
                }
            ]
        }, {
            headerName: 'Destination', field: 'destination', colId: 'destination',
            width: 300, lockPosition: true,
            cellStyle: { 'border-left': '1px solid #000', 'border-right': '1px solid #000', 'background': 'lightblue' },
            filter: 'agTextColumnFilter',
        }); // end push of calc cols
        for (var i = 0; i < carrierGroupHeadersArr.length; i++) {
            var sellrateFieldString = 'sellrate_' + filteredData[i].ratecard_id;
            var destinationFieldString = 'destination_' + filteredData[i].ratecard_id;
            carrierColumnDefs.push({
                headerName: 'see dest.',
                children: [
                    {
                        headerName: 'Destination', field: destinationFieldString,
                        width: 300,
                        colId: "carrier_dest_" + i,
                        cellStyle: { 'border-right': '1px solid #E0E0E0' },
                        columnGroupShow: 'open',
                    },
                    {
                        headerName: carrierGroupHeadersArr[i].ratecard_name_modified, field: sellrateFieldString, width: 200,
                        headerHeight: 400, editable: true,
                        filter: 'agNumberColumnFilter',
                        colId: "carrier_rate_" + i,
                        cellStyle: { 'border-right': '1px solid #E0E0E0' },
                        unSortIcon: true,
                    }
                ]
            });
        }
        return carrierColumnDefs;
    };
    MainTablePremSharedService.prototype.createRowData = function (inputFilteredData) {
        var carrierRowData = carrierRowDataFn(inputFilteredData);
        var groupDataByPrefix = groupDataByPrefixFn(carrierRowData);
        var finalRowData = combineObjsFn(groupDataByPrefix);
        // Set row data
        function carrierRowDataFn(filteredData) {
            var carrierRowDataArr = [];
            for (var i = 0; i < filteredData.length; i++) {
                var prefixFieldKey = 'prefix';
                var destinationField = "destination_" + filteredData[i].ratecard_id;
                var sellrateField = 'sellrate_' + filteredData[i].ratecard_id;
                for (var x = 0; x < filteredData[i].rates.length; x++) {
                    carrierRowDataArr.push((_a = {},
                        _a[prefixFieldKey] = filteredData[i].rates[x].prefix,
                        _a.destination = filteredData[i].rates[x].destination,
                        _a[destinationField] = filteredData[i].rates[x].destination,
                        _a[sellrateField] = filteredData[i].rates[x].buy_rate.toFixed(4),
                        _a));
                }
            }
            return carrierRowDataArr;
            var _a;
        }
        function groupDataByPrefixFn(json) {
            Array.prototype.groupBy = function (prop) {
                return this.reduce(function (groups, item) {
                    groups[item[prop]] = groups[item[prop]] || [];
                    groups[item[prop]].push(item);
                    return groups;
                }, {});
            };
            var data = json.groupBy('prefix');
            var dataArr = [];
            for (var item in data) {
                if (item) {
                    dataArr.push(data[item]);
                }
            }
            return dataArr;
        }
        function combineObjsFn(groupedData) {
            var rowData = []; // loops through an array of objects and merges multiple objects into one
            for (var i = 0; i < groupedData.length; i++) {
                rowData.push(Object.assign.apply({}, groupedData[i]));
            }
            return rowData;
        }
        return finalRowData;
    };
    MainTablePremSharedService = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])(),
        __metadata("design:paramtypes", [_main_table_common_shared_service__WEBPACK_IMPORTED_MODULE_1__["MainTableCommonSharedService"]])
    ], MainTablePremSharedService);
    return MainTablePremSharedService;
}());



/***/ }),

/***/ "./src/app/shared/services/ratecard/main-table-std.shared.service.ts":
/*!***************************************************************************!*\
  !*** ./src/app/shared/services/ratecard/main-table-std.shared.service.ts ***!
  \***************************************************************************/
/*! exports provided: MainTableStdSharedService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MainTableStdSharedService", function() { return MainTableStdSharedService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _main_table_common_shared_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./main-table-common.shared.service */ "./src/app/shared/services/ratecard/main-table-common.shared.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var MainTableStdSharedService = /** @class */ (function () {
    function MainTableStdSharedService(_mainTableCommon) {
        this._mainTableCommon = _mainTableCommon;
    }
    MainTableStdSharedService.prototype.filterForPrivateRateCardsOnly = function (input) {
        return input.filter(function (data) { return data.ratecard_name.includes('private'); });
    };
    MainTableStdSharedService.prototype.filterForStandardRateCards = function (input) {
        return input.filter(function (data) { return data.tier.includes('standard'); });
    };
    MainTableStdSharedService.prototype.createColumnGroupHeaders = function (input) {
        var colGroupArr = [];
        for (var i = 0; i < input.length; i++) {
            var ratecardModified = input[i].ratecard_name.split('#');
            var ratecardNameModified = ratecardModified[0];
            var ratecardDestinationModified = ratecardModified[2];
            colGroupArr.push({
                colId: "" + i,
                groupHeaderName: "Carrier " + input[i].carrier_id,
                carrier_coverage: input[i].carrier_coverage,
                carrier_id: input[i].carrier_id,
                carrier_name: input[i].carrier_name,
                carrier_tier: input[i].carrier_tier,
                end_ts: input[i].end_ts,
                popular_deals: input[i].popular_deals,
                quality_of_service: input[i].quality_of_service,
                quantity_available: input[i].quantity_available,
                ratecard_id: input[i].ratecard_id,
                ratecard_name: input[i].ratecard_name,
                rating: input[i].rating,
                resellable: input[i].resellable,
                ratecard_name_modified: ratecardNameModified,
                ratecard_destination_modified: ratecardDestinationModified
            });
        }
        return colGroupArr;
    };
    MainTableStdSharedService.prototype.createCarrierColumnDefs = function (carrierGroupHeadersArr, filteredData) {
        var carrierColumnDefs = []; // * Arr that will contain the columnDefs
        // * Imported helper fns
        var _mainTableCommon = this._mainTableCommon;
        carrierColumnDefs.push({
            headerName: 'Standard Ratecard',
            children: [
                // {
                //     headerName: 'Variance Flag', field: 'variance', width: 120, colId: 'high_variance',
                //     lockPosition: true,
                //     valueGetter(params) {
                //         const ratesArr = _mainTableCommon.extractRates(params).sort();
                //         const returnVariance = _mainTableCommon.returnVariance(ratesArr);
                //         if ( returnVariance >= .0009  ) {
                //             return 'High Variance';
                //         } else {
                //             return '';
                //         }
                //     },
                //     cellStyle: { 'border-right': '1px solid #E0E0E0' },
                //     hide: true
                // },
                {
                    headerName: 'Prefix', field: 'prefix', width: 100, colId: 'prefix',
                    cellStyle: { 'border-right': '1px solid #E0E0E0' },
                    lockPosition: true, unSortIcon: true,
                },
                {
                    headerName: 'Destination', field: 'destination', colId: 'destination',
                    width: 300, lockPosition: true,
                    cellStyle: { 'border-right': '1px solid #E0E0E0', 'background': 'lightblue' }
                },
                {
                    headerName: '* 2%', field: 'our_rate_2p', width: 100, colId: 'our_rate_2p',
                    filter: 'agNumberColumnFilter', editable: true, lockPosition: true,
                    valueGetter: function (params) {
                        var ratesArr = _mainTableCommon.extractRates(params).sort();
                        var min = Math.min.apply(Math, ratesArr).toFixed(4);
                        var minToNum = parseFloat(min) * 1.02;
                        return minToNum.toFixed(4);
                    },
                    cellStyle: { 'border-right': '1px solid #E0E0E0', 'background': 'lightgreen' }
                },
                {
                    headerName: 'Effective', field: '', width: 100, colId: 'eff_date',
                    filter: 'agDateColumnFilter', lockPosition: true,
                    valueGetter: function () {
                        var d = new Date();
                        var month = d.getMonth() + 1;
                        var date = d.getFullYear() + "." + month + "." + d.getDate();
                        return date;
                    },
                    cellStyle: { 'border-right': '1px solid #E0E0E0' }
                },
                {
                    headerName: 'Status', field: 'status', width: 100, colId: 'status',
                    editable: true, lockPosition: true,
                    valueGetter: function () {
                        return 'current';
                    },
                    cellStyle: { 'border-right': '1px solid #000000' }
                }
            ]
        }, {
            headerName: 'Calc',
            children: [
                {
                    headerName: 'Calc', width: 70,
                    columnGroupShow: 'closed'
                },
                {
                    headerName: 'Lowest Rate', field: 'lowest_rate', width: 120, colId: 'lowest_rate',
                    filter: 'agNumberColumnFilter', lockPosition: true,
                    valueGetter: function (params) {
                        var ratesArr = _mainTableCommon.extractRates(params);
                        var min = Math.min.apply(Math, ratesArr).toFixed(4);
                        return min;
                    },
                    cellStyle: { 'border-right': '1px solid #E0E0E0' },
                    columnGroupShow: 'open'
                },
                {
                    headerName: 'Average', field: 'average', width: 120, colId: 'average',
                    filter: 'agNumberColumnFilter', lockPosition: true,
                    valueGetter: function (params) {
                        var ratesArr = _mainTableCommon.extractRates(params);
                        var mean = _mainTableCommon.returnMean(ratesArr).toFixed(4);
                        return mean;
                    },
                    cellStyle: { 'border-right': '1px solid #E0E0E0' },
                    columnGroupShow: 'open'
                },
                {
                    headerName: 'Variance', field: 'variance', width: 120, colId: 'variance',
                    filter: 'agNumberColumnFilter', lockPosition: true,
                    valueGetter: function (params) {
                        var ratesArr = _mainTableCommon.extractRates(params).sort();
                        var returnVariance = _mainTableCommon.returnVariance(ratesArr).toFixed(5);
                        return returnVariance;
                    },
                    cellClassRules: {
                        'notable-variance': function (params) {
                            var ratesArr = _mainTableCommon.extractRates(params).sort();
                            var returnVariance = _mainTableCommon.returnVariance(ratesArr);
                            return returnVariance >= .0009;
                        }
                    },
                    cellStyle: { 'border-right': '1px solid #E0E0E0' },
                    columnGroupShow: 'open'
                },
                {
                    headerName: '* 1%', field: 'our_rate_1p', width: 100, colId: 'our_rate_1p',
                    filter: 'agNumberColumnFilter', editable: true, lockPosition: true,
                    valueGetter: function (params) {
                        var ratesArr = _mainTableCommon.extractRates(params);
                        var min = Math.min.apply(Math, ratesArr).toFixed(4);
                        var minToNum = parseFloat(min) * 1.01;
                        return minToNum.toFixed(4);
                    },
                    cellStyle: { 'border-right': '1px solid #E0E0E0' },
                    columnGroupShow: 'open'
                },
                {
                    headerName: '* 3%', field: 'our_rate_3p', width: 100, colId: 'our_rate_3p',
                    filter: 'agNumberColumnFilter', editable: true, lockPosition: true,
                    valueGetter: function (params) {
                        var ratesArr = _mainTableCommon.extractRates(params);
                        var min = Math.min.apply(Math, ratesArr).toFixed(4);
                        var minToNum = parseFloat(min) * 1.03;
                        return minToNum.toFixed(4);
                    },
                    cellStyle: { 'border-right': '1px solid #000000' },
                    columnGroupShow: 'open'
                },
                {
                    headerName: 'Low->High', field: 'lowhigh', width: 200, colId: 'lowhigh',
                    filter: 'agNumberColumnFilter', lockPosition: true,
                    valueGetter: function (params) {
                        var ratesArr = _mainTableCommon.extractRates(params).sort();
                        if (ratesArr.length > 1) {
                            return _mainTableCommon.joinStrings(ratesArr, '|');
                        }
                        else {
                            return ratesArr[0];
                        }
                    },
                    columnGroupShow: 'open'
                }
            ]
        }, {
            headerName: 'Destination', field: 'destination', colId: 'destination',
            width: 300, lockPosition: true,
            cellStyle: { 'border-left': '1px solid #000', 'border-right': '1px solid #000', 'background': 'lightblue' },
            filter: 'agTextColumnFilter',
        }); // end push of calc cols
        for (var i = 0; i < carrierGroupHeadersArr.length; i++) {
            var sellrateFieldString = 'sellrate_' + filteredData[i].ratecard_id;
            var destinationFieldString = 'destination_' + filteredData[i].ratecard_id;
            carrierColumnDefs.push({
                headerName: 'See Dest.',
                children: [
                    {
                        headerName: 'Destination', field: destinationFieldString,
                        width: 300,
                        colId: "carrier_dest_" + i,
                        cellStyle: { 'border-right': '1px solid #E0E0E0' },
                        columnGroupShow: 'open',
                    },
                    {
                        headerName: carrierGroupHeadersArr[i].ratecard_name_modified, field: sellrateFieldString, width: 160,
                        headerHeight: 400, editable: true,
                        filter: 'agNumberColumnFilter',
                        colId: "carrier_rate_" + i,
                        cellStyle: { 'border-right': '1px solid #E0E0E0' },
                        unSortIcon: true,
                    }
                ]
            });
        }
        return carrierColumnDefs;
    };
    MainTableStdSharedService.prototype.createRowData = function (inputFilteredData) {
        var carrierRowData = carrierRowDataFn(inputFilteredData);
        var groupDataByPrefix = groupDataByPrefixFn(carrierRowData);
        var finalRowData = combineObjsFn(groupDataByPrefix);
        // Set row data
        function carrierRowDataFn(filteredData) {
            var carrierRowDataArr = [];
            for (var i = 0; i < filteredData.length; i++) {
                var prefixFieldKey = 'prefix';
                var destinationField = "destination_" + filteredData[i].ratecard_id;
                var sellrateField = 'sellrate_' + filteredData[i].ratecard_id;
                for (var x = 0; x < filteredData[i].rates.length; x++) {
                    carrierRowDataArr.push((_a = {},
                        _a[prefixFieldKey] = filteredData[i].rates[x].prefix,
                        _a.destination = filteredData[i].rates[x].destination,
                        _a[destinationField] = filteredData[i].rates[x].destination,
                        _a[sellrateField] = filteredData[i].rates[x].buy_rate.toFixed(4),
                        _a));
                }
            }
            return carrierRowDataArr;
            var _a;
        }
        function groupDataByPrefixFn(json) {
            Array.prototype.groupBy = function (prop) {
                return this.reduce(function (groups, item) {
                    groups[item[prop]] = groups[item[prop]] || [];
                    groups[item[prop]].push(item);
                    return groups;
                }, {});
            };
            var data = json.groupBy('prefix');
            var dataArr = [];
            for (var item in data) {
                if (item) {
                    dataArr.push(data[item]);
                }
            }
            return dataArr;
        }
        function combineObjsFn(groupedData) {
            var rowData = []; // loops through an array of objects and merges multiple objects into one
            for (var i = 0; i < groupedData.length; i++) {
                rowData.push(Object.assign.apply({}, groupedData[i]));
            }
            return rowData;
        }
        return finalRowData;
    };
    MainTableStdSharedService = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])(),
        __metadata("design:paramtypes", [_main_table_common_shared_service__WEBPACK_IMPORTED_MODULE_1__["MainTableCommonSharedService"]])
    ], MainTableStdSharedService);
    return MainTableStdSharedService;
}());



/***/ }),

/***/ "./src/app/shared/services/ratecard/rate-cards.shared.service.ts":
/*!***********************************************************************!*\
  !*** ./src/app/shared/services/ratecard/rate-cards.shared.service.ts ***!
  \***********************************************************************/
/*! exports provided: RateCardsSharedService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RateCardsSharedService", function() { return RateCardsSharedService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};


var RateCardsSharedService = /** @class */ (function () {
    function RateCardsSharedService() {
        this.rowObjAllSource = new rxjs__WEBPACK_IMPORTED_MODULE_1__["BehaviorSubject"]({}); // Passing rowObj from ratecard-all-table => delete dialog
        this.currentRowAllObj = this.rowObjAllSource.asObservable();
        this.rowRatesObjSource = new rxjs__WEBPACK_IMPORTED_MODULE_1__["BehaviorSubject"]({}); // Passing rates rowObj from rate table => delete dialog
        this.currentRowRatesObj = this.rowRatesObjSource.asObservable();
        this.rowTrunksObjSource = new rxjs__WEBPACK_IMPORTED_MODULE_1__["BehaviorSubject"]({}); // Passing trunks rowObj from trunks table => delete dialog
        this.currentRowTrunksObj = this.rowTrunksObjSource.asObservable();
    }
    RateCardsSharedService.prototype.changeRowAllObj = function (rowObj) {
        this.rowObjAllSource.next(rowObj);
        console.table(rowObj);
    };
    RateCardsSharedService.prototype.changeRowRatesObj = function (rowObj) {
        this.rowRatesObjSource.next(rowObj);
        console.table(rowObj);
    };
    RateCardsSharedService.prototype.changeRowTrunksObj = function (rowObj) {
        this.rowTrunksObjSource.next(rowObj);
        console.table(rowObj);
    };
    RateCardsSharedService = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])()
    ], RateCardsSharedService);
    return RateCardsSharedService;
}());



/***/ }),

/***/ "./src/app/shared/services/trunk/trunks.shared.service.ts":
/*!****************************************************************!*\
  !*** ./src/app/shared/services/trunk/trunks.shared.service.ts ***!
  \****************************************************************/
/*! exports provided: TrunksSharedService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TrunksSharedService", function() { return TrunksSharedService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};


var TrunksSharedService = /** @class */ (function () {
    function TrunksSharedService() {
        this.rowObjSource = new rxjs__WEBPACK_IMPORTED_MODULE_1__["BehaviorSubject"]([{}]);
        this.currentRowId = this.rowObjSource.asObservable();
    }
    TrunksSharedService.prototype.changeRowObj = function (rowObj) {
        this.rowObjSource.next(rowObj);
        console.log('updated rowId:');
        console.table(rowObj);
    };
    TrunksSharedService = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])()
    ], TrunksSharedService);
    return TrunksSharedService;
}());



/***/ }),

/***/ "./src/app/side-nav/side-nav.component.html":
/*!**************************************************!*\
  !*** ./src/app/side-nav/side-nav.component.html ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<nav [class.active]=\"isSideBarMini\">\n\n    <!-- Dashboard -->\n    <div class=\"main-menu-item\" routerLink=\"dashboard\" routerLinkActive=\"active-link-parent\">\n        <i class=\"fas fa-home parent-icon\"></i><span class=\"link-name\">Dashboard</span>\n    </div>\n\n    <!-- Carrier -->\n    <div class=\"main-menu-item\" (click)=\"toggleExpandClass('carrier')\">\n        <i class=\"fas fa-signal parent-icon\"></i><span class=\"link-name\">Carrier</span><i class=\"fa fa-chevron-down carrierChev\"></i>\n    </div>\n        <div class=\"nested-menu-container\" [class.expand]=\"showNavChildrenCarrier\">\n            <div class=\"nested-menu-item\" routerLink=\"carrier-view\" routerLinkActive=\"active-link-child\">\n                <i class=\"far fa-circle\"></i><span class=\"link-name\">View Carrier</span>\n            </div>\n            <div class=\"nested-menu-item\" routerLink=\"carrier-profile\" routerLinkActive=\"active-link-child\">\n                <i class=\"far fa-circle\"></i><span class=\"link-name\">Create Profile</span>\n            </div>\n        </div>\n\n    <!-- Ratecard -->\n    <div class=\"main-menu-item\" (click)=\"toggleExpandClass('ratecard')\">\n        <i class=\"fas fa-copy parent-icon\"></i><span class=\"link-name\">Ratecard</span><i class=\"fa fa-chevron-down ratecardChev\"></i>\n    </div>\n        <div class=\"nested-menu-container\" [class.expand]=\"showNavChildrenRatecard\">\n            <div class=\"nested-menu-item\" routerLink=\"rate-card-importer\" routerLinkActive=\"active-link-child\">\n                <i class=\"far fa-circle\"></i><span class=\"link-name\">Import Ratecard</span>\n            </div>\n            <div class=\"nested-menu-item\" routerLink=\"rate-card-view\" routerLinkActive=\"active-link-child\">\n                <i class=\"far fa-circle\"></i><span class=\"link-name\">View Ratecard</span>\n            </div>\n            <div class=\"nested-menu-item\" routerLink=\"rate-card-add-trunks\" routerLinkActive=\"active-link-child\">\n                <i class=\"far fa-circle\"></i><span class=\"link-name\">Add Trunks</span>\n            </div>\n            <div class=\"nested-menu-item\" routerLink=\"rate-card-convert-csv\" routerLinkActive=\"active-link-child\">\n                <i class=\"far fa-circle\"></i><span class=\"link-name\">Convert To CSV</span>\n            </div>\n            <div class=\"nested-menu-item\" routerLink=\"rate-card-view-carrier\" routerLinkActive=\"active-link-child\">\n                <i class=\"far fa-circle\"></i><span class=\"link-name link-name-long\">View By Carrier STD</span>\n            </div>\n            <div class=\"nested-menu-item\" routerLink=\"rate-card-view-carrier-p\" routerLinkActive=\"active-link-child\">\n                <i class=\"far fa-circle\"></i><span class=\"link-name link-name-long\">View By Carrier PREM</span>\n            </div>\n        </div>\n\n    <!-- Trunks -->\n    <div class=\"main-menu-item\" routerLink=\"trunks\" routerLinkActive=\"active-link-parent\">\n        <i class=\"fas fa-code-branch parent-icon\"></i><span class=\"link-name\">Trunks</span>\n    </div>\n\n    <!-- Call Plan -->\n    <div class=\"main-menu-item\" (click)=\"toggleExpandClass('callplan')\">\n        <i class=\"fas fa-phone-volume parent-icon\"></i><span class=\"link-name\">Call Plan</span><i class=\"fa fa-chevron-down callplanChev\"></i>\n    </div>\n        <div class=\"nested-menu-container\" [class.expand]=\"showNavChildrenCallplan\">\n            <div class=\"nested-menu-item\" routerLink=\"call-plan-view\" routerLinkActive=\"active-link-child\">\n                <i class=\"far fa-circle\"></i><span class=\"link-name\">View Callplan</span>\n            </div>\n            <div class=\"nested-menu-item\" routerLink=\"call-plan-add-ratecard\" routerLinkActive=\"active-link-child\">\n                <i class=\"far fa-circle\"></i><span class=\"link-name\">Add Ratecard</span>\n            </div>\n            <div class=\"nested-menu-item\" routerLink=\"call-plan-add-code\" routerLinkActive=\"active-link-child\">\n                <i class=\"far fa-circle\"></i><span class=\"link-name\">Add Code</span>\n            </div>\n        </div>\n\n    <!-- LCR -->\n    <div class=\"main-menu-item\" (click)=\"toggleExpandClass('lcr')\">\n        <i class=\"fas fa-server parent-icon\"></i><span class=\"link-name\">LCR</span><i class=\"fa fa-chevron-down lcrChev\"></i>\n    </div>\n        <div class=\"nested-menu-container\" [class.expand]=\"showNavChildrenLcr\">\n            <div class=\"nested-menu-item\" routerLink=\"lcr-carrier\" routerLinkActive=\"active-link-child\">\n                <i class=\"far fa-circle\"></i><span class=\"link-name\">Carrier</span>\n            </div>\n            <div class=\"nested-menu-item\" routerLink=\"lcr-ratecard\" routerLinkActive=\"active-link-child\">\n                <i class=\"far fa-circle\"></i><span class=\"link-name\">Ratecard</span>\n            </div>\n            <div class=\"nested-menu-item\" routerLink=\"lcr-trunk\" routerLinkActive=\"active-link-child\">\n                <i class=\"far fa-circle\"></i><span class=\"link-name\">Trunk</span>\n            </div>\n            <div class=\"nested-menu-item\" routerLink=\"lcr-callplan\" routerLinkActive=\"active-link-child\">\n                <i class=\"far fa-circle\"></i><span class=\"link-name\">Callplan</span>\n            </div>\n        </div>\n\n    <!-- Account -->\n    <div class=\"main-menu-item\" routerLink=\"accounts\" routerLinkActive=\"active-link-parent\">\n        <i class=\"fas fa-user-circle parent-icon\"></i><span class=\"link-name\">Account</span>\n    </div>\n\n</nav>\n\n\n"

/***/ }),

/***/ "./src/app/side-nav/side-nav.component.scss":
/*!**************************************************!*\
  !*** ./src/app/side-nav/side-nav.component.scss ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "nav {\n  height: 100vh;\n  width: 160px;\n  position: fixed;\n  margin-top: 50px;\n  -webkit-user-select: none;\n     -moz-user-select: none;\n      -ms-user-select: none;\n          user-select: none;\n  background-color: #252D32; }\n  nav .active-link-parent > .parent-icon {\n    color: #557DA1; }\n  nav .active-link-child > span, nav .active-link-child > .fa-circle {\n    color: #ffffff; }\n  nav div.main-menu-item {\n    height: 40px;\n    width: 160px;\n    line-height: 40px;\n    color: #ffffff;\n    text-decoration: none;\n    display: inline-block; }\n  nav div.main-menu-item .parent-icon {\n      margin-left: 10px; }\n  nav div.main-menu-item .link-name {\n      margin-left: 10px; }\n  nav div.main-menu-item .fa-chevron-down {\n      float: right;\n      margin-top: 15px;\n      margin-right: 10px; }\n  nav div.main-menu-item .rotate {\n      -webkit-transform: rotate(180deg);\n              transform: rotate(180deg); }\n  nav div.main-menu-item:hover {\n      background-color: #434e53;\n      cursor: pointer; }\n  nav div.main-menu-item:focus {\n      outline: 0; }\n  nav div.nested-menu-container {\n    display: none;\n    height: auto;\n    width: 100%;\n    transition: height 2s; }\n  nav div.nested-menu-container .nested-menu-item {\n      height: 30px;\n      width: 100%;\n      background-color: #2F3B40;\n      color: #B1CEE1;\n      line-height: 30px; }\n  nav div.nested-menu-container .nested-menu-item .fa-circle {\n        margin-left: 15px;\n        font-size: 14px; }\n  nav div.nested-menu-container .nested-menu-item .link-name {\n        margin-left: 5px;\n        font-size: 14px; }\n  nav div.nested-menu-container .nested-menu-item .link-name-long {\n        font-size: 12px; }\n  nav div.nested-menu-container .nested-menu-item:hover {\n        color: #ffffff;\n        cursor: pointer; }\n  nav div.nested-menu-container .nested-menu-item:focus {\n        outline: 0; }\n  nav div.nested-menu-container.expand {\n    display: block; }\n  nav.active {\n  display: none; }\n"

/***/ }),

/***/ "./src/app/side-nav/side-nav.component.ts":
/*!************************************************!*\
  !*** ./src/app/side-nav/side-nav.component.ts ***!
  \************************************************/
/*! exports provided: SideNavComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SideNavComponent", function() { return SideNavComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var SideNavComponent = /** @class */ (function () {
    function SideNavComponent() {
        // Nav expand/collaspe toggle
        this.isExpanded = true;
        this.isSideBarMini = false;
        // Nav children
        this.showNavChildrenCarrier = false;
        this.showNavChildrenRatecard = false;
        this.showNavChildrenCallplan = false;
        this.showNavChildrenLcr = false;
    }
    SideNavComponent.prototype.toggleSideNav = function () {
        this.isExpanded = !this.isExpanded;
        this.isSideBarMini = !this.isSideBarMini;
    };
    SideNavComponent.prototype.toggleExpandClass = function (params) {
        if (params === 'carrier') {
            this.showNavChildrenCarrier = !this.showNavChildrenCarrier;
            this.chevronRotate('.carrierChev');
        }
        if (params === 'ratecard') {
            this.showNavChildrenRatecard = !this.showNavChildrenRatecard;
            this.chevronRotate('.ratecardChev');
        }
        if (params === 'callplan') {
            this.showNavChildrenCallplan = !this.showNavChildrenCallplan;
            this.chevronRotate('.callplanChev');
        }
        if (params === 'lcr') {
            this.showNavChildrenLcr = !this.showNavChildrenLcr;
            this.chevronRotate('.lcrChev');
        }
    };
    SideNavComponent.prototype.chevronRotate = function (_el) {
        var icon = document.querySelector(_el);
        icon.classList.toggle('rotate');
    };
    SideNavComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-side-nav',
            template: __webpack_require__(/*! ./side-nav.component.html */ "./src/app/side-nav/side-nav.component.html"),
            styles: [__webpack_require__(/*! ./side-nav.component.scss */ "./src/app/side-nav/side-nav.component.scss")],
        })
    ], SideNavComponent);
    return SideNavComponent;
}());



/***/ }),

/***/ "./src/app/top-nav/top-nav.component.html":
/*!************************************************!*\
  !*** ./src/app/top-nav/top-nav.component.html ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<header class=\"top-nav-container>\">\n\n    <aside class=\"app-title\">\n        <span><span>OBIE</span>-IWS</span>\n        <span class=\"toggle-sidenav\" (click)=\"onToggleSidenav($event)\"><i class=\"fas fa-bars\"></i></span>\n    </aside>\n\n    <aside class=\"account-container\">\n        <span class=\"login\" routerLink=\"login\" >LogIn</span> / <span class=\"registration\" routerLink=\"registration\">Registration</span>\n    </aside>\n</header>"

/***/ }),

/***/ "./src/app/top-nav/top-nav.component.scss":
/*!************************************************!*\
  !*** ./src/app/top-nav/top-nav.component.scss ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "header {\n  height: 50px;\n  width: 100vw;\n  position: fixed;\n  left: 0;\n  top: 0;\n  background-color: #518CB8; }\n  header .app-title {\n    height: 50px;\n    width: 160px;\n    position: fixed;\n    background-color: #497EA5;\n    text-align: center;\n    line-height: 50px;\n    font-size: 20px;\n    color: white; }\n  header .app-title span {\n      font-weight: bold; }\n  header .app-title .toggle-sidenav {\n      margin-left: 10px;\n      font-size: 20px;\n      border: 1px solid lightgray;\n      padding-left: 5px;\n      padding-right: 5px;\n      padding-top: 1px;\n      padding-bottom: 1px; }\n  header .app-title .toggle-sidenav:hover {\n      color: lightgray;\n      border: 1px solid white; }\n  header .app-title.active {\n    width: 60px;\n    background-color: black; }\n  header .toggle-sidenav.active {\n    text-align: center;\n    margin-left: 0px;\n    margin-right: 9px; }\n  header .account-container {\n    min-height: 50px;\n    min-width: 200px;\n    position: fixed;\n    line-height: 50px;\n    text-align: center;\n    color: white;\n    right: 0; }\n  header .account-container .toggle-sidenav {\n      float: left; }\n  header .account-container .login:hover, header .account-container .registration:hover {\n      color: #E3E3E3;\n      cursor: pointer; }\n"

/***/ }),

/***/ "./src/app/top-nav/top-nav.component.ts":
/*!**********************************************!*\
  !*** ./src/app/top-nav/top-nav.component.ts ***!
  \**********************************************/
/*! exports provided: TopNavComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TopNavComponent", function() { return TopNavComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var TopNavComponent = /** @class */ (function () {
    function TopNavComponent() {
        this.sidenavToggleEvent = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
        this.isExpanded = true;
        this.isSideBarMini = false;
    }
    TopNavComponent.prototype.onToggleSidenav = function ($event) {
        this.isExpanded = !this.isExpanded;
        this.isSideBarMini = !this.isSideBarMini;
        this.sidenavToggleEvent.emit(this.isSideBarMini);
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Output"])(),
        __metadata("design:type", Object)
    ], TopNavComponent.prototype, "sidenavToggleEvent", void 0);
    TopNavComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-top-nav',
            template: __webpack_require__(/*! ./top-nav.component.html */ "./src/app/top-nav/top-nav.component.html"),
            styles: [__webpack_require__(/*! ./top-nav.component.scss */ "./src/app/top-nav/top-nav.component.scss")]
        })
    ], TopNavComponent);
    return TopNavComponent;
}());



/***/ }),

/***/ "./src/app/trunks/trunks-table/dialog/add-trunks/add-trunks.component.html":
/*!*********************************************************************************!*\
  !*** ./src/app/trunks/trunks-table/dialog/add-trunks/add-trunks.component.html ***!
  \*********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<mat-horizontal-stepper linear> <!-- linear forces user to complete ea step -->\n\n    <!-- Choose Carrier Step -->\n    <mat-step [stepControl]=\"carrierFormGroup\" [completed]=\"false\">\n    <form [formGroup]=\"carrierFormGroup\">\n        <ng-template matStepLabel>Choose Carrier</ng-template>\n        <mat-form-field>\n            <mat-select placeholder=\"Carrier\" formControlName=\"carrierCtrl\">\n            <mat-option *ngFor=\"let carrier of carrierNames\" [value]=\"carrier.name\">\n                {{carrier.name}}\n            </mat-option>\n            </mat-select>\n        </mat-form-field>\n        <div>\n            <button mat-button matStepperNext [disabled]=\"carrierFormGroup.invalid\"> Next </button>\n        </div>\n    </form>\n    </mat-step>\n    \n    <!-- Enter Trunks Info Step -->\n    <mat-step [stepControl]=\"trunksFormGroup\" [completed]=\"false\">\n    <form [formGroup]=\"trunksFormGroup\">\n        <ng-template matStepLabel>Enter Trunks Information</ng-template>\n\n        <mat-form-field class=\"example-full-width\">\n            <input matInput placeholder=\"Trunk Name\" formControlName=\"nameCtrl\" />\n            <mat-error *ngIf=\"trunksFormGroup.get('nameCtrl').hasError('required')\">\n                Name is <strong>required</strong>\n            </mat-error>\n        </mat-form-field>\n\n        <mat-form-field class=\"input-half-width\">\n            <input matInput placeholder=\"Trunk IP\" formControlName=\"ipCtrl\" />\n            <mat-error *ngIf=\"trunksFormGroup.get('ipCtrl').hasError('required')\">\n                Trunk Ip is <strong>required</strong>\n            </mat-error>\n        </mat-form-field>\n\n        <mat-form-field class=\"input-half-width\">\n            <input matInput placeholder=\"Trunk Port\" formControlName=\"portCtrl\" />\n            <mat-error *ngIf=\"trunksFormGroup.get('portCtrl').hasError('required')\">\n                Trunk Port is <strong>required</strong>\n            </mat-error>\n        </mat-form-field>\n\n        <mat-form-field class=\"input-half-width\">\n            <mat-select placeholder=\"Trasport Method\" formControlName=\"transportCtrl\">\n                <mat-option *ngFor=\"let option of transportMethods\" [value]=\"option.value\">\n                    {{option.value}}\n                </mat-option>\n            </mat-select>\n        </mat-form-field>\n\n        <mat-form-field class=\"input-half-width\">\n            <mat-select placeholder=\"Direction\" formControlName=\"directionCtrl\">\n                <mat-option *ngFor=\"let option of directionValues\" [value]=\"option.value\">\n                    {{option.value}}\n                </mat-option>\n            </mat-select>\n        </mat-form-field>\n\n        <mat-form-field class=\"input-half-width\">\n            <input matInput placeholder=\"Trunk Prefix\" formControlName=\"prefixCtrl\" />\n        </mat-form-field>\n\n        <mat-form-field class=\"input-half-width\">\n            <mat-select placeholder=\"Active?\" formControlName=\"activeCtrl\">\n                <mat-option *ngFor=\"let option of activeValues\" [value]=\"option.value\">\n                    {{option.value}}\n                </mat-option>\n            </mat-select>\n        </mat-form-field>\n\n        <mat-form-field class=\"example-full-width\">\n            <input matInput placeholder=\"Meta Data\" formControlName=\"metadataCtrl\" />\n            <mat-error *ngIf=\"trunksFormGroup.get('metadataCtrl').hasError('required')\">\n                Meta Data is <strong>required</strong>\n            </mat-error>\n        </mat-form-field>\n\n        <div class=\"button-group\">\n            <button mat-button matStepperPrevious >Back</button>\n            <button mat-button matStepperNext [disabled]=\"!trunksFormGroup.valid\" (click)=\"createTrunkObj()\">Next</button>\n            <button mat-button (click)=\"insertTrunkTestData()\"> Insert Test Data </button>\n        </div>\n    </form>\n    </mat-step>\n    \n    <!-- Details & Finalize  -->\n    <mat-step [completed]=\"false\">\n        <ng-template matStepLabel>Review, Submit</ng-template>\n            <div class=\"details\">\n                <pre>{{finalTrunkObj | json}}</pre>\n                Press Submit to add new rate card. <br><br>\n            </div>\n        <div>\n            <button mat-button matStepperPrevious>Back</button>  \n            <button mat-button (click)=\"click_addTrunks()\">Submit</button>\n        </div>\n    </mat-step>\n    \n</mat-horizontal-stepper>\n"

/***/ }),

/***/ "./src/app/trunks/trunks-table/dialog/add-trunks/add-trunks.component.scss":
/*!*********************************************************************************!*\
  !*** ./src/app/trunks/trunks-table/dialog/add-trunks/add-trunks.component.scss ***!
  \*********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "mat-form-field {\n  width: 100%; }\n\n.input-half-width {\n  width: 49%; }\n\n.mat-button {\n  border: 1px solid black; }\n\n.button-group {\n  margin-top: 5%; }\n"

/***/ }),

/***/ "./src/app/trunks/trunks-table/dialog/add-trunks/add-trunks.component.ts":
/*!*******************************************************************************!*\
  !*** ./src/app/trunks/trunks-table/dialog/add-trunks/add-trunks.component.ts ***!
  \*******************************************************************************/
/*! exports provided: AddTrunksComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AddTrunksComponent", function() { return AddTrunksComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm5/material.es5.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _shared_api_services_trunk_trunks_api_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./../../../../shared/api-services/trunk/trunks.api.service */ "./src/app/shared/api-services/trunk/trunks.api.service.ts");
/* harmony import */ var _shared_services_trunk_trunks_shared_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./../../../../shared/services/trunk/trunks.shared.service */ "./src/app/shared/services/trunk/trunks.shared.service.ts");
/* harmony import */ var _shared_api_services_carrier_carrier_api_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./../../../../shared/api-services/carrier/carrier.api.service */ "./src/app/shared/api-services/carrier/carrier.api.service.ts");
/* harmony import */ var _shared_services_global_snackbar_shared_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./../../../../shared/services/global/snackbar.shared.service */ "./src/app/shared/services/global/snackbar.shared.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (undefined && undefined.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};







var AddTrunksComponent = /** @class */ (function () {
    function AddTrunksComponent(dialogRef, data, formBuilder, trunksService, trunksSharedService, carrierService, snackbarSharedService) {
        this.dialogRef = dialogRef;
        this.data = data;
        this.formBuilder = formBuilder;
        this.trunksService = trunksService;
        this.trunksSharedService = trunksSharedService;
        this.carrierService = carrierService;
        this.snackbarSharedService = snackbarSharedService;
        // Events
        this.event_onAdd = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"];
        // Input variables
        this.carrierNames = [];
        this.transportMethods = [{ value: 'udp' }, { value: 'tcp' }, { value: 'both' }];
        this.activeValues = [{ value: true }, { value: false }];
        this.directionValues = [{ value: 'inbound' }, { value: 'outbound' }];
    }
    AddTrunksComponent.prototype.ngOnInit = function () {
        this.get_getCarrierData();
        this.carrierFormGroup = this.formBuilder.group({
            carrierCtrl: ['', _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required]
        });
        this.trunksFormGroup = this.formBuilder.group({
            nameCtrl: ['', _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required],
            ipCtrl: ['', _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required],
            portCtrl: ['', _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required],
            transportCtrl: ['', _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required],
            directionCtrl: ['', _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required],
            prefixCtrl: ['', _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required],
            activeCtrl: ['', _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required],
            metadataCtrl: ['', _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required]
        });
    };
    /*
        ~~~~~~~~~~ API Service ~~~~~~~~~~
    */
    AddTrunksComponent.prototype.get_getCarrierData = function () {
        var _this = this;
        this.carrierService.get_carriers()
            .subscribe(function (data) { _this.extractCarrierNames(data); }, function (error) { console.log(error); });
    };
    AddTrunksComponent.prototype.post_addTrunk = function (body) {
        var _this = this;
        this.trunksService.post_addTrunk(body)
            .subscribe(function (resp) {
            console.log(resp);
            if (resp.status === 200) {
                _this.snackbarSharedService.snackbar_success('Trunk added succesfully.', 5000);
            }
        }, function (error) {
            console.log(error);
            _this.snackbarSharedService.snackbar_error('Trunk failed to add.', 5000);
        });
    };
    /*
        ~~~~~~~~~~ Extract Necessary Data ~~~~~~~~~~
    */
    AddTrunksComponent.prototype.filterMatchDataToAnyObjField = function (nameInput, arrayOfObj, field) {
        return arrayOfObj.filter(function (data) { return data.name === nameInput; });
    };
    AddTrunksComponent.prototype.returnCarrierId = function () {
        return this.filterMatchDataToAnyObjField(this.carrierFormGroup.get('carrierCtrl').value, this.carrierNames, name)[0].id;
    };
    AddTrunksComponent.prototype.extractCarrierNames = function (data) {
        for (var i = 0; i < data.length; i++) {
            this.carrierNames.push({ name: data[i].name, id: data[i].id });
        }
    };
    /*
        ~~~~~~~~~~ AG Grid Methods ~~~~~~~~~~
    */
    AddTrunksComponent.prototype.aggrid_addTrunks = function (body) {
        this.event_onAdd.emit(body);
    };
    /*
        ~~~~~~~~~~ Dialog ~~~~~~~~~~
    */
    AddTrunksComponent.prototype.createTrunkObj = function () {
        var randomNum = Math.floor(Math.random() * 9999);
        this.finalTrunkObj = {
            carrier_id: this.returnCarrierId(),
            carrier_name: this.carrierName,
            trunk_name: this.trunksFormGroup.get('nameCtrl').value + ' ' + randomNum,
            trunk_ip: this.trunksFormGroup.get('ipCtrl').value,
            trunk_port: parseInt(this.trunksFormGroup.get('portCtrl').value, 0),
            transport: this.trunksFormGroup.get('transportCtrl').value,
            direction: this.trunksFormGroup.get('directionCtrl').value,
            prefix: this.trunksFormGroup.get('prefixCtrl').value,
            active: this.trunksFormGroup.get('activeCtrl').value,
            metadata: this.trunksFormGroup.get('metadataCtrl').value
        };
    };
    AddTrunksComponent.prototype.click_addTrunks = function () {
        this.createTrunkObj();
        this.aggrid_addTrunks(this.finalTrunkObj);
        this.post_addTrunk(this.finalTrunkObj);
        this.closeDialog();
    };
    AddTrunksComponent.prototype.closeDialog = function () {
        this.dialogRef.close();
    };
    /*
        ~~~~~~~~~~ TEST ~~~~~~~~~~
    */
    AddTrunksComponent.prototype.insertTrunkTestData = function () {
        var randomNumber = Math.floor(Math.random() * Math.floor(9999));
        this.trunksFormGroup.get('nameCtrl').setValue('Test Trunk ' + randomNumber);
        this.trunksFormGroup.get('ipCtrl').setValue('192.168.1.1');
        this.trunksFormGroup.get('portCtrl').setValue('3308');
        this.trunksFormGroup.get('transportCtrl').setValue('udp');
        this.trunksFormGroup.get('directionCtrl').setValue('outbound');
        this.trunksFormGroup.get('prefixCtrl').setValue('1234');
        this.trunksFormGroup.get('activeCtrl').setValue(true);
        this.trunksFormGroup.get('metadataCtrl').setValue('meta data');
    };
    AddTrunksComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-add-trunks',
            template: __webpack_require__(/*! ./add-trunks.component.html */ "./src/app/trunks/trunks-table/dialog/add-trunks/add-trunks.component.html"),
            styles: [__webpack_require__(/*! ./add-trunks.component.scss */ "./src/app/trunks/trunks-table/dialog/add-trunks/add-trunks.component.scss")]
        }),
        __param(1, Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Inject"])(_angular_material__WEBPACK_IMPORTED_MODULE_1__["MAT_DIALOG_DATA"])),
        __metadata("design:paramtypes", [_angular_material__WEBPACK_IMPORTED_MODULE_1__["MatDialogRef"], Object, _angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormBuilder"],
            _shared_api_services_trunk_trunks_api_service__WEBPACK_IMPORTED_MODULE_3__["TrunksService"],
            _shared_services_trunk_trunks_shared_service__WEBPACK_IMPORTED_MODULE_4__["TrunksSharedService"],
            _shared_api_services_carrier_carrier_api_service__WEBPACK_IMPORTED_MODULE_5__["CarrierService"],
            _shared_services_global_snackbar_shared_service__WEBPACK_IMPORTED_MODULE_6__["SnackbarSharedService"]])
    ], AddTrunksComponent);
    return AddTrunksComponent;
}());



/***/ }),

/***/ "./src/app/trunks/trunks-table/dialog/delete-trunks/delete-trunks.component.html":
/*!***************************************************************************************!*\
  !*** ./src/app/trunks/trunks-table/dialog/delete-trunks/delete-trunks.component.html ***!
  \***************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<h2 mat-dialog-title>Are you sure?</h2>\n\n    <div mat-dialog-actions>\n        <button mat-button tabindex=\"-1\" (click)=\"click_delCarrier()\" >Yes</button>\n        <button mat-button tabindex=\"-1\" (click)=\"closeDialog()\">No</button>\n    </div>\n"

/***/ }),

/***/ "./src/app/trunks/trunks-table/dialog/delete-trunks/delete-trunks.component.scss":
/*!***************************************************************************************!*\
  !*** ./src/app/trunks/trunks-table/dialog/delete-trunks/delete-trunks.component.scss ***!
  \***************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "button {\n  border: 1px solid black; }\n"

/***/ }),

/***/ "./src/app/trunks/trunks-table/dialog/delete-trunks/delete-trunks.component.ts":
/*!*************************************************************************************!*\
  !*** ./src/app/trunks/trunks-table/dialog/delete-trunks/delete-trunks.component.ts ***!
  \*************************************************************************************/
/*! exports provided: DeleteTrunksComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DeleteTrunksComponent", function() { return DeleteTrunksComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm5/material.es5.js");
/* harmony import */ var _shared_api_services_trunk_trunks_api_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./../../../../shared/api-services/trunk/trunks.api.service */ "./src/app/shared/api-services/trunk/trunks.api.service.ts");
/* harmony import */ var _shared_services_trunk_trunks_shared_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./../../../../shared/services/trunk/trunks.shared.service */ "./src/app/shared/services/trunk/trunks.shared.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (undefined && undefined.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};




var DeleteTrunksComponent = /** @class */ (function () {
    function DeleteTrunksComponent(dialogRef, data, trunksService, trunksSharedService) {
        this.dialogRef = dialogRef;
        this.data = data;
        this.trunksService = trunksService;
        this.trunksSharedService = trunksSharedService;
    }
    DeleteTrunksComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.trunksSharedService.currentRowId.subscribe(function (data) { return _this.rowObj = data; });
    };
    DeleteTrunksComponent.prototype.click_delCarrier = function () {
        this.del_delTrunks();
        this.closeDialog();
    };
    DeleteTrunksComponent.prototype.del_delTrunks = function () {
        var rowId;
        for (var i = 0; i < this.rowObj.length; i++) {
            rowId = this.rowObj[i].id;
            this.trunksService.del_deleteTrunk(rowId)
                .subscribe(function (resp) { return console.log(resp); });
        }
    };
    DeleteTrunksComponent.prototype.closeDialog = function () {
        this.dialogRef.close();
    };
    DeleteTrunksComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-delete-trunks',
            template: __webpack_require__(/*! ./delete-trunks.component.html */ "./src/app/trunks/trunks-table/dialog/delete-trunks/delete-trunks.component.html"),
            styles: [__webpack_require__(/*! ./delete-trunks.component.scss */ "./src/app/trunks/trunks-table/dialog/delete-trunks/delete-trunks.component.scss")],
            providers: [_shared_api_services_trunk_trunks_api_service__WEBPACK_IMPORTED_MODULE_2__["TrunksService"]],
        }),
        __param(1, Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Inject"])(_angular_material__WEBPACK_IMPORTED_MODULE_1__["MAT_DIALOG_DATA"])),
        __metadata("design:paramtypes", [_angular_material__WEBPACK_IMPORTED_MODULE_1__["MatDialogRef"], Object, _shared_api_services_trunk_trunks_api_service__WEBPACK_IMPORTED_MODULE_2__["TrunksService"],
            _shared_services_trunk_trunks_shared_service__WEBPACK_IMPORTED_MODULE_3__["TrunksSharedService"]])
    ], DeleteTrunksComponent);
    return DeleteTrunksComponent;
}());



/***/ }),

/***/ "./src/app/trunks/trunks-table/trunks-table.component.html":
/*!*****************************************************************!*\
  !*** ./src/app/trunks/trunks-table/trunks-table.component.html ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<section>\n    <div class=\"table-container\">\n        <ag-grid-angular class=\"ag-theme-balham\" [animateRows]=\"true\"\n            [columnDefs]=\"columnDefs\" [rowData]=\"rowData\" [suppressRowClickSelection]=\"true\"\n            [rowSelection]=\"rowSelection\" (selectionChanged)=\"onSelectionChanged()\" (rowSelected)=\"rowSelected($event)\"\n            [stopEditingWhenGridLosesFocus]=\"true\" [singleClickEdit]=\"true\" (cellValueChanged)=\"aggrid_onCellValueChanged($event)\"\n            [enableFilter]=\"true\" [floatingFilter]=\"true\"\n            [enableSorting]=\"true\"\n            [enableColResize]=\"true\" (gridSizeChanged)=\"onGridSizeChanged($event)\"\n            [pagination]=\"true\" [paginationAutoPageSize]=\"true\"\n            [suppressNoRowsOverlay]=\"true\"\n            [headerHeight]=\"40\" [floatingFiltersHeight]=\"30\"\n            \n            [enableCellChangeFlash]=\"true\"\n\n            (gridReady)=\"onGridReady($event)\"\n        >\n        </ag-grid-angular>\n\n        <mat-toolbar-row>\n            <button (click)=\"openDialogDel()\" [disabled]=\"toggleButtonStates()\" class=\"del\" > <i class=\"fas fa-trash-alt\"></i> </button>\n            <button (click)=\"openDialogAddTrunks()\" > <i class=\"fas fa-plus\"></i> Trunks</button>\n    \n            <mat-form-field class=\"search-bar\">\n                    <span matPrefix><i class=\"fas fa-search\"></i> &nbsp;</span>\n                    <input matInput placeholder=\"Search Trunks Table...\" (keyup)=\"onQuickFilterChanged()\" [(ngModel)]=\"quickSearchValue\">\n            </mat-form-field>\n        </mat-toolbar-row>\n    </div>\n</section>"

/***/ }),

/***/ "./src/app/trunks/trunks-table/trunks-table.component.scss":
/*!*****************************************************************!*\
  !*** ./src/app/trunks/trunks-table/trunks-table.component.scss ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "section {\n  margin-left: 5px;\n  margin-right: 5px;\n  margin-top: 5px; }\n  section .table-container {\n    width: 100%;\n    height: 100%;\n    float: left; }\n  section .table-container ag-grid-angular {\n      width: 99.7%;\n      height: 85vh; }\n  section .table-container mat-toolbar-row {\n      height: auto; }\n  section .table-container mat-toolbar-row mat-form-field {\n        font-size: 14px; }\n  section .table-container mat-toolbar-row button {\n        background-color: Transparent;\n        width: auto;\n        height: 30px;\n        padding: 5px;\n        border: 1px solid #E0E0E0;\n        margin-right: 5px; }\n  section .table-container mat-toolbar-row button:hover {\n        background-color: #E0E0E0; }\n  section .table-container mat-toolbar-row button:focus {\n        outline: 0; }\n  section .table-container mat-toolbar-row .search-bar {\n        float: right;\n        position: relative;\n        width: 40%;\n        padding-right: 5px;\n        margin-top: -10px; }\n"

/***/ }),

/***/ "./src/app/trunks/trunks-table/trunks-table.component.ts":
/*!***************************************************************!*\
  !*** ./src/app/trunks/trunks-table/trunks-table.component.ts ***!
  \***************************************************************/
/*! exports provided: TrunksTableComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TrunksTableComponent", function() { return TrunksTableComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm5/material.es5.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _dialog_delete_trunks_delete_trunks_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./dialog/delete-trunks/delete-trunks.component */ "./src/app/trunks/trunks-table/dialog/delete-trunks/delete-trunks.component.ts");
/* harmony import */ var _dialog_add_trunks_add_trunks_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./dialog/add-trunks/add-trunks.component */ "./src/app/trunks/trunks-table/dialog/add-trunks/add-trunks.component.ts");
/* harmony import */ var _shared_api_services_trunk_trunks_api_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./../../shared/api-services/trunk/trunks.api.service */ "./src/app/shared/api-services/trunk/trunks.api.service.ts");
/* harmony import */ var _shared_services_trunk_trunks_shared_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./../../shared/services/trunk/trunks.shared.service */ "./src/app/shared/services/trunk/trunks.shared.service.ts");
/* harmony import */ var _shared_services_global_buttonStates_shared_service__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./../../shared/services/global/buttonStates.shared.service */ "./src/app/shared/services/global/buttonStates.shared.service.ts");
/* harmony import */ var _shared_services_global_snackbar_shared_service__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./../../shared/services/global/snackbar.shared.service */ "./src/app/shared/services/global/snackbar.shared.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};









var TrunksTableComponent = /** @class */ (function () {
    function TrunksTableComponent(dialog, formBuilder, trunksService, trunksSharedService, toggleButtonStateService, snackbarSharedService) {
        this.dialog = dialog;
        this.formBuilder = formBuilder;
        this.trunksService = trunksService;
        this.trunksSharedService = trunksSharedService;
        this.toggleButtonStateService = toggleButtonStateService;
        this.snackbarSharedService = snackbarSharedService;
        this.rowSelection = 'multiple';
        this.quickSearchValue = '';
        // Props for button toggle
        this.buttonToggleBoolean = true;
        this.columnDefs = this.createColumnDefs();
    }
    TrunksTableComponent.prototype.ngOnInit = function () {
        this.get_TrunkData();
    };
    // ================================================================================
    // Trunk API Service
    // ================================================================================
    TrunksTableComponent.prototype.get_TrunkData = function () {
        var _this = this;
        this.trunksService.get_allTrunks()
            .subscribe(function (data) { _this.rowData = data; }, function (error) { console.log(error); });
    };
    TrunksTableComponent.prototype.set_TrunkData = function () {
        var _this = this;
        this.trunksService.get_allTrunks()
            .subscribe(function (data) { _this.gridApi.setRowData(data); }, function (error) { console.log(error); });
    };
    TrunksTableComponent.prototype.put_editTrunks = function (trunkId, body) {
        var _this = this;
        this.trunksService.put_editTrunk(trunkId, body)
            .subscribe(function (resp) {
            console.log(resp);
            _this.snackbarSharedService.snackbar_success('Edit Successful.', 2000);
        }, function (error) {
            console.log(error);
            _this.snackbarSharedService.snackbar_error('Edit failed.', 2000);
        });
    };
    // ================================================================================
    // AG Grid Init
    // ================================================================================
    TrunksTableComponent.prototype.onGridReady = function (params) {
        this.gridApi = params.api;
        params.api.sizeColumnsToFit();
    };
    TrunksTableComponent.prototype.createColumnDefs = function () {
        return [
            {
                headerName: 'Trunk Name', field: 'trunk_name',
                editable: true, checkboxSelection: true,
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Carrier', field: 'carrier_name',
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Trunk IP', field: 'trunk_ip',
                editable: true, cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Trunk Port', field: 'trunk_port',
                editable: true, cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Transport Method', field: 'transport', editable: true,
                cellEditor: 'select', cellEditorParams: { values: ['udp', 'tcp', 'both'] },
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Direction', field: 'direction', editable: true,
                cellEditor: 'select', cellEditorParams: { values: ['inbound', 'outbound'] },
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Prefix', field: 'prefix',
                editable: true, cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Active?', field: 'active', editable: true,
                valueFormatter: function (params) {
                    if (params.value === 1) {
                        return true;
                    }
                    if (params.value === 0) {
                        return false;
                    }
                },
                cellEditor: 'select', cellEditorParams: { values: [true, false] },
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Metadata', field: 'metadata',
                editable: true,
            }
        ];
    };
    // ================================================================================
    // AG Grid UI
    // ================================================================================
    TrunksTableComponent.prototype.onGridSizeChanged = function (params) {
        params.api.sizeColumnsToFit();
    };
    TrunksTableComponent.prototype.onSelectionChanged = function () {
        this.rowObj = this.gridApi.getSelectedRows();
    };
    TrunksTableComponent.prototype.aggrid_onCellValueChanged = function (params) {
        var id = params.data.id;
        var active;
        if (params.data.active === 1 || params.data.active === 'true') {
            active = true;
        }
        if (params.data.active === 0 || params.data.active === 'false') {
            active = false;
        }
        var trunkObj = {
            carrier_id: params.data.carrier_id,
            trunk_name: params.data.trunk_name,
            trunk_ip: params.data.trunk_ip,
            trunk_port: parseInt(params.data.trunk_port, 0),
            transport: params.data.transport,
            direction: params.data.direction,
            prefix: params.data.prefix,
            active: active,
            metadata: params.data.metadata
        };
        this.put_editTrunks(id, trunkObj);
    };
    TrunksTableComponent.prototype.onQuickFilterChanged = function () {
        this.gridApi.setQuickFilter(this.quickSearchValue);
    };
    // ================================================================================
    // Button Toggle
    // ================================================================================
    TrunksTableComponent.prototype.rowSelected = function (params) {
        this.gridSelectionStatus = this.gridApi.getSelectedNodes().length;
    };
    TrunksTableComponent.prototype.toggleButtonStates = function () {
        return this.toggleButtonStateService.toggleButtonStates(this.gridSelectionStatus);
    };
    // ================================================================================
    // Dialog
    // ================================================================================
    TrunksTableComponent.prototype.openDialogDel = function () {
        var _this = this;
        this.trunksSharedService.changeRowObj(this.rowObj);
        var dialogRef = this.dialog.open(_dialog_delete_trunks_delete_trunks_component__WEBPACK_IMPORTED_MODULE_3__["DeleteTrunksComponent"], {});
        dialogRef.afterClosed().subscribe(function () {
            _this.set_TrunkData();
        });
    };
    TrunksTableComponent.prototype.openDialogAddTrunks = function () {
        var dialogRef = this.dialog.open(_dialog_add_trunks_add_trunks_component__WEBPACK_IMPORTED_MODULE_4__["AddTrunksComponent"], {
            height: 'auto',
            width: '50%',
        });
        dialogRef.afterClosed().subscribe(function () {
        });
    };
    TrunksTableComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-trunks-table',
            template: __webpack_require__(/*! ./trunks-table.component.html */ "./src/app/trunks/trunks-table/trunks-table.component.html"),
            styles: [__webpack_require__(/*! ./trunks-table.component.scss */ "./src/app/trunks/trunks-table/trunks-table.component.scss")]
        }),
        __metadata("design:paramtypes", [_angular_material__WEBPACK_IMPORTED_MODULE_1__["MatDialog"],
            _angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormBuilder"],
            _shared_api_services_trunk_trunks_api_service__WEBPACK_IMPORTED_MODULE_5__["TrunksService"],
            _shared_services_trunk_trunks_shared_service__WEBPACK_IMPORTED_MODULE_6__["TrunksSharedService"],
            _shared_services_global_buttonStates_shared_service__WEBPACK_IMPORTED_MODULE_7__["ToggleButtonStateService"],
            _shared_services_global_snackbar_shared_service__WEBPACK_IMPORTED_MODULE_8__["SnackbarSharedService"]])
    ], TrunksTableComponent);
    return TrunksTableComponent;
}());



/***/ }),

/***/ "./src/environments/environment.ts":
/*!*****************************************!*\
  !*** ./src/environments/environment.ts ***!
  \*****************************************/
/*! exports provided: environment */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "environment", function() { return environment; });
// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
var environment = {
    production: false
};


/***/ }),

/***/ "./src/main.ts":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_platform_browser_dynamic__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/platform-browser-dynamic */ "./node_modules/@angular/platform-browser-dynamic/fesm5/platform-browser-dynamic.js");
/* harmony import */ var _app_app_module__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./app/app.module */ "./src/app/app.module.ts");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./environments/environment */ "./src/environments/environment.ts");




if (_environments_environment__WEBPACK_IMPORTED_MODULE_3__["environment"].production) {
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["enableProdMode"])();
}
Object(_angular_platform_browser_dynamic__WEBPACK_IMPORTED_MODULE_1__["platformBrowserDynamic"])().bootstrapModule(_app_app_module__WEBPACK_IMPORTED_MODULE_2__["AppModule"])
    .catch(function (err) { return console.log(err); });


/***/ }),

/***/ 0:
/*!***************************!*\
  !*** multi ./src/main.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! /Users/m.chan/workspace/iws/src/main.ts */"./src/main.ts");


/***/ })

},[[0,"runtime","vendor"]]]);
//# sourceMappingURL=main.js.map