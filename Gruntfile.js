module.exports = function(grunt) {
  'use strict';

  var RE_USE_STRICT_STATEMENT = /(^|\n)[ \t]*'use strict';?\s*/g,
      RE_CONSOLE_METHODS      = /console.[\w]+\(.*?(\w*\(.*\))*\);/g,
      BANNER_TEMPLATE_STRING  = '/*! <%= pkg.name %> - v<%= pkg.version %>' +
        ' ( <%= grunt.template.today("yyyy-mm-dd") %> ) - <%= pkg.license %> */';

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    /**
     * Concatenation
     **/
    concat: {
      dist: {
        files: {
          'dist/actinium.js': [
            'src/providers/**/*.js',
            'src/components/**/*.js',
            'src/sections/**/*.js'
          ]
        },
        options: {
          process: function(content) {
            return content.replace(RE_USE_STRICT_STATEMENT, '$1').replace(RE_CONSOLE_METHODS, '');
          },
          stripBanners: false,
          banner: [BANNER_TEMPLATE_STRING,
            ';(function(window) {',
            '',
            '"use strict";',
            '',
            ''].join('\n'),
          footer: ['',
            '})(window);'].join('\n')
        }
      },
      debug: {
        files: {
          'dist/actinium.js': [
            'src/providers/**/*.js',
            'src/components/**/*.js',
            'src/sections/**/*.js'
          ]
        },
        options: {
          process: function(content) {
            return content.replace(RE_USE_STRICT_STATEMENT, '$1');
          },
          stripBanners: false,
          banner: [BANNER_TEMPLATE_STRING,
            ';(function(window) {',
            '',
            '"use strict";',
            '',
            ''].join('\n'),
          footer: ['',
            '})(window);'].join('\n')
        }
      }
    },
    /**
     * Scripts
     */
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      dist: {
        src: ['src/**/*.js']
      }
    },
    jscs: {
      options: {
        config: ".jscsrc"
      },
      dist: {
        src: ['src/**/*.js']
      }
    },
    uglify: {
      options: {
        report: 'min',
        preserveComments: 'some'
      },
      dist: {
        files: {
          'dist/actinium.min.js': ['dist/actinium.js']
        }
      }
    },
    /**
     * Developments
     */
    watch: {
      js: {
        files: [
          'src/**/*.js'
        ],
        tasks: ['concat:debug', 'jspreproc']
      },
      options: {
        spawn: false
      }
    },
    bump: {
      options: {
        files: ['package.json'],
        commit: false,
        push: false
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks("grunt-jscs-checker");
  grunt.loadNpmTasks("grunt-contrib-concat");
  grunt.loadNpmTasks("grunt-contrib-uglify");

  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-bump");

  /**
   * Scripts build
   */
  grunt.registerTask('jsbuild',     ['jspreproc', 'concat:dist', 'jspostproc']);
    grunt.registerTask('jspreproc',   ['jshint', 'jscs']);
    grunt.registerTask('jspostproc',  ['uglify']);

  /**
   * Fully build
   */
  grunt.registerTask('build', ['jsbuild']);
  grunt.registerTask('release', ['jsbuild', 'bump']);

};