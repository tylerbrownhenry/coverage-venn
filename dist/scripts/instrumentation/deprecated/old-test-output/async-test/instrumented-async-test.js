"use strict";
function _typeof(o) {
    "@babel/helpers - typeof";
    return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o);
}
function _regeneratorRuntime() {
    "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */
    _regeneratorRuntime = function _regeneratorRuntime() { return e; };
    var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag";
    function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; }
    try {
        define({}, "");
    }
    catch (t) {
        define = function define(t, e, r) { return t[e] = r; };
    }
    function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; }
    function tryCatch(t, e, r) { try {
        return { type: "normal", arg: t.call(e, r) };
    }
    catch (t) {
        return { type: "throw", arg: t };
    } }
    e.wrap = wrap;
    var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {};
    function Generator() { }
    function GeneratorFunction() { }
    function GeneratorFunctionPrototype() { }
    var p = {};
    define(p, a, function () { return this; });
    var d = Object.getPrototypeOf, v = d && d(d(values([])));
    v && v !== r && n.call(v, a) && (p = v);
    var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p);
    function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); }
    function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) {
        var u = c.arg, h = u.value;
        return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); });
    } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); }
    function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f)
        throw Error("Generator is already running"); if (o === s) {
        if ("throw" === i)
            throw a;
        return { value: t, done: !0 };
    } for (n.method = i, n.arg = a;;) {
        var c = n.delegate;
        if (c) {
            var u = maybeInvokeDelegate(c, n);
            if (u) {
                if (u === y)
                    continue;
                return u;
            }
        }
        if ("next" === n.method)
            n.sent = n._sent = n.arg;
        else if ("throw" === n.method) {
            if (o === h)
                throw o = s, n.arg;
            n.dispatchException(n.arg);
        }
        else
            "return" === n.method && n.abrupt("return", n.arg);
        o = f;
        var p = tryCatch(e, r, n);
        if ("normal" === p.type) {
            if (o = n.done ? s : l, p.arg === y)
                continue;
            return { value: p.arg, done: n.done };
        }
        "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg);
    } }; }
    function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t)
        return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type)
        return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); }
    function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); }
    function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; }
    function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); }
    function values(e) { if (e || "" === e) {
        var r = e[a];
        if (r)
            return r.call(e);
        if ("function" == typeof e.next)
            return e;
        if (!isNaN(e.length)) {
            var o = -1, i = function next() { for (; ++o < e.length;)
                if (n.call(e, o))
                    return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; };
            return i.next = i;
        }
    } throw new TypeError(_typeof(e) + " is not iterable"); }
    return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e)
        r.push(n); return r.reverse(), function next() { for (; r.length;) {
        var t = r.pop();
        if (t in e)
            return next.value = t, next.done = !1, next;
    } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e)
            for (var r in this)
                "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type)
            throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done)
            throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) {
            var i = this.tryEntries[o], a = i.completion;
            if ("root" === i.tryLoc)
                return handle("end");
            if (i.tryLoc <= this.prev) {
                var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc");
                if (c && u) {
                    if (this.prev < i.catchLoc)
                        return handle(i.catchLoc, !0);
                    if (this.prev < i.finallyLoc)
                        return handle(i.finallyLoc);
                }
                else if (c) {
                    if (this.prev < i.catchLoc)
                        return handle(i.catchLoc, !0);
                }
                else {
                    if (!u)
                        throw Error("try statement without catch or finally");
                    if (this.prev < i.finallyLoc)
                        return handle(i.finallyLoc);
                }
            }
        } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) {
            var o = this.tryEntries[r];
            if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) {
                var i = o;
                break;
            }
        } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type)
            throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) {
            var r = this.tryEntries[e];
            if (r.finallyLoc === t)
                return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y;
        } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) {
            var r = this.tryEntries[e];
            if (r.tryLoc === t) {
                var n = r.completion;
                if ("throw" === n.type) {
                    var o = n.arg;
                    resetTryEntry(r);
                }
                return o;
            }
        } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e;
}
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o);
} return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) {
    var t = null != arguments[r] ? arguments[r] : {};
    r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); });
} return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t)
    return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != _typeof(i))
        return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
} return ("string" === r ? String : Number)(t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try {
    var i = n[a](c), u = i.value;
}
catch (n) {
    return void e(n);
} i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return (() => { const _promiseTracker4 = COVERAGE_TRACKER.trackPromiseCreation("AsyncTest", 4, "creation"); return _promiseTracker4(new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); })); })(); }; }
/**
 * Test file for async function and promise instrumentation
 *
 * This file tests various patterns of async functions and promises
 * to ensure our instrumentation works correctly.
 */
// Simple async function with await
function fetchData() {
    return _fetchData.apply(this, arguments);
} // Async arrow function
function _fetchData() {
    _fetchData = _asyncToGenerator(/*#__PURE__*/ _regeneratorRuntime().mark(function _callee4() {
        return _regeneratorRuntime().wrap(function _callee4$(_context4) {
            while (1)
                switch (_context4.prev = _context4.next) {
                    case 0:
                        COVERAGE_TRACKER.trackAsyncFunctionStart("fetchData", "fetchData", 0);
                        return _context4.abrupt("return", /*#__PURE__*/ _asyncToGenerator(/*#__PURE__*/ _regeneratorRuntime().mark(function _callee3() {
                            return _regeneratorRuntime().wrap(function _callee3$(_context3) {
                                while (1)
                                    switch (_context3.prev = _context3.next) {
                                        case 0:
                                            _context3.prev = 0;
                                            console.log('Fetching data...');
                                            // Simulate network delay
                                            _context3.next = 4;
                                            return function () {
                                                var _promiseTracker5 = COVERAGE_TRACKER.trackPromiseCreation("AsyncTest", 5, "creation");
                                                return _promiseTracker5(function () {
                                                    var _promiseTracker6 = COVERAGE_TRACKER.trackPromiseCreation("AsyncTest", 6, "creation");
                                                    return _promiseTracker6((() => {
                                                        const _promiseTracker7 = COVERAGE_TRACKER.trackPromiseCreation("AsyncTest", 7, "creation");
                                                        return _promiseTracker7(new Promise(resolve => setTimeout(resolve, 100)));
                                                    })());
                                                }());
                                            }();
                                        case 4:
                                            console.log('Data fetched successfully');
                                            return _context3.abrupt("return", {
                                                success: true,
                                                data: {
                                                    id: 1,
                                                    name: 'Test'
                                                }
                                            });
                                        case 8:
                                            _context3.prev = 8;
                                            _context3.t0 = _context3["catch"](0);
                                            console.error('Error fetching data:', _context3.t0);
                                            return _context3.abrupt("return", {
                                                success: false,
                                                error: _context3.t0
                                            });
                                        case 12:
                                        case "end":
                                            return _context3.stop();
                                    }
                            }, _callee3, null, [[0, 8]]);
                        })).call(this).then(function (_asyncResult) {
                            return COVERAGE_TRACKER.trackAsyncFunctionResolved("fetchData", "fetchData", 0, _asyncResult);
                        }, function (error) {
                            return COVERAGE_TRACKER.trackAsyncFunctionRejected("fetchData", "fetchData", 0, error);
                        }));
                    case 2:
                    case "end":
                        return _context4.stop();
                }
        }, _callee4, this);
    }));
    return _fetchData.apply(this, arguments);
}
var processData = /*#__PURE__*/ function () {
    var _ref = _asyncToGenerator(/*#__PURE__*/ _regeneratorRuntime().mark(function _callee(data) {
        return _regeneratorRuntime().wrap(function _callee$(_context) {
            while (1)
                switch (_context.prev = _context.next) {
                    case 0:
                        console.log('Processing data...');
                        // Simulate processing
                        _context.next = 3;
                        return function () {
                            var _promiseTracker = COVERAGE_TRACKER.trackPromiseCreation("_ref", 0, "creation");
                            return _promiseTracker((() => {
                                const _promiseTracker2 = COVERAGE_TRACKER.trackPromiseCreation("_ref", 1, "creation");
                                return _promiseTracker2(new Promise(resolve => setTimeout(resolve, 50)));
                            })());
                        }();
                    case 3:
                        return _context.abrupt("return", _objectSpread(_objectSpread({}, data), {}, {
                            processed: true
                        }));
                    case 4:
                    case "end":
                        return _context.stop();
                }
        }, _callee);
    }));
    return function processData(_x) {
        return _ref.apply(this, arguments);
    };
}();
// Function returning a promise (not using async/await)
function saveData(data) {
    console.log('Saving data...');
    return (() => {
        const _promiseTracker3 = COVERAGE_TRACKER.trackPromiseCreation("saveData", 2, "creation");
        return _promiseTracker3(new Promise((resolve, reject) => {
            // Simulate database operation
            setTimeout(() => {
                if (data.id) {
                    resolve({
                        success: true,
                        id: data.id
                    });
                }
                else {
                    reject(new Error('Invalid data: missing ID'));
                }
            }, 80);
        }));
    })();
}
// Async function with multiple awaits and conditional paths
function complexOperation(_x2) {
    return _complexOperation.apply(this, arguments);
} // Promise.all usage
function _complexOperation() {
    _complexOperation = _asyncToGenerator(/*#__PURE__*/ _regeneratorRuntime().mark(function _callee6(condition) {
        return _regeneratorRuntime().wrap(function _callee6$(_context6) {
            while (1)
                switch (_context6.prev = _context6.next) {
                    case 0:
                        COVERAGE_TRACKER.trackAsyncFunctionStart("complexOperation", "complexOperation", 1);
                        return _context6.abrupt("return", /*#__PURE__*/ _asyncToGenerator(/*#__PURE__*/ _regeneratorRuntime().mark(function _callee5() {
                            var data, processedData, result;
                            return _regeneratorRuntime().wrap(function _callee5$(_context5) {
                                while (1)
                                    switch (_context5.prev = _context5.next) {
                                        case 0:
                                            console.log('Starting complex operation...');
                                            _context5.next = 3;
                                            return fetchData();
                                        case 3:
                                            data = _context5.sent;
                                            if (data.success) {
                                                _context5.next = 7;
                                                break;
                                            }
                                            console.error('Failed to fetch data');
                                            return _context5.abrupt("return", {
                                                success: false,
                                                stage: 'fetch'
                                            });
                                        case 7:
                                            if (!condition) {
                                                _context5.next = 13;
                                                break;
                                            }
                                            _context5.next = 10;
                                            return processData(data.data);
                                        case 10:
                                            _context5.t0 = _context5.sent;
                                            _context5.next = 14;
                                            break;
                                        case 13:
                                            _context5.t0 = data.data;
                                        case 14:
                                            processedData = _context5.t0;
                                            _context5.prev = 15;
                                            _context5.next = 18;
                                            return saveData(processedData);
                                        case 18:
                                            result = _context5.sent;
                                            console.log('Operation completed successfully');
                                            return _context5.abrupt("return", {
                                                success: true,
                                                result: result
                                            });
                                        case 23:
                                            _context5.prev = 23;
                                            _context5.t1 = _context5["catch"](15);
                                            console.error('Failed to save data:', _context5.t1);
                                            return _context5.abrupt("return", {
                                                success: false,
                                                stage: 'save',
                                                error: _context5.t1
                                            });
                                        case 27:
                                        case "end":
                                            return _context5.stop();
                                    }
                            }, _callee5, null, [[15, 23]]);
                        })).call(this).then(function (_asyncResult2) {
                            return COVERAGE_TRACKER.trackAsyncFunctionResolved("complexOperation", "complexOperation", 1, _asyncResult2);
                        }, function (error) {
                            return COVERAGE_TRACKER.trackAsyncFunctionRejected("complexOperation", "complexOperation", 1, error);
                        }));
                    case 2:
                    case "end":
                        return _context6.stop();
                }
        }, _callee6, this);
    }));
    return _complexOperation.apply(this, arguments);
}
function batchProcess(_x3) {
    return _batchProcess.apply(this, arguments);
} // Promise chaining (without async/await)
function _batchProcess() {
    _batchProcess = _asyncToGenerator(/*#__PURE__*/ _regeneratorRuntime().mark(function _callee8(items) {
        return _regeneratorRuntime().wrap(function _callee8$(_context8) {
            while (1)
                switch (_context8.prev = _context8.next) {
                    case 0:
                        COVERAGE_TRACKER.trackAsyncFunctionStart("batchProcess", "batchProcess", 2);
                        return _context8.abrupt("return", /*#__PURE__*/ _asyncToGenerator(/*#__PURE__*/ _regeneratorRuntime().mark(function _callee7() {
                            var results;
                            return _regeneratorRuntime().wrap(function _callee7$(_context7) {
                                while (1)
                                    switch (_context7.prev = _context7.next) {
                                        case 0:
                                            console.log("Processing ".concat(items.length, " items in parallel..."));
                                            _context7.prev = 1;
                                            _context7.next = 4;
                                            return Promise.all(items.map(function (item) {
                                                return processData(item);
                                            }));
                                        case 4:
                                            results = _context7.sent;
                                            console.log('Batch processing completed');
                                            return _context7.abrupt("return", results);
                                        case 9:
                                            _context7.prev = 9;
                                            _context7.t0 = _context7["catch"](1);
                                            console.error('Error in batch processing:', _context7.t0);
                                            throw _context7.t0;
                                        case 13:
                                        case "end":
                                            return _context7.stop();
                                    }
                            }, _callee7, null, [[1, 9]]);
                        })).call(this).then(function (_asyncResult3) {
                            return COVERAGE_TRACKER.trackAsyncFunctionResolved("batchProcess", "batchProcess", 2, _asyncResult3);
                        }, function (error) {
                            return COVERAGE_TRACKER.trackAsyncFunctionRejected("batchProcess", "batchProcess", 2, error);
                        }));
                    case 2:
                    case "end":
                        return _context8.stop();
                }
        }, _callee8, this);
    }));
    return _batchProcess.apply(this, arguments);
}
function chainedOperations() {
    return (COVERAGE_TRACKER.trackPromiseThen("chainedOperations", 3, "then"), fetchData().then(result => {
        if (!result.success) {
            throw new Error('Fetch failed in chain');
        }
        return processData(result.data);
    }).then(processed => saveData(processed)).then(saveResult => {
        console.log('Chain completed successfully');
        return saveResult;
    }))["catch"](function (error) {
        console.error('Error in promise chain:', error);
        return {
            success: false,
            error: error
        };
    });
}
// Immediately Invoked Async Function Expression (IIAFE)
_asyncToGenerator(/*#__PURE__*/ _regeneratorRuntime().mark(function _callee2() {
    var fetchResult, complexResult1, complexResult2, batchResult, chainResult;
    return _regeneratorRuntime().wrap(function _callee2$(_context2) {
        while (1)
            switch (_context2.prev = _context2.next) {
                case 0:
                    console.log('Running tests...');
                    _context2.prev = 1;
                    _context2.next = 4;
                    return fetchData();
                case 4:
                    fetchResult = _context2.sent;
                    console.log('Fetch result:', fetchResult.success);
                    // Test 2: Complex operation with condition = true
                    _context2.next = 8;
                    return complexOperation(true);
                case 8:
                    complexResult1 = _context2.sent;
                    console.log('Complex operation (true):', complexResult1.success);
                    // Test 3: Complex operation with condition = false
                    _context2.next = 12;
                    return complexOperation(false);
                case 12:
                    complexResult2 = _context2.sent;
                    console.log('Complex operation (false):', complexResult2.success);
                    // Test 4: Batch processing
                    _context2.next = 16;
                    return batchProcess([{
                            id: 2,
                            name: 'Test 2'
                        }, {
                            id: 3,
                            name: 'Test 3'
                        }]);
                case 16:
                    batchResult = _context2.sent;
                    console.log('Batch processing complete, processed', batchResult.length, 'items');
                    // Test 5: Promise chaining
                    _context2.next = 20;
                    return chainedOperations();
                case 20:
                    chainResult = _context2.sent;
                    console.log('Chain result:', chainResult.success);
                    console.log('All tests completed successfully');
                    _context2.next = 28;
                    break;
                case 25:
                    _context2.prev = 25;
                    _context2.t0 = _context2["catch"](1);
                    console.error('Test suite failed:', _context2.t0);
                case 28:
                case "end":
                    return _context2.stop();
            }
    }, _callee2, null, [[1, 25]]);
}))();
