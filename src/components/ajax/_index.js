'use strict';

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

      console.group('Request to ' + config.url);
      console.debug('Data', config.data);
      console.debug('Config', config);
      console.groupEnd();

      return $http(config).then(function(resp) {

        console.group('Response from: ' + config.url);
        console.debug('Status', resp.status);
        console.debug('Body', resp.data);
        console.groupEnd();

        return resp;
      });
    }

    return {
      request : ajaxRequest,
      jsonp   : jsonpRequest
    };

  }];
});
