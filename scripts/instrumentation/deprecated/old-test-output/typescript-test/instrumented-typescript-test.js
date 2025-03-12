"use strict";

function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = COVERAGE_TRACKER.trackBranch("_regeneratorRuntime", "wmn1gxk22", "logical-||", Object.defineProperty) || function (t, e, r) { t[e] = r.value; }, i = COVERAGE_TRACKER.trackBranch("_regeneratorRuntime", "er9trrxr7", "ternary", "function" == typeof Symbol) ? Symbol : {}, a = COVERAGE_TRACKER.trackBranch("_regeneratorRuntime", "u2fqhua06", "logical-||", i.iterator) || "@@iterator", c = COVERAGE_TRACKER.trackBranch("_regeneratorRuntime", "0kvmnvz4x", "logical-||", i.asyncIterator) || "@@asyncIterator", u = COVERAGE_TRACKER.trackBranch("_regeneratorRuntime", "ig917w76z", "logical-||", i.toStringTag) || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = COVERAGE_TRACKER.trackBranch("wrap", "qchpl83df", "ternary", COVERAGE_TRACKER.trackBranch("wrap", "yovbqud3t", "logical-&&", e) && e.prototype instanceof Generator) ? e : Generator, a = Object.create(i.prototype), c = new Context(COVERAGE_TRACKER.trackBranch("wrap", "zmunpvak8", "logical-||", n) || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = COVERAGE_TRACKER.trackBranch("_regeneratorRuntime", "crp4gothd", "logical-&&", d) && d(d(values([]))); COVERAGE_TRACKER.trackBranch("_regeneratorRuntime", "erw9ssh76", "logical-&&", COVERAGE_TRACKER.trackBranch("_regeneratorRuntime", "h1mx110ul", "logical-&&", COVERAGE_TRACKER.trackBranch("_regeneratorRuntime", "g0kj9keck", "logical-&&", v) && v !== r) && n.call(v, a)) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if (COVERAGE_TRACKER.trackBranch("invoke", "im5p5gelr", "if", "throw" !== c.type)) { var u = c.arg, h = u.value; return COVERAGE_TRACKER.trackBranch("invoke", "cecib0pxy", "ternary", COVERAGE_TRACKER.trackBranch("invoke", "7j6szjopx", "logical-&&", COVERAGE_TRACKER.trackBranch("invoke", "enl5viezj", "logical-&&", h) && "object" == _typeof(h)) && n.call(h, "__await")) ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = COVERAGE_TRACKER.trackBranch("AsyncIterator", "h0528o6mo", "ternary", r) ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (COVERAGE_TRACKER.trackBranch("makeInvokeMethod", "b1d4ksa2e", "if", o === f)) throw Error("Generator is already running"); if (COVERAGE_TRACKER.trackBranch("makeInvokeMethod", "d0d0bzs8m", "if", o === s)) { if (COVERAGE_TRACKER.trackBranch("makeInvokeMethod", "bgqld4jn7", "if", "throw" === i)) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (COVERAGE_TRACKER.trackBranch("makeInvokeMethod", "s2romm01y", "if", c)) { var u = maybeInvokeDelegate(c, n); if (COVERAGE_TRACKER.trackBranch("makeInvokeMethod", "t0s699kxy", "if", u)) { if (COVERAGE_TRACKER.trackBranch("makeInvokeMethod", "rnssjs062", "if", u === y)) continue; return u; } } if (COVERAGE_TRACKER.trackBranch("makeInvokeMethod", "1lfequ1wx", "if", "next" === n.method)) n.sent = n._sent = n.arg;else if (COVERAGE_TRACKER.trackBranch("makeInvokeMethod", "famqsuw3h", "if", "throw" === n.method)) { if (COVERAGE_TRACKER.trackBranch("makeInvokeMethod", "8yprlaq6f", "if", o === h)) throw o = s, n.arg; n.dispatchException(n.arg); } else COVERAGE_TRACKER.trackBranch("makeInvokeMethod", "l3vbh748v", "logical-&&", "return" === n.method) && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if (COVERAGE_TRACKER.trackBranch("makeInvokeMethod", "9plztk8w6", "if", "normal" === p.type)) { if (COVERAGE_TRACKER.trackBranch("makeInvokeMethod", "lqwiulacn", "if", (o = COVERAGE_TRACKER.trackBranch("makeInvokeMethod", "kyx1jk0ym", "ternary", n.done) ? s : l, p.arg === y))) continue; return { value: p.arg, done: n.done }; } COVERAGE_TRACKER.trackBranch("makeInvokeMethod", "db1ohzcqn", "logical-&&", "throw" === p.type) && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (COVERAGE_TRACKER.trackBranch("maybeInvokeDelegate", "qr0o7ku0c", "if", o === t)) return r.delegate = null, COVERAGE_TRACKER.trackBranch("maybeInvokeDelegate", "g9bep2x0x", "logical-||", COVERAGE_TRACKER.trackBranch("maybeInvokeDelegate", "5rlv1l5f1", "logical-&&", COVERAGE_TRACKER.trackBranch("maybeInvokeDelegate", "xyql8u2rz", "logical-&&", "throw" === n) && e.iterator["return"]) && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method)) || COVERAGE_TRACKER.trackBranch("maybeInvokeDelegate", "gmz32ow47", "logical-&&", "return" !== n) && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if (COVERAGE_TRACKER.trackBranch("maybeInvokeDelegate", "d6pj9lbg4", "if", "throw" === i.type)) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return COVERAGE_TRACKER.trackBranch("maybeInvokeDelegate", "2bg913189", "ternary", a) ? COVERAGE_TRACKER.trackBranch("maybeInvokeDelegate", "74m7sxqn0", "ternary", a.done) ? (r[e.resultName] = a.value, r.next = e.nextLoc, COVERAGE_TRACKER.trackBranch("maybeInvokeDelegate", "yihn5gczj", "logical-&&", "return" !== r.method) && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; COVERAGE_TRACKER.trackBranch("pushTryEntry", "r310la5l3", "logical-&&", 1 in t) && (e.catchLoc = t[1]), COVERAGE_TRACKER.trackBranch("pushTryEntry", "sbk2wijq8", "logical-&&", 2 in t) && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = COVERAGE_TRACKER.trackBranch("resetTryEntry", "ecr8uku45", "logical-||", t.completion) || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (COVERAGE_TRACKER.trackBranch("values", "65odu2uho", "if", COVERAGE_TRACKER.trackBranch("values", "18y6kna1x", "logical-||", e) || "" === e)) { var r = e[a]; if (COVERAGE_TRACKER.trackBranch("values", "0qnylvsxd", "if", r)) return r.call(e); if (COVERAGE_TRACKER.trackBranch("values", "mpx2wr5a7", "if", "function" == typeof e.next)) return e; if (COVERAGE_TRACKER.trackBranch("values", "t2guj9i2t", "if", !isNaN(e.length))) { var o = -1, i = function next() { for (; ++o < e.length;) if (COVERAGE_TRACKER.trackBranch("i", "ov662lrvg", "if", n.call(e, o))) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = COVERAGE_TRACKER.trackBranch("_regeneratorRuntime", "4wzgz5x8j", "logical-&&", "function" == typeof t) && t.constructor; return COVERAGE_TRACKER.trackBranch("_regeneratorRuntime", "vjr9uwqmv", "logical-&&", !!e) && (COVERAGE_TRACKER.trackBranch("_regeneratorRuntime", "4wx3l05bq", "logical-||", e === GeneratorFunction) || "GeneratorFunction" === (COVERAGE_TRACKER.trackBranch("_regeneratorRuntime", "ubvonclm1", "logical-||", e.displayName) || e.name)); }, e.mark = function (t) { return COVERAGE_TRACKER.trackBranch("_regeneratorRuntime", "bz44wc3y8", "ternary", Object.setPrototypeOf) ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { COVERAGE_TRACKER.trackBranch("_regeneratorRuntime", "04n2vw6lv", "logical-&&", void 0 === i) && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return COVERAGE_TRACKER.trackBranch("_regeneratorRuntime", "72bs8lf0d", "ternary", e.isGeneratorFunction(r)) ? a : a.next().then(function (t) { return COVERAGE_TRACKER.trackBranch("_regeneratorRuntime", "kjiuiak9l", "ternary", t.done) ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (COVERAGE_TRACKER.trackBranch("_regeneratorRuntime", "415iis9ck", "if", t in e)) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (COVERAGE_TRACKER.trackBranch("_regeneratorRuntime", "oh7lx0nuw", "if", (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e))) for (var r in this) COVERAGE_TRACKER.trackBranch("_regeneratorRuntime", "xexhfj4pt", "logical-&&", COVERAGE_TRACKER.trackBranch("_regeneratorRuntime", "112sg8k85", "logical-&&", COVERAGE_TRACKER.trackBranch("_regeneratorRuntime", "4j1ch3kqm", "logical-&&", "t" === r.charAt(0)) && n.call(this, r)) && !isNaN(+r.slice(1))) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if (COVERAGE_TRACKER.trackBranch("_regeneratorRuntime", "extlt6n6y", "if", "throw" === t.type)) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (COVERAGE_TRACKER.trackBranch("_regeneratorRuntime", "rk8habjd7", "if", this.done)) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, COVERAGE_TRACKER.trackBranch("handle", "pq8wnuf2z", "logical-&&", o) && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if (COVERAGE_TRACKER.trackBranch("_regeneratorRuntime", "gta6rj7t2", "if", "root" === i.tryLoc)) return handle("end"); if (COVERAGE_TRACKER.trackBranch("_regeneratorRuntime", "ln0xe5ppw", "if", i.tryLoc <= this.prev)) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (COVERAGE_TRACKER.trackBranch("_regeneratorRuntime", "jo39ikc4e", "if", COVERAGE_TRACKER.trackBranch("_regeneratorRuntime", "u3p3mh39c", "logical-&&", c) && u)) { if (COVERAGE_TRACKER.trackBranch("_regeneratorRuntime", "rg0yr19xx", "if", this.prev < i.catchLoc)) return handle(i.catchLoc, !0); if (COVERAGE_TRACKER.trackBranch("_regeneratorRuntime", "7akimwodc", "if", this.prev < i.finallyLoc)) return handle(i.finallyLoc); } else if (COVERAGE_TRACKER.trackBranch("_regeneratorRuntime", "kdsibb247", "if", c)) { if (COVERAGE_TRACKER.trackBranch("_regeneratorRuntime", "ii2f4zvxd", "if", this.prev < i.catchLoc)) return handle(i.catchLoc, !0); } else { if (COVERAGE_TRACKER.trackBranch("_regeneratorRuntime", "3y6eu5vlu", "if", !u)) throw Error("try statement without catch or finally"); if (COVERAGE_TRACKER.trackBranch("_regeneratorRuntime", "k0e1107ya", "if", this.prev < i.finallyLoc)) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (COVERAGE_TRACKER.trackBranch("_regeneratorRuntime", "gd96wstbx", "if", COVERAGE_TRACKER.trackBranch("_regeneratorRuntime", "307j5qtfi", "logical-&&", COVERAGE_TRACKER.trackBranch("_regeneratorRuntime", "1bohz6u1g", "logical-&&", o.tryLoc <= this.prev) && n.call(o, "finallyLoc")) && this.prev < o.finallyLoc)) { var i = o; break; } } COVERAGE_TRACKER.trackBranch("_regeneratorRuntime", "9udqha4mx", "logical-&&", COVERAGE_TRACKER.trackBranch("_regeneratorRuntime", "12bf2dyk1", "logical-&&", COVERAGE_TRACKER.trackBranch("_regeneratorRuntime", "7qaxp4dqb", "logical-&&", COVERAGE_TRACKER.trackBranch("_regeneratorRuntime", "xezdemioj", "logical-&&", i) && (COVERAGE_TRACKER.trackBranch("_regeneratorRuntime", "siqrmtiyn", "logical-||", "break" === t) || "continue" === t)) && i.tryLoc <= e) && e <= i.finallyLoc) && (i = null); var a = COVERAGE_TRACKER.trackBranch("_regeneratorRuntime", "n49lg7a0k", "ternary", i) ? i.completion : {}; return a.type = t, a.arg = e, COVERAGE_TRACKER.trackBranch("_regeneratorRuntime", "yad7tywnh", "ternary", i) ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if (COVERAGE_TRACKER.trackBranch("_regeneratorRuntime", "d9w7ykono", "if", "throw" === t.type)) throw t.arg; return COVERAGE_TRACKER.trackBranch("_regeneratorRuntime", "vlsz804tn", "ternary", COVERAGE_TRACKER.trackBranch("_regeneratorRuntime", "tqa25651o", "logical-||", "break" === t.type) || "continue" === t.type) ? this.next = t.arg : COVERAGE_TRACKER.trackBranch("_regeneratorRuntime", "dz8xh3oae", "ternary", "return" === t.type) ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : COVERAGE_TRACKER.trackBranch("_regeneratorRuntime", "yiikviexj", "logical-&&", COVERAGE_TRACKER.trackBranch("_regeneratorRuntime", "ozg56hp2d", "logical-&&", "normal" === t.type) && e) && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (COVERAGE_TRACKER.trackBranch("_regeneratorRuntime", "5eu6oes8p", "if", r.finallyLoc === t)) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (COVERAGE_TRACKER.trackBranch("_regeneratorRuntime", "jvlrn1yb7", "if", r.tryLoc === t)) { var n = r.completion; if (COVERAGE_TRACKER.trackBranch("_regeneratorRuntime", "i1cf777m7", "if", "throw" === n.type)) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, COVERAGE_TRACKER.trackBranch("_regeneratorRuntime", "lei3dr6hw", "logical-&&", "next" === this.method) && (this.arg = t), y; } }, e; }
function ownKeys(e, r) { var t = Object.keys(e); if (COVERAGE_TRACKER.trackBranch("ownKeys", "er1gebkv4", "if", Object.getOwnPropertySymbols)) { var o = Object.getOwnPropertySymbols(e); COVERAGE_TRACKER.trackBranch("ownKeys", "ulmoxfo9f", "logical-&&", r) && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = COVERAGE_TRACKER.trackBranch("_objectSpread", "5oexgpjz2", "ternary", null != arguments[r]) ? arguments[r] : {}; COVERAGE_TRACKER.trackBranch("_objectSpread", "f4m1uo2cg", "ternary", r % 2) ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : COVERAGE_TRACKER.trackBranch("_objectSpread", "rsxoefcfg", "ternary", Object.getOwnPropertyDescriptors) ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return COVERAGE_TRACKER.trackBranch("_defineProperty", "6nh27y1fs", "ternary", (r = _toPropertyKey(r)) in e) ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return COVERAGE_TRACKER.trackBranch("_toPropertyKey", "5q837gn0v", "ternary", "symbol" == _typeof(i)) ? i : i + ""; }
function _toPrimitive(t, r) { if (COVERAGE_TRACKER.trackBranch("_toPrimitive", "7kpsjdc9j", "if", COVERAGE_TRACKER.trackBranch("_toPrimitive", "rg2np9opt", "logical-||", "object" != _typeof(t)) || !t)) return t; var e = t[Symbol.toPrimitive]; if (COVERAGE_TRACKER.trackBranch("_toPrimitive", "l3l6zknym", "if", void 0 !== e)) { var i = e.call(t, COVERAGE_TRACKER.trackBranch("_toPrimitive", "52cwnajfm", "logical-||", r) || "default"); if (COVERAGE_TRACKER.trackBranch("_toPrimitive", "arzzck3op", "if", "object" != _typeof(i))) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return (COVERAGE_TRACKER.trackBranch("_toPrimitive", "e7ycqy9jh", "ternary", "string" === r) ? String : Number)(t); }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = COVERAGE_TRACKER.trackBranch("_typeof", "529arrh6l", "ternary", COVERAGE_TRACKER.trackBranch("_typeof", "hv5hgm5df", "logical-&&", "function" == typeof Symbol) && "symbol" == typeof Symbol.iterator) ? function (o) { return typeof o; } : function (o) { return COVERAGE_TRACKER.trackBranch("_typeof", "7r61jvjag", "ternary", COVERAGE_TRACKER.trackBranch("_typeof", "ap4fy63cx", "logical-&&", COVERAGE_TRACKER.trackBranch("_typeof", "zv01sohhv", "logical-&&", COVERAGE_TRACKER.trackBranch("_typeof", "aoaf4d7ll", "logical-&&", o) && "function" == typeof Symbol) && o.constructor === Symbol) && o !== Symbol.prototype) ? "symbol" : typeof o; }, _typeof(o); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } COVERAGE_TRACKER.trackBranch("asyncGeneratorStep", "qita6b02o", "ternary", i.done) ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
/**
 * Pure TypeScript Test File (No React)
 * 
 * This file tests various TypeScript features with our instrumentation plugin.
 */
// ====== TYPE DECLARATIONS (should be skipped by instrumentation) ======
// TypeScript interfaces 
// TypeScript type aliases
// TypeScript enums
var Status = /*#__PURE__*/function (Status) {
  Status["Active"] = "ACTIVE";
  Status["Inactive"] = "INACTIVE";
  Status["Pending"] = "PENDING";
  return Status;
}(COVERAGE_TRACKER.trackBranch("typescript-test", "66rv7hccb", "logical-||", Status) || {}); // Generic type
// Type with indexed access and mapped types
// Utility type with conditional types
// ====== FUNCTIONS WITH TYPE ANNOTATIONS ======

// Function with TypeScript parameter types and return type
function getUserStatus(user) {
  if (COVERAGE_TRACKER.trackBranch("getUserStatus", "48:2", "if", user.isActive)) {
    return Status.Active;
  } else {
    return Status.Inactive;
  }
}

// Function with complex return type
function fetchUserData(id) {
  return new Promise(function (resolve) {
    // Simulate API call
    setTimeout(function () {
      if (COVERAGE_TRACKER.trackBranch("fetchUserData", "60:6", "if", id > 0)) {
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

// Async function with TypeScript annotations
function processUsers(_x) {
  return _processUsers.apply(this, arguments);
} // Arrow function with type assertion
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
            var metadata = COVERAGE_TRACKER.trackBranch("_processUsers", "86:23", "ternary", user.metadata) ? _objectSpread(_objectSpread({}, user.metadata), {}, {
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
            error: COVERAGE_TRACKER.trackBranch("_processUsers", "106:13", "ternary", COVERAGE_TRACKER.trackBranch("_processUsers", "106:13", "ternary", _context.t0 instanceof Error)) ? _context.t0.message : 'Unknown error',
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
    return COVERAGE_TRACKER.trackBranch("getActiveUsers", "114:30", "ternary", user.isActive) ? true : false;
  });
};

// Function with conditional type expressions
function processUser(user) {
  // Type assertion in conditional
  return COVERAGE_TRACKER.trackBranch("processUser", "120:9", "ternary", user.isActive) ? user.name : null;
}

// Function with complex type manipulation
function transformUserData(user, transformer) {
  var result = {};
  Object.keys(user).forEach(function (key) {
    result[key] = transformer(key, user[key]);
  });
  return result;
}

// Type guards
function isActiveUser(user) {
  return COVERAGE_TRACKER.trackBranch("isActiveUser", "139:9", "logical-&&", COVERAGE_TRACKER.trackBranch("isActiveUser", "139:9", "logical-&&", COVERAGE_TRACKER.trackBranch("isActiveUser", "139:9", "logical-&&", user) && _typeof(user) === 'object') && 'isActive' in user) && user.isActive === true;
}

// Optional chaining with nullish coalescing
function getUserDisplayName(user) {
  var _user$name;
  return COVERAGE_TRACKER.trackBranch("getUserDisplayName", "i2x1sc3hh", "ternary", COVERAGE_TRACKER.trackBranch("getUserDisplayName", "kdlecgvae", "logical-&&", (_user$name = COVERAGE_TRACKER.trackBranch("getUserDisplayName", "6cw0me38i", "ternary", COVERAGE_TRACKER.trackBranch("getUserDisplayName", "hgpgy8or7", "logical-||", user === null) || user === void 0) ? void 0 : user.name) !== null) && _user$name !== void 0) ? _user$name : 'Anonymous';
}

// Template literal types

function getPosition(alignment, vAlignment) {
  return "".concat(alignment, "-").concat(vAlignment);
}

// Branded types for additional type safety

function createUserId(id) {
  return id;
}
function getUserById(id) {
  // Implementation
  return {
    id: id,
    name: "User ".concat(id),
    isActive: true
  };
}

// ====== EXECUTION CODE ======

// Run the test
try {
  console.log('Testing TypeScript instrumentation...');

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

  // Test arrow function with type assertion
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

  // Test type guards
  if (COVERAGE_TRACKER.trackBranch("typescript-test", "200:2", "if", isActiveUser(user))) {
    console.log('User is active:', user.name);
  }

  // Test optional chaining with nullish coalescing
  var undefinedUser = undefined;
  console.log('Display name with undefined user:', getUserDisplayName(undefinedUser));
  console.log('Display name with defined user:', getUserDisplayName(user));

  // Test template literal types
  var position = getPosition('left', 'top');
  console.log('Position:', position);

  // Test branded types
  var userId = createUserId(123);
  var foundUser = getUserById(userId);
  console.log('Found user:', COVERAGE_TRACKER.trackBranch("typescript-test", "u0pfswt3i", "ternary", COVERAGE_TRACKER.trackBranch("typescript-test", "gp5zpta64", "logical-||", foundUser === null) || foundUser === void 0) ? void 0 : foundUser.name);

  // Test async function
  console.log('Processing users (async)...');
  processUsers(testUsers).then(function (result) {
    console.log('Processed users result:', result.status);
    if (COVERAGE_TRACKER.trackBranch("typescript-test", "223:6", "if", result.data)) {
      console.log('Active users after processing:', result.data.length);
    }
  })["catch"](function (err) {
    return console.error('Error processing users:', err);
  });
  console.log('TypeScript instrumentation test completed successfully!');
} catch (error) {
  console.error('Error in TypeScript test:', error);
}