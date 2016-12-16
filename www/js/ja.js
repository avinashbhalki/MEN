'use strict';
function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError('Cannot call a class as a function');
    }
}
var MovieSearchService = function () {
    function MovieSearchService(apiKey, $http, $q) {
        var _this = this;
        _classCallCheck(this, MovieSearchService);
        this.$q = $q;
        this.$http = $http;
        this.apiKey = apiKey;
        $http.jsonp('https://api.themoviedb.org/3/configuration?api_key=' + apiKey + '&callback=JSON_CALLBACK').success(function (data) {
            var conf = angular.fromJson(data);
            _this.baseUrl = conf.images.base_url + conf.images.poster_sizes[0];
            $http.jsonp('https://api.themoviedb.org/3/genre/movie/list?api_key=' + apiKey + '&callback=JSON_CALLBACK').success(function (data) {
                _this.genres = angular.fromJson(data);
            });
        });
    }
    MovieSearchService.prototype.movieFetch = function movieFetch(newImdbId, page) {
        var _this2 = this;
        return this.$q(function (resolve) {
            _this2.searching = true;
            _this2.imdbId = newImdbId;
            _this2.movie = null;
            _this2.$http.jsonp('https://api.themoviedb.org/3/search/movie?query=' + newImdbId + (page ? '&page=' + page : '') + '&api_key=' + _this2.apiKey + '&callback=JSON_CALLBACK').success(function (data) {
                _this2.searching = false;
                resolve(angular.fromJson(data).results);
            });
        });
    };
    return MovieSearchService;
}();




var MainController = function MainController($scope, $rootScope, $element, $http, $q, movieSearch, forwardAnim, backwardAnim) {
    var _this3 = this;
    _classCallCheck(this, MainController);
    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState) {
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
	
    this.movieSearch = movieSearch;
    $rootScope.mainScope = $scope;
};




var MoviesListController = function () {
    function MoviesListController($rootScope, $scope, $timeout, $element, $stateParams, resolvedResults, movieSearch) {
        _classCallCheck(this, MoviesListController);
        this.$timeout = $timeout;
        this.page = 1;
        this.movieSearch = movieSearch;
        this.$stateParams = $stateParams;
        this.$rootScope = $rootScope;
        if (resolvedResults) {
            $rootScope.mainScope.results = resolvedResults;
        }
        if ($stateParams.q && $stateParams.fetchAfter == 'true') {
            $timeout(function () {
                $rootScope.mainScope.results = [];
            });
            $element[0].addEventListener('transitionend', function (event) {
                movieSearch.movieFetch($stateParams.q).then(function (data) {
                    $rootScope.mainScope.results = data;
                });
            }, false);
        }
    }
    MoviesListController.prototype.loadMore = function loadMore() {
        var _this4 = this;
        this.page++;
        this.movieSearch.movieFetch(this.$stateParams.q, this.page).then(function (data) {
            _this4.$timeout(function () {
                _this4.$rootScope.mainScope.results = _this4.$rootScope.mainScope.results.concat(data);
            });
        });
    };
    return MoviesListController;
}();
var MovieDetailsController = function MovieDetailsController($scope, $rootScope, $stateParams, movieSearch) {
    _classCallCheck(this, MovieDetailsController);
    this.baseUrl = movieSearch.baseUrl;
    this.movie = $rootScope.mainScope.results[$stateParams.movieIndex];
};
var MovieController = function MovieController() {
    _classCallCheck(this, MovieController);
    switch (this.movie.original_language) {
    case 'en':
        this.language = 'english';
        break;
    case 'fr':
        this.language = 'french';
        break;
    }
    if (this.movie.origin_country) {
        this.country = this.movie.origin_country[0];
    }
};
angular.module('scrollDemo', [
    'ui.router',
    'ngAnimate'
]).config(function ($stateProvider) {
    $stateProvider.state('page', {
        template: '<ui-view class="page {{mainCtrl.anim}}"></ui-view>',
        url: '/page',
        controller: MainController,
        bindToController: true,
        controllerAs: 'mainCtrl'
    }).state('page.1', {
        url: '/page1',
        template: '<div id="page1">' + '<h1>Search movie</h1>' + '<form name="searchForm">' + '<label for="imdbId">Title</label>' + '<input id="imdbId" type="text" ng-model="mainCtrl.imdbId" required>' + '<input value="Fetch before" ui-sref="page.2({q:mainCtrl.imdbId,fetchAfter:false})" type="submit" ng-disabled="searchForm.$invalid" >' + '<input value="Fetch after" ui-sref="page.2({q:mainCtrl.imdbId,fetchAfter:true})" type="submit" ng-disabled="searchForm.$invalid">' + '</form>' + '<div ng-show="mainCtrl.movieSearch.searching"><br>Searching for {{mainCtrl.imdbId}}...</div><br>' + '<a ng-if="mainCtrl.results" ui-sref="page.2">&gt; See latest results</a>'
    }).state('page.2', {
        url: '/page2?:q&:fetchAfter',
        controller: MoviesListController,
        bindToController: true,
        controllerAs: 'moviesList',
        resolve: {
            resolvedResults: function resolvedResults($stateParams, $rootScope, movieSearch) {
                var resolved;
                if ($stateParams.q && $stateParams.fetchAfter == 'false') {
                    resolved = movieSearch.movieFetch($stateParams.q);
                } else {
                    resolved = null;
                }
                return resolved;
            }
        },
        template: '<div id="page2">' + '<h1>Movies with "{{mainCtrl.imdbId}}"</h1>' + '<a ui-sref="page.1">&lt; back to search form</a>' + '<div ng-show="moviesList.movieSearch.searching"><br>Searching for {{mainCtrl.imdbId}}...</div>' + '<ul>' + '<li ng-repeat="movie in results">' + '<a ui-sref="page.3({movieIndex:$index})">{{movie.title}}</a>' + '</li>' + '</ul>' + '<a ng-click="moviesList.loadMore()" href="">Load more</a>' + '</div>'
    }).state('page.3', {
        url: '/page3?:movieIndex',
        controller: MovieDetailsController,
        bindToController: true,
        controllerAs: 'movieDetails',
        template: '<div id="page3">' + '<div type="movie" base-url="{{movieDetails.baseUrl}}" movie="movieDetails.movie"></div>' + '<a ui-sref="page.2">&lt; Back to results</a>' + '</div>'
    });
}).constant('forwardAnim', {
    'page.1': 'scrolled',
    'page.2': 'scrolled',
    'page.3': 'modal'
}).constant('backwardAnim', {
    'page.1': 'scrolled',
    'page.2': 'modal',
    'page.3': 'modal'
}).constant('apiKey', '85742234b113e49d844e10dbb9471f6c').service('movieSearch', MovieSearchService).directive('movie', function () {
    return {
        restrict: 'A',
        scope: {
            movie: '=',
            type: '@',
            baseUrl: '@'
        },
        template: '<span ng-show="movieCtrl.movie.title || movieCtrl.movie.name">' + '<h1>{{movieCtrl.movie.title || movieCtrl.movie.name}}</h1>' + '<img ng-if="movieCtrl.movie.poster_path" ng-src="{{movieCtrl.baseUrl}}{{movieCtrl.movie.poster_path}}"> ' + '("{{movieCtrl.movie.original_title || movieCtrl.movie.original_name}}", {{movieCtrl.movie.release_date || movieCtrl.movie.first_air_date}}, {{movieCtrl.country}}), ' + 'a {{movieCtrl.language}} {{movieCtrl.genre}} {{movieCtrl.type}}' + '<span class="plot" ng-show="movieCtrl.movie.overview"> : {{movieCtrl.movie.overview}}</span>' + '</span>',
        bindToController: true,
        controllerAs: 'movieCtrl',
        controller: MovieController
    };
}).run(function ($state) {
    $state.go('page.1');
});