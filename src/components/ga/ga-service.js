'use strict';

angular.module('actinium.components.ga')
/**
 * @ngdoc service
 * @name actinium.components.ga:ga
 * @requires $window
 **/
.service('ga', ['$window', function($window) {
  return $window[$window.GoogleAnalyticsObject];
}]);
