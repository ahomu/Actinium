/*! actinium - v0.0.4 ( 2014-04-16 ) -  */
;(function(window) {

"use strict";

/**
 * @ngdoc module
 * @name actinium.providers.bundle
 **/
angular.module('actinium.providers.bundle', [])
/**
 * @ngdoc service
 * @name actinium.providers.bundle:bundleFactory
 **/
.factory('bundleFactory', function() {

  function Bundle(args) {
    this.args = args || {};
  }

  Bundle.prototype.save = function(args) {
    angular.copy(args, this.args);
  };

  Bundle.prototype.restore = function(dest) {
    angular.copy(this.args, dest);
  };

  Bundle.prototype.drop = function() {
    this.args = {};
  };

  return {
    create : function(args) {
      return new Bundle(args);
    }
  };

});

/**
 * @ngdoc module
 * @name actinium.providers.config
 **/
angular.module('actinium.providers.config', [])
/**
 * @ngdoc provider
 * @name actinium.providers.config:configProvider
 **/
.provider('config', function() {
  var data = this.data = {};

  this.$get = [function() {
    return data;
  }];

  this.init = function(_config) {
    angular.copy(_config, data);
  };

});

/**
 * @ngdoc module
 * @name actinium.providers.storage
 **/
angular.module('actinium.providers.storage', [])
.factory('storageImplements', function() {

  /**
   * @param {String} identifier
   * @param {Storage} storage
   * @constructor
   */
  function Storage(identifier, storage) {
    this.identifier = identifier;
    this.storage    = storage;
    this.data       = angular.fromJson(storage.getItem(identifier) || '{}') || {};
  }

  /**
   * @param {String} key
   * @param {*} val
   */
  Storage.prototype.set = function(key, val) {
    this.data[key] = val;
    this.storage.setItem(this.identifier, angular.toJson(this.data));
  };

  /**
   * @param {String} key
   */
  Storage.prototype.get = function(key) {
    return this.data[key];
  };

  /**
   * @param {String} key
   * @return {Boolean}
   */
  Storage.prototype.exists = function(key) {
    return key in this.data;
  };

  /**
   * @param {String} key
   */
  Storage.prototype.remove = function(key) {
    delete this.data[key];
    this.storage.setItem(this.identifier, angular.toJson(this.data));
  };

  /**
   *
   */
  Storage.prototype.clearAll = function() {
    this.storage.setItem(this.identifier, angular.toJson(this.data = {}));
  };

  return {
    create : function(identifier, storage) {
      return new Storage(identifier, storage);
    }
  };
})
/**
 * @ngdoc provider
 * @name actinium.providers.storage:localStorageProvider
 * @requires $window
 * @requires actinium.providers.storage:storageImplements
 **/
.provider('localStorage', function() {
  var identifier = 'actinium';

  this.$get = ['$window', 'storageImplements', function($window, storageImplements) {
    return storageImplements.create(identifier, $window.localStorage);
  }];

  this.setIdentifier = function(key) {
    identifier = key;
  };

})
/**
 * @ngdoc provider
 * @name actinium.providers.storage:sessionStorageProvider
 * @requires $window
 * @requires actinium.providers.storage:storageImplements
 **/
.provider('sessionStorage', function() {
  var identifier = 'actinium';

  this.$get = ['$window', 'storageImplements', function($window, storageImplements) {
    return storageImplements.create(identifier, $window.sessionStorage);
  }];

  this.setIdentifier = function(key) {
    identifier = key;
  };

});

/**
 * @ngdoc module
 * @name actinium.components.ajax
 **/
angular
.module('actinium.components.ajax', [])
/**
 * @ngdoc service
 * @name actinium.components.ajax:ajaxProvider
 * @requires $http
 **/
.provider('ajax', function() {

  var settings = this.settings = {
    baseUrl       : '',
    jsonpCallback : 'callback=JSON_CALLBACK'
  };

  this.$get = ['$http', function($http) {

    /**
     * @param {Object} config
     * @return {Promise}
     */
    function jsonpRequest(config) {
      var url = config.url + '?' + settings.jsonpCallback + '&t=' + Date.now(),
          _passConfig = angular.copy(config);

      if (url.indexOf('http') !== 0) {
        if (url.indexOf('/') !== 0) {
          url = '/' + url;
        }
        url = settings.baseUrl + url;
      }

      delete _passConfig.url;

      return $http.jsonp(url, _passConfig);
    }

    /**
     * @param {Object} config
     * @return {Promise}
     */
    function ajaxRequest(config) {

      
      
      
      

      return $http(config).then(function(resp) {

        
        
        
        

        return resp;
      });
    }

    return {
      request : ajaxRequest,
      jsonp   : jsonpRequest
    };

  }];
});

/**
 * @ngdoc directive
 * @name actinium.components.ajax:ajax
 * @restrict E
 *
 * @element ANY
 * @param {data bind}   handler
 * @param {data bind}   [data]
 * @param {data bind}   [validate]
 * @param {data bind}   [response]
 * @param {data bind}   [success]
 * @param {data bind}   [error]
 * @param {interpolate} url
 * @param {interpolate} method
 * @param {interpolate} [auto]
 *
 * @priority 0
 * @requires $http
 * @requires actinium.components.ajax:ajaxProvider
 *
 * @see https://github.com/PolymerLabs/polymer-ajax
 * @description
 * Polymer-Ajaxに触発された
 *
 * ```html
 * <ajax
 *   auto="true"
 *   handler="__noop__"
 *   response="articles"
 *   method="GET"
 *   url="/api/my/article/list" />
 * ```
 **/
angular
.module('actinium.components.ajax')
.directive('ajax', ['$http', 'ajax', function($http, ajax) {
  var _directive =  {
    restrict : 'E',
    replace  : true,
    scope    : {
      handler  : '=',
      data     : '=',
      validate : '=',
      response : '=',
      success  : '=',
      error    : '=',
      url      : '@',
      method   : '@',
      auto     : '@'
    },
    template : '',
    link     : _link
  };

  function _link(scope, element, attrs) {

    scope.handler = function() {

      var data = angular.isFunction(scope.data) ? scope.data() || {}
                                                : scope.data   || {},
          config = {
            method : scope.method || 'GET',
            url    : scope.url
          };

      if (config.method === 'GET') {
        config.params = data;
      } else {
        config.data = data;
      }

      if (angular.isFunction(scope.validate)) {
        if (!scope.validate(config)) {
          return;
        }
      }

      ajax.jsonp(config).then(function(resp, status) {
        if ('response' in attrs) {
          scope.response = resp;
        }
        if (angular.isFunction(scope.success)) {
          scope.success(resp, status);
        }
      }).catch(function(err) {
        if (angular.isFunction(scope.error)) {
          scope.error(err);
        }
      });

    };

    if (scope.auto === 'true') {
      scope.handler();
    }
  }

  return _directive;
}]);

/**
 * @ngdoc module
 * @name actinium.components.dimension
 **/
angular
  .module('actinium.components.dimension', [
  ]);

/**
 * @ngdoc directive
 * @name actinium.components.dimension:fixedSticky
 * @restrict A
 *
 * @element ANY
 *
 * @priority 0
 * @requires $window
 * @requires $document
 *
 * @see https://github.com/ahomu/jquery.ah-adjustfixed
 * @description
 * すごい昔のjQueryプラギーン移植。初期化時の絶対座標を反映しつつ、該当要素をbody直下の子要素としてfixedします。
 *
 * ```html
 * <div id="fixed-sidebar" fixed-sticky>
 * ```
 **/
angular
.module('actinium.components.dimension')
.directive('fixedSticky', ['$window', '$document', function($window, $document) {

  var _directive =  {
    restrict : 'A',
    scope    : true,
    link     : _link
  };

  /**
   * @param {Element} elm
   * @returns {Object}
   */
  function elAbsRectPos(elm) {
    var rect = elm.getBoundingClientRect();

    return {
      top    : parseInt(rect.top, 10) + getPageYOffset(),
      bottom : parseInt(rect.bottom, 10),
      left   : parseInt(rect.left, 10),
      right  : parseInt(rect.right, 100),
      width  : rect.width  || (rect.right  - rect.left),
      height : rect.height || (rect.bottom - rect.top)
    };
  }

  /**
   * @returns {Number}
   */
  var getPageYOffset;
  if ('pageYOffset' in $window) {
    getPageYOffset = function() {
      return $window.pageYOffset;
    };
  } else if ('documentElement' in $document) {
    getPageYOffset = function() {
      return $document.documentElement.scrollTop;
    };
  } else {
    getPageYOffset = function() {
      return $document.body;
    };
  }

  function _link(scope, element, attrs) {

    var $box           = element,
        $parent        = $box.parent(),
        showOnlySticky = attrs.showOnlySticky === 'true',
        boxAbs         = elAbsRectPos($box[0]),
        boxAbsTop      = boxAbs.top,
        boxAbsLeft     = boxAbs.left,
        marginLeft     = parseInt($box.css('margin-left')) || 0,
        parentAbs      = elAbsRectPos($parent[0]),
        parentAbsLeft  = parentAbs.left,
        parentAbsDiff  = 0,
        boxLiveLeft    = boxAbsLeft - marginLeft,
        lastPoint;

    $window.addEventListener('scroll', watcher);
    $window.addEventListener('resize', resizer);

    scope.$on('$destroy', function() {
      $window.removeEventListener('scroll', watcher);
      $window.removeEventListener('resize', resizer);
    });

    document.body.appendChild($box[0]);
    watcher();

    function resizer() {
      parentAbs     = elAbsRectPos($parent[0]);
      parentAbsDiff = parentAbs.left - parentAbsLeft;
      parentAbsLeft = parentAbs.left;
      boxLiveLeft   = parseInt($box.css('left')) + parentAbsDiff;
      $box.css('left', boxLiveLeft + 'px');
    }

    function watcher() {
      var pageScroll = getPageYOffset(),
          styles;

      // ネガティブスクロールには反応させない(Safari5.1など)
      if (pageScroll < 0) {
        return;
      }

      if (boxAbsTop > pageScroll) {
        // スクロール量が，絶対位置に満たないとき
        if (showOnlySticky) {
          $box.addClass('is-invisible-rect');
        }
        styles = {
          position  : 'absolute',
          top       : boxAbsTop + 'px',
          left      : boxLiveLeft + 'px',
          marginTop : 0
        };
      } else {
        // その他の中間位置の場所調整
        if (showOnlySticky) {
          $box.removeClass('is-invisible-rect');
        }
        styles = {
          position  : 'fixed',
          top       : 0,
          left      : boxLiveLeft + 'px',
          marginTop : '10px'
        };
      }

      if ( lastPoint !== styles.top ) {
        $box.css(styles);
      }

      lastPoint = styles.top;
    }
  }

  return _directive;
}]);

/**
 * @ngdoc module
 * @name actinium.components.ga
 *
 * TODO gaのスクリプト呼び出しもモジュール化したい
 **/
angular
  .module('actinium.components.ga', [
  ]);

/**
 * @ngdoc service
 * @name actinium.components.ga:ga
 * @requires $window
 **/
angular.module('actinium.components.ga').service('ga', ['$window', function($window) {
  return $window[$window.GoogleAnalyticsObject];
}]);

/**
 * @ngdoc directive
 * @name actinium.components.ga:gaTrackEvent
 * @restrict A
 *
 * @element ANY
 * @param {interpolate} category
 * @param {interpolate} action
 * @param {interpolate} [label]
 * @param {interpolate} [value]
 *
 * @priority 0
 * @scope
 * @requires actinium.components.ga:ga
 *
 * @description
 * 該当要素のclickイベントをEventとしてGoogle Analyticsに計上します。
 *
 * ```html
 * <button ga-track-event category="video" action="play" label="Let's Play"></button>
 * ```
 **/
angular.module('actinium.components.ga').directive('gaTrackEvent', ['ga', function(ga) {

  var _directive =  {
    restrict : 'A',
    scope    : {
      category : '@',
      action   : '@',
      label    : '@',
      value    : '@'
    },
    link     : _link
  };

  function _link(scope, element, attrs) {

    element.on('click', _event);

    scope.$on('$destroy', function() {
      element.off('click', _event);
    });

    function _event() {
      ga('send', {
        hitType       : 'event',
        eventCategory : scope.category,
        eventAction   : scope.action,
        eventLabel    : scope.label,
        eventValue    : scope.value
      });
    }

  }

  return _directive;
}]);

/**
 * @ngdoc directive
 * @name actinium.components.ga:gaTrackPv
 * @restrict A
 *
 * @element ANY
 * @param {interpolate} page
 * @param {interpolate} title
 *
 * @priority 0
 * @scope
 * @requires actinium.components.ga:ga
 *
 * @description
 * 該当要素のclickイベントをPageViewとしてGoogle Analyticsに計上します。
 *
 * ```html
 * <button ga-track-pv page="/virtual" title="Virtual PV"></button>
 * ```
 **/
angular.module('actinium.components.ga').directive('gaTrackPv', ['ga', function(ga) {

  var _directive =  {
    restrict : 'A',
    scope    : {
      page  : '@',
      title : '@'
    },
    link     : _link
  };

  function _link(scope, element, attrs) {

    element.on('click', _pageview);

    scope.$on('$destroy', function() {
      element.off('click', _pageview);
    });

    function _pageview() {
      ga('send', {
        hitType : 'pageview',
        page    : scope.page,
        title   : scope.title
      });
    }
  }

  return _directive;
}]);

/**
 * @ngdoc module
 * @name actinium.components.touch
 **/
angular
  .module('actinium.components.touch', [
  ]);

/**
 * @ngdoc service
 * @name actinium.components.touch:pussyTouchService
 * @requires Zepto
 **/
angular.module('actinium.components.touch').service('pussyTouch', [function() {

  /**
   * @param {Object} options
   * @constructor
   */
  var Pussy = function(options) {

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
  Pussy.prototype.btnHandler = function(evt) {
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
  Pussy.prototype.listHandler = function(evt) {
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
  Pussy.prototype.destroy = function() {
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
     * @return {Pussy}
     */
    init : function(options) {
      return new Pussy(options);
    }
  };

}]);

})(window);