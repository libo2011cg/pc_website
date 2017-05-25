
App.controller("toIndexCtrl", [
    "$scope",
    "apiService",
    "$cookies",
    function ($scope, apiService, $cookies) {
        window.location.href = 'views/index.html';
    }
]);
