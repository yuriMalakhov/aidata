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
          title: 'Use these pixel code snippets',
          content: function() {
            var pixel_code_advertizing, pixel_code_website, pixel_id;
            pixel_id = "";
            $rootScope.editedPixel && (pixel_id = $rootScope.editedPixel.pixel_id);
            pixel_code_website = "<script type=\"text/javascript\">\n  (function (document) {\n    var iframe = document.createElement('iframe'),\n      img = document.createElement(\"img\");\n    iframe.width = \"0\";\n    iframe.height = \"0\";\n    iframe.frameBorder = \"0\";\n    iframe.style.position = \"absolute\";\n    iframe.style.left = \"-9999px\";\n    iframe.onload = function () {\n      img.src=\"http://advombat.ru/0.gif?pid=" + pixel_id + "\";\n      iframe.contentDocument.body.appendChild(img);\n    };\n    document.body.appendChild(iframe);\n  })(window.document)\n</script>";
            pixel_code_advertizing = "<img src=\"http://advombat.ru/0.gif?pid=" + pixel_id + "\" style=\"position: absolute; left: -9999px;\" />";
            return "<div style=\"width:500px;\">\n  <h5><u>For websites</u> (should be inserted before closing &lt;/body&gt; tag):</h5>\n  <textarea class=\"form-control\" readonly rows=\"16\" onclick=\"this.focus();this.select()\">" + pixel_code_website + "</textarea>\n  <h5><u>For banners</u>:</h5>\n  <textarea class=\"form-control\" readonly rows=\"2\" onclick=\"this.focus();this.select()\">" + pixel_code_advertizing + "</textarea>\n</div>";
          },
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
