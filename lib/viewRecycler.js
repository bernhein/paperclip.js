var protoclass            = require("protoclass"),
Bindings                  = require("./bindings"),
createSection             = require("document-section"),
BindableObject            = require("bindable-object"),
syncBindableObjectChanges = require("./utils/syncBindableObjectChanges");

/**
 * Wraps arou
 */

function ViewRecycler (template) {

  // the template that created the viw
  this.template = template;
}

protoclass(ViewRecycler, {

  /**
   */

  _view: function () {
    return this.__view || (this.__view = this.template._getView());
  },

  /**
   */

  bind: function (context) {
    this.bound = true;
    this._view().bind(context);
    this.context = this.__view.context;
    this.clips = this.__view.clips;
    this.node = this.__view.node;
    return this;
  },

  /**
   */

  unbind: function () {
    this._view().unbind();
    this.bound = false;
  },

  /**
   */

  dispose: function () {
    if (this.__view) this.__view.dispose();
    this._recycle();
  },

  /**
   */

  _recycle: function () {
    if (this.__view) {
      this.template._addView(this.__view);
      this.__view = void 0;
    }
  },

  /**
   */

  render: function () {
    if (!this.bound) {
      this.bind();
    }
    return this._view().render();
  },

  /**
   */

  remove: function () {
    if (this.__view) this.__view.remove();

    // TODO - needs to respect transitions
    this._recycle();
    return this;
  },

  /**
   */

  toString: function () {
    return this._view().toString();
  }
});

module.exports = ViewRecycler;