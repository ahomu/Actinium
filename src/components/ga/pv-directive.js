'use strict';

angular.module('actinium.components.ga')
/**
 * @ngdoc directive
 * @name actinium.components.ga:acGaPv
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
 * <button ac-ga-pv page="/virtual" title="Virtual PV"></button>
 * ```
 **/
.directive('acGaPv', ['ga', function(ga) {

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