// Karma configuration
// Generated on Fri Mar 14 2014 13:24:14 GMT+0900 (JST)

module.exports = function(config) {
  config.set({

    // base path, that will be used to resolve files and exclude
    basePath: '',


    // frameworks to use
    frameworks: ['mocha'],


    // list of files / patterns to load in the browser
    files: [
      {pattern: 'lib/angular/angular.js',     watched: false, included: true,  served: true},
      {pattern: 'lib/zepto/zepto.js',         watched: false, included: true,  served: true},
      {pattern: 'lib/angular-mocks/mocks.js', watched: false, included: true,  served: true},
      {pattern: 'lib/expect/index.js',        watched: false, included: true,  served: true},

      {pattern: 'src/providers/**/*.js',  watched: true, included: true, served: true},
      {pattern: 'src/components/**/*.js', watched: true, included: true, served: true},
      {pattern: 'src/sections/**/*.js',   watched: true, included: true, served: true},
      {pattern: 'test/**/*.js',           watched: true, included: true, served: true}
    ],


    // list of files to exclude
    exclude: [
      
    ],


    // test results reporter to use
    // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
    reporters: ['junit'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera (has to be installed with `npm install karma-opera-launcher`)
    // - Safari (only Mac; has to be installed with `npm install karma-safari-launcher`)
    // - PhantomJS
    // - IE (only Windows; has to be installed with `npm install karma-ie-launcher`)
    browsers: ['PhantomJS'/*, 'Chrome', 'Firefox'*/],


    // If browser does not capture in given timeout [ms], kill it
    captureTimeout: 60000,


    preprocessors: {
      'src/**/*.js': 'coverage'
    },
    // test results reporter to use
    // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
    reporters: ['progress', 'coverage'],
    coverageReporter: {
      type: 'html',
      dir : 'coverage/'
    },

    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false
  });
};
