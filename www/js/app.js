

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError('Cannot call a class as a function');
    }
}


var MainController = function MainController($scope, $rootScope, $element, $q, forwardAnim, backwardAnim, $http, $location, $state, $timeout, $anchorScroll) {
  
    $location.hash('go');
    $anchorScroll();
    //alert("hii - 1");
    var _this3 = this;
    _classCallCheck(this, MainController);
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState) {
        var animated = $element.find('ui-view');
        animated.removeClass('scrolled');
        animated.removeClass('modal');
        var isForward = toState.name > fromState.name;
        if (isForward) {
            $element.removeClass('backward');
            _this3.anim = forwardAnim[toState.name];
        } else {
            $element.addClass('backward');
            _this3.anim = backwardAnim[toState.name];
        }
        animated.addClass(_this3.anim);
    });

		  function callAtTimeout() {
       
    }

		  $scope.gonNxt = function () {
		      $rootScope.header = true;
       // $timeout(callAtTimeout, 600);
        $state.go('page.2');
    }


    $scope.goArticle = function () {
        $state.go('page.3');
        $rootScope.signout = true;
    }

};


var searchController = function searchController($scope, $rootScope, $element, $http, $location, $state, $timeout, $q, $log, $anchorScroll) {
    $location.hash('go');
    $anchorScroll();

    $scope.articles = [
    "DIY",
    "Homesteading and Livestock",
    "Renewable Energy",
    "Green Homes",
    ];
    $scope.articleType = [
    "Full Articles",
    "Just Headlines",
    "All these words ",
    "This exact phrase",

    ]


    var self = this;

    self.simulateQuery = false;
    self.isDisabled = false;

    // list of `state` value/display objects
    self.states = loadAll();
    self.querySearch = querySearch;
    self.selectedItemChange = selectedItemChange;
    self.searchTextChange = searchTextChange;

    self.newState = newState;

    function newState(state) {
        alert("Sorry! You'll need to create a Constitution for " + state + " first!");
    }

    function querySearch(query) {
        var results = query ? self.states.filter(createFilterFor(query)) : self.states,
            deferred;
        if (self.simulateQuery) {
            deferred = $q.defer();
            $timeout(function () { deferred.resolve(results); }, Math.random() * 1000, false);
            return deferred.promise;
        } else {
            return results;
        }
    }

    function searchTextChange(text) {
        $log.info('Text changed to ' + text);
    }

    function selectedItemChange(item) {
        $log.info('Item changed to ' + JSON.stringify(item));
    }


    function loadAll() {
        var allStates = 'Alabama, Alaska, Arizona, Arkansas, California, Colorado, Connecticut, Delaware,\
              Florida, Georgia, Hawaii, Idaho, Illinois, Indiana, Iowa, Kansas, Kentucky, Louisiana,\
              Maine, Maryland, Massachusetts, Michigan, Minnesota, Mississippi, Missouri, Montana,\
              Nebraska, Nevada, New Hampshire, New Jersey, New Mexico, New York, North Carolina,\
              North Dakota, Ohio, Oklahoma, Oregon, Pennsylvania, Rhode Island, South Carolina,\
              South Dakota, Tennessee, Texas, Utah, Vermont, Virginia, Washington, West Virginia,\
              Wisconsin, Wyoming';

        return allStates.split(/, +/g).map(function (state) {
            return {
                value: state.toLowerCase(),
                display: state
            };
        });
    }


    function createFilterFor(query) {
        var lowercaseQuery = angular.lowercase(query);

        return function filterFn(state) {
            return (state.value.indexOf(lowercaseQuery) === 0);
        };

    }

    $scope.gosearch = function () {
        $rootScope.signout = false;
        $rootScope.home = true;
        $state.go('page.4');
    }

    $rootScope.goHome = function () {
        $rootScope.backBool = false;
        $rootScope.home = false;
        $rootScope.signout = true;
        $state.go('page.3');
    }

    $rootScope.gologin = function () {
        $state.go('page.2');
        $scope.btnClass = { mt57: true };
        $rootScope.signout = false;
        $rootScope.backBool = false;
        $rootScope.home = false;

    }
  
}

var listController = function listController($scope, $rootScope, $element, $http, $location, $state, $timeout, $q, $log, $anchorScroll) {

    $location.hash('go');
    $anchorScroll();
    $scope.articleList = [
    "Full Articles",
    "Just Headlines",
    "All these words ",
    "This exact phrase",
    "one",
    "one1",
    "one2",
    "one3",
    "one4",
    "one5",
    "one6",
    "one7",

    ];


    $scope.goToinfo = function (event) {
        $rootScope.home = false;
        $rootScope.backBool = true;
        $rootScope.signout = false;
        $state.go('page.5');

        $rootScope.backtoArticle = function () {
            $rootScope.signout = false;
            $rootScope.backBool = false;
            $rootScope.home = true;
            $state.go('page.4');
        }
    };
}
angular.module('scrollDemo', ['ui.router', 'ngAnimate', 'ngMaterial']).config(function($stateProvider) {

    $stateProvider.state('page', {
        template: '<ui-view class="page {{mainCtrl.anim}}"></ui-view>',
        url: '/page',
        controller: MainController,
        bindToController: true,
        controllerAs: 'mainCtrl'
    }).state('page.1', {
        url: '/page1',
        templateUrl: 'Page1.html'
    }).state('page.2', {
        url: '/page2',
        controller: UserMgmtController,
//        bindToController: false,
		templateUrl: 'Page2.html'
    }).state('page.3', {
        url: '/page3',
        controller: searchController,
        templateUrl: 'Page3.html',
        controllerAs: 'ctrl'
    }).state('page.4', {
        url: '/page4',
        controller: listController,
        templateUrl: 'Page4.html'
    }).state('page.5', {
        url: '/page5',
        controller: ArticleDescController,
        templateUrl: 'Page5.html'
    });
}).constant('forwardAnim', {
    'page.1': 'scrolled',
    'page.2': 'scrolled',
	'page.3': 'scrolled',
	'page.4': 'scrolled',
	'page.5': 'scrolled',
}).constant('backwardAnim', {
    'page.1': 'scrolled',
    'page.2': 'scrolled',
	'page.3': 'scrolled',
	'page.4': 'scrolled',
	'page.5': 'scrolled',
}).run(function($state) {
    $state.go('page.1');
})  .filter('HtmlContent', ['$sce', function ($sce) {
                           return function (text) {
                           return $sce.trustAsHtml(text);
                           };
                           }])

.filter('removeSpaces', [function() {
                         return function(string) {
                         if (!angular.isString(string)) {
                         return string;
                         }
                         return string.replace(/[\s]/g, '');
                         };
                         }]);
