'use strict';
/**
 * @ngdoc module
 * @name actinium.providers.view-bridge
 **/
angular.module('actinium.providers.view-bridge', [])
/**
 * @ngdoc provider
 * @name actinium.providers.view-bridge:viewBridgeProvider
 **/
  .provider('viewBridge', function() {
    var data = this.data = {};

    this.$get = [function() {
      return data;
    }];

    /**
     * @param {String} [ident]
     */
    this.init = function(ident) {
      var bridgeEl;

      if (ident) {
        bridgeEl = document.getElementById(ident);
      } else {
        bridgeEl = document.querySelector('[type="ac/bridge"]');
      }
      if (!bridgeEl) {
        throw new Error('Unexpected bridge element');
      }

      data = angular.fromJson(bridgeEl.innerHTML || '{}');
    };

  });
