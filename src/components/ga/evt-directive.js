'use strict';

angular.module('actinium.components.ga')
/**
 * @ngdoc directive
 * @name actinium.components.ga:acGaEvent
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
 * <button ac-ga-evt category="video" action="play" label="Let's Play"></button>
 * ```
 **/
.directive('acGaEvent', ['ga', function(ga) {

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
