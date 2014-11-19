var mockapp = angular.module('mockapp', [
    'module.one',
    'module.two',
    'module.three',
    'mockapp.mocked'
]);
mockapp.mocked = angular.module('mockapp.mocked', []);