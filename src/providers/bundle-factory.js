'use strict';

/**
 * @ngdoc module
 * @name actinium.providers.bundle
 **/
angular.module('actinium.providers.bundle', [])
/**
 * @ngdoc service
 * @name actinium.providers.bundle:bundleFactory
 **/
.factory('bundleFactory', function() {

  /**
   * @param {Object} args
   * @constructor
   */
  function Bundle(args) {
    this.args = args || {};
  }

  /**
   * @param {Object} args
   */
  Bundle.prototype.save = function(args) {
    angular.copy(args, this.args);
  };

  /**
   * @param {Object} dest
   */
  Bundle.prototype.restore = function(dest) {
    angular.copy(this.args, dest);
  };

  /**
   */
  Bundle.prototype.drop = function() {
    this.args = {};
  };

  return {
    /**
     * @param {Object} args
     */
    create : function(args) {
      return new Bundle(args);
    }
  };

});
