// Generated by CoffeeScript 1.6.2
var Builder, Html, b, bindable, node;

bindable = require("bindable");

Html = require("./nodes/html");

Builder = (function() {
  /*
  */
  function Builder(factory) {
    this.factory = factory;
  }

  /*
  */


  Builder.prototype.build = function() {
    return this.factory.call(this);
  };

  /*
  */


  Builder.prototype.create = function() {
    return new Html();
  };

  return Builder;

})();

module.exports = Builder;

b = new Builder(require("../../../test"));

node = b.build();

/*
node.load({ data: new bindable.Object({ first: { name: "craig" } }), buffer: [] }, (err, content) {

  # add the html
  el.html(content);

  # finds all comments
  binder.bind(node, el)
})
*/


node.load({
  data: new bindable.Object({
    first: {
      name: "craig"
    }
  }),
  buffer: [],
  nodes: {}
}, function(err, content) {
  return console.log(JSON.stringify(content.buffer, null, 2));
});