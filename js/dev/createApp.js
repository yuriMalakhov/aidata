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
