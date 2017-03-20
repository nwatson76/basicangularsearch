
var app = angular.module('basicsearch', ['simplePagination']);


//establish data factory to be used by all controllers
app.factory("dataFactory", [
    "$http", function ($http) {

        var urlBase = "";
        var dataFactory = {};

        //used to show all results
        dataFactory.getSearchResults = function () {
            return $http.get(urlBase + "data.json");
        };

        return dataFactory;
    }
]);