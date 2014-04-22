'use strict';

angular.module('actinium.components.ga')
/**
 * @ngdoc directive
 * @name actinium.components.ga:acGaPv
 * @restrict A
 *
 * @element ANY
 *
 * @priority 0
 *
 * @description
 * 該当要素のclickイベントをPageViewとしてGoogle Analyticsに計上します。
 *
 * ```html
 * <button ac-ga-pv page="/virtual" title="Virtual PV"></button>
 * ```
 **/
.directive('acGaPv', ['$window', function($window) {

  var _directive =  {
    restrict : 'A',
    scope    : false,
    link     : _link
  };

  function _link(scope, element, attrs) {

    element.on('click', _pageview);

    scope.$on('$destroy', function() {
      element.off('click', _pageview);
    });

    function _pageview() {
      $window[$window.GoogleAnalyticsObject]('send', {
        hitType : 'pageview',
        page    : attrs.page,
        title   : attrs.title
      });
    }
  }

  return _directive;
}]);
