app.controller("BasicSearch", [
    "$scope", "$rootScope", "dataFactory", "Pagination", function($scope, $rootScope, dataFactory, Pagination) {

		$scope.pageSize = 10;
		$scope.currentPage = 0;

        $scope.pagination = Pagination.getNew($scope.pageSize);
		
		$scope.ownerName = null;
		$scope.peopleName = null;
		$scope.holdingName = null;
		$scope.fromRent = null;
		$scope.toRent = null;


		$scope.queryResults = [];
		$scope.allResults = [];

		$scope.pagination.numPages = 0;

		$scope.loadingSpinner = false;
		
		jQuery.extend({
		  sliceMe: function(obj, str) {
			  var returnJsonObj = null;
			$.each( obj, function(name, value){
				//alert("name: "+name+", value: "+value);
				if(name==str){
					returnJsonObj = value;
				}

			});
			  return returnJsonObj;
		  }
		});

		$scope.peopleOptions = [];
		$scope.holdingOptions = [];
		$scope.ownerOptions = [];

		function onlyUnique(value, index, self) { 
			return self.indexOf(value) === index;
		}


		$scope.updatePagination=function(n){
			$scope.pagination.toPageId(n);
			$scope.currentPage = n;
		}
		

		$scope.numberOfPages=function(){
			return Math.ceil($scope.queryResults.length/$scope.pageSize);            
		}


		dataFactory.getSearchResults()
			.success(function(dataResults) {
				
				

				dataResults = $.sliceMe(dataResults,"wfs:FeatureCollection");
				dataResults = $.sliceMe(dataResults,"featureMember");
				
				$scope.allResults = dataResults;

				
				//get people drop down items
				for(j=0;j<$scope.allResults.length;j++) {

					index = -1;
					for(var i = 0, len = $scope.peopleOptions.length; i < len; i++) {
						if ($scope.peopleOptions[i].value === $scope.allResults[j].SMN.Popolo) {
							index = i;
							break;
						}
					}
					if(index ===-1)
						$scope.peopleOptions.push({ name: $scope.allResults[j].SMN.Popolo, value: $scope.allResults[j].SMN.Popolo });
				}
				$scope.peopleOptions.sort();

				//get holding drop down items
				for(j=0;j<$scope.allResults.length;j++) {

					index = -1;
					for(var i = 0, len = $scope.holdingOptions.length; i < len; i++) {
						if ($scope.holdingOptions[i].value === $scope.allResults[j].SMN.Holding_Ty) {
							index = i;
							break;
						}
					}
					if(index ===-1)
						$scope.holdingOptions.push({ name: $scope.allResults[j].SMN.Holding_Ty, value: $scope.allResults[j].SMN.Holding_Ty });
				}
				$scope.holdingOptions.sort();

				//get owner drop down items
				for(j=0;j<$scope.allResults.length;j++) {

					index = -1;
					for(var i = 0, len = $scope.ownerOptions.length; i < len; i++) {
						if ($scope.ownerOptions[i].value === $scope.allResults[j].SMN.Owner) {
							index = i;
							break;
						}
					}
					if(index ===-1)
						$scope.ownerOptions.push({ name: $scope.allResults[j].SMN.Owner, value: $scope.allResults[j].SMN.Owner });
				}
				$scope.ownerOptions.sort();


				




				
			})
			.error(function(error) {
				$scope.status = "Unable to load getCheckMultipleGenotypes: " + error.message;
			})
			.finally(function() {
				// Hide loading spinner whether our call succeeded or failed.
				$scope.loadingSpinner = false;
			});


		

		$scope.getSearchResults = function() {
			
			$scope.loadingSpinner = true;

			$scope.queryResults = [];
			var results = $scope.allResults;

			if ($scope.ownerName != null) {
				results = results.filter(function (item) {
				  return item.SMN.Owner === $scope.ownerName.value ;
				});
			}
			
			if ($scope.peopleName != null) {
				results = results.filter(function (item) {
				  return item.SMN.Popolo === $scope.peopleName.value ;
				});
			}
			
			if ($scope.holdingName != null) {
				results = results.filter(function (item) {
				  return item.SMN.Holding_Ty === $scope.holdingName.value ;
				});
			}

			if ($scope.fromRent != null && $scope.toRent != null) {
				results = results.filter(function (item) {
				  return parseInt(item.SMN.rents_lire) >= parseInt($scope.fromRent) && parseInt(item.SMN.rents_lire) <= parseInt($scope.toRent);
				});
			}

			$scope.queryResults = results;
			$("#searchresults").show();
			$scope.updatePagination(0);

            $scope.pagination.numPages = Math.ceil($scope.queryResults.length/$scope.pagination.perPage);
			$scope.loadingSpinner = false;

        };

		

		$scope.clearSearchControls = function() {
            $scope.queryResults = [];
			$scope.ownerName = null;
			$scope.peopleName = null;
			$scope.holdingName = null;
			$scope.fromRent = null;
			$scope.toRent = null;

			$scope.updatePagination(0);

			$("#searchresults").hide();
        };

    }
]);

