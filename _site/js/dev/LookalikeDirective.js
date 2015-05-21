// Generated by CoffeeScript 1.8.0
angular.module('app').directive("tablecontrolLookalike", [
  '$rootScope', '$compile', '$http', '$timeout', function($rootScope, $compile, $http, $timeout) {
    return {
      restrict: "CA",
      link: function(scope, elm, attrs) {
        var onClick;
        scope.lookalikePercent = 0;
        scope.createLookalike = function(percent, pixel_id) {
          return $http({
            url: "/pixel/" + pixel_id + "/lookalike/",
            method: "POST",
            data: jQuery.param({
              percent: percent
            }),
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            }
          }).success(function(response) {
            console.info("Should reload page! Response: ", response);
            if (response.status === "success") {
              window.location.reload();
              return scope.lookalikeMessage = "";
            } else {
              return scope.lookalikeMessage = response.message || "Sorry, some error occured! Please, try again.";
            }
          }).error(function(response) {
            console.warn("Should show message! Response: ", response);
            return scope.lookalikeMessage = response.message || "Sorry, some error occured! Please, try again.";
          });
        };
        elm.popover({
          html: true,
          container: 'body',
          title: function() {
            return $compile("<span>Set your look-a-like audience based on \'[[editedPixel.id]]\'!</span>")($rootScope);
          },
          content: function() {
            var pixel_id;
            pixel_id = "";
            $rootScope.editedPixel && (pixel_id = $rootScope.editedPixel.id);
            return $compile("<div class=\"audience\" width=\"800px\">\n  <p class=\"alert alert-success\">\n    Size range is based on the total audience. Smaller audiences most closely match your source audience.\n    Creating a larger audience increases your potential reach, but reduces the level of similarity to your source.\n  </p>\n  <hr/>\n  <div class=\"audience-setter\">\n    <div class=\"slider_wrapper\">\n      <div class=\"slider_title slider_title__low\">Reach</div>\n      <div class=\"slider_content\">\n        <div ui-slider=\"{orientation: 'horizontal', range: 'min'}\"  min=\"0\" max=\"100\" step=\"5\" ng-model=\"lookalikePercent\"></div>\n      </div>\n      <div class=\"slider_title slider_title__high\">Similarity</div>\n    </div>\n    <hr/>\n    <div class=\"clearfix\">\n      <div class=\"selected-size\"><span class=\"selected-size-title\">Selected value: </span><span class=\"selected-size-value\">[[lookalikePercent]]%</span></div>\n      <div class=\"selected-btn\">\n        <button class=\"btn btn-block btn-primary\" ng-click=\"createLookalike(lookalikePercent, '" + pixel_id + "')\">Create new look-a-like audience</button>\n      </div>\n    </div>\n    <div class=\"lookalike-error\" ng-show=\"lookalikeMessage\">\n      <p class=\"alert alert-warning\" ng-bind=\"lookalikeMessage\"></p>\n    </div>\n  </div>\n</div>")(scope);
          },
          placement: 'bottom',
          trigger: 'click'
        });
        onClick = function(e) {
          if (!jQuery(e.target).parents(".popover").length) {
            return elm.popover("hide");
          }
        };
        elm.on("shown.bs.popover", function() {
          $timeout(function() {
            return scope.$apply(function() {
              return scope.lookalikeMessage = "";
            });
          });
          return jQuery("body").bind("click", onClick);
        });
        return elm.on("hidden.bs.popover", function() {
          return jQuery("body").unbind("click");
        });
      }
    };
  }
]);
