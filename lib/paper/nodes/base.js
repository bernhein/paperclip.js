// Generated by CoffeeScript 1.6.2
var Base, async, pilot;

async = require("async");

pilot = require("pilot-block");

Base = (function() {
  /*
  */
  Base.prototype.__isNode = true;

  /*
  */


  function Base() {
    this.children = [];
  }

  /*
  */


  Base.prototype.bind = function() {
    var child, _i, _len, _ref;

    _ref = this.children || [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      child = _ref[_i];
      child.bind();
    }
    return this;
  };

  /*
  */


  Base.prototype.dispose = function() {
    var child, _i, _len, _ref, _ref1, _results;

    if ((_ref = this.section) != null) {
      _ref.dispose();
    }
    _ref1 = this.children || [];
    _results = [];
    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
      child = _ref1[_i];
      _results.push(child.dispose());
    }
    return _results;
  };

  /*
  */


  Base.prototype.attach = function(element, context) {
    this.load(context.detachBuffer());
    if (element.__isNode) {
      element.section.append(pilot.createSection(context.buffer.join("")));
      pilot.update(element.section.parent);
    } else {
      element.innerHTML = context.buffer.join("");
      pilot.update(element);
    }
    return this.bind();
  };

  /*
   writes HTML to the DOM
  */


  Base.prototype.load = function(context) {
    this.context = context;
    this._writeHead(context);
    this._loadChildren(context);
    this._writeTail(context);
    return this;
  };

  /*
  */


  Base.prototype._writeHead = function(info) {};

  /*
  */


  Base.prototype._loadChildren = function(context) {
    var child, _i, _len, _ref, _results;

    _ref = this.children;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      child = _ref[_i];
      _results.push(child.load(context));
    }
    return _results;
  };

  /*
  */


  Base.prototype._writeTail = function(info) {};

  /*
  */


  Base.prototype.addChild = function() {
    var child, _i, _len, _results;

    _results = [];
    for (_i = 0, _len = arguments.length; _i < _len; _i++) {
      child = arguments[_i];
      child.parent = this;
      _results.push(this.children.push(child));
    }
    return _results;
  };

  /*
   used mostly for block bindings
  */


  Base.cloneEach = function(source) {
    var item, items, _i, _len;

    items = [];
    for (_i = 0, _len = source.length; _i < _len; _i++) {
      item = source[_i];
      items.push(item.clone());
    }
    return items;
  };

  return Base;

})();

module.exports = Base;