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
      var customerIds, customerTypes;
      if (angular.equals(newVal, oldVal) && angular.isDefined(oldVal)) {
        return;
      }
      if (newVal.length < 2) {
        return;
      }
      customerTypes = [];
      customerIds = [];
      angular.forEach(newVal, function(option) {
        option.customer.unique = !~customerIds.indexOf(option.customer.id) && !~customerTypes.indexOf(option.customer.type);
        customerIds.push(option.customer.id);
        return customerTypes.push(option.customer.type);
      });
      return $timeout(function() {
        return $rootScope.$broadcast("revalidateField", "unique[]");
      }, 100);
    }, true);
  }
]);
