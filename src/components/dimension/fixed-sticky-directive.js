'use strict';

/**
 * @ngdoc directive
 * @name actinium.components.dimension:fixedSticky
 * @restrict A
 *
 * @element ANY
 *
 * @priority 0
 * @requires $window
 * @requires $document
 *
 * @see https://github.com/ahomu/jquery.ah-adjustfixed
 * @description
 * すごい昔のjQueryプラギーン移植。初期化時の絶対座標を反映しつつ、該当要素をbody直下の子要素としてfixedします。
 *
 * ```html
 * <div id="fixed-sidebar" fixed-sticky>
 * ```
 **/
angular
.module('actinium.components.dimension')
.directive('fixedSticky', ['$window', '$document', function($window, $document) {

  var _directive =  {
    restrict : 'A',
    scope    : true,
    link     : _link
  };

  /**
   * @param {Element} elm
   * @returns {Object}
   */
  function elAbsRectPos(elm) {
    var rect = elm.getBoundingClientRect();

    return {
      top    : parseInt(rect.top, 10) + getPageYOffset(),
      bottom : parseInt(rect.bottom, 10),
      left   : parseInt(rect.left, 10),
      right  : parseInt(rect.right, 100),
      width  : rect.width  || (rect.right  - rect.left),
      height : rect.height || (rect.bottom - rect.top)
    };
  }

  /**
   * @returns {Number}
   */
  var getPageYOffset;
  if ('pageYOffset' in $window) {
    getPageYOffset = function() {
      return $window.pageYOffset;
    };
  } else if ('documentElement' in $document) {
    getPageYOffset = function() {
      return $document.documentElement.scrollTop;
    };
  } else {
    getPageYOffset = function() {
      return $document.body;
    };
  }

  function _link(scope, element, attrs) {

    var $box           = element,
        $parent        = $box.parent(),
        showOnlySticky = attrs.showOnlySticky === 'true',
        boxAbs         = elAbsRectPos($box[0]),
        boxAbsTop      = boxAbs.top,
        boxAbsLeft     = boxAbs.left,
        marginLeft     = parseInt($box.css('margin-left')) || 0,
        parentAbs      = elAbsRectPos($parent[0]),
        parentAbsLeft  = parentAbs.left,
        parentAbsDiff  = 0,
        boxLiveLeft    = boxAbsLeft - marginLeft,
        lastPoint;

    $window.addEventListener('scroll', watcher);
    $window.addEventListener('resize', resizer);

    scope.$on('$destroy', function() {
      $window.removeEventListener('scroll', watcher);
      $window.removeEventListener('resize', resizer);
    });

    document.body.appendChild($box[0]);
    watcher();

    function resizer() {
      parentAbs     = elAbsRectPos($parent[0]);
      parentAbsDiff = parentAbs.left - parentAbsLeft;
      parentAbsLeft = parentAbs.left;
      boxLiveLeft   = parseInt($box.css('left')) + parentAbsDiff;
      $box.css('left', boxLiveLeft + 'px');
    }

    function watcher() {
      var pageScroll = getPageYOffset(),
          styles;

      // ネガティブスクロールには反応させない(Safari5.1など)
      if (pageScroll < 0) {
        return;
      }

      if (boxAbsTop > pageScroll) {
        // スクロール量が，絶対位置に満たないとき
        if (showOnlySticky) {
          $box.addClass('is-invisible-rect');
        }
        styles = {
          position  : 'absolute',
          top       : boxAbsTop + 'px',
          left      : boxLiveLeft + 'px',
          marginTop : 0
        };
      } else {
        // その他の中間位置の場所調整
        if (showOnlySticky) {
          $box.removeClass('is-invisible-rect');
        }
        styles = {
          position  : 'fixed',
          top       : 0,
          left      : boxLiveLeft + 'px',
          marginTop : '10px'
        };
      }

      if ( lastPoint !== styles.top ) {
        $box.css(styles);
      }

      lastPoint = styles.top;
    }
  }

  return _directive;
}]);
