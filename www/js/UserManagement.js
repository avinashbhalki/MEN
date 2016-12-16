
var UserMgmtController = function UserMgmtController($scope, $rootScope, $element, $http, $location, $state, $timeout, $q, $log, $anchorScroll, $location) {
    $location.hash('go');
    $anchorScroll();
    
    $scope.showLoader = false;
    
    $scope.firstName = "Avinash";
    $scope.lastName = "Bhalki";
    $scope.emailID = "avinash207@gmail.com";
    $scope.password = "1234";
    $scope.mobileNo = "9989868689";
    $scope.address = "India";
        
    $scope.goRegistration = function() {
        
        console.log("Go Registration");
        
        var registrationData = {
            MagazineID: 1,
            UserName: $scope.emailID,
            Password: $scope.password,
            Firstname: $scope.firstName,
            Lastname: $scope.lastName,
            EmailId: $scope.emailID,
            Mobile: $scope.mobileNo,
            Address: $scope.address
        }
        
        $scope.showLoader = true;
        
        ///////////
        return checkConnection()
        .then(function(result)
        {
              console.log("Internet Connection Success: " + JSON.stringify(registrationData) + "\n URL: " + getRegistrationURL());
              
              $http.post(getRegistrationURL(), registrationData)
              .success(function(response)
                {
                       console.log("Response: " + JSON.stringify(response));
                       
                       if(response != null && response != "")
                       {
                           //Keyboard.hide();
                            console.log("Success");
                       
                            $scope.showLoader = false;
                            
                       
                            if(response.Status === "Failure")
                            {
                                //$scope.showLoader = false;
                                navigator.notification.alert(
                                                    response.StatusMessage,  // message
                                                    null,         // callback
                                                    'Registration Error!',            // title
                                                    'Ok'                  // buttonName
                                                    );
                            }
                            else
                            {
                                console.log("Payment Initiated");
                                
                                storage_saveObject("Token", response.access_token);
                       
                                // single payment
                                PayPalMobile.renderSinglePaymentUI(paypalApp.createPayment(), paypalApp.onSuccesfulPayment,
                                                          paypalApp.onUserCanceled);
                            }
                       }
                       else
                       {
                            $scope.showLoader = false;
                            navigator.notification.alert(
                                                    'Username or Password incorrect!',  // message
                                                    null,         // callback
                                                    'Login Error!',            // title
                                                    'Ok'                  // buttonName
                                                    );
                       }
                       
                })
              .error(function(error)
                {
                     $scope.showLoader = false;
                     console.log("Error: " + JSON.stringify(error));
                });
            
              
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
        
    };
    
    
    $scope.goLogin = function() {
        
        console.log("On Login Clicked");
        
        $scope.showLoader = true;
        
        ///////////
        return checkConnection()
        .then(function(result)
        {
              console.log("Internet Connection Success:");
    /*        var req = {
                method: 'POST',
                url: 'http://example.com',
                headers: {
                    'Content-Type': undefined
                },
                data: { test: 'test' }
            }
            */
              
              $scope.loginEmail = "avinash207@gmail.com";
              $scope.loginPassword = "1234";
              
              
              var loginData = "username=" + $scope.loginEmail + "&password=" + $scope.loginPassword + "& grant_type=password&magazineid=1";
              
              console.log("Token URL: " + getTokenURL() + "\nLogin Data: " + loginData);
            
            
              $http.post(getTokenURL(), loginData)
              .success(function(response)
                {
                       console.log("Response: " + JSON.stringify(response));
                       
                       if(response != null && response != "")
                       {
                           
                           storage_saveObject("Token", response.access_token);
                           
                           //Keyboard.hide();
                            console.log("Success");
                       
                            $scope.showLoader = false;
                            //$state.go('page.3');
                       
                            if(response.Status === "Failure" &&  response.StatusMessage === "Invalid username or password")
                            {
                                //$scope.showLoader = false;
                                navigator.notification.alert(
                                                    response.StatusMessage,  // message
                                                    null,         // callback
                                                    'Login Error!',            // title
                                                    'Ok'                  // buttonName
                                                    );
                            }
                            else if(response.Status === "Failure")
                            {
                       
                                //$scope.showLoader = false;
                                navigator.notification.confirm(
                                                    response.StatusMessage,  // message
                                                    function(buttonIndex) {
                                                        console.log("After hi..." + buttonIndex);
                                                        if(buttonIndex === 2)
                                                        {
                                                            //single payment
                                                            console.log("Payment Initiated");
                                                            PayPalMobile.renderSinglePaymentUI(paypalApp.createPayment(), paypalApp.onSuccesfulPayment, paypalApp.onUserCanceled);
                                                        }
                                                    },         // callback
                                                    'Login Error!',            // title
                                                    ['Ok','Buy Now $2.99']                  // buttonName
                                );
                       
                       
                            }
                           else
                           {
                                $scope.showLoader = false;
                                $state.go('page.3');
                           }
                       }
                       else
                       {
                            $scope.showLoader = false;
                            navigator.notification.alert(
                                                    'Username or Password incorrect!',  // message
                                                    null,         // callback
                                                    'Login Error!',            // title
                                                    'Ok'                  // buttonName
                                                    );
                       }
                       
                })
              .error(function(error)
                {
                     $scope.showLoader = false;
                     console.log("Error: " + JSON.stringify(error));
                });
            
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
    };
    
    
    
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    var paypalApp = {


        initPaymentUI: function() {
            var clientIDs = {
                "PayPalEnvironmentProduction": "YOUR_PRODUCTION_CLIENT_ID",
//                "PayPalEnvironmentSandbox": "AV8wTA_1DqyM3HkKa-PW8zQGjS-MLFD2qg4gi1f3wphrEF1552MseI6d2NJsleEMqe--WmVTz7Ien4KY"
                  "PayPalEnvironmentSandbox": "AuoAPN8UmPvnCOnrRwsQSwe4OuKQAvbfMfD3XCZZ6FLXdhv11m.zoCoQ"
            };
            PayPalMobile.init(clientIDs, app.onPayPalMobileInit);

        },
        onSuccesfulPayment: function(payment) {
            console.log("payment success: " + JSON.stringify(payment, null, 4));
            console.log("Payment ID: " + payment.response.id);
            
                    ///////////
        return checkConnection()
        .then(function(result)
        {
              console.log("Internet Connection Success:");
              
              $scope.showLoader = true;
 
              var subscriptionData = {
                  Magazine_ID: 1,
                  PayPalRefID: payment.response.id
              };
              
              console.log("Token URL: " + getSubscriptionURL() + "\nLogin Data: " + JSON.stringify(subscriptionData) + "\n Token: " + storage_loadObject("Token"));
              var token = 'bearer ' + storage_loadObject("Token");
            
              $http.post(getSubscriptionURL(), subscriptionData, { headers: { 'Authorization': token}})
              .success(function(response)
                {
                       console.log("Response: " + JSON.stringify(response));
                        $scope.showLoader = false;
                        $state.go('page.3');
                })
              .error(function(error)
                {
                     $scope.showLoader = false;
                     console.log("Error: " + JSON.stringify(error));
                });
            
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
            
            
            
        },
        onAuthorizationCallback: function(authorization) {
            console.log("authorization: " + JSON.stringify(authorization, null, 4));
            alert("Payment Failed");
        },
        createPayment: function() {
            // for simplicity use predefined amount
            var paymentDetails = new PayPalPaymentDetails("2.99", "0.00", "0.00");
            var payment = new PayPalPayment("2.99", "USD", "Mother Earth News", "Sale",
                                            paymentDetails);
            return payment;
        },
        configuration: function() {
            // for more options see `paypal-mobile-js-helper.js`
            var config = new PayPalConfiguration({
                                                 merchantName: "MEN",
                                                 merchantPrivacyPolicyURL: "https://mytestshop.com/policy",
                                                 merchantUserAgreementURL: "https://mytestshop.com/agreement"
                                                 });
            return config;
        },
        onPayPalMobileInit: function() {
            // must be called
            // use PayPalEnvironmentNoNetwork mode to get look and feel of the flow
            PayPalMobile.prepareToRender("PayPalEnvironmentNoNetwork", paypalApp.configuration(),
                                         paypalApp.onPrepareRender);
        },
        onUserCanceled: function(result) {
            console.log("User Cancelled: " + result);
            
            navigator.notification.alert(
                                         'Payment Cancelled. Your account has not been charged',  // message
                                         null,                  // callback
                                         'Payment Cancelled!',            // title
                                         'Ok'                   // buttonName
                                         );
        }
    };
    
    
    
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
}


paypalApp.initPaymentUI();



