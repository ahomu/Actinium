'use strict';

angular.module('actinium.components.ga')
/**
 * @ngdoc directive
 * @name actinium.components.ga:acGaEvent
 * @restrict A
 *
 * @element ANY
 *
 * @priority 0
 *
 * @description
 * 該当要素のclickイベントをEventとしてGoogle Analyticsに計上します。
 *
 * ```html
 * <button ac-ga-evt category="video" action="play" label="Let's Play"></button>
 * ```
 **/
.directive('acGaEvt', ['$window', function($window) {

  var _directive =  {
    restrict : 'A',
    scope    : false,
    link     : _link
  };

  function _link(scope, element, attrs) {

    element.on('click', _event);

    scope.$on('$destroy', function() {
      element.off('click', _event);
    });

    function _event() {
      $window[$window.GoogleAnalyticsObject]('send', {
        hitType       : 'event',
        eventCategory : attrs.category,
        eventAction   : attrs.action,
        eventLabel    : attrs.label,
        eventValue    : attrs.value
      });
    }

  }

  return _directive;
}]);
