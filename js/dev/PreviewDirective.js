// Generated by CoffeeScript 1.8.0
angular.module('app').directive("tablecontrolPreview", [
  '$rootScope', '$timeout', function($rootScope, $timeout) {
    return {
      restrict: "CA",
      link: function(scope, elm, attrs) {
        var onClick;
        elm.popover({
          html: true,
          container: 'body',
          content: function() {
            var pixel_code, pixel_id;
            pixel_id = "";
            $rootScope.editedPixel && (pixel_id = $rootScope.editedPixel.pixel_id);
            pixel_code = "<script type=\"text/javascript\">\n  (function (document) {\n    var iframe = document.createElement('iframe'),\n      img = document.createElement(\"img\");\n    iframe.width = \"0\";\n    iframe.height = \"0\";\n    iframe.onload = function () {\n      img.src=\"http://advombat.ru/0.gif?pid=" + pixel_id + "\";\n      iframe.contentDocument.body.appendChild(img);\n    };\n    document.body.appendChild(iframe);\n  })(window.document)\n</script>";
            return "<textarea class=\"form-control\" readonly onclick=\"this.focus();this.select()\">" + pixel_code + "</textarea>";
          },
          placement: 'right',
          trigger: 'click'
        });
        onClick = function(e) {
          if (!jQuery(e.target).parents(".popover").length) {
            return elm.popover("hide");
          }
        };
        elm.on("shown.bs.popover", function() {
          return jQuery("body").bind("click", onClick);
        });
        return elm.on("hidden.bs.popover", function() {
          return jQuery("body").unbind("click");
        });
      }
    };
  }
]);
