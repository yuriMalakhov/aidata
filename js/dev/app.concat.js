/* createApp.js begin */
// Generated by CoffeeScript 1.8.0
angular.module('app', ['ui.grid', 'ui.grid.edit', 'ui.grid.autoResize', 'ui.grid.resizeColumns', 'ui.grid.moveColumns', 'ui.grid.saveState', 'ui.grid.selection', 'ui.grid.exporter', 'ui.grid.pinning', 'ui.bootstrap']).config([
  '$interpolateProvider', function($interpolateProvider) {
    $interpolateProvider.startSymbol('[[');
    return $interpolateProvider.endSymbol(']]');
  }
]).run([
  '$rootScope', function($rootScope) {
    return $rootScope.preloading = {
      page: true
    };
  }
]);

/* createApp.js end */

/* MainController.js begin */
// Generated by CoffeeScript 1.8.0
angular.module('app').controller('MainController', [
  '$scope', '$rootScope', '$modal', '$window', function($scope, $rootScope, $modal, $window) {
    $rootScope.preloading.page = false;
    $scope.openModal = function(size, mode) {
      var modalInstance;
      modalInstance = $modal.open({
        templateUrl: 'modal.html',
        controller: 'ModalController',
        size: size,
        resolve: {
          items: function() {
            return $scope.items;
          }
        }
      });
      modalInstance.mode = mode;
      return modalInstance.result.then(function(selectedItem) {
        return $scope.selected = selectedItem;
      }, function() {
        console.info('Modal dismissed at  : ' + new Date());
        if (angular.isDefined($window.__postedPixel)) {
          delete $window.__postedPixel;
          return $rootScope.editedPixel = false;
        }
      });
    };
    if ($window.__user) {
      $rootScope.userName = $window.__user.company + ($window.__pixels.length + 1);
    }
    if (!$window.__pixels.length) {
      $scope.openModal('lg');
    }
    if (angular.isDefined($window.__postedPixel)) {
      $rootScope.editedPixel = $window.__postedPixel;
      return $scope.openModal('lg', 'edit');
    }
  }
]);

/* MainController.js end */

/* ModalController.js begin */
// Generated by CoffeeScript 1.8.0
angular.module('app').controller('ModalController', [
  '$scope', '$rootScope', '$modalInstance', '$window', '$timeout', function($scope, $rootScope, $modalInstance, $window, $timeout) {
    $scope.customers = $window.__customers;
    $scope.currencies = $window.__currencies;
    $scope.mode = $modalInstance.mode;
    $scope.modalTitle = "Create new pixel";
    $rootScope.pixels = {
      'edit': {},
      'create': {
        pixel_id: $rootScope.userName
      }
    };
    $rootScope.pixel = $rootScope.pixels[$scope.mode] || {};
    if ($scope.mode === 'edit') {
      $rootScope.pixel = $rootScope.editedPixel;
      $scope.modalTitle = "Edit '" + $rootScope.pixel.pixel_id + "' pixel";
    }
    $scope.defaultOption = {
      "new": 1,
      enabled: true,
      customer: {
        type: "google_ddp",
        id: ""
      },
      cpm: {
        currency: "USD",
        cost: ""
      }
    };
    $scope.getDefaultOption = function() {
      var defaultOption;
      defaultOption = angular.fromJson(angular.toJson($scope.defaultOption));
      return defaultOption;
    };
    $scope.pixelOptions = $rootScope.pixel.options || [];
    $scope.ok = function() {
      return $modalInstance.close();
    };
    $scope.cancel = function() {
      return $modalInstance.dismiss('cancel');
    };
    $scope.removeOption = function(index) {
      $scope.pixelOptions.splice(index, 1);
      return $rootScope.$broadcast("removeOption");
    };
    return $scope.$watch("pixelOptions", function(newVal, oldVal) {
      var customerOptions;
      if (angular.equals(newVal, oldVal) && angular.isDefined(oldVal)) {
        return;
      }
      if (newVal.length < 2) {
        return;
      }
      customerOptions = [];
      angular.forEach(newVal, function(option) {
        option.customer.unique = !~customerOptions.indexOf([option.customer.type, option.customer.id].join("."));
        return customerOptions.push([option.customer.type, option.customer.id].join("."));
      });
      return $timeout(function() {
        return $rootScope.$broadcast("revalidateField", "unique[]");
      }, 100);
    }, true);
  }
]);

/* ModalController.js end */

/* TableController.js begin */
// Generated by CoffeeScript 1.8.0
angular.module('app').controller('TableController', [
  '$scope', '$rootScope', '$filter', '$timeout', '$interpolate', '$window', 'ColumnsService', function($scope, $rootScope, $filter, $timeout, $interpolate, $window, ColumnsService) {
    var editPixelTooltip;
    $scope.gridScope = {};
    $scope.startSym = $interpolate.startSymbol();
    $scope.endSym = $interpolate.endSymbol();
    editPixelTooltip = "Select at least one pixel from the table.";
    $scope.editPixelTooltip = editPixelTooltip;
    $scope.preloading.page = false;
    return $scope.gridOptions = {
      saveScroll: false,
      saveFilter: false,
      saveFocus: false,
      saveRowIdentity: false,
      saveSelection: false,
      enableGridMenu: true,
      showGridFooter: false,
      showColumnFooter: false,
      multiSelect: false,
      data: $window.__pixels,
      columnDefs: ColumnsService,
      onRegisterApi: function(gridApi) {
        var count;
        $scope.gridApi = gridApi;
        count = $window.__pixels.length;
        if (count <= 50) {
          angular.element(document.getElementsByClassName('tablegrid_grid')[0]).css('height', count * 30 + 45 + 'px');
        } else {
          angular.element(document.getElementsByClassName('tablegrid_grid')[0]).css('height', 50 * 30 + 45 + 'px');
        }
        return gridApi.selection.on.rowSelectionChanged($scope, function(row) {
          var selectedRows;
          selectedRows = gridApi.selection.getSelectedGridRows();
          if (selectedRows.length) {
            $rootScope.editedPixel = selectedRows[0].entity;
            $scope.editPixelTooltip = "";
          } else {
            $rootScope.editedPixel = false;
            $scope.editPixelTooltip = editPixelTooltip;
          }
          return console.log("selectedRows: ", $rootScope.editedPixel);
        });
      }
    };
  }
]);

/* TableController.js end */

/* PreviewDirective.js begin */
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
          title: 'Should be inserted before closing &lt;/body&gt; tag',
          content: function() {
            var pixel_code, pixel_id;
            pixel_id = "";
            $rootScope.editedPixel && (pixel_id = $rootScope.editedPixel.pixel_id);
            pixel_code = "<script type=\"text/javascript\">\n  (function (document) {\n    var iframe = document.createElement('iframe'),\n      img = document.createElement(\"img\");\n    iframe.width = \"0\";\n    iframe.height = \"0\";\n    iframe.frameBorder = \"0\";\n    iframe.style.position = \"absolute\";\n    iframe.style.left = \"-9999px\";\n    iframe.onload = function () {\n      img.src=\"http://advombat.ru/0.gif?pid=" + pixel_id + "\";\n      iframe.contentDocument.body.appendChild(img);\n    };\n    document.body.appendChild(iframe);\n  })(window.document)\n</script>";
            return "<textarea class=\"form-control\" readonly rows=\"16\" onclick=\"this.focus();this.select()\">" + pixel_code + "</textarea>";
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

/* PreviewDirective.js end */

/* FormDirective.js begin */
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
              id: {
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
              name: {
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

/* FormDirective.js end */

/* СolumnsService.js begin */
// Generated by CoffeeScript 1.8.0
angular.module('app').factory('ColumnsService', function() {
  return [
    {
      field: 'pixel_id',
      displayName: 'Pixel ID',
      cellClass: 'to-left',
      headerCellClass: "to-left",
      minWidth: 100,
      width: "*"
    }, {
      field: 'status',
      displayName: 'Status',
      cellClass: 'to-left',
      headerCellClass: "to-left",
      minWidth: 100,
      width: "*"
    }, {
      field: 'name',
      displayName: 'Name',
      cellClass: 'to-left',
      headerCellClass: "to-left",
      minWidth: 100,
      width: "*"
    }, {
      field: 'size',
      displayName: 'Size',
      cellClass: 'to-right',
      headerCellClass: "center",
      cellFilter: 'number',
      minWidth: 100
    }, {
      field: 'updated',
      displayName: 'Updated',
      cellClass: 'center',
      headerCellClass: "center",
      cellFilter: 'date : "yyyy-MM-dd HH:mm"',
      minWidth: 100
    }, {
      field: 'created',
      displayName: 'Created',
      cellClass: 'center',
      headerCellClass: "center",
      cellFilter: 'date : "yyyy-MM-dd HH:mm"',
      minWidth: 100
    }
  ];
});

/* СolumnsService.js end */

/* bootstrapApp.js begin */
// Generated by CoffeeScript 1.8.0
angular.bootstrap(document, ['app']);

/* bootstrapApp.js end */
