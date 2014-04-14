'use strict';

/**
 * @ngdoc service
 * @name actinium.components.ga:ga
 * @requires $window
 **/
angular.module('actinium.components.ga').service('ga', ['$window', function($window) {
  return $window[$window.GoogleAnalyticsObject];
}]);
