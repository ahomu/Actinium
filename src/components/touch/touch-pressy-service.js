'use strict';

/**
 * @ngdoc service
 * @name actinium.components.touch:touchPressy
 * @requires Zepto
 **/
angular.module('actinium.components.touch').service('touchPressy', [function() {

  /**
   * @param {Object} options
   * @constructor
   */
  var Pressy = function(options) {

    options = angular.extend({
      $el            : $(document),
      asBtnSelector  : '[data-tap]',
      asListSelector : '[data-tap-list] > li'
    }, options);

    this.$el = options.$el,
    this.timerId = null;
    this.listSelector = options.asListSelector;
    this.btnSelector  = options.asBtnSelector;

    // bind
    this.btnHandler = angular.bind(this, this.btnHandler);
    this.listHandler = angular.bind(this, this.listHandler);

    this.$el.on(
      'touchstart touchmove touchend touchleave touchcancel',
      this.btnSelector,
      this.btnHandler
    );
    this.$el.on(
      'touchstart touchmove touchend touchleave touchcancel',
      this.listSelector,
      this.listHandler
    );
  };

  /**
   * ボタンタイプのハンドラ
   * クラスを外すタイミングで 150ms 遅延させる
   * @param {Event} evt
   */
  Pressy.prototype.btnHandler = function(evt) {
    switch(evt.type) {
      case 'touchstart':
        _addClass(evt.currentTarget);
        break;
      case 'touchmove':
      case 'touchend':
      case 'touchleave':
      case 'touchcancel':
        clearTimeout(this.timerId);
        this.timerId = setTimeout(function() {
          _removeClass(evt.currentTarget);
        }, 150);
        break;
    }
  };

  /**
   * リストタイプのハンドラ
   * クラスを付けるタイミングと、外すタイミングで 150ms 遅延させる
   * @param {Event} evt
   */
  Pressy.prototype.listHandler = function(evt) {
    switch(evt.type) {
      case 'touchstart':
        clearTimeout(this.timerId);
        this.timerId = setTimeout(function() {
          _addClass(evt.currentTarget);
        }, 150);
        break;
      case 'touchmove':
        clearTimeout(this.timerId);
        _removeClass(evt.currentTarget);
        break;
      case 'touchend':
      case 'touchleave':
      case 'touchcancel':
        this.timerId = setTimeout(function() {
          _removeClass(evt.currentTarget);
        }, 150);
        break;
    }
  };

  /**
   * すべてのイベントハンドラを破棄する
   */
  Pressy.prototype.destroy = function() {
    this.$el.off(
      'touchstart touchmove touchend touchleave touchcancel',
      this.btnSelector,
      this.btnHandler
    );
    this.$el.off(
      'touchstart touchmove touchend touchleave touchcancel',
      this.listSelector,
      this.listHandler
    );
  };

  /**
   * @param {Element} elm
   * @private
   */
  function _addClass(elm) {
    if(elm.className.indexOf('is-pressed') === -1) {
      elm.className += ' is-pressed';
    }
  }

  /**
   * @param {Element} elm
   * @private
   */
  function _removeClass(elm) {
    elm.className = elm.className.replace('is-pressed', '');
  }

  return {
    /**
     * @param {Object} options
     * @return {Pressy}
     */
    init : function(options) {
      return new Pressy(options);
    }
  };

}]);
