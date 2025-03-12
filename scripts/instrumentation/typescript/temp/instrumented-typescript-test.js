"use strict";

function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = COVERAGE_TRACKER.trackBranch("_regeneratorRuntime", "u4nxszfmd", "logical-||", Object.defineProperty) || function (t, e, r) { t[e] = r.value; }, i = COVERAGE_TRACKER.trackBranch("_regeneratorRuntime", "lgghprshu", "ternary", "function" == typeof Symbol) ? Symbol : {}, a = COVERAGE_TRACKER.trackBranch("_regeneratorRuntime", "iauct5oza", "logical-||", i.iterator) || "@@iterator", c = COVERAGE_TRACKER.trackBranch("_regeneratorRuntime", "gi555v6mc", "logical-||", i.asyncIterator) || "@@asyncIterator", u = COVERAGE_TRACKER.trackBranch("_regeneratorRuntime", "e11zdawvo", "logical-||", i.toStringTag) || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = COVERAGE_TRACKER.trackBranch("wrap", "zde3xxosw", "ternary", COVERAGE_TRACKER.trackBranch("wrap", "2d74gnmk1", "logical-&&", e) && e.prototype instanceof Generator) ? e : Generator, a = Object.create(i.prototype), c = new Context(COVERAGE_TRACKER.trackBranch("wrap", "e9lx2fqme", "logical-||", n) || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = COVERAGE_TRACKER.trackBranch("_regeneratorRuntime", "hsb46pue5", "logical-&&", d) && d(d(values([]))); COVERAGE_TRACKER.trackBranch("_regeneratorRuntime", "g72ju1r0w", "logical-&&", COVERAGE_TRACKER.trackBranch("_regeneratorRuntime", "8sausbu8m", "logical-&&", COVERAGE_TRACKER.trackBranch("_regeneratorRuntime", "puo2doux5", "logical-&&", v) && v !== r) && n.call(v, a)) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if (COVERAGE_TRACKER.trackBranch("invoke", "dkdhz48cr", "if", "throw" !== c.type)) { var u = c.arg, h = u.value; return COVERAGE_TRACKER.trackBranch("invoke", "29ul1ah6k", "ternary", COVERAGE_TRACKER.trackBranch("invoke", "75jpilaz1", "logical-&&", COVERAGE_TRACKER.trackBranch("invoke", "9hbez8h0d", "logical-&&", h) && "object" == _typeof(h)) && n.call(h, "__await")) ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = COVERAGE_TRACKER.trackBranch("AsyncIterator", "fmpg44vn", "ternary", r) ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (COVERAGE_TRACKER.trackBranch("makeInvokeMethod", "sahkw96s8", "if", o === f)) throw Error("Generator is already running"); if (COVERAGE_TRACKER.trackBranch("makeInvokeMethod", "jd5xq7tz9", "if", o === s)) { if (COVERAGE_TRACKER.trackBranch("makeInvokeMethod", "ea06kbxbd", "if", "throw" === i)) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (COVERAGE_TRACKER.trackBranch("makeInvokeMethod", "ca7exj4jy", "if", c)) { var u = maybeInvokeDelegate(c, n); if (COVERAGE_TRACKER.trackBranch("makeInvokeMethod", "t0pqoq9ph", "if", u)) { if (COVERAGE_TRACKER.trackBranch("makeInvokeMethod", "vtd0wjs2q", "if", u === y)) continue; return u; } } if (COVERAGE_TRACKER.trackBranch("makeInvokeMethod", "hnbfxbg8i", "if", "next" === n.method)) n.sent = n._sent = n.arg;else if (COVERAGE_TRACKER.trackBranch("makeInvokeMethod", "p9gat37lw", "if", "throw" === n.method)) { if (COVERAGE_TRACKER.trackBranch("makeInvokeMethod", "mwjzrdoia", "if", o === h)) throw o = s, n.arg; n.dispatchException(n.arg); } else COVERAGE_TRACKER.trackBranch("makeInvokeMethod", "i2dkzl0te", "logical-&&", "return" === n.method) && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if (COVERAGE_TRACKER.trackBranch("makeInvokeMethod", "zsrq04su6", "if", "normal" === p.type)) { if (COVERAGE_TRACKER.trackBranch("makeInvokeMethod", "tgct37s5z", "if", (o = COVERAGE_TRACKER.trackBranch("makeInvokeMethod", "f78cyhjly", "ternary", n.done) ? s : l, p.arg === y))) continue; return { value: p.arg, done: n.done }; } COVERAGE_TRACKER.trackBranch("makeInvokeMethod", "hycnxy2tr", "logical-&&", "throw" === p.type) && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (COVERAGE_TRACKER.trackBranch("maybeInvokeDelegate", "juznnq1af", "if", o === t)) return r.delegate = null, COVERAGE_TRACKER.trackBranch("maybeInvokeDelegate", "stzkh9ykg", "logical-||", COVERAGE_TRACKER.trackBranch("maybeInvokeDelegate", "fv7ddu8jk", "logical-&&", COVERAGE_TRACKER.trackBranch("maybeInvokeDelegate", "nrn1buzna", "logical-&&", "throw" === n) && e.iterator["return"]) && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method)) || COVERAGE_TRACKER.trackBranch("maybeInvokeDelegate", "uyj3y204a", "logical-&&", "return" !== n) && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if (COVERAGE_TRACKER.trackBranch("maybeInvokeDelegate", "3cq9r1uyc", "if", "throw" === i.type)) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return COVERAGE_TRACKER.trackBranch("maybeInvokeDelegate", "dp6yuje11", "ternary", a) ? COVERAGE_TRACKER.trackBranch("maybeInvokeDelegate", "0n1lknu1j", "ternary", a.done) ? (r[e.resultName] = a.value, r.next = e.nextLoc, COVERAGE_TRACKER.trackBranch("maybeInvokeDelegate", "e7o049onm", "logical-&&", "return" !== r.method) && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; COVERAGE_TRACKER.trackBranch("pushTryEntry", "65bklz65j", "logical-&&", 1 in t) && (e.catchLoc = t[1]), COVERAGE_TRACKER.trackBranch("pushTryEntry", "u363nsxkn", "logical-&&", 2 in t) && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = COVERAGE_TRACKER.trackBranch("resetTryEntry", "nxeewbnw6", "logical-||", t.completion) || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (COVERAGE_TRACKER.trackBranch("values", "30w2tjgpc", "if", COVERAGE_TRACKER.trackBranch("values", "e3agib1o6", "logical-||", e) || "" === e)) { var r = e[a]; if (COVERAGE_TRACKER.trackBranch("values", "fnqygzha0", "if", r)) return r.call(e); if (COVERAGE_TRACKER.trackBranch("values", "27xh8mfy1", "if", "function" == typeof e.next)) return e; if (COVERAGE_TRACKER.trackBranch("values", "58d7lg45g", "if", !isNaN(e.length))) { var o = -1, i = function next() { for (; ++o < e.length;) if (COVERAGE_TRACKER.trackBranch("i", "476su8wte", "if", n.call(e, o))) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = COVERAGE_TRACKER.trackBranch("_regeneratorRuntime", "xd7fsz0dm", "logical-&&", "function" == typeof t) && t.constructor; return COVERAGE_TRACKER.trackBranch("_regeneratorRuntime", "zo6scfbqv", "logical-&&", !!e) && (COVERAGE_TRACKER.trackBranch("_regeneratorRuntime", "4olpov9pa", "logical-||", e === GeneratorFunction) || "GeneratorFunction" === (COVERAGE_TRACKER.trackBranch("_regeneratorRuntime", "4ewtmzliu", "logical-||", e.displayName) || e.name)); }, e.mark = function (t) { return COVERAGE_TRACKER.trackBranch("_regeneratorRuntime", "ifnf0vv19", "ternary", Object.setPrototypeOf) ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { COVERAGE_TRACKER.trackBranch("_regeneratorRuntime", "iqpzoh865", "logical-&&", void 0 === i) && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return COVERAGE_TRACKER.trackBranch("_regeneratorRuntime", "rb7f4tbyw", "ternary", e.isGeneratorFunction(r)) ? a : a.next().then(function (t) { return COVERAGE_TRACKER.trackBranch("_regeneratorRuntime", "6u0bahx1m", "ternary", t.done) ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (COVERAGE_TRACKER.trackBranch("_regeneratorRuntime", "mjj7wnayd", "if", t in e)) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (COVERAGE_TRACKER.trackBranch("_regeneratorRuntime", "n0p465oqw", "if", (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e))) for (var r in this) COVERAGE_TRACKER.trackBranch("_regeneratorRuntime", "ae39vkxew", "logical-&&", COVERAGE_TRACKER.trackBranch("_regeneratorRuntime", "bfxoa7tag", "logical-&&", COVERAGE_TRACKER.trackBranch("_regeneratorRuntime", "fky3g0jez", "logical-&&", "t" === r.charAt(0)) && n.call(this, r)) && !isNaN(+r.slice(1))) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if (COVERAGE_TRACKER.trackBranch("_regeneratorRuntime", "c16agsrug", "if", "throw" === t.type)) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (COVERAGE_TRACKER.trackBranch("_regeneratorRuntime", "qv3xcr0eg", "if", this.done)) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, COVERAGE_TRACKER.trackBranch("handle", "2t5q3ktey", "logical-&&", o) && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if (COVERAGE_TRACKER.trackBranch("_regeneratorRuntime", "vt4650eqa", "if", "root" === i.tryLoc)) return handle("end"); if (COVERAGE_TRACKER.trackBranch("_regeneratorRuntime", "hlj8d5502", "if", i.tryLoc <= this.prev)) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (COVERAGE_TRACKER.trackBranch("_regeneratorRuntime", "xq2oqh6sc", "if", COVERAGE_TRACKER.trackBranch("_regeneratorRuntime", "cmu5lvs2v", "logical-&&", c) && u)) { if (COVERAGE_TRACKER.trackBranch("_regeneratorRuntime", "166tm9d7h", "if", this.prev < i.catchLoc)) return handle(i.catchLoc, !0); if (COVERAGE_TRACKER.trackBranch("_regeneratorRuntime", "dub78hykr", "if", this.prev < i.finallyLoc)) return handle(i.finallyLoc); } else if (COVERAGE_TRACKER.trackBranch("_regeneratorRuntime", "q54chx9s8", "if", c)) { if (COVERAGE_TRACKER.trackBranch("_regeneratorRuntime", "ee8x08jtt", "if", this.prev < i.catchLoc)) return handle(i.catchLoc, !0); } else { if (COVERAGE_TRACKER.trackBranch("_regeneratorRuntime", "65rhqz28t", "if", !u)) throw Error("try statement without catch or finally"); if (COVERAGE_TRACKER.trackBranch("_regeneratorRuntime", "dfdzeazil", "if", this.prev < i.finallyLoc)) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (COVERAGE_TRACKER.trackBranch("_regeneratorRuntime", "1he4qs9la", "if", COVERAGE_TRACKER.trackBranch("_regeneratorRuntime", "et6mtg2tk", "logical-&&", COVERAGE_TRACKER.trackBranch("_regeneratorRuntime", "4dgu9tbsc", "logical-&&", o.tryLoc <= this.prev) && n.call(o, "finallyLoc")) && this.prev < o.finallyLoc)) { var i = o; break; } } COVERAGE_TRACKER.trackBranch("_regeneratorRuntime", "6i7tmpm0h", "logical-&&", COVERAGE_TRACKER.trackBranch("_regeneratorRuntime", "tp7qvnajx", "logical-&&", COVERAGE_TRACKER.trackBranch("_regeneratorRuntime", "egb62ns64", "logical-&&", COVERAGE_TRACKER.trackBranch("_regeneratorRuntime", "noc13r43o", "logical-&&", i) && (COVERAGE_TRACKER.trackBranch("_regeneratorRuntime", "wyhuyp2ee", "logical-||", "break" === t) || "continue" === t)) && i.tryLoc <= e) && e <= i.finallyLoc) && (i = null); var a = COVERAGE_TRACKER.trackBranch("_regeneratorRuntime", "5qh7p55rc", "ternary", i) ? i.completion : {}; return a.type = t, a.arg = e, COVERAGE_TRACKER.trackBranch("_regeneratorRuntime", "wgzlz18w1", "ternary", i) ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if (COVERAGE_TRACKER.trackBranch("_regeneratorRuntime", "t6ok0h2pk", "if", "throw" === t.type)) throw t.arg; return COVERAGE_TRACKER.trackBranch("_regeneratorRuntime", "sukg2z2tw", "ternary", COVERAGE_TRACKER.trackBranch("_regeneratorRuntime", "xoa40eify", "logical-||", "break" === t.type) || "continue" === t.type) ? this.next = t.arg : COVERAGE_TRACKER.trackBranch("_regeneratorRuntime", "hg078wj9n", "ternary", "return" === t.type) ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : COVERAGE_TRACKER.trackBranch("_regeneratorRuntime", "y5b8zwh6m", "logical-&&", COVERAGE_TRACKER.trackBranch("_regeneratorRuntime", "by80fsvxs", "logical-&&", "normal" === t.type) && e) && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (COVERAGE_TRACKER.trackBranch("_regeneratorRuntime", "503mk9ga4", "if", r.finallyLoc === t)) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (COVERAGE_TRACKER.trackBranch("_regeneratorRuntime", "fhacf7sbm", "if", r.tryLoc === t)) { var n = r.completion; if (COVERAGE_TRACKER.trackBranch("_regeneratorRuntime", "0jpev696v", "if", "throw" === n.type)) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, COVERAGE_TRACKER.trackBranch("_regeneratorRuntime", "gy3i7olyt", "logical-&&", "next" === this.method) && (this.arg = t), y; } }, e; }
function ownKeys(e, r) { var t = Object.keys(e); if (COVERAGE_TRACKER.trackBranch("ownKeys", "vl4sfx3ft", "if", Object.getOwnPropertySymbols)) { var o = Object.getOwnPropertySymbols(e); COVERAGE_TRACKER.trackBranch("ownKeys", "lyupkh6kx", "logical-&&", r) && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = COVERAGE_TRACKER.trackBranch("_objectSpread", "peyd6ne73", "ternary", null != arguments[r]) ? arguments[r] : {}; COVERAGE_TRACKER.trackBranch("_objectSpread", "uk0gn4bxx", "ternary", r % 2) ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : COVERAGE_TRACKER.trackBranch("_objectSpread", "yk57py3oq", "ternary", Object.getOwnPropertyDescriptors) ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return COVERAGE_TRACKER.trackBranch("_defineProperty", "0kaxfl26f", "ternary", (r = _toPropertyKey(r)) in e) ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return COVERAGE_TRACKER.trackBranch("_toPropertyKey", "dl8g8vhal", "ternary", "symbol" == _typeof(i)) ? i : i + ""; }
function _toPrimitive(t, r) { if (COVERAGE_TRACKER.trackBranch("_toPrimitive", "plxmoaz20", "if", COVERAGE_TRACKER.trackBranch("_toPrimitive", "rbgis8pgs", "logical-||", "object" != _typeof(t)) || !t)) return t; var e = t[Symbol.toPrimitive]; if (COVERAGE_TRACKER.trackBranch("_toPrimitive", "oeh3v1lhl", "if", void 0 !== e)) { var i = e.call(t, COVERAGE_TRACKER.trackBranch("_toPrimitive", "h53r983zd", "logical-||", r) || "default"); if (COVERAGE_TRACKER.trackBranch("_toPrimitive", "hmd7syshu", "if", "object" != _typeof(i))) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return (COVERAGE_TRACKER.trackBranch("_toPrimitive", "nkht72hlk", "ternary", "string" === r) ? String : Number)(t); }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = COVERAGE_TRACKER.trackBranch("_typeof", "bm4cfg8kd", "ternary", COVERAGE_TRACKER.trackBranch("_typeof", "apbs55ugj", "logical-&&", "function" == typeof Symbol) && "symbol" == typeof Symbol.iterator) ? function (o) { return typeof o; } : function (o) { return COVERAGE_TRACKER.trackBranch("_typeof", "h198p1o1u", "ternary", COVERAGE_TRACKER.trackBranch("_typeof", "4v83jshy4", "logical-&&", COVERAGE_TRACKER.trackBranch("_typeof", "puep6sya2", "logical-&&", COVERAGE_TRACKER.trackBranch("_typeof", "nm4i3aowf", "logical-&&", o) && "function" == typeof Symbol) && o.constructor === Symbol) && o !== Symbol.prototype) ? "symbol" : typeof o; }, _typeof(o); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } COVERAGE_TRACKER.trackBranch("asyncGeneratorStep", "1qcgfgjm0", "ternary", i.done) ? t(u) : Promise.resolve(u).then(r, o); }
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
}(COVERAGE_TRACKER.trackBranch("typescript-test", "si9iufo2a", "logical-||", Status) || {}); // Generic type
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
  return COVERAGE_TRACKER.trackBranch("getUserDisplayName", "6u74iih6c", "ternary", COVERAGE_TRACKER.trackBranch("getUserDisplayName", "z2qks4ktl", "logical-&&", (_user$name = COVERAGE_TRACKER.trackBranch("getUserDisplayName", "1wm71vib7", "ternary", COVERAGE_TRACKER.trackBranch("getUserDisplayName", "dwzimg5wf", "logical-||", user === null) || user === void 0) ? void 0 : user.name) !== null) && _user$name !== void 0) ? _user$name : 'Anonymous';
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
  console.log('Found user:', COVERAGE_TRACKER.trackBranch("typescript-test", "far41ygvr", "ternary", COVERAGE_TRACKER.trackBranch("typescript-test", "w5o2dopxp", "logical-||", foundUser === null) || foundUser === void 0) ? void 0 : foundUser.name);

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