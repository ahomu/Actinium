'use strict';
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
