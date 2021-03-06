// Generated by CoffeeScript 1.8.0
angular.module('app').directive("body", [
  function() {
    return {
      restrict: "E",
      link: function() {
        FormValidation.Validator.unique = {
          validate: function(validator, $field, options) {
            var value;
            value = $field.val();
            if (!value) {
              return true;
            }
            return value === "true";
          }
        };
        return FormValidation.Validator.server = {
          validate: function(validator, $field, options) {
            var pristine;
            pristine = $field.hasClass("ng-pristine");
            return {
              valid: !pristine,
              message: options.message
            };
          }
        };
      }
    };
  }
]).directive("pixelCreateForm", [
  '$rootScope', '$timeout', '$window', function($rootScope, $timeout, $window) {
    return {
      restrict: "CA",
      link: function(scope, elm, attrs) {
        var initValidation;
        initValidation = function() {
          return elm.formValidation({
            framework: 'bootstrap',
            icon: {
              valid: 'glyphicon glyphicon-ok',
              invalid: 'glyphicon glyphicon-remove',
              validating: 'glyphicon glyphicon-refresh'
            },
            button: {
              selector: '[type="submit"]',
              disabled: ''
            },
            fields: {
              pid: {
                validators: {
                  notEmpty: {
                    message: 'Pixel ID is required'
                  },
                  regexp: {
                    regexp: /^[\d|\w|\-|\_]*$/i,
                    message: 'Pixel ID can consist of alphabetical and digital characters as well ad "-" and "_" symbols only'
                  }
                }
              },
              description: {
                validators: {
                  notEmpty: {
                    message: 'Pixel Name is required'
                  },
                  stringLength: {
                    min: 3,
                    max: 255,
                    trim: true,
                    message: 'Pixel Name must be more then 3 and less than 255 characters'
                  }
                }
              },
              "unique[]": {
                excluded: false,
                validators: {
                  unique: {
                    enabled: true,
                    message: "Not allowed to share to the same customer id of the same type"
                  }
                }
              }
            }
          }).on('success.form.fv', function(e) {
            return $rootScope.pixel = {};
          });
        };
        $timeout(function() {
          initValidation();
          if (angular.isDefined($window.__postedPixel)) {
            elm.data('formValidation').validate();
          }
          return jQuery(".sharing-options_add").click(function() {
            $timeout(function() {
              var fields;
              fields = jQuery(".sharing-option").last().find(".form-control");
              return angular.forEach(fields, function(field) {
                return elm.data('formValidation').addField(jQuery(field));
              });
            }, 100);
            return jQuery('[type="submit"]').removeClass("disabled").removeAttr("disabled");
          });
        }, 100);
        scope.$on("removeOption", function() {
          return jQuery('[type="submit"]').removeClass("disabled").removeAttr("disabled");
        });
        return $rootScope.$on("revalidateField", function(e, name) {
          elm.formValidation('revalidateField', name);
          return elm.data('formValidation').validateField(name);
        });
      }
    };
  }
]).directive('noEdit', [
  '$timeout', function($timeout) {
    return {
      restrict: "A",
      scope: {
        noEdit: "="
      },
      link: function(scope, elm, attrs) {
        if (scope.noEdit) {
          return $timeout(function() {
            var height, position, veil, width;
            width = elm.outerWidth();
            height = elm.outerHeight();
            position = elm.position();
            veil = jQuery('<div class="no-edit_veil"></div>');
            veil.width(width).height(height).css({
              left: position.left,
              top: position.top
            });
            return elm.parent().append(veil);
          }, 200);
        }
      }
    };
  }
]);
