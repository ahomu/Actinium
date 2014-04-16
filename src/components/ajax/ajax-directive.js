'use strict';

angular.module('actinium.components.ajax')
/**
 * @ngdoc directive
 * @name actinium.components.ajax:acAjax
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
 * <ac-ajax
 *   auto="true"
 *   handler="__noop__"
 *   response="articles"
 *   method="GET"
 *   url="/api/my/article/list" />
 * ```
 **/
.directive('acAjax', ['$http', 'ajax', function($http, ajax) {
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
