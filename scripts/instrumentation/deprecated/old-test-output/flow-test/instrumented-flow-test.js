"use strict";

function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = COVERAGE_TRACKER.trackBranch("_regeneratorRuntime", "idqinjow4", "logical-||", Object.defineProperty) || function (t, e, r) { t[e] = r.value; }, i = COVERAGE_TRACKER.trackBranch("_regeneratorRuntime", "9yhneufp0", "ternary", "function" == typeof Symbol) ? Symbol : {}, a = COVERAGE_TRACKER.trackBranch("_regeneratorRuntime", "9rfmlo8jv", "logical-||", i.iterator) || "@@iterator", c = COVERAGE_TRACKER.trackBranch("_regeneratorRuntime", "i2iez2i2o", "logical-||", i.asyncIterator) || "@@asyncIterator", u = COVERAGE_TRACKER.trackBranch("_regeneratorRuntime", "uqddftckb", "logical-||", i.toStringTag) || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = COVERAGE_TRACKER.trackBranch("wrap", "jwyid7pog", "ternary", e && e.prototype instanceof Generator) ? e : Generator, a = Object.create(i.prototype), c = new Context(COVERAGE_TRACKER.trackBranch("wrap", "lghrxrx4w", "logical-||", n) || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = COVERAGE_TRACKER.trackBranch("_regeneratorRuntime", "4wzuypbxm", "logical-&&", d) && d(d(values([]))); COVERAGE_TRACKER.trackBranch("_regeneratorRuntime", "ak36kor3r", "logical-&&", v && v !== r && n.call(v, a)) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if (COVERAGE_TRACKER.trackBranch("invoke", "pax1onrtz", "if", "throw" !== c.type)) { var u = c.arg, h = u.value; return COVERAGE_TRACKER.trackBranch("invoke", "nuxidxqsz", "ternary", h && "object" == _typeof(h) && n.call(h, "__await")) ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = COVERAGE_TRACKER.trackBranch("AsyncIterator", "o7id1xci3", "ternary", r) ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (COVERAGE_TRACKER.trackBranch("makeInvokeMethod", "whmmgf2ew", "if", o === f)) throw Error("Generator is already running"); if (COVERAGE_TRACKER.trackBranch("makeInvokeMethod", "i9afqkca6", "if", o === s)) { if (COVERAGE_TRACKER.trackBranch("makeInvokeMethod", "dbl1v7b0c", "if", "throw" === i)) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (COVERAGE_TRACKER.trackBranch("makeInvokeMethod", "7gpsz2ilc", "if", c)) { var u = maybeInvokeDelegate(c, n); if (COVERAGE_TRACKER.trackBranch("makeInvokeMethod", "w2z061rfm", "if", u)) { if (COVERAGE_TRACKER.trackBranch("makeInvokeMethod", "q2mi3gzpz", "if", u === y)) continue; return u; } } if (COVERAGE_TRACKER.trackBranch("makeInvokeMethod", "6pozdpffq", "if", "next" === n.method)) n.sent = n._sent = n.arg;else if (COVERAGE_TRACKER.trackBranch("makeInvokeMethod", "gmmlt23cp", "if", "throw" === n.method)) { if (COVERAGE_TRACKER.trackBranch("makeInvokeMethod", "m3w6j8mic", "if", o === h)) throw o = s, n.arg; n.dispatchException(n.arg); } else COVERAGE_TRACKER.trackBranch("makeInvokeMethod", "y1e1t2a97", "logical-&&", "return" === n.method) && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if (COVERAGE_TRACKER.trackBranch("makeInvokeMethod", "c4ip481ad", "if", "normal" === p.type)) { if (COVERAGE_TRACKER.trackBranch("makeInvokeMethod", "9c3pvdog5", "if", (o = n.done ? s : l, p.arg === y))) continue; return { value: p.arg, done: n.done }; } COVERAGE_TRACKER.trackBranch("makeInvokeMethod", "nhs11e2yb", "logical-&&", "throw" === p.type) && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (COVERAGE_TRACKER.trackBranch("maybeInvokeDelegate", "l89sg4xsp", "if", o === t)) return r.delegate = null, COVERAGE_TRACKER.trackBranch("maybeInvokeDelegate", "e49pf2xd9", "logical-||", "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method)) || COVERAGE_TRACKER.trackBranch("maybeInvokeDelegate", "cxp79c3wg", "logical-&&", "return" !== n) && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if (COVERAGE_TRACKER.trackBranch("maybeInvokeDelegate", "75f030hac", "if", "throw" === i.type)) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return COVERAGE_TRACKER.trackBranch("maybeInvokeDelegate", "08l8frakx", "ternary", a) ? COVERAGE_TRACKER.trackBranch("maybeInvokeDelegate", "71yxmx70k", "ternary", a.done) ? (r[e.resultName] = a.value, r.next = e.nextLoc, COVERAGE_TRACKER.trackBranch("maybeInvokeDelegate", "x30o457vv", "logical-&&", "return" !== r.method) && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; COVERAGE_TRACKER.trackBranch("pushTryEntry", "xxtae2q8h", "logical-&&", 1 in t) && (e.catchLoc = t[1]), COVERAGE_TRACKER.trackBranch("pushTryEntry", "d07b8o2l7", "logical-&&", 2 in t) && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = COVERAGE_TRACKER.trackBranch("resetTryEntry", "x0ic4tpo1", "logical-||", t.completion) || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (COVERAGE_TRACKER.trackBranch("values", "8nhyfoax4", "if", e || "" === e)) { var r = e[a]; if (COVERAGE_TRACKER.trackBranch("values", "1d58t855e", "if", r)) return r.call(e); if (COVERAGE_TRACKER.trackBranch("values", "lszeyx31t", "if", "function" == typeof e.next)) return e; if (COVERAGE_TRACKER.trackBranch("values", "sogxnsrk6", "if", !isNaN(e.length))) { var o = -1, i = function next() { for (; ++o < e.length;) if (COVERAGE_TRACKER.trackBranch("i", "3v9b7tmmt", "if", n.call(e, o))) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = COVERAGE_TRACKER.trackBranch("_regeneratorRuntime", "xuvzicbge", "logical-&&", "function" == typeof t) && t.constructor; return COVERAGE_TRACKER.trackBranch("_regeneratorRuntime", "rkgv5mlco", "logical-&&", !!e) && (COVERAGE_TRACKER.trackBranch("_regeneratorRuntime", "c46d1rqwh", "logical-||", e === GeneratorFunction) || "GeneratorFunction" === (COVERAGE_TRACKER.trackBranch("_regeneratorRuntime", "uwf6wzl1z", "logical-||", e.displayName) || e.name)); }, e.mark = function (t) { return COVERAGE_TRACKER.trackBranch("_regeneratorRuntime", "tqlglf1fd", "ternary", Object.setPrototypeOf) ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { COVERAGE_TRACKER.trackBranch("_regeneratorRuntime", "e6nwxqb52", "logical-&&", void 0 === i) && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return COVERAGE_TRACKER.trackBranch("_regeneratorRuntime", "a33v5gxby", "ternary", e.isGeneratorFunction(r)) ? a : a.next().then(function (t) { return COVERAGE_TRACKER.trackBranch("_regeneratorRuntime", "ftl8unquc", "ternary", t.done) ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (COVERAGE_TRACKER.trackBranch("_regeneratorRuntime", "1jgtxd30m", "if", t in e)) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (COVERAGE_TRACKER.trackBranch("_regeneratorRuntime", "bqo7ps0hw", "if", (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e))) for (var r in this) COVERAGE_TRACKER.trackBranch("_regeneratorRuntime", "o7xfyz985", "logical-&&", "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1))) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if (COVERAGE_TRACKER.trackBranch("_regeneratorRuntime", "dqz0n0t4z", "if", "throw" === t.type)) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (COVERAGE_TRACKER.trackBranch("_regeneratorRuntime", "i1p2xvamn", "if", this.done)) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, COVERAGE_TRACKER.trackBranch("handle", "u8m13ikme", "logical-&&", o) && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if (COVERAGE_TRACKER.trackBranch("_regeneratorRuntime", "f7f5mkznc", "if", "root" === i.tryLoc)) return handle("end"); if (COVERAGE_TRACKER.trackBranch("_regeneratorRuntime", "0l9gmo772", "if", i.tryLoc <= this.prev)) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (COVERAGE_TRACKER.trackBranch("_regeneratorRuntime", "fym3qzgtm", "if", c && u)) { if (COVERAGE_TRACKER.trackBranch("_regeneratorRuntime", "6ttldnebg", "if", this.prev < i.catchLoc)) return handle(i.catchLoc, !0); if (COVERAGE_TRACKER.trackBranch("_regeneratorRuntime", "dbmubiwcd", "if", this.prev < i.finallyLoc)) return handle(i.finallyLoc); } else if (COVERAGE_TRACKER.trackBranch("_regeneratorRuntime", "nmtxn0maa", "if", c)) { if (COVERAGE_TRACKER.trackBranch("_regeneratorRuntime", "h7drh8kw3", "if", this.prev < i.catchLoc)) return handle(i.catchLoc, !0); } else { if (COVERAGE_TRACKER.trackBranch("_regeneratorRuntime", "rp1wu6u3u", "if", !u)) throw Error("try statement without catch or finally"); if (COVERAGE_TRACKER.trackBranch("_regeneratorRuntime", "jqt894p9l", "if", this.prev < i.finallyLoc)) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (COVERAGE_TRACKER.trackBranch("_regeneratorRuntime", "2q9n42338", "if", o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc)) { var i = o; break; } } COVERAGE_TRACKER.trackBranch("_regeneratorRuntime", "jeihnl2qy", "logical-&&", i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc) && (i = null); var a = COVERAGE_TRACKER.trackBranch("_regeneratorRuntime", "aepphr7wd", "ternary", i) ? i.completion : {}; return a.type = t, a.arg = e, COVERAGE_TRACKER.trackBranch("_regeneratorRuntime", "cyc4ze8i8", "ternary", i) ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if (COVERAGE_TRACKER.trackBranch("_regeneratorRuntime", "xhpet3pce", "if", "throw" === t.type)) throw t.arg; return COVERAGE_TRACKER.trackBranch("_regeneratorRuntime", "2xi65dybd", "ternary", "break" === t.type || "continue" === t.type) ? this.next = t.arg : COVERAGE_TRACKER.trackBranch("_regeneratorRuntime", "r71f4wpn7", "ternary", "return" === t.type) ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : COVERAGE_TRACKER.trackBranch("_regeneratorRuntime", "6bh7b04ql", "logical-&&", "normal" === t.type && e) && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (COVERAGE_TRACKER.trackBranch("_regeneratorRuntime", "mkuzn41fg", "if", r.finallyLoc === t)) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (COVERAGE_TRACKER.trackBranch("_regeneratorRuntime", "j7tcg6qxm", "if", r.tryLoc === t)) { var n = r.completion; if (COVERAGE_TRACKER.trackBranch("_regeneratorRuntime", "5xedj7drn", "if", "throw" === n.type)) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, COVERAGE_TRACKER.trackBranch("_regeneratorRuntime", "ik4wnrbqx", "logical-&&", "next" === this.method) && (this.arg = t), y; } }, e; }
function ownKeys(e, r) { var t = Object.keys(e); if (COVERAGE_TRACKER.trackBranch("ownKeys", "77cqie1sf", "if", Object.getOwnPropertySymbols)) { var o = Object.getOwnPropertySymbols(e); COVERAGE_TRACKER.trackBranch("ownKeys", "uxrq2w9sc", "logical-&&", r) && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = COVERAGE_TRACKER.trackBranch("_objectSpread", "8kmxibilb", "ternary", null != arguments[r]) ? arguments[r] : {}; COVERAGE_TRACKER.trackBranch("_objectSpread", "e7vtc85yk", "ternary", r % 2) ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : COVERAGE_TRACKER.trackBranch("_objectSpread", "7xs20adft", "ternary", Object.getOwnPropertyDescriptors) ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return COVERAGE_TRACKER.trackBranch("_defineProperty", "oj28iy9cq", "ternary", (r = _toPropertyKey(r)) in e) ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return COVERAGE_TRACKER.trackBranch("_toPropertyKey", "ls7z2ucxi", "ternary", "symbol" == _typeof(i)) ? i : i + ""; }
function _toPrimitive(t, r) { if (COVERAGE_TRACKER.trackBranch("_toPrimitive", "kde982obd", "if", "object" != _typeof(t) || !t)) return t; var e = t[Symbol.toPrimitive]; if (COVERAGE_TRACKER.trackBranch("_toPrimitive", "ceo4kczug", "if", void 0 !== e)) { var i = e.call(t, COVERAGE_TRACKER.trackBranch("_toPrimitive", "selajv7ll", "logical-||", r) || "default"); if (COVERAGE_TRACKER.trackBranch("_toPrimitive", "s0jiokrm9", "if", "object" != _typeof(i))) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return (COVERAGE_TRACKER.trackBranch("_toPrimitive", "kev7atfse", "ternary", "string" === r) ? String : Number)(t); }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = COVERAGE_TRACKER.trackBranch("_typeof", "vl62d94di", "ternary", "function" == typeof Symbol && "symbol" == typeof Symbol.iterator) ? function (o) { return typeof o; } : function (o) { return COVERAGE_TRACKER.trackBranch("_typeof", "k0v33b6qs", "ternary", o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype) ? "symbol" : typeof o; }, _typeof(o); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } COVERAGE_TRACKER.trackBranch("asyncGeneratorStep", "ijz6mlpo8", "ternary", i.done) ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
/**
 * Pure Flow Test File
 * 
 * This file tests various Flow features with our instrumentation plugin.
 */
// ====== TYPE DECLARATIONS (should be skipped by instrumentation) ======
// Flow interfaces 
// Flow type aliases
// Flow exact object type
// Generic type
// Type with indexed access and mapped types
// Maybe type (equivalent to TypeScript's nullable)
// ====== FUNCTIONS WITH TYPE ANNOTATIONS ======
// Function with Flow parameter types and return type
function getUserStatus(user) {
  if (COVERAGE_TRACKER.trackBranch("getUserStatus", "49:2", "if", user.isActive)) {
    return 'Active';
  } else {
    return 'Inactive';
  }
}

// Function with complex return type
function fetchUserData(id) {
  return new Promise(function (resolve) {
    // Simulate API call
    setTimeout(function () {
      if (COVERAGE_TRACKER.trackBranch("fetchUserData", "61:6", "if", id > 0)) {
        resolve({
          data: {
            id: id,
            name: "User ".concat(id),
            isActive: Math.random() > 0.5
          },
          status: 'success'
        });
      } else {
        resolve({
          error: 'Invalid user ID',
          status: 'error'
        });
      }
    }, 100);
  });
}

// Function with type parameters (generics)
function filterItems(items, predicate) {
  return items.filter(predicate);
}

// Async function with Flow annotations
function processUsers(_x) {
  return _processUsers.apply(this, arguments);
} // Arrow function with type cast
function _processUsers() {
  _processUsers = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee(users) {
    var processedUsers, activeUsers;
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          // Process each user with some conditional logic
          processedUsers = users.map(function (user) {
            // Ternary with type annotations
            var metadata = COVERAGE_TRACKER.trackBranch("_processUsers", "87:23", "ternary", user.metadata) ? _objectSpread(_objectSpread({}, user.metadata), {}, {
              processed: true
            }) : {
              processed: true
            };
            return _objectSpread(_objectSpread({}, user), {}, {
              metadata: metadata
            });
          }); // Use filter with type parameter
          activeUsers = filterItems(processedUsers, function (user) {
            return user.isActive === true;
          });
          return _context.abrupt("return", {
            data: activeUsers,
            status: 'success'
          });
        case 6:
          _context.prev = 6;
          _context.t0 = _context["catch"](0);
          return _context.abrupt("return", {
            error: COVERAGE_TRACKER.trackBranch("_processUsers", "107:13", "ternary", _context.t0 instanceof Error) ? _context.t0.message : 'Unknown error',
            status: 'error'
          });
        case 9:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[0, 6]]);
  }));
  return _processUsers.apply(this, arguments);
}
var getActiveUsers = function getActiveUsers(users) {
  return users.filter(function (user) {
    return COVERAGE_TRACKER.trackBranch("getActiveUsers", "115:30", "ternary", user.isActive) ? true : false;
  });
};

// Function with conditional type expressions
function processUser(user) {
  // Type cast in conditional
  return COVERAGE_TRACKER.trackBranch("processUser", "121:9", "ternary", user.isActive) ? user.name : null;
}

// Function with complex type manipulation
function transformUserData(user, transformer) {
  var result = {};
  Object.keys(user).forEach(function (key) {
    result[key] = transformer(key, user[key]);
  });
  return result;
}

// Type predicates (similar to TypeScript's type guards)
function isActiveUser(user) {
  return COVERAGE_TRACKER.trackBranch("isActiveUser", "140:9", "logical-&&", !!user && _typeof(user) === 'object' && 'isActive' in user) && user.isActive === true;
}

// Optional chaining simulation with Maybe types
function getUserDisplayName(user) {
  return COVERAGE_TRACKER.trackBranch("getUserDisplayName", "145:9", "ternary", user && user.name) ? user.name : 'Anonymous';
}

// Higher-order function with Flow types
function createLogger(prefix) {
  return function (data) {
    console.log("".concat(prefix, ":"), data);
  };
}

// ====== EXECUTION CODE ======

// Run the test
try {
  console.log('Testing Flow instrumentation...');

  // Test regular functions
  var user = {
    id: 1,
    name: 'Test User',
    isActive: true
  };
  console.log('Getting user status:', getUserStatus(user));

  // Test generic function
  var numbers = [1, 2, 3, 4, 5];
  var evenNumbers = filterItems(numbers, function (n) {
    return n % 2 === 0;
  });
  console.log('Filtered even numbers:', evenNumbers);

  // Test arrow function with type cast
  var testUsers = [{
    id: 1,
    name: 'User 1',
    isActive: true
  }, {
    id: 2,
    name: 'User 2',
    isActive: false
  }];
  var active = getActiveUsers(testUsers);
  console.log('Active users:', active.length);

  // Test conditional type expressions
  var processedName = processUser(user);
  console.log('Processed user name:', processedName);

  // Test type predicate
  if (COVERAGE_TRACKER.trackBranch("flow-test", "183:2", "if", isActiveUser(user))) {
    console.log('User is active:', user.name);
  }

  // Test optional chaining simulation
  var undefinedUser = undefined;
  console.log('Display name with undefined user:', getUserDisplayName(undefinedUser));
  console.log('Display name with defined user:', getUserDisplayName(user));

  // Test higher-order function
  var logUser = createLogger('USER');
  logUser(user);

  // Test async function
  console.log('Processing users (async)...');
  processUsers(testUsers).then(function (result) {
    console.log('Processed users result:', result.status);
    if (COVERAGE_TRACKER.trackBranch("flow-test", "201:6", "if", result.data)) {
      console.log('Active users after processing:', result.data.length);
    }
  })["catch"](function (err) {
    return console.error('Error processing users:', err);
  });
  console.log('Flow instrumentation test completed successfully!');
} catch (error) {
  console.error('Error in Flow test:', error);
}