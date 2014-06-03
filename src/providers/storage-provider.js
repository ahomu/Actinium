'use strict';
/**
 * @ngdoc module
 * @name actinium.providers.storage
 **/
angular.module('actinium.providers.storage', [])
/**
 * @ngdoc factory
 * @name actinium.providers.storage:storageImplements
 **/
.factory('storageImplements', function() {

  /**
   * @param {String} identifier
   * @param {Storage} storage
   * @constructor
   */
  function Storage(identifier, storage) {
    this.identifier = identifier;
    this.storage    = storage;
    this.data       = angular.fromJson(storage[identifier] || '{}') || {};
  }

  /**
   * @param {String} key
   * @param {*} val
   */
  Storage.prototype.set = function(key, val) {
    this.data[key] = val;
    this.storage[this.identifier] = angular.toJson(this.data);
  };

  /**
   * @param {String} key
   */
  Storage.prototype.get = function(key) {
    return this.data[key];
  };

  /**
   * @param {String} key
   * @return {Boolean}
   */
  Storage.prototype.exists = function(key) {
    return key in this.data;
  };

  /**
   * @param {String} key
   */
  Storage.prototype.remove = function(key) {
    delete this.data[key];
    this.storage[this.identifier] = angular.toJson(this.data);
  };

  /**
   *
   */
  Storage.prototype.clearAll = function() {
    this.storage[this.identifier] = angular.toJson(this.data = {});
  };

  return {
    /**
     * @param {String} identifier
     * @param {Storage} storage
     * @returns {actinium.providers.storage.Storage}
     */
    create : function(identifier, storage) {
      return new Storage(identifier, storage);
    }
  };
})
/**
 * @ngdoc provider
 * @name actinium.providers.storage:localStorageProvider
 * @requires $window
 * @requires actinium.providers.storage:storageImplements
 **/
.provider('localStorage', function() {
  var identifier = 'actinium';
  this.$get = ['$window', 'storageImplements', function($window, storageImplements) {
    var storage;
    try {
      storage = $window.localStorage;
    } catch (e) {
      storage = {};
    }
    return storageImplements.create(identifier, storage);
  }];

  this.setIdentifier = function(key) {
    identifier = key;
  };

})
/**
 * @ngdoc provider
 * @name actinium.providers.storage:sessionStorageProvider
 * @requires $window
 * @requires actinium.providers.storage:storageImplements
 **/
.provider('sessionStorage', function() {
  var identifier = 'actinium';

  this.$get = ['$window', 'storageImplements', function($window, storageImplements) {
    var storage;
    try {
      storage = $window.sessionStorage;
    } catch (e) {
      storage = {};
    }
    return storageImplements.create(identifier, storage);
  }];

  this.setIdentifier = function(key) {
    identifier = key;
  };

});
