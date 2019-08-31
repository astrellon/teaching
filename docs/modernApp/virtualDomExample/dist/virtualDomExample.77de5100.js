// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"index.ts":[function(require,module,exports) {
function render(element) {
  // Check for string element
  if (typeof element === 'string') {
    // The DOM already has a function for creating text nodes.
    return document.createTextNode(element);
  } // The createElement function accepts the node type as a string.


  var domElement = document.createElement(element.type); // Add all attributes to the element.
  // No handling of event handlers for now.

  for (var prop in element.props) {
    // Check if the string starts with the letters 'on'.
    // Note this function is not available in Internet Explorer.
    if (prop.startsWith('on')) {
      // Chop off the first two characters and use the rest as the event listener type.
      // Note: This is *not* the correct way to do this.
      // It'll pick on anything that starts with 'on', like 'onion' or 'once'.
      // Also we're not checking if the value is actually a function.
      // For now to get a working example UI we'll go with it.
      domElement.addEventListener(prop.substr(2), element.props[prop]);
    } else {
      // setAttribute is used for any attribute on an element such as class, value, src, etc.
      domElement.setAttribute(prop, element.props[prop]);
    }
  } // Append all child elements.


  for (var _i = 0, _a = element.children; _i < _a.length; _i++) {
    var child = _a[_i];
    domElement.append(render(child));
  }

  return domElement;
}

function vdom(type, props) {
  var children = [];

  for (var _i = 2; _i < arguments.length; _i++) {
    children[_i - 2] = arguments[_i];
  }

  return {
    type: type,
    props: props,
    children: children
  };
}

var buttonClickTimes = 0;

function onClickButton() {
  buttonClickTimes++;
  renderApp();
}

function renderApp() {
  // Example app
  var app = vdom('main', {}, vdom('h1', {}, 'Header'), vdom('p', {}, vdom('strong', {}, 'A button'), vdom('button', {
    onclick: onClickButton
  }, 'Button Text'), vdom('span', {}, "Button clicked " + buttonClickTimes + " times")));
  var rootDomElement = document.getElementById('root');
  var domApp = render(app);

  if (rootDomElement.childNodes.length > 0) {
    rootDomElement.replaceChild(domApp, rootDomElement.childNodes[0]);
  } else {
    rootDomElement.append(domApp);
  }
} // Render the app


renderApp();
},{}]},{},["index.ts"], null)
//# sourceMappingURL=/virtualDomExample.77de5100.js.map