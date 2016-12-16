
var ArticleDescController = function ArticleDescController($scope, $rootScope, $element, $http, $location, $state, $timeout, $q, $log, $anchorScroll, $location) {
    $location.hash('go');
    $anchorScroll();
    
    $scope.showLoader = false;
    
        console.log("Go Registration");
        
        $scope.showLoader = true;
        
        ///////////
        return checkConnection()
        .then(function(result)
        {
             
            /////////////////////////////////////////
            
            var descriptionData = {
                  ArticleID: 15,
                  MagazineID: 1
              };
              
              console.log("Token URL: " + getdescriptionURL() + "\nLogin Data: " + JSON.stringify(descriptionData) + "\n Token: " + storage_loadObject("Token"));
              var token = 'bearer ' + storage_loadObject("Token");
            
              $http.post(getdescriptionURL(), descriptionData, { headers: { 'Authorization': token}})
              .success(function(response)
                {
                       
                        $scope.showLoader = false;
                  $scope.descriptionData = response.articlebody;
                       console.log("Response: " + $scope.descriptionData);
                        
                  
                })
              .error(function(error)
                {
                     $scope.showLoader = false;
                     console.log("Error: " + JSON.stringify(error));
                });
            
            //////////////////////////////////////////////////////////
            
              
        }
        , function (error)
        {
              console.log("Check Internet Connectivity" );
            
              $scope.showLoader = false;
              navigator.notification.alert(
                                           'Check Internet Connectivity',  // message
                                           null,                            // callback
                                           'Network Error!',            // title
                                           'Ok'                  // buttonName
                                           );
            
        });
        /////////////
        
    
    
    
  
    
}






