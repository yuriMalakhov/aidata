/* createApp.js begin */
// Generated by CoffeeScript 1.8.0
angular.module('app', ['ui.slider', 'ui.grid', 'ui.grid.edit', 'ui.grid.autoResize', 'ui.grid.resizeColumns', 'ui.grid.moveColumns', 'ui.grid.saveState', 'ui.grid.selection', 'ui.grid.exporter', 'ui.grid.pinning', 'ui.bootstrap']).config([
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
  '$scope', '$rootScope', '$modal', '$window', '$http', '$q', function($scope, $rootScope, $modal, $window, $http, $q) {
    $rootScope.preloading.page = false;
    $scope.openModal = function(size, mode) {
      var deferred, modalInstance;
      switch (mode) {
        case 'create':
        case 'edit':
          modalInstance = $modal.open({
            templateUrl: 'modal.html',
            controller: 'ModalController',
            size: size
          });
          modalInstance.mode = mode;
          break;
        case 'segments':
          $rootScope.preloading.page = true;
          deferred = $q.defer();
          $http.get("pixel/" + $rootScope.editedPixel.id + "/affinity").success(function(response) {
            return deferred.resolve(response);
          }).error(function(response) {
            return deferred.resolve({
              status: 'error',
              data: response
            });
          });
          modalInstance = $modal.open({
            templateUrl: 'modal__segments.html',
            controller: 'ModalSegmentsController',
            size: size,
            resolve: {
              segments: function() {
                return deferred.promise;
              }
            }
          });
      }
      return modalInstance.result.then(function(result) {
        return $scope.result = result;
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
      $scope.openModal('lg', 'create');
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
        type: "google_dbm",
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

/* ModalSegmentsController.js begin */
// Generated by CoffeeScript 1.8.0
angular.module('app').controller('ModalSegmentsController', [
  '$scope', '$rootScope', '$modalInstance', 'segments', function($scope, $rootScope, $modalInstance, segments) {
    var message;
    $rootScope.preloading.page = false;
    $scope.modalTitle = "Recommended Segments for '" + $rootScope.editedPixel.pixel_id + "' pixel";
    console.info("Segments to show: ", segments);
    message = "Unknown error occured when requesting segments!";
    if (segments.status === 'success') {
      $scope.segments = segments.data;
      if (angular.isArray(segments.data) && !segments.data.length) {
        $scope.message = "No recommended segments found";
      }
    } else {
      $scope.message = segments.message || message;
    }
    $scope.ok = function() {
      return $modalInstance.close();
    };
    return $scope.cancel = function() {
      return $modalInstance.dismiss('cancel');
    };
  }
]);

/* ModalSegmentsController.js end */

/* TableController.js begin */
// Generated by CoffeeScript 1.8.0
angular.module('app').controller('TableController', [
  '$scope', '$rootScope', '$filter', '$timeout', '$interpolate', '$window', 'ColumnsService', function($scope, $rootScope, $filter, $timeout, $interpolate, $window, ColumnsService) {
    var date, editPixelTooltip;
    $scope.gridScope = {};
    $scope.startSym = $interpolate.startSymbol();
    $scope.endSym = $interpolate.endSymbol();
    editPixelTooltip = "Select at least one pixel from the table.";
    date = new Date();
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
      exporterCsvColumnSeparator: ';',
      exporterCsvFilename: "pixels_(" + (date.toISOString()) + ").csv",
      exporterFieldCallback: function(grid, row, col, value) {
        if (col.name === 'updated' || col.name === 'created') {
          value = $filter('date')(value, "yyyy-MM-dd HH:mm");
        }
        if (col.name === 'total_cost') {
          value = $filter('number')(value);
        }
        return value;
      },
      data: $window.__pixels,
      columnDefs: ColumnsService,
      onRegisterApi: function(gridApi) {
        var count;
        $window.gridApi = $scope.gridApi = gridApi;
        count = $window.__pixels.length;
        if (count <= 50) {
          angular.element(document.getElementsByClassName('tablegrid_grid')[0]).css('height', count * 30 + 45 + 'px');
        } else {
          angular.element(document.getElementsByClassName('tablegrid_grid')[0]).css('height', 50 * 30 + 45 + 'px');
        }
        $timeout(function() {
          return angular.element(document.getElementsByClassName('ui-grid-canvas')[1]).css('height', 'auto');
        }, 100);
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
  '$rootScope', '$window', function($rootScope, $window) {
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
            pixel_code_website = "<script type=\"text/javascript\">\n  (function (window, document) {\n    var iframe = document.createElement('iframe'),\n      img = document.createElement(\"img\"),\n      httpReferer = window.encodeURIComponent(window.location.href);\n    iframe.width = \"0\";\n    iframe.height = \"0\";\n    iframe.frameBorder = \"0\";\n    iframe.style.position = \"absolute\";\n    iframe.style.left = \"-9999px\";\n    iframe.onload = function () {\n      img.src=\"http://advombat.ru/0.gif?pid=" + pixel_id + "&id=\" + httpReferer;\n      iframe.contentDocument.body.appendChild(img);\n    };\n    document.body.appendChild(iframe);\n  })(window, window.document)\n</script>";
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

/* PreviewDirective.js end */

/* LookalikeDirective.js begin */
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
            return $compile("<span>Set your look-a-like audience based on \'[[editedPixel.pixel_id]]\' pixel!</span>")($rootScope);
          },
          content: function() {
            var pixel_id;
            pixel_id = "";
            $rootScope.editedPixel && (pixel_id = $rootScope.editedPixel.id);
            return $compile("<div class=\"audience\" style=\"width:791px;\">\n  <p class=\"alert alert-success\">\n    Size range is based on the total audience. Smaller audiences most closely match your source audience.\n    Creating a larger audience increases your potential reach, but reduces the level of similarity to your source.\n  </p>\n  <hr/>\n  <div class=\"audience-setter\">\n    <div class=\"slider_wrapper\">\n      <div class=\"slider_title slider_title__low\">Reach</div>\n      <div class=\"slider_content\">\n        <div ui-slider=\"{orientation: 'horizontal', range: 'min'}\"  min=\"0\" max=\"100\" step=\"5\" ng-model=\"lookalikePercent\"></div>\n      </div>\n      <div class=\"slider_title slider_title__high\">Similarity</div>\n    </div>\n    <hr/>\n    <div class=\"clearfix\">\n      <div class=\"selected-size\"><span class=\"selected-size-title\">Selected value: </span><span class=\"selected-size-value\">[[lookalikePercent]]%</span></div>\n      <div class=\"selected-btn\">\n        <button class=\"btn btn-block btn-primary\" ng-click=\"createLookalike(lookalikePercent, '" + pixel_id + "')\">Create new look-a-like audience</button>\n      </div>\n    </div>\n    <div class=\"lookalike-error\" ng-show=\"lookalikeMessage\">\n      <p class=\"alert alert-warning\" ng-bind=\"lookalikeMessage\"></p>\n    </div>\n  </div>\n</div>")(scope);
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

/* LookalikeDirective.js end */

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

/* FormDirective.js end */

/* ColumnsService.js begin */
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
      field: 'type',
      displayName: 'Type',
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
      field: 'total_impressions',
      displayName: 'Impressions',
      cellClass: 'to-right',
      headerCellClass: "center",
      cellFilter: 'number',
      minWidth: 100
    }, {
      field: 'total_cost',
      displayName: 'Cost',
      cellClass: 'to-right',
      headerCellClass: "center",
      cellFilter: "currency: 2: row.entity.currency",
      minWidth: 100
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

/* ColumnsService.js end */

/* filters.js begin */
// Generated by CoffeeScript 1.8.0
angular.module('app').filter('currency', function() {
  var map;
  map = {
    "ALL": "L",
    "AFN": "؋",
    "ARS": "$",
    "AWG": "ƒ",
    "AUD": "$",
    "AZN": "₼",
    "BSD": "$",
    "BBD": "$",
    "BYR": "p.",
    "BZD": "BZ$",
    "BMD": "$",
    "BOB": "Bs.",
    "BAM": "KM",
    "BWP": "P",
    "BGN": "лв",
    "BRL": "R$",
    "BND": "$",
    "KHR": "៛",
    "CAD": "$",
    "KYD": "$",
    "CLP": "$",
    "CNY": "¥",
    "COP": "$",
    "CRC": "₡",
    "HRK": "kn",
    "CUP": "₱",
    "CZK": "Kč",
    "DKK": "kr",
    "DOP": "RD$",
    "XCD": "$",
    "EGP": "£",
    "SVC": "$",
    "EEK": "kr",
    "EUR": "€",
    "FKP": "£",
    "FJD": "$",
    "GHC": "¢",
    "GIP": "£",
    "GTQ": "Q",
    "GGP": "£",
    "GYD": "$",
    "HNL": "L",
    "HKD": "$",
    "HUF": "Ft",
    "ISK": "kr",
    "INR": "₹",
    "IDR": "Rp",
    "IRR": "﷼",
    "IMP": "£",
    "ILS": "₪",
    "JMD": "J$",
    "JPY": "¥",
    "JEP": "£",
    "KES": "KSh",
    "KZT": "лв",
    "KPW": "₩",
    "KRW": "₩",
    "KGS": "лв",
    "LAK": "₭",
    "LVL": "Ls",
    "LBP": "£",
    "LRD": "$",
    "LTL": "Lt",
    "MKD": "ден",
    "MYR": "RM",
    "MUR": "₨",
    "MXN": "$",
    "MNT": "₮",
    "MZN": "MT",
    "NAD": "$",
    "NPR": "₨",
    "ANG": "ƒ",
    "NZD": "$",
    "NIO": "C$",
    "NGN": "₦",
    "NOK": "kr",
    "OMR": "﷼",
    "PKR": "₨",
    "PAB": "B/.",
    "PYG": "Gs",
    "PEN": "S/.",
    "PHP": "₱",
    "PLN": "zł",
    "QAR": "﷼",
    "RON": "lei",
    "RUB": "р",
    "SHP": "£",
    "SAR": "﷼",
    "RSD": "Дин.",
    "SCR": "₨",
    "SGD": "$",
    "SBD": "$",
    "SOS": "S",
    "ZAR": "R",
    "LKR": "₨",
    "SEK": "kr",
    "CHF": "Fr.",
    "SRD": "$",
    "SYP": "£",
    "TZS": "TSh",
    "TWD": "NT$",
    "THB": "฿",
    "TTD": "TT$",
    "TRY": "",
    "TRL": "₤",
    "TVD": "$",
    "UGX": "USh",
    "UAH": "₴",
    "GBP": "£",
    "USD": "$",
    "UYU": "$U",
    "UZS": "лв",
    "VEF": "Bs",
    "VND": "₫",
    "YER": "﷼",
    "ZWD": "Z$"
  };
  return function(input, num, postfix) {
    if (num == null) {
      num = 2;
    }
    if (postfix == null) {
      postfix = 'USD';
    }
    postfix = map[postfix] || '$';
    if (!input) {
      return 0 + ' ' + postfix;
    }
    if (parseFloat(input)) {
      return jQuery.number(input, num, ',', ' ') + ' ' + postfix;
    }
  };
}).filter('number', function() {
  return function(input, row, name) {
    var matches, patternStr;
    patternStr = '((\d+(\.|\,)\d*)|\d+)';
    input += "";
    matches = input.match(/((\d+(\.|\,)\d*)|\d+)/g);
    if (matches === null) {
      return input;
    }
    return input.replace(/[^((\d+(\.|\,)\d*)|\d+)]/g, '').replace(/((\d+(\.|\,)\d*)|\d+)/g, function(str, match1, match2, match3) {
      var res;
      str = str.replace(match3, '.');
      res = jQuery.number(str, (angular.isDefined(match3) ? 2 : 0), ',', ' ');
      return res;
    });
  };
});

/* filters.js end */

/* bootstrapApp.js begin */
// Generated by CoffeeScript 1.8.0
angular.bootstrap(document, ['app']);

/* bootstrapApp.js end */

