// Generated by CoffeeScript 1.8.0
angular.module('app').controller('ModalController', [
  '$scope', '$rootScope', '$modalInstance', '$window', function($scope, $rootScope, $modalInstance, $window) {
    $scope.customers = $window.__customers;
    $scope.currencies = $window.__currencies;
    $scope.mode = $modalInstance.mode;
    $rootScope.pixel = $rootScope.pixel || {};
    if ($scope.mode === 'edit') {
      $rootScope.pixel = $rootScope.editedPixel;
    }
    $scope.defaultOption = {
      "new": 1,
      enabled: true,
      customer: {
        type: "1",
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
    $scope.pixelOptions = $rootScope.pixel.options || [$scope.getDefaultOption()];
    $scope.ok = function() {
      return $modalInstance.close();
    };
    return $scope.cancel = function() {
      return $modalInstance.dismiss('cancel');
    };
  }
]);
